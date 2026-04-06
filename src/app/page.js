import { getMovies } from '@/lib/movies';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer'; // Import Footer mới tách ra
import HistoryPopup from '@/components/HistoryPopup';
import ContinueWatching from '@/components/ContinueWatching';
import CategoryMenu from '@/components/CategoryMenu';
import FavoriteList from '@/components/FavoriteList';
import MovieCard from '@/components/MovieCard';

export default async function HomePage({ searchParams }) {
  // Đảm bảo tương thích với Next.js 15+
  const sParams = await searchParams;
  const page = sParams?.page || 1;
  
  // Gọi dữ liệu phim
  const data = await getMovies(page);

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 font-sans relative overflow-x-hidden">
      
      {/* 1. HEADER: Logo, SearchBox và UserMenu */}
      <Header />

      {/* 2. NAVIGATION: Menu thể loại & quốc gia */}
      <CategoryMenu />

      {/* 3. TRẢI NGHIỆM CÁ NHÂN: Lịch sử và Yêu thích */}
      <ContinueWatching />
      <FavoriteList />

      {/* 4. DANH MỤC CHÍNH: Phim Mới Cập Nhật */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)]"></div>
            <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-tight">
              Phim Mới Cập Nhật
            </h2>
          </div>
          <span className="text-zinc-600 text-[10px] font-black bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-800 tracking-[0.2em] uppercase">
            TRANG {page}
          </span>
        </div>

        {/* Layout phim 5 cột */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
          {data.items?.slice(0, 10).map((phim) => (
            <div key={phim.slug}>
              <MovieCard movie={phim} />
            </div>
          ))}
        </div>
      </section>

      {/* 5. PHÂN TRANG (PAGINATION) */}
      <div className="flex flex-wrap justify-center items-center mt-20 gap-3 pb-24">
        {Number(page) > 1 && (
          <Link
            href={`/?page=${Number(page) - 1}`}
            className="px-5 py-2.5 bg-zinc-900 text-zinc-500 rounded-xl font-black hover:text-white border border-zinc-800 uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-lg"
          >
            ← TRƯỚC
          </Link>
        )}

        {Array.from({ length: 5 }, (_, i) => {
          const pageNum = Math.max(1, Number(page) - 2) + i;
          return (
            <Link
              key={pageNum}
              href={`/?page=${pageNum}`}
              className={`w-12 h-12 flex items-center justify-center rounded-xl font-black transition-all border ${
                Number(page) == pageNum
                ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] scale-110 z-10'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-white'
              }`}
            >
              {pageNum}
            </Link>
          );
        })}

        <Link
          href={`/?page=${Number(page) + 1}`}
          className="px-5 py-2.5 bg-zinc-900 text-zinc-500 rounded-xl font-black hover:text-white border border-zinc-800 uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-lg"
        >
          SAU →
        </Link>
      </div>

      <HistoryPopup />

      {/* 6. FOOTER: Đã chuyển sang file riêng biệt */}
      <Footer />
    </main>
  );
}