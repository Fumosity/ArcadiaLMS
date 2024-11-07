# main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image
import pytesseract
import io
import fitz  # PyMuPDF for PDF handling
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample data for SVM model (titles, authors, etc.)
data = [
    ("A KNN-based Text Classifier", "title"),
    ("Artificial Intelligence in Healthcare", "title"),
    ("Alexander A. Rubio, Fatima C. Eusebio", "authors"),
    ("This research explores the use of K-Nearest Neighbors in text classification tasks.", "abstract"),
    ("COLLEGE OF ENGINEERING, COMPUTER STUDIES, AND ARCHITECTURE", "college"),
]

texts = [text for text, label in data]
labels = [label for text, label in data]

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)
clf = SVC()
clf.fit(X, labels)

# Preprocessing functions
date_pattern = re.compile(r'^(January|February|March|...|December)\s+\d{4}')
excluded_sections = ["Approval Sheet", "Certificate of Originality", "Acknowledgement"]
resume_sections = ["Abstract", "Keywords"]

def find_department(line):
    # Define departments based on keywords
    if "computer science" in line:
        return "Department of Computer Studies"
    elif "information technology" in line:
        return "Department of Computer Studies"
    elif "library information science" in line:
        return "Department of Computer Studies"
    elif "architecture" in line:
        return "Department of Architecture"
    return ""

def preprocess_text(text):
    pub_date = None
    keywords = None
    department = ""
    lines = text.split("\n")
    cleaned_lines = []
    current_paragraph = []
    inside_excluded_section = False
    skip_current_paragraph = False

    for line in lines:
        line = line.strip()
        if date_pattern.match(line):
            pub_date = line
            continue
        line_lower = line.lower()
        if "bachelor of" in line_lower:
            department = find_department(line_lower)
        if line_lower.startswith("lyceum"):
            continue
        if line_lower.startswith("keywords"):
            keywords = re.sub(r'[^\w\s,]', '', line_lower).replace("keywords", "").strip()
            continue
        if inside_excluded_section:
            if any(resume_header.lower() in line_lower for resume_header in resume_sections):
                inside_excluded_section = False
                continue
            else:
                continue
        if any(excluded_header.lower() in line_lower for excluded_header in excluded_sections):
            inside_excluded_section = True
            continue
        if line_lower.startswith("in partial fulfillment") or line_lower.startswith("an undergraduate"):
            skip_current_paragraph = True
        if line:
            current_paragraph.append(line)
        else:
            if current_paragraph:
                cleaned_paragraph = " ".join(current_paragraph).strip()
                if not skip_current_paragraph:
                    cleaned_lines.append(cleaned_paragraph)
                current_paragraph = []
                skip_current_paragraph = False
    if current_paragraph:
        cleaned_lines.append(" ".join(current_paragraph))
    cleaned_text = "\n".join(cleaned_lines)
    cleaned_text = re.sub(r'[^\w\s.,\'"()—:;/]', '', cleaned_text).strip()
    return cleaned_text, pub_date, keywords, department

# Classification function
def classify_text_lines(text):
    lines = text.split("\n")
    title, abstract, authors, college = "", "", "", ""
    for i, line in enumerate(lines):
        features = vectorizer.transform([line])
        prediction = clf.predict(features)[0]
        if i == 0:
            title = line
            continue
        if prediction == "abstract":
            abstract += line + " "
        elif prediction == "authors":
            authors += line + ", "
        elif prediction == "college":
            college = line
    return title.strip(), abstract.strip(), authors.strip(), college.strip()

# Text extraction endpoint
@app.post("/extract-text/")
async def extract_text(files: List[UploadFile] = File(...)):
    try:
        total_text = ""
        total_pages = 0
        
        for file in files:
            if file.content_type == "application/pdf":
                pdf_text = ""
                pdf_data = await file.read()
                pdf_doc = fitz.open(stream=pdf_data, filetype="pdf")
                total_pages += pdf_doc.page_count
                for page_num in range(pdf_doc.page_count):
                    page = pdf_doc.load_page(page_num)
                    pdf_text += page.get_text("text")
                total_text += pdf_text + "\n\n"
            else:
                image = Image.open(io.BytesIO(await file.read()))
                text = pytesseract.image_to_string(image)
                total_text += text + "\n\n"
                total_pages += 1

        # Preprocess and classify text
        clean_text, pub_date, keywords, department = preprocess_text(total_text)
        title, abstract, authors, college = classify_text_lines(clean_text)

        print(f"""\n\n\n\n==========RESULTS===========
            \ntitle: {title}
            \npublication date: {pub_date}
            \nauthors: {authors}
            \ncollege: {college}
            \ndepartment: {department}
            \nabstract: {abstract}
            \nkeywords: {keywords}"""
            )
        
        return JSONResponse(content={
            "text": clean_text,
            "total_pages": total_pages,
            "title": title,
            "abstract": abstract,
            "authors": authors,
            "college": college,
            "department": department,
            "publication_date": pub_date,
            "keywords": keywords
        })
    
    except Exception as e:
        print("Error:", str(e))
        return JSONResponse(content={"error": str(e)}, status_code=500)
