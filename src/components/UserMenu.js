'use client';
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function UserMenu() {
  const { data: session, status } = useSession();

  // Đang kiểm tra trạng thái (Loading) - Làm Skeleton cho sang
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
      <div className="flex flex-col gap-5">
        {/* PHẦN INFO: Bỏ cái khung bọc ngoài, để nó hòa quyện với Popup */}
        <div className="flex items-center gap-4 px-1">
          {/* Avatar to hơn, đỏ rực hơn */}
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-xl font-black text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] border-2 border-red-500/30 flex-shrink-0 transition-transform hover:scale-105">
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

        {/* VẠCH CHIA TINH TẾ */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>

        {/* NÚT ĐĂNG XUẤT: Thiết kế lại thành một cái nút bấm thực thụ */}
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

  // Nếu chưa đăng nhập - Giữ nguyên logic cũ nhưng tút lại padding cho cân
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