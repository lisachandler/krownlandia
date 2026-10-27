import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
const a=window.krownlandia,$=s=>document.querySelector(s),l=a.lounges,order=$('#loungeNearest'),search=$('#loungeSearch');
const rawRows=()=>$('#loungeBody').children.filter(n=>typeof n.onclick==='function').map(n=>n.textContent);
const rows=()=>rawRows().map(text=>text.replace(/ · About \d+ m away/,''));
function checkDistances(){for(const s of l.spots){const row=$('#loungeGo-'+s.id);assert(row.textContent.includes(' · About '+Math.round(Math.hypot(s.x-a.camera.position.x,s.z+1.3-a.camera.position.z))+' m away'));}assert($('#loungeOrderNote').textContent.includes('straight-line distance'));}
const expected=()=>[...l.spots].sort((s,t)=>Math.hypot(s.x-a.camera.position.x,s.z+1.3-a.camera.position.z)-Math.hypot(t.x-a.camera.position.x,t.z+1.3-a.camera.position.z)||s.name.localeCompare(t.name)).map(s=>s.name);
const spot=l.spots.find(s=>s.id==='school'),points=a.getState().rewards.points;
a.camera.position.set(spot.x,1.75,spot.z+1.3);frame();$('#loungesButton').onclick();assert($('#loungeOrderNote').hidden);order.onclick();assert.deepEqual(rows(),expected());assert(!$('#loungeOrderNote').hidden);
checkDistances();assert($('#loungeGo-school').textContent.includes('About 0 m away'));const beforeMove=$('#loungeGo-school').textContent;
$('#loungeClose').onclick();a.camera.position.set(0,1.75,30);$('#loungesButton').onclick();assert.deepEqual(rows(),expected(),'reopening refreshes distances');checkDistances();assert.notEqual($('#loungeGo-school').textContent,beforeMove);
search.value='oat';search.oninput();const matching=new Set(l.spots.filter(s=>(s.name+' '+s.snack+' '+s.souvenir).toLowerCase().includes('oat')).map(s=>s.name));assert.deepEqual(rows(),expected().filter(n=>matching.has(n)));
$('#loungeClearSearch').onclick();$('#loungeUncollected').onclick();assert.deepEqual(rows(),expected());$('#loungeClose').onclick();
a.camera.position.set(spot.x,1.75,spot.z+1.1);frame();l.open(spot);assert(order.hidden);assert($('#loungeOrderNote').hidden);$('#loungeCollect').onclick();$('#loungeClose').onclick();$('#loungesButton').onclick();assert(!rows().includes(spot.name));
order.onclick();assert.deepEqual(rows(),l.spots.filter(s=>s!==spot).map(s=>s.name));assert(rawRows().every(text=>!text.includes(' m away')));assert.equal(a.getState().rewards.points,points);
a.camera.position.x=NaN;order.onclick();assert(order.disabled);assert($('#loungeOrderNote').hidden);assert(!$('#loungeResultCount').textContent.includes('nearest first'));
assert(rawRows().every(text=>!text.includes(' m away')));
console.log('PASS: lounge proximity ordering and distance labels, refreshed position, search and collection filters, local-menu hiding, original order and invalid-position fallback.');
