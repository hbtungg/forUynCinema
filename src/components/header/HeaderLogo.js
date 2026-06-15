'use client';

import Link from 'next/link';

export default function HeaderLogo({ isSearchOpen }) {
  return (
    <>
      {/* ── 💻 LOGO PHIÊN BẢN DESKTOP (Đã tăng kích cỡ vừa vặn) ── */}
      <Link href="/home" className="hidden md:flex items-center h-15 flex-shrink-0 group">
        <img 
          src="/logo.png" 
          alt="forUynCinema Logo" 
          className="h-9 w-auto object-contain object-left select-none transition-all duration-300 group-hover:scale-[1.03] group-hover:brightness-110" 
        />
      </Link>

      {/* ── 📱 LOGO PHIÊN BẢN MOBILE (Đã tăng kích cỡ vừa vặn) ── */}
      <Link
        href="/home"
        className={`md:hidden absolute left-1/2 -translate-x-1/2 h-12 flex items-center justify-center transition-all duration-300 ${
          isSearchOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        <img 
          src="/logo.png" 
          alt="forUynCinema Logo" 
          className="h-8 w-auto object-contain select-none block" 
        />
      </Link>
    </>
  );
}