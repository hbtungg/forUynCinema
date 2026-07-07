import { getMoviesByCategory } from '@/lib/movies';
import Link from 'next/link';
import MovieCard from '@/components/MovieCard';
import { ArrowLeft } from 'lucide-react';

// 1. BẢNG TRA CỨU TÊN THỂ LOẠI CÓ DẤU CHUẨN ĐIỆN ẢNH
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
  'phim-18': 'Phim 18+',
  'kinh-dien': 'Kinh Điển',
  'lang-man': 'Lãng Mạn',
  'khoa-hoc-vien-tuong': 'Khoa Học Viễn Tưởng',
  'lich-su': 'Lịch Sử',
  'gay-can': 'Gây Cấn',
  'gia-tuong': 'Giả Tưởng',
  'nhac': 'Nhạc',
  'mien-tay': 'Miền Tây',
};

// 2. CẬP NHẬT METADATA CHO TAB TRÌNH DUYỆT
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categoryName = categoryMap[slug] || slug.replace(/-/g, ' ');

  return {
    title: `Thể loại: ${categoryName} | Midnight Cinema`,
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

  // 2. MÁY HÚT PHIM THÔNG MINH BỌC THÉP
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
    /* 🚀 FIX CHÍ MẠNG: Đổi sang bg-transparent lộ Shader, gạt bỏ hoàn toàn Header/Footer thừa nội bộ */
    <div className="w-full min-h-screen bg-transparent text-[#e8e1da] select-none font-sans" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      
      <div className="px-4 md:px-12 py-6">
        
        {/* NÚT QUAY LẠI CHUẨN PHA LÊ MOONLIGHT */}
        <Link 
          href="/home" 
          className="text-[#d0c5b5]/40 hover:text-[#ffe3ae] text-[10px] font-bold uppercase tracking-[0.2em] inline-flex items-center gap-2 mb-8 transition-colors duration-300 group w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Quay lại trang chủ
        </Link>

        {/* TIÊU ĐỀ THỂ LOẠI & THANH LỌC PHIM KÍNH MỜ XANH ĐÊM */}
        <header className="mb-12 border-b border-white/5 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            
            {/* Tiêu đề lấp lánh ánh trăng */}
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-[#E6C687] rounded-full shadow-[0_0_15px_rgba(230,198,135,0.6)]"></div>
              <h1 className="text-xl md:text-2xl font-bold text-[#e8e1da] uppercase tracking-wider leading-none">
                Thể loại: <span className="text-[#ffe3ae]" style={{ textShadow: '0 0 10px rgba(255,227,174,0.35)' }}>{displayName}</span>
              </h1>
            </div>
            
            {/* Thanh Tab chuyển đổi Phim Bộ / Phim Lẻ chuẩn pha lê */}
            <div className="flex bg-[#0F1326]/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-2xl shadow-xl w-fit">
              {[
                { label: 'Tất cả', value: '' },
                { label: 'Phim Bộ', value: 'series' },
                { label: 'Phim Lẻ', value: 'single' }
              ].map((item) => (
                <Link
                  key={item.value}
                  href={`/category/${slug}?type=${item.value}&page=1`}
                  className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                    typeFilter === item.value 
                      ? 'bg-[#E6C687]/10 text-[#ffe3ae] border border-[#E6C687]/20 shadow-[0_0_10px_rgba(230,198,135,0.15)] font-bold' 
                      : 'text-[#d0c5b5]/40 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </header>

        {/* LƯỚI KHUNG HIỂN THỊ DANH SÁCH MOVIECARD */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 w-full animate-in fade-in duration-500">
          {displayItems.length > 0 ? (
             displayItems.map((phim) => (
              <div key={phim.slug}>
                <MovieCard movie={phim} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center text-[10px] text-[#d0c5b5]/30 font-bold uppercase tracking-widest italic">
              Hết phim trong danh sách này rồi... 🌌
            </div>
          )}
        </div>

        {/* THANH PHÂN TRANG PREMIUM SỐ SANG TRỌNG KÍNH MỜ */}
        {totalPagesFromAPI > 1 && (
          <div className="flex flex-wrap justify-center items-center mt-20 gap-2 pb-10">
            <Link 
              href={page > 1 ? `/category/${slug}?type=${typeFilter}&page=${page - 1}` : '#'}
              className={`px-5 h-10 flex items-center justify-center rounded-xl font-bold text-[10px] uppercase transition-all duration-300 border ${
                page > 1 
                  ? 'bg-[#0F1326]/60 backdrop-blur-md text-[#d0c5b5] hover:text-[#ffe3ae] hover:border-[#E6C687]/40 border-white/10 shadow-lg active:scale-95' 
                  : 'bg-[#0F1326]/10 border-white/5 text-[#d0c5b5]/10 cursor-not-allowed pointer-events-none'
              }`}
            >
              ← Trước
            </Link>

            {(() => {
              let pages = [1];
              if (page <= 3) {
                for (let i = 2; i <= Math.min(5, totalPagesFromAPI); i++) pages.push(i);
              } else {
                pages.push(page - 1);
                pages.push(page);
                if (page + 1 <= totalPagesFromAPI) pages.push(page + 1);
              }
              
              if (page + 5 <= totalPagesFromAPI && !pages.includes(page + 5)) pages.push(page + 5);
              if (page + 10 <= totalPagesFromAPI && !pages.includes(page + 10)) pages.push(page + 10);
              if (totalPagesFromAPI > 100 && !pages.includes(500) && 500 <= totalPagesFromAPI) pages.push(500);

              return Array.from(new Set(pages)).filter(p => p <= totalPagesFromAPI).sort((a,b) => a - b).map(p => (
                <Link 
                  key={p} 
                  href={`/category/${slug}?type=${typeFilter}&page=${p}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold font-mono text-xs transition-all duration-200 border ${
                    page === p 
                      ? 'bg-[#0F1326]/80 text-[#ffe3ae] border border-[#E6C687]/40 shadow-[0_0_12px_rgba(230,198,135,0.25)]' 
                      : 'bg-[#0F1326]/20 border-white/5 text-[#d0c5b5]/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p}
                </Link>
              ));
            })()}

            <Link 
              href={page < totalPagesFromAPI ? `/category/${slug}?type=${typeFilter}&page=${page + 1}` : '#'}
              className={`px-5 h-10 flex items-center justify-center rounded-xl font-bold text-[10px] uppercase transition-all duration-300 border ${
                page < totalPagesFromAPI
                  ? 'bg-[#0F1326]/60 backdrop-blur-md text-[#d0c5b5] hover:text-[#ffe3ae] hover:border-[#E6C687]/40 border-white/10 shadow-lg active:scale-95'
                  : 'bg-[#0F1326]/10 border-white/5 text-[#d0c5b5]/10 cursor-not-allowed pointer-events-none'
              }`}
            >
              Sau →
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}