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

  // 🚀 HÀM BỌC THÉP: Chuẩn hóa URL ảnh tuyệt đối dựa trên nhà cung cấp API
  const normalizeMovieImages = (movie) => {
    if (!movie) return movie;

    // Bản sao để tránh đột biến dữ liệu gốc (mutation)
    const clonedMovie = { ...movie };

    // Tự động đoán provider nếu không có sẵn trường movie.provider
    // Thường link thumb của KKPhim chứa từ khóa 'phimapi'
    const isKKPhim = clonedMovie.provider === 'kkphim' || 
                     (clonedMovie.thumb_url && clonedMovie.thumb_url.includes('phimapi.com'));
    
    const baseDomain = isKKPhim ? 'https://img.phimapi.com' : 'https://phim.nguonc.com';

    // Chuẩn hóa thumb_url
    if (clonedMovie.thumb_url && !clonedMovie.thumb_url.startsWith('http://') && !clonedMovie.thumb_url.startsWith('https://')) {
      clonedMovie.thumb_url = `${baseDomain}/${clonedMovie.thumb_url.replace(/^\//, '')}`;
    }

    // Chuẩn hóa poster_url
    if (clonedMovie.poster_url && !clonedMovie.poster_url.startsWith('http://') && !clonedMovie.poster_url.startsWith('https://')) {
      clonedMovie.poster_url = `${baseDomain}/${clonedMovie.poster_url.replace(/^\//, '')}`;
    }

    return clonedMovie;
  };

  return (
    <div 
      className="flex flex-col gap-4 group/section py-4 w-full select-none"
      style={{ fontFamily: "var(--font-main)" }}
    >
      
      {/* ── 🚀 TẦNG 1: CỘT TIÊU ĐỀ NẰM NGANG ── */}
      <div className="w-full flex flex-row items-center justify-between pb-2 px-2 md:px-0">
        
        <div className="flex items-center gap-3">
          
          
          <h2 className="text-lg md:text-xl font-medium text-[#ffffff] tracking-tight">
            {title.split(' ').map((word, i) => (
              <span 
                key={i} 
                className={`${i === 1 ? 'text-[#e8e8e8] ' : ''} inline`}
              >
                {word}{' '}
              </span>
            ))}
          </h2>
        </div>

        {viewAllLink && (
          <Link 
            href={viewAllLink} 
            className="text-[#b8b8b8] hover:text-[#ffffff] transition-colors duration-300 inline-flex items-center text-[10px] md:text-xs font-bold uppercase tracking-widest gap-0.5"
          >
            <span className="hidden md:inline">Xem toàn bộ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* ── 🚀 TẦNG 2: THANH TRƯỢT PHIM ── */}
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
          {movies && movies.map((movie) => {
            // 🚀 ĐÃ SỬA: Chuẩn hóa sạch sẽ đường dẫn ảnh lỗi trước khi truyền cho MovieCard
            const cleanMovie = normalizeMovieImages(movie);
            return (
              <SwiperSlide key={movie.slug} className="pb-2">
                <MovieCard movie={cleanMovie} />
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* NÚT MŨI TÊN ĐIỀU HƯỚNG TRÁI */}
        <button 
          className={`prev-${sectionId} absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 glass-surface border border-white/10 rounded-full flex items-center justify-center text-[#b8b8b8] opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:border-[#e8e8e8]/40 hover:text-[#ffffff] hover:bg-white/[0.04]  active:scale-90 select-none cursor-pointer focus:outline-none`}
          onMouseDown={(e) => e.preventDefault()}
          title="Trượt sang trái"
        >
          <ChevronLeft className="w-5 h-5 shrink-0" />
        </button>

        {/* NÚT MŨI TÊN ĐIỀU HƯỚNG PHẢI */}
        <button 
          className={`next-${sectionId} absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 glass-surface border border-white/10 rounded-full flex items-center justify-center text-[#b8b8b8] opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:border-[#e8e8e8]/40 hover:text-[#ffffff] hover:bg-white/[0.04]  active:scale-90 select-none cursor-pointer focus:outline-none`}
          onMouseDown={(e) => e.preventDefault()}
          title="Trượt sang phải"
        >
          <ChevronRight className="w-5 h-5 shrink-0" />
        </button>
      </div>

    </div>
  );
}