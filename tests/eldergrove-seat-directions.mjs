import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
import {createNavigator} from '../dist/navigation-core.js';
const a=window.krownlandia,$=s=>document.querySelector(s),forest=a.eldergrove,planner=createNavigator(a.blocked),visit=$('#eldergroveVisitStop');
const initial=JSON.stringify(a.getState().rewards);
for(const [i,seat] of forest.seats.entries()){
 a.camera.position.set(seat.approach.x,1.75,seat.approach.z);frame();assert(a.seating.sit());frame();assert(forest.open());
 const position=a.camera.position.clone(),target=forest.points[i===2?1:0];
 assert(!visit.hidden);assert($('#eldergroveDiscover').disabled);
 visit.disabled=true;visit.onclick();assert(forest.isOpen);visit.disabled=false;
 visit.onclick();frame();assert(!forest.isOpen);assert(a.seating.active);assert(a.camera.position.equals(position));assert.equal(JSON.stringify(a.getState().rewards),initial);
 assert(!a.blocked(target.x,target.z));assert(planner.route(seat.approach,target).length);
 visit.onclick();assert(!forest.isOpen);a.seating.stand();frame();assert(!a.blocked(a.camera.position.x,a.camera.position.z));
 assert($('#guide').textContent.includes(target.name));
}
// Walking to the stop still requires an explicit discovery action.
const point=forest.points[1];a.camera.position.set(point.x,1.75,point.z);frame();assert(forest.open());assert(visit.hidden);visit.onclick();assert(forest.isOpen);assert.equal(JSON.stringify(a.getState().rewards),initial);
$('#eldergroveDiscover').onclick();assert(a.getState().rewards.done.includes('eldergrove-stop-craft'));$('#eldergroveClose').onclick();
const seat=forest.seats[2];a.camera.position.set(seat.approach.x,1.75,seat.approach.z);frame();assert(a.seating.sit());frame();assert(forest.open());assert(visit.hidden);visit.onclick();assert(forest.isOpen);$('#eldergroveClose').onclick();a.seating.stand();
console.log('PASS: seated discovery directions target matching reachable stops, retain seated view and rewards, require manual discovery, hide recorded/standing shortcuts and ignore disabled/closed actions.');
