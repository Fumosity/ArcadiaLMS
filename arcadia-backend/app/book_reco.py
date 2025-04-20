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
    print("GETTING RECOMMENDATIONS - TITLEID:", titleID, "USERID:", userID)

    if titleID is None and userID is None:
        print("No titleID or userID provided. Returning top-rated books.")
        return books_df.sort_values(by="average_rating", ascending=False).head(5)

    book_indices = []  # Ensure book_indices is initialized

    if titleID is not None and userID is not None:
        print("Using Hybrid Recommendation (Content + Collaborative)")
        if titleID not in books_df["titleID"].values:
            print("Warning: titleID not found in books_df. Falling back to top-rated books.")
            return books_df.sort_values(by="average_rating", ascending=False).head(5)

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
        if titleID not in books_df["titleID"].values:
            print("Warning: titleID not found in books_df. Falling back to top-rated books.")
            return books_df.sort_values(by="average_rating", ascending=False).head(5)

        idx = books_df[books_df["titleID"] == titleID].index[0]
        content_sim_scores = list(enumerate(cosine_sim[idx]))
        content_sim_scores = sorted(content_sim_scores, key=lambda x: x[1], reverse=True)[1:6]
        book_indices = [i[0] for i in content_sim_scores]

    elif userID is not None:
        print("Using Collaborative Filtering")
        if userID not in users_df["userID"].values:
            print("Warning: userID not found in users_df. Falling back to top-rated books.")
            return books_df.sort_values(by="average_rating", ascending=False).head(5)

        user_college = users_df[users_df["userID"] == userID]["userCollege"].iloc[0]
        user_department = users_df[users_df["userID"] == userID]["userDepartment"].iloc[0]

        college_ratings = ratings_df[(ratings_df["userCollege"] == user_college) & (ratings_df["userDepartment"] == user_department)]
        college_avg_ratings = college_ratings.groupby("titleID")["ratingValue"].mean()
        recommended_books = college_avg_ratings.sort_values(ascending=False).index.tolist()

        # Get the valid book indices from the books_df
        valid_titleIDs = set(books_df["titleID"])
        book_indices = [books_df[books_df["titleID"] == titleID].index[0] for titleID in recommended_books if titleID in valid_titleIDs]

        # If no valid books were found, fallback to top-rated books
        if not book_indices:
            print("No valid books found, returning top-rated books.")
            return books_df.sort_values(by="average_rating", ascending=False).head(5)

        print("Book indices:", book_indices)
        return books_df[["titleID", "title", "author", "genreName", "category", "keywords", "average_rating", "cover"]].iloc[book_indices]

    else:
        print("Returning Top-Rated Books")
        book_indices = books_df.sort_values(by="average_rating", ascending=False).head(5).index.tolist()

    print("Book indices:", book_indices)
    print("Books DataFrame shape:", books_df.shape)

    return books_df[["titleID", "title", "author", "genreName", "category", "keywords", "average_rating", "cover"]].iloc[book_indices]


def evaluate_recommendations(books_df, ratings_df, users_df, K=5):
    """
    Evaluates the recommendation system using Precision@K, Recall@K, and F1@K.
    """
    precision_list = []
    recall_list = []
    f1_list = []

    # Ensure necessary columns exist
    if 'userID' not in ratings_df.columns or 'titleID' not in ratings_df.columns:
        print("Missing 'userID' or 'titleID' in ratings_df.")
        return

    user_ids = ratings_df['userID'].unique()

    for user_id in user_ids:
        # Get the books the user has rated
        user_rated_books = ratings_df[ratings_df['userID'] == user_id]['titleID'].tolist()

        # Skip users with fewer than 2 rated books
        if len(user_rated_books) < 2:
            continue

        # Use the last rated book as the seed
        seed_title_id = user_rated_books[-1]

        # Get recommendations
        recommended_books = get_recommendations(titleID=seed_title_id, userID=user_id)

        # Ensure recommended_books is a DataFrame
        if isinstance(recommended_books, pd.DataFrame):
            recommended_ids = recommended_books['titleID'].tolist()
        else:
            continue

        # Relevant items are those the user has rated, excluding the seed
        relevant_items = set(user_rated_books[:-1])

        # Recommended items
        recommended_items = set(recommended_ids)

        # True positives
        true_positives = relevant_items & recommended_items

        # Calculate metrics
        precision = len(true_positives) / K if K else 0
        recall = len(true_positives) / len(relevant_items) if relevant_items else 0
        f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) else 0

        precision_list.append(precision)
        recall_list.append(recall)
        f1_list.append(f1)

    # Compute average metrics
    avg_precision = sum(precision_list) / len(precision_list) if precision_list else 0
    avg_recall = sum(recall_list) / len(recall_list) if recall_list else 0
    avg_f1 = sum(f1_list) / len(f1_list) if f1_list else 0

    print(f"Precision@{K}: {avg_precision:.4f}")
    print(f"Recall@{K}: {avg_recall:.4f}")
    print(f"F1@{K}: {avg_f1:.4f}")

if __name__ == "__main__":
    evaluate_recommendations(books_df, ratings_df, users_df, K=5)
