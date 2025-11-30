"""
Seed script to populate the database with sample articles and comments.
Run this after starting the server or directly with Python.

Usage:
    python seed_articles.py

This will:
1. Delete the existing database (if any)
2. Create new tables with the updated schema
3. Populate with sample articles for all categories
4. Add sample comments from different users
"""

import os
import sys
import uuid
from datetime import datetime, timedelta

# Add the backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine, SessionLocal, Base
from models import Article, Comment, CommentLike

# Sample articles data
SAMPLE_ARTICLES = [
    # Hero article
    {
        "slug": "why-bigger-friend-groups-could-be-the-secret-to-living-longer-no-membership-required",
        "title": "Why Bigger Friend Groups Could Be the Secret to Living Longer (No Membership Required)",
        "excerpt": "New research reveals that expanding your social circle could add years to your life. Here's the science behind friendship and longevity.",
        "content": """# Why Bigger Friend Groups Could Be the Secret to Living Longer (No Membership Required)

New research reveals that expanding your social circle could add years to your life. Here's the science behind friendship and longevity.

## The Science of Social Connection

Studies have consistently shown that people with strong social ties tend to live longer, healthier lives. A landmark study published in PLOS Medicine found that social relationships can increase your odds of survival by 50%.

## Key Findings

- **Diverse friendships matter**: Having friends from different backgrounds and age groups provides varied perspectives and support systems.
- **Quality and quantity**: While deep friendships are valuable, having a broader network also contributes to wellbeing.
- **Regular interaction**: Consistent social contact, even brief exchanges, can boost mood and reduce stress hormones.

## How to Expand Your Circle

1. Join community groups or clubs aligned with your interests
2. Volunteer for causes you care about
3. Take classes or attend workshops
4. Be open to friendships across generations

Remember, it's never too late to make new friends. Start small, be consistent, and watch your social garden grow.
""",
        "category": "relationships",
        "featured_image_url": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=2000&h=800&fit=crop&q=90",
        "featured_image_alt": "Diverse group of mature friends laughing and enjoying time together outdoors",
        "is_featured": False,
        "is_hero": True,
    },
    # Featured articles
    {
        "slug": "how-8-weeks-of-mindfulness-gave-seniors-sharper-minds-better-mood-and-more-zest",
        "title": "How 8 Weeks of Mindfulness Gave Seniors Sharper Minds, Better Mood, and More Zest",
        "excerpt": "A groundbreaking study shows that just 8 weeks of mindfulness practice can significantly improve cognitive function and emotional wellbeing in older adults.",
        "content": """# How 8 Weeks of Mindfulness Gave Seniors Sharper Minds, Better Mood, and More Zest

A groundbreaking study shows that just 8 weeks of mindfulness practice can significantly improve cognitive function and emotional wellbeing in older adults.

## The Study

Researchers followed 150 adults aged 65 and older through an 8-week mindfulness program. The results were remarkable.

## Key Benefits Observed

- **Improved memory**: Participants showed 23% improvement in working memory tests
- **Better mood**: Depression scores dropped by an average of 40%
- **Increased vitality**: Self-reported energy levels increased significantly
- **Enhanced focus**: Attention span improved measurably

## Getting Started with Mindfulness

You don't need to meditate for hours. Start with just 5-10 minutes daily:

1. Find a quiet, comfortable spot
2. Focus on your breath
3. When your mind wanders, gently bring it back
4. Be patient with yourself

The benefits compound over time. Consistency is key.
""",
        "category": "mindset",
        "featured_image_url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
        "featured_image_alt": "Senior practicing mindfulness meditation",
        "is_featured": True,
        "is_hero": False,
    },
    {
        "slug": "eat-to-age-well-the-12-year-study-that-proves-its-not-too-late",
        "title": "Eat to Age Well: The 12-Year Study That Proves It's Not Too Late",
        "excerpt": "A comprehensive 12-year study reveals that dietary changes at any age can significantly impact longevity and quality of life.",
        "content": """# Eat to Age Well: The 12-Year Study That Proves It's Not Too Late

A comprehensive 12-year study reveals that dietary changes at any age can significantly impact longevity and quality of life.

## The Research

Following over 10,000 participants aged 50-79, researchers tracked dietary habits and health outcomes over 12 years.

## What They Found

Even participants who made dietary changes later in life saw significant benefits:

- **Reduced inflammation**: Anti-inflammatory foods lowered markers by 35%
- **Better brain health**: Mediterranean diet adherents showed slower cognitive decline
- **Stronger bones**: Adequate calcium and vitamin D intake improved bone density
- **Healthier hearts**: Plant-based eating patterns reduced cardiovascular risk

## Foods to Focus On

1. Colorful vegetables and fruits
2. Whole grains
3. Lean proteins and legumes
4. Healthy fats (olive oil, nuts, avocados)
5. Fermented foods for gut health

It's never too late to start eating better. Your body will thank you.
""",
        "category": "nourishment",
        "featured_image_url": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
        "featured_image_alt": "Healthy colorful meal with vegetables",
        "is_featured": True,
        "is_hero": False,
    },
    {
        "slug": "the-bedtime-secret-90-year-olds-know-that-could-keep-your-brain-young",
        "title": "The Bedtime Secret 90-Year-Olds Know (That Could Keep Your Brain Young)",
        "excerpt": "Discover the sleep habits of the world's longest-lived people and how consistent rest patterns protect cognitive function.",
        "content": """# The Bedtime Secret 90-Year-Olds Know (That Could Keep Your Brain Young)

Discover the sleep habits of the world's longest-lived people and how consistent rest patterns protect cognitive function.

## The Sleep-Longevity Connection

Research from Blue Zones—regions with the highest concentrations of centenarians—reveals surprising patterns about sleep.

## What 90-Year-Olds Do Differently

- **Consistent sleep schedule**: Going to bed and waking at the same time daily
- **Earlier bedtimes**: Most are asleep by 9-10 PM
- **Natural light exposure**: Morning sunlight helps regulate circadian rhythms
- **Afternoon rest**: Brief naps of 20-30 minutes are common

## The Brain Benefits

Quality sleep helps your brain:

1. Clear toxic proteins linked to Alzheimer's
2. Consolidate memories
3. Repair and regenerate cells
4. Balance hormones that affect mood and appetite

## Creating Your Sleep Sanctuary

- Keep your bedroom cool (65-68°F)
- Eliminate screens an hour before bed
- Create a calming pre-sleep routine
- Invest in comfortable bedding

Your brain does its best work while you rest. Honor that process.
""",
        "category": "restoration",
        "featured_image_url": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80",
        "featured_image_alt": "Peaceful bedroom for restful sleep",
        "is_featured": True,
        "is_hero": False,
    },
    # Additional category articles
    {
        "slug": "she-just-ate-more-salmon-you-wont-believe-what-happened-to-her-brain-and-balance",
        "title": "She Just Ate More Salmon—You Won't Believe What Happened to Her Brain and Balance",
        "excerpt": "One woman's simple dietary change led to remarkable improvements in cognitive function and physical stability.",
        "content": """# She Just Ate More Salmon—You Won't Believe What Happened to Her Brain and Balance

One woman's simple dietary change led to remarkable improvements in cognitive function and physical stability.

## Margaret's Story

At 72, Margaret was experiencing memory lapses and occasional balance issues. Her doctor suggested one simple change: eat more fatty fish.

## The Omega-3 Effect

After six months of eating salmon twice weekly, Margaret noticed:

- Sharper memory recall
- Better balance and coordination
- Improved mood stability
- Clearer thinking

## The Science Behind It

Omega-3 fatty acids, especially DHA, are crucial for:

1. Brain cell membrane health
2. Reducing inflammation
3. Supporting nerve function
4. Maintaining eye health

## Easy Ways to Add More Fish

- Baked salmon with herbs
- Sardines on whole grain toast
- Tuna salad with vegetables
- Fish tacos with fresh salsa

Your brain is 60% fat—feed it the good kind.
""",
        "category": "nourishment",
        "featured_image_url": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
        "featured_image_alt": "Grilled salmon with vegetables",
        "is_featured": False,
        "is_hero": False,
    },
    {
        "slug": "why-100-year-olds-are-out-sleeping-you-and-what-they-know-that-you-dont",
        "title": "Why 100-Year-Olds Are Out-Sleeping You—and What They Know That You Don't",
        "excerpt": "Centenarians around the world share common sleep habits that contribute to their remarkable longevity.",
        "content": """# Why 100-Year-Olds Are Out-Sleeping You—and What They Know That You Don't

Centenarians around the world share common sleep habits that contribute to their remarkable longevity.

## Lessons from the Longest-Lived

Researchers studied sleep patterns of people who lived past 100 and found surprising commonalities.

## Their Sleep Secrets

- **They don't fight fatigue**: When tired, they rest
- **Darkness matters**: They sleep in truly dark rooms
- **Morning routines**: Consistent wake times, even without alarms
- **Stress management**: They don't take worries to bed

## Quality Over Quantity

While 7-8 hours is ideal, centenarians prioritize sleep quality:

1. Fewer nighttime awakenings
2. More time in deep sleep stages
3. Natural sleep-wake cycles
4. Minimal sleep aids

## Your Action Plan

Start tonight:
- Set a consistent bedtime
- Create a wind-down routine
- Make your room cave-dark
- Save worries for morning

Sleep is the foundation of longevity.
""",
        "category": "restoration",
        "featured_image_url": "https://images.unsplash.com/photo-1515894203077-9cd36032142f?w=800&q=80",
        "featured_image_alt": "Serene sleeping environment",
        "is_featured": False,
        "is_hero": False,
    },
    {
        "slug": "feeling-blue-try-these-two-walks-a-week-they-cut-depression-and-anxiety-nearly-in-half",
        "title": "Feeling Blue? Try These Two Walks a Week—They Cut Depression and Anxiety Nearly in Half",
        "excerpt": "Research shows that just two weekly walks in nature can dramatically reduce symptoms of depression and anxiety.",
        "content": """# Feeling Blue? Try These Two Walks a Week—They Cut Depression and Anxiety Nearly in Half

Research shows that just two weekly walks in nature can dramatically reduce symptoms of depression and anxiety.

## The Nature Prescription

A study of 1,000 adults found that walking in green spaces twice weekly reduced depression symptoms by 47% and anxiety by 43%.

## Why Walking Works

- **Rhythmic movement**: Calms the nervous system
- **Nature exposure**: Reduces cortisol levels
- **Gentle exercise**: Releases mood-boosting endorphins
- **Social opportunity**: Walking with others amplifies benefits

## The Ideal Walk

Research suggests:

1. 30-45 minutes duration
2. Natural settings (parks, trails, gardens)
3. Moderate pace—you can still hold a conversation
4. Morning light exposure is especially beneficial

## Getting Started

- Find a walking buddy for accountability
- Explore local parks and trails
- Leave your phone on silent
- Notice the sights, sounds, and smells around you

Your mental health is just a walk away.
""",
        "category": "mindset",
        "featured_image_url": "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80",
        "featured_image_alt": "Person walking in nature",
        "is_featured": False,
        "is_hero": False,
    },
    {
        "slug": "want-more-independent-years-heres-the-one-social-habit-you-cant-skip",
        "title": "Want More Independent Years? Here's the One Social Habit You Can't Skip",
        "excerpt": "Studies reveal that one specific social behavior is strongly linked to maintaining independence as we age.",
        "content": """# Want More Independent Years? Here's the One Social Habit You Can't Skip

Studies reveal that one specific social behavior is strongly linked to maintaining independence as we age.

## The Independence Factor

Research tracking 5,000 adults over 20 years found that those who maintained regular social meals stayed independent 5 years longer on average.

## Why Shared Meals Matter

Eating with others provides:

- **Cognitive stimulation**: Conversation keeps minds sharp
- **Nutritional benefits**: We eat better with company
- **Emotional support**: Connection reduces isolation
- **Routine structure**: Regular social commitments add purpose

## Making It Happen

1. Host weekly dinners with friends or family
2. Join a community meal program
3. Start a supper club with neighbors
4. Meet friends for breakfast or lunch

## Beyond the Table

The meal is just the beginning. The relationships built around food extend into:

- Mutual support during challenges
- Shared activities and outings
- Emergency assistance when needed
- Daily check-ins and conversations

Invest in your social table—it's an investment in your future independence.
""",
        "category": "relationships",
        "featured_image_url": "https://images.unsplash.com/photo-1516728778615-2d590ea1855e?w=800&q=80",
        "featured_image_alt": "Friends enjoying time together",
        "is_featured": False,
        "is_hero": False,
    },
    {
        "slug": "add-up-to-7-extra-years-just-keep-moving-after-65",
        "title": "Add Up to 7 Extra Years—Just Keep Moving After 65",
        "excerpt": "New research quantifies the life-extending benefits of staying physically active in your later years.",
        "content": """# Add Up to 7 Extra Years—Just Keep Moving After 65

New research quantifies the life-extending benefits of staying physically active in your later years.

## The Numbers Don't Lie

A massive study following 100,000 adults over 65 found that those who remained physically active lived an average of 7 years longer than sedentary peers.

## What Counts as Active

You don't need to run marathons. Beneficial activities include:

- **Walking**: 30 minutes daily
- **Gardening**: Regular yard work
- **Swimming**: Low-impact full-body exercise
- **Dancing**: Social and physical benefits
- **Tai Chi**: Balance and flexibility

## The Dose-Response Effect

More activity = more benefits, up to a point:

1. Light activity: 2 extra years
2. Moderate activity: 4 extra years  
3. Regular moderate-vigorous: 7 extra years

## Starting (or Continuing) Safely

- Get clearance from your doctor
- Start slow and build gradually
- Find activities you enjoy
- Consider working with a trainer initially

Your body was made to move. Keep it going.
""",
        "category": "vitality",
        "featured_image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
        "featured_image_alt": "Active seniors exercising",
        "is_featured": False,
        "is_hero": False,
    },
    {
        "slug": "move-this-way-after-65-and-help-your-future-self-thrive",
        "title": "Move This Way After 65—And Help Your Future Self Thrive",
        "excerpt": "Specific movement patterns practiced now can protect your mobility and independence for decades to come.",
        "content": """# Move This Way After 65—And Help Your Future Self Thrive

Specific movement patterns practiced now can protect your mobility and independence for decades to come.

## The Movements That Matter Most

Physical therapists and longevity researchers agree: certain movements are critical for aging well.

## The Essential Six

1. **Squatting**: Getting up from chairs, toilets
2. **Stepping**: Navigating stairs and curbs
3. **Reaching**: Accessing shelves and cupboards
4. **Balancing**: Preventing falls
5. **Carrying**: Managing groceries and daily tasks
6. **Rotating**: Looking behind you, twisting safely

## Building Your Practice

Daily habit stacking:

- Morning: 10 squats while coffee brews
- Afternoon: Balance practice while waiting
- Evening: Gentle stretching before bed

## The Compound Effect

Like financial interest, movement benefits compound:

- Strong today = stronger tomorrow
- Flexible now = mobile later
- Balanced present = independent future

## Getting Help

Consider:
- Physical therapy assessment
- Senior fitness classes
- Online exercise programs for older adults
- Walking groups in your community

Your future self will thank your present self for every movement.
""",
        "category": "vitality",
        "featured_image_url": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
        "featured_image_alt": "Senior doing yoga",
        "is_featured": False,
        "is_hero": False,
    },
    # Additional articles to match all frontend category page references
    {
        "slug": "the-mediterranean-secret-why-this-diet-adds-years-to-your-life",
        "title": "The Mediterranean Secret: Why This Diet Adds Years to Your Life",
        "excerpt": "Explore the science behind one of the world's healthiest eating patterns and how to adopt it.",
        "content": """# The Mediterranean Secret: Why This Diet Adds Years to Your Life

Explore the science behind one of the world's healthiest eating patterns and how to adopt it.

## Why Mediterranean?

The Mediterranean diet consistently ranks as one of the healthiest eating patterns in the world. Decades of research show it can:

- Reduce heart disease risk by up to 30%
- Lower inflammation throughout the body
- Support brain health and cognitive function
- Help maintain a healthy weight

## Key Components

### What to Eat More Of

1. **Olive oil**: The cornerstone of Mediterranean cooking
2. **Vegetables**: Aim for 5+ servings daily
3. **Whole grains**: Bread, pasta, and grains in their whole form
4. **Legumes**: Beans, lentils, chickpeas weekly
5. **Fish**: At least twice per week
6. **Nuts and seeds**: A handful daily

### What to Limit

- Red meat (once or twice monthly)
- Processed foods
- Added sugars
- Refined grains

## Easy Ways to Start

- Switch to olive oil for cooking
- Add a side salad to every meal
- Snack on nuts instead of chips
- Try fish tacos on Tuesdays

The Mediterranean way isn't a diet—it's a delicious lifestyle.
""",
        "category": "nourishment",
        "featured_image_url": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
        "featured_image_alt": "Mediterranean diet foods",
        "is_featured": False,
        "is_hero": False,
    },
    {
        "slug": "gut-health-revolution-how-your-microbiome-affects-aging",
        "title": "Gut Health Revolution: How Your Microbiome Affects Aging",
        "excerpt": "Learn how the bacteria in your gut influence everything from brain health to immune function.",
        "content": """# Gut Health Revolution: How Your Microbiome Affects Aging

Learn how the bacteria in your gut influence everything from brain health to immune function.

## Your Second Brain

Your gut contains trillions of bacteria that influence virtually every aspect of your health. Scientists now call it your "second brain."

## The Gut-Aging Connection

Research shows that a healthy microbiome can:

- Reduce chronic inflammation (a key driver of aging)
- Support immune function
- Improve mood and mental clarity
- Help maintain healthy weight
- Protect against certain diseases

## Signs of an Unhealthy Gut

- Frequent bloating or gas
- Food intolerances
- Fatigue and brain fog
- Skin problems
- Frequent illness

## Building a Healthier Microbiome

### Foods to Embrace

1. **Fermented foods**: Yogurt, kefir, sauerkraut, kimchi
2. **Prebiotic fiber**: Garlic, onions, bananas, asparagus
3. **Diverse vegetables**: Different colors = different bacteria
4. **Whole grains**: Feed beneficial bacteria

### Habits to Adopt

- Eat slowly and mindfully
- Stay hydrated
- Manage stress
- Get enough sleep
- Exercise regularly

Your gut health is a garden—tend it well.
""",
        "category": "nourishment",
        "featured_image_url": "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&q=80",
        "featured_image_alt": "Fermented foods for gut health",
        "is_featured": False,
        "is_hero": False,
    },
    {
        "slug": "the-power-of-naps-science-backed-ways-to-recharge",
        "title": "The Power of Naps: Science-Backed Ways to Recharge Your Afternoon",
        "excerpt": "Discover the optimal nap duration and timing for maximum energy and cognitive benefits.",
        "content": """# The Power of Naps: Science-Backed Ways to Recharge Your Afternoon

Discover the optimal nap duration and timing for maximum energy and cognitive benefits.

## The Science of Napping

Napping isn't lazy—it's strategic. Research shows that well-timed naps can boost alertness, creativity, and mood.

## The Perfect Nap Formula

### Duration Matters

- **10-20 minutes**: Power nap for quick alertness boost
- **30 minutes**: May cause grogginess (sleep inertia)
- **60 minutes**: Includes slow-wave sleep, good for memory
- **90 minutes**: Full sleep cycle, enhances creativity

### Timing Is Everything

- **Best window**: 1-3 PM (matches your natural dip in alertness)
- **Avoid after 4 PM**: Can interfere with nighttime sleep
- **Consistent timing**: Same time daily helps regulate your body clock

## Napping Tips for Seniors

1. Keep it short (20-30 minutes max)
2. Set an alarm
3. Create a dark, quiet environment
4. Use a light blanket (body temp drops during sleep)
5. Give yourself 15 minutes to fully wake up

## When to Avoid Naps

- If you have insomnia
- Within 6 hours of bedtime
- If you wake up feeling worse

Embrace the siesta—your afternoon self will thank you.
""",
        "category": "restoration",
        "featured_image_url": "https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=800&q=80",
        "featured_image_alt": "Person napping comfortably",
        "is_featured": False,
        "is_hero": False,
    },
    {
        "slug": "stress-relief-techniques-that-actually-work",
        "title": "Stress Relief Techniques That Actually Work (According to Research)",
        "excerpt": "Evidence-based methods to reduce cortisol and promote deep relaxation.",
        "content": """# Stress Relief Techniques That Actually Work (According to Research)

Evidence-based methods to reduce cortisol and promote deep relaxation.

## Understanding Stress and Aging

Chronic stress accelerates aging at the cellular level. It shortens telomeres, increases inflammation, and impairs immune function. Managing stress isn't optional—it's essential for longevity.

## Proven Techniques

### 1. Box Breathing
- Inhale for 4 counts
- Hold for 4 counts
- Exhale for 4 counts
- Hold for 4 counts
- Repeat 4 times

### 2. Progressive Muscle Relaxation
Systematically tense and release each muscle group, starting from your toes and moving up to your head.

### 3. The 5-4-3-2-1 Grounding Technique
Name:
- 5 things you can see
- 4 things you can touch
- 3 things you can hear
- 2 things you can smell
- 1 thing you can taste

### 4. Nature Exposure
Just 20 minutes in nature significantly reduces cortisol levels.

### 5. Social Connection
A meaningful conversation can lower stress hormones for hours.

## Building Your Stress-Relief Toolkit

- Practice one technique daily
- Notice what works best for you
- Have a go-to method for acute stress
- Schedule regular relaxation time

Stress is inevitable. Suffering is optional.
""",
        "category": "restoration",
        "featured_image_url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
        "featured_image_alt": "Relaxation and meditation",
        "is_featured": False,
        "is_hero": False,
    },
    {
        "slug": "gratitude-practice-the-5-minute-habit-changing-lives",
        "title": "Gratitude Practice: The 5-Minute Habit That's Changing Lives",
        "excerpt": "How a simple daily practice can rewire your brain for happiness and resilience.",
        "content": """# Gratitude Practice: The 5-Minute Habit That's Changing Lives

How a simple daily practice can rewire your brain for happiness and resilience.

## The Neuroscience of Gratitude

Practicing gratitude literally changes your brain. MRI studies show it activates the hypothalamus and increases dopamine production. Over time, gratitude rewires neural pathways toward positivity.

## Proven Benefits

Research shows regular gratitude practice can:

- Improve sleep quality
- Reduce symptoms of depression
- Strengthen relationships
- Boost immune function
- Increase resilience to stress

## Simple Gratitude Practices

### The Three Good Things

Each evening, write down three good things that happened today and why they happened. Takes just 5 minutes.

### Gratitude Letters

Write a letter to someone who made a difference in your life. Deliver it in person for maximum impact.

### Gratitude Walks

During a walk, notice things you're grateful for—the warmth of the sun, birdsong, your ability to walk.

### Morning Gratitude

Before getting out of bed, think of three things you're looking forward to today.

## Making It Stick

1. Same time every day (habit stacking)
2. Keep a dedicated journal
3. Share gratitudes with a partner
4. Set a phone reminder
5. Be specific, not generic

Gratitude turns what we have into enough.
""",
        "category": "mindset",
        "featured_image_url": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
        "featured_image_alt": "Gratitude journaling",
        "is_featured": False,
        "is_hero": False,
    },
    {
        "slug": "brain-games-that-actually-keep-your-mind-sharp",
        "title": "Brain Games That Actually Keep Your Mind Sharp (And Which Ones Don't)",
        "excerpt": "Neuroscientists reveal which cognitive exercises provide real benefits for brain health.",
        "content": """# Brain Games That Actually Keep Your Mind Sharp (And Which Ones Don't)

Neuroscientists reveal which cognitive exercises provide real benefits for brain health.

## The Brain Training Controversy

Not all brain games are created equal. While some show real benefits, others are mostly marketing hype. Here's what the science actually says.

## What Works

### 1. Learning New Skills
- Musical instruments
- New languages
- Dancing (combines physical and mental)
- Art and crafts

### 2. Strategy Games
- Chess
- Bridge
- Mahjong
- Strategic board games

### 3. Physical-Mental Combinations
- Tai Chi
- Yoga
- Dance classes
- Sports that require strategy

### 4. Social Cognitive Activities
- Book clubs
- Debate groups
- Teaching others
- Group problem-solving

## What's Less Effective

- Simple matching games
- Repetitive puzzles without increasing difficulty
- Passive activities (watching TV)
- Activities that don't challenge you

## The Key Principles

1. **Novelty**: New challenges build new neural connections
2. **Complexity**: Push past your comfort zone
3. **Variety**: Cross-train your brain
4. **Progression**: Increase difficulty over time
5. **Engagement**: Choose activities you enjoy

The best brain exercise is one you'll actually do.
""",
        "category": "mindset",
        "featured_image_url": "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=80",
        "featured_image_alt": "Puzzle and brain games",
        "is_featured": False,
        "is_hero": False,
    },
    {
        "slug": "how-to-deepen-your-relationships-at-any-age",
        "title": "How to Deepen Your Relationships at Any Age",
        "excerpt": "Practical strategies for building more meaningful connections with the people who matter most.",
        "content": """# How to Deepen Your Relationships at Any Age

Practical strategies for building more meaningful connections with the people who matter most.

## Why Depth Matters

Research shows that the quality of our relationships matters more than quantity. Deep connections provide emotional support, meaning, and even physical health benefits.

## Signs of a Deep Relationship

- Mutual vulnerability and trust
- Consistent presence through good and bad times
- Genuine interest in each other's wellbeing
- Comfortable silence
- Growth-oriented conversations

## Strategies for Deepening Connections

### 1. Practice Vulnerability
Share your fears, hopes, and struggles. Vulnerability invites vulnerability.

### 2. Ask Better Questions
Move beyond "How are you?" Try:
- "What's challenging you right now?"
- "What are you most excited about these days?"
- "How can I support you?"

### 3. Be Fully Present
- Put away your phone
- Make eye contact
- Listen without planning your response
- Reflect back what you hear

### 4. Create Rituals
- Weekly calls with distant friends
- Monthly dinner dates
- Annual trips or traditions
- Morning coffee with your partner

### 5. Navigate Conflict Well
- Address issues promptly
- Use "I" statements
- Seek to understand first
- Apologize sincerely when wrong

The depth of your relationships determines the depth of your life.
""",
        "category": "relationships",
        "featured_image_url": "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80",
        "featured_image_alt": "Family connections",
        "is_featured": False,
        "is_hero": False,
    },
    {
        "slug": "loneliness-epidemic-what-science-says-about-staying-connected",
        "title": "The Loneliness Epidemic: What Science Says About Staying Connected",
        "excerpt": "Understanding the health risks of isolation and practical ways to combat loneliness.",
        "content": """# The Loneliness Epidemic: What Science Says About Staying Connected

Understanding the health risks of isolation and practical ways to combat loneliness.

## The Health Crisis No One Talks About

Loneliness is now recognized as a public health crisis. The Surgeon General reports that loneliness increases the risk of premature death by 26%—comparable to smoking 15 cigarettes daily.

## Health Impacts of Loneliness

- 29% increased risk of heart disease
- 32% increased risk of stroke
- Higher rates of depression and anxiety
- Weakened immune function
- Accelerated cognitive decline

## Understanding Loneliness

Loneliness isn't about being alone—it's about feeling disconnected. You can be lonely in a crowd and fulfilled in solitude. The key is perceived social support.

## Breaking the Cycle

### Small Steps
1. Smile and greet neighbors
2. Join a class or club
3. Volunteer regularly
4. Call one friend per week
5. Accept invitations (even when you don't feel like it)

### Building Community
- Faith communities
- Senior centers
- Hobby groups
- Exercise classes
- Online communities (as a supplement, not replacement)

### When It's Hard
- Start with structured activities
- Consider therapy if social anxiety is a barrier
- Be patient with yourself
- Quality over quantity

## The Antidote

Connection is a skill that can be cultivated. Start small, be consistent, and remember: someone else is hoping for connection too.
""",
        "category": "relationships",
        "featured_image_url": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
        "featured_image_alt": "Community gathering",
        "is_featured": False,
        "is_hero": False,
    },
    {
        "slug": "strength-training-for-seniors-its-never-too-late-to-start",
        "title": "Strength Training for Seniors: It's Never Too Late to Start",
        "excerpt": "How resistance exercise can reverse muscle loss and boost your metabolism at any age.",
        "content": """# Strength Training for Seniors: It's Never Too Late to Start

How resistance exercise can reverse muscle loss and boost your metabolism at any age.

## Why Strength Matters

After age 30, we lose 3-5% of muscle mass per decade. This sarcopenia accelerates aging, increases fall risk, and slows metabolism. The good news? Strength training can reverse it at any age.

## Benefits of Strength Training

- Increased muscle mass and strength
- Better balance and fall prevention
- Higher metabolism and easier weight management
- Stronger bones (reduces osteoporosis risk)
- Improved blood sugar control
- Better mood and cognitive function

## Getting Started Safely

### Week 1-2: Foundation
- Bodyweight exercises only
- Chair squats, wall push-ups
- 10-15 minutes, 2-3x per week

### Week 3-4: Adding Resistance
- Light resistance bands
- 1-2 lb dumbbells
- 20 minutes, 3x per week

### Month 2+: Progressive Overload
- Gradually increase weight
- Add new exercises
- Aim for 2-3 sets of 10-12 reps

## Essential Exercises

1. **Squats** (chair-assisted if needed)
2. **Push-ups** (wall or counter)
3. **Rows** (with bands or dumbbells)
4. **Step-ups** (using stairs)
5. **Planks** (modified as needed)

## Safety First

- Get medical clearance
- Work with a trainer initially
- Focus on form over weight
- Rest between sessions
- Listen to your body

Your muscles don't know how old you are—challenge them and they'll grow.
""",
        "category": "vitality",
        "featured_image_url": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
        "featured_image_alt": "Senior strength training",
        "is_featured": False,
        "is_hero": False,
    },
    {
        "slug": "walking-10000-steps-myth-or-magic",
        "title": "Walking 10,000 Steps: Myth or Magic? What the Research Really Says",
        "excerpt": "Scientists reveal the optimal daily step count for health benefits and longevity.",
        "content": """# Walking 10,000 Steps: Myth or Magic? What the Research Really Says

Scientists reveal the optimal daily step count for health benefits and longevity.

## The Origin of 10,000 Steps

Surprise: the 10,000 step goal wasn't based on science. It came from a 1965 Japanese marketing campaign for a pedometer called "Manpo-kei" (10,000 steps meter). But what does research actually say?

## What the Science Shows

### For Longevity
- Benefits start at just 4,000 steps/day
- Maximum benefits plateau around 7,500-10,000 steps
- More isn't necessarily better after 12,000 steps

### For Different Ages
- Adults under 60: ~8,000-10,000 steps optimal
- Adults over 60: ~6,000-8,000 steps may be sufficient
- Every 2,000 extra steps reduces mortality risk by 8-11%

## Quality vs. Quantity

Step count isn't everything. Consider:

- **Pace matters**: Brisk walking provides more benefits
- **Continuous walks**: 30 minutes sustained > scattered steps
- **Terrain**: Hills and varied surfaces challenge more muscles
- **Time of day**: Post-meal walks help blood sugar

## Making Steps Count

### Easy Ways to Add Steps
1. Park farther away
2. Take stairs when possible
3. Walk during phone calls
4. Post-dinner walks
5. Walking meetings

### Tracking Tips
- Most smartphones track steps automatically
- Aim for progress, not perfection
- Celebrate small wins
- Find a walking buddy

The best step goal is one more than yesterday.
""",
        "category": "vitality",
        "featured_image_url": "https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&q=80",
        "featured_image_alt": "Person walking outdoors",
        "is_featured": False,
        "is_hero": False,
    },
]


# Generate stable UUIDs for sample users (so they're consistent across runs)
SAMPLE_USERS = [
    {"id": "user-" + "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "name": "WellnessWanderer"},
    {"id": "user-" + "b2c3d4e5-f6a7-8901-bcde-f23456789012", "name": "HealthyHiker"},
    {"id": "user-" + "c3d4e5f6-a7b8-9012-cdef-345678901234", "name": "MindfulMaven"},
    {"id": "user-" + "d4e5f6a7-b8c9-0123-defa-456789012345", "name": "VitalityVoyager"},
    {"id": "user-" + "e5f6a7b8-c9d0-1234-efab-567890123456", "name": "RestfulReader"},
    {"id": "user-" + "f6a7b8c9-d0e1-2345-fabc-678901234567", "name": "NourishNinja"},
]

# Sample comments for seeding
SAMPLE_COMMENTS = [
    # Comments for hero article (article_id=1)
    {
        "article_slug": "why-bigger-friend-groups-could-be-the-secret-to-living-longer-no-membership-required",
        "user_index": 0,
        "content": "This really resonates with me! After retirement, I joined a hiking group and it's made such a difference in my daily happiness. The social connections are just as valuable as the exercise.",
        "hours_ago": 48,
    },
    {
        "article_slug": "why-bigger-friend-groups-could-be-the-secret-to-living-longer-no-membership-required",
        "user_index": 1,
        "content": "I've been trying to expand my social circle but it can be challenging at 65. Any suggestions for introverts?",
        "hours_ago": 36,
    },
    {
        "article_slug": "why-bigger-friend-groups-could-be-the-secret-to-living-longer-no-membership-required",
        "user_index": 2,
        "content": "The point about diverse friendships is so important. My friends range from 30 to 80 years old and each relationship brings something unique.",
        "hours_ago": 24,
    },
    {
        "article_slug": "why-bigger-friend-groups-could-be-the-secret-to-living-longer-no-membership-required",
        "user_index": 3,
        "content": "Great article! Would love to see more research on how online friendships compare to in-person connections for longevity.",
        "hours_ago": 12,
    },
    # Comments for mindfulness article (article_id=2)
    {
        "article_slug": "how-8-weeks-of-mindfulness-gave-seniors-sharper-minds-better-mood-and-more-zest",
        "user_index": 4,
        "content": "Started meditation 6 months ago and can confirm - it's been transformative for my mental clarity. Wish I had started sooner!",
        "hours_ago": 72,
    },
    {
        "article_slug": "how-8-weeks-of-mindfulness-gave-seniors-sharper-minds-better-mood-and-more-zest",
        "user_index": 5,
        "content": "The 5-10 minute starting point is perfect advice. I tried 30 minutes right away and gave up. Small steps work!",
        "hours_ago": 60,
    },
    {
        "article_slug": "how-8-weeks-of-mindfulness-gave-seniors-sharper-minds-better-mood-and-more-zest",
        "user_index": 0,
        "content": "Does anyone have app recommendations for guided meditation specifically designed for seniors?",
        "hours_ago": 48,
    },
    # Comments for nutrition article (article_id=3)
    {
        "article_slug": "eat-to-age-well-the-12-year-study-that-proves-its-not-too-late",
        "user_index": 1,
        "content": "Finally, a nutrition article that doesn't make me feel guilty about my eating habits! The emphasis on gradual change is refreshing.",
        "hours_ago": 96,
    },
    {
        "article_slug": "eat-to-age-well-the-12-year-study-that-proves-its-not-too-late",
        "user_index": 2,
        "content": "I'd love to see more articles on specific meal plans or recipes that incorporate these findings.",
        "hours_ago": 84,
    },
    # Comments for sleep/restoration articles
    {
        "article_slug": "the-bedtime-secret-90-year-olds-know-that-could-keep-your-brain-young",
        "user_index": 3,
        "content": "The blue light tip is so underrated. I bought blue light blocking glasses and my sleep improved within a week!",
        "hours_ago": 120,
    },
    {
        "article_slug": "the-bedtime-secret-90-year-olds-know-that-could-keep-your-brain-young",
        "user_index": 4,
        "content": "My doctor recommended keeping the bedroom at 67°F. Between that and the consistent schedule, I'm finally sleeping well.",
        "hours_ago": 108,
    },
    {
        "article_slug": "why-100-year-olds-are-out-sleeping-you-and-what-they-know-that-you-dont",
        "user_index": 5,
        "content": "What about naps? I've heard conflicting advice about whether afternoon naps help or hurt nighttime sleep.",
        "hours_ago": 96,
    },
]


def seed_database():
    """Seed the database with sample articles and comments."""
    print("=" * 50)
    print("Seeding Database with Sample Articles & Comments")
    print("=" * 50)
    
    # Drop all tables and recreate
    print("\n1. Dropping existing tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("2. Creating new tables with updated schema...")
    Base.metadata.create_all(bind=engine)
    
    # Create session
    db = SessionLocal()
    
    try:
        print(f"3. Adding {len(SAMPLE_ARTICLES)} sample articles...")
        
        # Create a mapping of slug to article_id
        slug_to_article = {}
        
        for i, article_data in enumerate(SAMPLE_ARTICLES, 1):
            article = Article(
                slug=article_data["slug"],
                title=article_data["title"],
                excerpt=article_data["excerpt"],
                content=article_data["content"],
                category=article_data["category"],
                featured_image_url=article_data["featured_image_url"],
                featured_image_alt=article_data["featured_image_alt"],
                is_featured=article_data["is_featured"],
                is_hero=article_data["is_hero"],
                published_at=datetime.utcnow(),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
            db.add(article)
            db.flush()  # Flush to get the article_id
            slug_to_article[article_data["slug"]] = article.article_id
            print(f"   [{i}/{len(SAMPLE_ARTICLES)}] Added: {article_data['title'][:50]}...")
        
        db.commit()
        
        # Add sample comments
        print(f"\n4. Adding {len(SAMPLE_COMMENTS)} sample comments...")
        
        comments_added = 0
        for comment_data in SAMPLE_COMMENTS:
            article_slug = comment_data["article_slug"]
            if article_slug in slug_to_article:
                user = SAMPLE_USERS[comment_data["user_index"]]
                comment = Comment(
                    article_id=slug_to_article[article_slug],
                    anonymous_user_id=user["id"],
                    display_name=user["name"],
                    content=comment_data["content"],
                    created_at=datetime.utcnow() - timedelta(hours=comment_data["hours_ago"]),
                )
                db.add(comment)
                comments_added += 1
        
        db.commit()
        print(f"   Added {comments_added} comments successfully!")
        
        print("\n5. Database seeded successfully!")
        
        # Verify articles
        count = db.query(Article).count()
        hero = db.query(Article).filter(Article.is_hero == True).first()
        featured = db.query(Article).filter(Article.is_featured == True).count()
        
        print(f"\nDatabase Summary:")
        print(f"   Total articles: {count}")
        print(f"   Hero article: {hero.title if hero else 'None'}")
        print(f"   Featured articles: {featured}")
        print(f"   Total comments: {db.query(Comment).count()}")
        
        # Count by category
        print(f"\nArticles by category:")
        for cat in ["nourishment", "restoration", "mindset", "relationships", "vitality"]:
            cat_count = db.query(Article).filter(Article.category == cat).count()
            print(f"   {cat}: {cat_count}")
        
    except Exception as e:
        print(f"\nError seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
