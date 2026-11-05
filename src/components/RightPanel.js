'use client';
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { Play, ChevronRight, Star, History, Compass } from 'lucide-react';

export default function RightPanel({ continueItems: initialItems, genres, topRated }) {
  const { data: session, status } = useSession();
  
  // 🚀 ĐỒNG BỘ: State quản lý danh sách xem tiếp động từ API thực tế
  const [liveContinueItems, setLiveContinueItems] = useState([]);

  // Hàm nạp dữ liệu động từ database của tài khoản
  const loadRightPanelHistory = async () => {
    if (status === "authenticated" && session?.user?.email) {
      try {
        const res = await fetch(`/api/history?userEmail=${session.user.email}`);
        if (res.ok) {
          const data = await res.json();
          setLiveContinueItems(data.slice(0, 3)); // Chỉ lấy 3 phim xem gần nhất cho gọn đẹp panel
        }
      } catch (error) {
        console.error("Lỗi lấy lịch sử tại RightPanel:", error);
      }
    } else {
      setLiveContinueItems([]);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadRightPanelHistory();
    } else {
      setLiveContinueItems([]);
    }
    window.addEventListener('historyUpdated', loadRightPanelHistory);
    return () => window.removeEventListener('historyUpdated', loadRightPanelHistory);
  }, [status, session]);

  return (
    /* 🚀 FIX CHÍ MẠNG: Bo tròn rounded-[32px] (4xl), lồng kính mờ bg-white/[0.04] xịn xò tệp 100% vào Header/Sidebar */
    <aside 
      className="hidden xl:flex flex-col w-[295px] 2xl:w-[315px] flex-shrink-0 h-[calc(100vh-100px)] my-4 mr-6 rounded-[32px] border border-white/5 glass-surface  overflow-y-auto custom-scrollbar pb-10 relative z-10 select-none"
      style={{ fontFamily: "var(--font-main)" }}
    >
      
      {/* ── SECTION 1: TIẾP TỤC XEM (ĐÃ THAY MÁU HOÀN TOÀN) ── */}
      <section className="px-5 pt-6 pb-5 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b8b8b8] flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-[#e8e8e8]" /> Tiếp tục xem
          </h3>

          {session && (
            <Link href="/lich-su" className="text-[9px] font-bold text-[#808080] hover:text-[#ffffff] uppercase tracking-wider transition-colors duration-300">
              Xem tất cả
            </Link>
          )}
        </div>

        {session ? (
          <div className="space-y-1">
            {liveContinueItems && liveContinueItems.length > 0 ? (
              liveContinueItems.map((item) => {
                const epLabel = item.episode ? `Tập ${item.episode}` : 'Đang xem';

                return (
                  <a
                    key={item.slug}
                    href={`/watch/${item.slug}?ep=${item.episode || 1}`}
                    className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-300 group"
                  >
                    {/* Khung Poster thu nhỏ */}
                    <div className="w-16 h-10 flex-shrink-0 rounded-xl overflow-hidden bg-[#0b0b0b] relative border border-white/5">
                      <img
                        src={item.thumb_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Vạch tiến trình đổi sang sắc vàng Moonlight Gold lấp lánh */}
                      <div
                        className="absolute bottom-0 left-0 h-[3px] bg-[#e8e8e8]  transition-all"
                        style={{ width: `${item.progress || 50}%` }}
                      />
                    </div>

                    {/* Thông tin văn bản */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-[#ffffff] truncate leading-none group-hover:text-[#ffffff] transition-colors">
                        {item.name}
                      </p>
                      <p className="text-[9px] text-[#b8b8b8] truncate mt-1.5 font-semibold uppercase tracking-wider">
                        {epLabel}
                      </p>
                    </div>

                    
                    <button className="w-6 h-6 flex flex-shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/5 text-[#b8b8b8] group-hover:text-[#050505] group-hover:bg-[#ffffff] group-hover:border-[#ffffff] transition-all duration-300 cursor-pointer focus:outline-none">
                      <Play className="w-2.5 h-2.5 fill-current" />
                    </button>
                  </a>
                );
              })
            ) : (
              <p className="text-[10px] text-[#808080] text-center py-4 font-medium italic">Bạn chưa xem bộ phim nào gần đây.</p>
            )}
          </div>
        ) : (
          /* Khung nhắc đăng nhập pha lê lơ lửng */
          <div className="p-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center text-center group hover:border-[#e8e8e8]/30 hover:bg-white/[0.04] transition-all duration-300">
            <p className="text-[11px] font-medium text-[#b8b8b8] tracking-wide leading-relaxed transition-colors">
              Vui lòng đăng nhập<br />để xem tiếp hành trình của bạn 🎬
            </p>
            <Link
              href="/login"
              className="mt-3 px-5 py-1.5 bg-[#e8e8e8]/10 hover:bg-[#e8e8e8] border border-[#e8e8e8]/20 text-[#e8e8e8] hover:text-[#050505] text-[9px] font-bold uppercase tracking-widest rounded-full transition-all duration-300 active:scale-95 shadow-md"
            >
              Đăng nhập ngay
            </Link>
          </div>
        )}
      </section>

      {/* ── SECTION 2: THỂ LOẠI PHỔ BIẾN (CHUẨN CHU KỲ PHA LÊ) ── */}
      <section className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b8b8b8] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#e8e8e8]" /> Thể loại
          </h3>
          <Link href="/the-loai" className="text-[9px] font-bold text-[#808080] hover:text-[#ffffff] uppercase tracking-wider transition-colors duration-300">
            Xem tất cả
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {genres.map(({ label, icon, href }) => (
            <a 
              key={label} 
              href={href}
              className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-[#e8e8e8]/20 transition-all duration-300 group"
            >
              <span className="text-sm leading-none filter grayscale group-hover:grayscale-0 transition-all">{icon}</span>
              <span className="text-[10px] font-bold text-[#b8b8b8] group-hover:text-[#ffffff] transition-colors truncate uppercase tracking-wider">{label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: TOP RATED (BẢNG VÀNG ĐIỆN ẢNH) ── */}
      <section className="px-5 py-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b8b8b8] flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-[#e8e8e8]" /> Top Rated
          </h3>
          <Link href="/top-rated" className="text-[9px] font-bold text-[#808080] hover:text-[#ffffff] uppercase tracking-wider transition-colors duration-300">
            Xem tất cả
          </Link>
        </div>
        <div className="space-y-1">
          {topRated.map((movie, i) => (
            <a 
              key={movie.slug} 
              href={`/watch/${movie.slug}`}
              className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-300 group"
            >
              {/* Định dạng số thứ hạng cao cấp */}
              <span className={`flex-shrink-0 w-5 text-center text-xs font-semibold tabular-nums ${
                i === 0 ? 'text-[#e8e8e8] ' : i === 1 ? 'text-zinc-400' : i === 2 ? 'text-neutral-300' : 'text-[#808080]'
              }`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              
              {/* Khung Poster phim thu nhỏ */}
              <div className="w-9 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-[#0b0b0b] border border-white/5">
                <img 
                  src={movie.thumb_url} 
                  alt={movie.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
              </div>

              {/* Tên phim và điểm sao động */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-[#ffffff] truncate leading-none group-hover:text-[#ffffff] transition-colors">
                  {movie.name}
                </p>
                <div className="flex items-center justify-between gap-2 mt-2">
                  <p className="text-[9px] text-[#808080] font-mono font-semibold">{movie.year || '2026'}</p>
                  <div className="flex items-center gap-1 bg-[#ffffff]/10 px-1.5 py-0.5 rounded-md text-[9px] font-semibold text-[#ffffff]">
                    <Star className="w-2 h-2 fill-current" />
                    <span>{movie.fakeRating || '8.5'}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

    </aside>
  );
}