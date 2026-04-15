'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/home');
    }, 4500); // Tăng lên 4.5s để đủ thời gian đọc câu chào

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main 
      onClick={() => router.push('/home')}
      className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans overflow-hidden relative cursor-pointer select-none"
    >
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[700px] h-[300px] md:h-[700px] bg-red-600/5 blur-[120px] md:blur-[180px] rounded-full animate-pulse pointer-events-none"></div>

      {/* CENTER CONTENT */}
      <div className="relative z-10 text-center space-y-10 md:space-y-16">
        
        {/* Logo Branding */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
            HB<span className="text-red-600">.</span>TUNGG
          </h1>
          <div className="flex items-center justify-center gap-4 opacity-50">
            <div className="h-px w-8 md:w-12 bg-zinc-700"></div>
            <p className="text-[7px] md:text-[9px] text-zinc-400 uppercase tracking-[1em] font-black">
              Digital Universe
            </p>
            <div className="h-px w-8 md:w-12 bg-zinc-700"></div>
          </div>
        </div>

        {/* WELCOME SECTION */}
        <div className="space-y-4 animate-in fade-in duration-1000 delay-500">
            <h2 className="text-xl md:text-4xl font-black italic uppercase tracking-tighter text-white/90">
                FOR<span className="text-red-600">UYN</span> CINEMA
            </h2>
            
            {/* Câu chào mừng - Hiệu ứng Typing nhẹ */}
            <div className="max-w-[280px] md:max-w-md mx-auto">
              <p className="text-[9px] md:text-[11px] text-zinc-400 uppercase tracking-[0.3em] font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-700">
                Chào mừng đến với hệ thống phim lậu lowkey. 
                <span className="block mt-2 text-zinc-600 italic tracking-widest lowercase font-normal">
                  - Nơi mọi khoảnh khắc đều trở nên đặc biệt.
                </span>
              </p>
            </div>
        </div>

      </div>

      {/* LOADING BAR */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-32 md:w-48 h-[1px] bg-zinc-900 overflow-hidden">
        <div className="h-full bg-red-600 animate-loading-bar origin-left"></div>
      </div>

      {/* TAP TO START INDICATOR */}
      <div className="absolute bottom-10 left-0 w-full text-center">
          <p className="text-[7px] md:text-[8px] text-zinc-800 font-black uppercase tracking-[0.6em] animate-pulse">
            Chạm để bắt đầu trải nghiệm
          </p>
      </div>

      <style jsx global>{`
        @keyframes loading-bar {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-loading-bar {
          animation: loading-bar 4.5s linear forwards;
        }
      `}</style>
    </main>
  );
}