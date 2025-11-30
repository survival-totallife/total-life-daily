"use client";

import { useEffect, useState } from "react";

// Generate a unique ID
function generateId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `anon_${timestamp}_${randomPart}`;
}

// Generate a random display name (no numbers)
function generateDisplayName(): string {
    const adjectives = [
        // Positive personality traits
        "Happy", "Curious", "Wise", "Gentle", "Brave", "Calm", "Kind",
        "Bright", "Swift", "Warm", "Bold", "Free", "True", "Pure",
        "Cheerful", "Peaceful", "Clever", "Lively", "Mellow", "Serene",
        "Radiant", "Vibrant", "Graceful", "Noble", "Joyful", "Mindful",
        "Earnest", "Sincere", "Devoted", "Spirited", "Hopeful", "Tranquil",
        "Witty", "Daring", "Steady", "Humble", "Eager", "Loyal",
        "Friendly", "Playful", "Thoughtful", "Creative", "Inspired", "Balanced",
        // Nature-inspired
        "Golden", "Silver", "Amber", "Crystal", "Coral", "Misty",
        "Sunny", "Breezy", "Starry", "Mossy", "Dewy", "Meadow"
    ];
    const nouns = [
        // Explorer/seeker types
        "Reader", "Explorer", "Thinker", "Seeker", "Learner", "Wanderer",
        "Dreamer", "Spirit", "Soul", "Heart", "Mind", "Star", "Light",
        "Voyager", "Pioneer", "Sage", "Scholar", "Pilgrim", "Nomad",
        // Nature elements
        "River", "Mountain", "Forest", "Ocean", "Meadow", "Valley",
        "Breeze", "Dawn", "Dusk", "Aurora", "Horizon", "Summit",
        // Animals (positive connotations)
        "Owl", "Fox", "Heron", "Sparrow", "Dolphin", "Butterfly",
        "Falcon", "Robin", "Otter", "Swan", "Crane", "Hawk",
        // Abstract concepts
        "Echo", "Ember", "Bloom", "Whisper", "Haven", "Journey",
        "Quest", "Path", "Beacon", "Harbor", "Anchor", "Compass"
    ];

    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adjective}${noun}`;
}

// Generate avatar initials from display name
function getInitials(name: string): string {
    const words = name.match(/[A-Z][a-z]+/g) || [];
    if (words.length >= 2 && words[0] && words[1]) {
        return words[0][0] + words[1][0];
    }
    return name.substring(0, 2).toUpperCase();
}

// Generate a consistent color based on user ID
function generateAvatarColor(userId: string): string {
    const colors = [
        "from-rose-400 to-rose-600",
        "from-orange-400 to-orange-600",
        "from-amber-400 to-amber-600",
        "from-emerald-400 to-emerald-600",
        "from-teal-400 to-teal-600",
        "from-cyan-400 to-cyan-600",
        "from-blue-400 to-blue-600",
        "from-indigo-400 to-indigo-600",
        "from-violet-400 to-violet-600",
        "from-purple-400 to-purple-600",
        "from-fuchsia-400 to-fuchsia-600",
        "from-pink-400 to-pink-600",
    ];

    // Generate a consistent index based on user ID
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        const char = userId.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return colors[Math.abs(hash) % colors.length];
}

export interface AnonymousUser {
    id: string;
    displayName: string;
    initials: string;
    avatarColor: string;
    createdAt: string;
}

const STORAGE_KEY = "tld_anonymous_user";

export function useAnonymousUser() {
    const [user, setUser] = useState<AnonymousUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for existing user
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            try {
                const parsedUser = JSON.parse(stored) as AnonymousUser;
                setUser(parsedUser);
            } catch {
                // Invalid stored data, create new user
                const newUser = createNewUser();
                setUser(newUser);
            }
        } else {
            // No existing user, create new one
            const newUser = createNewUser();
            setUser(newUser);
        }

        setIsLoading(false);
    }, []);

    function createNewUser(): AnonymousUser {
        const id = generateId();
        const displayName = generateDisplayName();
        const newUser: AnonymousUser = {
            id,
            displayName,
            initials: getInitials(displayName),
            avatarColor: generateAvatarColor(id),
            createdAt: new Date().toISOString(),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        return newUser;
    }

    function updateDisplayName(newName: string): void {
        if (!user) return;

        const updatedUser: AnonymousUser = {
            ...user,
            displayName: newName,
            initials: getInitials(newName),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
        setUser(updatedUser);
    }

    function resetUser(): AnonymousUser {
        const newUser = createNewUser();
        setUser(newUser);
        return newUser;
    }

    return {
        user,
        isLoading,
        updateDisplayName,
        resetUser,
    };
}
