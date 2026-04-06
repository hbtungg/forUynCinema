import { getMovieDetail } from '@/lib/movies';
import Link from 'next/link';
import MovieWatcher from '@/components/MovieWatcher'; // Cục ghi nhớ thần thánh

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getMovieDetail(slug);
  return {
    title: `${data.movie?.name || 'Đang xem'} - Ck ThuUyn 🎬`,
  };
}

export default async function WatchPage({ params, searchParams }) {
  // 1. Lấy thông tin từ URL
  const { slug } = await params;
  const epIndex = parseInt((await searchParams)?.ep || 0);
  
  // 2. Gọi dữ liệu phim từ API
  const data = await getMovieDetail(slug);
  const movie = data.movie;

  // 3. Xác định tập phim đang xem
  const currentEp = movie.episodes[0]?.items[epIndex];
  const currentVideo = currentEp?.embed || "";
  const currentEpName = currentEp?.name || "Tập 1";

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-10 font-sans">
      {/* KÍCH HOẠT TÍNH NĂNG GHI NHỚ LỊCH SỬ TẠI ĐÂY */}
      <MovieWatcher 
        slug={slug} 
        movieName={movie.name} 
        epName={currentEpName} 
        epIndex={epIndex}
        thumb={movie.thumb_url} 
      />

      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-6">
        <div>
           <Link href="/" className="text-red-600 font-extrabold hover:text-red-500 transition flex items-center gap-2 uppercase tracking-tighter text-sm">
             <span className="text-lg">←</span> Trang chủ Ck ThuUyn
           </Link>
           <h1 className="text-2xl md:text-4xl font-black mt-3 tracking-tight text-zinc-100">{movie.name}</h1>
           <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest font-bold italic">
             Đang phát: <span className="text-red-600">{currentEpName}</span>
           </p>
        </div>
        <div className="hidden md:block bg-zinc-900/80 px-5 py-2 rounded-full border border-zinc-800 text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">
           Cinema Mode On
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {/* KHUNG TRÌNH PHÁT VIDEO MƯỢT MÀ */}
          <div className="relative aspect-video bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 shadow-[0_30px_60px_rgba(220,38,38,0.1)]">
            <iframe 
              src={currentVideo} 
              className="absolute inset-0 w-full h-full" 
              allowFullScreen
              title={movie.name}
            ></iframe>
          </div>
          
          {/* PHẦN GIỚI THIỆU PHIM (Đã sửa lỗi hiển thị HTML) */}
          <div className="mt-8 p-8 bg-zinc-900/20 rounded-3xl border border-zinc-800/50 backdrop-blur-xl">
            <h3 className="text-lg font-black text-red-600 mb-4 uppercase tracking-widest border-b border-zinc-800 pb-2 w-fit">
              Nội dung phim
            </h3>
            <div 
                className="text-zinc-400 leading-relaxed text-sm space-y-4 font-medium" 
                dangerouslySetInnerHTML={{ __html: movie?.content || "Dữ liệu đang được cập nhật cho vợ yêu..." }}
            ></div>
          </div>
        </div>

        {/* DANH SÁCH TẬP PHIM (LAYOUT GRID THÔNG MINH) */}
        <div className="bg-zinc-900/40 p-7 rounded-3xl border border-zinc-800 h-fit sticky top-10 shadow-xl">
          <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
            <span className="text-red-600 font-black">●</span>
            <h3 className="text-xl font-black text-zinc-100 uppercase tracking-tight">Danh sách tập</h3>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
            {movie.episodes[0]?.items.map((item, index) => (
              <Link
                key={index}
                href={`/watch/${slug}?ep=${index}`}
                className={`px-3 py-3 text-center text-[10px] font-black rounded-xl transition-all duration-300 border ${
                  epIndex === index 
                  ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/50 scale-105' 
                  : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-500 hover:bg-zinc-700 hover:text-white hover:border-zinc-500'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <footer className="mt-20 text-center py-10 opacity-20">
        <p className="text-[8px] uppercase tracking-[1em]">Ck ThuUyn Cinema Experience</p>
      </footer>
    </main>
  );
}