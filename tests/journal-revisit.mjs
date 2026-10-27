import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
const a=window.krownlandia,$=s=>document.querySelector(s);
for(const id of ['cafe','library']){
 const spot=a.lounges.spots.find(s=>s.id===id);a.camera.position.set(spot.x,1.75,spot.z+1.3);frame();a.lounges.open(spot);$('#loungeCollect').onclick();$('#loungeClose').onclick();
 a.journal.open();$('#journalFilter-collected').onclick();const search=$('#journalSearch');search.value=spot.souvenir;search.oninput();const cards=$('#journalItems').children.filter(n=>n.className==='journal-card');assert.equal(cards.length,1);const revisit=$('#journalRevisit-lounge-'+id);assert.equal(revisit.textContent,'Revisit '+spot.name);assert(cards[0].children.includes($('#journalDisplay-lounge-'+id)),'home display action retained');
 const progress=JSON.stringify(a.getState().rewards),collection=JSON.stringify(a.lounges.collection()),position=a.camera.position.clone();revisit.onclick();frame();assert(!a.journal.isOpen);assert($('#guide').textContent.includes(spot.name));assert(a.camera.position.equals(position));assert.equal(JSON.stringify(a.getState().rewards),progress);assert.equal(JSON.stringify(a.lounges.collection()),collection);const guide=$('#guide').textContent;revisit.onclick();assert.equal($('#guide').textContent,guide);
 a.journal.open();assert.equal(search.value,spot.souvenir);assert.equal($('#journalItems').children.filter(n=>n.className==='journal-card').length,1);$('#journalClose').onclick();
}
assert(a.journal.items().filter(i=>i.revisitName).length===a.lounges.spots.length);
console.log('PASS: collected lounge keepsakes retain home display and gain named revisit directions; search/filter persist and camera, rewards and collection remain unchanged.');
