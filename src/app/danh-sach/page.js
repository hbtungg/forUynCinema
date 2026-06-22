'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Import hệ thống linh kiện điều hướng và MovieCard chuẩn của anh
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MovieCard from '@/components/MovieCard';
import { getMovieList } from '@/lib/clientMovies';

// 1. LINH KIỆN CON: Chứa toàn bộ logic xử lý dữ liệu danh sách phim
function DanhSachContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // State điều phối trạng thái đóng/mở của Menu Dropdown
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Lấy danh mục từ tham số URL, mặc định ban đầu là 'phim-moi-cap-nhat'
  const currentCategory = searchParams.get('type') || 'phim-moi-cap-nhat';
  const currentPage = Number(searchParams.get('page')) || 1;

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  // Hệ thống 13 danh mục đầy đủ của anh
  const categories = [
    { id: 'phim-moi-cap-nhat', label: 'Mới cập nhật' },
    { id: 'phim-le', label: 'Phim Lẻ' },
    { id: 'phim-bo', label: 'Phim Bộ' },
    { id: 'han-quoc', label: 'Phim Hàn Quốc' },
    { id: 'trung-quoc', label: 'Phim Trung Quốc' },
    { id: 'hanh-dong', label: 'Hành động' },
    { id: 'kinh-di', label: 'Kinh dị' },
    { id: 'tam-ly', label: 'Tâm lý' },
    { id: 'vien-tuong', label: 'Viễn tưởng' },
    { id: 'hinh-su', label: 'Hình sự' },
    { id: 'tinh-cam', label: 'Tình cảm' },
    { id: 'hoat-hinh', label: 'Hoạt hình' },
    { id: 'tai-lieu', label: 'Tài liệu' },
  ];

  // Helper tìm nhanh tên nhãn hiện tại phục vụ hiển thị tiêu đề động
  const getActiveCategoryLabel = () => {
    const activeCat = categories.find(cat => cat.id === currentCategory);
    return activeCat ? activeCat.label : 'Điện ảnh';
  };

  // Luồng đổi tên Tab tự động bao quát toàn bộ danh mục dưới Client, sạch bóng cảnh báo ESLint
  useEffect(() => {
    const localCategories = [
      { id: 'phim-moi-cap-nhat', label: 'Mới cập nhật' },
      { id: 'phim-le', label: 'Phim Lẻ' },
      { id: 'phim-bo', label: 'Phim Bộ' },
      { id: 'han-quoc', label: 'Phim Hàn Quốc' },
      { id: 'trung-quoc', label: 'Phim Trung Quốc' },
      { id: 'hanh-dong', label: 'Hành động' },
      { id: 'kinh-di', label: 'Kinh dị' },
      { id: 'tam-ly', label: 'Tâm lý' },
      { id: 'vien-tuong', label: 'Viễn tưởng' },
      { id: 'hinh-su', label: 'Hình sự' },
      { id: 'tinh-cam', label: 'Tình cảm' },
      { id: 'hoat-hinh', label: 'Hoạt hình' },
      { id: 'tai-lieu', label: 'Tài liệu' },
    ];
    const activeCat = localCategories.find(cat => cat.id === currentCategory);
    const categoryLabel = activeCat ? activeCat.label : 'Danh mục';
    document.title = `${categoryLabel} - Uynflix`;
  }, [currentCategory]);

  // Tự động đóng dropdown nếu người dùng click trượt ra ngoài vùng menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchMoviesData = async (category, page = 1) => {
    setLoading(true);
    try {
      const providerData = await getMovieList(category, page);
      const providerItems = providerData.items || providerData.data?.items || [];
      setMovies(providerItems);

      const providerMeta = providerData.paginate || providerData.pagination || {};
      setPagination({
        currentPage: providerMeta.current_page || page,
        totalPages: providerMeta.total_pages || providerMeta.total_page || 1,
      });
      return;

      let apiUrl = '';
      if (category === 'phim-moi-cap-nhat') {
        apiUrl = `https://phim.nguonc.com/api/films/phim-moi-cap-nhat?page=${page}`;
      } else if (category === 'han-quoc' || category === 'trung-quoc') {
        apiUrl = `https://phim.nguonc.com/api/films/quoc-gia/${category}?page=${page}`;
      } else if (
        ['hanh-dong', 'kinh-di', 'tam-ly', 'vien-tuong', 'hinh-su', 'tinh-cam', 'hoat-hinh', 'tai-lieu'].includes(category)
      ) {
        apiUrl = `https://phim.nguonc.com/api/films/the-loai/${category}?page=${page}`;
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
    setIsOpen(false); // Đóng ngay dropdown sau khi lựa chọn xong
    router.push(`/danh-sach?type=${categoryId}&page=1`);
    fetchMoviesData(categoryId, 1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    router.push(`/danh-sach?type=${currentCategory}&page=${newPage}`);
    fetchMoviesData(currentCategory, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPageNumbers = () => {
    const total = pagination.totalPages;
    const current = currentPage;
    const pages = [];

    let startPage = Math.max(1, current - 2);
    let endPage = Math.min(total, current + 2);

    if (current <= 3) endPage = Math.min(total, 5);
    if (current > total - 2) startPage = Math.max(1, total - 4);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <main className="flex-1 w-full px-6 pt-12 md:px-12 max-w-7xl mx-auto flex flex-col items-center">
      
      {/* ── KHU VỰC HEADER TỐI GIẢN KÈM DROPDOWN PHẲNG MỊN ── */}
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/[0.03] pb-8 relative">
        
        {/* Tiêu đề & Nút quay lại nằm đồng trục dọc bên trái */}
        <div className="space-y-4 text-left">
          <div className="space-y-1">
            <p className="text-red-600 font-black uppercase tracking-[0.45em] text-[9px]">
              Premium Categories
            </p>
            <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
              Danh mục: <span className="text-red-600">{getActiveCategoryLabel()}</span>
            </h1>
          </div>
          
          <div>
            <Link 
              href="/home" 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all group flex items-center gap-1.5 w-fit"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay về trang chủ
            </Link>
          </div>
        </div>

        {/* 🚀 ĐÃ SỬA: Bộ cấu trúc Menu Dropdown phẳng lỳ cao cấp thay thế cho thanh trượt ngang lỗi */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-5 py-3 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.04] text-[11px] font-black uppercase tracking-widest text-zinc-300 hover:text-white transition-all flex items-center gap-3 min-w-[180px] justify-between active:scale-95"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <span>Chọn thể loại</span>
            <span className={`text-[9px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {/* Hộp kén danh sách thả xuống dạng kính mờ mượt mà */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0e0e11]/95 border border-white/[0.06] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-50 p-2 grid grid-cols-1 max-h-[360px] overflow-y-auto custom-scrollbar animate-fade-in">
              {categories.map((cat) => {
                const isSelected = currentCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all ${
                      isSelected 
                        ? 'bg-red-600 text-white font-black' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                    }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* ── LƯỚI KHUNG HIỂN THỊ POSTER PHIM CAO CẤP ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-3">
          <div className="w-6 h-6 border-2 border-zinc-800 border-t-red-600 rounded-full animate-spin" />
          <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-black">Đang đồng bộ dữ liệu...</span>
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6 w-full max-w-[1120px] mx-auto animate-fade-in">
          {movies.map((movie) => (
            <MovieCard key={movie.slug} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 text-[10px] text-zinc-600 font-black uppercase tracking-widest">
          Không tìm thấy nội dung nào trong danh mục này. 🎬
        </div>
      )}

      {/* ── HỆ THỐNG PHÂN TRANG SỐ PREMIUM ── */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-20 pt-6 border-t border-white/[0.02] w-full">
          <button
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 rounded-xl border border-white/5 bg-zinc-900/40 text-[10px] font-black text-zinc-500 disabled:opacity-10 disabled:pointer-events-none hover:text-white transition-all active:scale-95 whitespace-nowrap uppercase tracking-wider"
          >
            ← Trước
          </button>
          
          <div className="flex items-center gap-1.5">
            {currentPage > 3 && pagination.totalPages > 5 && (
              <span className="text-[10px] text-zinc-700 font-bold px-1">...</span>
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
                      : 'border border-white/5 bg-zinc-900/20 text-zinc-500 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  {num}
                </button>
              );
            })}

            {currentPage < pagination.totalPages - 2 && pagination.totalPages > 5 && (
              <span className="text-[10px] text-zinc-700 font-bold px-1">...</span>
            )}
          </div>
          
          <button
            disabled={currentPage >= pagination.totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 rounded-xl border border-white/5 bg-zinc-900/40 text-[10px] font-black text-zinc-500 disabled:opacity-10 disabled:pointer-events-none hover:text-white transition-all active:scale-95 whitespace-nowrap uppercase tracking-wider"
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
        <div className="flex-1 flex flex-col items-center justify-center py-40 gap-3">
          <div className="w-6 h-6 border-2 border-zinc-800 border-t-red-600 rounded-full animate-spin" />
          <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-black">Khởi tạo môi trường rạp phim...</span>
        </div>
      }>
        <DanhSachContent />
      </Suspense>

      <Footer />
    </div>
  );
}
