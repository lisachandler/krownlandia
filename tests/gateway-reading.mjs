import assert from 'node:assert/strict';
import fs from 'node:fs';
const html=fs.readFileSync('dist/index.html','utf8');
const panel=html.match(/<section id="gatewayReading"[^>]* hidden>([\s\S]*?)<\/section>/)[1];
const noScript=html.match(/<noscript>([\s\S]*?)<\/noscript>/)[1];
const links=source=>[...source.matchAll(/href="(\/reports\/[^"]+)"/g)].map(m=>m[1]);
const paths=links(panel);assert.equal(new Set(paths).size,7);
assert.equal(paths[0],'/reports/reading-shelf.html');
const welcome=html.match(/<section id="welcome">([\s\S]*?)<\/section>/)[1];
assert.match(welcome,/<a href="\/reports\/reading-shelf.html">Explore without 3D<\/a>/);
assert.match(welcome,/id="enter"/);assert.match(welcome,/id="startAtGate"/);
assert.match(welcome,/<details id="gatewayBackup">/);
assert.match(panel,/id="gatewayRecoveryTools"/);
assert(paths.includes("/reports/first-visit.html"));
assert.match(html,/<a href="\/reports\/first-visit.html" target="_blank" rel="noopener">Plan your first visit/);
assert(paths.includes("/reports/village-craft-guide.html"));
assert(paths.includes("/reports/arts-sampler.html"));
const arts=fs.readFileSync('dist/reports/arts-sampler.html','utf8');
for (const anchor of ['composition','storyboard','sketchpad','framing']) {
 assert(arts.includes('href="#'+anchor+'"'));
 assert(arts.includes('id="'+anchor+'"'));
}
assert.match(arts,/Express Yourself School of Arts, credited to @elizabeths14/);
assert.match(arts,/KROWN Cinema, credited to @laloreto/);
const framing=arts.match(/<section aria-labelledby="framing">([\s\S]*?)<\/section>/)[1];
assert.match(framing,/Krown Photo Studio, credited to @AlexHM in the historical inventory \(page 10\)/);
assert.deepEqual([...framing.matchAll(/<li><b>([^:]+):/g)].map(x=>x[1]),['Wide','Detail','Layered']);
assert.doesNotMatch(framing,/<script|<input|<canvas|<img/);

assert.match(arts,/@michaelnottoli in the historical inventory \(page 13\)/);
assert.match(arts,/<details id="artsSketchpad" hidden>/);
assert.deepEqual([...arts.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m=>m[1]),['arts-sketchpad.js']);
assert.doesNotMatch(arts,/<iframe\b|https?:\/\//i);
assert.match(fs.readFileSync('dist/reports/first-visit.html','utf8'),/href="arts-sampler.html"/);
assert.match(arts,/href="art-gallery.html"/);
const gallery=fs.readFileSync('dist/reports/art-gallery.html','utf8');
assert.match(gallery,/Krownlandia Art Galleries to @AlexHM/);
assert.equal([...gallery.matchAll(/<figure(?: [^>]*)?>[\s\S]*?<figcaption>[^<]+<\/figcaption>[\s\S]*?<\/figure>/g)].length,4);
assert.equal([...gallery.matchAll(/<svg[^>]*aria-hidden="true" focusable="false"/g)].length,4);
const garden=gallery.match(/<figure id="magical-gardens">([\s\S]*?)<\/figure>/)[1];
assert.match(garden,/<figcaption>[^<]*@Cooprativeos \(historical inventory, page 15\)\.<\/figcaption>/);
assert.doesNotMatch(gallery,/<script\b|<iframe\b|https?:\/\//i);
const firstVisit=fs.readFileSync('dist/reports/first-visit.html','utf8');
assert.match(firstVisit,/href="reading-shelf.html"/);
const shelf=fs.readFileSync('dist/reports/reading-shelf.html','utf8');
assert.match(shelf,/@Jauregui9821/);
assert.doesNotMatch(shelf,/<script\b|<iframe\b|https?:\/\//i);
const shelfNav=shelf.match(/<nav aria-label="Browse the Reading Shelf">([\s\S]*?)<\/nav>/)[1];
const targets=[...shelfNav.matchAll(/href="#([a-z]+)">([^<]+)<\/a>/g)].map(([,id,label])=>[id,label]);
assert.deepEqual(targets.map(([id])=>id),['make','imagine','puzzles','visit']);
const groupSizes=[5,6,7,2];
for(const [i,[id,label]] of targets.entries()){
 const group=shelf.split('<section aria-labelledby="'+id+'"><h2 id="'+id+'">'+label+'</h2>')[1].split('</section>')[0];
 assert.equal([...group.matchAll(/href="[\w-]+\.html"/g)].length,groupSizes[i]);
}
const shelfFiles=[...shelf.matchAll(/href="([\w-]+\.html)"/g)].map(m=>m[1]);
assert.deepEqual(shelfFiles,['green-corner.html','garden-practice.html','village-craft-guide.html','arts-sampler.html','rhythm-sampler.html','house-museum-labels.html','pines-story-workshop.html','bench-for-the-story.html','four-seasons.html','art-gallery.html','make-believe-field-notes.html','pizza-sharing.html','airtime-puzzle.html','crossing-stones.html','bowling-practice.html','rainbow-patterns.html','dragon-sharing.html','community-choice.html','first-visit.html','community-bulletin.html']);
for(const name of shelfFiles){
 const page=fs.readFileSync('dist/reports/'+name,'utf8');
 assert.match(page,/<a href="reading-shelf\.html">(?:Return to the )?Reading Shelf<\/a>/,name+' should link back to the shelf even when opened directly');
}
const museum=fs.readFileSync('dist/reports/house-museum-labels.html','utf8');
assert.match(museum,/Blee Old House Museum is credited to @ajayblee in the historical inventory \(page 13\)/);
assert.match(museum,/objects below are fictional/);
assert.equal([...museum.matchAll(/<details><summary>Read one possible label/g)].length,3);
assert.doesNotMatch(museum,/<script\b|<form\b|https?:\/\//i);
assert.match(fs.readFileSync('dist/reports/yet-to-build.html','utf8'),/Blee Old House Museum @ajayblee<\/td><td>13<\/td><td>Inspired <a href="house-museum-labels.html"/);
const crafts=fs.readFileSync('dist/reports/village-craft-guide.html','utf8');
const float=crafts.match(/<section id="riverbend-casting">([\s\S]*?)<\/section>/)[1];
assert.match(float,/fishing \(page 3\)/);
assert.match(float,/ring it leaves/);assert.match(float,/curved wake/);
assert.match(crafts,/href="#riverbend-casting"/);
const sewing=crafts.match(/<section id="sewing-club">([\s\S]*?)<\/section>/)[1];
const pattern=fs.readFileSync('dist/clubhouse.js','utf8').match(/const pattern=\[([^\]]+)\]/)[1].replaceAll("'",'').split(',').join(', ');
assert(sewing.includes('<b>Practice pattern:</b> '+pattern+'.'));
assert.match(sewing,/@lisachandler \(page 16\)/);
assert.match(crafts,/href="#sewing-club"/);
const math=fs.readFileSync('dist/reports/dragon-sharing.html','utf8');
assert.doesNotMatch(math,/<script\b|<form\b|https?:\/\//i);
assert.match(math,/@prabathsilva \(page 16\)/);
const rounds=JSON.parse(fs.readFileSync('dist/magic-school.js','utf8').match(/const rounds=(.*?),choices=/)[1]);
for(const [stones,dragons] of rounds){
 assert(math.includes('Share '+stones+' stones among '+dragons+' dragons.'));
 assert(math.includes('<p>'+(stones/dragons)+' stones each.'));
}
assert.match(math,/<details><summary>Check the bonus<\/summary><p>3 stones each, with 2 left over/);
const rainbow=fs.readFileSync('dist/reports/rainbow-patterns.html','utf8');
assert.match(rainbow,/@Katielyl in the historical inventory \(page 10\)/);
assert.doesNotMatch(rainbow,/<script\b|<form\b|https?:\/\//i);
const panels=[...rainbow.matchAll(/<div class="pattern" aria-hidden="true">([^\n]+)<\/div>\n<p>([^<]+)\. Name the next shape\.<\/p>\n<details><summary>[^<]+<\/summary><p>([A-Z][a-z]+)\./g)];
assert.equal(panels.length,3);
for(const [i,[,visual,spoken,answer]] of panels.entries()){
 const shapes=[...visual.matchAll(/class="shape (circle|square|triangle)"/g)].map(m=>m[1]);
 assert.deepEqual(shapes,spoken.toLowerCase().split(', '));
 const period=[2,3,3][i];
 assert.equal(answer.toLowerCase(),shapes[shapes.length%period]);
}
assert.deepEqual(links(noScript),paths);
assert.match(html,/<script type="module" src="gateway-start.js"><\/script>/);
for(const path of paths)assert(fs.statSync('dist'+path).size>0);
const nodes=new Map(),bodyClasses=new Set(['gateway-pending']);let focus,canvasAttempts=0;
globalThis.innerWidth=800;globalThis.innerHeight=600;
globalThis.document={body:{classList:{remove:name=>bodyClasses.delete(name)}},querySelector(k){if(!nodes.has(k))nodes.set(k,{hidden:k==='#gatewayReading',focus(){focus=k},setAttribute(name,value){this[name]=value},append(node){this.child=node},removeAttribute(name){delete this[name]}});return nodes.get(k)},createElementNS(){canvasAttempts++;throw Error('test: graphics canvas unavailable')}};
const logged=[],log=console.error;console.error=(...args)=>logged.push(args);
try{
 const {startGateway,installGatewayEntry}=await import('../dist/gateway-start.js');
 assert.equal(canvasAttempts,0,'landing page does not create a graphics canvas');
 assert.equal(logged.length,0);
 assert(bodyClasses.has('gateway-pending'));
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
  const inspector=get('gatewayBackupInspect'),file=get('gatewayBackupFile'),review=get('gatewayBackupInspection');
  assert(!inspector.hidden);
  const backupBytes=JSON.stringify(payload),pick=async(value,size=value.length)=>{file.files=[{size,text:async()=>value}];await file.onchange();};
  const readsBefore=reads;
  await pick(backupBytes);assert(!review.textContent,'closed inspector does not read files');
  inspector.open=true;await pick(backupBytes);
  assert.match(review.textContent,/0 points · 1 keepsake · Home: riverbend-1/);
  assert.match(review.textContent,/your local time/);
  assert.equal(reads,readsBefore);assert.equal(canvasAttempts,0);
  await pick('{broken');assert.match(review.textContent,/could not be read/);
  await pick(backupBytes,100001);assert.match(review.textContent,/could not be read/);
  let resolveOlder,started;
  const reading=new Promise(resolve=>{started=resolve;});
  file.files=[{size:1,text:()=>new Promise(resolve=>{resolveOlder=resolve;started();})}];
  const older=file.onchange();await reading;
  await pick(backupBytes);resolveOlder('{broken');await older;assert.match(review.textContent,/riverbend-1/);
  inspector.open=false;inspector.ontoggle();assert.equal(file.value,'');assert.equal(review.textContent,'');
  backupPanel.open=false;backupPanel.ontoggle();assert(download.hidden);assert.equal(download.href,undefined);assert.deepEqual(revoked,['blob:test-backup']);
  backupPanel.open=true;globalThis.localStorage={getItem(){return null}};await prepare.onclick();assert(download.hidden);assert.match(status.textContent,/No saved/);
  globalThis.localStorage={getItem(){throw Error('unavailable')}};await prepare.onclick();assert(download.hidden);assert.match(status.textContent,/Could not prepare/);
  assert.equal(canvasAttempts,0,'backup preparation does not start 3D');
  globalThis.localStorage={getItem:key=>storage.get(key)??null};
  await prepare.onclick();assert(!download.hidden);
 await document.querySelector('#enter').onclick();
 assert(canvasAttempts>0,'entry starts the park module');
 assert.match(logged[0][1].message,/graphics canvas unavailable/);
 assert.equal(focus,'#gatewayReadingTitle');assert.equal(nodes.get('#gatewayReading').hidden,false);
  assert.equal(get('gatewayRecoveryTools').child,backupPanel,'failure moves the same backup controls');
  assert(!backupPanel.open);assert(download.hidden);
  assert.deepEqual(revoked,['blob:test-backup','blob:test-backup']);
  backupPanel.open=true;await prepare.onclick();assert(!download.hidden,'moved backup controls still work');
  inspector.open=true;await pick(backupBytes);assert.match(review.textContent,/riverbend-1/);

  backupPanel.open=false;backupPanel.ontoggle();
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
 const entry=get('enter'),gate=get('startAtGate');
 globalThis.localStorage={getItem:key=>key==='krownlandia-visit-v1'?JSON.stringify({x:2,z:28,yaw:0,pitch:0,night:false}):null};
 for(const [selector,expected] of [[entry,'continue'],[gate,'gate']]){
  bodyClasses.add('gateway-pending');
  let complete,loadCount=0,action='';
  installGatewayEntry(()=>new Promise(resolve=>{loadCount++;complete=()=>{entry.onclick=()=>{action='continue'};gate.onclick=()=>{action='gate'};resolve();};}));
  assert.equal(entry.textContent,'Continue exploring');assert.equal(gate.hidden,false);
  assert.equal(loadCount,0);
  const started=selector.onclick();
  await (selector===entry?gate:entry).onclick();
  assert.equal(loadCount,1);
  assert.equal(get('gatewayLoading').textContent,'Loading the 3D park…');
  complete();await started;
  assert.equal(action,expected);assert.equal(focus,'#world');
  assert(!bodyClasses.has('gateway-pending'));assert.equal(get('gatewayLoading').textContent,'');
 }
 delete globalThis.localStorage;
}finally{console.error=log;}
console.log('PASS: optional entry loads 3D once and preserves Continue and Start at the gate; renderer and module failures expose the same reading links; successful startup leaves them closed; no-script links match and optional recovery exports only saved park data.');
