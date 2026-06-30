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
    <div ref={searchContainerRef} className="relative w-full flex items-center gap-2 justify-end lg:justify-start" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      
      {/* KHỐI HỘP NHẬP TEXT INPUT CHUẨN PHA LÊ ĐÊM TỐI GIẢN CAO CẤP */}
      <div className="relative flex-1 max-w-xs lg:max-w-md">
        {/* 🚀 VÁ UI CHÍ MẠNG: Tăng độ tương phản border-white/10 và nâng nền bg-white/[0.03] để hiện rõ khối trên Header */}
        <div className="relative flex items-center bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 gap-2.5 focus-within:border-[#E6C687]/40 focus-within:bg-[#0F1326]/80 focus-within:shadow-[0_0_20px_rgba(230,198,135,0.08)] transition-all duration-300">
          <Search className="w-3.5 h-3.5 text-[#d0c5b5]/50 flex-shrink-0 transition-colors duration-300 group-focus-within:text-[#E6C687]" />
          <input 
            type="text" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => keyword.trim().length >= 2 && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Tìm kiếm phim..." 
            /* Tăng placeholder lên text-[#d0c5b5]/40 để chữ không bị chìm nghỉm */
            className="bg-transparent border-none outline-none text-xs text-[#e8e1da] placeholder:text-[#d0c5b5]/40 w-40 lg:w-52 font-sans tracking-wide font-medium"
          />
        </div>

        {/* ── 🚀 KHAY DROPDOWN HIỂN THỊ KẾT QUẢ KÍNH MỜ XANH ĐÊM LUXURY ── */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-[#0F1326]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            {loading ? (
              <div className="flex items-center justify-center py-6 gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-[#E6C687]/20 border-t-[#E6C687] animate-spin" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#d0c5b5]/40 font-mono">Scanning stars...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-0.5">
                <div className="px-3 py-2 text-[8px] font-black uppercase tracking-[0.25em] text-[#d0c5b5]/30 border-b border-white/5 mb-1 flex items-center gap-1.5">
                  <span className="text-[#E6C687]">✨</span> Tinh tú phù hợp nhất
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
                        src={getMiniCleanImage(movie)} 
                        alt="" 
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    
                    {/* Thông tin chữ */}
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-[11px] font-bold text-[#e8e1da] group-hover/item:text-[#ffe3ae] transition-colors truncate leading-tight tracking-wide">
                        {movie.name}
                      </h4>
                      <p className="text-[9px] text-[#d0c5b5]/40 font-bold uppercase tracking-wider truncate mt-1.5 font-sans">
                        {movie.year || '2026'} • <span className="text-[#E6C687]/80 bg-[#E6C687]/10 px-1.5 py-0.5 rounded-md text-[8px]">{movie.current_episode || movie.episode_current || 'Full'}</span>
                      </p>
                    </div>

                    <span className="text-[#d0c5b5]/15 group-hover/item:text-[#E6C687] group-hover/item:translate-x-0.5 transition-all text-[9px] pr-1.5 font-mono">➔</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-[9px] text-[#d0c5b5]/30 font-black uppercase tracking-widest font-mono">
                Không tìm thấy tọa độ phim 📡
              </div>
            )}
          </div>
        )}
      </div>

      {/* NÚT TÌM KIẾM DÀNH CHO MOBILE TINH GỌN PHẲNG LỲ */}
      <button 
        onClick={executeSearch}
        className="lg:hidden bg-[#E6C687]/10 hover:bg-[#E6C687] text-[#E6C687] hover:text-[#402d00] font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full border border-[#E6C687]/20 transition-all duration-300 active:scale-95 flex-shrink-0 focus:outline-none"
      >
        Tìm
      </button>

    </div>
  );
}