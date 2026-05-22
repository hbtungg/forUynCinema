'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEnter = () => {
    if (exiting) return;
    navigator.vibrate?.(10);
    setExiting(true);
    setTimeout(() => {
      router.push('/home');
    }, 600);
  };

  return (
    <main
      // ĐÃ ĐỔI: Sử dụng h-screen overflow-hidden để khóa cứng không gian, tuyệt đối không bị cuộn trang
      className={`h-screen w-screen bg-[#080808] text-white flex flex-col justify-between overflow-hidden relative select-none transition-all duration-600 ease-out ${
        exiting ? 'opacity-0 scale-[1.03] blur-sm' : 'opacity-100 scale-100 blur-none'
      }`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* ── ATMOSPHERE ── */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)' }}
      />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
        style={{ backgroundImage: "url('/noise.png')" }}
      />
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.92) 100%)' }}
      />
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[500px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at top, rgba(180,0,0,0.12) 0%, transparent 70%)' }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none z-0 animate-float"
        style={{ background: 'radial-gradient(circle, rgba(150,0,0,0.07) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      {/* ── TOP BAR (HEADER) ── */}
      <header className={`relative z-10 flex items-center justify-between px-6 md:px-14 pt-8 md:pt-10 transition-all duration-700 delay-100 flex-shrink-0 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-zinc-700" />
            ))}
          </div>
          <span className="text-[8px] uppercase tracking-[0.5em] text-zinc-600 font-bold">Est. 2026</span>
        </div>
        <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.4em] text-zinc-600">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse inline-block" />
          Now Showing
        </div>
      </header>

      {/* ── MAIN CONTENT (Trung tâm màn hình) ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 min-h-0">

        {/* Badge 18+ */}
        <div className={`mb-6 md:mb-10 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-flex items-center gap-3 border border-zinc-800 rounded-sm px-4 py-2 bg-zinc-950/80 backdrop-blur-sm">
            <div className="w-4 h-4 border border-red-700 flex items-center justify-center">
              <span className="text-[7px] font-black text-red-600">18</span>
            </div>
            <span className="text-[7px] uppercase tracking-[0.45em] text-zinc-500 font-bold">Digital Cinema</span>
            <div className="w-px h-3 bg-zinc-800" />
            <span className="text-[7px] uppercase tracking-[0.45em] text-zinc-600">4K · Dolby</span>
          </div>
        </div>

        {/* Hero Title Area */}
        <div className={`text-center mb-6 md:mb-8 transition-all duration-900 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-[8px] md:text-[10px] uppercase tracking-[1em] text-zinc-600 font-bold mb-4 md:mb-6">
            HB<span className="text-red-600">.</span>TUNGG&nbsp;&nbsp;presents
          </p>

          <div className="relative inline-block">
            <h1
              className="text-[54px] sm:text-[90px] md:text-[130px] lg:text-[150px] font-black uppercase leading-none tracking-tighter text-white select-none"
              style={{ textShadow: '0 0 80px rgba(200,0,0,0.18), 0 2px 0 rgba(0,0,0,0.8)' }}
            >
              FOR<span style={{ color: '#cc0000' }}>UYN</span>
            </h1>
            <div className="absolute -bottom-3 inset-x-0 flex items-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-red-700/60" />
              <div className="w-1.5 h-1.5 bg-red-600 rotate-45 mx-1 flex-shrink-0" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-red-700/60" />
            </div>
          </div>

          <p className="mt-8 text-[9px] md:text-[11px] italic text-zinc-500 tracking-[0.25em] md:tracking-[0.3em] font-light px-2">
            nơi mọi khoảnh khắc đều trở nên điện ảnh
          </p>
        </div>

        {/* Metadata System */}
        <div className={`flex items-center gap-4 md:gap-10 mb-10 md:mb-14 transition-all duration-700 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          {[
            { label: 'Genre', value: 'Phim Lậu' },
            { label: 'Rating', value: '★★★★★' },
            { label: 'Format', value: 'LOWKEY' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <p className="text-[7px] uppercase tracking-[0.4em] text-zinc-700 mb-1">{item.label}</p>
              <p className="text-[9px] md:text-[11px] font-bold text-zinc-400 tracking-wider">{item.value}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className={`transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button onClick={handleEnter} className="group relative overflow-hidden focus:outline-none">
            <div className="absolute inset-0 bg-red-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-4 border border-zinc-700 group-hover:border-red-700 px-8 md:px-10 py-3.5 transition-colors duration-300">
              <span className="w-1 h-1 rounded-full bg-red-600 group-hover:bg-white transition-colors duration-300" />
              <span className="text-[9px] md:text-[11px] uppercase tracking-[0.6em] font-black text-zinc-300 group-hover:text-white transition-colors duration-300">
                Enter Cinema
              </span>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"
                className="text-red-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* ── FOOTER (Đã tối ưu Responsive chống đè chữ ở Mobile) ── */}
      <footer className={`relative z-10 px-6 md:px-14 pb-8 md:pb-10 transition-all duration-700 flex-shrink-0 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionDelay: '800ms' }}>
        <div className="flex items-center justify-between w-full max-w-[1600px] mx-auto">
          
          {/* Cuộn phim bên trái: Trên mobile tự động rút từ 8 ô xuống còn 3 ô */}
          <div className="flex gap-1 md:gap-1.5 flex-shrink-0">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`border border-zinc-800 bg-zinc-950 w-2 h-3.5 md:w-2.5 md:h-4 rounded-[1px] ${i >= 3 ? 'hidden sm:block' : ''}`} />
            ))}
          </div>
          
          {/* Chữ bản quyền ở giữa: Nằm độc lập, luôn được ưu tiên căn giữa không lo bị đè */}
          <p className="text-[7px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-zinc-800 font-bold px-2 text-center whitespace-nowrap">
            © 2026 HB.Tungg · All rights reserved
          </p>
          
          {/* Cuộn phim bên phải: Trên mobile tự động rút từ 8 ô xuống còn 3 ô */}
          <div className="flex gap-1 md:gap-1.5 flex-shrink-0">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`border border-zinc-800 bg-zinc-950 w-2 h-3.5 md:w-2.5 md:h-4 rounded-[1px] ${i >= 3 ? 'hidden sm:block' : ''}`} />
            ))}
          </div>

        </div>
      </footer>

      {/* LỚP LỆNH CHẠY ANIMATION */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50%       { transform: translate(-50%, -51%) scale(1.04); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
      `}</style>
    </main>
  );
}