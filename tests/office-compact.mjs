import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
import {Scene, Box3, Vector3} from '../dist/vendor/three.module.js';
const a=window.krownlandia,$=s=>document.querySelector(s),office=a.officeGarden;
const before=JSON.stringify(a.getState().rewards);
const about=$('#officeGardenAbout');
assert.equal(about.children[0].textContent,'About this garden');
assert(about.children[1].textContent.includes('@lisachandler'));
assert(about.children[1].textContent.includes('white arches'));
assert.match(about.children[2].textContent, /tabletop interpretation.*@ajayblee, historical inventory page 13/);
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

const scene=new Scene(),colliders=[];
globalThis.installOfficeGarden({scene,camera:a.camera,colliders,pause(){},rewards:{}});
const pieces=scene.children[0].children.filter(mesh=>mesh.name==='Pyramid Garden study');
assert.equal(pieces.length,4);
const collidingDesk=colliders.find(c=>c.x===13.6 && c.z===-20);
assert(collidingDesk);
assert.equal(colliders.length,15);
let previousWidth=Infinity, previousTop=1.065;
for(const piece of pieces){
 const b=new Box3().setFromObject(piece);
 const width=b.getSize(new Vector3()).x;
 assert(width<previousWidth);
 assert(Math.abs(b.min.y-previousTop)<1e-6);
 assert(b.min.x>13.6-.70 && b.max.x<13.6-.55/2);
 assert(b.min.z>-20-.425 && b.max.z<-20+.425);
 previousWidth=width;previousTop=b.max.y;
}
console.log('PASS: four narrowing tiers rest on the existing desk clear of the paper; no new colliders.');
