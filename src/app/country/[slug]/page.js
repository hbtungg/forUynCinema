// src/app/country/[slug]/page.js
import { getMoviesByCountry } from '@/lib/movies';
import Link from 'next/link';

export default async function CountryPage({ params, searchParams }) {
  const { slug } = await params;
  const page = (await searchParams)?.page || 1;
  const data = await getMoviesByCountry(slug, page);

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
      <header className="mb-12 border-b border-zinc-900 pb-8">
        <Link href="/" className="text-red-600 font-black hover:underline uppercase tracking-tighter text-sm flex items-center gap-2">
          <span>←</span> Quay lại trang chủ
        </Link>
        <h1 className="text-3xl font-black mt-6 text-zinc-100 uppercase tracking-tight italic">
          Quốc gia: <span className="text-red-600 uppercase">{slug.replace(/-/g, ' ')}</span>
        </h1>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {data.items?.map((phim) => (
          <Link href={`/watch/${phim.slug}`} key={phim.slug} className="group flex flex-col">
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-zinc-800 transition-all duration-500 group-hover:border-red-600">
              <img src={phim.thumb_url} className="w-full h-full object-cover transition duration-1000 group-hover:scale-110" alt={phim.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <div className="bg-red-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase">Xem ngay</div>
              </div>
            </div>
            <h3 className="mt-3 text-center text-[13px] font-bold text-zinc-400 group-hover:text-red-500 line-clamp-2 leading-snug">{phim.name}</h3>
          </Link>
        ))}
      </div>
    </main>
  );
}