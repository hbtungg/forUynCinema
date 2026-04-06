'use client';
import Link from 'next/link';

export default function MovieCard({ movie }) {
  // --- LOGIC PHÂN LOẠI SERIES / MOVIE (INTERNATIONAL VERSION) ---
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
    <Link href={`/watch/${movie.slug}`} className="group relative block w-full h-full font-sans">
      <div className="relative aspect-[2/3] rounded-[2rem] overflow-hidden border border-zinc-800 transition-all duration-500 group-hover:border-red-600/50 shadow-2xl bg-zinc-900">
        
        {/* 1. ẢNH BÌA */}
        <img 
          src={movie.thumb_url} 
          alt={movie.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
          loading="lazy"
        />

        {/* 2. LỚP PHỦ HOVER (XEM NGAY) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 flex items-center justify-center">
            <div className="transform translate-y-4 group-hover:translate-y-[-20px] transition-transform duration-500">
                <div className="bg-red-600 text-white text-[10px] font-black w-[110px] h-10 rounded-full uppercase flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                    <span className="leading-none">Xem Ngay</span>
                </div>
            </div>
        </div>

        {/* 3. BADGES THÔNG TIN (ĐÃ CĂN TÂM TUYỆT ĐỐI) */}
        
        {/* Nhãn Series / Movie (Góc trên trái) */}
        <div className="absolute top-3 left-3 px-3 h-6 bg-red-600/90 backdrop-blur-md rounded-full z-40 shadow-lg border border-red-500/20 flex items-center justify-center">
          <span className="text-[8px] font-black uppercase tracking-[0.15em] text-white leading-none whitespace-nowrap">
            {episodeLabel}
          </span>
        </div>

        {/* Nhãn Năm (Góc trên phải) */}
        <div className="absolute top-3 right-3 px-2 h-6 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 z-40 flex items-center justify-center">
          <span className="text-[9px] font-bold text-zinc-400 italic leading-none">
            {movie.year || "2026"}
          </span>
        </div>

        {/* Nhãn Độ phân giải (Góc dưới phải) */}
        <div className="absolute bottom-5 right-3 px-2 h-4 bg-yellow-500 rounded text-black font-black text-[8px] z-40 uppercase flex items-center justify-center shadow-lg">
          <span className="leading-none">{movie.quality || 'FHD'}</span>
        </div>

        {/* 4. TÊN PHIM VÀ GRADIENT PHỦ CHÂN */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/60 to-transparent z-20"></div>
        
        <div className="absolute bottom-5 left-4 right-4 z-20 pr-10 group-hover:translate-y-[-5px] transition-transform">
          <h3 className="text-white font-black uppercase text-[10px] leading-tight truncate group-hover:text-red-500 transition-colors drop-shadow-lg tracking-tight">
            {movie.name}
          </h3>
          <p className="text-zinc-500 text-[8px] font-bold uppercase truncate mt-1 opacity-80 tracking-widest">
            {movie.original_name}
          </p>
        </div>
      </div>
    </Link>
  );
}