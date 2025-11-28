/**
 * Category types matching the Total Life pillars
 */
export type ArticleCategory =
    | 'nourishment'
    | 'restoration'
    | 'mindset'
    | 'relationships'
    | 'vitality';

/**
 * Article metadata and content structure
 */
export interface Article {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    category: ArticleCategory;
    author?: {
        name: string;
        avatar?: string;
    };
    publishedAt: string;
    updatedAt?: string;
    featuredImage?: {
        url: string;
        alt: string;
    };
    tags?: string[];
    readTimeMinutes?: number;
    isFeatured?: boolean;
}

/**
 * Simplified article preview for listings
 */
export interface ArticlePreview {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: ArticleCategory;
    publishedAt: string;
    featuredImage?: {
        url: string;
        alt: string;
    };
    readTimeMinutes?: number;
    isFeatured?: boolean;
}

/**
 * Paginated article response
 */
export interface ArticleListResponse {
    articles: ArticlePreview[];
    pagination: {
        page: number;
        pageSize: number;
        totalPages: number;
        totalItems: number;
    };
}

/**
 * Category metadata
 */
export interface Category {
    id: ArticleCategory;
    name: string;
    description: string;
    icon?: string;
    color?: string;
}
