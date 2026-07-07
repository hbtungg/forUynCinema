'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { getMovieDetail } from '@/lib/clientMovies';
import { ArrowLeft, X, Tv, Sparkles, Clock, Loader2, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';

function getEpisodeNumber(value) {
  const matches = String(value || '').match(/\d+/g);
  if (!matches) return 0;
  return Math.max(...matches.map(Number));
}

function getEpisodeLabel(value) {
  return String(value || '1').replace(/^(tập|tập|tâp|tap|ep|episode)\s*/i, '').trim();
}

function findLatestEpisode(servers = []) {
  return servers
    .flatMap((server) => server?.items || server?.server_data || [])
    .map((episode) => ({
      episode,
      number: getEpisodeNumber(episode?.name || episode?.title || episode?.episode || episode?.slug),
    }))
    .filter((item) => item.number > 0)
    .sort((a, b) => b.number - a.number)[0] || null;
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;
  const [history, setHistory] = useState([]);
  const [totalMovies, setTotalMovies] = useState(0); 
  const [currentPage, setCurrentPage] = useState(1);   
  const [episodeUpdates, setEpisodeUpdates] = useState({});
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const ITEMS_PER_PAGE = 8; 

  useEffect(() => {
    document.title = "Histories - Uynflix";
  }, []);

  const loadHistory = useCallback(async (pageToLoad = currentPage) => {
    if (status === 'loading') return;

    if (status !== 'authenticated' || !userEmail) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(
        `/api/history?userEmail=${encodeURIComponent(userEmail)}&page=${pageToLoad}`
      );

      if (!res.ok) {
        throw new Error('Không thể tải lịch sử xem');
      }

      const data = await res.json();
      setHistory(Array.isArray(data.movies) ? data.movies : []);
      setTotalMovies(data.total || 0);
      setEpisodeUpdates({});
    } catch (error) {
      console.error('Lỗi lấy lịch sử:', error);
      setError('Không tải được lịch sử xem, hãy thử lại');
    } finally {
      setIsLoading(false);
    }
  }, [status, userEmail, currentPage]);

  useEffect(() => {
    loadHistory(currentPage);
  }, [loadHistory, currentPage]);

  useEffect(() => {
    if (!history.length) return;

    let isMounted = true;

    async function checkEpisodeUpdates() {
      setIsCheckingUpdates(true);

      try {
        const results = await Promise.allSettled(
          history.map(async (item) => {
            const detailSlug = item.providerSlug || item.slug;
            const preferredProvider = item.provider === 'auto' ? null : item.provider;
            const detail = await getMovieDetail(detailSlug, preferredProvider);
            const latest = findLatestEpisode(detail?.movie?.episodes || detail?.episodes || []);
            const watchedNumber = getEpisodeNumber(item.episode);

            if (!latest || !watchedNumber || latest.number <= watchedNumber) {
              return null;
            }

            return {
              slug: item.slug,
              latestEpisodeName: latest.episode?.name || latest.episode?.title || `Tập ${latest.number}`,
              latestEpisodeNumber: latest.number,
              watchedEpisodeNumber: watchedNumber,
            };
          })
        );

        if (!isMounted) return;

        const nextUpdates = {};
        results.forEach((result) => {
          if (result.status === 'fulfilled' && result.value) {
            nextUpdates[result.value.slug] = result.value;
          }
        });

        setEpisodeUpdates(nextUpdates);
      } catch (error) {
        console.error('Lỗi kiểm tra tập mới:', error);
      } finally {
        if (isMounted) setIsCheckingUpdates(false);
      }
    }

    checkEpisodeUpdates();

    return () => {
      isMounted = false;
    };
  }, [history]);

  const removeHistory = async (slug) => {
    if (!userEmail) return;

    const previousHistory = history;
    const updatedHistory = history.filter((item) => item.slug !== slug);

    setHistory(updatedHistory);
    setTotalMovies((prev) => Math.max(0, prev - 1));
    setEpisodeUpdates((current) => {
      const next = { ...current };
      delete next[slug];
      return next;
    });

    try {
      const res = await fetch('/api/history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, slug }),
      });

      if (!res.ok) throw new Error('Không thể xoá lịch sử');

      const saved = JSON.parse(localStorage.getItem('watchHistory') || '[]');
      const updatedLocal = saved.filter((item) => item.slug !== slug);
      localStorage.setItem('watchHistory', JSON.stringify(updatedLocal));

      if (updatedHistory.length === 0 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        loadHistory(currentPage);
      }
    } catch (error) {
      console.error('Lỗi xoá lịch sử:', error);
      setHistory(previousHistory);
      setTotalMovies(previousHistory.length);
      setError('Không xoá được phim khỏi lịch sử xem. Anh thử lại sau nhé.');
    }
  };

  // 🚀 ĐỒNG BỘ LOGIC: Định vị chính xác ảnh ngang tương thích hệ thống API
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

  const updatedMovies = history.filter((item) => episodeUpdates[item.slug]);
  const totalPages = Math.ceil(totalMovies / ITEMS_PER_PAGE);

  return (
    <div className="w-full min-h-screen bg-transparent text-[#e8e1da] select-none font-sans" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <div className="px-4 md:px-12 py-6">

        <Link
          href="/home"
          className="text-[#d0c5b5]/40 hover:text-[#ffe3ae] text-[10px] font-bold uppercase tracking-[0.2em] inline-flex items-center gap-2 mb-8 transition-colors duration-300 group w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Quay lại trang chủ
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-l-4 border-[#E6C687] pl-5 md:pl-6">
          <div className="space-y-1">
            <p className="text-[#E6C687] font-bold uppercase tracking-[0.45em] text-[9px]">
              Personal Tracking System
            </p>
            <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider leading-none">
              Danh sách: <span className="text-[#ffe3ae]" style={{ textShadow: '0 0 10px rgba(255,227,174,0.35)' }}>Phim Đang Xem</span>
            </h1>
          </div>

          <div className="text-[#d0c5b5]/40 font-bold uppercase text-[10px] tracking-widest flex items-center gap-3">
            <span>Tổng số: {totalMovies} phim</span>
            {isCheckingUpdates && (
              <span className="text-[#ffe3ae] animate-pulse flex items-center gap-1.5 font-bold">
                <Loader2 className="w-3 h-3 animate-spin" /> Kiểm tra tập mới...
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-red-500/20 bg-red-950/10 px-5 py-4">
            <p className="text-xs font-semibold text-red-200 tracking-wide">{error}</p>
            <button
              type="button"
              onClick={() => loadHistory(currentPage)}
              className="px-4 py-2 rounded-xl bg-[#0F1326]/60 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#d0c5b5] hover:border-[#E6C687]/40 hover:text-[#ffe3ae] transition-colors cursor-pointer focus:outline-none"
            >
              Thử lại
            </button>
          </div>
        )}

        {!isLoading && updatedMovies.length > 0 && (
          <div className="mb-10 rounded-[24px] border border-[#E6C687]/30 bg-[#0F1326]/40 backdrop-blur-2xl px-6 py-5 shadow-2xl animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-[#ffe3ae] text-[10px] font-bold uppercase tracking-[0.25em] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E6C687]" /> Thông báo cập nhật
                </p>
                <p className="text-xs md:text-sm text-[#e8e1da]/80 font-medium">
                  Phát hiện <span className="text-[#ffe3ae] font-bold">{updatedMovies.length} bộ phim</span> vừa có tập mới.
                </p>
              </div>

              <Link
                href={`/watch/${updatedMovies[0].slug}?ep=${encodeURIComponent(episodeUpdates[updatedMovies[0].slug]?.latestEpisodeName || '1')}`}
                className="px-5 py-2.5 bg-[#E6C687]/10 hover:bg-[#E6C687] border border-[#E6C687]/20 text-[#E6C687] hover:text-[#402d00] font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-95 text-center shadow-md"
              >
                Xem tập mới nhất
              </Link>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="aspect-video bg-[#0F1326]/40 border border-white/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : history.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 md:gap-8 md:gap-y-10">
              {history.map((item) => {
                return (
                  <div key={item.slug} className="group/card relative animate-in fade-in duration-500">

                    {/* Tag báo tập mới */}
                    {episodeUpdates[item.slug] && (
                      <Link
                        href={`/watch/${item.slug}?ep=${encodeURIComponent(episodeUpdates[item.slug].latestEpisodeName)}`}
                        className="absolute top-3 left-3 z-20 rounded-full bg-[#E6C687]/10 border border-[#E6C687]/30 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-[#ffe3ae] shadow-xl backdrop-blur-md hover:bg-[#E6C687] hover:text-[#402d00] transition-all duration-300 font-sans"
                      >
                        Mới: Tập {getEpisodeLabel(episodeUpdates[item.slug].latestEpisodeName)}
                      </Link>
                    )}

                    <button
                      type="button"
                      aria-label={`Xoá ${item.name} khỏi lịch sử`}
                      onClick={() => removeHistory(item.slug)}
                      className="absolute top-3 right-3 w-8 h-8 bg-[#0F1326]/80 border border-white/10 rounded-full flex items-center justify-center text-[#d0c5b5]/60 hover:bg-amber-500 hover:text-white transition-all z-20 shadow-xl md:opacity-0 md:group-hover/card:opacity-100 focus:outline-none cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <Link href={`/watch/${item.slug}?ep=${item.episode || '1'}`} className="block">
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 group-hover/card:border-[#E6C687]/30 transition-all duration-500 bg-[#0F1326]/40 shadow-2xl">
                        <img
                          src={getDisplayImage(item)}
                          alt={item.name}
                          // 🚀 FIX ĐỘ NÉT: Đặt độ nét 95% tĩnh và 100% khi tương tác chuột
                          className="w-full h-full object-cover opacity-95 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-700"
                          loading="lazy"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#060814]/95 via-[#060814]/40 to-transparent p-4 flex flex-col justify-end">
                          <h3 className="text-white font-bold text-sm uppercase truncate tracking-wide mb-1.5 group-hover/card:text-[#ffe3ae] transition-colors leading-snug">
                            {item.name}
                          </h3>

                          <span className="w-fit text-[#ffe3ae] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 bg-[#E6C687]/10 px-2 py-0.5 rounded border border-[#E6C687]/20">
                            <Clock className="w-3 h-3 text-[#E6C687]" />
                            Tập {getEpisodeLabel(item.episode)}
                          </span>

                          {episodeUpdates[item.slug] && (
                            <span className="mt-2 w-fit text-[#d0c5b5]/40 text-[9px] font-bold uppercase tracking-widest pl-0.5 flex items-center gap-1">
                              <Tv className="w-3 h-3" /> Đã có Tập {getEpisodeLabel(episodeUpdates[item.slug].latestEpisodeName)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-2 border-t border-white/5 pt-8">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-xl bg-[#0F1326]/40 border border-white/10 flex items-center justify-center text-[#d0c5b5] hover:border-[#E6C687]/40 hover:text-[#ffe3ae] disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer focus:outline-none"
                  title="Trang trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl font-bold text-xs transition-all cursor-pointer focus:outline-none ${currentPage === page
                        ? 'bg-[#E6C687] text-[#402d00] shadow-[0_0_15px_rgba(230,198,135,0.3)]'
                        : 'bg-[#0F1326]/40 border border-white/10 text-[#d0c5b5] hover:border-[#E6C687]/20 hover:text-white'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className="w-10 h-10 rounded-xl bg-[#0F1326]/40 border border-white/10 flex items-center justify-center text-[#d0c5b5] hover:border-[#E6C687]/40 hover:text-[#ffe3ae] disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer focus:outline-none"
                  title="Trang sau"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-3 border border-dashed border-white/5 rounded-[32px] bg-[#0F1326]/10 backdrop-blur-md max-w-4xl mx-auto px-6 animate-in fade-in duration-500">
            <HelpCircle className="w-10 h-10 text-[#d0c5b5]/20" />
            <p className="text-[#d0c5b5]/20 text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none select-none">
              Chưa có phim
            </p>
            <p className="text-[#d0c5b5]/40 font-semibold uppercase tracking-[0.2em] text-[10px] leading-relaxed max-w-md">
              Lịch sử xem hiện đang trống.
            </p>
            <Link
              href="/home"
              className="mt-4 px-6 py-2.5 bg-[#E6C687]/10 hover:bg-[#E6C687] border border-[#E6C687]/20 text-[#E6C687] hover:text-[#402d00] text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-95 shadow-md"
            >
              Khám phá ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}