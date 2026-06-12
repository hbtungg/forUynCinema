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