from supabase import create_client, Client
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader
from sklearn.preprocessing import OneHotEncoder
from sklearn.feature_extraction.text import CountVectorizer
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

books_df = pd.DataFrame(books)

# Flatten columns containing lists into strings
def flatten_column(column):
    return column.apply(lambda x: ', '.join(map(str, x)) if isinstance(x, list) else str(x))

books_df['author'] = flatten_column(books_df['author'])
books_df['keyword'] = flatten_column(books_df['keyword'])
books_df['category'] = flatten_column(books_df['category'])
books_df['genre'] = flatten_column(books_df['genre'])

# Encode and combine features
features = books_df[['author', 'keyword', 'category', 'genre']]
encoder = OneHotEncoder()
encoded_features = encoder.fit_transform(features).toarray()
book_feature_matrix = torch.tensor(encoded_features, dtype=torch.float32)

# Tokenize textual data for CNN
text_data = books_df['title'] + " " + books_df['keyword']
vectorizer = CountVectorizer(max_features=1000, stop_words='english')
text_features = vectorizer.fit_transform(text_data).toarray()
text_features_tensor = torch.tensor(text_features, dtype=torch.long)

# 1. Define RBM
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
        h_prob = torch.sigmoid(torch.matmul(v, self.W.t()) + self.h_bias)
        h_sample = torch.bernoulli(h_prob)
        v_reconstruct_prob = torch.sigmoid(torch.matmul(h_sample, self.W) + self.v_bias)
        positive_grad = torch.matmul(h_prob.t(), v)
        negative_grad = torch.matmul(h_sample.t(), v_reconstruct_prob)
        self.W.data += 0.01 * (positive_grad - negative_grad) / v.size(0)
        self.h_bias.data += 0.01 * (h_prob.mean(0) - h_sample.mean(0))
        self.v_bias.data += 0.01 * (v.mean(0) - v_reconstruct_prob.mean(0))

# 2. Define CNN
class CNN(nn.Module):
    def __init__(self, vocab_size, embedding_dim, num_filters, filter_sizes, output_dim):
        super(CNN, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim)
        self.convs = nn.ModuleList([
            nn.Conv2d(in_channels=1, out_channels=num_filters, kernel_size=(fs, embedding_dim))
            for fs in filter_sizes
        ])
        self.fc = nn.Linear(len(filter_sizes) * num_filters, output_dim)
        self.dropout = nn.Dropout(0.5)
    
    def forward(self, x):
        embedded = self.embedding(x).unsqueeze(1)
        conved = [F.relu(conv(embedded)).squeeze(3) for conv in self.convs]
        pooled = [F.max_pool1d(c, c.shape[2]).squeeze(2) for c in conved]
        cat = self.dropout(torch.cat(pooled, dim=1))
        return self.fc(cat)

# 4. Train RBM
n_visible = book_feature_matrix.shape[1]
n_hidden = 16
rbm = RBM(n_visible, n_hidden)
batch_size = 2
dataloader = DataLoader(book_feature_matrix, batch_size=batch_size, shuffle=True)

for epoch in range(10):
    for batch in dataloader:
        rbm.train_step(batch)

torch.save(rbm.state_dict(), "rbm_model.pth")

# 5. Train CNN
vocab_size = text_features_tensor.shape[1]
embedding_dim = 50
num_filters = 10
filter_sizes = [2, 3, 4]
output_dim = 16
cnn = CNN(vocab_size, embedding_dim, num_filters, filter_sizes, output_dim)
optimizer = torch.optim.Adam(cnn.parameters(), lr=0.001)
criterion = nn.CrossEntropyLoss()
target_labels = torch.randint(0, 2, (len(text_features_tensor),))  # Replace with actual labels

for epoch in range(5):
    cnn.train()
    optimizer.zero_grad()
    predictions = cnn(text_features_tensor)
    loss = criterion(predictions, target_labels)
    loss.backward()
    optimizer.step()

torch.save(cnn.state_dict(), "cnn_model.pth")

# 6. Combine Features and Recommend Books
def recommend_books(input_vector, rbm, cnn, text_features_tensor, books_df, book_index, top_n=5):
    # RBM Features
    rbm_features = rbm(input_vector.unsqueeze(0))[1]  # Add batch dimension (1, n_hidden)
    
    # CNN Features for the single book
    cnn_features = cnn(text_features_tensor[book_index].unsqueeze(0))  # Use the correct index

    print(f"RBM Features Shape: {rbm_features.shape}")
    print(f"CNN Features Shape: {cnn_features.shape}")

    # Align dimensions
    if rbm_features.size(1) > cnn_features.size(1):
        rbm_features = rbm_features[:, :cnn_features.size(1)]
    elif cnn_features.size(1) > rbm_features.size(1):
        padding = cnn_features.size(1) - rbm_features.size(1)
        rbm_features = F.pad(rbm_features, (0, padding))

    # Combine features
    hybrid_features = torch.cat((rbm_features, cnn_features), dim=1)

    # Calculate cosine similarity
    input_feature = hybrid_features[0]  # Input book
    similarities = F.cosine_similarity(hybrid_features, input_feature.unsqueeze(0), dim=1)

    print(f"Cosine Similarities: {similarities}")

    # Get the top N recommendations, ensuring we don't go out of bounds
    top_k = min(top_n + 1, similarities.size(0))  # Ensure we don't go beyond available books
    top_indices = similarities.topk(top_k).indices[1:]  # Exclude the input book itself

    print(f"Top Indices: {top_indices}")

    return books_df.iloc[top_indices.cpu().numpy()]

def get_book_vector(book_name, books_df, encoder):
    """
    Retrieve the feature vector for a book by name.

    Parameters:
        book_name (str): The name of the book to find.
        books_df (pd.DataFrame): DataFrame containing book metadata.
        encoder (OneHotEncoder): Fitted OneHotEncoder for encoding book features.

    Returns:
        tuple: A tuple (vector, index), where:
            vector (torch.Tensor): Encoded feature vector of the book.
            index (int): Index of the book in the DataFrame.
    """
    # Find the book in the DataFrame
    book_row = books_df[books_df['title'].str.lower() == book_name.lower()]
    
    if book_row.empty:
        raise ValueError(f"Book '{book_name}' not found in the dataset.")
    
    book_index = book_row.index[0]
    
    # Extract and encode the features of the book
    book_features = book_row[['author', 'keyword', 'category', 'genre']].fillna("")
    encoded_features = encoder.transform(book_features).toarray()
    
    # Convert to PyTorch tensor
    input_vector = torch.tensor(encoded_features, dtype=torch.float32)
    
    return input_vector, book_index

# Input a book name to recommend similar books
book_name = input("Enter a book name: ")

try:
    # Get the feature vector for the input book using metadata
    input_vector, book_index = get_book_vector(book_name, books_df, encoder)
    input_vector = input_vector.squeeze(0)
    
    # Load RBM state dictionary securely
    rbm_state_dict = torch.load("rbm_model.pth", weights_only=True)
    rbm.load_state_dict(rbm_state_dict)

    # Load CNN state dictionary securely
    cnn_state_dict = torch.load("cnn_model.pth", weights_only=True)
    cnn.load_state_dict(cnn_state_dict)


    # Generate recommendations by combining RBM and CNN features
    recommended_books = recommend_books(
        input_vector=input_vector,
        rbm=rbm,
        cnn=cnn,
        text_features_tensor=text_features_tensor,
        books_df=books_df,
        book_index = book_index
    )
    
    # Display recommendations
    print(f"Books similar to '{book_name}':")
    print(recommended_books[['title', 'author', 'keyword', 'category', 'genre']])
except ValueError as e:
    print(f"Error: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")