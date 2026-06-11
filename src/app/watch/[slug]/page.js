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
  try {
    const { slug } = await params;
    const data = await getMovieData(slug);
    const movieName = data?.movie?.name || "Đang xem phim";

    return {
      title: `${movieName} - forUyn Cinema 🍿`,
      description: data?.movie?.description?.replace(/<[^>]*>?/gm, '').slice(0, 160) || "Xem phim tại forUyn Cinema",
    };
  } catch (e) {
    return { title: "Đang xem phim - forUyn Cinema 🍿" };
  }
}

// 2. PAGE COMPONENT: Truyền dữ liệu an toàn xuống Client bọc lót
export default async function WatchPage({ params }) {
  const { slug } = await params;
  let movieData = { movie: null, episodes: [] };

  // 🚀 ĐÃ SỬA CHUẨN ĐÉT: Chỉ bọc try/catch cho phần logic lấy dữ liệu, cách ly hoàn toàn khỏi JSX
  try {
    const data = await getMovieData(slug);
    if (data) {
      movieData = data;
    }
  } catch (error) {
    console.error("Sập mạch lấy dữ liệu Server WatchPage:", error);
    // Giữ nguyên trạng thái mặc định rỗng để Client tự kích hoạt cào bù
  }

  // Trả về thẻ JSX một cách thuần khiết bên ngoài khối try/catch, đúng chuẩn React yêu cầu!
  return (
    <WatchClient 
      initialMovie={movieData} 
      slug={slug} 
    />
  );
}