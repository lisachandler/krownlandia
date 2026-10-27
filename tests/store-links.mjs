import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
import {createNavigator} from '../dist/navigation-core.js';
const a=window.krownlandia,$=s=>document.querySelector(s),store=a.generalStore,planner=createNavigator(a.blocked);
const coffee=a.foodGuide.places().find(p=>p.id==='coffee'),lounge=a.lounges.spots.find(s=>s.id==='generalstore');
const targets={coffee,lounge:{x:lounge.x,z:lounge.z+1.3,name:lounge.name},office:a.officeGarden.boardPoint,produce:a.produceGarden.boardPoint};
a.camera.position.set(store.boardPoint.x,1.75,store.boardPoint.z);frame();
for(const [id,p]of Object.entries(targets)){
 assert(store.open());assert.equal(store.open(),false);frame();const details=$('#generalstoreNearby');assert(!details.hidden&&!details.open);assert.equal(details.children[1].children.length,4);details.open=true;
 const before=a.camera.position.clone(),progress=JSON.stringify(a.getState().rewards);$('#generalstoreWalk-'+id).onclick();frame();assert(!store.isOpen);assert(a.camera.position.equals(before));assert.equal(JSON.stringify(a.getState().rewards),progress);assert($('#guide').textContent.includes(p.name));assert(!a.blocked(p.x,p.z));assert(planner.route(store.boardPoint,p).length);
}
assert(!a.getState().rewards.done.includes('generalstore-board'));assert(store.open());$('#generalstoreTopic-notebook').onclick();assert(a.getState().rewards.done.includes('generalstore-board'));$('#generalstoreClose').onclick();
a.camera.position.set(0,1.75,30);frame();assert.equal(store.open(),false);const before=$('#guide').textContent;$('#generalstoreWalk-coffee').onclick();frame();assert.equal($('#guide').textContent,before);
console.log('PASS: four store connections, clear routes, optional collapsed panel, unchanged position/progress, explicit browsing task and closed/remote guards.');
