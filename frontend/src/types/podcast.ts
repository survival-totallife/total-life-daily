/**
 * Podcast episode types
 */

export interface PodcastEpisode {
    id: string;
    title: string;
    description: string;
    publishedAt: string;
    duration: number; // in seconds
    audioUrl?: string;
    videoUrl?: string;
    youtubeUrl?: string;
    spotifyUrl?: string;
    applePodcastsUrl?: string;
    thumbnail?: {
        url: string;
        alt: string;
    };
    guests?: {
        name: string;
        title: string;
        avatar?: string;
    }[];
    topics?: string[];
}

/**
 * Podcast player state
 */
export interface PlayerState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
}
