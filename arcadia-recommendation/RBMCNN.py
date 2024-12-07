from supabase import create_client, Client
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader, TensorDataset
from sklearn.preprocessing import OneHotEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
import os
import matplotlib.pyplot as plt
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

    def train_step(self, v, k=1, lr=0.01):
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

# 2. Define CNN
class CNN(nn.Module):
    def __init__(self, vocab_size, embedding_dim, num_filters, filter_sizes, output_dim, dropout=0.5, pretrained_embeddings=None, padding_idx=0):
        super(CNN, self).__init__()
        
        # Embedding layer
        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=padding_idx)
        if pretrained_embeddings is not None:
            self.embedding.weight.data.copy_(torch.tensor(pretrained_embeddings))
            self.embedding.weight.requires_grad = False

        # Convolutional layers with adjusted parameters
        self.convs = nn.ModuleList([
            nn.Sequential(
                nn.Conv2d(in_channels=1, 
                          out_channels=num_filters,  # Increased num_filters
                          kernel_size=(fs, embedding_dim)),
                nn.ReLU(),  # Added ReLU activation after convolution
                nn.MaxPool2d(kernel_size=(2, 1))  # Added MaxPooling layer
            )
            for fs in filter_sizes
        ])

        # Fully connected layer with adjusted output size
        self.fc = nn.Linear(num_filters * len(filter_sizes), output_dim)
        # Dropout layer
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        # Convert x to LongTensor
        x = x.long() 
        
        # Embedding
        embedded = self.embedding(x).unsqueeze(1)  # [batch_size, 1, sequence_length, embedding_dim]

        # Convolution + Activation + Pooling
        conved = [conv(embedded) for conv in self.convs]  
        #for c in conved:
            #print("Shape of c:", c.shape)  
        pooled = [F.max_pool2d(c, (c.shape[2], 1)).squeeze(2).squeeze(2) for c in conved]  # Adjusted pooling
        #for p in pooled:
            #print("Shape of p:", p.shape)
        # Concatenate pooled outputs
        cat = torch.cat(pooled, dim=1)  # [batch_size, num_filters * len(filter_sizes)]

        # Apply dropout and fully connected layer
        cat = self.dropout(cat)
        #print("Shape of cat:", cat.shape)  
        return self.fc(cat)  # [batch_size, output_dim]

    def calculate_accuracy(preds, y):
        """Calculate accuracy."""
        max_preds = preds.argmax(dim=1, keepdim=True)  # Get the index of the max probability
        correct = max_preds.eq(y.view_as(max_preds)).sum()
        return correct.float() / y.size(0)

# 6. Combine Features and Recommend Books
def recommend_books(input_vector, rbm, cnn, text_features_tensor, books_df, book_index, top_n=10, threshold=0.5):
    # RBM Features
    with torch.no_grad():  # Add this line
        rbm_features = rbm(input_vector.unsqueeze(0))[1]  # Add batch dimension (1, n_hidden)

    # CNN Features for the single book
    with torch.no_grad():  # Add this line
        cnn_features = cnn(text_features_tensor[book_index].unsqueeze(0))  # Use the correct index

    print(f"RBM Features Shape: {rbm_features.shape}")
    print(f"CNN Features Shape: {cnn_features.shape}")

    # Combine features
    hybrid_features = torch.cat((rbm_features, cnn_features), dim=1)
    print(f"Combined Features Shape: {hybrid_features.shape}")

    hybrid_features = torch.nn.functional.normalize(hybrid_features, p=2, dim=1)  # Normalize combined features
    print(f"Normalized Hybrid Features: {hybrid_features}")

    # --- Normalize hybrid_features after combining ---
    scaler = StandardScaler()
    hybrid_features = torch.tensor(scaler.fit_transform(hybrid_features.numpy()), dtype=torch.float32)
    print(f"Scaled Hybrid Features: {hybrid_features}")

    # Now calculate cosine similarity
    input_feature = hybrid_features[0]  # Input book
    similarities = F.cosine_similarity(hybrid_features, input_feature.unsqueeze(0), dim=1)

# --- Debugging: Manual Cosine Similarity Calculation ---
    from sklearn.metrics.pairwise import cosine_similarity  # Import cosine_similarity
    print("Top similarities for the input book:")

    # Example: Print top similarities for a few other books
    for i in range(min(10, len(hybrid_features))):  # Print top 10 similarities
        print(f"Cosine Similarity with book {i}: {similarities[i].item()}")

    # --- End Debugging ---
    # Apply threshold to similarities
    top_indices = torch.where(similarities >= threshold)[0]  # Get indices where similarity is above threshold
    top_indices = top_indices[top_indices != 0]  # Exclude the input book itself
    top_indices = top_indices[:top_n]  # Keep only the top_n indices

    # --- Debugging: Print top_indices and recommendations ---
    print("Top Indices:", top_indices)
    print("Recommended Books:", books_df.iloc[top_indices.cpu().numpy()])
    # --- End Debugging ---

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

    # Tokenize textual data for CNN
    import nltk
    from nltk.stem import WordNetLemmatizer
    from nltk.corpus import stopwords
    
    nltk.download('punkt')  # Download necessary resources if you haven't already
    nltk.download('wordnet')  # Download if using WordNetLemmatizer
    nltk.download('stopwords')  # Download if needed
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()

    text_data = (books_df['title'].fillna("") + " " + books_df['keyword'].fillna("")).str.lower()

    text_data = text_data.apply(lambda x: ' '.join(
    [lemmatizer.lemmatize(word) for word in nltk.word_tokenize(x.lower()) 
     if word.isalpha() and word not in stop_words]
    ))

    vectorizer = TfidfVectorizer(
        max_features=250,  # Adjust as needed
        min_df=0.01,          # Lower if the dataset is small
        max_df=0.9,        # Reduce to limit high-frequency words
        stop_words=None)  # Consider removing stopwords)  # Use TfidfVectorizer
    
    text_features = vectorizer.fit_transform(text_data)

    print("Text Features (before tensor conversion):")
    print(text_features)  # Print the output of TfidfVectorizer
    print(text_data[:5])
    print(text_features.toarray()[:5])

    # Print a few examples from text_data
    print("\nSample Text Data:")
    for i in range(5):  # Print the first 5 examples
        print(text_data[i])

    from sklearn.preprocessing import StandardScaler

    scaler = StandardScaler(with_mean=False)  # Use this for sparse matrices
    text_features_scaled = scaler.fit_transform(text_features)
    text_features_tensor = torch.tensor(text_features_scaled.toarray(), dtype=torch.float32)
    print(f"Shape of text_features_tensor: {text_features_tensor.shape}")
    print("First 5 rows:")
    print(text_features_tensor[:5])

    non_zero_indices = (text_features.toarray() != 0).any(axis=1)
    print(f"Non-zero rows count: {non_zero_indices.sum()}")
    print(text_features[non_zero_indices][:5].toarray())

    print(f"Vocabulary Size: {len(vectorizer.vocabulary_)}")
    print("Most Frequent Terms:", vectorizer.get_feature_names_out()[:10])

    # RBM initialization
    n_visible = book_feature_matrix.shape[1]
    n_hidden = n_visible*4
    rbm = RBM(n_visible, n_hidden)

    # CNN Initialization
    vocab_size = text_features_tensor.shape[1]
    embedding_dim = 600
    num_filters = 1028
    filter_sizes = [5, 6, 7]
    output_dim = 32
    cnn = CNN(vocab_size, embedding_dim, num_filters, filter_sizes, output_dim)

    # RBM initialization
    n_visible = book_feature_matrix.shape[1]

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

    # Optional: Evaluate reconstruction error
    reconstruction_errors = []
    for batch in dataloader:
        reconstructed, _ = rbm.forward(batch)
        loss = torch.mean((batch - reconstructed) ** 2).item()
        reconstruction_errors.append(loss)

    average_error = sum(reconstruction_errors) / len(reconstruction_errors)
    print(f"Average Reconstruction Error: {average_error:.4f}")


    # 5. Train CNN
    # Optimizer and Loss Function
    optimizer = torch.optim.Adam(cnn.parameters(), lr=0.001, weight_decay=1e-5)  # Reduced learning rate
    criterion = nn.CrossEntropyLoss()

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

    # --- Analyze text_features_tensor ---
    print("Shape of text_features_tensor:", text_features_tensor.shape)

    # Print the first 5 rows of the tensor
    print("First 5 rows:")
    print(text_features_tensor[:5])

    # Visualize using PCA
    from sklearn.decomposition import PCA
    import matplotlib.pyplot as plt

    pca = PCA(n_components=2)  # Reduce to 2 dimensions for visualization
    reduced_features = pca.fit_transform(text_features_tensor.numpy())

    plt.scatter(reduced_features[:, 0], reduced_features[:, 1])
    plt.xlabel("PCA Component 1")
    plt.ylabel("PCA Component 2")
    plt.title("Text Features Visualization (PCA)")
    plt.show()
    # --- End analysis ---

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
            book_index=book_index
        )

        def get_features_for_book(input_vector, book_index, rbm, cnn, text_features_tensor):
            with torch.no_grad():
                rbm_features = rbm(input_vector.unsqueeze(0))[1]
                cnn_features = cnn(text_features_tensor[book_index].unsqueeze(0))
            return rbm_features, cnn_features

        # --- Analyze feature distributions ---
        rbm_features, cnn_features = get_features_for_book(input_vector, book_index, rbm, cnn, text_features_tensor)  # Get features

        plt.figure(figsize=(12, 6))

        plt.subplot(1, 2, 1)
        plt.hist(rbm_features.numpy().flatten(), bins=50)
        plt.title('RBM Feature Distribution')

        plt.subplot(1, 2, 2)
        plt.hist(cnn_features.numpy().flatten(), bins=50)
        plt.title('CNN Feature Distribution')

        plt.show()
        # --- End analysis ---
        
        # Display recommendations
        print(f"Books similar to the book with titleID '{book_id}':")
        print(recommended_books[['title', 'author', 'keyword', 'category', 'genre']])
    except ValueError as e:
        print(f"Error: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")