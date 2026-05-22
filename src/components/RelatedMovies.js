'use client';
import { useEffect, useState } from 'react';
import MovieCard from './MovieCard';

export default function RelatedMovies({ allCategories, isEpo = false, actor = '', currentId = '' }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        let url = '';
        if (isEpo) {
          url = `/api/related?isEpo=true&actor=${encodeURIComponent(actor)}&_t=${Date.now()}`;
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
          url = `/api/related?slug=${getSafeSlug()}&_t=${Date.now()}`;
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
              customHref: isEpo ? `/epo/watch/${v.id}` : null,
              quality: isEpo ? '4K' : v.quality
            }));

          // LOGIC PHÂN TÁCH SỐ LƯỢNG: EPO lấy 8 phim, Phim thường lấy 6 phim
          const limitCount = isEpo ? 8 : 6;
          setRelated(formatted.sort(() => Math.random() - 0.5).slice(0, limitCount));
        }
      } catch (err) {
        console.error("Lỗi đề xuất:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isEpo, actor, allCategories, currentId]);

  return (
    // Đồng bộ khoảng cách đệm nhẹ nhàng hơn cho trang Watch
    <div className="mt-16 border-t border-zinc-900/30 pt-10 pb-16 w-full">
      <div className="flex items-center gap-4 mb-8 px-1">
        {/* Thanh dọc đổi màu theo loại phim */}
        <div className={`w-1.5 h-6 ${isEpo ? 'bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]'} rounded-full`}></div>
        <h2 className="text-base md:text-lg font-black uppercase tracking-widest text-zinc-400 italic">
          {isEpo && actor ? `PHIM CỦA DIỄN VIÊN: ${actor}` : "CHẮC LÀ EM THÍCH"}
        </h2>
      </div>

      {loading ? (
        <div className={`grid gap-5 px-1 ${
          isEpo 
            ? 'grid-cols-2 md:grid-cols-4' 
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
        }`}>
          {[...Array(isEpo ? 4 : 6)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-zinc-900/40 rounded-[2rem] animate-pulse border border-zinc-800"></div>
          ))}
        </div>
      ) : (
        // LOGIC PHÂN TÁCH GRID COLUMN: EPO giữ 4 cột lớn, Phim thường dàn đều thành 6 cột nhỏ tinh tế
        <div className={`grid gap-5 px-1 ${
          isEpo 
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4' 
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
        }`}>
          {related.length > 0 && related.map((item) => (
            <div key={item.id || item.slug} className="hover:translate-y-[-6px] transition-all duration-500">
              <MovieCard movie={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}