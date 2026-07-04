const NGUONC_API = "https://phim.nguonc.com/api";
const KKPHIM_API = "https://phimapi.com";
const FETCH_TIMEOUT = 8000;

const COUNTRY_SLUGS = new Set([
  "han-quoc",
  "trung-quoc",
  "nhat-ban",
  "thai-lan",
  "au-my",
  "dai-loan",
  "an-do",
  "hong-kong",
  "viet-nam",
  "phap",
  "duc",
  "anh",
  "canada",
]);

const LIST_TYPES = new Set([
  "phim-bo",
  "phim-le",
  "tv-shows",
  "hoat-hinh",
  "phim-vietsub",
  "phim-thuyet-minh",
  "phim-long-tieng",
]);

function createCanonicalKey(movie = {}) {
  // Ưu tiên origin_name (tên gốc không dịch) để key nhất quán giữa các provider.
  // Fallback về name (tên tiếng Việt) rồi slug nếu không có tên gốc.
  const title = movie.origin_name || movie.original_name || movie.name || movie.slug || "";
  const year = movie.year || "";
  const normalized = `${title}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  // Nếu sau normalize vẫn rỗng (slug toàn ký tự đặc biệt), dùng slug thô làm fallback
  const base = normalized || (movie.slug || "unknown").replace(/[^a-z0-9-]/g, "");
  return base + (year ? `-${year}` : "");
}

function withTimeout(ms = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  return { controller, timeout };
}

async function safeFetchJson(url, options = {}) {
  const { controller, timeout } = withTimeout(options.timeout || FETCH_TIMEOUT);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...options.headers,
      },
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return null;
    return await res.json();
  } catch (_) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function buildUrl(base, path, params = {}) {
  const url = new URL(`${base}/${path}`.replace(/([^:]\/)\/+/g, "$1"));
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

function buildNguoncUrl(path, params = {}) {
  if (typeof window === "undefined") {
    return buildUrl(NGUONC_API, path, params);
  }

  const url = new URL("/api/movies", window.location.origin);
  url.searchParams.set("path", path);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

function normalizeEpisode(ep = {}) {
  return {
    ...ep,
    name: ep.name || ep.title || ep.episode || "1",
    slug: ep.slug || ep.name || ep.title || "1",
    embed: ep.embed || ep.link_embed || ep.link || ep.url || "",
    m3u8: ep.m3u8 || ep.link_m3u8 || "",
  };
}

function normalizeServer(server = {}) {
  const items = server.items || server.server_data || [];
  return {
    ...server,
    server_name: server.server_name || server.name || "Nguồn phim",
    items: items.map(normalizeEpisode),
    server_data: items.map(normalizeEpisode),
  };
}

function normalizeMovie(movie = {}, provider = "nguonc") {
  const categoryList = Array.isArray(movie.category) ? movie.category : [];
  const countryList = Array.isArray(movie.country) ? movie.country : [];
  const episodes = (movie.episodes || []).map(normalizeServer);
  const normalized = {
    ...movie,
    provider: movie.provider || provider,
    providerSlug: movie.providerSlug || movie.slug,
    canonicalKey: movie.canonicalKey || createCanonicalKey(movie),
    description:
      movie.description ||
      movie.content ||
      movie.desc ||
      movie.summary ||
      movie.overview ||
      movie.plot ||
      "",
    thumb_url: movie.thumb_url || movie.thumb || movie.poster_url || "",
    poster_url: movie.poster_url || movie.poster || movie.thumb_url || "",
    origin_name: movie.origin_name || movie.original_name || "",
    original_name: movie.original_name || movie.origin_name || "",
    episode_current: movie.episode_current || movie.current_episode || movie.episode || "Full",
    current_episode: movie.current_episode || movie.episode_current || movie.episode || "Full",
    language: movie.language || movie.lang || "",
    quality: movie.quality || "",
    time: movie.time || movie.duration || "",
    category: Array.isArray(movie.category)
      ? { "3": { list: categoryList } }
      : movie.category || { "3": { list: [] } },
    country: Array.isArray(movie.country)
      ? { "4": { list: countryList } }
      : movie.country || { "4": { list: [] } },
    episodes,
  };
  normalized.canonicalKey = normalized.canonicalKey || createCanonicalKey(normalized);
  return normalized;
}

function normalizeListResponse(data, provider = "nguonc") {
  const dataNode = data?.data || data || {};
  const items = dataNode.items || data?.items || [];
  const params = dataNode.params || {};
  const pagination = dataNode.pagination || dataNode.paginate || data?.pagination || data?.paginate || {};
  const totalPages =
    pagination.total_pages ||
    pagination.total_page ||
    params.pagination?.totalPages ||
    params.pagination?.total_pages ||
    dataNode.total_pages ||
    1;

  return {
    ...data,
    items: items.map((item) => normalizeMovie(item, provider)),
    paginate: {
      ...pagination,
      current_page: pagination.current_page || params.pagination?.currentPage || 1,
      total_pages: totalPages,
      total_page: totalPages,
    },
    source: provider,
  };
}

function normalizeDetailResponse(data, provider = "nguonc") {
  const movie = data?.movie || data?.data?.movie || null;
  const episodes = data?.episodes || data?.data?.episodes || movie?.episodes || [];
  if (!movie) return { movie: null, episodes: [], source: provider };
  const normalizedMovie = normalizeMovie({ ...movie, episodes }, provider);
  return {
    ...data,
    movie: normalizedMovie,
    episodes: normalizedMovie.episodes,
    source: provider,
  };
}

async function fetchNguonc(path, params = {}) {
  const data = await safeFetchJson(buildNguoncUrl(path, params));
  return data;
}

async function fetchKkphim(path, params = {}) {
  const data = await safeFetchJson(buildUrl(KKPHIM_API, path, params));
  return data;
}

async function withFallback({ nguonc, kkphim, normalize, empty }) {
  const primary = await nguonc();
  const primaryResult = primary ? normalize(primary, "nguonc") : null;
  if (primaryResult?.items?.length || primaryResult?.movie) return primaryResult;

  const secondary = await kkphim();
  const secondaryResult = secondary ? normalize(secondary, "kkphim") : null;
  if (secondaryResult?.items?.length || secondaryResult?.movie) return secondaryResult;

  return empty;
}

async function withPreferredFallback({ preferredProvider, nguonc, kkphim, normalize, empty }) {
  const providerOrder = preferredProvider === "kkphim"
    ? ["kkphim", "nguonc"]
    : preferredProvider === "nguonc"
      ? ["nguonc", "kkphim"]
      : ["nguonc", "kkphim"];

  for (const provider of providerOrder) {
    const result = provider === "nguonc"
      ? (await nguonc())
      : (await kkphim());
    const normalized = result ? normalize(result, provider) : null;
    if (normalized?.items?.length || normalized?.movie) {
      return normalized;
    }
  }

  return empty;
}

export async function getProviderMovies(page = 1) {
  return withFallback({
    nguonc: () => fetchNguonc("films/phim-moi-cap-nhat", { page }),
    kkphim: () => fetchKkphim("danh-sach/phim-moi-cap-nhat", { page }),
    normalize: normalizeListResponse,
    empty: { items: [], paginate: { total_pages: 1, total_page: 1 }, source: "empty" },
  });
}

export async function getProviderMovieDetail(slug, preferredProvider = null) {
  return withPreferredFallback({
    preferredProvider,
    nguonc: () => fetchNguonc(`film/${slug}`),
    kkphim: () => fetchKkphim(`phim/${slug}`),
    normalize: normalizeDetailResponse,
    empty: { movie: null, episodes: [], source: "empty" },
  });
}

export async function searchProviderMovies(keyword, page = 1) {
  return withFallback({
    nguonc: () => fetchNguonc("films/search", { keyword, page }),
    kkphim: () => fetchKkphim("v1/api/tim-kiem", { keyword, page, limit: 24 }),
    normalize: normalizeListResponse,
    empty: { items: [], paginate: { total_pages: 1, total_page: 1 }, source: "empty" },
  });
}

export async function getProviderMoviesByCategory(slug, page = 1, type = "") {
  return withFallback({
    nguonc: () => fetchNguonc(`films/the-loai/${slug}`, { page, ...(type && { type }) }),
    kkphim: () => fetchKkphim(`v1/api/the-loai/${slug}`, { page, limit: 24 }),
    normalize: normalizeListResponse,
    empty: { items: [], paginate: { total_pages: 1, total_page: 1 }, source: "empty" },
  });
}

export async function getProviderMoviesByCountry(slug, page = 1, type = "") {
  return withFallback({
    nguonc: () => fetchNguonc(`films/quoc-gia/${slug}`, { page, ...(type && { type }) }),
    kkphim: () => fetchKkphim(`v1/api/quoc-gia/${slug}`, { page, limit: 24 }),
    normalize: normalizeListResponse,
    empty: { items: [], paginate: { total_pages: 1, total_page: 1 }, source: "empty" },
  });
}

export async function getProviderMoviesByYear(slug, page = 1) {
  return withFallback({
    nguonc: () => fetchNguonc(`films/nam-phat-hanh/${slug}`, { page }),
    kkphim: () => fetchKkphim(`v1/api/nam/${slug}`, { page, limit: 24 }),
    normalize: normalizeListResponse,
    empty: { items: [], paginate: { total_pages: 1, total_page: 1 }, source: "empty" },
  });
}

export async function getProviderList(typeList, page = 1) {
  if (typeList === "phim-moi-cap-nhat") return getProviderMovies(page);
  if (COUNTRY_SLUGS.has(typeList)) return getProviderMoviesByCountry(typeList, page);
  if (LIST_TYPES.has(typeList)) {
    return withFallback({
      nguonc: () => fetchNguonc(`films/danh-sach/${typeList}`, { page }),
      kkphim: () => fetchKkphim(`v1/api/danh-sach/${typeList}`, { page, limit: 24 }),
      normalize: normalizeListResponse,
      empty: { items: [], paginate: { total_pages: 1, total_page: 1 }, source: "empty" },
    });
  }
  return getProviderMoviesByCategory(typeList, page);
}

export async function getProviderCategories() {
  const primary = await fetchNguonc("the-loai");
  const primaryItems = primary?.items || [];
  if (primaryItems.length) return primaryItems;
  const secondary = await fetchKkphim("the-loai");
  return secondary || [];
}

export async function getProviderCountries() {
  const primary = await fetchNguonc("quoc-gia");
  const primaryItems = primary?.items || [];
  if (primaryItems.length) return primaryItems;
  const secondary = await fetchKkphim("quoc-gia");
  return secondary || [];
}

export async function getProviderRelatedMovies(categorySlug, limit = 8) {
  const data = await getProviderMoviesByCategory(categorySlug, 1);
  return data?.items?.slice(0, limit) || [];
}
