# Total Life Daily

A full-stack health and wellness platform with AI-powered chatbot and article management.

## 🚀 Quick Start (Docker)

```bash
# 1. Clone the repository
git clone https://github.com/survival-totallife/total-life-daily.git
cd total-life-daily

# 2. Set up environment variables
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY

# 3. Start everything with Docker
docker-compose up --build
```

**Or use the start script:**
- Windows: Double-click `start.bat`
- Mac/Linux: `chmod +x start.sh && ./start.sh`

**That's it!** Access the application:
- **Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs

**Test Pages** (temporary, for functionality verification):
- Article CRUD: http://localhost:3000/test-articles
- AI Chat: http://localhost:3000/test-chat

📖 See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

---

## Project Structure

```
total-life-daily/
├── backend/           # FastAPI backend service
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md
├── frontend/          # Frontend service (to be added)
└── docker-compose.yml # Docker orchestration
```

## Features

- **AI Wellness Chatbot**: RAG-powered chatbot using Google Gemini and PubMed research
- **Article Management**: Full CRUD API for markdown articles
- **SQLite Database**: Lightweight storage with easy PostgreSQL migration
- **Docker Ready**: One command to start everything

## Docker Commands

```bash
# Start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up --build

# Remove database (clean start)
docker-compose down -v
```

## Local Development (without Docker)

If you prefer to run services individually:

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Endpoints

### Backend (Port 8000)

- **Hello endpoint**: http://localhost:8000/hello
- **Chat endpoint**: http://localhost:8000/chat
- **API docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Frontend (Port 3000)

- **App**: http://localhost:3000

## Development

### Backend

See [backend/README.md](./backend/README.md) for detailed backend documentation.

### Frontend

See [frontend/README.md](./frontend/README.md) for detailed frontend documentation.

## Running with Docker

### Quick Start (Both Services)

```bash
# Start both backend and frontend
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Individual Services

#### Backend Only

```bash
docker-compose up -d backend
```

#### Frontend Only

```bash
docker-compose up -d frontend
```

### Rebuild After Code Changes

```bash
# Rebuild and restart all services
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

## Docker Commands

```bash
# Start all services
docker-compose up -d

# Rebuild and start
docker-compose up -d --build

# View running containers
docker-compose ps

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down

# Remove all containers and volumes
docker-compose down -v
```

## Environment Variables

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env

# Edit and add your Google API key
GOOGLE_API_KEY=your_google_api_key_here
```

Get your Google Gemini API key: https://aistudio.google.com/apikey

## Requirements

- Docker
- Docker Compose

## Project Structure

```
total-life-daily/
├── backend/              # FastAPI backend
│   ├── main.py          # API endpoints
│   ├── database.py      # Database config
│   ├── models.py        # SQLAlchemy models
│   ├── crud.py          # CRUD operations
│   └── search_agent.py  # AI chatbot logic
├── frontend/            # Next.js frontend
│   └── app/
│       ├── page.tsx              # Homepage
│       ├── test-articles/        # Article CRUD test
│       └── test-chat/            # Chat test
├── docker-compose.yml   # Docker orchestration
└── .env                 # Environment variables
```

## License

MIT
