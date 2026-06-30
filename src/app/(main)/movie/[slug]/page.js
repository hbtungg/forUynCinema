'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Play, Globe, CalendarDays, Film, Tv, History, ArrowLeft, Search, Layers } from 'lucide-react';
import { getMovieDetail, getRelatedMovies } from '@/lib/clientMovies';
import MovieCard from '@/components/MovieCard';

export default function MovieDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const movieSlug = params.slug;
  
  const router = useRouter();
  const [movieData, setMovieData] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // UX State cho phần hiển thị tập phim
  const [activeServerIdx, setActiveServerIdx] = useState(0);
  const [searchEpisode, setSearchEpisode] = useState('');
  const [activeRangeTab, setActiveRangeTab] = useState(0);

  useEffect(() => {
    if (movieData?.movie?.name) {
      document.title = `${movieData.movie.name} | Midnight Cinema`;
    } else {
      document.title = "Scanning Celestial Coordinates... | Uynflix";
    }
  }, [movieData]);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!movieSlug) return;
      setIsLoading(true);
      try {
        const data = await getMovieDetail(movieSlug);
        if (data && data.movie) {
          setMovieData(data);
          
          const firstGenre = data.movie.category?.['2']?.list?.[0]?.name;
          if (firstGenre) {
            const related = await getRelatedMovies(firstGenre, 4);
            setRelatedMovies(related);
          }
        }
      } catch (error) {
        console.error("🚨 Lỗi quét tọa độ phim từ NguồnC:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [movieSlug]);

  if (isLoading) {
    return (
      <div className="w-full min-h-[80vh] bg-transparent flex flex-col items-center justify-center text-[#E6C687]">
        <div className="w-12 h-12 border-4 border-[#E6C687]/20 border-t-[#E6C687] rounded-full animate-spin mb-4" />
        <p className="text-xs tracking-widest uppercase opacity-60">Scanning Celestial Coordinates...</p>
      </div>
    );
  }

  if (!movieData || !movieData.movie) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center text-[#d0c5b5]/40">
        <p className="text-sm italic opacity-50">Không tìm thấy thông tin bộ phim này hoặc API đang bảo trì.</p>
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
    <div className="w-full min-h-screen bg-transparent text-[#e8e1da] select-none pb-24 font-sans" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      
      {/* ── 1. CINEMATIC BACKDROP DEEP SPACE ── */}
      <div 
        className="absolute top-0 left-0 right-0 h-[55vh] md:h-[100vh] z-0 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 30%, transparent 75%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 30%, transparent 75%, transparent 100%)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#060814] via-[#060814]/50 to-transparent z-10" />
        <img 
          className="w-full h-full object-cover opacity-20 scale-105 filter blur-[1px]" 
          src={movie.poster_url || movie.thumb_url} 
          alt={movie.name} 
        />
      </div>

      {/* ── NÚT QUAY LẠI ── */}
      <div className="relative z-20 pt-3 md:pt-4 max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-[#0F1326]/60 backdrop-blur-md border border-white/10 text-[#d0c5b5] hover:text-[#ffe3ae] rounded-xl font-bold text-[10px] uppercase transition-all duration-300 hover:border-[#E6C687]/40 shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quay lại
        </button>
      </div>

      {/* ── 2. HERO AREA ── */}
      <section className="relative z-10 pt-6 md:pt-16 max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-row md:flex-row gap-4 md:gap-12 items-start md:items-start text-left md:text-left">
          
          <div className="w-28 sm:w-36 md:w-72 shrink-0 rounded-xl md:rounded-2xl overflow-hidden bg-[#0F1326]/40 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.85)] md:shadow-[0_25px_60px_rgba(0,0,0,0.85)] transition-all duration-500 hover:border-[#E6C687]/30 md:hover:-translate-y-1.5">
            <img 
              className="w-full aspect-[2/3] object-cover" 
              src={movie.thumb_url || movie.poster_url} 
              alt={movie.name} 
            />
          </div>

          <div className="flex-1 space-y-3 md:space-y-6 w-full pt-0 md:pt-4 min-w-0">
            <div className="flex flex-wrap justify-start gap-1.5 md:gap-2">
              <span className="bg-[#E6C687]/10 text-[#ffe3ae] border border-[#E6C687]/20 px-2.5 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold tracking-wider uppercase">
                {movie.quality || 'HD'}
              </span>
              <span className="bg-white/5 backdrop-blur-md px-2.5 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-semibold text-[#d0c5b5]/60 tracking-wider border border-white/5 uppercase">
                {movie.language || 'Vietsub'}
              </span>
              {allCategoryTags.map((tag, idx) => (
                <span key={idx} className="hidden sm:inline-block bg-white/[0.02] backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-medium text-[#d0c5b5]/40 border border-white/5 uppercase tracking-wide">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-xl sm:text-2xl md:text-5xl font-bold text-white tracking-wide uppercase leading-tight md:leading-none" style={{ textShadow: '0 0 15px rgba(255,227,174,0.15)' }}>
              {movie.name}
            </h1>
            <p className="text-[11px] md:text-sm text-[#d0c5b5]/40 italic font-medium tracking-wide">
              Tên gốc: {movie.original_name || movie.origin_name}
            </p>

            <div className="flex flex-wrap justify-start items-center gap-2.5 md:gap-6 text-[11px] md:text-sm text-[#d0c5b5]/60 font-medium">
              <div className="flex items-center gap-1.5 bg-[#ffe3ae]/10 px-2 md:px-2.5 py-0.5 rounded-md text-[#ffe3ae] border border-[#E6C687]/20 font-black">
                <Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-current text-[#E6C687]" />
                <span>{movie.rating || '8.5'}</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-white/10" />
              <span className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#E6C687]/40" /> {releaseYear}</span>
              <div className="hidden sm:block h-4 w-px bg-white/10" />
              <span className="flex items-center gap-1.5"><Film className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#E6C687]/40" /> {movie.time || '70 phút/tập'}</span>
            </div>

            <div className="flex flex-wrap justify-start items-center gap-4 pt-2 md:pt-4">
              <button 
                onClick={() => {
                  const firstEp = allEpisodes?.[0]?.name || '1';
                  router.push(`/watch/${movieSlug}?ep=${firstEp}`);
                }}
                className="w-full sm:w-auto justify-center px-6 md:px-12 py-3 md:py-3.5 bg-[#E6C687]/10 hover:bg-[#E6C687] border border-[#E6C687]/20 text-[#E6C687] hover:text-[#402d00] font-bold text-xs tracking-widest uppercase rounded-full flex items-center gap-2.5 transition-all duration-300 active:scale-95 shadow-lg shadow-black/40 cursor-pointer focus:outline-none"
              >
                <Play className="w-4 h-4 fill-current" /> Watch Now
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. KHU VỰC CHI TIẾT NỘI DUNG ── */}
      <section className="px-4 sm:px-6 md:px-12 mt-8 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 max-w-[1600px] mx-auto relative z-10">
        
        {/* CỘT TRÁI (8 Cột) */}
        <div className="lg:col-span-8 space-y-8 md:space-y-12">
          
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-xs font-bold text-[#E6C687] border-l-4 border-[#E6C687] pl-3 uppercase tracking-widest">
              The Premise / Tóm tắt
            </h2>
            <div 
              className="text-sm md:text-base text-[#d0c5b5]/80 leading-relaxed text-justify html-content" 
              dangerouslySetInnerHTML={{ __html: movie.description || movie.content }} 
            />
          </div>

          <div className="space-y-3 md:space-y-4">
            <h2 className="text-xs font-bold text-[#E6C687] border-l-4 border-[#E6C687] pl-3 uppercase tracking-widest">
              Dàn Diễn Viên
            </h2>
            <p className="text-xs md:text-sm text-[#d0c5b5]/60 font-semibold italic pl-3 leading-loose">
              {movie.casts || movie.actors || 'Đang cập nhật diễn viên...'}
            </p>
          </div>

          {/* ── 🌟 CHAPTERS LIST LUXURY OPTIMIZED ── */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 border-b border-white/5 pb-4">
              <h2 className="text-xs font-bold text-[#E6C687] uppercase tracking-widest">
                Chapters / Danh Sách Tập
              </h2>
              
              {/* Thanh tìm nhanh tập phim (Cực tiện cho phim dài tập) */}
              {allEpisodes.length > 10 && (
                <div className="relative w-full sm:w-48">
                  <input 
                    type="text"
                    placeholder="Tìm nhanh tập..."
                    value={searchEpisode}
                    onChange={(e) => {
                      setSearchEpisode(e.target.value);
                      setActiveRangeTab(0); // Reset về tab đầu khi tìm kiếm
                    }}
                    className="w-full bg-[#0F1326]/60 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#E6C687]/60 font-medium placeholder-[#d0c5b5]/30 transition-all"
                  />
                  <Search className="w-3.5 h-3.5 text-[#d0c5b5]/30 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {!episodes || episodes.length === 0 ? (
                <p className="text-xs text-[#d0c5b5]/30 italic pl-1">Đang cập nhật chòm sao tập phim...</p>
              ) : (
                <div className="bg-[#0F1326]/40 backdrop-blur-2xl border border-white/5 p-4 md:p-6 rounded-2xl space-y-4 md:space-y-6 shadow-2xl">
                  
                  {/* Gộp Sever thành Tab điều hướng tinh tế */}
                  {episodes.length > 1 && (
                    <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
                      <span className="text-[10px] font-bold text-[#d0c5b5]/40 tracking-wider uppercase mr-2 flex items-center gap-1">
                        <Layers className="w-3 h-3" /> Nguồn phát:
                      </span>
                      {episodes.map((server, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => {
                            setActiveServerIdx(sIdx);
                            setSearchEpisode('');
                            setActiveRangeTab(0);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wide uppercase border transition-all duration-300 focus:outline-none cursor-pointer ${
                            activeServerIdx === sIdx
                              ? 'bg-[#E6C687]/10 border-[#E6C687] text-[#ffe3ae] shadow-md shadow-[#E6C687]/5'
                              : 'bg-white/[0.02] border-white/5 text-[#d0c5b5]/50 hover:text-[#e8e1da] hover:border-white/10'
                          }`}
                        >
                          {server?.server_name?.replace('Vietsub', '').replace('Thuyết minh', '').trim() || `#${sIdx + 1}`}
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
                            onClick={() => setActiveRangeTab(chunkIdx)}
                            className={`flex-1 min-w-[70px] text-center py-1 rounded-lg text-[10px] font-bold tracking-wide transition-all focus:outline-none cursor-pointer ${
                              activeRangeTab === chunkIdx
                                ? 'bg-[#E6C687] text-[#402d00]'
                                : 'text-[#d0c5b5]/60 hover:bg-white/5 hover:text-white'
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
                    <p className="text-xs text-[#d0c5b5]/30 italic text-center py-4">Không tìm thấy tập phù hợp.</p>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-2.5">
                      {displayedEpisodes.map((ep, eIdx) => (
                        <div 
                          key={eIdx}
                          onClick={() => router.push(`/watch/${movieSlug}?ep=${ep?.name}`)}
                          className="bg-white/[0.02] border border-white/5 p-2 md:p-2.5 rounded-xl flex items-center justify-center relative group cursor-pointer hover:border-[#E6C687]/50 hover:bg-[#E6C687]/5 transition-all duration-300 hover:shadow-[0_0_15px_rgba(230,198,135,0.08)] active:scale-95"
                        >
                          <span className="text-[11px] md:text-xs font-bold text-[#e8e1da] group-hover:text-[#ffe3ae] transition-colors truncate px-1.5 md:px-2">
                            {ep?.name}
                          </span>
                          <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0">
                            <Play className="w-2.5 h-2.5 text-[#E6C687] fill-current" />
                          </div>
                        </div>
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
          <div className="bg-[#0F1326]/40 backdrop-blur-2xl p-4 md:p-6 rounded-2xl space-y-4 md:space-y-5 shadow-2xl border border-white/5">
            <h3 className="text-[10px] font-bold text-[#E6C687] tracking-widest uppercase flex items-center gap-2 border-b border-white/5 pb-2">
              <Globe className="w-4 h-4" /> Observatory Logs
            </h3>
            
            <div className="space-y-3 md:space-y-4 text-xs font-semibold uppercase tracking-wide">
              <div className="flex justify-between items-start py-1 border-b border-white/5 gap-4">
                <span className="text-[#d0c5b5]/30 text-[10px] whitespace-nowrap pt-0.5">Đạo diễn</span>
                <span className="text-white text-right font-bold normal-case text-xs md:text-sm">{movie.director || 'N/A'}</span>
              </div>
              
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#d0c5b5]/30 text-[10px]">Quốc gia</span>
                <span className="text-white font-bold normal-case text-xs md:text-sm">{countriesList}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#d0c5b5]/30 text-[10px]">Thời lượng</span>
                <span className="text-white font-bold normal-case text-xs md:text-sm">{movie.time || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#d0c5b5]/30 text-[10px]">Tổng số tập</span>
                <span className="text-white font-bold normal-case text-xs md:text-sm">{movie.total_episodes ? `${movie.total_episodes} Tập` : 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#d0c5b5]/30 text-[10px]">Định dạng</span>
                <span className="text-white font-bold normal-case text-xs md:text-sm truncate max-w-[180px] text-right">{formatTypes}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#d0c5b5]/30 text-[10px]">Ngôn ngữ</span>
                <span className="text-white font-bold normal-case text-xs md:text-sm truncate max-w-[180px] text-right">{movie.language || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-start py-1 border-b border-white/5 gap-4">
                <span className="text-[#d0c5b5]/30 text-[10px] whitespace-nowrap pt-0.5 flex items-center gap-1"><History className="w-3 h-3" /> Cập nhật</span>
                <span className="text-[#d0c5b5]/60 font-mono font-bold text-right text-xs normal-case">{formattedModifiedDate}</span>
              </div>
              
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-[#d0c5b5]/30 text-[10px]">Tình trạng</span>
                <span className="text-[#ffe3ae] font-bold text-[10px] bg-[#E6C687]/10 px-2.5 py-0.5 rounded border border-[#E6C687]/20">
                  {movie.current_episode || 'Đang chiếu'}
                </span>
              </div>
            </div>
          </div>

          {relatedMovies.length > 0 && (
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-[10px] font-bold text-[#E6C687] tracking-widest uppercase pl-1">Related Constellations</h3>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 md:gap-4">
                {relatedMovies.map((relatedMovie) => (
                  <div key={relatedMovie.slug} className="animate-in fade-in duration-500">
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