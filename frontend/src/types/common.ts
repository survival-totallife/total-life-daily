/**
 * Common API response wrapper
 */
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: Record<string, unknown>;
    };
    meta?: {
        timestamp: string;
        requestId?: string;
    };
}

/**
 * API error
 */
export interface ApiError {
    code: string;
    message: string;
    status: number;
    details?: Record<string, unknown>;
}

/**
 * Newsletter subscription
 */
export interface NewsletterSubscription {
    email: string;
    name?: {
        first: string;
        last: string;
    };
    phone?: string;
}
