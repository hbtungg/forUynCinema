'use client';
import Link from 'next/link';

export default function MovieCard({ movie }) {
  // --- GIỮ NGUYÊN LOGIC PHÂN LOẠI CỦA ANH ---
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
    <Link href={`/watch/${movie.slug}`} className="group relative block w-full h-full font-sans overflow-hidden">
      <div className="relative aspect-[2/3] rounded-[2rem] overflow-hidden border border-zinc-800 transition-all duration-500 group-hover:border-red-600/50 shadow-2xl bg-zinc-900">
        
        {/* 1. ẢNH BÌA - GIỮ NGUYÊN HIỆU ỨNG SCALE 110 TRÊN PC */}
        <img 
          src={movie.thumb_url} 
          alt={movie.name}
          className="w-full h-full object-cover transition-transform duration-1000 md:group-hover:scale-110 opacity-80 md:opacity-70 md:group-hover:opacity-100"
          loading="lazy"
        />

        {/* 2. GRADIENT PHỦ CHÂN - GIỮ NGUYÊN Z-20 */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent z-20 transition-opacity opacity-90 md:group-hover:opacity-100"></div>

        {/* 3. NÚT XEM NGAY - CHỈ BAY NHẢY TRÊN PC, HIỆN SẴN GỌN TRÊN MOBILE */}
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            {/* Trên Mobile: Hiện sẵn nhỏ gọn. Trên PC: Bay từ dưới lên khi hover */}
            <div className="transform transition-all duration-500 opacity-100 translate-y-[-10px] md:opacity-0 md:group-hover:opacity-100 md:translate-y-4 md:group-hover:translate-y-[-25px] pointer-events-auto">
                <div className="bg-red-600 text-white text-[8px] md:text-[10px] font-black w-[80px] md:w-[110px] h-8 md:h-10 rounded-full uppercase flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                    <span className="leading-none text-center">Xem Ngay</span>
                </div>
            </div>
        </div>

        {/* 4. BADGES THÔNG TIN - Z-50 (TINH CHỈNH KÍCH THƯỚC TRÊN MOBILE) */}
        {/* Số tập: Nhỏ lại trên mobile để tránh đè nút HD */}
        <div className="absolute top-3 left-3 px-2 md:px-3 h-5 md:h-6 bg-red-600/90 backdrop-blur-md rounded-full z-50 shadow-lg border border-red-500/20 flex items-center justify-center text-[7px] md:text-[8px] font-black uppercase text-white tracking-widest">
            {episodeLabel}
        </div>

        {/* Năm: Nhỏ lại trên mobile */}
        <div className="absolute top-3 right-3 px-1.5 md:px-2 h-5 md:h-6 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 z-50 flex items-center justify-center text-[7px] md:text-[9px] font-bold text-zinc-400 italic">
            {movie.year || "2026"}
        </div>

        {/* Chất lượng: Đẩy thấp xuống 1 chút trên mobile để không đè năm */}
        <div className="absolute bottom-16 md:bottom-5 right-3 px-1.5 md:px-2 h-3.5 md:h-4 bg-yellow-500 rounded text-black font-black text-[7px] md:text-[8px] z-50 uppercase flex items-center justify-center shadow-lg">
          {movie.quality || 'FHD'}
        </div>

        {/* 5. KHU VỰC TÊN PHIM - GIỮ NGUYÊN SCALE VÀ TRANSLATE TRÊN PC */}
        <div className="absolute bottom-5 left-4 right-4 z-30 pr-10 transition-all duration-500 transform md:group-hover:scale-105 md:group-hover:-translate-y-2 origin-left">
          <h3 className="text-white font-black uppercase text-[10px] md:text-[11px] leading-tight truncate drop-shadow-[0_4px_12px_rgba(0,0,0,1)] tracking-tight">
            {movie.name}
          </h3>
          <p className="text-zinc-400 text-[7px] md:text-[8px] font-bold uppercase truncate mt-1 tracking-widest md:group-hover:text-zinc-200 transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            {movie.original_name}
          </p>
        </div>
      </div>
    </Link>
  );
}