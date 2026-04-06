'use client';
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function UserMenu() {
  const { data: session, status } = useSession();

  // Đang kiểm tra trạng thái (Loading)
  if (status === "loading") {
    return <div className="w-32 h-10 bg-zinc-900 animate-pulse rounded-xl"></div>;
  }

  // Nếu đã đăng nhập thành công
  if (session) {
    return (
      <div className="flex items-center gap-4 bg-zinc-900/50 p-1.5 pr-4 rounded-2xl border border-zinc-800 backdrop-blur-md shadow-2xl">
        {/* Ảnh đại diện với ký tự đầu tên */}
        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-red-900/40 border border-red-500/50">
          {session.user.name?.charAt(0).toUpperCase() || "U"}
        </div>
        
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-white uppercase tracking-tighter leading-none">
            {session.user.name} ❤️
          </span>
          <button 
            onClick={() => signOut()}
            className="text-[8px] font-black text-zinc-500 hover:text-red-600 transition-colors uppercase text-left mt-1 tracking-widest"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    );
  }

  // Nếu chưa đăng nhập - Hiện cả 2 nút Đăng nhập & Đăng ký
  return (
    <div className="flex items-center gap-2 md:gap-4">
      {/* Nút Đăng nhập - Tông trầm sang trọng */}
      <Link 
        href="/login" 
        className="px-4 py-2 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-all tracking-widest"
      >
        Đăng nhập
      </Link>

      {/* Nút Đăng ký - Tông đỏ rực rỡ làm điểm nhấn */}
      <Link 
        href="/register" 
        className="group relative flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-[0_10px_25px_rgba(220,38,38,0.3)] border border-red-500/20"
      >
        <span className="text-[10px] font-black uppercase tracking-widest">Đăng ký</span>
        <span className="text-[10px] group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </div>
  );
}