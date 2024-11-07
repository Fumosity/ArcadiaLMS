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
from datetime import datetime

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
    # Titles
    ("A KNN-based Text Classifier", "title"),
    ("Artificial Intelligence in Healthcare", "title"),
    ("Deep Learning for Autonomous Driving", "title"),
    ("A Survey on Machine Translation Techniques", "title"),
    ("Natural Language Processing and Its Applications", "title"),
    ("Blockchain Technology in Financial Services", "title"),
    ("Big Data Analytics for Decision Making", "title"),
    ("Machine Learning Algorithms for Text Mining", "title"),
    ("Neural Networks and Pattern Recognition", "title"),
    ("AI Ethics and Society: A Growing Concern", "title"),
    
    # Authors
    ("Alexander A. Rubio, Fatima C. Eusebio", "authors"),
    ("John T. Maxwell", "authors"),
    ("Jane K. Doe, Richard P. Johnson, Amy L. Thompson", "authors"),
    ("Maria G. Perez", "authors"),
    ("Helen M. Lee, Robert T. Chang", "authors"),
    ("Lucas F. Martins, Emily R. Clarke, Carlos J. Gutierrez", "authors"),
    ("Anita K. Sharma, Michael B. Davis", "authors"),
    ("Paul W. Allen", "authors"),
    ("David H. Li, Sandra N. Wilson", "authors"),
    ("Christopher J. Miller, Nancy S. Moore, Sarah C. Gomez", "authors"),

    # Abstracts
    ("This research explores the use of K-Nearest Neighbors in text classification tasks, demonstrating its efficiency across multiple datasets.", "abstract"),
    ("The study investigates the application of deep learning in the development of autonomous vehicles, highlighting recent advancements.", "abstract"),
    ("This paper presents a comprehensive survey on the latest machine translation techniques, comparing various neural network approaches.", "abstract"),
    ("We examine the ethical concerns surrounding artificial intelligence, focusing on the implications of AI in decision-making processes.", "abstract"),
    ("Our research analyzes big data analytics techniques and their role in facilitating data-driven decision-making in businesses.", "abstract"),
    ("The work introduces a blockchain-based model for securing financial transactions, offering a comparative analysis of current methodologies.", "abstract"),
    ("This study discusses the development of neural networks and their use in pattern recognition tasks, particularly in image processing.", "abstract"),
    ("An in-depth analysis of natural language processing applications, including sentiment analysis, machine translation, and speech recognition.", "abstract"),
    ("This research examines the integration of AI in healthcare, assessing its impact on diagnostics and patient care.", "abstract"),
    ("The paper explores various machine learning algorithms used in text mining, with a focus on improving classification accuracy.", "abstract"),

    # Colleges (stays as is)
    ("COLLEGE OF ENGINEERING, COMPUTER STUDIES, AND ARCHITECTURE", "college"),
    ("COLLEGE OF ALLIED MEDICAL SCIENCES", "college"),
    ("COLLEGE OF FINE ARTS AND DESIGN", "college"),
    ("COLLEGE OF INTERNATIONAL TOURISM AND HOSPITALITY MANAGEMENT", "college"),
    ("COLLEGE OF LIBERAL ARTS AND EDUCATION", "college"),
    ("COLLEGE OF BUSINESS ADMINISTRATION", "college"),
    ("COLLEGE OF NURSING", "college"),
    ("COLLEGE OF LAW", "college"),
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
    keywords = {
        "DCS": ["computer science", "information technology", "library information science"],
        "DOA": ["architecture"],
        "DOE": ["engineering"]
    }

    for department, keywords_list in keywords.items():
        if any(keyword in line.lower() for keyword in keywords_list):
            return department
    
    return None

def preprocess_text(text):
    pub_date = None
    keywords = None
    department = ""
    college = ""

    lines = text.split("\n")

    cleaned_lines = []
    current_paragraph = []
    inside_excluded_section = False
    skip_current_paragraph = False

    number_only_pattern = re.compile(r'^\d+$')

    for line in lines:
        line = line.strip()

        if number_only_pattern.match(line):
            continue

        if date_pattern.match(line) and not pub_date:
            pub_date = line
            continue

        line_lower = line.lower()

        if line_lower.startswith("in partial fulfillment") or line_lower.startswith("an undergraduate"):
            skip_current_paragraph = True

        if line_lower.startswith("college of") and not college:
            college = line
        elif line_lower.startswith("college of") and college:
            continue

        if "bachelor of" in line_lower and not department:
            department = find_department(line_lower)

        if line_lower.startswith("lyceum"):
            continue

        if line_lower.startswith("keywords"):
            line_lower = re.sub(r'[^\w\s,]', '', line_lower)
            line_lower = line_lower.strip()
            keywords = line_lower.replace("keywords", "")
            continue

        # Determine if we're entering an excluded section
        if any(excluded_header.lower() in line_lower for excluded_header in excluded_sections):
            inside_excluded_section = True
            continue

        # Determine if we're in a resume section and should start including again
        if any(resume_header.lower() in line_lower for resume_header in resume_sections):
            inside_excluded_section = False
            continue

        
        # Skip lines inside the excluded section, resume adding lines otherwise
        if inside_excluded_section:
            continue

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

    return cleaned_text, pub_date, keywords, department, college

# Classification function
def classify_text_lines(text):
    lines = text.split("\n")

    title, abstract, authors = "", "", ""

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

    return title.strip(), abstract.strip(), authors.strip()

def replace_college_names(college_name):
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

  # Check if the college name is a key in the acronym map
  if college_name in acronym_map:
    return acronym_map[college_name]

  # Check if the college name contains a key in the acronym map
  for key in acronym_map:
    if key in college_name:
      return acronym_map[key]

  return college_name

def convert_date(date_str):
    # Parse the input string using strptime to match the "Month Year" format
    month_year = datetime.strptime(date_str, "%b %Y")
    
    # Format it to "YYYY-MM"
    return month_year.strftime("%Y-%m")

def proper_case(name):
    # List of words that should not be capitalized (unless they are the first or last word)
    lower_case_words = {
        "a", "an", "and", "but", "or", "for", "nor", "so", "the", "to", "up", "in", "on", 
        "at", "by", "with", "as", "of", "from", "about", "between", "during", "into", "through", "over", "under", "within", "is", "are", "was", "were", "be", "been", "being"
    }
    
    # Split the name into words
    words = name.split()
    
    # Capitalize the first word and any proper nouns
    for i in range(len(words)):
        if i == 0 or words[i].lower() not in lower_case_words:
            words[i] = words[i].capitalize()
        else:
            words[i] = words[i].lower()
    
    # Join the words back into a string
    return ' '.join(words)

def format_authors(authors_text):
    # Clean the text by stripping leading/trailing spaces and normalizing spaces
    authors_text = re.sub(r'\s+', ' ', authors_text.strip()).replace(",", "")
    
    # Split authors text into words
    words = authors_text.split(' ')
    
    formatted_authors = []
    current_author = []
    
    for i, word in enumerate(words):
        # If the word contains a period, it's likely a middle initial or part of an initial (like M. or F.)
        if re.match(r'^[A-Z]\.$', word):
            current_author.append(word)
        elif i + 1 < len(words) and re.match(r'^[A-Z][a-z]+$', words[i + 1]):  # next word is likely a last name
            # If the next word is a valid name (not an initial), finalize this author and start a new one
            current_author.append(word)
            formatted_authors.append(proper_case(' '.join(current_author)))  # Apply proper case here
            current_author = []
        else:
            # Add word to current name if it's part of the first or second name
            current_author.append(word)
        
    # If any name is left without being appended, append it now
    if current_author:
        formatted_authors.append(proper_case(' '.join(current_author)))  # Apply proper case here
    
    # Now join with semicolons for separation, no commas involved
    formatted_authors_text = '; '.join(formatted_authors)
    
    return formatted_authors_text


# Text extraction endpoint
@app.post("/extract-text/")
async def extract_text(files: List[UploadFile] = File(...)):
    try:
        total_text = ""
        total_pages = 0
        toc_keywords = ["table of contents", "contents"]

        for file in files:
            if file.content_type == "application/pdf":
                pdf_text = ""
                pdf_data = await file.read()
                pdf_doc = fitz.open(stream=pdf_data, filetype="pdf")
                total_pages += pdf_doc.page_count
                
                # Extract up to 15 pages or until Table of Contents is found
                for page_num in range(15):  # Limit to 15 pages to avoid excessive scanning
                    page = pdf_doc.load_page(page_num)
                    page_text = page.get_text("text")
                    
                    # Check for Table of Contents keywords
                    if any(keyword.lower() in page_text.lower() for keyword in toc_keywords):
                        break
                    
                    pdf_text += page_text + "\n\n"
                
                total_text += pdf_text + "\n\n"
            else:
                # For image files, handle with OCR (e.g., if JPG, PNG)
                image = Image.open(io.BytesIO(await file.read()))
                text = pytesseract.image_to_string(image)
                total_text += text + "\n\n"
                total_pages += 1

        print("\n\n==========TOTALTEXT==========\n\n", total_text)

        # Preprocess and classify text
        clean_text, pub_date, keywords, department, college = preprocess_text(total_text)

        print("\n\n==========CLEANTEXT==========\n\n", clean_text)

        title, abstract, author = classify_text_lines(clean_text)

        author = format_authors(author)
        college = replace_college_names(college)
        pub_date = convert_date(pub_date)
        title = proper_case(title)

        print(f"""\n\n\n\n==========RESULTS===========
            \ntitle: {title}
            \npublication date: {pub_date}
            \nauthors: {author}
            \ncollege: {college}
            \ndepartment: {department}
            \nabstract: {abstract}
            \nkeywords: {keywords}
            \npages: {total_pages}"""
            )
        
        return JSONResponse(content={
            "text": clean_text,
            "total_pages": total_pages,
            "title": title,
            "abstract": abstract,
            "author": author,
            "college": college,
            "department": department,
            "pubDate": pub_date,
            "keywords": keywords
        })
    
    except Exception as e:
        print("Error:", str(e))
        return JSONResponse(content={"error": str(e)}, status_code=500)
