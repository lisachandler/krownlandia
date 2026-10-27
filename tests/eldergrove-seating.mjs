import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
const a=window.krownlandia,$=s=>document.querySelector(s),forest=a.eldergrove,button=$('#seatEldergroveStory'),before=JSON.stringify(a.getState().rewards);
frame();assert(button.hidden);assert.equal(forest.open(),false);
for(const [i,seat] of forest.seats.entries()){
 a.camera.position.set(seat.approach.x,1.75,seat.approach.z);frame();assert(a.seating.sit());frame();assert(!button.hidden);const position=a.camera.position.clone();
 $('#mapButton').onclick();frame();assert.equal(button.onclick(),false);$('#mapClose').onclick();frame();
 $('#seatViewOptions').open=true;assert(button.onclick());frame();assert(!$('#seatViewOptions').open);assert.equal(forest.open(),false);
 assert($('#eldergroveTitle').textContent.includes(i===2?'woodcraft':'Great Elder Tree'));
 assert($('#eldergroveDiscover').disabled);$('#eldergroveDiscover').onclick();assert.equal(JSON.stringify(a.getState().rewards),before);
 $('#eldergroveNext').onclick();frame();assert(!forest.isOpen);assert(a.seating.active);assert(a.camera.position.equals(position));
 assert(button.onclick());$('#eldergroveRewards').onclick();frame();assert(a.camera.position.equals(position));
 assert(button.onclick());$('#eldergroveTram').onclick();frame();assert(a.camera.position.equals(position));
 a.seating.stand();frame();assert(!a.blocked(a.camera.position.x,a.camera.position.z));assert(button.hidden);
}
const other=a.bridge.seats[0];a.camera.position.set(other.approach.x,1.75,other.approach.z);frame();assert(a.seating.sit());frame();assert(button.hidden);assert.equal(forest.open(),false);a.seating.stand();
const stop=forest.points[0];a.camera.position.set(stop.x,1.75,stop.z);frame();assert(forest.open());assert(!$('#eldergroveDiscover').disabled);$('#eldergroveDiscover').onclick();assert(a.getState().rewards.done.includes('eldergrove-stop-tree'));$('#eldergroveClose').onclick();
const done=JSON.stringify(a.getState().rewards);$('#eldergroveDiscover').onclick();assert.equal(JSON.stringify(a.getState().rewards),done);
console.log('PASS: all three forest benches show matching readings, anchored directions, no seated discovery credit, modal guards, unrelated seats and standing discovery recording.');
