'use client';

import Link from 'next/link';

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Terms',  href: '/terms' },
  { label: 'Disclaimer',   href: '/disclaimer' },
  { label: 'Contact',    href: '/contact' },
];

export default function Footer() {
  return (
    /* 🚀 FIX CHÍ MẠNG: Tăng nền kính mờ bg-[#0F1326]/60 che phim, gọt mỏng đệm dọc xuống py-4 */
    <footer className="relative border-t border-[#E6C687]/10 bg-[#0F1326]/60 backdrop-blur-md w-full select-none" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-4">

        {/* ── TẦNG 1: DÒNG ĐIỀU HƯỚNG MỎNG NHẸ ── */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          {/* TRÁI — Logo Chữ ánh vàng Moonlight */}
          <Link href="/home" className="group shrink-0 self-start md:self-auto transition-transform duration-300 hover:scale-105">
            <span 
              className="text-base font-bold tracking-[0.25em] text-[#E6C687] font-sans uppercase"
              style={{ textShadow: '0 0 10px rgba(230, 198, 135, 0.35)' }}
            >
              UYNFLIX
            </span>
          </Link>

          {/* GIỮA — Thanh Nav mỏng gọn */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="group relative text-[10px] font-bold uppercase tracking-[0.22em] text-[#d0c5b5]/40
                           transition-colors duration-300 hover:text-[#ffe3ae]"
              >
                {label}
                <span className="absolute -bottom-0.5 left-1/2 h-px w-0 bg-[#E6C687] shadow-[0_0_8px_rgba(230,198,135,0.6)]
                                 transition-all duration-300 -translate-x-1/2 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* PHẢI — Copyright & Signature (Gộp luôn lên tầng này cho mỏng trang) */}
          <div className="flex items-center gap-4 md:justify-end shrink-0">
            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#d0c5b5]/20">
              &copy; {new Date().getFullYear()} - hb.tungg
            </p>
            
            {/* Chòm sao mini nhấp nháy */}
            <div className="flex items-center gap-2">
              <div className="h-px w-4 bg-white/5" />
              <div className="relative flex items-center justify-center">
                <div className="absolute h-3 w-3 animate-ping rounded-full bg-[#E6C687]/10" />
                <div className="h-1 w-1 rounded-full bg-[#E6C687] shadow-[0_0_10px_rgba(230,198,135,0.9)]" />
              </div>
              <div className="h-px w-4 bg-white/5" />
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}