# FastAPI Backend

A simple FastAPI backend application with a `/hello` endpoint.

## Files

- **`main.py`** - FastAPI application with a `/hello` endpoint that returns "hello"
- **`requirements.txt`** - Python dependencies (FastAPI and Uvicorn)
- **`Dockerfile`** - Docker configuration to containerize the application
- **`.dockerignore`** - Excludes unnecessary files from Docker builds

## How to Run

### Using Docker

```bash
# Build the Docker image
docker build -t fastapi-backend ./backend

# Run the container
docker run -p 8000:8000 fastapi-backend
```

### Without Docker (Local Development)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Endpoints

Once running, you can access:

- **Hello endpoint**: http://localhost:8000/hello - Returns the string `"hello"`
- **API docs**: http://localhost:8000/docs - FastAPI's automatic interactive documentation
- **Alternative API docs**: http://localhost:8000/redoc - ReDoc documentation

## Requirements

- Python 3.11+
- FastAPI 0.104.1
- Uvicorn 0.24.0

## Docker Details

- **Base Image**: python:3.11-slim
- **Exposed Port**: 8000
- **Working Directory**: /app
