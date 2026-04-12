import WatchClient from './WatchClient';

// Hàm lấy dữ liệu dùng chung
async function getMovieData(slug) {
  const res = await fetch(`https://phim.nguonc.com/api/film/${slug}`, {
    cache: 'no-store'
  });
  return res.json();
}

// 1. DYNAMIC METADATA: Cập nhật tiêu đề tab theo tên phim
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getMovieData(slug);
  const movieName = data.movie?.name || "Đang xem phim";

  return {
    title: `${movieName} - forUyn Cinema 🍿`,
    description: data.movie?.description?.replace(/<[^>]*>?/gm, '').slice(0, 160) || "Xem phim tại forUyn Cinema",
  };
}

// 2. PAGE COMPONENT: Lấy data rồi truyền xuống Client
export default async function WatchPage({ params }) {
  const { slug } = await params;
  const data = await getMovieData(slug);

  if (!data.movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-black uppercase tracking-[0.5em] text-[10px]">
        Phim không tồn tại hoặc đã bị gỡ bỏ...
      </div>
    );
  }

  return <WatchClient initialMovie={data.movie} slug={slug} />;
}