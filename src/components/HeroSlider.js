'use client';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Link from 'next/link';
import { Play } from 'lucide-react';

export default function HeroSlider({ movies }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // 🚀 HÀM BỌC THÉP: Định vị chuẩn xác ẢNH NGANG BANNER độ phân giải cao theo từng API
  const getBannerImage = (movie) => {
    if (!movie) return '';

    const isKKPhim = movie.provider === 'kkphim' || 
                     (movie.thumb_url && movie.thumb_url.includes('phimapi.com'));
    
    let rawUrl = isKKPhim 
      ? (movie.thumb_url || movie.poster_url || '')
      : (movie.poster_url || movie.thumb_url || '');

    if (!rawUrl) return '';

    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      return rawUrl;
    }

    const baseDomain = isKKPhim ? 'https://img.phimapi.com' : 'https://phim.nguonc.com';
    return `${baseDomain}/${rawUrl.replace(/^\//, '')}`;
  };

  if (!isMounted) {
    return <div className="w-full aspect-[21/9] bg-[#0F1326] rounded-4xl animate-pulse" />;
  }

  return (
    /* 🚀 ĐÃ TINH CHỈNH CHIỀU CAO: Tăng từ h-[50vh]/[60vh] lên h-[58vh] md:h-[68vh] cực kỳ vừa vặn và thoáng đãng */
    <section className="relative h-[58vh] md:h-[68vh] w-full rounded-4xl overflow-hidden border border-white/5 bg-[#0F1326] shadow-4xl transition-all duration-300">
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
                
                {/* ── 1. ẢNH NỀN BANNER SẮC NÉT (Giữ nguyên 100% không mờ opacity) ── */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={getBannerImage(movie)} 
                  className="absolute inset-0 h-full w-full object-cover object-top md:object-center transition-transform duration-[2000ms] group-hover:scale-[1.01]" 
                  alt={movie.name}
                  loading={index === 0 ? "eager" : "lazy"} 
                />
                
                {/* ── 2. LỚP PHỦ GRADIENT ĐỒNG BỘ MÀU XANH MIDNIGHT ── */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1326] via-[#0F1326]/50 to-transparent md:hidden z-10"></div>
                <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-[#0F1326] via-[#0F1326]/60 to-transparent z-10"></div>
                <div className="absolute inset-0 hidden md:block bg-gradient-to-t from-[#0F1326]/30 via-transparent to-transparent z-10"></div>

                {/* ── 3. NỘI DUNG CHỮ LƠ LỬNG (Giữ nguyên chữ hoa thường tự nhiên) ── */}
                <div className="relative z-20 h-full flex flex-col justify-end md:justify-center items-center md:items-start px-6 md:px-0 md:pl-24 pb-14 md:pb-0 w-full">
                  
                  <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:max-w-3xl space-y-4 md:space-y-5">
                    
                    <div className="space-y-2 md:space-y-3">
                      <span className="inline-block px-3 py-1 bg-[#ffe3ae]/10 text-[#ffe3ae] text-[10px] font-bold tracking-[0.2em] uppercase rounded-full border border-[#ffe3ae]/20 shadow-[0_0_15px_rgba(255,227,174,0.1)]">
                        Now Streaming
                      </span>

                      <h1 
                        className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide text-[#ffe3ae] leading-tight"
                        style={{ textShadow: '0 0 15px rgba(255, 227, 174, 0.35)', fontFamily: "'Be Vietnam Pro', sans-serif" }}
                      >
                        {movie.name}
                      </h1>
                      
                      <div className="flex items-center justify-center md:justify-start gap-3 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#d0c5b5]/70">
                        <span className="bg-[#ffe3ae]/20 px-2.5 py-0.5 rounded-full text-[#ffe3ae] border border-[#ffe3ae]/30">HD ULTRA HD</span>
                        <span>•</span>
                        <span>{movie.year}</span>
                        <span>•</span>
                        <span>{movie.time || '2H 15M'}</span>
                      </div>
                    </div>

                    {cleanDescription && (
                      <p className="text-[#d0c5b5] text-[13px] md:text-sm line-clamp-2 max-w-[320px] md:max-w-[580px] leading-relaxed font-medium opacity-85">
                        {cleanDescription}
                      </p>
                    )}

                    <div className="flex gap-4 pt-1 md:pt-2 w-full md:w-auto px-4 md:px-0 justify-center md:justify-start">
                      <Link 
                        href={`/watch/${movie.slug}`} 
                        className="bg-[#ffe3ae] text-[#402d00] w-full md:w-auto px-8 md:px-10 py-3 rounded-full font-bold uppercase text-xs transition-all duration-400 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(230,198,135,0.3)] hover:shadow-[0_0_30px_rgba(230,198,135,0.5)] transform hover:scale-105 active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        WATCH NOW
                      </Link>
                      
                      <Link
                        href={`/movie/${movie.slug}`}
                        className="hidden md:flex bg-white/5 border border-white/10 backdrop-blur-md text-[#e8e1da] px-8 py-3 rounded-full font-bold text-xs hover:bg-white/10 transition-all duration-400"
                      >
                        DETAILS
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* ── 4. CSS THANH ĐIỀU HƯỚNG MẶT TRĂNG VÀNG ── */}
      <style jsx global>{`
        .swiper-pagination-bullet { 
          background: #d0c5b5; 
          opacity: 0.25; 
          transition: all 0.4s ease; 
          width: 5px; 
          height: 5px; 
        }
        .swiper-pagination-bullet-active { 
          background: #ffe3ae !important; 
          opacity: 1; 
          width: 24px !important; 
          border-radius: 9999px;
          box-shadow: 0 0 10px rgba(255, 227, 174, 0.5);
        }
        .swiper-pagination { 
          bottom: 16px !important; 
          text-align: center !important; 
          z-index: 30 !important;
        }
        
        @media (min-width: 768px) {
          .swiper-pagination-bullet { width: 6px; height: 6px; }
          .swiper-pagination-bullet-active { width: 32px !important; }
          .swiper-pagination { 
            bottom: 32px !important; 
            text-align: left !important; 
            padding-left: 96px !important; 
          }
        }
      `}</style>
    </section>
  );
}