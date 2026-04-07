import { getMovies } from '@/lib/movies';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HistoryPopup from '@/components/HistoryPopup';
import ContinueWatching from '@/components/ContinueWatching';
import CategoryMenu from '@/components/CategoryMenu';
import FavoriteList from '@/components/FavoriteList';
import SecretChat from '@/components/SecretChat';
// IMPORT COMPONENT MỚI Ở ĐÂY
import NewMoviesGrid from '@/components/NewMoviesGrid';
import EpoTrigger from '@/components/EpoTrigger';
import LoveGallery from '@/components/LoveGallery';

export default async function HomePage({ searchParams }) {
  const sParams = await searchParams;
  const page = sParams?.page || 1;

  // Gọi dữ liệu phim
  const data = await getMovies(page);

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 font-sans relative overflow-x-hidden">
      <Header />
      {/* <CategoryMenu /> */}

      
      <ContinueWatching />
      <FavoriteList />

      {/* 4. SỬ DỤNG COMPONENT MỚI GỌN GÀNG */}
      <NewMoviesGrid data={data} page={page} />

      {/* 5. PHÂN TRANG (PAGINATION) */}
      {/* 5. PHÂN TRANG (PAGINATION) */}
      <div className="flex flex-wrap justify-center items-center mt-20 gap-3 pb-24">

        {/* Nút TRƯỚC */}
        {Number(page) > 1 && (
          <Link
            href={`/?page=${Number(page) - 1}`}
            className="px-5 py-2.5 bg-zinc-900 text-zinc-500 rounded-xl font-black hover:text-white border border-zinc-800 uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-lg"
          >
            ← TRƯỚC
          </Link>
        )}

        {/* DÃY SỐ TRANG: Hiển thị 5 trang thông minh */}
        {Array.from({ length: 5 }, (_, i) => {
          // Tính toán để trang hiện tại nằm ở giữa (ví dụ: đang ở trang 3 thì hiện 1 2 [3] 4 5)
          const pageNum = Math.max(1, Number(page) - 2) + i;

          return (
            <Link
              key={pageNum}
              href={`/?page=${pageNum}`}
              className={`w-12 h-12 flex items-center justify-center rounded-xl font-black transition-all border ${Number(page) == pageNum
                  ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] scale-110 z-10'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-white'
                }`}
            >
              {pageNum}
            </Link>
          );
        })}

        {/* Nút SAU */}
        <Link
          href={`/?page=${Number(page) + 1}`}
          className="px-5 py-2.5 bg-zinc-900 text-zinc-500 rounded-xl font-black hover:text-white border border-zinc-800 uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-lg"
        >
          SAU →
        </Link>
      </div>
      
      <LoveGallery />
      <HistoryPopup />
      {/* <EpoTrigger /> */}
      <SecretChat />
      <Footer />
    </main>
  );
}