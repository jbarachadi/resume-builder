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
import re

load_dotenv()

openai.api_key = "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"

app = Flask(__name__)
CORS(app)

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
                        "level": 3,
                        "description": "",
                        "visible": True
                    }
                ]
            },
            "current_skills": {
                "name": "Current Skills",
                "items": [
                    {
                        "name": "",
                        "level": 3,
                        "description": "",
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
                        "level": "",
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
    }

    prompt = f"""I need to translate this text into this JSON format. Provide me with only the JSON as text format and nothing else, remove the ```json :

    Text: {input_text}
    JSON format: {data}"""

    response = openai.ChatCompletion.create(
        model="gpt-4o",
        temperature=0.3,
        max_tokens=2048,
        messages=[
            {"role": "system", "content": "You are a helpful assistant that converts the input into the output format based on the format given."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message['content']

    # Extract basics
    try:
        data["basics"]["name"] = re.search(r"^(.+?)\s*\n", input_text).group(1)
    except Exception as e:
        print(str(e))
    
    try:
        data["basics"]["email"] = re.search(r"Email ID\s*:\s*(\S+)", input_text).group(1)
    except Exception as e:
        print(str(e))
    
    try:
        data["basics"]["phone"] = re.search(r"\+91\s*\d{10}", input_text).group(0)
    except Exception as e:
        print(str(e))

    # Extract summary    
    try:
        summary_match = re.search(r"Objective:\s*\n\n(.+?)\n\nSkills:", input_text, re.DOTALL)
        if summary_match:
            data["sections"]["summary"]["content"] = f"<p>{summary_match.group(1).strip()}</p>"
    except Exception as e:
        print(str(e))

    # Extract skills
    try:
        skills_match = re.search(r"Skills:\s*\n\n(.+?)\n\nSummary:", input_text, re.DOTALL)
        if skills_match:
            skills = re.findall(r"\s+(.+)", skills_match.group(1))
            data["sections"]["skills"]["items"] = [{"name": skill.strip(), "level": 3, "description": "", "visible": True} for skill in skills]
    except Exception as e:
        print(str(e))
    
    # Extract work experience
    try:        
        experience_match = re.search(r"Work Experience:\s*\n\n(.+?)\n\nAchievements & Training:", input_text, re.DOTALL)
        if experience_match:
            experiences = re.split(r"\n\n", experience_match.group(1))
            for exp in experiences:
                date_match = re.search(r"From\s+(.+?)\sto\s+(.+?)\.", exp)
                company_match = re.search(r"Working with (.+?)\s", exp)
                position_match = re.search(r"(Sr\..+?)\s", exp)
                if date_match and company_match and position_match:
                    data["sections"]["experience"]["items"].append({
                        "company": company_match.group(1),
                        "date": f"{date_match.group(1)} to {date_match.group(2)}",
                        "summary": f"<p>{exp.strip()}</p>",
                        "position": position_match.group(1),
                        "location": ""
                    })
    except Exception as e:
        print(str(e))

    # Extract achievements and training
    try:    
        certifications_match = re.search(r"Achievements & Training:\s*\n\n(.+?)(?:\n\n|$)", input_text, re.DOTALL)
        if certifications_match:
            certifications = [cert.strip() for cert in re.split(r"\n\n", certifications_match.group(1)) if cert.strip()]
            for cert in certifications:
                data["sections"]["certifications"]["items"].append({
                    "title": cert.strip(),
                    "date": "",
                    "issuer": "",
                    "url": {"href": "", "label": ""}
                })
    except Exception as e:
        print(str(e))
    
    # Extract education
    try:       
        education_match = re.search(r"Education:\s*\n\n(.+?)(?:\n\n|$)", input_text, re.DOTALL)
        if education_match:
            education_lines = education_match.group(1).split("\n")
            for line in education_lines:
                institution_match = re.search(r"from (.+?) with", line)
                study_type_match = re.search(r"Master’s \((.+?)\)", line)
                if institution_match and study_type_match:
                    data["sections"]["education"]["items"].append({
                        "institution": institution_match.group(1),
                        "studyType": study_type_match.group(1),
                        "area": "",
                        "date": "",
                        "summary": "",  
                        "score": "",
                        "url": {"href": "", "label": ""}
                    })
    except Exception as e:
        print(str(e))

    return json.dumps(data, indent=4)

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

# Function to extract text from DOCX
def extract_text_from_docx(file_path):
    text = ""
    try:
        doc = docx.Document(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
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
    resume_json = json.loads(convert_to_json(extracted_text))
    skills_to_add = list(resume_json["sections"]["skills"]["items"])
    missing_skills = json.loads(get_missing_skills(extracted_text, job_description))["missing_skills"]
    missing_skills_to_add = []
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
    
    resume_json["sections"]["current_skills"]["items"] = resume_json["sections"]["skills"]["items"]
    resume_json["sections"]["skills"]["items"] = skills_to_add
    resume_json["sections"]["missing_skills"]["items"] = missing_skills_to_add
    return jsonify(resume_json), 200
    #return jsonify({'extracted_text': extracted_text}), 200

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
