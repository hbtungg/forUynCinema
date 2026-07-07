"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import RelatedMovies from "@/components/RelatedMovies";
import { getMovieDetail } from "@/lib/clientMovies";
import WatchPlayer from "@/components/watch/WatchPlayer";
import WatchMetadata from "@/components/watch/WatchMetadata";
import WatchTabs from "@/components/watch/WatchTabs";
import WatchServerDropdown from "@/components/watch/WatchServerDropdown";
import WatchRightEpList from "@/components/watch/WatchRightEpList";
import { Loader2, ArrowLeft } from "lucide-react";

function chunkEpisodes(eps, size = 20) {
  const out = [];
  for (let i = 0; i < eps.length; i += size) out.push(eps.slice(i, i + size));
  return out;
}

function normalizeEpisodeMatchKey(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/^(tập|ep)\s*/i, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function findEpisodeIndex(items = [], target = "") {
  const targetKey = normalizeEpisodeMatchKey(target);
  if (!targetKey) return -1;

  return items.findIndex((item) => {
    const candidateKeys = [item?.name, item?.title, item?.slug, item?.episode]
      .filter(Boolean)
      .map(normalizeEpisodeMatchKey);

    return candidateKeys.includes(targetKey);
  });
}

// 🚀 SỬA CHÍ MẠNG: Skeleton trong suốt đón Shader, gọt bỏ Header/Sidebar thừa
function WatchSkeleton() {
  return (
    <div className="w-full min-h-screen bg-transparent text-[#e8e1da] py-6 font-sans">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-[1fr_300px] 2xl:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-4">
          <div className="w-full aspect-video bg-[#0F1326]/40 border border-white/5 rounded-2xl animate-pulse" />
          <div className="space-y-3">
            <div className="h-7 w-2/3 bg-[#0F1326]/40 border border-white/5 rounded-lg animate-pulse" />
            <div className="h-4 w-1/3 bg-[#0F1326]/40 border border-white/5 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-12 bg-[#0F1326]/40 border border-white/5 rounded-xl animate-pulse" />
          <div className="h-64 bg-[#0F1326]/40 border border-white/5 rounded-2xl animate-pulse" />
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
  const [isFetching, setIsFetching] = useState(true);
  const [relatedMovies, setRelatedMovies] = useState([]);

  const [activeTab, setActiveTab] = useState("episodes");
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const epFromUrl = searchParams.get("ep");
  const [selectedProvider, setSelectedProvider] = useState("auto");
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(0);
  const [activeChunk, setActiveChunk] = useState(0);

  const playerRef = useRef(null);
  const historyTimerRef = useRef(null);
  const loadingTimerRef = useRef(null);

  const fetchKeyRef = useRef("");

  const currentEpisodes = useMemo(() => servers[selectedServer]?.items || [], [servers, selectedServer]);
  const episodeChunks = useMemo(() => chunkEpisodes(currentEpisodes, 20), [currentEpisodes]);
  const currentEp = useMemo(() => currentEpisodes[selectedEpisode] || null, [currentEpisodes, selectedEpisode]);

  useEffect(() => {
    if (!slug) return;

    const fetchKey = `${slug}:${selectedProvider}:${session?.user?.email || "guest"}`;
    if (fetchKeyRef.current === fetchKey) return;
    fetchKeyRef.current = fetchKey;

    async function fetchAll() {
      const previousServerIndex = selectedServer;
      const previousEpisodeIndex = selectedEpisode;
      const previousEpisodeName = currentEp?.name || epFromUrl || "";

      setIsFetching(true);
      setMovie(null);
      setServers([]);
      setSelectedServer(0);
      setSelectedEpisode(0);
      setActiveChunk(0);
      setIsLoading(true);
      setIframeError(false);
      setIsDescExpanded(false);
      setRelatedMovies([]);
      try {
        const [resDetail, resFav] = await Promise.all([
          getMovieDetail(slug, selectedProvider === "auto" ? null : selectedProvider),
          session?.user?.email
            ? fetch(`/api/favorites/check?slug=${slug}&userEmail=${session.user.email}`)
              .then(r => r.ok ? r.json() : null)
              .catch(() => null)
            : Promise.resolve(null),
        ]);

        if (resFav?.isFavorite !== undefined) setIsFavorite(resFav.isFavorite);

        if (resDetail?.movie) {
          setMovie(resDetail.movie);
          document.title = `${resDetail.movie.name} - Uynflix`;

          const rawEps = resDetail.movie.episodes || [];
          const mappedServers = rawEps.map(srv => ({
            server_name: srv.server_name || "Thuyết Minh",
            items: srv.server_data || srv.items || [],
          }));
          setServers(mappedServers);

          try {
            const { getRelatedMovies } = await import("@/lib/movies");
            const categorySlug = resDetail.movie.category?.["3"]?.list?.[0]?.slug || "hanh-dong";
            const relatedData = await getRelatedMovies(categorySlug, 6);
            setRelatedMovies(relatedData || []);
          } catch (relErr) {
            console.error("Lỗi lấy phim liên quan:", relErr);
          }

          if (epFromUrl) {
            let matchedServer = -1;
            let matchedEpisode = -1;

            for (let i = 0; i < mappedServers.length; i += 1) {
              const items = mappedServers[i]?.items || [];
              const episodeIndex = findEpisodeIndex(items, epFromUrl);
              if (episodeIndex !== -1) {
                matchedServer = i;
                matchedEpisode = episodeIndex;
                break;
              }
            }

            if (matchedServer !== -1 && matchedEpisode !== -1) {
              setSelectedServer(matchedServer);
              setSelectedEpisode(matchedEpisode);
              setActiveChunk(Math.floor(matchedEpisode / 20));
            } else {
              const fallbackServerIndex = Math.max(0, Math.min(previousServerIndex, mappedServers.length - 1));
              const fallbackItems = mappedServers[fallbackServerIndex]?.items || [];
              const fallbackByName = findEpisodeIndex(fallbackItems, previousEpisodeName);
              const fallbackByIndex = fallbackItems[previousEpisodeIndex] ? previousEpisodeIndex : 0;
              const finalFallbackIndex = fallbackByName !== -1 ? fallbackByName : fallbackByIndex;

              if (fallbackItems[finalFallbackIndex]) {
                setSelectedServer(fallbackServerIndex);
                setSelectedEpisode(finalFallbackIndex);
                setActiveChunk(Math.floor(finalFallbackIndex / 20));
              }
            }
          }
        }
      } catch (err) {
        console.error("WatchClient fetch error:", err);
      } finally {
        setIsFetching(false);
        setIsLoading(false);
      }
    }

    fetchAll();
  }, [slug, session, selectedProvider]);

  useEffect(() => {
    const eps = servers[selectedServer]?.items || [];
    if (epFromUrl && eps.length > 0) {
      const idx = findEpisodeIndex(eps, epFromUrl);
      if (idx !== -1) {
        setSelectedEpisode(idx);
        setActiveChunk(Math.floor(idx / 20));
      }
    }
  }, [servers, selectedServer, epFromUrl]);

  useEffect(() => {
    clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = setTimeout(() => setIsLoading(false), 12000);
    return () => clearTimeout(loadingTimerRef.current);
  }, [selectedEpisode, selectedServer]);

  useEffect(() => {
    if (!movie || !currentEp) return;
    clearTimeout(historyTimerRef.current);
    historyTimerRef.current = setTimeout(async () => {
      const item = {
        slug,
        provider: movie.provider || "nguonc",
        providerSlug: movie.providerSlug || slug,
        canonicalKey: movie.canonicalKey || `${movie.origin_name || movie.name || slug}-${movie.year || ""}`,
        name: movie.name,
        origin_name: movie.origin_name || movie.original_name || "",
        year: movie.year || "",
        thumb_url: movie.thumb_url || movie.poster_url,
        poster_url: movie.poster_url || movie.thumb_url,
        time: new Date().toLocaleDateString("vi-VN"),
        episode: currentEp.name || "1",
        episodeIndex: selectedEpisode,
        serverIndex: selectedServer,
      };
      try {
        const h = JSON.parse(localStorage.getItem("watchHistory") || "[]");
        const sameMovie = (x) => (
          (item.canonicalKey && x.canonicalKey === item.canonicalKey) ||
          x.slug === slug
        );
        localStorage.setItem("watchHistory", JSON.stringify([item, ...h.filter(x => !sameMovie(x))].slice(0, 10)));
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("historyUpdated"));
      } catch (_) { }
      if (session?.user?.email) {
        try {
          await fetch("/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ movie: item, userEmail: session.user.email }),
          });
        } catch (_) { }
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
          movie: {
            slug,
            provider: movie.provider || "nguonc",
            providerSlug: movie.providerSlug || slug,
            canonicalKey: movie.canonicalKey || `${movie.origin_name || movie.name || slug}-${movie.year || ""}`,
            name: movie.name,
            origin_name: movie.origin_name || movie.original_name || "",
            year: movie.year || "",
            thumb_url: movie.thumb_url || movie.poster_url,
            poster_url: movie.poster_url || movie.thumb_url,
          },
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
    setActiveChunk(Math.floor(index / 20));
    router.replace(`/watch/${slug}?ep=${encodeURIComponent(epName)}`, { scroll: false });
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

  if (isFetching) return <WatchSkeleton />;

  if (!movie) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4 text-white">
        <p className="text-sm font-bold text-[#E6C687]">Không thể tải tọa độ bộ phim này</p>
        <button
          onClick={() => router.back()}
          className="px-5 py-2 bg-[#0F1326]/60 border border-white/10 text-xs font-bold rounded-xl hover:text-[#ffe3ae] transition-all"
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
    /* 🚀 ĐÃ CẢI TẠO LUỒNG PHẲNG LỲ: Xóa sạch h-screen bọc ngoài, trong suốt hoàn toàn, items-start */
    <div className="w-full min-h-screen bg-transparent text-[#e8e1da] font-sans antialiased select-none pb-24" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* NÚT QUAY LẠI PHÍA TRÊN BÊN TRÁI CHUẨN PHA LÊ MOONLIGHT */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 xl:px-10 pt-2 pb-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-[#0F1326]/60 backdrop-blur-md border border-white/10 text-[#d0c5b5] hover:text-[#ffe3ae] rounded-xl font-bold text-[10px] uppercase transition-all duration-300 hover:border-[#E6C687]/40 shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quay lại
        </button>
      </div>

      {/* KHUNG KHỐI CHÍNH TĂNG ĐỘ RỘNG MAX-W-[1800PX] CHUẨN ĐIỆN ẢNH IMAX */}
      <div className="w-full max-w-[1800px] mx-auto px-4 md:px-8 xl:px-10 grid grid-cols-1 xl:grid-cols-[1fr_300px] 2xl:grid-cols-[1fr_340px] gap-6 items-start">

        {/* KHỐI TRÁI: PLAYER CHÍNH VÀ METADATA TẬP PHIM */}
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
              collapsed={true}
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
            selectedProvider={selectedProvider}
            setSelectedProvider={setSelectedProvider}
          />
        </div>

        {/* KHỐI PHẢI: ASIDE PANEL GỌN GÀNG KÍNH MỜ XANH ĐÊM (CUỘN TRÔI THEO TRANG TRƠN TRU) */}
        <aside className="w-full space-y-5 min-w-0 bg-[#0F1326]/40 backdrop-blur-2xl border border-white/5 p-4 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <WatchServerDropdown servers={servers} selectedServer={selectedServer} handleServerChange={handleServerChange} />
          <WatchRightEpList
            currentEpisodes={currentEpisodes}
            episodeChunks={episodeChunks}
            activeChunk={activeChunk}
            setActiveChunk={setActiveChunk}
            selectedEpisode={selectedEpisode}
            handleEpisodeChange={handleEpisodeChange}
          />

          {/* KHAY ĐỀ XUẤT LIÊN QUAN CHUẨN MOONLIGHT GOLD */}
          <div className="border-t border-white/5 pt-4">
            <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-[#d0c5b5]/40 px-1 mb-3">
              Có thể bạn thích
            </span>
            {relatedMovies.length > 0 ? (
              <RelatedMovies key={`sb-${slug}`} initialMovies={relatedMovies} isSidebarMode={true} />
            ) : (
              <div className="flex items-center justify-center py-8 gap-2 text-[#d0c5b5]/30 text-xs uppercase tracking-widest font-bold">
                <Loader2 className="w-3.5 h-3.5 border-2 border-[#E6C687]/20 border-t-[#E6C687] rounded-full animate-spin text-[#E6C687]" />
                <span>Đang tìm tọa độ...</span>
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}