'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RelatedMovies from '@/components/RelatedMovies';

export default function WatchClient({ initialMovie, slug }) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const [movie, setMovie] = useState(initialMovie);

  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(0);

  const [hasInitialJump, setHasInitialJump] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mặc định tắt chế độ rạp, chỉ hoạt động trên PC rộng
  const [cinemaMode, setCinemaMode] = useState(false);

  const playerRef = useRef(null);
  const epFromUrl = searchParams.get('ep');

  useEffect(() => {
    const handleHistoryAndSync = async () => {
      if (!movie) return;

      const servers = movie.episodes || [];
      const allEpisodes = servers[selectedServer]?.items || [];

      // Nhảy tập từ URL
      if (epFromUrl && !hasInitialJump && allEpisodes.length > 0) {
        const index = allEpisodes.findIndex(
          (e) => e.name === epFromUrl
        );

        if (index !== -1) {
          setSelectedEpisode(index);
          setHasInitialJump(true);
        }
      }

      const currentItem = {
        slug: slug,
        name: movie.name,
        thumb_url: movie.thumb_url,
        time: new Date().toLocaleDateString('vi-VN'),
        episode: allEpisodes[selectedEpisode]?.name || '1',
      };

      // LocalStorage
      const history = JSON.parse(
        localStorage.getItem('watchHistory') || '[]'
      );

      const newHistory = [
        currentItem,
        ...history.filter((item) => item.slug !== slug),
      ].slice(0, 10);

      localStorage.setItem(
        'watchHistory',
        JSON.stringify(newHistory)
      );

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('historyUpdated'));

      // Sync DB
      if (session?.user?.email) {
        await fetch('/api/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            movie: currentItem,
            userEmail: session.user.email,
          }),
        });
      }
    };

    handleHistoryAndSync();
  }, [
    movie,
    selectedServer,
    selectedEpisode,
    session,
    epFromUrl,
    hasInitialJump,
    slug,
  ]);

  if (!movie) return null;

  const servers = movie.episodes || [];
  const currentEpisodes = servers[selectedServer]?.items || [];

  const getCleanEmbedUrl = () => {
    let url = currentEpisodes[selectedEpisode]?.embed;
    if (!url) return '';
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=0&autoplay=1`;
  };

  const handleEpisodeChange = (index, epName) => {
    setIsLoading(true);
    setSelectedEpisode(index);

    const newUrl = `/watch/${slug}?ep=${epName}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    playerRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Header />

      {/* GIẢM PADDING ĐỈNH (pt-20 md:pt-24): Đẩy toàn bộ nội dung lên sát tầm mắt */}
      <div className="px-4 md:px-6 pt-20 md:pt-24 pb-10">
        <div className="max-w-[1600px] mx-auto">

          {/* BACK */}
          <Link
            href="/home"
            className="text-zinc-500 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-4 transition-all group w-fit"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-300">
              ←
            </span>
            Quay lại trang chủ
          </Link>

          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-red-600">
                {movie.name}
              </h1>

              <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mt-1">
                {movie.original_name} •{' '}
                {movie.category?.['3']?.list[0]?.name || 'Đang cập nhật'}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* INFO BADGES - Giữ nguyên gốc */}
              <div className="flex items-center gap-3 text-[10px] font-black uppercase bg-zinc-900/70 border border-zinc-800 px-3 py-2 rounded-lg text-zinc-300">
                <span>
                  Tập {currentEpisodes[selectedEpisode]?.name || '1'}
                </span>
                <span className="text-zinc-700">•</span>
                <span>{movie.quality}</span>
                <span className="text-zinc-700">•</span>
                <span className="text-red-500">{movie.language}</span>
              </div>

              {/* CINEMA BUTTON - Ẩn hoàn toàn trên Mobile (hidden xl:inline-block) */}
              <button
                onClick={() => setCinemaMode(!cinemaMode)}
                className={`hidden xl:inline-block px-4 py-2 rounded-lg text-[10px] uppercase font-black border transition-all ${
                  cinemaMode
                    ? 'bg-white text-black border-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                {cinemaMode ? 'Thoát chế độ rạp' : 'Chế độ rạp'}
              </button>
            </div>
          </div>

          {/* MAIN LAYOUT */}
          <div
            className={`grid gap-5 items-start ${
              cinemaMode
                ? 'grid-cols-1'
                : 'grid-cols-1 xl:grid-cols-[1fr_360px]'
            }`}
          >
            {/* LEFT */}
            <div className="space-y-5">
              {/* PLAYER CONTAINER - Đã tối ưu khống chế chiều cao theo khung nhìn */}
              <div
                ref={playerRef}
                className={`relative overflow-hidden border border-zinc-900 bg-zinc-950 shadow-[0_0_60px_rgba(0,0,0,0.6)] w-full mx-auto mx-auto aspect-video
                ${cinemaMode ? 'max-w-5xl max-h-[75vh] rounded-2xl' : 'max-h-[65vh] rounded-xl'}`}
              >
                <div className="w-full h-full">
                  {isLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                      <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    </div>
                  )}

                  {currentEpisodes[selectedEpisode]?.embed ? (
                    <iframe
                      key={`${slug}-${selectedServer}-${selectedEpisode}`}
                      src={getCleanEmbedUrl()}
                      className="w-full h-full"
                      allowFullScreen
                      onLoad={() => setIsLoading(false)}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-700 italic text-sm text-center px-10">
                      Nguồn phim đang gặp sự cố...
                    </div>
                  )}
                </div>
              </div>

              {/* CINEMA MODE CONTENT (Chỉ hiện dưới player khi bật chế độ rạp trên PC) */}
              {cinemaMode && (
                <div className="space-y-5 max-w-5xl mx-auto">
                  {/* SERVER */}
                  {servers.length > 1 && (
                    <div className="space-y-3">
                      <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                        Chọn Server
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {servers.map((server, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedServer(index);
                              setSelectedEpisode(0);
                            }}
                            className={`px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${
                              selectedServer === index
                                ? 'bg-red-600 border-red-500 text-white'
                                : 'bg-zinc-950 border-zinc-900 text-zinc-500'
                            }`}
                          >
                            {server.server_name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* EPISODES */}
                  <div className="space-y-3">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                      Danh sách tập ({currentEpisodes.length})
                    </h2>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                      {currentEpisodes.map((ep, index) => (
                        <button
                          key={index}
                          onClick={() => handleEpisodeChange(index, ep.name)}
                          className={`px-2 py-1.5 rounded-lg text-[10px] font-black transition-all border ${
                            selectedEpisode === index
                              ? 'bg-white border-white text-black'
                              : 'bg-zinc-950 border-zinc-900 text-zinc-500'
                          }`}
                        >
                          {ep.name === 'Full' ? 'FULL' : `TẬP ${ep.name}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div className="p-5 bg-zinc-900/20 rounded-2xl border border-zinc-900/50">
                    <h3 className="text-[10px] font-black uppercase text-red-600 mb-4 tracking-[0.3em]">
                      Nội dung phim
                    </h3>
                    <div
                      className="text-zinc-400 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: movie.description }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR (Chế độ thường mặc định trên PC / Layout tự động trên Mobile) */}
            {!cinemaMode && (
              <div className="space-y-5 xl:sticky xl:top-24">
                {/* SERVER */}
                {servers.length > 1 && (
                  <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-950/70">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-3">
                      Server
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {servers.map((server, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedServer(index);
                            setSelectedEpisode(0);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${
                            selectedServer === index
                              ? 'bg-red-600 border-red-500 text-white'
                              : 'bg-zinc-950 border-zinc-900 text-zinc-500'
                          }`}
                        >
                          {server.server_name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* EPISODES */}
                <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-950/70">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-3">
                    Danh sách tập
                  </h2>
                  <div className="grid grid-cols-4 gap-2 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                    {currentEpisodes.map((ep, index) => (
                      <button
                        key={index}
                        onClick={() => handleEpisodeChange(index, ep.name)}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-black transition-all border ${
                          selectedEpisode === index
                            ? 'bg-white border-white text-black'
                            : 'bg-zinc-950 border-zinc-900 text-zinc-500'
                        }`}
                      >
                        {ep.name === 'Full' ? 'FULL' : ep.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="p-4 rounded-2xl border border-zinc-900 bg-zinc-950/70">
                  <h3 className="text-[10px] font-black uppercase text-red-600 mb-3 tracking-[0.3em]">
                    Nội dung phim
                  </h3>
                  <div
                    className="text-zinc-400 text-[12px] leading-relaxed max-h-[200px] overflow-y-auto pr-1 custom-scrollbar"
                    dangerouslySetInnerHTML={{ __html: movie.description }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* RELATED */}
          <div className="w-full max-w-[1600px] mx-auto mt-10 pt-6 border-t border-zinc-900/40">
            {movie && <RelatedMovies key={slug} allCategories={movie.category} />}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}