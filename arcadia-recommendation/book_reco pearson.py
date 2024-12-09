import pandas as pd
from supabase import create_client, Client
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.stats import pearsonr

# Your Supabase credentials
SUPABASE_URL = "https://mibimdahipesicbwtmkv.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pYmltZGFoaXBlc2ljYnd0bWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyOTY2NjYsImV4cCI6MjA0Mzg3MjY2Nn0.mkrsAS6Hhg3YRTXEZurTNvTSJnU3N1S3f9jLleRUgQU"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Fetch data
books_data = supabase.table("book_titles").select("*").execute()
books_df = pd.DataFrame(books_data.data)

ratings_data = supabase.table("ratings").select("*").execute()
ratings_df = pd.DataFrame(ratings_data.data)

users_data = supabase.table("user_accounts").select("*").execute()
users_df = pd.DataFrame(users_data.data)

# Preprocess data
books_df['genre'] = books_df['genre'].apply(lambda x: ' '.join(x))
books_df['features'] = books_df['keyword'].astype(str) + ' ' + books_df['category'].astype(str) + ' ' + books_df['genre'].astype(str)

# Calculate average ratings
average_ratings = ratings_df.groupby('titleID')['ratingValue'].mean()
books_df['average_rating'] = books_df['titleID'].map(average_ratings)

# Merge ratings with user data
ratings_df = pd.merge(ratings_df, users_df, on='userID')

# Calculate TF-IDF vectors
tfidf = TfidfVectorizer()
tfidf_matrix = tfidf.fit_transform(books_df['features'])

def get_recommendations(titleID, userID, tfidf_matrix=tfidf_matrix, books_df=books_df, ratings_df=ratings_df):
    idx = books_df[books_df['titleID'] == titleID].index[0]

    try:
        user_college = users_df[users_df['userID'] == userID]['userCollege'].iloc[0]
    except IndexError:
        print(f"Warning: User with ID {userID} not found. Using general recommendations.")
        user_college = None

    # Content-based similarity (using TF-IDF)
    content_sim_scores = list(enumerate(cosine_similarity(tfidf_matrix[idx], tfidf_matrix)))

    # Collaborative filtering (using Pearson correlation)
    rating_sim_scores = []
    for i, row in books_df.iterrows():
        other_titleID = row['titleID']
        other_ratings = ratings_df[ratings_df['titleID'] == other_titleID]
        college_ratings = other_ratings[other_ratings['userCollege'] == user_college]

        if len(college_ratings) >= 2:  # Need at least 2 ratings for Pearson correlation
            chosen_book_ratings = ratings_df[ratings_df['titleID'] == titleID]['ratingValue']
            other_book_ratings = college_ratings['ratingValue']
            
            # Ensure both arrays have the same length for correlation calculation
            min_len = min(len(chosen_book_ratings), len(other_book_ratings))
            corr, _ = pearsonr(chosen_book_ratings[:min_len], other_book_ratings[:min_len]) 
            rating_sim = (corr + 1) / 2  # Scale correlation to 0-1 range
        else:
            rating_sim = 0

        rating_sim_scores.append((i, rating_sim))

    # Combine similarities (adjust weights as needed)
    combined_scores = [(i, content_sim * 0.7 + rating_sim * 0.3) 
                        for (i, content_sim), (_, rating_sim) in zip(content_sim_scores, rating_sim_scores)]
    combined_scores = sorted(combined_scores, key=lambda x: x[1], reverse=True)
    combined_scores = combined_scores[1:6]  # Exclude the book itself
    book_indices = [i[0] for i in combined_scores]

    # ... (Optional print statements for debugging) ...

    return books_df[['title', 'genre', 'category', 'keyword', 'average_rating']].iloc[book_indices]

# Get user input for titleID and userID
titleID_input = int(input("Enter the titleID for recommendations: "))
userID_input = int(input("Enter the userID for recommendations: "))

# Example usage with titleID and userID
recommendations = get_recommendations(titleID_input, userID_input)
print(recommendations)