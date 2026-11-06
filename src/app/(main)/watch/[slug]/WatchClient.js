"use client";

import { useState, useEffect, useRef, useCallback, useMemo, useEffectEvent } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import RelatedMovies from "@/components/RelatedMovies";
import { getMovieDetail } from "@/lib/clientMovies";
import WatchPlayer from "@/components/watch/WatchPlayer";
import WatchMetadata from "@/components/watch/WatchMetadata";
import WatchTabs from "@/components/watch/WatchTabs";
import { authHref } from "@/lib/authNavigation";
import { watchHref } from "@/lib/watchNavigation";
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
    <div className="w-full min-h-screen bg-transparent text-[#ffffff] py-6 font-sans">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_340px] gap-6">
        <div className="space-y-4">
          <div className="w-full aspect-video bg-white/[0.04] border border-white/5 rounded-2xl animate-pulse" />
          <div className="space-y-3">
            <div className="h-7 w-2/3 bg-white/[0.04] border border-white/5 rounded-lg animate-pulse" />
            <div className="h-4 w-1/3 bg-white/[0.04] border border-white/5 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-12 bg-white/[0.04] border border-white/5 rounded-xl animate-pulse" />
          <div className="h-64 bg-white/[0.04] border border-white/5 rounded-2xl animate-pulse" />
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
  const [relatedMovies, setRelatedMovies] = useState(null);

  const [activeTab, setActiveTab] = useState("episodes");
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const epFromUrl = searchParams.get("ep");
  const [selectedProvider, setSelectedProvider] = useState(() => {
    const provider = searchParams.get('provider');
    return ['nguonc', 'kkphim'].includes(provider) ? provider : 'auto';
  });
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(0);
  const [activeChunk, setActiveChunk] = useState(0);

  const playerRef = useRef(null);
  const historyTimerRef = useRef(null);
  const playbackRef = useRef({});
  const [resumeHistory, setResumeHistory] = useState(null);
  const accountEmail = session?.user?.email;
  const [retry, setRetry] = useState(0);

  const currentEpisodes = useMemo(() => servers[selectedServer]?.items || [], [servers, selectedServer]);
  const episodeChunks = useMemo(() => chunkEpisodes(currentEpisodes, 20), [currentEpisodes]);
  const currentEp = useMemo(() => currentEpisodes[selectedEpisode] || null, [currentEpisodes, selectedEpisode]);

  useEffect(() => {
    if (!accountEmail || !movie?.canonicalKey) return;
    const controller = new AbortController();
    fetch("/api/history", { signal: controller.signal }).then(response => response.ok ? response.json() : null).then(data => {
      if (controller.signal.aborted) return;
      const items = Array.isArray(data) ? data : data?.movies || [];
      setResumeHistory({ email: accountEmail, key: movie.canonicalKey, items });
    }).catch(() => {});
    return () => controller.abort();
  }, [accountEmail, movie?.canonicalKey]);

  useEffect(() => {
    playbackRef.current = {};
  }, [currentEp?.name, currentEp?.m3u8, currentEp?.embed]);

  const getPreviousSelection = useEffectEvent(() => ({
    previousServerIndex: selectedServer,
    previousEpisodeIndex: selectedEpisode,
    previousEpisodeName: currentEp?.name || epFromUrl || "",
    requestedEpisode: epFromUrl || currentEp?.name,
    requestedServer: Number(searchParams.get("server") ?? -1),
    requestedServerName: searchParams.get("serverName"),
    requestedProvider: searchParams.get("provider"),
  }));

  useEffect(() => {
    if (!slug) return;
    let active = true;

    async function fetchAll() {
      const { previousServerIndex, previousEpisodeIndex, previousEpisodeName, requestedEpisode, requestedServer, requestedServerName, requestedProvider } = getPreviousSelection();

      setIsFetching(true);
      setMovie(null);
      setServers([]);
      setSelectedServer(0);
      setSelectedEpisode(0);
      setActiveChunk(0);
      setIsDescExpanded(false);
      setRelatedMovies(null);
      try {
        const resDetail = await getMovieDetail(slug, selectedProvider === "auto" ? null : selectedProvider);
        if (!active) return;

        if (resDetail?.movie) {
          setMovie(resDetail.movie);
          document.title = `${resDetail.movie.name} - Uynflix`;

          const rawEps = resDetail.movie.episodes || [];
          const mappedServers = rawEps.map(srv => ({
            server_name: srv.server_name || "Thuyết Minh",
            items: srv.server_data || srv.items || [],
          }));
          setServers(mappedServers);

          const categorySlug = resDetail.movie.category?.["2"]?.list?.[0]?.slug || "hanh-dong";
          import("@/lib/movies").then(({ getRelatedMovies }) => getRelatedMovies(categorySlug, 6))
            .then(items => { if (active) setRelatedMovies(items || []); })
            .catch(() => { if (active) setRelatedMovies([]); });

          if (requestedEpisode) {
            const sameProvider = (!requestedProvider || requestedProvider === resDetail.movie.provider)
              && (selectedProvider === "auto" || selectedProvider === resDetail.movie.provider);
            const preferredServer = sameProvider
              ? requestedServerName
                ? mappedServers.findIndex(server => server.server_name === requestedServerName)
                : requestedServer
              : -1;
            let matchedEpisode = findEpisodeIndex(mappedServers[preferredServer]?.items, requestedEpisode);
            let matchedServer = matchedEpisode === -1 ? -1 : preferredServer;

            for (let i = 0; matchedServer === -1 && i < mappedServers.length; i += 1) {
              const items = mappedServers[i]?.items || [];
              const episodeIndex = findEpisodeIndex(items, requestedEpisode);
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
              const fallbackServerIndex = Math.max(0, Math.min(sameProvider ? previousServerIndex : 0, mappedServers.length - 1));
              const fallbackItems = mappedServers[fallbackServerIndex]?.items || [];
              const fallbackByName = findEpisodeIndex(fallbackItems, previousEpisodeName);
              const fallbackByIndex = sameProvider && fallbackItems[previousEpisodeIndex] ? previousEpisodeIndex : 0;
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
        if (active) setIsFetching(false);
      }
    }

    fetchAll();
    return () => { active = false; };
  }, [slug, selectedProvider, retry]);

  useEffect(() => {
    if (!movie || !currentEp) return;
    clearInterval(historyTimerRef.current);
    historyTimerRef.current = setInterval(async () => {
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
        serverName: servers[selectedServer]?.server_name,
        ...playbackRef.current,
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
    return () => clearInterval(historyTimerRef.current);
  }, [movie, slug, selectedEpisode, selectedServer, currentEp, session, servers]);

  const handleEpisodeChange = useCallback((index, epName) => {
    if (index === selectedEpisode) return;
    setSelectedEpisode(index);
    setActiveChunk(Math.floor(index / 20));
    router.replace(watchHref({ slug, episode: epName, provider: movie?.provider, serverIndex: selectedServer,
      serverName: servers[selectedServer]?.server_name }), { scroll: false });
    playerRef.current?.scrollIntoView({ block: "start" });
  }, [selectedEpisode, router, slug, movie?.provider, selectedServer, servers]);

  const handleServerChange = useCallback((index) => {
    if (index === selectedServer) return;
    const server = servers[index];
    if (!server?.items.length) return;
    const match = findEpisodeIndex(server.items, currentEp?.name);
    const episodeIndex = Math.max(0, match);
    setSelectedServer(index);
    setSelectedEpisode(episodeIndex);
    setActiveChunk(Math.floor(episodeIndex / 20));
    router.replace(watchHref({ slug, episode: server.items[episodeIndex].name, provider: movie?.provider,
      serverIndex: index, serverName: server.server_name }), { scroll: false });
  }, [selectedServer, servers, currentEp?.name, movie?.provider, router, slug]);

  if (isFetching) return <WatchSkeleton />;

  if (!movie) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4 text-white">
        <p className="text-sm font-bold text-[#e8e8e8]">Không thể tải thông tin bộ phim.</p>
        <button
          onClick={() => setRetry(value => value + 1)}
          className="min-h-11 px-5 py-2 bg-white/[0.04] border border-white/10 text-xs font-bold rounded-xl hover:text-[#ffffff] transition-all"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const genre = movie.category?.["2"]?.list?.[0]?.name || "";
  const country = movie.category?.["4"]?.list?.[0]?.name || "";
  const epName = currentEp?.name;
  const resumeSeconds = resumeHistory && resumeHistory.email === accountEmail && resumeHistory.key === movie.canonicalKey
    ? Number(resumeHistory.items.find(item => item.canonicalKey === movie.canonicalKey && item.episode === epName)?.positionSeconds) || 0
    : 0;

  return (
    /* 🚀 ĐÃ CẢI TẠO LUỒNG PHẲNG LỲ: Xóa sạch h-screen bọc ngoài, trong suốt hoàn toàn, items-start */
    <div className="w-full min-h-screen bg-transparent text-[#ffffff] font-sans antialiased select-none pb-24" style={{ fontFamily: "var(--font-main)" }}>

      {/* NÚT QUAY LẠI PHÍA TRÊN BÊN TRÁI CHUẨN PHA LÊ MOONLIGHT */}
      <div className="max-w-[1800px] mx-auto md:px-4 xl:px-8 pt-2 pb-4">
        <Link href={`/movie/${encodeURIComponent(slug)}`}
          className="px-4 py-2 glass-surface border border-white/10 text-[#b8b8b8] hover:text-[#ffffff] rounded-xl font-bold text-[10px] uppercase transition-all duration-300 hover:border-[#e8e8e8]/40 shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Chi tiết phim
        </Link>
      </div>

      {/* KHUNG KHỐI CHÍNH TĂNG ĐỘ RỘNG MAX-W-[1800PX] CHUẨN ĐIỆN ẢNH IMAX */}
      <div className="w-full max-w-[1800px] mx-auto md:px-4 xl:px-8 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">

        {/* KHỐI TRÁI: PLAYER CHÍNH VÀ METADATA TẬP PHIM */}
        <div className="min-w-0 w-full space-y-5">
          <h1 className="break-words text-xl font-semibold md:text-2xl">{movie.name}</h1>
          <div ref={playerRef}>
            <WatchPlayer
              movie={movie}
              currentEp={currentEp}
              epName={epName}
              loginHref={authHref("/login", watchHref({ slug, episode: epName, provider: movie.provider,
                serverIndex: selectedServer, serverName: servers[selectedServer]?.server_name }))}
              onProgress={progress => { playbackRef.current = progress; }}
              resumeSeconds={resumeSeconds}
            />
          </div>
          <div className="watch-episode-controls">
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
              activeProvider={movie.provider}
              setSelectedProvider={setSelectedProvider}
            />
          </div>
          <WatchMetadata
            movie={movie}
            genre={genre}
            country={country}
            isDescExpanded={isDescExpanded}
            setIsDescExpanded={setIsDescExpanded}
          />
          <details className="scroll-mt-20 rounded-xl border border-white/10 p-3 text-sm">
            <summary className="cursor-pointer font-medium">Trợ giúp phát phim</summary>
            <p className="mt-2 text-on-surface-variant">Nếu video không tải, kiểm tra kết nối rồi thử lại. Anh có thể chọn máy chủ khác trong Tập phim. Nếu máy chủ mới thiếu tập đang xem, danh sách sẽ mở tập đầu tiên của máy chủ đó.</p>
          </details>
        </div>

        {/* KHỐI PHẢI: ASIDE PANEL GỌN GÀNG KÍNH MỜ XANH ĐÊM (CUỘN TRÔI THEO TRANG TRƠN TRU) */}
        <aside className="watch-episode-controls w-full space-y-5 min-w-0 glass-surface border border-white/5 p-4 rounded-[28px] ">
          <div className="hidden xl:block">
            <WatchRightEpList
              currentEpisodes={currentEpisodes}
              episodeChunks={episodeChunks}
              activeChunk={activeChunk}
              setActiveChunk={setActiveChunk}
              selectedEpisode={selectedEpisode}
              handleEpisodeChange={handleEpisodeChange}
            />
          </div>

          {/* KHAY ĐỀ XUẤT LIÊN QUAN CHUẨN MOONLIGHT GOLD */}
          <div className="border-t border-white/5 pt-4">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#808080] px-1 mb-3">
              Có thể bạn thích
            </span>
            {relatedMovies?.length ? (
              <RelatedMovies key={`sb-${slug}`} initialMovies={relatedMovies} isSidebarMode={true} />
            ) : relatedMovies === null ? (
              <div className="flex items-center justify-center py-8 gap-2 text-[#808080] text-xs uppercase tracking-widest font-bold">
                <Loader2 className="w-3.5 h-3.5 border-2 border-[#e8e8e8]/20 border-t-[#e8e8e8] rounded-full animate-spin text-[#e8e8e8]" />
                <span>Đang tải đề xuất…</span>
              </div>
            ) : <p className="text-sm text-on-surface-variant">Chưa có đề xuất.</p>}
          </div>
        </aside>

      </div>
    </div>
  );
}
