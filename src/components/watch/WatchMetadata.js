'use client';

import { useState } from 'react';

export default function WatchMetadata({ 
  movie, 
  genre, 
  country, 
  isDescExpanded, 
  setIsDescExpanded,
  isFavorite,
  favLoading,
  onToggleFavorite
}) {
  const directorText = movie.director || 'Đang cập nhật';
  const [shareToast, setShareToast] = useState(false); // State quản lý thông báo sao chép link

  // 🚀 Hàm xử lý chia sẻ: Tự động copy URL hiện tại và hiện Toast thông báo
  const handleShareClick = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      // Tự động ẩn thông báo sau 2 giây
      setTimeout(() => setShareToast(false), 2000);
    }
  };

  return (
    <div className="space-y-5 relative">
      
      {/* ── 🚀 THÔNG BÁO TOAST CHIA SẺ MINI PREMIUM ── */}
      {shareToast && (
        <div className="fixed bottom-10 right-10 z-[999] bg-zinc-900/90 border border-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-4 py-3 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-5 duration-300">
          ✨ Đã sao chép liên kết phim!
        </div>
      )}

      {/* ── 🎬 TITLE & RATING LAYER ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/[0.03] pb-5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3.5 mb-2">
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white italic drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {movie.name}
            </h1>
            {movie.year && (
              <span className="text-[11px] font-black tabular-nums bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-md text-zinc-400">
                {movie.year}
              </span>
            )}
          </div>

          {movie.original_name && (
            <p className="text-zinc-500 text-[12px] md:text-[13px] font-medium tracking-[0.15em] md:tracking-[0.2em] uppercase opacity-90 mb-2.5 px-0.5">
              {movie.original_name}
            </p>
          )}

          {/* Hệ thống Badge kính mờ gọn gàng */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[9px] font-black uppercase tracking-widest bg-red-600/20 backdrop-blur-xl border border-red-600/40 px-2 py-1 rounded-xl text-red-400 shadow-[0_4px_15px_rgba(220,38,38,0.25)] whitespace-nowrap">
              18+ Digital
            </span>
            {movie.quality && (
              <span className="text-[9px] font-black uppercase tracking-widest bg-[#111114]/90 backdrop-blur-xl border border-white/5 px-2 py-1 rounded-xl text-zinc-300 whitespace-nowrap">
                Cinema {movie.quality}
              </span>
            )}
            {movie.language && (
              <span className="text-[9px] font-black uppercase tracking-widest bg-[#111114]/90 backdrop-blur-xl border border-white/5 px-2 py-1 rounded-xl text-zinc-300 whitespace-nowrap">
                Audio {movie.language}
              </span>
            )}
          </div>

          <p className="text-zinc-500 text-[11px] md:text-[12px] font-medium tracking-wide leading-relaxed">
            {[genre, country, movie.time].filter(Boolean).join(' · ')}
          </p>
        </div>

        {/* Cụm Đánh giá ★ */}
        <div className="shrink-0 text-right group">
          <div className="flex items-center justify-end gap-1 text-amber-400 font-black text-2xl drop-shadow-[0_0_8px_rgba(251,191,36,0.3)] group-hover:scale-105 transition-transform">
            <span className="text-base">★</span>
            <span>9.2</span>
            <span className="text-zinc-600 text-xs font-normal">/ 10</span>
          </div>
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider mt-0.5">12.5K đánh giá</p>
        </div>
      </div>

      {/* ── 🚀 ACTION BUTTONS PREMIUM (ĐÃ KÍCH HOẠT TÍNH NĂNG ĐỘNG) ── */}
      <div className="flex flex-wrap items-center gap-2.5">
        
        {/* Nút Yêu Thích Động */}
        <button 
          onClick={onToggleFavorite}
          disabled={favLoading}
          className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 active:scale-95 disabled:opacity-40 ${
            isFavorite
              ? 'bg-red-600 border-red-600 text-white shadow-[0_4px_15px_rgba(220,38,38,0.3)] font-black'
              : 'bg-red-600/10 border-red-500/25 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-600'
          }`}
        >
          <span>{isFavorite ? '♥' : '♡'}</span>
          {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
        </button>

        {/* Nút Thêm Vào (Giữ nguyên phom để anh làm playlist sau) */}
        <button className="bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white hover:bg-zinc-900 flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 active:scale-95">
          <span>+</span>Thêm vào
        </button>

        {/* Nút Chia Sẻ Động */}
        <button 
          onClick={handleShareClick}
          className="bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white hover:bg-zinc-900 flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 active:scale-95"
        >
          <span>↗</span>Chia sẻ
        </button>

        {/* Nút Báo Lỗi */}
        <button className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-zinc-800 bg-zinc-900/60 text-zinc-500 hover:border-red-600/60 hover:text-red-400 transition-all duration-300 ml-auto group">
          <span className="group-hover:animate-pulse">⚑</span> Báo lỗi nguồn phim
        </button>
      </div>

      {/* ── 📖 DESCRIPTION ── */}
      <div className="border-t border-white/[0.03] pt-5">
        <div className={`text-zinc-400 text-[12px] md:text-[13px] font-medium leading-relaxed overflow-hidden transition-all duration-500 ease-out ${isDescExpanded ? '' : 'max-h-[3.6rem]'}`}>
          <div dangerouslySetInnerHTML={{ __html: movie.description }} />
        </div>
        <button
          onClick={() => setIsDescExpanded(v => !v)}
          className="flex items-center gap-1 mt-1 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors py-1"
        >
          {isDescExpanded ? 'Thu gọn cốt truyện ▲' : 'Hiển thị thêm cốt truyện ▼'}
        </button>
      </div>

      {/* ── 🎬 PRODUCTION LAYERS ── */}
      <div className="border-t border-white/[0.03] pt-5 flex flex-col gap-2.5 text-[11px] md:text-[12px] text-zinc-500 font-medium tracking-wide">
        <p className="flex flex-wrap items-center">
          <span className="text-zinc-600 font-black uppercase tracking-widest text-[9px] mr-3">Đạo diễn:</span>
          <span className="text-zinc-300">{directorText}</span>
        </p>
        {movie.casts && (
          <p className="flex flex-wrap items-center">
            <span className="text-zinc-600 font-black uppercase tracking-widest text-[9px] mr-3">Diễn viên:</span>
            <span className="text-zinc-300 line-clamp-1 hover:text-red-400 transition-colors cursor-default">
              {movie.casts}
            </span>
          </p>
        )}
      </div>

    </div>
  );
}