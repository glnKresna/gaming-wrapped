import { NextRequest, NextResponse } from 'next/server';
import { WrappedApiResponse } from '@/types'; 

export async function GET(request: NextRequest): Promise<NextResponse<WrappedApiResponse>> {
    // Extract 'steamUrl' from request
    const searchParams = request.nextUrl.searchParams;
    const steamUrl = searchParams.get('steamUrl');
    const apiKey = process.env.STEAM_API_KEY;

    // Guard Clauses for missing input or missing API key
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
        
        // Fetch the actual games using GetOwnedGames and the 64-bit ID
        const gamesUrl = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${finalSteamId}&include_appinfo=true&format=json`;
        const gamesRes = await fetch(gamesUrl);

        if (!gamesRes.ok) {
            throw new Error('Failed to fetch library from Steam');
        }

        const gamesData = await gamesRes.json();
        
        // Handle Privacy Settings and return the data
        if (!gamesData.response || !gamesData.response.games) {
            throw new Error('No games found. This profile may be set to private, friends only, or has no games on Steam.');
        }

        return NextResponse.json({games: gamesData.response.games});
        
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                {error: error.message}, 
                {status: 500}
            );
        }
        
        return NextResponse.json(
            {error: 'Failed to fetch Steam data'}, 
            {status: 500}
        );
    }
}