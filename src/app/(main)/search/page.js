"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { searchMovies } from '@/lib/clientMovies';
import MovieCard from '@/components/MovieCard';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, Search } from 'lucide-react';

export default function SearchPage({ searchParams }) {
  const sParams = use(searchParams);
  const router = useRouter();
  
  // Đồng bộ bắt tham số q từ URL
  const keyword = typeof sParams?.q === 'string' ? sParams.q.trim() : '';
  const requestedPage = Number(sParams?.page);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const [attempt, setAttempt] = useState(0);
  const requestKey = JSON.stringify([keyword, page, attempt]);

  const [result, setResult] = useState(null);
  const current = result?.key === requestKey ? result : null;
  const movies = current?.items || [];
  const totalPages = current?.total || 1;
  const isFetching = Boolean(keyword && !current);
  const error = current?.error;

  useEffect(() => {
    document.title = keyword ? 'Tìm phim: ' + keyword + ' - Uynflix' : 'Tìm kiếm - Uynflix';
    if (!keyword) return;
    const controller = new AbortController();

    searchMovies(keyword, page, { signal: controller.signal, distinguishUnavailable: true }).then(data => {
      if (!controller.signal.aborted) setResult({
        key: requestKey,
        items: data.items || [],
        total: data.paginate?.total_pages || data.paginate?.total_page || 1,
      });
    }).catch(() => {
      if (!controller.signal.aborted) setResult({ key: requestKey, error: 'Không tải được kết quả tìm kiếm.' });
    });
    return () => controller.abort();
  }, [keyword, page, requestKey]);

  // Luồng kích hoạt tìm kiếm khi bấm nút hoặc gõ Enter
  const handleLocalSubmit = (e) => {
    e.preventDefault();
    const cleanKeyword = String(new FormData(e.currentTarget).get("q") || "").trim();
    if (cleanKeyword) {
      router.push(`/search?q=${encodeURIComponent(cleanKeyword)}&page=1`);
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent text-[#ffffff] select-none" style={{ fontFamily: "var(--font-main)" }}>

      <div className="mx-auto max-w-[1500px] py-2 md:px-6 md:py-6">
        
        {/* NÚT QUAY LẠI CHUẨN PHA LÊ MOONLIGHT */}
        <Link
          href="/home"
          className="text-[#808080] hover:text-[#ffffff] text-[10px] font-bold uppercase tracking-[0.2em] inline-flex items-center gap-2 mb-8 transition-colors duration-300 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Quay lại trang chủ
        </Link>

        <header className="mb-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#e8e8e8] rounded-full " />
            <h1 className="min-w-0 break-words text-xl font-semibold leading-tight md:text-2xl">
              {keyword ? <>Kết quả cho &quot;{keyword}&quot;</> : "Tìm kiếm phim"}
            </h1>
          </div>
        </header>

        {/* ── 🚀 THANH TÌM KIẾM TRUNG TÂM TÙY BIẾN ĐỘC LẬP CHUẨN ĐIỆN ẢNH ── */}
        {/* Thiết kế to rộng trải dài, bo góc mềm mại, lồng kính mờ xanh đêm lộng lẫy */}
        <div className="mb-6 max-w-2xl rounded-2xl border border-border-subtle bg-surface-container p-2 sm:p-3">
          <form role="search" aria-label="Tìm phim trong danh mục" key={keyword} onSubmit={handleLocalSubmit} className="flex w-full min-w-0 items-center gap-2">
            <div className="relative flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-border-subtle bg-black/30 px-3 focus-within:border-white/50">
              <Search className="w-4 h-4 text-[#b8b8b8] flex-shrink-0" />
              <input 
                type="search" name="q" aria-label="Tên phim hoặc từ khóa"
                defaultValue={keyword} enterKeyHint="search" autoComplete="off"
                placeholder="Tên phim hoặc từ khóa"
                className="w-full min-w-0 bg-transparent text-base"
              />
            </div>
            <button
              type="submit"
              className="button-primary shrink-0 px-4 text-sm"
            >
              Tìm
            </button>
          </form>
        </div>

        {/* KHỐI BÁO LỖI KÍNH MỜ TRONG SUỐT */}
        {error && (
          <div className="mb-8 rounded-2xl border border-neutral-600/20 bg-neutral-950/10 px-5 py-4 text-xs font-semibold text-neutral-300 tracking-wide backdrop-blur-md">
            <p role="alert">{error}</p>
            <button type="button" onClick={() => setAttempt(value => value + 1)} className="mt-2 min-h-11 rounded-lg border border-border-subtle px-4">Thử lại</button>
          </div>
        )}

        {/* KHU VỰC HIỂN THỊ DANH SÁCH PHIM (GRID MƯỢT MÀ CHỐNG BLUR) */}
        {!keyword ? <p className="py-8 text-sm text-on-surface-variant">Nhập tên phim để bắt đầu tìm kiếm.</p> : error ? null : isFetching ? (
          <div aria-busy="true" aria-label="Đang tải kết quả" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} aria-hidden="true" className="animate-pulse">
                <div className="aspect-[2/3] rounded-xl bg-surface-container" />
                <div className="mt-2 h-10 w-4/5 rounded bg-surface-container" />
                <div className="mt-1 h-4 w-1/2 rounded bg-surface-container" />
              </div>
            ))}
          </div>
        ) : (
          <div>
            {movies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
                {movies.map((phim) => (
                  <div key={phim.slug} className="animate-in fade-in duration-300">
                    <MovieCard movie={phim} />
                  </div>
                ))}
              </div>
            ) : (
              /* TRẠNG THÁI KHÔNG TÌM THẤY PHIM CHUẨN ĐIỆN ẢNH TỐI GIẢN */
              <div className="py-12 text-center flex flex-col items-center justify-center gap-3 border border-dashed border-white/5 rounded-[32px] glass-surface max-w-4xl mx-auto px-6">
                <HelpCircle className="w-10 h-10 text-[#808080] " />
                <p className="text-[#808080] text-3xl md:text-5xl font-semibold uppercase tracking-tighter leading-none select-none">
                  Không thấy phim
                </p>
                <p className="text-[#808080] font-semibold uppercase tracking-[0.2em] text-[10px] leading-relaxed max-w-md">
                  Không tìm thấy từ khóa phù hợp. Bạn thử lại hoặc sử dụng từ khóa khác nhé.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── KHỐI ĐIỀU HƯỚNG PHÂN TRANG KÍNH MỜ (PAGINATION) ── */}
        {keyword && !error && !isFetching && Number(totalPages) > 1 && (
          <div className="flex justify-center items-center mt-16 gap-6 pb-10">
            {page > 1 && (
              <Link
                href={`/search?q=${encodeURIComponent(keyword)}&page=${page - 1}`}
                className="inline-flex min-h-11 items-center px-4 glass-surface text-[#b8b8b8] hover:text-[#ffffff] rounded-xl font-bold text-[10px] uppercase transition-all duration-300 hover:border-[#e8e8e8]/40 border border-white/10 shadow-lg active:scale-95"
              >
                Trước
              </Link>
            )}

            <div className="flex flex-col items-center gap-1 min-w-[60px]">
              <span className="text-[#808080] font-bold text-[9px] tracking-widest uppercase">
                Uynflix
              </span>
              <span className="text-[#ffffff] font-mono font-bold text-xs">
                {page} / {totalPages}
              </span>
            </div>

            {page < Number(totalPages) && (
              <Link
                href={`/search?q=${encodeURIComponent(keyword)}&page=${page + 1}`}
                className="inline-flex min-h-11 items-center px-4 glass-surface text-[#b8b8b8] hover:text-[#ffffff] rounded-xl font-bold text-[10px] uppercase transition-all duration-300 hover:border-[#e8e8e8]/40 border border-white/10 shadow-lg active:scale-95"
              >
                Sau
              </Link>
            )}
          </div>
        )}
      </div>

    </div>
  );
}