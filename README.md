# Total Life Daily

A full-stack application with FastAPI backend and future frontend integration.

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

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Individual Services

#### Backend Only

```bash
# Build and run
docker-compose up -d backend

# Or build manually
cd backend
docker build -t fastapi-backend .
docker run -p 8000:8000 fastapi-backend
```

## Endpoints

### Backend (Port 8000)

- **Hello endpoint**: http://localhost:8000/hello
- **API docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Frontend (Port 3000) - Coming Soon

- **App**: http://localhost:3000

## Development

### Backend

See [backend/README.md](./backend/README.md) for detailed backend documentation.

### Frontend

Coming soon...

## Adding Frontend in the Future

When you're ready to add a frontend service:

1. **Create a frontend folder** with your frontend code and Dockerfile
2. **Uncomment the frontend section** in `docker-compose.yml`:
   ```yaml
   frontend:
     build:
       context: ./frontend
       dockerfile: Dockerfile
     ports:
       - "3000:3000"
     container_name: react-frontend
     restart: unless-stopped
     depends_on:
       - backend
   ```
3. **Run Docker Compose** to start both services:
   ```bash
   docker-compose up -d --build
   ```

Both services will automatically work together on the same Docker network!

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

## Requirements

- Docker
- Docker Compose

## License

MIT
