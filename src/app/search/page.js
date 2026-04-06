import { searchMovies } from '@/lib/movies';
import Link from 'next/link';

export default async function SearchPage({ searchParams }) {
  // Lấy từ khóa từ URL
  const keyword = (await searchParams)?.keyword || '';
  const page = (await searchParams)?.page || 1;
  
  // Gọi API tìm kiếm
  const data = await searchMovies(keyword, page);

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
      <header className="mb-12 border-b border-zinc-900 pb-8">
        <Link href="/" className="text-red-600 font-black hover:underline uppercase tracking-tighter text-sm flex items-center gap-2">
          <span>←</span> Quay lại trang chủ
        </Link>
        <h1 className="text-3xl font-black mt-6 text-zinc-100 uppercase tracking-tight">
          Kết quả cho: <span className="text-red-600">"{keyword}"</span>
        </h1>
      </header>

      {data.items?.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {data.items.map((phim) => (
            <Link href={`/watch/${phim.slug}`} key={phim.slug} className="group">
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-zinc-800 group-hover:border-red-600 transition-all duration-500 shadow-xl">
                <img 
                  src={phim.thumb_url} 
                  className="w-full h-full object-cover transition duration-1000 group-hover:scale-110" 
                  alt={phim.name}
                />
              </div>
              <h3 className="mt-4 text-center text-sm font-bold text-zinc-400 group-hover:text-red-500 transition-colors line-clamp-1">{phim.name}</h3>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
          <p className="text-zinc-500 font-medium italic text-lg">Không tìm thấy phim này rồi vợ yêu ơi! Vợ thử gõ tên khác xem sao nha.</p>
        </div>
      )}
    </main>
  );
}