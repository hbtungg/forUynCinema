'use client';
import Link from 'next/link';
import MovieCard from './MovieCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function MovieSection({ title, movies, viewAllLink }) {
  // Tạo một class name duy nhất cho mỗi section để tránh xung đột navigation (GIỮ NGUYÊN)
  const sectionId = title.replace(/\s+/g, '').toLowerCase();

  return (
    // 🚀 ĐÃ SỬA: Đổi từ flex-row thành flex-col để đẩy toàn bộ danh sách phim xuống dưới gầm Tiêu đề
    <div className="flex flex-col gap-4 group/section py-2 w-full">
      
      {/* ── 🚀 TẦNG 1: CỘT TIÊU ĐỀ NẰM NGANG (Phía trên) ── */}
      {/* Thiết kế tràn ngang, chữ nằm bên trái, nút xem toàn bộ bám sang góc phải đối xứng hoàn hảo */}
      <div className="w-full flex flex-row items-end justify-between pb-2 border-b border-white/[0.02] px-2 md:px-0">
        
        {/* TIÊU ĐỀ H2 (GIỮ NGUYÊN LOGIC ĐỔI MÀU TỪ THỨ 2 CỦA ANH) */}
        <h2 className="text-xl md:text-2xl font-black text-white uppercase italic leading-none tracking-tighter shadow-sm whitespace-nowrap">
          {title.split(' ').map((word, i) => (
            <span 
              key={i} 
              className={`${i === 1 ? 'text-red-600' : ''} inline`}
            >
              {word}{' '}
            </span>
          ))}
        </h2>

        {/* NÚT XEM TOÀN BỘ (GIỮ NGUYÊN CHỨC NĂNG) */}
        {viewAllLink && (
          <Link 
            href={viewAllLink} 
            className="text-zinc-600 hover:text-red-500 transition-colors inline-flex items-center text-[10px] md:text-xs font-bold uppercase tracking-widest"
          >
            <span className="hidden md:inline mr-1">
              Xem toàn bộ
            </span>
            <span className="text-sm md:text-xs font-black md:font-normal">›</span>
          </Link>
        )}
      </div>

      {/* ── 🚀 TẦNG 2: THANH TRƯỢT PHIM (Phía dưới) ── */}
      {/* GIỮ NGUYÊN BẢN 100% LOGIC VÀ CÁC THÔNG SỐ ĐIỀU HƯỚNG SWIPER CỦA ANH */}
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
          }}
          className="mySwiper !overflow-visible"
        >
          {movies && movies.map((movie) => (
            <SwiperSlide key={movie.slug} className="pb-4">
              <MovieCard movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ── 🚀 NÚT MŨI TÊN ĐIỀU HƯỚNG TRÁI (ĐÃ FIX CHỐNG BÔI ĐEN & POPUP MENU) ── */}
        <button 
          className={`prev-${sectionId} absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/70 border border-zinc-800 rounded-full flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-red-600 hover:border-red-600 shadow-lg active:scale-95 select-none cursor-pointer`}
          onMouseDown={(e) => e.preventDefault()} // Chặn đứng hành vi quét text mặc định của trình duyệt
        >
          <span className="select-none pointer-events-none text-xl leading-none font-light">‹</span>
        </button>

        {/* ── 🚀 NÚT MŨI TÊN ĐIỀU HƯỚNG PHẢI (ĐÃ FIX CHỐNG BÔI ĐEN & POPUP MENU) ── */}
        <button 
          className={`next-${sectionId} absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/70 border border-zinc-800 rounded-full flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-red-600 hover:border-red-600 shadow-lg active:scale-95 select-none cursor-pointer`}
          onMouseDown={(e) => e.preventDefault()} // Chặn đứng hành vi quét text mặc định của trình duyệt
        >
          <span className="select-none pointer-events-none text-xl leading-none font-light">›</span>
        </button>
      </div>

    </div>
  );
}