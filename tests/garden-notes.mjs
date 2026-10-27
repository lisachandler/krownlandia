import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
import {createNavigator} from '../dist/navigation-core.js';
const a=window.krownlandia,$=s=>document.querySelector(s),button=$('#seatGardenNotes'),garden=a.produceGarden;
const progress=JSON.stringify(a.getState().rewards);frame();assert(button.hidden);assert.equal(button.onclick(),false);
for(const seat of garden.seats){
 a.camera.position.set(seat.approach.x,1.75,seat.approach.z);frame();assert(a.seating.sit());frame();const position=a.camera.position.clone();assert(!button.hidden);
 $('#mapButton').onclick();frame();assert.equal(button.onclick(),false);$('#mapClose').onclick();frame();
 assert(button.onclick());frame();assert(!$('#produceNotes').open);assert($('#produceWater').hidden);assert(!$('#produceFindWater').hidden);assert.equal(button.onclick(),false);
 for(const [crop,word]of [['carrots','orange'],['tomatoes','red'],['greens','rounded']]){$('#produceCrop-'+crop).onclick();assert($('#produceNote').textContent.includes(word));}
 $('#produceWater').onclick();assert(!garden.watered);assert.equal(JSON.stringify(a.getState().rewards),progress);assert(a.camera.position.equals(position));
 assert(createNavigator(a.blocked).route(seat.approach,garden.boardPoint));$('#produceFindWater').onclick();frame();assert(!garden.isOpen);assert(a.seating.active);assert(a.camera.position.equals(position));
 assert(button.onclick());assert($('#produceNote').textContent.includes('rounded'));$('#produceClose').onclick();frame();a.seating.stand();frame();assert(!a.blocked(a.camera.position.x,a.camera.position.z));assert(button.hidden);assert($('#guide').textContent.includes('watering bench'));
}
a.camera.position.set(garden.boardPoint.x,1.75,garden.boardPoint.z);frame();assert(garden.open());assert(!$('#produceWater').hidden);assert($('#produceFindWater').hidden);$('#produceWater').onclick();assert(garden.watered);const done=JSON.stringify(a.getState().rewards);$('#produceWater').onclick();assert.equal(JSON.stringify(a.getState().rewards),done);assert.equal(a.getState().rewards.points,JSON.parse(progress).points);$('#produceClose').onclick();frame();
const other=a.school.seats[0];a.camera.position.set(other.approach.x,1.75,other.approach.z);frame();assert(a.seating.sit());frame();assert(button.hidden);assert.equal(garden.open(),false);a.seating.stand();
console.log('PASS: both garden benches, anchored notes, retained crop choice, modal guards, no remote watering, reachable care bench, explicit one-time watering and unrelated-seat exclusion.');
