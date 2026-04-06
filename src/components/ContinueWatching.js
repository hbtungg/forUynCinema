'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ContinueWatching() {
  const [history, setHistory] = useState([]);
  const scrollRef = useRef(null);

  const loadHistory = () => {
    const saved = JSON.parse(localStorage.getItem('watchHistory') || '[]');
    setHistory(saved);
  };

  useEffect(() => {
    loadHistory();
    window.addEventListener('storage', loadHistory);
    window.addEventListener('historyUpdated', loadHistory);
    return () => {
      window.removeEventListener('storage', loadHistory);
      window.removeEventListener('historyUpdated', loadHistory);
    };
  }, []);

  // --- CHIÊU THỨC XÓA PHIM KHỎI LỊCH SỬ ---
  const removeHistory = (slug) => {
    const saved = JSON.parse(localStorage.getItem('watchHistory') || '[]');
    const updated = saved.filter(item => item.slug !== slug);
    localStorage.setItem('watchHistory', JSON.stringify(updated));
    setHistory(updated);
    // Phát sự kiện để cập nhật đồng bộ
    window.dispatchEvent(new Event('historyUpdated'));
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (history.length === 0) return null;

  return (
    <section className="mt-16 group/section">
      <div className="flex items-center justify-between mb-8 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.3)]"></div>
          <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-tight italic">
            Phim Đang Xem 🍿
          </h2>
        </div>

        <div className="flex gap-2 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
          <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:text-yellow-500 transition-all active:scale-90 shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"></path></svg>
          </button>
          <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:text-yellow-500 transition-all active:scale-90 shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide scroll-smooth px-2">
        <div className="flex gap-6 md:gap-8 pb-6" style={{ width: 'max-content' }}>
          {history.map((item) => (
            <div 
              key={item.slug} 
              className="w-[280px] md:w-[320px] flex-shrink-0 relative group/card"
            >
              {/* NÚT XÓA: Nằm ở góc trên phải, chỉ hiện khi hover */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  removeHistory(item.slug);
                }}
                className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:bg-yellow-500 hover:text-black hover:border-yellow-400 transition-all z-50 opacity-0 group-hover/card:opacity-100 scale-75 group-hover/card:scale-100 shadow-2xl"
                title="Xóa khỏi lịch sử"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>
              </button>

              <Link href={`/watch/${item.slug}`} className="block relative aspect-video rounded-[1.5rem] overflow-hidden border border-zinc-800 group-hover/card:border-yellow-500/50 transition-all duration-500 shadow-2xl bg-zinc-900">
                <img 
                  src={item.thumb_url} 
                  alt={item.name}
                  className="w-full h-full object-cover opacity-60 group-hover/card:opacity-90 group-hover/card:scale-105 transition-all duration-700"
                />
                
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black via-black/60 to-transparent">
                  <h3 className="text-white font-black text-[11px] uppercase truncate tracking-tight mb-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2">
                     <span className="text-yellow-500 text-[9px] font-black uppercase tracking-widest leading-none">● {item.episode}</span>
                     <span className="text-zinc-600 text-[8px] font-bold ml-auto">{item.time}</span>
                  </div>
                  {/* THANH PROGRESS GIẢ */}
                  <div className="mt-3 w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                  </div>
                </div>

                {/* NÚT PLAY GIỮA MÀN HÌNH */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black shadow-2xl scale-75 group-hover/card:scale-100 transition-transform duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}