'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function ContinueWatching() {
  const [history, setHistory] = useState([]);
  const scrollRef = useRef(null); // Ref để điều khiển thanh trượt

  useEffect(() => {
    const loadHistory = () => {
      const saved = JSON.parse(localStorage.getItem('watchHistory') || '[]');
      setHistory(saved);
    };

    loadHistory();
    window.addEventListener('storage', loadHistory);
    window.addEventListener('historyUpdated', loadHistory);

    return () => {
      window.removeEventListener('storage', loadHistory);
      window.removeEventListener('historyUpdated', loadHistory);
    };
  }, []);

  // --- CHIÊU THỨC ĐIỀU KHIỂN MŨI TÊN ---
  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300; // Khoảng cách mỗi lần bấm nút
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (history.length === 0) return null;

  return (
    <section className="mt-16 group/section">
      {/* TIÊU ĐỀ & NÚT ĐIỀU HƯỚNG */}
      <div className="flex items-center justify-between mb-8 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.3)]"></div>
          <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-tight">
            Phim Đang Xem 🍿
          </h2>
        </div>

        {/* CẶP MŨI TÊN ĐIỀU HƯỚNG - Chỉ hiện khi di chuột vào vùng này */}
        <div className="flex gap-2 opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:text-yellow-500 transition-all active:scale-90 shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"></path></svg>
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 hover:text-yellow-500 transition-all active:scale-90 shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"></path></svg>
          </button>
        </div>
      </div>

      {/* DANH SÁCH TRƯỢT NGANG */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
      >
        {history.map((item) => (
          <Link 
            key={item.slug} 
            href={`/watch/${item.slug}`} 
            className="min-w-[280px] md:min-w-[320px] group/card relative"
          >
            <div className="relative aspect-video rounded-[1.5rem] overflow-hidden border border-zinc-800 group-hover/card:border-yellow-500/50 transition-all duration-500 shadow-2xl bg-zinc-900">
              <img 
                src={item.thumb_url} 
                alt={item.name}
                className="w-full h-full object-cover opacity-60 group-hover/card:opacity-90 group-hover/card:scale-105 transition-all duration-700"
              />
              
              {/* CHI TIẾT TẬP ĐANG XEM */}
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black via-black/40 to-transparent">
                <h3 className="text-white font-black text-[11px] uppercase truncate tracking-tight mb-1">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2">
                   <span className="text-yellow-500 text-[9px] font-black uppercase">● {item.episode}</span>
                   <span className="text-zinc-600 text-[8px] font-bold ml-auto">{item.time}</span>
                </div>
                
                {/* THANH PROGRESS GIẢ (Cho đẹp mắt) */}
                <div className="mt-3 w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                </div>
              </div>

              {/* NÚT PLAY KHI HOVER */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black shadow-2xl scale-75 group-hover/card:scale-100 transition-transform duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}