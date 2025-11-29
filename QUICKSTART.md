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
docker-compose up --build
```

First time will take 2-3 minutes to build. Subsequent starts are faster.

### 4. Access the Application

Once you see "Application startup complete" in the logs:

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
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Rebuild after code changes
docker-compose up --build

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

### Port already in use
- Change ports in `docker-compose.yml`
- Or stop the conflicting service

### Frontend shows build errors
- This is normal during initial build
- Wait for "compiled successfully" message
- Refresh your browser

## Next Steps

Once you've verified both features work:

1. Articles are stored in `backend/articles.db`
2. Database persists between restarts
3. Ready to build real UI components

## Development Workflow

```bash
# Make code changes
# Rebuild and restart
docker-compose up --build

# Or for faster iteration (backend only)
docker-compose up --build backend
docker-compose restart frontend
```

## Need Help?

- API Documentation: http://localhost:8000/docs
- Check `frontend/TESTING.md` for detailed testing guide
- Check `backend/QUICKSTART.md` for backend details
