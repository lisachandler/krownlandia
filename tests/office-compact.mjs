import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
const a=window.krownlandia,$=s=>document.querySelector(s),office=a.officeGarden;
const before=JSON.stringify(a.getState().rewards);
const about=$('#officeGardenAbout');
assert.equal(about.children[0].textContent,'About this garden');
assert(about.children[1].textContent.includes('@lisachandler'));
assert(about.children[1].textContent.includes('white arches'));
a.camera.position.set(office.boardPoint.x,1.75,office.boardPoint.z);frame();
assert(office.open());assert.equal(about.open,false);
about.open=true;assert.equal(office.open(),false);assert.equal(about.open,true);
$('#officeGardenClose').onclick();assert(office.open());assert.equal(about.open,false);
$('#officeGardenClose').onclick();
for(const seat of office.seats){
 a.camera.position.set(seat.approach.x,1.75,seat.approach.z);frame();assert(a.seating.sit());frame();
 const position=a.camera.position.clone();assert(office.open());assert.equal(about.open,false);
 about.open=true;assert(a.camera.position.equals(position));$('#officeGardenClose').onclick();
 a.seating.stand();frame();assert(!a.blocked(a.camera.position.x,a.camera.position.z));
}
assert.equal(JSON.stringify(a.getState().rewards),before);
console.log('PASS: optional credited garden background, compact reopening, duplicate-open continuity, all seated views and unchanged rewards.');
