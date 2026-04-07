'use client';
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function FavoriteButton({ phim }) {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      const storageKey = `favs_${session.user.email}`;
      const localFavs = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setIsFavorite(localFavs.some(f => f.slug === phim.slug));
    }
  }, [phim.slug, session]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    if (!session) return alert("Em iu log in mới thả tim được nhó");

    const storageKey = `favs_${session.user.email}`;
    const method = isFavorite ? 'DELETE' : 'POST';
    const body = isFavorite 
      ? { slug: phim.slug, userEmail: session.user.email } 
      : { movie: phim, userEmail: session.user.email };

    // 1. Cập nhật giao diện & LocalStorage ngay lập tức (Ưu tiên tốc độ)
    let localFavs = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (isFavorite) {
      localFavs = localFavs.filter(f => f.slug !== phim.slug);
    } else {
      localFavs = [phim, ...localFavs];
    }
    localStorage.setItem(storageKey, JSON.stringify(localFavs));
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new Event('favoritesUpdated'));

    // 2. Gửi lên Database lẳng lặng đằng sau
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

  return (
    <button onClick={toggleFavorite} className={`group/btn flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all active:scale-90 ${isFavorite ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-black/40 border-white/20 text-white'}`}>
      <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
      <span className="text-[9px] font-black uppercase">{isFavorite ? "Đã thích" : "Yêu thích"}</span>
    </button>
  );
}