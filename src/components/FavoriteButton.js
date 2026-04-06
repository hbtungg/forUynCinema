'use client';
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function FavoriteButton({ phim }) {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (session?.user?.email) {
        const res = await fetch(`/api/favorites?userEmail=${session.user.email}`);
        if (res.ok) {
          const data = await res.json();
          setIsFavorite(data.some(f => f.slug === phim.slug));
        }
      }
    };
    checkFavorite();
  }, [phim.slug, session]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    if (!session) return alert("Anh yêu đăng nhập mới lưu được tim nhé! ❤️");

    const method = isFavorite ? 'DELETE' : 'POST';
    const body = isFavorite 
      ? { slug: phim.slug, userEmail: session.user.email } 
      : { movie: phim, userEmail: session.user.email };

    try {
      const res = await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setIsFavorite(!isFavorite);
        window.dispatchEvent(new Event('favoritesUpdated'));
      }
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };

  return (
    <button onClick={toggleFavorite} className={`group/btn flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${isFavorite ? 'bg-red-600 border-red-500 text-white' : 'bg-black/40 border-white/20 text-white'}`}>
      <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
      <span className="text-[9px] font-black uppercase">{isFavorite ? "Đã thích" : "Yêu thích"}</span>
    </button>
  );
}