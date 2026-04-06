import { getMoviesByCountry } from '@/lib/movies';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';
import MovieCard from '@/components/MovieCard';

export default async function CountryPage({ params, searchParams }) {
  const { slug } = await params;
  const page = Number((await searchParams)?.page || 1);
  
  // Gọi API lấy phim theo quốc gia
  const data = await getMoviesByCountry(slug, page);

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 font-sans overflow-x-hidden">
      {/* Header trang Quốc gia */}
      <header className="mb-12 border-b border-zinc-900 pb-8 flex justify-between items-end">
        <div>
          <Link href="/" className="text-red-600 font-black hover:underline uppercase tracking-tighter text-xs flex items-center gap-2 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay lại trang chủ
          </Link>
          <h1 className="text-3xl font-black mt-4 text-zinc-100 uppercase italic tracking-tight">
            Quốc gia: <span className="text-red-600 underline decoration-red-600/30 underline-offset-8">{slug.replace(/-/g, ' ')}</span>
          </h1>
        </div>
        <div className="hidden md:block">
          <span className="text-zinc-600 text-[10px] font-black bg-zinc-900 px-5 py-2 rounded-full border border-zinc-800 uppercase tracking-[0.2em] shadow-lg">
            Trang hiện tại: {page}
          </span>
        </div>
      </header>

      {/* Hiển thị danh sách phim (5 cột sang trọng dùng MovieCard) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
        {data.items?.length > 0 ? (
          data.items.map((phim) => (
            <div key={phim.slug} className="relative group">
              {/* Sử dụng MovieCard để đồng bộ nhãn Series/Movie và nút Xem Ngay */}
              <MovieCard movie={phim} />
              
              {/* Nút Yêu thích: Căn chỉnh hiện ngay dưới nút Xem Ngay của MovieCard */}
              <div className="absolute inset-0 z-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="pointer-events-auto flex flex-col items-center gap-3 mt-24">
                  <FavoriteButton phim={phim} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-zinc-900/10 rounded-[3rem] border border-dashed border-zinc-800">
            <p className="text-zinc-600 italic font-medium">
              Đang cập nhật thêm phim cho quốc gia này nha... 🥦
            </p>
          </div>
        )}
      </div>

      {/* THANH PHÂN TRANG TỰ ĐỘNG TRƯỢT SỐ */}
      <div className="flex flex-wrap justify-center items-center mt-20 gap-3 pb-16">
        {page > 1 && (
          <Link 
            href={`/country/${slug}?page=${page - 1}`}
            className="px-5 py-2.5 bg-zinc-900 text-zinc-500 rounded-xl font-black hover:text-white border border-zinc-800 uppercase text-[10px] tracking-widest transition-all active:scale-95"
          >
            ← TRƯỚC
          </Link>
        )}

        {Array.from({ length: 5 }, (_, i) => {
          const pageNum = Math.max(1, page - 2) + i;
          return (
            <Link
              key={pageNum}
              href={`/country/${slug}?page=${pageNum}`}
              className={`w-12 h-12 flex items-center justify-center rounded-xl font-black transition-all border ${
                page === pageNum
                ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/40 scale-110 z-10'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-white'
              }`}
            >
              {pageNum}
            </Link>
          );
        })}

        <Link 
          href={`/country/${slug}?page=${page + 1}`}
          className="px-5 py-2.5 bg-zinc-900 text-zinc-500 rounded-xl font-black hover:text-white border border-zinc-800 uppercase text-[10px] tracking-widest transition-all active:scale-95"
        >
          SAU →
        </Link>
      </div>

      <footer className="text-center opacity-20 hover:opacity-100 transition-opacity py-12 border-t border-zinc-900 mt-10">
        <p className="text-[8px] uppercase tracking-[0.5em] font-black text-zinc-600 italic">
          Premium Country Collection for ThuUyn ❤️
        </p>
      </footer>
    </main>
  );
}