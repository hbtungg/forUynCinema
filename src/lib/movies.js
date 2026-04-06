// --- FILE: src/lib/movies.js ---
const BASE_URL = "https://phim.nguonc.com/api";

// 1. Lấy phim mới cập nhật (Trang chủ)
export async function getMovies(page = 1) {
  const res = await fetch(`${BASE_URL}/films/phim-moi-cap-nhat?page=${page}`, { 
    next: { revalidate: 3600 } 
  });
  return res.json();
}

// 2. Lấy chi tiết một bộ phim
export async function getMovieDetail(slug) {
  const res = await fetch(`${BASE_URL}/film/${slug}`);
  return res.json();
}

// 3. Tìm kiếm phim
export async function searchMovies(keyword, page = 1) {
  const res = await fetch(`${BASE_URL}/films/search?keyword=${encodeURIComponent(keyword)}&page=${page}`);
  return res.json();
}

// 4. Lấy phim theo THỂ LOẠI (Đã tích hợp lọc Phim bộ/Phim lẻ)
export async function getMoviesByCategory(slug, page = 1, type = '') {
  const url = `${BASE_URL}/films/the-loai/${slug}?page=${page}${type ? `&type=${type}` : ''}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  return res.json();
}

// 5. Lấy phim theo QUỐC GIA (Đã tích hợp lọc Phim bộ/Phim lẻ)
export async function getMoviesByCountry(slug, page = 1, type = '') {
  const url = `${BASE_URL}/films/quoc-gia/${slug}?page=${page}${type ? `&type=${type}` : ''}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  return res.json();
}

// 6. Lấy phim theo NĂM PHÁT HÀNH
export async function getMoviesByYear(slug, page = 1) {
  const res = await fetch(`${BASE_URL}/films/nam-phat-hanh/${slug}?page=${page}`, { next: { revalidate: 3600 } });
  return res.json();
}

// Lấy danh sách tất cả Thể loại từ API
export async function getCategories() {
  const res = await fetch('https://phim.nguonc.com/api/the-loai', { next: { revalidate: 86400 } });
  const data = await res.json();
  return data.items || [];
}

// Lấy danh sách tất cả Quốc gia từ API
export async function getCountries() {
  const res = await fetch('https://phim.nguonc.com/api/quoc-gia', { next: { revalidate: 86400 } });
  const data = await res.json();
  return data.items || [];
}