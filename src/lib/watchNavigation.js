export function watchHref({ slug, episode, provider, serverIndex, serverName }) {
  const params = new URLSearchParams();
  if (episode) params.set('ep', episode);
  if (provider === 'nguonc' || provider === 'kkphim') {
    params.set('provider', provider);
    if (Number.isInteger(serverIndex) && serverIndex >= 0) params.set('server', String(serverIndex));
    if (serverName) params.set('serverName', serverName);
  }
  const query = params.toString();
  return '/watch/' + encodeURIComponent(slug) + (query ? '?' + query : '');
}
