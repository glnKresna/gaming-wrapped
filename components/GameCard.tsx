import Image from 'next/image';
import { SteamGame } from '@/types';

interface GameCardProps {
    game: SteamGame;
    rank: number; 
}

export default function GameCard({game, rank}: GameCardProps) {
    const imageUrl = `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;

    return (
        <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-800 border-slate-700">
            <div className='flex items-center justify-center w-8 h-8 rounded bg-slate-900 text-green-400 font-bold shrink-0'>
                #{rank}
            </div>

            <div className='w-12 h-12 shrink-0 bg-slate-900 rounded overflow-hidden flex items-center justify-center'>
                {game.img_icon_url ? (
                    <img src={imageUrl} alt={game.name} className='w-full h-full object-cover' />
                ) : (
                    <span className='text-xs text-slate-500 text-center leading-tight'>No Image</span>
                )}
            </div>
            
            <div className='flex flex-col overflow-hidden'>
                <h2 className='text-lg font-bold text-white line-clamp-1' title={game.name}>
                    {game.name}
                </h2>

                {/* Convert game.playtime_forever to hours */}
                <p className='text-sm text-slate-400'>
                    {Math.round(game.playtime_forever / 60).toLocaleString()} hours
                </p>
            </div>
        </div>
    );
}