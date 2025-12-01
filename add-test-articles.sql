-- Add Test Articles to Supabase
-- Run this in Supabase Dashboard → SQL Editor

-- Clear existing articles (optional - comment out if you want to keep existing data)
-- DELETE FROM articles;

-- Insert Hero Article + Featured Articles
INSERT INTO articles (slug, title, excerpt, content, category, is_featured, is_hero, featured_image_url, featured_image_alt)
VALUES 
-- HERO ARTICLE (Relationships)
(
  'why-bigger-friend-groups-could-be-the-secret-to-living-longer',
  'Why Bigger Friend Groups Could Be the Secret to Living Longer',
  'New research reveals that expanding your social circle could add years to your life. Here''s the science behind friendship and longevity.',
  '# Why Bigger Friend Groups Could Be the Secret to Living Longer

New research suggests that maintaining a large social network isn''t just good for your social calendar—it could actually help you live longer.

## The Research

A groundbreaking study published in the *Journal of Aging and Health* followed over 15,000 adults for more than a decade and found that those with larger friend groups had:

- **25% lower risk** of premature death
- **Better cognitive function** in later years
- **Lower rates of depression** and anxiety
- **Stronger immune systems**

## Why It Matters

Social connections provide:

1. **Emotional Support** - Friends help buffer stress and provide comfort during difficult times
2. **Physical Activity** - Social engagement often involves movement and activity
3. **Mental Stimulation** - Conversations and shared experiences keep your brain active
4. **Purpose and Meaning** - Strong relationships give you reasons to stay active and engaged

## Take Action

Start expanding your social circle today:

- Join local clubs or groups aligned with your interests
- Reconnect with old friends
- Volunteer in your community
- Take classes or workshops
- Say yes to social invitations

Remember: It''s never too late to build meaningful friendships that could add years to your life.',
  'relationships',
  true,
  true,
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=2000&h=800&fit=crop&q=90',
  'Diverse group of mature friends laughing and enjoying time together outdoors'
),

-- FEATURED ARTICLE 1 (Mindset)
(
  'how-8-weeks-of-mindfulness-gave-seniors-sharper-minds',
  'How 8 Weeks of Mindfulness Gave Seniors Sharper Minds, Better Mood, and More Zest',
  'A new study shows that just two months of mindfulness practice can significantly improve cognitive function and mental well-being in older adults.',
  '# How 8 Weeks of Mindfulness Gave Seniors Sharper Minds

Just 8 weeks of mindfulness meditation can transform your brain, mood, and overall quality of life—especially after age 60.

## The Study

Researchers at the University of Massachusetts followed 150 adults aged 60-85 who participated in an 8-week mindfulness program. The results were remarkable:

- **40% improvement** in memory and attention
- **35% reduction** in anxiety symptoms
- **Increased gray matter** in brain regions associated with learning
- **Better sleep quality** across all participants

## What They Did

Participants practiced:

- **20 minutes daily** of guided meditation
- **Body scan exercises** before bed
- **Mindful eating** during one meal per day
- **Weekly group sessions** for support

## Your 8-Week Plan

**Week 1-2:** Start with 5 minutes of breath awareness daily

**Week 3-4:** Increase to 10 minutes, add body scans

**Week 5-6:** Practice mindful walking and eating

**Week 7-8:** Aim for 20 minutes daily, join a group if possible

## Why It Works

Mindfulness reduces stress hormones, improves blood flow to the brain, and strengthens neural connections. It''s like a gym workout for your mind.

Start today—even 5 minutes makes a difference.',
  'mindset',
  true,
  false,
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
  'Senior practicing mindfulness meditation in peaceful setting'
),

-- FEATURED ARTICLE 2 (Nourishment)
(
  'eat-to-age-well-the-12-year-study-that-proves-its-not-too-late',
  'Eat to Age Well: The 12-Year Study That Proves It''s Not Too Late',
  'Even if you''ve eaten poorly for years, switching to a healthier diet can rapidly improve your health and longevity—no matter your age.',
  '# Eat to Age Well: The 12-Year Study

It''s never too late to change your diet. A landmark 12-year study proves that switching to healthy eating, even in your 60s or 70s, can add years to your life.

## The Research

Harvard researchers tracked 120,000 adults and found that those who improved their diet quality after age 60:

- **Reduced death risk by 25%** within just 8 years
- **Lowered heart disease risk by 30%**
- **Improved cognitive function**
- **Maintained independence longer**

## What to Eat

The study identified key foods that made the biggest difference:

### Add More:
- **Vegetables** (especially leafy greens)
- **Berries and fruits**
- **Whole grains** (oats, quinoa, brown rice)
- **Nuts and seeds**
- **Fatty fish** (salmon, sardines)
- **Beans and legumes**
- **Olive oil**

### Eat Less:
- Processed meats
- Refined sugars
- White bread and pasta
- Fried foods
- Sugary drinks

## Simple Swaps

1. **Replace** white rice → brown rice or quinoa
2. **Replace** soda → water with lemon
3. **Replace** chips → nuts or fruit
4. **Replace** butter → olive oil
5. **Replace** beef → fish twice a week

## The Timeline

Benefits start appearing faster than you think:

- **Week 1-2:** More energy, better digestion
- **Month 1:** Improved sleep, clearer thinking
- **Months 3-6:** Lower blood pressure, weight loss
- **Year 1+:** Reduced disease risk, better lab results

Start with one small change today. Your future self will thank you.',
  'nourishment',
  true,
  false,
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
  'Colorful healthy meal with vegetables and whole grains'
),

-- FEATURED ARTICLE 3 (Restoration)
(
  'the-bedtime-secret-90-year-olds-know',
  'The Bedtime Secret 90-Year-Olds Know (That Could Keep Your Brain Young)',
  'Centenarians share one surprising sleep habit that protects their brains from aging. Here''s how to adopt it tonight.',
  '# The Bedtime Secret 90-Year-Olds Know

Want to know what healthy 90-year-olds do differently? They protect their sleep like it''s medicine—because it is.

## The Discovery

Researchers studying centenarians in "Blue Zones" (regions with the highest concentrations of people over 100) found one consistent pattern: exceptional sleep habits.

### What They Do:

1. **Consistent schedule** - Bed and wake at the same time daily
2. **7-8 hours minimum** - No cutting corners
3. **Dark, cool rooms** - 65-68°F is ideal
4. **No screens 2 hours before bed**
5. **Afternoon rest** - 20-30 minute naps when needed

## Why Sleep Matters

During deep sleep, your brain:

- **Flushes out toxins** linked to Alzheimer''s
- **Consolidates memories** from the day
- **Repairs cellular damage**
- **Regulates hormones** that control appetite and stress

Poor sleep accelerates aging and increases risk of:
- Dementia by 30%
- Heart disease by 45%
- Type 2 diabetes by 28%

## Your Sleep Prescription

### Before Bed:
- Dim lights 2 hours before sleep
- Take a warm bath or shower
- Read a physical book
- Practice gentle stretching
- Avoid caffeine after 2 PM

### Bedroom Setup:
- Keep it **cool** (65-68°F)
- Make it **dark** (blackout curtains)
- Keep it **quiet** (white noise if needed)
- Invest in a **good mattress**

### Morning Routine:
- Wake at the same time (even weekends)
- Get sunlight within 30 minutes
- Avoid hitting snooze

## The 21-Day Challenge

Commit to a consistent sleep schedule for 21 days. Track how you feel. Most people report:

- More energy
- Better mood
- Clearer thinking
- Fewer aches and pains

Your brain will thank you for decades to come.',
  'restoration',
  true,
  false,
  'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80',
  'Peaceful bedroom setup for restful sleep'
),

-- CATEGORY ARTICLES (2 per category)

-- Nourishment Category
(
  'she-just-ate-more-salmon-you-wont-believe-what-happened',
  'She Just Ate More Salmon—You Won''t Believe What Happened to Her Brain and Balance',
  'Adding omega-3 rich fish to your diet twice a week can dramatically improve cognitive function and reduce fall risk.',
  '# She Just Ate More Salmon

Margaret, 68, started eating salmon twice a week. Six months later, her doctor was amazed.

## The Results

- Memory improved by 30%
- Balance tests showed 40% improvement
- Inflammation markers dropped
- Mood significantly better

## The Science

Omega-3 fatty acids in fish like salmon:

- Build brain cell membranes
- Reduce brain inflammation
- Improve neuron communication
- Support balance and coordination

## Best Fish Sources

1. **Salmon** (wild-caught preferred)
2. **Sardines**
3. **Mackerel**
4. **Anchovies**
5. **Herring**

Aim for 2-3 servings per week.

## Simple Recipe

**Baked Salmon:**
- Brush with olive oil
- Season with lemon, garlic, herbs
- Bake at 400°F for 12-15 minutes
- Serve with vegetables

Your brain will love you for it.',
  'nourishment',
  false,
  false,
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
  'Grilled salmon with vegetables and lemon'
),

(
  'the-purple-veggie-that-cuts-inflammation-by-half',
  'The Purple Veggie That Cuts Inflammation by Half (And Tastes Amazing)',
  'Eggplant isn''t just delicious—it''s a powerful anti-inflammatory food that can reduce pain and improve mobility.',
  '# The Purple Veggie That Cuts Inflammation

Eggplant contains nasunin, a powerful antioxidant that fights inflammation throughout your body.

## Health Benefits

- Reduces joint pain
- Protects brain cells
- Supports heart health
- May prevent certain cancers

## How to Prepare

**Roasted Eggplant:**
1. Slice into rounds
2. Brush with olive oil
3. Roast at 425°F for 25 minutes
4. Season with herbs and spices

Try it in stir-fries, curries, or on its own!',
  'nourishment',
  false,
  false,
  'https://images.unsplash.com/photo-1659261200225-ec63a7800e5e?w=800&q=80',
  'Fresh purple eggplants'
),

-- Restoration Category
(
  'the-20-minute-afternoon-habit-that-adds-years-to-your-life',
  'The 20-Minute Afternoon Habit That Adds Years to Your Life',
  'Science confirms what Mediterranean cultures have known for centuries: afternoon naps are powerful medicine.',
  '# The 20-Minute Afternoon Habit

A daily 20-minute nap can:

- Reduce heart disease risk by 37%
- Improve memory and learning
- Boost afternoon productivity
- Reduce stress hormones

## The Perfect Nap

**Timing:** 1-3 PM (after lunch)
**Duration:** 20-30 minutes (no more!)
**Environment:** Dark, quiet, comfortable

Set an alarm to avoid grogginess.

## Benefits Add Up

People who nap regularly:
- Live longer on average
- Have sharper minds
- Experience less stress
- Feel more energetic

Make it a daily ritual.',
  'restoration',
  false,
  false,
  'https://images.unsplash.com/photo-1519310164122-4b4a22a3e43a?w=800&q=80',
  'Person taking peaceful afternoon nap'
),

-- Mindset Category
(
  'feeling-blue-try-these-two-walks-a-week',
  'Feeling Blue? Try These Two Walks a Week—They Cut Depression Nearly in Half',
  'Just two 30-minute walks in nature per week can dramatically improve mood and reduce anxiety.',
  '# Two Walks That Change Everything

Research shows that walking in nature just twice a week can reduce depression symptoms by 45%.

## Why It Works

- Natural sunlight boosts vitamin D
- Exercise releases endorphins
- Green spaces reduce stress
- Fresh air improves oxygen flow

## Your Walking Plan

**Week 1-2:** 15 minutes, twice weekly
**Week 3-4:** 25 minutes, twice weekly
**Week 5+:** 30 minutes, twice weekly

Walk in parks, trails, or green neighborhoods.

## Maximize Benefits

- Leave phone behind
- Practice mindful breathing
- Notice nature around you
- Walk with a friend occasionally

Start this week!',
  'mindset',
  false,
  false,
  'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80',
  'Person walking peacefully in nature'
),

(
  'the-5-minute-morning-ritual-that-programs-your-brain-for-joy',
  'The 5-Minute Morning Ritual That Programs Your Brain for Joy',
  'A simple gratitude practice each morning can rewire your brain for happiness and resilience.',
  '# 5 Minutes to Rewire Your Brain

Starting your day with gratitude literally changes your brain structure over time.

## The Practice

Each morning, write down:
1. Three things you''re grateful for
2. One positive memory from yesterday
3. One thing you''re looking forward to

That''s it. Five minutes.

## The Science

Gratitude practice:
- Increases dopamine and serotonin
- Strengthens positive neural pathways
- Reduces stress hormones
- Improves sleep quality

## 30-Day Results

After one month, people report:
- Better mood overall
- More resilience to stress
- Improved relationships
- Greater life satisfaction

Start tomorrow morning!',
  'mindset',
  false,
  false,
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80',
  'Person writing in gratitude journal with morning coffee'
),

-- Relationships Category
(
  'want-more-independent-years-heres-the-one-social-habit',
  'Want More Independent Years? Here''s the One Social Habit You Can''t Skip',
  'Regular social contact isn''t just nice—it''s essential for maintaining independence as you age.',
  '# The Social Habit That Preserves Independence

People with weekly social contact maintain independence 60% longer than those who are isolated.

## Why It Matters

Social engagement:
- Keeps your mind sharp
- Motivates physical activity
- Provides emotional support
- Gives you purpose

## The Magic Number

**Aim for 3-5 social interactions per week:**
- Coffee with a friend
- Phone call with family
- Group exercise class
- Volunteer work
- Book club or hobby group

## Start Today

Pick one:
- Call someone you haven''t talked to in a while
- Accept a social invitation
- Join a local group
- Volunteer once a week

Your future independence depends on it.',
  'relationships',
  false,
  false,
  'https://images.unsplash.com/photo-1516728778615-2d590ea1855e?w=800&q=80',
  'Friends enjoying coffee and conversation together'
),

-- Vitality Category
(
  'add-up-to-7-extra-years-just-keep-moving-after-65',
  'Add Up to 7 Extra Years—Just Keep Moving After 65',
  'Adults who stay active after 65 live significantly longer and healthier lives than those who don''t.',
  '# Movement Is Medicine

People who exercise regularly after 65 live an average of **7 years longer** than sedentary peers.

## The Research

A 20-year study found that active seniors:
- Live 7+ years longer
- Spend fewer years with disability
- Have 50% less disease
- Maintain independence longer

## How Much?

**Minimum:** 150 minutes per week of moderate activity

Examples:
- Brisk walking (30 min, 5 days/week)
- Swimming
- Gardening
- Dancing
- Cycling
- Strength training 2x/week

## Start Small

**Week 1:** Walk 10 minutes daily
**Week 2:** Add 5 minutes
**Week 3:** Add strength exercises 2x/week
**Week 4+:** Build to 30 minutes, 5 days/week

## Never Too Late

Even if you''ve been inactive for years, starting now still provides massive benefits. Your body responds to movement at any age.

The best time to start was yesterday. The second best time is today.',
  'vitality',
  false,
  false,
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
  'Active seniors exercising together outdoors'
),

(
  'the-balance-exercise-that-could-save-your-life',
  'The Balance Exercise That Could Save Your Life (Do This Daily)',
  'Falls are the leading cause of injury in older adults. This simple daily exercise can dramatically reduce your risk.',
  '# One Exercise That Saves Lives

Falls cause 95% of hip fractures in seniors. This 2-minute daily exercise can cut your fall risk by 40%.

## The Exercise: Single-Leg Stands

1. Stand near a counter or wall for safety
2. Lift one foot off the ground
3. Hold for 10-30 seconds
4. Switch legs
5. Repeat 3 times per leg

Do this daily.

## Why It Works

Balance training:
- Strengthens stabilizer muscles
- Improves proprioception
- Enhances reaction time
- Builds confidence

## Progression

**Week 1:** Hold 10 seconds per leg
**Week 2:** Hold 20 seconds per leg
**Week 3:** Hold 30 seconds per leg
**Week 4+:** Try without holding the wall

## Add This Too

- Tai chi classes
- Yoga
- Walking heel-to-toe
- Standing on one foot while brushing teeth

Your balance is your independence. Protect it daily.',
  'vitality',
  false,
  false,
  'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&q=80',
  'Senior practicing balance exercise with confidence'
);

-- Verify the insert
SELECT 
  category,
  COUNT(*) as article_count,
  SUM(CASE WHEN is_featured THEN 1 ELSE 0 END) as featured_count,
  SUM(CASE WHEN is_hero THEN 1 ELSE 0 END) as hero_count
FROM articles
GROUP BY category
ORDER BY category;
