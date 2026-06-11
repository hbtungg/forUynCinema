// 🚀 FILE CHUYÊN TRÁCH ĐỘC LẬP CHO CLIENT - BYPASS CLOUDFLARE NGUONC
const PROXY_BASE = "/api-nguonc";

function buildUrl(path, params = {}) {
  const url = new URL(`${PROXY_BASE}/${path}`, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") url.searchParams.set(k, v);
  });
  return url.toString();
}

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        ...options.headers,
      },
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) return null;
    return await res.json();
  } catch (error) {
    console.error(`Fetch Error tại ${url}:`, error);
    return null;
  }
}

// Hàm lõi phục vụ trang xem phim ở Client
export async function getMovieDetail(slug) {
  const url = buildUrl(`film/${slug}`);
  const data = await safeFetch(url);
  return data || { movie: null, episodes: [] };
}