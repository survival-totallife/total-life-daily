# Components Directory

React components organized by feature and responsibility.

## Component Organization Pattern

Components are organized into three main categories:

### 1. **`/ui`** - shadcn/ui Components

Pre-built, accessible components from shadcn/ui:

- Installed via: `npx shadcn@latest add <component>`
- Examples: button, card, input, dialog, dropdown-menu
- Built on Radix UI primitives
- Fully customizable and themed

### 2. **`/common`** - Custom Reusable Components

Your custom components used across the app:

```
common/
├── Loading/
│   ├── Loading.tsx          # Custom loading spinner
│   └── index.ts
├── ArticleCardSkeleton/
│   ├── ArticleCardSkeleton.tsx
│   └── index.ts
└── AnimatedText/
    ├── AnimatedText.tsx     # Framer Motion text animations
    └── index.ts
```

### 3. **Feature-specific folders** - Domain Components

Components grouped by feature domain:

```
components/
├── blog/
│   ├── ArticleCard/
│   ├── ArticleGrid/
│   └── ArticleHero/
├── search/
│   ├── SearchBar/
│   ├── AIResponse/         # Waterfall text animation
│   └── SearchResults/
└── podcast/
    ├── PodcastCard/
    └── PodcastPlayer/
```

**Styling Approach:**

- Primary: Tailwind CSS utility classes + shadcn/ui components
- Animations: Framer Motion for smooth transitions
- When needed: CSS Modules (`.module.css`) for complex styles
- No global `/styles` folder - styles live with components
- Global styles only in `app/globals.css` (Tailwind, CSS variables)

## Structure

### `/common`

Reusable UI components used across the application:

- Button, Card, Modal, Badge
- Loading spinners, skeletons
- Icons, Typography components

### `/layout`

Layout components that structure the pages:

- Header (with navigation and search)
- Footer
- Sidebar
- Navigation menus

### `/blog`

Blog-specific components:

- ArticleCard - Preview card for blog articles
- ArticleGrid - Grid layout for article lists
- ArticleHero - Featured article hero section
- CategoryBadge - Visual category indicators
- ArticleContent - Rich text rendering for article body

### `/search`

AI-powered search components:

- SearchBar - Main search input
- SearchResults - Display search results
- AIResponse - Streaming AI response with waterfall text effect
- SearchSuggestions - Quick search suggestions

### `/podcast`

Podcast section components:

- PodcastCard - Individual episode card
- PodcastPlayer - Audio/video player
- EpisodeList - List of recent episodes

### `/forms`

Form components:

- NewsletterForm - Email subscription form
- ContactForm - General contact form
- Input, Textarea, Select - Reusable form controls
