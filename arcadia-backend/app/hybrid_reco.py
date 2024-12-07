from fastapi import FastAPI
from supabase import create_client, Client
import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.feature_extraction.text import CountVectorizer

app = FastAPI()

# Your Supabase credentials
SUPABASE_URL = "https://mibimdahipesicbwtmkv.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pYmltZGFoaXBlc2ljYnd0bWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyOTY2NjYsImV4cCI6MjA0Mzg3MjY2Nn0.mkrsAS6Hhg3YRTXEZurTNvTSJnU3N1S3f9jLleRUgQU"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 2. Fetch Data from Supabase
response = supabase.table("book_titles").select("title, author, keyword, category, genre").execute()

# Check if the response contains valid data
if not response.data:
    print("No data found or error occurred.")
    raise ValueError("Failed to fetch data from Supabase. Please check your table and query.")

# Debugging print to confirm
books = response.data  # This is a list of dictionaries
print(f"Data successfully fetched: {len(books)} records.")

books_df = pd.DataFrame(books)

# Flatten columns containing lists into strings
def flatten_column(column):
    return column.apply(lambda x: ', '.join(map(str, x)) if isinstance(x, list) else str(x))

books_df['author'] = flatten_column(books_df['author'])
books_df['keyword'] = flatten_column(books_df['keyword'])
books_df['category'] = flatten_column(books_df['category'])
books_df['genre'] = flatten_column(books_df['genre'])

# Encode and combine features
features = books_df[['author', 'keyword', 'category', 'genre']]
encoder = OneHotEncoder()
encoded_features = encoder.fit_transform(features).toarray()
book_feature_matrix = torch.tensor(encoded_features, dtype=torch.float32)

# Tokenize textual data for CNN
text_data = books_df['title'] + " " + books_df['keyword']
vectorizer = CountVectorizer(max_features=1000, stop_words='english')
text_features = vectorizer.fit_transform(text_data).toarray()
text_features_tensor = torch.tensor(text_features, dtype=torch.long)
