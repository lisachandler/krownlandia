import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
import {createRewards} from '../dist/rewards-core.js';
import {createNavigator} from '../dist/navigation-core.js';
const a=window.krownlandia,$=s=>document.querySelector(s),bridge=a.bridge,seat=bridge.seats[0],button=$('#seatBridgeStory'),planner=createNavigator(a.blocked),points=a.getState().rewards.points;
frame();assert(button.hidden);assert.equal(button.onclick(),false);assert.equal(bridge.open(),false);
$('#bridgeTopic-story').onclick();assert(!a.getState().rewards.done.includes('bridge-board'));
a.camera.position.set(seat.approach.x,1.75,seat.approach.z);frame();assert(a.seating.sit());frame();const position=a.camera.position.clone();assert(!button.hidden);
$('#mapButton').onclick();frame();assert.equal(button.onclick(),false);$('#mapClose').onclick();frame();$('#seatViewOptions').open=true;
assert(button.onclick());frame();assert(bridge.isOpen);assert(!$('#seatViewOptions').open);assert.equal(button.onclick(),false);assert.equal(bridge.open(),false);
$('#bridgeTopic-story').onclick();assert($('#bridgeStory').textContent.includes('@ed033'));assert(a.getState().rewards.done.includes('bridge-board'));assert(a.camera.position.equals(position));assert(a.seating.active);assert.equal(a.getState().rewards.points,points);
$('#bridgeClose').onclick();frame();assert(a.seating.active);
const lounge=a.lounges.spots.find(s=>s.id==='bridge');
for(const [id,p] of [['school',a.school.deskPoint],['lounge',{x:lounge.x,z:lounge.z+1.3,name:lounge.name}],['riverbend',a.riverbend.boardPoint]]){
 assert(button.onclick());assert(!$('#bridgeNearby').open);assert(planner.route(seat.approach,p).length);$('#bridgeNearby').open=true;$('#bridgeWalk-'+id).onclick();frame();assert(!bridge.isOpen);assert(a.camera.position.equals(position));assert(a.seating.active);
}
assert(createRewards(localStorage).state().done.includes('bridge-board'));assert.equal(a.getState().rewards.points,points);
assert(button.onclick());$('#bridgeRewards').onclick();frame();assert(!bridge.isOpen);assert(a.seating.active);a.seating.stand();frame();assert(!a.blocked(a.camera.position.x,a.camera.position.z));assert(button.hidden);
const other=a.school.seats[0];a.camera.position.set(other.approach.x,1.75,other.approach.z);frame();assert(a.seating.sit());frame();assert(button.hidden);assert.equal(bridge.open(),false);a.seating.stand();
a.camera.position.set(bridge.boardPoint.x,1.75,bridge.boardPoint.z);frame();assert(bridge.open());$('#bridgeClose').onclick();
console.log('PASS: seated bridge story and credit, anchored view, saved task without automatic points, nearby walking routes, modal guards, unrelated seats and standing-board access.');
