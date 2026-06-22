'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import SearchBox from './SearchBox';
import UserMenu from './UserMenu';

import Hamburger from './header/Hamburger';
import HeaderLogo from './header/HeaderLogo';
import MobileDrawer from './header/MobileDrawer';
import SecretChat from './SecretChat';
import EventButton from './EventButton';

export default function Header({ onToggleSidebar, sidebarCollapsed }) {
  const { data: session, status } = useSession();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  const userMenuRef = useRef(null);
  const notifyRef = useRef(null);
  const searchRefPC = useRef(null);

  // 1. Tự động đóng Popup khi nhấn chuột ra ngoài rìa (ĐÃ SỬA: Chống sập ô tìm kiếm Mobile)
  useEffect(() => {
    const handler = (e) => {
      // Đóng user menu
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }

      // 🚀 SỬA TẠI ĐÂY: Chỉ kích hoạt bẫy đóng tìm kiếm khi đang ở màn hình PC (innerWidth >= 768)
      // Nếu ở màn hình Mobile, mình có nút "Hủy" riêng rồi, không cho click ra ngoài tự đóng nữa!
      if (window.innerWidth >= 768 && searchRefPC.current && !searchRefPC.current.contains(e.target)) {
        const input = searchRefPC.current.querySelector('input');
        if (!input || !input.value) {
          setIsSearchOpen(false);
        }
      }

      // Đóng quả chuông thông báo nếu click ra ngoài
      if (notifyRef.current && !notifyRef.current.contains(e.target)) {
        setIsNotifyOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Khóa scroll khi mở drawer
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleMenuClick = () => {
    if (window.innerWidth >= 768) {
      onToggleSidebar?.();
      return;
    }
    // Đóng search nếu đang mở trước khi mở drawer
    setIsSearchOpen(false);
    setIsMobileMenuOpen((v) => !v);
  };

  return (
    <>
      {/* FIX LỖII 1: Bỏ overflow-hidden trên mobile — dùng z-index thay thế
          overflow-hidden cắt mất notification dropdown trên mobile */}
      <header className="flex-shrink-0 h-14 md:h-16 border-b border-white/[0.04] bg-[#0c0c0f] w-full relative z-50">
        <div className="w-full h-full relative">

          {/* ── MOBILE SEARCH OVERLAY ── */}
          <div
            className={`absolute inset-0 md:hidden flex items-center w-full gap-3 px-4 bg-[#0c0c0f] transition-all duration-300 ease-in-out z-50
              ${isSearchOpen ? 'translate-y-0 opacity-100 visible' : 'translate-y-full opacity-0 invisible'}
            `}
          >
            <div className="flex-1">
              <SearchBox />
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-[11px] font-black uppercase tracking-wider text-zinc-400 hover:text-red-500 active:scale-95 px-2 h-9 flex items-center justify-center transition-all duration-200"
            >
              Hủy
            </button>
          </div>

          {/* ── HEADER CHÍNH ── */}
          <div className="w-full h-full flex items-center justify-between px-4 md:px-6 relative transition-all duration-300 ease-in-out">

            {/* CỤM TRÁI */}
            <div className="flex items-center gap-3">
              <Hamburger
                onClick={handleMenuClick}
                sidebarCollapsed={sidebarCollapsed}
                // FIX LỖI 2: Truyền isSearchOpen vào Hamburger
                // để nó biết ẩn đi khi search overlay đang mở trên mobile
                isMobileMenuOpen={isMobileMenuOpen}
                isSearchOpen={isSearchOpen}
              />
              <HeaderLogo isSearchOpen={isSearchOpen} />
            </div>

            {/* CỤM PHẢI */}
            <div className="flex items-center gap-1.5 ml-auto flex-shrink-0 relative z-20" ref={searchRefPC}>

              {/* Search PC */}
              <div
                className={`hidden md:block transition-all duration-300 ease-in-out mr-1
                  ${isSearchOpen
                    ? 'w-64 lg:w-80 opacity-100 translate-x-0'
                    : 'w-0 opacity-0 translate-x-4 pointer-events-none'
                  }
                `}
              >
                <SearchBox />
              </div>

              {/* Nút kính lúp */}
              <button
                onClick={() => {
                  setIsSearchOpen((v) => !v);
                  // Đóng drawer nếu đang mở
                  setIsMobileMenuOpen(false);
                }}
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 active:scale-90
                  ${isSearchOpen
                    ? 'text-red-500 bg-white/[0.05]'
                    : 'text-zinc-500 hover:text-white hover:bg-white/[0.05]'
                  }
                `}
                aria-label="Toggle search"
              >
                <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* 🔔 NOTIFICATION — FIX: dùng portal-style z-index thay overflow clip */}
              <EventButton />

              <div className="relative" ref={notifyRef}>
                <button
                  onClick={() => setIsNotifyOpen(v => !v)}
                  aria-label="Notifications"
                  className={`relative w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 ${isNotifyOpen
                      ? 'text-red-400 bg-red-500/10'
                      : 'text-zinc-500 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0a0a0c] animate-pulse" />
                </button>

                {/* Dropdown — z-[200] để luôn đè lên mọi thứ kể cả mobile */}
                {isNotifyOpen && (
                  <div className="absolute top-[calc(100%+8px)] right-0 w-64 bg-[#111115] border border-white/[0.06] rounded-2xl overflow-hidden z-[200] shadow-[0_8px_32px_rgba(0,0,0,0.5)] origin-top-right animate-in fade-in zoom-in-95 duration-200 ease-out">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                      <span className="text-red-400 text-sm">🔔</span>
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.25em]">
                        hb.tungg nhắn nhủ
                      </p>
                    </div>
                    <div className="px-4 py-3.5">
                      {!session ? (
                        <div className="flex flex-col gap-2">
                          <p className="text-[11px] font-medium text-zinc-400 leading-relaxed">
                            Tạo tài khoản đăng nhập nhanh lên 😤
                          </p>
                          <p className="text-[9px] text-zinc-600 tracking-wide">đừng để anh phải chờ lâu nha</p>
                        </div>
                      ) : session.user.email === 'thuuyen009900@gmail.com' || session.user.email === 'hb.tungg@gmail.com' ? (
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-start gap-2">
                            <span className="text-base leading-none mt-0.5">💕</span>
                            <p className="text-[12px] font-bold text-red-300 leading-relaxed">
                              vk ơi anh iu vk nhấttt
                            </p>
                          </div>
                          <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-white/[0.05]">
                            <span className="w-3 h-[1px] bg-zinc-700" />
                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">
                              from hb.tungg with love
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2">
                          <span className="text-base leading-none mt-0.5">🎬</span>
                          <p className="text-[11px] font-medium text-zinc-400 leading-relaxed">
                            Chúc bạn xem phim vui vẻ!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden sm:block">
                <SecretChat />
              </div>

              <button className="w-9 h-9 hidden sm:flex items-center justify-center rounded-xl text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all">
                <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              {/* User menu PC */}
              <div className="relative hidden md:block" ref={userMenuRef}>
                {status === "loading" ? (
                  <div className="w-28 h-9 bg-zinc-900/50 border border-white/[0.04] rounded-xl animate-pulse" />
                ) : session ? (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen((v) => !v)}
                      className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.05] transition-all"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-[11px] font-black text-white flex-shrink-0 uppercase">
                        {session.user.name?.charAt(0) || "U"}
                      </div>
                      <span className="text-[11px] font-black text-white hidden lg:block uppercase tracking-tight max-w-[100px] truncate">
                        {session.user.name}
                      </span>
                      <span className="text-[7px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wide hidden lg:block">
                        {session.user.email === 'hb.tungg@gmail.com' ? 'Premium' : 'VIP'}
                      </span>
                      <svg width="11" height="11" className={`text-zinc-600 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isUserMenuOpen && (
                      <div className="absolute top-[calc(100%+6px)] right-0 w-64 bg-[#111114] border border-white/[0.07] rounded-2xl p-4 z-[100] shadow-2xl origin-top-right animate-in fade-in zoom-in-95 duration-200 ease-out">
                        <UserMenu />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen((v) => !v)}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/[0.06] hover:border-white/[0.15] bg-white/[0.02] hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-all duration-200 active:scale-95"
                      aria-label="User menu"
                    >
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button>
                    {isUserMenuOpen && (
                      <div className="absolute top-[calc(100%+6px)] right-0 w-64 bg-[#111114] border border-white/[0.07] rounded-2xl p-4 z-[100] shadow-2xl origin-top-right animate-in fade-in zoom-in-95 duration-200 ease-out">
                        <UserMenu />
                      </div>
                    )}
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      </header>

      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
