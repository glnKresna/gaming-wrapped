import { SteamApiError } from "./errors";
import { RawSteamPlayer, RawSteamGame } from "./types";

// Resolve Vanity URL
export async function fetchSteamId(input: string, apiKey: string): Promise<string> {
    const isNumericId = /^\d{17}$/.test(input);
    if (isNumericId) return input;

    const res = await fetch(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${input}`);
    if (!res.ok) throw new SteamApiError('Failed to resolve vanity URL', 500);
    
    const data = await res.json();
    if (data.response.success !== 1) throw new SteamApiError('Could not find a Steam profile matching that URL', 404);
    
    return data.response.steamid;
}

// Fetch Profile
export async function fetchRawProfile(steamId: string, apiKey: string): Promise<RawSteamPlayer> {
    const res = await fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`);
    if (!res.ok) throw new SteamApiError('Failed to fetch Steam profile data', 500);
    
    const data = await res.json();
    const player = data.response.players[0];
    if (!player) throw new SteamApiError('Steam profile not found', 404);

    return player;
}

// Fetch Games Library
export async function fetchRawLibrary(steamId: string, apiKey: string): Promise<{game_count: number, games: RawSteamGame[]}> {
    const res = await fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1`);
    if (!res.ok) throw new SteamApiError('Failed to fetch Steam games library', 500);
    
    const data = await res.json();
    if (!data.response || !data.response.games) {
        throw new SteamApiError('Game library is private or empty. Please set your Steam privacy settings to Public.', 403);
    }
    return data.response;
}

// Fetch App/Store Details
export async function fetchAppDetails(appId: number | string) {
    const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
    if (!res.ok) return null;
    return await res.json();
}

// Fetch Achievements
export async function fetchAchievements(appId: number, steamId: string, apiKey: string) {
    const res = await fetch(`http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${apiKey}&steamid=${steamId}`);
    if (!res.ok) return null;
    return await res.json();
}

// Fetch Raw Wishlist
export async function fetchRawWishlist(steamId: string) {
    const res = await fetch(`https://api.steampowered.com/IWishlistService/GetWishlist/v1/?steamid=${steamId}`);
    if (!res.ok) return null;
    return await res.json();
}