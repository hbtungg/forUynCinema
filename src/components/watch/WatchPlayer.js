'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

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
  const { data: session, status } = useSession(); // Lấy trạng thái đăng nhập

  // 🚀 ĐÃ SỬA ĐỒNG BỘ: Ép cứng chiều cao cố định (ví dụ h-[68vh]) cho cả 2 trạng thái
  // Anh có thể tăng giảm h-[68vh] thành h-[65vh] hoặc h-[70vh] tùy ý, chiều cao sẽ giữ nguyên khi đóng/mở sidebar!
  const playerLayoutClass = 'w-full h-[68vh]'; 

  // ── 🚀 VÒNG CHỜ CHUYỂN TRẠNG THÁI HỆ THỐNG ──
  if (status === 'loading') {
    return (
      <div 
        className={`relative bg-black border border-white/5 rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-3 shadow-2xl transition-all duration-300 ${playerLayoutClass}`}
      >
        <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-zinc-600 animate-spin" />
        <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-black">Đang kiểm tra quyền...</span>
      </div>
    );
  }

  // ── 🚀 CHỐT CHẶN BẢO VỆ: KHÓA CỨNG KHUNG PHÁT PHIM NẾU CHƯA ĐĂNG NHẬP ──
  if (!session) {
    return (
      <div 
        className={`relative bg-[#0d0d11] border border-white/5 rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-4 px-6 text-center select-none shadow-2xl transition-all duration-300 ${playerLayoutClass}`}
      >
        <div className="w-12 h-12 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 text-lg font-black animate-pulse">
          🔒
        </div>
        <div className="space-y-1">
          <p className="text-sm font-black text-white uppercase tracking-wider">Nội dung giới hạn</p>
          <p className="text-zinc-500 text-[11px] font-medium tracking-wide">
            Vui lòng đăng nhập tài khoản để thưởng thức bom tấn <span className="text-red-400 font-bold">“{movie?.name}”</span>
          </p>
        </div>
        
        <Link
          href="/login"
          className="mt-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-95 shadow-[0_4px_25px_rgba(220,38,38,0.25)]"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  // ── 🚀 GIAO DIỆN PHÁT PHIM CHÍNH NGUYÊN BẢN ──
  return (
    <div 
      className={`relative bg-black border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${playerLayoutClass}`}
    >
      {/* Title overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 px-5 pt-4 pb-10 bg-gradient-to-b from-black/30 to-transparent pointer-events-none">
        <p className="text-[13px] font-black text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">{movie?.name}</p>
        <p className="text-[11px] text-zinc-400 mt-0.5 font-medium">
          S{selectedServer + 1}E{epName}
          {currentEp?.title ? ` · ${currentEp.title}` : ''}
        </p>
      </div>

      {/* Lớp phủ Ảnh Poster đại diện phủ bóng mờ thay thế cho màn hình đen xì khi chưa phát phim */}
      {isLoading && !iframeError && (
        <div 
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-cover bg-center transition-all duration-700"
          style={{ 
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.4)), url(${movie?.poster_url || movie?.thumb_url})` 
          }}
        >
          <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-red-600 animate-spin shadow-lg" />
          <span className="text-[10px] uppercase tracking-widest text-zinc-300 font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Đang cấu hình luồng phát...
          </span>
        </div>
      )}

      {/* Error interface */}
      {iframeError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black">
          <span className="text-4xl">📡</span>
          <p className="text-zinc-400 text-sm font-bold">Nguồn phim gặp sự cố</p>
          <button
            onClick={() => { setIframeError(false); setIsLoading(true); }}
            className="px-5 py-2 rounded-xl border border-zinc-700 text-[11px] font-black uppercase tracking-wider text-zinc-300 hover:border-red-600 hover:text-red-500 transition-all"
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
          title={`${movie?.name} - Tập ${epName}`}
          onLoad={() => setIsLoading(false)}
          onError={() => { setIsLoading(false); setIframeError(true); }}
        />
      ) : !iframeError ? (
        <div className="flex items-center justify-center h-full text-zinc-700 text-sm italic">
          Không có nguồn phim
        </div>
      ) : null}
    </div>
  );
}