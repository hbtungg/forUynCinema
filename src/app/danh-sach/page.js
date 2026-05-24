'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DanhSachPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 🚀 ĐÃ ĐỒNG BỘ: Lấy danh mục từ tham số URL, mặc định ban đầu là 'phim-moi-cap-nhat'
  const currentCategory = searchParams.get('type') || 'phim-moi-cap-nhat';
  const currentPage = Number(searchParams.get('page')) || 1;

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  // 🚀 ĐÃ CẬP NHẬT: Định nghĩa các danh mục chuẩn chỉnh khớp với hệ thống slug của API Nguồn C
  const categories = [
    { id: 'phim-moi-cap-nhat', label: 'Mới cập nhật', isStatic: true },
    { id: 'phim-le', label: 'Phim Lẻ', isStatic: false },
    { id: 'phim-bo', label: 'Phim Bộ', isStatic: false },
    { id: 'hoat-hinh', label: 'Hoạt Hình', isStatic: false },
    { id: 'phim-dang-chieu', label: 'Phim Đang Chiếu', isStatic: false },
  ];

  // Hàm gọi API động dựa theo cấu trúc anh cung cấp
  const fetchMoviesData = async (category, page = 1) => {
    setLoading(true);
    try {
      let apiUrl = '';
      
      // 🚀 CHÈN ĐÚNG URL API THỰC TẾ CỦA ANH
      if (category === 'phim-moi-cap-nhat') {
        apiUrl = `https://phim.nguonc.com/api/films/phim-moi-cap-nhat?page=${page}`;
      } else {
        apiUrl = `https://phim.nguonc.com/api/films/danh-sach/${category}?page=${page}`;
      }

      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = await res.json();
        
        // Cấu trúc trả về của Nguồn C thường nằm trong data.items hoặc items trực tiếp
        const items = data.items || data.data?.items || [];
        setMovies(items);
        
        // Đọc thông tin phân trang từ API Nguồn C để tính toán số trang
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

  // Tự động kích hoạt gọi API tải phim mỗi khi URL thay đổi tham số
  useEffect(() => {
    fetchMoviesData(currentCategory, currentPage);
  }, [currentCategory, currentPage]);

  // Điều hướng mượt mà khi người dùng nhấn chọn Tab danh mục khác
  const handleCategoryChange = (categoryId) => {
    router.push(`/danh-sach?type=${categoryId}&page=1`);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] text-white px-6 py-8 md:px-12 select-none antialiased">
      
      {/* ── TIÊU ĐỀ & THANH ĐIỀU HƯỚNG TÙY CHỌN ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/[0.03] pb-6 mb-8">
        <div>
          <h1 className="text-xl font-black uppercase tracking-widest text-white italic">
            Danh Mục Điện Ảnh
          </h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1">
            Hệ thống rạp phim thông minh • forUynCinema
          </p>
        </div>

        {/* Cụm Tabs chọn danh mục kính mờ Premium */}
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
          <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-black tracking-widest">Đang đồng bộ dữ liệu...</span>
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {movies.map((movie) => (
            <Link
              key={movie.slug}
              href={`/watch/${movie.slug}`}
              className="group flex flex-col bg-[#111114]/20 border border-white/[0.02] hover:border-white/10 rounded-2xl overflow-hidden transition-all duration-300"
            >
              {/* Tỷ lệ ảnh chân dung chuẩn rạp phim */}
              <div className="aspect-[2/3] w-full bg-zinc-950 relative overflow-hidden">
                <img
                  src={movie.thumb_url || movie.poster_url}
                  alt={movie.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-90" />
              </div>
              
              {/* Chân chữ thông tin phim bên dưới ảnh */}
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

      {/* ── THANH ĐIỀU HƯỚNG PHÂN TRANG (PAGINATION) ── */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-16 pt-6 border-t border-white/[0.02]">
          <button
            disabled={currentPage <= 1}
            onClick={() => router.push(`/danh-sach?type=${currentCategory}&page=${currentPage - 1}`)}
            className="px-4 py-2 rounded-xl border border-white/5 bg-zinc-900/40 text-[10px] font-black text-zinc-400 disabled:opacity-20 disabled:pointer-events-none hover:text-white transition-all active:scale-95"
          >
            Trước
          </button>
          
          <span className="text-[10px] font-black tabular-nums text-zinc-500 px-3 py-1.5 bg-[#111114] border border-white/5 rounded-xl">
            {currentPage} / {pagination.totalPages}
          </span>
          
          <button
            disabled={currentPage >= pagination.totalPages}
            onClick={() => router.push(`/danh-sach?type=${currentCategory}&page=${currentPage + 1}`)}
            className="px-4 py-2 rounded-xl border border-white/5 bg-zinc-900/40 text-[10px] font-black text-zinc-400 disabled:opacity-20 disabled:pointer-events-none hover:text-white transition-all active:scale-95"
          >
            Sau
          </button>
        </div>
      )}
      <Footer />
    </div>
  );
}