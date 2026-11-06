'use client';
import { useRouter } from 'next/navigation';

export default function FilterBar({ currentSlug }) {
  const router = useRouter();

  const categories = [
    { name: 'Phim mới nhất', slug: 'phim-moi-cap-nhat' },
    { name: 'Phim bộ', slug: 'phim-bo' },
    { name: 'Phim lẻ', slug: 'phim-le' },
    { name: 'Phim đang chiếu', slug: 'phim-dang-chieu' },
  ];

  return (
    <div className="glass-trim p-3 rounded-2xl flex flex-wrap items-center gap-4 ">
      <span className="text-[10px] font-semibold uppercase text-zinc-500 mr-4">Lọc Phim:</span>
      
      <select aria-label="Lọc phim" 
        value={currentSlug}
        onChange={(e) => router.push(`/danh-sach?type=${e.target.value}`)}
        className="glass-trim min-h-11 text-zinc-300 text-[11px] font-bold px-6 py-3 rounded-xl outline-none focus:border-neutral-600 transition-all cursor-pointer"
      >
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>{cat.name}</option>
        ))}
      </select>

      <button className="ml-auto glass-trim min-h-11 text-white text-[10px] font-semibold uppercase px-8 py-3 rounded-xl transition-all active:scale-95">
        Duyệt Phim
      </button>
    </div>
  );
}