'use client';
import { useState, useEffect, useRef } from 'react';
import MovieCard from './MovieCard';

export default function FavoriteList() {
  const [favorites, setFavorites] = useState([]);
  const scrollRef = useRef(null);

  const loadFavorites = () => {
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(saved);
  };

  useEffect(() => {
    loadFavorites();
    window.addEventListener('storage', loadFavorites);
    window.addEventListener('favoritesUpdated', loadFavorites);
    return () => {
      window.removeEventListener('storage', loadFavorites);
      window.removeEventListener('favoritesUpdated', loadFavorites);
    };
  }, []);

  const removeFavorite = (slug) => {
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updated = saved.filter(f => f.slug !== slug);
    localStorage.setItem('favorites', JSON.stringify(updated));
    setFavorites(updated);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (favorites.length === 0) return null;

  return (
    <section className="mt-16 group/fav font-sans overflow-x-hidden">
      <div className="flex items-center justify-between mb-10 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)]"></div>
          <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-tight italic">
            Phim Em Đã Thích ❤️
          </h2>
        </div>

        <div className="flex gap-2 opacity-0 group-hover/fav:opacity-100 transition-opacity duration-300">
          <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:text-red-500 transition-all active:scale-95 shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"></path></svg>
          </button>
          <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:text-red-500 transition-all active:scale-95 shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide scroll-smooth px-2">
        <div className="flex gap-6 md:gap-8 pb-8" style={{ width: 'max-content' }}>
          {favorites.map((phim) => (
            <div key={phim.slug} className="w-[160px] sm:w-[200px] md:w-[230px] flex-shrink-0 relative group/item">
              {/* Trả lại MovieCard nguyên bản (Tự hiện Năm ở góc phải) */}
              <MovieCard movie={phim} />
              
              {/* LỚP PHỦ CHỨA NÚT XÓA (NẰM DƯỚI NÚT XEM NGAY CỦA MOVIECARD) */}
              <div className="absolute inset-0 z-40 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="pointer-events-auto flex flex-col items-center gap-3 mt-24">
                  {/* Nút Xóa phim lãng mạn */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      removeFavorite(phim.slug);
                    }}
                    className="bg-zinc-900/80 backdrop-blur-md text-zinc-400 text-[10px] font-black w-[110px] py-2.5 rounded-full uppercase text-center border border-white/10 hover:bg-red-600 hover:text-white hover:border-red-500 transition-all shadow-2xl flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}