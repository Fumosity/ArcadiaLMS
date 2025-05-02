import pandas as pd
from supabase import create_client, Client
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Optional
import random
import nltk
import re
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import numpy as np
from sklearn.metrics import ndcg_score

# Download necessary NLTK data (run once)
try:
    stopwords.words('english')
    WordNetLemmatizer().lemmatize('running')
except LookupError:
    nltk.download('stopwords')
    nltk.download('wordnet')

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

# Your Supabase credentials (Keep these as they are)
SUPABASE_URL = "https://mibimdahipesicbwtmkv.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pYmltZGFoaXBlc2ljYnd0bWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyOTY2NjYsImV4cCI6MjA0Mzg3MjY2Nn0.mkrsAS6Hhg3YRTXEZurTNvTSJnU3N1S3f9jLleRUgQU"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Fetch all data (Keep these as they are)
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

user_genre_link_data = supabase.table("user_genre_link").select("*").execute()
user_genre_df_interests = pd.DataFrame(user_genre_link_data.data) # Separate dataframe for user interests to avoid confusion

# Merge genres with book_genre_df (Keep these as they are)
if 'genreID' in book_genre_df.columns and 'genreID' in genres_df.columns:
    book_genre_df = book_genre_df.merge(genres_df, on="genreID", how="left")
else:
    print("Warning: Missing 'genreID' column for merging genres.")

# Group genres by titleID and merge with books_df (Keep these as they are)
if 'titleID' in book_genre_df.columns and 'genreName' in book_genre_df.columns:
    book_genres_grouped = book_genre_df.groupby("titleID")["genreName"].apply(lambda x: ' '.join(x)).reset_index()
    books_df = books_df.merge(book_genres_grouped, on="titleID", how="left")
else:
    print("Warning: Missing 'titleID' or 'genreName' columns for genre grouping.")

# Merge categories with books_df (Keep these as they are)
if 'titleID' in book_genre_df.columns and 'category' in book_genre_df.columns:
    book_category_grouped = book_genre_df.groupby("titleID")["category"].first().reset_index()
    books_df = books_df.merge(book_category_grouped, on="titleID", how="left")
else:
    print("Warning: Missing 'category' column for merging categories.")

def preprocess_text(text):
    text = re.sub(r'[^a-zA-Z\s]', '', text, re.I|re.A) # Remove non-alphabetic characters
    text = text.lower()
    tokens = text.split()
    tokens = [lemmatizer.lemmatize(word) for word in tokens if word not in stop_words]
    return ' '.join(tokens)

# Create feature set with processed keywords
if 'keywords' in books_df.columns:
    books_df['keywords_processed'] = books_df['keywords'].astype(str).fillna('').apply(preprocess_text)
else:
    books_df['keywords_processed'] = ''

if 'synopsis' in books_df.columns:
    books_df['synopsis_processed'] = books_df['synopsis'].astype(str).fillna('').apply(preprocess_text)
else:
    books_df['synopsis_processed'] = ''

# Define weights for different feature components
keyword_weight = 1.0
synopsis_weight = 0.5
category_weight = 0.2
genre_weight = 1.5

# Combine all text features for fitting the TF-IDF vectorizer
all_text_features = pd.Series([
    ' '.join(filter(None, [
        books_df['keywords_processed'].astype(str).fillna('')[i],
        books_df['synopsis_processed'].astype(str).fillna('')[i],
        books_df['category'].astype(str).fillna('')[i],
        books_df['genreName'].astype(str).fillna('')[i]
    ])) for i in range(len(books_df))
])

# Initialize a single TF-IDF vectorizer and fit it on all text features
tfidf = TfidfVectorizer()
tfidf.fit(all_text_features)

# Transform each text feature using the fitted TF-IDF vectorizer
keyword_matrix = tfidf.transform(books_df['keywords_processed'].astype(str).fillna('')) if 'keywords_processed' in books_df.columns else None
synopsis_matrix = tfidf.transform(books_df['synopsis_processed'].astype(str).fillna('')) if 'synopsis_processed' in books_df.columns else None
category_matrix = tfidf.transform(books_df['category'].astype(str).fillna('')) if 'category' in books_df.columns else None
genre_matrix = tfidf.transform(books_df['genreName'].astype(str).fillna('')) if 'genreName' in books_df.columns else None

# Combine the TF-IDF matrices with weights
weighted_matrix = None
if keyword_matrix is not None:
    weighted_matrix = keyword_matrix * keyword_weight
if synopsis_matrix is not None:
    weighted_matrix = (weighted_matrix + (synopsis_matrix * synopsis_weight)) if weighted_matrix is not None else (synopsis_matrix * synopsis_weight)
if category_matrix is not None:
    weighted_matrix = (weighted_matrix + (category_matrix * category_weight)) if weighted_matrix is not None else (category_matrix * category_weight)
if genre_matrix is not None:
    weighted_matrix = (weighted_matrix + (genre_matrix * genre_weight)) if weighted_matrix is not None else (genre_matrix * genre_weight)

# Calculate cosine similarity on the combined weighted matrix
if weighted_matrix is not None:
    cosine_sim = cosine_similarity(weighted_matrix, weighted_matrix)
else:
    print("Warning: No features to calculate cosine similarity.")
    cosine_sim = None

# Calculate average ratings (Keep these as they are)
if not ratings_df.empty:
    average_ratings = ratings_df.groupby("titleID")["ratingValue"].mean()
else:
    average_ratings = pd.Series(dtype=float)

books_df["average_rating"] = books_df["titleID"].map(average_ratings).fillna(0)

# Merge user information with ratings_df (Keep these as they are)
if "userID" in ratings_df.columns and "userID" in users_df.columns:
    ratings_df = ratings_df.merge(users_df, on="userID", how="left")
else:
    print("Warning: 'userID' column missing in ratings_df or users_df. Skipping user merge.")

# Merge user interests with users_df (Keep these as they are)
if 'userID' in users_df.columns and 'userID' in user_genre_df_interests.columns and 'genreID' in user_genre_df_interests.columns and 'genreID' in genres_df.columns and 'genreName' in genres_df.columns:
    user_genre_df_interests = user_genre_df_interests.merge(genres_df, on='genreID', how='left')
    user_interests = user_genre_df_interests.groupby('userID')['genreName'].apply(list).reset_index(name='interested_genres')
    users_df = users_df.merge(user_interests, on='userID', how='left')
    # Handle NaN in 'interested_genres' column explicitly
    users_df['interested_genres'] = users_df['interested_genres'].apply(lambda x: [] if isinstance(x, float) and pd.isna(x) else x)
else:
    print("Warning: Missing necessary columns for incorporating user interests.")
    users_df['interested_genres'] = [[]] * len(users_df) # Initialize an empty list if merge fails

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

def ndcg_at_k(actual: List[str], predicted: List[str], k: int) -> float:
    """Calculates Normalized Discounted Cumulative Gain at k."""
    actual_set = set(actual)
    predicted_at_k = predicted[:k]
    dcg = 0
    for i, item in enumerate(predicted_at_k):
        if item in actual_set:
            dcg += 1 / np.log2(i + 2)

    idcg = 0
    for i in range(min(k, len(actual_set))):
        idcg += 1 / np.log2(i + 2)

    return dcg / idcg if idcg > 0 else 0

# Keep the get_recommendations function as it is for now
def get_recommendations(titleID: Optional[str] = None, userID: Optional[str] = None, recommend_type: str = Optional[str], cosine_sim=cosine_sim, books_df=books_df, ratings_df=ratings_df, users_df=users_df):
    if recommend_type == 'random':
        if not books_df.empty:
            random_indices = random.sample(books_df.index.tolist(), min(10, len(books_df)))
            return books_df.loc[random_indices][["titleID", "title", "author", "genreName", "category", "keywords", "average_rating", "cover"]]
        else:
            return pd.DataFrame()

    if titleID is None and userID is None:
        print("No titleID or userID provided. Returning top-rated books.")
        return books_df.sort_values(by="average_rating", ascending=False).head(10)[["titleID", "title", "author", "genreName", "category", "keywords", "average_rating", "cover"]]

    book_indices = []

    if titleID is not None and userID is not None and cosine_sim is not None:
        #print("Using Improved Hybrid Recommendation (Content + College + Interests) - Category Filtered")
        if titleID not in books_df["titleID"].values:
            print("Warning: titleID not found in books_df. Falling back to collaborative.")
            return get_recommendations(userID=userID, recommend_type='collaborative', cosine_sim=cosine_sim, books_df=books_df, ratings_df=ratings_df, users_df=users_df)

        current_book_category = books_df[books_df["titleID"] == titleID]["category"].iloc[0]
        current_book_genres = books_df[books_df["titleID"] == titleID]["genreName"].str.split(' ').iloc[0] if 'genreName' in books_df.columns and not pd.isna(books_df.loc[books_df['titleID'] == titleID, 'genreName'].iloc[0]) else []
        user_interested_genres = users_df[users_df["userID"] == userID]["interested_genres"].iloc[0]

        idx = books_df[books_df["titleID"] == titleID].index[0]
        content_sim_scores = list(enumerate(cosine_sim[idx]))
        # Filter for books in the same category
        same_category_indices = books_df[books_df["category"] == current_book_category].index
        filtered_content_sim_scores = [
            (i, score) for i, score in content_sim_scores if i in same_category_indices and i != idx
        ]
        filtered_content_sim_scores = sorted(filtered_content_sim_scores, key=lambda x: x[1], reverse=True)[:20] # Consider more for initial ranking

        user_college = users_df[users_df["userID"] == userID]["userCollege"].iloc[0]
        user_department = users_df[users_df["userID"] == userID]["userDepartment"].iloc[0]
        college_ratings = ratings_df[(ratings_df["userCollege"] == user_college) & (ratings_df["userDepartment"] == user_department)]
        college_avg_ratings = college_ratings.groupby("titleID")["ratingValue"].mean()
        top_college_books_in_category = set(
            college_avg_ratings[college_avg_ratings.index.isin(books_df[books_df["category"] == current_book_category]["titleID"])].nlargest(20).index.tolist()
        ) # Consider more for initial ranking

        # Combine recommendations: Content, College Popularity, and User Interests (within category)
        hybrid_recommendations = []
        content_based_titles = set()

        for content_idx, content_score in filtered_content_sim_scores:
            similar_book_titleID = books_df.loc[content_idx, "titleID"]
            genre_name = books_df.loc[content_idx, "genreName"]
            similar_book_genres = []
            if isinstance(genre_name, str):
                similar_book_genres = genre_name.split(' ')
            elif pd.isna(genre_name):
                similar_book_genres = []

            interest_score = 0.1 if any(genre in user_interested_genres for genre in similar_book_genres) else 0 # Small bonus for matching interest

            hybrid_recommendations.append((content_idx, content_score * 0.43 + (1.0 if similar_book_titleID in top_college_books_in_category else 0) * 0.34 + interest_score * 0.23)) # Weights: Content, College, Interests

            content_based_titles.add(similar_book_titleID)

        # Add popular college books (within category) that weren't already in content recommendations
        for book_titleID in top_college_books_in_category:
            if book_titleID not in content_based_titles:
                book_index = books_df[books_df["titleID"] == book_titleID].index[0]
                genre_name = books_df.loc[book_index, "genreName"]
                book_genres = []
                if isinstance(genre_name, str):
                    book_genres = genre_name.split(' ')
                elif pd.isna(genre_name):
                    book_genres = []
                interest_score = 0.1 if any(genre in user_interested_genres for genre in book_genres) else 0

                # Get the average rating for this book within the user's college
                college_book_rating = college_avg_ratings.get(book_titleID, 0) # Default to 0 if not rated in college

                # Combine college rating with a base score and interest
                hybrid_recommendations.append((book_index, 0.30 + college_book_rating * 0.40 + interest_score * 0.20)) # Adjusted base and weight for rating

        hybrid_recommendations.sort(key=lambda item: item[1], reverse=True)
        # Filter out the input titleID and then take the top 10
        recommended_indices = [item[0] for item in hybrid_recommendations if books_df.loc[item[0], 'titleID'] != titleID][:10]
        book_indices = recommended_indices

    elif titleID is not None and cosine_sim is not None:
        #print("Using Content-Based Recommendation - Category and Genre Filtered")
        if titleID not in books_df["titleID"].values:
            print("Warning: titleID not found in books_df.")
            return pd.DataFrame()

        current_book_category = books_df[books_df["titleID"] == titleID]["category"].iloc[0]
        current_book_genres = books_df[books_df["titleID"] == titleID]["genreName"].str.split(' ').iloc[0] if 'genreName' in books_df.columns and not pd.isna(books_df.loc[books_df['titleID'] == titleID, 'genreName'].iloc[0]) else []

        idx = books_df[books_df["titleID"] == titleID].index[0]
        content_sim_scores = list(enumerate(cosine_sim[idx]))

        # Filter for books in the same category OR with at least one matching genre
        filtered_content_sim_scores = []
        for i, score in content_sim_scores:
            if i == idx:
                continue
            recommended_book_category = books_df.loc[i, "category"]
            recommended_book_genres_str = books_df.loc[i, "genreName"]
            recommended_book_genres = recommended_book_genres_str.split(' ') if isinstance(recommended_book_genres_str, str) else []

            if recommended_book_category == current_book_category or any(genre in current_book_genres for genre in recommended_book_genres):
                filtered_content_sim_scores.append((i, score))

        filtered_content_sim_scores = sorted(filtered_content_sim_scores, key=lambda x: x[1], reverse=True)[:10] # Take top 10
        recommended_indices = [i[0] for i in filtered_content_sim_scores]
        book_indices = recommended_indices

    elif userID is not None:
        # Collaborative remains the same (doesn't take a specific book as input)
        #print("Using Collaborative Filtering (College-Based)")
        if userID not in users_df["userID"].values:
            print("Warning: userID not found in users_df.")
            return pd.DataFrame()

        user_college = users_df[users_df["userID"] == userID]["userCollege"].iloc[0]
        user_department = users_df[users_df["userID"] == userID]["userDepartment"].iloc[0]

        college_ratings = ratings_df[(ratings_df["userCollege"] == user_college) & (ratings_df["userDepartment"] == user_department)]
        college_avg_ratings = college_ratings.groupby("titleID")["ratingValue"].mean()
        recommended_books = college_avg_ratings.sort_values(ascending=False).index.tolist()

        valid_titleIDs = set(books_df["titleID"])
        book_indices = [books_df[books_df["titleID"] == tid].index[0] for tid in recommended_books[:10] if tid in valid_titleIDs]

    if book_indices:
        return books_df[["titleID", "title", "author", "genreName", "category", "keywords", "average_rating", "cover"]].iloc[book_indices]
    else:
        return pd.DataFrame()

def evaluate_single_strategy(books_df, ratings_df, users_df, strategy: str, cosine_sim, k_values: List[int] = [5, 10, 20], rating_threshold: int = 4):
    """Evaluates a single recommendation strategy for a set of k values."""
    all_user_ids = users_df['userID'].unique()
    results = {}

    for k in k_values:
        precision_scores = []
        recall_scores = []
        f1_scores = []
        ndcg_scores = []

        for user_id in all_user_ids:
            user_ratings = ratings_df[ratings_df['userID'] == user_id]
            if user_ratings.empty or user_ratings['titleID'].nunique() < 1:
                continue

            actual_liked_books = user_ratings[user_ratings['ratingValue'] >= rating_threshold]['titleID'].tolist()
            rated_books_by_user = user_ratings['titleID'].unique().tolist()
            all_predicted_books_for_user = set() # To store unique predicted books across all seed books

            if strategy == 'hybrid':
                for seed_book in rated_books_by_user:
                    predicted_df = get_recommendations(userID=user_id, titleID=seed_book, recommend_type=strategy, cosine_sim=cosine_sim, books_df=books_df, ratings_df=ratings_df, users_df=users_df)
                    if not predicted_df.empty and 'titleID' in predicted_df.columns:
                        all_predicted_books_for_user.update(predicted_df['titleID'].tolist()[:k * 2]) # Consider more initially
                predicted_books = list(all_predicted_books_for_user)[:k]
            elif strategy == 'content':
                for seed_book in rated_books_by_user:
                    predicted_df = get_recommendations(titleID=seed_book, recommend_type=strategy, cosine_sim=cosine_sim, books_df=books_df, ratings_df=ratings_df, users_df=users_df)
                    if not predicted_df.empty and 'titleID' in predicted_df.columns:
                        all_predicted_books_for_user.update(predicted_df['titleID'].tolist()[:k * 2]) # Consider more initially
                predicted_books = list(all_predicted_books_for_user)[:k]
            elif strategy == 'collaborative':
                predicted_df = get_recommendations(userID=user_id, recommend_type=strategy, cosine_sim=cosine_sim, books_df=books_df, ratings_df=ratings_df, users_df=users_df)
                if not predicted_df.empty and 'titleID' in predicted_df.columns:
                    predicted_books = predicted_df['titleID'].tolist()[:k]
                else:
                    predicted_books = []
            elif strategy == 'random':
                predicted_df = get_recommendations(recommend_type=strategy, books_df=books_df)
                if not predicted_df.empty and 'titleID' in predicted_df.columns:
                    predicted_books = predicted_df['titleID'].tolist()[:k]
                else:
                    predicted_books = []

            precision = precision_at_k(actual_liked_books, predicted_books, k)
            recall = recall_at_k(actual_liked_books, predicted_books, k)
            f1 = f1_at_k(precision, recall)
            ndcg = ndcg_at_k(actual_liked_books, predicted_books, k)

            precision_scores.append(precision)
            recall_scores.append(recall)
            f1_scores.append(f1)
            ndcg_scores.append(ndcg)

        avg_precision = sum(precision_scores) / len(precision_scores) if precision_scores else 0
        avg_recall = sum(recall_scores) / len(recall_scores) if recall_scores else 0
        avg_f1 = sum(f1_scores) / len(f1_scores) if f1_scores else 0
        avg_ndcg = sum(ndcg_scores) / len(ndcg_scores) if ndcg_scores else 0

        results[f'Precision@{k}'] = avg_precision
        results[f'Recall@{k}'] = avg_recall
        results[f'F1@{k}'] = avg_f1
        results[f'NDCG@{k}'] = avg_ndcg

    print(f"\n--- Evaluation Results for {strategy.capitalize()} Recommendations (rating_threshold={rating_threshold}) ---")
    for k in k_values:
        print(f"  Precision@{k}: {results[f'Precision@{k}']:.4f}")
        print(f"  Recall@{k}: {results[f'Recall@{k}']:.4f}")
        print(f"  F1@{k}: {results[f'F1@{k}']:.4f}")
        print(f"  NDCG@{k}: {results[f'NDCG@{k}']:.4f}")
    return results

def evaluate_all_strategies(books_df, ratings_df, users_df, cosine_sim, k_values: List[int] = [5, 10, 20], rating_threshold: int = 4):
    """Evaluates Hybrid, Content-based, Collaborative, and Random recommendation strategies."""
    evaluate_single_strategy(books_df, ratings_df, users_df, 'hybrid', cosine_sim, k_values, rating_threshold)
    evaluate_single_strategy(books_df, ratings_df, users_df, 'content', cosine_sim, k_values, rating_threshold)
    evaluate_single_strategy(books_df, ratings_df, users_df, 'collaborative', cosine_sim, k_values, rating_threshold)
    evaluate_single_strategy(books_df, ratings_df, users_df, 'random', cosine_sim, k_values, rating_threshold)

# --- Evaluation ---
evaluate_all_strategies(books_df, ratings_df, users_df, cosine_sim, k_values=[5, 10, 20], rating_threshold=4)
