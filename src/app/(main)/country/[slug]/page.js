import { getMoviesByCountry } from '@/lib/movies';
import Link from 'next/link';
import MovieCard from '@/components/MovieCard';
import { ArrowLeft } from 'lucide-react';

// 1. BẢNG TRA CỨU TÊN QUỐC GIA CÓ DẤU CHUẨN ĐIỆN ẢNH
import { countryLabels } from "@/lib/countryLabels";

// 2. CẬP NHẬT METADATA CHO TAB TRÌNH DUYỆT
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const countryName = countryLabels[slug] || slug.replace(/-/g, ' ');

  return {
    title: `Phim ${countryName}`,
  };
}

export default async function CountryPage({ params, searchParams }) {
  const { slug } = await params;
  const sParams = await searchParams;
  const requestedPage = Number(sParams?.page);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const typeFilter = ['series', 'single'].includes(sParams?.type) ? sParams.type : '';
  
  const displayName = countryLabels[slug] || slug.replace(/-/g, ' ');

  const data = await getMoviesByCountry(slug, page, typeFilter);
  const totalPagesFromAPI = data.paginate?.total_pages || data.total_pages || 1;
  // Keep each provider page distinct when the provider does not filter by format.
  const displayItems = (data.items || []).filter(movie => {
    if (!typeFilter) return true;
    const episode = String(movie.current_episode || '').toLowerCase();
    const totalEpisodes = parseInt(movie.total_episodes || movie.episode_total, 10);
    const isSeries = episode.includes('tập') || episode.includes('/') || totalEpisodes > 1;
    return typeFilter === 'series' ? isSeries : !isSeries;
  });

  return (
    /* 🚀 FIX CHÍ MẠNG: Đổi sang bg-transparent lộ Shader, gạt bỏ hoàn toàn Header/Footer thừa nội bộ */
    <div className="w-full min-h-screen bg-transparent text-[#ffffff] select-none font-sans" style={{ fontFamily: "var(--font-main)" }}>
      
      <div className="px-4 md:px-12 py-6">
        
        {/* NÚT QUAY LẠI CHUẨN PHA LÊ MOONLIGHT */}
        <Link 
          href="/home" 
          className="text-[#808080] hover:text-[#ffffff] text-[10px] font-bold uppercase tracking-[0.2em] inline-flex items-center gap-2 mb-8 transition-colors duration-300 group w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Quay lại trang chủ
        </Link>

        {/* TIÊU ĐỀ QUỐC GIA & THANH LỌC PHIM KÍNH MỜ XANH ĐÊM */}
        <header className="mb-12 border-b border-white/5 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            
            {/* Tiêu đề lấp lánh ánh trăng */}
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-[#e8e8e8] rounded-full "></div>
              <h1 className="text-xl md:text-2xl font-bold text-[#ffffff] uppercase tracking-wider leading-none">
                Quốc gia: <span className="text-[#ffffff]" style={{ textShadow: 'none' }}>{displayName}</span>
              </h1>
            </div>
            
            {/* Thanh Tab chuyển đổi Phim Bộ / Phim Lẻ chuẩn pha lê */}
            <div className="flex bg-white/[0.04] p-1.5 rounded-2xl border border-white/5 backdrop-blur-2xl shadow-xl w-fit">
              {[
                { label: 'Tất cả', value: '' },
                { label: 'Phim Bộ', value: 'series' },
                { label: 'Phim Lẻ', value: 'single' }
              ].map((item) => (
                <Link
                  key={item.value}
                  href={`/country/${slug}?type=${item.value}&page=1`}
                  className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                    typeFilter === item.value 
                      ? 'bg-[#e8e8e8]/10 text-[#ffffff] border border-[#e8e8e8]/20  font-bold' 
                      : 'text-[#808080] hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </header>

        {/* LƯỚI KHUNG HIỂN THỊ DANH SÁCH MOVIECARD */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 w-full animate-in fade-in duration-300">
          {displayItems.length > 0 ? (
             displayItems.map((phim) => (
              <div key={phim.slug}>
                <MovieCard movie={phim} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center text-[10px] text-[#808080] font-bold uppercase tracking-widest italic">
              {data.source === "empty" ? "Chưa tải được danh sách phim." : "Trang này chưa có phim phù hợp với bộ lọc."}
            </div>
          )}
        </div>

        {/* THANH PHÂN TRANG PREMIUM SỐ SANG TRỌNG KÍNH MỜ */}
        {totalPagesFromAPI > 1 && (
          <div className="flex flex-wrap justify-center items-center mt-20 gap-2 pb-10">
            <Link 
              href={page > 1 ? `/country/${slug}?type=${typeFilter}&page=${page - 1}` : '#'}
              className={`px-5 h-10 flex items-center justify-center rounded-xl font-bold text-[10px] uppercase transition-all duration-300 border ${
                page > 1 
                  ? 'glass-surface text-[#b8b8b8] hover:text-[#ffffff] hover:border-[#e8e8e8]/40 border-white/10 shadow-lg active:scale-95' 
                  : 'bg-white/[0.04] border-white/5 text-[#808080] cursor-not-allowed pointer-events-none'
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
                  aria-current={p === page ? "page" : undefined}
                  href={`/country/${slug}?type=${typeFilter}&page=${p}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold font-mono text-xs transition-all duration-200 border ${
                    page === p 
                      ? 'bg-white/[0.04] text-[#ffffff] border border-[#e8e8e8]/40 ' 
                      : 'bg-white/[0.04] border-white/5 text-[#808080] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p}
                </Link>
              ));
            })()}

            <Link 
              href={page < totalPagesFromAPI ? `/country/${slug}?type=${typeFilter}&page=${page + 1}` : '#'}
              className={`px-5 h-10 flex items-center justify-center rounded-xl font-bold text-[10px] uppercase transition-all duration-300 border ${
                page < totalPagesFromAPI
                  ? 'glass-surface text-[#b8b8b8] hover:text-[#ffffff] hover:border-[#e8e8e8]/40 border-white/10 shadow-lg active:scale-95'
                  : 'bg-white/[0.04] border-white/5 text-[#808080] cursor-not-allowed pointer-events-none'
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