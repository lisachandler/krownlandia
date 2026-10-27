import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
import {createRewards} from '../dist/rewards-core.js';
const a=window.krownlandia,$=s=>document.querySelector(s),button=$('#seatLibraryReading');frame();
assert(button.hidden);assert.equal(button.onclick(),false);assert.equal(a.library.open(),false);const points=a.getState().rewards.points;
for(const [i,seat]of a.library.seats.entries()){
 a.camera.position.set(seat.approach.x,1.75,seat.approach.z);frame();assert(a.seating.sit());frame();assert(!button.hidden);const position=a.camera.position.clone();
 $('#mapButton').onclick();frame();assert.equal(button.onclick(),false);$('#mapClose').onclick();frame();
 $('#seatViewOptions').open=true;assert(button.onclick());frame();assert(a.library.isOpen);assert(a.seating.active);assert(a.camera.position.equals(position));assert(!$('#seatViewOptions').open);assert.equal(button.onclick(),false);
 if(i===0){assert($('#libraryClaim').disabled);$('#libraryClaim').onclick();assert.equal(a.library.collection().length,0);}
 if(i===2){assert(!$('#libraryClaim').disabled);$('#libraryClaim').onclick();$('#libraryClaim').onclick();assert.equal(a.library.collection().length,1);}
 $('#libraryClose').onclick();frame();assert(a.seating.active);assert(a.camera.position.equals(position));a.seating.stand();frame();assert(!a.blocked(a.camera.position.x,a.camera.position.z));assert(button.hidden);
}
assert.equal(a.library.progress().count,3);assert.equal(a.getState().rewards.points,points);assert(createRewards(localStorage).state().done.includes('library-read'));
const other=a.school.seats[0];a.camera.position.set(other.approach.x,1.75,other.approach.z);frame();assert(a.seating.sit());frame();assert(button.hidden);assert.equal(a.library.open(),false);a.seating.stand();
console.log('PASS: two library chairs and two terrace benches support anchored reading, unread-page continuation, modal guards, explicit one-time bookmark, saved progress, safe standing and unrelated-seat exclusion.');
