# App Directory

Next.js App Router pages and API routes.

## Structure

### `/` (root)

- `page.tsx` - Homepage with featured articles and category sections
- `layout.tsx` - Root layout with Header/Footer
- `globals.css` - Global styles and Tailwind imports

### `/blog/[slug]`

- `page.tsx` - Individual blog article page
  Dynamic route for article slugs

### `/category/[category]`

- `page.tsx` - Category listing page
  Filters articles by category (Nourishment, Restoration, Mindset, Relationships, Vitality)

### `/search`

- `page.tsx` - AI-powered search interface
  Dedicated search page with streaming responses

### `/api`

Next.js API routes (if needed for server-side operations):

- Could proxy requests to FastAPI backend
- Handle authentication, session management
- Server-side caching
