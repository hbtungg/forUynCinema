'use client';

import { useState, useEffect } from 'react';
import { Share, PlusSquare, X, Sparkles } from 'lucide-react';

export default function IOSInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // 1. Kiểm tra xem có đúng là thiết bị iOS (iPhone/iPad) hay không
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    // 2. Kiểm tra xem người dùng đang lướt web thường hay đã cài/mở app dạng PWA (Standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                         || window.navigator.standalone;

    // 3. Kiểm tra xem người dùng đã từng bấm tắt hộp thoại này ở phiên trước chưa
    const isDismissed = localStorage.getItem('uynflix_ios_prompt_dismissed');

    if (isIOS && !isStandalone && !isDismissed) {
      // Delay 3 giây sau khi vào trang chủ rồi mới hiện để tạo cảm giác mượt mà, không bị vồ vập
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    // Lưu lại trạng thái tắt để không làm phiền người dùng trong vòng 7 ngày tới
    localStorage.setItem('uynflix_ios_prompt_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] w-[calc(100%-2rem)] max-w-[360px] animate-in slide-in-from-bottom duration-500 font-sans select-none" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div className="relative bg-[#0F1326]/90 backdrop-blur-2xl border border-[#E6C687]/30 rounded-[24px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-[#e8e1da]">
        
        {/* Nút đóng góc phải */}
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-[#d0c5b5]/40 hover:text-white transition-colors focus:outline-none"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Nội dung chỉ dẫn */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E6C687] animate-pulse" />
            <h4 className="text-xs font-black uppercase tracking-widest text-[#E6C687]">Cài đặt Uynflix App</h4>
          </div>

          <p className="text-xs text-[#d0c5b5]/80 leading-relaxed font-medium">
            Mang rạp phim <span className="text-[#ffe3ae] font-bold">Uynflix</span> ra màn hình chính của anh để trải nghiệm phát video Full-Screen chuẩn điện ảnh IMAX 120Hz mượt mà nhất nhé!
          </p>

          {/* Các bước thao tác mô phỏng đúng chuẩn iOS UI */}
          <div className="bg-black/20 rounded-xl p-3 border border-white/5 space-y-3 text-[11px] font-semibold text-[#d0c5b5]/60">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[#ffe3ae] border border-white/10 shrink-0">
                <Share className="w-3.5 h-3.5 text-[#E6C687]" />
              </div>
              <span>1. Bấm vào nút <span className="text-white font-bold">Chia sẻ (Share)</span> trên thanh công cụ Safari.</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[#ffe3ae] border border-white/10 shrink-0">
                <PlusSquare className="w-3.5 h-3.5 text-[#E6C687]" />
              </div>
              <span>2. Cuộn xuống dưới và chọn mục <span className="text-white font-bold">Thêm vào MH chính (Add to Home Screen)</span>.</span>
            </div>
          </div>

          <button 
            onClick={handleDismiss}
            className="w-full py-2.5 bg-[#E6C687]/10 hover:bg-[#E6C687] border border-[#E6C687]/20 text-[#E6C687] hover:text-[#402d00] font-bold text-[10px] tracking-widest uppercase rounded-xl transition-all duration-300 active:scale-95"
          >
            Đã hiểu
          </button>
        </div>

        {/* Mũi tên nhỏ chỉ xuống nút Share của Safari (Dành riêng cho iPhone) */}
        <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0F1326] border-r border-b border-[#E6C687]/30 rotate-45 hidden md:block" />
      </div>
    </div>
  );
}