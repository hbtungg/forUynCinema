'use client';

import Link from 'next/link';
import FavoriteButton from './FavoriteButton';
import { Play, Star } from 'lucide-react';

export default function MovieCard({ movie }) {
  const finalHref = `/movie/${movie.slug}`;

  const getDisplayImage = () => {
    if (!movie) return '';
    const isKKPhim = movie.provider === 'kkphim' ||
      (movie.thumb_url && movie.thumb_url.includes('phimapi.com'));

    let rawUrl = isKKPhim
      ? (movie.poster_url || movie.thumb_url || '')
      : (movie.thumb_url || movie.poster_url || '');

    if (!rawUrl) return '';
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl;
    const baseDomain = isKKPhim ? 'https://img.phimapi.com' : 'https://phim.nguonc.com';
    return `${baseDomain}/${rawUrl.replace(/^\//, '')}`;
  };

  const getEpisodeLabel = () => {
    const current = movie.current_episode || movie.episode_current || movie.sub_doc || '';
    const total = movie.total_episodes || movie.episode_total || 0;

    if (current && current.toLowerCase().includes('tập')) {
      return { text: current, type: 'series' };
    }
    if (parseInt(total) > 1) return { text: `${total} Tập`, type: 'series' };
    return { text: 'Phim Lẻ', type: 'movie' };
  };

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
      style={{ fontFamily: "var(--font-main)" }}
    >
      {/* ── 1. KHUNG CHỨA POSTER ── */}
      <Link
        href={finalHref}
        className="block relative aspect-[2/3] overflow-hidden rounded-xl md:rounded-2xl bg-black/60 border border-white/5  transition-all duration-300 group-hover:border-[#e8e8e8]/30"
        
      >
        <img
          src={getDisplayImage()}
          alt={movie.name}
          className="w-full h-full object-cover transition-all duration-[1000ms] group-hover:scale-105 "
          loading="lazy"
        />

        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/40 to-transparent pointer-events-none transition-all duration-300 group-hover:from-[#0b0b0b]/95" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#e8e8e8]/15 backdrop-blur-md border border-[#e8e8e8]/40 flex items-center justify-center translate-y-3 group-hover:translate-y-0 transition-all duration-300"
            style={{ filter: 'none' }}
          >
            <Play className="w-4 h-4 md:w-5 md:h-5 text-[#ffffff] fill-current ml-0.5 md:ml-1" />
          </div>
        </div>

        {/* 🚀 VÁ UI CHÍ MẠNG: Đổi số tập sang kính mờ đen sâu, viền vàng phát sáng sang trọng */}
        <div className={`absolute top-1.5 left-1.5 md:top-3 md:left-3 z-10 px-1.5 md:px-2.5 h-[22px] md:h-[24px] rounded md:rounded-md flex items-center justify-center text-[10px] md:text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 ${
          ep.type === 'movie'
          ? 'poster-control text-[#b8b8b8] border border-white/10'
          : 'poster-control text-[#ffffff] border border-[#e8e8e8]/50 ' // Kính đen sâu chặn ảnh rối, viền vàng nét căng
          }`}>
          {ep.text}
        </div>

        <div className="absolute top-1.5 right-1.5 md:top-3 md:right-3 z-10 px-1.5 md:px-2.5 h-[22px] md:h-[24px] rounded md:rounded-md flex items-center justify-center text-[10px] md:text-[10px] font-bold uppercase tracking-wider poster-control border border-white/10 text-[#b8b8b8] max-w-[55px] md:max-w-none truncate">
          {getLanguageLabel()}
        </div>

        <div className="absolute bottom-1.5 left-1.5 md:bottom-3 md:left-3 z-10 flex items-center gap-0.5 md:gap-1 bg-black/60 backdrop-blur-md px-1.5 md:px-2 py-0.5 rounded md:rounded-md border border-white/10 text-[8px] md:text-[9px] font-semibold text-[#ffffff]">
          <Star className="w-2 h-2 md:w-2.5 md:h-2.5 fill-current text-[#e8e8e8]" />
          <span>{movie.rating || '8.5'}</span>
        </div>

        <div
          className="absolute bottom-1.5 right-1.5 md:bottom-2.5 md:right-2.5 z-20"
          onClick={e => e.preventDefault()}
        >
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl poster-control border border-white/10 flex items-center justify-center transition-all duration-300 hover:border-[#e8e8e8]/40 hover:bg-black/60 active:scale-90 shadow-xl">
            <div className="scale-[0.8] md:scale-100"><FavoriteButton phim={movie} compact /></div>
          </div>
        </div>

      </Link>

      {/* 2. KHỐI THÔNG TIN DƯỚI POSTER */}
      <div className="pt-2 md:pt-3 px-0.5 md:px-1 space-y-0.5 md:space-y-1">
        <Link href={finalHref} className="block">
          <h3
            className="text-[#ffffff] font-medium text-xs md:text-sm leading-snug line-clamp-1 tracking-wide transition-all duration-300 group-hover:text-[#ffffff]"
            style={{ fontStyle: 'normal' }}
          >
            {movie.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between gap-2 md:gap-4 text-[9px] md:text-[10px] font-medium text-[#b8b8b8] tracking-wide">
          <p className="truncate uppercase flex-1">
            {movie.origin_name || movie.original_name || 'Celestial Epic'}
          </p>
          {movie.year && (
            <span className="flex-shrink-0 font-mono text-[#808080]">
              {movie.year}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}