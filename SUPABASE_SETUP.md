# Supabase Setup Guide

This guide will help you set up Supabase for your Total Life Daily project.

## Step 1: Create Supabase Account & Project

1. Go to **https://supabase.com**
2. Click **"Start your project"** and sign up (use GitHub for easy signup)
3. Click **"New Project"**
4. Fill in:
   - **Name:** `total-life-daily`
   - **Database Password:** Choose a strong password (save it!)
   - **Region:** Choose closest to you (e.g., `US East`)
5. Click **"Create new project"**
6. ⏳ Wait 2-3 minutes for setup

## Step 2: Create Database Tables

1. In your Supabase Dashboard → **SQL Editor**
2. Click **"New Query"**
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click **"Run"** or press `Ctrl+Enter`

This creates all your tables: articles, comments, likes, etc.

## Step 3: Get Your API Credentials

1. In Supabase Dashboard → **Settings** → **API**
2. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

## Step 4: Configure Frontend Environment Variables

1. In your project, copy the frontend `.env.example` to `.env`:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Edit `frontend/.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY-HERE
   ```

## Step 5: Install Dependencies

```bash
cd frontend
npm install
```

This will install the `@supabase/supabase-js` package.

## Step 6: Add Articles via Supabase Dashboard

Since you're starting fresh, you can add articles directly in Supabase:

1. Go to **Table Editor** → **articles**
2. Click **"Insert row"**
3. Fill in the fields:
   - `slug`: unique URL-friendly identifier (e.g., `mental-health-tips`)
   - `title`: Article title
   - `content`: Article content (supports markdown)
   - `category`: One of: nourishment, restoration, mindset, relationships, vitality
   - `excerpt`: Short summary (optional)
   - `is_featured`: true/false
   - `is_hero`: true/false (only one should be hero)
   - Other fields are auto-populated

## Step 7: Update Your Components (Already Done!)

The following files have been created/updated:
- ✅ `frontend/src/lib/supabase.ts` - Supabase client setup
- ✅ `frontend/src/lib/supabase-queries.ts` - All database query functions
- ✅ `frontend/package.json` - Added Supabase dependency
- ✅ `frontend/.env.example` - Updated with Supabase env vars

## Step 8: Update Your Frontend Components

You need to update your existing React components to use the new Supabase functions instead of the backend API.

### Example: Update Homepage to use Supabase

**Before (using backend API):**
```typescript
const response = await fetch(`${API_URL}/homepage`)
const data = await response.json()
```

**After (using Supabase):**
```typescript
import { getHomepageData } from '@/lib/supabase-queries'

const data = await getHomepageData()
```

### Available Functions

All functions are in `frontend/src/lib/supabase-queries.ts`:

**Articles:**
- `getArticles()` - Get all articles
- `getArticleBySlug(slug)` - Get single article
- `getHeroArticle()` - Get hero article
- `getFeaturedArticles(limit)` - Get featured articles
- `getArticlesByCategory(category, limit)` - Get articles by category
- `getHomepageData()` - Get all homepage data at once

**Likes:**
- `getArticleLikesCount(articleId)` - Get like count
- `toggleArticleLike(articleId, userId)` - Like/unlike article

**Comments:**
- `getComments(articleId)` - Get all comments
- `createComment(articleId, userId, displayName, content)` - Add comment
- `deleteComment(commentId, userId)` - Delete comment
- `toggleCommentLike(commentId, userId)` - Like/unlike comment

## Step 9: Deploy to GCP

### Backend Deployment (AI Chat Only)

Your backend now only needs to handle AI chat. No database configuration needed!

```bash
gcloud run deploy total-life-backend \
  --image gcr.io/YOUR-PROJECT-ID/total-life-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars="GOOGLE_API_KEY=your-gemini-key"
```

No Cloud SQL needed! No DATABASE_URL needed!

### Frontend Deployment

```bash
gcloud builds submit \
  --tag gcr.io/YOUR-PROJECT-ID/total-life-frontend \
  --build-arg VITE_API_URL=https://your-backend-url.run.app \
  --build-arg VITE_SUPABASE_URL=https://your-project.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=your-anon-key \
  ./frontend

gcloud run deploy total-life-frontend \
  --image gcr.io/YOUR-PROJECT-ID/total-life-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 80
```

## Benefits of This Setup

✅ **No database deployment issues** - Supabase handles it
✅ **Free tier is generous** - 500MB database, unlimited API requests
✅ **Real-time updates** - Articles appear instantly
✅ **Simpler backend** - Only handles AI chat
✅ **Easy content management** - Add articles via Supabase UI
✅ **Scalable** - Handles growth automatically

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `frontend/.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your dev server after adding env vars

### "Failed to fetch"
- Check that your Supabase URL is correct
- Verify your anon key is correct
- Check browser console for CORS errors

### "Row level security" errors
- Make sure you ran the full `supabase-schema.sql` script
- Check that RLS policies were created (they're in the SQL file)

## Next Steps

1. Create your Supabase project
2. Run the SQL schema
3. Add your credentials to `.env`
4. Run `npm install` in frontend
5. Update your React components to use Supabase functions
6. Test locally
7. Deploy to GCP (no Cloud SQL needed!)
