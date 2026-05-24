'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SecretChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  
  const chatContainerRef = useRef(null);
  const router = useRouter();

  // Mật mã bí mật tối cao của anh
  const SECRET_KEYWORD = "ghequa"; 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.toLowerCase() === SECRET_KEYWORD) {
      router.push('/epo');
      setIsOpen(false);
      setInput('');
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setInput('');
    }
  };

  // 🚀 ĐÃ THÊM: Tự động đóng khay nhập mật mã khi click ra ngoài vùng trống
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={chatContainerRef} className="relative font-sans shrink-0">
      
      {/* 🚀 ĐÃ CẬP NHẬT: Toggle Button dạng Icon nhỏ gọn, thanh lịch nằm vừa vặn trên Header */}
      {/* ── 🚀 ĐÃ SỬA: Đồng bộ 100% phom dáng icon trần với hệ thống Header ── */}
<button
  type="button"
  onClick={() => setIsOpen(!isOpen)}
  className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 active:scale-90 ${
    isOpen 
      ? 'text-red-400 bg-red-500/10' // Khi mở: Hiện nền đỏ mờ giống hệt quả chuông thông báo lúc active
      : 'text-zinc-500 hover:text-white hover:bg-white/5' // Khi đóng: Chìm hẳn và chỉ sáng lên khi hover giống các icon khác
  }`}
  title="Private Channel"
>
  {isOpen ? (
    // Biểu tượng dấu X nhỏ gọn khi đang mở khay mật mã
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ) : (
    // Biểu tượng bong bóng chat trần, thanh mảnh đồng điệu với kính lúp và quả chuông
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )}
</button>

      {/* ── 🚀 KHAY NHẬP MẬT MÃ THẢ RỚT TỪ HEADER XUỐNG ── */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-[#111114]/95 backdrop-blur-2xl border border-white/5 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[180] origin-top-right">
          <div className="p-4 border-b border-white/[0.02] flex items-center gap-2.5 bg-white/[0.01]">
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">Private Channel</span>
          </div>
          
          <div className="p-5">
            <p className="text-zinc-500 text-[10px] mb-3.5 leading-relaxed font-bold italic">
              &quot;One Piece&quot;
            </p>
            <form onSubmit={handleSubmit} className="relative">
              <input
                autoFocus
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập mật mã..."
                className={`w-full bg-zinc-950 border ${error ? 'border-red-600 animate-shake' : 'border-white/5'} rounded-xl py-2.5 px-4 text-[11px] focus:outline-none focus:border-red-600 transition-all text-white placeholder:text-zinc-700 font-bold`}
              />
            </form>
          </div>
        </div>
      )}

      {/* CSS Hiệu ứng rung lắc khi gõ sai mật mã */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.15s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
}