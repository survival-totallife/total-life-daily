/**
 * API client functions for fetching articles from the backend
 */

import type { ArticleCategory } from "@/types/article";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
    const response = await fetch(`${API_BASE_URL}/homepage`);

    if (!response.ok) {
        throw new Error(`Failed to fetch homepage data: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Fetch hero article
 */
export async function getHeroArticle(): Promise<ArticlePreview> {
    const response = await fetch(`${API_BASE_URL}/articles/hero`);

    if (!response.ok) {
        throw new Error(`Failed to fetch hero article: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Fetch featured articles
 */
export async function getFeaturedArticles(limit: number = 3): Promise<ArticlePreview[]> {
    const response = await fetch(`${API_BASE_URL}/articles/featured?limit=${limit}`);

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

    const response = await fetch(`${API_BASE_URL}/articles?${params.toString()}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Fetch a single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<ArticleResponse> {
    const response = await fetch(`${API_BASE_URL}/articles/slug/${slug}`);

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
    const response = await fetch(`${API_BASE_URL}/articles/${id}`);

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
