import { SteamGame } from '@/types';
import { getCustomMessage } from '@/lib/custom-msg';

interface Page3Props {
    topGames: SteamGame[];
}

export default function Page3({ topGames }: Page3Props) {
    const top3 = topGames.slice(0, 3);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 snap-center">
        
            <h2 className="text-3xl md:text-5xl font-black text-white mb-12 text-center tracking-tighter drop-shadow-lg">
                Your Top <span className="text-transparent bg-clip-text bg-linear-to-r from-[#1A9FFF] to-[#4EB5FF] filter drop-shadow-[0_0_20px_rgba(26,159,255,0.4)]">Obsessions</span> 
            </h2>

            {/* Bento Box Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 w-full max-w-7xl">
                {top3.map((game, index) => {
                const isFirst = index === 0;
                const hours = Math.round(game.playtime_forever / 60).toLocaleString();
                const imgUrl = `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;

                return (
                    <div 
                        key={game.appid} 
                        className={`bg-slate-900/50 rounded-3xl p-6 border border-slate-800 flex flex-col justify-between hover:bg-slate-800/50 transition-colors relative overflow-hidden group ${
                            isFirst ? 'md:col-span-2 md:row-span-2' : 'md:col-span-1 md:row-span-1'
                        }`}
                    >
                        <div className="absolute inset-0 z-0 overflow-hidden">
                            <img 
                                src={`https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
                                alt={`${game.name} background`}
                                className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
                        </div>

                        <div className="flex items-start justify-between z-10 relative">
                            <div className={`${isFirst ? 'w-24 h-24' : 'w-16 h-16'} rounded-2xl overflow-hidden shadow-lg`}>
                                <img 
                                    src={imgUrl} 
                                    alt={game.name} 
                                    className="w-full h-full object-cover" 
                                    />
                            </div>
                        </div>

                        <div className="z-10 mt-8 relative">
                            <h3 className={`font-bold text-white mb-2 line-clamp-2 ${isFirst ? 'text-4xl' : 'text-2xl'}`}>
                                {game.name}
                            </h3>
                            
                            <p className={`text-white italic mb-6 ${isFirst ? 'text-lg' : 'text-sm'}`}>
                                `{getCustomMessage(game.appid, game.name)}`
                            </p>

                            <div className="flex gap-4">
                                <div className="bg-slate-950 px-4 py-2 rounded-lg border border-slate-800">
                                    <span className="text-slate-400 text-xs uppercase font-bold block">Hours</span>
                                    <span className="text-white font-bold">{hours}</span>
                                </div>
                                
                                {game.achievementsUnlocked !== undefined && (
                                    <div className="bg-slate-950 px-4 py-2 rounded-lg border border-slate-800">
                                    <span className="text-slate-400 text-xs uppercase font-bold block">Achievements</span>
                                    <span className="text-white font-bold">{game.achievementsUnlocked}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
                })}
            </div>
        </div>
    );
}