import './west-bank-links.mjs';
import assert from 'node:assert/strict';
import {createNavigator} from '../dist/navigation-core.js';
const a=window.krownlandia,$=s=>document.querySelector(s),open=()=>$('#communityWalkButton').onclick();
const before=a.camera.position.clone(),progress=JSON.stringify(a.getState().rewards),planner=createNavigator(a.blocked);
open();assert.equal(a.communityWalk.route,'community');assert.equal(a.communityWalk.stops.length,5);
$('#communityWalkRoute-riverbend').onclick();assert.equal(a.communityWalk.route,'riverbend');assert.equal(a.communityWalk.stops.length,3);assert.equal($('#communityWalkTitle').textContent,'Riverbend Discovery Walk');assert($('#communityWalkProgress').textContent.startsWith('0 / 3'));
let from={x:0,z:30};for(const stop of a.communityWalk.stops){assert(!a.blocked(stop.point.x,stop.point.z));assert(planner.route(from,stop.point).length,'route to '+stop.name);$('#communityWalkGo-'+stop.id).onclick();assert(!a.communityWalk.isOpen);open();assert.equal(a.communityWalk.route,'riverbend');from=stop.point;}
assert($('#communityWalkStops').children.some(card=>card.children?.some(n=>n.textContent?.includes('@ed033'))));assert($('#communityWalkStops').children.some(card=>card.children?.some(n=>n.textContent?.includes('@elizabeths14'))));
$('#communityWalkRoute-community').onclick();assert.equal(a.communityWalk.stops.length,5);assert($('#communityWalkProgress').textContent.startsWith('0 / 5'));$('#communityWalkClose').onclick();assert(a.camera.position.equals(before));assert.equal(JSON.stringify(a.getState().rewards),progress);assert(!a.riverbend.state().active);
console.log('PASS: original walk preserved, three connected Riverbend destinations, route selection retained, credits, unchanged position/progress and no automatic activity.');
open();$('#communityWalkRoute-eldergrove').onclick();
assert.equal(a.communityWalk.route,'eldergrove');assert.equal(a.communityWalk.stops.length,3);
assert.equal($('#communityWalkTitle').textContent,'Eldergrove Discovery Walk');
assert($('#communityWalkProgress').textContent.startsWith('0 / 3'));
from={x:0,z:30};for(const stop of a.communityWalk.stops){assert(!a.blocked(stop.point.x,stop.point.z));assert(planner.route(from,stop.point).length,'forest route to '+stop.name);$('#communityWalkGo-'+stop.id).onclick();assert(!a.communityWalk.isOpen);open();assert.equal(a.communityWalk.route,'eldergrove');from=stop.point;}
assert.deepEqual(a.communityWalk.stops[1].point,a.villages.homes.find(h=>h.id==='eldergrove-1').door);
assert.equal(JSON.stringify(a.getState().rewards),progress);assert(a.camera.position.equals(before));
$('#communityWalkClose').onclick();
const first=a.eldergrove.points[0];a.camera.position.set(first.x,1.75,first.z);a.eldergrove.open();$('#eldergroveDiscover').onclick();$('#eldergroveClose').onclick();
open();assert.deepEqual(a.communityWalk.stops[0].point,a.eldergrove.progress().next);assert.notDeepEqual(a.communityWalk.stops[0].point,first);
assert($('#communityWalkProgress').textContent.startsWith('0 / 3'),'Partial discoveries do not finish the walk activity');
$('#communityWalkClose').onclick();
console.log('PASS: three reachable forest stops, retained route, home doorway, next unrecorded forest discovery, partial-progress status and read-only directions.');

const beforeCraft=a.camera.position.clone(),craftProgress=JSON.stringify(a.getState().rewards);
open();$('#communityWalkRoute-crafts').onclick();
assert.equal(a.communityWalk.route,'crafts');
assert.equal($('#communityWalkTitle').textContent,'Village Craft Trail');
assert.deepEqual(a.communityWalk.stops.map(s=>s.id),['meadowbrook-crafts','riverbend-crafts','eldergrove-crafts','stonehearth-crafts','pines-crafts']);
assert.deepEqual(a.communityWalk.stops[0].point,a.villages.craftPlaces.find(p=>p.id==='meadow-loom'));
assert.deepEqual(a.communityWalk.stops.at(-1).point,a.whisperingPines.seats[0].approach);
for(const id of ['Progress','Next','Rewards','Ready','Filters'])assert($('#communityWalk'+id).hidden,id);
assert.equal($('#communityWalkStops').children.length,5);
let start={x:2,z:28};
for(const stop of a.communityWalk.stops){
 assert(!a.blocked(stop.point.x,stop.point.z));
 assert(planner.route(start,stop.point).length,stop.name);
 $('#communityWalkGo-'+stop.id).onclick();assert(!a.communityWalk.isOpen);
 open();assert.equal(a.communityWalk.route,'crafts');start=stop.point;
}
$('#communityWalkRoute-community').onclick();
for(const id of ['Progress','Next','Rewards','Filters'])assert(!$('#communityWalk'+id).hidden,id);
$('#communityWalkClose').onclick();
assert(a.camera.position.equals(beforeCraft));
assert.equal(JSON.stringify(a.getState().rewards),craftProgress);
console.log('PASS: five connected Village Craft Trail stops with directions, retained selection, no reward tracking, and unchanged position/progress.');

open();$('#communityWalkRoute-photo').onclick();
assert.equal(a.communityWalk.route,'photo');
assert($('#communityWalk').children.some(node=>node.textContent?.includes('@AlexHM')));
const photoStops=a.communityWalk.stops;
assert.deepEqual(photoStops.map(stop=>stop.id),['photo-garden','photo-terrace','photo-bridge']);
assert.deepEqual(photoStops.map(stop=>stop.credit.split(' · ')[1]),['@lisachandler','@Jauregui9821','@ed033']);
for(const id of ['Progress','Next','Rewards','Ready','Filters'])assert($('#communityWalk'+id).hidden,id);
let previous={x:2,z:28};
for(const stop of photoStops){
 assert(!a.blocked(stop.point.x,stop.point.z));
 assert(planner.route(previous,stop.point).length,'Photo Walk reaches '+stop.name);
 $('#communityWalkGo-'+stop.id).onclick();assert(!a.communityWalk.isOpen);
 open();assert.equal(a.communityWalk.route,'photo');previous=stop.point;
}
$('#communityWalkRoute-community').onclick();$('#communityWalkClose').onclick();
assert(a.camera.position.equals(beforeCraft));
assert.equal(JSON.stringify(a.getState().rewards),craftProgress);
console.log('PASS: Photo Walk offers three reachable, credited viewpoints with no automatic movement or reward tracking.');
