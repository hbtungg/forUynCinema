'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-20 py-16 text-center border-t border-zinc-900/50 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Logo phụ phía dưới */}
        <div className="mb-8 opacity-50 hover:opacity-100 transition-opacity duration-500">
           <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
            FOR<span className="text-red-600">UYN</span> CINEMA
          </h2>
        </div>

        {/* Thông tin bản quyền */}
        <p className="text-zinc-600 text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-black mb-3">
          &copy; {new Date().getFullYear()} Designed by THTung for ThuUyn ❤️
        </p>
        
        {/* Lời nhắn ngọt ngào */}
        <p className="text-zinc-800 text-[8px] md:text-[9px] italic tracking-[0.2em] font-bold uppercase hover:text-zinc-400 transition-colors cursor-default">
          Premium Streaming Experience • Dedicated to my love
        </p>

        {/* Các liên kết nhanh (Nếu anh muốn thêm sau này) */}
        <div className="mt-8 flex justify-center gap-6 opacity-30">
            <div className="w-1 h-1 bg-red-600 rounded-full"></div>
            <div className="w-1 h-1 bg-red-600 rounded-full"></div>
            <div className="w-1 h-1 bg-red-600 rounded-full"></div>
        </div>
      </div>
    </footer>
  );
}