import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
import {createNavigator} from '../dist/navigation-core.js';
const a=window.krownlandia,$=s=>document.querySelector(s),club=a.clubhouse,planner=createNavigator(a.blocked);
const before=JSON.stringify(a.getState().rewards);
a.camera.position.set(club.boardPoint.x,1.75,club.boardPoint.z);frame();assert(club.open());const details=$('#clubhouseManaged');assert(!details.open&&!details.hidden);assert.equal(details.children[1].children.length,2);for(const row of details.children[1].children)assert(row.children[0].textContent.includes('@maxigram'));
const old=$('#clubhouseManaged-living-sim');$('#clubhouseClose').onclick();const guide=$('#guide').textContent;old.onclick();assert.equal($('#guide').textContent,guide);assert(club.open());old.onclick();assert(club.isOpen);assert.equal($('#guide').textContent,guide);
for(const p of a.townSquare.portalPlaces){if(!club.isOpen)assert(club.open());assert(!details.open);details.open=true;const b=$('#clubhouseManaged-'+p.id);b.disabled=true;b.onclick();assert(club.isOpen);b.disabled=false;const position=a.camera.position.clone();b.onclick();frame();assert(!club.isOpen);assert(a.camera.position.equals(position));assert($('#guide').textContent.includes(p.name));assert(planner.route(club.boardPoint,p).length,'reachable '+p.name);}
const seat=club.seats[0];a.camera.position.set(seat.approach.x,1.75,seat.approach.z);frame();assert(a.seating.sit());assert(club.open());const position=a.camera.position.clone();$('#clubhouseManaged-emoji-house').onclick();assert(a.seating.active);assert(a.camera.position.equals(position));assert.equal(JSON.stringify(a.getState().rewards),before);
console.log('PASS: two credited managed places, collapsed disclosure, guarded directions, reachable portals, seated access and unchanged rewards/viewpoint.');
