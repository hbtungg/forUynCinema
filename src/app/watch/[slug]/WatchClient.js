'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import RelatedMovies from '@/components/RelatedMovies';
import Footer from '@/components/Footer';

// LINH KIỆN CŨ CỦA ANH
import WatchPlayer from '@/components/watch/WatchPlayer';
import WatchMetadata from '@/components/watch/WatchMetadata';
import WatchTabs from '@/components/watch/WatchTabs';

// LINH KIỆN MỚI BÓC TÁCH SIÊU TINH TẾ
import WatchServerDropdown from '@/components/watch/WatchServerDropdown';
import WatchRightEpList from '@/components/watch/WatchRightEpList';

function chunkEpisodes(eps, size = 20) {
  const out = [];
  for (let i = 0; i < eps.length; i += size) out.push(eps.slice(i, i + size));
  return out;
}

export default function WatchClient({ initialMovie, slug }) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  // 🚀 QUẢN LÝ TRẠNG THÁI DỮ LIỆU TẬP TRUNG: Cho phép cập nhật lại nếu Server truyền xuống bị null do chặn
  const [movie, setMovie] = useState(initialMovie);
  const [activeTab, setActiveTab] = useState('episodes');
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Trạng thái thu gọn Sidebar (Mặc định mở rộng = false)
  
  // Quản lý trạng thái yêu thích kết nối MongoDB Atlas
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // 🚀 CƠ CHẾ CỨU TRỢ NGẦN: Kích hoạt khi Server Vercel bị dính lỗi chặn 429/HTML làm initialMovie bị null
  useEffect(() => {
    if (!initialMovie && slug) {
      async function silentFetchMovieDetail() {
        try {
          // Bốc dữ liệu trực tiếp bằng IP Trình duyệt mạng nhà - Né sạch màng lọc chặn dải IP Vercel
          const res = await fetch(`https://phim.nguonc.com/api/film/${slug}`);
          if (!res.ok) return;
          
          const json = await res.json();
          if (json && json.movie) {
            setMovie(json.movie); // Hồi sinh nạp đầy phim lên toàn bộ giao diện
          }
        } catch (err) {
          console.error("Lỗi Client-side Re-fetch trong WatchClient:", err);
        }
      }
      silentFetchMovieDetail();
    } else if (initialMovie) {
      setMovie(initialMovie);
    }
  }, [initialMovie, slug]);

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
    if (favLoading || !movie) return;
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

  // Khôi phục đồng bộ index khi dữ liệu movie ngầm được bốc về thành công từ Client-side
  useEffect(() => {
    if (servers.length > 0) {
      const eps = servers[selectedServer]?.items || [];
      if (epFromUrl && eps.length > 0) {
        const idx = eps.findIndex(e => e.name === epFromUrl);
        if (idx !== -1) {
          setSelectedEpisode(idx);
          setActiveChunk(Math.floor(idx / 20));
          return;
        }
      }
    }
  }, [movie, epFromUrl, servers, selectedServer]);

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

  // ── Ghi history sau 30s vào MongoDB và LocalStorage ──
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

  const getEmbedUrl = () => {
    const url = currentEp?.embed;
    if (!url) return '';
    return `${url}${url.includes('?') ? '&' : '?'}t=0&autoplay=1`;
  };

  const handleEpisodeChange = useCallback((index, epName) => {
    if (index === selectedEpisode) return;
    setIsLoading(true);
    setIframeError(false);
    setSelectedEpisode(index);
    router.replace(`/watch/${slug}?ep=${epName}`, { scroll: false });
    playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedEpisode, router, slug]);

  const handleThemeServerChange = useCallback((index) => {
    if (index === selectedServer) return;
    setIsLoading(true);
    setIframeError(false);
    setSelectedServer(index);
    setSelectedEpisode(0);
    setActiveChunk(0);
  }, [selectedServer]);

  // 🚀 MÀN HÌNH CHỜ TRONG KHI CHỜ ĐỢI HYDRATION TẢI PHIM (Nếu Server bị chặn đứng hoàn toàn)
  if (!movie) {
    return (
      <div className="h-screen w-screen bg-[#0a0a0c] flex flex-col items-center justify-center font-sans text-white">
        <div className="w-7 h-7 border-2 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[9px] uppercase tracking-[0.3em] text-red-500 font-black animate-pulse">Đang nạp luồng phát...</p>
      </div>
    );
  }

  const genre = movie.category?.['3']?.list?.[0]?.name || '';
  const country = movie.category?.['4']?.list?.[0]?.name || '';
  const epName = currentEp?.name || '1';

  return (
    // KHÓA CỨNG KHUNG VIEW NGOÀI CÙNG
    <div className="h-screen w-screen bg-[#0a0a0c] text-white font-sans antialiased flex flex-col overflow-hidden select-none">

      {/* 1. HEADER (Đứng yên cố định trên đỉnh) */}
      <Header
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* 2. TẦNG THÂN GIỮA (Trừ đi chiều cao Header để nhốt Sidebar khít màn hình) */}
      <div className="flex flex-1 w-full h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] overflow-hidden relative">
        
        {/* SIDEBAR BÊN TRÁI CỦA ANH */}
        <Sidebar collapsed={sidebarCollapsed} />

        {/* KHU VỰC RUỘT CUỘN ĐỘC LẬP (Chứa toàn bộ nội dung xem phim và Footer) */}
        <div className="flex-1 min-w-0 h-full overflow-y-auto custom-scrollbar flex flex-col justify-between">
          
          {/* Grid Layout chứa Player + Cột Phải */}
          <div className="w-full max-w-[1680px] mx-auto px-4 md:px-8 xl:px-10 py-6 grid grid-cols-1 xl:grid-cols-[1fr_290px] 2xl:grid-cols-[1fr_320px] gap-6">

            {/* ── CỘT TRÁI (Player + Metadata + Tabs) ── */}
            <div className="min-w-0 w-full space-y-5">
              <WatchPlayer
                movie={movie} currentEp={currentEp} selectedServer={selectedServer} epName={epName}
                isLoading={isLoading} iframeError={iframeError} getEmbedUrl={getEmbedUrl}
                setIsLoading={setIsLoading} setIframeError={setIframeError}
                collapsed={sidebarCollapsed}
              />
              <WatchMetadata
                movie={movie} genre={genre} country={country}
                isDescExpanded={isDescExpanded} setIsDescExpanded={setIsDescExpanded}
                isFavorite={isFavorite} favLoading={favLoading} onToggleFavorite={handleToggleFavorite}
              />
              <WatchTabs
                activeTab={activeTab} setActiveTab={setActiveTab} episodeChunks={episodeChunks}
                activeChunk={activeChunk} setActiveChunk={setActiveChunk} servers={servers}
                selectedServer={selectedServer} handleServerChange={handleThemeServerChange}
                currentEpisodes={currentEpisodes} selectedEpisode={selectedEpisode}
                handleEpisodeChange={handleEpisodeChange} movie={movie}
              />
            </div>

            {/* ── CỘT PHẢI (Danh sách tập + Đề xuất) ── */}
            <aside className="w-full space-y-5 min-w-0">
              <WatchServerDropdown 
                servers={servers} 
                selectedServer={selectedServer} 
                handleServerChange={handleThemeServerChange} 
              />
              <WatchRightEpList 
                currentEpisodes={currentEpisodes}
                episodeChunks={episodeChunks}
                activeChunk={activeChunk}
                setActiveChunk={setActiveChunk}
                selectedEpisode={selectedEpisode}
                handleEpisodeChange={handleEpisodeChange}
              />
              <div className="bg-[#111115] border border-white/5 rounded-2xl overflow-hidden p-2">
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-2 py-2.5 mb-1">Có thể bạn thích</span>
                {movie && <RelatedMovies key={`sb-${slug}`} allCategories={movie.category} isSidebarMode={true} />}
              </div>
            </aside>

          </div>

          {/* 3. FOOTER ĐÃ ĐƯỢC FIX CHIỀU CAO */}
          <div className="w-full block clear-both mt-auto pt-6 flex-shrink-0">
            <Footer className="w-full" />
          </div>
          
        </div>
        
      </div>

      <style jsx global>{`
        @keyframes sb {
          0%, 100% { transform: scaleY(1); }
          50%       { transform: scaleY(0.35); }
        }
      `}</style>
    </div>
  );
}