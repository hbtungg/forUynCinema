'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import FavoriteButton from './FavoriteButton';

export default function MovieCard({ movie }) {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Kiểm tra thiết bị cảm ứng để tối ưu trải nghiệm cho chị nhà
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // --- LOGIC PHÂN LOẠI & ĐƯỜNG DẪN ---
  const isEpo = !!movie.customHref; // Nếu có customHref thì đích thị là phim EPO
  const finalHref = movie.customHref || `/watch/${movie.slug}`;

  const getEpisodeLabel = () => {
    if (isEpo) return "Premium Full"; // EPO thường là phim lẻ chất lượng cao
    
    const current = movie.episode_current || movie.sub_doc || "";
    const total = movie.total_episodes || movie.episodes_count || 0;

    if (current && current.toLowerCase().includes("tập")) {
      const epNumber = current.replace(/[^0-9]/g, '');
      return `Series: ${epNumber || '??'} EP`;
    }
    if (parseInt(total) > 1) return `Series: ${total} EP`;
    
    return "Movie";
  };

  const episodeLabel = getEpisodeLabel();

  return (
    <div className="group relative block w-full h-full font-sans overflow-hidden">
      {/* TỰ ĐỘNG ĐỔI TỈ LỆ: 
          - Nếu là EPO: aspect-video (Ngang 16:9)
          - Nếu là NguonC: aspect-[2/3] (Dọc)
      */}
      <div className={`relative ${isEpo ? 'aspect-video' : 'aspect-[2/3]'} rounded-[1.8rem] md:rounded-[2.2rem] overflow-hidden border border-zinc-800 transition-all duration-500 group-hover:border-red-600/50 shadow-2xl bg-zinc-900`}>
        
        {/* 1. LINK VÀO XEM PHIM - LỚP DƯỚI CÙNG (Z-10) */}
        <Link href={finalHref} className="absolute inset-0 z-10 block">
          <img 
            src={movie.thumb_url} 
            alt={movie.name}
            className={`w-full h-full object-cover transition-transform duration-1000 md:group-hover:scale-110 ${isEpo ? 'opacity-90 group-hover:opacity-100' : 'opacity-80 md:opacity-70 md:group-hover:opacity-100'}`}
            loading="lazy"
          />
          {/* Lớp Gradient phủ chân: Cao hơn ở bản dọc, thấp hơn ở bản ngang */}
          <div className={`absolute inset-x-0 bottom-0 ${isEpo ? 'h-1/2' : 'h-2/3'} bg-gradient-to-t from-black via-black/60 to-transparent z-20`}></div>
        </Link>

        {/* 2. CỤM NÚT TRUNG TÂM (Z-40) - Chỉ hiện thị đầy đủ ở bản dọc của NguonC */}
        <div className={`absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 pointer-events-none transition-all duration-500 ${isEpo ? 'opacity-0 group-hover:opacity-100' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'}`}>
            
            {/* Nút Xem Ngay */}
            <div className={`pointer-events-auto transform transition-transform duration-500 ${!isTouch && 'translate-y-4 md:group-hover:translate-y-[-10px]'}`}>
                <Link href={finalHref} className="bg-red-600 text-white text-[9px] md:text-[10px] font-black w-[90px] md:w-[110px] h-9 md:h-10 rounded-full uppercase flex items-center justify-center shadow-[0_0_25px_rgba(220,38,38,0.5)] active:scale-95 transition-all">
                    <span>Xem Ngay</span>
                </Link>
            </div>

            {/* Nút Yêu thích (FavoriteButton) - Chỉ hiện ở bản dọc NguonC để tránh chật khung ngang */}
            {!isEpo && (
              <div className={`pointer-events-auto transform transition-transform duration-500 pt-1 ${!isTouch && 'translate-y-6 md:group-hover:translate-y-[-10px]'} ${isTouch && 'scale-105'}`}>
                  <FavoriteButton phim={movie} />
              </div>
            )}
        </div>

        {/* 3. BADGES THÔNG TIN CỐ ĐỊNH (Z-50) */}
        <div className="absolute top-3 left-3 px-2.5 h-5 bg-red-600/90 backdrop-blur-md rounded-lg z-50 flex items-center justify-center text-[7px] md:text-[8px] font-black uppercase text-white tracking-widest shadow-lg">
            {episodeLabel}
        </div>

        <div className="absolute top-3 right-3 px-2 h-5 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 z-50 flex items-center justify-center text-[7px] md:text-[8px] font-bold text-zinc-300 italic shadow-lg">
            {movie.year || "2026"}
        </div>

        {/* 4. KHU VỰC TÊN PHIM (Z-30) */}
        <div className={`absolute ${isEpo ? 'bottom-4' : 'bottom-5'} left-4 right-4 z-30 pr-12 transition-all duration-500 transform md:group-hover:scale-105 origin-left pointer-events-none`}>
          <h3 className="text-white font-black uppercase text-[10px] md:text-[11px] leading-tight truncate drop-shadow-[0_2px_8px_rgba(0,0,0,1)] tracking-tight">
            {movie.name}
          </h3>
          {/* Chỉ hiện tên gốc ở bản dọc để tiết kiệm không gian bản ngang */}
          {!isEpo && movie.original_name && (
            <p className="text-zinc-500 text-[7px] md:text-[8px] font-bold uppercase truncate mt-1 tracking-widest md:group-hover:text-zinc-300">
              {movie.original_name}
            </p>
          )}
        </div>

        {/* Badge Chất lượng / Thời lượng */}
        <div className="absolute bottom-16 md:bottom-5 right-3 px-1.5 md:px-2 h-3.5 md:h-4 bg-yellow-500 rounded-sm text-black font-black text-[7px] md:text-[8px] z-50 uppercase flex items-center justify-center shadow-lg">
          {movie.quality || 'FHD'}
        </div>

      </div>
    </div>
  );
}