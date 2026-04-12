'use client';
import Link from 'next/link';
import FavoriteButton from './FavoriteButton';

export default function MovieCard({ movie }) {
  const finalHref = `/watch/${movie.slug}`;

  // 1. HÀM LẤY NHÃN TẬP PHIM - RÚT GỌN (CHỈ HIỆN SỐ EP)
  const getEpisodeLabel = () => {
    const current = movie.episode_current || movie.sub_doc || "";
    const total = movie.episode_total || movie.total_episodes || movie.episodes_count || 0;

    // Kiểm tra nếu là phim bộ (dựa trên chuỗi "tập" hoặc tổng số tập > 1)
    if (current && current.toLowerCase().includes("tập")) {
      const epNumber = current.replace(/[^0-9]/g, '');
      return `${epNumber || '??'} EP`;
    }

    if (parseInt(total) > 1) {
      return `${total} EP`;
    }

    return "Movie";
  };

  // 2. HÀM LẤY NHÃN PHỤ ĐỀ / THUYẾT MINH - CHUẨN HÓA THEO YÊU CẦU
  const getLanguageLabel = () => {
    const lang = movie.language || "";
    const isPude = lang.toLowerCase().includes("phụ đề") || lang.toLowerCase().includes("vietsub");
    const isThminh = lang.toLowerCase().includes("thuyết minh");

    if (isPude && isThminh) return "P.Đề + T.Minh";
    if (isThminh) return "T.Minh";
    if (isPude) return "P.Đề";
    
    return lang || "FHD"; // Mặc định nếu không khớp các chuỗi trên
  };

  return (
    <div className="group relative block w-full h-full font-sans">
      {/* 1. KHU VỰC ẢNH BÌA */}
      <div className="relative aspect-[2/3] rounded-[1.8rem] md:rounded-[2.2rem] overflow-hidden border border-zinc-900 transition-all duration-500 group-hover:border-red-600/50 shadow-2xl bg-[#0a0a0a] mb-4">
        
        <Link href={finalHref} className="absolute inset-0 z-10 block">
          <img 
            src={movie.thumb_url} 
            alt={movie.name}
            className="w-full h-full object-cover opacity-70 transition-all duration-1000 md:group-hover:opacity-100 md:group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent z-20"></div>
        </Link>

        {/* NÚT TRÁI TIM TRÒN */}
        <div className="absolute bottom-4 right-4 z-40 flex opacity-100 md:opacity-0 md:group-hover:opacity-100 scale-100 md:scale-90 md:group-hover:scale-100 transition-all duration-300">
          <div className="flex items-center justify-center w-10 h-10 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-lg active:scale-75 overflow-hidden">
            <div className="[&_span]:hidden [&_p]:hidden [&_label]:hidden [&_button]:bg-transparent [&_button]:border-none [&_button]:p-0 [&_svg]:w-5 [&_svg]:h-5 [&_svg]:m-0 flex items-center justify-center">
              <FavoriteButton phim={movie} />
            </div>
          </div>
        </div>

        {/* BADGES THÔNG TIN */}
        <div className="absolute top-3 left-3 px-2.5 h-5 bg-red-600/90 backdrop-blur-md rounded-lg z-50 flex items-center justify-center text-[7px] md:text-[8px] font-black uppercase text-white tracking-widest shadow-lg">
            {getEpisodeLabel()}
        </div>

        <div className="absolute top-3 right-3 px-2.5 h-5 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 z-50 flex items-center justify-center text-[7px] md:text-[8px] font-black text-zinc-300 uppercase tracking-widest">
          {getLanguageLabel()}
        </div>
      </div>

      {/* 2. THÔNG TIN PHÍA NGOÀI */}
      <div className="px-2 space-y-1.5">
        <h3 className="text-white font-black uppercase text-[12px] md:text-[14px] leading-tight truncate tracking-tight group-hover:text-red-600 transition-colors duration-300">
          {movie.name}
        </h3>
        
        <div className="flex items-center justify-between border-t border-zinc-900 pt-2 mt-2">
          <span className="text-zinc-500 text-[8px] font-black uppercase tracking-widest truncate pr-4 max-w-[90%]">
            {movie.origin_name || movie.original_name || "Original Title"}
          </span>
          {/* ĐÃ XÓA PHẦN HIỂN THỊ SỐ NĂM TẠI ĐÂY */}
        </div>
      </div>
    </div>
  );
}