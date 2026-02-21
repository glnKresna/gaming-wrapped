import { NextRequest, NextResponse } from 'next/server';
import { WrappedApiResponse } from '@/types'; 
import { SteamGame, WishlistedGame } from '@/types';
import { ratelimit } from '@/lib/rate-limit';
import { SAFE_ERROR_MESSAGES } from '@/lib/constants';

interface RawSteamGame {
    appid: number;
    name: string;
    playtime_forever: number;
    img_icon_url: string;
    [key: string]: unknown; // Ignore random properties from Steam API
}

export async function GET(request: NextRequest) : Promise <NextResponse<WrappedApiResponse | {error: string}>> {
    // Check Rate Limit
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';

    try {
        const { success } = await ratelimit.limit(ip);

        if (!success) {
            return NextResponse.json (
                {error: 'Please wait a minute before generating another Wrapped.'}, 
                {status: 429}
            );
        }
    } catch (error) {
        console.error("Redis Rate Limiter Error:", error);
    }

    const searchParams = request.nextUrl.searchParams;
    const steamUrl = searchParams.get('steamUrl');
    const apiKey = process.env.STEAM_API_KEY;

    if (!steamUrl) {
        return NextResponse.json(
            {error: 'Invalid. Please provide a Steam profile URL or ID'}, 
            {status: 400}
        );
    }

    if (!apiKey) {
        return NextResponse.json(
            {error: 'Server configuration error'}, 
            {status: 500} 
        );
    }

    try {
        // Clean the input: Extract the username or ID from the full URL string
        let cleanInput = steamUrl.replace(/\/$/, '');

        if (cleanInput.includes('/')) {
            const parts = cleanInput.split('/');
            cleanInput = parts[parts.length - 1];
        }
        
        // Check if the extracted string is just numbers (a 64-bit ID) or text (a custom name, e.g. "GabeNewell")
        const isNumericId = /^\d{17}$/.test(cleanInput);

        let finalSteamId = cleanInput;
        
        // If it's text, ask Steam to translate it into a 64-bit ID using ResolveVanityURL
        if (!isNumericId) {
            // Steam vanity URL resolution endpoint
            const vanityUrl = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&vanityurl=${cleanInput}`;
            const vanityRes = await fetch(vanityUrl);

            if (!vanityRes.ok) {
                throw new Error('Failed to resolve vanity URL');
            }

            const vanityData = await vanityRes.json();

            // Steam returns a success code of 1 when it found the user profile, and returns 42 when it doesn't found the profile
            if (vanityData.response.success !== 1) {
                throw new Error('Could not find a Steam profile matching that URL');
            }

            finalSteamId = vanityData.response.steamid;
        }
        
        // Fetch Profile Data
        // Steam API endpoint for User Data
        const profileUrl = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${finalSteamId}`;
        const profileRes = await fetch(profileUrl);
        
        if (!profileRes.ok) throw new Error('Failed to fetch Steam profile data');
        const profileData = await profileRes.json();
        
        const player = profileData.response.players[0];
        if (!player) throw new Error('Steam profile not found');

        const profile = {
            alias: player.personaname,
            avatar: player.avatarfull,
            timecreated: player.timecreated
        };
        
        // Fetch Owned Games (Total stats & Top 10 list)
        // Steam API endpoint for owned games in User Library
        const gamesUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${finalSteamId}&include_appinfo=1&include_played_free_games=1`;
        const gamesRes = await fetch(gamesUrl);
        
        if (!gamesRes.ok) throw new Error('Failed to fetch Steam games library');
        const gamesData = await gamesRes.json();
        
        // Handles returned empty response object from Steam if the Steam Profile is not found
        if (!gamesData.response || !gamesData.response.games) {
            throw new Error('Game library is private or empty. Please set your Steam privacy settings to Public.');
        }

        const allGames: RawSteamGame[] = gamesData.response.games;

        const totalGamesOwned = gamesData.response.game_count;
        const playedGames = allGames.filter((game) => game.playtime_forever > 0);
        const totalGamesPlayed = playedGames.length;
        const totalPlaytimeMinutes = allGames.reduce((sum, game) => sum + game.playtime_forever, 0);
        const totalPlaytimeHours = Math.round(totalPlaytimeMinutes / 60);

        const summary = {
            totalGamesOwned,
            totalGamesPlayed,
            totalPlaytimeHours
        };

        // Top 10 games (for page 2 and 5)
        const topGames: SteamGame[] = [...allGames]
            .sort((a, b) => b.playtime_forever - a.playtime_forever)
            .slice(0, 10)
            .map(game => ({
                appid: game.appid,
                name: game.name,
                playtime_forever: game.playtime_forever,
                img_icon_url: game.img_icon_url
            }));
        
        // Fetch Achievements (For Top 3 games only)
        const top3Games = topGames.slice(0, 3);

        await Promise.all(top3Games.map(async (game) => {
            try {
                // Steam API endpoint for User Achievements
                const achUrl = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${game.appid}&key=${apiKey}&steamid=${finalSteamId}`;
                const achRes = await fetch(achUrl);
                
                if (!achRes.ok) throw new Error('Game might not have achievements');
                
                const achData = await achRes.json();
                
                if (achData.playerstats && achData.playerstats.success && achData.playerstats.achievements) {
                    const unlockedCount = achData.playerstats.achievements.filter((ach: {achieved: number}) => ach.achieved === 1).length;
                    game.achievementsUnlocked = unlockedCount;
                } else {
                    game.achievementsUnlocked = 0;
                }
            } catch {
                game.achievementsUnlocked = 0;
            }
        }));
        
        // Fetch Store Data
        const genreCounts: Record<string, number> = {};

        await Promise.all(topGames.map(async (game) => {
            try {
                // Steam Store API endpoint
                const storeUrl = `https://store.steampowered.com/api/appdetails?appids=${game.appid}`;
                const storeRes = await fetch(storeUrl);
                
                if (!storeRes.ok) return;
                
                const storeData = await storeRes.json();
                const appDetails = storeData[game.appid];

                if (appDetails && appDetails.success && appDetails.data.genres) {
                    appDetails.data.genres.forEach((genre: {description: string}) => {
                        const genreName = genre.description;
                        
                        // Add 1 if it's already in the tally. If not, start it at 1
                        if (genreCounts[genreName]) {
                            genreCounts[genreName]++;
                        } else {
                            genreCounts[genreName] = 1;
                        }
                    });
                }
            } catch {
                console.warn(`Could not fetch store data for AppID ${game.appid}. It may be removed/delisted from Steam.`);
            }
        }));

        // Convert promised tally object into the clean GenreStat[] 
        const topGenres = Object.entries(genreCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
        
        // Fetch User Wishlist
        let wishlist: WishlistedGame[] = [];
        
        try {
            // Steam API Wishlist endpoint
            const wishlistUrl = `https://api.steampowered.com/IWishlistService/GetWishlist/v1/?steamid=${finalSteamId}`;
            const wishlistRes = await fetch(wishlistUrl);
            
            if (wishlistRes.ok) {
                const wishlistData = await wishlistRes.json();
                
                if (wishlistData.response && wishlistData.response.items) {
                    const topWishlistItems = wishlistData.response.items.slice(0, 6);
                    
                    const fetchedWishlist = await Promise.all(topWishlistItems.map(async (item: { appid: number }) => {
                        try {
                            const storeUrl = `https://store.steampowered.com/api/appdetails?appids=${item.appid}`;
                            const storeRes = await fetch(storeUrl);
                            if (!storeRes.ok) return null;
                            
                            const storeData = await storeRes.json();
                            const appDetails = storeData[item.appid];
                            
                            if (appDetails && appDetails.success) {
                                return {
                                    appid: item.appid,
                                    name: appDetails.data.name,
                                    capsule_url: appDetails.data.header_image 
                                };
                            }
                        } catch {
                            return null;
                        }
                        return null;
                    }));

                    wishlist = fetchedWishlist.filter((game) => game !== null) as WishlistedGame[];
                }
            }
        } catch {
            console.warn(`Could not fetch wishlist for ${finalSteamId}. It might be private.`);
        }
        
        const responsePayload: WrappedApiResponse = {
            profile,
            summary,
            topGames,
            topGenres,
            wishlist
        };

        return NextResponse.json(responsePayload);
        
    } catch (error) {
        // Log error to server console (for debugging purposes)
        console.error("[Steam API Error]:", error);

        if (error instanceof Error) {
            if (SAFE_ERROR_MESSAGES.includes(error.message)) {
                return NextResponse.json(
                    {error: error.message}, 
                    {status: 400}
                );
            }
        }
        
        return NextResponse.json(
            {error: 'Failed to fetch Steam data'}, 
            {status: 500}
        );
    }
}