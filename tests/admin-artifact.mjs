import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
const base=resolve('server-app/node_modules/.pnpm');const pkg=readdirSync(base).find(n=>n.startsWith('miniflare@'));
const {Miniflare}=await import(resolve(base,pkg,'node_modules/miniflare/dist/src/index.js'));
const mf=new Miniflare({modules:['index.js',...readdirSync('dist/server',{recursive:true}).filter(p=>p.endsWith('.js')&&p!=='index.js')].map(p=>({type:'ESModule',path:resolve('dist/server',p)})),modulesRoot:resolve('dist/server'),compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],bindings:{KROWNLANDIA_ADMIN_EMAIL:'admin@example.test'},assets:{directory:resolve('dist/client'),routerConfig:{has_user_worker:true}}});
try{
 for(const path of ['/','/world.js','/vendor/three.module.js']){const r=await mf.dispatchFetch('https://example.test'+path);assert.equal(r.status,200,path);assert.equal(await r.text(),readFileSync('dist'+(path==='/'?'/index.html':path),'utf8'));}
 for(const path of ['/admin/activity','/admin/activity?format=csv']){assert.equal((await mf.dispatchFetch('https://example.test'+path)).status,401);assert.equal((await mf.dispatchFetch('https://example.test'+path,{headers:{'oai-authenticated-user-id':'viewer','oai-authenticated-user-email':'viewer@example.test'}})).status,403);}
 const r=await mf.dispatchFetch('https://example.test/admin/activity',{headers:{'oai-authenticated-user-id':'owner','oai-authenticated-user-email':'admin@example.test'}});assert.equal(r.status,200);assert((await r.text()).includes('Verified build publications'));
 for(const path of ['/build-history.json','/activity-log.mjs','/server-app/build-history.json'])assert.equal((await mf.dispatchFetch('https://example.test'+path)).status,404,path);
 console.log('PASS: built Worker serves original park assets unchanged, protects HTML/CSV and keeps log data out of static routes.');
}finally{await mf.dispose();}
