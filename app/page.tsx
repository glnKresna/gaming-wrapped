'use client';

import { useState } from 'react';
import { WrappedApiResponse } from '@/types';
import ScrollReveal from '@/components/ScrollReveal';
import Page1 from '@/components/Page1';
import Page2 from '@/components/Page2';
import Page3 from '@/components/Page3';
import Page4 from '@/components/Page4';
import Page5 from '@/components/Page5';
import Page6 from '@/components/Page6';

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
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[15%] -left-[10%] w-[50vw] h-[50vw] max-w-175 max-h-175 bg-[#1A9FFF]/15 rounded-full blur-[120px] animate-blob" />
          <div className="absolute -bottom-[15%] -right-[10%] w-[50vw] h-[50vw] max-w-175 max-h-175 bg-indigo-500/15 rounded-full blur-[120px] animate-blob animation-delay-4000" />
        </div>

        {/* Starting Page */}
        <section className="snap-center h-screen w-full">
          <ScrollReveal>
            <Page1 profile={wrappedData.profile} />
          </ScrollReveal>
        </section>

        {/* Summary Snapshots Page */}
        <section className="snap-center h-screen w-full">
          <ScrollReveal>
            <Page2 summary={wrappedData.summary} />
          </ScrollReveal>
        </section>

        {/* Top 3 Games Page */}
        <section className="snap-center h-screen w-full">
          <ScrollReveal>
            <Page3 topGames={wrappedData.topGames} />
          </ScrollReveal>
        </section>

        {/* Genre Distribution Page */}
        <section className='snap-center h-screen w-full'>
          <ScrollReveal>
            <Page4 topGenres={wrappedData.topGenres}/>
          </ScrollReveal>
        </section>

        {/* Wishlist Reminder Page */}
        <section className='snap-center h-screen w-full'>
          <ScrollReveal>
            <Page5 wishlist={wrappedData.wishlist}/>
          </ScrollReveal>
        </section>

        {/* Final Summary Page */}
        <section className='snap-center h-screen w-full'>
          <ScrollReveal>
            <Page6 data={wrappedData}/>
          </ScrollReveal>
        </section>

        {/* Floating Reset Button */}
        <button 
          onClick={() => setWrappedData(null)}
          className="fixed bottom-8 right-8 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-full text-sm font-bold backdrop-blur-md transition-all z-50 border border-white/10 shadow-xl hover:border-white/20"
        >
          SEARCH ANOTHER
        </button>

      </main>
    );
  }

  // Landing Page
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0a0d14] text-white relative overflow-hidden">
      
      {/* Animated Blob */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-[#1A9FFF]/20 rounded-full blur-[100px] animate-blob" />
        <div className="absolute top-[20%] right-[20%] w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] bg-indigo-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[10%] left-[30%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] bg-teal-500/15 rounded-full blur-[100px] animate-blob animation-delay-4000" />
      </div>

      {/* Container Card */}
      <div className="z-10 w-full max-w-xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl space-y-8 text-center">
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16">
              <img 
                  src="/steam-logo.png" 
                  alt="Steam Logo" 
                  className="w-12 h-12 object-contain opacity-90" 
              />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            STEAM WRAPPED
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Enter your Steam Profile URL to look back at your year in gaming.
          </p>
        </div>

        <form onSubmit={handleFetchWrapped} className="space-y-5">
          <div className="relative group">
            <input
              type="text"
              placeholder="steamcommunity.com/id/yourname"
              className="w-full bg-[#0a0d14]/80 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1A9FFF]/50 focus:border-[#1A9FFF] transition-all text-center group-hover:border-white/20 shadow-inner"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
            />
          </div>

          {/* Generate Wrapped Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="relative w-full overflow-hidden group rounded-2xl p-[1px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >

            <span className="absolute inset-0 bg-gradient-to-r from-[#1A9FFF] via-indigo-500 to-[#1A9FFF] rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity bg-[length:200%_auto] animate-pulse"></span>
            
            <div className="relative bg-transparent group-hover:bg-[#0a0d14] transition-colors w-full h-full rounded-2xl py-4 flex items-center justify-center">
                <span className="font-bold tracking-wider text-white text-sm">
                    {isLoading ?  (
                      <span className="inline-flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                          ANALYZING LIBRARY...
                      </span>
                      ) : ('VIEW MY WRAPPED')}
                </span>
            </div>
          </button>
        </form>

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-bounce">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Watermark */}
      <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20 text-white/40 text-sm font-medium tracking-wide">
        Made by <a href="https://github.com/glnkresna" target="_blank" rel="noopener noreferrer" className="text-[#1A9FFF]/80 hover:text-[#1A9FFF] hover:drop-shadow-[0_0_10px_rgba(26,159,255,0.8)] transition-all duration-300">glnKresna</a>
      </div>
    </main>
  );
}