'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import SearchBox from './SearchBox';
import UserMenu from './UserMenu';
import CategoryMenu from './CategoryMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <header className="mb-10 md:mb-12 font-sans relative" ref={menuRef}>
      
      {/* TẦNG 1: LOGO & ACCOUNT ICON */}
      <div className="flex justify-between items-center w-full mb-10 md:mb-14">
        <div className="flex flex-col items-start">
          <Link href="/" className="active:scale-95 transition-transform">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic leading-none transition-all">
              <span className="text-white">for</span>
              <span className="text-red-600">Uyn</span>
              <span className="text-white ml-2">Cinema</span>
            </h1>
          </Link>
          <p className="text-zinc-600 text-[9px] md:text-xs mt-3 italic font-medium opacity-70 tracking-[0.3em]">
            Gọi cho anh bất cứ khi nào em thấy cần 🥦
          </p>
        </div>

        {/* NÚT ACCOUNT BIẾN HÌNH THÀNH X */}
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-zinc-900/40 hover:bg-zinc-800 border-2 rounded-full transition-all duration-500 overflow-hidden ${
              isMenuOpen ? 'border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.2)]' : 'border-zinc-800'
            }`}
          >
            <div className="relative w-6 h-6 md:w-8 md:h-8">
              {/* ICON NGƯỜI */}
              <svg 
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className={`absolute inset-0 w-full h-full text-zinc-400 transition-all duration-500 transform ${
                  isMenuOpen ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0'
                }`}
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {/* ICON DẤU X */}
              <svg 
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className={`absolute inset-0 w-full h-full text-red-600 transition-all duration-500 transform ${
                  isMenuOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-90'
                }`}
              >
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
          </button>
          
          {isMenuOpen && (
            /* 1. Tăng w-56 lên w-72 để không gian thở thoải mái hơn
               2. Dùng bg-zinc-950/80 + backdrop-blur để tạo hiệu ứng kính
               3. Giảm p-6 xuống p-4 để nhường chỗ cho UserMenu tự hiển thị
            */
            <div className="absolute top-[calc(100%+12px)] right-0 w-72 bg-zinc-950/80 backdrop-blur-2xl border border-zinc-800/50 rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.8)] p-4 z-[150] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300 origin-top-right">
              
              {/* Một cái "đuôi" nhỏ để nối với nút icon cho tinh tế */}
              <div className="absolute -top-1.5 right-6 w-3 h-3 bg-zinc-900 border-t border-l border-zinc-800/50 rotate-45 md:block hidden"></div>
              
              <UserMenu />
            </div>
          )}
        </div>
      </div>

      {/* TẦNG 2: CATEGORY & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-center border-t border-zinc-900/50 pt-8 mt-4 gap-6 w-full overflow-visible">
        
        <div className="flex-shrink-0">
          <CategoryMenu />
        </div>

        {/* Thanh tìm kiếm sẽ tự động dạt sang phải nhờ justify-between ở trên */}
        <div className="w-full md:max-w-[450px]">
           <SearchBox />
        </div>
        
      </div>
    </header>
  );
}