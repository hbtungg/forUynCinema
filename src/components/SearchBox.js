'use client';
import { useState } from 'react';

export default function SearchBox() {
  const [keyword, setKeyword] = useState('');

  const executeSearch = () => {
    if (keyword.trim()) {
      window.location.href = `/search?keyword=${encodeURIComponent(keyword)}`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  return (
    /* ĐÃ SỬA: justify-end trên Mobile để dạt hàng phẳng, md:justify-start để PC lướt sang trái mượt mà */
    <div className="relative w-full flex items-center gap-2 justify-end md:justify-start">
      
      {/* KHỐI HỘP NHẬP TEXT INPUT */}
      <div className="relative flex-1 max-w-xl">
        <input 
          type="text" 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search..." 
          // Cực kỳ vừa vặn: Giữ nguyên padding bọc và phom dáng bo tròn lộng lẫy của anh
          className="w-full bg-zinc-900/80 border border-zinc-800 rounded-full py-2 md:py-2.5 px-6 pr-12 text-xs md:text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all text-white placeholder:text-zinc-600"
        />
        {/* Icon kính lúp nhỏ mờ nằm chìm ở góc trong cùng bên phải input */}
        {/* <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="md:w-4 md:h-4">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </div> */}
      </div>

      {/* ── 🚀 NÚT "TÌM →" ĐỎ RỰC QUYỀN LỰC DÀNH RIÊNG CHO MOBILE ── */}
      {/* ĐÃ SỬA LUỒNG: Ép class "md:hidden" — Nút này sẽ hiển thị rực rỡ trọn vẹn trên Mobile/Tablet nhỏ */}
      {/* Còn trên PC lớn, ô nhập chữ tự nới rộng và dùng phím Enter làm lệnh tối cao, ẩn nút đỏ đi để chống đè nút */}
      <button 
        onClick={executeSearch}
        className="md:hidden bg-red-600 hover:bg-red-700 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full transition-all duration-300 shadow-lg shadow-red-900/20 active:scale-95 group flex-shrink-0"
      >
        <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          Tìm <span className="group-hover:translate-x-1 transition-transform">→</span>
        </span>
      </button>

    </div>
  );
}