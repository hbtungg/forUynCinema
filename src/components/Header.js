'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import SearchBox from './SearchBox';
import UserMenu from './UserMenu';
import CategoryMenu from './CategoryMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Đóng menu khi bấm ra ngoài
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
    // Sử dụng fixed và backdrop-blur để Header luôn nổi trên Slider khi cuộn
    <header className="fixed top-0 left-0 w-full z-[100] px-4 md:px-10 py-4 bg-black/20 backdrop-blur-md border-b border-white/5" ref={menuRef}>
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-6">
        
        {/* BÊN TRÁI: LOGO */}
        <div className="flex-shrink-0">
          <Link href="/" className="group block">
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter italic leading-none transition-all group-hover:scale-105">
              <span className="text-white">for</span>
              <span className="text-red-600">Uyn</span>
              <span className="text-white ml-1">Cinema</span>
            </h1>
          </Link>
        </div>

        {/* GIỮA: THANH TÌM KIẾM */}
        <div className="hidden md:block flex-1 max-w-[500px]">
          <SearchBox />
        </div>

        {/* PHẢI: MENU THỂ LOẠI & ACCOUNT */}
        <div className="flex items-center gap-6">
          
          {/* Menu Thể loại/Quốc gia dạt về bên phải */}
          <nav className="hidden lg:block">
            <CategoryMenu />
          </nav>

          {/* NÚT ACCOUNT ICON */}
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-zinc-900/60 hover:bg-red-600/20 border transition-all duration-500 rounded-full ${
                isMenuOpen ? 'border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'border-zinc-800'
              }`}
            >
              <div className="relative w-5 h-5 md:w-6 md:h-6">
                <svg 
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className={`absolute inset-0 w-full h-full text-zinc-400 transition-all duration-500 transform ${
                    isMenuOpen ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0'
                  }`}
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
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
            
            {/* POPUP USER MENU */}
            {isMenuOpen && (
              <div className="absolute top-[calc(100%+15px)] right-0 w-72 bg-zinc-950/90 backdrop-blur-3xl border border-zinc-800/50 rounded-[2rem] shadow-[0_20px_80px_rgba(0,0,0,0.9)] p-4 z-[150] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300 origin-top-right">
                <div className="absolute -top-1.5 right-5 w-3 h-3 bg-zinc-950 border-t border-l border-zinc-800/50 rotate-45 md:block hidden"></div>
                <UserMenu />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}