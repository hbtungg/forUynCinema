'use client';
import Link from 'next/link';

export default function CategoryMenu() {
  const categories = [
    { name: 'Hành Động', slug: 'hanh-dong' },
    { name: 'Cổ Trang', slug: 'co-trang' },
    { name: 'Tình Cảm', slug: 'tinh-cam' },
    { name: 'Hoạt Hình', slug: 'hoat-hinh' },
  ];

  const countries = [
    { name: 'Âu Mỹ', slug: 'au-my' },
    { name: 'Trung Quốc', slug: 'trung-quoc' },
    { name: 'Hàn Quốc', slug: 'han-quoc' },
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-10">
      <div className="flex gap-2 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
        {categories.map((cat) => (
          <Link 
            key={cat.slug} 
            href={`/category/${cat.slug}`}
            className="px-4 py-1.5 text-[11px] font-black text-zinc-500 hover:text-white hover:bg-red-600 rounded-lg transition-all uppercase tracking-tighter"
          >
            {cat.name}
          </Link>
        ))}
      </div>
      
      <div className="flex gap-2 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
        {countries.map((c) => (
          <Link 
            key={c.slug} 
            href={`/country/${c.slug}`}
            className="px-4 py-1.5 text-[11px] font-black text-zinc-500 hover:text-white hover:bg-zinc-700 rounded-lg transition-all uppercase tracking-tighter"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}