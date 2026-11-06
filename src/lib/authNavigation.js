const localOrigin = 'https://uynflix.invalid';

export function getAuthReturnPath(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/home';
  try {
    const url = new URL(value, localOrigin);
    const pathname = decodeURIComponent(url.pathname);
    if (url.origin === localOrigin && (/^\/watch\/[^/\\]+$/.test(pathname) || ['/account', '/history'].includes(pathname))) {
      return url.pathname + url.search;
    }
  } catch {}
  return '/home';
}

export function authHref(page, destination) {
  const next = getAuthReturnPath(destination);
  return next === '/home' ? page : page + '?next=' + encodeURIComponent(next);
}
