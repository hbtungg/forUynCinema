'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link'; // 🚀 Dùng Link của Next.js để chuyển trang mượt mà

export default function RelatedMovies({ allCategories, isEpo = false, actor = '', currentId = '', isSidebarMode = false }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        let url = '';
        if (isEpo) {
          url = `/api/related?isEpo=true&actor=${encodeURIComponent(actor)}`;
        } else {
          const getSafeSlug = () => {
            if (!allCategories) return 'tinh-cam';
            try {
              if (allCategories['3']?.list?.[0]?.slug) {
                const s = allCategories['3'].list[0].slug;
                if (s !== 'phim-le' && s !== 'phim-bo') return s;
              }
              const values = Object.values(allCategories);
              for (let val of values) {
                if (val?.list?.[0]?.slug) {
                  const s = val.list[0].slug;
                  if (s !== 'phim-le' && s !== 'phim-bo') return s;
                }
              }
            } catch (e) { return 'tinh-cam'; }
            return 'tinh-cam';
          };
          url = `/api/related?slug=${getSafeSlug()}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        
        if (data?.items) {
          const formatted = data.items
            .filter(v => (v.id || v.slug) !== currentId)
            .map(v => ({
              ...v,
              thumb_url: isEpo ? v.default_thumb?.src : v.thumb_url,
              name: isEpo ? v.title : v.name,
              customHref: isEpo ? `/epo/watch/${v.id}` : (v.customHref || `/watch/${v.slug}`),
              quality: isEpo ? '4K' : v.quality
            }));

          // Xử lý đảo ngẫu nhiên an toàn ở Client bảo vệ lỗi Hydration
          const sorted = formatted.sort(() => 0.5 - Math.random());

          // Ở thanh bên phải dọc lấy 5 phim là vừa vặn khung hình nhìn rất sang
          const limitCount = isSidebarMode ? 5 : (isEpo ? 8 : 6);
          setRelated(sorted.slice(0, limitCount));
        }
      } catch (err) {
        console.error("Lỗi đề xuất:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isEpo, actor, allCategories, currentId, isSidebarMode]);

  // ─── 🚀 THIẾT LẬP 1: GIAO DIỆN DẠNG LIST NGANG NHỎ GỌN TRÊN SIDEBAR BÊN PHẢI ───
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
            {/* Thumbnail nho nhỏ bo góc */}
            <div className="w-11 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-900 border border-white/[0.04] relative">
              <img 
                src={item.thumb_url} 
                alt="" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              {item.quality && (
                <span className="absolute bottom-0.5 right-0.5 text-[7px] font-black tracking-tight px-1 py-0.2 bg-black/60 rounded text-zinc-400 border border-white/5 scale-90 origin-bottom-right">
                  {item.quality}
                </span>
              )}
            </div>

            {/* Thông tin chữ xếp bên cạnh ảnh */}
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

  // ─── 🚀 THIẾT LẬP 2: GIAO DIỆN Ô CARD DÀN NGANG TO ĐỒNG BỘ DƯỚI ĐÁY TRANG ───
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
            // Nhánh fallback hiển thị Card to nguyên bản của anh dưới đáy trang
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