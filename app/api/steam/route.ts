import { NextRequest, NextResponse } from 'next/server';
import { WrappedApiResponse } from '@/types'; 
import { ratelimit } from '@/lib/rate-limit';
import { SteamApiError } from './errors';
import * as Client from './clients';
import * as Transform from './transformers';

export async function GET(request: NextRequest): Promise<NextResponse<WrappedApiResponse | {error: string}>> {
    // Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
    try {
        const { success } = await ratelimit.limit(ip);
        if (!success) return NextResponse.json({error: 'Please wait a minute before generating another Wrapped.'}, {status: 429});
    } catch (error) {
        console.error("Redis Rate Limiter Error:", error);
    }

    // Validate Inputs
    const searchParams = request.nextUrl.searchParams;
    const steamUrl = searchParams.get('steamUrl');
    const apiKey = process.env.STEAM_API_KEY;

    if (!steamUrl) return NextResponse.json({error: 'Invalid. Please provide a Steam profile URL or ID'}, {status: 400});
    if (!apiKey) return NextResponse.json({error: 'Server configuration error'}, {status: 500});

    // Process Request
    try {
        let cleanInput = steamUrl.replace(/\/$/, '');
        if (cleanInput.includes('/')) {
            cleanInput = cleanInput.split('/').pop() || cleanInput;
        }

        // Orchestrate data flow
        const steamId = await Client.fetchSteamId(cleanInput, apiKey);
        
        const rawProfile = await Client.fetchRawProfile(steamId, apiKey);
        const profile = Transform.transformProfile(rawProfile);
        
        const rawLibrary = await Client.fetchRawLibrary(steamId, apiKey);
        const summary = Transform.transformSummary(rawLibrary.game_count, rawLibrary.games);
        const topGames = Transform.extractTopGames(rawLibrary.games);
        
        // Fetch external data concurrently
        const rawWishlist = await Client.fetchRawWishlist(steamId);
        
        const [topGenres, wishlist] = await Promise.all([
            Transform.compileTopGenres(topGames),
            Transform.compileWishlist(rawWishlist),
            Transform.appendAchievementsToTopGames(topGames, steamId, apiKey)
        ]);

        return NextResponse.json({ profile, summary, topGames, topGenres, wishlist });
        
    } catch (error) {
        console.error("[Steam API Error]:", error);

        // Handle custom expected errors
        if (error instanceof SteamApiError) {
            return NextResponse.json({error: error.message}, {status: error.status});
        }
        
        return NextResponse.json({error: 'Failed to fetch Steam data'}, {status: 500});
    }
}