'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { watchHref } from '@/lib/watchNavigation';
import { useRouter } from 'next/navigation';
import { Star, Play, Globe, CalendarDays, Film, Tv, History, ArrowLeft, Search, Layers } from 'lucide-react';
import { getMovieDetail, getRelatedMovies } from '@/lib/clientMovies';
import MovieCard from '@/components/MovieCard';
import MovieArtwork from '@/components/MovieArtwork';

export default function MovieDetailClient({ movieSlug }) {
  const router = useRouter();
  const [movieData, setMovieData] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [attempt, setAttempt] = useState(0);
  const isLoading = movieData === null;

  // UX State cho phần hiển thị tập phim
  const [activeServerIdx, setActiveServerIdx] = useState(0);
  const [searchEpisode, setSearchEpisode] = useState('');
  const [activeRangeTab, setActiveRangeTab] = useState(0);

  useEffect(() => {
    let active = true;
    getMovieDetail(movieSlug).then(data => {
      if (!active) return;
      if (!data?.movie) {
        setMovieData(false);
        return;
      }
      setMovieData(data);
      document.title = data.movie.name + ' - Uynflix';
      const genre = data.movie.category?.['2']?.list?.[0]?.slug;
      if (genre) getRelatedMovies(genre, 4).then(items => {
        if (active) setRelatedMovies(items || []);
      }).catch(() => {});
    }).catch(() => { if (active) setMovieData(false); });
    return () => { active = false; };
  }, [movieSlug, attempt]);

  if (isLoading) {
    return (
      <div aria-busy="true" aria-label="Đang tải thông tin phim" className="mx-auto max-w-[1440px] py-6">
        <div className="mb-6 h-11 w-24 rounded-xl bg-surface-container" />
        <div className="flex gap-4 md:gap-8">
          <div className="aspect-[2/3] w-24 shrink-0 animate-pulse rounded-xl bg-surface-container sm:w-36 md:w-56" />
          <div className="flex-1 space-y-4">
            <div className="h-5 w-24 rounded bg-surface-container" />
            <div className="h-10 w-3/4 rounded bg-surface-container" />
            <div className="h-11 w-24 rounded-xl bg-surface-container" />
          </div>
        </div>
      </div>
    );
  }

  if (!movieData || !movieData.movie) {
    return (
      <div className="flex min-h-[45vh] flex-col items-center justify-center gap-4 p-4 text-center">
        <p role="alert" className="text-sm text-on-surface-variant">Không tải được thông tin bộ phim.</p>
        <button type="button" onClick={() => { setMovieData(null); setAttempt(value => value + 1); }}
          className="button-primary px-4 text-sm">Thử lại</button>
      </div>
    );
  }

  const { movie, episodes } = movieData;

  const allCategoryTags = movie.category
    ? Object.values(movie.category).flatMap(group => group.list?.map(item => item.name) || [])
    : [];

  const formatTypes = movie.category?.['1']?.list?.map(item => item.name).join(', ') || 'N/A';
  const genresList = movie.category?.['2']?.list?.map(item => item.name).join(', ') || 'N/A';
  const releaseYear = movie.category?.['3']?.list?.map(item => item.name)[0] || movie.year || 'N/A';
  const countriesList = movie.category?.['4']?.list?.map(item => item.name).join(', ') || 'N/A';

  const formattedModifiedDate = movie.modified
    ? new Date(movie.modified).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  // ── 🛠️ XỬ LÝ LOGIC PHÂN TRANG VÀ LỌC CHAPTERS ──
  const currentServer = episodes?.[activeServerIdx];
  const allEpisodes = currentServer?.server_data || currentServer?.items || [];
  const watchUrl = episode => watchHref({ slug: movieSlug, episode: episode || '1',
    provider: movie.provider, serverIndex: activeServerIdx, serverName: currentServer?.server_name });

  // Lọc theo thanh tìm kiếm
  const filteredEpisodes = allEpisodes.filter(ep =>
    ep?.name?.toLowerCase().includes(searchEpisode.trim().toLowerCase())
  );

  // Tự động chia khoảng tập (Ví dụ: 1-50, 51-100) nếu tổng số tập > 40 tập
  const ITEMS_PER_RANGE = 40;
  const totalEpisodesCount = filteredEpisodes.length;
  const rangeChunks = [];

  if (totalEpisodesCount > ITEMS_PER_RANGE && searchEpisode === '') {
    for (let i = 0; i < totalEpisodesCount; i += ITEMS_PER_RANGE) {
      rangeChunks.push(filteredEpisodes.slice(i, i + ITEMS_PER_RANGE));
    }
  }

  const displayedEpisodes = rangeChunks.length > 0
    ? rangeChunks[activeRangeTab] || []
    : filteredEpisodes;

  return (
    <div className="w-full min-h-screen bg-transparent text-[#ffffff] select-none pb-24 font-sans" style={{ fontFamily: "var(--font-main)" }}>

      {/* ── 1. CINEMATIC BACKDROP DEEP SPACE ── */}
      <div
        className="absolute top-0 left-0 right-0 hidden md:block md:h-[520px] z-0 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 30%, transparent 75%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 30%, transparent 75%, transparent 100%)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/50 to-transparent z-10" />
        <MovieArtwork movie={movie} landscape decorative sizes="100vw"
          className="hidden h-full w-full object-cover opacity-30 md:block" />
      </div>

      {/* ── NÚT QUAY LẠI ── */}
      <div className="relative z-20 pt-3 md:pt-4 max-w-[1600px] mx-auto md:px-8">
        <button
          onClick={() => router.back()}
          className="min-h-11 px-4 py-2 glass-surface border border-white/10 text-[#b8b8b8] hover:text-[#ffffff] rounded-xl font-bold text-[10px] uppercase transition-all duration-300 hover:border-[#e8e8e8]/40 shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quay lại
        </button>
      </div>

      {/* ── 2. HERO AREA ── */}
      <section className="relative z-10 pt-6 md:pt-16 max-w-[1600px] mx-auto md:px-8">
        <div className="flex flex-row md:flex-row gap-4 md:gap-12 items-start md:items-start text-left md:text-left">

          <div className="w-24 sm:w-36 md:w-56 shrink-0 rounded-xl md:rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10  md: transition-all duration-300 hover:border-[#e8e8e8]/30 md:hover:-translate-y-1.5">
            <MovieArtwork movie={movie} eager sizes="(max-width: 639px) 96px, (max-width: 767px) 144px, 224px"
              className="aspect-[2/3] w-full object-cover" />
          </div>

          <div className="flex-1 space-y-3 md:space-y-6 w-full pt-0 md:pt-4 min-w-0">
            <div className="flex flex-wrap justify-start gap-1.5 md:gap-2">
              <span className="bg-[#e8e8e8]/10 text-[#ffffff] border border-[#e8e8e8]/20 px-2.5 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold tracking-wider uppercase">
                {movie.quality || 'Chưa rõ chất lượng'}
              </span>
              <span className="bg-white/5 backdrop-blur-md px-2.5 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-semibold text-[#b8b8b8] tracking-wider border border-white/5 uppercase">
                {movie.language || 'Chưa rõ ngôn ngữ'}
              </span>
              {allCategoryTags.map((tag, idx) => (
                <span key={idx} className="hidden sm:inline-block bg-white/[0.02] backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-medium text-[#808080] border border-white/5 uppercase tracking-wide">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-xl sm:text-2xl md:text-5xl font-bold text-white break-words tracking-tight leading-tight md:leading-tight" style={{ textShadow: 'none' }}>
              {movie.name}
            </h1>
            <p className="text-[11px] md:text-sm text-[#808080] italic font-medium tracking-wide">
              Tên gốc: {movie.original_name || movie.origin_name}
            </p>

            <div className="flex flex-wrap justify-start items-center gap-2.5 md:gap-6 text-[11px] md:text-sm text-[#b8b8b8] font-medium">
{movie.rating && (<div className="flex items-center gap-1.5 bg-[#ffffff]/10 px-2 md:px-2.5 py-0.5 rounded-md text-[#ffffff] border border-[#e8e8e8]/20 font-semibold">
                <Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-current text-[#e8e8e8]" />
                <span>{movie.rating}</span>
              </div>)}
              <div className="hidden sm:block h-4 w-px bg-white/10" />
              <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#e8e8e8]/40" /> {releaseYear}</span>
              <div className="hidden sm:block h-4 w-px bg-white/10" />
              <span className="flex items-center gap-1.5"><Film className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#e8e8e8]/40" /> {movie.time}</span>
            </div>

            <div className="flex flex-wrap justify-start items-center gap-4 pt-2 md:pt-4">
              <Link href={watchUrl(allEpisodes[0]?.name)} prefetch={false}
                className="button-primary inline-flex w-full items-center justify-center gap-2 px-4 text-sm sm:w-auto md:px-8">
                <Play className="size-4" aria-hidden="true" /> Xem phim
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. KHU VỰC CHI TIẾT NỘI DUNG ── */}
      <section className="md:px-8 mt-8 md:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 max-w-[1600px] mx-auto relative z-10">

        {/* CỘT TRÁI (8 Cột) */}
        <div className="lg:col-span-8 space-y-8 md:space-y-12">

          <div className="space-y-3 md:space-y-4">
            <h2 className="text-xs font-bold text-[#e8e8e8] border-l-4 border-[#e8e8e8] pl-3 uppercase tracking-widest">
              The Premise / Tóm tắt
            </h2>
            <div
              className="break-words text-sm leading-relaxed text-on-surface-variant md:text-base html-content"
              dangerouslySetInnerHTML={{ __html: movie.description || movie.content }}
            />
          </div>

          <div className="space-y-3 md:space-y-4">
            <h2 className="text-xs font-bold text-[#e8e8e8] border-l-4 border-[#e8e8e8] pl-3 uppercase tracking-widest">
              Dàn Diễn Viên
            </h2>
            <p className="text-xs md:text-sm text-[#b8b8b8] font-semibold italic pl-3 leading-loose">
              {movie.casts || movie.actors || 'Đang cập nhật diễn viên...'}
            </p>
          </div>

          {/* ── 🌟 CHAPTERS LIST LUXURY OPTIMIZED ── */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 border-b border-white/5 pb-4">
              <h2 className="text-xs font-bold text-[#e8e8e8] uppercase tracking-widest">
                Chapters / Danh Sách Tập
              </h2>

              {/* Thanh tìm nhanh tập phim (Cực tiện cho phim dài tập) */}
              {allEpisodes.length > 10 && (
                <div className="relative w-full sm:w-48">
                  <input
                    type="search" aria-label="Tìm nhanh tập phim"
                    placeholder="Tìm nhanh tập..."
                    value={searchEpisode}
                    onChange={(e) => {
                      setSearchEpisode(e.target.value);
                      setActiveRangeTab(0); // Reset về tab đầu khi tìm kiếm
                    }}
                    className="w-full min-h-11 bg-white/[0.04] border border-white/10 rounded-xl pl-8 pr-3 text-base text-white focus:outline-none focus:border-[#e8e8e8]/60 font-medium placeholder-[#b8b8b8]/30 transition-all"
                  />
                  <Search className="w-3.5 h-3.5 text-[#808080] absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              {!episodes || episodes.length === 0 ? (
                <p className="text-xs text-[#808080] italic pl-1">Đang cập nhật tập phim...</p>
              ) : (
                <div className="watch-episode-controls rounded-2xl border border-border-subtle bg-surface-container p-3 md:p-6 space-y-4 md:space-y-6">

                  {/* Gộp Sever thành Tab điều hướng tinh tế */}
                  {episodes.length > 1 && (
                    <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
                      <span className="text-[10px] font-bold text-[#808080] tracking-wider uppercase mr-2 flex items-center gap-1">
                        <Layers className="w-3 h-3" /> Nguồn phát:
                      </span>
                      {episodes.map((server, sIdx) => (
                        <button
                          key={sIdx}
                          aria-pressed={activeServerIdx === sIdx}
                          onClick={() => {
                            setActiveServerIdx(sIdx);
                            setSearchEpisode('');
                            setActiveRangeTab(0);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide uppercase border transition-all duration-300 focus:outline-none cursor-pointer ${activeServerIdx === sIdx
                            ? 'bg-[#e8e8e8]/10 border-[#e8e8e8] text-[#ffffff] shadow-md /5'
                            : 'bg-white/[0.02] border-white/5 text-[#b8b8b8] hover:text-[#ffffff] hover:border-white/10'
                            }`}
                        >
                          {server?.server_name?.trim() || `#${sIdx + 1}`}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Thanh Phân Đoạn Tập (Chỉ hiện khi phim có > 40 tập và không tìm kiếm) */}
                  {rangeChunks.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 bg-black/20 p-1 rounded-xl border border-white/5">
                      {rangeChunks.map((_, chunkIdx) => {
                        const startEp = chunkIdx * ITEMS_PER_RANGE + 1;
                        const endEp = Math.min((chunkIdx + 1) * ITEMS_PER_RANGE, totalEpisodesCount);
                        return (
                          <button
                            key={chunkIdx}
                            aria-pressed={activeRangeTab === chunkIdx}
                            onClick={() => setActiveRangeTab(chunkIdx)}
                            className={`flex-1 min-w-[70px] text-center py-1 rounded-lg text-[10px] font-bold tracking-wide transition-all focus:outline-none cursor-pointer ${activeRangeTab === chunkIdx
                              ? 'bg-[#e8e8e8] text-[#050505]'
                              : 'text-[#b8b8b8] hover:bg-white/5 hover:text-white'
                              }`}
                          >
                            {startEp} - {endEp}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Lưới hiển thị danh sách tập phim */}
                  {displayedEpisodes.length === 0 ? (
                    <p className="text-xs text-[#808080] italic text-center py-4">Không tìm thấy tập phù hợp.</p>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-2.5">
                      {displayedEpisodes.map((ep, eIdx) => (
                        <Link
                          key={ep?.slug || (ep?.name + '-' + eIdx)}
                          href={watchUrl(ep?.name)} prefetch={false}
                          className="flex min-h-11 items-center justify-center rounded-xl border border-border-subtle bg-white/[0.03] px-1 text-center text-xs font-semibold hover:bg-white/10">
                          {/^t[aậ]p\s/i.test(ep?.name?.trim() || '') ? ep.name : `Tập ${ep?.name}`}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* CỘT PHẢI (4 Cột) */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          <div className="glass-surface p-4 md:p-6 rounded-2xl space-y-4 md:space-y-5 shadow-2xl border border-white/5">
            <h3 className="text-[10px] font-bold text-[#e8e8e8] tracking-widest uppercase flex items-center gap-2 border-b border-white/5 pb-2">
              <Globe className="w-4 h-4" /> Observatory Logs
            </h3>

            <div className="space-y-3 md:space-y-4 text-xs font-semibold uppercase tracking-wide">
              <div className="flex justify-between items-start py-1 border-b border-white/5 gap-4">
                <span className="text-[#808080] text-[10px] whitespace-nowrap pt-0.5">Đạo diễn</span>
                <span className="text-white text-right font-bold normal-case text-xs md:text-sm">{movie.director || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#808080] text-[10px]">Quốc gia</span>
                <span className="text-white font-bold normal-case text-xs md:text-sm">{countriesList}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#808080] text-[10px]">Thời lượng</span>
                <span className="text-white font-bold normal-case text-xs md:text-sm">{movie.time || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#808080] text-[10px]">Tổng số tập</span>
                <span className="text-white font-bold normal-case text-xs md:text-sm">{movie.total_episodes ? `${movie.total_episodes} Tập` : 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#808080] text-[10px]">Định dạng</span>
                <span className="text-white font-bold normal-case text-xs md:text-sm truncate max-w-[180px] text-right">{formatTypes}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#808080] text-[10px]">Ngôn ngữ</span>
                <span className="text-white font-bold normal-case text-xs md:text-sm truncate max-w-[180px] text-right">{movie.language || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-start py-1 border-b border-white/5 gap-4">
                <span className="text-[#808080] text-[10px] whitespace-nowrap pt-0.5 flex items-center gap-1"><History className="w-3 h-3" /> Cập nhật</span>
                <span className="text-[#b8b8b8] font-mono font-bold text-right text-xs normal-case">{formattedModifiedDate}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#808080] text-[10px]">Tình trạng</span>
                <span className="text-[#ffffff] font-bold text-[10px] bg-[#e8e8e8]/10 px-2.5 py-0.5 rounded border border-[#e8e8e8]/20">
                  {movie.current_episode || 'Đang chiếu'}
                </span>
              </div>
            </div>
          </div>

          {relatedMovies.length > 0 && (
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-[10px] font-bold text-[#e8e8e8] tracking-widest uppercase pl-1">Related Constellations</h3>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 md:gap-4">
                {relatedMovies.map((relatedMovie) => (
                  <div key={relatedMovie.slug} className="animate-in fade-in duration-300">
                    <MovieCard movie={relatedMovie} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </section>

    </div>
  );
}