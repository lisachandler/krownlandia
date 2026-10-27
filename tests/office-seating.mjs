import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
import {createRewards} from '../dist/rewards-core.js';
import {createNavigator} from '../dist/navigation-core.js';
const a=window.krownlandia,$=s=>document.querySelector(s),office=a.officeGarden,button=$('#seatOfficeBoard'),planner=createNavigator(a.blocked);frame();
assert(button.hidden);assert.equal(button.onclick(),false);assert.equal(office.open(),false);const points=a.getState().rewards.points;
$('#officeProject-library').onclick();assert(!a.getState().rewards.done.includes('office-idea'));
const destinations=[['library',a.library.deskPoint],['square',a.townSquare.boardPoint],['produce',a.produceGarden.boardPoint]];
for(const [i,seat]of office.seats.entries()){
 a.camera.position.set(seat.approach.x,1.75,seat.approach.z);frame();assert(a.seating.sit());frame();const position=a.camera.position.clone();assert(!button.hidden);
 $('#mapButton').onclick();frame();assert.equal(button.onclick(),false);$('#mapClose').onclick();frame();$('#seatViewOptions').open=true;
 assert(button.onclick());frame();assert(office.isOpen);assert(!$('#seatViewOptions').open);assert.equal(button.onclick(),false);assert($('#officeProjectVisit').hidden);assert(a.seating.active);assert(a.camera.position.equals(position));
 const [id,p]=destinations[i];$('#officeProject-'+id).onclick();assert(a.getState().rewards.done.includes('office-idea'));assert($('#officeProjectDetail').textContent.includes(i?'@lisachandler':'@Jauregui9821'));assert(!$('#officeProjectVisit').hidden);assert(planner.route(seat.approach,p).length);
 $('#officeProjectVisit').onclick();frame();assert(!office.isOpen);assert(a.seating.active);assert(a.camera.position.equals(position));assert(button.onclick());frame();assert($('#officeProjectVisit').hidden,'stale project selection clears on reopening');$('#officeGardenClose').onclick();frame();a.seating.stand();frame();assert(!a.blocked(a.camera.position.x,a.camera.position.z));assert(button.hidden);assert($('#guide').textContent.includes(p.name));
}
assert.equal(a.getState().rewards.points,points);assert(createRewards(localStorage).state().done.includes('office-idea'));
const other=a.school.seats[0];a.camera.position.set(other.approach.x,1.75,other.approach.z);frame();assert(a.seating.sit());frame();assert(button.hidden);assert.equal(office.open(),false);a.seating.stand();
a.camera.position.set(office.boardPoint.x,1.75,office.boardPoint.z);frame();assert(office.open());assert.equal(office.open(),false);$('#officeGardenClose').onclick();
console.log('PASS: three office chairs, anchored project reading and directions, source credits, saved task without automatic points, fresh selection, modal/remote guards and standing-board access.');
