"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import RelatedMovies from "@/components/RelatedMovies";
import Footer from "@/components/Footer";

// 🚀 ĐÃ SỬA: Import tường minh lên đầu file để trình duyệt biên dịch sạch sẽ, không dùng import() động nữa
import { getMovieDetail } from "@/lib/clientMovies";

// LINH KIỆN GIAO DIỆN CỦA ANH
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

export default function WatchClient({ initialMovie, slug }) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Nhận diện dữ liệu linh hoạt từ Server truyền xuống
  const [movie, setMovie] = useState(initialMovie?.movie || null);
  const [servers, setServers] = useState(initialMovie?.episodes || []);

  const [activeTab, setActiveTab] = useState("episodes");
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // Quản lý trạng thái yêu thích kết nối MongoDB Atlas
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const epFromUrl = searchParams.get("ep");
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(0);
  const [activeChunk, setActiveChunk] = useState(0);

  const playerRef = useRef(null);
  const historyTimerRef = useRef(null);
  const loadingTimerRef = useRef(null);

  // 🚀 ĐÃ SỬA: Dùng useMemo để ép React tính toán lại chuẩn đét tập phim ngay khi servers cào bù thành công
  const currentEpisodes = useMemo(() => {
    return servers[selectedServer]?.items || [];
  }, [servers, selectedServer]);

  const episodeChunks = useMemo(() => {
    return chunkEpisodes(currentEpisodes, 20);
  }, [currentEpisodes]);

  const currentEp = useMemo(() => {
    return currentEpisodes[selectedEpisode] || null;
  }, [currentEpisodes, selectedEpisode]);

  // 🚀 LUỒNG BẤT TỬ: Khóa chết lỗi cấu trúc API NguồnC, lấp đầy danh sách tập phim
  useEffect(() => {
    const checkAndFetchMovie = async () => {
      if (session?.user?.email) {
        try {
          const resFav = await fetch(
            `/api/favorites/check?slug=${slug}&userEmail=${session.user.email}`,
          );
          if (resFav.ok) {
            const favData = await resFav.json();
            setIsFavorite(favData.isFavorite);
          }
        } catch (err) {
          console.error("Lỗi kiểm tra trạng thái yêu thích:", err);
        }
      }

      // Kích hoạt cào dữ liệu từ Browser (Do slug xanh và CORS thông suốt hoàn hảo!)
      try {
        const resDetail = await getMovieDetail(slug);
        
        if (resDetail && resDetail.movie) {
          setMovie(resDetail.movie);
          
          // 🚀 BƯỚC NGOẶT CHÍ MẠNG: Ép cấu trúc mảng tập phim của NguồnC (server_data) về dạng chuẩn (.items) của UI
          const rawEps = resDetail.movie.episodes || [];
          const mappedServers = rawEps.map(srv => ({
            server_name: srv.server_name || "Thuyết Minh",
            items: srv.server_data || srv.items || [] // Chuyển đổi server_data thành items để khớp UI của anh!
          }));

          setServers(mappedServers);

          // Định vị tập phim từ URL
          const currentEps = mappedServers[0]?.items || [];
          if (epFromUrl && currentEps.length > 0) {
            const idx = currentEps.findIndex((e) => e.name === epFromUrl);
            if (idx !== -1) {
              setSelectedEpisode(idx);
              setActiveChunk(Math.floor(idx / 20));
            }
          }
        }
      } catch (err) {
        console.error("Lỗi Client fetch bù chi tiết phim:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) checkAndFetchMovie();
  }, [slug, initialMovie, session, epFromUrl]);

  useEffect(() => {
    const eps = servers[selectedServer]?.items || [];
    if (epFromUrl && eps.length > 0) {
      const idx = eps.findIndex((e) => e.name === epFromUrl);
      if (idx !== -1) {
        setSelectedEpisode(idx);
        setActiveChunk(Math.floor(idx / 20));
      }
    }
  }, [servers, selectedServer, epFromUrl]);

  // Hàm xử lý khi bấm nút Yêu thích
  const handleToggleFavorite = async () => {
    if (favLoading || !movie) return;
    setFavLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug,
          name: movie.name,
          thumb_url: movie.thumb_url || movie.poster_url,
          userEmail: session?.user?.email,
        }),
      });
      if (res.ok) {
        setIsFavorite((prev) => !prev);
      }
    } catch (err) {
      console.error("Lỗi xử lý yêu thích:", err);
    } finally {
      setFavLoading(false);
    }
  };

  // Spinner fallback timeout
  useEffect(() => {
    clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = setTimeout(() => setIsLoading(false), 12000);
    return () => clearTimeout(loadingTimerRef.current);
  }, [selectedEpisode, selectedServer]);

  // Ghi history sau 30s vào MongoDB và LocalStorage
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
        localStorage.setItem(
          "watchHistory",
          JSON.stringify(
            [item, ...h.filter((x) => x.slug !== slug)].slice(0, 10),
          ),
        );
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("historyUpdated"));
      } catch (_) {}

      if (session?.user?.email) {
        try {
          await fetch("/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              movie: item,
              userEmail: session.user.email,
            }),
          });
        } catch (_) {}
      }
    }, 30000);
    return () => clearTimeout(historyTimerRef.current);
  }, [movie, slug, selectedEpisode, selectedServer, currentEp, session]);

  const getEmbedUrl = () => {
    const url = currentEp?.embed;
    if (!url) return "";
    return `${url}${url.includes("?") ? "&" : "?"}t=0&autoplay=1`;
  };

  const handleEpisodeChange = useCallback(
    (index, epName) => {
      if (index === selectedEpisode) return;
      setIsLoading(true);
      setIframeError(false);
      setSelectedEpisode(index);
      router.replace(`/watch/${slug}?ep=${epName}`, { scroll: false });
      playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [selectedEpisode, router, slug],
  );

  const handleServerChange = useCallback(
    (index) => {
      if (index === selectedServer) return;
      setIsLoading(true);
      setIframeError(false);
      setSelectedServer(index);
      setSelectedEpisode(0);
      setActiveChunk(0);
    },
    [selectedServer],
  );

  // Fallback loading an toàn nếu dữ liệu phim chưa nạp xong
  if (!movie) {
    return (
      <div className="h-screen w-screen bg-[#0a0a0c] flex items-center justify-center text-red-500 font-bold tracking-widest animate-pulse">
        ĐANG KẾT NỐI MÁY CHIẾU... ❤️
      </div>
    );
  }

  const genre = movie.category?.["3"]?.list?.[0]?.name || "";
  const country = movie.category?.["4"]?.list?.[0]?.name || "";
  const epName = currentEp?.name || "1";

  return (
    <div className="h-screen w-screen bg-[#0a0a0c] text-white font-sans antialiased flex flex-col overflow-hidden select-none">
      <Header
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />

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
              <WatchServerDropdown
                servers={servers}
                selectedServer={selectedServer}
                handleServerChange={handleServerChange}
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
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 px-2 py-2.5 mb-1">
                  Có thể bạn thích
                </span>
                {movie && (
                  <RelatedMovies
                    key={`sb-${slug}`}
                    allCategories={movie.category}
                    isSidebarMode={true}
                  />
                )}
              </div>
            </aside>
          </div>

          <div className="w-full block clear-both mt-auto pt-6 flex-shrink-0">
            <Footer className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}