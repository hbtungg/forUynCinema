import { getMovies } from '@/lib/movies';
import Link from 'next/link';
import SearchBox from '@/components/SearchBox';
import HistoryPopup from '@/components/HistoryPopup';
import ContinueWatching from '@/components/ContinueWatching';
import CategoryMenu from '@/components/CategoryMenu';
import FavoriteButton from '@/components/FavoriteButton';
import FavoriteList from '@/components/FavoriteList';
import MovieCard from '@/components/MovieCard';

export default async function HomePage({ searchParams }) {
  // Lấy số trang từ URL (mặc định là trang 1)
  const page = (await searchParams)?.page || 1;

  // Gọi dữ liệu phim mới nhất
  const data = await getMovies(page);

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 font-sans relative overflow-x-hidden">
      
      {/* 1. HEADER: Thương hiệu forUyn Cinema */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 border-b border-zinc-900 pb-10">
        <div>
          <h1 className="text-4xl font-black text-red-600 tracking-tighter cursor-pointer hover:opacity-80 transition italic">
            forUyn Cinema 🎬
          </h1>
          <p className="text-zinc-500 text-sm mt-2 italic font-medium">
            Gọi cho anh bất cứ khi nào em thấy cần 🥦
          </p>
        </div>

        <SearchBox />
      </header>

      {/* 2. NAVIGATION: Menu thể loại */}
      <CategoryMenu />

      {/* 3. LỊCH SỬ XEM & PHIM YÊU THÍCH */}
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

        {/* Layout 5 cột chuyên nghiệp, sử dụng MovieCard để hiện Badge thông tin */}
        {/* Layout 5 cột chuyên nghiệp */}
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
  {data.items?.slice(0, 10).map((phim) => (
    <div key={phim.slug} className="relative group">
      {/* Thẻ phim chứa nút "Xem Ngay" bên trong */}
      <MovieCard movie={phim} />
      
      {/* NÚT YÊU THÍCH: Đẩy xuống dưới nút Xem Ngay để không bị đè */}
      <div className="absolute inset-0 z-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center gap-3 mt-24"> 
          {/* mt-24 này sẽ đẩy nút Tim xuống dưới nút Xem Ngay khoảng 60px */}
          <FavoriteButton phim={phim} />
        </div>
      </div>
    </div>
  ))}
</div>
      </section>

      {/* 5. PHÂN TRANG (PAGINATION) */}
      <div className="flex flex-wrap justify-center items-center mt-20 gap-3 pb-24">
        {Number(page) > 1 && (
          <Link
            href={`/?page=${Number(page) - 1}`}
            className="px-5 py-2.5 bg-zinc-900 text-zinc-500 rounded-xl font-black hover:text-white border border-zinc-800 uppercase text-[10px] tracking-widest transition-all active:scale-95"
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
                Number(page) === pageNum
                ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/40 scale-110 z-10'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-white'
              }`}
            >
              {pageNum}
            </Link>
          );
        })}

        <Link
          href={`/?page=${Number(page) + 1}`}
          className="px-5 py-2.5 bg-zinc-900 text-zinc-500 rounded-xl font-black hover:text-white border border-zinc-800 uppercase text-[10px] tracking-widest transition-all active:scale-95"
        >
          SAU →
        </Link>
      </div>

      {/* 6. POPUP NHẮC XEM TIẾP */}
      <HistoryPopup />

      {/* 7. FOOTER */}
      <footer className="mt-10 py-12 text-center border-t border-zinc-900 opacity-20 hover:opacity-100 transition-opacity">
        <p className="text-zinc-500 text-[9px] uppercase tracking-[0.5em] font-black mb-2">
          &copy; 2026 Designed by forUyn Cinema
        </p>
        <p className="text-zinc-700 text-[8px] italic tracking-widest font-bold">Premium Streaming for ThuUyn ❤️</p>
      </footer>
    </main>
  );
}