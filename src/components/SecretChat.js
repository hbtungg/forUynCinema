'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SecretChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const SECRET_KEYWORD = "ghequa"; // Anh có thể đổi thành mật mã riêng của 2 người

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.toLowerCase() === SECRET_KEYWORD) {
      router.push('/epo');
      setIsOpen(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] font-sans">
      {/* 1. Chat Box */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 bg-zinc-950 border border-zinc-800 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,1)] overflow-hidden transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-5 border-b border-zinc-900 flex items-center gap-3 bg-zinc-900/20">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Private Message</span>
          </div>
          
          <div className="p-6">
            <p className="text-zinc-500 text-[11px] mb-4 leading-relaxed font-medium italic">
              "One Piece"
            </p>
            <form onSubmit={handleSubmit} className="relative">
              <input
                autoFocus
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="..."
                className={`w-full bg-zinc-900 border ${error ? 'border-red-600 animate-shake' : 'border-zinc-800'} rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-red-600 transition-all text-white placeholder:text-zinc-700 font-bold`}
              />
            </form>
          </div>
        </div>
      )}

      {/* 2. Toggle Button (Biểu tượng tin nhắn) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl border ${
          isOpen ? 'bg-white border-white rotate-90' : 'bg-red-600 border-red-500 hover:scale-110'
        }`}
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
}