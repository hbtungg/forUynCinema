import { getMoviesByCountry } from '@/lib/movies';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';
import MovieCard from '@/components/MovieCard';

export default async function CountryPage({ params, searchParams }) {
  const { slug } = await params;
  const sParams = await searchParams;
  const page = Number(sParams?.page || 1);
  const typeFilter = sParams?.type || ''; 
  
  // 1. LẤY DỮ LIỆU BAN ĐẦU
  const initialData = await getMoviesByCountry(slug, page, typeFilter);
  
  // MẸO: API Nguonc đôi khi giấu paginate khi lọc type. 
  // Ta lấy từ paginate, nếu không có thì lấy page + 20 để Thu Uyên luôn thấy trang tiếp theo.
  const totalPagesFromAPI = initialData.paginate?.total_pages || initialData.total_pages || (page + 20);

  let finalItems = [];
  let currentPage = page;
  const targetCount = 12; 

  // 2. GOM PHIM THÔNG MINH (AUTO-FETCHING)
  while (finalItems.length < targetCount && currentPage <= totalPagesFromAPI && currentPage < page + 5) {
    const data = (currentPage === page) ? initialData : await getMoviesByCountry(slug, currentPage, typeFilter);
    if (!data.items || data.items.length === 0) break;

    const filtered = data.items.filter(phim => {
      if (typeFilter === '') return true;
      const label = (phim.current_episode || "").toLowerCase();
      const isSeries = label.includes('tập') || label.includes('/');
      return typeFilter === 'series' ? isSeries : !isSeries;
    });

    finalItems = [...finalItems, ...filtered];
    if (typeFilter === '') break; 
    currentPage++;
  }

  const displayItems = finalItems.slice(0, 15);

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 font-sans overflow-x-hidden">
      <header className="mb-12 border-b border-zinc-900 pb-8">
        <Link href="/" className="text-red-600 font-black uppercase text-xs flex items-center gap-2 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Về trang chủ
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4">
          <h1 className="text-3xl font-black text-zinc-100 uppercase italic tracking-tight">
            Quốc gia: <span className="text-red-600">{slug.replace(/-/g, ' ')}</span>
          </h1>
          
          <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800 backdrop-blur-md shadow-2xl">
            {[
              { label: 'Tất cả', value: '' },
              { label: 'Phim Bộ', value: 'series' },
              { label: 'Phim Lẻ', value: 'single' }
            ].map((item) => (
              <Link
                key={item.value}
                href={`/country/${slug}?type=${item.value}&page=1`}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  typeFilter === item.value ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
        {displayItems.length > 0 ? (
           displayItems.map((phim) => (
            <div key={phim.slug} className="relative group">
              <MovieCard movie={phim} />
              <div className="absolute inset-0 z-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="pointer-events-auto flex flex-col items-center gap-3 mt-24">
                  <FavoriteButton phim={phim} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center italic opacity-30">Hết phim quốc gia này rồi anh yêu ơi... ❤️</div>
        )}
      </div>

      {/* THANH PHÂN TRANG MÀU ĐỎ GỐC ❤️ */}
      <div className="flex flex-wrap justify-center items-center mt-20 gap-3 pb-16">
        {/* Nút Prev */}
        <Link 
          href={page > 1 ? `/country/${slug}?type=${typeFilter}&page=${page - 1}` : '#'}
          className={`px-6 h-12 flex items-center justify-center rounded-xl font-black transition-all ${
            page > 1 ? 'bg-zinc-800 text-white hover:bg-red-600 shadow-lg' : 'bg-zinc-900 text-zinc-700 cursor-not-allowed'
          }`}
        >
          Prev
        </Link>

        {/* Các con số trang thông minh */}
        {(() => {
          let pages = [1];
          // Nếu ở trang 1, hiện tiếp đến 5
          if (page <= 3) {
            for (let i = 2; i <= 5; i++) pages.push(i);
          } else {
            // Hiện trang trước, hiện tại và trang sau
            pages.push(page - 1);
            pages.push(page);
            pages.push(page + 1);
          }
          
          // Thêm mốc nhảy xa để không bị 1 trang
          if (!pages.includes(page + 10)) pages.push(page + 10);
          if (totalPagesFromAPI > 100 && !pages.includes(totalPagesFromAPI)) pages.push(totalPagesFromAPI);

          return Array.from(new Set(pages)).filter(p => p >= 1).sort((a,b) => a - b).map(p => (
            <Link 
              key={p} 
              href={`/country/${slug}?type=${typeFilter}&page=${p}`}
              className={`w-12 h-12 flex items-center justify-center rounded-xl font-black transition-all border-2 ${
                page === p 
                ? 'border-red-600 text-white bg-transparent shadow-[0_0_20px_rgba(220,38,38,0.3)]' 
                : 'bg-zinc-900 border-transparent text-zinc-500 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {p}
            </Link>
          ));
        })()}

        {/* Nút Next */}
        <Link 
          href={`/country/${slug}?type=${typeFilter}&page=${page + 1}`}
          className="px-6 h-12 flex items-center justify-center rounded-xl font-black transition-all bg-red-600 text-white hover:bg-red-500 shadow-lg"
        >
          Next
        </Link>
      </div>
    </main>
  );
}