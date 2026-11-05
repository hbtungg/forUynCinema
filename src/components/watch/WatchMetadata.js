'use client';

import { useState } from 'react';
import { Heart, Share2, Plus, AlertTriangle, Star, Calendar } from 'lucide-react';

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
  const descriptionText = movie.description || movie.content || movie.desc || movie.summary || movie.overview || '';
  const [shareToast, setShareToast] = useState(false); // State quản lý thông báo sao chép link

  // 🧠 Hàm xử lý chia sẻ: Tự động copy URL hiện tại và hiện Toast thông báo
  const handleShareClick = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      // Tự động ẩn thông báo sau 2 giây
      setTimeout(() => setShareToast(false), 2000);
    }
  };

  return (
    <div className="space-y-6 relative select-none font-sans" style={{ fontFamily: "var(--font-main)" }}>
      
      {/* ── 🚀 THÔNG BÁO TOAST CHIA SẺ PHA LÊ MOONLIGHT GOLD ── */}
      {shareToast && (
        <div className="fixed bottom-10 right-10 z-[999] bg-white/[0.04] border border-[#e8e8e8]/30 backdrop-blur-2xl text-[#ffffff] text-[10px] font-bold uppercase tracking-widest px-5 py-3 rounded-2xl  animate-in slide-in-from-bottom-5 duration-300 flex items-center gap-2">
          <span>✨</span> Đã sao chép liên kết phim!
        </div>
      )}

      {/* ── 🎬 TITLE & RATING LAYER (BO GÓC & MỜ SƯƠNG) ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/5 pb-6">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold tracking-wide text-white uppercase" style={{ textShadow: 'none' }}>
              {movie.name}
            </h1>
            {movie.year && (
              <span className="text-[10px] font-bold font-mono bg-[#e8e8e8]/10 border border-[#e8e8e8]/20 px-2 py-0.5 rounded-md text-[#ffffff] flex items-center gap-1">
                <Calendar className="w-3 h-3 opacity-60" /> {movie.year}
              </span>
            )}
          </div>

          {movie.original_name && (
            <p className="text-[#808080] text-[11px] font-semibold tracking-wider uppercase leading-none">
              Tên gốc: {movie.original_name}
            </p>
          )}

          {/* Hệ thống Badge kính mờ gọn gàng chuẩn Moonlight Gold */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[9px] font-bold uppercase tracking-widest bg-neutral-800/10 border border-neutral-800/20 px-2.5 py-0.5 rounded-md text-neutral-300">
              18+ Digital
            </span>
            {movie.quality && (
              <span className="text-[9px] font-bold uppercase tracking-widest bg-white/[0.04] border border-white/5 px-2.5 py-0.5 rounded-md text-[#b8b8b8]">
                Cinema {movie.quality}
              </span>
            )}
            {movie.language && (
              <span className="text-[9px] font-bold uppercase tracking-widest bg-white/[0.04] border border-white/5 px-2.5 py-0.5 rounded-md text-[#b8b8b8]">
                Audio {movie.language}
              </span>
            )}
          </div>

          <p className="text-[#808080] text-[11px] font-medium tracking-wide">
            {[genre, country, movie.time].filter(Boolean).join(' · ')}
          </p>
        </div>

        {/* Cụm Đánh giá ★ chuẩn NguồnC động */}
        <div className="shrink-0 text-left sm:text-right group bg-white/[0.01] border border-white/5 p-2.5 rounded-2xl min-w-[110px]">
          <div className="flex items-center sm:justify-end gap-1.5 text-[#ffffff] font-bold text-xl  transition-transform duration-300 group-hover:scale-105">
            <Star className="w-4 h-4 fill-current text-[#e8e8e8]" />
            <span className="font-mono">{movie.rating || '9.2'}</span>
            <span className="text-[#808080] text-xs font-normal font-sans">/10</span>
          </div>
          <p className="text-[8px] text-[#808080] font-bold uppercase tracking-widest mt-1">Quan Sát Động</p>
        </div>
      </div>

      {/* ── 🚀 ACTION BUTTONS PREMIUM (ĐỒNG BỘ MÀU VÀNG PHA LÊ) ── */}
      <div className="flex flex-wrap items-center gap-2">
        
        {/* Nút Yêu Thích Động chuẩn Moonlight */}
        <button 
          onClick={onToggleFavorite}
          disabled={favLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 active:scale-95 disabled:opacity-40 cursor-pointer focus:outline-none ${
            isFavorite
              ? 'bg-[#e8e8e8]/10 border-[#e8e8e8]/40 text-[#ffffff] '
              : 'bg-white/[0.02] border-white/5 text-[#b8b8b8] hover:border-[#e8e8e8]/30 hover:text-[#ffffff] hover:bg-white/5'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${isFavorite ? 'fill-current text-[#e8e8e8]' : ''}`} />
          <span>{isFavorite ? 'Đã yêu thích' : 'Yêu thích'}</span>
        </button>

        {/* Nút Thêm Vào */}
        <button className="bg-white/[0.02] border-white/5 text-[#b8b8b8] hover:border-[#e8e8e8]/30 hover:text-[#ffffff] hover:bg-white/5 flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 active:scale-95 cursor-pointer focus:outline-none">
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm vào</span>
        </button>

        {/* Nút Chia Sẻ Động */}
        <button 
          onClick={handleShareClick}
          className="bg-white/[0.02] border-white/5 text-[#b8b8b8] hover:border-[#e8e8e8]/30 hover:text-[#ffffff] hover:bg-white/5 flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all duration-300 active:scale-95 cursor-pointer focus:outline-none"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Chia sẻ</span>
        </button>

        {/* Nút Báo Lỗi gạt sang lề phải */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-white/5 bg-white/[0.02] text-[#808080] hover:border-neutral-800/40 hover:text-neutral-300 transition-all duration-300 sm:ml-auto group cursor-pointer focus:outline-none">
          <AlertTriangle className="w-3.5 h-3.5 group-hover:animate-pulse text-neutral-300/60 group-hover:text-neutral-300" />
          <span>Báo lỗi nguồn phim</span>
        </button>
      </div>

      {/* ── 📖 DESCRIPTION KÍNH MỜ ── */}
      <div className="border-t border-white/5 pt-5">
        <div className={`text-[#b8b8b8] text-xs md:text-sm font-medium leading-relaxed overflow-hidden transition-all duration-300 ease-out text-justify ${isDescExpanded ? '' : 'max-h-[3.6rem]'}`}>
          {descriptionText ? (
            <div dangerouslySetInnerHTML={{ __html: descriptionText }} className="html-content" />
          ) : (
            <p className="text-[#808080] italic">Đang cập nhật nội dung phim.</p>
          )}
        </div>
        {descriptionText && (
          <button
            onClick={() => setIsDescExpanded(v => !v)}
            className="flex items-center gap-1 mt-2 text-[9px] font-bold uppercase tracking-widest text-[#808080] hover:text-[#ffffff] transition-colors py-1 cursor-pointer focus:outline-none"
          >
            {isDescExpanded ? 'Thu gọn cốt truyện ▲' : 'Hiển thị thêm cốt truyện ▼'}
          </button>
        )}
      </div>

      {/* ── 🎬 PRODUCTION LAYERS TỐI GIẢN ── */}
      <div className="border-t border-white/5 pt-5 flex flex-col gap-3 text-xs text-[#b8b8b8] font-medium tracking-wide">
        <p className="flex flex-wrap items-center">
          <span className="text-[#808080] font-bold uppercase tracking-widest text-[9px] mr-4 min-w-[70px]">Đạo diễn:</span>
          <span className="text-[#ffffff] font-bold">{directorText}</span>
        </p>
        {movie.casts && (
          <p className="flex flex-wrap items-start">
            <span className="text-[#808080] font-bold uppercase tracking-widest text-[9px] mr-4 min-w-[70px] pt-0.5">Diễn viên:</span>
            <span className="text-[#ffffff]/70 flex-1 font-semibold italic leading-relaxed">
              {movie.casts}
            </span>
          </p>
        )}
      </div>

    </div>
  );
}