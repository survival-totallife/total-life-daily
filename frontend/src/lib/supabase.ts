import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Article {
  id: number
  slug: string
  title: string
  excerpt: string | null
  content: string
  category: 'nourishment' | 'restoration' | 'mindset' | 'relationships' | 'vitality'
  featured_image_url: string | null
  featured_image_alt: string | null
  is_featured: boolean
  is_hero: boolean
  published_at: string
  created_at: string
  updated_at: string
}

export interface ArticleLike {
  id: number
  article_id: number
  anonymous_user_id: string
  created_at: string
}

export interface Comment {
  id: number
  article_id: number
  anonymous_user_id: string
  display_name: string
  content: string
  created_at: string
}

export interface CommentLike {
  id: number
  comment_id: number
  anonymous_user_id: string
  created_at: string
}
