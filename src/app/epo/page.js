import { getEpoVideos } from '@/lib/movies';
import Footer from '@/components/Footer';
import MovieCard from '@/components/MovieCard';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function EpoPage({ searchParams }) {
  const sParams = await searchParams;
  const page = Number(sParams?.page) || 1;
  const query = sParams?.q || 'all';

  // Gọi API lấy dữ liệu phim và thông tin phân trang
  const data = await getEpoVideos(page, query);
  const videos = data?.videos || [];
  const totalPages = data?.total_pages || 1000;

  // Server Action xử lý tìm kiếm
  async function handleSearch(formData) {
    'use server';
    const searchTerm = formData.get('q');
    if (searchTerm) {
      redirect(`/epo?q=${encodeURIComponent(searchTerm)}`);
    } else {
      redirect('/epo');
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans relative overflow-x-hidden">
      
      <div className="max-w-7xl mx-auto pt-10">
        
        {/* --- NÚT QUAY LẠI TỐI GIẢN (MINIMALIST) --- */}
        <div className="w-full mb-8">
          <Link 
            href="/" 
            className="text-zinc-500 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-6 transition-all group w-fit"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span> 
            Quay lại trang chủ
          </Link>
        </div>

        {/* 1. HEADER & SEARCH BAR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-12 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)] rounded-full"></div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-white">
                EPO PRIVATE
              </h1>
              <p className="text-[10px] text-zinc-500 tracking-[0.5em] uppercase font-bold mt-1">
                For Thu Uyn Only • No Trace Mode
              </p>
            </div>
          </div>

          <form action={handleSearch} className="relative w-full md:w-96 group">
            <input 
              name="q"
              type="text" 
              placeholder="Tìm kiếm bí mật..." 
              className="w-full bg-zinc-900/30 border border-zinc-800 rounded-2xl py-4 px-6 text-[11px] focus:outline-none focus:border-red-600/50 transition-all font-black tracking-widest placeholder:text-zinc-800"
            />
            <button type="submit" className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-red-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </button>
          </form>
        </div>

        {/* 2. GRID PHIM (Dạng ngang 16:9) */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {videos.map((video) => (
              <div key={video.id}>
                <MovieCard 
                  movie={{
                    name: video.title,
                    thumb_url: video.thumb, 
                    slug: video.id,
                    quality: video.duration, 
                    customHref: `/epo/watch/${video.id}`
                  }} 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center border border-dashed border-zinc-900 rounded-[3rem] bg-zinc-950/20">
            <p className="text-zinc-800 font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">
              Không tìm thấy phim trong kho báu...
            </p>
          </div>
        )}

        {/* 3. PHÂN TRANG CHI TIẾT */}
        <div className="mt-32 flex flex-col items-center">
          <div className="flex flex-wrap justify-center items-center gap-3 mb-16">
            {page > 1 && (
              <Link 
                href={`/epo?q=${query}&page=${page - 1}`} 
                className="px-5 py-2.5 bg-zinc-900/50 text-zinc-500 rounded-xl font-black hover:text-white border border-zinc-800 uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-lg"
              >
                ←
              </Link>
            )}

            {Array.from({ length: 5 }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) { pageNum = i + 1; }
              else if (page <= 3) { pageNum = i + 1; }
              else if (page >= totalPages - 2) { pageNum = totalPages - 4 + i; }
              else { pageNum = page - 2 + i; }

              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <Link
                    key={pageNum}
                    href={`/epo?q=${query}&page=${pageNum}`}
                    className={`w-11 h-11 flex items-center justify-center rounded-xl font-black transition-all border ${
                      page === pageNum
                        ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] scale-110 z-10'
                        : 'bg-zinc-900/40 border-zinc-800 text-zinc-600 hover:border-zinc-500 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              }
              return null;
            })}

            {page < totalPages && (
              <Link 
                href={`/epo?q=${query}&page=${page + 1}`} 
                className="px-5 py-2.5 bg-zinc-900/50 text-zinc-500 rounded-xl font-black hover:text-white border border-zinc-800 uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-lg"
              >
                →
              </Link>
            )}
          </div>

          <div className="mb-12 text-center">
            <span className="text-zinc-800 text-[8px] font-black uppercase tracking-[0.5em]">
              Trang {page} trên tổng {totalPages}
            </span>
          </div>

          {/* 4. NÚT RỜI KHỎI VÙNG AN TOÀN */}
          <div className="pt-12 border-t border-zinc-900/50 w-full max-w-sm flex justify-center pb-24">
            <Link 
              href="/" 
              className="group flex items-center gap-4 text-zinc-800 hover:text-zinc-400 transition-all duration-700"
            >
              <span className="text-[9px] font-black uppercase tracking-[0.6em] italic">
                Rời khỏi vùng an toàn
              </span>
              <svg 
                width="14" height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                className="transform group-hover:translate-x-3 transition-transform duration-500"
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}