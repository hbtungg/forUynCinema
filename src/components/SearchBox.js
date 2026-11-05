'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search } from 'lucide-react';

export default function SearchBox() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // Luồng tự động tìm kiếm tức thì (Debounce 400ms) giữ nguyên logic bọc thép
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
          setSearchResults(items.slice(0, 5)); 
        }
      } catch (error) {
        console.error("Lỗi tìm kiếm tức thì:", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

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
    const cleanKeyword = keyword.trim();
    if (cleanKeyword) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(cleanKeyword)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  // 🚀 ĐÃ THÊM: Chuẩn hóa ảnh mini cho Dropdown để không bị 404
  const getMiniCleanImage = (movie) => {
    if (!movie) return '';
    const isKKPhim = movie.provider === 'kkphim' || 
                     (movie.thumb_url && movie.thumb_url.includes('phimapi.com'));
    let rawUrl = isKKPhim 
      ? (movie.poster_url || movie.thumb_url || '')
      : (movie.thumb_url || movie.poster_url || '');

    if (!rawUrl) return '';
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) return rawUrl;
    const baseDomain = isKKPhim ? 'https://img.phimapi.com' : 'https://phim.nguonc.com';
    return `${baseDomain}/${rawUrl.replace(/^\//, '')}`;
  };

  return (
    <div ref={searchContainerRef} className="relative w-full flex items-center gap-2 justify-end lg:justify-start" style={{ fontFamily: "var(--font-main)" }}>
      
      {/* KHỐI HỘP NHẬP TEXT INPUT CHUẨN PHA LÊ ĐÊM TỐI GIẢN CAO CẤP */}
      <div className="relative flex-1 max-w-xs lg:max-w-md">
        {/* 🚀 VÁ UI CHÍ MẠNG: Tăng độ tương phản border-white/10 và nâng nền bg-white/[0.03] để hiện rõ khối trên Header */}
        <div className="relative flex items-center bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 gap-2.5 focus-within:border-[#e8e8e8]/40 focus-within:bg-white/[0.04] focus-within: transition-all duration-300">
          <Search className="w-3.5 h-3.5 text-[#b8b8b8] flex-shrink-0 transition-colors duration-300 group-focus-within:text-[#e8e8e8]" />
          <input 
            type="text"
            aria-label="Tìm kiếm phim" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => keyword.trim().length >= 2 && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Tìm kiếm phim..." 
            /* Tăng placeholder lên text-[#808080] để chữ không bị chìm nghỉm */
            className="bg-transparent border-none outline-none text-xs text-[#ffffff] placeholder:text-[#808080] w-40 lg:w-52 font-sans tracking-wide font-medium"
          />
        </div>

        {/* ── 🚀 KHAY DROPDOWN HIỂN THỊ KẾT QUẢ KÍNH MỜ XANH ĐÊM LUXURY ── */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-3 glass-surface border border-white/10 rounded-2xl p-1.5  overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            {loading ? (
              <div className="flex items-center justify-center py-6 gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-[#e8e8e8]/20 border-t-[#e8e8e8] animate-spin" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#808080] font-mono">Scanning stars...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-0.5">
                <div className="px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.25em] text-[#808080] border-b border-white/5 mb-1 flex items-center gap-1.5">
                  <span className="text-[#e8e8e8]">✨</span> Phim phù hợp nhất
                </div>
                
                {searchResults.map((movie) => (
                  <Link
                    key={movie.slug}
                    href={`/watch/${movie.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-300 group/item"
                  >
                    {/* Ảnh poster mini bo góc tròn */}
                    <div className="w-8 h-11 flex-shrink-0 rounded-lg overflow-hidden bg-[#0b0b0b] border border-white/5">
                      <img 
                        src={getMiniCleanImage(movie)} 
                        alt="" 
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    
                    {/* Thông tin chữ */}
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-[11px] font-bold text-[#ffffff] group-hover/item:text-[#ffffff] transition-colors truncate leading-tight tracking-wide">
                        {movie.name}
                      </h4>
                      <p className="text-[9px] text-[#808080] font-bold uppercase tracking-wider truncate mt-1.5 font-sans">
                        {movie.year || '2026'} • <span className="text-[#e8e8e8]/80 bg-[#e8e8e8]/10 px-1.5 py-0.5 rounded-md text-[8px]">{movie.current_episode || movie.episode_current || 'Full'}</span>
                      </p>
                    </div>

                    <span className="text-[#808080] group-hover/item:text-[#e8e8e8] group-hover/item:translate-x-0.5 transition-all text-[9px] pr-1.5 font-mono">➔</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-[9px] text-[#808080] font-semibold uppercase tracking-widest font-mono">
                Không tìm thấy tọa độ phim 📡
              </div>
            )}
          </div>
        )}
      </div>

      {/* NÚT TÌM KIẾM DÀNH CHO MOBILE TINH GỌN PHẲNG LỲ */}
      <button 
        onClick={executeSearch}
        className="lg:hidden bg-[#e8e8e8]/10 hover:bg-[#e8e8e8] text-[#e8e8e8] hover:text-[#050505] font-semibold text-[10px] uppercase tracking-widest px-4 py-2 rounded-full border border-[#e8e8e8]/20 transition-all duration-300 active:scale-95 flex-shrink-0 focus:outline-none"
      >
        Tìm
      </button>

    </div>
  );
}