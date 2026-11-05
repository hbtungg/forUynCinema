import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
let session;
globalThis.__testSession = async () => session;
const source = (await readFile(new URL('../src/lib/userApi.js',import.meta.url),'utf8'))
 .replace("import { getServerSession } from 'next-auth';",'const getServerSession = globalThis.__testSession;')
 .replace("import { authOptions } from '@/lib/auth';",'const authOptions = {};');
const {requireUserEmail, validMovieKey} = await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
test('unauthenticated request fails closed',async()=>{
 session = null;
 await assert.rejects(requireUserEmail(new Request('https://uynflix.vercel.app/api/history?userEmail=victim@example.com')),e=>e.status===401);
});
test('GET identity comes from session, never query email',async()=>{
 session = {user:{email:'owner@example.com'}};
 assert.equal(await requireUserEmail(new Request('https://uynflix.vercel.app/api/history?userEmail=victim@example.com')),'owner@example.com');
});
for(const method of ['POST','DELETE']) {
 test(method+' rejects cross origin and missing origin',async()=>{
  session={user:{email:'owner@example.com'}};
  for(const headers of [{},{origin:'https://attacker.example'}]) await assert.rejects(requireUserEmail(new Request('https://uynflix.vercel.app/api/history',{method,headers})),e=>e.status===403);
 });
 test(method+' permits same-origin authenticated client',async()=>{
  session={user:{email:'owner@example.com'}};
  assert.equal(await requireUserEmail(new Request('https://uynflix.vercel.app/api/history',{method,headers:{origin:'https://uynflix.vercel.app'}})),'owner@example.com');
 });
}
test('Mongo selector payloads and oversized keys are rejected',()=>{
 for(const key of [{$ne:null},[],null,undefined,'','x'.repeat(301)]) assert.equal(validMovieKey(key),false);
 assert.equal(validMovieKey('movie-2026'),true);
});
