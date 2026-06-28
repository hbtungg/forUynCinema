// src/components/Sidebar.js
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const { data: session } = useSession();

  const navItems = [
    { href: '/home',       label: 'Trang Chủ', icon: Moon,        desc: 'New Moon' },
    { href: '/danh-sach',  label: 'Thể Loại',  icon: Compass,     desc: 'Crescent Moon' },
    { href: '/search',     label: 'Tìm Kiếm',  icon: Search,      desc: 'Half Moon' },
    { href: '/history',    label: 'Cá Nhân',   icon: User,        desc: 'Full Moon' },
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
          fixed top-[72px] left-0 bottom-0 z-40 flex flex-col items-center py-6 flex-shrink-0
          bg-[#0F1326]/60 backdrop-blur-2xl border-r border-[#4d463a]/10 shadow-2xl
          transition-all duration-300 ease-in-out overflow-hidden hidden md:flex
          ${collapsed ? 'w-16 px-0' : 'w-64 px-4'}
        `}
        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
        /* 🚀 FIX CHÍ MẠNG: top-[72px] giúp hạ cánh Sidebar nằm dưới gầm Header vĩnh viễn, w-16 thu nhỏ tinh tế */
      >
        {/* NÚT ĐÓNG/MỞ SIDEBAR HAMBURGER TRÊN ĐỈNH */}
        <div className={`mb-8 flex w-full items-center ${collapsed ? 'justify-center' : 'justify-between px-2'}`}>
          {!collapsed && (
            <span className="text-xs font-bold tracking-[0.2em] text-[#d0c5b5]/50 uppercase animate-in fade-in duration-300">
              Navigation
            </span>
          )}
          <button
            onClick={() => onToggleSidebar?.()}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-[#ffe3ae]/5 border border-[#ffe3ae]/10 shadow-[0_0_15px_rgba(255,227,174,0.1)] text-[#ffe3ae] hover:bg-[#ffe3ae]/10 transition-all duration-300 cursor-pointer focus:outline-none"
            title={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
          >
            <Menu className={`w-5 h-5 transition-transform duration-500 ${!collapsed ? 'rotate-180' : 'rotate-0'}`} />
          </button>
        </div>

        {/* CỤM MENU ĐIỀU HƯỚNG CHÍNH (Icon to chuẩn w-[22px] kịch trần khi đóng) */}
        <nav className="w-full flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const IconComponent = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center h-12 rounded-xl transition-all duration-300 border border-transparent
                  ${collapsed ? 'w-12 h-12 justify-center mx-auto' : 'w-full px-4 gap-4'}
                  ${active
                    ? 'text-[#ffe3ae] bg-[#ffe3ae]/10 shadow-[0_0_15px_rgba(255,227,174,0.15)] border border-[#ffe3ae]/20 font-bold'
                    : 'text-[#d0c5b5] hover:bg-[#2f3f91]/20 hover:text-[#bac3ff] hover:shadow-[0_0_15px_rgba(186,195,255,0.2)]'
                  }`}
                title={collapsed ? item.label : undefined}
              >
                <IconComponent className={`transition-transform duration-300 group-hover:scale-110 ${collapsed ? 'w-[22px] h-[22px]' : 'w-5 h-5'}`} />
                {!collapsed && <span className="text-sm tracking-wide font-medium">{item.label}</span>}
                
                {collapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-[#2d2a25] text-[#e8e1da] text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-xl border border-[#4d463a]/30">
                    {item.label} <span className="text-[10px] text-[#ffe3ae]/40 ml-1">({item.desc})</span>
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
                  ? 'text-[#ffe3ae] bg-[#ffe3ae]/10 border border-[#ffe3ae]/20 font-bold'
                  : 'text-[#d0c5b5] hover:bg-[#2f3f91]/20 hover:text-[#bac3ff]'
                }`}
            >
              <ShieldAlert className={`transition-transform duration-300 group-hover:scale-110 ${collapsed ? 'w-[22px] h-[22px]' : 'w-5 h-5'}`} />
              {!collapsed && <span className="text-sm tracking-wide font-medium">Hệ Thống</span>}
            </Link>
          )}
        </nav>

        {/* KHỐI TIỆN ÍCH DƯỚI CÙNG (Ngay ngắn tuyệt đối) */}
        <div className="w-full mt-auto flex flex-col gap-2 border-t border-[#4d463a]/10 pt-4">
          <Link 
            href="/help" 
            className={`group relative flex items-center h-12 rounded-xl text-[#d0c5b5] hover:bg-[#2f3f91]/10 hover:text-[#bac3ff] transition-all duration-300 ${
              collapsed ? 'w-12 h-12 justify-center mx-auto' : 'w-full px-4 gap-4'
            } ${pathname === '/help' ? 'text-[#ffe3ae] bg-[#ffe3ae]/10 font-bold' : ''}`}
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
              ${isLoggedIn ? 'text-[#d0c5b5] hover:bg-[#93000a]/20 hover:text-[#ffb4ab]' : 'text-[#ffe3ae] hover:bg-[#ffe3ae]/10'}`}
          >
            {isLoggedIn ? <LogOut className={`${collapsed ? 'w-[22px] h-[22px]' : 'w-5 h-5'}`} /> : <LogIn className={`${collapsed ? 'w-[22px] h-[22px]' : 'w-5 h-5'}`} />}
            {!collapsed && <span className="text-sm tracking-wide font-medium">{isLoggedIn ? "Đăng Xuất" : "Đăng Nhập"}</span>}
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* VỊ TRÍ 2: THANH BOTTOM NAVIGATION BAR DÀNH RIÊNG MOBILE (CHỈ HIỂN THỊ ICON) */}
      {/* ========================================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0F1326]/85 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-2 md:hidden z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const IconComponent = item.icon;

          return (
            <Link
              key={`mobile-${item.href}`}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 active:scale-90
                ${active ? 'text-[#E6C687] drop-shadow-[0_0_12px_rgba(230,198,135,0.4)]' : 'text-[#94A3B8]/70'}`}
            >
              <IconComponent className={`w-[22px] h-[22px] transition-transform duration-300 ${active ? 'scale-110 fill-current' : 'scale-100'}`} />
            </Link>
          );
        })}

        <button
          onClick={() => {
            if (isLoggedIn) signOut({ callbackUrl: '/home' });
            else router.push('/login');
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 active:scale-90 focus:outline-none ${isLoggedIn ? 'text-red-400/80' : 'text-[#E6C687]/60'}`}
        >
          {isLoggedIn ? <LogOut className="w-[22px] h-[22px]" /> : <LogIn className="w-[22px] h-[22px]" />}
        </button>
      </nav>
    </>
  );
}