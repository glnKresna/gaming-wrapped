import { GenreStat } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Page4Props {
    topGenres: GenreStat[];
}

const COLORS = ['#1A9FFF', '#818cf8', '#2dd4bf', '#fbbf24', '#f43f5e', '#c084fc'];

export default function Page4({ topGenres }: Page4Props) {
    const displayGenres = topGenres.slice(0, 6);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 snap-center relative z-10 w-full">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-12 text-center tracking-tighter drop-shadow-lg">
                Your Gaming <span className="text-transparent bg-clip-text bg-linear-to-r from-[#1A9FFF] to-[#4EB5FF] filter drop-shadow-[0_0_20px_rgba(26,159,255,0.4)]">DNA</span>
            </h2>
            <p className="text-slate-400 mb-10 text-lg md:text-xl text-center max-w-2xl font-medium">
                Based on the tags of your most played games.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 w-full max-w-7xl px-4 items-center">
                
                {/* Donut Chart */}
                <div className="w-full h-80 md:h-[450px] relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={displayGenres}
                                cx="50%"
                                cy="50%"
                                innerRadius={110} 
                                outerRadius={160}
                                paddingAngle={4}
                                dataKey="count"
                                stroke="none"
                                cornerRadius={8}
                            >
                                {displayGenres.map((entry, index) => (
                                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'rgba(10, 13, 20, 0.8)', 
                                    backdropFilter: 'blur(12px)', 
                                    borderColor: 'rgba(255,255,255,0.1)', 
                                    borderRadius: '1rem', 
                                    color: '#fff', 
                                    padding: '12px' 
                                }}
                                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none drop-shadow-2xl">
                        <span className="text-slate-400 text-sm md:text-base uppercase tracking-[0.2em] font-bold mb-1">
                            Top Genre
                        </span>
                        <span className="text-3xl md:text-4xl font-black text-white text-center px-4 tracking-tight">
                            {displayGenres[0]?.name || 'Unknown'}
                        </span>
                    </div>
                </div>

                <div className="bg-white/[0.03] backdrop-blur-xl p-10 md:p-12 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-center min-h-[350px]">
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 tracking-tight">
                        Genre Breakdown
                    </h3>
                    
                    {/* Tag Capsules */}
                    <div className="flex flex-wrap gap-4">
                        {displayGenres.map((genre, index) => (
                            <div 
                                key={genre.name} 
                                className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 transition-all px-5 py-3 rounded-full border border-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-lg cursor-default"
                            >
                                <div 
                                    className="w-4 h-4 rounded-full group-hover:scale-110 transition-transform" 
                                    style={{ 
                                        backgroundColor: COLORS[index % COLORS.length],
                                        boxShadow: `0 0 15px ${COLORS[index % COLORS.length]}80` // Emits a colored glow matching the pie slice
                                    }}
                                ></div>
                                
                                <span className="text-white font-semibold text-base md:text-lg">
                                    {genre.name}
                                </span>
                                <span className="text-slate-400 font-medium text-base md:text-lg ml-1">
                                    {genre.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}