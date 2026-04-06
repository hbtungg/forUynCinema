'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';

export default function ContinueWatching() {
  const { data: session, status } = useSession();
  const [history, setHistory] = useState([]);
  const scrollRef = useRef(null);

  const loadHistory = async () => {
    // Nếu đã đăng nhập thì lấy từ Database, nếu chưa thì lấy từ LocalStorage
    if (status === "authenticated" && session?.user?.email) {
      try {
        const res = await fetch(`/api/history?userEmail=${session.user.email}`);
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Lỗi lấy lịch sử từ mây:", error);
      }
    } else {
      // Khách vãng lai vẫn dùng local
      const saved = JSON.parse(localStorage.getItem('watchHistory') || '[]');
      setHistory(saved);
    }
  };

  useEffect(() => {
    loadHistory();
    window.addEventListener('storage', loadHistory);
    window.addEventListener('historyUpdated', loadHistory);
    return () => {
      window.removeEventListener('storage', loadHistory);
      window.removeEventListener('historyUpdated', loadHistory);
    };
  }, [status, session]);

  // Hàm xóa này cũng cần gọi API nếu anh muốn xóa vĩnh viễn trên mây
  const removeHistory = (slug) => {
    const saved = JSON.parse(localStorage.getItem('watchHistory') || '[]');
    const updated = saved.filter(item => item.slug !== slug);
    localStorage.setItem('watchHistory', JSON.stringify(updated));
    setHistory(updated);
    window.dispatchEvent(new Event('historyUpdated'));
  };

  if (history.length === 0) return null;

  return (
    <section className="mt-16 group/section">
      <div className="flex items-center justify-between mb-8 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.3)]"></div>
          <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-tight italic">Phim Đang Xem 🍿</h2>
        </div>
      </div>

      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide scroll-smooth px-2">
        <div className="flex gap-6 md:gap-8 pb-6" style={{ width: 'max-content' }}>
          {history.map((item) => (
            <div key={item.slug} className="w-[280px] md:w-[320px] flex-shrink-0 relative group/card">
              <button 
                onClick={(e) => { e.preventDefault(); removeHistory(item.slug); }}
                className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:bg-yellow-500 hover:text-black transition-all z-50 opacity-0 group-hover/card:opacity-100 shadow-2xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>
              </button>

              <Link href={`/watch/${item.slug}`} className="block relative aspect-video rounded-[1.5rem] overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900">
                <img src={item.thumb_url} alt={item.name} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-white font-black text-[11px] uppercase truncate">{item.name}</h3>
                  <span className="text-yellow-500 text-[9px] font-black uppercase">● {item.episode}</span>
                  <div className="mt-3 w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
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