'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function SearchBox() {
  const [keyword, setKeyword] = useState('');
  
  // 🚀 ĐÃ THÊM: Các trạng thái quản lý tìm kiếm tức thì
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // 🚀 ĐÃ THÊM: Luồng tự động tìm kiếm tức thì (Debounce 400ms) khi gõ chữ
  useEffect(() => {
    if (keyword.trim().length < 2) {
      setSearchResults([]);
      setIsOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      setIsOpen(true);
      try {
        const res = await fetch(`https://phim.nguonc.com/api/films/search?keyword=${encodeURIComponent(keyword)}`);
        if (res.ok) {
          const data = await res.json();
          const items = data.items || data.data?.items || [];
          setSearchResults(items.slice(0, 5)); // Chỉ bốc 5 phim đầu tiên cho khay gọn đẹp tinh tế
        }
      } catch (error) {
        console.error("Lỗi tìm kiếm tức thì:", error);
      } finally {
        setLoading(false);
      }
    }, 400); // Chờ người dùng dừng gõ 400ms mới gọi API nhằm bảo vệ server

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  // 🚀 ĐÃ THÊM: Tự đóng dropdown khi người dùng click chuột ra vùng trống bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const executeSearch = () => {
    if (keyword.trim()) {
      setIsOpen(false);
      window.location.href = `/search?keyword=${encodeURIComponent(keyword)}`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  return (
    /* ĐÃ SỬA: Bọc thẻ cha trong ref để bắt sự kiện click outside */
    <div ref={searchContainerRef} className="relative w-full flex items-center gap-2 justify-end md:justify-start">
      
      {/* KHỐI HỘP NHẬP TEXT INPUT */}
      <div className="relative flex-1 max-w-xl">
        <input 
          type="text" 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => keyword.trim().length >= 2 && setIsOpen(true)} // Tự hiện lại kết quả khi focus vào input
          onKeyDown={handleKeyDown}
          placeholder="Search..." 
          className="w-full bg-zinc-900/80 border border-zinc-800 rounded-full py-2 md:py-2.5 px-6 pr-12 text-xs md:text-sm outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/50 transition-all text-white placeholder:text-zinc-600"
        />

        {/* ── 🚀 KHAY DROPDOWN HIỂN THỊ PHIM TỨC THÌ CAO CẤP ── */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#111114]/95 backdrop-blur-2xl border border-white/5 rounded-[1.5rem] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            {loading ? (
              // Trạng thái đang tải dữ liệu mượt mà
              <div className="flex items-center justify-center py-5 gap-2">
                <div className="w-3 h-3 rounded-full border border-zinc-700 border-t-red-500 animate-spin" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Đang tìm kiếm...</span>
              </div>
            ) : searchResults.length > 0 ? (
              // Trạng thái bới ra dữ liệu phim
              <div className="space-y-0.5">
                <div className="px-2.5 py-1.5 text-[8px] font-black uppercase tracking-widest text-zinc-600 border-b border-white/[0.02] mb-1">
                  Kết quả phù hợp nhất
                </div>
                
                {searchResults.map((movie) => (
                  <Link
                    key={movie.slug}
                    href={`/watch/${movie.slug}`}
                    onClick={() => setIsOpen(false)} // Bấm cái tự ẩn dropdown luôn
                    className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/[0.04] transition-all group/item"
                  >
                    {/* Ảnh poster mini */}
                    <div className="w-8 h-11 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-950 border border-white/[0.02]">
                      <img 
                        src={movie.thumb_url || movie.poster_url} 
                        alt="" 
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    
                    {/* Thông tin chữ gọn gàng */}
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-[11px] font-bold text-zinc-200 group-hover/item:text-red-400 transition-colors truncate leading-tight">
                        {movie.name}
                      </h4>
                      <p className="text-[9px] text-zinc-500 font-medium truncate mt-1">
                        {movie.year || '2026'} • <span className="text-zinc-600 font-bold">{movie.current_episode || movie.episode_current || 'Full'}</span>
                      </p>
                    </div>

                    {/* Mũi tên nhỏ ở rìa phải */}
                    <span className="text-zinc-700 group-hover/item:text-zinc-400 transition-colors text-[9px] pr-1.5">➔</span>
                  </Link>
                ))}
              </div>
            ) : (
              // Gõ từ khóa nhưng API báo không có phim
              <div className="text-center py-5 text-[10px] text-zinc-500 font-medium">
                Không tìm thấy phim phù hợp. 📡
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 🚀 NÚT "TÌM →" ĐỎ RỰC QUYỀN LỰC DÀNH RIÊNG CHO MOBILE ── */}
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