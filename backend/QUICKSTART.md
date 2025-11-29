# Quick Start Guide - Article CRUD System

## What Was Added

✅ **SQLite Database** with SQLAlchemy ORM
✅ **Complete CRUD API** for articles
✅ **Article Model** with markdown content and timestamps
✅ **Automatic database creation** on first run
✅ **Test script** to verify all operations

## Files Created

```
backend/
├── database.py       # Database connection and session management
├── models.py         # Article model (article_id, article_markdown, created_at, updated_at)
├── schemas.py        # Pydantic request/response models
├── crud.py           # CRUD operations (create, read, update, delete)
├── test_articles.py  # Test script for all operations
└── .gitignore        # Ignores .db files, __pycache__, etc.
```

## Getting Started

### Option 1: Docker (Recommended)

```bash
# From project root
docker-compose up --build
```

The database (`articles.db`) will be automatically created on first run.

**Access Points:**
- API Server: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Frontend: http://localhost:3000

### Option 2: Local Development

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file with your Google API key
echo "GOOGLE_API_KEY=your_key_here" > .env

# Start the server
uvicorn main:app --reload
```

**Access Points:**
- API Server: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Test the API

**Option A: Use the test script**
```bash
python test_articles.py
```

**Option B: Use the interactive docs**
Go to http://localhost:8000/docs and try the endpoints directly in your browser.

**Option C: Use cURL**
```bash
# Create an article
curl -X POST http://localhost:8000/articles \
  -H "Content-Type: application/json" \
  -d '{"article_markdown": "# My First Article\n\nThis is some **markdown** content."}'

# Get all articles
curl http://localhost:8000/articles

# Get article by ID
curl http://localhost:8000/articles/1

# Update article
curl -X PUT http://localhost:8000/articles/1 \
  -H "Content-Type: application/json" \
  -d '{"article_markdown": "# Updated Article\n\nUpdated content here."}'

# Delete article
curl -X DELETE http://localhost:8000/articles/1
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/articles` | Create a new article |
| GET | `/articles` | Get all articles (supports pagination) |
| GET | `/articles/{id}` | Get a specific article |
| PUT | `/articles/{id}` | Update an article |
| DELETE | `/articles/{id}` | Delete an article |
| POST | `/chat` | AI wellness chatbot (unchanged) |

## Database Schema

```sql
CREATE TABLE articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_markdown TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);
```

- **article_id**: Auto-incrementing primary key
- **article_markdown**: Stores the article content in markdown format
- **created_at**: Automatically set when article is created
- **updated_at**: Automatically updated when article is modified

## Example Article Format

```markdown
# Article Title

This is the introduction paragraph with **bold** and *italic* text.

## Section 1

- Bullet point 1
- Bullet point 2

## Section 2

1. Numbered list
2. Another item

> This is a blockquote

```

## Next Steps

### For Production

1. **Switch to PostgreSQL** instead of SQLite
   - Update `database.py` with PostgreSQL connection string
   - Install `psycopg2-binary`

2. **Add Database Migrations**
   ```bash
   pip install alembic
   alembic init alembic
   alembic revision --autogenerate -m "Create articles table"
   alembic upgrade head
   ```

3. **Add Validation**
   - Minimum/maximum length for articles
   - Markdown syntax validation

4. **Add Features**
   - Search articles by content
   - Filter by date range
   - Add categories/tags (when ready)
   - Add images (as discussed for future)

### For Frontend Integration

The frontend can now:
1. Fetch all articles for the homepage
2. Fetch single articles for detail pages
3. Create new articles (admin interface)
4. Update existing articles (admin interface)
5. Delete articles (admin interface)

Example frontend code:
```typescript
// lib/api/articles.ts
export async function getArticles() {
  const response = await fetch('http://localhost:8000/articles');
  return response.json();
}

export async function getArticle(id: number) {
  const response = await fetch(`http://localhost:8000/articles/${id}`);
  return response.json();
}
```

## Troubleshooting

### Database Locked
- SQLite doesn't handle concurrent writes well
- For production, use PostgreSQL

### Port 8000 Already in Use
```bash
uvicorn main:app --reload --port 8001
```

### Import Errors
Make sure you're in the backend directory:
```bash
cd backend
pip install -r requirements.txt
```

## Need Help?

- Check the full API documentation: http://localhost:8000/docs
- See detailed API docs: [API_DOCUMENTATION.md](../API_DOCUMENTATION.md)
- Backend README: [backend/README.md](README.md)
