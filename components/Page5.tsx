import { WishlistedGame } from '@/types';

interface Page5Props {
    wishlist: WishlistedGame[];
}

export default function Page5({ wishlist }: Page5Props) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 snap-center relative overflow-hidden">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 text-center tracking-tighter drop-shadow-lg">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-500 filter drop-shadow-[0_0_20px_rgba(26,159,255,0.4)]">"Maybe Later"</span> List
            </h2>
            
            <p className="text-slate-400 mb-12 text-center max-w-lg z-10">
                You promised yourself you'd play these. We both know you're just waiting for a 90% off sale.
            </p>

            {/* Wishlist Grid */}
            {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl z-10">
                {wishlist.map((game) => (
                    <div 
                    key={game.appid}
                    className="group relative bg-slate-900/50 rounded-xl overflow-hidden border border-slate-800 hover:border-red-400/50 transition-all hover:shadow-[0_0_30px_rgba(248,113,113,0.2)]"
                    >

                    <div className="h-32 overflow-hidden">
                        <img 
                        src={game.capsule_url} 
                        alt={game.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                    
                    <div className="p-4 flex items-center justify-between">
                        <h3 className="font-bold text-white truncate pr-4">{game.name}</h3>
                        <a 
                        href={`https://store.steampowered.com/app/${game.appid}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-red-500/20 text-red-400 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                        >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        </a>
                    </div>
                    </div>
                ))}
                </div>
            ) : (
                <div className="text-center z-10 p-12 bg-slate-900/50 rounded-3xl border border-slate-800">
                <div className="text-6xl mb-4">🤷‍♂️</div>
                <h3 className="text-2xl font-bold text-white mb-2">No Wishlist?</h3>
                <p className="text-slate-400">Either you own everything, or you are incredibly picky.</p>
                </div>
            )}

            <div className="mt-16 bg-gradient-to-r from-red-900/40 to-orange-900/40 border border-red-500/30 p-6 rounded-2xl flex items-center gap-4 max-w-2xl w-full z-10 backdrop-blur-sm">
                <div>
                <h4 className="text-red-400 font-bold uppercase tracking-widest text-sm">PRO TIP:</h4>
                <p className="text-white font-medium">
                    The <span className="font-bold text-white">Steam Summer Sale</span> usually starts in late June. 
                    <br className="md:hidden" /> Prepare your bank account.
                </p>
                </div>
            </div>
        </div>
    );
}