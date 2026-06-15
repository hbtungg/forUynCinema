'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex font-sans select-none">
      
      {/* ── SIDEBAR ĐIỀU HƯỚNG ADMIN ── */}
      <aside className="w-64 border-r border-zinc-800/60 bg-[#0c0c0e] flex flex-col p-5 space-y-6 flex-shrink-0">
        <div className="flex items-center gap-2 px-2 py-1">
          <img src="/logo.png" alt="Logo" className="h-6 w-auto object-contain" />
          <span className="text-[9px] font-black bg-red-600/10 border border-red-600/20 text-red-500 px-1.5 py-0.5 rounded uppercase tracking-widest ml-2">
            Admin
          </span>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-2.5 pb-2">Vận hành</p>
          
          <AdminNavLink href="/admin" label="Bảng điều khiển" icon="📊" />
          <AdminNavLink href="/admin/movies" label="Kho phim" icon="🎬" />
          <AdminNavLink href="/admin/users" label="Người dùng" icon="👥" />
          <AdminNavLink href="/admin/history" label="Giám sát rạp" icon="👁️" />
        </nav>

        <footer className="pt-4 border-t border-zinc-800/40">
          <Link href="/home" className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-wider transition-colors">
            ← Rời khỏi rạp
          </Link>
        </footer>
      </aside>

      {/* ── NỘI DUNG CHỨA CÁC TRANG TÍNH NĂNG ── */}
      <main className="flex-1 overflow-y-auto p-10 bg-gradient-to-b from-[#0e0e11] to-[#09090b]">
        {children}
      </main>

    </div>
  );
}

function AdminNavLink({ href, label, icon }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-semibold text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent hover:border-white/[0.02] transition-all"
    >
      <span className="text-sm opacity-80">{icon}</span>
      <span className="tracking-wide">{label}</span>
    </Link>
  );
}