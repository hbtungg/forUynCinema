'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Link from 'next/link';

export default function HeroSlider({ movies }) {
  return (
    <section className="relative h-[75vh] md:h-[85vh] w-full overflow-hidden bg-black font-sans">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="h-full w-full"
      >
        {movies.slice(0, 5).map((movie, index) => {
          const rawContent = movie.description || movie.content || "";
          const cleanDescription = rawContent.replace(/<[^>]*>/g, '');

          return (
            <SwiperSlide key={movie.slug}>
              <div className="relative h-full w-full group">
                
                {/* --- 1. ẢNH NỀN (BACKGROUND) --- */}
                <img 
                  src={movie.poster_url} 
                  className="absolute inset-0 h-full w-full object-cover object-top md:object-center transition-transform duration-[2000ms] group-hover:scale-105" 
                  alt={movie.name}
                  loading={index === 0 ? "eager" : "lazy"} 
                />
                
                {/* --- 2. LỚP PHỦ (GRADIENTS) --- */}
                {/* Mobile: Gradient phủ đáy | Desktop: Gradient bám sát lề trái */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 md:via-transparent to-transparent md:hidden"></div>
                <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-black via-black/60 to-transparent"></div>
                <div className="absolute inset-0 hidden md:block bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* --- 3. NỘI DUNG (CONTENT CONTAINER) --- */}
                {/* TRÊN DESKTOP: Gỡ bỏ mx-auto, dùng md:pl-20 để ép nội dung dạt hẳn về bên trái.
                   TRÊN MOBILE: Căn giữa (items-center) và đẩy xuống đáy (justify-end).
                */}
                <div className="relative z-10 h-full flex flex-col justify-end md:justify-center items-center md:items-start px-6 md:px-0 md:pl-20 pb-16 md:pb-0 w-full">
                  
                  <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:max-w-3xl space-y-4 md:space-y-6">
                    
                    <div className="space-y-2 md:space-y-4">
                      {/* Tên phim: line-clamp-2 cho mobile, md:line-clamp-none cho desktop */}
                      <h2 className="text-3xl md:text-5xl lg:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] leading-[1.1] line-clamp-2 md:line-clamp-none">
                        {movie.name}
                      </h2>
                      
                      <div className="flex items-center justify-center md:justify-start gap-3 text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-300">
                        <span className="bg-red-600 px-2.5 py-1 rounded text-white italic shadow-lg">HD</span>
                        <span>{movie.year}</span>
                        <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>
                        <span>{movie.time || '120 Phút'}</span>
                      </div>
                    </div>

                    {cleanDescription && (
                      <p className="text-zinc-300 text-[13px] md:text-base line-clamp-2 md:line-clamp-3 max-w-[280px] md:max-w-[550px] leading-relaxed font-medium opacity-90">
                        {cleanDescription}
                      </p>
                    )}

                    <div className="flex gap-4 pt-2 md:pt-4 w-full md:w-auto px-4 md:px-0">
                      <Link 
                        href={`/watch/${movie.slug}`} 
                        className="bg-red-600 text-white w-full md:w-auto px-10 md:px-14 py-3.5 md:py-4 rounded-full font-black uppercase text-xs hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 shadow-2xl active:scale-95"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        Xem Ngay
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style jsx global>{`
        /* PAGINATION: Căn trái trên Desktop khớp với lề chữ */
        .swiper-pagination-bullet { background: white; opacity: 0.3; transition: all 0.3s; width: 6px; height: 6px; }
        .swiper-pagination-bullet-active { background: #dc2626; opacity: 1; width: 20px !important; border-radius: 4px; }
        .swiper-pagination { bottom: 20px !important; text-align: center !important; }
        
        @media (min-width: 768px) {
          .swiper-pagination-bullet { width: 8px; height: 8px; }
          .swiper-pagination-bullet-active { width: 30px !important; }
          .swiper-pagination { bottom: 40px !important; text-align: left !important; padding-left: 80px !important; }
        }
      `}</style>
    </section>
  );
}