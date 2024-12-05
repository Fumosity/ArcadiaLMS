# File: hybrid_recommendation_training.py

from supabase import create_client, Client
import torch
import torch.nn as nn
import torch.nn.functional as F
from sklearn.preprocessing import OneHotEncoder
import pandas as pd
import os

# 1. Connect to Supabase
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

# Extract the data
books = response.data  # This is a list of dictionaries

# Debugging print to confirm
print(f"Data successfully fetched: {len(books)} records.")

books_df = pd.DataFrame(books)

# Flatten columns containing lists into strings
def flatten_column(column):
    return column.apply(lambda x: ', '.join(map(str, x)) if isinstance(x, list) else str(x))

books_df['author'] = flatten_column(books_df['author'])
books_df['keyword'] = flatten_column(books_df['keyword'])
books_df['category'] = flatten_column(books_df['category'])
books_df['genre'] = flatten_column(books_df['genre'])

# Combine 'author', 'keyword', 'category', and 'genre' into a single feature set
features = books_df[['author', 'keyword', 'category', 'genre']].fillna("")

# Debugging: Print transformed data to verify correctness
print("Transformed Features:")
print(features)

# Use OneHotEncoder to encode textual data into numeric format
encoder = OneHotEncoder()
encoded_features = encoder.fit_transform(features).toarray()

# Debugging: Check shape of encoded features
print("Encoded features shape:", encoded_features.shape)

# Convert to PyTorch tensor for training
book_feature_matrix = torch.tensor(encoded_features, dtype=torch.float32)

# Debugging: Check shape of tensor
print("Tensor shape:", book_feature_matrix.shape)

# 3. Define RBM
class RBM(nn.Module):
    def __init__(self, n_visible, n_hidden):
        super(RBM, self).__init__()
        self.W = nn.Parameter(torch.randn(n_hidden, n_visible) * 0.1)
        self.h_bias = nn.Parameter(torch.zeros(n_hidden))
        self.v_bias = nn.Parameter(torch.zeros(n_visible))

    def forward(self, v):
        h_prob = torch.sigmoid(torch.matmul(v, self.W.t()) + self.h_bias)
        h_sample = torch.bernoulli(h_prob)
        v_reconstruct_prob = torch.sigmoid(torch.matmul(h_sample, self.W) + self.v_bias)
        return v_reconstruct_prob, h_prob

    def train_step(self, v):
        # Forward pass to compute hidden layer probabilities and reconstruction
        h_prob = torch.sigmoid(torch.matmul(v, self.W.t()) + self.h_bias)
        h_sample = torch.bernoulli(h_prob)
        
        # Reconstruct visible layer from hidden samples
        v_reconstruct_prob = torch.sigmoid(torch.matmul(h_sample, self.W) + self.v_bias)
        
        # Positive and negative phase
        positive_grad = torch.matmul(h_prob.t(), v)
        negative_grad = torch.matmul(h_sample.t(), v_reconstruct_prob)
        
        # Update parameters
        self.W.data += 0.01 * (positive_grad - negative_grad) / v.size(0)
        self.h_bias.data += 0.01 * (h_prob.mean(0) - h_sample.mean(0))
        self.v_bias.data += 0.01 * (v.mean(0) - v_reconstruct_prob.mean(0))

        # Debugging prints
        print("Input v shape:", v.shape)
        print("Hidden layer probabilities shape:", h_prob.shape)
        print("Hidden layer samples shape:", h_sample.shape)
        print("Reconstructed visible probabilities shape:", v_reconstruct_prob.shape)

# Function to retrieve the feature vector of a given book by name
def get_book_vector(book_name, books_df, encoder):
    # Search for the book by name
    book_row = books_df[books_df['title'].str.contains(book_name, case=False, na=False)]
    if book_row.empty:
        raise ValueError(f"Book '{book_name}' not found in the database.")
    
    # Transform the book's features into a vector using the OneHotEncoder
    book_features = book_row[['author', 'keyword', 'category', 'genre']].fillna("")
    encoded_vector = encoder.transform(book_features).toarray()
    
    return torch.tensor(encoded_vector, dtype=torch.float32), book_row.index[0]

# Function to recommend books based on the input book vector
def recommend_books(input_vector, rbm, book_feature_matrix, books_df, top_n=5):
    # Get the hidden probabilities
    _, h_prob = rbm(input_vector)
    
    # Reconstruct the visible layer from hidden probabilities
    reconstructed_prob = torch.sigmoid(torch.matmul(h_prob, rbm.W) + rbm.v_bias)
    
    # Compute cosine similarity between the reconstructed vector and all books
    similarities = torch.nn.functional.cosine_similarity(reconstructed_prob, book_feature_matrix)
    
    # Get the top N similar books (excluding the input book itself)
    top_indices = similarities.topk(top_n + 1).indices[1:]  # Exclude the first match (itself)
    
    # Fetch the book details
    recommendations = books_df.iloc[top_indices.cpu().numpy()]
    return recommendations

# Debugging: Validate shape of input before creating RBM
n_visible = book_feature_matrix.shape[1]
n_hidden = 16
print("n_visible:", n_visible)

# Check if the model already exists
if os.path.exists("rbm_model.pth"):
    trained_rbm = RBM(n_visible=book_feature_matrix.shape[1], n_hidden=16)
    trained_rbm.load_state_dict(torch.load("rbm_model.pth"))
    trained_rbm.eval()  # Set to evaluation mode
    print("Trained RBM model loaded.")
else:
    # Instantiate and train RBM
    rbm = RBM(n_visible=book_feature_matrix.shape[1], n_hidden=16)
    print("Training RBM...")
    
    # Training loop
    epochs = 10
    batch_size = 2
    dataloader = torch.utils.data.DataLoader(book_feature_matrix, batch_size=batch_size, shuffle=True)

    for epoch in range(epochs):
        for batch in dataloader:
            rbm.train_step(batch)
        print(f"Epoch {epoch + 1}/{epochs} completed.")

    # Save the trained RBM model
    torch.save(rbm.state_dict(), "rbm_model.pth")
    print("RBM model saved successfully.")
    trained_rbm = rbm  # Use the trained model

# Instantiate RBM
rbm = RBM(n_visible, n_hidden)
print("Weight shape:", rbm.W.shape)

# 4. Train RBM
epochs = 10
batch_size = 2

# Split data into mini-batches
dataloader = torch.utils.data.DataLoader(book_feature_matrix, batch_size=batch_size, shuffle=True)

for epoch in range(epochs):
    for batch in dataloader:
        rbm.train_step(batch)
    print(f"Epoch {epoch + 1}/{epochs} completed.")

# Save the trained RBM model
torch.save(rbm.state_dict(), "rbm_model.pth")
print("RBM model saved successfully.")

# Input a book name to recommend similar books
book_name = input("Enter a book name: ")

try:
    # Get the feature vector for the input book
    input_vector, book_index = get_book_vector(book_name, books_df, encoder)
    
    # Recommend similar books
    recommended_books = recommend_books(input_vector, trained_rbm, book_feature_matrix, books_df)
    
    print(f"Books similar to '{book_name}':")
    print(recommended_books[['title', 'author', 'keyword', 'category', 'genre']])
except ValueError as e:
    print(e)