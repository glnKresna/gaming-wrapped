import { WrappedApiResponse } from '@/types';

interface Page5Props {
    data: WrappedApiResponse;
}

export default function Page5({ data }: Page5Props) {
    const { profile, summary, topGames } = data;
    const top5 = topGames.slice(0, 5);
    const top1 = top5[0];
    
    // Convert Steam's Unix timestamp to a readable date
    const joinDate = profile.timecreated 
        ? new Date(profile.timecreated * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
        : 'Unknown';

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 snap-center">
        
        <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-10 text-center tracking-tight">
            Your 2026 Wrapped
        </h2>

        {/* Master Bento Container */}
        <div className="bg-slate-900/80 p-6 md:p-8 rounded-3xl border border-slate-700 shadow-2xl max-w-4xl w-full relative overflow-hidden backdrop-blur-md">
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-green-500/20 rounded-full blur-[60px] pointer-events-none"></div>

                <div className="flex items-center gap-5 mb-8 relative z-10 border-b border-slate-800 pb-6">
                    <img 
                        src={profile.avatar} 
                        alt="Avatar" 
                        className="w-16 h-16 rounded-2xl border-2 border-slate-700 shadow-lg" 
                    />

                <div>
                    <h3 className="text-2xl md:text-3xl font-black text-white">{profile.alias}</h3>
                    <p className="text-slate-400 font-medium tracking-widest uppercase text-xs mt-1">Official Summary</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                {/* Left Column */}
                {top1 && (
                    <div className="md:col-span-1 bg-slate-950/60 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                        <div className="absolute top-3 left-3 bg-yellow-500 text-yellow-950 text-xs font-black px-3 py-1 rounded-md shadow-lg z-10">
                            #1 MOST PLAYED
                        </div>
                        
                        <img 
                            src={`https://media.steampowered.com/steamcommunity/public/images/apps/${top1.appid}/${top1.img_icon_url}.jpg`}
                            alt={top1.name}
                            className="w-24 h-24 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.3)] mb-4 mt-6 z-10 relative"
                        />

                        <h4 className="text-xl md:text-2xl font-bold text-white z-10 relative mb-2 leading-tight">
                            {top1.name}
                        </h4>

                        <p className="text-green-400 font-black text-2xl z-10 relative mt-auto">
                            {Math.round(top1.playtime_forever / 60).toLocaleString()} <span className="text-sm font-medium text-slate-400">HRS</span>
                        </p>
                        
                        <div className="absolute inset-0 bg-green-500/5 blur-2xl z-0 transition-all group-hover:bg-green-500/10"></div>
                    </div>
                )}

                {/* Right Column */}
                <div className="md:col-span-2 bg-slate-950/60 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
                    <h4 className="text-slate-400 font-bold text-xs uppercase mb-4 tracking-widest">Top 5 Roster</h4>
                    <div className="space-y-3 flex-grow flex flex-col justify-center">
                        {top5.map((game, index) => (
                            <div key={game.appid} className="flex items-center justify-between p-2 hover:bg-slate-800/50 rounded-lg transition-colors group">
                                <div className="flex items-center gap-4">
                                    <span className={`font-black w-4 text-center ${index === 0 ? 'text-yellow-500' : 'text-slate-600 group-hover:text-slate-400'}`}>
                                    {index + 1}
                                    </span>

                                    <img 
                                        src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                                        alt={game.name}
                                        className="w-8 h-8 rounded-md shadow-sm border border-slate-700/50"
                                    />

                                    <span className="text-slate-200 font-semibold truncate max-w-[150px] sm:max-w-[200px] md:max-w-[280px]">
                                    {game.name}
                                    </span>
                                </div>

                                <span className="text-slate-400 text-sm font-bold whitespace-nowrap">
                                    {Math.round(game.playtime_forever / 60).toLocaleString()} <span className="text-xs font-normal">hrs</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    
                    <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1">Joined Steam</span>
                    <span className="text-sm md:text-lg font-bold text-white">{joinDate}</span>
                    </div>
                    
                    <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1">Total Time</span>
                    <span className="text-sm md:text-lg font-bold text-white">
                        {summary.totalPlaytimeHours.toLocaleString()} <span className="text-xs text-slate-500">HRS</span>
                    </span>
                    </div>
                    
                    <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center text-center col-span-2 md:col-span-1">
                    <span className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1">Collection</span>
                    <span className="text-sm md:text-lg font-bold text-white">{summary.totalGamesOwned} Games</span>
                    </div>
                </div>
            </div>
        </div>

        <p className="mt-8 text-slate-600 text-sm font-bold tracking-widest uppercase">
            End of Report
        </p>

        </div>
    );
}