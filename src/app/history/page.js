'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "Lịch sử - Uynflix";
  }, []);

  const loadHistory = useCallback(async () => {
    if (status === 'loading') return;

    if (status !== 'authenticated' || !session?.user?.email) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(
        `/api/history?userEmail=${encodeURIComponent(session.user.email)}`
      );

      if (!res.ok) {
        throw new Error('Không thể tải lịch sử xem');
      }

      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi lấy lịch sử:', error);
      setError('Không tải được lịch sử xem. Anh thử lại sau nhé.');
    } finally {
      setIsLoading(false);
    }
  }, [status, session?.user?.email]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const removeHistory = async (slug) => {
    if (!session?.user?.email) return;

    const previousHistory = history;
    const updatedHistory = history.filter((item) => item.slug !== slug);

    setHistory(updatedHistory);

    try {
      const res = await fetch('/api/history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: session.user.email,
          slug,
        }),
      });

      if (!res.ok) {
        throw new Error('Không thể xoá lịch sử');
      }

      const saved = JSON.parse(localStorage.getItem('watchHistory') || '[]');
      const updatedLocal = saved.filter((item) => item.slug !== slug);

      localStorage.setItem('watchHistory', JSON.stringify(updatedLocal));
      window.dispatchEvent(new Event('historyUpdated'));
    } catch (error) {
      console.error('Lỗi xoá lịch sử:', error);
      setHistory(previousHistory);
      setError('Không xoá được phim khỏi lịch sử. Anh thử lại sau nhé.');
    }
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <Header />

      <div className="px-6 md:px-12 pt-8 md:pt-12 pb-20">
        <Link
          href="/home"
          className="text-zinc-500 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-8 transition-all group w-fit"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          Quay lại trang chủ
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 border-l-[6px] border-red-600 pl-6 md:pl-8">
          <div>
            <p className="text-red-600 font-black uppercase tracking-[0.45em] text-[10px] mb-2">
              Personal Cinema
            </p>
            <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              Phim đang <span className="text-zinc-700">xem</span>
            </h1>
          </div>

          <div className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest pb-2">
            Tổng cộng: {history.length} phim
          </div>
        </div>

        {error && (
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-red-600/30 bg-red-950/20 px-5 py-4">
            <p className="text-sm text-red-100 font-semibold">{error}</p>
            <button
              type="button"
              onClick={loadHistory}
              className="w-fit px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-video bg-zinc-900/70 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : history.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-y-12">
            {history.map((item) => (
              <div key={item.slug} className="group/card relative">
                <button
                  type="button"
                  aria-label={`Xoá ${item.name} khỏi lịch sử xem`}
                  onClick={() => removeHistory(item.slug)}
                  className="absolute top-3 right-3 w-9 h-9 bg-black/70 border border-white/10 rounded-full flex items-center justify-center text-zinc-300 hover:bg-red-600 hover:text-white transition-all z-20 shadow-xl md:opacity-0 md:group-hover/card:opacity-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>

                <Link
                  href={`/watch/${item.slug}?ep=${item.episode || '1'}`}
                  className="block"
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 group-hover/card:border-red-600/60 transition-all duration-500 bg-zinc-900 shadow-2xl">
                    <img
                      src={item.thumb_url}
                      alt={item.name}
                      className="w-full h-full object-cover opacity-70 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-700"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-5 flex flex-col justify-end">
                      <h3 className="text-white font-black text-sm md:text-base uppercase truncate tracking-tight mb-2">
                        {item.name}
                      </h3>

                      <span className="w-fit text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                        Tập {String(item.episode || '1').replace(/^(tập|tập|tâp|tap|ep|episode)\s*/i, '').trim()}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 md:py-24 text-center">
            <div className="text-zinc-900 text-5xl md:text-8xl font-black mb-5 leading-none select-none">
              Chưa có phim
            </div>

            <p className="max-w-xl mx-auto text-zinc-500 font-bold uppercase tracking-[0.25em] text-[11px] leading-6">
              Chưa xem phim nào!
            </p>

            <Link
              href="/home"
              className="inline-block mt-10 px-8 py-4 bg-zinc-900 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-xl transition-all shadow-xl"
            >
              Khám phá ngay
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
