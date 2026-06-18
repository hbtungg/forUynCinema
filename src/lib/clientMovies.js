import {
  getProviderCategories,
  getProviderCountries,
  getProviderMovieDetail,
  getProviderMovies,
  getProviderMoviesByCategory,
  getProviderMoviesByCountry,
  getProviderMoviesByYear,
  getProviderList,
  getProviderRelatedMovies,
  searchProviderMovies,
} from "./movieProvider";

export async function getMovieDetail(slug, preferredProvider = null) {
  return getProviderMovieDetail(slug, preferredProvider);
}

export async function searchMovies(keyword, page = 1) {
  return searchProviderMovies(keyword, page);
}

export async function getMovies(page = 1) {
  return getProviderMovies(page);
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

export async function getMovieList(typeList, page = 1) {
  return getProviderList(typeList, page);
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
