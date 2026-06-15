'use client';
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
// 🚀 CHÈN THÊM: Import component hiển thị người dùng online của anh
import OnlineUsersMenu from "./OnlineUsersMenu"; 

export default function UserMenu({ isMobile = false }) {
  const { data: session, status } = useSession();

  // Kiểm tra xem có phải tài khoản admin tối cao của anh không
  const isAdmin = session?.user?.email === 'hb.tungg@gmail.com';

  if (status === "loading") {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className={`${isMobile ? 'w-9 h-9' : 'w-10 h-10'} bg-white/5 rounded-full`} />
        <div className="flex flex-col gap-1.5">
          <div className="w-20 h-2.5 bg-white/5 rounded-full" />
          <div className="w-12 h-2 bg-white/5 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isMobile ? 'gap-1.5' : 'gap-2'}`}>

      {/* — Header block — */}
      {session ? (
        <div className={`flex items-center gap-2.5 ${isMobile ? 'px-2 pb-2' : 'px-2 pb-2.5'}`}>
          <div className="relative flex-shrink-0">
            <div className={`${isMobile ? 'w-9 h-9 text-sm' : 'w-10 h-10 text-[15px]'} rounded-full bg-red-600 flex items-center justify-center font-semibold text-white`}>
              {session.user.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-green-500 border-[1.5px] border-[#111]" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className={`${isMobile ? 'text-[13px]' : 'text-sm'} font-semibold text-zinc-100 tracking-tight leading-tight truncate`}>
              {session.user.name}
            </span>
            <span className="text-[10px] text-green-500 font-medium tracking-widest mt-0.5 uppercase">
              Đang online
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col px-2 pb-2">
          <span className="text-[13px] font-medium text-zinc-500">Khách ẩn danh</span>
          <span className="text-[10px] text-zinc-700 font-medium tracking-widest mt-1">
            Đăng nhập để xem thêm
          </span>
        </div>
      )}

      {/* — Nav Thư Viện — */}
      {session && (
        <p className="text-[9px] text-zinc-700 font-black uppercase px-2.5 pt-2 pb-0.5 tracking-[0.15em]">
          Thư viện
        </p>
      )}

      <nav className="flex flex-col gap-0.5">
        {session && (
          <>
            <NavItem href="/history" icon={<ClockIcon />} label="Đang xem" isMobile={isMobile} />
            <NavItem href="/favorites" icon={<HeartIcon />} label="Yêu thích" isMobile={isMobile} />
          </>
        )}
      </nav>

      {/* — Nav Quản Trị Hệ Thống (Chỉ hiển thị riêng cho anh) — */}
      {isAdmin && (
        <>
          <p className="text-[9px] text-zinc-700 font-black uppercase px-2.5 pt-2 pb-0.5 tracking-[0.15em] border-t border-white/[0.03] mt-1.5">
            Hệ thống
          </p>
          <nav className="flex flex-col gap-0.5">
            <NavItem href="/admin/users" icon={<EyeIcon />} label="Admin Dashboard" isMobile={isMobile} admin pulse />
          </nav>
          
          {/* 🛠️ CHÈN THÊM: Nhúng bảng quản lý người dùng Online lọt thỏm tinh tế ở đây */}
          <div className="px-1 pt-1 border-t border-white/[0.03] mt-1">
            <OnlineUsersMenu />
          </div>
        </>
      )}

      {/* — Footer — */}
      {session ? (
        <button
          onClick={() => signOut({ callbackUrl: '/home' })}
          className={`w-full ${isMobile ? 'py-2.5' : 'py-3'} mt-2 flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] text-zinc-600 hover:text-red-400 hover:border-red-500/25 hover:bg-red-500/5 text-[11px] font-medium tracking-widest uppercase transition-all duration-200`}
        >
          <LogoutIcon />
          Đăng xuất
        </button>
      ) : (
        <div className="flex flex-col gap-2 pt-2">
          <Link
            href="/login"
            className={`w-full ${isMobile ? 'py-2.5' : 'py-3'} text-center text-[11px] font-medium text-zinc-500 hover:text-zinc-200 border border-white/[0.07] hover:border-white/[0.15] rounded-xl transition-all tracking-widest`}
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className={`w-full flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 text-white ${isMobile ? 'py-2.5' : 'py-3'} rounded-xl transition-colors text-[11px] font-semibold tracking-widest`}
          >
            Đăng ký <span>→</span>
          </Link>
        </div>
      )}
    </div>
  );
}

// Sub-components
function NavItem({ href, icon, label, isMobile, admin = false, pulse = false }) {
  const base = `flex items-center gap-2.5 px-2.5 ${isMobile ? 'py-2' : 'py-2.5'} rounded-xl transition-all text-[12px] font-medium`;
  const cls = admin
    ? `${base} text-red-500 hover:text-red-400 hover:bg-red-500/[0.06] border border-dashed border-red-900/30`
    : `${base} text-zinc-500 hover:text-zinc-100 hover:bg-white/[0.04]`;

  return (
    <Link href={href} className={cls}>
      <div className={`${isMobile ? 'w-7 h-7' : 'w-[30px] h-[30px]'} flex items-center justify-center rounded-lg ${admin ? 'bg-red-950/30' : 'bg-white/[0.04]'} flex-shrink-0`}>
        {icon}
      </div>
      <span className="tracking-[0.04em]">{label}</span>
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse ml-auto" />}
    </Link>
  );
}

// Icons (inline SVG, no external deps)
const iconProps = { width: 15, height: 15, fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24", strokeLinecap: "round", strokeLinejoin: "round" };
const ClockIcon = () => <svg {...iconProps}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>;
const HeartIcon = () => <svg {...iconProps}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78v0z"/></svg>;
const EyeIcon   = () => <svg {...iconProps}><path d="M3 12c4-8 14-8 18 0-4 8-14 8-18 0z"/><circle cx="12" cy="12" r="3"/></svg>;
const LogoutIcon= () => <svg {...iconProps} width={14} height={14}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>;