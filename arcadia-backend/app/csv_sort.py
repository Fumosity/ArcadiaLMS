import pandas as pd
import difflib
import re

def clean_author_string(author_str):
    if not isinstance(author_str, str):
        return ""
    author_str = re.sub(r'\d+', '', author_str)
    keywords = ['proponent', 'proponents', 'research', 'researchers', 'thesis', 'adviser', 'advisor', 'the', 'a', 'an', 'and']
    for keyword in keywords:
        author_str = re.sub(r'\b' + keyword + r'\b', '', author_str, flags=re.IGNORECASE)
    author_str = re.sub(r'[^\w\s,.:]', '', author_str)
    author_str = re.sub(r'\s+', ' ', author_str).strip()
    return author_str

def are_authors_similar(authors1, authors2, similarity_threshold=0.7):
    if not isinstance(authors1, str) or not isinstance(authors2, str):
        return False

    cleaned_authors1 = clean_author_string(authors1)
    cleaned_authors2 = clean_author_string(authors2)

    if not cleaned_authors1 or not cleaned_authors2:
        return False

    cleaned_authors1_latin = re.sub(r'[^\x00-\x7F]+', '', cleaned_authors1)
    cleaned_authors2_latin = re.sub(r'[^\x00-\x7F]+', '', cleaned_authors2)

    lower_authors1 = cleaned_authors1_latin.lower()
    lower_authors2 = cleaned_authors2_latin.lower()

    # Split into individual name components
    names1 = lower_authors1.split()
    names2 = lower_authors2.split()

    # Check for name component overlap
    overlap = len(set(names1) & set(names2))
    if overlap >= min(len(names1), len(names2)):
        return True

    # Check if any name component is a substring of another
    for name1 in names1:
        for name2 in names2:
            if name1 in name2 or name2 in name1:
                return True

    # Fuzzy Matching Logic (as before, but with lower threshold)
    authors1_parts = cleaned_authors1_latin.split(',')
    authors2_parts = cleaned_authors2_latin.split(',')

    for part1 in authors1_parts:
        for part2 in authors2_parts:
            seq_matcher = difflib.SequenceMatcher(None, part1.lower().strip(), part2.lower().strip())
            similarity_ratio = seq_matcher.ratio()
            if similarity_ratio >= similarity_threshold:
                return True
    return False

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = re.sub(r'[^\w\s,.:;\'"-]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def extract_number(filename):
    match = re.search(r'data_(\d+)\.jpg', filename)
    if match:
        return int(match.group(1))
    return 0  # Default to 0 if no match found

def condense_similar_rows(csv_file_path, output_file_path):
    try:
        df = pd.read_csv(csv_file_path)

        # Sort by image column
        df['sort_order'] = df['Image'].apply(extract_number)
        df = df.sort_values(by='sort_order').drop(columns='sort_order')

        # Apply cleaning to all text columns
        for col in df.columns:
            if df[col].dtype == 'object':
                df[col] = df[col].apply(clean_text)

        # Clean author columns directly in the DataFrame
        if "TitleAuthors" in df.columns:
            df["TitleAuthors"] = df["TitleAuthors"].apply(clean_author_string)
        if "AbstractAuthors" in df.columns:
            df["AbstractAuthors"] = df["AbstractAuthors"].apply(clean_author_string)

        condensed_rows = []
        i = 0
        while i < len(df):
            if i + 1 < len(df):
                row1 = df.iloc[i]
                row2 = df.iloc[i + 1]

                authors_match = False
                keywords_match = False

                if "TitleAuthors" in row1 and "AbstractAuthors" in row2:
                    authors1 = str(row1["TitleAuthors"])
                    authors2 = str(row2["AbstractAuthors"])
                    authors_match = are_authors_similar(authors1, authors2)

                if "AbstractKeywords" in row2 and "TitleMain" in row1:
                    keywords = str(row2["AbstractKeywords"]).lower().split()
                    title_main = str(row1["TitleMain"]).lower()
                    keywords_match = any(keyword in title_main for keyword in keywords)

                if (authors_match and keywords_match) or authors_match or keywords_match:
                    # Merge rows
                    merged_row = {}
                    for col in df.columns:
                        val1 = row1.get(col, "")
                        val2 = row2.get(col, "")
                        if val1 and val2:
                            merged_row[col] = f"{val1} {val2}"
                        elif val1:
                            merged_row[col] = val1
                        elif val2:
                            merged_row[col] = val2
                        else:
                            merged_row[col] = ""
                    condensed_rows.append(merged_row)
                    i += 2
                    continue

            condensed_rows.append(df.iloc[i].to_dict())
            i += 1

        condensed_df = pd.DataFrame(condensed_rows)
        condensed_df.to_csv(output_file_path, index=False)
        print(f"CSV condensed and saved to {output_file_path}")

    except FileNotFoundError:
        print(f"Error: CSV file not found at {csv_file_path}")
    except Exception as e:
        print(f"An error occurred: {e}")
        
# Example usage:
input_csv = "classified_text.csv"
output_csv = "condensed_classified_text.csv"

condense_similar_rows(input_csv, output_csv)