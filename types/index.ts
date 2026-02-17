// Handle User's profile data
export interface SteamUserProfile {
    alias: string;
    avatar: string;   
    timecreated: number; 
}

// Handle User's summary stats
export interface GameSummary {
    totalGamesOwned: number;
    totalGamesPlayed: number;
    totalPlaytimeHours: number;
}

// Handle the game object
export interface SteamGame {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
    achievementsUnlocked?: number; 
}

// Handle genre stats
export interface GenreStat {
    name: string;
    count: number;
}

// Handle User's wishlist
export interface WishlistedGame {
    appid: string | number;
    name: string;
    capsule_url: string; // Steam's name for store banner images
}

// Master wrapper (to ship to front end)
export interface WrappedApiResponse {
    profile?: SteamUserProfile;
    summary?: GameSummary;
    topGames?: SteamGame[];
    topGenres?: GenreStat[];
    wishlist?: WishlistedGame[];
    error?: string;
}