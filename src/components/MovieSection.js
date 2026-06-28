'use client';
import Link from 'next/link';
import MovieCard from './MovieCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MovieSection({ title, movies, viewAllLink }) {
  // Tạo một class name duy nhất cho mỗi section để tránh xung đột navigation
  const sectionId = title.replace(/\s+/g, '').toLowerCase();

  return (
    <div 
      className="flex flex-col gap-4 group/section py-4 w-full select-none"
      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
    >
      
      {/* ── 🚀 TẦNG 1: CỘT TIÊU ĐỀ NẰM NGANG (ĐÃ THÊM THANH DỌC PHÁT SÁNG ĐỒNG BỘ) ── */}
      <div className="w-full flex flex-row items-center justify-between pb-2 border-b border-white/5 px-2 md:px-0">
        
        {/* CỤM TIÊU ĐỀ H2 KÈM THANH GỜ CHỈ VÀNG MOONLIGHT */}
        <div className="flex items-center gap-3">
          {/* 🚀 Ổn định thanh dọc phát sáng chuẩn đét từ ContinueWatching */}
          <div className="w-1 h-6 md:h-7 bg-[#E6C687] rounded-full shadow-[0_0_15px_rgba(230,198,135,0.6)] shrink-0"></div>
          
          <h2 className="text-lg md:text-xl font-bold text-[#e8e1da] uppercase tracking-wider whitespace-nowrap">
            {title.split(' ').map((word, i) => (
              <span 
                key={i} 
                className={`${i === 1 ? 'text-[#E6C687] drop-shadow-[0_0_10px_rgba(230,198,135,0.25)]' : ''} inline`}
              >
                {word}{' '}
              </span>
            ))}
          </h2>
        </div>

        {/* NÚT XEM TOÀN BỘ CHUẨN PHA LÊ */}
        {viewAllLink && (
          <Link 
            href={viewAllLink} 
            className="text-[#d0c5b5]/50 hover:text-[#ffe3ae] transition-colors duration-300 inline-flex items-center text-[10px] md:text-xs font-bold uppercase tracking-widest gap-0.5"
          >
            <span className="hidden md:inline">
              Xem toàn bộ
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* ── 🚀 TẦNG 2: THANH TRƯỢT PHIM (Kính mờ lướt 120Hz) ── */}
      <div className="flex-1 w-full relative overflow-hidden group/slider">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: `.next-${sectionId}`,
            prevEl: `.prev-${sectionId}`,
          }}
          spaceBetween={16}
          slidesPerView={2.2}
          breakpoints={{
            640: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4.2 },
            1280: { slidesPerView: 5.2 },
            1536: { slidesPerView: 6.2 }, 
          }}
          className="mySwiper !overflow-visible"
        >
          {movies && movies.map((movie) => (
            <SwiperSlide key={movie.slug} className="pb-2">
              <MovieCard movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ── 🚀 NÚT MŨI TÊN ĐIỀU HƯỚNG TRÁI PHONG CÁCH CELESTIAL GLASS ── */}
        <button 
          className={`prev-${sectionId} absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-[#0F1326]/60 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-[#d0c5b5] opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:border-[#E6C687]/40 hover:text-[#ffe3ae] hover:bg-[#0F1326]/90 shadow-[0_4px_20px_rgba(0,0,0,0.5)] active:scale-90 select-none cursor-pointer focus:outline-none`}
          onMouseDown={(e) => e.preventDefault()}
          title="Trượt sang trái"
        >
          <ChevronLeft className="w-5 h-5 shrink-0" />
        </button>

        {/* ── 🚀 NÚT MŨI TÊN ĐIỀU HƯỚNG PHẢI PHONG CÁCH CELESTIAL GLASS ── */}
        <button 
          className={`next-${sectionId} absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-[#0F1326]/60 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-[#d0c5b5] opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:border-[#E6C687]/40 hover:text-[#ffe3ae] hover:bg-[#0F1326]/90 shadow-[0_4px_20px_rgba(0,0,0,0.5)] active:scale-90 select-none cursor-pointer focus:outline-none`}
          onMouseDown={(e) => e.preventDefault()}
          title="Trượt sang phải"
        >
          <ChevronRight className="w-5 h-5 shrink-0" />
        </button>
      </div>

    </div>
  );
}