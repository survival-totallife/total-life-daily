import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { getArticleBySlug, getArticles, type ArticlePreview } from "@/lib/api/articles";
import {
  ArticleHero,
  ArticleContent,
  RelatedArticles,
} from "@/components/blog";
import { NewsletterSection } from "@/components/forms";
import type { ArticleCategory } from "@/types/article";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: article,
    isLoading: isLoadingArticle,
    error: articleError,
  } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => getArticleBySlug(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  const { data: relatedArticles = [], isLoading: isLoadingRelated } = useQuery({
    queryKey: ["relatedArticles", article?.category, article?.slug],
    queryFn: async () => {
      const articles = await getArticles({
        category: article?.category as ArticleCategory,
        limit: 4,
      });
      // Filter out the current article
      return articles.filter((a: ArticlePreview) => a.slug !== article?.slug).slice(0, 3);
    },
    enabled: !!article?.category,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoadingArticle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F97356]"></div>
      </div>
    );
  }

  if (articleError || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Article Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-[#F97356] text-white rounded-lg hover:bg-[#E85A3D] transition-colors"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const pageTitle = `${article.title} | Total Life Daily`;
  const pageDescription = article.excerpt || article.title;
  const pageImage = article.featured_image?.url || "/images/default-og.jpg";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
      </Helmet>

      <main>
        <ArticleHero article={article} />
        <ArticleContent 
          content={article.content}
          articleId={article.article_id}
          articleSlug={article.slug}
          articleTitle={article.title}
        />

        {!isLoadingRelated && relatedArticles && relatedArticles.length > 0 && (
          <RelatedArticles 
            articles={relatedArticles} 
            category={article.category as ArticleCategory}
          />
        )}

        <NewsletterSection />
      </main>
    </>
  );
}
