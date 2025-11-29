# Total Life Daily - Backend

FastAPI backend with AI-powered wellness chatbot and article management system.

## Features

- **AI Wellness Chatbot**: RAG-based chatbot powered by Google Gemini and PubMed research
- **Article Management**: Full CRUD API for managing blog articles in markdown format
- **Database**: SQLite database with SQLAlchemy ORM (easily switchable to PostgreSQL)

## Project Structure

```
backend/
├── main.py              # FastAPI application and API routes
├── search_agent.py      # LangGraph RAG pipeline for wellness chatbot
├── database.py          # Database configuration and session management
├── models.py            # SQLAlchemy database models
├── schemas.py           # Pydantic schemas for request/response validation
├── crud.py              # Database CRUD operations
├── requirements.txt     # Python dependencies
├── test_articles.py     # Test script for article CRUD operations
├── Dockerfile           # Docker configuration
└── .gitignore           # Git ignore rules
```

## Setup

### Prerequisites

- Python 3.11+
- Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Installation

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Required for AI chatbot
GOOGLE_API_KEY=your_google_api_key_here

# Optional: specify Gemini model (default: gemini-2.0-flash)
GEMINI_MODEL=gemini-2.0-flash

# Optional: NCBI API key for higher PubMed rate limits
NCBI_API_KEY=your_ncbi_api_key_here
```

## Running the Server

### Local Development

```bash
# Run with auto-reload
uvicorn main:app --reload

# Or use Python directly
python main.py
```

The server will start at `http://localhost:8000`

- **API Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

### Using Docker

```bash
# Build and run with Docker Compose (from project root)
docker-compose up -d backend

# Or build manually
docker build -t fastapi-backend .
docker run -p 8000:8000 --env-file .env fastapi-backend
```

## API Endpoints

### Wellness Chatbot

- `POST /chat` - Ask wellness questions and get AI-generated answers with research citations

### Article Management (CRUD)

- `POST /articles` - Create a new article
- `GET /articles` - Get all articles (with pagination)
- `GET /articles/{article_id}` - Get a specific article
- `PUT /articles/{article_id}` - Update an article
- `DELETE /articles/{article_id}` - Delete an article

See [API_DOCUMENTATION.md](../API_DOCUMENTATION.md) for detailed endpoint documentation.

## Database

### SQLite (Default)

The application uses SQLite by default, which creates a `articles.db` file in the backend directory. This is perfect for development and small deployments.

**Database Schema:**
```sql
CREATE TABLE articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_markdown TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);
```

### Switching to PostgreSQL (Production)

For production, you can easily switch to PostgreSQL:

1. Install PostgreSQL driver:
   ```bash
   pip install psycopg2-binary
   ```

2. Update `database.py`:
   ```python
   SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/dbname"
   
   engine = create_engine(SQLALCHEMY_DATABASE_URL)
   # Remove the connect_args parameter (only needed for SQLite)
   ```

3. Set environment variable:
   ```env
   DATABASE_URL=postgresql://user:password@localhost/dbname
   ```

## Testing

### Manual Testing

```bash
# Start the server
uvicorn main:app --reload

# In another terminal, run the test script
python test_articles.py
```

This will test all CRUD operations (create, read, update, delete).

### Using cURL

```bash
# Create an article
curl -X POST http://localhost:8000/articles \
  -H "Content-Type: application/json" \
  -d '{"article_markdown": "# Test Article\n\nThis is a test."}'

# Get all articles
curl http://localhost:8000/articles

# Get specific article
curl http://localhost:8000/articles/1

# Update article
curl -X PUT http://localhost:8000/articles/1 \
  -H "Content-Type: application/json" \
  -d '{"article_markdown": "# Updated Article\n\nNew content."}'

# Delete article
curl -X DELETE http://localhost:8000/articles/1
```

## Development Notes

### Database Migrations

The application automatically creates tables on startup using:
```python
Base.metadata.create_all(bind=engine)
```

For production, consider using Alembic for proper database migrations:
```bash
pip install alembic
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### Adding New Fields

To add fields to articles (e.g., images, tags, categories):

1. Update `models.py` (SQLAlchemy model)
2. Update `schemas.py` (Pydantic schemas)
3. Update `crud.py` if needed
4. The database will auto-update on next run (or create migration with Alembic)

## Troubleshooting

### Database Locked Error

If you see "database is locked" errors with SQLite:
- Make sure only one process is accessing the database
- Consider switching to PostgreSQL for production

### Import Errors

If you get import errors like `ModuleNotFoundError`:
```bash
# Make sure you're in the backend directory
cd backend

# Reinstall dependencies
pip install -r requirements.txt
```

### Port Already in Use

If port 8000 is already in use:
```bash
# Use a different port
uvicorn main:app --reload --port 8001
```

## License

Copyright 2025 Total Life. All Rights Reserved.
