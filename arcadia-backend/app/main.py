from fastapi import FastAPI, File, UploadFile, Query, Request
from fastapi.responses import JSONResponse
from PIL import Image, ExifTags
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
from typing import Optional

from .book_reco import get_recommendations
from .research_reco import get_rsrch_recommendations

from .SendAuthEmail import router as email_router

#app = FastAPI(root_path="/api")
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
import os
print("Current Working Directory:", os.getcwd())

# Include the email router with the correct prefix
# This ensures the endpoint is available at /api/send-email
app.include_router(email_router)

# Rest of your code remains the same
excluded_sections = ["Approval Sheet", "Certificate of Originality", "Acknowledgement", "Table of Contents", "Access Leaf", "Acceptance Sheet", "Author Permission Statement", "List of Tables", "List of Figures", "List of Appendices", "List of Abbreviations"]
resume_sections = ["Abstract", "Keywords"]

title, authors, college, department, abstract, keywords, pubdate = "", "", "", "", "", "", ""

def preprocess_merged_text(merged_text):
    """Preprocesses the merged text iteratively to separate combined elements."""

    processed_texts = [merged_text.strip()]
    final_texts = []

    while processed_texts:
        text = processed_texts.pop(0)

        date_pattern = r"\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b"
        date_match = re.search(date_pattern, text, re.IGNORECASE)

        author_pattern = r"\b[A-Z][a-z]+\s[A-Z]\.\s[A-Za-z]+(?:\s[A-Z][a-z]+)*\b"
        author_matches = list(re.finditer(author_pattern, text)) 

        if date_match:
            date_str = date_match.group(0)
            pre_date_text = text[:date_match.start()].strip()
            post_date_text = text[date_match.end():].strip()

            # Ensure the date isn't merged with authors
            if pre_date_text:
                final_texts.append(pre_date_text)  # Store authors separately
            final_texts.append(date_str)  # Store date separately

            if post_date_text:  
                processed_texts.append(post_date_text)  # Process any remaining text

        elif author_matches:
            last_end = 0
            for match in author_matches:
                author_str = match.group(0)
                start, end = match.span()

                # Append the text before the author pattern, if any
                if start > last_end:
                    final_texts.append(text[last_end:start].strip())
                
                final_texts.append(author_str)
                last_end = end
                
            # Append any remaining text after the last author match
            if last_end < len(text):
                final_texts.append(text[last_end:].strip())
        else:
            final_texts.append(text)

    return final_texts

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
    else:
        return ""

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
            global department  # Ensures the function modifies the global variable
            department = ""  # Initialize department to prevent uninitialized access
            department = find_department(line_lower) # find department 

        # Pattern to match headers (allows variations)
        header_pattern = re.compile(r"(LYCEUM\s+OF\s+THE\s+PHILIPPINES\s+UNIVERSITY|CARLO\s+M\.\s+RECTO\s+ACADEMY\s+OF\s+ADVANCED\s+STUDIES)", re.IGNORECASE)

        # Skip if line matches pattern AND is uppercase
        if header_pattern.search(line) and line.isupper():
            continue

        if line_lower.startswith("in partial fulfillment"):
            skip_current_paragraph = True

        if line_lower.startswith("an undergraduate"):
            skip_current_paragraph = True

        if "submitted to the" in line_lower:
            skip_current_paragraph = True

        if "requirements for the" in line_lower:
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
            last_cleaned = cleaned_lines[-1].strip()
            if last_cleaned and last_cleaned[-1] not in ".!?":
                cleaned_lines[-1] += ". " + " ".join(current_paragraph)
            else:
                cleaned_lines[-1] += " " + " ".join(current_paragraph)

            last_original = original_lines[-1].strip()
            if last_original and last_original[-1] not in ".!?":
                original_lines[-1] += ". " + " ".join(original_paragraph)
            else:
                original_lines[-1] += " " + " ".join(original_paragraph)

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
        cleaned_line = re.sub(r"[^\w\s.,'\"()-—:;/]|", "", line).strip()
        
        if cleaned_line:
            cleaned_lines.append(cleaned_line)
    
    cleaned_text = "\n\n".join(cleaned_lines)

    return cleaned_text

def replace_college_names(college_name):
  if not college_name:
        return ""
  college_name = proper_case(college_name)

  acronym_map = {
      "Allied": "CAMS",
      "Liberal": "CLAE",
      "Business": "CBA",
      "Engineering": "COECSA",
      "Fine": "CFAD",
      "International": "CITHM",
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
    formats = ["%B %Y", "%b %Y", "%m/%Y", "%Y-%m"]
    for fmt in formats:
        try:
            month_year = datetime.strptime(date_str, fmt)
            return month_year.strftime("%Y-%m")
        except ValueError:
            continue  # Move to the next format
    return None  # Return None only if all formats fail

def proper_case(name):
    lower_case_words = {
        "a", "an", "and", "but", "or", "for", "nor", "so", "the", "to", "up", "in", "on", 
        "at", "by", "with", "as", "of", "from", "about", "between", "during", "into", 
        "through", "over", "under", "within", "is", "are", "was", "were", "be", "been", "being"
    }

    words = name.strip().split()
    
    for i in range(len(words)):
        word = words[i]

        # Preserve abbreviations (all uppercase or inside parentheses)
        if re.fullmatch(r"[A-Z]{2,}", word) or re.fullmatch(r"\([A-Z]{2,}\)", word):
            continue  # Keep as-is

        # Handle special cases: McDonald, O'Neil, MacArthur
        if re.match(r"^(Mc|Mac)[A-Za-z]+$", word):
            words[i] = word[:2] + word[2:].capitalize()
            continue
        if re.match(r"^O'[A-Za-z]+$", word):
            words[i] = "O'" + word[2:].capitalize()
            continue

        # Ensure words inside parentheses are also formatted correctly
        if word.startswith("(") and word.endswith(")"):
            inner_word = word[1:-1]  # Extract word inside parentheses
            if inner_word.isupper():  # If it's already an abbreviation, keep it uppercase
                words[i] = word
            else:
                words[i] = f"({inner_word.capitalize()})"
            continue

        # Title case first word or non-lowercase word
        if i == 0 or word.lower() not in lower_case_words:
            words[i] = word.capitalize()
        else:
            words[i] = word.lower()
    
    return ' '.join(words)

def format_authors(authors_text):
    # Remove unwanted symbols but keep letters, spaces, periods, and hyphens
    authors_text = re.sub(r"[^\w\s\.\-]", " ", authors_text)  # Convert unwanted chars to spaces
    authors_text = re.sub(r"\s+", " ", authors_text).strip()  # Normalize spaces
    
    # Split potential author names
    words = authors_text.split(" ")
    formatted_authors = []
    current_author = []

    # Process names properly
    for i, word in enumerate(words):
        current_author.append(word)

        # Detect name endings (e.g., "V.", "Jr.", "III")
        if i > 0 and (re.match(r'^[A-Z]\.$', words[i - 1]) or re.match(r'^(Jr|Sr|II|III|IV|V)\.?$', word, re.IGNORECASE)):
            formatted_authors.append(" ".join(current_author).strip())
            current_author = []

    if current_author:
        formatted_authors.append(" ".join(current_author).strip())

    # Proper case formatting (capitalize first letter of each word, except suffixes)
    def proper_case(name):
        name_parts = name.split()
        return " ".join(
            part if re.match(r'^(Jr|Sr|II|III|IV|V)\.?$', part, re.IGNORECASE) else part.capitalize()
            for part in name_parts
        )

    return "; ".join(proper_case(author) for author in formatted_authors)

def is_trash_text(text):
    """Checks if a text line is considered 'trash' and should be removed."""
    text = text.strip()

    # Preserve publication dates (full month names + 4-digit year)
    if re.match(r"^(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$", text, re.IGNORECASE):
        return False  # Keep valid publication dates like "June 2023"

    # Common patterns for trash text
    trash_patterns = [
        r"^\s*$",  # Empty lines
        r"^\s*[\|\-\.\,\:\;\']+\s*$",  # Lines with only punctuation
        r"^\s*[a-zA-Z]{1,2}\s*$",  # Lines with only 1-2 letters
        r"^\s*By\s*$",  # Lines with just "By"
        r"^[^a-zA-Z0-9]+$",  # Lines with only special characters
        r"^\s*[a-z]+\s*$",  # Single lowercase word (possible OCR noise)
    ]

    # If text matches any trash pattern, return True
    if any(re.match(pattern, text) for pattern in trash_patterns):
        return True

    # Heuristic check for gibberish: mostly lowercase and contains many short words
    words = text.split()
    
    if len(words) >= 3:
        short_words = [word for word in words if len(word) <= 3 and word.lower() not in {"of", "in", "and"}]
        short_word_ratio = len(short_words) / len(words)

        if short_word_ratio > 0.8:  # Flag only if at least 80% of words are short
            return True  

    return False

def classify_text_chunks(preprocessed_text, original_text, pipeline):
    preprocessed_chunks = preprocessed_text.split("\n\n")
    original_chunks = original_text.split("\n\n")

    classified_sections = {label: "" for label in ['title', 'authors', 'college', 'abstract', 'keywords', 'pubDate']}
    classified_chunks = []

    for i, chunk in enumerate(preprocessed_chunks):
        original_chunk = original_chunks[i].strip()

        if is_trash_text(chunk):
            continue

        if re.match(r"^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}$", chunk, re.IGNORECASE):
            predicted_section = "pubDate"
        else:
            chunk_reshaped = np.array([chunk]).reshape(-1, 1)
            text_length = np.array([[len(chunk)]])
            combined_features = np.hstack([chunk_reshaped, text_length])

            df_features = pd.DataFrame(combined_features, columns=['text', 'text_length'])
            df_features['text_length'] = df_features['text_length'].astype(float)

            predicted_section = pipeline.predict(df_features)[0]

            if "academy" in chunk.lower() or "college" in chunk.lower() or "school" in chunk.lower():
                predicted_section = "college"

        # === Postprocessing per chunk ===
        processed_text = original_chunk
        if predicted_section == "authors":
            processed_text = format_authors(processed_text)
        elif predicted_section == "college":
            processed_text = replace_college_names(processed_text)
        elif predicted_section == "pubDate":
            processed_text = convert_date(processed_text)
        if predicted_section == "title":
            print("Before proper case:", processed_text)  # Debug print
            processed_text = proper_case(processed_text)
            print("After proper case:", processed_text)  # Debug print
        elif predicted_section == "keywords":
            processed_text = re.sub(r'\b(keywords?|key words?)\b.*?(?:—|:)?\s*', '', processed_text, flags=re.IGNORECASE).strip()

        print(f"\n=== CHUNK ===\n{original_chunk}\n=> Classified as: {predicted_section}")
        print(f"Postprocessed: {processed_text}\n")

        # Store classified chunk
        classified_chunks.append({
            "Preprocessed_Text": chunk,
            "Original_Text": original_chunk,
            "Classification": predicted_section
        })

        # Append cleaned text to classified section
        classified_sections[predicted_section] += processed_text + " "

    # Final cleanup
    return (
        classified_sections['title'].strip(),
        classified_sections['authors'].strip(),
        classified_sections['college'].strip(),
        classified_sections['abstract'].strip(),
        classified_sections['keywords'].strip(),
        classified_sections['pubDate'].strip(),
        classified_chunks
    )

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

                try:
                    for orientation in ExifTags.TAGS.keys():
                        if ExifTags.TAGS[orientation] == "Orientation":
                            break
                    exif = image._getexif()
                    if exif is not None:
                        orientation = exif.get(orientation, None)
                        if orientation == 3:
                            image = image.rotate(180, expand=True)
                        elif orientation == 6:
                            image = image.rotate(270, expand=True)
                        elif orientation == 8:
                            image = image.rotate(90, expand=True)
                except Exception as e:
                    print("No EXIF orientation found or error occurred:", e)

                img_cv = np.array(image)  # Convert PIL image to NumPy array
                img_cv = cv2.cvtColor(img_cv, cv2.COLOR_RGB2GRAY)  # Convert to grayscale
                img_cv = cv2.bilateralFilter(img_cv, d=9, sigmaColor=75, sigmaSpace=75)
                img_cv = cv2.adaptiveThreshold(img_cv, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 55, 10)
                kernel = np.ones((2, 2), np.uint8)
                img_cv = cv2.morphologyEx(img_cv, cv2.MORPH_OPEN, kernel)
                text = pytesseract.image_to_string(img_cv, lang='eng', config="--psm 3")

                cv2.imwrite("preprocessed_image.png", img_cv)

                file_text += text + "\n\n"
                total_pages += 1

            total_text += file_text + "\n\n"

        department = ""
        cleaned_text, original_text, department = remove_sections(total_text)

        # Apply preprocess_merged_text to both cleaned and original text to keep alignment
        cleaned_text = preprocess_text(cleaned_text)
        cleaned_text_list = preprocess_merged_text(cleaned_text)
        cleaned_text = "\n\n".join(cleaned_text_list)

        original_text = preprocess_text(original_text)
        original_text_list = preprocess_merged_text(original_text)  # Keep structure aligned
        original_text = "\n\n".join(original_text_list)

        preprocessed_chunks = cleaned_text.split("\n\n")
        original_chunks = original_text.split("\n\n")

        print("test")

        print(f"Preprocessed Chunks: {len(preprocessed_chunks)}, Original Chunks: {len(original_chunks)}")

        print("\n====TOTAL TEXT====\n", total_text)
        print("\n====CLEANED TEXT====\n", cleaned_text)

        # Get classified fields and chunks
        title, authors, college, abstract, keywords, pubdate, classified_chunks = classify_text_chunks(cleaned_text, original_text, pipeline)

        response_data = {
            "text": cleaned_text,
            "total_pages": len(classified_chunks),
            "title": title if title else "",
            "abstract": abstract if abstract else "",
            "author": authors if authors else "",
            "college": college if college else "",
            "department": department if department else "",
            "pubDate": pubdate if pubdate else "",
            "keywords": keywords if keywords else "",
            "chunks": classified_chunks  # Now includes classification for each chunk
        }

        print(">>> Returning JSONResponse with data:")
        print(response_data)  # Or use pprint if it's long

        return JSONResponse(content=response_data)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

class RecommendationRequest(BaseModel):
    titleID: Optional[int] = None
    userID: Optional[int] = None

@app.post("/debug-request")
async def debug_request(request: Request, body: RecommendationRequest):
    print("Headers:", request.headers)
    print("Received Body:", body.dict())
    return {"received": body.dict(), "headers": dict(request.headers)}

@app.post("/book-recommend")
async def recommend(request: Request, body: RecommendationRequest):
    print("Received Headers:", request.headers)
    print("Received Request Body:", body.dict())  # <--- Keep this

    user_id = body.userID
    title_id = body.titleID
    
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

app.include_router(email_router, prefix="")

