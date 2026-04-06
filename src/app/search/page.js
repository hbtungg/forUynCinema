import { searchMovies } from '@/lib/movies';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';
import MovieCard from '@/components/MovieCard';

export default async function SearchPage({ searchParams }) {
  const keyword = (await searchParams)?.keyword || '';
  const page = (await searchParams)?.page || 1;
  const data = await searchMovies(keyword, page);

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 font-sans overflow-x-hidden">
      {/* HEADER TÌM KIẾM */}
      <header className="mb-12 border-b border-zinc-900 pb-8">
        <Link href="/" className="text-red-600 font-black hover:underline uppercase tracking-tighter text-sm flex items-center gap-2 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay lại trang chủ
        </Link>
        <h1 className="text-3xl font-black mt-6 text-zinc-100 uppercase tracking-tight italic">
          Kết quả cho: <span className="text-red-600">"{keyword}"</span>
        </h1>
      </header>

      {/* DANH SÁCH PHIM TÌM ĐƯỢC */}
      {data.items?.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
          {data.items.map((phim) => (
            <div key={phim.slug} className="relative group">
              {/* SỬ DỤNG MOVIECARD ĐỂ ĐỒNG BỘ THÔNG TIN BADGE & NÚT XEM NGAY */}
              <MovieCard movie={phim} />
              
              {/* NÚT YÊU THÍCH: Căn chỉnh để hiện ngay dưới nút Xem Ngay của MovieCard */}
              <div className="absolute inset-0 z-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="pointer-events-auto flex flex-col items-center gap-3 mt-24">
                  <FavoriteButton phim={phim} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-900/10 rounded-[3rem] border border-dashed border-zinc-800">
          <p className="text-zinc-500 font-medium italic text-lg">
            Phim này làm gì có bạn ơi <br/>
            Chịu khó xem phim khác nha 🥦
          </p>
        </div>
      )}

      {/* PHÂN TRANG CHO TÌM KIẾM */}
      {data.items?.length > 0 && (
        <div className="flex justify-center items-center mt-20 gap-3 pb-16">
          {Array.from({ length: 5 }, (_, i) => {
            const pageNum = Math.max(1, Number(page) - 2) + i;
            return (
              <Link
                key={pageNum}
                href={`/search?keyword=${keyword}&page=${pageNum}`}
                className={`w-11 h-11 flex items-center justify-center rounded-xl font-black transition-all border ${
                  Number(page) === pageNum
                  ? 'bg-red-600 border-red-500 text-white shadow-lg scale-110'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600'
                }`}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>
      )}
      
      <footer className="mt-10 py-8 text-center opacity-20">
        <p className="text-[8px] uppercase tracking-[0.5em] font-black italic">
          Premium Search Experience for ThuUyn ❤️
        </p>
      </footer>
    </main>
  );
}