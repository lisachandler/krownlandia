import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
import {createNavigator} from '../dist/navigation-core.js';
const a=window.krownlandia,$=s=>document.querySelector(s),square=a.townSquare,planner=createNavigator(a.blocked),before=JSON.stringify(a.getState().rewards);
for(const p of square.portalPlaces){
 a.camera.position.set(p.x,1.75,p.z);frame();assert(square.open());const details=$('#communityPortalNearby');assert(!details.open);assert.equal(details.children[1].children.length,2);
 const other=square.portalPlaces.find(x=>x!==p),old=$('#communityPortalWalk-'+other.id),guide=$('#guide').textContent;$('#communityPortalClose').onclick();old.onclick();assert.equal($('#guide').textContent,guide);assert(square.open());old.onclick();assert(square.isOpen);assert.equal($('#guide').textContent,guide);
 for(const target of [other,{id:'square',...square.boardPoint}]){if(!square.isOpen)assert(square.open());const button=$('#communityPortalWalk-'+target.id);button.disabled=true;button.onclick();assert(square.isOpen);button.disabled=false;a.camera.position.set(0,1.75,0);button.onclick();assert(square.isOpen);a.camera.position.set(p.x,1.75,p.z);const position=a.camera.position.clone();button.onclick();frame();assert(!square.isOpen);assert(a.camera.position.equals(position));assert($('#guide').textContent.includes(target.name));assert(planner.route(p,target).length);}
}
assert.equal(JSON.stringify(a.getState().rewards),before);console.log('PASS: four portal routes, collapsed details, closed/replaced/disabled/remote guards and unchanged viewpoint/rewards.');
