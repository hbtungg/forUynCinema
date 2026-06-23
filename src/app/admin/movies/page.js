'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search keyword
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on new search
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const url = `/api/admin/movies?page=${page}&search=${encodeURIComponent(debouncedSearch)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setMovies(data.movies);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách phim:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [page, debouncedSearch]);

  const handlePrevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(prev => prev + 1);
  };

  return (
    <div className="w-full space-y-6 pb-12 lg:pb-0 font-sans text-zinc-200">
      
      {/* HEADER KHO PHIM */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5"
      >
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)] rounded-full" />
          <div>
            <h1 className="text-xl font-black uppercase tracking-wider text-white">
              Kho phim UynCinema
            </h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">
              Movie database provider lookup
            </p>
          </div>
        </div>
      </motion.div>

      {/* THANH TÌM KIẾM & BỘ LỌC */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm phim theo tên hoặc từ khóa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/[0.01] border border-white/[0.05] rounded-xl px-4 py-2.5 pl-10 text-xs outline-none focus:border-red-600/40 text-white transition-all w-full placeholder:text-zinc-600 select-text"
          />
          <span className="absolute left-3.5 top-3 text-xs opacity-40">🔍</span>
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-2.5 text-xs text-zinc-500 hover:text-white transition-colors py-1 px-1.5"
            >
              ✕
            </button>
          )}
        </div>
        <div className="bg-zinc-900/60 border border-white/[0.04] rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center justify-center gap-1.5 whitespace-nowrap">
          <span>Tổng số trang:</span>
          <span className="text-white bg-red-600/20 border border-red-500/10 px-1.5 py-0.5 rounded text-xs">{totalPages}</span>
        </div>
      </div>

      {/* HIỂN THỊ DANH SÁCH PHIM */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-white/[0.01] border border-white/[0.03] rounded-2xl animate-pulse flex flex-col justify-end p-3 space-y-2">
              <div className="h-3 w-3/4 bg-zinc-800 rounded animate-pulse" />
              <div className="h-2 w-1/2 bg-zinc-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center border border-dashed border-white/[0.03] rounded-2xl">
          <div className="text-4xl mb-4">🎬</div>
          <h2 className="text-white font-black text-lg mb-1">Không tìm thấy phim</h2>
          <p className="text-zinc-600 text-xs font-medium">Hệ thống chưa tìm được tựa phim nào khớp.</p>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {movies.map((movie, idx) => (
              <motion.div
                key={movie.slug || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 12) * 0.02 }}
                className="group relative rounded-xl overflow-hidden border border-white/[0.03] bg-[#0c0c0e]/60 flex flex-col justify-between hover:border-red-600/30 transition-all duration-300"
              >
                {/* Poster & Badges */}
                <div className="relative aspect-[2/3] overflow-hidden bg-black/40">
                  <img
                    src={movie.thumb_url || "/next.svg"}
                    alt={movie.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&auto=format&fit=crop";
                    }}
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded text-[8px] font-black bg-red-600 text-white">
                    {movie.episode_current || movie.quality || 'HD'}
                  </div>

                  {movie.year && (
                    <div className="absolute bottom-2 left-2 z-10 px-1.5 py-0.5 rounded text-[8px] font-black bg-black/60 backdrop-blur-sm text-zinc-400">
                      {movie.year}
                    </div>
                  )}

                  {/* Play Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-2xl bg-white/10 backdrop-blur-md p-2.5 rounded-full border border-white/20 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      👁️
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3 space-y-1 bg-[#0c0c0e] flex-1 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-[11px] sm:text-xs text-zinc-200 line-clamp-1 group-hover:text-red-500 transition-colors">
                      {movie.name}
                    </h3>
                    <p className="text-[9px] text-zinc-500 line-clamp-1 font-medium italic">
                      {movie.origin_name || 'N/A'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/[0.02] mt-2 flex items-center justify-between gap-1.5">
                    <span className="text-[8px] font-bold text-zinc-600 tracking-wide uppercase truncate max-w-[50%]">
                      {movie.language || 'Vietsub'}
                    </span>
                    <Link
                      href={`/watch/${movie.slug}`}
                      target="_blank"
                      className="text-[9px] font-black uppercase text-red-500 hover:text-red-400 tracking-wider whitespace-nowrap active:scale-95 transition-all"
                    >
                      Kiểm tra rạp →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* PHÂN TRANG GỌN GÀNG CHUẨN UX */}
          <div className="flex items-center justify-between border-t border-zinc-900 pt-5 mt-6">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${
                page === 1
                  ? 'border-transparent text-zinc-700 cursor-not-allowed'
                  : 'bg-white/[0.01] border-white/[0.04] text-zinc-300 hover:bg-white/[0.04] active:scale-95'
              }`}
            >
              ← Trang trước
            </button>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Trang <span className="text-white font-mono text-sm mx-1">{page}</span> / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border ${
                page === totalPages
                  ? 'border-transparent text-zinc-700 cursor-not-allowed'
                  : 'bg-white/[0.01] border-white/[0.04] text-zinc-300 hover:bg-white/[0.04] active:scale-95'
              }`}
            >
              Trang sau →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
