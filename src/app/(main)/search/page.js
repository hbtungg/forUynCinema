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
  const keyword = sParams?.q || '';
  const page = Number(sParams?.page || 1);

  // State quản lý ô nhập chữ nội bộ riêng biệt của trang search
  const [localKeyword, setLocalKeyword] = useState(keyword);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');

  // Cập nhật lại ô nhập chữ nội bộ mỗi khi keyword trên URL thay đổi
  useEffect(() => {
    setLocalKeyword(keyword);
  }, [keyword]);

  useEffect(() => {
    async function executeSearch() {
      setIsFetching(true);
      setError('');
      document.title = keyword
        ? `Search: "${keyword}" - Uynflix`
        : 'Search - Uynflix';

      try {
        const data = await searchMovies(keyword, page);
        if (data) {
          setMovies(data.items || []);
          const total = data.paginate?.total_pages || data.paginate?.total_page || 1;
          setTotalPages(total);
        }
      } catch (err) {
        console.error('Lỗi tìm kiếm tại SearchPage:', err);
        setMovies([]);
        setError('Không tải được kết quả tìm kiếm. Bạn thử lại sau nhé.');
      } finally {
        setIsFetching(false);
      }
    }

    executeSearch();
  }, [keyword, page]);

  // Luồng kích hoạt tìm kiếm khi bấm nút hoặc gõ Enter
  const handleLocalSubmit = (e) => {
    e.preventDefault();
    const cleanKeyword = localKeyword.trim();
    if (cleanKeyword) {
      router.push(`/search?q=${encodeURIComponent(cleanKeyword)}&page=1`);
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent text-[#e8e1da] select-none" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>

      <div className="px-4 md:px-12 py-6">
        
        {/* NÚT QUAY LẠI CHUẨN PHA LÊ MOONLIGHT */}
        <Link
          href="/home"
          className="text-[#d0c5b5]/40 hover:text-[#ffe3ae] text-[10px] font-bold uppercase tracking-[0.2em] inline-flex items-center gap-2 mb-8 transition-colors duration-300 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Quay lại trang chủ
        </Link>

        <header className="mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#E6C687] rounded-full shadow-[0_0_15px_rgba(230,198,135,0.6)]" />
            <h1 className="text-xl md:text-2xl font-bold text-[#e8e1da] uppercase tracking-wider leading-none">
              Kết quả cho: <span className="text-[#ffe3ae]" style={{ textShadow: '0 0 10px rgba(255,227,174,0.35)' }}>&quot;{keyword}&quot;</span>
            </h1>
          </div>
        </header>

        {/* ── 🚀 THANH TÌM KIẾM TRUNG TÂM TÙY BIẾN ĐỘC LẬP CHUẨN ĐIỆN ẢNH ── */}
        {/* Thiết kế to rộng trải dài, bo góc mềm mại, lồng kính mờ xanh đêm lộng lẫy */}
        <div className="mb-14 max-w-2xl mx-auto bg-[#0F1326]/40 border border-white/10 p-5 rounded-[24px] backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] animate-in fade-in duration-500">
          <form onSubmit={handleLocalSubmit} className="flex items-center gap-3 w-full">
            <div className="relative flex-1 flex items-center bg-[#2d2a25]/40 border border-[#4d463a]/40 rounded-xl px-4 py-2.5 focus-within:border-[#E6C687]/50 transition-all">
              <Search className="w-4 h-4 text-[#d0c5b5]/60 flex-shrink-0" />
              <input 
                type="text"
                value={localKeyword}
                onChange={(e) => setLocalKeyword(e.target.value)}
                placeholder="Nhập tên phim, diễn viên hoặc từ khóa mới..."
                className="bg-transparent border-none outline-none text-sm text-[#e8e1da] placeholder:text-[#d0c5b5]/20 w-full pl-1 font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#E6C687]/10 hover:bg-[#E6C687] border border-[#E6C687]/20 text-[#E6C687] hover:text-[#402d00] font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 active:scale-95 shrink-0 cursor-pointer focus:outline-none shadow-md"
            >
              Tìm Kiếm
            </button>
          </form>
        </div>

        {/* KHỐI BÁO LỖI KÍNH MỜ TRONG SUỐT */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/20 bg-red-950/10 px-5 py-4 text-xs font-semibold text-red-200 tracking-wide backdrop-blur-md">
            {error}
          </div>
        )}

        {/* KHU VỰC HIỂN THỊ DANH SÁCH PHIM (GRID MƯỢT MÀ CHỐNG BLUR) */}
        {isFetching ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] w-full bg-[#0F1326]/40 border border-white/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div>
            {movies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {movies.map((phim) => (
                  <div key={phim.slug} className="animate-in fade-in duration-500">
                    <MovieCard movie={phim} />
                  </div>
                ))}
              </div>
            ) : (
              /* TRẠNG THÁI KHÔNG TÌM THẤY PHIM CHUẨN ĐIỆN ẢNH TỐI GIẢN */
              <div className="py-24 text-center flex flex-col items-center justify-center gap-3 border border-dashed border-white/5 rounded-[32px] bg-[#0F1326]/10 backdrop-blur-md max-w-4xl mx-auto px-6">
                <HelpCircle className="w-10 h-10 text-[#d0c5b5]/20 animate-bounce" />
                <p className="text-[#d0c5b5]/20 text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none select-none">
                  Không thấy phim
                </p>
                <p className="text-[#d0c5b5]/40 font-semibold uppercase tracking-[0.2em] text-[10px] leading-relaxed max-w-md">
                  Không tìm thấy từ khóa phù hợp. Bạn thử lại hoặc sử dụng từ khóa khác nhé.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── KHỐI ĐIỀU HƯỚNG PHÂN TRANG KÍNH MỜ (PAGINATION) ── */}
        {!isFetching && Number(totalPages) > 1 && (
          <div className="flex justify-center items-center mt-16 gap-6 pb-10">
            {page > 1 && (
              <Link
                href={`/search?q=${encodeURIComponent(keyword)}&page=${page - 1}`}
                className="px-5 py-2.5 bg-[#0F1326]/60 backdrop-blur-md text-[#d0c5b5] hover:text-[#ffe3ae] rounded-xl font-bold text-[10px] uppercase transition-all duration-300 hover:border-[#E6C687]/40 border border-white/10 shadow-lg active:scale-95"
              >
                Trước
              </Link>
            )}

            <div className="flex flex-col items-center gap-1 min-w-[60px]">
              <span className="text-[#d0c5b5]/30 font-bold text-[9px] tracking-widest uppercase">
                Uynflix
              </span>
              <span className="text-[#e8e1da] font-mono font-bold text-xs">
                {page} / {totalPages}
              </span>
            </div>

            {page < Number(totalPages) && (
              <Link
                href={`/search?q=${encodeURIComponent(keyword)}&page=${page + 1}`}
                className="px-5 py-2.5 bg-[#0F1326]/60 backdrop-blur-md text-[#d0c5b5] hover:text-[#ffe3ae] rounded-xl font-bold text-[10px] uppercase transition-all duration-300 hover:border-[#E6C687]/40 border border-white/10 shadow-lg active:scale-95"
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