'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EpoSort({ currentOrder, query }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  const options = [
    { label: 'Mới nhất', value: 'latest' },
    { label: 'Xem nhiều (Tất cả)', value: 'most-popular' },
    { label: 'Hot tuần này', value: 'top-weekly' },
    { label: 'Hot tháng này', value: 'top-monthly' },
    { label: 'Đánh giá cao', value: 'top-rated' },
    { label: 'Dài nhất', value: 'longest' },
    { label: 'Ngắn nhất', value: 'shortest' },
  ];

  const currentLabel = options.find(opt => opt.value === currentOrder)?.label || 'Mới nhất';

  // Đóng dropdown khi bấm ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    router.push(`/epo?q=${query}&order=${val}&page=1`);
    setIsOpen(false);
  };

  return (
    <div className="relative z-[100] font-sans" ref={dropdownRef}>
      {/* NÚT BẤM CHÍNH */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 px-5 py-3 rounded-2xl hover:border-neutral-600/50 transition-all duration-300 group"
      >
        <span className="text-[10px] font-semibold uppercase text-zinc-500 tracking-widest group-hover:text-zinc-400">
          Sắp xếp:
        </span>
        <span className="text-[11px] font-semibold uppercase text-white tracking-widest flex items-center gap-2">
          {currentLabel}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="12" height="12" 
            fill="currentColor" 
            viewBox="0 0 16 16"
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-neutral-300' : 'text-zinc-600'}`}
          >
            <path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
          </svg>
        </span>
      </button>

      {/* DANH SÁCH OPTION (MENU BUNG RA) */}
      {isOpen && (
        <div className="absolute top-full mt-3 right-0 w-64 bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800/80 rounded-[2rem]  overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="py-3 px-2">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-5 py-3.5 rounded-xl text-[10px] font-semibold uppercase tracking-widest transition-all flex items-center justify-between group/item ${
                  currentOrder === opt.value 
                  ? 'bg-neutral-700/10 text-neutral-300' 
                  : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-white'
                }`}
              >
                {opt.label}
                {currentOrder === opt.value && (
                  <div className="w-1.5 h-1.5 bg-neutral-700 rounded-full "></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}