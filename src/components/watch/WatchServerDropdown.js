'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Server } from 'lucide-react';

export default function WatchServerDropdown({ servers, selectedServer, handleServerChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Tự động đóng dropdown nếu người dùng bấm trượt ra ngoài vùng menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!servers || servers.length <= 1) return null;

  return (
    <div className="relative font-sans" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }} ref={dropdownRef}>
      
      {/* NÚT BẤM KÍNH MỜ XANH ĐÊM KHỞI CHẠY DROPDOWN */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full bg-[#0F1326]/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:border-[#E6C687]/30 active:scale-[0.99] transition-all duration-300 focus:outline-none"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d0c5b5]/40 flex items-center gap-2">
          <Server className="w-3.5 h-3.5 text-[#E6C687]/60" /> Máy chủ phát
        </span>
        
        <span className="flex items-center gap-2 text-[10px] font-bold text-[#ffe3ae] uppercase tracking-wider">
          {/* Chòm sao nhấp nháy Moonlight Gold */}
          <span className="w-1.5 h-1.5 rounded-full bg-[#E6C687] shadow-[0_0_8px_#E6C687] animate-pulse" />
          {servers[selectedServer]?.server_name || 'Server TM'}
          <ChevronDown className={`w-3.5 h-3.5 text-[#d0c5b5]/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {/* HỘP KÉN THẢ XUỐNG KÍNH MỜ PHA LÊ CAO CẤP */}
      <div 
        className={`absolute right-0 top-full mt-2 w-full bg-[#0F1326]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-200 z-50 origin-top ${
          isOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
        }`}
      >
        <div className="px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#d0c5b5]/30 border-b border-white/5 mb-1.5">
          Chọn nguồn phát trực tiếp
        </div>
        
        <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1">
          {servers.map((srv, idx) => {
            const isSelected = selectedServer === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  handleServerChange(idx);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all duration-300 flex items-center justify-between cursor-pointer focus:outline-none ${
                  isSelected
                    ? 'bg-[#E6C687]/10 border border-[#E6C687]/20 text-[#ffe3ae] shadow-[0_0_10px_rgba(230,198,135,0.15)]'
                    : 'text-[#d0c5b5]/50 border border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{srv?.server_name || `Server ${idx + 1}`}</span>
                {isSelected && <span className="text-[#E6C687] text-[8px] animate-pulse">●</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}