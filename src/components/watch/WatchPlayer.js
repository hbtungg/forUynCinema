'use client';

import { useEffect, useState } from 'react';
import DirectStreamPlayer from './DirectStreamPlayer';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Lock, Radio, Loader2 } from 'lucide-react';

function normalizeEpisodeLabel(value) {
  if (!value || value === 'Full' || value === 'FULL') return 'FULL';

  const text = String(value).trim();

  if (/^tập\s*/i.test(text)) {
    return text.replace(/^tập\s*/i, 'Tập ');
  }

  if (/^ep\s*\d+/i.test(text)) {
    return text.replace(/^ep\s*/i, 'Tập ');
  }

  if (/^\d+$/i.test(text)) {
    return `Tập ${text}`;
  }

  return text.startsWith('Tập ') ? text : `Tập ${text}`;
}

export default function WatchPlayer({ 
  movie, 
  currentEp, 
  selectedServer, 
  epName, 
  isLoading, 
  iframeError, 
  getEmbedUrl, 
  setIsLoading, 
  setIframeError,
  collapsed,
  onProgress,
  resumeSeconds
}) {
  const { data: session, status } = useSession();
  const [embedFallback, setEmbedFallback] = useState('');
  const useDirect = Boolean(currentEp?.m3u8 && embedFallback !== currentEp.m3u8);

  // Theo dõi sát sao biến isLoading để ép đổi tên tab chính xác theo tiến độ nạp phim
  useEffect(() => {
    if (movie?.name && epName) {
      if (isLoading) {
        document.title = `Đang tải phim... - Uynflix`;
      } else {
        const episodeText = normalizeEpisodeLabel(epName);
        document.title = `Đang xem: ${movie.name} - ${episodeText} - Uynflix`;
      }
    }
  }, [movie?.name, epName, isLoading]);

  // Ép cứng chiều cao cố định cho khung phát chuẩn rạp phim
  const playerLayoutClass = 'w-full aspect-video md:aspect-auto md:h-[68vh]';

  // ── 🚀 VÒNG CHỜ CHUYỂN TRẠNG THÁI HỆ THỐNG KÍNH MỜ ──
  if (status === 'loading') {
    return (
      <div 
        className={`relative glass-surface border border-white/5 rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-3 shadow-2xl transition-all duration-300 ${playerLayoutClass}`}
        style={{ fontFamily: "var(--font-main)" }}
      >
        <Loader2 className="w-8 h-8 border-2 border-[#e8e8e8]/20 border-t-[#e8e8e8] rounded-full animate-spin text-[#e8e8e8]" />
        <span className="text-[10px] uppercase tracking-widest text-[#808080] font-bold">Đang kiểm tra quyền...</span>
      </div>
    );
  }

  // ── 🚀 CHỐT CHẶN BẢO VỆ: KHÓA CỨNG KHUNG PHÁT PHIM NẾU CHƯA ĐĂNG NHẬP (BẢN MOONLIGHT GOLD) ──
  if (!session) {
    return (
      <div 
        className={`relative glass-surface border border-white/5 rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-4 px-6 text-center select-none shadow-2xl transition-all duration-300 ${playerLayoutClass}`}
        style={{ fontFamily: "var(--font-main)" }}
      >
        <div className="w-12 h-12 rounded-full bg-[#e8e8e8]/10 border border-[#e8e8e8]/20 flex items-center justify-center text-[#e8e8e8] animate-pulse ">
          <Lock className="w-5 h-5 text-[#e8e8e8]" />
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-bold text-white uppercase tracking-wider">Nội dung giới hạn</p>
          <p className="text-[#808080] text-[11px] font-medium tracking-wide max-w-md">
            Vui lòng đăng nhập tài khoản để thưởng thức bom tấn <span className="text-[#ffffff] font-bold">“{movie?.name}”</span>
          </p>
        </div>
        
        <Link
          href="/login"
          className="mt-2 px-6 py-2.5 bg-[#e8e8e8]/10 hover:bg-[#e8e8e8] border border-[#e8e8e8]/20 text-[#e8e8e8] hover:text-[#050505] font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-95 shadow-lg"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  // ── 🚀 GIAO DIỆN PHÁT PHIM CHÍNH CHUẨN PHA LÊ ──
  return (
    <div 
      className={`relative bg-black border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${playerLayoutClass}`}
      style={{ fontFamily: "var(--font-main)" }}
    >
      {/* Title overlay thông tin phim lướt mờ sương nhẹ thượng tầng */}
      <div className="absolute top-0 left-0 right-0 z-10 px-5 pt-4 pb-12 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <p className="text-xs md:text-sm font-bold text-white tracking-wide uppercase ">{movie?.name}</p>
        <p className="text-[10px] text-[#808080] mt-1 font-semibold uppercase font-mono tracking-wider">
          Server: {selectedServer + 1} · Tập: {epName}
          {currentEp?.title ? ` · ${currentEp.title}` : ''}
        </p>
      </div>

      {/* Lớp phủ Ảnh Poster đại diện phủ bóng mờ thay thế cho màn hình đen xì khi chưa phát phim */}
      {isLoading && !iframeError && (
        <div 
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-cover bg-center transition-all duration-300"
          style={{ 
            backgroundImage: `linear-gradient(to top, rgba(5,5,5,0.95), rgba(5,5,5,0.7)), url(${movie?.poster_url || movie?.thumb_url})` 
          }}
        >
          <Loader2 className="w-8 h-8 border-2 border-[#e8e8e8]/20 border-t-[#e8e8e8] rounded-full animate-spin text-[#e8e8e8]" />
          <span className="text-[10px] uppercase tracking-widest text-[#ffffff] font-bold ">
            Đang cấu hình luồng phát...
          </span>
        </div>
      )}

      {/* Error interface chuẩn khi sập nguồn phim */}
      {iframeError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 glass-surface border border-white/5">
          <Radio className="w-8 h-8 text-neutral-300 " />
          <p className="text-[#b8b8b8] text-xs font-bold uppercase tracking-widest">Nguồn phim gặp sự cố</p>
          <button
            onClick={() => { setIframeError(false); setIsLoading(true); }}
            className="px-5 py-2 rounded-xl border border-white/10 bg-white/[0.02] text-[10px] font-bold uppercase tracking-wider text-[#b8b8b8] hover:border-[#e8e8e8]/40 hover:text-[#ffffff] transition-all focus:outline-none cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {useDirect ? (
        <DirectStreamPlayer key={currentEp.m3u8} url={currentEp.m3u8} resumeSeconds={resumeSeconds}
          onReady={() => setIsLoading(false)} onProgress={onProgress}
          onError={() => { setEmbedFallback(currentEp.m3u8); setIsLoading(false); if (!currentEp?.embed) setIframeError(true); }} />
      ) : currentEp?.embed && !iframeError ? (
        <iframe
          src={getEmbedUrl()}
          className="w-full h-full border-none"
          allowFullScreen
          allow="autoplay; fullscreen"
          title={`${movie?.name} - ${normalizeEpisodeLabel(epName)}`}
          onLoad={() => setIsLoading(false)}
          onError={() => { setIsLoading(false); setIframeError(true); }}
        />
      ) : !iframeError ? (
        <div className="flex items-center justify-center h-full text-[#808080] text-xs uppercase font-bold tracking-widest italic">
          Không có nguồn phim
        </div>
      ) : null}
      {currentEp?.m3u8 && !useDirect && (
        <button onClick={() => { setEmbedFallback(''); setIframeError(false); setIsLoading(true); }}
          className="absolute bottom-2 left-2 z-30 rounded-lg bg-[#0b0b0b] px-3 py-2 text-xs text-[#e8e8e8]">
          Thử nguồn HLS
        </button>
      )}
    </div>
  );
}
