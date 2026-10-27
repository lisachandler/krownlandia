import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
import {createNavigator} from '../dist/navigation-core.js';
const a=window.krownlandia,$=s=>document.querySelector(s),planner=createNavigator(a.blocked);
const lounge=a.lounges.spots.find(s=>s.id==='library'),stop=a.tram.stops.find(s=>s.id==='park');
const targets={lounge:{x:lounge.x,z:lounge.z+1.3,name:lounge.name},square:a.townSquare.boardPoint,tram:{x:stop.x+2.2,z:stop.z,name:stop.name+' tram stop'}};
for(const [index,origin]of [a.library.deskPoint,...a.library.seats.map(s=>s.approach)].entries()){
 a.camera.position.set(origin.x,1.75,origin.z);frame();if(index){assert(a.seating.sit());frame();}
 for(const [id,p]of Object.entries(targets)){
  assert(a.library.open());frame();const details=$('#libraryNearby');assert(!details.open&&!details.hidden);assert.equal(details.children[1].children.length,3);details.open=true;
  const before=a.camera.position.clone(),progress=JSON.stringify(a.getState().rewards);$('#libraryWalk-'+id).onclick();frame();assert(!a.library.isOpen);assert(a.camera.position.equals(before));assert.equal(JSON.stringify(a.getState().rewards),progress);assert(!a.tram.active);
  assert(!a.blocked(p.x,p.z));assert(planner.route(origin,p).length,'route to '+id);if(index)assert(a.seating.active);else assert($('#guide').textContent.includes(p.name));
 }
 if(index){a.seating.stand();frame();}
}
assert(!a.getState().rewards.done.includes('library-read'),'Directions do not collect the bookmark');
console.log('PASS: library desk and four seats offer three reachable destinations, collapsed reopening, anchored view, no automatic progress or boarding.');
