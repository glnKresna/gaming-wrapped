'use client';

import { useState } from 'react';
import { SteamGame, WrappedApiResponse } from '@/types';
import GameCard from '@/components/GameCard';

export default function Home() {
  // --- STATE ---
  const [steamId, setSteamId] = useState<string>('');
  const [games, setGames] = useState<SteamGame[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // --- LOGIC ---
  const handleFetchWrapped = async (formData: FormData) => {
    const submittedUrl = formData.get('steamUrl') as string;

    setIsLoading(true);
    setErrorMsg(null);
    setGames(null);
    
    try {
      // Fetch from backend proxy
      const res = await fetch(`/api/steam?steamUrl=${encodeURIComponent(submittedUrl)}`);
      const data: WrappedApiResponse = await res.json();
      
      // Throw response error (if any) to catch{} block
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch data');
      }
      
      // Sort games array (by playtime)
      if (data.games) {
        const sortedGames = [...data.games].sort((a, b) => b.playtime_forever - a.playtime_forever);
        setGames(sortedGames.slice(0, 10));
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI ---
  return (
    <main className="min-h-screen p-8 text-white bg-slate-950 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-green-400">🎮 Gaming Wrapped</h1>
        
        <form action={handleFetchWrapped} className="mb-8 flex gap-4">
          <input 
            type="text" 
            name="steamUrl" 
            placeholder="Paste Steam Profile URL or ID..." 
            className="flex-1 px-4 py-2 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:border-green-400 text-white transition-colors"
            required
          />

          <button type="submit" disabled={isLoading} className="px-6 py-2 rounded bg-green-500 hover:bg-green-600 text-black font-bold disabled:opacity-50 transition-colors">
            {isLoading ? 'Wrapping...' : 'Wrap It!'}
          </button>
        </form>
        
        {/* Render loading state */}
        {isLoading && (
          <div className="text-center text-green-400 animate-pulse mb-8 font-bold text-lg">
            Fetching library, this might take a second...
          </div>
        )}
        
        {/* Render error alert */}
        {errorMsg && (
          <div className="p-4 mb-8 bg-red-900/30 border-l-4 border-red-500 rounded text-red-200">
            <span className="font-bold mr-2">Error:</span> 
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {games && games.map((game, index) => (
            <GameCard key={game.appid} game={game} rank={index + 1} />
          ))}
        </div>
      </div>
    </main>
  );
}