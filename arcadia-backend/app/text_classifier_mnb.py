import pandas as pd
import numpy as np
import re
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r'[^\w\s.,\'"()-—:;/]', '', text)
    return text.strip()

def plot_confusion_matrix(matrix, labels):
    plt.figure(figsize=(8, 6))
    sns.heatmap(matrix, annot=True, fmt="d", cmap="Blues", xticklabels=labels, yticklabels=labels)
    plt.xlabel("Predicted Label")
    plt.ylabel("Actual Label")
    plt.title("Confusion Matrix")
    plt.show()

def plot_class_distribution(y):
    plt.figure(figsize=(8, 5))
    sns.countplot(x=y, palette="viridis")
    plt.xticks(rotation=45)
    plt.title("Class Distribution")
    plt.xlabel("Label")
    plt.ylabel("Count")
    plt.show()

def train_model():
    df = pd.read_excel('app/preprocessed_text.xlsx')
    df.columns = df.columns.str.lower()
    
    data = {"text": [], "label": []}
    for column in ['title', 'authors', 'college', 'abstract', 'keywords', 'pubdate']:
        if column in df.columns:
            for text in df[column].dropna():
                if isinstance(text, pd.Timestamp):  
                    text = str(text.date())  
                data["text"].append(preprocess_text(str(text)))
                data["label"].append(column)
    
    classification_df = pd.DataFrame(data)
    
    X = classification_df['text']  # Single column of text
    y = classification_df['label']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english', ngram_range=(1, 2), max_features=10000)),
        ('classifier', MultinomialNB())
    ])
    
    # Train model
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred)
    matrix = confusion_matrix(y_test, y_pred)
        
    print("Classification Report for MNB")
    print("Accuracy:", accuracy)
    print("\nClassification Report:\n", report)
    print("\nConfusion Matrix:\n", matrix)
    
    plot_confusion_matrix(matrix, labels=y.unique())
    plot_class_distribution(y)
    
    return pipeline, accuracy, report, matrix

if __name__ == "__main__":
    train_model()
