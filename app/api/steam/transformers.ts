import { SteamUserProfile, GameSummary, SteamGame, GenreStat, WishlistedGame } from '@/types';
import { RawSteamGame, RawSteamPlayer } from './types';
import { fetchAchievements, fetchAppDetails } from './clients';

export function transformProfile(player: RawSteamPlayer): SteamUserProfile {
    return {
        alias: player.personaname,
        avatar: player.avatarfull,
        timecreated: player.timecreated
    };
}

export function transformSummary(gameCount: number, games: RawSteamGame[]): GameSummary {
    const playedGames = games.filter((game) => game.playtime_forever > 0);
    const totalPlaytimeMinutes = games.reduce((sum, game) => sum + game.playtime_forever, 0);
    
    return {
        totalGamesOwned: gameCount,
        totalGamesPlayed: playedGames.length,
        totalPlaytimeHours: Math.round(totalPlaytimeMinutes / 60)
    };
}

export function extractTopGames(games: RawSteamGame[]): SteamGame[] {
    return [...games]
        .sort((a, b) => b.playtime_forever - a.playtime_forever)
        .slice(0, 10)
        .map(game => ({
            appid: game.appid,
            name: game.name,
            playtime_forever: game.playtime_forever,
            img_icon_url: game.img_icon_url
        }));
}

export async function appendAchievementsToTopGames(topGames: SteamGame[], steamId: string, apiKey: string) {
    const top3Games = topGames.slice(0, 3);
    await Promise.all(top3Games.map(async (game) => {
        try {
            const achData = await fetchAchievements(game.appid, steamId, apiKey);
            if (achData?.playerstats?.success && achData.playerstats.achievements) {
                game.achievementsUnlocked = achData.playerstats.achievements.filter((ach: {achieved: number}) => ach.achieved === 1).length;
            } else {
                game.achievementsUnlocked = 0;
            }
        } catch {
            game.achievementsUnlocked = 0;
        }
    }));
}

export async function compileTopGenres(topGames: SteamGame[]): Promise<GenreStat[]> {
    const genreCounts: Record<string, number> = {};

    await Promise.all(topGames.map(async (game) => {
        try {
            const storeData = await fetchAppDetails(game.appid);
            const appDetails = storeData?.[game.appid];

            if (appDetails?.success && appDetails.data.genres) {
                appDetails.data.genres.forEach((genre: {description: string}) => {
                    genreCounts[genre.description] = (genreCounts[genre.description] || 0) + 1;
                });
            }
        } catch { /* ignore delisted games */ }
    }));

    return Object.entries(genreCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}

export async function compileWishlist(rawWishlistData: any): Promise<WishlistedGame[]> {
    if (!rawWishlistData?.response?.items) return [];
    
    const topItems = rawWishlistData.response.items.slice(0, 6);
    const fetched = await Promise.all(topItems.map(async (item: { appid: number }) => {
        try {
            const storeData = await fetchAppDetails(item.appid);
            const appDetails = storeData?.[item.appid];
            
            if (appDetails?.success) {
                return {
                    appid: item.appid,
                    name: appDetails.data.name,
                    capsule_url: appDetails.data.header_image 
                };
            }
        } catch { return null; }
        return null;
    }));

    return fetched.filter((game) => game !== null) as WishlistedGame[];
}