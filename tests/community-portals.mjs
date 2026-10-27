import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
import {createNavigator} from '../dist/navigation-core.js';
const a=window.krownlandia,$=s=>document.querySelector(s),square=a.townSquare;
const before=JSON.stringify(a.getState().rewards),planner=createNavigator(a.blocked);
assert.equal(square.portalPlaces.length,2);
for(const p of square.portalPlaces){
 assert(!a.blocked(p.x,p.z),p.name+' approach clear');
 assert(planner.route({x:8,z:47},p).length,p.name+' reachable from square');
 a.camera.position.set(p.x,1.75,p.z);frame();assert(square.near);assert.equal(square.interactLabel,p.name);assert(square.open());assert(!square.open());frame();assert(square.isOpen);assert($('#interact').hidden);
 const link=$('#communityPortalLink');assert.equal(link.href,p.url);assert.equal(link.target,'_blank');assert.equal(link.rel,'noopener noreferrer');let prevented=false;link.onclick({preventDefault(){prevented=true;}});assert(!prevented);
 a.interact();assert($('#communityPortal').open);$('#communityPortalClose').onclick();assert(!square.isOpen);link.onclick({preventDefault(){prevented=true;}});assert(prevented,'closed external link inert');
 assert(square.open());a.camera.position.set(0,1.75,0);prevented=false;link.onclick({preventDefault(){prevented=true;}});assert(prevented,'remote link inert');$('#communityPortalClose').onclick();assert(!square.open());
 a.camera.position.set(8,1.75,47);assert(square.open());const position=a.camera.position.clone();$('#square-'+p.id).onclick();assert(!square.isOpen);assert(a.camera.position.equals(position),'directions do not teleport');
}
assert.equal(JSON.stringify(a.getState().rewards),before);
console.log('PASS: two reachable portals, explicit exact external links, modal/local/closed guards, board directions and unchanged rewards.');
$('#mapButton').onclick();$('#mapSearch').value='maxigram';$('#mapSearch').oninput();assert.equal($('#mapLocations').children.length,2,'manager search finds both places');$('#mapClose').onclick();
