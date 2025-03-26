from fastapi import FastAPI, File, UploadFile, Query
from fastapi.responses import JSONResponse
from PIL import Image
import pytesseract
import cv2
import io
import fitz 
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import re
import joblib
from datetime import datetime
import numpy as np
import pandas as pd
from pydantic import BaseModel
import math

from app.book_reco import get_recommendations
from app.research_reco import get_rsrch_recommendations

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
import os
print("Current Working Directory:", os.getcwd())

excluded_sections = ["Approval Sheet", "Certificate of Originality", "Acknowledgement", "Table of Contents", "Access Leaf", "Acceptance Sheet", "Author Permission Statement", "List of Tables", "List of Figures", "List of Appendices", "List of Abbreviations"]
resume_sections = ["Abstract", "Keywords"]

title, authors, college, department, abstract, keywords, pubdate = "","","","","","","",

def find_department(line):
    if "computer science" in line:
        return "DCS"
    if "information technology" in line:
        return "DCS"
    if "library information science" in line:
        return "DCS"
    if "architecture" in line:
        return "DOA"
    if "engineering" in line:
        return "DOE"

def remove_sections(text):
    lines = text.split("\n")

    cleaned_lines = []
    original_lines = []
    current_paragraph = []
    original_paragraph = []
    inside_excluded_section = False
    skip_current_paragraph = False
    apply_period_joining = False 
    is_keywords_section = False 

    number_only_pattern = re.compile(r'^\d+$')
    added_lines = set() 

    for line in lines:
        original_line = line
        line = line.strip()

        if number_only_pattern.match(line): # skip page numbers
            continue
        
        line_lower = line.lower() # lowercase all

        if "bachelor of" in line_lower:
            department = find_department(line_lower) # find department 

        if line_lower.startswith("lyceum"): # skip header
            continue

        if line_lower.startswith("in partial fulfillment") or line_lower.startswith("an undergraduate"): # title page
            skip_current_paragraph = True

        if line in added_lines:
            continue

        # see if excluded section
        if any(excluded_header.lower() in line_lower for excluded_header in excluded_sections):
            print("SKIPPING SECTION", line_lower)
            inside_excluded_section = True
            continue

        # resume if included sectin
        if any(resume_header.lower() in line_lower for resume_header in resume_sections):
            print("RESUMING SECTION", line_lower)
            inside_excluded_section = False
            apply_period_joining = True

            # keyword handling
            if "keywords" in line_lower:
                is_keywords_section = True
                if current_paragraph:
                    cleaned_lines.append(" ".join(current_paragraph).strip())
                    original_lines.append(" ".join(original_paragraph).strip())

                    current_paragraph = []
                    original_paragraph = []

                cleaned_lines.append(line)  
                original_lines.append(original_line)
                continue
            else:
                is_keywords_section = False
                continue

        # skip exclude
        if inside_excluded_section:
            continue

        if line:
            if is_keywords_section:
              
                if current_paragraph:
                    cleaned_lines.append(" ".join(current_paragraph).strip())
                    original_lines.append(" ".join(original_paragraph).strip())
                    current_paragraph = []
                    original_paragraph = []
                cleaned_lines.append(line)
                original_lines.append(original_line)
                added_lines.add(line)
                continue

            current_paragraph.append(line)
            original_paragraph.append(original_line)
            added_lines.add(line)
        else:
            if current_paragraph:
                cleaned_paragraph = " ".join(current_paragraph).strip()
                original_paragraph_text = " ".join(original_paragraph).strip()

                if not skip_current_paragraph:
                    if apply_period_joining and cleaned_lines and cleaned_lines[-1] and '.' in cleaned_lines[-1]:
                        cleaned_lines[-1] += " " + cleaned_paragraph
                        original_lines[-1] += " " + original_paragraph_text
                    else:
                        cleaned_lines.append(cleaned_paragraph)
                        original_lines.append(original_paragraph_text)
                
                current_paragraph = []
                original_paragraph = []
                skip_current_paragraph = False

    if current_paragraph:
        if apply_period_joining and cleaned_lines:
            cleaned_lines[-1] += " " + ". ".join(current_paragraph)
            original_lines[-1] += " " + ". ".join(original_paragraph)

        else:
            cleaned_lines.append(" ".join(current_paragraph))
            original_lines.append(" ".join(original_paragraph))

    presectioned_text = "\n\n".join(cleaned_lines)
    original_text = "\n\n".join(original_lines)

    presectioned_text = re.sub(r'[^\w\s.,\'"()-—:;/]', '', presectioned_text).strip()

    # return both the cleaned text and original
    return presectioned_text, original_text, department

def preprocess_text(text):
    lines = text.splitlines()
    
    cleaned_lines = []
    for line in lines:
        # remove extra whitespace and lowercase the line
        cleaned_line = re.sub(r"[^\w\s.,'\"()-—:;/]", "", line).strip().lower()
        
        if cleaned_line:
            cleaned_lines.append(cleaned_line)
    
    cleaned_text = "\n\n".join(cleaned_lines)

    return cleaned_text

def replace_college_names(college_name):
  college_name = proper_case(college_name)

  acronym_map = {
      "Allied Medical Sciences": "CAMS",
      "Liberal Arts and Education": "CLAE",
      "Business Administration": "CBA",
      "Engineering, Computer Studies, and Architecture": "COECSA",
      "Fine Arts and Design": "CFAD",
      "International Tourism and Hospitality Management": "CITHM",
      "Nursing": "CON",
      "Law": "COL"
  }

  # check if the college name is a key in the acronym map
  if college_name in acronym_map:
    return acronym_map[college_name]

  # check if the college name contains a key in the acronym map
  for key in acronym_map:
    if key in college_name:
      return acronym_map[key]

  return college_name

def convert_date(date_str):
    formats = ["%B %Y", "%b %Y", "%m/%Y", "%Y-%m"]  # Full month, abbreviated month, numeric month, ISO format
    for fmt in formats:
        try:
            month_year = datetime.strptime(date_str, fmt)
            return month_year.strftime("%Y-%m")  # Standardized output
        except:
            return None

def proper_case(name):
    lower_case_words = {
        "a", "an", "and", "but", "or", "for", "nor", "so", "the", "to", "up", "in", "on", 
        "at", "by", "with", "as", "of", "from", "about", "between", "during", "into", "through", "over", "under", "within", "is", "are", "was", "were", "be", "been", "being"
    }
    
    words = name.split()
    
    for i in range(len(words)):
        if i == 0 or words[i].lower() not in lower_case_words:
            words[i] = words[i].capitalize()
        else:
            words[i] = words[i].lower()
    
    return ' '.join(words)

def format_authors(authors_text):

    authors_text = re.sub(r'\s+', ' ', authors_text.strip())
    words = authors_text.split(" ")

    formatted_authors = []
    current_author = []

    for i, word in enumerate(words):
        current_author.append(word)

        if i > 0 and re.match(r'^[A-Z]\.$', words[i-1]):
            formatted_authors.append(" ".join(current_author).strip())
            current_author = []

    if current_author:
        formatted_authors.append(" ".join(current_author).strip())

    return "; ".join(formatted_authors)

def classify_text_chunks(preprocessed_text, original_text, pipeline):
    preprocessed_chunks = preprocessed_text.split("\n\n")
    original_chunks = original_text.split("\n\n")

    assert len(preprocessed_chunks) == len(original_chunks), "Mismatch between preprocessed and original text chunks"

    classified_sections = {label: "" for label in ['title', 'authors', 'college', 'abstract', 'keywords', 'pubdate']}

    for i, chunk in enumerate(preprocessed_chunks):
        # reshape chunk to 2d arr (1 sample, 1 feature)
        chunk_reshaped = np.array([chunk]).reshape(-1, 1)  # ensures a 2D shape (1, 1)

        # calc the length of the chunk
        text_length = np.array([[len(chunk)]])

        # combine chunk and chunk len as arr of featrues
        combined_features = np.hstack([chunk_reshaped, text_length])

        # convert to dataframe
        df_features = pd.DataFrame(combined_features, columns=['text', 'text_length'])

        # transform with tfidf and text len and predict label
        predicted_section = pipeline.predict(df_features)[0]
        
        # append the chunk to the classified section
        classified_sections[predicted_section] += original_chunks[i].strip() + " "

    print("=====Initial Classification=====")
    for section, content in classified_sections.items():
        print(f"{section.capitalize()}: {content.strip()}\n")

    # assign classified sections to respective variables
    title = classified_sections.get('title', "").strip()
    authors = classified_sections.get('authors', "").strip()
    college = classified_sections.get('college', "").strip()
    abstract = classified_sections.get('abstract', "").strip()
    keywords = classified_sections.get('keywords', "").strip()
    pubdate = classified_sections.get('pubdate', "").strip()

    return title, authors, college, abstract, keywords, pubdate    

# Load the trained model
pipeline = joblib.load("app/text_classifier_svm.pkl")

@app.post("/extract-text/")
async def extract_text(files: List[UploadFile] = File(...)):
    try:
        total_text = ""
        total_pages = 0

        for file in files:
            file_text = ""

            if file.content_type == "application/pdf":
                pdf_data = await file.read()
                pdf_doc = fitz.open(stream=pdf_data, filetype="pdf")
                print(f"Processing file: {file.filename}, type: {file.content_type}")

                total_pages += pdf_doc.page_count

                for page_num in range(min(15, pdf_doc.page_count)):
                    page = pdf_doc[page_num]
                    pix = page.get_pixmap(dpi=300)
                    img = Image.open(io.BytesIO(pix.tobytes("png")))
                    img_cv = np.array(img)  # Convert PIL to NumPy
                    img_cv = cv2.cvtColor(img_cv, cv2.COLOR_RGB2GRAY)  # Convert to grayscale
                    img_cv = cv2.GaussianBlur(img_cv, (3, 3), 0)  # Reduce noise
                    _, img_cv = cv2.threshold(img_cv, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)  # Binarization

                    page_text = pytesseract.image_to_string(img_cv, lang='eng')


                    file_text += page_text + "\n\n"

            else:
                image = Image.open(io.BytesIO(await file.read()))
                img_cv = np.array(image)  # Convert PIL image to NumPy array
                img_cv = cv2.cvtColor(img_cv, cv2.COLOR_RGB2GRAY)  # Convert to grayscale
                img_cv = cv2.GaussianBlur(img_cv, (3, 3), 0)  # Apply Gaussian Blur
                _, img_cv = cv2.threshold(img_cv, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)  # Binarization

                text = pytesseract.image_to_string(img_cv, lang='eng')

                file_text += text + "\n\n"
                total_pages += 1

            total_text += file_text + "\n\n"

        # Preprocess and classify text
        presectioned_text, original_text, department = remove_sections(total_text)
        cleaned_text = preprocess_text(presectioned_text)

        print("\n====TOTAL TEXT====\n", total_text)
        print("\n====PRESECTIONED TEXT====\n", presectioned_text)
        print("\n====CLEANED TEXT====\n", cleaned_text)

        # Use the trained pipeline to classify the text
        title, authors, college, abstract, keywords, pubdate = classify_text_chunks(cleaned_text, original_text, pipeline)

        # Post-processing
        keywords_pattern = re.compile(r'\b(keywords?|key words?)\b', re.IGNORECASE)
        if keywords_pattern.search(title):
            title, keywords = keywords, title

        keywords = re.sub(r'\b(keywords?|key words?)\b.*?(?:—|:)?\s*', '', keywords, flags=re.IGNORECASE).strip()
        authors = format_authors(authors)
        college = replace_college_names(college)
        print("pre-error", pubdate)
        pubdate = convert_date(pubdate)
        print("post-error", pubdate)
        title = proper_case(title)

        print("=====Final Classification=====")
        print(f"Title: {title}\n")
        print(f"Authors: {authors}\n")
        print(f"College: {college}\n")
        print(f"Department: {department}\n")
        print(f"Abstract: {abstract}\n")
        print(f"Keywords: {keywords}\n")
        print(f"Publication Date: {pubdate}\n")

        return JSONResponse(content={
            "text": cleaned_text,
            "total_pages": total_pages,
            "title": title if title else "",
            "abstract": abstract if abstract else "",
            "author": authors if authors else "",
            "college": college if college else "",
            "department": department if department else "",
            "pubDate": pubdate if pubdate else "",
            "keywords": keywords if keywords else ""
        })

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

class RecommendationRequest(BaseModel):
    userID: int
    titleID: int | None

@app.post("/book-recommend")
async def recommend(request: RecommendationRequest):
    user_id = request.userID
    title_id = request.titleID
    
    # Call book_reco to get recommendations
    recommendations = get_recommendations(title_id, user_id)

    if isinstance(recommendations, pd.DataFrame):
        recommendations = recommendations.to_dict(orient='records')

    for rec in recommendations:
        # Handle NaN values in 'average_rating'
        if isinstance(rec['average_rating'], float) and math.isnan(rec['average_rating']):
            rec['average_rating'] = 0 
        
        rec['titleID'] = int(rec['titleID'])
        rec['rating'] = int(rec['average_rating']) 

    print("Recommendations Found:", recommendations)
    return {"recommendations": recommendations}

class RsrchRecommendationRequest(BaseModel):
    researchID: int

@app.post("/research-recommend")
async def recommend(request: RsrchRecommendationRequest):
    research_id = request.researchID
    print(f"Received researchID: {research_id}")  # Debug print

    recommendations = get_rsrch_recommendations(research_id)

    if isinstance(recommendations, pd.DataFrame):
        recommendations = recommendations.to_dict(orient='records')

    print("Recommendations Found:", recommendations)
    return {"recommendations": recommendations}
