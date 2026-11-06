'use client';
import { useSession } from "next-auth/react";
import { useSyncExternalStore } from "react";

function subscribe(listener) {
  window.addEventListener("favoritesUpdated", listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener("favoritesUpdated", listener);
    window.removeEventListener("storage", listener);
  };
}

export default function FavoriteButton({ phim, compact = false }) {
  const { data: session, status } = useSession();

  const isFavorite = useSyncExternalStore(subscribe, () => {
    if (status !== "authenticated" || !session?.user?.email) return false;
    try {
      const favorites = JSON.parse(localStorage.getItem(`favs_${session.user.email}`) || '[]');
      return favorites.some(movie => (
        (phim.canonicalKey && movie.canonicalKey === phim.canonicalKey) || movie.slug === phim.slug
      ));
    } catch {
      return false;
    }
  }, () => false);

  // Luồng xử lý khi người dùng chủ động click thả tim / bỏ thả tim
  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session) return alert("Em iu log in mới thả tim được nhó");

    const storageKey = `favs_${session.user.email}`;
    
    // Đọc danh sách hiện tại ra để xử lý ghi đè
    let localFavs;
    try {
      localFavs = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (!Array.isArray(localFavs)) localFavs = [];
    } catch {
      localFavs = [];
    }
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
    
    try { localStorage.setItem(storageKey, JSON.stringify(localFavs)); } catch {}
    
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
        aria-label="Yêu thích"
        aria-pressed={isFavorite}
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
      aria-pressed={isFavorite}
      onClick={toggleFavorite} 
      className={`group/btn flex min-h-11 items-center gap-2 px-4 py-2 rounded-full border-2 transition-all active:scale-90 ${
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
