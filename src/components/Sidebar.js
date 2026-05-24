// src/components/Sidebar.js
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_MAIN = [
  { label: 'Trang chủ',   href: '/home',          icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"/></svg> },
  { label: 'Khám phá',    href: '/danh-sach',       icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg> },
  { label: 'Phim lẻ',     href: '/phim-le',        icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/></svg> },
  { label: 'Series',       href: '/series',         icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> },
  { label: 'Thể loại',    href: '/the-loai',       icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg> },
  { label: 'Yêu thích',   href: '/favorites',      icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg> },
  { label: 'Lịch sử xem', href: '/history',        icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
];

const NAV_MY_LIST = [
  { label: 'Danh sách chờ', href: '/danh-sach-cho', icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg> },
  { label: 'Đã xem',         href: '/history',         icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> },
];

const NAV_SETTINGS = [
  { label: 'Tài khoản', href: '/tai-khoan', icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { label: 'Cài đặt',   href: '/cai-dat',   icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg> },
  { label: 'Đăng xuất', href: '/logout',    icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg> },
];

// Prop `collapsed` truyền từ HomePageClient — Sidebar không tự quản lý state của mình
export default function Sidebar({ collapsed }) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        hidden md:flex flex-col flex-shrink-0
        bg-[#0c0c0f] border-r border-white/[0.04]
        transition-all duration-300 ease-in-out overflow-hidden
        ${collapsed ? 'w-0 border-r-0' : 'w-[180px] xl:w-[195px]'}
      `}
    >
      {/* Nội dung sidebar — min-w cố định để không bị squish khi collapse */}
      <div className="w-[180px] xl:w-[195px] flex flex-col h-full overflow-y-auto">

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-5">

          {/* Main nav */}
          <div className="space-y-0.5">
            {NAV_MAIN.map(({ label, href, icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  className={`flex items-center gap-3 px-3 py-[9px] rounded-xl text-[11px] font-bold tracking-wide transition-all duration-150 group ${
                    active
                      ? 'bg-red-600/10 text-red-400 border border-red-600/15'
                      : 'text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200'
                  }`}
                >
                  <span className={`flex-shrink-0 transition-colors ${active ? 'text-red-500' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                    {icon}
                  </span>
                  {label}
                </Link>
              );
            })}
          </div>

          {/* My list */}
          <div className="space-y-0.5">
            <p className="px-3 mb-1.5 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 select-none">
              Danh sách
            </p>
            {NAV_MY_LIST.map(({ label, href, icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  className={`flex items-center gap-3 px-3 py-[9px] rounded-xl text-[11px] font-bold tracking-wide transition-all duration-150 group ${
                    active ? 'bg-red-600/10 text-red-400 border border-red-600/15' : 'text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200'
                  }`}
                >
                  <span className={`flex-shrink-0 transition-colors ${active ? 'text-red-500' : 'text-zinc-600 group-hover:text-zinc-400'}`}>{icon}</span>
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Settings */}
          <div className="space-y-0.5">
            <p className="px-3 mb-1.5 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 select-none">
              Cài đặt
            </p>
            {NAV_SETTINGS.map(({ label, href, icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  className={`flex items-center gap-3 px-3 py-[9px] rounded-xl text-[11px] font-bold tracking-wide transition-all duration-150 group ${
                    active ? 'bg-red-600/10 text-red-400 border border-red-600/15' : 'text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200'
                  }`}
                >
                  <span className={`flex-shrink-0 transition-colors ${active ? 'text-red-500' : 'text-zinc-600 group-hover:text-zinc-400'}`}>{icon}</span>
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Premium card — pinned bottom */}
        <div className="mx-3 mb-4 flex-shrink-0">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-red-950/50 to-[#0c0c0f] border border-red-900/25">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-red-500 text-[13px] leading-none select-none">♛</span>
              <span className="text-[9px] font-black text-red-400 uppercase tracking-wider">ForUyn Premium</span>
            </div>
            <p className="text-[9px] text-zinc-600 leading-relaxed mb-3">
              Trải nghiệm không giới hạn. Không quảng cáo, chất lượng 4K, xem mọi lúc mọi nơi.
            </p>
            <Link href="/premium"
              className="block w-full text-center py-2 rounded-xl bg-red-600 hover:bg-red-500 text-[10px] font-black text-white uppercase tracking-wider transition-colors duration-200"
            >
              Nâng cấp ngay
            </Link>
          </div>
        </div>

      </div>
    </aside>
  );
}