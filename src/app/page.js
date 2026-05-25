'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      router.push('/home');
    }, 800); // Hiệu ứng lướt màn hình cổ điển khi vào rạp
  };

  if (!mounted) return null;

  return (
    <main className="h-screen w-screen bg-[#f4f1ea] dark:bg-[#0c0c0f] text-[#2b2927] dark:text-[#e4e2dd] flex flex-col justify-between p-8 md:p-16 relative overflow-hidden transition-colors duration-700 select-none">
      
      {/* ── HIỆU ỨNG "TẮT ĐÈN RẠP PHIM" (Chuyển trang mượt mà) ── */}
      <div 
        className={`absolute inset-0 bg-[#0a0a0c] z-50 pointer-events-none transition-opacity duration-[800ms] ease-in-out ${
          isExiting ? 'opacity-100' : 'opacity-0'
        }`} 
      />

      {/* ── TOP BAR (Thiết kế như một tấm vé phim cổ điển) ── */}
      <header className="flex justify-between items-start w-full max-w-5xl mx-auto border-b border-[#2b2927]/10 dark:border-[#e4e2dd]/10 pb-4 animate-fade-in">
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-black tracking-[0.3em] opacity-40">N° 2026-HB</p>
          <p className="text-xs font-serif italic font-bold">forUyn Cinema</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase font-black tracking-[0.4em] text-red-700 dark:text-red-500 animate-pulse">● Premium Access</p>
          <p className="text-[9px] uppercase font-medium tracking-widest opacity-50 mt-1">Hanoi · Saigon · Hue</p>
        </div>
      </header>

      {/* ── CENTER CONTENT (Tối giản, lãng mạn phong cách Retro Vintage) ── */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto my-12 space-y-10 animate-slide-up">
        
        {/* Khung nhãn rạp phim bo góc cổ điển */}
        <div className="border border-[#2b2927]/20 dark:border-[#e4e2dd]/20 p-2 rounded-full scale-90 opacity-80">
          <p className="text-[9px] uppercase tracking-[0.5em] font-black px-4 py-1.5 border border-dashed border-[#2b2927]/30 dark:border-[#e4e2dd]/30 rounded-full">
            Nơi mọi khoảnh khắc đều trở nên điện ảnh
          </p>
        </div>

        {/* Khối Logo thương hiệu chữ Serif uốn lượn nghệ thuật */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl font-serif font-black tracking-tight drop-shadow-sm italic">
            forUyn <span className="font-light font-sans text-red-700 dark:text-red-500">Cinema</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.6em] opacity-50 font-medium">
            Màn Ảnh Nhỏ · Tình Yêu To lớn
          </p>
        </div>

        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#2b2927]/30 dark:via-[#e4e2dd]/30 to-transparent" />

        {/* Nút bấm Enter hoài cổ thanh lịch */}
        <button 
          onClick={handleEnter}
          className="group relative px-10 py-4 bg-[#2b2927] dark:bg-[#e4e2dd] text-[#f4f1ea] dark:text-[#0c0c0f] rounded-none font-serif text-sm font-bold italic tracking-widest hover:bg-red-700 dark:hover:bg-red-600 hover:text-white dark:hover:text-white transition-all duration-300 active:scale-95 shadow-xl cursor-pointer"
        >
          <span className="absolute top-1 left-1 bottom-1 right-1 border border-dashed border-[#f4f1ea]/30 dark:border-[#0c0c0f]/30 group-hover:border-white/40" />
          Bước Vào Rạp Phim —
        </button>

      </div>

      {/* ── FOOTER CỔ ĐIỂN ── */}
      <footer className="w-full max-w-5xl mx-auto border-t border-[#2b2927]/10 dark:border-[#e4e2dd]/10 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[9px] uppercase tracking-widest opacity-40 font-bold animate-fade-in">
        <p>© 2026 Huỳnh Bá Thanh Tùng. All Rights Reserved.</p>
        <p className="font-serif italic font-medium lowercase tracking-normal">em bảo em thích xem phim...</p>
      </footer>

      {/* ── STYLES ANIMATION SIÊU NHẸ ── */}
      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 0.4; }
        }
        .animate-slide-up { animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .animate-fade-in { animation: slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>
    </main>
  );
}