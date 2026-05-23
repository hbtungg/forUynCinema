'use client';

import Link from 'next/link';

export default function HeaderLogo({ isSearchOpen }) {
  return (
    <>
      {/* Logo phiên bản Desktop */}
      <Link href="/home" className="hidden md:flex items-end gap-1 flex-shrink-0 group">
        <span className="text-xl font-black tracking-tighter leading-none select-none">
          <span className="text-white group-hover:text-red-600 transition-colors duration-200">for</span>
          <span className="text-red-600 group-hover:text-white transition-colors duration-200">Uyn</span>
          <span className="text-white"> Cinema</span>
        </span>
      </Link>

      {/* Logo phiên bản Mobile — SỬA LỖI: Tự động biến mất khi mở ô tìm kiếm để chống đè chữ */}
      <Link
        href="/home"
        className={`md:hidden absolute left-1/2 -translate-x-1/2 transition-all duration-300 ${
          isSearchOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        <span className="text-xl font-black tracking-tighter select-none">
          <span className="text-white">for</span>
          <span className="text-red-600">Uyn</span>
        </span>
      </Link>
    </>
  );
}