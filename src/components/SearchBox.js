'use client';
import { useState } from 'react';

export default function SearchBox() {
  const [keyword, setKeyword] = useState('');

  const executeSearch = () => {
    if (keyword.trim()) {
      // Ép trình duyệt chuyển hướng sang trang kết quả
      window.location.href = `/search?keyword=${encodeURIComponent(keyword)}`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  return (
    <div className="relative w-full md:w-96 flex items-center gap-2">
      <div className="relative flex-1">
        <input 
          type="text" 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tìm phim rồi nhấn Enter..." 
          className="w-full bg-zinc-900/80 border border-zinc-800 rounded-full py-2.5 px-6 pr-12 text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all text-white placeholder:text-zinc-600"
        />
        {/* Biểu tượng kính lúp mờ bên trong ô input cho đẹp */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </div>
      </div>

      {/* NÚT TÌM KIẾM MỚI ĐÂY ANH YÊU */}
      <button 
        onClick={executeSearch}
        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full transition-all duration-300 shadow-lg shadow-red-900/20 active:scale-95 group"
      >
        <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          Tìm <span className="group-hover:translate-x-1 transition-transform">→</span>
        </span>
      </button>
    </div>
  );
}