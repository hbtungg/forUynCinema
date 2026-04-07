import { getEpoVideos } from '@/lib/movies';
import Footer from '@/components/Footer';
import MovieCard from '@/components/MovieCard';
import EpoSort from '@/components/EpoSort';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function EpoPage({ searchParams }) {
  const sParams = await searchParams;
  const page = Number(sParams?.page) || 1;
  const query = sParams?.q || 'all';
  const order = sParams?.order || 'latest';

  // Lấy dữ liệu (Đã bao gồm fix logic lấy ảnh và views ở lib/movies.js)
  const data = await getEpoVideos(page, query, order);
  const videos = data?.videos || [];
  const totalPages = data?.total_pages || 1000;

  async function handleSearch(formData) {
    'use server';
    const searchTerm = formData.get('q');
    redirect(`/epo?q=${encodeURIComponent(searchTerm)}&order=latest&page=1`);
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto pt-10">
        
        {/* NÚT QUAY LẠI TỐI GIẢN */}
        <div className="w-full mb-8">
          <Link href="/" className="text-zinc-500 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-6 transition-all group w-fit">
            <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span> Quay lại trang chủ
          </Link>
        </div>

        {/* HEADER & TOOLBAR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-12 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)] rounded-full"></div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-white">EPO PRIVATE</h1>
              <p className="text-[10px] text-zinc-500 tracking-[0.5em] uppercase font-bold mt-1">For Thu Uyn Only • No Trace Mode</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* COMPONENT SẮP XẾP CUSTOM XỊN XÒ */}
            <EpoSort currentOrder={order} query={query} />

            <form action={handleSearch} className="relative w-full md:w-80 group">
              <input name="q" type="text" placeholder="Tìm kiếm bí mật..." className="w-full bg-zinc-900/30 border border-zinc-800 rounded-2xl py-4 px-6 text-[11px] focus:outline-none focus:border-red-600/50 transition-all font-black tracking-widest placeholder:text-zinc-800" />
              <button type="submit" className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-red-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* GRID PHIM - BẢN FIX TRIỆT ĐỂ LỖI HIỂN THỊ */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {videos.map((video) => (
              <div key={video.id} className="group flex flex-col">
                
                {/* 1. CONTAINER ẢNH - Sạch sẽ 100% */}
                <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-transparent group-hover:border-red-600/30 transition-all duration-500 shadow-2xl">
                  <MovieCard 
                    movie={{ 
                      name: video.title, 
                      thumb_url: video.thumb, 
                      slug: video.id, 
                      quality: video.duration, 
                      customHref: `/epo/watch/${video.id}` 
                    }} 
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>

                {/* 2. THÔNG TIN DƯỚI ẢNH - Gọn gàng trên một hàng */}
                <div className="mt-4 px-2 space-y-1.5">
                  <div className="flex items-center justify-between gap-4">
                    {/* Lượt xem: Ép trên 1 dòng */}
                    <div className="flex items-center gap-1.5 text-red-600 flex-shrink-0 whitespace-nowrap">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                      </svg>
                      <span className="text-[10px] font-black uppercase tracking-tighter">
                        {Number(video.views || 0).toLocaleString('vi-VN')} views
                      </span>
                    </div>
                    
                    {/* Ngày tháng rút gọn: Chỉ lấy phần Ngày/Tháng/Năm */}
                    <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest truncate">
                      {video.added ? video.added.split(' ')[0] : 'PRIVATE'}
                    </span>
                  </div>

                  {/* Tên phim phụ (Chống lỗi hiển thị) */}
                  <h3 className="text-[11px] font-black uppercase text-zinc-400 leading-tight line-clamp-1 group-hover:text-white transition-colors duration-300">
                    {video.title}
                  </h3>
                  
                  <div className="w-0 h-[1px] bg-red-600/50 group-hover:w-full transition-all duration-700 origin-left"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center border border-dashed border-zinc-900 rounded-[3rem] bg-zinc-950/20">
            <p className="text-zinc-800 font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">Không tìm thấy phim trong kho báu...</p>
          </div>
        )}

        {/* PHÂN TRANG */}
        <div className="mt-32 flex flex-col items-center">
          <div className="flex flex-wrap justify-center items-center gap-3 mb-16">
            {page > 1 && (
              <Link href={`/epo?q=${query}&order=${order}&page=${page - 1}`} className="px-5 py-2.5 bg-zinc-900/50 text-zinc-500 rounded-xl font-black hover:text-white border border-zinc-800 uppercase text-[10px] tracking-widest transition-all shadow-lg">←</Link>
            )}

            {Array.from({ length: 5 }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (page <= 3) pageNum = i + 1;
              else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = page - 2 + i;

              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <Link key={pageNum} href={`/epo?q=${query}&order=${order}&page=${pageNum}`} className={`w-11 h-11 flex items-center justify-center rounded-xl font-black transition-all border ${page === pageNum ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] scale-110 z-10' : 'bg-zinc-900/40 border-zinc-800 text-zinc-600 hover:border-zinc-500 hover:text-white'}`}>{pageNum}</Link>
                );
              }
              return null;
            })}

            {page < totalPages && (
              <Link href={`/epo?q=${query}&order=${order}&page=${page + 1}`} className="px-5 py-2.5 bg-zinc-900/50 text-zinc-500 rounded-xl font-black hover:text-white border border-zinc-800 uppercase text-[10px] tracking-widest transition-all shadow-lg">→</Link>
            )}
          </div>

          <div className="mb-12 text-center text-zinc-800 text-[8px] font-black uppercase tracking-[0.5em]">
            Trang {page} trên tổng {totalPages}
          </div>

          {/* RỜI KHỎI VÙNG AN TOÀN */}
          <div className="pt-12 border-t border-zinc-900/50 w-full max-w-sm flex justify-center pb-24">
            <Link href="/" className="group flex items-center gap-4 text-zinc-800 hover:text-zinc-400 transition-all duration-700">
              <span className="text-[9px] font-black uppercase tracking-[0.6em] italic">Rời khỏi vùng an toàn</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="transform group-hover:translate-x-3 transition-transform duration-500"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}