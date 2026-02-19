import { GameSummary } from "@/types";

interface Page1Props {
    summary: GameSummary;
}

export default function Page1({ summary }: Page1Props) {
  const playedPercentage = Math.round((summary.totalGamesPlayed / summary.totalGamesOwned) * 100) || 0;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 snap-center">
        
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">
            The <span className="text-[#1A9FFF]">2026</span> Snapshot
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            
            {/* Card 1: Total Games */}
            <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 flex flex-col items-center text-center hover:bg-slate-800/50 transition-colors">
            <div className="text-6xl mb-4">📚</div>
            <div className="text-4xl font-bold text-white mb-2">{summary.totalGamesOwned}</div>
            <div className="text-slate-400 uppercase tracking-widest text-sm font-bold">Games Owned</div>
            </div>

            {/* Card 2: Games Played */}
            <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 flex flex-col items-center text-center hover:bg-slate-800/50 transition-colors relative overflow-hidden">
            <div className="text-6xl mb-4">🎮</div>
            <div className="text-4xl font-bold text-[#1A9FFF] mb-2">{summary.totalGamesPlayed}</div>
            <div className="text-slate-400 uppercase tracking-widest text-sm font-bold">Games Played</div>
            
            {/* Backlog Badge */}
            <div className="absolute top-4 right-4 bg-green-900/30 text-green-400 text-xs font-bold px-2 py-1 rounded-full border border-green-800">
                {playedPercentage}% of Library
            </div>
            </div>

            {/* Card 3: Total Hours */}
            <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 flex flex-col items-center text-center hover:bg-slate-800/50 transition-colors">
            <div className="text-6xl mb-4">⏳</div>
            <div className="text-4xl font-bold text-white mb-2">
                {summary.totalPlaytimeHours.toLocaleString()}
            </div>
            <div className="text-slate-400 uppercase tracking-widest text-sm font-bold">Total Hours</div>
            </div>

        </div>

        <p className="mt-12 text-slate-500 text-sm max-w-md text-center italic">
            {summary.totalPlaytimeHours > 5000 
            ? "That's a lot of dedication... Maybe go touch grass?" 
            : summary.totalPlaytimeHours > 1000
            ? "A committed one, aren't you?"
            : "Rookie numbers! You need to pump those up more."}
        </p>

        </div>
    );
}