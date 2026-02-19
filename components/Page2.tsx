import { SteamGame } from '@/types';

interface Page2Props {
    topGames: SteamGame[];
}

export default function Page2({ topGames }: Page2Props) {
    // We only want the top 3 for this specific page
    const top3 = topGames.slice(0, 3);

    // Dictionary for personalized messages of specific games played
    const getCustomMessage = (appid: number, name: string) => {
        const messages: Record<number, string> = {
        730: "Rush B! And don't forget to check on corners.", // CS2
        570: "Time to queue up for another 60-minute emotional rollercoaster.", // Dota 2
        236390: "You've probably spent more time grinding those tech tree than you spent on defending the D point.", // War Thunder
        244210: "Still looking for that perfect slip angle?", // Assetto Corsa
        1551360: "Horizon Mexico wouldn't be the same without you.", // Forza Horizon 5
        1293830: "You raced, you raved, and you survived British weather for this long. Respect.", // Forza Horizon 4
        252490: "Waking up on a beach with a rock and a dream. And then getting raided.", // Rust
        1086940: "Maidenless behavior. But at least you beat Malenia... right?", // Baldur's Gate 3 / Elden Ring
        271590: "How many millions have you stolen from the Diamond Casino by now?", // GTA V
        774171: "With perfect frame-perfect hits and a colorful trail of chaos behind you, your rhythm was truly unstoppable.", // Muse Dash
        3224770: "Those girls didn't just run; they thrived under your guidance.", // Uma Musume
        1238840: "You braved the mud and the whistles of the Great War. You've earned your place in the sun.", // Battlefield 1
        1238810: "From the snowy peaks of Norway to the sands of Iwo Jima, your squad knew they could count on you when the V1 rockets started falling.", // Battlefield V
        632470: "You were a superstar, a disaster, and a philosopher all at once. True detective work.", // Disco Elysium
        22370: "At least The Capital Wasteland is a little less lonely with you in it.", // Fallout 3
        22380: "The game was rigged from the start, but you played it anyway.", // Fallout New Vegas
        377160: "Between finding your son and fighting off Deathclaws, you turned the Commonwealth into your own personal playground.", // Fallout 4
        1151340: "Reclamation Day was just the beginning, and it's surely not going to end anytime soon.", // Fallout 76
        };

        return messages[appid] || `You spent a lot of time in ${name}.`;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 snap-center">
        
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">
                Your Top <span className="text-[#1A9FFF]">Obsessions</span> 
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
                            
                            {/* Dark gradient overlay */}
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
                            
                            <p className={`text-[#1A9FFF] italic mb-6 ${isFirst ? 'text-lg' : 'text-sm'}`}>
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

                        {/* Background gradient effect */}
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all z-0">
                            
                        </div>
                    </div>
                );
                })}
            </div>
        </div>
    );
}