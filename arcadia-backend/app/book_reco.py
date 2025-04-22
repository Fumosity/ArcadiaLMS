import pandas as pd
from supabase import create_client, Client
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Optional
import random

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
    cosine_sim = None # Set to None if features are missing

def get_recommendations(titleID: Optional[str] = None, userID: Optional[str] = None, recommend_type: str = 'hybrid', cosine_sim=cosine_sim, books_df=books_df, ratings_df=ratings_df, users_df=users_df):
    #print(f"GETTING RECOMMENDATIONS - TYPE: {recommend_type}, TITLEID: {titleID}, USERID: {userID}")

    if recommend_type == 'random':
        if not books_df.empty:
            random_indices = random.sample(books_df.index.tolist(), min(5, len(books_df)))
            return books_df.loc[random_indices][["titleID", "title", "author", "genreName", "category", "keywords", "average_rating", "cover"]]
        else:
            return pd.DataFrame()

    if titleID is None and userID is None:
        print("No titleID or userID provided. Returning top-rated books.")
        return books_df.sort_values(by="average_rating", ascending=False).head(5)[["titleID", "title", "author", "genreName", "category", "keywords", "average_rating", "cover"]]

    book_indices = []

    if recommend_type == 'hybrid' and titleID is not None and userID is not None and cosine_sim is not None:
        #print("Using Hybrid Recommendation (Content + Collaborative)")
        if titleID not in books_df["titleID"].values:
            print("Warning: titleID not found in books_df. Falling back to collaborative.")
            return get_recommendations(userID=userID, recommend_type='collaborative', cosine_sim=cosine_sim, books_df=books_df, ratings_df=ratings_df, users_df=users_df)

        idx = books_df[books_df["titleID"] == titleID].index[0]
        content_sim_scores = list(enumerate(cosine_sim[idx]))
        content_sim_scores = sorted(content_sim_scores, key=lambda x: x[1], reverse=True)[1:6]

        user_college = users_df[users_df["userID"] == userID]["userCollege"].iloc[0]
        user_department = users_df[users_df["userID"] == userID]["userDepartment"].iloc[0]
        college_ratings = ratings_df[(ratings_df["userCollege"] == user_college) & (ratings_df["userDepartment"] == user_department)]
        college_avg_ratings = college_ratings.groupby("titleID")["ratingValue"].mean()
        rating_sim_indices = [books_df[books_df["titleID"] == tid].index[0] for tid in college_avg_ratings.nlargest(5).index if tid in books_df["titleID"].values]
        rating_sim_scores = [(i, 1.0) for i in rating_sim_indices] # Assign a high score for simplicity

        # Combine scores (simple average for now)
        combined_scores = {}
        for content_idx, content_score in content_sim_scores:
            combined_scores[content_idx] = combined_scores.get(content_idx, 0) + content_score * 0.5
        for rating_idx, rating_score in rating_sim_scores:
            combined_scores[rating_idx] = combined_scores.get(rating_idx, 0) + rating_score * 0.5

        sorted_combined_scores = sorted(combined_scores.items(), key=lambda item: item[1], reverse=True)
        book_indices = [i[0] for i in sorted_combined_scores[:5]]

    elif recommend_type == 'content' and titleID is not None and cosine_sim is not None:
        #print("Using Content-Based Recommendation")
        if titleID not in books_df["titleID"].values:
            print("Warning: titleID not found in books_df.")
            return pd.DataFrame()

        idx = books_df[books_df["titleID"] == titleID].index[0]
        content_sim_scores = list(enumerate(cosine_sim[idx]))
        content_sim_scores = sorted(content_sim_scores, key=lambda x: x[1], reverse=True)[1:6]
        book_indices = [i[0] for i in content_sim_scores]

    elif recommend_type == 'collaborative' and userID is not None:
        #print("Using Collaborative Filtering")
        if userID not in users_df["userID"].values:
            print("Warning: userID not found in users_df.")
            return pd.DataFrame()

        user_college = users_df[users_df["userID"] == userID]["userCollege"].iloc[0]
        user_department = users_df[users_df["userID"] == userID]["userDepartment"].iloc[0]

        college_ratings = ratings_df[(ratings_df["userCollege"] == user_college) & (ratings_df["userDepartment"] == user_department)]
        college_avg_ratings = college_ratings.groupby("titleID")["ratingValue"].mean()
        recommended_books = college_avg_ratings.sort_values(ascending=False).index.tolist()

        valid_titleIDs = set(books_df["titleID"])
        book_indices = [books_df[books_df["titleID"] == tid].index[0] for tid in recommended_books[:5] if tid in valid_titleIDs]

    if book_indices:
        return books_df[["titleID", "title", "author", "genreName", "category", "keywords", "average_rating", "cover"]].iloc[book_indices]
    else:
        return pd.DataFrame()

def precision_at_k(actual: List[str], predicted: List[str], k: int) -> float:
    """Calculates precision at k."""
    if not predicted:
        return 0.0
    relevant_in_top_k = sum(1 for item in predicted[:k] if item in actual)
    return relevant_in_top_k / min(k, len(predicted))

def recall_at_k(actual: List[str], predicted: List[str], k: int) -> float:
    """Calculates recall at k."""
    if not actual:
        return 1.0
    relevant_in_top_k = sum(1 for item in predicted[:k] if item in actual)
    return relevant_in_top_k / len(actual)

def f1_at_k(precision: float, recall: float) -> float:
    """Calculates F1-score."""
    if precision + recall == 0:
        return 0.0
    return 2 * (precision * recall) / (precision + recall)

def evaluate_single_strategy(books_df, ratings_df, users_df, strategy: str, cosine_sim, k_values: List[int] = [5, 10, 20], rating_threshold: int = 4):
    """Evaluates a single recommendation strategy for a set of k values."""
    all_user_ids = users_df['userID'].unique()
    results = {}

    for k in k_values:
        precision_scores = []
        recall_scores = []
        f1_scores = []

        for user_id in all_user_ids:
            user_ratings = ratings_df[ratings_df['userID'] == user_id]
            if user_ratings.empty or user_ratings['titleID'].nunique() < 1:
                continue

            actual_liked_books = user_ratings[user_ratings['ratingValue'] >= rating_threshold]['titleID'].tolist()
            predicted_df = pd.DataFrame()

            if strategy == 'hybrid':
                rated_books_by_user = user_ratings['titleID'].unique().tolist()
                random_rated_book = random.choice(rated_books_by_user)
                predicted_df = get_recommendations(userID=user_id, titleID=random_rated_book, recommend_type=strategy, cosine_sim=cosine_sim, books_df=books_df, ratings_df=ratings_df, users_df=users_df)
            elif strategy == 'content':
                rated_books_by_user = user_ratings['titleID'].unique().tolist()
                random_rated_book = random.choice(rated_books_by_user)
                predicted_df = get_recommendations(titleID=random_rated_book, recommend_type=strategy, cosine_sim=cosine_sim, books_df=books_df, ratings_df=ratings_df, users_df=users_df)
            elif strategy == 'collaborative':
                predicted_df = get_recommendations(userID=user_id, recommend_type=strategy, cosine_sim=cosine_sim, books_df=books_df, ratings_df=ratings_df, users_df=users_df)
            elif strategy == 'random':
                predicted_df = get_recommendations(recommend_type=strategy, books_df=books_df)

            predicted_books = []
            if not predicted_df.empty and 'titleID' in predicted_df.columns:
                predicted_books = predicted_df['titleID'].tolist()[:k]
            elif not predicted_df.empty:
                print(f"Warning: DataFrame returned by get_recommendations for strategy '{strategy}' does not contain 'titleID' column.")

            precision = precision_at_k(actual_liked_books, predicted_books, k)
            recall = recall_at_k(actual_liked_books, predicted_books, k)
            f1 = f1_at_k(precision, recall)

            precision_scores.append(precision)
            recall_scores.append(recall)
            f1_scores.append(f1)

        avg_precision = sum(precision_scores) / len(precision_scores) if precision_scores else 0
        avg_recall = sum(recall_scores) / len(recall_scores) if recall_scores else 0
        avg_f1 = sum(f1_scores) / len(f1_scores) if f1_scores else 0

        results[f'Precision@{k}'] = avg_precision
        results[f'Recall@{k}'] = avg_recall
        results[f'F1@{k}'] = avg_f1

    print(f"\n--- Evaluation Results for {strategy.capitalize()} Recommendations (rating_threshold={rating_threshold}) ---")
    for k in k_values:
        print(f"  Precision@{k}: {results[f'Precision@{k}']:.4f}")
        print(f"  Recall@{k}: {results[f'Recall@{k}']:.4f}")
        print(f"  F1@{k}: {results[f'F1@{k}']:.4f}")
    return results

def evaluate_content_based(books_df, ratings_df, users_df, cosine_sim, k_values: List[int] = [5, 10, 20], rating_threshold: int = 4):
    """Evaluates content-based recommendations."""
    all_user_ids = users_df['userID'].unique()
    results = {}

    for k in k_values:
        precision_scores = []
        recall_scores = []
        f1_scores = []

        for user_id in all_user_ids:
            user_ratings = ratings_df[ratings_df['userID'] == user_id]
            if user_ratings.empty or user_ratings['titleID'].nunique() < 1: # Need at least one rated book for context
                continue

            actual_liked_books = user_ratings[user_ratings['ratingValue'] >= rating_threshold]['titleID'].tolist()
            rated_books_by_user = user_ratings['titleID'].unique().tolist()
            random_rated_book = random.choice(rated_books_by_user)
            predicted_df = get_recommendations(titleID=random_rated_book, recommend_type='content', cosine_sim=cosine_sim, books_df=books_df, ratings_df=ratings_df, users_df=users_df)
            predicted_books = predicted_df['titleID'].tolist()[:k]

            precision = precision_at_k(actual_liked_books, predicted_books, k)
            recall = recall_at_k(actual_liked_books, predicted_books, k)
            f1 = f1_at_k(precision, recall)

            precision_scores.append(precision)
            recall_scores.append(recall)
            f1_scores.append(f1)

        avg_precision = sum(precision_scores) / len(precision_scores) if precision_scores else 0
        avg_recall = sum(recall_scores) / len(recall_scores) if recall_scores else 0
        avg_f1 = sum(f1_scores) / len(f1_scores) if f1_scores else 0

        results[f'Precision@{k}'] = avg_precision
        results[f'Recall@{k}'] = avg_recall
        results[f'F1@{k}'] = avg_f1

    print(f"\n--- Evaluation Results for Content-Based Recommendations (rating_threshold={rating_threshold}) ---")
    for k in k_values:
        print(f"  Precision@{k}: {results[f'Precision@{k}']:.4f}")
        print(f"  Recall@{k}: {results[f'Recall@{k}']:.4f}")
        print(f"  F1@{k}: {results[f'F1@{k}']:.4f}")
    return results

def evaluate_all_strategies(books_df, ratings_df, users_df, cosine_sim, k_values: List[int] = [5, 10, 20], rating_threshold: int = 4):
    """Evaluates Hybrid, Content-based, Collaborative, and Random recommendation strategies."""
    evaluate_single_strategy(books_df, ratings_df, users_df, 'hybrid', cosine_sim, k_values, rating_threshold)
    evaluate_single_strategy(books_df, ratings_df, users_df, 'content', cosine_sim, k_values, rating_threshold)
    evaluate_single_strategy(books_df, ratings_df, users_df, 'collaborative', cosine_sim, k_values, rating_threshold)
    evaluate_single_strategy(books_df, ratings_df, users_df, 'random', cosine_sim, k_values, rating_threshold)

# --- Evaluation ---
evaluate_all_strategies(books_df, ratings_df, users_df, cosine_sim, k_values=[5, 10, 20], rating_threshold=4)