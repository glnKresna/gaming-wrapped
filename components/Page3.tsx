import { GenreStat } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Page3Props {
    topGenres: GenreStat[];
}

const COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#ef4444', '#f59e0b', '#06b6d4'];

export default function Page3({ topGenres }: Page3Props) {
    const displayGenres = topGenres.slice(0, 6);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 snap-center">
        
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 text-center">
            Your Gaming <span className="text-[#1A9FFF]">DNA</span>
        </h2>
        <p className="text-slate-400 mb-12 text-center max-w-md">
            Based on the tags of your most played games.
        </p>

        {/* The Chart Container */}
        <div className="w-full max-w-2xl h-80 md:h-96 relative">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={displayGenres}
                cx="50%"
                cy="50%"
                innerRadius={100}
                outerRadius={140}
                paddingAngle={1} 
                dataKey="count"
                stroke="none"
                >
                {displayGenres.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                
                <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
            </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-slate-400 text-xs md:text-sm uppercase tracking-widest font-bold mb-1">Top Genre</span>
            <span className="text-2xl md:text-3xl font-black text-white text-center px-4">
                {displayGenres[0]?.name || 'Unknown'}
            </span>
            </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-2xl">
            {displayGenres.map((genre, index) => (
            <div key={genre.name} className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-white font-medium text-sm md:text-base">{genre.name}</span>
                <span className="text-slate-500 text-sm">({genre.count})</span>
            </div>
            ))}
        </div>

        </div>
    );
}