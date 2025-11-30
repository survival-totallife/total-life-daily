/**
 * API client functions for fetching articles from the backend
 */

import type { ArticleCategory } from "@/types/article";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Enable logging in development
const isDev = process.env.NODE_ENV === "development";

function log(message: string, data?: unknown) {
    if (isDev) {
        console.log(`[API] ${message}`, data !== undefined ? data : "");
    }
}

function logError(message: string, error: unknown) {
    console.error(`[API Error] ${message}`, error);
}

// =============================================================================
// Types matching backend schemas
// =============================================================================

export interface FeaturedImage {
    url: string;
    alt: string;
}

export interface ArticlePreview {
    article_id: number;
    slug: string;
    title: string;
    excerpt: string | null;
    category: ArticleCategory;
    featured_image: FeaturedImage | null;
    is_featured: boolean;
    published_at: string;
}

export interface ArticleResponse {
    article_id: number;
    slug: string;
    title: string;
    excerpt: string | null;
    content: string;
    category: ArticleCategory;
    featured_image: FeaturedImage | null;
    is_featured: boolean;
    is_hero: boolean;
    published_at: string;
    created_at: string;
    updated_at: string;
}

export interface ArticlesByCategory {
    nourishment: ArticlePreview[];
    restoration: ArticlePreview[];
    mindset: ArticlePreview[];
    relationships: ArticlePreview[];
    vitality: ArticlePreview[];
}

export interface HomepageData {
    hero_article: ArticlePreview | null;
    featured_articles: ArticlePreview[];
    articles_by_category: ArticlesByCategory;
}

// =============================================================================
// API Client Functions
// =============================================================================

/**
 * Fetch all data needed for the homepage in a single request
 */
export async function getHomepageData(): Promise<HomepageData> {
    const url = `${API_BASE_URL}/homepage`;
    log(`Fetching homepage data from: ${url}`);

    const startTime = Date.now();
    const response = await fetch(url, {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
        logError(`Failed to fetch homepage data (${response.status})`, response.statusText);
        throw new Error(`Failed to fetch homepage data: ${response.statusText}`);
    }

    const data = await response.json();
    log(`Homepage data fetched successfully in ${duration}ms`, {
        hasHeroArticle: !!data.hero_article,
        featuredCount: data.featured_articles?.length || 0,
        categories: {
            nourishment: data.articles_by_category?.nourishment?.length || 0,
            restoration: data.articles_by_category?.restoration?.length || 0,
            mindset: data.articles_by_category?.mindset?.length || 0,
            relationships: data.articles_by_category?.relationships?.length || 0,
            vitality: data.articles_by_category?.vitality?.length || 0,
        },
    });

    return data;
}

/**
 * Fetch hero article
 */
export async function getHeroArticle(): Promise<ArticlePreview> {
    const url = `${API_BASE_URL}/articles/hero`;
    log(`Fetching hero article from: ${url}`);
    const response = await fetch(`${API_BASE_URL}/articles/hero`, {
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch hero article: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Fetch featured articles
 */
export async function getFeaturedArticles(limit: number = 3): Promise<ArticlePreview[]> {
    const response = await fetch(`${API_BASE_URL}/articles/featured?limit=${limit}`, {
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch featured articles: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Fetch all articles with optional pagination and category filter
 */
export async function getArticles(options?: {
    skip?: number;
    limit?: number;
    category?: ArticleCategory;
}): Promise<ArticlePreview[]> {
    const params = new URLSearchParams();
    if (options?.skip) params.set("skip", options.skip.toString());
    if (options?.limit) params.set("limit", options.limit.toString());
    if (options?.category) params.set("category", options.category);

    const response = await fetch(`${API_BASE_URL}/articles?${params.toString()}`, {
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Fetch a single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<ArticleResponse> {
    const response = await fetch(`${API_BASE_URL}/articles/slug/${slug}`, {
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Article not found");
        }
        throw new Error(`Failed to fetch article: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Fetch a single article by ID
 */
export async function getArticleById(id: number): Promise<ArticleResponse> {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Article not found");
        }
        throw new Error(`Failed to fetch article: ${response.statusText}`);
    }

    return response.json();
}

// =============================================================================
// Transform functions (convert API response to component props)
// =============================================================================

/**
 * Transform ArticlePreview to the format expected by HeroSection
 */
export function toHeroArticle(article: ArticlePreview) {
    return {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt || undefined,
        featuredImage: article.featured_image
            ? { url: article.featured_image.url, alt: article.featured_image.alt }
            : undefined,
    };
}

/**
 * Transform ArticlePreview to the format expected by FeaturedSection
 */
export function toFeaturedArticle(article: ArticlePreview) {
    return {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt || undefined,
        category: article.category,
        featuredImage: article.featured_image
            ? { url: article.featured_image.url, alt: article.featured_image.alt }
            : undefined,
    };
}

/**
 * Transform ArticlesByCategory to the format expected by CategorySection
 */
export function toCategoryArticles(articles: ArticlesByCategory) {
    const transform = (list: ArticlePreview[]) =>
        list.map((article) => ({
            slug: article.slug,
            title: article.title,
            category: article.category,
            featuredImage: article.featured_image
                ? { url: article.featured_image.url, alt: article.featured_image.alt }
                : undefined,
        }));

    return {
        nourishment: transform(articles.nourishment),
        restoration: transform(articles.restoration),
        mindset: transform(articles.mindset),
        relationships: transform(articles.relationships),
        vitality: transform(articles.vitality),
    };
}
