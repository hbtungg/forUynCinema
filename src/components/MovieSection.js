'use client';
import Link from 'next/link';
import MovieCard from './MovieCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function MovieSection({ title, movies, viewAllLink }) {
  // Tạo một class name duy nhất cho mỗi section để tránh xung đột navigation
  const sectionId = title.replace(/\s+/g, '').toLowerCase();

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 group/section py-2">
      {/* CỘT TIÊU ĐỀ DỌC (Bên trái) - ĐÃ XÓA BỎ BORDER-L VÀ PL */}
      <div className="w-full md:w-40 flex flex-col justify-center py-2">
        <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic leading-none tracking-tighter shadow-sm">
          {title.split(' ').map((word, i) => (
            // Em giữ lại logic đổi màu chữ thứ 2 thành đỏ để tạo điểm nhấn
            <span key={i} className={i === 1 ? 'text-red-600 block' : 'block'}>
              {word}
            </span>
          ))}
        </h2>
        <Link 
          href={viewAllLink} 
          className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-5 hover:text-red-500 transition-colors inline-flex items-center gap-1"
        >
          Xem toàn bộ <span className="text-xs">›</span>
        </Link>
      </div>

      {/* THANH TRƯỢT PHIM (Bên phải) */}
      <div className="flex-1 relative overflow-hidden group/slider">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: `.next-${sectionId}`,
            prevEl: `.prev-${sectionId}`,
          }}
          spaceBetween={16} // Khoảng cách giữa các phim khít hơn chút
          slidesPerView={2.2} // Hiện một chút của phim tiếp theo để kích thích tò mò
          breakpoints={{
            640: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4.2 },
            1280: { slidesPerView: 5.2 }, // Trên màn hình lớn hiện được nhiều phim hơn
          }}
          className="mySwiper !overflow-visible"
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.slug} className="pb-4">
              <MovieCard movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* NÚT MŨI TÊN ĐIỀU HƯỚNG (Hiện khi hover vào slider) */}
        <button className={`prev-${sectionId} absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/70 border border-zinc-800 rounded-full flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-red-600 hover:border-red-600 shadow-lg active:scale-95`}>
          ‹
        </button>
        <button className={`next-${sectionId} absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/70 border border-zinc-800 rounded-full flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-red-600 hover:border-red-600 shadow-lg active:scale-95`}>
          ›
        </button>
      </div>
    </div>
  );
}