import pandas as pd
from supabase import create_client, Client
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

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

book_genre_link_data = supabase.table("book_genre_link").select("*").execute()
book_genre_df = pd.DataFrame(book_genre_link_data.data)

genres_data = supabase.table("genres").select("*").execute()
genres_df = pd.DataFrame(genres_data.data)

# Merge genres safely (only if the necessary columns exist)
if 'genreID' in book_genre_df.columns and 'genreID' in genres_df.columns:
    book_genre_df = book_genre_df.merge(genres_df, on="genreID", how="left")
else:
    print("Warning: Missing 'genreID' column for merging genres.")

# Group genres by titleID (only if the necessary columns exist)
if 'titleID' in book_genre_df.columns and 'genreName' in book_genre_df.columns:
    book_genres_grouped = book_genre_df.groupby("titleID")["genreName"].apply(lambda x: ' '.join(x)).reset_index()
    books_df = books_df.merge(book_genres_grouped, on="titleID", how="left")
else:
    print("Warning: Missing 'titleID' or 'genreName' columns for genre grouping.")

# Merge categories (only if category exists)
if 'titleID' in book_genre_df.columns and 'category' in book_genre_df.columns:
    book_category_grouped = book_genre_df.groupby("titleID")["category"].first().reset_index()
    books_df = books_df.merge(book_category_grouped, on="titleID", how="left")
else:
    print("Warning: Missing 'category' column for merging categories.")

# Create feature set (ensure all columns exist)
if 'keywords' in books_df.columns and 'category' in books_df.columns and 'genreName' in books_df.columns:
    books_df["features"] = (
        books_df["keywords"].astype(str) + " " + books_df["category"].astype(str) + " " + books_df["genreName"].astype(str)
    )
else:
    print("Warning: Missing one or more columns ('keywords', 'category', 'genreName') for feature creation.")

# Calculate average ratings safely
if not ratings_df.empty:
    average_ratings = ratings_df.groupby("titleID")["ratingValue"].mean()
else:
    average_ratings = pd.Series(dtype=float)  # Create an empty series to avoid errors

books_df["average_rating"] = books_df["titleID"].map(average_ratings).fillna(0)  # Fill missing ratings with 0

# Merge user information only if userID exists
if "userID" in ratings_df.columns and "userID" in users_df.columns:
    ratings_df = ratings_df.merge(users_df, on="userID", how="left")  # Left join to keep all ratings even if no user info exists
else:
    print("Warning: 'userID' column missing in ratings_df or users_df. Skipping user merge.")

# Calculate TF-IDF vectors only if 'features' exist
if 'features' in books_df.columns:
    tfidf = TfidfVectorizer()
    tfidf_matrix = tfidf.fit_transform(books_df["features"].fillna(""))  # Fill missing features with empty string
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
else:
    print("Warning: 'features' column is missing for TF-IDF calculation.")


def get_recommendations(titleID=None, userID=None, cosine_sim=cosine_sim, books_df=books_df, ratings_df=ratings_df, users_df=users_df):
    print("GETTING RECOMMENDATIONS TITLEID:", titleID, "USERID:", userID)

    if titleID is not None and userID is not None:
        print("Using Hybrid Recommendation (Content + Collaborative)")
        idx = books_df[books_df["titleID"] == titleID].index[0]
        content_sim_scores = list(enumerate(cosine_sim[idx]))
        content_sim_scores = sorted(content_sim_scores, key=lambda x: x[1], reverse=True)[1:6]

        rating_sim_scores = []
        for i, row in books_df.iterrows():
            other_titleID = row["titleID"]
            other_ratings = ratings_df[ratings_df["titleID"] == other_titleID]
            rating_sim = 1 / (1 + abs(books_df["average_rating"].iloc[idx] - other_ratings["ratingValue"].mean())) if not other_ratings.empty else 0
            rating_sim_scores.append((i, rating_sim))
        
        combined_scores = [
            (i, content_sim * 0.7 + rating_sim * 0.3)
            for (i, content_sim), (_, rating_sim) in zip(content_sim_scores, rating_sim_scores)
        ]
        combined_scores = sorted(combined_scores, key=lambda x: x[1], reverse=True)
        book_indices = [i[0] for i in combined_scores]
    
    elif titleID is not None:
        print("Using Content-Based Recommendation")
        idx = books_df[books_df["titleID"] == titleID].index[0]
        content_sim_scores = list(enumerate(cosine_sim[idx]))
        content_sim_scores = sorted(content_sim_scores, key=lambda x: x[1], reverse=True)[1:6]
        book_indices = [i[0] for i in content_sim_scores]
    
    elif userID is not None:
        print("Using Collaborative Filtering")
        user_college = users_df[users_df["userID"] == userID]["userCollege"].iloc[0]
        user_department = users_df[users_df["userID"] == userID]["userDepartment"].iloc[0]
        
        college_ratings = ratings_df[(ratings_df["userCollege"] == user_college) & (ratings_df["userDepartment"] == user_department)]
        college_avg_ratings = college_ratings.groupby("titleID")["ratingValue"].mean()
        recommended_books = college_avg_ratings.sort_values(ascending=False).index.tolist()
        valid_titleIDs = set(books_df["titleID"])
        book_indices = [titleID for titleID in recommended_books if titleID in valid_titleIDs]
    
    else:
        print("Returning Top-Rated Books")
        book_indices = books_df.sort_values(by="average_rating", ascending=False).head(5).index.tolist()
    
    return books_df[["titleID", "title", "author", "genreName", "category", "keywords", "average_rating", "cover"]].iloc[book_indices]