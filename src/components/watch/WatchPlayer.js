'use client';

import { useEffect } from 'react';
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
  collapsed
}) {
  const { data: session, status } = useSession();

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
  const playerLayoutClass = 'w-full h-[68vh]'; 

  // ── 🚀 VÒNG CHỜ CHUYỂN TRẠNG THÁI HỆ THỐNG KÍNH MỜ ──
  if (status === 'loading') {
    return (
      <div 
        className={`relative bg-[#0F1326]/40 backdrop-blur-2xl border border-white/5 rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-3 shadow-2xl transition-all duration-300 ${playerLayoutClass}`}
        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
      >
        <Loader2 className="w-8 h-8 border-2 border-[#E6C687]/20 border-t-[#E6C687] rounded-full animate-spin text-[#E6C687]" />
        <span className="text-[10px] uppercase tracking-widest text-[#d0c5b5]/40 font-bold">Đang kiểm tra quyền...</span>
      </div>
    );
  }

  // ── 🚀 CHỐT CHẶN BẢO VỆ: KHÓA CỨNG KHUNG PHÁT PHIM NẾU CHƯA ĐĂNG NHẬP (BẢN MOONLIGHT GOLD) ──
  if (!session) {
    return (
      <div 
        className={`relative bg-[#0F1326]/40 backdrop-blur-2xl border border-white/5 rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-4 px-6 text-center select-none shadow-2xl transition-all duration-300 ${playerLayoutClass}`}
        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
      >
        <div className="w-12 h-12 rounded-full bg-[#E6C687]/10 border border-[#E6C687]/20 flex items-center justify-center text-[#E6C687] animate-pulse shadow-[0_0_15px_rgba(230,198,135,0.15)]">
          <Lock className="w-5 h-5 text-[#E6C687]" />
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-bold text-white uppercase tracking-wider">Nội dung giới hạn</p>
          <p className="text-[#d0c5b5]/40 text-[11px] font-medium tracking-wide max-w-md">
            Vui lòng đăng nhập tài khoản để thưởng thức bom tấn <span className="text-[#ffe3ae] font-bold">“{movie?.name}”</span>
          </p>
        </div>
        
        <Link
          href="/login"
          className="mt-2 px-6 py-2.5 bg-[#E6C687]/10 hover:bg-[#E6C687] border border-[#E6C687]/20 text-[#E6C687] hover:text-[#402d00] font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-95 shadow-lg"
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
      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
    >
      {/* Title overlay thông tin phim lướt mờ sương nhẹ thượng tầng */}
      <div className="absolute top-0 left-0 right-0 z-10 px-5 pt-4 pb-12 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <p className="text-xs md:text-sm font-bold text-white tracking-wide uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">{movie?.name}</p>
        <p className="text-[10px] text-[#d0c5b5]/40 mt-1 font-semibold uppercase font-mono tracking-wider">
          Server: {selectedServer + 1} · Tập: {epName}
          {currentEp?.title ? ` · ${currentEp.title}` : ''}
        </p>
      </div>

      {/* Lớp phủ Ảnh Poster đại diện phủ bóng mờ thay thế cho màn hình đen xì khi chưa phát phim */}
      {isLoading && !iframeError && (
        <div 
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-cover bg-center transition-all duration-700"
          style={{ 
            backgroundImage: `linear-gradient(to top, rgba(15,19,38,0.95), rgba(15,19,38,0.7)), url(${movie?.poster_url || movie?.thumb_url})` 
          }}
        >
          <Loader2 className="w-8 h-8 border-2 border-[#E6C687]/20 border-t-[#E6C687] rounded-full animate-spin text-[#E6C687]" />
          <span className="text-[10px] uppercase tracking-widest text-[#ffe3ae] font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Đang cấu hình luồng phát...
          </span>
        </div>
      )}

      {/* Error interface chuẩn khi sập nguồn phim */}
      {iframeError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[#0F1326]/90 backdrop-blur-2xl border border-white/5">
          <Radio className="w-8 h-8 text-amber-500 animate-bounce" />
          <p className="text-[#d0c5b5]/60 text-xs font-bold uppercase tracking-widest">Nguồn phim gặp sự cố</p>
          <button
            onClick={() => { setIframeError(false); setIsLoading(true); }}
            className="px-5 py-2 rounded-xl border border-white/10 bg-white/[0.02] text-[10px] font-bold uppercase tracking-wider text-[#d0c5b5] hover:border-[#E6C687]/40 hover:text-[#ffe3ae] transition-all focus:outline-none cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {currentEp?.embed && !iframeError ? (
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
        <div className="flex items-center justify-center h-full text-[#d0c5b5]/20 text-xs uppercase font-bold tracking-widest italic">
          Không có nguồn phim
        </div>
      ) : null}
    </div>
  );
}