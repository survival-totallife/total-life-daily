import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArticleCategory } from "@/types/article";
import {
  CategoryHero,
  CategoryPageWrapper,
  CategoryArticlesGrid,
} from "@/components/category";
import { NewsletterSection } from "@/components/forms";

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

// Mock/fallback articles by category
const articlesByCategory: Record<ArticleCategory, Array<{
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  publishedAt: string;
  readTimeMinutes: number;
  featuredImage?: { url: string; alt: string };
}>> = {
  nourishment: [
    {
      slug: "she-just-ate-more-salmon-you-wont-believe-what-happened-to-her-brain-and-balance",
      title: "She Just Ate More Salmon—You Won't Believe What Happened to Her Brain and Balance",
      excerpt: "Discover how omega-3 fatty acids can transform your cognitive function and physical stability as you age.",
      category: "nourishment",
      publishedAt: "2024-11-25",
      readTimeMinutes: 6,
      featuredImage: {
        url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
        alt: "Grilled salmon with vegetables",
      },
    },
    {
      slug: "eat-to-age-well-the-12-year-study-that-proves-its-not-too-late",
      title: "Eat to Age Well: The 12-Year Study That Proves It's Not Too Late",
      excerpt: "A groundbreaking study reveals that changing your diet at any age can significantly improve your healthspan.",
      category: "nourishment",
      publishedAt: "2024-11-20",
      readTimeMinutes: 8,
      featuredImage: {
        url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
        alt: "Healthy colorful meal",
      },
    },
  ],
  restoration: [
    {
      slug: "the-bedtime-secret-90-year-olds-know-that-could-keep-your-brain-young",
      title: "The Bedtime Secret 90-Year-Olds Know (That Could Keep Your Brain Young)",
      excerpt: "Centenarians share their sleep wisdom and what science says about rest and cognitive health.",
      category: "restoration",
      publishedAt: "2024-11-24",
      readTimeMinutes: 5,
      featuredImage: {
        url: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80",
        alt: "Peaceful bedroom",
      },
    },
  ],
  mindset: [
    {
      slug: "feeling-blue-try-these-two-walks-a-week-they-cut-depression-and-anxiety-nearly-in-half",
      title: "Feeling Blue? Try These Two Walks a Week—They Cut Depression and Anxiety Nearly in Half",
      excerpt: "New research shows that regular walking in nature can dramatically improve mental health outcomes.",
      category: "mindset",
      publishedAt: "2024-11-23",
      readTimeMinutes: 5,
      featuredImage: {
        url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80",
        alt: "Person walking in nature",
      },
    },
  ],
  relationships: [
    {
      slug: "want-more-independent-years-heres-the-one-social-habit-you-cant-skip",
      title: "Want More Independent Years? Here's the One Social Habit You Can't Skip",
      excerpt: "Research shows that maintaining strong social connections is key to aging independently.",
      category: "relationships",
      publishedAt: "2024-11-22",
      readTimeMinutes: 6,
      featuredImage: {
        url: "https://images.unsplash.com/photo-1516728778615-2d590ea1855e?w=800&q=80",
        alt: "Friends enjoying time together",
      },
    },
  ],
  vitality: [
    {
      slug: "add-up-to-7-extra-years-just-keep-moving-after-65",
      title: "Add Up to 7 Extra Years—Just Keep Moving After 65",
      excerpt: "A comprehensive study reveals how daily movement can significantly extend your lifespan.",
      category: "vitality",
      publishedAt: "2024-11-21",
      readTimeMinutes: 6,
      featuredImage: {
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
        alt: "Active seniors exercising",
      },
    },
  ],
};

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

  // Validate category
  const isValidCategory = category && validCategories.includes(category as ArticleCategory);

  if (!isValidCategory) {
    return <NotFoundPage />;
  }

  const categoryKey = category as ArticleCategory;
  const config = categoryConfig[categoryKey];
  const articles = articlesByCategory[categoryKey] || [];

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
          
          <CategoryArticlesGrid
            articles={articles}
            config={config}
          />
          
          <NewsletterSection />
        </main>
      </CategoryPageWrapper>
    </>
  );
}
