import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArticleCategory } from "@/types/article";
import {
  CategoryHero,
  CategoryPageWrapper,
  CategoryArticlesGrid,
} from "@/components/category";
import { NewsletterSection } from "@/components/forms";
import { getArticles, type ArticlePreview } from "@/lib/api/articles";

// Category configuration with labels, descriptions, and colors
const categoryConfig: Record<
  ArticleCategory,
  {
    label: string;
    description: string;
    color: string;
    bgColor: string;
    lightBg: string;
    gradient: string;
  }
> = {
  nourishment: {
    label: "Nourishment",
    description:
      "Feed your body right. Discover the foods, nutrients, and eating habits that support longevity and vibrant health at every age.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-600",
    lightBg: "bg-emerald-50",
    gradient: "from-emerald-500 to-emerald-600",
  },
  restoration: {
    label: "Restoration",
    description:
      "Rest, recover, renew. Explore the science of sleep, relaxation, and recovery practices that help your body heal and thrive.",
    color: "text-blue-600",
    bgColor: "bg-blue-600",
    lightBg: "bg-blue-50",
    gradient: "from-blue-500 to-blue-600",
  },
  mindset: {
    label: "Mindset",
    description:
      "Your mind matters. Learn powerful mental strategies, mindfulness techniques, and cognitive exercises to stay sharp and positive.",
    color: "text-purple-600",
    bgColor: "bg-purple-600",
    lightBg: "bg-purple-50",
    gradient: "from-purple-500 to-purple-600",
  },
  relationships: {
    label: "Relationships",
    description:
      "Connection is key. Strengthen your bonds with family, friends, and community for a happier, healthier, and longer life.",
    color: "text-rose-600",
    bgColor: "bg-rose-600",
    lightBg: "bg-rose-50",
    gradient: "from-rose-500 to-rose-600",
  },
  vitality: {
    label: "Vitality",
    description:
      "Move with purpose. Find the exercise routines, movement practices, and energy-boosting habits that keep you active and alive.",
    color: "text-orange-600",
    bgColor: "bg-orange-600",
    lightBg: "bg-orange-50",
    gradient: "from-orange-500 to-orange-600",
  },
};

// Helper function to transform API articles to component format
function transformArticle(article: ArticlePreview) {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt || "",
    category: article.category,
    publishedAt: article.published_at,
    readTimeMinutes: 5, // Default, could be calculated from content length
    featuredImage: article.featured_image
      ? { url: article.featured_image.url, alt: article.featured_image.alt }
      : undefined,
  };
}

// Valid categories list
const validCategories: ArticleCategory[] = [
  "nourishment",
  "restoration",
  "mindset",
  "relationships",
  "vitality",
];

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Category Not Found
      </h1>
      <p className="text-gray-600 mb-8">
        The category you're looking for doesn't exist.
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

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validate category
  const isValidCategory = category && validCategories.includes(category as ArticleCategory);

  useEffect(() => {
    if (!isValidCategory) return;

    const fetchCategoryArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedArticles = await getArticles({
          category: category as ArticleCategory,
          limit: 100,
        });
        const transformed = fetchedArticles.map(transformArticle);
        setArticles(transformed);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load articles. Please try again later.");
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryArticles();
  }, [category, isValidCategory]);

  if (!isValidCategory) {
    return <NotFoundPage />;
  }

  const categoryKey = category as ArticleCategory;
  const config = categoryConfig[categoryKey];
  const pageTitle = `${config.label} | Total Life Daily`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={config.description} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={config.description} />
      </Helmet>

      <CategoryPageWrapper>
        <main>
          <CategoryHero
            category={categoryKey}
            label={config.label}
            description={config.description}
          />

          {loading ? (
            <div className="container mx-auto px-4 py-16 text-center">
              <p className="text-gray-600">Loading articles...</p>
            </div>
          ) : error ? (
            <div className="container mx-auto px-4 py-16 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="container mx-auto px-4 py-16 text-center">
              <p className="text-gray-600">No articles found in this category yet.</p>
            </div>
          ) : (
            <CategoryArticlesGrid
              articles={articles}
              config={config}
            />
          )}

          <NewsletterSection />
        </main>
      </CategoryPageWrapper>
    </>
  );
}
