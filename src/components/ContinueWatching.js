'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { X, Sparkles, Play } from 'lucide-react';

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

  const titleText = "Phim Đang Xem";

  return (
    <section className="mt-12 md:mt-16 group/section font-sans select-none" style={{ fontFamily: "var(--font-main)" }}>

      {/* TIÊU ĐỀ KHAY PHIM */}
      <div className="flex items-center justify-between mb-6 md:mb-8 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 md:h-7 bg-[#e8e8e8] rounded-full  shrink-0"></div>

          <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="inline">
              {titleText.split(' ').map((word, i) => (
                <span
                  key={i}
                  className={`${i === 1 ? 'text-[#e8e8e8] ' : ''} inline`}
                >
                  {word}{' '}
                </span>
              ))}
            </span>
            <Sparkles className="w-4 h-4 text-[#e8e8e8] animate-pulse shrink-0" />
          </h2>
        </div>
      </div>

      {/* KHAY LƯỚT NGANG */}
      <div ref={scrollRef} className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x scroll-smooth px-1">
        <div className="flex gap-4 md:gap-6 pb-4" style={{ width: 'max-content' }}>
          {history.map((item) => (
            <div key={item.slug} className="w-[240px] md:w-[320px] flex-shrink-0 relative group/card animate-in fade-in duration-300">

              {/* NÚT XÓA LỊCH SỬ */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeHistory(item.slug);
                }}
                className="absolute top-2.5 right-2.5 w-7 h-7 md:w-8 md:h-8 glass-surface border border-white/10 rounded-full flex items-center justify-center text-[#b8b8b8] hover:bg-neutral-700/20 hover:text-neutral-300 transition-all z-50 opacity-100 md:opacity-0 md:group-hover/card:opacity-100 shadow-xl active:scale-75 cursor-pointer focus:outline-none"
                title="Xóa khỏi danh sách xem tiếp"
              >
                <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>

              {/* CARD KHUNG HÌNH PHIM */}
              <Link
                href={`/watch/${item.slug}?ep=${encodeURIComponent(item.episode || 1)}&provider=${encodeURIComponent(item.provider || 'auto')}`}
                className="block relative aspect-video rounded-[1.5rem] md:rounded-[1.8rem] overflow-hidden border border-white/5 shadow-2xl bg-white/[0.04] transition-all duration-300 group-hover/card:border-[#e8e8e8]/30"
              >
                <img
                  src={getDisplayImage(item)}
                  alt={item.name}
                  className="w-full h-full object-cover opacity-100 group-hover/card:scale-105 transition-all duration-300 pointer-events-none"
                  loading="lazy"
                />

                {/* NÚT PLAY KHI HOVER */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-10">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#e8e8e8]/20 backdrop-blur-md border border-[#e8e8e8]/40 flex items-center justify-center text-[#e8e8e8]  transform group-hover/card:scale-110 transition-transform duration-300">
                    <Play className="w-5 h-5 md:w-6 md:h-6 fill-current ml-1" />
                  </div>
                </div>

                {/* LỚP PHỦ GRADIENT THÔNG TIN */}
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent z-20">
                  <h3 className="text-white font-bold text-xs md:text-sm truncate tracking-wide uppercase group-hover/card:text-[#ffffff] transition-colors">{item.name}</h3>

                  <span className="text-[#ffffff] text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-1.5 block font-mono">
                    ● Progress: Tập {String(item.episode || '1').replace(/^(tập|tập|tâp|tap|ep|episode)\s*/i, '').trim()}
                  </span>

                  {/* THANH TIMELINE PROGRESS */}
                  <div className="mt-3 w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-[#e8e8e8]  rounded-full"></div>
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
