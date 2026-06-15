"use client";

import { useState, useEffect, use } from 'react';
import { searchMovies } from '@/lib/clientMovies';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MovieCard from '@/components/MovieCard';
import Link from 'next/link';

export default function SearchPage({ searchParams }) {
  const sParams = use(searchParams);
  const keyword = sParams?.keyword || '';
  const page = Number(sParams?.page || 1);

  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function executeSearch() {
      setIsFetching(true);
      setError('');
      document.title = keyword
        ? `Tìm kiếm "${keyword}" - Uynflix`
        : 'Tìm kiếm phim - Uynflix';

      try {
        const data = await searchMovies(keyword, page);
        if (data) {
          setMovies(data.items || []);
          const total = data.paginate?.total_pages || data.paginate?.total_page || 1;
          setTotalPages(total);
        }
      } catch (err) {
        console.error('Lỗi tìm kiếm:', err);
        setMovies([]);
        setError('Không tải được kết quả tìm kiếm. Anh thử lại sau nhé.');
      } finally {
        setIsFetching(false);
      }
    }

    executeSearch();
  }, [keyword, page]);

  return (
    <main className="min-h-screen bg-black text-white font-sans relative overflow-x-hidden select-none">
      <Header />

      <div className="px-6 md:px-12 pt-8 md:pt-12 pb-10">
        <Link
          href="/home"
          className="text-zinc-500 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-8 transition-all group w-fit"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Quay lại trang chủ
        </Link>

        <header className="mb-10 border-b border-zinc-900 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)]" />
            <h1 className="text-3xl md:text-5xl font-black text-zinc-100 uppercase italic tracking-tighter leading-none">
              Kết quả cho: <span className="text-red-600">&quot;{keyword}&quot;</span>
            </h1>
          </div>
        </header>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-600/30 bg-red-950/20 px-5 py-4 text-sm text-red-100 font-semibold">
            {error}
          </div>
        )}

        {isFetching ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] w-full bg-[#111115] rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
            {movies.length > 0 ? (
              movies.map((phim) => (
                <div key={phim.slug}>
                  <MovieCard movie={phim} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
                <p className="text-zinc-800 text-5xl md:text-7xl font-black uppercase leading-none">
                  Không thấy phim
                </p>
                <p className="text-zinc-500 font-bold uppercase tracking-[0.25em] text-[11px] leading-6">
                  Thử tìm bằng tên ngắn hơn hoặc từ khóa khác
                </p>
              </div>
            )}
          </div>
        )}

        {!isFetching && Number(totalPages) > 1 && (
          <div className="flex justify-center items-center mt-20 gap-4 pb-10">
            {page > 1 && (
              <Link
                href={`/search?keyword=${encodeURIComponent(keyword)}&page=${page - 1}`}
                className="px-6 py-3 bg-zinc-900 rounded-xl font-black text-[10px] uppercase hover:bg-red-600 transition-all shadow-lg active:scale-95 border border-white/5"
              >
                Trước
              </Link>
            )}

            <div className="flex flex-col items-center gap-1">
              <span className="text-zinc-500 font-black text-[10px] tracking-widest uppercase">
                Trang
              </span>
              <span className="text-white font-black text-sm">
                {page} / {totalPages}
              </span>
            </div>

            {page < Number(totalPages) && (
              <Link
                href={`/search?keyword=${encodeURIComponent(keyword)}&page=${page + 1}`}
                className="px-6 py-3 bg-red-600 rounded-xl font-black text-[10px] uppercase hover:bg-red-500 transition-all shadow-lg active:scale-95 shadow-red-900/20"
              >
                Sau
              </Link>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
