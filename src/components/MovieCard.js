'use client';

import Link from 'next/link';
import FavoriteButton from './FavoriteButton';
import { Play, Star } from 'lucide-react';

export default function MovieCard({ movie }) {
  const finalHref = `/movie/${movie.slug}`;

  // 🚀 SỬA CHÍ MẠNG: Định vị chính xác ảnh dọc theo từng nhà cung cấp API
  const getDisplayImage = () => {
    if (!movie) return '';

    // 1. Tự động nhận diện nhà cung cấp dựa trên cấu trúc link hoặc trường provider
    const isKKPhim = movie.provider === 'kkphim' ||
      (movie.thumb_url && movie.thumb_url.includes('phimapi.com'));

    // ĐÃ SỬA CHUẨN ĐÉT: 
    // KKPhim: Lấy poster_url làm ảnh dọc
    // NguồnC (hoặc mặc định): Lấy thumb_url làm ảnh dọc
    let rawUrl = isKKPhim
      ? (movie.poster_url || movie.thumb_url || '')
      : (movie.thumb_url || movie.poster_url || '');

    if (!rawUrl) return '';

    // 2. Nếu đã là URL tuyệt đối thì giữ nguyên
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      return rawUrl;
    }

    // 3. Nếu là đường dẫn tương đối, tự nối domain gốc tương ứng chống 404
    const baseDomain = isKKPhim ? 'https://img.phimapi.com' : 'https://phim.nguonc.com';
    return `${baseDomain}/${rawUrl.replace(/^\//, '')}`;
  };

  // 🧠 BÓC TÁCH NHÃN TẬP PHIM CHUẨN ĐÉT THEO API NGUONC
  const getEpisodeLabel = () => {
    const current = movie.current_episode || movie.episode_current || movie.sub_doc || '';
    const total = movie.total_episodes || movie.episode_total || 0;

    if (current && current.toLowerCase().includes('tập')) {
      return { text: current, type: 'series' };
    }
    if (parseInt(total) > 1) return { text: `${total} Tập`, type: 'series' };
    return { text: 'Phim Lẻ', type: 'movie' };
  };

  // BÓC TÁCH NGÔN NGỮ ĐIỆN ẢNH
  const getLanguageLabel = () => {
    const lang = (movie.language || movie.lang || '').toLowerCase();
    if (lang.includes('phụ đề') || lang.includes('vietsub')) {
      if (lang.includes('thuyết minh')) return 'Vietsub + TM';
      return 'Vietsub';
    }
    if (lang.includes('thuyết minh')) return 'Thuyết Minh';
    return movie.language || movie.lang || 'FHD';
  };

  const ep = getEpisodeLabel();

  return (
    <div
      className="group relative w-full font-sans cursor-pointer flex flex-col"
      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
    >
      {/* ── 1. KHUNG CHỨA POSTER (LỒNG KÍNH MỜ PHA LÊ) ── */}
      <Link
        href={finalHref}
        className="block relative aspect-[2/3] overflow-hidden rounded-2xl bg-[#0F1326]/40 border border-white/5 shadow-2xl transition-all duration-500 group-hover:border-[#E6C687]/30"
        style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
      >
        {/* 🚀 ĐÃ SỬA: Ảnh giờ đây gọi qua hàm xử lý ảnh thông minh chống 404 */}
        <img
          src={getDisplayImage()}
          alt={movie.name}
          className="w-full h-full object-cover transition-all duration-[1000ms] group-hover:scale-105 group-hover:brightness-90 filter group-hover:blur-[0.5px]"
          loading="lazy"
        />

        {/* Lớp phủ gradient màu xanh đêm Midnight */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0F1326] via-[#0F1326]/40 to-transparent pointer-events-none transition-all duration-500 group-hover:from-[#0F1326]/95" />

        {/* NÚT BẤM PLAY CENTER */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
          <div
            className="w-12 h-12 rounded-full bg-[#E6C687]/15 backdrop-blur-md border border-[#E6C687]/40 flex items-center justify-center translate-y-3 group-hover:translate-y-0 transition-all duration-500"
            style={{ filter: 'drop-shadow(0 0 10px rgba(230, 198, 135, 0.4))' }}
          >
            <Play className="w-5 h-5 text-[#ffe3ae] fill-current ml-0.5" />
          </div>
        </div>

        {/* TOP BADGES */}
        <div className={`absolute top-3 left-3 z-10 px-2.5 h-[20px] rounded-md flex items-center justify-center text-[9px] font-bold uppercase tracking-wider border transition-all duration-300 ${ep.type === 'movie'
          ? 'bg-[#0F1326]/80 text-[#d0c5b5] border-white/5'
          : 'bg-[#E6C687]/10 text-[#ffe3ae] border-[#E6C687]/20 shadow-[0_0_10px_rgba(230,198,135,0.15)]'
          }`}>
          {ep.text}
        </div>

        <div className="absolute top-3 right-3 z-10 px-2.5 h-[20px] rounded-md flex items-center justify-center text-[9px] font-bold uppercase tracking-wider bg-[#0F1326]/70 backdrop-blur-md border border-white/5 text-[#d0c5b5]">
          {getLanguageLabel()}
        </div>

        {/* BOTTOM BADGES LOG */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/5 text-[9px] font-black text-[#ffe3ae]">
          <Star className="w-2.5 h-2.5 fill-current text-[#E6C687]" />
          <span>{movie.rating || '8.5'}</span>
        </div>

        {/* NÚT TIM YÊU THÍCH KÍNH MỜ */}
        <div
          className="absolute bottom-2.5 right-2.5 z-20"
          onClick={e => e.preventDefault()}
        >
          <div className="w-8 h-8 rounded-xl bg-[#0F1326]/60 backdrop-blur-md border border-white/5 flex items-center justify-center transition-all duration-300 hover:border-[#E6C687]/40 hover:bg-[#0F1326]/90 active:scale-90 shadow-xl">
            <FavoriteButton phim={movie} compact />
          </div>
        </div>

      </Link>

      {/* 2. KHỐI THÔNG TIN DƯỚI POSTER */}
      <div className="pt-3 px-1 space-y-1">
        <Link href={finalHref} className="block">
          <h3
            className="text-[#e8e1da] font-bold text-xs md:text-sm leading-snug line-clamp-1 tracking-wide transition-all duration-300 group-hover:text-[#ffe3ae]"
            style={{ fontStyle: 'normal' }}
          >
            {movie.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between gap-4 text-[10px] font-medium text-[#d0c5b5]/50 tracking-wide">
          <p className="truncate uppercase flex-1">
            {movie.origin_name || movie.original_name || 'Celestial Epic'}
          </p>
          {movie.year && (
            <span className="flex-shrink-0 font-mono text-[#d0c5b5]/30">
              {movie.year}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}