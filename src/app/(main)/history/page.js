'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { getMovieDetail } from '@/lib/clientMovies';
import { ArrowLeft, X, Tv, Sparkles, Clock, Loader2, HelpCircle } from 'lucide-react';

function getEpisodeNumber(value) {
  const matches = String(value || '').match(/\d+/g);
  if (!matches) return 0;
  return Math.max(...matches.map(Number));
}

function getEpisodeLabel(value) {
  return String(value || '1').replace(/^(tập|tập|tâp|tap|ep|episode)\s*/i, '').trim();
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
  const [episodeUpdates, setEpisodeUpdates] = useState({});
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = "Lịch sử chòm sao - Uynflix";
  }, []);

  const loadHistory = useCallback(async () => {
    if (status === 'loading') return;

    if (status !== 'authenticated' || !userEmail) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(
        `/api/history?userEmail=${encodeURIComponent(userEmail)}`
      );

      if (!res.ok) {
        throw new Error('Không thể tải lịch sử xem');
      }

      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
      setEpisodeUpdates({});
    } catch (error) {
      console.error('Lỗi lấy lịch sử:', error);
      setError('Không tải được lịch sử xem từ tinh hệ. Anh thử lại sau nhé.');
    } finally {
      setIsLoading(false);
    }
  }, [status, userEmail]);

  useEffect(() => {
    Promise.resolve().then(loadHistory);
  }, [loadHistory]);

  useEffect(() => {
    if (!history.length) {
      return;
    }

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
    setEpisodeUpdates((current) => {
      const next = { ...current };
      delete next[slug];
      return next;
    });

    try {
      const res = await fetch('/api/history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
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
      setError('Không xoá được phim khỏi lịch sử xem. Anh thử lại sau nhé.');
    }
  };

  const updatedMovies = history.filter((item) => episodeUpdates[item.slug]);

  return (
    /* 🚀 FIX CHÍ MẠNG: Đổi sang bg-transparent lộ Shader, gạt bỏ hoàn toàn Header/Footer thừa */
    <div className="w-full min-h-screen bg-transparent text-[#e8e1da] select-none font-sans" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      <div className="px-4 md:px-12 py-6">
        
        {/* NÚT QUAY LẠI CHUẨN PHA LÊ MOONLIGHT */}
        <Link
          href="/home"
          className="text-[#d0c5b5]/40 hover:text-[#ffe3ae] text-[10px] font-bold uppercase tracking-[0.2em] inline-flex items-center gap-2 mb-8 transition-colors duration-300 group w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Quay lại trang chủ
        </Link>

        {/* TIÊU ĐỀ LAYER CHUẨN THIÊN VĂN CAO CẤP */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-l-4 border-[#E6C687] pl-5 md:pl-6">
          <div className="space-y-1">
            <p className="text-[#E6C687] font-bold uppercase tracking-[0.45em] text-[9px]">
              Personal Tracking System
            </p>
            <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider leading-none">
              Hành trình: <span className="text-[#ffe3ae]" style={{ textShadow: '0 0 10px rgba(255,227,174,0.35)' }}>Phim Đang Xem</span>
            </h1>
          </div>

          <div className="text-[#d0c5b5]/40 font-bold uppercase text-[10px] tracking-widest flex items-center gap-3">
            <span>Tổng số: {history.length} Tinh cầu</span>
            {isCheckingUpdates && (
              <span className="text-[#ffe3ae] animate-pulse flex items-center gap-1.5 font-bold">
                <Loader2 className="w-3 h-3 animate-spin" /> Rà tìm tập mới...
              </span>
            )}
          </div>
        </div>

        {/* KHỐI BÁO LỖI KÍNH MỜ TRONG SUỐT */}
        {error && (
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-red-500/20 bg-red-950/10 px-5 py-4">
            <p className="text-xs font-semibold text-red-200 tracking-wide">{error}</p>
            <button
              type="button"
              onClick={loadHistory}
              className="px-4 py-2 rounded-xl bg-[#0F1326]/60 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#d0c5b5] hover:border-[#E6C687]/40 hover:text-[#ffe3ae] transition-colors cursor-pointer focus:outline-none"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* 🚀 BANNER THÔNG BÁO CÓ TẬP MỚI PHA LÊ SIÊU SANG CHẢNH */}
        {!isLoading && updatedMovies.length > 0 && (
          <div className="mb-10 rounded-[24px] border border-[#E6C687]/30 bg-[#0F1326]/40 backdrop-blur-2xl px-6 py-5 shadow-2xl animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-[#ffe3ae] text-[10px] font-bold uppercase tracking-[0.25em] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E6C687]" /> Cập nhật tinh hệ mới
                </p>
                <p className="text-xs md:text-sm text-[#e8e1da]/80 font-medium">
                  Phát hiện <span className="text-[#ffe3ae] font-bold">{updatedMovies.length} bộ phim</span> trong lịch sử của anh vừa có chương mới phát sóng.
                </p>
              </div>

              <Link
                href={`/watch/${updatedMovies[0].slug}?ep=${encodeURIComponent(episodeUpdates[updatedMovies[0].slug]?.latestEpisodeName || '1')}`}
                className="px-5 py-2.5 bg-[#E6C687]/10 hover:bg-[#E6C687] border border-[#E6C687]/20 text-[#E6C687] hover:text-[#402d00] font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-95 text-center shadow-md"
              >
                Thưởng thức tập mới nhất
              </Link>
            </div>
          </div>
        )}

        {/* GRID HIỂN THỊ DANH SÁCH LỊCH SỬ XEM PHIM */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-video bg-[#0F1326]/40 border border-white/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : history.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 md:gap-y-10">
            {history.map((item) => (
              <div key={item.slug} className="group/card relative animate-in fade-in duration-500">
                
                {/* Tag báo có tập mới lơ lửng góc trái card phim */}
                {episodeUpdates[item.slug] && (
                  <Link
                    href={`/watch/${item.slug}?ep=${encodeURIComponent(episodeUpdates[item.slug].latestEpisodeName)}`}
                    className="absolute top-3 left-3 z-20 rounded-full bg-[#E6C687]/10 border border-[#E6C687]/30 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-[#ffe3ae] shadow-xl backdrop-blur-md hover:bg-[#E6C687] hover:text-[#402d00] transition-all duration-300 font-sans"
                  >
                    Mới: Tập {getEpisodeLabel(episodeUpdates[item.slug].latestEpisodeName)}
                  </Link>
                )}

                {/* NÚT XOÁ KHỎI LỊCH SỬ CHUẨN PHA LÊ KÍNH MỜ */}
                <button
                  type="button"
                  aria-label={`Xoá ${item.name} khỏi lịch sử xem`}
                  onClick={() => removeHistory(item.slug)}
                  className="absolute top-3 right-3 w-8 h-8 bg-[#0F1326]/80 border border-white/10 rounded-full flex items-center justify-center text-[#d0c5b5]/60 hover:bg-amber-500 hover:text-white transition-all z-20 shadow-xl md:opacity-0 md:group-hover/card:opacity-100 focus:outline-none cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* KHUNG POSTER NGANG ASPECT-VIDEO CAO CẤP */}
                <Link
                  href={`/watch/${item.slug}?ep=${item.episode || '1'}`}
                  className="block"
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 group-hover/card:border-[#E6C687]/30 transition-all duration-500 bg-[#0F1326]/40 shadow-2xl">
                    <img
                      src={item.thumb_url}
                      alt={item.name}
                      className="w-full h-full object-cover opacity-50 group-hover/card:opacity-80 group-hover/card:scale-105 transition-all duration-700"
                      loading="lazy"
                    />

                    {/* Lớp thông tin phủ bóng mờ dưới chân card */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1326] via-[#0F1326]/30 to-transparent p-4 flex flex-col justify-end">
                      <h3 className="text-white font-bold text-sm uppercase truncate tracking-wide mb-1.5 group-hover/card:text-[#ffe3ae] transition-colors leading-snug">
                        {item.name}
                      </h3>

                      {/* Vết tiến trình chòm sao đang xem */}
                      <span className="w-fit text-[#ffe3ae] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 bg-[#E6C687]/5 px-2 py-0.5 rounded border border-[#E6C687]/10">
                        <Clock className="w-3 h-3 text-[#E6C687]" />
                        Tập {getEpisodeLabel(item.episode)}
                      </span>

                      {/* Ghi chú tập mới ra lò ngay bên dưới */}
                      {episodeUpdates[item.slug] && (
                        <span className="mt-2 w-fit text-[#d0c5b5]/40 text-[9px] font-bold uppercase tracking-widest pl-0.5 flex items-center gap-1">
                          <Tv className="w-3 h-3" /> Đã có Tập {getEpisodeLabel(episodeUpdates[item.slug].latestEpisodeName)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          /* TRẠNG THÁI TRỐNG RỖNG CHUẨN TỐI GIẢN ĐIỆN ẢNH */
          <div className="py-24 text-center flex flex-col items-center justify-center gap-3 border border-dashed border-white/5 rounded-[32px] bg-[#0F1326]/10 backdrop-blur-md max-w-4xl mx-auto px-6 animate-in fade-in duration-500">
            <HelpCircle className="w-10 h-10 text-[#d0c5b5]/20 animate-bounce" />
            <p className="text-[#d0c5b5]/20 text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none select-none">
              Chưa có phim
            </p>
            <p className="text-[#d0c5b5]/40 font-semibold uppercase tracking-[0.2em] text-[10px] leading-relaxed max-w-md">
              Hành trình lưu trữ của anh hiện đang trống rỗng. Hãy đi lùng sục các bộ phim bom tấn ngay nhé.
            </p>
            <Link
              href="/home"
              className="mt-4 px-6 py-2.5 bg-[#E6C687]/10 hover:bg-[#E6C687] border border-[#E6C687]/20 text-[#E6C687] hover:text-[#402d00] text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-95 shadow-md"
            >
              Khám phá ngay tinh hệ
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}