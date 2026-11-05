import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const source = await readFile(new URL('../src/lib/movieProvider.js',import.meta.url),'utf8');
const provider = await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const originalFetch = globalThis.fetch;
test('KKPhim documented camelCase pagination is normalized through backend fallback',async()=>{
  globalThis.fetch = async url => Response.json(String(url).includes('nguonc') ? {items:[]} : {
    items:[{slug:'test',name:'Test',origin_name:'A Story',year:2026}],pagination:{currentPage:2,totalPages:9}
  });
  try {
    const result = await provider.getProviderMovies(2);
    assert.equal(result.source,'kkphim');assert.equal(result.paginate.current_page,2);assert.equal(result.paginate.total_pages,9);
    assert.equal(result.items[0].canonicalKey,'a-story-2026');
  } finally {globalThis.fetch = originalFetch;}
});
test('KKPhim detail exposes direct HLS as normalized native episode',async()=>{
  globalThis.fetch = async()=>Response.json({movie:{slug:'test',name:'A Story',origin_name:'A Story',year:2026},episodes:[{
    server_name:'Vietsub',server_data:[{name:'Full',link_m3u8:'https://cdn.example/test.m3u8',link_embed:'https://player.example'}]
  }]});
  try {
    const result=await provider.getProviderMovieDetail('test','kkphim');
    assert.equal(result.movie.provider,'kkphim');
    assert.equal(result.movie.episodes[0].items[0].m3u8,'https://cdn.example/test.m3u8');
  } finally {globalThis.fetch = originalFetch;}
});
