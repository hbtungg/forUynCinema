'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Unlock, KeyRound, X } from 'lucide-react'; // 🚀 1. ĐÃ NẠP ICON HUYỀN BÍ

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
    <div ref={chatContainerRef} className="relative font-sans shrink-0" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 relative focus:outline-none cursor-pointer ${isOpen
            ? 'text-[#E6C687] bg-[#E6C687]/10 border border-[#E6C687]/20'
            : 'text-[#e8e1da]/60 hover:text-[#ffe3ae] hover:scale-110'
          }`}
        title="Private Channel"
      >
        {isOpen ? (
          <Unlock className="w-3.5 h-3.5 animate-pulse" />
        ) : (
          <Lock className="w-3.5 h-3.5" />
        )}
      </button>

      {/* ── 🚀 KHAY NHẬP MẬT MÃ THẢ RỚT KÍNH MỜ XANH ĐÊM LUXURY ── */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-64 bg-[#0F1326]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[180] origin-top-right">

          {/* Header khay mật mã */}
          <div className="px-3 py-2 border-b border-white/5 bg-white/[0.02] rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[#E6C687] text-[10px]">✨</span>
              <p className="text-[8px] font-black text-[#d0c5b5]/40 uppercase tracking-[0.25em]">Private Channel</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[#d0c5b5]/20 hover:text-white transition-colors focus:outline-none">
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Khối Input nhập liệu tinh tế */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-[10px] text-[#d0c5b5]/50 font-bold italic pl-1">
              <KeyRound className="w-3 h-3 text-[#E6C687]/50" />
              <span>&quot;One Piece&quot;</span>
            </div>

            <form onSubmit={handleSubmit} className="relative">
              <input
                autoFocus
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập mật mã..."
                /* 🚀 FIX CHÍ MẠNG: Đồng bộ input với SearchBox, đổi sang màu vàng dịu nhẹ khi gõ sai */
                className={`w-full bg-white/[0.03] border ${error ? 'border-amber-500/50 bg-amber-500/5 animate-shake' : 'border-white/5 focus-within:border-[#E6C687]/30'
                  } rounded-xl py-2 px-3.5 text-xs text-white outline-none placeholder:text-[#d0c5b5]/20 font-semibold tracking-wide transition-all duration-300`}
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