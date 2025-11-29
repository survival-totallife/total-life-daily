// YouTube API utilities for fetching channel videos

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const MIND_MY_AGE_CHANNEL_ID = "UCrxPvUYl_7Mb710Qz5dHHVw"; // Mind My Age channel ID

export interface YouTubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnail: {
        url: string;
        alt: string;
    };
    publishedAt: string;
    youtubeUrl: string;
}

interface YouTubeAPIResponse {
    items: Array<{
        id: {
            videoId: string;
        };
        snippet: {
            title: string;
            description: string;
            thumbnails: {
                high: {
                    url: string;
                };
                maxres?: {
                    url: string;
                };
            };
            publishedAt: string;
        };
    }>;
}

/**
 * Fetches the latest videos from the Mind My Age YouTube channel
 */
export async function getYouTubeVideos(maxResults: number = 5): Promise<YouTubeVideo[]> {
    if (!YOUTUBE_API_KEY) {
        console.warn("YouTube API key not configured, using fallback data");
        return getFallbackVideos();
    }

    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${MIND_MY_AGE_CHANNEL_ID}&part=snippet&order=date&maxResults=${maxResults}&type=video`,
            { next: { revalidate: 3600 } } // Cache for 1 hour
        );

        if (!response.ok) {
            throw new Error(`YouTube API error: ${response.status}`);
        }

        const data: YouTubeAPIResponse = await response.json();

        return data.items.map((item) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: {
                url: `https://img.youtube.com/vi/${item.id.videoId}/hqdefault.jpg`,
                alt: item.snippet.title,
            },
            publishedAt: item.snippet.publishedAt,
            youtubeUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        }));
    } catch (error) {
        console.error("Failed to fetch YouTube videos:", error);
        return getFallbackVideos();
    }
}

/**
 * Get a single video's details by ID
 */
export async function getYouTubeVideoById(videoId: string): Promise<YouTubeVideo | null> {
    if (!YOUTUBE_API_KEY) {
        return null;
    }

    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoId}&part=snippet`,
            { next: { revalidate: 3600 } }
        );

        if (!response.ok) {
            throw new Error(`YouTube API error: ${response.status}`);
        }

        const data = await response.json();
        const item = data.items[0];

        if (!item) return null;

        return {
            id: videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: {
                url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                alt: item.snippet.title,
            },
            publishedAt: item.snippet.publishedAt,
            youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
        };
    } catch (error) {
        console.error("Failed to fetch YouTube video:", error);
        return null;
    }
}

/**
 * Fallback videos when API is not available
 * These use actual Mind My Age video IDs with YouTube's thumbnail service
 */
function getFallbackVideos(): YouTubeVideo[] {
    // Real Mind My Age YouTube video IDs
    const videos = [
        {
            id: "sX4xqP2XGPE",
            title: "Mental Health Expert Reveals: Why Giving Can Be the Best Therapy for Anxiety & Loneliness",
            description: "Host Neelam Brar speaks with Jacqueline Way, founder of 365 Give, about the transformative power of giving.",
            publishedAt: "2024-11-07",
        },
        {
            id: "hHxZKrT6XgM",
            title: "The Lost Art of Writing Notes That Save Relationships & Unlock Emotional Freedom",
            description: "Andrea Driessen discusses Grace Notes and expressing love and appreciation while people are still alive.",
            publishedAt: "2024-10-31",
        },
        {
            id: "nQR9Y2n7V3k",
            title: "Digital Wellness Expert: How Social Media is Secretly Shaping Your Mental Health",
            description: "Exploring the impact of digital technology on mental wellness and strategies for healthier online habits.",
            publishedAt: "2024-10-24",
        },
    ];

    return videos.map((video) => ({
        id: video.id,
        title: video.title,
        description: video.description,
        thumbnail: {
            url: `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`,
            alt: video.title,
        },
        publishedAt: video.publishedAt,
        youtubeUrl: `https://www.youtube.com/watch?v=${video.id}`,
    }));
}

/**
 * Helper to generate YouTube thumbnail URL from video ID
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string {
    const qualityMap = {
        default: 'default',
        medium: 'mqdefault',
        high: 'hqdefault',
        maxres: 'maxresdefault',
    };
    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}
