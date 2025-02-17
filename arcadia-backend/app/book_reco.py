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

# Merge genres
book_genre_df = book_genre_df.merge(genres_df, on="genreID", how="left")  # Get genre names and category

# Group genres by titleID (to get multiple genres as a space-separated string)
book_genres_grouped = book_genre_df.groupby("titleID")["genreName"].apply(lambda x: ' '.join(x)).reset_index()
books_df = books_df.merge(book_genres_grouped, on="titleID", how="left")

# Merge categories (since category is in genres table, take the first category associated with the book)
book_category_grouped = book_genre_df.groupby("titleID")["category"].first().reset_index()
books_df = books_df.merge(book_category_grouped, on="titleID", how="left")

# Create feature set
books_df["features"] = (
    books_df["keywords"].astype(str) + " " + books_df["category"].astype(str) + " " + books_df["genreName"].astype(str)
)

# Calculate average ratings
average_ratings = ratings_df.groupby("titleID")["ratingValue"].mean()
books_df["average_rating"] = books_df["titleID"].map(average_ratings)

# Merge ratings with user data
ratings_df = ratings_df.merge(users_df, on="userID")

# Calculate TF-IDF vectors
tfidf = TfidfVectorizer()
tfidf_matrix = tfidf.fit_transform(books_df["features"].fillna(""))
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

def get_recommendations(titleID=None, userID=None, cosine_sim=cosine_sim, books_df=books_df, ratings_df=ratings_df):
    print("GETTING RECOMMENDATIONS TITLEID ", titleID, " USERID ", userID)

    if titleID is not None:  # Hybrid approach (content + collaborative)
        idx = books_df[books_df["titleID"] == titleID].index[0]

        try:
            user_college = users_df[users_df["userID"] == userID]["userCollege"].iloc[0]
            user_department = users_df[users_df["userID"] == userID]["userDepartment"].iloc[0]
        except IndexError:
            print(f"Warning: User with ID {userID} not found. Using general recommendations.")
            user_college = None

        # Content-based similarity
        content_sim_scores = list(enumerate(cosine_sim[idx]))

        # Collaborative filtering
        rating_sim_scores = []
        for i, row in books_df.iterrows():
            other_titleID = row["titleID"]
            other_ratings = ratings_df[ratings_df["titleID"] == other_titleID]

            if user_college == "COECSA":
                relevant_ratings = other_ratings[
                    (other_ratings["userCollege"] == user_college) &
                    (other_ratings["userDepartment"] == user_department)
                ]
            else:
                relevant_ratings = other_ratings[other_ratings["userCollege"] == user_college]

            if not relevant_ratings.empty:
                weighted_avg_rating = relevant_ratings["ratingValue"].mean()
                rating_sim = 1 / (1 + abs(books_df["average_rating"].iloc[idx] - weighted_avg_rating))
            else:
                rating_sim = 0

            rating_sim_scores.append((i, rating_sim))

        # Combine similarities
        combined_scores = [
            (i, content_sim * 0.7 + rating_sim * 0.3)
            for (i, content_sim), (_, rating_sim) in zip(content_sim_scores, rating_sim_scores)
        ]
        combined_scores = sorted(combined_scores, key=lambda x: x[1], reverse=True)
        combined_scores = combined_scores[1:6]  # Exclude the book itself
        book_indices = [i[0] for i in combined_scores]

        return books_df[
            ["titleID", "title", "genreName", "category", "keywords", "average_rating", "cover"]
        ].iloc[book_indices]

    else:  # Collaborative filtering (user-based)
        user_college = users_df[users_df["userID"] == userID]["userCollege"].iloc[0]
        user_department = users_df[users_df["userID"] == userID]["userDepartment"].iloc[0]

        # Calculate average ratings within the user's college
        if user_college == "COECSA":
            college_ratings = ratings_df[
                (ratings_df["userCollege"] == user_college) &
                (ratings_df["userDepartment"] == user_department)
            ]
        else:
            college_ratings = ratings_df[ratings_df["userCollege"] == user_college]

        college_avg_ratings = college_ratings.groupby("titleID")["ratingValue"].mean()

        # Combine with overall average ratings
        combined_avg_ratings = (college_avg_ratings + books_df["average_rating"]) / 2

        # Recommend books with highest ratings
        recommended_books = combined_avg_ratings.sort_values(ascending=False).index.tolist()
        
        # Filter valid titleIDs
        valid_titleIDs = set(books_df["titleID"])
        filtered_recommendations = [titleID for titleID in recommended_books if titleID in valid_titleIDs]

        return books_df[
            ["titleID", "title", "genreName", "category", "keywords", "average_rating", "cover"]
        ].reindex(filtered_recommendations).dropna().head(5)