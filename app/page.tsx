'use client';

import { useState } from 'react';
import { WrappedApiResponse } from '@/types';
import LandingPage from '@/components/LandingPage';
import Page1 from '@/components/Page1';
import Page2 from '@/components/Page2';
import Page3 from '@/components/Page3';
import Page4 from '@/components/Page4';
import Page5 from '@/components/Page5';

export default function Home() {
  const [inputUrl, setInputUrl] = useState('');
  const [wrappedData, setWrappedData] = useState<WrappedApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFetchWrapped = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Extract the Clean ID/URL from the input
      let finalId = inputUrl.trim();
      if (finalId.includes('steamcommunity.com')) {
        const parts = finalId.split('/');
        finalId = parts[parts.length - 1] || parts[parts.length - 2];
      }

      // Fetch from Steam API
      const res = await fetch(`/api/steam?steamUrl=${encodeURIComponent(finalId)}`);
      const data = await res.json();

      if (data.error) {
        setErrorMsg(data.error);
      } else {
        setWrappedData(data as WrappedApiResponse);
      }
    } catch {
      setErrorMsg("Something went wrong connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- FRONTEND ---
  if (wrappedData) {
    return (
      <main className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-slate-950 text-white">
        
        {/* Landing Page */}
        <section className="snap-center h-screen w-full">
          <LandingPage profile={wrappedData.profile} />
        </section>

        {/* Summary Snapshots Page */}
        <section className="snap-center h-screen w-full">
          <Page1 summary={wrappedData.summary} />
        </section>

        {/* Top 3 Games Page */}
        <section className="snap-center h-screen w-full">
          <Page2 topGames={wrappedData.topGames} />
        </section>

        {/* Genre Distribution Page */}
        <section className='snap-center h-screen w-full'>
          <Page3 topGenres={wrappedData.topGenres}/>
        </section>

        {/* Wishlist Reminder Page */}
        <section className='snap-center h-screen w-full'>
          <Page4 wishlist={wrappedData.wishlist}/>
        </section>

        {/* Final Summary Page */}
        <section className='snap-center h-screen w-full'>
          <Page5 data={wrappedData}/>
        </section>

        {/* Floating Reset Button (To go back to search) */}
        <button 
          onClick={() => setWrappedData(null)}
          className="fixed bottom-8 right-8 bg-slate-800/80 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm transition-all z-50 border border-slate-700"
        >
          Search Another
        </button>

      </main>
    );
  }

  // Landing Page
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-950 text-white relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter bg-linear-to-br from-white to-slate-500 bg-clip-text text-transparent">
            STEAM WRAPPED
          </h1>
          <p className="text-slate-400">Enter your Steam Profile URL to begin.</p>
        </div>

        <form onSubmit={handleFetchWrapped} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="steamcommunity.com/id/yourname"
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-center"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1A9FFF] hover:bg-[#4EB5FF] text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
          >
            {isLoading ? 'ANALYZING LIBRARY...' : 'GENERATE WRAPPED'}
          </button>
        </form>

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {errorMsg}
          </div>
        )}
      </div>
    </main>
  );
}