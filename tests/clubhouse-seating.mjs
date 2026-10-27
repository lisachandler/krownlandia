import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
import {createRewards} from '../dist/rewards-core.js';
const a=window.krownlandia,$=s=>document.querySelector(s),button=$('#seatClubhouseBoard');frame();
assert(button.hidden);assert.equal(button.onclick(),false);assert.equal(a.clubhouse.open(),false);const points=a.getState().rewards.points;
for(const seat of a.clubhouse.seats){
 a.camera.position.set(seat.approach.x,1.75,seat.approach.z);frame();assert(a.seating.sit());frame();assert(!button.hidden);const position=a.camera.position.clone();
 $('#mapButton').onclick();frame();assert.equal(button.onclick(),false);$('#mapClose').onclick();frame();
 $('#seatViewOptions').open=true;assert(button.onclick());frame();assert(a.clubhouse.isOpen);assert(a.seating.active);assert(a.camera.position.equals(position));assert(!$('#seatViewOptions').open);assert.equal(button.onclick(),false);
 $('#clubhouseTopic-care').onclick();assert(a.getState().rewards.done.includes('clubhouse-board'));
 $('#clubhouseWalk-tram').onclick();frame();assert(!a.clubhouse.isOpen);assert(a.seating.active);assert(a.camera.position.equals(position));assert(!a.tram.active);
 assert(button.onclick());frame();$('#clubhouseClose').onclick();frame();assert(a.seating.active);assert(a.camera.position.equals(position));a.seating.stand();frame();assert(!a.blocked(a.camera.position.x,a.camera.position.z));assert(button.hidden);
}
assert.equal(a.getState().rewards.points,points);assert(createRewards(localStorage).state().done.includes('clubhouse-board'));
const other=a.school.seats[0];a.camera.position.set(other.approach.x,1.75,other.approach.z);frame();assert(a.seating.sit());frame();assert(button.hidden);assert.equal(a.clubhouse.open(),false);a.seating.stand();
console.log('PASS: four Clubhouse chairs, anchored reading and directions, modal guard, saved task without automatic points, safe standing and unrelated-seat exclusion.');
