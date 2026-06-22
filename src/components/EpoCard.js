'use client';
import Link from 'next/link';

export default function EpoCard({ movie }) {
  if (!movie) return null;
  const videoId = movie.id || movie.slug || 'unknown';
  const finalHref = `/epo/watch/${videoId}`;

  return (
    <div className="group relative block w-full h-full font-sans">
      {/* 1. KHU VỰC ẢNH BÌA */}
      <div className="relative aspect-video rounded-[1.8rem] md:rounded-[2.2rem] overflow-hidden border border-zinc-900 transition-all duration-500 group-hover:border-red-600/50 shadow-2xl bg-[#0a0a0a] mb-4">
        <Link href={finalHref} className="absolute inset-0 z-10 block">
          <img 
            src={movie.thumb || movie.thumb_url} 
            alt={movie.title || movie.name}
            className="w-full h-full object-contain opacity-70 transition-all duration-1000 group-hover:opacity-100 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/40 to-transparent z-20"></div>
        </Link>

        {/* BADGE ĐỘ PHÂN GIẢI - TONE ĐỎ TRẮNG */}
        <div className="absolute top-3 left-3 px-2.5 h-5 bg-red-600 rounded-lg z-50 flex items-center justify-center text-[8px] font-black uppercase text-white tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            {movie.quality?.includes('HD') || movie.quality?.includes('4K') ? movie.quality : '4K'}
        </div>
      </div>

      {/* 2. KHU VỰC THÔNG TIN (NGOÀI ẢNH) */}
      <div className="px-2 space-y-2">
        <h3 className="text-white font-black uppercase text-[12px] md:text-[14px] leading-tight truncate tracking-tight group-hover:text-red-600 transition-colors duration-300">
          {movie.title || movie.name}
        </h3>

        {/* Hàng thông số tích hợp Độ dài phim */}
        <div className="flex items-center justify-between gap-2 border-t border-zinc-900 pt-3 mt-2">
          <div className="flex items-center gap-2.5">
            {/* Lượt xem */}
            <span className="text-zinc-500 text-[9px] font-black uppercase flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="text-red-600" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/></svg>
              {Number(movie.views || 0).toLocaleString('vi-VN')}
            </span>

            {/* Đánh giá */}
            <span className="text-white text-[9px] font-black flex items-center gap-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" fill="currentColor" className="text-red-600" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>
              {movie.rate || "9.5"}
            </span>

            {/* ĐỘ DÀI PHIM (Duration) - NEW */}
            <span className="text-zinc-500 text-[9px] font-black uppercase flex items-center gap-1 border-l border-zinc-800 pl-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" fill="currentColor" className="text-red-600" viewBox="0 0 16 16">
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
              </svg>
              {movie.quality?.includes(':') ? movie.quality : (movie.duration ? `${movie.duration}m` : '20m')}
            </span>
          </div>

          <span className="text-zinc-700 text-[9px] font-black uppercase tracking-widest italic">
            {movie.added?.split(' ')[0] || '2026'}
          </span>
        </div>
      </div>
    </div>
  );
}