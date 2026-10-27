import {frame} from './west-bank-links.mjs';
import assert from 'node:assert/strict';
import {createNavigator} from '../dist/navigation-core.js';
const a=window.krownlandia,$=s=>document.querySelector(s),origin=a.clubhouse.boardPoint,planner=createNavigator(a.blocked);
const lounge=a.lounges.spots.find(s=>s.id==='clubhouse'),home=a.villages.homes.find(h=>h.id==='eldergrove-1'),tram=a.tram.stops.find(s=>s.id==='eldergrove');
const targets={lounge:{x:lounge.x,z:lounge.z+1.3,name:lounge.name},home:{...home.door,name:home.name},tram:{x:tram.x+2.2,z:tram.z,name:tram.name+' tram stop'}};
a.camera.position.set(origin.x,1.75,origin.z);frame();const progress=JSON.stringify(a.getState().rewards),selected=a.villages.home;
for(const [id,p] of Object.entries(targets)){
 a.clubhouse.open();const details=$('#clubhouseNearby');assert(!details.open&&!details.hidden);assert.equal(details.children[1].children.length,3);details.open=true;
 const before=a.camera.position.clone();$('#clubhouseWalk-'+id).onclick();frame();assert(!a.clubhouse.isOpen);assert(a.camera.position.equals(before));assert($('#guide').textContent.includes(p.name));assert(!a.blocked(p.x,p.z));assert(planner.route(origin,p).length,'reachable '+id);
 assert.equal(JSON.stringify(a.getState().rewards),progress);assert.equal(a.villages.home,selected);assert(!a.tram.active);
}
a.clubhouse.open();assert(!$('#clubhouseNearby').open);$('#clubhouseClose').onclick();
console.log('PASS: Clubhouse lounge/home/tram directions, reachable approaches, collapsed reopening, unchanged viewpoint, home selection and rewards, no automatic boarding.');
