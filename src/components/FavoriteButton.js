'use client';
import { useSession } from "next-auth/react";
import { useMemo } from "react"; // 🚀 ĐÃ THÊM: Dùng useMemo thay thế hoàn toàn useEffect để check trạng thái

export default function FavoriteButton({ phim, compact = false }) {
  const { data: session, status } = useSession();

  // 🚀 ĐÃ TỐI ƯU TRIỆT ĐỂ: Tính toán trạng thái trực tiếp trong lúc render, không dùng State & Effect đồng bộ nữa!
  const isFavorite = useMemo(() => {
    // Nếu chưa đăng nhập thành công hoặc đang chạy Server, mặc định là false
    if (status !== "authenticated" || !session?.user?.email || typeof window === 'undefined') {
      return false;
    }

    try {
      const storageKey = `favs_${session.user.email}`;
      const localFavs = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return localFavs.some(f => (
        (phim.canonicalKey && f.canonicalKey === phim.canonicalKey) ||
        f.slug === phim.slug
      ));
    } catch (e) {
      console.error("Lỗi đọc trạng thái yêu thích từ LocalStorage:", e);
      return false;
    }
  }, [phim.slug, session, status]); // Tự động tính toán lại khi chuyển phim hoặc đổi tài khoản

  // Luồng xử lý khi người dùng chủ động click thả tim / bỏ thả tim
  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session) return alert("Em iu log in mới thả tim được nhó");

    const storageKey = `favs_${session.user.email}`;
    
    // Đọc danh sách hiện tại ra để xử lý ghi đè
    let localFavs = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const isSameMovie = (f) => (
      (phim.canonicalKey && f.canonicalKey === phim.canonicalKey) ||
      f.slug === phim.slug
    );
    const isCurrentlyFav = localFavs.some(isSameMovie);
    
    const method = isCurrentlyFav ? 'DELETE' : 'POST';
    const body = isCurrentlyFav 
      ? { slug: phim.slug, canonicalKey: phim.canonicalKey, userEmail: session.user.email } 
      : { movie: phim, userEmail: session.user.email };

    if (isCurrentlyFav) {
      localFavs = localFavs.filter(f => !isSameMovie(f));
    } else {
      localFavs = [phim, ...localFavs];
    }
    
    // Ghi lại vào LocalStorage - Lúc này useMemo ở trên sẽ tự động ăn theo dữ liệu mới và render lại mượt mà!
    localStorage.setItem(storageKey, JSON.stringify(localFavs));
    
    // Bắn sự kiện thông báo cho toàn hệ thống (như RightPanel) đồng bộ theo
    window.dispatchEvent(new Event('favoritesUpdated'));

    // Lặng lẽ đồng bộ lên database MongoDB Atlas đằng sau hậu trường
    try {
      await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (err) {
      console.error("Lỗi đồng bộ mây:", err);
    }
  };

  // ── TRẠNG THÁI 1: GIAO DIỆN COMPACT (DÙNG CHO MOVIE CARD) ──
  if (compact) {
    return (
      <button 
        type="button"
        onClick={toggleFavorite} 
        className={`w-full h-full flex items-center justify-center transition-transform active:scale-75 ${
          isFavorite ? 'text-neutral-300' : 'text-zinc-400 hover:text-white'
        }`}
      >
        <svg className="w-4 h-4 transition-colors" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    );
  }

  // ── TRẠNG THÁI 2: GIAO DIỆN NÚT TO NGUYÊN BẢN (DÙNG CHO TRANG CHI TIẾT) ──
  return (
    <button 
      type="button"
      onClick={toggleFavorite} 
      className={`group/btn flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all active:scale-90 ${
        isFavorite 
          ? 'bg-neutral-700 border-neutral-600 text-white ' 
          : 'bg-black/40 border-white/20 text-white'
      }`}
    >
      <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span className="text-[9px] font-semibold uppercase">{isFavorite ? "Đã thích" : "Yêu thích"}</span>
    </button>
  );
}
