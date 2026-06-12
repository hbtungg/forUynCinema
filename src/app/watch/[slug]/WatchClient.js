"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import RelatedMovies from "@/components/RelatedMovies";
import Footer from "@/components/Footer";
import { getMovieDetail } from "@/lib/clientMovies";
import WatchPlayer from "@/components/watch/WatchPlayer";
import WatchMetadata from "@/components/watch/WatchMetadata";
import WatchTabs from "@/components/watch/WatchTabs";
import WatchServerDropdown from "@/components/watch/WatchServerDropdown";
import WatchRightEpList from "@/components/watch/WatchRightEpList";

function chunkEpisodes(eps, size = 20) {
  const out = [];
  for (let i = 0; i < eps.length; i += size) out.push(eps.slice(i, i + size));
  return out;
}

// Skeleton hiển thị trong lúc fetch — thay thế màn hình đen
function WatchSkeleton({ sidebarCollapsed, onToggleSidebar }) {
  return (
    <div className="h-screen w-screen bg-[#0a0a0c] text-white flex flex-col overflow-hidden">
      <Header onToggleSidebar={onToggleSidebar} sidebarCollapsed={sidebarCollapsed} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} />
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-[1680px] mx-auto grid grid-cols-1 xl:grid-cols-[1fr_290px] gap-6">
            <div className="space-y-4">
              {/* Player skeleton */}
              <div className="w-full aspect-video bg-[#111115] rounded-2xl animate-pulse" />
              {/* Metadata skeleton */}
              <div className="space-y-3">
                <div className="h-7 w-2/3 bg-[#111115] rounded-lg animate-pulse" />
                <div className="h-4 w-1/3 bg-[#111115] rounded-lg animate-pulse" />
                <div className="h-4 w-full bg-[#111115] rounded-lg animate-pulse" />
                <div className="h-4 w-5/6 bg-[#111115] rounded-lg animate-pulse" />
              </div>
              {/* Tabs skeleton */}
              <div className="h-12 w-full bg-[#111115] rounded-xl animate-pulse" />
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-9 bg-[#111115] rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            {/* Right panel skeleton */}
            <div className="space-y-4">
              <div className="h-12 bg-[#111115] rounded-xl animate-pulse" />
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 bg-[#111115] rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WatchClient({ slug }) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [movie, setMovie] = useState(null);
  const [servers, setServers] = useState([]);
  const [isFetching, setIsFetching] = useState(true); // fetch lần đầu
  
  // 🚀 CẢI TIẾN 1: Thêm State lưu danh sách phim liên quan bọc từ Client
  const [relatedMovies, setRelatedMovies] = useState([]);

  const [activeTab, setActiveTab] = useState("episodes");
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // loading iframe
  const [iframeError, setIframeError] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const epFromUrl = searchParams.get("ep");
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(0);
  const [activeChunk, setActiveChunk] = useState(0);

  const playerRef = useRef(null);
  const historyTimerRef = useRef(null);
  const loadingTimerRef = useRef(null);
  
  // 🚀 CẢI TIẾN 2: Cờ hiệu khóa chết luồng fetch, chống reload phim vô tội vạ khi đổi tab/app
  const hasFetchedRef = useRef(false);

  const currentEpisodes = useMemo(() => servers[selectedServer]?.items || [], [servers, selectedServer]);
  const episodeChunks = useMemo(() => chunkEpisodes(currentEpisodes, 20), [currentEpisodes]);
  const currentEp = useMemo(() => currentEpisodes[selectedEpisode] || null, [currentEpisodes, selectedEpisode]);

  // Fetch phim từ browser — IP dân cư, Cloudflare không chặn
  useEffect(() => {
    if (!slug) return;
    
    // Đã chặn đứng: Nếu cờ hiệu báo đã từng lấy phim rồi thì đứng im, không chạy lại nữa!
    if (hasFetchedRef.current) return;

    async function fetchAll() {
      setIsFetching(true);
      try {
        // Chạy song song: chi tiết phim + trạng thái yêu thích
        const [resDetail, resFav] = await Promise.all([
          getMovieDetail(slug),
          session?.user?.email
            ? fetch(`/api/favorites/check?slug=${slug}&userEmail=${session.user.email}`)
                .then(r => r.ok ? r.json() : null)
                .catch(() => null)
            : Promise.resolve(null),
        ]);

        if (resFav?.isFavorite !== undefined) setIsFavorite(resFav.isFavorite);

        if (resDetail?.movie) {
          setMovie(resDetail.movie);

          // 🚀 CẢI TIẾN 3: Đổi tiêu đề Tab theo tên phim thật để xóa sổ chữ "Đang tải phim..."
          document.title = `${resDetail.movie.name} - forUyn Cinema 🍿`;

          const rawEps = resDetail.movie.episodes || [];
          const mappedServers = rawEps.map(srv => ({
            server_name: srv.server_name || "Thuyết Minh",
            items: srv.server_data || srv.items || [],
          }));
          setServers(mappedServers);

          // 🚀 CẢI TIẾN 4: Chủ động bốc phim liên quan dựa trên thể loại chính của phim từ Client-side
          try {
            const { getRelatedMovies } = await import("@/lib/movies");
            const categorySlug = resDetail.movie.category?.["3"]?.list?.[0]?.slug || "hanh-dong";
            const relatedData = await getRelatedMovies(categorySlug, 6);
            setRelatedMovies(relatedData || []);
          } catch (relErr) {
            console.error("Lỗi lấy phim liên quan:", relErr);
          }

          // Định vị tập phim từ URL
          if (epFromUrl) {
            const eps = mappedServers[0]?.items || [];
            const idx = eps.findIndex(e => e.name === epFromUrl);
            if (idx !== -1) {
              setSelectedEpisode(idx);
              setActiveChunk(Math.floor(idx / 20));
            }
          }
          
          // Khóa cờ hiệu vĩnh viễn sau khi lấy dữ liệu thành công
          hasFetchedRef.current = true;
        }
      } catch (err) {
        console.error("WatchClient fetch error:", err);
      } finally {
        setIsFetching(false);
        setIsLoading(false);
      }
    }

    fetchAll();
  }, [slug, session, epFromUrl]);

  // Đồng bộ tập phim khi servers thay đổi
  useEffect(() => {
    const eps = servers[selectedServer]?.items || [];
    if (epFromUrl && eps.length > 0) {
      const idx = eps.findIndex(e => e.name === epFromUrl);
      if (idx !== -1) {
        setSelectedEpisode(idx);
        setActiveChunk(Math.floor(idx / 20));
      }
    }
  }, [servers, selectedServer, epFromUrl]);

  // Timeout fallback cho iframe
  useEffect(() => {
    clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = setTimeout(() => setIsLoading(false), 12000);
    return () => clearTimeout(loadingTimerRef.current);
  }, [selectedEpisode, selectedServer]);

  // Ghi lịch sử xem sau 30s
  useEffect(() => {
    if (!movie || !currentEp) return;
    clearTimeout(historyTimerRef.current);
    historyTimerRef.current = setTimeout(async () => {
      const item = {
        slug,
        name: movie.name,
        thumb_url: movie.thumb_url,
        time: new Date().toLocaleDateString("vi-VN"),
        episode: currentEp.name || "1",
      };
      try {
        const h = JSON.parse(localStorage.getItem("watchHistory") || "[]");
        localStorage.setItem("watchHistory", JSON.stringify([item, ...h.filter(x => x.slug !== slug)].slice(0, 10)));
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("historyUpdated"));
      } catch (_) {}
      if (session?.user?.email) {
        try {
          await fetch("/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ movie: item, userEmail: session.user.email }),
          });
        } catch (_) {}
      }
    }, 30000);
    return () => clearTimeout(historyTimerRef.current);
  }, [movie, slug, selectedEpisode, selectedServer, currentEp, session]);

  const handleToggleFavorite = async () => {
    if (favLoading || !movie) return;
    setFavLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          name: movie.name,
          thumb_url: movie.thumb_url || movie.poster_url,
          userEmail: session?.user?.email,
        }),
      });
      if (res.ok) setIsFavorite(prev => !prev);
    } catch (err) {
      console.error("Lỗi yêu thích:", err);
    } finally {
      setFavLoading(false);
    }
  };

  const getEmbedUrl = () => {
    const url = currentEp?.embed;
    if (!url) return "";
    return `${url}${url.includes("?") ? "&" : "?"}t=0&autoplay=1`;
  };

  const handleEpisodeChange = useCallback((index, epName) => {
    if (index === selectedEpisode) return;
    setIsLoading(true);
    setIframeError(false);
    setSelectedEpisode(index);
    router.replace(`/watch/${slug}?ep=${epName}`, { scroll: false });
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedEpisode, router, slug]);

  const handleServerChange = useCallback((index) => {
    if (index === selectedServer) return;
    setIsLoading(true);
    setIframeError(false);
    setSelectedServer(index);
    setSelectedEpisode(0);
    setActiveChunk(0);
  }, [selectedServer]);

  // Hiện skeleton thay vì màn hình đen
  if (isFetching) {
    return (
      <WatchSkeleton
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(v => !v)}
      />
    );
  }

  // Phim không tải được
  if (!movie) {
    return (
      <div className="h-screen w-screen bg-[#0a0a0c] flex flex-col items-center justify-center gap-4 text-white">
        <p className="text-xl font-bold text-red-500">Không thể tải phim này</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-red-600 rounded-xl text-sm font-semibold hover:bg-red-700 transition"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const genre = movie.category?.["3"]?.list?.[0]?.name || "";
  const country = movie.category?.["4"]?.list?.[0]?.name || "";
  const epName = currentEp?.name || "1";

  return (
    <div className="h-screen w-screen bg-[#0a0a0c] text-white font-sans antialiased flex flex-col overflow-hidden select-none">
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} sidebarCollapsed={sidebarCollapsed} />

      <div className="flex flex-1 w-full h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] overflow-hidden relative">
        <Sidebar collapsed={sidebarCollapsed} />

        <div className="flex-1 min-w-0 h-full overflow-y-auto custom-scrollbar flex flex-col justify-between">
          <div className="w-full max-w-[1680px] mx-auto px-4 md:px-8 xl:px-10 py-6 grid grid-cols-1 xl:grid-cols-[1fr_290px] 2xl:grid-cols-[1fr_320px] gap-6">
            <div className="min-w-0 w-full space-y-5">
              <div ref={playerRef}>
                <WatchPlayer
                  movie={movie}
                  currentEp={currentEp}
                  selectedServer={selectedServer}
                  epName={epName}
                  isLoading={isLoading}
                  iframeError={iframeError}
                  getEmbedUrl={getEmbedUrl}
                  setIsLoading={setIsLoading}
                  setIframeError={setIframeError}
                  collapsed={sidebarCollapsed}
                />
              </div>
              <WatchMetadata
                movie={movie}
                genre={genre}
                country={country}
                isDescExpanded={isDescExpanded}
                setIsDescExpanded={setIsDescExpanded}
                isFavorite={isFavorite}
                favLoading={favLoading}
                onToggleFavorite={handleToggleFavorite}
              />
              <WatchTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                episodeChunks={episodeChunks}
                activeChunk={activeChunk}
                setActiveChunk={setActiveChunk}
                servers={servers}
                selectedServer={selectedServer}
                handleServerChange={handleServerChange}
                currentEpisodes={currentEpisodes}
                selectedEpisode={selectedEpisode}
                handleEpisodeChange={handleEpisodeChange}
                movie={movie}
              />
            </div>

            <aside className="w-full space-y-5 min-w-0">
              <WatchServerDropdown servers={servers} selectedServer={selectedServer} handleServerChange={handleServerChange} />
              <WatchRightEpList
                currentEpisodes={currentEpisodes}
                episodeChunks={episodeChunks}
                activeChunk={activeChunk}
                setActiveChunk={setActiveChunk}
                selectedEpisode={selectedEpisode}
                handleEpisodeChange={handleEpisodeChange}
              />
              {/* 🚀 ĐÃ SỬA CHUẨN ĐÉT: Khung đề xuất lấp đầy phim cào mượt mà từ Client */}
              <div className="bg-[#111115] border border-white/5 rounded-2xl overflow-hidden p-2">
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-2 py-2.5 mb-1">
                  Có thể bạn thích
                </span>
                {relatedMovies.length > 0 ? (
                  <RelatedMovies key={`sb-${slug}`} initialMovies={relatedMovies} isSidebarMode={true} />
                ) : (
                  <div className="text-zinc-600 text-xs text-center py-6 animate-pulse">
                    Đang tìm phim tương tự... 🍿
                  </div>
                )}
              </div>
            </aside>
          </div>

          <div className="w-full block clear-both mt-auto pt-6 flex-shrink-0">
            <Footer className="w-full" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a22; border-radius: 99px; }
      `}</style>
    </div>
  );
}