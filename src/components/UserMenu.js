'use client';
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function UserMenu({ isMobile = false }) {
  const { data: session, status } = useSession();

  // 1. TRẠNG THÁI ĐANG TẢI (LOADING)
  if (status === "loading") {
    return (
      <div className="flex items-center gap-4 animate-pulse">
        <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} bg-zinc-900 rounded-full`}></div>
        <div className="space-y-2">
          <div className="w-20 h-3 bg-zinc-900 rounded-full"></div>
          <div className="w-12 h-2 bg-zinc-900 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isMobile ? 'gap-3' : 'gap-4'}`}>
      
      {/* 2. NẾU ĐÃ ĐĂNG NHẬP: HIỂN THỊ INFO USER */}
      {session && (
        <>
          <div className="flex items-center gap-3 px-1">
            <div className={`${isMobile ? 'w-11 h-11 text-base' : 'w-14 h-14 text-xl'} rounded-full bg-red-600 flex items-center justify-center font-black text-white shadow-lg border-2 border-red-500/30 flex-shrink-0 transition-transform hover:scale-105 cursor-default`}>
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            
            <div className="flex flex-col overflow-hidden">
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-black text-white uppercase tracking-tighter leading-tight truncate`}>
                {session.user.name} <span className="text-[10px]">❤️</span>
              </span>
              <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] mt-0.5 italic">
                Member VIP
              </span>
            </div>
          </div>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
        </>
      )}

      {/* 3. PHẦN TIỆN ÍCH (Love Gallery, Lịch sử, Yêu thích và Phân quyền Giám sát) */}
      <nav className="flex flex-col gap-1">
        {/* Love Gallery - Luôn hiển thị */}
        <Link 
          href="/love-gallery" 
          className={`flex items-center gap-3 px-3 ${isMobile ? 'py-2' : 'py-3'} text-zinc-500 hover:text-white hover:bg-zinc-900/50 rounded-xl transition-all group`}
        >
          <div className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} flex items-center justify-center bg-zinc-900 rounded-lg group-hover:bg-red-600/10 group-hover:text-red-600 transition-colors`}>
            <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "14" : "16"} height={isMobile ? "14" : "16"} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line>
              <line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line>
              <line x1="17" y1="7" x2="22" y2="7"></line>
            </svg>
          </div>
          <span className={`${isMobile ? 'text-[9px]' : 'text-[10px]'} font-black uppercase tracking-[0.2em]`}>Love Gallery</span>
        </Link>

        {/* Các mục chỉ hiển thị khi đã đăng nhập */}
        {session && (
          <>
            <Link 
              href="/history" 
              className={`flex items-center gap-3 px-3 ${isMobile ? 'py-2' : 'py-3'} text-zinc-500 hover:text-white hover:bg-zinc-900/50 rounded-xl transition-all group`}
            >
              <div className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} flex items-center justify-center bg-zinc-900 rounded-lg group-hover:bg-red-600/10 group-hover:text-red-600 transition-colors`}>
                <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "14" : "16"} height={isMobile ? "14" : "16"} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className={`${isMobile ? 'text-[9px]' : 'text-[10px]'} font-black uppercase tracking-[0.2em]`}>Phim đang xem</span>
            </Link>

            <Link 
              href="/favorites" 
              className={`flex items-center gap-3 px-3 ${isMobile ? 'py-2' : 'py-3'} text-zinc-500 hover:text-white hover:bg-zinc-900/50 rounded-xl transition-all group`}
            >
              <div className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} flex items-center justify-center bg-zinc-900 rounded-lg group-hover:bg-red-600/10 group-hover:text-red-600 transition-colors`}>
                <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "14" : "16"} height={isMobile ? "14" : "16"} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78v0z" />
                </svg>
              </div>
              <span className={`${isMobile ? 'text-[9px]' : 'text-[10px]'} font-black uppercase tracking-[0.2em]`}>Phim yêu thích</span>
            </Link>

            {/* ── ĐÃ TÍCH HỢP: Phân quyền hiển thị lối tắt Giám Sát Rạp độc quyền ── */}
            {session.user.email === 'hb.tungg@gmail.com' && (
              <Link 
                href="/admin/history" 
                className={`flex items-center gap-3 px-3 ${isMobile ? 'py-2' : 'py-3'} text-red-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all group border border-dashed border-red-950/20`}
              >
                <div className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} flex items-center justify-center bg-red-950/20 border border-red-900/30 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors`}>
                  {/* Radar/Eye Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "14" : "16"} height={isMobile ? "14" : "16"} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M3 12c4-8 14-8 18 0-4 8-14 8-18 0z" />
                  </svg>
                </div>
                <span className={`${isMobile ? 'text-[9px]' : 'text-[10px]'} font-black uppercase tracking-[0.2em] flex items-center gap-1.5`}>
                  Giám sát rạp
                  <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                </span>
              </Link>
            )}
          </>
        )}
      </nav>

      {/* 4. PHẦN FOOTER MENU (ĐĂNG XUẤT HOẶC ĐĂNG NHẬP/ĐĂNG KÝ) */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>

      {session ? (
        <button 
          onClick={() => signOut()}
          className={`w-full ${isMobile ? 'py-2.5' : 'py-3.5'} bg-zinc-900/50 hover:bg-red-600/10 border border-zinc-800 hover:border-red-600/40 rounded-2xl text-zinc-500 hover:text-red-500 text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-300 flex items-center justify-center gap-2 group`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Đăng xuất
        </button>
      ) : (
        <div className={`flex flex-col ${isMobile ? 'gap-2' : 'gap-3'}`}>
          <Link 
            href="/login" 
            className={`w-full ${isMobile ? 'py-2.5' : 'py-3'} text-center text-[10px] font-black uppercase text-zinc-500 hover:text-white border border-transparent hover:border-zinc-800 rounded-2xl transition-all tracking-[0.3em]`}
          >
            Đăng nhập
          </Link>
          <Link 
            href="/register" 
            className={`group w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white ${isMobile ? 'py-2.5' : 'py-3.5'} rounded-2xl transition-all active:scale-95 shadow-[0_10px_30px_rgba(220,38,38,0.3)]`}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Đăng ký</span>
            <span className="text-[10px] group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}