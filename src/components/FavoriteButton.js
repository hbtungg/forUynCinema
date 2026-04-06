'use client';
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function FavoriteButton({ phim }) {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);

  // Kiểm tra xem phim này đã có trong database chưa
  useEffect(() => {
    if (session) {
      // Ở đây tạm thời check LocalStorage cho nhanh, hoặc anh fetch từ API list cũng được
      const favs = JSON.parse(localStorage.getItem('fav_movies') || '[]');
      setIsFavorite(favs.some(f => f.slug === phim.slug));
    }
  }, [phim.slug, session]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    if (!session) return alert("Anh yêu đăng nhập mới lưu được tim nhé! ❤️");

    const method = isFavorite ? 'DELETE' : 'POST';
    const body = isFavorite ? { slug: phim.slug } : { movie: phim };

    try {
      const res = await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setIsFavorite(!isFavorite);
        // Cập nhật thêm local để giao diện mượt mà
        let favs = JSON.parse(localStorage.getItem('fav_movies') || '[]');
        if (isFavorite) favs = favs.filter(f => f.slug !== phim.slug);
        else favs.push(phim);
        localStorage.setItem('fav_movies', JSON.stringify(favs));
        window.dispatchEvent(new Event('favoriteUpdated'));
      }
    } catch (err) {
      console.error("Lỗi lưu tim rồi anh yêu:", err);
    }
  };

  return (
    <button 
      onClick={toggleFavorite}
      className={`group/btn relative flex items-center justify-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 active:scale-90
        ${isFavorite 
          ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
          : 'bg-black/40 border-white/20 text-white hover:border-red-600 hover:bg-red-600/20'}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" 
        className={`w-4 h-4 transition-transform duration-500 ${isFavorite ? 'scale-125' : 'group-hover/btn:scale-110'}`} 
        fill={isFavorite ? "currentColor" : "none"} 
        viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span className="text-[9px] font-black uppercase tracking-widest leading-none">
        {isFavorite ? "Đã thích" : "Yêu thích"}
      </span>
    </button>
  );
}