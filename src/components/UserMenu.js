'use client';
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Clock, ShieldAlert, LogOut, ArrowRight, Loader2 } from "lucide-react";
// 🚀 GIỮ NGUYÊN: Import component hiển thị người dùng online của anh
import OnlineUsersMenu from "./OnlineUsersMenu"; 

export default function UserMenu({ isMobile = false }) {
  const { data: session, status } = useSession();

  // Kiểm tra tài khoản admin tối cao của anh
  const isAdmin = session?.user?.email === 'hb.tungg@gmail.com';

  if (status === "loading") {
    return (
      <div className="flex items-center gap-3 animate-pulse font-sans">
        <div className={`${isMobile ? 'w-9 h-9' : 'w-10 h-10'} bg-white/[0.04] border border-white/5 rounded-full`} />
        <div className="flex flex-col gap-1.5">
          <div className="w-16 h-2.5 bg-white/[0.04] border border-white/5 rounded-full" />
          <div className="w-10 h-2 bg-white/[0.04] border border-white/5 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isMobile ? 'gap-2' : 'gap-2.5'} font-sans select-none`} style={{ fontFamily: "var(--font-main)" }}>

      {/* ── KHỐI HEADER BLOCK ĐỊNH DANH ── */}
      {session ? (
        <div className={`flex items-center gap-3 ${isMobile ? 'px-1 pb-3' : 'px-1 pb-3.5'} border-b border-white/5 mb-1`}>
          <div className="relative flex-shrink-0">
            {/* Vòng nhẫn hào quang pha lê Moonlight phát sáng bao quanh Avatar */}
            <div className={`p-[1.5px] rounded-full bg-gradient-to-br ${
              isAdmin 
                ? 'from-[#e8e8e8] via-[#ffffff] to-neutral-800 ' 
                : 'from-[#e8e8e8]/40 via-white/10 to-[#0b0b0b]'
            }`}>
              <div className={`${isMobile ? 'w-8 h-8 text-xs' : 'w-9 h-9 text-xs'} rounded-full bg-[#0b0b0b] flex items-center justify-center font-bold text-white uppercase font-mono`}>
                {session.user.name?.charAt(0).toUpperCase() ?? "U"}
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0b0b0b] animate-pulse" />
          </div>
          
          <div className="flex flex-col overflow-hidden min-w-0">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-white tracking-wide truncate uppercase`}>
              {session.user.name}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded uppercase tracking-wider ${
                isAdmin
                  ? 'bg-[#e8e8e8]/10 text-[#ffffff] border border-[#e8e8e8]/30 '
                  : 'bg-white/5 text-[#808080] border border-white/10'
              }`}>
                {isAdmin ? 'Premium' : 'VIP Member'}
              </span>
              <span className="text-[9px] text-[#808080] font-bold uppercase tracking-widest">
                Online
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col px-2 pb-2 space-y-1">
          <span className="text-xs font-bold text-[#808080] uppercase tracking-wider">Khách ẩn danh</span>
          <span className="text-[9px] text-[#808080] font-semibold uppercase tracking-widest">
            Đăng nhập để mở khóa
          </span>
        </div>
      )}

      {/* ── PHÂN KHU THƯ VIỆN ĐIỆN ẢNH ── */}
      {session && (
        <p className="text-[9px] text-[#808080] font-bold uppercase px-2 pt-1 pb-0.5 tracking-[0.2em]">
          Thư viện cá nhân
        </p>
      )}

      <nav className="flex flex-col gap-1">
        {session && (
          <>
            <NavItem href="/history" icon={<Clock className="w-3.5 h-3.5" />} label="Lịch sử xem" isMobile={isMobile} />
          </>
        )}
      </nav>

      {/* ── PHÂN KHU QUẢN TRỊ HỆ THỐNG (CHỈ HIỂN THỊ RIÊNG CHO ANH) ── */}
      {isAdmin && (
        <>
          <p className="text-[9px] text-[#808080] font-bold uppercase px-2 pt-2 pb-0.5 tracking-[0.2em] border-t border-white/5 mt-2">
            Hệ thống tối cao
          </p>
          <nav className="flex flex-col gap-1">
            <NavItem href="/admin/users" icon={<ShieldAlert className="w-3.5 h-3.5" />} label="Admin Dashboard" isMobile={isMobile} admin pulse />
          </nav>
          
          {/* 🛠️ GIỮ NGUYÊN BỐ CỤC NHÚNG: Bảng quản lý người dùng Online lọt thỏm mượt mà */}
          <div className="px-1 pt-1 border-t border-white/5 mt-1.5">
            <OnlineUsersMenu />
          </div>
        </>
      )}

      {/* ── CỤM NÚT ĐĂNG XUẤT / ĐĂNG NHẬP DƯỚI ĐÁY ── */}
      {session ? (
        <button
          onClick={() => signOut({ callbackUrl: '/home' })}
          className={`w-full ${isMobile ? 'py-2' : 'py-2.5'} mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.01] text-[#808080] hover:text-neutral-300 hover:bg-neutral-700/5 hover:border-neutral-600/20 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer focus:outline-none`}
        >
          <LogOut className="w-3.5 h-3.5" />
          Đăng xuất
        </button>
      ) : (
        <div className="flex flex-col gap-2 pt-2">
          <Link
            href="/login"
            className={`w-full ${isMobile ? 'py-2' : 'py-2.5'} text-center text-[10px] font-bold text-[#808080] hover:text-[#ffffff] bg-white/[0.01] border border-white/5 hover:border-[#e8e8e8]/20 rounded-xl transition-all tracking-widest uppercase`}
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className={`w-full flex items-center justify-center gap-2 bg-[#e8e8e8]/10 hover:bg-[#e8e8e8] border border-[#e8e8e8]/20 text-[#e8e8e8] hover:text-[#050505] ${isMobile ? 'py-2' : 'py-2.5'} rounded-xl font-bold transition-all duration-300 text-[10px] tracking-widest uppercase shadow-md`}
          >
            Đăng ký tài khoản <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}

// Component NavItem dùng chung bọc kính mờ pha lê
function NavItem({ href, icon, label, isMobile, admin = false, pulse = false }) {
  const base = `flex items-center gap-3 px-2.5 ${isMobile ? 'py-1.5' : 'py-2'} rounded-xl border transition-all duration-300 text-xs font-semibold cursor-pointer`;
  
  const cls = admin
    ? `${base} text-neutral-300/80 hover:text-[#ffffff] bg-[#e8e8e8]/5 hover:bg-[#e8e8e8]/10 border-dashed border-[#e8e8e8]/20 hover:border-[#e8e8e8]/40 shadow-sm shadow-neutral-800/20`
    : `${base} text-[#b8b8b8] hover:text-white border-transparent hover:bg-white/5`;

  return (
    <Link href={href} className={cls}>
      <div className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} flex items-center justify-center rounded-lg ${admin ? 'bg-[#e8e8e8]/10' : 'bg-white/[0.04] border border-white/5'} flex-shrink-0`}>
        {icon}
      </div>
      <span className="tracking-wide uppercase text-[10px]">{label}</span>
      {pulse && (
        <span className="ml-auto flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8e8e8] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e8e8e8]"></span>
        </span>
      )}
    </Link>
  );
}