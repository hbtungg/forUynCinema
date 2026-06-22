'use client';

import Link from 'next/link';
import FavoriteButton from './FavoriteButton';

export default function MovieCard({ movie }) {
  const finalHref = `/watch/${movie.slug}`;

  const getEpisodeLabel = () => {
    const current = movie.episode_current || movie.sub_doc || '';
    const total   = movie.episode_total || movie.total_episodes || movie.episodes_count || 0;

    if (current && current.toLowerCase().includes('tập')) {
      const num = current.replace(/[^0-9]/g, '');
      return { text: `${num || '??'} EP`, type: 'series' };
    }
    if (parseInt(total) > 1) return { text: `${total} EP`, type: 'series' };
    return { text: 'MOVIE', type: 'movie' };
  };

  const getLanguageLabel = () => {
    const lang = (movie.language || '').toLowerCase();
    if (lang.includes('phụ đề') || lang.includes('vietsub')) {
      if (lang.includes('thuyết minh')) return 'Đ+M';
      return 'Vietsub';
    }
    if (lang.includes('thuyết minh')) return 'T.Minh';
    return movie.language || 'FHD';
  };

  const ep = getEpisodeLabel();

  return (
    <div className="group relative w-full font-sans cursor-pointer">

      {/* ── POSTER WRAPPER ── */}
      <Link href={finalHref} className="block relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-950">

        {/* Ảnh */}
        <img
          src={movie.thumb_url}
          alt={movie.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.06] group-hover:brightness-75"
          loading="lazy"
        />

        {/* Gradient bottom — chỉ 1/3 dưới, không che ảnh */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        {/* Hover overlay — mờ nhẹ để hiện play button */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 pointer-events-none" />

        {/* ── PLAY BUTTON — xuất hiện khi hover ── */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <svg width="18" height="18" fill="white" viewBox="0 0 24 24" className="ml-0.5">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>

        {/* ── TOP BADGES ── */}
        {/* EP badge — top left */}
        <div className={`absolute top-2.5 left-2.5 z-10 px-2 h-[18px] rounded flex items-center justify-center text-[8px] font-black uppercase tracking-widest ${
          ep.type === 'movie'
            ? 'bg-zinc-800/90 text-zinc-300 border border-zinc-700/50'
            : 'bg-red-600/90 text-white'
        }`}>
          {ep.text}
        </div>

        {/* Language badge — top right */}
        <div className="absolute top-2.5 right-2.5 z-10 px-2 h-[18px] rounded flex items-center justify-center text-[8px] font-black uppercase tracking-widest bg-black/50 backdrop-blur-sm border border-white/10 text-zinc-300">
          {getLanguageLabel()}
        </div>

        {/* ── FAVORITE BUTTON — bottom right, luôn hiện ── */}
        <div
          className="absolute bottom-3 right-3 z-10"
          onClick={e => e.preventDefault()} // ngăn link navigate khi bấm tim
        >
          <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-200 hover:border-red-500/50 hover:bg-black/80 active:scale-90">
            <FavoriteButton phim={movie} compact />
          </div>
        </div>

        {/* ── YEAR — bottom left, nhỏ ── */}
        {movie.year && (
          <div className="absolute bottom-3 left-3 z-10 text-[9px] font-bold text-zinc-400">
            {movie.year}
          </div>
        )}

      </Link>

      {/* ── INFO BELOW POSTER ── */}
      <div className="pt-2.5 px-0.5 space-y-0.5">

        {/* Tên phim */}
        <h3 className="text-white font-black text-[12px] md:text-[13px] leading-snug line-clamp-1 tracking-tight group-hover:text-red-500 transition-colors duration-200">
          {movie.name}
        </h3>

        {/* Tên gốc + quality */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-wider truncate">
            {movie.origin_name || movie.original_name || ''}
          </p>
          {movie.quality && (
            <span className="flex-shrink-0 text-[8px] font-black text-zinc-600 uppercase tracking-widest">
              {movie.quality}
            </span>
          )}
        </div>

      </div>
    </div>
  );
}