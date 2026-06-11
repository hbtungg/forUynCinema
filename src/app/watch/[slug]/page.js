import WatchClient from './WatchClient';

// 🚀 HÀM PHÒNG VỆ: Khóa chết lỗi JSON DOCTYPE rác, bảo vệ Server Vercel bất tử
async function getMovieData(slug) {
  try {
    const res = await fetch(`https://phim.nguonc.com/api/film/${slug}`, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) return { movie: null, episodes: [] };

    // Nếu API trả về HTML thay vì JSON sạch, nuốt lỗi trả về cấu trúc rỗng luôn
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return { movie: null, episodes: [] };
    }

    return await res.json();
  } catch (error) {
    console.error("Lỗi getMovieData Server-side:", error);
    return { movie: null, episodes: [] };
  }
}

// 1. DYNAMIC METADATA: Bảo vệ tiêu đề Tab không bị sập theo API
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getMovieData(slug);
  const movieName = data?.movie?.name || "Đang xem phim";

  return {
    title: `${movieName} - forUyn Cinema 🍿`,
    description: data?.movie?.description?.replace(/<[^>]*>?/gm, '').slice(0, 160) || "Xem phim tại forUyn Cinema",
  };
}

// 2. PAGE COMPONENT: Truyền dữ liệu (có thể là mảng sạch hoặc mảng trống do bị chặn) xuống Client bọc lót
export default async function WatchPage({ params }) {
  const { slug } = await params;
  const data = await getMovieData(slug);

  // 🚀 ĐÃ CẬP NHẬT: Truyền toàn bộ cục dữ liệu gốc (bao gồm cả danh sách tập phim episodes) xuống Client
  // Nếu Server bị Cloudflare chặn, data sẽ là { movie: null, episodes: [] }, Client sẽ tự bốc bù qua Proxy Browser!
  return (
    <WatchClient 
      initialMovie={data} 
      slug={slug} 
    />
  );
}