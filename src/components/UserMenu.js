'use client';
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Clock, Heart, ShieldAlert, LogOut, ArrowRight, Loader2 } from "lucide-react";
// 🚀 GIỮ NGUYÊN: Import component hiển thị người dùng online của anh
import OnlineUsersMenu from "./OnlineUsersMenu"; 

export default function UserMenu({ isMobile = false }) {
  const { data: session, status } = useSession();

  // Kiểm tra tài khoản admin tối cao của anh
  const isAdmin = session?.user?.email === 'hb.tungg@gmail.com';

  if (status === "loading") {
    return (
      <div className="flex items-center gap-3 animate-pulse font-sans">
        <div className={`${isMobile ? 'w-9 h-9' : 'w-10 h-10'} bg-[#0F1326]/40 border border-white/5 rounded-full`} />
        <div className="flex flex-col gap-1.5">
          <div className="w-16 h-2.5 bg-[#0F1326]/40 border border-white/5 rounded-full" />
          <div className="w-10 h-2 bg-[#0F1326]/40 border border-white/5 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isMobile ? 'gap-2' : 'gap-2.5'} font-sans select-none`} style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* ── KHỐI HEADER BLOCK ĐỊNH DANH ── */}
      {session ? (
        <div className={`flex items-center gap-3 ${isMobile ? 'px-1 pb-3' : 'px-1 pb-3.5'} border-b border-white/5 mb-1`}>
          <div className="relative flex-shrink-0">
            {/* Vòng nhẫn hào quang pha lê Moonlight phát sáng bao quanh Avatar */}
            <div className={`p-[1.5px] rounded-full bg-gradient-to-br ${
              isAdmin 
                ? 'from-[#E6C687] via-[#ffe3ae] to-amber-500 shadow-[0_0_12px_rgba(230,198,135,0.3)]' 
                : 'from-[#E6C687]/40 via-white/10 to-[#0F1326]'
            }`}>
              <div className={`${isMobile ? 'w-8 h-8 text-xs' : 'w-9 h-9 text-xs'} rounded-full bg-[#0F1326] flex items-center justify-center font-bold text-white uppercase font-mono`}>
                {session.user.name?.charAt(0).toUpperCase() ?? "U"}
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0F1326] animate-pulse" />
          </div>
          
          <div className="flex flex-col overflow-hidden min-w-0">
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold text-white tracking-wide truncate uppercase`}>
              {session.user.name}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[8px] font-bold font-mono px-1.5 py-0.5 rounded uppercase tracking-wider ${
                isAdmin
                  ? 'bg-[#E6C687]/10 text-[#ffe3ae] border border-[#E6C687]/30 shadow-[0_0_8px_rgba(230,198,135,0.15)]'
                  : 'bg-white/5 text-[#d0c5b5]/40 border border-white/10'
              }`}>
                {isAdmin ? 'Premium' : 'VIP Member'}
              </span>
              <span className="text-[9px] text-[#d0c5b5]/30 font-bold uppercase tracking-widest">
                Online
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col px-2 pb-2 space-y-1">
          <span className="text-xs font-bold text-[#d0c5b5]/40 uppercase tracking-wider">Khách ẩn danh</span>
          <span className="text-[9px] text-[#d0c5b5]/20 font-semibold uppercase tracking-widest">
            Đăng nhập để mở khóa tinh hệ
          </span>
        </div>
      )}

      {/* ── PHÂN KHU THƯ VIỆN ĐIỆN ẢNH ── */}
      {session && (
        <p className="text-[9px] text-[#d0c5b5]/20 font-bold uppercase px-2 pt-1 pb-0.5 tracking-[0.2em]">
          Thư viện cá nhân
        </p>
      )}

      <nav className="flex flex-col gap-1">
        {session && (
          <>
            <NavItem href="/history" icon={<Clock className="w-3.5 h-3.5" />} label="Phim đang xem" isMobile={isMobile} />
            <NavItem href="/favorites" icon={<Heart className="w-3.5 h-3.5" />} label="Danh sách thích" isMobile={isMobile} />
          </>
        )}
      </nav>

      {/* ── PHÂN KHU QUẢN TRỊ HỆ THỐNG (CHỈ HIỂN THỊ RIÊNG CHO ANH) ── */}
      {isAdmin && (
        <>
          <p className="text-[9px] text-[#d0c5b5]/20 font-bold uppercase px-2 pt-2 pb-0.5 tracking-[0.2em] border-t border-white/5 mt-2">
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
          className={`w-full ${isMobile ? 'py-2' : 'py-2.5'} mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.01] text-[#d0c5b5]/40 hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/20 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer focus:outline-none`}
        >
          <LogOut className="w-3.5 h-3.5" />
          Đăng xuất tinh hệ
        </button>
      ) : (
        <div className="flex flex-col gap-2 pt-2">
          <Link
            href="/login"
            className={`w-full ${isMobile ? 'py-2' : 'py-2.5'} text-center text-[10px] font-bold text-[#d0c5b5]/40 hover:text-[#ffe3ae] bg-white/[0.01] border border-white/5 hover:border-[#E6C687]/20 rounded-xl transition-all tracking-widest uppercase`}
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className={`w-full flex items-center justify-center gap-2 bg-[#E6C687]/10 hover:bg-[#E6C687] border border-[#E6C687]/20 text-[#E6C687] hover:text-[#402d00] ${isMobile ? 'py-2' : 'py-2.5'} rounded-xl font-bold transition-all duration-300 text-[10px] tracking-widest uppercase shadow-md`}
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
    ? `${base} text-amber-400/80 hover:text-[#ffe3ae] bg-[#E6C687]/5 hover:bg-[#E6C687]/10 border-dashed border-[#E6C687]/20 hover:border-[#E6C687]/40 shadow-sm shadow-amber-950/20`
    : `${base} text-[#d0c5b5]/50 hover:text-white border-transparent hover:bg-white/5`;

  return (
    <Link href={href} className={cls}>
      <div className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} flex items-center justify-center rounded-lg ${admin ? 'bg-[#E6C687]/10' : 'bg-[#0F1326]/40 border border-white/5'} flex-shrink-0`}>
        {icon}
      </div>
      <span className="tracking-wide uppercase text-[10px]">{label}</span>
      {pulse && (
        <span className="ml-auto flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E6C687] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E6C687]"></span>
        </span>
      )}
    </Link>
  );
}