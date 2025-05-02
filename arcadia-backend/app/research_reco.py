import pandas as pd
from supabase import create_client, Client
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import random
from typing import List
from sklearn.metrics import ndcg_score
import numpy as np

# Supabase credentials
SUPABASE_URL = "https://mibimdahipesicbwtmkv.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pYmltZGFoaXBlc2ljYnd0bWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyOTY2NjYsImV4cCI6MjA0Mzg3MjY2Nn0.mkrsAS6Hhg3YRTXEZurTNvTSJnU3N1S3f9jLleRUgQU"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Fetch book data
data = supabase.table("research").select("researchID", "title", "author", "college", "department", "keywords", "abstract", "pubDate", "researchCallNum").execute()
df = pd.DataFrame(data.data)

# Preprocess data
df['features'] = df['college'].astype(str) + ' ' + df['department'].astype(str) + ' ' + df['keywords'].astype(str)

# Calculate TF-IDF vectors
tfidf = TfidfVectorizer()
tfidf_matrix = tfidf.fit_transform(df['features'])

# Calculate cosine similarity
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

def get_rsrch_recommendations(researchID, cosine_sim=cosine_sim, df=df, k=5):
    """Gets content-based recommendations for a given research paper."""
    if researchID not in df['researchID'].values:
        print(f"Warning: researchID '{researchID}' not found in the data.")
        return pd.DataFrame()

    idx = df[df['researchID'] == researchID].index[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sorted_sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    top_k_sim_scores = sorted_sim_scores[1:k+1]  # Exclude the paper itself and get top k
    research_indices = [i[0] for i in top_k_sim_scores]
    return df[['researchID', 'title', 'college', 'department', 'keywords', 'abstract', 'pubDate', 'author', 'researchCallNum']].iloc[research_indices]

def get_random_rsrch_recommendations(df, k=5):
    """Gets random recommendations."""
    if not df.empty:
        random_indices = random.sample(df.index.tolist(), min(k, len(df)))
        return df[['researchID', 'title', 'college', 'department', 'keywords', 'abstract', 'pubDate', 'author', 'researchCallNum']].iloc[random_indices]
    else:
        return pd.DataFrame()

def precision_at_k(actual, predicted, k):
    """Calculates precision at k."""
    actual_set = set(actual)
    predicted_at_k = predicted[:k]
    relevant_items = set(predicted_at_k) & actual_set
    return len(relevant_items) / k if predicted_at_k else 0

def recall_at_k(actual, predicted, k):
    """Calculates recall at k."""
    actual_set = set(actual)
    predicted_at_k = predicted[:k]
    relevant_items = set(predicted_at_k) & actual_set
    return len(relevant_items) / len(actual_set) if actual_set else 0

def f1_at_k(precision, recall):
    """Calculates F1-score."""
    if precision + recall == 0:
        return 0
    return 2 * (precision * recall) / (precision + recall)

def ndcg_at_k(actual, predicted, k):
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

def evaluate_single_strategy(df, cosine_sim, strategy: str, k_values: List[int] = [5, 10], num_samples=50):
    """Evaluates a single recommendation strategy."""
    results = {}
    sample_research_ids = random.sample(df['researchID'].tolist(), min(num_samples, len(df)))

    for k in k_values:
        precision_scores = []
        recall_scores = []
        f1_scores = []
        ndcg_scores = []

        for research_id in sample_research_ids:
            if research_id not in df['researchID'].values:
                continue

            idx = df[df['researchID'] == research_id].index[0]
            similarity_scores = list(enumerate(cosine_sim[idx]))
            sorted_sim_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
            top_similar_indices = [i[0] for i in sorted_sim_scores if i[0] != idx][0:k]
            actual_relevant = df.loc[top_similar_indices, 'researchID'].tolist()

            if strategy == 'content':
                predicted_df = get_rsrch_recommendations(researchID=research_id, cosine_sim=cosine_sim, df=df, k=k)
                predicted = predicted_df['researchID'].tolist()
            elif strategy == 'random':
                predicted_df = get_random_rsrch_recommendations(df=df, k=k)
                predicted = predicted_df['researchID'].tolist()
            else:
                raise ValueError(f"Unknown strategy: {strategy}")

            precision = precision_at_k(actual_relevant, predicted, k)
            recall = recall_at_k(actual_relevant, predicted, k)
            f1 = f1_at_k(precision, recall)
            ndcg = ndcg_at_k(actual_relevant, predicted, k)

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

    print(f"\n--- Evaluation Results for {strategy.capitalize()} Research Recommendations ---")
    for k in k_values:
        print(f"  Precision@{k}: {results[f'Precision@{k}']:.4f}")
        print(f"  Recall@{k}: {results[f'Recall@{k}']:.4f}")
        print(f"  F1@{k}: {results[f'F1@{k}']:.4f}")
        print(f"  NDCG@{k}: {results[f'NDCG@{k}']:.4f}")
    return results

def evaluate_all_research_strategies(df, cosine_sim, k_values: List[int] = [5, 10]):
    """Evaluates Content-based and Random recommendation strategies."""
    evaluate_single_strategy(df, cosine_sim, 'content', k_values)
    evaluate_single_strategy(df, cosine_sim, 'random', k_values)

# Run the evaluations
evaluate_all_research_strategies(df, cosine_sim, k_values=[5, 10])