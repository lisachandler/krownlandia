import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
import {createRewards} from '../dist/rewards-core.js';
const a=window.krownlandia,$=s=>document.querySelector(s),square=a.townSquare,button=$('#seatSquareBoard');frame();
assert(button.hidden);assert.equal(button.onclick(),false);assert.equal(square.open(),false);const points=a.getState().rewards.points;
$('#squareLights').onclick();assert(!square.lightsOn,'closed controls cannot change lighting');
for(const [i,seat]of square.seats.entries()){
 a.camera.position.set(seat.approach.x,1.75,seat.approach.z);frame();assert(a.seating.sit());frame();const position=a.camera.position.clone();assert(!button.hidden);
 $('#mapButton').onclick();frame();assert.equal(button.onclick(),false);$('#mapClose').onclick();frame();$('#seatViewOptions').open=true;
 assert(button.onclick());frame();assert(square.isOpen);assert(!$('#seatViewOptions').open);assert.equal(button.onclick(),false);assert(a.seating.active);assert(a.camera.position.equals(position));
 const lit=square.lightsOn;$('#squareLights').onclick();assert.equal(square.lightsOn,!lit);assert(a.camera.position.equals(position));
 if(!i){assert(!a.getState().rewards.done.includes('square-welcome'));$('#squareWelcome').onclick();assert(a.getState().rewards.done.includes('square-welcome'));assert(!$('#townSquareStory').hidden);}
 if(i===2){$('#squareStage').onclick();frame();assert(!square.isOpen);assert(a.seating.active);assert(a.camera.position.equals(position));assert(button.onclick());frame();}
 $('#townSquareClose').onclick();frame();assert(a.seating.active);assert(a.camera.position.equals(position));a.seating.stand();frame();assert(!a.blocked(a.camera.position.x,a.camera.position.z));assert(button.hidden);
}
assert.equal(a.getState().rewards.points,points);assert(createRewards(localStorage).state().done.includes('square-welcome'));
const other=a.school.seats[0];a.camera.position.set(other.approach.x,1.75,other.approach.z);frame();assert(a.seating.sit());frame();assert(button.hidden);assert.equal(square.open(),false);const lit=square.lightsOn;$('#squareLights').onclick();assert.equal(square.lightsOn,lit);a.seating.stand();
a.camera.position.set(square.boardPoint.x,1.75,square.boardPoint.z);frame();assert(square.open());assert.equal(square.open(),false);$('#townSquareClose').onclick();
console.log('PASS: all four square benches, anchored welcome/light controls, modal and duplicate-open guards, saved welcome without automatic points, seated directions, safe standing and unrelated-seat exclusion.');
