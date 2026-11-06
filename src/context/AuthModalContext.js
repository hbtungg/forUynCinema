'use client';
import { createContext, useContext, useState } from 'react'; // 🚀 ĐÃ XÓA: 'useEffect' không cần thiết
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const AuthModalContext = createContext();

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [movieName, setMovieName] = useState('');
  const router = useRouter();

  // 🚀 ĐÃ XÓA BỎ HOÀN TOÀN: Đoạn useEffect (dòng 16-21) gây lỗi Cascading Renders!
  // Trạng thái hiển thị của Modal giờ đây sẽ hoàn toàn do các nút bấm và hàm closeAuthModal quyết định điều hướng.

  const openAuthModal = (name = '') => {
    setMovieName(name);
    setIsOpen(false); //tạm để code
  };

  // Bấm X hoặc click nền mờ sẽ giữ nguyên isOpen = true và ép nhảy về trang chủ
  const closeAuthModal = () => {
    window.location.href = '/home'; // Ép reload cứng cấp trình duyệt để đồng bộ giao diện
  };

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      {children}

      {/* ── 🚀 MODAL YÊU CẦU ĐĂNG NHẬP ── */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            onClick={closeAuthModal} 
            className="absolute inset-0 bg-black/40"
          />

          <div role="dialog" aria-modal="true" aria-label="Đăng nhập để xem phim" className="relative w-full max-w-sm clear-glass glass-popover rounded-3xl p-6 shadow-2xl text-center origin-center animate-in zoom-in-95 duration-200 ease-out text-sm">
            <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center mx-auto mb-4 border border-white/20">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <h3 className="text-base font-semibold text-white tracking-tight mb-2">
              Chân trời điện ảnh đang chờ bạn
            </h3>
            
            <p className="text-[11px] font-medium text-zinc-400 tracking-wide leading-relaxed mb-6 px-2">
              {movieName ? (
                <>Bạn cần có tài khoản để thưởng thức <span className="text-white font-bold">“{movieName}”</span>. Đăng nhập để lưu lại tiến trình xem phim nhé! 🎬</>
              ) : (
                'Vui lòng đăng nhập tài khoản để có thể xem trọn vẹn toàn bộ kho phim Premium của hệ thống. ❤️'
              )}
            </p>

            <div className="flex flex-col gap-2.5">
              <Link
                href="/login"
                onClick={() => { setIsOpen(false); setMovieName(''); }} // Chỉ khi chủ động bấm Đăng nhập mới tắt bảng thông báo
                className="w-full py-3 button-primary text-[11px] font-semibold uppercase tracking-widest rounded-xl transition-all active:scale-95 "
              >
                Đăng nhập ngay
              </Link>
              
              <Link
                href="/register"
                onClick={() => { setIsOpen(false); setMovieName(''); }} // Chỉ khi chủ động bấm Đăng ký mới tắt bảng thông báo
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-zinc-300 hover:text-white text-[11px] font-semibold uppercase tracking-widest rounded-xl transition-all active:scale-95"
              >
                Tạo tài khoản mới
              </Link>
            </div>

            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () => useContext(AuthModalContext);