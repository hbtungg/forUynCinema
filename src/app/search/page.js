import { searchMovies } from '@/lib/movies';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MovieCard from '@/components/MovieCard';
import Link from 'next/link';

export default async function SearchPage({ searchParams }) {
  const sParams = await searchParams;
  const keyword = sParams?.keyword || '';
  const page = Number(sParams?.page || 1);

  // Gọi API tìm kiếm phim
  const data = await searchMovies(keyword, page);
  const movies = data.items || [];
  
  // FIX: Kiểm tra cả hai trường hợp có 's' và không có 's' ở total_page
  const totalPages = data.paginate?.total_pages || data.paginate?.total_page || 1;

  return (
    <main className="min-h-screen bg-black text-white font-sans relative overflow-x-hidden">
      <Header />

      <div className="px-6 md:px-12 pt-24 md:pt-32 pb-10">
        {/* Nút quay lại */}
        <Link 
          href="/" 
          className="text-zinc-500 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-8 transition-all group w-fit"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay lại trang chủ
        </Link>

        {/* Tiêu đề */}
        <header className="mb-12 border-b border-zinc-900 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-10 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)]"></div>
            <h1 className="text-3xl md:text-5xl font-black text-zinc-100 uppercase italic tracking-tighter leading-none">
              Kết quả cho: <span className="text-red-600">"{keyword}"</span>
            </h1>
          </div>
        </header>

        {/* DANH SÁCH PHIM */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
          {movies.length > 0 ? (
            movies.map((phim) => (
              <div key={phim.slug}>
                <MovieCard movie={phim} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
               <span className="text-4xl animate-bounce">🍿</span>
               <p className="italic opacity-30 text-sm">Không tìm thấy phim này rồi anh yêu ơi... ❤️</p>
            </div>
          )}
        </div>

        {/* 4. PHÂN TRANG - Đã tối ưu điều kiện hiển thị */}
        {Number(totalPages) > 1 && (
          <div className="flex justify-center items-center mt-20 gap-4 pb-10">
            {page > 1 && (
              <Link 
                href={`/search?keyword=${encodeURIComponent(keyword)}&page=${page - 1}`}
                className="px-6 py-3 bg-zinc-900 rounded-xl font-black text-[10px] uppercase hover:bg-red-600 transition-all shadow-lg active:scale-95 border border-white/5"
              >
                Prev
              </Link>
            )}
            
            <div className="flex flex-col items-center gap-1">
                <span className="text-zinc-500 font-black text-[10px] tracking-widest uppercase">Trang</span>
                <span className="text-white font-black text-sm">{page} / {totalPages}</span>
            </div>

            {page < Number(totalPages) && (
              <Link 
                href={`/search?keyword=${encodeURIComponent(keyword)}&page=${page + 1}`}
                className="px-6 py-3 bg-red-600 rounded-xl font-black text-[10px] uppercase hover:bg-red-500 transition-all shadow-lg active:scale-95 shadow-red-900/20"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}