'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

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
      // h-screen w-screen khóa cứng không gian, tuyệt đối không bị cuộn trang
      className={`h-screen w-screen bg-[#080808] text-white flex flex-col justify-between overflow-hidden relative select-none transition-all duration-600 ease-out ${
        exiting ? 'opacity-0 scale-[1.03] blur-sm' : 'opacity-100 scale-100 blur-none'
      }`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* ── ATMOSPHERE (Hiệu ứng không gian mờ ảo của anh) ── */}
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

      {/* ── TOP BAR (HEADER) - Cố định đỉnh đầu, có giãn cách pt-8 md:pt-10 ── */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-14 pt-8 md:pt-10 flex-shrink-0 animate-fade-down">
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

      {/* ── MAIN CONTENT (Đã khôi phục flex-1 và justify-center để bung tỏa không gian rộng rãi) ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 min-h-0 w-full">

        {/* Khối bọc cụm trung tâm: Thêm gap-8 md:gap-12 để các thành phần tự giãn cách thoáng đãng */}
        <div className="flex flex-col items-center text-center w-full max-w-4xl gap-8 md:gap-12">
          
          {/* TẦNG 1: Badge 18+ (Đứng riêng biệt ở trên) */}
          <div className="animate-fade-up-badge flex-shrink-0">
            <div className="inline-flex items-center gap-3 border border-zinc-800 rounded-sm px-4 py-2 bg-zinc-950/80 backdrop-blur-sm">
              <div className="w-4 h-4 border border-red-700 flex items-center justify-center">
                <span className="text-[7px] font-black text-red-600">18</span>
              </div>
              <span className="text-[7px] uppercase tracking-[0.45em] text-zinc-500 font-bold">Digital Cinema</span>
              <div className="w-px h-3 bg-zinc-800" />
              <span className="text-[7px] uppercase tracking-[0.45em] text-zinc-600">4K · Dolby</span>
            </div>
          </div>

          {/* TẦNG 2: Khu vực thương hiệu LOGO chính diện */}
          <div className="w-full flex flex-col items-center animate-fade-up-logo relative">
            {/* Dòng chữ presents */}
            <p className="text-[8px] md:text-[10px] uppercase tracking-[1em] text-zinc-600 font-bold mb-3 md:mb-5 relative z-20">
              HB<span className="text-red-600">.</span>TUNGG&nbsp;&nbsp;presents
            </p>

            {/* Khung chứa ảnh Logo (Đã nới rộng thoải mái, không lo đè nén) */}
            <div className="relative inline-block w-full max-w-none px-4 overflow-visible">
              <img 
                src="/logo1.png" 
                alt="forUynCinema" 
                // Chiều cao lý tưởng để logo to rực rỡ mà không phá vỡ khung hình
                className="h-32 sm:h-44 md:h-56 lg:h-60 w-auto object-contain mx-auto select-none filter drop-shadow-[0_0_40px_rgba(200,0,0,0.15)]"
              />
              
              {/* Thanh lề gạch ngang - Đặt cách một khoảng tinh tế -bottom-5 dưới gầm logo */}
              <div className="absolute -bottom-5 inset-x-0 flex items-center px-12 max-w-xl mx-auto">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-red-700/60" />
                <div className="w-1.5 h-1.5 bg-red-600 rotate-45 mx-1 flex-shrink-0" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-red-700/60" />
              </div>
            </div>

            {/* Dòng chữ slogan dưới gầm logo - Cách một khoảng mt-8 rộng rãi thoáng đãng */}
            <p className="mt-8 text-[9px] md:text-[11px] italic text-zinc-500 tracking-[0.25em] md:tracking-[0.3em] font-light px-2 relative z-10">
              nơi mọi khoảnh khắc đều trở nên điện ảnh
            </p>
          </div>

          {/* TẦNG 3: Metadata System (Thông tin thể loại, đánh giá) */}
          <div className="flex items-center justify-center gap-6 md:gap-12 animate-fade-in-delayed flex-shrink-0">
            {[
              { label: 'Genre', value: 'Phim Lậu' },
              { label: 'Rating', value: '★★★★★' },
              { label: 'Format', value: 'LOWKEY' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-[7px] uppercase tracking-[0.4em] text-zinc-700 mb-1.5">{item.label}</p>
                <p className="text-[9px] md:text-[11px] font-bold text-zinc-400 tracking-wider">{item.value}</p>
              </div>
            ))}
          </div>

          {/* TẦNG 4: CTA Button (Nút kích hoạt vào rạp) */}
          <div className="animate-fade-up-badge flex-shrink-0">
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

      </div>

      {/* ── FOOTER - Khóa chặt biên dưới màn hình, có khoảng cách pb-8 md:pb-10 ── */}
      <footer className="relative z-10 px-6 md:px-14 pb-8 md:pb-10 flex-shrink-0 animate-fade-in-delayed">
        <div className="flex items-center justify-between w-full max-w-[1600px] mx-auto">
          
          <div className="flex gap-1 md:gap-1.5 flex-shrink-0">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`border border-zinc-800 bg-zinc-950 w-2 h-3.5 md:w-2.5 md:h-4 rounded-[1px] ${i >= 3 ? 'hidden sm:block' : ''}`} />
            ))}
          </div>
          
          <p className="text-[7px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-zinc-800 font-bold px-2 text-center whitespace-nowrap">
            © 2026 HB.Tungg · All rights reserved
          </p>
          
          <div className="flex gap-1 md:gap-1.5 flex-shrink-0">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`border border-zinc-800 bg-zinc-950 w-2 h-3.5 md:w-2.5 md:h-4 rounded-[1px] ${i >= 3 ? 'hidden sm:block' : ''}`} />
            ))}
          </div>

        </div>
      </footer>

      {/* LỚP LỆNH CHẠY ANIMATION CHUẨN TỐC ĐỘ */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50%       { transform: translate(-50%, -51%) scale(1.04); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUpLogo {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-down { animation: fadeDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both; }
        .animate-fade-up-badge { animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both; }
        .animate-fade-up-logo { animation: fadeUpLogo 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
        .animate-fade-in-delayed { animation: fadeIn 0.7s ease-out 0.4s both; }
      `}</style>
    </main>
  );
}