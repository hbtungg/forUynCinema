import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewMoviesGrid from '@/components/NewMoviesGrid';

// 1. BẢNG TRA CỨU CÁC LOẠI TYPE CHỦ CHỐT (Chuẩn Tiếng Việt)
const listTypeMap = {
  'han-quoc': 'Phim Hàn Quốc',
  'phim-moi-cap-nhat': 'Phim Mới Cập Nhật',
  'hanh-dong': 'Phim Hành Động',
  'hoat-hinh': 'Phim Hoạt Hình',
  'trung-quoc': 'Phim Trung Quốc',
  // Dự phòng các type khác nếu có phát sinh
  'phim-bo': 'Phim Bộ Mới',
  'phim-le': 'Phim Lẻ Mới',
};

// 2. CẬP NHẬT METADATA
export async function generateMetadata({ searchParams }) {
  const sParams = await searchParams;
  const type = sParams?.type || 'phim-moi-cap-nhat';
  const typeName = listTypeMap[type] || type.replace(/-/g, ' ');

  return {
    title: typeName, 
  };
}

async function getMoviesByList(type, page) {
    try {
        const url = type === 'phim-moi-cap-nhat' 
          ? `https://phim.nguonc.com/api/films/phim-moi-cap-nhat?page=${page}`
          : `https://phim.nguonc.com/api/films/danh-sach/${type}?page=${page}`;
          
        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error("Lỗi fetch:", error);
        return null;
    }
}

export default async function ListPage({ searchParams }) {
  const sParams = (await searchParams) || {};
  const type = sParams?.type || 'phim-moi-cap-nhat';
  const page = parseInt(sParams?.page) || 1;

  const data = await getMoviesByList(type, page);
  const totalPages = data?.paginate?.total_page || 1;
  const totalItems = data?.paginate?.total_items || 0;
  
  // Lấy tên hiển thị từ bảng tra cứu
  const displayName = listTypeMap[type] || type.replace(/-/g, ' ');

  return (
    <main className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <Header />
      
      <div className="px-6 md:px-12 pt-24 md:pt-32 pb-10">
        
        <Link 
          href="/" 
          className="text-zinc-500 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-8 transition-all group w-fit"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay lại trang chủ
        </Link>

        {/* TIÊU ĐỀ DANH MỤC CÓ DẤU */}
        <div className="mb-16 border-l-[6px] border-red-600 pl-8 transition-all">
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                {displayName}
            </h1>
            <div className="flex items-center gap-4 mt-4">
                <p className="text-zinc-500 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] opacity-80">
                    Trang {page} <span className="text-zinc-800 mx-2">/</span> Tổng {totalPages} trang
                </p>
                <span className="h-1 w-1 rounded-full bg-zinc-800"></span>
                <p className="text-red-600/50 text-[9px] font-black uppercase tracking-widest">
                    {totalItems.toLocaleString()} Kết quả
                </p>
            </div>
        </div>

        <div className="min-h-[60vh]">
           {data?.items ? (
             <NewMoviesGrid data={data} page={page} />
           ) : (
             <div className="py-20 text-center text-zinc-800 italic font-medium tracking-widest">
                Đang mở kho lưu trữ phim...
             </div>
           )}
        </div>

        {/* PHÂN TRANG (Giữ nguyên logic của anh) */}
        {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center mt-28 gap-3 pb-10">
                {page > 1 && (
                    <Link 
                        href={`/danh-sach?type=${type}&page=${page - 1}`} 
                        className="px-6 py-3.5 bg-zinc-900/50 text-zinc-500 rounded-2xl font-black hover:text-white border border-zinc-800/50 uppercase text-[10px] tracking-widest transition-all active:scale-90"
                    >
                        ← Trước
                    </Link>
                )}

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = totalPages <= 5 
                        ? i + 1 
                        : Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                    
                    return (
                        <Link
                            key={pageNum}
                            href={`/danh-sach?type=${type}&page=${pageNum}`}
                            className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl font-black text-xs transition-all border ${
                            page === pageNum 
                                ? 'bg-red-600 border-red-500 text-white shadow-[0_15px_35px_rgba(220,38,38,0.4)] scale-110 z-10' 
                                : 'bg-zinc-900/30 border-zinc-800/50 text-zinc-600 hover:border-zinc-500 hover:text-white'
                            }`}
                        >
                            {pageNum}
                        </Link>
                    );
                })}

                {page < totalPages && (
                    <Link 
                        href={`/danh-sach?type=${type}&page=${page + 1}`} 
                        className="px-6 py-3.5 bg-zinc-900/50 text-zinc-500 rounded-2xl font-black hover:text-white border border-zinc-800/50 uppercase text-[10px] tracking-widest transition-all active:scale-90"
                    >
                        Sau →
                    </Link>
                )}
            </div>
        )}
      </div>
      <Footer />
    </main>
  );
}