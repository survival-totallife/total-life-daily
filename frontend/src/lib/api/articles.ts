/**
 * API client functions for fetching articles from Supabase
 */

import {
  getArticles as supabaseGetArticles,
  getArticleBySlug as supabaseGetArticleBySlug,
  getArticleById as supabaseGetArticleById,
  getHeroArticle as supabaseGetHeroArticle,
  getFeaturedArticles as supabaseGetFeaturedArticles,
  getArticlesByCategory as supabaseGetArticlesByCategory,
  getHomepageData as supabaseGetHomepageData,
} from "@/lib/supabase-queries";
import type { Article } from "@/lib/supabase";
import type { ArticleCategory } from "@/types/article";

// =============================================================================
// Types matching Supabase schemas
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
// Helper function to transform Supabase Article to ArticlePreview
// =============================================================================

function transformToPreview(article: Article): ArticlePreview {
  return {
    article_id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category as ArticleCategory,
    featured_image: article.featured_image_url
      ? { url: article.featured_image_url, alt: article.featured_image_alt || "" }
      : null,
    is_featured: article.is_featured,
    published_at: article.published_at,
  };
}

function transformToResponse(article: Article): ArticleResponse {
  return {
    article_id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    category: article.category as ArticleCategory,
    featured_image: article.featured_image_url
      ? { url: article.featured_image_url, alt: article.featured_image_alt || "" }
      : null,
    is_featured: article.is_featured,
    is_hero: article.is_hero,
    published_at: article.published_at,
    created_at: article.created_at,
    updated_at: article.updated_at,
  };
}

// =============================================================================
// API Client Functions
// =============================================================================

/**
 * Fetch all data needed for the homepage in a single request
 */
export async function getHomepageData(): Promise<HomepageData> {
    const data = await supabaseGetHomepageData();

    return {
        hero_article: data.hero ? transformToPreview(data.hero) : null,
        featured_articles: data.featured.map(transformToPreview),
        articles_by_category: {
            nourishment: (data.articles_by_category.nourishment || []).map(transformToPreview),
            restoration: (data.articles_by_category.restoration || []).map(transformToPreview),
            mindset: (data.articles_by_category.mindset || []).map(transformToPreview),
            relationships: (data.articles_by_category.relationships || []).map(transformToPreview),
            vitality: (data.articles_by_category.vitality || []).map(transformToPreview),
        },
    };
}

/**
 * Fetch hero article
 */
export async function getHeroArticle(): Promise<ArticlePreview> {
    const article = await supabaseGetHeroArticle();
    if (!article) {
        throw new Error("No hero article found");
    }
    return transformToPreview(article);
}

/**
 * Fetch featured articles
 */
export async function getFeaturedArticles(limit: number = 3): Promise<ArticlePreview[]> {
    const articles = await supabaseGetFeaturedArticles(limit);
    return articles.map(transformToPreview);
}

/**
 * Fetch all articles with optional pagination and category filter
 */
export async function getArticles(options?: {
    skip?: number;
    limit?: number;
    category?: ArticleCategory;
}): Promise<ArticlePreview[]> {
    let articles: Article[];

    if (options?.category) {
        articles = await supabaseGetArticlesByCategory(options.category, options.limit || 100);
    } else {
        articles = await supabaseGetArticles(options?.skip || 0, options?.limit || 100);
    }

    return articles.map(transformToPreview);
}

/**
 * Fetch a single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<ArticleResponse> {
    const article = await supabaseGetArticleBySlug(slug);
    return transformToResponse(article);
}

/**
 * Fetch a single article by ID
 */
export async function getArticleById(id: number): Promise<ArticleResponse> {
    const article = await supabaseGetArticleById(id);
    return transformToResponse(article);
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
