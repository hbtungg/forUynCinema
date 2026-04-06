'use client';
import { useState, useEffect } from 'react';

export default function FavoriteButton({ phim }) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Kiểm tra xem phim đã có trong danh sách yêu thích chưa
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some(item => item.slug === phim.slug));
  }, [phim.slug]);

  const toggleFavorite = (e) => {
    e.preventDefault(); // Ngăn không cho nó nhảy vào trang xem phim khi bấm tim
    e.stopPropagation();

    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Xóa khỏi yêu thích
      favorites = favorites.filter(item => item.slug !== phim.slug);
    } else {
      // Thêm vào yêu thích (lưu cả ảnh và tên để hiển thị)
      favorites.push({
        slug: phim.slug,
        name: phim.name,
        thumb_url: phim.thumb_url
      });
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
    // Gửi sự kiện để các phần khác trên trang cập nhật theo
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  // src/components/FavoriteButton.js
return (
  <button 
    onClick={toggleFavorite}
    className={`flex items-center justify-center gap-2 w-[110px] py-2.5 rounded-full text-[10px] font-black uppercase transition-all duration-300 transform active:scale-90 ${
      isFavorite 
      ? 'bg-white text-red-600 shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
      : 'bg-zinc-800/90 text-white hover:bg-zinc-700'
    }`}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
    <span>{isFavorite ? 'Đã thích' : 'Yêu thích'}</span>
  </button>
);
}