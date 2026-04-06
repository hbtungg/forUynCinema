'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import FavoriteButton from './FavoriteButton';

export default function MovieCard({ movie }) {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Kiểm tra thiết bị cảm ứng
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // --- LOGIC PHÂN LOẠI SERIES / MOVIE (Giữ nguyên) ---
  const getEpisodeLabel = () => {
    const current = movie.episode_current || movie.sub_doc || "";
    const total = movie.total_episodes || movie.episodes_count || 0;

    if (current && current.toLowerCase().includes("tập")) {
      const epNumber = current.replace(/[^0-9]/g, '');
      return `Series: ${epNumber || '??'} EP`;
    }
    if (parseInt(total) > 1) return `Series: ${total} EP`;
    
    const nameLower = movie.name?.toLowerCase() || "";
    if (nameLower.includes("phần") || nameLower.includes("tập")) return "Series EP";

    return "Movie";
  };

  const episodeLabel = getEpisodeLabel();

  return (
    <div className="group relative block w-full h-full font-sans overflow-hidden">
      <div className="relative aspect-[2/3] rounded-[2rem] overflow-hidden border border-zinc-800 transition-all duration-500 group-hover:border-red-600/50 shadow-2xl bg-zinc-900">
        
        {/* 1. LINK VÀO XEM PHIM - LỚP DƯỚI CÙNG (Z-10) */}
        <Link href={`/watch/${movie.slug}`} className="absolute inset-0 z-10 block">
          <img 
            src={movie.thumb_url} 
            alt={movie.name}
            className="w-full h-full object-cover transition-transform duration-1000 md:group-hover:scale-110 opacity-80 md:opacity-70 md:group-hover:opacity-100"
            loading="lazy"
          />
          {/* Lớp Gradient phủ chân để hiện tên phim */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent z-20"></div>
        </Link>

        {/* 2. CỤM NÚT TRUNG TÂM (XEM NGAY & YÊU THÍCH) - Z-40 */}
        {/* Gom cả 2 nút vào 1 div để di chuyển đồng bộ */}
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 pointer-events-none transition-all duration-500 opacity-100 md:opacity-0 md:group-hover:opacity-100">
            
            {/* Nút Xem Ngay */}
            <div className={`pointer-events-auto transform transition-transform duration-500 ${!isTouch && 'translate-y-4 md:group-hover:translate-y-[-10px]'}`}>
                <Link href={`/watch/${movie.slug}`} className="bg-red-600 text-white text-[9px] md:text-[10px] font-black w-[90px] md:w-[110px] h-9 md:h-10 rounded-full uppercase flex items-center justify-center shadow-[0_0_25px_rgba(220,38,38,0.5)] active:scale-95 transition-all">
                    <span>Xem Ngay</span>
                </Link>
            </div>

            {/* Nút Yêu thích (FavoriteButton) - Nằm ngay dưới */}
            {/* Thêm padding top để tạo khoảng cách và scale nhẹ trên mobile để dễ bấm */}
            <div className={`pointer-events-auto transform transition-transform duration-500 pt-1 ${!isTouch && 'translate-y-6 md:group-hover:translate-y-[-10px]'} ${isTouch && 'scale-105'}`}>
                <FavoriteButton phim={movie} />
            </div>
        </div>

        {/* 3. BADGES THÔNG TIN CỐ ĐỊNH (LUÔN TRÊN CÙNG) - Z-50 */}
        {/* Góc trái: Loại phim (Series/Movie) */}
        <div className="absolute top-3 left-3 px-2.5 h-5 bg-red-600/90 backdrop-blur-md rounded-lg z-50 flex items-center justify-center text-[7px] md:text-[8px] font-black uppercase text-white tracking-widest shadow-lg">
            {episodeLabel}
        </div>

        {/* Góc phải: Năm sản xuất - Đã được giải phóng, không lo bị che */}
        <div className="absolute top-3 right-3 px-2 h-5 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 z-50 flex items-center justify-center text-[7px] md:text-[8px] font-bold text-zinc-300 italic shadow-lg">
            {movie.year || "2026"}
        </div>

        {/* Chất lượng (HD/FHD) - Nằm trên tên phim */}
        <div className="absolute bottom-16 md:bottom-5 right-3 px-1.5 md:px-2 h-3.5 md:h-4 bg-yellow-500 rounded-sm text-black font-black text-[7px] md:text-[8px] z-50 uppercase flex items-center justify-center shadow-lg">
          {movie.quality || 'FHD'}
        </div>

        {/* 4. KHU VỰC TÊN PHIM - Z-30 */}
        <div className="absolute bottom-5 left-4 right-4 z-30 pr-12 transition-all duration-500 transform md:group-hover:scale-105 origin-left pointer-events-none">
          <h3 className="text-white font-black uppercase text-[10px] md:text-[11px] leading-tight truncate drop-shadow-[0_2px_8px_rgba(0,0,0,1)] tracking-tight">
            {movie.name}
          </h3>
          <p className="text-zinc-500 text-[7px] md:text-[8px] font-bold uppercase truncate mt-1 tracking-widest md:group-hover:text-zinc-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            {movie.original_name}
          </p>
        </div>

      </div>
    </div>
  );
}