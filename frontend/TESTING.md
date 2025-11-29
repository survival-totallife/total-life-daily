# Testing the Frontend

## Quick Setup (Docker - Recommended)

### Start Everything with Docker Compose

```bash
# From the project root directory
docker-compose up --build
```

That's it! Both services will start automatically:
- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs

### View Logs

```bash
# View all logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend

# View frontend logs only
docker-compose logs -f frontend
```

### Stop Services

```bash
# Stop services
docker-compose down

# Stop and remove volumes (deletes database)
docker-compose down -v
```

---

## Alternative: Local Development Setup

If you prefer to run without Docker:

### 1. Backend Setup (Terminal 1)

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "GOOGLE_API_KEY=your_key_here" > .env

# Start the backend
uvicorn main:app --reload
```

Backend will run at: http://localhost:8000

### 2. Frontend Setup (Terminal 2)

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start the frontend
npm run dev
```

Frontend will run at: http://localhost:3000

## Test Pages

### Homepage
http://localhost:3000
- Links to both test pages

### Article CRUD Test
http://localhost:3000/test-articles
- Create new articles with markdown
- View all articles
- Edit existing articles
- Delete articles
- Real-time updates

### Chat Test
http://localhost:3000/test-chat
- Ask wellness questions
- Get AI-generated responses
- View PubMed research sources
- Example questions provided

## What to Test

### Article CRUD (`/test-articles`)

✅ **Create**: 
- Enter markdown content (try using `# Headers`, `**bold**`, `*italic*`)
- Click "Create Article"
- Should appear in the list immediately

✅ **Read**:
- See all articles in the right panel
- View truncated content preview

✅ **Update**:
- Click "Edit" on any article
- Modify the markdown content
- Click "Update Article"
- See the updated timestamp

✅ **Delete**:
- Click "Delete" on any article
- Confirm deletion
- Article disappears from list

### Chat (`/test-chat`)

✅ **Ask Questions**:
- Type a wellness question or click example
- Click "Send Question" or press Enter
- Wait 5-10 seconds for response

✅ **View Response**:
- Read AI-generated answer
- See research sources (if found)
- Click PMID links to view articles on PubMed

## Expected Behavior

### Article CRUD
- ✅ Articles persist in database (survive server restart)
- ✅ Timestamps auto-update on modification
- ✅ Markdown content stored as-is (no rendering yet)
- ✅ Immediate UI updates after operations

### Chat
- ✅ Questions processed through LangGraph pipeline
- ✅ PubMed search for relevant research
- ✅ Citations in format: [Source: PMID]
- ✅ General response if no research found
- ✅ 5-10 second response time is normal

## Troubleshooting

### "Failed to fetch" Error
**Problem**: Cannot connect to backend
**Solution**: 
- Check backend is running at http://localhost:8000
- Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000`
- Check browser console for CORS errors

### "Article not found" (404)
**Problem**: Article was deleted or doesn't exist
**Solution**: 
- Create a new article
- Refresh the page

### Chat Returns Empty Response
**Problem**: Missing Google API key
**Solution**:
- Add `GOOGLE_API_KEY` to `backend/.env`
- Get key from: https://aistudio.google.com/apikey
- Restart backend server

### CORS Error
**Problem**: Cross-origin request blocked
**Solution**: Backend CORS is set to `*` so this shouldn't happen. If it does:
- Check backend is running
- Check the API URL in frontend matches backend URL
- Try restarting both servers

## Sample Test Data

### Sample Articles to Create

**Article 1: Simple**
```markdown
# Getting Started with Wellness

Welcome to your wellness journey! This is a simple article with some **bold** text.
```

**Article 2: Complex**
```markdown
# The Five Pillars of Total Life

## 1. Nourishment
- Eat whole foods
- Stay hydrated

## 2. Restoration
- Get 7-9 hours of sleep
- Practice recovery

## 3. Mindset
- Daily meditation
- Positive thinking

## 4. Relationships
- Connect with others
- Build community

## 5. Vitality
- Move your body
- Stay active

> Remember: Small steps lead to big changes!
```

### Sample Chat Questions

- "What are the benefits of omega-3?"
- "How does vitamin D support immunity?"
- "Is turmeric good for inflammation?"
- "What helps with sleep quality?"
- "Does exercise help with anxiety?"

## Notes

- These are temporary test pages for functionality verification
- No styling applied (intentionally minimal)
- Real UI will be built later with proper components
- Database file created at `backend/articles.db`
- Articles persist between server restarts

## Success Criteria

### Article CRUD ✅
- [x] Can create articles
- [x] Can view all articles
- [x] Can edit articles
- [x] Can delete articles
- [x] Timestamps work correctly
- [x] Data persists in database

### Chat ✅
- [x] Can ask questions
- [x] Receives AI responses
- [x] Shows PubMed sources
- [x] Handles errors gracefully
- [x] Response time acceptable

## Ready for Next Steps

Once both test pages work correctly:
1. ✅ Backend CRUD is validated
2. ✅ Backend Chat is validated
3. ✅ Frontend can communicate with backend
4. ✅ Database is working
5. → Ready to build real UI components
