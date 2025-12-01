# Supabase Quick Start Guide

## ✅ What's Been Done

Your frontend now uses **Supabase directly** instead of the backend API for all article operations:

- ✅ `TestArticlesPage.tsx` - Full CRUD operations via Supabase
- ✅ `HomePage.tsx` - Fetches articles from Supabase
- ✅ `BlogPostPage.tsx` - Fetches individual articles from Supabase
- ✅ `CategoryPage.tsx` - Fetches category articles from Supabase
- ✅ Backend only handles AI chat (no database needed!)

---

## 🔧 Setup Steps

### Step 1: Fix Your Supabase Anon Key

**CRITICAL:** Your `.env` file has an incomplete Supabase key!

1. Go to https://supabase.com/dashboard
2. Select your project: `okcybmjqytrpnpxjffva`
3. Go to **Settings** → **API**
4. Copy the **complete** `anon/public` key (it should be ~200+ characters)
5. Update `frontend/.env`:

```env
VITE_SUPABASE_URL=https://okcybmjqytrpnpxjffva.supabase.co
VITE_SUPABASE_ANON_KEY=<PASTE_COMPLETE_KEY_HERE>
```

### Step 2: Run the SQL Schema

1. In Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Copy the contents of `frontend/supabase-schema.sql`
4. Paste and click **Run**

This creates:
- `articles` table
- `article_likes` table
- `comments` table
- `comment_likes` table
- Indexes for performance
- Row Level Security policies

### Step 3: Add Test Articles

#### Option A: Via Supabase Dashboard (Easy)

1. Go to **Table Editor** → **articles**
2. Click **Insert row** → **Insert row** (not from spreadsheet)
3. Fill in:
   - `slug`: `test-article-1`
   - `title`: `Test Article Title`
   - `content`: `This is test content in **markdown**!`
   - `category`: Select from dropdown (e.g., `nourishment`)
   - `excerpt`: `A short summary`
   - `is_featured`: true/false
   - `is_hero`: true/false (only ONE should be hero)
4. Click **Save**

#### Option B: Via SQL (Faster for Multiple Articles)

In Supabase SQL Editor, run:

```sql
INSERT INTO articles (slug, title, excerpt, content, category, is_featured, is_hero, featured_image_url, featured_image_alt)
VALUES 
(
  'healthy-eating-tips',
  'Top 5 Healthy Eating Tips for Longevity',
  'Discover simple dietary changes that can add years to your life.',
  '# Top 5 Healthy Eating Tips

## 1. Eat More Plants
Focus on vegetables, fruits, whole grains, and legumes.

## 2. Reduce Processed Foods
Minimize packaged snacks and fast food.

## 3. Stay Hydrated
Drink plenty of water throughout the day.

## 4. Practice Portion Control
Listen to your body''s hunger cues.

## 5. Enjoy Your Food
Take time to savor your meals.',
  'nourishment',
  true,
  true,
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
  'Healthy colorful meal with vegetables'
),
(
  'sleep-better-tonight',
  'Sleep Better Tonight: 7 Science-Backed Tips',
  'Improve your sleep quality with these proven strategies.',
  '# Sleep Better Tonight

Quality sleep is essential for health and longevity.

## Tips:
- Keep a consistent schedule
- Create a dark, cool bedroom
- Avoid screens before bed
- Try relaxation techniques
- Limit caffeine after 2 PM',
  'restoration',
  true,
  false,
  'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80',
  'Peaceful bedroom for restful sleep'
);
```

### Step 4: Test the Application

1. **Install dependencies** (if not done):
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   ```

2. **Start dev server**:
   ```bash
   npm run dev
   ```

3. **Visit pages**:
   - Homepage: http://localhost:5173/ (should show articles)
   - Test CRUD: http://localhost:5173/test-articles
   - Individual article: http://localhost:5173/blog/healthy-eating-tips

---

## 🎯 Test CRUD Operations

Visit: http://localhost:5173/test-articles

You can now:
- ✅ **Create** new articles with the form
- ✅ **Read** all articles in the list
- ✅ **Update** articles by clicking "Edit"
- ✅ **Delete** articles by clicking "Delete"

All operations go directly to Supabase (no backend needed!)

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Restart your dev server after updating `.env`
- Make sure the key is complete (not truncated)

### "Row level security policy violation"
- Run the complete SQL schema from `supabase-schema.sql`
- The schema includes RLS policies to allow public read/write

### "No articles showing"
- Add test articles using SQL or dashboard
- Check browser console for errors
- Verify Supabase URL and key are correct

### Articles still loading but empty
- You need to add at least one article to the database
- Use Option A or B above to insert test data

---

## 📁 What Changed

### Files Updated:
- ✅ `frontend/src/pages/TestArticlesPage.tsx` - Uses Supabase CRUD functions
- ✅ `frontend/src/lib/api/articles.ts` - Proxies to Supabase queries
- ✅ `frontend/src/lib/supabase-queries.ts` - Added CRUD functions

### Files Unchanged (already using api/articles.ts):
- ✅ `HomePage.tsx`
- ✅ `BlogPostPage.tsx`
- ✅ `CategoryPage.tsx`

### Backend:
- ✅ Still works for `/chat` endpoint (AI chatbot)
- ❌ No article endpoints needed

---

## 🚀 Next Steps

1. Fix the `.env` Supabase key
2. Run the SQL schema
3. Add 2-3 test articles
4. Test CRUD operations at `/test-articles`
5. Deploy when ready!

---

## 📞 Need Help?

Check these in order:
1. Browser console for JavaScript errors
2. Supabase Dashboard → Logs → Error logs
3. Network tab to see API requests
4. Verify `.env` variables are loaded (check `import.meta.env` in console)
