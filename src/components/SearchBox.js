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

  // 🧠 Luồng tự động tìm kiếm tức thì (Debounce 400ms)
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
          setSearchResults(items.slice(0, 5)); // Bốc 5 phim đầu tiên cho khay gọn đẹp tinh tế
        }
      } catch (error) {
        console.error("Lỗi tìm kiếm tức thì:", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  // Tự đóng dropdown khi click chuột ra ngoài vùng trống
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

  return (
    <div ref={searchContainerRef} className="relative w-full flex items-center gap-2 justify-end lg:justify-start" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      
      {/* KHỐI HỘP NHẬP TEXT INPUT CHUẨN PHA LÊ */}
      <div className="relative flex-1 max-w-xs lg:max-w-md">
        <div className="relative flex items-center bg-[#2d2a25]/50 border border-[#4d463a]/30 rounded-full px-4 py-1.5 gap-2 focus-within:border-[#E6C687]/50 transition-all">
          <Search className="w-4 h-4 text-[#d0c5b5] flex-shrink-0" />
          <input 
            type="text" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => keyword.trim().length >= 2 && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Tìm kiếm phim..." 
            className="bg-transparent border-none outline-none text-sm text-[#e8e1da] placeholder:text-[#d0c5b5]/30 w-44 lg:w-56 font-sans"
          />
        </div>

        {/* ── 🚀 KHAY DROPDOWN HIỂN THỊ KẾT QUẢ KÍNH MỜ XANH ĐÊM ── */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-[#0F1326]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            {loading ? (
              <div className="flex items-center justify-center py-6 gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-[#E6C687]/20 border-t-[#E6C687] animate-spin" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#d0c5b5]/50">Đang tìm kiếm...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-0.5">
                <div className="px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#d0c5b5]/40 border-b border-white/5 mb-1">
                  Tinh tú phù hợp nhất
                </div>
                
                {searchResults.map((movie) => (
                  <Link
                    key={movie.slug}
                    href={`/watch/${movie.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-300 group/item"
                  >
                    {/* Ảnh poster mini bo góc tròn */}
                    <div className="w-8 h-11 flex-shrink-0 rounded-lg overflow-hidden bg-[#0F1326] border border-white/5">
                      <img 
                        src={movie.thumb_url || movie.poster_url} 
                        alt="" 
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    
                    {/* Thông tin chữ */}
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-[11px] font-bold text-[#e8e1da] group-hover/item:text-[#ffe3ae] transition-colors truncate leading-tight">
                        {movie.name}
                      </h4>
                      <p className="text-[9px] text-[#d0c5b5]/40 font-semibold uppercase tracking-wider truncate mt-1">
                        {movie.year || '2026'} • <span className="text-[#E6C687]">{movie.current_episode || movie.episode_current || 'Full'}</span>
                      </p>
                    </div>

                    <span className="text-[#d0c5b5]/20 group-hover/item:text-[#E6C687] transition-colors text-[10px] pr-1.5 font-mono">➔</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-[10px] text-[#d0c5b5]/40 font-semibold uppercase tracking-widest">
                Không tìm thấy phim phù hợp 📡
              </div>
            )}
          </div>
        )}
      </div>

      {/* NÚT TÌM KIẾM DÀNH CHO MOBILE */}
      <button 
        onClick={executeSearch}
        className="lg:hidden bg-[#E6C687]/10 hover:bg-[#E6C687] text-[#E6C687] hover:text-[#402d00] font-bold text-xs px-4 py-1.5 rounded-full border border-[#E6C687]/30 transition-all duration-300 active:scale-95 flex-shrink-0"
      >
        Tìm
      </button>

    </div>
  );
}