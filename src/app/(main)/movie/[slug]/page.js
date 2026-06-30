'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Play, Globe, CalendarDays, Film, Tv, History, ArrowLeft, PlayCircle } from 'lucide-react';
import { getMovieDetail, getRelatedMovies } from '@/lib/clientMovies';
import MovieCard from '@/components/MovieCard';
import EpisodeList from '@/components/EpisodeList';


export default function MovieDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const movieSlug = params.slug;

  const router = useRouter();
  const [movieData, setMovieData] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🚀 ĐỒNG BỘ TIÊU ĐỀ THEO PHIM THẬT
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

  return (
    <div className="w-full min-h-screen bg-transparent text-[#e8e1da] select-none pb-24 font-sans" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      {/* ── 1. CINEMATIC BACKDROP DEEP SPACE ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[85vh] md:h-[100vh] z-0 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 45%, transparent 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 45%, transparent 92%, transparent 100%)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#060814] via-[#060814]/50 to-transparent z-10" />
        <img
          className="w-full h-full object-cover opacity-20 scale-105 filter blur-[1px]"
          src={movie.poster_url || movie.thumb_url}
          alt={movie.name}
        />
      </div>

      {/* ── 🚀 ĐÃ THÊM: NÚT QUAY LẠI PHÍA TRÊN BÊN TRÁI CHUẨN PHA LÊ ── */}
      <div className="relative z-20 pt-4 max-w-[1600px] mx-auto px-6 md:px-12">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-[#0F1326]/60 backdrop-blur-md border border-white/10 text-[#d0c5b5] hover:text-[#ffe3ae] rounded-xl font-bold text-[10px] uppercase transition-all duration-300 hover:border-[#E6C687]/40 shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quay lại
        </button>
      </div>

      {/* ── 2. HERO AREA (MỞ RỘNG KỊCH SÀN MAX-W-[1600PX]) ── */}
      <section className="relative z-10 pt-8 md:pt-16 max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">

          {/* Poster phim khổng lồ bọc viền vàng */}
          <div className="w-60 md:w-72 shrink-0 rounded-2xl overflow-hidden bg-[#0F1326]/40 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] transition-all duration-500 hover:border-[#E6C687]/30 hover:-translate-y-1.5">
            <img
              className="w-full aspect-[2/3] object-cover"
              src={movie.thumb_url || movie.poster_url}
              alt={movie.name}
            />
          </div>

          {/* Nội dung thông tin chữ */}
          <div className="flex-1 space-y-6 w-full pt-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <span className="bg-[#E6C687]/10 text-[#ffe3ae] border border-[#E6C687]/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                {movie.quality || 'HD'}
              </span>
              <span className="bg-white/5 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-[#d0c5b5]/60 tracking-wider border border-white/5 uppercase">
                {movie.language || 'Vietsub'}
              </span>
              {allCategoryTags.map((tag, idx) => (
                <span key={idx} className="bg-white/[0.02] backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-medium text-[#d0c5b5]/40 border border-white/5 uppercase tracking-wide">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-wide uppercase leading-none" style={{ textShadow: '0 0 15px rgba(255,227,174,0.15)' }}>
              {movie.name}
            </h1>
            <p className="text-xs md:text-sm text-[#d0c5b5]/40 italic font-medium tracking-wide">
              Tên gốc: {movie.original_name || movie.origin_name}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-xs md:text-sm text-[#d0c5b5]/60 font-medium">
              <div className="flex items-center gap-1.5 bg-[#ffe3ae]/10 px-2.5 py-0.5 rounded-md text-[#ffe3ae] border border-[#E6C687]/20 font-black">
                <Star className="w-3.5 h-3.5 fill-current text-[#E6C687]" />
                <span>{movie.rating || '8.5'}</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-[#E6C687]/40" /> {releaseYear}</span>
              <div className="h-4 w-px bg-white/10" />
              <span className="flex items-center gap-1.5"><Film className="w-4 h-4 text-[#E6C687]/40" /> {movie.time || '70 phút/tập'}</span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 pt-4">
              <button
                onClick={() => {
                  const firstEp = episodes?.[0]?.server_data?.[0]?.name || '1';
                  router.push(`/watch/${movieSlug}?ep=${firstEp}`);
                }}
                className="px-12 py-3.5 bg-[#E6C687]/10 hover:bg-[#E6C687] border border-[#E6C687]/20 text-[#E6C687] hover:text-[#402d00] font-bold text-xs tracking-widest uppercase rounded-full flex items-center gap-2.5 transition-all duration-300 active:scale-95 shadow-lg shadow-black/40 cursor-pointer focus:outline-none"
              >
                <Play className="w-4 h-4 fill-current" /> Watch Now
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. KHU VỰC CHI TIẾT NỘI DUNG (MỞ RỘNG RỘNG RÃI MAX-W-[1600PX]) ── */}
      <section className="px-6 md:px-12 mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-[1600px] mx-auto relative z-10">

        {/* CỘT TRÁI (8 Cột): Tóm tắt & Các tập phim */}
        <div className="lg:col-span-8 space-y-12">

          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#E6C687] border-l-4 border-[#E6C687] pl-3 uppercase tracking-widest">
              The Premise / Tóm tắt
            </h2>
            <div
              className="text-sm md:text-base text-[#d0c5b5]/80 leading-relaxed text-justify html-content"
              dangerouslySetInnerHTML={{ __html: movie.description || movie.content }}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#E6C687] border-l-4 border-[#E6C687] pl-3 uppercase tracking-widest">
              Dàn Diễn Viên
            </h2>
            <p className="text-xs md:text-sm text-[#d0c5b5]/60 font-semibold italic pl-3 leading-loose">
              {movie.casts || movie.actors || 'Đang cập nhật diễn viên...'}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#E6C687] uppercase tracking-widest border-b border-white/5 pb-2">
              Chapters / Danh Sách Tập
            </h2>
            <EpisodeList episodes={episodes} slug={slug} />
          </div>

        </div>

        {/* CỘT PHẢI (4 Cột): Observatory Logs */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#0F1326]/40 backdrop-blur-2xl p-6 rounded-2xl space-y-5 shadow-2xl border border-white/5">
            <h3 className="text-[10px] font-bold text-[#E6C687] tracking-widest uppercase flex items-center gap-2 border-b border-white/5 pb-2">
              <Globe className="w-4 h-4" /> Observatory Logs
            </h3>

            <div className="space-y-4 text-xs font-semibold uppercase tracking-wide">
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

          {/* Khay phim liên quan dạng dọc bọc kính mờ */}
          {relatedMovies.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-[#E6C687] tracking-widest uppercase pl-1">Related Constellations</h3>
              <div className="grid grid-cols-1 gap-4">
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