import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
const a=window.krownlandia,$=s=>document.querySelector(s),filter=$('#loungeUncollected'),l=a.lounges;
const rows=()=>$('#loungeBody').children.filter(n=>typeof n.onclick==='function');
$('#loungesButton').onclick();assert.equal(rows().length,l.spots.length);filter.onclick();assert.equal(rows().length,l.spots.length-l.collection().length);
const before=a.camera.position.clone(),points=a.getState().rewards.points;rows()[0].onclick();frame();assert(a.camera.position.equals(before));assert.equal(a.getState().rewards.points,points);
for(const spot of l.spots){
 a.camera.position.set(spot.x,1.75,spot.z+1.1);frame();l.open(spot);assert(filter.hidden);$('#loungeCollect').onclick();$('#loungeClose').onclick();
}
$('#loungesButton').onclick();assert(!filter.hidden);assert.equal(rows().length,0);assert($('#loungeBody').children.some(n=>n.textContent?.includes('All lounge souvenirs')));
const collection=JSON.stringify(l.collection());filter.onclick();assert.equal(rows().length,l.spots.length);assert.equal(JSON.stringify(l.collection()),collection);assert.equal(a.getState().rewards.points,points);
filter.onclick();$('#loungeClose').onclick();$('#loungesButton').onclick();assert.equal(rows().length,0,'filter survives reopening');
console.log('PASS: uncollected lounge filtering, read-only directions, collection refresh, hidden local filter, complete empty state and reopening.');
