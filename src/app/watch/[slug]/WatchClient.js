'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import RelatedMovies from '@/components/RelatedMovies';
import Footer from '@/components/Footer';

// 🚀 SỬ DỤNG TRIỆT ĐỂ: Gọi các linh kiện con anh đã bóc tách ra dùng
import WatchPlayer from '@/components/watch/WatchPlayer';
import WatchMetadata from '@/components/watch/WatchMetadata';
import WatchTabs from '@/components/watch/WatchTabs';
import MiniPlayerDock from '@/components/watch/MiniPlayerDock';

function chunkEpisodes(eps, size = 20) {
  const out = [];
  for (let i = 0; i < eps.length; i += size) out.push(eps.slice(i, i + size));
  return out;
}

export default function WatchClient({ initialMovie, slug }) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [movie] = useState(initialMovie);
  const [activeTab, setActiveTab] = useState('episodes');
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // 🚀 CHÈN THÊM VÀO ĐÂY: Quản lý trạng thái yêu thích kết nối MongoDB
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Tự động kiểm tra trạng thái yêu thích từ DB khi vừa nạp phim
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const res = await fetch(`/api/favorites/check?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setIsFavorite(data.isFavorite);
        }
      } catch (err) {
        console.error("Lỗi kiểm tra trạng thái yêu thích:", err);
      }
    };
    if (slug) checkFavoriteStatus();
  }, [slug]);

  // Hàm xử lý khi bấm nút Yêu thích
  const handleToggleFavorite = async () => {
    if (favLoading) return;
    setFavLoading(true);
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: slug,
          name: movie.name,
          thumb_url: movie.thumb_url || movie.poster_url,
        }),
      });
      if (res.ok) {
        setIsFavorite(prev => !prev);
      }
    } catch (err) {
      console.error("Lỗi xử lý yêu thích:", err);
    } finally {
      setFavLoading(false);
    }
  };

  const servers = movie?.episodes || [];
  const epFromUrl = searchParams.get('ep');

  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(() => {
    const eps = servers[0]?.items || [];
    if (epFromUrl && eps.length > 0) {
      const idx = eps.findIndex(e => e.name === epFromUrl);
      return idx !== -1 ? idx : 0;
    }
    return 0;
  });

  const [activeChunk, setActiveChunk] = useState(() => {
    const eps = servers[0]?.items || [];
    if (epFromUrl && eps.length > 0) {
      const idx = eps.findIndex(e => e.name === epFromUrl);
      return idx !== -1 ? Math.floor(idx / 20) : 0;
    }
    return 0;
  });

  const playerRef = useRef(null);
  const historyTimerRef = useRef(null);
  const loadingTimerRef = useRef(null);

  const currentEpisodes = servers[selectedServer]?.items || [];
  const episodeChunks = chunkEpisodes(currentEpisodes, 20);
  const currentEp = currentEpisodes[selectedEpisode];

  // ── Spinner fallback timeout ──
  useEffect(() => {
    clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = setTimeout(() => setIsLoading(false), 12000);
    return () => clearTimeout(loadingTimerRef.current);
  }, [selectedEpisode, selectedServer]);

  // ── Ghi history sau 30s ──
  useEffect(() => {
    if (!movie || !currentEp) return;
    clearTimeout(historyTimerRef.current);
    historyTimerRef.current = setTimeout(async () => {
      const item = {
        slug,
        name: movie.name,
        thumb_url: movie.thumb_url,
        time: new Date().toLocaleDateString('vi-VN'),
        episode: currentEp.name || '1'
      };
      try {
        const h = JSON.parse(localStorage.getItem('watchHistory') || '[]');
        localStorage.setItem('watchHistory', JSON.stringify([item, ...h.filter(x => x.slug !== slug)].slice(0, 10)));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('historyUpdated'));
      } catch (_) { }

      if (session?.user?.email) {
        try {
          await fetch('/api/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ movie: item, userEmail: session.user.email })
          });
        } catch (_) { }
      }
    }, 30000);
    return () => clearTimeout(historyTimerRef.current);
  }, [movie, slug, selectedEpisode, selectedServer, currentEp, session]);

  // 🚀 ĐÃ SỬA: Hàm thường tinh gọn cho mục tiêu tối ưu tự động của React Compiler
  const getEmbedUrl = () => {
    const url = currentEp?.embed;
    if (!url) return '';
    return `${url}${url.includes('?') ? '&' : '?'}t=0&autoplay=1`;
  };

  const handleEpisodeChange = useCallback((index, epName) => {
    if (index === selectedEpisode) return;

    // Bật hiệu ứng loading ngay khoảnh khắc click chuột
    setIsLoading(true);
    setIframeError(false);

    setSelectedEpisode(index);
    router.replace(`/watch/${slug}?ep=${epName}`, { scroll: false });
    playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedEpisode, router, slug]);

  const handleServerChange = useCallback((index) => {
    if (index === selectedServer) return;

    // Bật hiệu ứng loading ngay khoảnh khắc đổi Server nguồn phát
    setIsLoading(true);
    setIframeError(false);

    setSelectedServer(index);
    setSelectedEpisode(0);
    setActiveChunk(0);
  }, [selectedServer]);

  if (!movie) return null;

  const genre = movie.category?.['3']?.list?.[0]?.name || '';
  const country = movie.category?.['4']?.list?.[0]?.name || '';
  const epName = currentEp?.name || '1';
  const totalEps = currentEpisodes.length;

  return (
    // 🚀 TẦNG ROOT TỐI CAO: Để chiều dọc, cuộn tự nhiên toàn trang
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white font-sans antialiased flex flex-col overflow-x-hidden select-none">

      {/* 1. HEADER (Luôn nằm trên đỉnh) */}
      <Header
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* 2. TẦNG THÂN GIỮA CHỈ CHỨA SIDEBAR VÀ KHỐI PLAYER */}
      <div className="flex flex-1 w-full relative">

        {/* SIDEBAR BÊN TRÁI CỦA ANH */}
        <Sidebar collapsed={sidebarCollapsed} />

        {/* KHU VỰC RUỘT CHỨA NỘI DUNG CHÍNH (Xóa bỏ Footer ở trong này) */}
        <div className="flex-1 min-w-0 w-full flex flex-col">

          {/* CONTAINER LẤP ĐẦY KHOẢNG TRỐNG KHI ĐÓNG SIDEBAR */}
          <div className="w-full max-w-[1680px] mx-auto px-4 md:px-8 xl:px-10 py-6 grid grid-cols-1 xl:grid-cols-[1fr_290px] 2xl:grid-cols-[1fr_320px] gap-6 flex-1">

            {/* ── CỘT TRÁI (Player + Metadata + Tabs) ── */}
            <div className="min-w-0 w-full space-y-5">
              <WatchPlayer
                movie={movie} currentEp={currentEp} selectedServer={selectedServer} epName={epName}
                isLoading={isLoading} iframeError={iframeError} getEmbedUrl={getEmbedUrl}
                setIsLoading={setIsLoading} setIframeError={setIframeError}
              />
              <WatchMetadata
                movie={movie} genre={genre} country={country}
                isDescExpanded={isDescExpanded} setIsDescExpanded={setIsDescExpanded}
                isFavorite={isFavorite}
                favLoading={favLoading}
                onToggleFavorite={handleToggleFavorite}
              />
              <WatchTabs
                activeTab={activeTab} setActiveTab={setActiveTab} episodeChunks={episodeChunks}
                activeChunk={activeChunk} setActiveChunk={setActiveChunk} servers={servers}
                selectedServer={selectedServer} handleServerChange={handleServerChange}
                currentEpisodes={currentEpisodes} selectedEpisode={selectedEpisode}
                handleEpisodeChange={handleEpisodeChange} movie={movie}
              />
            </div>

            {/* ── CỘT PHẢI (Danh sách tập + Đề xuất) ── */}
            <aside className="w-full space-y-5 min-w-0">
              {/* ── 🚀 ĐÃ TỐI ƯU: Cụm Dropdown chọn Máy chủ tinh tế ── */}
              <div className="relative group">
                <div className="bg-[#111115] border border-white/5 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:border-white/10 active:scale-[0.99] transition-all">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Máy chủ</span>
                  <span className="flex items-center gap-1.5 text-[10px] font-black text-red-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {servers[selectedServer]?.server_name || 'Server 1'}
                    {/* Mũi tên chỉ xuống báo hiệu có menu */}
                    <svg className="w-3 height-3 text-zinc-500 ml-1 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>

                {/* Danh sách các Server ẩn hiện khi hover hoặc click vào cụm */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#111115]/95 backdrop-blur-xl border border-white/5 rounded-2xl p-1.5 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-3 py-2 text-[9px] font-black uppercase tracking-widest text-zinc-600 border-b border-white/[0.02] mb-1">
                    Chọn nguồn phát
                  </div>
                  <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-0.5">
                    {servers && servers.map((srv, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (typeof setSelectedServer === 'function') {
                            setSelectedServer(idx); // Kích hoạt hàm đổi Server của anh
                            if (typeof setIsLoading === 'function') setIsLoading(true); // Bật hiệu ứng loading cho player
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-between ${selectedServer === idx
                            ? 'bg-red-600 text-white font-black'
                            : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                          }`}
                      >
                        <span>{srv?.server_name || `Server ${idx + 1}`}</span>
                        {selectedServer === idx && <span className="text-[9px]">●</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#111115] border border-white/5 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Danh sách tập</span>
                  {episodeChunks.length > 1 && (
                    <div className="relative">
                      <select value={activeChunk} onChange={e => setActiveChunk(Number(e.target.value))} className="appearance-none bg-transparent text-[10px] font-black text-zinc-600 outline-none pr-4 cursor-pointer">
                        {episodeChunks.map((chunk, i) => <option key={i} value={i}>{chunk[0].name}–{chunk[chunk.length - 1].name}</option>)}
                      </select>
                      <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-zinc-700 text-[10px]">▾</span>
                    </div>
                  )}
                </div>

                <div className="overflow-y-auto max-h-[320px] px-2 py-2 space-y-0.5 custom-scrollbar">
                  {currentEpisodes.map((ep, idx) => {
                    const isActive = selectedEpisode === idx;
                    const globalChunkIdx = Math.floor(idx / 20);
                    if (episodeChunks.length > 1 && globalChunkIdx !== activeChunk) return null;

                    return (
                      <button key={idx} onClick={() => handleEpisodeChange(idx, ep.name)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${isActive ? 'bg-red-600/10 text-white' : 'text-zinc-500 hover:bg-white/[0.02]'}`}>
                        <div className="flex items-center gap-3">
                          <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                            {isActive ? (
                              <span className="flex items-end gap-[2px] h-3 shrink-0">
                                <span className="w-[2px] rounded-full bg-red-500 animate-[sb_0.8s_ease-in-out_infinite]" style={{ height: '100%' }} />
                                <span className="w-[2px] rounded-full bg-red-500 animate-[sb_0.8s_ease-in-out_0.2s_infinite]" style={{ height: '60%' }} />
                                <span className="w-[2px] rounded-full bg-red-500 animate-[sb_0.8s_ease-in-out_0.4s_infinite]" style={{ height: '80%' }} />
                              </span>
                            ) : <span className="text-[9px] text-zinc-700 group-hover:text-zinc-400">▶</span>}
                          </span>
                          <span className="text-[12px] font-black tracking-wide">{ep.name === 'Full' ? 'FULL' : `Tập ${ep.name}`}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#111115] border border-white/5 rounded-2xl overflow-hidden p-2">
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-2 py-2.5 mb-1">Có thể bạn thích</span>
                {movie && <RelatedMovies key={`sb-${slug}`} allCategories={movie.category} isSidebarMode={true} />}
              </div>
            </aside>

          </div>
        </div>
      </div> {/* 🚀 ĐÓNG KHỐI FLEX NGANG TẠI ĐÂY */}

      {/* 3. 🚀 ĐƯA FOOTER RA ĐÂY: Nằm độc lập ngoài khối ngang, bám đáy tràn viền 100% màn hình phẳng luôn! */}
      <Footer className="w-full shrink-0" />

      {/* 4. BOTTOM MINI PLAYER DOCK */}
      {/* <MiniPlayerDock 
        movie={movie} epName={epName} selectedEpisode={selectedEpisode} totalEps={totalEps}
        currentEpisodes={currentEpisodes} handleEpisodeChange={handleEpisodeChange} playerRef={playerRef}
      /> */}

      <style jsx global>{`
        @keyframes sb {
          0%, 100% { transform: scaleY(1); }
          50%       { transform: scaleY(0.35); }
        }
      `}</style>
    </div>
  );
}