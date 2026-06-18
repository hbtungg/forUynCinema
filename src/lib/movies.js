import {
  getProviderCategories,
  getProviderCountries,
  getProviderMovieDetail,
  getProviderMovies,
  getProviderMoviesByCategory,
  getProviderMoviesByCountry,
  getProviderMoviesByYear,
  getProviderRelatedMovies,
  searchProviderMovies,
} from "./movieProvider";

export async function getMovies(page = 1) {
  return getProviderMovies(page);
}

export async function getMovieDetail(slug) {
  return getProviderMovieDetail(slug);
}

export async function searchMovies(keyword, page = 1) {
  return searchProviderMovies(keyword, page);
}

export async function getMoviesByCategory(slug, page = 1, type = "") {
  return getProviderMoviesByCategory(slug, page, type);
}

export async function getMoviesByCountry(slug, page = 1, type = "") {
  return getProviderMoviesByCountry(slug, page, type);
}

export async function getMoviesByYear(slug, page = 1) {
  return getProviderMoviesByYear(slug, page);
}

export async function getCategories() {
  return getProviderCategories();
}

export async function getCountries() {
  return getProviderCountries();
}

export async function getRelatedMovies(categorySlug, limit = 8) {
  return getProviderRelatedMovies(categorySlug, limit);
}

const EPO_BASE_URL = "https://www.eporner.com/api/v2/video";

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        ...options.headers,
      },
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return null;
    return await res.json();
  } catch (error) {
    console.error(`Fetch error at ${url}:`, error);
    return null;
  }
}

export async function getEpoVideos(page = 1, category = "all", order = "latest") {
  try {
    const searchQuery = category && category !== "all" ? category : "all";
    const params = new URLSearchParams({
      query: searchQuery,
      per_page: "32",
      page: page.toString(),
      thumbsize: "big",
      order,
      format: "json",
    });

    const res = await fetch(`${EPO_BASE_URL}/search/?${params}`);
    if (!res.ok) return { videos: [], total_pages: 1 };

    const data = await res.json();
    const formattedVideos = (data.videos || []).map((v) => ({
      id: v.id,
      title: v.title,
      thumb: v.default_thumb?.src || (Array.isArray(v.thumbs) ? v.thumbs[0]?.src : ""),
      preview_url: v.preview_url || v.test_previews || "",
      quality: v.quality || "HD",
      duration: v.length_min,
      added: v.added,
      views: v.views,
      rate: v.rate,
    }));

    return {
      videos: formattedVideos,
      total_pages: Math.min(data.total_pages || 1, 500),
      current_category: category,
    };
  } catch (error) {
    console.error("EPO API Error:", error);
    return { videos: [], total_pages: 1 };
  }
}

export async function getEpoVideoDetail(id) {
  const data = await safeFetch(
    `https://www.eporner.com/api/v2/video/id/?id=${id}&format=json`
  );
  return Array.isArray(data) ? data[0] : data;
}

