import pandas as pd
from supabase import create_client, Client
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Supabase credentials
SUPABASE_URL = "https://mibimdahipesicbwtmkv.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pYmltZGFoaXBlc2ljYnd0bWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyOTY2NjYsImV4cCI6MjA0Mzg3MjY2Nn0.mkrsAS6Hhg3YRTXEZurTNvTSJnU3N1S3f9jLleRUgQU"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Fetch book data
data = supabase.table("research").select("researchID", "title", "author", "college", "department", "keywords").execute()
df = pd.DataFrame(data.data)

# Preprocess data
df['features'] = df['college'].astype(str) + ' ' + df['department'].astype(str) + ' ' + df['keywords'].astype(str)

# Calculate TF-IDF vectors
tfidf = TfidfVectorizer()
tfidf_matrix = tfidf.fit_transform(df['features'])

# Calculate cosine similarity
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

def get_rsrch_recommendations(researchID, cosine_sim=cosine_sim, df=df):
    idx = df[df['researchID'] == researchID].index[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:6]  # Exclude the book itself
    book_indices = [i[0] for i in sim_scores]

    print(f"Chosen Book (ID: {researchID}):")
    print(df[['title', 'college', 'department', 'keywords']].iloc[idx])
    print("\nRecommendations:")
    return df[['researchID', 'title', 'college', 'department', 'keywords']].iloc[book_indices]
