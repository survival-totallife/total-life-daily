/**
 * API client functions for article engagement (likes, comments)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// =============================================================================
// Types
// =============================================================================

export interface Comment {
    comment_id: number;
    article_id: number;
    anonymous_user_id: string;
    display_name: string;
    content: string;
    created_at: string;
    likes_count: number;
    is_liked: boolean;
    is_own: boolean;
}

export interface CommentCreate {
    anonymous_user_id: string;
    display_name: string;
    content: string;
}

export interface LikeResponse {
    article_id: number;
    likes_count: number;
    is_liked: boolean;
}

export interface CommentLikeResponse {
    comment_id: number;
    likes_count: number;
    is_liked: boolean;
}

export interface EngagementStats {
    article_id: number;
    likes_count: number;
    comments_count: number;
    is_liked_by_user: boolean;
}

// =============================================================================
// Article Likes
// =============================================================================

/**
 * Get engagement stats for an article
 */
export async function getEngagementStats(
    articleId: number,
    anonymousUserId?: string
): Promise<EngagementStats> {
    const params = new URLSearchParams();
    if (anonymousUserId) {
        params.set("user_id", anonymousUserId);
    }

    const response = await fetch(
        `${API_BASE_URL}/articles/${articleId}/engagement?${params.toString()}`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch engagement stats: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Toggle like on an article
 */
export async function toggleArticleLike(
    articleId: number,
    anonymousUserId: string
): Promise<LikeResponse> {
    const response = await fetch(
        `${API_BASE_URL}/articles/${articleId}/like`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: anonymousUserId }),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to toggle like: ${response.statusText}`);
    }

    return response.json();
}

// =============================================================================
// Comments
// =============================================================================

/**
 * Get comments for an article
 */
export async function getComments(
    articleId: number,
    anonymousUserId?: string
): Promise<Comment[]> {
    const params = new URLSearchParams();
    if (anonymousUserId) {
        params.set("user_id", anonymousUserId);
    }

    const response = await fetch(
        `${API_BASE_URL}/articles/${articleId}/comments?${params.toString()}`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Add a comment to an article
 */
export async function addComment(
    articleId: number,
    comment: CommentCreate
): Promise<Comment> {
    const response = await fetch(
        `${API_BASE_URL}/articles/${articleId}/comments`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(comment),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to add comment: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Delete a comment (only by the author)
 */
export async function deleteComment(
    articleId: number,
    commentId: number,
    anonymousUserId: string
): Promise<void> {
    const response = await fetch(
        `${API_BASE_URL}/articles/${articleId}/comments/${commentId}`,
        {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: anonymousUserId }),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to delete comment: ${response.statusText}`);
    }
}

/**
 * Toggle like on a comment
 */
export async function toggleCommentLike(
    articleId: number,
    commentId: number,
    anonymousUserId: string
): Promise<CommentLikeResponse> {
    const response = await fetch(
        `${API_BASE_URL}/articles/${articleId}/comments/${commentId}/like`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: anonymousUserId }),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to toggle comment like: ${response.statusText}`);
    }

    return response.json();
}
