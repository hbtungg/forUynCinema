'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';

export default function ContinueWatching() {
  const { data: session, status } = useSession();
  const [history, setHistory] = useState([]);
  const scrollRef = useRef(null);

  // Hàm load dữ liệu từ API
  const loadHistory = async () => {
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
    } else if (status === "unauthenticated") {
      setHistory([]);
    }
  };

  // 🚀 LUỒNG 1: Chỉ tự động gọi API chạy khi trạng thái đăng nhập thực sự ĐÃ XÁC THỰC XONG
  useEffect(() => {
    if (status === "authenticated") {
      loadHistory();
    } else if (status === "unauthenticated") {
      setHistory([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]); // Chỉ chạy lại khi status thay đổi (loading -> authenticated)

  // 🚀 LUỒNG 2: Lắng nghe sự kiện cập nhật lịch sử toàn cục (Tách biệt hoàn toàn để tránh vòng lặp)
  useEffect(() => {
    window.addEventListener('historyUpdated', loadHistory);
    return () => window.removeEventListener('historyUpdated', loadHistory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]); // Chỉ đăng ký lại sự kiện khi session thay đổi

  // Hàm xóa lịch sử phim đang xem
  const removeHistory = async (slug) => {
    if (!session?.user?.email) return;
    const updatedHistory = history.filter(item => item.slug !== slug);
    setHistory(updatedHistory);
    try {
      const res = await fetch(`/api/history`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userEmail: session.user.email, 
          slug: slug 
        }),
      });
      if (!res.ok) {
        loadHistory();
      } else {
        const saved = JSON.parse(localStorage.getItem('watchHistory') || '[]');
        const updatedLocal = saved.filter(item => item.slug !== slug);
        localStorage.setItem('watchHistory', JSON.stringify(updatedLocal));
        window.dispatchEvent(new Event('historyUpdated'));
      }
    } catch (error) {
      loadHistory();
    }
  };

  if (status !== "authenticated" || history.length === 0) return null;

  return (
    <section className="mt-16 group/section">
      <div className="flex items-center justify-between mb-8 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.3)]"></div>
          <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-tight italic text-shadow">Phim Đang Xem 🍿</h2>
        </div>
      </div>

      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide scroll-smooth px-2">
        <div className="flex gap-6 md:gap-8 pb-6" style={{ width: 'max-content' }}>
          {history.map((item) => (
            <div key={item.slug} className="w-[280px] md:w-[320px] flex-shrink-0 relative group/card">
              <button
                onClick={(e) => { 
                  e.preventDefault(); 
                  e.stopPropagation(); 
                  removeHistory(item.slug); 
                }}
                className="absolute top-3 right-3 w-8 h-8 bg-black/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-all z-50 md:opacity-0 md:group-hover/card:opacity-100 shadow-2xl active:scale-75"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>
              </button>

              <Link 
                href={`/watch/${item.slug}?ep=${item.episode || 1}`} 
                className="block relative aspect-video rounded-[1.8rem] overflow-hidden border border-zinc-800 shadow-2xl bg-[#0a0a0a] transition-all duration-500 group-hover/card:border-red-600/50"
              >
                <img src={item.thumb_url} alt={item.name} className="w-full h-full object-cover opacity-60 group-hover/card:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <h3 className="text-white font-black text-[11px] md:text-[12px] uppercase truncate tracking-tight">{item.name}</h3>
                  <span className="text-red-600 text-[9px] font-black uppercase tracking-widest mt-1 block">● Tập {String(item.episode || '1').replace(/^(tập|tập|tâp|tap|ep|episode)\s*/i, '').trim()}</span>
                  <div className="mt-3 w-full h-1 bg-zinc-800/50 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
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