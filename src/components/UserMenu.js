'use client';
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function UserMenu() {
  const { data: session, status } = useSession();

  // Đang kiểm tra trạng thái (Loading)
  if (status === "loading") {
    return (
      <div className="flex items-center gap-4 animate-pulse">
        <div className="w-12 h-12 bg-zinc-900 rounded-full"></div>
        <div className="space-y-2">
          <div className="w-24 h-3 bg-zinc-900 rounded-full"></div>
          <div className="w-16 h-2 bg-zinc-900 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Nếu đã đăng nhập thành công
  if (session) {
    return (
      <div className="flex flex-col gap-4">
        {/* PHẦN INFO USER */}
        <div className="flex items-center gap-4 px-1">
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-xl font-black text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] border-2 border-red-500/30 flex-shrink-0 transition-transform hover:scale-105 cursor-default">
            {session.user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-black text-white uppercase tracking-tighter leading-tight truncate">
              {session.user.name} <span className="text-xs">❤️</span>
            </span>
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mt-1 italic">
              Member VIP
            </span>
          </div>
        </div>

        {/* VẠCH CHIA TINH TẾ 1 */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>

        {/* --- PHẦN TIỆN ÍCH CÁ NHÂN MỚI THÊM --- */}
        <nav className="flex flex-col gap-1">
          <Link 
            href="/history" 
            className="flex items-center gap-3 px-3 py-3 text-zinc-500 hover:text-white hover:bg-zinc-900/50 rounded-xl transition-all group"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-zinc-900 rounded-lg group-hover:bg-red-600/10 group-hover:text-red-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Phim đang xem</span>
          </Link>

          <Link 
            href="/favorites" 
            className="flex items-center gap-3 px-3 py-3 text-zinc-500 hover:text-white hover:bg-zinc-900/50 rounded-xl transition-all group"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-zinc-900 rounded-lg group-hover:bg-red-600/10 group-hover:text-red-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78v0z" />
              </svg>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Phim yêu thích</span>
          </Link>
        </nav>

        {/* VẠCH CHIA TINH TẾ 2 */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>

        {/* NÚT ĐĂNG XUẤT */}
        <button 
          onClick={() => signOut()}
          className="w-full py-3.5 bg-zinc-900/50 hover:bg-red-600/10 border border-zinc-800 hover:border-red-600/40 rounded-2xl text-zinc-500 hover:text-red-500 text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Đăng xuất
        </button>
      </div>
    );
  }

  // Nếu chưa đăng nhập
  return (
    <div className="flex flex-col gap-3">
      <Link 
        href="/login" 
        className="w-full py-3 text-center text-[10px] font-black uppercase text-zinc-500 hover:text-white border border-transparent hover:border-zinc-800 rounded-2xl transition-all tracking-[0.3em]"
      >
        Đăng nhập
      </Link>

      <Link 
        href="/register" 
        className="group w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white py-3.5 rounded-2xl transition-all active:scale-95 shadow-[0_10px_30px_rgba(220,38,38,0.3)]"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Đăng ký</span>
        <span className="text-[10px] group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </div>
  );
}