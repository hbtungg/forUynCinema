'use client';
import { useState } from 'react';

export default function SearchBox() {
  const [keyword, setKeyword] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter' && keyword.trim()) {
      // Cách này là chắc chắn nhất nè anh: Ép trình duyệt load thẳng trang search
      window.location.href = `/search?keyword=${encodeURIComponent(keyword)}`;
    }
  };

  return (
    <div className="relative w-full md:w-80">
      <input 
        type="text" 
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleSearch}
        placeholder="Tìm phim rồi nhấn Enter..." 
        className="w-full bg-zinc-900/80 border border-zinc-800 rounded-full py-2.5 px-6 text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all text-white placeholder:text-zinc-600"
      />
    </div>
  );
}