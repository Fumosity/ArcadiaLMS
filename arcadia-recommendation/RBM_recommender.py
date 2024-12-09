from supabase import create_client, Client
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
from sklearn.preprocessing import OneHotEncoder
import pandas as pd
import json
import numpy as np

# 1. Define RBM
class RBM(nn.Module):
    def __init__(self, n_visible, n_hidden, init_scale=0.0001):
        super(RBM, self).__init__()
        self.W = nn.Parameter(torch.empty(n_hidden, n_visible))
        nn.init.normal_(self.W, mean=0.0, std=init_scale)
        self.h_bias = nn.Parameter(torch.zeros(n_hidden))
        self.v_bias = nn.Parameter(torch.zeros(n_visible))

    def forward(self, v):
        """Compute probabilities without sampling."""
        h_prob = torch.sigmoid(torch.matmul(v, self.W.t()) + self.h_bias)
        v_reconstruct_prob = torch.sigmoid(torch.matmul(h_prob, self.W) + self.v_bias)
        return v_reconstruct_prob, h_prob

    def sample_hidden(self, v):
        """Sample hidden units given visible units."""
        h_prob = torch.sigmoid(torch.matmul(v, self.W.t()) + self.h_bias)
        h_sample = torch.bernoulli(h_prob)
        return h_sample

    def sample_visible(self, h):
        """Sample visible units given hidden units."""
        v_prob = torch.sigmoid(torch.matmul(h, self.W) + self.v_bias)
        v_sample = torch.bernoulli(v_prob)
        return v_sample

    def train_step(self, v, k=1, lr=0.1):
        """Perform one training step using Contrastive Divergence."""
        with torch.no_grad():
            # Positive phase
            h_prob = torch.sigmoid(torch.matmul(v, self.W.t()) + self.h_bias)
            h_sample = torch.bernoulli(h_prob)
            positive_grad = torch.matmul(h_prob.t(), v)

            # Gibbs sampling (CD-k)
            v_sample = v
            for _ in range(k):
                h_sample = torch.bernoulli(torch.sigmoid(torch.matmul(v_sample, self.W.t()) + self.h_bias))
                v_sample = torch.sigmoid(torch.matmul(h_sample, self.W) + self.v_bias)

            # Negative phase
            h_prob_neg = torch.sigmoid(torch.matmul(v_sample, self.W.t()) + self.h_bias)
            negative_grad = torch.matmul(h_prob_neg.t(), v_sample)

            # Update weights and biases
            self.W += lr * (positive_grad - negative_grad) / v.size(0)
            self.h_bias += lr * (h_prob.mean(0) - h_prob_neg.mean(0))
            self.v_bias += lr * (v.mean(0) - v_sample.mean(0))

    def reconstruction_error(self, v):
        with torch.no_grad():
            v_reconstruct_prob, _ = self.forward(v)
            error = torch.mean((v - v_reconstruct_prob) ** 2)
        return error.item()


def recommend_books_rbm(input_vector, rbm, books_df, top_n=10, threshold=0.5):
    """
    Recommend books using only RBM features and cosine similarity.
    """
    with torch.no_grad():
        rbm_features = rbm(input_vector.unsqueeze(0))[1]  # Add batch dimension

    # Calculate cosine similarity
    input_feature = rbm_features[0]  # Input book
    similarities = torch.nn.functional.cosine_similarity(rbm.h_bias, input_feature, dim=0)

    # Apply threshold to similarities
    top_indices = torch.where(similarities >= threshold)[0]
    top_indices = top_indices[top_indices != 0]  # Exclude the input book itself
    top_indices = top_indices[:top_n]  # Keep only the top_n indices

    return books_df.iloc[top_indices.cpu().numpy()]


def get_book_vector(book_id, books_df, encoder):
    """
    Retrieve the feature vector for a book by titleID.
    """
    try:
        # Use .loc[] with boolean indexing for more explicit search
        book_row = books_df.loc[books_df['titleID'] == book_id]
        book_index = book_row.index[0]

        print(f"Book found: {book_row[['title', 'author']]}")
    except IndexError:
        raise ValueError(f"Book with titleID '{book_id}' not found in the dataset.")

    # Extract and encode the features of the book
    book_features = book_row[['keyword', 'category', 'genre']].fillna("")
    encoded_features = encoder.transform(book_features).toarray()

    # Convert to PyTorch tensor
    input_vector = torch.tensor(encoded_features, dtype=torch.float32)

    return input_vector, book_index


if __name__ == '__main__':
    # Force the "spawn" method for multiprocessing
    torch.multiprocessing.set_start_method('spawn')

    # 1. Connect to Supabase
    SUPABASE_URL = "https://mibimdahipesicbwtmkv.supabase.co"
    SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pYmltZGFoaXBlc2ljYnd0bWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyOTY2NjYsImV4cCI6MjA0Mzg3MjY2Nn0.mkrsAS6Hhg3YRTXEZurTNvTSJnU3N1S3f9jLleRUgQU"
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    # 2. Fetch Data from Supabase
    try:
        response = supabase.table("book_titles").select("titleID, title, author, keyword, category, genre").execute()
        if not response.data:
            raise ValueError("No data found or error occurred.")
    except Exception as e:
        print(f"Error fetching data: {e}")
        raise

    # Debugging print to confirm
    books = response.data  # This is a list of dictionaries
    print(f"Data successfully fetched: {len(books)} records.")

    # --- Convert JSONB strings to lists ---
    for book in books:
        for key in ['author', 'keyword', 'genre']:
            if isinstance(book[key], str):  # Check if the value is a JSONB string
                try:
                    book[key] = json.loads(book[key])  # Parse the JSONB string
                except json.JSONDecodeError as e:
                    print(f"Error decoding JSONB for key '{key}' in book {book['titleID']}: {e}")
                    book[key] = []  # Set an empty list if decoding fails
            elif book[key] is None:  # Handle cases where the value is None
                book[key] = []
    # --- End conversion ---

    books_df = pd.DataFrame(books)

    if not isinstance(books, list) or len(books) == 0:
        raise ValueError("Fetched data is invalid or empty.")
    required_columns = {"titleID", "title", "author", "keyword", "category", "genre"}
    if not required_columns.issubset(books_df.columns):
        raise ValueError(f"Expected columns {required_columns} not found in the data.")

    # Flatten columns containing lists into strings
    def flatten_column(column):
        return column.apply(lambda x: ', '.join(x) if isinstance(x, list) else str(x) if pd.notna(x) else "")

    for col in ['author', 'keyword', 'category', 'genre']:
        books_df[col] = flatten_column(books_df[col])

    # Encode and combine features
    features = books_df[['keyword', 'category', 'genre']].fillna("")
    encoder = OneHotEncoder(sparse_output=True, handle_unknown='ignore')
    encoded_features = encoder.fit_transform(features)
    book_feature_matrix = torch.tensor(encoded_features.toarray(), dtype=torch.float32)


    # RBM initialization
    n_visible = book_feature_matrix.shape[1]
    n_hidden = n_visible * 8
    rbm = RBM(n_visible, n_hidden)

    # 4. Train RBM
    # DataLoader setup
    batch_size = 32
    dataloader = DataLoader(book_feature_matrix, batch_size=batch_size, shuffle=True, num_workers=2)

    # Training loop with logging
    num_epochs = 10
    for epoch in range(num_epochs):
        total_loss = 0
        for batch_idx, batch in enumerate(dataloader):
            rbm.train_step(batch)
            # Calculate reconstruction loss for debugging
            reconstructed, _ = rbm.forward(batch)
            loss = torch.mean((batch - reconstructed) ** 2).item()
            total_loss += loss
        print(f"Epoch {epoch + 1}/{num_epochs}, Loss: {total_loss / len(dataloader):.4f}")

    # Save the model
    torch.save(rbm.state_dict(), "rbm_model.pth")  # Save only the state_dict


    # Input a book ID to recommend similar books
    book_id = input("Enter a book titleID: ")

    # Ensure that the book_id is an integer, since it is likely to be a number
    try:
        book_id = int(book_id)  # Convert the input to an integer if it's a number
    except ValueError:
        print("Please enter a valid integer for the book titleID.")
        exit(1)

    try:
        # Get the feature vector for the input book using its titleID
        input_vector, book_index = get_book_vector(book_id, books_df, encoder)
        input_vector = input_vector.squeeze(0)

        # Load RBM state dictionary securely
        rbm_state_dict = torch.load("rbm_model.pth", weights_only=True)
        rbm.load_state_dict(rbm_state_dict)

        # Examine feature vectors
        print("Input Vector:", input_vector)
        print("RBM Hidden Bias:", rbm.h_bias) 

        # Generate recommendations using only RBM
        recommended_books = recommend_books_rbm(
            input_vector=input_vector,
            rbm=rbm,
            books_df=books_df,
        )

        # Display recommendations
        print(f"Books similar to the book with titleID '{book_id}':")
        print(recommended_books[['title', 'author', 'keyword', 'category', 'genre']])

    except ValueError as e:
        print(f"Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")