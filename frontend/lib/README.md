# Lib Directory

Utility functions, API clients, and custom hooks.

## Structure

### `/api`

API client functions for backend communication:

- `articles.ts` - Article CRUD operations
- `search.ts` - AI search endpoint integration
- `categories.ts` - Category fetching
- `client.ts` - Base HTTP client configuration

### `/utils`

General utility functions:

- `formatters.ts` - Date, text formatting utilities
- `validators.ts` - Form validation helpers
- `constants.ts` - App-wide constants
- `cn.ts` - Class name utility (for Tailwind)

### `/hooks`

Custom React hooks:

- `useArticles.ts` - Fetch and manage articles
- `useSearch.ts` - Handle AI search state and streaming
- `useDebounce.ts` - Debounce user input
- `useIntersectionObserver.ts` - Infinite scroll, lazy loading
