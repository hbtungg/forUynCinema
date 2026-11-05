'use client';
import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Link from 'next/link';
import { Play } from 'lucide-react';

export default function HeroSlider({ movies }) {
  const reduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // 🚀 HÀM BỌC THÉP 1: Chuẩn hóa URL ảnh chống 404
  const buildImageUrl = (rawUrl, isKKPhim) => {
    if (!rawUrl) return '';
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl;
    const baseDomain = isKKPhim ? 'https://img.phimapi.com' : 'https://phim.nguonc.com';
    return `${baseDomain}/${rawUrl.replace(/^\//, '')}`;
  };

  // 🚀 HÀM BỌC THÉP 2: Lấy ẢNH NGANG (Landscape) dành cho Tablet/Desktop
  const getLandscapeImage = (movie) => {
    if (!movie) return '';
    const isKKPhim = movie.provider === 'kkphim' || (movie.thumb_url && movie.thumb_url.includes('phimapi.com'));
    // KKPhim ảnh ngang là thumb_url, NguồnC ảnh ngang là poster_url
    const rawUrl = isKKPhim ? (movie.thumb_url || movie.poster_url) : (movie.poster_url || movie.thumb_url);
    return buildImageUrl(rawUrl, isKKPhim);
  };

  // 🚀 HÀM BỌC THÉP 3: Lấy ẢNH DỌC (Portrait) dành riêng cho Mobile
  const getPortraitImage = (movie) => {
    if (!movie) return '';
    const isKKPhim = movie.provider === 'kkphim' || (movie.thumb_url && movie.thumb_url.includes('phimapi.com'));
    // Đảo ngược lại: KKPhim ảnh dọc là poster_url, NguồnC ảnh dọc là thumb_url
    const rawUrl = isKKPhim ? (movie.poster_url || movie.thumb_url) : (movie.thumb_url || movie.poster_url);
    return buildImageUrl(rawUrl, isKKPhim);
  };

  if (!isMounted) {
    return <div className="w-full aspect-[21/9] bg-[#0b0b0b] rounded-4xl animate-pulse" />;
  }

  return (
    <section className="cinema-hero relative h-[58vh] md:h-[68vh] w-full rounded-4xl overflow-hidden border border-white/5 bg-[#0b0b0b] shadow-4xl transition-all duration-300">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={reduceMotion ? false : { delay: 5000, disableOnInteraction: false }}
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
                
                {/* ── 1. 🚀 ĐÃ SỬA: SỬ DỤNG THẺ <picture> ĐỂ ÉP ĐỔI ẢNH THEO KÍCH THƯỚC MÀN HÌNH ── */}
                <picture>
                  {/* Trên màn hình từ md (768px) trở lên -> Load ảnh ngang Landscape */}
                  <source media="(min-width: 768px)" srcSet={getLandscapeImage(movie)} />
                  {/* Trên Mobile (Mặc định) -> Load ảnh dọc Portrait */}
                  <img 
                    src={getPortraitImage(movie)} 
                    className="absolute inset-0 h-full w-full object-cover object-top md:object-center transition-transform duration-[2000ms] group-hover:scale-[1.01]" 
                    alt={movie.name}
                    loading={index === 0 ? "eager" : "lazy"} 
                  />
                </picture>
                
                {/* ── 2. LỚP PHỦ GRADIENT ĐỒNG BỘ MÀU XANH MIDNIGHT ── */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/50 to-transparent md:hidden z-10"></div>
                <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-[#0b0b0b] via-[#0b0b0b]/60 to-transparent z-10"></div>
                <div className="absolute inset-0 hidden md:block bg-gradient-to-t from-[#0b0b0b]/30 via-transparent to-transparent z-10"></div>

                {/* ── 3. NỘI DUNG CHỮ LƠ LỬNG ── */}
                <div className="relative z-20 h-full flex flex-col justify-end md:justify-center items-center md:items-start px-5 sm:px-10 md:px-0 md:pl-16 lg:pl-24 xl:pl-28 pb-12 sm:pb-14 md:pb-0 w-full">
                  
                  <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl space-y-3 sm:space-y-4 md:space-y-5">
                    
                    <div className="space-y-2 md:space-y-3">
                      <span className="text-xs text-white/70 tracking-[0.22em] uppercase">ForUyn Cinema</span>

                      <h1 
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-wide text-[#ffffff] leading-[1.15] md:leading-tight line-clamp-2"
                        style={{ textShadow: 'none', fontFamily: "var(--font-main)", textWrap: 'balance' }}
                      >
                        {movie.name}
                      </h1>
                      
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2.5 gap-y-1 text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#b8b8b8]">
                        <span className="bg-[#ffffff]/20 px-2.5 py-0.5 rounded-full text-[#ffffff] border border-[#ffffff]/30">Ultra HD</span>
                        <span className="opacity-40">•</span>
                        <span>{movie.year}</span>
                        <span className="opacity-40">•</span>
                        <span>{movie.time || ''}</span>
                      </div>
                    </div>

                    {cleanDescription && (
                      <p className="text-[#b8b8b8] text-[12px] sm:text-[13px] md:text-sm lg:text-[15px] line-clamp-2 max-w-[300px] sm:max-w-[420px] md:max-w-[520px] lg:max-w-[600px] leading-relaxed font-medium opacity-85">
                        {cleanDescription}
                      </p>
                    )}

                    <div className="flex gap-3 sm:gap-4 pt-1 md:pt-2 w-full md:w-auto px-4 sm:px-10 md:px-0 justify-center md:justify-start">
                      <Link 
                        href={`/watch/${movie.slug}`} 
                        className="button-primary bg-[#ffffff] text-[#050505] w-full md:w-auto px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 rounded-full font-bold uppercase text-[11px] sm:text-xs transition-all duration-300 flex items-center justify-center gap-2   transform hover:scale-105 active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        WATCH NOW
                      </Link>
                      
                      <Link
                        href={`/movie/${movie.slug}`}
                        className="glass-surface flex bg-white/5 border border-white/10 backdrop-blur-md text-[#ffffff] px-8 lg:px-10 py-3 rounded-full font-bold text-xs hover:bg-white/10 transition-all duration-300"
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

      <style jsx global>{`
        .swiper-pagination-bullet { 
          background: #b8b8b8; 
          opacity: 0.25; 
          transition: all 0.4s ease; 
          width: 5px; 
          height: 5px; 
        }
        .swiper-pagination-bullet-active { 
          background: #ffffff !important; 
          opacity: 1; 
          width: 24px !important; 
          border-radius: 9999px;
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
            padding-left: 64px !important; 
          }
        }
        @media (min-width: 1024px) {
          .swiper-pagination { padding-left: 96px !important; }
        }
        @media (min-width: 1280px) {
          .swiper-pagination { padding-left: 112px !important; }
        }
      `}</style>
    </section>
  );
}