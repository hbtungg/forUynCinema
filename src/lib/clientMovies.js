// CLIENT-ONLY: Gọi thẳng phim.nguonc.com từ browser của người dùng
// Browser dùng IP dân cư → Cloudflare không chặn → không cần proxy
const DIRECT_API = "https://phim.nguonc.com/api";

async function safeFetch(url) {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) return null;
    return await res.json();
  } catch (error) {
    console.error(`clientMovies fetch error: ${url}`, error);
    return null;
  }
}

export async function getMovieDetail(slug) {
  const data = await safeFetch(`${DIRECT_API}/film/${slug}`);
  return data || { movie: null, episodes: [] };
}

// Hàm tìm kiếm phim dành riêng cho Client-side - Gọi thẳng không sợ Cloudflare
export async function searchMovies(keyword, page = 1) {
  // Bắn trực tiếp từ trình duyệt cá nhân sang API gốc của NguồnC
  const url = `https://phim.nguonc.com/api/films/search?keyword=${encodeURIComponent(keyword)}&page=${page}`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return { items: [], paginate: { total_page: 1 } };
    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) return { items: [], paginate: { total_page: 1 } };
    return await res.json();
  } catch (error) {
    console.error(`Lỗi searchMovies tại Client: ${url}`, error);
    return { items: [], paginate: { total_page: 1 } };
  }
}