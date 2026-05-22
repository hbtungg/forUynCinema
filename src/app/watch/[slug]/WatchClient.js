'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RelatedMovies from '@/components/RelatedMovies';

// Helper: nhóm tập thành từng chunk (VD: 1-20, 21-40...)
function chunkEpisodes(episodes, size = 20) {
  const chunks = [];
  for (let i = 0; i < episodes.length; i += size) {
    chunks.push(episodes.slice(i, i + size));
  }
  return chunks;
}

export default function WatchClient({ initialMovie, slug }) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [movie] = useState(initialMovie);

  const servers = movie?.episodes || [];
  const epFromUrl = searchParams.get('ep');

  // ── GIẢI PHÁP VÀNG: Khởi tạo State thông minh ngay từ đầu để loại bỏ hoàn toàn Effect 1 ──
  const [selectedServer, setSelectedServer] = useState(0);

  const [selectedEpisode, setSelectedEpisode] = useState(() => {
    const currentEpisodes = servers[0]?.items || [];
    if (epFromUrl && currentEpisodes.length > 0) {
      const index = currentEpisodes.findIndex((e) => e.name === epFromUrl);
      return index !== -1 ? index : 0;
    }
    return 0;
  });

  const [activeChunk, setActiveChunk] = useState(() => {
    const currentEpisodes = servers[0]?.items || [];
    if (epFromUrl && currentEpisodes.length > 0) {
      const index = currentEpisodes.findIndex((e) => e.name === epFromUrl);
      return index !== -1 ? Math.floor(index / 20) : 0;
    }
    return 0;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [cinemaMode, setCinemaMode] = useState(false);

  const playerRef = useRef(null);

  const currentEpisodes = servers[selectedServer]?.items || [];
  const episodeChunks = chunkEpisodes(currentEpisodes, 20);

  // ── Effect 1: ĐÃ XÓA HOÀN TOÀN (Triệt tiêu tận gốc lỗi Cascading Renders) ──

  // ── Effect 2: Ghi lịch sử và Sync DB ──
  useEffect(() => {
    if (!movie || currentEpisodes.length === 0) return;

    const syncHistory = async () => {
      const currentItem = {
        slug,
        name: movie.name,
        thumb_url: movie.thumb_url,
        time: new Date().toLocaleDateString('vi-VN'),
        episode: currentEpisodes[selectedEpisode]?.name || '1',
      };

      // LocalStorage
      const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
      const newHistory = [
        currentItem,
        ...history.filter((item) => item.slug !== slug),
      ].slice(0, 10);
      localStorage.setItem('watchHistory', JSON.stringify(newHistory));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('historyUpdated'));

      // Sync DB
      if (session?.user?.email) {
        try {
          await fetch('/api/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ movie: currentItem, userEmail: session.user.email }),
          });
        } catch (err) {
          console.error("Lỗi sync history DB:", err);
        }
      }
    };

    syncHistory();
  }, [selectedEpisode, selectedServer, session, movie, slug, currentEpisodes]);

  // ── Effect 3: Tự động cuộn đưa Player lên đỉnh tầm mắt khi bật Chế độ rạp ──
  useEffect(() => {
    if (cinemaMode && playerRef.current) {
      const timer = setTimeout(() => {
        playerRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [cinemaMode]);

  const getCleanEmbedUrl = () => {
    const url = currentEpisodes[selectedEpisode]?.embed;
    if (!url) return '';
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=0&autoplay=1`;
  };

  const handleEpisodeChange = (index, epName) => {
    setIsLoading(true);
    setSelectedEpisode(index);
    const newUrl = `/watch/${slug}?ep=${epName}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const handleServerChange = (index) => {
    setSelectedServer(index);
    setSelectedEpisode(0);
    setActiveChunk(0);
    setIsLoading(true);
  };

  if (!movie) return null;

  const currentEp = currentEpisodes[selectedEpisode];
  const genre = movie.category?.['3']?.list[0]?.name || 'Đang cập nhật';

  // ── Render Functions ──
  const renderServerSelector = (compact = false) => {
    if (servers.length <= 1) return null;
    return (
      <div className={compact ? '' : 'p-4 rounded-2xl border border-zinc-900 bg-zinc-950/70'}>
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-3">
          Server
        </h2>
        <div className="flex flex-wrap gap-2">
          {servers.map((server, index) => (
            <button
              key={index}
              onClick={() => handleServerChange(index)}
              className={`px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${selectedServer === index
                  ? 'bg-red-600 border-red-500 text-white'
                  : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                }`}
            >
              {server.server_name}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderEpisodeSelector = (compact = false, maxHeight = '320px') => {
    return (
      <div className={compact ? '' : 'p-4 rounded-2xl border border-zinc-900 bg-zinc-950/70'}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
            Danh sách tập ({currentEpisodes.length})
          </h2>
        </div>

        {episodeChunks.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {episodeChunks.map((chunk, i) => (
              <button
                key={i}
                onClick={() => setActiveChunk(i)}
                className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase transition-all border ${activeChunk === i
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                {chunk[0].name}–{chunk[chunk.length - 1].name}
              </button>
            ))}
          </div>
        )}

        <div
          className="grid grid-cols-4 gap-2 overflow-y-auto pr-1 custom-scrollbar"
          style={{ maxHeight }}
        >
          {(episodeChunks[activeChunk] || currentEpisodes).map((ep) => {
            const index = currentEpisodes.indexOf(ep);
            const isActive = selectedEpisode === index;
            return (
              <button
                key={index}
                onClick={() => handleEpisodeChange(index, ep.name)}
                title={`Tập ${ep.name}`}
                className={`px-2 py-1.5 rounded-lg text-[10px] font-black transition-all border ${isActive
                    ? 'bg-white border-white text-black scale-105 shadow-md'
                    : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
              >
                {ep.name === 'Full' ? 'FULL' : ep.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDescription = (compact = false) => {
    return (
      <div className={compact ? '' : 'p-4 rounded-2xl border border-zinc-900 bg-zinc-950/70'}>
        <h3 className="text-[10px] font-black uppercase text-red-600 mb-3 tracking-[0.3em]">
          Nội dung phim
        </h3>
        <div
          className={`text-zinc-400 text-[12px] leading-relaxed overflow-y-auto pr-1 custom-scrollbar ${compact ? '' : 'max-h-[200px]'
            }`}
          dangerouslySetInnerHTML={{ __html: movie.description }}
        />
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Header />

      <div className="px-4 md:px-6 pt-20 md:pt-24 pb-10">
        <div className="max-w-[1600px] mx-auto">

          {/* BACK */}
          <button
            onClick={() => router.push('/home')}
            className="text-zinc-500 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-4 transition-all group w-fit"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-300">
              ←
            </span>
            Quay lại trang chủ
          </button>

          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-red-600">
                {movie.name}
              </h1>
              <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mt-1">
                {movie.original_name} • {genre}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* INFO BADGES */}
              <div className="flex items-center gap-3 text-[10px] font-black uppercase bg-zinc-900/70 border border-zinc-800 px-3 py-2 rounded-lg text-zinc-300">
                <span>Tập {currentEp?.name || '1'}</span>
                <span className="text-zinc-700">•</span>
                <span>{movie.quality}</span>
                <span className="text-zinc-700">•</span>
                <span className="text-red-500">{movie.language}</span>
              </div>

              {/* CINEMA BUTTON (chỉ PC) */}
              <button
                onClick={() => setCinemaMode(!cinemaMode)}
                className={`hidden xl:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] uppercase font-black border transition-all ${cinemaMode
                    ? 'bg-white text-black border-white'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
              >
                {cinemaMode ? (
                  <><span>✕</span> Thoát chế độ rạp</>
                ) : (
                  <><span>⛶</span> Chế độ rạp</>
                )}
              </button>
            </div>
          </div>

          {/* MAIN LAYOUT */}
          <div
            className={`grid gap-5 items-start ${cinemaMode ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-[1fr_360px]'
              }`}
          >
            {/* LEFT */}
            <div className="space-y-5 scroll-mt-6" ref={playerRef}>
              {/* PLAYER */}
              <div
                className={`relative overflow-hidden border border-zinc-900 bg-zinc-950 shadow-[0_0_60px_rgba(0,0,0,0.6)] w-full mx-auto aspect-video ${cinemaMode
                    ? 'max-w-5xl max-h-[75vh] rounded-2xl'
                    : 'max-h-[65vh] rounded-xl'
                  }`}
              >
                {isLoading && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      <span className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">
                        Đang tải...
                      </span>
                    </div>
                  </div>
                )}

                {currentEp?.embed ? (
                  <iframe
                    key={`${slug}-${selectedServer}-${selectedEpisode}`}
                    src={getCleanEmbedUrl()}
                    className="w-full h-full"
                    allowFullScreen
                    title={`${movie.name} - Tập ${currentEp.name}`}
                    onLoad={() => setIsLoading(false)}
                    onError={() => setIsLoading(false)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-700 text-sm text-center px-10">
                    <span className="text-3xl">📡</span>
                    <p className="italic">Nguồn phim đang gặp sự cố...</p>
                    <button
                      onClick={() => setIsLoading(true)}
                      className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-400 border border-zinc-800 px-3 py-1.5 rounded-lg transition-all"
                    >
                      Thử lại
                    </button>
                  </div>
                )}
              </div>

              {/* CINEMA MODE: controls bên dưới player */}
              {cinemaMode && (
                <div className="space-y-5 max-w-5xl mx-auto">
                  {renderServerSelector(true)}
                  {renderEpisodeSelector(true, '240px')}
                  {renderDescription(true)}
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            {!cinemaMode && (
              <div className="space-y-5 xl:sticky xl:top-24">
                {renderServerSelector()}
                {renderEpisodeSelector()}
                {renderDescription()}
              </div>
            )}
          </div>

          {/* RELATED MOVIES */}
          <div className="w-full max-w-[1600px] mx-auto mt-10">
            {movie && <RelatedMovies key={slug} allCategories={movie.category} />}
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}