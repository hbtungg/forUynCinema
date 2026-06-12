'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link'; 

export default function RelatedMovies({ allCategories, isEpo = false, actor = '', currentId = '', isSidebarMode = false }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // 🚀 NHÁNH 1: XỬ LÝ PHIM NGƯỜI LỚN (EPO) GIỮ NGUYÊN QUA SERVER ROUTE
        if (isEpo) {
          const url = `/api/related?isEpo=true&actor=${encodeURIComponent(actor)}`;
          const res = await fetch(url);
          const data = await res.json();
          if (data?.items) {
            const formatted = data.items
              .filter(v => String(v.id || v.slug) !== String(currentId))
              .map(v => ({
                ...v,
                thumb_url: v.default_thumb?.src,
                name: v.title,
                customHref: `/epo/watch/${v.id}`,
                quality: '4K'
              }));
            const sorted = formatted.sort(() => 0.5 - Math.random());
            setRelated(sorted.slice(0, isSidebarMode ? 5 : 8));
          }
          return;
        }

        // 🚀 NHÁNH 2: XỬ LÝ PHIM THƯỜNG (NGUỒNC) - BẮN TRỰC TIẾP TỪ BROWSER BYPASS CLOUDFLARE
        // 1. Phân tích tìm nhanh slug thể loại tự động từ dữ liệu Client bốc về
        let categorySlug = 'tinh-cam';
        if (allCategories) {
          try {
            // Check nếu là cấu trúc API bốc từ Client mới
            if (allCategories["3"]?.list?.[0]?.slug) {
              categorySlug = allCategories["3"].list[0].slug;
            } else if (Array.isArray(allCategories)) {
              // Dự phòng cấu trúc mảng phẳng
              categorySlug = allCategories[0]?.slug || 'tinh-cam';
            } else {
              const values = Object.values(allCategories);
              for (let val of values) {
                if (val?.list?.[0]?.slug) {
                  categorySlug = val.list[0].slug;
                  break;
                }
              }
            }
          } catch (e) { categorySlug = 'tinh-cam'; }
        }

        if (categorySlug === 'phim-le' || categorySlug === 'phim-bo') {
          categorySlug = 'tinh-cam'; // Fallback danh mục tránh lỗi bốc danh mục chung chung
        }

        // 2. Gọi thẳng hàm helper của Client cào qua API NguồnC (Không thông qua Server Vercel nữa!)
        const directUrl = `https://phim.nguonc.com/api/films/the-loai/${categorySlug}?page=1`;
        const response = await fetch(directUrl, { headers: { Accept: "application/json" } });
        
        if (response.ok) {
          const resData = await response.json();
          if (resData?.items) {
            const formatted = resData.items
              .filter(v => String(v.id || v.slug) !== String(currentId))
              .map(v => ({
                ...v,
                customHref: `/watch/${v.slug}`,
              }));

            // Đảo ngẫu nhiên danh sách bảo vệ lỗi Hydration
            const sorted = formatted.sort(() => 0.5 - Math.random());
            const limitCount = isSidebarMode ? 5 : 6;
            setRelated(sorted.slice(0, limitCount));
          }
        }
      } catch (err) {
        console.error("Lỗi cào dữ liệu đề xuất tại Client:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isEpo, actor, allCategories, currentId, isSidebarMode]);

  // ─── 🚀 GIAO DIỆN DẠNG LIST NGANG NHỎ GỌN TRÊN SIDEBAR BÊN PHẢI ───
  if (isSidebarMode) {
    if (loading) {
      return (
        <div className="space-y-3 px-1.5 py-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 w-full h-14 bg-zinc-900/30 rounded-xl animate-pulse border border-white/5" />
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1.5 px-1 py-0.5 w-full">
        {related.length > 0 && related.map((item) => (
          <Link 
            key={item.id || item.slug} 
            href={item.customHref}
            className="flex items-center gap-3 p-1.5 w-full rounded-xl hover:bg-white/[0.03] transition-all duration-300 border border-transparent hover:border-white/[0.02] group"
          >
            <div className="w-11 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-900 border border-white/[0.04] relative">
              <img 
                src={item.thumb_url} 
                alt="" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                onError={(e) => { e.target.src = item.poster_url; }} // Sửa lỗi rụng link ảnh của NguồnC
              />
              {item.quality && (
                <span className="absolute bottom-0.5 right-0.5 text-[7px] font-black tracking-tight px-1 py-0.2 bg-black/60 rounded text-zinc-400 border border-white/5 scale-90 origin-bottom-right">
                  {item.quality}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-[11px] font-bold text-zinc-300 truncate leading-tight group-hover:text-red-500 transition-colors uppercase tracking-wide">
                {item.name}
              </h4>
              <p className="text-[9px] text-zinc-600 font-medium tracking-normal mt-1 flex items-center gap-1.5">
                <span>{item.year || '2026'}</span>
                {item.episode && <span className="text-zinc-700">·</span>}
                {item.episode && <span className="text-red-500/80 font-bold">Tập {item.episode}</span>}
              </p>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  // ─── 🚀 GIAO DIỆN Ô CARD DÀN NGANG TO ĐỒNG BỘ DƯỚI ĐÁY TRANG ───
  return (
    <div className="mt-16 border-t border-zinc-900/30 pt-10 pb-16 w-full">
      <div className="flex items-center gap-4 mb-8 px-1">
        <div className={`w-1.5 h-6 ${isEpo ? 'bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]'} rounded-full`}></div>
        <h2 className="text-base md:text-lg font-black uppercase tracking-widest text-zinc-400 italic">
          {isEpo && actor ? `PHIM CỦA DIỄN VIÊN: ${actor}` : "CHẮC LÀ EM THÍCH"}
        </h2>
      </div>

      {loading ? (
        <div className={`grid gap-5 px-1 ${
          isEpo ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
        }`}>
          {[...Array(isEpo ? 4 : 6)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-zinc-900/40 rounded-[2rem] animate-pulse border border-zinc-800"></div>
          ))}
        </div>
      ) : (
        <div className={`grid gap-5 px-1 ${
          isEpo ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
        }`}>
          {related.length > 0 && related.map((item) => {
            const MovieCard = require('./MovieCard').default; 
            return (
              <div key={item.id || item.slug} className="hover:translate-y-[-6px] transition-all duration-500">
                <MovieCard movie={item} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}