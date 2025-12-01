# Total Life Daily - Frontend

Vite + React frontend for the Total Life Daily health and wellness blog platform.

## Project Overview

A modern, responsive single-page application that mirrors the functionality
of [daily.totallife.com](https://daily.totallife.com/), featuring:

- Health and wellness blog articles
- AI-powered search with streaming responses
- Category-based content organization (5 pillars: Nourishment, Restoration, Mindset, Relationships, Vitality)
- Podcast episodes section
- Newsletter subscription

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Vite 6** | Fast build tool with HMR |
| **React 19** | UI library |
| **React Router 7** | Client-side routing |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | Pre-built accessible components |
| **Framer Motion** | Smooth animations |
| **TanStack Query 5** | Server state management |
| **react-helmet-async** | SEO meta tags |
| **nginx** | Production static serving |

## Project Structure

```
frontend/
├── src/
│   ├── main.tsx                 # Application entry point
│   ├── App.tsx                  # Root component with routes
│   ├── index.css                # Global styles + Tailwind
│   │
│   ├── pages/                   # Route page components
│   │   ├── HomePage.tsx
│   │   ├── BlogPostPage.tsx
│   │   ├── CategoryPage.tsx
│   │   ├── TestArticlesPage.tsx
│   │   ├── TestChatPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── components/              # React components (modular)
│   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   └── tabs.tsx
│   │   ├── common/              # Shared components
│   │   │   ├── PageTransition.tsx
│   │   │   └── ScrollReveal.tsx
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── blog/                # Blog-specific components
│   │   │   ├── ArticleContent.tsx
│   │   │   ├── ArticleEngagement.tsx
│   │   │   ├── ArticleHero.tsx
│   │   │   ├── CategorySection.tsx
│   │   │   ├── CommentsSection.tsx
│   │   │   ├── FeaturedSection.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   └── RelatedArticles.tsx
│   │   ├── category/            # Category page components
│   │   │   ├── CategoryArticlesGrid.tsx
│   │   │   ├── CategoryHero.tsx
│   │   │   └── CategoryPageWrapper.tsx
│   │   ├── search/              # AI search components
│   │   │   ├── AISearchModal.tsx
│   │   │   └── AISearchSection.tsx
│   │   ├── podcast/             # Podcast components
│   │   │   └── PodcastSection.tsx
│   │   └── forms/               # Form components
│   │       └── NewsletterSection.tsx
│   │
│   ├── lib/                     # Utilities and helpers
│   │   ├── api/                 # API client functions
│   │   │   ├── articles.ts
│   │   │   ├── engagement.ts
│   │   │   └── youtube.ts
│   │   ├── utils/               # Utility functions
│   │   │   └── cn.ts            # Class name utility
│   │   └── hooks/               # Custom React hooks
│   │       └── useAnonymousUser.ts
│   │
│   └── types/                   # TypeScript type definitions
│       ├── article.ts
│       ├── search.ts
│       ├── podcast.ts
│       └── common.ts
│
├── public/                      # Static assets
├── index.html                   # HTML template
├── vite.config.ts               # Vite configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── Dockerfile                   # Multi-stage build → nginx
├── nginx.conf                   # Production server config
└── .env.example                 # Environment template
```

## Development

### Prerequisites

- Node.js 18+ installed
- npm package manager

### Getting Started

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (use --legacy-peer-deps for React 19)
npm install --legacy-peer-deps

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

### Docker Development

From the project root:

```bash
# Start all services
docker-compose up -d

# Rebuild frontend after changes
docker-compose up -d --build frontend
```

The app will be available at `http://localhost:3000`

### Environment Variables

Create a `.env` file (for local development):

```env
# Backend API URL
VITE_API_URL=http://localhost:8000
```

For Docker, the environment is configured in `docker-compose.yml`.

## Routing

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `HomePage` | Hero, featured articles, categories |
| `/blog/:slug` | `BlogPostPage` | Individual article with SEO |
| `/category/:category` | `CategoryPage` | Category listing |
| `/test-articles` | `TestArticlesPage` | Article CRUD testing |
| `/test-chat` | `TestChatPage` | AI chatbot testing |
| `*` | `NotFoundPage` | 404 error page |

## Data Fetching

Uses TanStack React Query for:

- **Automatic caching**: Reduces redundant API calls
- **Background refetching**: Data stays fresh
- **Loading/error states**: Built-in state management
- **Stale-while-revalidate**: Fast perceived performance

Example:
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['article', slug],
  queryFn: () => getArticleBySlug(slug)
});
```

## SEO

Uses `react-helmet-async` for dynamic meta tags:

```tsx
<Helmet>
  <title>{article.title} | Total Life Daily</title>
  <meta name="description" content={article.summary} />
  <meta property="og:title" content={article.title} />
</Helmet>
```

## Backend Integration

The frontend communicates with a FastAPI backend at `http://localhost:8000`.

### API Endpoints Used:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/homepage` | GET | Homepage data (featured + categories) |
| `/articles` | GET | List all articles |
| `/articles/{slug}` | GET | Get article by slug |
| `/articles` | POST | Create new article |
| `/articles/{id}` | PUT | Update article |
| `/articles/{id}` | DELETE | Delete article |
| `/articles/category/{category}` | GET | Articles by category |
| `/chat` | POST | AI wellness chatbot |

## Styling

### Style Stack

- **Tailwind CSS 4**: Utility-first styling
- **shadcn/ui**: Pre-built accessible components with Radix UI
- **Framer Motion**: Smooth animations and transitions

### Adding shadcn Components

```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

### Animation Guidelines

- Page transitions: Framer Motion `AnimatePresence`
- Scroll animations: `ScrollReveal` component
- Keep animations < 300ms for most interactions
- AI search: Streaming text waterfall effect

## Docker Production

The Dockerfile uses a multi-stage build:

1. **Build stage** (`node:20-alpine`): Install deps, build assets
2. **Production stage** (`nginx:1.27-alpine`): Serve static files

Final image size: ~25 MB

### nginx Configuration

- Gzip compression (level 6)
- Aggressive caching for hashed assets (1 year)
- SPA routing (`try_files $uri /index.html`)
- Security headers (X-Frame-Options, X-Content-Type-Options)

## Key Features

### 1. Blog Articles

- Featured hero articles on homepage
- Category-based filtering
- Individual article pages with rich content
- Related articles suggestions

### 2. AI-Powered Search

- Real-time search with streaming responses
- ChatGPT-style waterfall text effect
- PubMed research source citations

### 3. Categories (5 Pillars)

- **Nourishment**: Nutrition and diet
- **Restoration**: Sleep and recovery
- **Mindset**: Mental health and mindfulness
- **Relationships**: Social connections
- **Vitality**: Physical activity and movement

### 4. Podcast Section

- "Mind My Age" podcast episodes
- Multi-platform links (YouTube, Spotify, Apple Podcasts)

### 5. Newsletter Subscription

- Email capture form
- Name and phone optional fields

## Code Standards

- TypeScript strict mode enabled
- ESLint configuration included
- Use functional components with hooks
- All components are client-side rendered (CSR)
- Path aliases: `@/` maps to `src/`

## License

Copyright 2025 Total Life. All Rights Reserved.
