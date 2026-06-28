'use client';

import { useState, useEffect, Suspense, useRef, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, Loader2 } from 'lucide-react';

// Import MovieCard và hàm fetch API gốc của dự án anh
import MovieCard from '@/components/MovieCard';
import { getMovieList } from '@/lib/clientMovies';

// 1. LINH KIỆN CON: Chứa toàn bộ logic xử lý dữ liệu danh sách phim
function DanhSachContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // State điều phối trạng thái đóng/mở của Menu Dropdown thể loại
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Lấy danh mục từ tham số URL, mặc định ban đầu là 'phim-moi-cap-nhat'
  const currentCategory = searchParams.get('type') || 'phim-moi-cap-nhat';
  const currentPage = Number(searchParams.get('page')) || 1;

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  // Hệ thống danh mục chuẩn của hệ thống
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

  // Tìm nhanh tên nhãn phục vụ hiển thị tiêu đề động
  const getActiveCategoryLabel = () => {
    const activeCat = categories.find(cat => cat.id === currentCategory);
    return activeCat ? activeCat.label : 'Điện ảnh';
  };

  // Đổi tên Tab trình duyệt tự động bao quát toàn bộ danh mục dưới Client
  useEffect(() => {
    const activeCat = categories.find(cat => cat.id === currentCategory);
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
    } catch (error) {
      console.error('Lỗi kết nối API Nguồn C tại trang Danh Sách:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoviesData(currentCategory, currentPage);
  }, [currentCategory, currentPage]);

  const handleCategoryChange = (categoryId) => {
    setIsOpen(false);
    router.push(`/danh-sach?type=${categoryId}&page=1`);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    router.push(`/danh-sach?type=${currentCategory}&page=${newPage}`);
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
    <div className="w-full flex flex-col items-center select-none bg-transparent text-[#e8e1da]">
      
      {/* ── KHU VỰC HEADER TỐI GIẢN KÈM DROPDOWN PHẲNG MỊN VÀNG MOONLIGHT ── */}
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8 relative">
        
        {/* Tiêu đề & Nút quay lại nằm đồng trục dọc bên trái */}
        <div className="space-y-4 text-left">
          <div className="space-y-1">
            <p className="text-[#E6C687] font-bold uppercase tracking-[0.4em] text-[9px]">
              Premium Categories
            </p>
            <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider leading-none">
              Danh mục: <span className="text-[#ffe3ae]" style={{ textShadow: '0 0 10px rgba(255,227,174,0.35)' }}>{getActiveCategoryLabel()}</span>
            </h1>
          </div>
          
          <div>
            <Link 
              href="/home" 
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d0c5b5]/40 hover:text-[#ffe3ae] transition-colors flex items-center gap-2 w-fit group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Quay về trang chủ
            </Link>
          </div>
        </div>

        {/* Bộ cấu trúc Menu Dropdown kính mờ pha lê cao cấp */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-5 py-2.5 rounded-xl bg-[#0F1326]/40 hover:bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-widest text-[#d0c5b5] hover:text-[#ffe3ae] transition-all flex items-center gap-3 min-w-[190px] justify-between active:scale-95 focus:outline-none"
          >
            <span>Chọn thể loại</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Hộp kén danh sách thả xuống dạng kính mờ mượt mà */}
          {isOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-[#0F1326]/95 border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-50 p-1.5 grid grid-cols-1 max-h-[360px] overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
              {categories.map((cat) => {
                const isSelected = currentCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`w-full text-left px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all ${
                      isSelected 
                        ? 'bg-[#E6C687]/10 text-[#ffe3ae] border border-[#E6C687]/20 shadow-[0_0_10px_rgba(230,198,135,0.15)] font-bold' 
                        : 'text-[#d0c5b5]/60 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
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
          <Loader2 className="w-6 h-6 border-2 border-[#E6C687]/20 border-t-[#E6C687] rounded-full animate-spin text-[#E6C687]" />
          <span className="text-[9px] uppercase tracking-widest text-[#d0c5b5]/40 font-bold">Đang đồng bộ tinh hệ dữ liệu...</span>
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 w-full animate-in fade-in duration-500">
          {movies.map((movie) => (
            <div key={movie.slug}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 text-[10px] text-[#d0c5b5]/30 font-bold uppercase tracking-widest">
          Không tìm thấy nội dung nào trong danh mục này. 🎬
        </div>
      )}

      {/* ── HỆ THỐNG PHÂN TRANG SỐ PREMIUM KÍNH MỜ ── */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-20 pt-6 border-t border-white/5 w-full">
          <button
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 rounded-xl border border-white/10 bg-[#0F1326]/60 text-[10px] font-bold text-[#d0c5b5]/60 disabled:opacity-10 disabled:pointer-events-none hover:text-[#ffe3ae] transition-all duration-300 active:scale-95 whitespace-nowrap uppercase tracking-wider"
          >
            ← Trước
          </button>
          
          <div className="flex items-center gap-1.5">
            {currentPage > 3 && pagination.totalPages > 5 && (
              <span className="text-[10px] text-[#d0c5b5]/20 font-bold px-1">...</span>
            )}

            {renderPageNumbers().map((num) => {
              const isActive = num === currentPage;
              return (
                <button
                  key={num}
                  onClick={() => handlePageChange(num)}
                  className={`w-8 h-8 rounded-xl text-[10px] font-bold font-mono transition-all duration-200 active:scale-90 ${
                    isActive
                      ? 'bg-[#0F1326]/80 text-[#ffe3ae] border border-[#E6C687]/40 shadow-[0_0_12px_rgba(230,198,135,0.25)]'
                      : 'border border-white/5 bg-[#0F1326]/20 text-[#d0c5b5]/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {num}
                </button>
              );
            })}

            {currentPage < pagination.totalPages - 2 && pagination.totalPages > 5 && (
              <span className="text-[10px] text-[#d0c5b5]/20 font-bold px-1">...</span>
            )}
          </div>
          
          <button
            disabled={currentPage >= pagination.totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 rounded-xl border border-white/10 bg-[#0F1326]/60 text-[10px] font-bold text-[#d0c5b5]/60 disabled:opacity-10 disabled:pointer-events-none hover:text-[#ffe3ae] transition-all duration-300 active:scale-95 whitespace-nowrap uppercase tracking-wider"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}

// 2. COMPONENT CHA (Gỡ Header/Footer thừa để nhường quyền bao phủ trọn vẹn cho layout.js)
export default function DanhSachPage({ searchParams }) {
  const sParams = use(searchParams);

  return (
    <Suspense fallback={
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 border-2 border-[#E6C687]/20 border-t-[#E6C687] rounded-full animate-spin text-[#E6C687]" />
        <span className="text-[9px] uppercase tracking-widest text-[#d0c5b5]/40 font-bold">Khởi tạo môi trường danh mục...</span>
      </div>
    }>
      <DanhSachContent />
    </Suspense>
  );
}