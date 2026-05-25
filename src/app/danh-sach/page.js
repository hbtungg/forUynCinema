'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Import hệ thống linh kiện điều hướng của anh
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// 1. LINH KIỆN CON: Chứa toàn bộ logic xử lý dữ liệu danh sách phim
function DanhSachContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Lấy danh mục từ tham số URL, mặc định ban đầu là 'phim-moi-cap-nhat'
  const currentCategory = searchParams.get('type') || 'phim-moi-cap-nhat';
  const currentPage = Number(searchParams.get('page')) || 1;

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  const categories = [
    { id: 'phim-moi-cap-nhat', label: 'Mới cập nhật', isStatic: true },
    { id: 'phim-le', label: 'Phim Lẻ', isStatic: false },
    { id: 'phim-bo', label: 'Phim Bộ', isStatic: false },
    { id: 'hoat-hinh', label: 'Hoạt Hình', isStatic: false },
    { id: 'phim-dang-chieu', label: 'Phim Đang Chiếu', isStatic: false },
  ];

  const fetchMoviesData = async (category, page = 1) => {
    setLoading(true);
    try {
      let apiUrl = '';
      if (category === 'phim-moi-cap-nhat') {
        apiUrl = `https://phim.nguonc.com/api/films/phim-moi-cap-nhat?page=${page}`;
      } else {
        apiUrl = `https://phim.nguonc.com/api/films/danh-sach/${category}?page=${page}`;
      }

      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = await res.json();
        const items = data.items || data.data?.items || [];
        setMovies(items);
        
        const metaParams = data.paginate || data.pagination || {};
        setPagination({
          currentPage: metaParams.current_page || page,
          totalPages: metaParams.total_page || 1,
        });
      }
    } catch (error) {
      console.error('Lỗi kết nối API Nguồn C:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoviesData(currentCategory, currentPage);
  }, [currentCategory, currentPage]);

  const handleCategoryChange = (categoryId) => {
    router.push(`/danh-sach?type=${categoryId}&page=1`);
    fetchMoviesData(categoryId, 1);
  };

  // Hàm điều phối phân trang chủ động
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    router.push(`/danh-sach?type=${currentCategory}&page=${newPage}`);
    fetchMoviesData(currentCategory, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🚀 LOGIC TÍNH TOÁN DÃY SỐ PHÂN TRANG THÔNG MINH (Chỉ hiển thị tối đa 5 nút số xung quanh trang hiện tại)
  const renderPageNumbers = () => {
    const total = pagination.totalPages;
    const current = currentPage;
    const pages = [];

    let startPage = Math.max(1, current - 2);
    let endPage = Math.min(total, current + 2);

    // Bù trừ khoảng cách nếu ở đầu hoặc cuối danh sách số
    if (current <= 3) {
      endPage = Math.min(total, 5);
    }
    if (current > total - 2) {
      startPage = Math.max(1, total - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <main className="flex-1 w-full px-6 py-8 md:px-12 max-w-7xl mx-auto flex flex-col items-center">
      
      {/* ── TIÊU ĐỀ & THANH ĐIỀU HƯỚNG TÙY CHỌN (W-full để bám biên rộng rãi) ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/[0.03] pb-6 mb-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div>
            <h1 className="text-xl font-black uppercase tracking-widest text-white italic">
              Danh Mục Điện Ảnh
            </h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1">
              Hệ thống rạp phim thông minh • forUynCinema
            </p>
          </div>
          
          <Link 
            href="/home" 
            className="group relative text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 hover:text-white transition-colors duration-300 py-1 sm:ml-4"
          >
            ← Quay về trang chủ
            <span className="absolute bottom-0 left-0 h-px w-0 bg-red-600 transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        {/* Cụm Tabs chọn danh mục */}
        <div className="flex flex-wrap gap-1.5 bg-[#111114]/90 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
          {categories.map((cat) => {
            const isSelected = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 active:scale-95 ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-[0_4px_15px_rgba(220,38,38,0.3)]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── LƯỚI KHUNG HIỂN THỊ POSTER PHIM ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-red-600 animate-spin" />
          <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-black">Đang đồng bộ dữ liệu...</span>
        </div>
      ) : movies.length > 0 ? (
        // 🚀 ĐÃ SỬA CHÍNH XÁC THEO Ý ANH: 
        // - xl:grid-cols-5: Khóa cứng hiển thị đúng 5 phim trên một hàng (10 phim chia đều tăm tắp thành 2 hàng).
        // - max-w-[1020px]: Ép độ rộng tối đa của lưới phim nhỏ lại, khiến kích cỡ từng card phim co bé xinh xắn y hệt bản 6 hàng cũ!
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-5 w-full max-w-[1020px] mx-auto">
          {movies.map((movie) => (
            <Link
              key={movie.slug}
              href={`/watch/${movie.slug}`}
              className="group flex flex-col bg-[#111114]/20 border border-white/[0.02] hover:border-white/10 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <div className="aspect-[2/3] w-full bg-zinc-950 relative overflow-hidden">
                <img
                  src={movie.thumb_url || movie.poster_url}
                  alt={movie.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-90" />
              </div>
              
              <div className="p-3 flex-1 flex flex-col justify-between gap-1">
                <h3 className="text-[11px] font-bold text-zinc-200 group-hover:text-red-400 transition-colors leading-snug line-clamp-2">
                  {movie.name}
                </h3>
                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
                  {movie.year || '2026'} • {movie.current_episode || movie.episode_current || 'Full'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-[11px] text-zinc-500 font-medium">
          Không tìm thấy nội dung nào trong danh mục này. 🎬
        </div>
      )}

      {/* ── 🚀 HỆ THỐNG PHÂN TRANG SỐ PREMIUM (PAGINATION) ── */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-16 pt-6 border-t border-white/[0.02] w-full">
          
          {/* Nút Trước */}
          <button
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3.5 py-2 rounded-xl border border-white/5 bg-zinc-900/40 text-[10px] font-black text-zinc-400 disabled:opacity-10 disabled:pointer-events-none hover:text-white transition-all active:scale-95 whitespace-nowrap"
          >
            ← Trước
          </button>
          
          {/* 🚀 ĐÃ BỔ SUNG: Dãy nút bấm số động chọn trang trực tiếp */}
          <div className="flex items-center gap-1.5">
            {/* Hiện dấu ba chấm đầu nếu trang hiện tại quá xa số 1 */}
            {currentPage > 3 && pagination.totalPages > 5 && (
              <span className="text-[10px] text-zinc-600 font-bold px-1">...</span>
            )}

            {renderPageNumbers().map((num) => {
              const isActive = num === currentPage;
              return (
                <button
                  key={num}
                  onClick={() => handlePageChange(num)}
                  className={`w-8 h-8 rounded-xl text-[10px] font-black tabular-nums transition-all duration-200 active:scale-90 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-[0_4px_12px_rgba(220,38,38,0.25)]'
                      : 'border border-white/5 bg-zinc-900/20 text-zinc-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  {num}
                </button>
              );
            })}

            {/* Hiện dấu ba chấm cuối nếu còn cách xa trang cuối cùng */}
            {currentPage < pagination.totalPages - 2 && pagination.totalPages > 5 && (
              <span className="text-[10px] text-zinc-600 font-bold px-1">...</span>
            )}
          </div>
          
          {/* Nút Sau */}
          <button
            disabled={currentPage >= pagination.totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3.5 py-2 rounded-xl border border-white/5 bg-zinc-900/40 text-[10px] font-black text-zinc-400 disabled:opacity-10 disabled:pointer-events-none hover:text-white transition-all active:scale-95 whitespace-nowrap"
          >
            Sau →
          </button>

        </div>
      )}
    </main>
  );
}

// 2. COMPONENT CHA
export default function DanhSachPage() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white flex flex-col justify-between select-none antialiased">
      <Header sidebarCollapsed={true} onToggleSidebar={() => {}} />

      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center py-32 gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-red-600 animate-spin" />
          <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-black">Khởi tạo môi trường rạp phim...</span>
        </div>
      }>
        <DanhSachContent />
      </Suspense>

      <Footer />
    </div>
  );
}