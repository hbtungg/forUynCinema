'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, Heart, User } from 'lucide-react'; // 🚀 ĐÃ THÊM: Icon User cho chế độ ẩn danh sang chảnh
import SecretChat from './SecretChat';
import EventButton from './EventButton';
import SearchBox from './SearchBox';
import UserMenu from './UserMenu';

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [showDropdown, setShowDropdown] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  const userMenuRef = useRef(null);
  const notifyRef = useRef(null);

  useEffect(() => {
    setShowDropdown(false);
    setIsNotifyOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowDropdown(false);
      if (notifyRef.current && !notifyRef.current.contains(e.target)) setIsNotifyOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#0F1326]/60 backdrop-blur-xl border-b border-[#E6C687]/10 h-[72px] flex items-center transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)] select-none" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div className="flex justify-between items-center px-6 md:px-16 w-full relative">

        {/* KHỐI TRÁI: LOGO ĐỊNH DANH */}
        <div className="flex items-center gap-12">
          {/* KHỐI TRÁI: LOGO ĐỊNH DANH - Premium Version */}
          <div className="flex items-center gap-12">
            <div
              onClick={() => router.push('/home')}
              className="group hover:scale-105 transition-all duration-500 cursor-pointer flex items-center gap-3 relative"
            >


              {/* Chữ UYNFLIX với hiệu ứng cao cấp */}
              <div className="relative">
                <span
                  className="text-2xl font-bold tracking-[0.25em] text-[#E6C687] font-sans transition-all duration-300"
                  style={{
                    textShadow: '0 0 20px rgba(230,198,135,0.2), 0 0 60px rgba(230,198,135,0.05)',
                    letterSpacing: '0.25em'
                  }}
                >
                  UYNFLIX
                </span>

                {/* Đường gạch chân animation */}
                <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-transparent via-[#E6C687] to-transparent transition-all duration-700 group-hover:w-full" />
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-xs font-bold tracking-wider uppercase">
            <Link href="/home" className={`transition-colors duration-300 ${pathname === '/home' ? 'text-[#E6C687]' : 'text-[#d0c5b5]/40 hover:text-[#E6C687]'}`}>Movies</Link>
            <Link href="/danh-sach" className={`transition-colors duration-300 ${pathname === '/danh-sach' ? 'text-[#E6C687]' : 'text-[#d0c5b5]/40 hover:text-[#E6C687]'}`}>Discover</Link>
            <Link href="/history" className={`transition-colors duration-300 ${pathname === '/history' ? 'text-[#E6C687]' : 'text-[#d0c5b5]/40 hover:text-[#E6C687]'}`}>History</Link>
          </div>
        </div>

        {/* KHỐI PHẢI: SEARCHBOX & ACCOUNT */}
        <div className="flex items-center gap-4">

          <div className="hidden sm:block">
            <SearchBox />
          </div>

          <div className="hidden sm:flex items-center gap-1">
            <SecretChat />
            {/* <EventButton /> */}
          </div>

          {/* Chuông Thông Báo */}
          <div className="relative" ref={notifyRef}>
            <button onClick={() => setIsNotifyOpen(!isNotifyOpen)} className="p-2 text-[#e8e1da] hover:text-[#ffe3ae] hover:scale-110 transition-all duration-300 relative focus:outline-none cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#E6C687] rounded-full ring-2 ring-[#060814]"></span>
            </button>

            {isNotifyOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-[#0F1326]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-1 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2.5 border-b border-white/5 bg-white/[0.02] rounded-t-xl flex items-center gap-1.5">
                  <span className="text-[#e6c687] text-xs">🌙</span>
                  <p className="text-[9px] font-bold text-[#d0c5b5]/40 uppercase tracking-[0.25em]">Anh Tùng có đôi lời</p>
                </div>
                <div className="p-4 text-[11px] font-medium text-[#d0c5b5]/80">
                  {session && (session.user?.email === 'thuuyen009900@gmail.com' || session.user?.email === 'hb.tungg@gmail.com') ? (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Heart className="w-3.5 h-3.5 text-red-400 fill-current shrink-0 mt-0.5 animate-pulse" />
                        <p className="text-xs font-bold text-[#ffe3ae]" style={{ textShadow: '0 0 8px rgba(255,227,174,0.3)' }}>vk ơi anh iu vk nhấttt</p>
                      </div>
                    </div>
                  ) : <p>Chúc bạn xem phim vui vẻ! 🎬</p>}
                </div>
              </div>
            )}
          </div>

          {/* Profile User Dropdown hoặc Nút đăng nhập pha lê tối ưu UI */}
          {status !== "loading" && session ? (
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setShowDropdown(!showDropdown)} className="p-0.5 text-[#e8e1da] hover:ring-2 ring-[#E6C687]/40 rounded-full transition-all duration-300 border border-white/5 flex items-center justify-center bg-[#181D38]/60 focus:outline-none cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-[#E6C687]/10 flex items-center justify-center overflow-hidden border border-[#E6C687]/20">
                  <span className="text-xs font-bold text-[#E6C687] uppercase font-mono">
                    {session.user?.name?.charAt(0) || "U"}
                  </span>
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-[#0F1326]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <UserMenu isMobile={false} />
                </div>
              )}
            </div>
          ) : status !== "loading" && (
            /* 🚀 FIX CHÍ MẠNG: Nút Đăng nhập dạng Avatar Pha Lê Ẩn Danh - Siêu gọn trên Mobile, Đẳng cấp trên Desktop */
            <button
              onClick={() => router.push('/login')}
              className="group/login p-1 flex items-center gap-2 rounded-full border border-dashed border-[#E6C687]/30 bg-[#E6C687]/5 hover:bg-[#E6C687] text-[#E6C687] hover:text-[#402d00] transition-all duration-300 focus:outline-none cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#E6C687]/10 group-hover/login:bg-black/10 flex items-center justify-center text-[#E6C687] group-hover/login:text-[#402d00] transition-colors">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="hidden md:inline pr-3 text-[11px] font-black tracking-widest uppercase font-sans">
                Login
              </span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}