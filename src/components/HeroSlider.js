'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Link from 'next/link';

export default function HeroSlider({ movies }) {
  return (
    <section className="relative h-[65vh] md:h-[85vh] w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="h-full w-full"
      >
        {movies.slice(0, 5).map((movie) => {
          const rawContent = movie.description || movie.content || "";
          const cleanDescription = rawContent.replace(/<[^>]*>/g, '');

          return (
            <SwiperSlide key={movie.slug}>
              <div className="relative h-full w-full group">
                {/* Ảnh bìa */}
                <img 
                  src={movie.poster_url} 
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" 
                  alt={movie.name}
                />
                
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

                {/* Nội dung thông tin phim */}
                <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-20 max-w-5xl space-y-4 md:space-y-6">
                  
                  {/* TÊN PHIM: Giảm từ text-7xl/8xl xuống 5xl/6xl cho thanh thoát */}
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl leading-[1.1] max-w-3xl">
                    {movie.name}
                  </h2>
                  
                  <div className="flex items-center gap-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-300">
                    <span className="bg-red-600 px-3 py-1.5 rounded-md text-white italic shadow-lg">IMDb 9.0</span>
                    <span>{movie.year}</span>
                    <span>{movie.time || '120 Phút'}</span>
                  </div>

                  {/* PHẦN MÔ TẢ: Giới hạn độ rộng (max-w-xs đến md) để đạt ~10 tiếng/dòng */}
                  {cleanDescription ? (
                    <p className="text-zinc-300 text-sm md:text-base line-clamp-3 max-w-[320px] md:max-w-[450px] leading-relaxed font-medium drop-shadow-lg">
                      {cleanDescription}
                    </p>
                  ) : (
                    <p className="text-zinc-500 text-sm italic">Đang cập nhật nội dung phim...</p>
                  )}

                  <div className="flex gap-4 pt-4">
                    <Link href={`/watch/${movie.slug}`} className="bg-white text-black px-10 py-4 rounded-full font-black uppercase text-xs hover:bg-red-600 hover:text-white transition-all duration-300 scale-100 active:scale-95 flex items-center gap-2 shadow-2xl">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      Xem Ngay
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination-bullet { background: white; opacity: 0.3; transition: all 0.3s; }
        .swiper-pagination-bullet-active { background: #dc2626; opacity: 1; width: 25px !important; border-radius: 4px; }
        .swiper-pagination { bottom: 30px !important; text-align: center !important; }
      `}</style>
    </section>
  );
}