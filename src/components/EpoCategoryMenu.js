'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const EPO_CATS = [
  { name: 'Tất cả', slug: 'all' },
  { name: 'Asian', slug: 'asian' },
  { name: 'Japanese', slug: 'japanese' },
  { name: 'Korean', slug: 'korean' },
  { name: 'Student', slug: 'student' },
  { name: 'Cosplay', slug: 'cosplay' },
  { name: 'Romance', slug: 'romance' },
  { name: 'Massage', slug: 'massage' },
];

export default function EpoCategoryMenu() {
  const searchParams = useSearchParams();
  
  // Logic nhận diện thông minh: Kiểm tra cả category và q để highlight nút
  const activeCat = searchParams.get('category') || searchParams.get('q') || 'all';
  const currentOrder = searchParams.get('order') || 'latest';

  return (
    <div className="flex flex-wrap gap-3 mb-12">
      {EPO_CATS.map((cat) => {
        const isActive = activeCat.toLowerCase() === cat.slug.toLowerCase();

        return (
          <Link
            key={cat.slug}
            // Giữ nguyên Sort (order) khi chuyển thể loại
            href={`/epo?category=${cat.slug}&order=${currentOrder}`}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 border ${
              isActive 
              ? 'bg-neutral-700 border-neutral-600 text-white  scale-105 z-10' 
              : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 hover:bg-zinc-800'
            }`}
          >
            {cat.name}
          </Link>
        );
      })}
    </div>
  );
}