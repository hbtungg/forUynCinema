'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthModal } from '@/context/AuthModalContext'; // Gọi lớp bọc thông báo của anh

export default function WatchPlayer({ 
  movie, 
  currentEp, 
  selectedServer, 
  epName, 
  isLoading, 
  iframeError, 
  getEmbedUrl, 
  setIsLoading, 
  setIframeError 
}) {
  const { data: session, status } = useSession(); // Lấy trạng thái đăng nhập
  
  // 🚀 ĐÃ SỬA CHÍNH XÁC: Đổi từ 'openLoginModal' thành 'openAuthModal' cho khớp với AuthModalContext.js
  const { openAuthModal } = useAuthModal(); 

  // 🚀 ĐÃ SỬA CHÍNH XÁC: Gọi đúng hàm openAuthModal và truyền kèm tên bộ phim vào
  useEffect(() => {
    if (status === 'unauthenticated' && typeof openAuthModal === 'function') {
      openAuthModal(movie?.name || ''); 
    }
  }, [status, openAuthModal, movie?.name]);

  // VÒNG CHỜ CHUYỂN TRẠNG THÁI HỆ THỐNG
  if (status === 'loading') {
    return (
      <div className="relative w-full bg-black flex flex-col items-center justify-center gap-3" style={{ aspectRatio: '16/9' }}>
        <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-zinc-600 animate-spin" />
        <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-black">Đang kiểm tra quyền...</span>
      </div>
    );
  }

  // 🚀 CHỐT CHẶN BẢO VỆ: KHÓA CỨNG KHUNG PHÁT PHIM NẾU CHƯA ĐĂNG NHẬP
  if (!session) {
    return (
      <div className="relative w-full bg-[#0d0d11] border border-white/[0.02] flex flex-col items-center justify-center gap-4 px-6 text-center select-none" style={{ aspectRatio: '16/9' }}>
        <div className="w-12 h-12 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 text-lg font-black animate-pulse">
          🔒
        </div>
        <div className="space-y-1">
          <p className="text-sm font-black text-white uppercase tracking-wider">Nội dung giới hạn</p>
          <p className="text-zinc-500 text-[11px] font-medium tracking-wide">
            Vui lòng đăng nhập tài khoản Premium để thưởng thức bom tấn <span className="text-red-400 font-bold">“{movie?.name}”</span>
          </p>
        </div>
        <button
          onClick={() => openAuthModal(movie?.name || '')} // Sửa nốt ở đây thành openAuthModal
          className="mt-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-95 shadow-[0_4px_25px_rgba(220,38,38,0.25)]"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  // ── 🚀 ĐÃ ĐĂNG NHẬP CHUẨN CHỈ: TRẢ VỀ GIAO DIỆN PHÁT PHIM NGUYÊN BẢN CỦA ANH ──
  return (
    <div className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
      {/* Title overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 px-5 pt-4 pb-10 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <p className="text-[13px] font-black text-white leading-none">{movie?.name}</p>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          S{selectedServer + 1}E{epName}
          {currentEp?.title ? ` · ${currentEp.title}` : ''}
        </p>
      </div>

      {/* Spinner */}
      {isLoading && !iframeError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black">
          <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-red-600 animate-spin" />
          <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-black">Đang tải...</span>
        </div>
      )}

      {/* Error */}
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
          className="w-full h-full"
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