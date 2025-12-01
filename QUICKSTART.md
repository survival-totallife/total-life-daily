# Total Life Daily - Quick Start

Welcome! This guide will get you running in under 2 minutes.

## Prerequisites

- Docker Desktop installed and running
- Git (to clone the repository)

## Setup Steps

### 1. Clone and Navigate

```bash
git clone https://github.com/survival-totallife/total-life-daily.git
cd total-life-daily
git checkout vite-frontend   # Switch to the new Vite frontend branch
```

### 2. Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file and add your Google API key
# Get your key at: https://aistudio.google.com/apikey
```

Edit `.env` file:
```env
GOOGLE_API_KEY=your_actual_api_key_here
```

### 3. Start Everything with Docker

```bash
docker-compose up --build -d
```

First time will take 2-3 minutes to build. Subsequent starts are faster.

### 4. Access the Application

Once containers are running (check with `docker-compose ps`):

- **Frontend Homepage**: http://localhost:3000
- **Article CRUD Test**: http://localhost:3000/test-articles
- **Chat Test**: http://localhost:3000/test-chat
- **API Documentation**: http://localhost:8000/docs

## What to Test

### Article CRUD Test (http://localhost:3000/test-articles)

1. Create an article with markdown content
2. View all articles in the list
3. Edit an article by clicking "Edit"
4. Delete an article by clicking "Delete"

### Chat Test (http://localhost:3000/test-chat)

1. Ask a wellness question (or use examples)
2. Wait 5-10 seconds for AI response
3. View PubMed research sources
4. Click source links to see research

## Useful Commands

```bash
# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Rebuild after code changes
docker-compose up --build -d

# Stop and remove database
docker-compose down -v
```

## Troubleshooting

### "Cannot connect to backend"
- Make sure both containers are running: `docker-compose ps`
- Check logs: `docker-compose logs backend`
- Wait a bit longer - first startup takes time

### "Chat returns errors"
- Check that `GOOGLE_API_KEY` is set in `.env` file
- Restart containers: `docker-compose restart`
- Check backend logs: `docker-compose logs backend`

### 404 on page refresh
- This is handled by nginx SPA routing
- If issue persists, rebuild: `docker-compose up --build -d frontend`

### Port already in use
- Change ports in `docker-compose.yml`
- Or stop the conflicting service

### npm install fails (local dev)
- Use `npm install --legacy-peer-deps` for React 19 compatibility

## Local Development (Without Docker)

### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Tech Stack

| Service | Technology | Docker Image |
|---------|------------|--------------|
| Frontend | Vite + React 19 + nginx | ~25 MB |
| Backend | FastAPI (Python) | ~90 MB |

## Development Workflow

```bash
# Make code changes
# Rebuild and restart
docker-compose up --build -d

# Or for faster iteration (specific service)
docker-compose up --build -d frontend
docker-compose up --build -d backend
```

## Need Help?

- API Documentation: http://localhost:8000/docs
- Check `frontend/README.md` for frontend architecture
- Check `backend/README.md` for backend details
- Check `API_DOCUMENTATION.md` for full API reference
