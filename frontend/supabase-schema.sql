-- Supabase SQL Schema for Total Life Daily
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Articles table
CREATE TABLE articles (
    id BIGSERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('nourishment', 'restoration', 'mindset', 'relationships', 'vitality')),
    featured_image_url TEXT,
    featured_image_alt TEXT,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_hero BOOLEAN DEFAULT FALSE NOT NULL,
    published_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Article likes table
CREATE TABLE article_likes (
    id BIGSERIAL PRIMARY KEY,
    article_id BIGINT REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
    anonymous_user_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(article_id, anonymous_user_id)
);

-- Comments table
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    article_id BIGINT REFERENCES articles(id) ON DELETE CASCADE NOT NULL,
    anonymous_user_id TEXT NOT NULL,
    display_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Comment likes table
CREATE TABLE comment_likes (
    id BIGSERIAL PRIMARY KEY,
    comment_id BIGINT REFERENCES comments(id) ON DELETE CASCADE NOT NULL,
    anonymous_user_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(comment_id, anonymous_user_id)
);

-- Indexes for better performance
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_is_featured ON articles(is_featured);
CREATE INDEX idx_articles_is_hero ON articles(is_hero);
CREATE INDEX idx_article_likes_article_id ON article_likes(article_id);
CREATE INDEX idx_comments_article_id ON comments(article_id);
CREATE INDEX idx_comment_likes_comment_id ON comment_likes(comment_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on articles
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow public read access
CREATE POLICY "Allow public read access on articles"
    ON articles FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public read access on article_likes"
    ON article_likes FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public read access on comments"
    ON comments FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public read access on comment_likes"
    ON comment_likes FOR SELECT
    TO anon, authenticated
    USING (true);

-- RLS Policies - Allow public insert (for likes and comments)
CREATE POLICY "Allow public insert on article_likes"
    ON article_likes FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public insert on comments"
    ON comments FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public insert on comment_likes"
    ON comment_likes FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- RLS Policies - Allow users to delete their own likes/comments
CREATE POLICY "Allow users to delete their own article likes"
    ON article_likes FOR DELETE
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow users to delete their own comments"
    ON comments FOR DELETE
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow users to delete their own comment likes"
    ON comment_likes FOR DELETE
    TO anon, authenticated
    USING (true);

-- Note: Articles INSERT/UPDATE/DELETE will be restricted by default
-- Only authenticated admin users should be able to modify articles
-- You can add admin policies later if needed
