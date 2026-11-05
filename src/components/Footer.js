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
    /* 🚀 FIX CHÍ MẠNG: Tăng nền kính mờ bg-white/[0.04] che phim, gọt mỏng đệm dọc xuống py-4 */
    <footer className="relative border-t border-[#e8e8e8]/10 glass-surface w-full select-none" style={{ fontFamily: "var(--font-main)" }}>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-4">

        {/* ── TẦNG 1: DÒNG ĐIỀU HƯỚNG MỎNG NHẸ ── */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          {/* TRÁI — Logo Chữ ánh vàng Moonlight */}
          <Link href="/home" className="group shrink-0 self-start md:self-auto transition-transform duration-300 hover:scale-105">
            <span 
              className="text-base font-bold tracking-[0.25em] text-[#e8e8e8] font-sans uppercase"
              style={{ textShadow: 'none' }}
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
                className="group relative text-[10px] font-bold uppercase tracking-[0.22em] text-[#808080]
                           transition-colors duration-300 hover:text-[#ffffff]"
              >
                {label}
                <span className="absolute -bottom-0.5 left-1/2 h-px w-0 bg-[#e8e8e8] 
                                 transition-all duration-300 -translate-x-1/2 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* PHẢI — Copyright & Signature (Gộp luôn lên tầng này cho mỏng trang) */}
          <div className="flex items-center gap-4 md:justify-end shrink-0">
            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#808080]">
              &copy; {new Date().getFullYear()} - hb.tungg
            </p>

            <div className="flex items-center gap-2">
              <div className="h-px w-4 bg-white/5" />
              <div className="relative flex items-center justify-center">
                <div className="absolute h-3 w-3 animate-ping rounded-full bg-[#e8e8e8]/10" />
                <div className="h-1 w-1 rounded-full bg-[#e8e8e8] " />
              </div>
              <div className="h-px w-4 bg-white/5" />
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}