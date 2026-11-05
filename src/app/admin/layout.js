'use client';

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname(); // Lấy path hiện tại để làm hiệu ứng Active tab

  // Ép cập nhật tên Tab trình duyệt động cho phân khu hệ thống tầng Client
  useEffect(() => {
    document.title = "Hệ thống Quản trị | forUynCinema";
  }, []);

  // Kiểm tra bảo mật nghiêm ngặt ngay từ cửa ngõ vào phân khu Admin
  useEffect(() => {
    if (status !== "loading") {
      if (!session || session.user?.email !== 'hb.tungg@gmail.com') {
        router.push("/home"); // Trục xuất các tài khoản vãng lai
      }
    }
  }, [session, status, router]);

  if (status === "loading" || !session || session.user?.email !== 'hb.tungg@gmail.com') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-zinc-800 border-t-white rounded-full animate-spin" />
          <p className="text-[10px] font-semibold uppercase text-zinc-500 tracking-widest animate-pulse">UynCinema Security Checking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col lg:flex-row font-sans select-none overflow-hidden">
      
      {/* ── 🚀 SIDEBAR TRÊN PC: Đã sửa ĐỨNG IM CỐ ĐỊNH (h-screen sticky) & Ẩn trên Mobile ── */}
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 border-r border-zinc-900 bg-[#0c0c0e] flex-col p-5 space-y-6 flex-shrink-0 z-30 justify-between">
        
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2 py-1">
            <img src="/logo.png" alt="Logo" className="h-6 w-auto object-contain" />
            <span className="text-[9px] font-semibold bg-neutral-700/10 border border-neutral-600/20 text-neutral-300 px-1.5 py-0.5 rounded uppercase tracking-widest ml-1 ">
              Admin
            </span>
          </div>

          <nav className="flex flex-col gap-1.5">
            <p className="text-[9px] font-semibold text-zinc-600 uppercase tracking-widest px-2.5 pb-2">Vận hành</p>
            
            <AdminNavLink href="/admin" label="Bảng điều khiển" icon="📊" active={pathname === '/admin'} />
            <AdminNavLink href="/admin/movies" label="Kho phim" icon="🎬" active={pathname === '/admin/movies'} />
            <AdminNavLink href="/admin/users" label="Người dùng" icon="👥" active={pathname === '/admin/users'} />
            <AdminNavLink href="/admin/history" label="Giám sát rạp" icon="👁️" active={pathname === '/admin/history'} />
          </nav>
        </div>

        <div className="space-y-4">
          {/* PROFILE ADMIN THÂN THƯƠNG */}
          <div className="bg-white/[0.01] border border-white/[0.03] rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-700/10 border border-neutral-600/20 flex items-center justify-center font-bold text-neutral-300 text-xs">
              {session.user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{session.user?.name || "Sáng lập viên"}</p>
              <p className="text-[9px] font-medium text-zinc-500 truncate lowercase">{session.user?.email}</p>
            </div>
          </div>

          <footer className="pt-2 border-t border-zinc-900">
            <Link href="/home" className="flex items-center justify-center gap-2 px-3 py-2 text-[10px] font-semibold text-zinc-500 hover:text-white uppercase tracking-widest bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] rounded-xl transition-all active:scale-95">
              ← Rời khỏi rạp
            </Link>
          </footer>
        </div>
      </aside>

      {/* ── 🚀 NAVIGATION DOCK TRÊN MOBILE: Xuất hiện dưới đáy màn hình, gọn gàng, bấm mượt mà ── */}
      <div className="floating-navigation lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0c0c0e]/95 border-t border-zinc-900/60 backdrop-blur-xl flex items-center justify-around px-2 z-50 ">
        <MobileNavLink href="/admin" label="Tổng quan" icon="📊" active={pathname === '/admin'} />
        <MobileNavLink href="/admin/movies" label="Kho phim" icon="🎬" active={pathname === '/admin/movies'} />
        <MobileNavLink href="/admin/users" label="Thành viên" icon="👥" active={pathname === '/admin/users'} />
        <MobileNavLink href="/admin/history" label="Giám sát" icon="👁️" active={pathname === '/admin/history'} />
        <Link 
          href="/home" 
          className="flex flex-col items-center justify-center gap-1 text-zinc-500 active:scale-90 transition-all"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <span className="text-base">🚪</span>
          <span className="text-[8px] font-semibold uppercase tracking-wider">Thoát</span>
        </Link>
      </div>

      {/* ── NỘI DUNG CHỨA CÁC TRANG TÍNH NĂNG (Đã chừa khoảng trống cho Dock mobile) ── */}
      <main className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10 pb-[calc(96px+env(safe-area-inset-bottom))] lg:pb-10 bg-gradient-to-b from-[#0b0b0d] to-[#070709]">
        {children}
      </main>

    </div>
  );
}

// Linh kiện nút điều hướng chuẩn trên PC
function AdminNavLink({ href, label, icon, active }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-[12px] font-semibold border transition-all duration-300 relative group ${
        active 
          ? 'bg-neutral-700/10 border-neutral-600/20 text-neutral-300 font-bold ' 
          : 'text-zinc-400 hover:text-white hover:bg-white/[0.02] border-transparent hover:border-white/[0.01]'
      }`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <span className="text-sm opacity-80 group-hover:scale-110 transition-transform">{icon}</span>
      <span className="tracking-wide">{label}</span>
      {active && (
        <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-neutral-700 " />
      )}
    </Link>
  );
}

// Linh kiện nút điều hướng tối giản kịch trần trên Mobile
function MobileNavLink({ href, label, icon, active }) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center justify-center gap-1 min-w-[60px] h-full transition-all duration-300 active:scale-90 relative ${
        active ? 'text-neutral-300 font-semibold' : 'text-zinc-500 hover:text-zinc-400'
      }`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <span className="text-base">{icon}</span>
      <span className="text-[8px] uppercase tracking-wider font-bold">{label}</span>
      {active && (
        <span className="absolute top-1.5 w-1 h-1 rounded-full bg-neutral-700 " />
      )}
    </Link>
  );
}
