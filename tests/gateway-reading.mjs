import assert from 'node:assert/strict';
import fs from 'node:fs';
const html=fs.readFileSync('dist/index.html','utf8');
const panel=html.match(/<section id="gatewayReading"[^>]* hidden>([\s\S]*?)<\/section>/)[1];
const noScript=html.match(/<noscript>([\s\S]*?)<\/noscript>/)[1];
const links=source=>[...source.matchAll(/href="(\/reports\/[^"]+)"/g)].map(m=>m[1]);
const paths=links(panel);assert.equal(new Set(paths).size,6);
assert(paths.includes("/reports/first-visit.html"));
assert.match(html,/<a href="\/reports\/first-visit.html" target="_blank" rel="noopener">Plan your first visit/);
assert(paths.includes("/reports/village-craft-guide.html"));
assert(paths.includes("/reports/arts-sampler.html"));
const arts=fs.readFileSync('dist/reports/arts-sampler.html','utf8');
for (const anchor of ['composition','storyboard']) {
 assert(arts.includes('href="#'+anchor+'"'));
 assert(arts.includes('id="'+anchor+'"'));
}
assert.match(arts,/Express Yourself School of Arts, credited to @elizabeths14/);
assert.match(arts,/KROWN Cinema, credited to @laloreto/);
assert.doesNotMatch(arts,/<script\b|<iframe\b|https?:\/\//i);
assert.match(fs.readFileSync('dist/reports/first-visit.html','utf8'),/href="arts-sampler.html"/);
assert.deepEqual(links(noScript),paths);
assert.match(html,/<script type="module" src="gateway-start.js"><\/script>/);
for(const path of paths)assert(fs.statSync('dist'+path).size>0);
const nodes=new Map();let focus;
globalThis.innerWidth=800;globalThis.innerHeight=600;
globalThis.document={querySelector(k){if(!nodes.has(k))nodes.set(k,{hidden:k==='#gatewayReading',focus(){focus=k},removeAttribute(name){delete this[name]}});return nodes.get(k)},createElementNS(){throw Error('test: graphics canvas unavailable')}};
const logged=[],log=console.error;console.error=(...args)=>logged.push(args);
try{
 const {startGateway}=await import('../dist/gateway-start.js');
 assert.match(logged[0][1].message,/graphics canvas unavailable/);
 assert.equal(focus,'#gatewayReadingTitle');assert.equal(nodes.get('#gatewayReading').hidden,false);
 const get=id=>nodes.get('#'+id);
 const prepare=get('gatewayBackupPrepare'),backupPanel=get('gatewayBackup'),download=get('gatewayBackupDownload'),status=get('gatewayBackupStatus');
 let reads=0,blob,revoked=[];const create=URL.createObjectURL,revoke=URL.revokeObjectURL;
 URL.createObjectURL=b=>{blob=b;return 'blob:test-backup';};URL.revokeObjectURL=u=>revoked.push(u);
 const storage=new Map([['krownPin','1'],['krownlandia-home-v1','riverbend-1'],['unrelated','private']]);
 globalThis.localStorage={getItem(key){reads++;return storage.get(key)??null;},setItem(){assert.fail('unexpected write')},removeItem(){assert.fail('unexpected delete')}};
 try{
  await prepare.onclick();assert.equal(reads,0,'collapsed panel does not read storage');
  backupPanel.open=true;await prepare.onclick();
  assert(!download.hidden);assert.match(download.download,/^krownlandia-progress-.*\.json$/);
  const payload=JSON.parse(await blob.text());assert.equal(payload.version,1);assert.equal(payload.data.krownPin,'1');assert.equal(payload.data['krownlandia-home-v1'],'riverbend-1');assert(!Object.hasOwn(payload.data,'unrelated'));
  backupPanel.open=false;backupPanel.ontoggle();assert(download.hidden);assert.equal(download.href,undefined);assert.deepEqual(revoked,['blob:test-backup']);
  backupPanel.open=true;globalThis.localStorage={getItem(){return null}};await prepare.onclick();assert(download.hidden);assert.match(status.textContent,/No saved/);
  globalThis.localStorage={getItem(){throw Error('unavailable')}};await prepare.onclick();assert(download.hidden);assert.match(status.textContent,/Could not prepare/);
 }finally{URL.createObjectURL=create;URL.revokeObjectURL=revoke;delete globalThis.localStorage;}
 const park=['#world','#welcome','#quest','#crosshair','#joystick','#place','#interact','nav'];
 for(const key of park){assert(nodes.get(key).hidden);assert(nodes.get(key).inert);}
 nodes.get('#gatewayReading').hidden=true;focus=null;
 assert.equal(await startGateway(()=>import('data:text/javascript,export%20default%20;')),false);
 assert(logged[1][1] instanceof SyntaxError);
 assert.equal(focus,'#gatewayReadingTitle');assert.equal(nodes.get('#gatewayReading').hidden,false);
 nodes.get('#gatewayReading').hidden=true;focus=null;
 assert.equal(await startGateway(async()=>{}),true);
 assert.equal(focus,null);assert(nodes.get('#gatewayReading').hidden);
}finally{console.error=log;}
console.log('PASS: renderer and module failures expose the same reading links; successful startup leaves them closed; no-script links match and optional recovery exports only saved park data.');
