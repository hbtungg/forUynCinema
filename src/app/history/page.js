'use client';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = async () => {
    if (status === "authenticated" && session?.user?.email) {
      try {
        const res = await fetch(`/api/history?userEmail=${session.user.email}`);
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Lỗi lấy lịch sử:", error);
      } finally {
        setIsLoading(false);
      }
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [status, session]);

  const removeHistory = async (slug) => {
    if (!session?.user?.email) return;
    const updatedHistory = history.filter(item => item.slug !== slug);
    setHistory(updatedHistory);
    try {
      await fetch(`/api/history`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: session.user.email, slug: slug }),
      });
      // Cập nhật lại localStorage để đồng bộ toàn web
      const saved = JSON.parse(localStorage.getItem('watchHistory') || '[]');
      const updatedLocal = saved.filter(item => item.slug !== slug);
      localStorage.setItem('watchHistory', JSON.stringify(updatedLocal));
      window.dispatchEvent(new Event('historyUpdated'));
    } catch (error) {
      loadHistory();
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="max-w-[1600px] mx-auto px-6 py-32 md:py-40">
        {/* TIÊU ĐỀ TRANG CỰC CHÁY */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 border-l-[6px] border-red-600 pl-8">
          <div>
            <p className="text-red-600 font-black uppercase tracking-[0.5em] text-[10px] mb-2">Personal Cinema</p>
            <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
              Phim đang <span className="text-zinc-800">xem</span>
            </h1>
          </div>
          <div className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest pb-2">
            Tổng cộng: {history.length} Phim
          </div>
        </div>

        {/* NỘI DUNG CHÍNH */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-video bg-zinc-900/50 rounded-[2rem] animate-pulse"></div>
            ))}
          </div>
        ) : history.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 md:gap-x-8 md:gap-y-16">
            {history.map((item) => (
              <div key={item.slug} className="group/card relative">
                {/* Nút xóa tinh tế hơn */}
                <button
                  onClick={() => removeHistory(item.slug)}
                  className="absolute -top-3 -right-3 w-10 h-10 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center text-zinc-500 hover:bg-red-600 hover:text-white transition-all z-20 shadow-2xl opacity-0 group-hover/card:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                </button>

                <Link href={`/watch/${item.slug}?ep=${item.episode}`} className="block">
                  <div className="relative aspect-video rounded-[2rem] overflow-hidden border-2 border-zinc-900 group-hover/card:border-red-600/50 transition-all duration-500 bg-zinc-900 shadow-2xl">
                    <img 
                      src={item.thumb_url} 
                      alt={item.name} 
                      className="w-full h-full object-cover opacity-60 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-700" 
                    />
                    
                    {/* Overlay thông tin */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end">
                      <h3 className="text-white font-black text-sm md:text-base uppercase truncate tracking-tight mb-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                          Tập {item.episode || "1"}
                        </span>
                      </div>
                      
                      {/* Thanh tiến trình (Progress Bar) */}
                      <div className="mt-4 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="w-[65%] h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]"></div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center">
            <div className="text-zinc-900 text-[120px] font-black mb-4 leading-none select-none">EMPTY</div>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-xs">Anh chưa có bộ phim nào trong danh sách đang xem</p>
            <Link href="/" className="inline-block mt-10 px-10 py-4 bg-zinc-900 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all">
              Khám phá ngay
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}