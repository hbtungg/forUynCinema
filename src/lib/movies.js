// src/lib/movies.js
const BASE_URL = "https://phim.nguonc.com/api";

export async function getMovies(page = 1) {
  const res = await fetch(`${BASE_URL}/films/phim-moi-cap-nhat?page=${page}`, { 
    next: { revalidate: 3600 } 
  });
  return res.json();
}

export async function getMovieDetail(slug) {
  const res = await fetch(`${BASE_URL}/film/${slug}`);
  return res.json();
}

export async function searchMovies(keyword, page = 1) {
  const res = await fetch(`${BASE_URL}/films/search?keyword=${encodeURIComponent(keyword)}&page=${page}`);
  return res.json();
}

// Thêm 3 hàm này vào cuối file src/lib/movies.js nhé anh yêu
export async function getMoviesByCategory(slug, page = 1) {
  const res = await fetch(`https://phim.nguonc.com/api/films/the-loai/${slug}?page=${page}`, { next: { revalidate: 3600 } });
  return res.json();
}

export async function getMoviesByCountry(slug, page = 1) {
  const res = await fetch(`https://phim.nguonc.com/api/films/quoc-gia/${slug}?page=${page}`, { next: { revalidate: 3600 } });
  return res.json();
}

export async function getMoviesByYear(slug, page = 1) {
  const res = await fetch(`https://phim.nguonc.com/api/films/nam-phat-hanh/${slug}?page=${page}`, { next: { revalidate: 3600 } });
  return res.json();
}