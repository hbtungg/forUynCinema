'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, ShieldCheck, Heart } from 'lucide-react';
import SecretChat from './SecretChat';
import EventButton from './EventButton';
import SearchBox from './SearchBox'; // 🚀 1. ĐÃ IMPORT SEARCHBOX TỨC THÌ MỚI CỦA ANH

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
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#0F1326]/60 backdrop-blur-xl border-b border-[#E6C687]/10 h-[72px] flex items-center transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.4)] select-none">
      <div className="flex justify-between items-center px-6 md:px-16 w-full relative">

        {/* KHỐI TRÁI: LOGO ĐỊNH DANH */}
        <div className="flex items-center gap-12">
          <div
            onClick={() => router.push('/home')}
            className="hover:scale-105 transition-transform duration-300 cursor-pointer flex items-center gap-2"
          >
            <span className="text-2xl font-bold tracking-[0.2em] text-[#E6C687] font-sans">
              UYNFLIX
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-xs font-bold tracking-wider uppercase">
            <Link href="/home" className={`transition-colors duration-300 ${pathname === '/home' ? 'text-[#E6C687]' : 'text-[#on-surface-variant] hover:text-[#E6C687]'}`}>Movies</Link>
            <Link href="/danh-sach" className={`transition-colors duration-300 ${pathname === '/danh-sach' ? 'text-[#E6C687]' : 'text-[#on-surface-variant] hover:text-[#E6C687]'}`}>Discover</Link>
            <Link href="/favorites" className={`transition-colors duration-300 ${pathname === '/favorites' ? 'text-[#E6C687]' : 'text-[#on-surface-variant] hover:text-[#E6C687]'}`}>Favorites</Link>
          </div>
        </div>

        {/* KHỐI PHẢI: SEARCHBOX MỚI & ACCOUNT */}
        <div className="flex items-center gap-4">
          
          {/* 🚀 2. VỊ TRÍ ĐÃ THAY THẾ: Găm thẳng SearchBox Live gợi ý từ khóa tức thì */}
          <div className="hidden sm:block">
            <SearchBox />
          </div>

          <div className="hidden sm:flex items-center gap-1">
            <SecretChat />
            <EventButton />
          </div>

          {/* Chuông Thông Báo */}
          <div className="relative" ref={notifyRef}>
            <button onClick={() => setIsNotifyOpen(!isNotifyOpen)} className="p-2 text-[#e8e1da] hover:text-[#ffe3ae] hover:scale-110 transition-all duration-300 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#E6C687] rounded-full ring-2 ring-[#060814]"></span>
            </button>

            {isNotifyOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-[#0F1326]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-1 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2.5 border-b border-white/5 bg-white/[0.02] rounded-t-xl flex items-center gap-1.5">
                  <span className="text-[#e6c687] text-xs">🌙</span>
                  <p className="text-[9px] font-black text-[#d0c5b5] uppercase tracking-[0.25em]">hb.tungg nhắn nhủ</p>
                </div>
                <div className="p-4 text-[11px] font-medium text-[#d0c5b5]">
                  {session && (session.user?.email === 'thuuyen009900@gmail.com' || session.user?.email === 'hb.tungg@gmail.com') ? (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Heart className="w-3.5 h-3.5 text-red-400 fill-current shrink-0 mt-0.5 animate-pulse" />
                        <p className="text-xs font-bold text-[#ffe3ae] drop-shadow-[0_0_8px_rgba(230,227,174,0.3)]">vk ơi anh iu vk nhấttt</p>
                      </div>
                    </div>
                  ) : <p>Chúc bạn xem phim vui vẻ! 🎬</p>}
                </div>
              </div>
            )}
          </div>

          {/* Profile User Dropdown */}
          {status !== "loading" && session ? (
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setShowDropdown(!showDropdown)} className="p-0.5 text-[#e8e1da] hover:ring-2 ring-[#E6C687]/40 rounded-full transition-all duration-300 border border-white/5 flex items-center justify-center bg-[#181D38]/60 focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-[#E6C687]/10 flex items-center justify-center overflow-hidden border border-[#E6C687]/20">
                  <span className="text-xs font-bold text-[#E6C687] uppercase font-sans">
                    {session.user?.name?.charAt(0) || "U"}
                  </span>
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-3 w-52 bg-[#0F1326]/90 backdrop-blur-2xl border border-white/10 rounded-xl p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <p className="text-xs font-semibold text-white truncate">{session.user?.name}</p>
                    <p className="text-[9px] text-[#d0c5b5]/50 font-mono mt-0.5 uppercase tracking-widest flex items-center gap-1 font-bold">
                      <ShieldCheck className="w-3 h-3 text-[#E6C687]" /> TRẠM: {session.user?.email === 'hb.tungg@gmail.com' ? 'Owner' : 'VIP'}
                    </p>
                  </div>
                  {session.user?.email === 'hb.tungg@gmail.com' && (
                    <button onClick={() => { setShowDropdown(false); router.push('/admin'); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs text-[#E6C687] hover:bg-white/5 rounded-lg transition-colors cursor-pointer focus:outline-none">Đại Quan Sát Admin</button>
                  )}
                  <button onClick={() => signOut({ callbackUrl: '/home' })} className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer focus:outline-none">Đăng Xuất Tinh Hệ</button>
                </div>
              )}
            </div>
          ) : status !== "loading" && (
            <button onClick={() => router.push('/login')} className="px-5 py-1.5 bg-[#E6C687]/10 hover:bg-[#E6C687] text-[#E6C687] hover:text-[#402d00] font-bold text-xs rounded-full border border-[#E6C687]/30 transition-all cursor-pointer focus:outline-none">Đăng Nhập</button>
          )}

        </div>
      </div>
    </header>
  );
}