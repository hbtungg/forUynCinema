import MovieCard from './MovieCard';

// Thêm { data, page } vào đây
export default function NewMoviesGrid({ data, page }) {
  const movies = data?.items?.slice(0, 10) || [];

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)]"></div>
          <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-tight">
            Phim Mới Cập Nhật
          </h2>
        </div>
        
        {/* BÂY GIỜ NÓ SẼ HIỆN SỐ TRANG CHUẨN ĐÉT */}
        <span className="text-zinc-600 text-[10px] font-black bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-800 tracking-[0.2em] uppercase">
          TRANG {page}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
        {movies.map((phim) => (
          <div key={phim.slug}>
            <MovieCard movie={phim} />
          </div>
        ))}
      </div>
    </section>
  );
}