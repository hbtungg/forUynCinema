'use client';
import LoveCard from './LoveCard'; // ĐÃ ĐỔI THÀNH LOVECARD
import { loveMoments } from '@/lib/love-data';

export default function LoveGallery() {
  // Đã xóa state playingVideo và logic Modal

  return (
    <section className="mt-20 px-4 md:px-0 overflow-x-hidden">
      {/* TIÊU ĐỀ */}
      <div className="flex items-center mb-10 gap-4">
        <div className="w-1.5 h-8 bg-neutral-700 rounded-full  animate-pulse"></div>
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white uppercase italic tracking-tighter">
            PHIM GIẢ TÌNH THẬT 🎬
          </h2>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.4em] mt-1">Exclusive Original Content for Thu Uyn</p>
        </div>
      </div>

      {/* GRID HIỂN THỊ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
        {loveMoments.map((item) => (
          <div key={item.slug} className="group flex flex-col">
            {/* Sử dụng LoveCard chuyên biệt */}
            <LoveCard movie={item} />
          </div>
        ))}
      </div>
    </section>
  );
}