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
    {
      slug: "the-mediterranean-secret-why-this-diet-adds-years-to-your-life",
      title: "The Mediterranean Secret: Why This Diet Adds Years to Your Life",
      excerpt: "Explore the science behind one of the world's healthiest eating patterns and how to adopt it.",
      category: "nourishment",
      publishedAt: "2024-11-15",
      readTimeMinutes: 7,
      featuredImage: {
        url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
        alt: "Mediterranean diet foods",
      },
    },
    {
      slug: "gut-health-revolution-how-your-microbiome-affects-aging",
      title: "Gut Health Revolution: How Your Microbiome Affects Aging",
      excerpt: "Learn how the bacteria in your gut influence everything from brain health to immune function.",
      category: "nourishment",
      publishedAt: "2024-11-10",
      readTimeMinutes: 9,
      featuredImage: {
        url: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&q=80",
        alt: "Fermented foods for gut health",
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
    {
      slug: "why-100-year-olds-are-out-sleeping-you-and-what-they-know-that-you-dont",
      title: "Why 100-Year-Olds Are Out-Sleeping You—and What They Know That You Don't",
      excerpt: "The surprising sleep habits of the world's longest-lived people and how to adopt them.",
      category: "restoration",
      publishedAt: "2024-11-19",
      readTimeMinutes: 6,
      featuredImage: {
        url: "https://images.unsplash.com/photo-1515894203077-9cd36032142f?w=800&q=80",
        alt: "Serene sleeping environment",
      },
    },
    {
      slug: "the-power-of-naps-science-backed-ways-to-recharge",
      title: "The Power of Naps: Science-Backed Ways to Recharge Your Afternoon",
      excerpt: "Discover the optimal nap duration and timing for maximum energy and cognitive benefits.",
      category: "restoration",
      publishedAt: "2024-11-14",
      readTimeMinutes: 4,
      featuredImage: {
        url: "https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=800&q=80",
        alt: "Person napping comfortably",
      },
    },
    {
      slug: "stress-relief-techniques-that-actually-work",
      title: "Stress Relief Techniques That Actually Work (According to Research)",
      excerpt: "Evidence-based methods to reduce cortisol and promote deep relaxation.",
      category: "restoration",
      publishedAt: "2024-11-09",
      readTimeMinutes: 7,
      featuredImage: {
        url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
        alt: "Relaxation and meditation",
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
    {
      slug: "how-8-weeks-of-mindfulness-gave-seniors-sharper-minds-better-mood-and-more-zest",
      title: "How 8 Weeks of Mindfulness Gave Seniors Sharper Minds, Better Mood, and More Zest",
      excerpt: "A clinical study reveals the transformative power of meditation for cognitive and emotional health.",
      category: "mindset",
      publishedAt: "2024-11-18",
      readTimeMinutes: 7,
      featuredImage: {
        url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
        alt: "Mindfulness meditation",
      },
    },
    {
      slug: "gratitude-practice-the-5-minute-habit-changing-lives",
      title: "Gratitude Practice: The 5-Minute Habit That's Changing Lives",
      excerpt: "How a simple daily practice can rewire your brain for happiness and resilience.",
      category: "mindset",
      publishedAt: "2024-11-13",
      readTimeMinutes: 4,
      featuredImage: {
        url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
        alt: "Gratitude journaling",
      },
    },
    {
      slug: "brain-games-that-actually-keep-your-mind-sharp",
      title: "Brain Games That Actually Keep Your Mind Sharp (And Which Ones Don't)",
      excerpt: "Neuroscientists reveal which cognitive exercises provide real benefits for brain health.",
      category: "mindset",
      publishedAt: "2024-11-08",
      readTimeMinutes: 8,
      featuredImage: {
        url: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80",
        alt: "Puzzle and brain games",
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
    {
      slug: "why-bigger-friend-groups-could-be-the-secret-to-living-longer-no-membership-required",
      title: "Why Bigger Friend Groups Could Be the Secret to Living Longer (No Membership Required)",
      excerpt: "New research reveals that expanding your social circle could add years to your life.",
      category: "relationships",
      publishedAt: "2024-11-17",
      readTimeMinutes: 5,
      featuredImage: {
        url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
        alt: "Group of friends",
      },
    },
    {
      slug: "how-to-deepen-your-relationships-at-any-age",
      title: "How to Deepen Your Relationships at Any Age",
      excerpt: "Practical strategies for building more meaningful connections with the people who matter most.",
      category: "relationships",
      publishedAt: "2024-11-12",
      readTimeMinutes: 7,
      featuredImage: {
        url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
        alt: "Family connections",
      },
    },
    {
      slug: "loneliness-epidemic-what-science-says-about-staying-connected",
      title: "The Loneliness Epidemic: What Science Says About Staying Connected",
      excerpt: "Understanding the health risks of isolation and practical ways to combat loneliness.",
      category: "relationships",
      publishedAt: "2024-11-07",
      readTimeMinutes: 9,
      featuredImage: {
        url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
        alt: "Community gathering",
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
    {
      slug: "move-this-way-after-65-and-help-your-future-self-thrive",
      title: "Move This Way After 65—And Help Your Future Self Thrive",
      excerpt: "The best exercise routines for maintaining strength, balance, and independence as you age.",
      category: "vitality",
      publishedAt: "2024-11-16",
      readTimeMinutes: 7,
      featuredImage: {
        url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
        alt: "Senior doing yoga",
      },
    },
    {
      slug: "strength-training-for-seniors-its-never-too-late-to-start",
      title: "Strength Training for Seniors: It's Never Too Late to Start",
      excerpt: "How resistance exercise can reverse muscle loss and boost your metabolism at any age.",
      category: "vitality",
      publishedAt: "2024-11-11",
      readTimeMinutes: 8,
      featuredImage: {
        url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
        alt: "Senior strength training",
      },
    },
    {
      slug: "walking-10000-steps-myth-or-magic",
      title: "Walking 10,000 Steps: Myth or Magic? What the Research Really Says",
      excerpt: "Scientists reveal the optimal daily step count for health benefits and longevity.",
      category: "vitality",
      publishedAt: "2024-11-06",
      readTimeMinutes: 5,
      featuredImage: {
        url: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&q=80",
        alt: "Person walking outdoors",
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
