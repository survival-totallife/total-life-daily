# Total Life Daily

A full-stack health and wellness platform with AI-powered chatbot and article management.

## 🚀 Quick Start (Docker)

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

```bash
# 1. Clone the repository and switch to the vite-frontend branch
git clone https://github.com/survival-totallife/total-life-daily.git
cd total-life-daily
git checkout vite-frontend

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
- **Backend API**: http://localhost:8000/docs

📖 See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Vite + React 19 | Fast SPA with client-side routing |
| **Styling** | Tailwind CSS 4 + shadcn/ui | Utility-first CSS with accessible components |
| **Animations** | Framer Motion | Smooth page transitions and effects |
| **Data Fetching** | TanStack React Query | Caching, background updates, offline support |
| **Routing** | React Router 7 | Client-side navigation |
| **Backend** | FastAPI + Python | REST API with AI integration |
| **Database** | SQLite | Lightweight storage (PostgreSQL-ready) |
| **AI** | Google Gemini + PubMed | RAG-powered wellness chatbot |
| **Deployment** | Docker + nginx | Optimized container serving |

## Project Structure

```
total-life-daily/
├── frontend/              # Vite + React SPA
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # API, hooks, utilities
│   │   └── types/        # TypeScript types
│   ├── Dockerfile        # Multi-stage build → nginx
│   └── nginx.conf        # Production server config
├── backend/              # FastAPI backend
│   ├── main.py           # API endpoints
│   ├── search_agent.py   # AI chatbot logic
│   └── Dockerfile
└── docker-compose.yml    # Docker orchestration
```

## Features

- **5 Wellness Pillars**: Nourishment, Restoration, Mindset, Relationships, Vitality
- **AI Wellness Chatbot**: RAG-powered using Google Gemini + PubMed research
- **Article Management**: Full CRUD API for markdown articles
- **Responsive Design**: Mobile-first with smooth animations
- **SEO Ready**: Dynamic meta tags with react-helmet-async
- **Optimized Docker**: ~25MB frontend image with nginx

## Docker Commands

```bash
# Start all services (first time builds automatically)
docker-compose up -d

# View logs
docker-compose logs -f

# Rebuild after code changes
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build frontend

# Stop services
docker-compose down

# Clean restart (removes database)
docker-compose down -v && docker-compose up -d --build
```

## Local Development (without Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

## Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Required variables:
```env
GOOGLE_API_KEY=your_google_api_key_here
```

Get your Google Gemini API key: https://aistudio.google.com/apikey

## API Endpoints

### Backend (Port 8000)

| Endpoint | Description |
|----------|-------------|
| `GET /docs` | Interactive API documentation |
| `GET /articles` | List all articles |
| `GET /articles/{slug}` | Get article by slug |
| `POST /chat` | AI wellness chatbot |
| `GET /homepage` | Homepage data (featured + categories) |

### Frontend (Port 3000)

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, featured, categories |
| `/blog/{slug}` | Individual article page |
| `/category/{name}` | Category listing page |

## Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Getting started guide
- [frontend/README.md](./frontend/README.md) - Frontend architecture
- [backend/README.md](./backend/README.md) - Backend API details
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Full API reference

## License

MIT
