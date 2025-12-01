import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import {
  getHomepageData,
  toHeroArticle,
  toFeaturedArticle,
  toCategoryArticles,
  type ArticlesByCategory,
} from "@/lib/api/articles";
import {
  HeroSection,
  FeaturedSection,
  CategorySection,
} from "@/components/blog";
import { PodcastSection } from "@/components/podcast";
import { NewsletterSection } from "@/components/forms";
import { AISearchSection } from "@/components/search";
import type { ArticleCategory } from "@/types/article";

// Fallback data for when API is unavailable
const fallbackHeroArticle = {
  slug: "why-bigger-friend-groups-could-be-the-secret-to-living-longer-no-membership-required",
  title: "Why Bigger Friend Groups Could Be the Secret to Living Longer",
  excerpt: "New research reveals that expanding your social circle could add years to your life. Here's the science behind friendship and longevity.",
  featuredImage: {
    url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=2000&h=800&fit=crop&q=90",
    alt: "Diverse group of mature friends laughing and enjoying time together outdoors",
  },
};

type FeaturedArticleType = {
  slug: string;
  title: string;
  excerpt?: string;
  category: ArticleCategory;
  featuredImage?: { url: string; alt: string };
};

const fallbackFeaturedArticles: FeaturedArticleType[] = [
  {
    slug: "how-8-weeks-of-mindfulness-gave-seniors-sharper-minds-better-mood-and-more-zest",
    title: "How 8 Weeks of Mindfulness Gave Seniors Sharper Minds, Better Mood, and More Zest",
    category: "mindset" as ArticleCategory,
    featuredImage: {
      url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
      alt: "Senior practicing mindfulness meditation",
    },
  },
  {
    slug: "eat-to-age-well-the-12-year-study-that-proves-its-not-too-late",
    title: "Eat to Age Well: The 12-Year Study That Proves It's Not Too Late",
    category: "nourishment" as ArticleCategory,
    featuredImage: {
      url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
      alt: "Healthy colorful meal with vegetables",
    },
  },
  {
    slug: "the-bedtime-secret-90-year-olds-know-that-could-keep-your-brain-young",
    title: "The Bedtime Secret 90-Year-Olds Know (That Could Keep Your Brain Young)",
    category: "restoration" as ArticleCategory,
    featuredImage: {
      url: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80",
      alt: "Peaceful bedroom for restful sleep",
    },
  },
];

type CategoryArticleType = {
  slug: string;
  title: string;
  category: ArticleCategory;
  featuredImage?: { url: string; alt: string };
};

const fallbackArticlesByCategory: Record<ArticleCategory, CategoryArticleType[]> = {
  nourishment: [
    {
      slug: "she-just-ate-more-salmon-you-wont-believe-what-happened-to-her-brain-and-balance",
      title: "She Just Ate More Salmon—You Won't Believe What Happened to Her Brain and Balance",
      category: "nourishment",
      featuredImage: {
        url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
        alt: "Grilled salmon with vegetables",
      },
    },
  ],
  restoration: [
    {
      slug: "the-bedtime-secret-90-year-olds-know-that-could-keep-your-brain-young",
      title: "The Bedtime Secret 90-Year-Olds Know (That Could Keep Your Brain Young)",
      category: "restoration",
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
      category: "mindset",
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
      category: "relationships",
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
      category: "vitality",
      featuredImage: {
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
        alt: "Active seniors exercising",
      },
    },
  ],
};

const featuredPodcast = {
  id: "1",
  title: "Mental Health Expert Reveals: Why Giving Can Be the Best Therapy for Anxiety & Loneliness",
  description: "Host Neelam Brar speaks with Jacqueline Way, founder of 365 Give, about the transformative power of giving.",
  thumbnail: {
    url: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80",
    alt: "Mind My Age Podcast episode thumbnail",
  },
  youtubeUrl: "https://www.youtube.com/playlist?list=PLOR6jU7e9REiL-uB4sWx9wshj3KY2n4UU",
  spotifyUrl: "https://open.spotify.com/show/0nXByQSGH5DcIPeRC32Tf6",
  applePodcastsUrl: "https://podcasts.apple.com/us/podcast/mind-my-age/id1755615831",
};

const PLAYLIST_URL = "https://www.youtube.com/playlist?list=PLOR6jU7e9REiL-uB4sWx9wshj3KY2n4UU";
const TOTAL_EPISODES = 20;

export default function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["homepage"],
    queryFn: getHomepageData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  // Transform API data or use fallbacks
  const heroArticle = data?.hero_article
    ? toHeroArticle(data.hero_article)
    : fallbackHeroArticle;

  const featuredArticles = data?.featured_articles && data.featured_articles.length > 0
    ? data.featured_articles.map(toFeaturedArticle)
    : fallbackFeaturedArticles;

  const articlesByCategory = data?.articles_by_category
    ? toCategoryArticles(data.articles_by_category as ArticlesByCategory)
    : fallbackArticlesByCategory;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F97356]"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Total Life Daily | Your Guide to Holistic Wellness</title>
        <meta
          name="description"
          content="Discover insights on nourishment, restoration, mindset, relationships, and vitality for a balanced life."
        />
      </Helmet>

      <main>
        <HeroSection article={heroArticle} />
        <AISearchSection />
        <FeaturedSection articles={featuredArticles} />
        <CategorySection articlesByCategory={articlesByCategory} />
        <PodcastSection 
          featuredEpisode={featuredPodcast}
          totalEpisodes={TOTAL_EPISODES}
          playlistUrl={PLAYLIST_URL}
        />
        <NewsletterSection />
      </main>
    </>
  );
}
