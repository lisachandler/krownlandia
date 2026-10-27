import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
import {STATIONS} from '../dist/rewards-core.js';
import {createNavigator} from '../dist/navigation-core.js';
const a=window.krownlandia,$=s=>document.querySelector(s),planner=createNavigator(a.blocked),progress=JSON.stringify(a.getState().rewards),collection=JSON.stringify(a.lounges.collection());
for(const spot of a.lounges.spots){
 const station=STATIONS.find(s=>s.id===spot.id),approach={x:spot.x,z:spot.z+1.3};a.camera.position.set(approach.x,1.75,approach.z);frame();assert(a.lounges.open(spot));const before=a.camera.position.clone(),button=$('#loungeRewards');assert(!button.disabled);assert(planner.route(approach,station).length,'reachable station '+station.id);button.onclick();frame();assert(!a.lounges.isOpen);assert(a.camera.position.equals(before));assert($('#guide').textContent.includes(station.name+' rewards'));const guide=$('#guide').textContent;button.onclick();assert.equal($('#guide').textContent,guide);
}
const spot=a.lounges.spots[0];a.camera.position.set(spot.x,1.75,spot.z+1.3);frame();a.lounges.open(spot);const stale=$('#loungeRewards');$('#loungeSit').onclick();assert(a.lounges.seated);a.lounges.open(spot);const seated=a.camera.position.clone();$('#loungeRewards').onclick();frame();assert(a.lounges.seated);assert(a.camera.position.equals(seated));a.lounges.stand();
a.lounges.open(a.lounges.spots[1]);const guide=$('#guide').textContent;stale.onclick();assert(a.lounges.isOpen);assert.equal($('#guide').textContent,guide);assert($('#loungeRewards').disabled);$('#loungeRewards').onclick();assert(a.lounges.isOpen);$('#loungeClose').onclick();
assert.equal(JSON.stringify(a.getState().rewards),progress);assert.equal(JSON.stringify(a.lounges.collection()),collection);
console.log('PASS: all lounge rewards stations are reachable; directions preserve camera, seated view, points and collection; closed, remote and mismatched actions are inert.');
