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
    <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800 flex flex-wrap items-center gap-4 shadow-2xl">
      <span className="text-[10px] font-black uppercase text-zinc-500 mr-4">Lọc Phim:</span>
      
      <select 
        value={currentSlug}
        onChange={(e) => router.push(`/danh-sach?type=${e.target.value}`)}
        className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-[11px] font-bold px-6 py-3 rounded-xl outline-none focus:border-red-600 transition-all cursor-pointer"
      >
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>{cat.name}</option>
        ))}
      </select>

      <button className="ml-auto bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase px-8 py-3 rounded-xl transition-all active:scale-95">
        Duyệt Phim
      </button>
    </div>
  );
}