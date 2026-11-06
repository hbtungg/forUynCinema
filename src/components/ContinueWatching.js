'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { X, Play } from 'lucide-react';

export default function ContinueWatching() {
  const { data: session, status } = useSession();
  const email = session?.user?.email;
  const [storedHistory, setStoredHistory] = useState({ email: null, items: [] });
  const history = storedHistory.email === session?.user?.email ? storedHistory.items : [];
  const setHistory = useCallback(items => {
    setStoredHistory({ email: session?.user?.email, items });
  }, [session?.user?.email]);
  const scrollRef = useRef(null);

  const loadHistory = useCallback(async () => {
    if (status === "authenticated" && email) {
      try {
        const res = await fetch('/api/history');
        if (res.ok) {
          const data = await res.json();
          const historyList = data.movies || (Array.isArray(data) ? data : []);
          return historyList;
        }
      } catch (error) {
        console.error("Lỗi lấy lịch sử từ:", error);
      }
    }
    return null;
  }, [status, email]);

  useEffect(() => {
    let cancelled = false;
    const refresh = () => loadHistory().then(items => {
      if (!cancelled && items) setStoredHistory({ email, items });
    });
    refresh();
    window.addEventListener('historyUpdated', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      cancelled = true;
      window.removeEventListener('historyUpdated', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [email, loadHistory]);

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
        setHistory(await loadHistory() || history);
      } else {
        const saved = JSON.parse(localStorage.getItem('watchHistory') || '[]');
        const updatedLocal = saved.filter(item => item.slug !== slug);
        localStorage.setItem('watchHistory', JSON.stringify(updatedLocal));
        window.dispatchEvent(new Event('historyUpdated'));
      }
    } catch (error) {
      setHistory(await loadHistory() || history);
    }
  };

  const getDisplayImage = (item) => {
    if (!item) return '';

    const isKKPhim = item.provider === 'kkphim' ||
      (item.thumb_url && item.thumb_url.includes('phimapi.com'));
    let rawUrl = isKKPhim
      ? (item.thumb_url || item.poster_url || '')
      : (item.poster_url || item.thumb_url || '');

    if (!rawUrl) return '';

    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      return rawUrl;
    }

    const baseDomain = isKKPhim ? 'https://img.phimapi.com' : 'https://phim.nguonc.com';
    return `${baseDomain}/${rawUrl.replace(/^\//, '')}`;
  };

  if (status !== "authenticated" || history.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight md:text-2xl">Phim đang xem</h2>
      <div ref={scrollRef} className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x scroll-smooth px-1">
        <div className="flex gap-4 md:gap-6 pb-4" style={{ width: 'max-content' }}>
          {history.map((item) => (
            <div key={item.slug} className="w-[min(72vw,240px)] md:w-[300px] flex-shrink-0 relative group/card animate-in fade-in duration-300">

              {/* NÚT XÓA LỊCH SỬ */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeHistory(item.slug);
                }}
                className="absolute top-2.5 right-2.5 size-11 clear-glass glass-action flex items-center justify-center text-white z-20 cursor-pointer focus:outline-none"
                title="Xóa khỏi danh sách xem tiếp"
              >
                <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>

              {/* CARD KHUNG HÌNH PHIM */}
              <Link
                href={`/watch/${item.slug}?ep=${encodeURIComponent(item.episode || 1)}&provider=${encodeURIComponent(item.provider || 'auto')}`}
                className="block relative aspect-video rounded-2xl overflow-hidden bg-surface-container"
              >
                <img
                  src={getDisplayImage(item)}
                  alt={item.name}
                  className="w-full h-full object-cover opacity-100 group-hover/card:scale-105 transition-all duration-300 pointer-events-none"
                  loading="lazy"
                />

                {/* NÚT PLAY KHI HOVER */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-focus-within/card:opacity-100 [@media(hover:hover)]:group-hover/card:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 md:w-14 md:h-14 clear-glass glass-action flex items-center justify-center text-[#e8e8e8]  transform group-hover/card:scale-110 transition-transform duration-300">
                    <Play className="w-5 h-5 md:w-6 md:h-6 fill-current ml-1" />
                  </div>
                </div>

                {/* LỚP PHỦ GRADIENT THÔNG TIN */}
                <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-6 continue-card-scrim">
                  <h3 className="text-white font-semibold text-sm truncate group-hover/card:text-[#ffffff] transition-colors">{item.name}</h3>

                  <span className="text-white/85 text-xs mt-0.5 block">
                    Tập {String(item.episode || '1').replace(/^(tập|tập|tâp|tap|ep|episode)\s*/i, '').trim()}
                  </span>

                  {Number(item.durationSeconds) > 0 && Number(item.positionSeconds) > 0 && (
                    <progress aria-label="Tiến độ xem" className="watch-progress mt-2 block w-full"
                      max={Number(item.durationSeconds)} value={Math.min(Number(item.positionSeconds), Number(item.durationSeconds))} />
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
