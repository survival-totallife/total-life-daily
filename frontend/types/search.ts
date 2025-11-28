/**
 * AI Search types
 */

/**
 * User search query
 */
export interface SearchQuery {
    query: string;
    filters?: {
        categories?: string[];
        dateRange?: {
            from: string;
            to: string;
        };
    };
}

/**
 * AI-generated search response
 */
export interface AISearchResponse {
    id: string;
    query: string;
    answer: string; // Markdown formatted response
    sources?: SearchSource[];
    relatedArticles?: RelatedArticle[];
    timestamp: string;
}

/**
 * Source citation for AI response
 */
export interface SearchSource {
    title: string;
    url: string;
    excerpt: string;
    relevanceScore?: number;
}

/**
 * Related article suggestion
 */
export interface RelatedArticle {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
}

/**
 * Streaming response chunk for waterfall effect
 */
export interface StreamChunk {
    type: 'token' | 'complete' | 'error';
    content?: string;
    metadata?: {
        sources?: SearchSource[];
        relatedArticles?: RelatedArticle[];
    };
    error?: string;
}

/**
 * Search suggestions
 */
export interface SearchSuggestion {
    text: string;
    category?: string;
    popularity?: number;
}
