import { getMoviesByCategory } from '@/lib/movies';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MovieCard from '@/components/MovieCard';

// 1. BẢNG TRA CỨU TÊN THỂ LOẠI CÓ DẤU
const categoryMap = {
  'hanh-dong': 'Hành Động',
  'tinh-cam': 'Tình Cảm',
  'hai-huoc': 'Hài Hước',
  'co-trang': 'Cổ Trang',
  'tam-ly': 'Tâm Lý',
  'hinh-su': 'Hình Sự',
  'chien-tranh': 'Chiến Tranh',
  'the-thao': 'Thể Thao',
  'vo-thuat': 'Võ Thuật',
  'vien-tuong': 'Viễn Tưởng',
  'phieu-luu': 'Phiêu Lưu',
  'kinh-di': 'Kinh Dị',
  'hoat-hinh': 'Hoạt Hình',
  'gia-dinh': 'Gia Đình',
  'than-thoai': 'Thần Thoại',
  'tai-lieu': 'Tài Liệu',
  'hoc-duong': 'Học Đường',
  'am-nhac': 'Âm Nhạc',
  'kinh-dien': 'Kinh Điển',
};

// 2. CẬP NHẬT METADATA CHO TAB TRÌNH DUYỆT
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categoryName = categoryMap[slug] || slug.replace(/-/g, ' ');

  return {
    title: `Thể loại: ${categoryName}`,
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sParams = await searchParams;
  const page = Number(sParams?.page || 1);
  const typeFilter = sParams?.type || ''; 
  
  const displayName = categoryMap[slug] || slug.replace(/-/g, ' ');

  // 1. LẤY DỮ LIỆU BAN ĐẦU
  const initialData = await getMoviesByCategory(slug, page, typeFilter);
  const totalPagesFromAPI = initialData.paginate?.total_pages || initialData.total_pages || (page + 50);

  let finalItems = [];
  let fetchPage = page;
  const targetCount = 12; 

  // 2. MÁY HÚT PHIM THÔNG MINH
  while (finalItems.length < targetCount && fetchPage <= totalPagesFromAPI && fetchPage < page + 10) {
    const data = (fetchPage === page) ? initialData : await getMoviesByCategory(slug, fetchPage, typeFilter);
    
    if (!data.items || data.items.length === 0) break;

    const filtered = data.items.filter(phim => {
      if (typeFilter === '') return true;
      const label = (phim.current_episode || "").toLowerCase();
      const isSeries = label.includes('tập') || label.includes('/') || (phim.episode_total && phim.episode_total !== "1");
      return typeFilter === 'series' ? isSeries : !isSeries;
    });

    finalItems = [...finalItems, ...filtered];
    if (typeFilter === '') break; 
    fetchPage++;
  }

  const displayItems = finalItems.slice(0, 15);

  return (
    <main className="min-h-screen bg-black text-white font-sans relative overflow-x-hidden">
      <Header />
      
      {/* Container nội dung: Đã thêm Padding Top lớn và z-index để không bị Header che */}
      <div className="px-6 md:px-12 pt-20 md:pt-20 pb-10 relative z-10">
        
        {/* Nút quay lại lãng mạn */}
        <Link 
          href="/home" 
          className="text-zinc-500 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-8 transition-all group w-fit"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay lại trang chủ
        </Link>

        <header className="mb-12 border-b border-zinc-900 pb-8 mt-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-10 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)]"></div>
              <h1 className="text-3xl font-black text-zinc-100 uppercase italic tracking-tight">
                Thể loại: <span className="text-red-600">{displayName}</span>
              </h1>
            </div>
            
            <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-zinc-800 backdrop-blur-md shadow-2xl">
              {[
                { label: 'Tất cả', value: '' },
                { label: 'Phim Bộ', value: 'series' },
                { label: 'Phim Lẻ', value: 'single' }
              ].map((item) => (
                <Link
                  key={item.value}
                  href={`/category/${slug}?type=${item.value}&page=1`}
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

        {/* DANH SÁCH PHIM */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
          {displayItems.length > 0 ? (
             displayItems.map((phim) => (
              <div key={phim.slug}>
                <MovieCard movie={phim} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center italic opacity-30">Hết phim rồi anh yêu ơi... ❤️</div>
          )}
        </div>

        {/* THANH PHÂN TRANG */}
        <div className="flex flex-wrap justify-center items-center mt-20 gap-3 pb-16">
          <Link 
            href={page > 1 ? `/category/${slug}?type=${typeFilter}&page=${page - 1}` : '#'}
            className={`px-6 h-12 flex items-center justify-center rounded-xl font-black transition-all ${
              page > 1 ? 'bg-zinc-800 text-white hover:bg-red-600 shadow-lg' : 'bg-zinc-900 text-zinc-700 cursor-not-allowed'
            }`}
          >
            Prev
          </Link>

          {(() => {
            let pages = [1];
            if (page <= 3) {
              for (let i = 2; i <= 5; i++) pages.push(i);
            } else {
              pages.push(page - 1);
              pages.push(page);
              pages.push(page + 1);
            }
            
            if (!pages.includes(page + 5)) pages.push(page + 5);
            if (!pages.includes(page + 10)) pages.push(page + 10);
            if (totalPagesFromAPI > 100 && !pages.includes(500)) pages.push(500);

            return Array.from(new Set(pages)).filter(p => p <= totalPagesFromAPI).sort((a,b) => a - b).map(p => (
              <Link 
                key={p} 
                href={`/category/${slug}?type=${typeFilter}&page=${p}`}
                className={`w-12 h-12 flex items-center justify-center rounded-xl font-black transition-all border-2 ${
                  page === p 
                  ? 'border-red-600 text-white bg-red-600/10 shadow-[0_0_20px_rgba(220,38,38,0.3)]' 
                  : 'bg-zinc-900 border-transparent text-zinc-500 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {p}
              </Link>
            ));
          })()}

          <Link 
            href={`/category/${slug}?type=${typeFilter}&page=${page + 1}`}
            className="px-6 h-12 flex items-center justify-center rounded-xl font-black transition-all bg-red-600 text-white hover:bg-red-500 shadow-lg"
          >
            Next
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}