import { JSX } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticlePreview, ArticleResponse, getArticleBySlug, getArticles } from "@/lib/api/articles";
import { NewsletterSection } from "@/components/forms";
import { ArticleContent, ArticleHero, RelatedArticles } from "@/components/blog";
import type { ArticleCategory } from "@/types/article";

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate static params for all articles (for SSG)
export async function generateStaticParams() {
    try {
        const articles = await getArticles({ limit: 100 });
        return articles.map((article) => ({
            slug: article.slug,
        }));
    } catch {
        return [];
    }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;

    try {
        const article = await getArticleBySlug(slug);

        return {
            title: `${article.title} | Total Life Daily`,
            description: article.excerpt || `Read ${article.title} on Total Life Daily - your source for health and wellness content.`,
            openGraph: {
                title: article.title,
                description: article.excerpt || undefined,
                type: "article",
                publishedTime: article.published_at,
                modifiedTime: article.updated_at,
                images: article.featured_image ? [
                    {
                        url: article.featured_image.url,
                        alt: article.featured_image.alt,
                    }
                ] : undefined,
            },
            twitter: {
                card: "summary_large_image",
                title: article.title,
                description: article.excerpt || undefined,
                images: article.featured_image ? [article.featured_image.url] : undefined,
            },
        };
    } catch {
        return {
            title: "Article Not Found | Total Life Daily",
            description: "The requested article could not be found.",
        };
    }
}

export default async function BlogPostPage({ params }: BlogPostPageProps): Promise<JSX.Element> {
    const { slug } = await params;

    let article: ArticleResponse;

    try {
        article = await getArticleBySlug(slug);
    } catch {
        notFound();
    }

    // Fetch related articles from the same category (excluding current article)
    let relatedArticles: ArticlePreview[] = [];
    try {
        const categoryArticles = await getArticles({
            category: article.category as ArticleCategory,
            limit: 4
        });
        // Filter out the current article
        relatedArticles = categoryArticles
            .filter((a) => a.slug !== article.slug)
            .slice(0, 3);
    } catch {
        relatedArticles = [];
    }

    return (
        <>
            {/* Article Hero Section */}
            <ArticleHero article={article}/>

            {/* Article Content */}
            <ArticleContent
                content={article.content}
                articleId={article.article_id}
                articleSlug={article.slug}
                articleTitle={article.title}
            />

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <RelatedArticles
                    articles={relatedArticles}
                    category={article.category as ArticleCategory}
                />
            )}

            {/* Newsletter Section */}
            <NewsletterSection/>
        </>
    );
}
