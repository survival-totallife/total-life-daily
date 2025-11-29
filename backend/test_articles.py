"""
Simple test script to verify article CRUD operations.
Run this after starting the server: python test_articles.py
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_create_article():
    """Test creating a new article."""
    print("\n1. Creating a new article...")
    data = {
        "article_markdown": "# My First Article\n\nThis is a **test article** with *markdown* content.\n\n- Bullet point 1\n- Bullet point 2"
    }
    response = requests.post(f"{BASE_URL}/articles", json=data)
    print(f"Status: {response.status_code}")
    if response.status_code == 201:
        article = response.json()
        print(f"Created article ID: {article['article_id']}")
        print(f"Created at: {article['created_at']}")
        return article['article_id']
    else:
        print(f"Error: {response.text}")
        return None

def test_get_all_articles():
    """Test getting all articles."""
    print("\n2. Getting all articles...")
    response = requests.get(f"{BASE_URL}/articles")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        articles = response.json()
        print(f"Found {len(articles)} articles")
        for article in articles:
            print(f"  - ID: {article['article_id']}, Created: {article['created_at']}")
    else:
        print(f"Error: {response.text}")

def test_get_single_article(article_id):
    """Test getting a single article."""
    print(f"\n3. Getting article {article_id}...")
    response = requests.get(f"{BASE_URL}/articles/{article_id}")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        article = response.json()
        print(f"Article content preview: {article['article_markdown'][:100]}...")
    else:
        print(f"Error: {response.text}")

def test_update_article(article_id):
    """Test updating an article."""
    print(f"\n4. Updating article {article_id}...")
    data = {
        "article_markdown": "# Updated Article\n\nThis article has been **updated** with new content!"
    }
    response = requests.put(f"{BASE_URL}/articles/{article_id}", json=data)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        article = response.json()
        print(f"Updated at: {article['updated_at']}")
        print(f"New content: {article['article_markdown'][:100]}...")
    else:
        print(f"Error: {response.text}")

def test_delete_article(article_id):
    """Test deleting an article."""
    print(f"\n5. Deleting article {article_id}...")
    response = requests.delete(f"{BASE_URL}/articles/{article_id}")
    print(f"Status: {response.status_code}")
    if response.status_code == 204:
        print("Article deleted successfully")
    else:
        print(f"Error: {response.text}")

if __name__ == "__main__":
    print("=" * 50)
    print("Testing Article CRUD Operations")
    print("=" * 50)
    
    # Create an article
    article_id = test_create_article()
    
    if article_id:
        # Get all articles
        test_get_all_articles()
        
        # Get single article
        test_get_single_article(article_id)
        
        # Update article
        test_update_article(article_id)
        
        # Get updated article
        test_get_single_article(article_id)
        
        # Delete article
        test_delete_article(article_id)
        
        # Verify deletion
        test_get_all_articles()
    
    print("\n" + "=" * 50)
    print("Tests completed!")
    print("=" * 50)
