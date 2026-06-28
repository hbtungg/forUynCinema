"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Play, History, Compass, Star, PlayCircle } from "lucide-react";

import Footer from "@/components/Footer";
import HistoryPopup from "@/components/HistoryPopup";
import HeroSlider from "@/components/HeroSlider";
import MovieSection from "@/components/MovieSection";

export default function HomePageClient({
  allMovies,
  koreaMovies,
  actionMovies, // Giữ nguyên prop để tránh lỗi map dữ liệu từ page.js
  chinaMovies,  // Giữ nguyên prop để tránh lỗi map dữ liệu từ page.js
  animeMovies,
  topRated,
  genres,
}) {
  const { data: session, status } = useSession();
  
  // 🚀 ĐỒNG BỘ DATA THẬT: Quản lý danh sách lịch sử xem tiếp động
  const [liveContinueItems, setLiveContinueItems] = useState([]);

  const loadRightPanelHistory = async () => {
    if (status === "authenticated" && session?.user?.email) {
      try {
        const res = await fetch(`/api/history?userEmail=${session.user.email}`);
        if (res.ok) {
          const data = await res.json();
          // 🚀 FIX LỖI TYPO CHÍ MẠNG: Đã dọn sạch ký tự lạ gây lỗi cú pháp build
          setLiveContinueItems(data.slice(0, 4));
        }
      } catch (error) {
        console.error("Lỗi lấy lịch sử tại HomePageClient:", error);
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
    <div className="w-full flex flex-row min-w-0 min-h-screen select-none font-sans items-start">
      
      {/* ── KHỐI TRÁI: BANNER, XEM TIẾP CARD NGANG & CÁC KHAY PHIM CHÍNH ── */}
      <div className="flex-1 min-w-0 pb-24">
        
        {/* Banner chính bo góc lướt êm */}
        <div className="px-5 xl:px-12 pt-4">
          <HeroSlider movies={allMovies} />
        </div>

        {/* Khay danh sách phim xếp tầng rực rỡ chuẩn Be Vietnam Pro */}
        <div className="px-5 xl:px-12 py-8 space-y-12" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          
          {/* 🎬 HIỂN THỊ: CONTINUE WATCHING DẠNG CARD NGANG TỈ LỆ VIDEO (ASPECT-VIDEO) */}
          {session && liveContinueItems && liveContinueItems.length > 0 && (
            <section className="space-y-4 animate-in fade-in duration-700 px-2 md:px-0">
              <div className="flex justify-between items-end">
                <h3 className="text-sm font-bold text-[#e8e1da] tracking-[0.25em] uppercase border-l-4 border-[#E6C687] pl-3 flex items-center gap-2">
                  <History className="w-4 h-4 text-[#E6C687]" /> Tiếp Tục Hành Trình
                </h3>
                <Link href="/lich-su" className="text-[10px] font-bold text-[#d0c5b5]/40 hover:text-[#ffe3ae] uppercase tracking-widest transition-colors duration-300">
                  Xem tất cả
                </Link>
              </div>

              {/* Khay trượt ngang mượt mà triệt tiêu thanh cuộn thô cứng */}
              <div className="flex gap-5 overflow-x-auto pb-2 overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {liveContinueItems.map((movie) => {
                  const epLabel = movie.episode ? `Tập ${movie.episode}` : 'Đang xem';
                  
                  return (
                    <Link
                      key={`continue-${movie.slug}`}
                      href={`/watch/${movie.slug}?ep=${movie.episode || 1}`}
                      className="flex-none w-[240px] md:w-[320px] group cursor-pointer"
                    >
                      {/* Khung Poster Ngang tỷ lệ aspect-video kính mờ xanh đêm tối giản */}
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#0F1326]/40 border border-white/5 mb-2 shadow-2xl transition-all duration-400 group-hover:border-[#E6C687]/30 group-hover:-translate-y-1">
                        <img
                          className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-500"
                          src={movie.thumb_url || movie.poster_url}
                          alt={movie.name}
                          loading="lazy"
                        />
                        {/* Thanh tiến trình Moonlight phát sáng bo chân */}
                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/10">
                          <div 
                            className="h-full bg-[#E6C687] shadow-[0_0_10px_#E6C687] transition-all" 
                            style={{ width: `${movie.progress || 65}%` }}
                          ></div>
                        </div>
                        {/* Biểu tượng PlayCircle kính mờ khi hover chuột */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                          <PlayCircle className="w-10 h-10 text-[#E6C687] drop-shadow-[0_0_15px_rgba(230,198,135,0.6)]" />
                        </div>
                      </div>

                      {/* Thông tin chữ bên dưới card ngang */}
                      <h4 className="text-xs md:text-sm font-bold text-[#e8e1da] truncate group-hover:text-[#E6C687] transition-colors leading-snug">
                        {movie.name}
                      </h4>
                      <p className="text-[10px] text-[#d0c5b5]/40 font-semibold mt-1 uppercase tracking-wider flex items-center justify-between">
                        <span>{epLabel}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-white/5 border border-white/5 rounded text-[#d0c5b5]/60">
                          {movie.quality || 'FHD'}
                        </span>
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* 🚀 ĐÃ SỬA: Chỉ giữ lại Mới cập nhật, Hàn Quốc, Hoạt hình. Đã xóa Hành động và Trung Quốc theo ý anh */}
          <MovieSection title="Phim Mới Cập Nhật" movies={allMovies.slice(0, 12)} viewAllLink="/danh-sach?type=phim-moi-cap-nhat" />
          <MovieSection title="Phim Hàn Quốc" movies={koreaMovies.slice(0, 12)} viewAllLink="/danh-sach?type=han-quoc" />
          <MovieSection title="Phim Hoạt Hình" movies={animeMovies.slice(0, 12)} viewAllLink="/danh-sach?type=hoat-hinh" />

          <div className="pt-4">
            <HistoryPopup />
          </div>
        </div>
      </div>

      {/* ── KHỐI PHẢI: BẢNG PHỤ TINH GỌN (Cuộn trôi tự do, đồng bộ toàn diện) ── */}
      <aside 
        className="hidden xl:flex flex-col w-[300px] 2xl:w-[320px] flex-shrink-0 my-4 mr-6 rounded-[32px] border border-white/5 bg-[#0F1326]/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-5 space-y-6 z-10 h-full"
        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
      >
        {/* KHÚC 1: THỂ LOẠI PHỔ BIẾN */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d0c5b5]/80 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#E6C687]" /> Thể loại phổ biến
            </h3>
            <Link href="/the-loai" className="text-[9px] font-bold text-[#d0c5b5]/40 hover:text-[#ffe3ae] uppercase tracking-wider transition-colors duration-300">
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {genres && genres.map(({ label, icon, href }) => (
              <a 
                key={label} 
                href={href}
                className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-[#E6C687]/20 transition-all duration-300 group"
              >
                <span className="text-sm leading-none filter grayscale group-hover:grayscale-0 transition-all">{icon}</span>
                <span className="text-[10px] font-bold text-[#d0c5b5]/60 group-hover:text-[#e8e1da] transition-colors truncate uppercase tracking-wider">{label}</span>
              </a>
            ))}
          </div>
        </section>

        {/* KHÚC 2: TOP RATED ĐIỆN ẢNH */}
        {topRated && topRated.length > 0 && (
          <section className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d0c5b5]/80 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-[#E6C687]" /> Top Đánh Giá
              </h3>
              <Link href="/top-rated" className="text-[9px] font-bold text-[#d0c5b5]/40 hover:text-[#ffe3ae] uppercase tracking-wider transition-colors duration-300">
                Xem tất cả
              </Link>
            </div>
            <div className="space-y-1">
              {topRated.slice(0, 5).map((movie, i) => (
                <a 
                  key={movie.slug} 
                  href={`/watch/${movie.slug}`}
                  className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-300 group"
                >
                  <span className={`flex-shrink-0 w-5 text-center text-xs font-black tabular-nums ${
                    i === 0 ? 'text-[#E6C687] drop-shadow-[0_0_6px_rgba(230,198,135,0.5)]' : i === 1 ? 'text-zinc-400' : i === 2 ? 'text-amber-700' : 'text-[#d0c5b5]/20'
                  }`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  
                  <div className="w-9 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-[#0F1326] border border-white/5">
                    <img 
                      src={movie.thumb_url} 
                      alt={movie.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-[#e8e1da] truncate leading-none group-hover:text-[#ffe3ae] transition-colors">
                      {movie.name}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-2">
                      <p className="text-[9px] text-[#d0c5b5]/40 font-mono font-semibold">{movie.year || '2026'}</p>
                      <div className="flex items-center gap-1 bg-[#ffe3ae]/10 px-1.5 py-0.5 rounded-md text-[9px] font-black text-[#ffe3ae]">
                        <Star className="w-2 h-2 fill-current" />
                        <span>{movie.fakeRating || movie.rating || '8.5'}</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </aside>

    </div>
  );
}