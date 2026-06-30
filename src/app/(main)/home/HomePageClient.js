"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Compass, Star } from "lucide-react";

import HistoryPopup from "@/components/HistoryPopup";
import HeroSlider from "@/components/HeroSlider";
import MovieSection from "@/components/MovieSection";
import ContinueWatching from "@/components/ContinueWatching";


export const metadata = {
  title: 'Trang chủ - Uynflix',
  description: 'Watch series online, watch films online free',
};

export default function HomePageClient({
  allMovies,
  koreaMovies,
  actionMovies, 
  chinaMovies,  
  animeMovies,
  topRated,
  genres,
}) {
  const { data: session, status } = useSession();
  const [liveContinueItems, setLiveContinueItems] = useState([]);

  const loadRightPanelHistory = async () => {
    if (status === "authenticated" && session?.user?.email) {
      try {
        const res = await fetch(`/api/history?userEmail=${session.user.email}`);
        if (res.ok) {
          const data = await res.json();
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

  // 🚀 SỬA CHÍ MẠNG DI CHỨNG 404: Hàm bọc bảo vệ đường dẫn ảnh cho mục Top Rated Aside
  const getAsideCleanImage = (movie) => {
    if (!movie) return '';
    const isKKPhim = movie.provider === 'kkphim' || 
                     (movie.thumb_url && movie.thumb_url.includes('phimapi.com'));
    
    let rawUrl = isKKPhim 
      ? (movie.thumb_url || movie.poster_url || '')
      : (movie.poster_url || movie.thumb_url || '');

    if (!rawUrl) return '';
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl;

    const baseDomain = isKKPhim ? 'https://img.phimapi.com' : 'https://phim.nguonc.com';
    return `${baseDomain}/${rawUrl.replace(/^\//, '')}`;
  };

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
          
          <ContinueWatching />

          <MovieSection title="Phim Mới Cập Nhật" movies={allMovies.slice(0, 12)} viewAllLink="/danh-sach?type=phim-moi-cap-nhat" />
          <MovieSection title="Phim Hàn Quốc" movies={koreaMovies.slice(0, 12)} viewAllLink="/danh-sach?type=han-quoc" />
          <MovieSection title="Phim Hoạt Hình" movies={animeMovies.slice(0, 12)} viewAllLink="/danh-sach?type=hoat-hinh" />

          {/* <div className="pt-4">
            <HistoryPopup />
          </div> */}
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
              <Compass className="w-3.5 h-3.5 text-[#E6C687]" /> Danh sách phổ biến
            </h3>
            <Link href="/danh-sach" className="text-[9px] font-bold text-[#d0c5b5]/40 hover:text-[#ffe3ae] uppercase tracking-wider transition-colors duration-300">
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
              {/* <Link href="/top-rated" className="text-[9px] font-bold text-[#d0c5b5]/40 hover:text-[#ffe3ae] uppercase tracking-wider transition-colors duration-300">
                Xem tất cả
              </Link> */}
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
                    {/* 🚀 ĐÃ VÁ: Khớp hàm getAsideCleanImage loại bỏ hoàn toàn 404 ảnh nhỏ */}
                    <img 
                      src={getAsideCleanImage(movie)} 
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