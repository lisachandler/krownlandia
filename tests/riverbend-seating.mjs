import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
import {createRewards} from '../dist/rewards-core.js';
const a=window.krownlandia,$=s=>document.querySelector(s),river=a.riverbend,seat=river.seats[0],button=$('#seatRiverbendStory'),points=a.getState().rewards.points;
frame();assert(button.hidden);assert.equal(river.open(),false);$('#riverbendTopic-crafts').onclick();assert(!a.getState().rewards.done.includes('riverbend-board'));
a.camera.position.set(seat.approach.x,1.75,seat.approach.z);frame();assert(a.seating.sit());frame();const position=a.camera.position.clone();assert(!button.hidden);
$('#mapButton').onclick();frame();assert.equal(button.onclick(),false);$('#mapClose').onclick();frame();$('#seatViewOptions').open=true;
assert(button.onclick());frame();assert(!$('#seatViewOptions').open);assert.equal(river.open(),false);
for(const topic of ['festival','crafts','river']){$('#riverbendTopic-'+topic).onclick();assert(a.camera.position.equals(position));assert(a.seating.active);}
assert(createRewards(localStorage).state().done.includes('riverbend-board'));assert.equal(a.getState().rewards.points,points);
$('#riverFestivalStart').onclick();frame();assert(!river.isOpen);assert(river.state().active);assert(a.seating.active);assert(a.camera.position.equals(position));
assert(button.onclick());frame();const elapsed=river.state().elapsed;for(let i=0;i<5;i++)frame();assert.equal(river.state().elapsed,elapsed,'reading pauses lantern preview');$('#riverbendClose').onclick();frame();assert(river.state().elapsed>elapsed);$('#riverFestivalStop').onclick();
for(const id of ['cottage','courtyard','lounge','tram']){assert(button.onclick());assert(!$('#riverbendVillageLinks').open);$('#riverbendWalk-'+id).onclick();frame();assert(!river.isOpen);assert(a.seating.active);assert(a.camera.position.equals(position));}
assert(button.onclick());$('#riverbendRewards').onclick();frame();a.seating.stand();frame();assert(!a.blocked(a.camera.position.x,a.camera.position.z));assert(button.hidden);assert.equal(a.getState().rewards.points,points);
const other=a.bridge.seats[0];a.camera.position.set(other.approach.x,1.75,other.approach.z);frame();assert(a.seating.sit());frame();assert(button.hidden);assert.equal(river.open(),false);a.seating.stand();
a.camera.position.set(river.boardPoint.x,1.75,river.boardPoint.z);frame();assert(river.open());$('#riverbendClose').onclick();
console.log('PASS: seated Riverbend stories, saved activity, anchored preview and directions, reading pauses preview, modal guards, unrelated seats and standing access.');
