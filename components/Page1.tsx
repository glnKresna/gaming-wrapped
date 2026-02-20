import { SteamUserProfile } from "@/types";

interface Page1Props {
    profile: SteamUserProfile;
}

export default function Page1({profile}: Page1Props) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8 snap-center">
            <div className="relative group mt-[-5vh]">
                <div className="absolute -inset-1 bg-linear-to-r from-[#1A9FFF] to-indigo-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-500 animate-pulse"></div>
                
                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-[#0a0d14] shadow-2xl bg-[#0a0d14]">
                    <img 
                        src={profile.avatar} 
                        alt={`${profile.alias}'s avatar`} 
                        className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110" 
                    />
                </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#1A9FFF] to-[#4EB5FF]">
                    {profile.alias}'s
                </span>
                <br />
                2026 Gaming Wrapped
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 italic max-w-lg mt-4">
                Let`s look back at your gaming activities this year
            </p>

            <div className="pt-16 text-slate-500 animate-pulse flex flex-col items-center gap-2">
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