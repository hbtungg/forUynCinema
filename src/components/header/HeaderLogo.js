'use client';

import Link from 'next/link';

export default function HeaderLogo({ isSearchOpen }) {
  return (
    <>
      {/* ── 💻 LOGO PHIÊN BẢN DESKTOP (To rõ kịch trần, áp sát lề trái) ── */}
      <Link href="/home" className="hidden md:flex items-center h-15 flex-shrink-0 group">
        <img 
          src="/logo1.png" 
          alt="forUynCinema Logo" 
          className="h-14 w-auto object-contain object-left select-none transition-all duration-300 group-hover:scale-[1.03] group-hover:brightness-110" 
        />
      </Link>

      {/* ── 📱 LOGO PHIÊN BẢN MOBILE (ĐÃ SỬA: Khóa cứng vị trí CHÍNH GIỮA màn hình) ── */}
      <Link
        href="/home"
        // 🚀 GIẢI PHÁP TỐI THƯỢNG CHO MOBILE:
        // - absolute: Đưa logo ra khỏi luồng flex tự nhiên để không bị nút Hamburger chèn ép.
        // - left-1/2 -translate-x-1/2: Bộ đôi tọa độ vàng ép tâm logo nằm CHÍNH GIỮA màn hình 100%.
        className={`md:hidden absolute left-1/2 -translate-x-1/2 h-12 flex items-center justify-center transition-all duration-300 ${
          isSearchOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        <img 
          src="/logo1.png" 
          alt="forUynCinema Logo" 
          className="h-12 w-auto object-contain select-none block" 
        />
      </Link>
    </>
  );
}