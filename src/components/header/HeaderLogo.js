'use client';

import Link from 'next/link';
import Image from 'next/image'; // 🚀 CHÈN THÊM: Import Image để tối ưu tốc độ tải và xóa cảnh báo

export default function HeaderLogo({ isSearchOpen }) {
  return (
    <>
      {/* ── 💻 LOGO PHIÊN BẢN DESKTOP (Tối ưu hóa Next.js Image) ── */}
      <Link href="/home" className="hidden md:flex items-center h-15 flex-shrink-0 group relative">
        {/* 🛠️ ĐÃ SỬA: Chuyển sang <Image /> với khung bọc khống chế kích thước h-9 (36px), w-28 (112px) */}
        <div className="h-9 w-28 relative transition-all duration-300 group-hover:scale-[1.03] group-hover:brightness-110 select-none">
          <Image 
            src="/logo.png" 
            alt="Uynflix Logo" 
            fill
            priority // Tải ưu tiên kịch trần vì đây là thành phần Header xuất hiện đầu tiên
            sizes="112px"
            className="object-contain object-left" 
          />
        </div>
      </Link>

      {/* ── 📱 LOGO PHIÊN BẢN MOBILE (Tối ưu hóa Next.js Image) ── */}
      <Link
        href="/home"
        className={`md:hidden absolute left-1/2 -translate-x-1/2 h-12 flex items-center justify-center transition-all duration-300 ${
          isSearchOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* 🛠️ ĐÃ SỬA: Chuyển sang <Image /> với khung bọc khống chế kích thước h-8 (32px), w-24 (96px) */}
        <div className="h-8 w-24 relative select-none">
          <Image 
            src="/logo.png" 
            alt="Uynflix Logo" 
            fill
            priority
            sizes="96px"
            className="object-contain" 
          />
        </div>
      </Link>
    </>
  );
}