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
        <div className="w-6 h-6 border-2 border-zinc-800 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col lg:flex-row font-sans select-none overflow-hidden">
      
      {/* ── 🚀 SIDEBAR TRÊN PC: Đã sửa ĐỨNG IM CỐ ĐỊNH (h-screen sticky) & Ẩn trên Mobile ── */}
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 border-r border-zinc-800/60 bg-[#0c0c0e] flex-col p-5 space-y-6 flex-shrink-0 z-30">
        <div className="flex items-center gap-2 px-2 py-1">
          <img src="/logo.png" alt="Logo" className="h-6 w-auto object-contain" />
          <span className="text-[9px] font-black bg-red-600/10 border border-red-600/20 text-red-500 px-1.5 py-0.5 rounded uppercase tracking-widest ml-2">
            Admin
          </span>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-2.5 pb-2">Vận hành</p>
          
          <AdminNavLink href="/admin" label="Bảng điều khiển" icon="📊" active={pathname === '/admin'} />
          <AdminNavLink href="/admin/movies" label="Kho phim" icon="🎬" active={pathname === '/admin/movies'} />
          <AdminNavLink href="/admin/users" label="Người dùng" icon="👥" active={pathname === '/admin/users'} />
          <AdminNavLink href="/admin/history" label="Giám sát rạp" icon="👁️" active={pathname === '/admin/history'} />
        </nav>

        <footer className="pt-4 border-t border-zinc-800/40">
          <Link href="/home" className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-wider transition-colors">
            ← Rời khỏi rạp
          </Link>
        </footer>
      </aside>

      {/* ── 🚀 NAVIGATION DOCK TRÊN MOBILE: Xuất hiện dưới đáy màn hình, gọn gàng, bấm mượt mà ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0c0c0e]/95 border-t border-zinc-800/60 backdrop-blur-xl flex items-center justify-around px-2 z-50 shadow-[0_-10px_35px_rgba(0,0,0,0.8)]">
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
          <span className="text-[8px] font-black uppercase tracking-wider">Thoát</span>
        </Link>
      </div>

      {/* ── NỘI DUNG CHỨA CÁC TRANG TÍNH NĂNG (Đã chừa khoảng trống cho Dock mobile) ── */}
      <main className="flex-1 overflow-y-auto p-5 sm:p-10 pb-24 sm:pb-10 bg-gradient-to-b from-[#0e0e11] to-[#09090b]">
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
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-semibold border transition-all duration-300 ${
        active 
          ? 'bg-red-600/10 border-red-600/20 text-red-500 font-bold shadow-[0_4px_15px_rgba(220,38,38,0.05)]' 
          : 'text-zinc-400 hover:text-white hover:bg-white/[0.03] border-transparent hover:border-white/[0.02]'
      }`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <span className="text-sm opacity-80">{icon}</span>
      <span className="tracking-wide">{label}</span>
    </Link>
  );
}

// Linh kiện nút điều hướng tối giản kịch trần trên Mobile
function MobileNavLink({ href, label, icon, active }) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center justify-center gap-1 min-w-[60px] h-full transition-all duration-300 active:scale-90 ${
        active ? 'text-red-500 font-black' : 'text-zinc-500'
      }`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <span className="text-base">{icon}</span>
      <span className="text-[8px] uppercase tracking-wider font-bold">{label}</span>
    </Link>
  );
}