import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
import {createNavigator} from '../dist/navigation-core.js';
const a=window.krownlandia,$=s=>document.querySelector(s);const before=JSON.stringify(a.getState().rewards);
a.camera.position.set(8,1.75,47);frame();assert(a.townSquare.open());$('#squareEvents').onclick();assert(!$('#townSquareMenu').open);assert($('#eventCalendar').open);assert(a.townSquare.isOpen,'calendar participates in world modal guards');assert(!$('#eventCalendarAnytime').open);
a.interact();assert($('#eventCalendar').open);assert(!$('#townSquareMenu').open);$('#eventCalendarClose').onclick();assert(!a.townSquare.isOpen);
const planner=createNavigator(a.blocked);for(const id of ['circus','safari','journey']){$('#eventsButton').onclick();const position=a.camera.position.clone();$('#eventAnytime-'+id).onclick();frame();assert(a.camera.position.equals(position));assert(!a.townSquare.isOpen);assert(!a.getState().journey.active&&!a.getState().safari.active);}
for(const point of [{x:39,z:-51},{x:47,z:-26},{x:-30,z:-34},{x:-7.5,z:50},{x:30,z:40},{x:-30,z:147}])assert(planner.route({x:8,z:47},point).length,'destination reachable');
assert.equal(JSON.stringify(a.getState().rewards),before);console.log('PASS: board/menu entry, world modal guard, six reachable destinations, manual guidance without teleporting, rides or rewards.');
