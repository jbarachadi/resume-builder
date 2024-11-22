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

def convert_to_json_builder(input_text):
    data = {
        "basics": {
            "name": "",
            "email": "",
            "phone": "",
            "headline": "",
            "location": ""
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

    def process_section(section_name, instruction):
        prompt = f"""
        Translate the following resume text into exactly this Python Dict format for the '{section_name}' section:
        {instruction}"""
        prompt += f"""Take exactly what is present in the Summary or Description or Introduction or Objective and return it as a Python Dict. If the text does not contain any field that represents the summary, generate a small paragraph that responds to this purpose""" if section_name == "summary" else f""""""
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

        print(cleaned_data)

        try:
            return cleaned_data
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

    for section_name, instruction in data.items():
        print(f"Processing section: {section_name}")
        processed = process_section(section_name, instruction)

        if section_name == "basics":
            result["basics"] = processed
        else:
            result["sections"][section_name] = processed

    # prompt = f"""I need to translate this text into this JSON format, make sure the format is JSON valid and can be interpreted by json.loads(). Provide me with only the JSON as text format and nothing else, remove the ```json. The name in the basics objects must always contain the name of the resume holder. The headline in the basics object should contain the current job title. The location in the basics object should be filled if available, if not fill it with the location of the latest job, if not keep empty. The skill name should never be a list of multiple elements, keep it granular. Fill missions list in experience object with responsabilities taken during the job. The summary section must contain the summary if available. If no language is provided, add the language in which the resume is written. If there are a specific type of skills (ex: Computer Skills, Areas of strength, Soft Skills) add them to the skills sections. Make sure anything relevant to skills is being added to the skills list :
    # Text: {input_text}
    # JSON format: {data}"""

    # response = openai.ChatCompletion.create(
    #     model="gpt-3.5-turbo",
    #     temperature=0.3,
    #     max_tokens=2048,
    #     messages=[
    #         {"role": "system", "content": "You are a helpful assistant that converts the input into the output format based on the format given."},
    #         {"role": "user", "content": prompt}
    #     ]
    # )

    #return response.choices[0].message['content']

    return result

def convert_to_json(input_text):
    data = {
        "basics": {
            "name": "",
            "email": "",
            "phone": "",
            "headline": "",
            "location": ""
        },
        "sections": {
            "skills": {
                "name": "Skills",
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
                "name": "Summary",
                "content": "",
                "visible": True
            },
            "profiles": {
                "name": "Profiles",
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
                "name": "Projects",
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
                "items": [
                    {
                        "name": "",
                        "keywords": []
                    }
                ]
            },
            "languages": {
                "name": "Languages",
                "items": [
                    {
                        "name": "",
                        "level": 0,
                        "description": ""
                    }
                ]
            },
            "volunteer": {
                "name": "Volunteering",
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
                        "organization": ""
                    }
                ]
            },
            "experience": {
                "name": "Experience",
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
                        "position": ""
                    }
                ]
            },
            "references": {
                "name": "References",
                "items": [
                    {
                        "url": {
                            "href": "",
                            "label": ""
                        },
                        "name": "",
                        "summary": "",
                        "description": ""
                    }
                ],
                "visible": True,
                "separateLinks": True
            },
            "publications": {
                "name": "Publications",
                "items": [
                    {
                        "url": {
                            "href": "",
                            "label": ""
                        },
                        "date": "",
                        "name": "",
                        "summary": "",
                        "publisher": ""
                    }
                ]
            },
            "certifications": {
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
                        "summary": ""
                    }
                ]
            },
            "awards": {
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
                    }
                ]
            },
            "education": {
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
                    }
                ]
            }
        }
    }

    prompt = f"""I need to translate this text into this JSON format, make sure the format is JSON valid and can be interpreted by json.loads(). Provide me with only the JSON as text format and nothing else, remove the ```json. The name in the basics objects must always contain the name of the resume holder. The headline in the basics object should contain the current job title. The location in the basics object should be filled if available, if not fill it with the location of the latest job, if not keep empty. The skill name should never be a list of multiple elements, keep it granular. Fill missions list in experience object with responsabilities taken during the job. The summary section must contain the summary if available. If no language is provided, add the language in which the resume is written. If there are a specific type of skills (ex: Computer Skills, Areas of strength, Soft Skills) add them to the skills sections. Make sure anything relevant to skills is being added to the skills list :

    Text: {input_text}
    JSON format: {data}"""

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        temperature=0.3,
        max_tokens=2048,
        messages=[
            {"role": "system", "content": "You are a helpful assistant that converts the input into the output format based on the format given."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message['content']

@app.route('/generate_json', methods=['POST'])
def generate_json():
    input_text = request.get_json()["extracted_text"]
    return convert_to_json(input_text)

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
    return response.choices[0].message['content']

@app.route('/process_resume/', methods=['POST'])
def process_resume():
    data = request.get_json()
    resume_text = data.get('resume_text', '')[:16000]
    job_description = data.get('job_description', '')

    if not resume_text or not job_description:
        return jsonify({'error': 'Resume text and job description are required.'}), 400

    # Get the missing skills from the API
    missing_skills_json = get_missing_skills(resume_text, job_description)
    print(missing_skills_json)
    missing_skills_json = missing_skills_json.replace(
        '```json', '').replace('```', '')
    # Parse the JSON response
    try:
        parsed_response = json.loads(missing_skills_json)
        return jsonify(parsed_response)
    except json.JSONDecodeError:
        logging.error(
            "Error decoding the response. Ensure the API returns a valid JSON.")
        return jsonify({"error": "Invalid JSON response from OpenAI API.", "response": missing_skills_json}), 500

# Function to extract text from DOCX, preserving the order of paragraphs and tables
def extract_text_from_docx(file_path):
    text = ""
    try:
        doc = docx.Document(file_path)

        # Extract text from paragraphs in order
        paragraphs = []
        for para in doc.paragraphs:
            paragraphs.append(para.text)

        # Extract text from tables in order and insert them at the appropriate position
        tables = []
        for table in doc.tables:
            table_text = "\n[Table Start]\n"
            for row in table.rows:
                for cell in row.cells:
                    table_text += cell.text + "\n"
            table_text += "[Table End]\n"
            tables.append(table_text)

        # Now interleave paragraphs and tables to maintain the order
        # Let's first add all paragraphs (e.g., declaration, personal information, etc.)
        text += "\n".join(paragraphs) + "\n"

        # Then add the tables in the order they were extracted
        # Here we ensure that table text comes right after paragraphs
        text += "\n".join(tables)  # Add tables after paragraphs

    except Exception as e:
        app.logger.error(f"Error extracting text from DOCX: {e}")
    return text

# Function to extract text from PDF (text-based)
def extract_text_from_pdf(file_path):
    try:
        return extract_text(file_path)  # Using pdfminer to extract text from the PDF
    except Exception as e:
        app.logger.error(f"Error extracting text from PDF: {e}")
        return ""

# OCR-based text extraction for image-based PDFs
def extract_text_from_image_pdf(file_path):
    text = ""
    try:
        images = convert_from_path(file_path, first_page=1, last_page=1)
        for image in images:
            text += pytesseract.image_to_string(image)
    except Exception as e:
        app.logger.error(f"Error extracting text from image-based PDF: {e}")
    return text

# Function to handle both file types and extract full text
def extract_full_text_from_file(file_path):
    file_extension = file_path.lower().split('.')[-1]
    if file_extension == 'pdf':
        text = extract_text_from_pdf(file_path)
        if not text.strip():  # Try OCR if text extraction fails
            app.logger.info("No text found in PDF, attempting OCR extraction.")
            text = extract_text_from_image_pdf(file_path)
    elif file_extension == 'docx':
        text = extract_text_from_docx(file_path)
    else:
        app.logger.error("Unsupported file type.")
        return "Unsupported file type."
    return text

# Endpoint for file upload and OCR/text extraction
@app.route('/resume_builder', methods=['POST'])
def resume_builder():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    job_description = request.form.get("job_description")

    file_path = os.path.join(tempfile.gettempdir(), secure_filename(file.filename))
    file.save(file_path)
    extracted_text = extract_full_text_from_file(file_path)
    converted_text = convert_to_json_builder(extracted_text)
    resume_json = converted_text
    # try:
    #     resume_json = json.loads(converted_text)
    # except Exception as e:
    #     app.logger.error(str(e))
    #     resume_json = converted_text
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


# Endpoint for file upload and OCR/text extraction
@app.route('/upload_file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    job_description = request.form.get("job_description")

    file_path = os.path.join(tempfile.gettempdir(), secure_filename(file.filename))
    file.save(file_path)
    extracted_text = extract_full_text_from_file(file_path)
    converted_text = convert_to_json(extracted_text)
    try:
        resume_json = json.loads(converted_text)
    except Exception as e:
        app.logger.error(str(e))
        resume_json = converted_text
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
    return jsonify(resume_json), 200

# Endpoint for getting suggestions from OpenAI API
@app.route('/get_suggestions', methods=['POST'])
def get_suggestions():
    data = request.get_json()
    resume_text = data.get('resume_text', '')
    job_description = data.get('job_description', '')

    if not resume_text or not job_description:
        return jsonify({'error': 'Resume text and job description are required.'}), 400

    prompt = f"""I have a resume and a job description. Identify missing skill sets from the job description that are not covered in the resume, and provide multiple sentences for each missing skill.

    Resume: {resume_text}
    Job Description: {job_description}"""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": "You are a helpful assistant."},
                      {"role": "user", "content": prompt}]
        )
        suggestions = response.choices[0].message['content']
        return jsonify({'suggestions': suggestions}), 200
    except Exception as e:
        app.logger.error(f"Error getting suggestions from OpenAI: {e}")
        return jsonify({'error': str(e)}), 500

# Root endpoint for serving the index page
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5050', debug=True)
