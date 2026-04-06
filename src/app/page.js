import { getMovies } from '@/lib/movies';
import Link from 'next/link';
import SearchBox from '@/components/SearchBox';
import HistoryPopup from '@/components/HistoryPopup';
import ContinueWatching from '@/components/ContinueWatching';

export default async function HomePage({ searchParams }) {
  // Lấy số trang từ URL (mặc định là trang 1)
  const page = (await searchParams)?.page || 1;
  
  // Gọi dữ liệu phim mới nhất
  const data = await getMovies(page);

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 font-sans relative">
      {/* Header thương hiệu lãng mạn của anh THTung & Thu Uyên */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 border-b border-zinc-900 pb-10">
        <div>
          <h1 className="text-4xl font-black text-red-600 tracking-tighter cursor-pointer hover:opacity-80 transition">
            Ck ThuUyn 🎬
          </h1>
          <p className="text-zinc-500 text-sm mt-2 italic">
            Chào anh yêu! Chúc anh và Thu Uyên xem phim thật vui nhé.
          </p>
        </div>
        
        <SearchBox />
      </header>

      {/* DANH MỤC: PHIM ĐANG XEM (LAYOUT 4 CỘT NGANG) */}
      <ContinueWatching />

      {/* DANH MỤC: PHIM MỚI CẬP NHẬT (LAYOUT 5 CỘT TINH TẾ) */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.3)]"></div>
            <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-tight">
              Phim Mới Cập Nhật
            </h2>
          </div>
          <span className="text-zinc-600 text-[10px] font-black bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-800 tracking-[0.2em] uppercase">
            TRANG {page}
          </span>
        </div>
        
        {/* Layout 5 cột (md:grid-cols-5) giúp poster thu nhỏ lại sang trọng hơn */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
          {data.items?.slice(0, 10).map((phim) => (
            <Link 
              href={`/watch/${phim.slug}`} 
              key={phim.slug} 
              className="group flex flex-col"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-zinc-800 transition-all duration-500 group-hover:border-red-600 group-hover:shadow-[0_0_35px_rgba(220,38,38,0.15)]">
                <img 
                  src={phim.thumb_url} 
                  alt={phim.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                {/* Lớp phủ Xem Ngay mờ ảo */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                   <div className="bg-red-600 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-tighter shadow-2xl">
                     Xem Ngay
                   </div>
                </div>
              </div>
              {/* Chỉnh lại font chữ phim nhỏ lại cho cân đối */}
              <h3 className="mt-4 text-center text-[13px] font-bold text-zinc-400 group-hover:text-red-500 transition-colors line-clamp-2 px-1 leading-snug">
                {phim.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Thanh phân trang thiết kế lại cho đồng bộ */}
      <div className="flex justify-center mt-24 gap-3 pb-16">
        {[1, 2, 3, 4, 5].map((p) => (
          <Link 
            key={p} 
            href={`/?page=${p}`} 
            className={`w-11 h-11 flex items-center justify-center rounded-xl font-black transition-all duration-300 border ${
              page == p 
              ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/50 scale-110' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-white'
            }`}
          >
            {p}
          </Link>
        ))}
      </div>

      <HistoryPopup />

      <footer className="mt-10 py-12 text-center border-t border-zinc-900 opacity-20 hover:opacity-100 transition-opacity">
        <p className="text-zinc-500 text-[9px] uppercase tracking-[0.5em] font-black mb-2">
          &copy; 2026 Designed by Ck ThuUyn Cinema
        </p>
        <p className="text-zinc-700 text-[8px] italic tracking-widest">Premium Streaming for THTung</p>
      </footer>
    </main>
  );
}