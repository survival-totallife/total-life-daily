import { supabase } from './supabase'
import type { Article, Comment } from './supabase'

// ============================================
// ARTICLE QUERIES
// ============================================

/**
 * Get all articles, ordered by publish date (newest first)
 */
export async function getArticles(skip = 0, limit = 100) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .range(skip, skip + limit - 1)

  if (error) throw error
  return data as Article[]
}

/**
 * Get a single article by slug
 */
export async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data as Article
}

/**
 * Get a single article by ID
 */
export async function getArticleById(id: number) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Article
}

/**
 * Get the hero article (is_hero = true)
 */
export async function getHeroArticle() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_hero', true)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
  return data as Article | null
}

/**
 * Get featured articles
 */
export async function getFeaturedArticles(limit = 3) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Article[]
}

/**
 * Get articles by category
 */
export async function getArticlesByCategory(category: string, limit = 10) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', category)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as Article[]
}

/**
 * Get articles grouped by category
 */
export async function getArticlesGroupedByCategory(limitPerCategory = 2) {
  const categories = ['nourishment', 'restoration', 'mindset', 'relationships', 'vitality']

  const result: Record<string, Article[]> = {}

  for (const category of categories) {
    const articles = await getArticlesByCategory(category, limitPerCategory)
    result[category] = articles
  }

  return result
}

// ============================================
// ARTICLE CRUD (for admin/test pages)
// ============================================

/**
 * Create a new article
 */
export async function createArticle(articleData: {
  slug: string
  title: string
  excerpt?: string | null
  content: string
  category: string
  featured_image_url?: string | null
  featured_image_alt?: string | null
  is_featured?: boolean
  is_hero?: boolean
}) {
  const { data, error } = await supabase
    .from('articles')
    .insert({
      slug: articleData.slug,
      title: articleData.title,
      excerpt: articleData.excerpt || null,
      content: articleData.content,
      category: articleData.category,
      featured_image_url: articleData.featured_image_url || null,
      featured_image_alt: articleData.featured_image_alt || null,
      is_featured: articleData.is_featured || false,
      is_hero: articleData.is_hero || false,
    })
    .select()
    .single()

  if (error) throw error
  return data as Article
}

/**
 * Update an article by ID
 */
export async function updateArticle(id: number, articleData: {
  slug?: string
  title?: string
  excerpt?: string | null
  content?: string
  category?: string
  featured_image_url?: string | null
  featured_image_alt?: string | null
  is_featured?: boolean
  is_hero?: boolean
}) {
  const { data, error } = await supabase
    .from('articles')
    .update(articleData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Article
}

/**
 * Delete an article by ID
 */
export async function deleteArticle(id: number) {
  console.log('Deleting article with id:', id);
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Delete error:', error);
    throw error;
  }
  return true
}

/**
 * Get homepage data (hero + featured + articles by category)
 */
export async function getHomepageData() {
  const [hero, featured, articlesByCategory] = await Promise.all([
    getHeroArticle(),
    getFeaturedArticles(3),
    getArticlesGroupedByCategory(2)
  ])

  return {
    hero,
    featured,
    articles_by_category: articlesByCategory
  }
}

// ============================================
// ARTICLE LIKES
// ============================================

/**
 * Get like count for an article
 */
export async function getArticleLikesCount(articleId: number) {
  const { count, error } = await supabase
    .from('article_likes')
    .select('*', { count: 'exact', head: true })
    .eq('article_id', articleId)

  if (error) throw error
  return count || 0
}

/**
 * Check if user has liked an article
 */
export async function isArticleLikedByUser(articleId: number, userId: string) {
  const { data, error } = await supabase
    .from('article_likes')
    .select('id')
    .eq('article_id', articleId)
    .eq('anonymous_user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return !!data
}

/**
 * Toggle article like (add if not exists, remove if exists)
 */
export async function toggleArticleLike(articleId: number, userId: string) {
  // Check if already liked
  const isLiked = await isArticleLikedByUser(articleId, userId)

  if (isLiked) {
    // Unlike
    const { error } = await supabase
      .from('article_likes')
      .delete()
      .eq('article_id', articleId)
      .eq('anonymous_user_id', userId)

    if (error) throw error
  } else {
    // Like
    const { error } = await supabase
      .from('article_likes')
      .insert({ article_id: articleId, anonymous_user_id: userId })

    if (error) throw error
  }

  // Return new count and liked status
  const likesCount = await getArticleLikesCount(articleId)
  return { likes_count: likesCount, is_liked: !isLiked }
}

// ============================================
// COMMENTS
// ============================================

/**
 * Get comments for an article
 */
export async function getComments(articleId: number) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('article_id', articleId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as Comment[]
}

/**
 * Get comment count for an article
 */
export async function getCommentsCount(articleId: number) {
  const { count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('article_id', articleId)

  if (error) throw error
  return count || 0
}

/**
 * Create a new comment
 */
export async function createComment(
  articleId: number,
  userId: string,
  displayName: string,
  content: string
) {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      article_id: articleId,
      anonymous_user_id: userId,
      display_name: displayName,
      content
    })
    .select()
    .single()

  if (error) throw error
  return data as Comment
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: number, userId: string) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('anonymous_user_id', userId)

  if (error) throw error
  return true
}

// ============================================
// COMMENT LIKES
// ============================================

/**
 * Get like count for a comment
 */
export async function getCommentLikesCount(commentId: number) {
  const { count, error } = await supabase
    .from('comment_likes')
    .select('*', { count: 'exact', head: true })
    .eq('comment_id', commentId)

  if (error) throw error
  return count || 0
}

/**
 * Check if user has liked a comment
 */
export async function isCommentLikedByUser(commentId: number, userId: string) {
  const { data, error } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('anonymous_user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return !!data
}

/**
 * Toggle comment like (add if not exists, remove if exists)
 */
export async function toggleCommentLike(commentId: number, userId: string) {
  // Check if already liked
  const isLiked = await isCommentLikedByUser(commentId, userId)

  if (isLiked) {
    // Unlike
    const { error } = await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('anonymous_user_id', userId)

    if (error) throw error
  } else {
    // Like
    const { error } = await supabase
      .from('comment_likes')
      .insert({ comment_id: commentId, anonymous_user_id: userId })

    if (error) throw error
  }

  // Return new count and liked status
  const likesCount = await getCommentLikesCount(commentId)
  return { likes_count: likesCount, is_liked: !isLiked }
}
