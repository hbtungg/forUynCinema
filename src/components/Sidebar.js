// src/components/Sidebar.js
'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Menu,
  Moon,        // New Moon -> Trang Chủ
  Compass,     // Crescent Moon -> Thể Loại
  Search,      // Half Moon -> Tìm Kiếm
  User,        // Full Moon -> Cá Nhân
  ShieldAlert, // Settings -> Hệ Thống Admin
  HelpCircle,  // Help
  LogOut,      // Logout
  LogIn        // Login
} from 'lucide-react';

export default function Sidebar({ collapsed, onToggleSidebar }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const navItems = [
    { href: '/home',       label: 'Trang Chủ', icon: Moon,        desc: 'New Moon' },
    { href: '/danh-sach',  label: 'Thể Loại',  icon: Compass,     desc: 'Crescent Moon' },
    { href: '/search',     label: 'Tìm Kiếm',  icon: Search,      desc: 'Half Moon' },
    { href: '/account',    label: 'Cá Nhân',   icon: User,        desc: 'Full Moon' },
  ];

  const isLoggedIn = !!session;
  const isAdmin = session?.user?.email === 'hb.tungg@gmail.com';

  return (
    <>
      {/* ========================================================================= */}
      {/* VỊ TRÍ 1: SIDEBAR PHIÊN BẢN DESKTOP (NẰM DƯỚI GẦM HEADER KHÍT RỊT)       */}
      {/* ========================================================================= */}
      <aside
        className={`
          app-sidebar fixed left-0 bottom-0 z-40 flex flex-col items-center py-6 flex-shrink-0
          glass-surface border-r border-[#383838]/10 shadow-2xl
          transition-all duration-300 ease-in-out overflow-y-auto hidden md:flex
          ${collapsed ? 'w-16 px-0' : 'w-64 px-4'}
        `}
        style={{ fontFamily: "var(--font-main)" }}
        /* 🚀 FIX CHÍ MẠNG: top-[72px] giúp hạ cánh Sidebar nằm dưới gầm Header vĩnh viễn, w-16 thu nhỏ tinh tế */
      >
        {/* NÚT ĐÓNG/MỞ SIDEBAR HAMBURGER TRÊN ĐỈNH */}
        <div className={`mb-8 flex w-full items-center ${collapsed ? 'justify-center' : 'justify-between px-2'}`}>
          {!collapsed && (
            <span className="text-xs font-bold tracking-[0.2em] text-[#b8b8b8] uppercase animate-in fade-in duration-300">
              Navigation
            </span>
          )}
          <button
            onClick={() => onToggleSidebar?.()}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-[#ffffff]/5 border border-[#ffffff]/10  text-[#ffffff] hover:bg-[#ffffff]/10 transition-all duration-300 cursor-pointer focus:outline-none"
            title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
          >
            <Menu className={`w-5 h-5 transition-transform duration-300 ${!collapsed ? 'rotate-180' : 'rotate-0'}`} />
          </button>
        </div>

        {/* CỤM MENU ĐIỀU HƯỚNG CHÍNH (Icon to chuẩn w-[22px] kịch trần khi đóng) */}
        <nav aria-label="Điều hướng chính" className="w-full flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const IconComponent = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
                className={`group relative flex items-center h-12 rounded-xl transition-all duration-300 border border-transparent
                  ${collapsed ? 'w-12 h-12 justify-center mx-auto' : 'w-full px-4 gap-4'}
                  ${active
                    ? 'text-[#ffffff] bg-[#ffffff]/10  border border-[#ffffff]/20 font-bold'
                    : 'text-[#b8b8b8] hover:bg-[#262626]/20 hover:text-[#e8e8e8] '
                  }`}
                title={collapsed ? item.label : undefined}
              >
                <IconComponent className={`transition-transform duration-300 group-hover:scale-110 ${collapsed ? 'w-[22px] h-[22px]' : 'w-5 h-5'}`} />
                {!collapsed && <span className="text-sm tracking-wide font-medium">{item.label}</span>}
                
                {collapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#262626] text-[#ffffff] text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-xl border border-[#383838]/30">
                    {item.label} <span className="text-[10px] text-[#ffffff]/40 ml-1">({item.desc})</span>
                  </div>
                )}
              </Link>
            );
          })}

          {/* Menu Admin Hệ Thống */}
          {isAdmin && (
            <Link
              href="/admin"
              className={`group relative flex items-center h-12 rounded-xl transition-all duration-300 border border-transparent
                ${collapsed ? 'w-12 h-12 justify-center mx-auto' : 'w-full px-4 gap-4'}
                ${pathname === '/admin'
                  ? 'text-[#ffffff] bg-[#ffffff]/10 border border-[#ffffff]/20 font-bold'
                  : 'text-[#b8b8b8] hover:bg-[#262626]/20 hover:text-[#e8e8e8]'
                }`}
            >
              <ShieldAlert className={`transition-transform duration-300 group-hover:scale-110 ${collapsed ? 'w-[22px] h-[22px]' : 'w-5 h-5'}`} />
              {!collapsed && <span className="text-sm tracking-wide font-medium">Hệ Thống</span>}
            </Link>
          )}
        </nav>

        {/* KHỐI TIỆN ÍCH DƯỚI CÙNG (Ngay ngắn tuyệt đối) */}
        <div className="w-full mt-auto flex flex-col gap-2 border-t border-[#383838]/10 pt-4">
          <Link 
            href="/help" 
            className={`group relative flex items-center h-12 rounded-xl text-[#b8b8b8] hover:bg-[#262626]/10 hover:text-[#e8e8e8] transition-all duration-300 ${
              collapsed ? 'w-12 h-12 justify-center mx-auto' : 'w-full px-4 gap-4'
            } ${pathname === '/help' ? 'text-[#ffffff] bg-[#ffffff]/10 font-bold' : ''}`}
          >
            <HelpCircle className={`${collapsed ? 'w-[22px] h-[22px]' : 'w-5 h-5'}`} />
            {!collapsed && <span className="text-sm tracking-wide font-medium">Trợ Giúp</span>}
          </Link>

          <button 
            onClick={() => {
              if (isLoggedIn) signOut({ callbackUrl: '/home' });
              else router.push('/login');
            }} 
            className={`group relative flex items-center h-12 rounded-xl transition-all duration-300 cursor-pointer focus:outline-none
              ${collapsed ? 'w-12 h-12 justify-center mx-auto' : 'w-full px-4 gap-4'} 
              ${isLoggedIn ? 'text-[#b8b8b8] hover:bg-[#93000a]/20 hover:text-[#ffb4ab]' : 'text-[#ffffff] hover:bg-[#ffffff]/10'}`}
          >
            {isLoggedIn ? <LogOut className={`${collapsed ? 'w-[22px] h-[22px]' : 'w-5 h-5'}`} /> : <LogIn className={`${collapsed ? 'w-[22px] h-[22px]' : 'w-5 h-5'}`} />}
            {!collapsed && <span className="text-sm tracking-wide font-medium">{isLoggedIn ? "Đăng Xuất" : "Đăng Nhập"}</span>}
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* VỊ TRÍ 2: THANH BOTTOM NAVIGATION BAR DÀNH RIÊNG MOBILE (CHỈ HIỂN THỊ ICON) */}
      {/* ========================================================================= */}
      <nav aria-label="Điều hướng trên điện thoại" className="floating-navigation fixed bottom-0 left-0 right-0 h-16 glass-surface flex items-center justify-around gap-0.5 p-1 md:hidden z-50 ">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const IconComponent = item.icon;

          return (
            <Link
              key={`mobile-${item.href}`}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 self-stretch rounded-2xl
                ${active ? 'text-[#e8e8e8] ' : 'text-on-surface-variant'}`}
            >
              <IconComponent className="size-5" aria-hidden="true" />
              <span className="text-[10px] leading-tight">{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={() => {
            if (isLoggedIn) signOut({ callbackUrl: '/home' });
            else router.push('/login');
          }}
          aria-label={isLoggedIn ? "Đăng xuất" : "Đăng nhập"}
          className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 self-stretch rounded-2xl ${isLoggedIn ? 'text-neutral-300/80' : 'text-[#e8e8e8]/60'}`}
        >
          {isLoggedIn ? <LogOut className="size-5" /> : <LogIn className="size-5" />}
          <span className="text-[10px] leading-tight">{isLoggedIn ? 'Đăng xuất' : 'Đăng nhập'}</span>
        </button>
      </nav>
    </>
  );
}