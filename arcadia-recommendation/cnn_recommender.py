import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader, TensorDataset
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from sklearn.preprocessing import StandardScaler
from supabase import create_client, Client
import json
import random
import itertools

def create_similar_pairs(books_df):
    """
    Creates pairs of similar books based on shared keywords, categories, or genres.
    """
    similar_pairs = []
    for book1_index, book1_row in books_df.iterrows():
        for book2_index, book2_row in books_df.iterrows():
            if book1_index == book2_index:
                continue  # Skip the same book

            # Check for similarity based on keywords, category, or genre
            if (any(keyword in book1_row['keyword'] for keyword in book2_row['keyword']) or 
                book1_row['category'] == book2_row['category'] or 
                any(genre in book1_row['genre'] for genre in book2_row['genre'])):
                similar_pairs.append([book1_index, book2_index])
    return similar_pairs


def create_dissimilar_pairs(books_df, num_pairs=None):
    """
    Creates pairs of dissimilar books. 
    (Books that don't share keywords, categories, or genres)
    """
    dissimilar_pairs = []
    all_pairs = list(itertools.combinations(range(len(books_df)), 2)) 
    random.shuffle(all_pairs)

    for book1_index, book2_index in all_pairs:
        book1_row = books_df.iloc[book1_index]
        book2_row = books_df.iloc[book2_index]

        # Check for dissimilarity
        if (not any(keyword in book1_row['keyword'] for keyword in book2_row['keyword']) and
            book1_row['category'] != book2_row['category'] and
            not any(genre in book1_row['genre'] for genre in book2_row['genre'])):
            dissimilar_pairs.append([book1_index, book2_index])

            if num_pairs is not None and len(dissimilar_pairs) >= num_pairs:
                break

    return dissimilar_pairs

# 2. Define CNN
class CNN(nn.Module):
    def __init__(self, vocab_size, embedding_dim, num_filters, filter_sizes, output_dim, dropout=0.5, pretrained_embeddings=None, padding_idx=0):
        super(CNN, self).__init__()
        
        # Embedding layer
        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=padding_idx)
        if pretrained_embeddings is not None:
            self.embedding.weight.data.copy_(torch.tensor(pretrained_embeddings))
            self.embedding.weight.requires_grad = False

        # Convolutional layers
        self.convs = nn.ModuleList([
            nn.Sequential(
                nn.Conv2d(in_channels=1, 
                          out_channels=num_filters, 
                          kernel_size=(fs, embedding_dim)),
                nn.ReLU(),
                nn.MaxPool2d(kernel_size=(2, 1))
            )
            for fs in filter_sizes
        ])

        # Fully connected layer
        self.fc = nn.Linear(num_filters * len(filter_sizes), output_dim)

        # Dropout layer
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        # Embedding
        x = x.long()
        embedded = self.embedding(x).unsqueeze(1)

        # Convolution + Activation + Pooling
        conved = [conv(embedded) for conv in self.convs]
        pooled = [F.max_pool2d(c, (c.shape[2], 1)).squeeze(2).squeeze(2) for c in conved]

        # Concatenate pooled outputs
        cat = torch.cat(pooled, dim=1)

        # Apply dropout and fully connected layer
        cat = self.dropout(cat)
        return self.fc(cat)

def train_cnn(cnn, text_features_tensor, book_feature_matrix, optimizer, criterion, epochs=10, batch_size=256):
    # Create pairs of similar and dissimilar books (you'll need to define your own logic for this based on your data)
    similar_pairs = create_similar_pairs(books_df)  
    dissimilar_pairs = create_dissimilar_pairs(books_df)

    # Combine pairs and create labels (1 for similar, 0 for dissimilar)
    all_pairs = similar_pairs + dissimilar_pairs
    labels = torch.cat([torch.ones(len(similar_pairs)), torch.zeros(len(dissimilar_pairs))])

    dataset = TensorDataset(torch.tensor(all_pairs, dtype=torch.long), labels)
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

    for epoch in range(epochs):
        total_loss = 0
        for batch_pairs, batch_labels in dataloader:
            cnn.train()
            optimizer.zero_grad()

            # Get embeddings for the pairs
            embeddings_1 = cnn(text_features_tensor[batch_pairs[:, 0]])
            embeddings_2 = cnn(text_features_tensor[batch_pairs[:, 1]])

            # Calculate the pairwise ranking loss
            loss = criterion(embeddings_1, embeddings_2, batch_labels) 

            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        print(f"Epoch {epoch + 1}, Loss: {total_loss / len(dataloader):.4f}")

# Example of a pairwise ranking loss (you can use other loss functions like TripletMarginLoss)
def pairwise_ranking_loss(embeddings_1, embeddings_2, labels, margin=1.0):
    distances = torch.norm(embeddings_1 - embeddings_2, dim=1)
    loss = torch.mean((1 - labels) * torch.pow(distances, 2) + 
                      labels * torch.pow(torch.clamp(margin - distances, min=0.0), 2))
    return loss

def recommend_books(input_vector, cnn, text_features_tensor, books_df, book_index, top_n=10):
    with torch.no_grad():
        cnn_features = cnn(text_features_tensor) 

    input_feature = cnn_features[book_index]
    similarities = F.cosine_similarity(cnn_features, input_feature.unsqueeze(0), dim=1)

    # Get the indices of the top_n most similar books
    _, top_indices = torch.topk(similarities, top_n + 1)  # +1 to exclude the input book itself
    top_indices = top_indices[top_indices != book_index]  # Remove the input book from recommendations
    top_indices = top_indices[:top_n]

    return books_df.iloc[top_indices.cpu().numpy()]

def get_book_vector(book_id, books_df, encoder):
    """
    Retrieve the feature vector for a book by titleID.
    """
    try:
        # Use .loc[] with boolean indexing for more explicit search
        book_row = books_df.loc[books_df['titleID'] == book_id]  
        book_index = book_row.index[0]

        print(f"Book found: {book_row[['title', 'author']]}")  # Print the book title and author for confirmation
    except IndexError:
        raise ValueError(f"Book with titleID '{book_id}' not found in the dataset.") 
        
    # Extract and encode the features of the book
    book_features = book_row[['keyword', 'category', 'genre']].fillna("")
    encoded_features = encoder.transform(book_features).toarray()
    
    # Convert to PyTorch tensor
    input_vector = torch.tensor(encoded_features, dtype=torch.float32)
    
    print(f"Encoded Features (book {book_id}): {input_vector}")  # Debugging encoded feature vector

    # Check the result
    print(f"Feature vector for book ID {book_id}: {input_vector}")
    print(f"Index of the book in DataFrame: {book_index}")

    return input_vector, book_index

if __name__ == '__main__':
    # ... (Your Supabase connection and data fetching code remains the same) ...
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
    
    print(books_df['titleID']) 

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

    for index, row in books_df.iterrows():
        print(f"Row {index}:")
        for col_name, value in row.items():
            print(f"  {col_name}: {value}")
        print("---")  # Separator between rows

    # Preprocess text data
    nltk.download('punkt')
    nltk.download('wordnet')
    nltk.download('stopwords')
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()

    text_data = (books_df['title'].fillna("") + " " + books_df['keyword'].fillna("")).str.lower()
    text_data = text_data.apply(lambda x: ' '.join(
    [lemmatizer.lemmatize(word) for word in nltk.word_tokenize(x.lower()) 
     if word.isalpha() and word not in stop_words]
    ))

    # Vectorize text data
    vectorizer = TfidfVectorizer(max_features=250, min_df=0.01, max_df=0.9, stop_words=None)
    text_features = vectorizer.fit_transform(text_data)

    # Scale text features
    scaler = StandardScaler(with_mean=False)
    text_features_scaled = scaler.fit_transform(text_features)
    text_features_tensor = torch.tensor(text_features_scaled.toarray(), dtype=torch.float32)

    # CNN Initialization
    vocab_size = text_features_tensor.shape[1]
    embedding_dim = 200
    num_filters = 64
    filter_sizes = [3, 4, 5]
    output_dim = 32
    cnn = CNN(vocab_size, embedding_dim, num_filters, filter_sizes, output_dim)

# 5. Train CNN
    # Optimizer and Loss Function
    optimizer = torch.optim.Adam(cnn.parameters(), lr=0.001, weight_decay=1e-5)
    criterion = pairwise_ranking_loss  # Use the pairwise ranking loss
    train_cnn(cnn, text_features_tensor, book_feature_matrix, optimizer, criterion) 

    # Replace with actual labels
    target_labels = torch.randint(0, 2, (len(text_features_tensor),))
    text_features_tensor = text_features_tensor.long()

    # Training Loop with Mini-Batches
    batch_size = 256
    dataset = TensorDataset(text_features_tensor, target_labels)
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

    for epoch in range(10):
        total_loss = 0
        for batch_features, batch_labels in dataloader:
            cnn.train()
            optimizer.zero_grad()
            
            # Convert batch_features to LongTensor
            batch_features = batch_features.long()  
            # print("Shape of batch_features:", batch_features.shape)  # Print the input shape
            predictions = cnn(batch_features)
            loss = criterion(predictions, batch_labels)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        print(f"Epoch {epoch + 1}, Loss: {total_loss / len(dataloader):.4f}")

    # Save the Model
    torch.save(cnn.state_dict(), "cnn_model.pth")  # Save only the state_dict

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
        
        # Load CNN state dictionary
        cnn_state_dict = torch.load("cnn_model.pth", weights_only=True)
        cnn.load_state_dict(cnn_state_dict)

        # Generate recommendations using CNN features
        recommended_books = recommend_books(
            input_vector=input_vector,
            cnn=cnn,
            text_features_tensor=text_features_tensor,
            books_df=books_df,
            book_index=book_index
        )

        # Display recommendations
        print(f"Books similar to the book with titleID '{book_id}':")
        print(recommended_books[['title', 'author', 'keyword', 'category', 'genre']])

    except ValueError as e:
        print(f"Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")