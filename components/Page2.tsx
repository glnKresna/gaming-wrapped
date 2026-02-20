import { GameSummary } from "@/types";

interface Page2Props {
    summary: GameSummary;
}

export default function Page2({ summary }: Page2Props) {
  const playedPercentage = Math.round((summary.totalGamesPlayed / summary.totalGamesOwned) * 100) || 0;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 snap-center relative z-10 w-full">
        
        <h2 className="text-3xl md:text-5xl font-black text-white mb-16 text-center tracking-tighter drop-shadow-lg">
            The <span className="text-transparent bg-clip-text bg-linear-to-r from-[#1A9FFF] to-[#4EB5FF] filter drop-shadow-[0_0_20px_rgba(26,159,255,0.4)]">2026</span> Snapshot
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 w-full max-w-7xl px-4">
            
            {/* Card 1: Total Games */}
            <div className="bg-white/[0.03] backdrop-blur-xl p-10 md:p-14 rounded-3xl border border-white/10 flex flex-col items-center text-center hover:bg-white/[0.05] hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(26,159,255,0.15)] transition-all duration-300 group">
                <div className="text-7xl md:text-8xl mb-6 group-hover:scale-110 transition-transform duration-300">📚</div>
                <div className="text-6xl md:text-7xl font-black text-white mb-3 tracking-tight">{summary.totalGamesOwned}</div>
                <div className="text-slate-400 uppercase tracking-[0.2em] text-base md:text-lg font-bold">Games Owned</div>
            </div>

            {/* Card 2: Games Played */}
            <div className="bg-white/[0.03] backdrop-blur-xl p-10 md:p-14 rounded-3xl border border-[#1A9FFF]/30 flex flex-col items-center text-center hover:bg-white/[0.05] hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(26,159,255,0.3)] transition-all duration-300 relative overflow-hidden group shadow-[0_0_30px_rgba(26,159,255,0.05)]">
                <div className="text-7xl md:text-8xl mb-6 group-hover:scale-110 transition-transform duration-300">🎮</div>
                <div className="text-6xl md:text-7xl font-black text-[#1A9FFF] mb-3 tracking-tight drop-shadow-[0_0_15px_rgba(26,159,255,0.4)]">{summary.totalGamesPlayed}</div>
                <div className="text-[#1A9FFF]/80 uppercase tracking-[0.2em] text-base md:text-lg font-bold">Games Played</div>
                
                <div className="absolute top-6 right-6 md:top-8 md:right-8 bg-[#1A9FFF]/10 text-green-500 text-sm md:text-base font-bold px-4 py-2 rounded-full border border-green-500/20 backdrop-blur-md">
                    {playedPercentage}% Played
                </div>
            </div>

            {/* Card 3: Total Hours */}
            <div className="bg-white/[0.03] backdrop-blur-xl p-10 md:p-14 rounded-3xl border border-white/10 flex flex-col items-center text-center hover:bg-white/[0.05] hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(26,159,255,0.15)] transition-all duration-300 group">
                <div className="text-7xl md:text-8xl mb-6 group-hover:scale-110 transition-transform duration-300">⏳</div>
                <div className="text-6xl md:text-7xl font-black text-white mb-3 tracking-tight">
                    {summary.totalPlaytimeHours.toLocaleString()}
                </div>
                <div className="text-slate-400 uppercase tracking-[0.2em] text-base md:text-lg font-bold">Total Hours</div>
            </div>
        </div>

        <p className="mt-16 text-slate-400 text-lg md:text-xl max-w-2xl text-center italic font-medium px-4">
            {summary.totalPlaytimeHours > 5000 
            ? "That's a lot of dedication... Maybe go touch grass?" 
            : summary.totalPlaytimeHours > 1000
            ? "A committed one, aren't you?"
            : "Rookie numbers! You need to pump those up more."}
        </p>

        </div>
    );
}