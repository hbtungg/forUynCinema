'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, Heart, User } from 'lucide-react'; // 🚀 ĐÃ THÊM: Icon User cho chế độ ẩn danh sang chảnh
import SecretChat from './SecretChat';
import SearchBox from './SearchBox';
import UserMenu from './UserMenu';

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [menu, setMenu] = useState(null);
  const showDropdown = menu?.path === pathname && menu.name === 'account';
  const isNotifyOpen = menu?.path === pathname && menu.name === 'notifications';
  const closeMenu = () => setMenu(null);

  const userMenuRef = useRef(null);
  const notifyRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!userMenuRef.current?.contains(e.target) && !notifyRef.current?.contains(e.target)) setMenu(null);
    };
    const onKeyDown = event => {
      if (event.key !== 'Escape') return;
      const active = [userMenuRef.current, notifyRef.current].find(node => node?.contains(document.activeElement));
      active?.querySelector('button')?.focus();
      setMenu(null);
    };
    document.addEventListener('pointerdown', handler);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handler);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <header className="app-header fixed z-50 flex items-center" style={{ fontFamily: "var(--font-main)" }}>
      <div className="flex w-full min-w-0 items-center justify-between gap-3">

        <div className="flex min-w-0 items-center gap-6 xl:gap-10">
          <Link href="/home" aria-label="Uynflix — Trang chủ"
            className="inline-flex min-h-11 shrink-0 items-center text-lg font-bold tracking-[.18em] sm:text-xl">
            UYNFLIX
          </Link>
          <div className="hidden lg:flex min-w-0 items-center gap-1 sm:gap-2 text-xs font-bold tracking-wider uppercase">
            <Link href="/home" className={`transition-colors duration-300 ${pathname === '/home' ? 'text-[#e8e8e8]' : 'text-[#c5c5c5] hover:text-white'}`}>Movies</Link>
            <Link href="/danh-sach" className={`transition-colors duration-300 ${pathname === '/danh-sach' ? 'text-[#e8e8e8]' : 'text-[#808080] hover:text-[#e8e8e8]'}`}>Discover</Link>
            <Link href="/history" className={`transition-colors duration-300 ${pathname === '/history' ? 'text-[#e8e8e8]' : 'text-[#808080] hover:text-[#e8e8e8]'}`}>History</Link>
          </div>
        </div>

        {/* KHỐI PHẢI: SEARCHBOX & ACCOUNT */}
        <div className="flex items-center gap-4">

          <div className="hidden md:block">
            <SearchBox />
          </div>

          <div className="hidden sm:flex items-center gap-1">
            <SecretChat />
          </div>

          {/* Chuông Thông Báo */}
          <div className="relative" ref={notifyRef}>
            <button aria-label="Thông báo" aria-expanded={isNotifyOpen} onClick={() => isNotifyOpen ? closeMenu() : setMenu({ path: pathname, name: 'notifications' })} className="grid size-11 place-items-center text-[#ffffff] hover:text-[#ffffff] hover:scale-110 transition-all duration-300 relative focus:outline-none cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#e8e8e8] rounded-full ring-2 ring-[#050505]"></span>
            </button>

            {isNotifyOpen && (
              <div className="absolute right-0 mt-2 w-52 sm:w-64 clear-glass glass-popover rounded-2xl p-1 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2.5 border-b border-white/5 bg-white/[0.02] rounded-t-xl flex items-center gap-1.5">
                  <span className="text-[#e8e8e8] text-xs">🌙</span>
                  <p className="text-[9px] font-bold text-[#808080] uppercase tracking-[0.25em]">Anh Tùng có đôi lời</p>
                </div>
                <div className="p-4 text-[11px] font-medium text-[#b8b8b8]">
                  {session && (session.user?.email === 'thuuyen009900@gmail.com' || session.user?.email === 'hb.tungg@gmail.com') ? (
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Heart className="w-3.5 h-3.5 text-neutral-300 fill-current shrink-0 mt-0.5 animate-pulse" />
                        <p className="text-xs font-bold text-[#ffffff]" style={{ textShadow: 'none' }}>vk ơi anh iu vk nhấttt</p>
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
              <button aria-label="Tài khoản" aria-expanded={showDropdown} onClick={() => showDropdown ? closeMenu() : setMenu({ path: pathname, name: 'account' })} className="size-11 text-[#ffffff] hover:ring-2 ring-[#e8e8e8]/40 rounded-full transition-all duration-300 border border-white/5 flex items-center justify-center bg-white/[0.04] focus:outline-none cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-[#e8e8e8]/10 flex items-center justify-center overflow-hidden border border-[#e8e8e8]/20">
                  <span className="text-xs font-bold text-[#e8e8e8] uppercase font-mono">
                    {session.user?.name?.charAt(0) || "U"}
                  </span>
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 clear-glass glass-popover rounded-2xl p-4  z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <UserMenu isMobile={false} />
                </div>
              )}
            </div>
          ) : status !== "loading" && (
            /* 🚀 FIX CHÍ MẠNG: Nút Đăng nhập dạng Avatar Pha Lê Ẩn Danh - Siêu gọn trên Mobile, Đẳng cấp trên Desktop */
            <button
              aria-label="Đăng nhập"
              onClick={() => router.push('/login')}
              className="group/login min-h-11 min-w-11 justify-center p-1 flex items-center gap-2 rounded-full glass-trim hover:bg-white/10 text-[#e8e8e8] hover:text-white transition-all duration-300 focus:outline-none cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#e8e8e8]/10 group-hover/login:bg-white/10 flex items-center justify-center text-[#e8e8e8] group-hover/login:text-white transition-colors">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="hidden md:inline pr-3 text-[11px] font-semibold tracking-widest uppercase font-sans">
                Login
              </span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}