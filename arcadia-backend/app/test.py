import os
import cv2
import numpy as np
from pytesseract import Output, image_to_data
import re
import csv
import pandas as pd
import shutil

def correct_skew(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.bitwise_not(gray)  # Invert colors for better line detection
    edges = cv2.Canny(gray, 50, 150)
    
    contours, _ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return image  # No skew detected, return original image
    
    largest_contour = max(contours, key=cv2.contourArea)
    rect = cv2.minAreaRect(largest_contour)
    angle = rect[-1]

    if angle < -45:
        angle += 90  # Normalize the angle

    # Rotate the image
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    
    return rotated

def compute_iou(box1, box2):
    """Calculate Intersection over Union (IoU) for two bounding boxes."""
    x1, y1, x2, y2 = box1
    x1_p, y1_p, x2_p, y2_p = box2

    inter_x1 = max(x1, x1_p)
    inter_y1 = max(y1, y1_p)
    inter_x2 = min(x2, x2_p)
    inter_y2 = min(y2, y2_p)

    inter_area = max(0, inter_x2 - inter_x1) * max(0, inter_y2 - inter_y1)
    box1_area = (x2 - x1) * (y2 - y1)
    box2_area = (x2_p - x1_p) * (y2_p - y1_p)
    union_area = box1_area + box2_area - inter_area

    return inter_area / union_area if union_area > 0 else 0

def group_text_boxes(text_boxes, iou_threshold=0.5, x_tolerance=30, paragraph_tolerance=50):
    """Groups words into lines, then merges lines into paragraphs dynamically adjusting y_tolerance."""
    if not text_boxes:
        return []

    # Compute average text height to adjust y_tolerance dynamically
    avg_text_height = np.mean([h for _, _, _, _, h in text_boxes])
    y_tolerance = max(10, int(avg_text_height * 0.6))  # 60% of avg height

    merged_lines = []
    
    # Step 1: Group words into lines
    for text, x, y, w, h in text_boxes:
        new_box = (x, y, x + w, y + h)
        merged = False

        for line in merged_lines:
            existing_box = line["bounds"]
            existing_y_center = (existing_box[1] + existing_box[3]) // 2
            new_y_center = (new_box[1] + new_box[3]) // 2

            iou = compute_iou(existing_box, new_box)
            horizontal_gap = new_box[0] - existing_box[2]

            # Merge if IoU is high or if words are on the same line
            if iou > iou_threshold or (abs(existing_y_center - new_y_center) < y_tolerance and horizontal_gap < x_tolerance):
                line["words"].append(text)
                line["bounds"] = (
                    min(existing_box[0], new_box[0]),
                    min(existing_box[1], new_box[1]),
                    max(existing_box[2], new_box[2]),
                    max(existing_box[3], new_box[3]),
                )
                merged = True
                break
        
        if not merged:
            merged_lines.append({"words": [text], "bounds": new_box})

    # Step 2: Merge lines into paragraphs
    paragraphs = []
    for line in merged_lines:
        new_box = line["bounds"]
        merged = False

        for paragraph in paragraphs:
            existing_box = paragraph["bounds"]
            vertical_gap = new_box[1] - existing_box[3]

            # Merge if lines are close enough
            if vertical_gap < paragraph_tolerance:
                paragraph["lines"].append(" ".join(line["words"]))
                paragraph["bounds"] = (
                    min(existing_box[0], new_box[0]),
                    min(existing_box[1], new_box[1]),
                    max(existing_box[2], new_box[2]),
                    max(existing_box[3], new_box[3]),
                )
                merged = True
                break
        
        if not merged:
            paragraphs.append({"lines": [" ".join(line["words"])], "bounds": new_box})

    return paragraphs

# Function to determine the page type
def detect_page_type(merged_text):
    """Determines if a full merged text belongs to a Title Page or an Abstract Page."""
    page_text_lower = merged_text.lower()
    
    has_fulfillment_phrase = bool(re.search(r"\b(partial|fulfillment|submitted|presented)\b", page_text_lower))
    has_publishing_date = bool(re.search(r"\b(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}\b", merged_text, re.IGNORECASE))
    has_abstract_phrase = bool(re.search(r"\b(abstract|keywords|proponents|executive|summary)\b", page_text_lower))
    
    if has_abstract_phrase:
        return "Abstract Page"
    elif has_fulfillment_phrase or has_publishing_date:
        return "Title Page"
    else:
        return "Unknown"
    
def is_trash_text(text):
    """Checks if a text line is considered 'trash' and should be removed."""
    trash_patterns = [
        r"^\s*$",  # Empty lines
        r"^\s*[\|\-\.\,\:\;\']+\s*$",  # Lines with only punctuation
        r"^\s*[a-zA-Z]{1,2}\s*$",  # Lines with 1 or 2 letters
        r"^\s*By\s*$", # Lines with just By
    ]
    for pattern in trash_patterns:
        if re.match(pattern, text):
            return True
    return False

# Function to check if the first paragraph is strictly a valid header
def detect_header(paragraph_text):
    """Detects if the first paragraph is capitalized and contains a university header as a substring or exact match."""
    header_options = {
        "LYCEUM OF THE PHILIPPINES UNIVERSITY",
        "LYCEUM OF THE PHILIPPINES UNIVERSITY CAVITE",
        "LYCEUM OF THE PHILIPPINES UNIVERSITY-CAVITE",
        "LYCEUM OF THE PHILIPPINES UNIVERSITY - CAVITE",
        "CLARO M. RECTO ACADEMY OF ADVANCED STUDIES"
    }

    if not paragraph_text or not paragraph_text[0].isupper():
        return False  # Return False if empty or not capitalized

    paragraph_text_lower = paragraph_text.strip().lower()

    for option in header_options:
        if paragraph_text_lower in option.lower():
            return True
    return False

def detect_footer(paragraph_text):
    """Detects if a paragraph is a university footer, handling case variations."""
    footer_options = [
        "Allied Medical Sciences", "Liberal Arts and Education", "Arts and Sciences",
        "Business Administration", "Engineering, Computer Studies, and Architecture",
        "Fine Arts and Design", "International Tourism and Hospitality Management",
        "Nursing", "Law", "Lyceum of the Philippines University Cavite"
    ]
    
    for option in footer_options:
        # Check for exact match (case-insensitive)
        if option.lower() in paragraph_text.lower():
            return True
        
        # Check for "College of" prefix (case-insensitive), but not for Lyceum
        if option != "Lyceum of the Philippines University Cavite":
            if f"College of {option}".lower() in paragraph_text.lower():
                return True
    return False

def extract_keywords(text):
    keyword_match = re.search(r"\bkeywords\s*:?\s*", text, re.IGNORECASE)
    if keyword_match:
        keyword_start = keyword_match.start() #changed to start to include the keyword
        keywords_section = text[keyword_start:].strip()
        remaining_text = text[:keyword_start].strip() #changed to start to include the keyword
        return remaining_text, keywords_section
    return text, None

def classify_text(merged_text, index, total_paragraphs, page_type, has_header):
    """Classifies merged text into sections based on content and index position."""

    classifications = {}
    text_lower = merged_text.lower()

    # Ensure total_paragraphs is always an integer (default to 1 if None)
    total_paragraphs = total_paragraphs if isinstance(total_paragraphs, int) else 1

    if page_type == "Title Page":
        if has_header and index == 0:
            classifications["label"] = "TitleHeader"
        elif (has_header and index == 1) or (not has_header and index == 0):
            classifications["label"] = "TitleMain"
        elif re.search(r"\b(submitted to|presented to)\b", text_lower):
            classifications["label"] = "TitleCollege"
        elif re.search(r"\b(partial|fulfillment)\b", text_lower):
            classifications["label"] = "TitleDepartment"
        elif re.search(r"\b(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}\b",
                       merged_text, re.IGNORECASE):
            classifications["label"] = "TitleDate"
        elif bool(re.search(r"\b[A-Z]\.\s", merged_text)):
            classifications["label"] = "TitleAuthors"
        elif index == total_paragraphs - 1:
            classifications["label"] = "TitleFooter"
        else:
            classifications["label"] = "TitleUnknown"

    elif page_type == "Abstract Page":
        if has_header and index == 0:
            classifications["label"] = "AbstractHeader"
        if "abstract" in text_lower:
            classifications["label"] = "Abstract"
        elif re.search(r"\b(college|bachelor|graduate)\b", text_lower):
            classifications["label"] = "AbstractCollege"
        elif text_lower.startswith("keyword") or "keyword" in text_lower:
            classifications["label"] = "AbstractKeywords"
        elif bool(re.search(r"\b[A-Z]\.\s", merged_text)):
            classifications["label"] = "AbstractAuthors"
        elif index == total_paragraphs - 1:
            classifications["label"] = "AbstractFooter"
        else:
            classifications["label"] = "AbstractContent"
    else:
        classifications["label"] = "Uncategorized"
    return classifications

def preprocess_merged_text(merged_text):
    """Preprocesses the merged text iteratively to separate combined elements."""

    processed_texts = [merged_text.strip()]
    final_texts = []

    while processed_texts:
        text = processed_texts.pop(0)

        date_pattern = r"(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}"
        date_match = re.search(date_pattern, text, re.IGNORECASE)

        author_pattern = r"\b[A-Z][a-z]*\s[A-Z]\.\s"  # Basic author pattern.
        author_matches = list(re.finditer(author_pattern, text)) #find all author matches in the text.

        if date_match:
            date_str = date_match.group(0)
            remaining_text = text.replace(date_str, "").strip()
            if remaining_text:
                processed_texts.append(remaining_text)
            final_texts.append(date_str)
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

def preprocess_college_text(college_text):
    """Preprocesses TitleCollege and AbstractCollege text to extract the college name."""
    
    if not isinstance(college_text, str):
        return ""  # Handle non-string inputs

    college_text_lower = college_text.lower()
    
    # Check for CLARO M. RECTO ACADEMY OF ADVANCED STUDIES
    if "claro m. recto academy of advanced studies" in college_text_lower:
        return "CLARO M. RECTO ACADEMY OF ADVANCED STUDIES"
    
    footer_options = [
        "Allied Medical Sciences", "Liberal Arts and Education", "Arts and Sciences",
        "Business Administration", "Engineering, Computer Studies, and Architecture",
        "Fine Arts and Design", "International Tourism and Hospitality Management",
        "Nursing", "Law",
    ]
    
    for option in footer_options:
        option_lower = option.lower()
        
        # Check for direct match or "College of" prefix (case-insensitive)
        if option_lower in college_text_lower or f"college of {option_lower}" in college_text_lower:
            return f"College of {option}"
    
    return college_text  # Return the original text if no match

def preprocess_title_department(department_text):
    """Preprocesses TitleDepartment text."""
    if not isinstance(department_text, str):
        return ""  # Handle non-string inputs

    department_text_lower = department_text.lower()

    bachelor_match = re.search(r"\b(bachelor|master)\b", department_text_lower)
    if bachelor_match:
        return department_text[bachelor_match.start():].strip()
    return department_text

def preprocess_authors(authors_text):
    """Preprocesses TitleAuthors and AbstractAuthors text."""
    if not isinstance(authors_text, str):
        return ""  # Handle non-string inputs

    authors_text_lower = authors_text.lower()

    title_match = re.search(r"\b(dr|mr|ms|mrs|engr|atty)\.\s", authors_text_lower)
    if title_match:
        return authors_text[:title_match.end()].strip()
    return authors_text

def process_image(image_path):
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, d=9, sigmaColor=75, sigmaSpace=75)
    gray = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 55, 10)
    kernel = np.ones((2, 2), np.uint8)
    gray = cv2.morphologyEx(gray, cv2.MORPH_OPEN, kernel)
    results = image_to_data(gray, output_type=Output.DICT, config="--psm 3")
    text_boxes = [(results["text"][i].strip(), results["left"][i], results["top"][i], results["width"][i], results["height"][i]) for i in range(len(results["text"])) if results["text"][i].strip() and int(results["conf"][i]) > 80]
    if not text_boxes:
        print(f"Skipping {image_path}: No valid text detected")
        return None
    
    paragraphs = group_text_boxes(text_boxes)
    all_preprocessed_texts = []  # Store all preprocessed texts

    for paragraph in paragraphs:
        x1, y1, x2, y2 = paragraph["bounds"]
        merged_text = " ".join(paragraph["lines"])
        preprocessed_texts = preprocess_merged_text(merged_text)
        all_preprocessed_texts.extend(preprocessed_texts) #collect all preprocessed text.

        merged = len(paragraph["lines"]) > 1
        color = (0, 255, 0) if merged else (0, 0, 255)
        cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
        cv2.putText(image, merged_text, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)

    header = None
    footer = None
    remaining_texts = []

    for text in all_preprocessed_texts: # use all_preprocessed_texts instead of merged_texts
        if detect_header(text):
            header = text
        elif detect_footer(text):
            footer = text
        elif not is_trash_text(text):
            remaining_texts.append(text)

    final_merged_texts = []
    if header:
        final_merged_texts.append(header)
    final_merged_texts.extend(remaining_texts)
    if footer:
        final_merged_texts.append(footer)

    final_merged_texts = merge_overlapping_lines(final_merged_texts)
    merged_text_for_detection = " ".join(final_merged_texts)
    page_type = detect_page_type(merged_text_for_detection)
    has_header = detect_header(final_merged_texts[0].strip()) if final_merged_texts else False

    classified_texts = {}
    for index, paragraph in enumerate(final_merged_texts):
        remaining_paragraph, keywords_section = extract_keywords(paragraph)
        classification = classify_text(paragraph, index, len(final_merged_texts), page_type, has_header)["label"]

        if keywords_section:
            classified_texts["AbstractKeywords"] = keywords_section
            if remaining_paragraph:
                classified_texts["AbstractContent"] = remaining_paragraph
        else:
            classified_texts[classification] = paragraph

    if "TitleCollege" in classified_texts:
        classified_texts["TitleCollege"] = preprocess_college_text(classified_texts["TitleCollege"].strip())

    if "AbstractCollege" in classified_texts:
        classified_texts["AbstractCollege"] = preprocess_college_text(classified_texts["AbstractCollege"].strip())

    if "TitleDepartment" in classified_texts:
        classified_texts["TitleDepartment"] = preprocess_title_department(classified_texts["TitleDepartment"].strip())

    if "TitleAuthors" in classified_texts:
        classified_texts["TitleAuthors"] = preprocess_authors(classified_texts["TitleAuthors"].strip())

    if "AbstractAuthors" in classified_texts:
        classified_texts["AbstractAuthors"] = preprocess_authors(classified_texts["AbstractAuthors"].strip())

    return {
        "merged_texts": final_merged_texts,
        "page_type": page_type,
        "has_header": has_header,
        "classified_texts": classified_texts
    }

def merge_overlapping_lines(merged_texts):
    """Merges lines that are likely part of the same text block."""
    if not merged_texts:
        return []

    final_texts = [merged_texts[0]]
    for text in merged_texts[1:]:
        if text.strip() and final_texts[-1].strip() and final_texts[-1].strip().endswith((".", ":", ",")):
            final_texts[-1] += " " + text
        else:
            final_texts.append(text)
    return final_texts

def export_to_csv(image_data_list, output_file="classified_text.csv"):
    """Exports classified paragraphs into a CSV file where classification labels are columns."""
    
    # Collect all unique labels dynamically
    unique_labels = sorted({label for image_data in image_data_list for label in image_data.keys() if label != "Image"})
    
    # Ensure "Image" is the first column
    fieldnames = ["Image"] + unique_labels
    
    with open(output_file, mode="w", newline="", encoding="utf-8") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()

        for image_data in image_data_list:
            # Create a row with only relevant classifications filled in
            row = {"Image": image_data["Image"]}
            for label in unique_labels:
                row[label] = image_data.get(label, "")  # Fill missing labels with empty strings
            
            writer.writerow(row)

    print(f"Exported {len(image_data_list)} rows to {output_file}")

def process_images_in_directory(image_folder, output_file="classified_text.csv"):
    image_data_list = []
    image_files = [f for f in os.listdir(image_folder) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    total_images = len(image_files)
    processed_count = 0

    for filename in image_files:
        image_path = os.path.join(image_folder, filename)
        processed_data = process_image(image_path)

        if processed_data is None:
            print(f"Skipping {filename}: No valid text detected")
            continue

        classified_texts = processed_data["classified_texts"]

        labels = {"Image": filename}

        for key, value in classified_texts.items():
            if key in labels:
                labels[key] += " " + value
            else:
                labels[key] = value

        image_data_list.append(labels)

        save_progress(image_data_list, output_file)

        processed_count += 1
        completion_rate = (processed_count / total_images) * 100
        print(f"Processed {filename} ({processed_count}/{total_images}). Completion: {completion_rate:.2f}%")

    print(f"Processing complete. Data saved to {output_file}")
    
ALL_LABELS = [
"TitleHeader", "TitleMain", "TitleUnknown", "TitleAuthors", "TitleCollege", "TitleDepartment",
"TitleDate", "TitleFooter", "AbstractHeader", "AbstractAuthors", "Abstract", "AbstractContent",
"AbstractCollege", "AbstractKeywords", "AbstractFooter", "Image", "Uncategorized"
]

def save_progress(image_data_list, output_file):
    """Ensures all labels appear in the CSV and saves progress safely."""
    temp_file = output_file + ".tmp"

    try:
        # Create DataFrame
        df = pd.DataFrame(image_data_list)

        # Ensure all labels are present as columns (add missing ones)
        for label in ALL_LABELS:
            if label not in df.columns:
                df[label] = ""  # Add empty column for missing labels

        # Reorder columns so "Image" is first, followed by labels
        column_order = ["Image"] + [label for label in ALL_LABELS if label != "Image"]
        df = df[column_order]

        # Save to a temporary file first
        df.to_csv(temp_file, index=False, encoding="utf-8")

        # Replace the old file safely
        if os.path.exists(output_file):
            os.remove(output_file)

        shutil.move(temp_file, output_file)

        print(f"Progress saved to {output_file}")

    except PermissionError:
        print(f"⚠️ Permission denied: Unable to save {output_file}. Close the file if it's open.")

# Example usage:
image_folder = "C:/xampp/htdocs/ArcadiaLMS/arcadia-backend/app/dataset"
process_images_in_directory(image_folder)