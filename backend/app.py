from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import tempfile
import docx
from pdfminer.high_level import extract_text
from pdf2image import convert_from_path
import openai
import pytesseract
from werkzeug.utils import secure_filename
from pdf2docx import Converter
from dotenv import load_dotenv
import openai
import json
import logging
import ast

load_dotenv()

openai.api_key = "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"

app = Flask(__name__)
CORS(app)

os.environ['PATH'] += ':/usr/bin:/path/to/poppler/bin'
pytesseract.pytesseract.tesseract_cmd = '/usr/bin/tesseract'

def convert_to_json_builder(data, input_text):
    def process_section(section_name, instruction):
        prompt = f"""
        Translate the following resume text into exactly this Python Dict format for the '{section_name}' section :
        {instruction}"""
        prompt += f"""Take exactly what is present in the Summary or Description or Introduction or Objective and return it as a Python Dict unless it is more than a paragraph, in this case, make it more concise. If the text does not contain any field that represents the summary, generate a small paragraph that responds to this purpose""" if section_name == "summary" else f""""""
        prompt += f"""Make sure the summary of each experience is very concise, two or three senteces.""" if section_name == "experience" else f""""""
        prompt += f"""Make sure the name of the of each reference is different than the name of the resume holder. If none are found, leave the items empty.""" if section_name == "references" else f""""""
        prompt += f"""Make sure the skills are different from elements in the other sections, like certifications or languages. If none are found, leave the items empty.""" if section_name == "skills" else f""""""
        prompt += f"""Provide the Python Dict for only the '{section_name}' section without additional commentary keeping complete data integrity especially in experience missions. The output must absolutely be a valid Python Dict :
        Text: {input_text}
        """

        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            temperature=0.1,
            max_tokens=2048,
            messages=[
                {"role": "system", "content": "You are a helpful assistant. You are an expert in Python Dict formatting and in reading, making and reviewing resumes."},
                {"role": "user", "content": prompt}
            ]
        )

        output = response.choices[0].message['content'].replace("```json", "").replace("```python", "").replace("```", "")

        def clean_nested_json(value):
            if isinstance(value, str):
                try:
                    return ast.literal_eval(value)
                except json.JSONDecodeError:
                    return value
            elif isinstance(value, dict):
                return {k: clean_nested_json(v) for k, v in value.items()}
            elif isinstance(value, list):
                return [clean_nested_json(v) for v in value]
            return value

        cleaned_data = clean_nested_json(output)

        try:
            return cleaned_data, response.usage.prompt_tokens, response.usage.completion_tokens
        except json.JSONDecodeError:
            return f"Invalid JSON for section '{section_name}'. Please refine the input."

    result = {
        "basics": {
        },
        "sections": {
            "current_skills": {
                "name": "Current Skills",
                "items": [
                    {
                        "name": "",
                        "level": 3,
                        "visible": True
                    }
                ]
            },
            "missing_skills": {
                "name": "Missing Skills",
                "items": [
                    {
                        "name": "",
                        "level": 3,
                        "visible": True
                    }
                ]
            },
            "suggested_missions": {
                "name": "Suggested Missions",
                "items": [
                    ""
                ],
            },
        }
    }

    # input_sum = 0
    # output_sum = 0
    
    for section_name, instruction in data.items():
        processed, input_price, output_price = process_section(section_name, instruction)

        # input_sum += input_price / 1000 * 0.00015
        # output_sum += output_price / 1000 * 0.0006

        if section_name == "basics":
            result["basics"] = processed
        else:
            result["sections"][section_name] = processed
            items = processed.get("items", [])
            if len(items) == 1 and items[0].get("name", "").strip() == "":
                result["sections"][section_name]["items"] = []

    # print("Conversion Price :\n-  Input Total : " + str(input_sum) + "\n-  Output Total : " + str(output_sum) + "\n\n=  Total : " + str(input_sum + output_sum))

    return result

def get_missing_skills(resume_text, job_description):
    prompt = f""" I have a resume and a job description. Identify missing skill sets from the job description that are not covered in the resume, and provide multiple sentences for each missing skill that I can directly add to the "Projects" section of my resume.

    Please ensure that each sentence relates to a each skill missing from the job description and the project mentioned in the resume that is missing or not fully covered in the resume. Format the output strictly as JSON so that it can pass json.loads without error.
    so give me the sentences which will create a story of skills missing and should fit in the resume projects . analysis the project from resume and try to create sentence which after adding looks like its a part of project
    The output format should be:
    give always json response in mentioned format I have a resume and a job description. i want the sentence , which i can add to the projects mentioned in the resume .

        Provide the output in the following JSON format and do a detail research and give me data in enhanced form :

        "give me multiple sentences for each skills set  which i can add in the project which are missing give me the points , it should be in json like dictnory answer and should be sentence which i can add directly in the resume manually"
        for example output should be {{"missing_skills": "skill1": ["",""],"skill2": ["".""] }} like a list with all answers which will pass json.loads . dont give additional information   . only json answer dont add ```json also

    Resume: {resume_text}
    Job Description: {job_description}"""

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        temperature=0.3,
        max_tokens=2048,
        messages=[
            {"role": "system", "content": "You are a helpful assistant that provides suggestions for improving resumes based on job descriptions."},
            {"role": "user", "content": prompt}
        ]
    )

    # input_price = response.usage.prompt_tokens / 1000 * 0.0005
    # output_price = response.usage.completion_tokens / 1000 * 0.0015

    # print("Missing Skills and Missions Price :\n-  Input Total : " + str(input_price) + "\n-  Output Total : " + str(output_price) + "\n\n=  Total : " + str(input_price + output_price))

    return response.choices[0].message['content']

def extract_text_from_docx(file_path):
    text = ""
    try:
        doc = docx.Document(file_path)

        paragraphs = []
        for para in doc.paragraphs:
            paragraphs.append(para.text)

        tables = []
        for table in doc.tables:
            table_text = "\n[Table Start]\n"
            for row in table.rows:
                for cell in row.cells:
                    table_text += cell.text + "\n"
            table_text += "[Table End]\n"
            tables.append(table_text)

        text += "\n".join(paragraphs) + "\n"

        text += "\n".join(tables)

    except Exception as e:
        app.logger.error(f"Error extracting text from DOCX: {e}")
    return text

def extract_text_from_pdf(file_path):
    try:
        return extract_text(file_path)
    except Exception as e:
        app.logger.error(f"Error extracting text from PDF: {e}")
        return ""

def extract_text_from_image_pdf(file_path):
    text = ""
    try:
        images = convert_from_path(file_path, first_page=1, last_page=1)
        for image in images:
            text += pytesseract.image_to_string(image)
    except Exception as e:
        app.logger.error(f"Error extracting text from image-based PDF: {e}")
    return text

def extract_full_text_from_file(file_path):
    file_extension = file_path.lower().split('.')[-1]
    if file_extension == 'pdf':
        text = extract_text_from_pdf(file_path)
        if not text.strip():
            app.logger.info("No text found in PDF, attempting OCR extraction.")
            text = extract_text_from_image_pdf(file_path)
    elif file_extension == 'docx':
        text = extract_text_from_docx(file_path)
    else:
        app.logger.error("Unsupported file type.")
        return "Unsupported file type."
    return text

@app.route('/resume_builder', methods=['POST'])
def resume_builder():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    data = {
        "basics": {
            "name": "",
            "email": "",
            "phone": "",
            "headline": "",
            "location": "",
            "url": {
                "href": "",
                "label": ""
            },
            "picture": {
                "url": ""
            },
            "customFields": []
        },
        "skills": {
            "name": "Skills",
            "items": [
                {
                    "name": "",
                    "level": 3,
                    "visible": True
                }
            ]
        },
        "summary": {
            "name": "Summary",
            "content": "",
            "visible": True
        },
        "profiles": {
            "name": "Profiles",
            "items": [
                {
                    "name": "",
                    "url": {
                        "href": "",
                        "label": ""
                    }
                }
            ]
        },
        "projects": {
            "name": "Projects",
            "items": [
                {
                    "name": "",
                    "description": "",
                    "skills": [
                        ""
                    ]
                }
            ]
        },
        "interests": {
            "name": "Interests",
            "items": [
                {
                    "name": ""
                }
            ]
        },
        "languages": {
            "name": "Languages",
            "items": [
                {
                    "name": "",
                    "level": 0,
                    "proficiency": "100%"
                }
            ]
        },
        "volunteer": {
            "name": "Volunteering",
            "items": [
                {
                    "position": "",
                    "company": "",
                    "location": "",
                    "date": "",
                    "summary": "",
                    "visible": True
                }
            ]
        },
        "experience": {
            "name": "Experience",
            "items": [
                {
                    "position": "",
                    "company": "",
                    "location": "",
                    "date": "",
                    "summary": "",
                    "missions": [
                        ""
                    ],
                    "visible": True
                }
            ]
        },
        "references": {
            "name": "References",
            "items": [],
            "columns": 1,
            "visible": True,
            "separateLinks": True
        },
        "publications": {
            "name": "Publications",
            "items": [
                {
                    "name": "",
                    "description": "",
                    "issuer": "",
                    "date": "",
                    "url": {
                        "href": "",
                        "label": ""
                    }
                }
            ]
        },
        "certifications": {
            "name": "Certifications",
            "items": [
                {
                    "name": "",
                    "description": "",
                    "issuer": "",
                    "date": "",
                    "url": {
                        "href": "",
                        "label": ""
                    }
                }
            ]
        },
        "awards": {
            "name": "Awards",
            "items": [
                {
                    "name": "",
                    "description": "",
                    "issuer": "",
                    "date": ""
                }
            ]
        },
        "education": {
            "name": "Education",
            "items": [
                {
                    "institution": "",
                    "studyType": "",
                    "area": "",
                    "date": "",
                    "summary": "",
                    "score": "",
                    "url": {
                        "href": "",
                        "label": ""
                    }
                }
            ]
        }
    }

    job_description = request.form.get("job_description")

    file_path = os.path.join(tempfile.gettempdir(), secure_filename(file.filename))
    file.save(file_path)
    extracted_text = extract_full_text_from_file(file_path)
    resume_json = convert_to_json_builder(data, extracted_text)
    skills_to_add = list(resume_json["sections"]["skills"]["items"])
    missing_skills = json.loads(get_missing_skills(extracted_text, job_description))["missing_skills"]
    missing_skills_to_add = []
    suggested_missions_to_add = []
    for skill in missing_skills:
        skills_to_add.append({
            "name": skill,
            "level": 3,
            "description": "",
            "visible": True
        })
        missing_skills_to_add.append({
            "name": skill,
            "level": 3,
            "description": "",
            "visible": True
        })
        for item in missing_skills[skill]:
            suggested_missions_to_add.append(item)

    resume_json["sections"]["current_skills"]["items"] = resume_json["sections"]["skills"]["items"]
    resume_json["sections"]["skills"]["items"] = skills_to_add
    resume_json["sections"]["missing_skills"]["items"] = missing_skills_to_add
    resume_json["sections"]["suggested_missions"]["items"] = suggested_missions_to_add
    return jsonify(resume_json), 200


@app.route('/upload_file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    data = {
        "basics": {
            "name": "",
            "headline": "",
            "email": "",
            "phone": "",
            "location": "",
            "url": {
                "label": "",
                "href": "https://default"
            },
            "customFields": [],
            "picture": {
                "url": "",
                "size": 64,
                "aspectRatio": 1,
                "borderRadius": 0,
                "effects": {
                    "hidden": False,
                    "border": False,
                    "grayscale": False,
                },
            },
        },
        "skills": {
            "id": "skills",
            "name": "Skills",
            "columns": 1,
            "separateLinks": True,
            "visible": True,
            "items": [
                {
                    "name": "",
                    "level": 1,
                    "keywords": [],
                    "description": "",
                    "visible": True
                }
            ]
        },
        "summary": {
            "id": "summary",
            "name": "Summary",
            "content": "",
            "columns": 1,
            "separateLinks": True,
            "visible": True,
        },
        "profiles": {
            "id": "profiles",
            "name": "Profiles",
            "columns": 1,
            "separateLinks": True,
            "visible": True,
            "items": [
                {
                    "url": {
                        "href": "",
                        "label": ""
                    },
                    "icon": "",
                    "network": "",
                    "username": "",
                    "visible": True
                }
            ]
        },
        "projects": {
            "id": "projects",
            "name": "Projects",
            "columns": 1,
            "separateLinks": True,
            "visible": True,
            "items": [
                {
                    "url": {
                        "href": "",
                        "label": ""
                    },
                    "date": "",
                    "name": "",
                    "summary": "",
                    "keywords": [],
                    "description": "",
                    "visible": True
                }
            ]
        },
        "interests": {
            "name": "Interests",
            "id": "interests",
            "columns": 1,
            "separateLinks": True,
            "visible": True,
            "items": [
                {
                    "name": "",
                    "keywords": [],
                    "visible": True
                }
            ]
        },
        "languages": {
            "name": "Languages",
            "id": "languages",
            "columns": 1,
            "separateLinks": True,
            "visible": True,
            "items": [
                {
                    "name": "",
                    "level": 0,
                    "description": "",
                    "visible": True
                }
            ]
        },
        "volunteer": {
            "name": "Volunteering",
            "id": "volunteer",
            "columns": 1,
            "separateLinks": True,
            "visible": True,
            "items": [
                {
                    "url": {
                        "href": "",
                        "label": ""
                    },
                    "date": "",
                    "summary": "",
                    "location": "",
                    "position": "",
                    "organization": "",
                    "visible": True
                }
            ]
        },
        "experience": {
            "name": "Experience",
            "id": "experience",
            "columns": 1,
            "separateLinks": True,
            "visible": True,
            "items": [
                {
                    "url": {
                        "href": "",
                        "label": ""
                    },
                    "date": "",
                    "company": "",
                    "summary": "",
                    "location": "",
                    "position": "",
                    "visible": True
                }
            ]
        },
        "references": {
            "name": "References",
            "id": "references",
            "columns": 1,
            "separateLinks": True,
            "visible": True,
            "items": [
                {
                    "url": {
                        "href": "",
                        "label": ""
                    },
                    "name": "",
                    "summary": "",
                    "description": "",
                    "visible": True
                }
            ],
            "visible": True,
            "separateLinks": True
        },
        "publications": {
            "name": "Publications",
            "id": "publications",
            "columns": 1,
            "separateLinks": True,
            "visible": True,
            "items": [
                {
                    "url": {
                        "href": "",
                        "label": ""
                    },
                    "date": "",
                    "name": "",
                    "summary": "",
                    "publisher": "",
                    "visible": True
                }
            ]
        },
        "certifications": {
            "id": "certifications",
            "columns": 1,
            "separateLinks": True,
            "visible": True,
            "name": "Certifications",
            "items": [
                {
                    "url": {
                        "href": "",
                        "label": ""
                    },
                    "date": "",
                    "name": "",
                    "issuer": "",
                    "summary": "",
                    "visible": True
                }
            ]
        },
        "awards": {
            "id": "awards",
            "columns": 1,
            "separateLinks": True,
            "visible": True,
            "name": "Awards",
            "items": [
                {
                    "url": {
                        "href": "",
                        "label": ""
                    },
                    "date": "",
                    "title": "",
                    "awarder": "",
                    "summary": "",
                    "visible": True
                }
            ]
        },
        "education": {
            "id": "education",
            "columns": 1,
            "separateLinks": True,
            "visible": True,
            "name": "Education",
            "items": [
                {
                    "url": {
                        "href": "",
                        "label": ""
                    },
                    "area": "",
                    "date": "",
                    "score": "",
                    "summary": "",
                    "studyType": "",
                    "institution": "",
                    "visible": True
                }
            ]
        }        
    }

    job_description = request.form.get("job_description")

    file_path = os.path.join(tempfile.gettempdir(), secure_filename(file.filename))
    file.save(file_path)
    extracted_text = extract_full_text_from_file(file_path)
    resume_json = convert_to_json_builder(data, extracted_text)
    skills_to_add = list(resume_json["sections"]["skills"]["items"])
    missing_skills = json.loads(get_missing_skills(extracted_text, job_description))["missing_skills"]
    for skill in missing_skills:
        skills_to_add.append({
            "name": skill,
            "level": 3,
            "keywords": [],
            "description": "",
            "visible": True
        })

    resume_json["sections"]["skills"]["items"] = skills_to_add
    resume_json["sections"]["custom"] = {}
    return jsonify(resume_json), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5050', debug=True)
