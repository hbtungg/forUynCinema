'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import SearchBox from './SearchBox';
import UserMenu from './UserMenu';
import CategoryMenu from './CategoryMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile Drawer
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Mobile Search Overlay
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Desktop User Popup
  const [isScrolled, setIsScrolled] = useState(false); // Trạng thái cuộn trang
  const [isVisible, setIsVisible] = useState(true); // Trạng thái ẩn/hiện header
  const lastScrollY = useRef(0);
  const menuRef = useRef(null);

  // 1. Logic ẩn/hiện Header thông minh & Đổi màu khi cuộn
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Đổi trạng thái nền khi cuộn khỏi đầu trang (> 20px)
      setIsScrolled(currentScrollY > 20);

      // Ẩn khi cuộn xuống, hiện khi cuộn lên (ngưỡng 100px để tránh nhạy quá)
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Khóa cuộn trang khi mở Drawer Mobile
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  // 3. Đóng Desktop User Menu khi bấm ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header 
      ref={menuRef}
      className={`fixed top-0 left-0 w-full z-[100] px-4 md:px-10 h-16 md:h-20 transition-transform duration-500 ease-in-out transform
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      {/* LỚP NỀN THÔNG MINH: Thay đổi opacity thay vì thay đổi Padding để tránh giật */}
      <div className={`absolute inset-0 transition-all duration-700 ease-in-out
        ${isScrolled ? 'bg-black/80 backdrop-blur-xl opacity-100' : 'bg-transparent opacity-0'}
      `}></div>

      {/* ĐƯỜNG KẺ DƯỚI: Tách biệt để mờ dần mượt mà */}
      <div className={`absolute inset-x-0 bottom-0 h-[1px] transition-opacity duration-700 ${isScrolled ? 'bg-white/5 opacity-100' : 'bg-transparent opacity-0'}`}></div>

      <div className="max-w-[1600px] mx-auto flex items-center justify-between h-full relative z-10">
        
        {/* --- 1. THANH 3 GẠCH (Mobile Left) --- */}
        <div className={`md:hidden z-[130] transition-all duration-300 ${isSearchOpen ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <div className="w-6 h-5 relative">
              <span className={`absolute block h-0.5 w-full bg-white transition-all duration-500 ${isMenuOpen ? 'rotate-45 top-2' : 'top-0'}`}></span>
              <span className={`absolute block h-0.5 w-full bg-white transition-all duration-500 top-2 ${isMenuOpen ? 'opacity-0 translate-x-2' : 'opacity-100'}`}></span>
              <span className={`absolute block h-0.5 w-full bg-white transition-all duration-500 ${isMenuOpen ? '-rotate-45 top-2' : 'top-4'}`}></span>
            </div>
          </button>
        </div>

        {/* --- 2. LOGO --- */}
        <div className={`absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 transition-all duration-500 ${isSearchOpen ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
          <Link href="/home" onClick={() => setIsMenuOpen(false)}>
            <h1 className="text-xl md:text-3xl font-black tracking-tighter italic leading-none group">
              <span className="text-white group-hover:text-red-600 transition-colors">for</span>
              <span className="text-red-600 group-hover:text-white transition-colors">Uyn</span>
              <span className="text-white ml-1">Cinema</span>
            </h1>
          </Link>
        </div>

        {/* --- 3. TÌM KIẾM --- */}
        <div className="hidden md:block flex-1 max-w-[400px] lg:max-w-[500px] mx-10">
          <SearchBox />
        </div>

        {/* Bản Mobile Search Overlay */}
        <div className={`fixed inset-0 bg-[#0a0a0a] z-[140] flex items-center px-4 transition-all duration-500 md:hidden ${isSearchOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
          <div className="flex-1">
            <SearchBox />
          </div>
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="ml-4 w-10 h-10 flex items-center justify-center text-red-600 transition-transform active:scale-75"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* --- 4. PHẢI: KÍNH LÚP & DESKTOP MENU --- */}
        <div className="flex items-center gap-2 z-[130]">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className={`md:hidden w-10 h-10 flex items-center justify-center text-white transition-all duration-300 ${isSearchOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>

          <nav className="hidden lg:block">
            <CategoryMenu />
          </nav>

          <div className="hidden md:block relative ml-4">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`w-11 h-11 flex items-center justify-center bg-zinc-900/50 backdrop-blur-md border rounded-full transition-all duration-500 ${isUserMenuOpen ? 'border-red-600 rotate-180 shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'border-zinc-800 rotate-0'}`}
            >
              <svg className={`w-6 h-6 transition-colors ${isUserMenuOpen ? 'text-red-600' : 'text-zinc-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
            {isUserMenuOpen && (
              <div className="absolute top-[calc(100%+15px)] right-0 w-72 bg-black border border-white/5 rounded-[2.5rem] p-5 z-[150] shadow-2xl animate-in fade-in zoom-in-95 origin-top-right backdrop-blur-2xl">
                <UserMenu />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MOBILE DRAWER MENU --- */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[150] transition-opacity duration-500 md:hidden ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      <div className={`fixed top-0 left-0 w-[85%] max-w-[340px] h-screen bg-[#050505] z-[160] transition-transform duration-700 ease-out md:hidden flex flex-col shadow-[20px_0_60px_rgba(0,0,0,1)] border-r border-white/5 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-end p-6">
           <button onClick={() => setIsMenuOpen(false)} className="text-zinc-500 hover:text-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
           </button>
        </div>

        <div className="px-6 pb-20 flex-1 overflow-y-auto space-y-12 scrollbar-hide">
          <div className="bg-zinc-900/50 p-6 rounded-[2.5rem] border border-white/5 shadow-xl">
            <UserMenu isMobile={true} />
          </div>

          <div className="px-2 pb-10">
            <p className="text-red-600 font-black uppercase text-[10px] tracking-[0.4em] mb-6 pl-1">Mời em nhé</p>
            <CategoryMenu isMobile={true} closeMobileMenu={() => setIsMenuOpen(false)} />
          </div>
        </div>
      </div>
    </header>
  );
}