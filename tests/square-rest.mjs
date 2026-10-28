import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
import {createNavigator} from '../dist/navigation-core.js';
const a=window.krownlandia,$=s=>document.querySelector(s),square=a.townSquare,button=$('#squareRest'),seat=square.seats[0],planner=createNavigator(a.blocked),progress=JSON.stringify(a.getState().rewards);
a.camera.position.set(square.boardPoint.x,1.75,square.boardPoint.z);frame();const initial=$('#guide').textContent;button.onclick();assert.equal($('#guide').textContent,initial);
assert(square.open());button.disabled=true;button.onclick();assert(square.isOpen);assert.equal($('#guide').textContent,initial);button.disabled=false;a.camera.position.set(0,1.75,0);button.onclick();assert(square.isOpen);assert.equal($('#guide').textContent,initial);
a.camera.position.set(square.boardPoint.x,1.75,square.boardPoint.z);const position=a.camera.position.clone();button.onclick();frame();assert(!square.isOpen);assert(a.camera.position.equals(position));assert(!a.seating.active);assert($('#guide').textContent.includes(seat.name));assert(!a.blocked(seat.approach.x,seat.approach.z));assert(planner.route(square.boardPoint,seat.approach).length);
a.camera.position.set(seat.approach.x,1.75,seat.approach.z);frame();assert(a.seating.sit());assert.equal(a.seating.currentSeat,seat);assert(square.open());const seated=a.camera.position.clone();button.onclick();assert(a.seating.active);assert(a.camera.position.equals(seated));a.seating.stand();frame();assert(!a.blocked(a.camera.position.x,a.camera.position.z));assert.equal(JSON.stringify(a.getState().rewards),progress);
console.log('PASS: stage-bench directions, closed/remote/disabled guards, reachable manual seating, anchored seated use, safe standing and unchanged progress.');
