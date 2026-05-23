'use client';

import UserMenu from '../UserMenu';

export default function RightControls({ 
  isSearchOpen, 
  setIsSearchOpen, 
  isUserMenuOpen, 
  setIsUserMenuOpen, 
  userMenuRef 
}) {
  return (
    <div className="flex items-center gap-1.5 ml-auto flex-shrink-0 z-40">

      {/* ── 1. NÚT KÍNH LÚP TÌM KIẾM MOBILE ── */}
      {/* Tự động giấu mình đi bằng w-0 khi đang mở để nhường 100% đất cho SearchBox */}
      <button
        onClick={() => setIsSearchOpen((v) => !v)}
        className={`md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all
          ${isSearchOpen ? 'opacity-0 scale-75 pointer-events-none w-0' : 'opacity-100 scale-100'}
        `}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* ── 2. NÚT DẤU X TẮT TÌM KIẾM ĐỘC QUYỀN MOBILE (CHỐNG ĐÈ NÚT) ── */}
      {isSearchOpen && (
        <button
          onClick={() => setIsSearchOpen(false)}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl text-zinc-500 hover:text-red-500 active:scale-75 transition-all ml-1"
          aria-label="Close search"
        >
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* ── 3. QUẢ CHUÔNG THÔNG BÁO ── */}
      <button className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all relative">
        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-600 rounded-full" />
      </button>

      {/* ── 4. LỊCH SỬ XEM NHANH (ẨN TRÊN MOBILE) ── */}
      <button className="w-9 h-9 hidden sm:flex items-center justify-center rounded-xl text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all">
        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* ── 5. KHỐI PROFILE USER ĐĂNG NHẬP PC ── */}
      <div className="relative hidden md:block" ref={userMenuRef}>
        <button
          onClick={() => setIsUserMenuOpen((v) => !v)}
          className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.05] transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-[11px] font-black text-white flex-shrink-0">
            H
          </div>
          <span className="text-[11px] font-black text-white hidden lg:block">HB.TUNGG</span>
          <span className="text-[7px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wide hidden lg:block">Premium</span>
          <svg width="11" height="11" className={`text-zinc-600 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu Popup PC */}
        {isUserMenuOpen && (
          <div className="absolute top-[calc(100%+6px)] right-0 w-64 bg-[#111114] border border-white/[0.07] rounded-2xl p-4 z-50 shadow-2xl">
            <UserMenu />
          </div>
        )}
      </div>

    </div>
  );
}