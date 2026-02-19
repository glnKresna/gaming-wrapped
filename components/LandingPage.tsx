import { SteamUserProfile } from "@/types";

interface LandingPageProps {
    profile: SteamUserProfile;
}

export default function LandingPage({profile}: LandingPageProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8 snap-center">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#1A9FFF] shadow-[0_0_40px_rgba(34, 197, 94, 0.4)]">
                <img src={profile.avatar} alt={`${profile.alias}'s avatar`} className="w-full h-full" />
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#1A9FFF] to-[#4EB5FF]">
                    {profile.alias}`s
                </span>
                <br />
                2026 Gaming Wrapped
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 italic max-w-lg mt-4">
                Let`s look back at your gaming activities these past few years
            </p>

            <div className="pt-16 text-slate-500 animate-bounce flex flex-col items-center gap-2">
                <span className="text-sm font-bold uppercase tracking-widest">
                    Scroll to Begin
                </span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 " />
                </svg>
            </div>
        </div>
    );
}