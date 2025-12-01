# Deploy to Google Cloud Run

## ✅ What's Fixed

The backend now properly:
- Listens on Cloud Run's required PORT (8080)
- Has health check endpoints (`/` and `/health`)
- Uses environment variable PORT for flexibility

## 🚀 Deploy Backend to Cloud Run

### Step 1: Build and Push Docker Image

```bash
# Set your project ID
export PROJECT_ID=your-project-id

# Configure Docker for Google Cloud
gcloud auth configure-docker

# Build the backend image
cd backend
docker build -t gcr.io/$PROJECT_ID/total-life-backend:latest .

# Push to Google Container Registry
docker push gcr.io/$PROJECT_ID/total-life-backend:latest
```

### Step 2: Deploy to Cloud Run

```bash
gcloud run deploy total-life-backend \
  --image gcr.io/$PROJECT_ID/total-life-backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars="GOOGLE_API_KEY=AIzaSyAvQjitrTJnSRcofU6U-1wSZD7sARNLCkQ,GEMINI_MODEL=gemini-2.0-flash" \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10
```

### Step 3: Test the Deployment

```bash
# Get the service URL
export BACKEND_URL=$(gcloud run services describe total-life-backend --region us-central1 --format 'value(status.url)')

# Test health endpoint
curl $BACKEND_URL/health

# Test chat endpoint
curl -X POST $BACKEND_URL/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are the benefits of exercise?"}'
```

## 🌐 Deploy Frontend to Cloud Run

### Step 1: Build Frontend Image

```bash
cd ../frontend

# Build with backend URL
docker build \
  --build-arg VITE_API_URL=$BACKEND_URL \
  --build-arg VITE_GOOGLE_API_KEY=AIzaSyAvQjitrTJnSRcofU6U-1wSZD7sARNLCkQ \
  --build-arg VITE_SUPABASE_URL=https://okcybmjqytrpnpxjffva.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rY3libWpxeXRycG5weGpmZnZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NDYyMzUsImV4cCI6MjA4MDEyMjIzNX0.zC0bKqRwHX2T9Z_gmr55zcPIgG-iKoHhvb4rfFaMzu0 \
  -t gcr.io/$PROJECT_ID/total-life-frontend:latest .

docker push gcr.io/$PROJECT_ID/total-life-frontend:latest
```

### Step 2: Deploy Frontend

```bash
gcloud run deploy total-life-frontend \
  --image gcr.io/$PROJECT_ID/total-life-frontend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi \
  --cpu 1 \
  --max-instances 10
```

## 🔧 Environment Variables

### Backend Required:
- `GOOGLE_API_KEY` - For Gemini AI chat
- `GEMINI_MODEL` - (Optional) Default: gemini-2.0-flash

### Frontend Build Args:
- `VITE_API_URL` - Backend Cloud Run URL
- `VITE_GOOGLE_API_KEY` - For text-to-speech
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key

## 📊 Health Checks

Cloud Run automatically checks these endpoints:
- `GET /` - Root health check
- `GET /health` - Explicit health check

Both return `{"status": "ok"}` when healthy.

## 💰 Cost Estimate

**Backend:**
- 512 MB RAM, 1 CPU
- ~100 requests/day = **~$0.50/month**

**Frontend:**
- 256 MB RAM, 1 CPU
- Static serving via nginx = **~$0.30/month**

**Total: ~$0.80/month** (plus API costs)

## 🐛 Troubleshooting

### "Container failed to start"
- ✅ Fixed: Backend now listens on PORT environment variable
- Check logs: `gcloud run services logs read total-life-backend --region us-central1`

### "Health check failed"
- Test: `curl https://your-service-url.run.app/health`
- Should return: `{"status": "ok"}`

### "502 Bad Gateway"
- Backend isn't responding
- Check environment variables are set
- Check API key is valid

### Frontend can't reach backend
- Update `VITE_API_URL` in frontend build
- Ensure backend allows CORS (already configured)

## 🔄 Update Deployment

To update after code changes:

```bash
# Backend
cd backend
docker build -t gcr.io/$PROJECT_ID/total-life-backend:latest .
docker push gcr.io/$PROJECT_ID/total-life-backend:latest
gcloud run services update total-life-backend --region us-central1

# Frontend
cd frontend
docker build --build-arg VITE_API_URL=$BACKEND_URL -t gcr.io/$PROJECT_ID/total-life-frontend:latest .
docker push gcr.io/$PROJECT_ID/total-life-frontend:latest
gcloud run services update total-life-frontend --region us-central1
```

## 🎯 Quick Deploy Script

Save as `deploy.sh`:

```bash
#!/bin/bash

PROJECT_ID="your-project-id"
REGION="us-central1"

# Backend
echo "Deploying backend..."
cd backend
docker build -t gcr.io/$PROJECT_ID/total-life-backend:latest .
docker push gcr.io/$PROJECT_ID/total-life-backend:latest
gcloud run deploy total-life-backend \
  --image gcr.io/$PROJECT_ID/total-life-backend:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars="GOOGLE_API_KEY=AIzaSyAvQjitrTJnSRcofU6U-1wSZD7sARNLCkQ"

# Get backend URL
BACKEND_URL=$(gcloud run services describe total-life-backend --region $REGION --format 'value(status.url)')

# Frontend
echo "Deploying frontend..."
cd ../frontend
docker build \
  --build-arg VITE_API_URL=$BACKEND_URL \
  --build-arg VITE_GOOGLE_API_KEY=AIzaSyAvQjitrTJnSRcofU6U-1wSZD7sARNLCkQ \
  --build-arg VITE_SUPABASE_URL=https://okcybmjqytrpnpxjffva.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=your-key-here \
  -t gcr.io/$PROJECT_ID/total-life-frontend:latest .
docker push gcr.io/$PROJECT_ID/total-life-frontend:latest
gcloud run deploy total-life-frontend \
  --image gcr.io/$PROJECT_ID/total-life-frontend:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080

echo "Deployment complete!"
echo "Backend: $BACKEND_URL"
echo "Frontend: $(gcloud run services describe total-life-frontend --region $REGION --format 'value(status.url)')"
```

Make executable and run:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

Your backend is now Cloud Run ready! 🚀
