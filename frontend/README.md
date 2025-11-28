# Total Life Daily - Frontend

Next.js frontend for the Total Life Daily health and wellness blog platform.

## Project Overview

A modern, responsive web application that mirrors the functionality
of [daily.totallife.com](https://daily.totallife.com/), featuring:

- Health and wellness blog articles
- AI-powered search with streaming responses
- Category-based content organization (5 pillars: Nourishment, Restoration, Mindset, Relationships, Vitality)
- Podcast episodes section
- Newsletter subscription

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Compiler**: React Compiler enabled
- **Backend**: FastAPI (separate `/backend` directory)

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with Header/Footer
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles (Tailwind, resets, CSS variables only)
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx         # Individual article page
│   ├── category/
│   │   └── [category]/
│   │       └── page.tsx         # Category listing page
│   ├── search/
│   │   └── page.tsx             # AI search interface
│   └── api/                     # Next.js API routes (optional)
│
├── components/                   # React components (modular structure)
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...                  # Add components with: npx shadcn@latest add
│   ├── common/                  # Custom reusable UI components
│   │   ├── Loading/
│   │   │   ├── Loading.tsx
│   │   │   └── index.ts
│   │   └── Badge/
│   │       ├── Badge.tsx
│   │       └── index.ts
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── Sidebar.tsx
│   ├── blog/                    # Blog-specific components
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleGrid.tsx
│   │   ├── ArticleHero.tsx
│   │   ├── CategoryBadge.tsx
│   │   └── ArticleContent.tsx
│   ├── search/                  # AI search components
│   │   ├── SearchBar.tsx
│   │   ├── SearchResults.tsx
│   │   ├── AIResponse.tsx       # Streaming response with waterfall effect
│   │   └── SearchSuggestions.tsx
│   ├── podcast/                 # Podcast components
│   │   ├── PodcastCard.tsx
│   │   ├── PodcastPlayer.tsx
│   │   └── EpisodeList.tsx
│   └── forms/                   # Form components
│       ├── NewsletterForm.tsx
│       ├── ContactForm.tsx
│       └── FormControls.tsx
│
├── lib/                         # Utilities and helpers
│   ├── api/                     # API client functions
│   │   ├── client.ts            # Base HTTP client
│   │   ├── articles.ts          # Article endpoints
│   │   ├── search.ts            # AI search endpoints
│   │   └── categories.ts        # Category endpoints
│   ├── utils/                   # Utility functions
│   │   ├── cn.ts                # Class name utility (clsx + tailwind-merge)
│   │   ├── formatters.ts        # Date/text formatting
│   │   ├── validators.ts        # Validation helpers
│   │   ├── constants.ts         # App constants
│   │   └── index.ts             # Central export
│   └── hooks/                   # Custom React hooks
│       ├── useArticles.ts
│       ├── useSearch.ts
│       ├── useDebounce.ts
│       └── useIntersectionObserver.ts
│
├── types/                       # TypeScript type definitions
│   ├── article.ts               # Article types
│   ├── search.ts                # Search types
│   ├── podcast.ts               # Podcast types
│   ├── common.ts                # Common types
│   └── index.ts                 # Central export
│
├── public/                      # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
│
└── README.md                    # This file
```

## Key Features

### 1. Blog Articles

- Featured hero articles on homepage
- Category-based filtering
- Individual article pages with rich content
- Related articles suggestions

### 2. AI-Powered Search

- Real-time search with streaming responses
- ChatGPT-style waterfall text effect
- Source citations and related articles
- Search suggestions and autocomplete

### 3. Categories (5 Pillars)

- **Nourishment**: Nutrition and diet
- **Restoration**: Sleep and recovery
- **Mindset**: Mental health and mindfulness
- **Relationships**: Social connections
- **Vitality**: Physical activity and movement

### 4. Podcast Section

- "Mind My Age" podcast episodes
- Multi-platform links (YouTube, Spotify, Apple Podcasts)
- Audio/video player integration

### 5. Newsletter Subscription

- Email capture form
- Name and phone optional fields

## Development

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Getting Started

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app will be available at `http://localhost:3000`

### Environment Variables

Create a `.env.local` file:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: Analytics, etc.
NEXT_PUBLIC_GA_ID=
```

## Backend Integration

The frontend communicates with a FastAPI backend located in `/backend`.

### Expected API Endpoints:

- `GET /api/articles` - List articles with pagination
- `GET /api/articles/:slug` - Get single article
- `GET /api/categories` - List categories
- `GET /api/categories/:category/articles` - Articles by category
- `POST /api/search` - AI-powered search (streaming)
- `GET /api/podcast/episodes` - List podcast episodes
- `POST /api/newsletter/subscribe` - Newsletter signup

## Styling Guidelines

### Style Stack

- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Pre-built accessible components with Radix UI primitives
- **Framer Motion**: Smooth animations and transitions
- **CSS Modules**: Optional for complex component-specific styles

### Adding shadcn Components

```bash
# Add individual components as needed
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

### Animation Guidelines

- Use Framer Motion for:
    - Page transitions
    - Component entrance/exit animations
    - Scroll-triggered animations
    - Gesture interactions
- Keep animations subtle and performant (< 300ms for most)
- Waterfall text effect for AI search responses

### Design Principles

- Follow mobile-first responsive design
- Match the design aesthetic of daily.totallife.com
- Use Geist Sans and Geist Mono fonts (already configured)
- Maintain consistent spacing with Tailwind's spacing scale
- Use shadcn's theme system for consistent colors and dark mode

## Code Standards

- TypeScript strict mode enabled
- ESLint configuration included
- Use functional components with hooks
- Prefer server components where possible (App Router)
- Client components only when needed (interactivity, state)

## Next Steps

1. Implement core layout components (Header, Footer)
2. Create article listing and detail pages
3. Build AI search interface with streaming
4. Add category filtering
5. Integrate with FastAPI backend
6. Implement podcast section
7. Add newsletter form
8. Polish UI/UX to match reference site

## License

Copyright 2025 Total Life. All Rights Reserved.
