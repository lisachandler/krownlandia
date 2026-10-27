import './school-seating.mjs';
import {installSafari} from '../dist/safari.js';
import {createNavigator} from '../dist/navigation-core.js';
import assert from 'node:assert/strict';
const a=window.krownlandia,$=s=>document.querySelector(s),lounge=a.lounges.spots.find(s=>s.id==='safari');let target=null;
const ride=installSafari({scene:new a.scene.constructor(),camera:a.camera,pause:()=>{},onExit:()=>{},takePhoto:()=>{},getLounge:()=>lounge,guideToPoint:p=>target=p});
const after=$('#safariAfterRide'),button=$('#safariLounge'),before=JSON.stringify(a.lounges.collection()),points=a.getState().rewards.points;
button.onclick();assert.equal(target,null);assert(after.hidden);ride.board();
let steps=0;while(ride.active&&steps++<500){assert(after.hidden);button.onclick();assert.equal(target,null);if(ride.state().phase==='stop')$('#safariNext').onclick();ride.update(.1,false,steps*100);}
assert(ride.completed);assert(!ride.active);assert(!after.hidden);assert(!after.open);assert($('#safariLoungeInfo').textContent.includes(lounge.snack));assert($('#safariLoungeInfo').textContent.includes(lounge.souvenir));
const position=a.camera.position.clone();assert(createNavigator(a.blocked).route({x:position.x,z:position.z},{x:lounge.x,z:lounge.z+1.3}).length>0);
after.open=true;button.onclick();assert.equal(target.name,lounge.name);assert.equal(target.z,lounge.z+1.3);assert(after.hidden);assert($('#safari').hidden);assert(a.camera.position.equals(position));assert.equal(a.getState().rewards.points,points);assert.equal(JSON.stringify(a.lounges.collection()),before);
target=null;button.onclick();assert.equal(target,null);ride.board();assert(after.hidden);assert(!after.open);ride.exit();assert(after.hidden);
console.log('PASS: lounge appears only after safari completion, correct descriptions and navigable target, no automatic collection/movement/rewards, close/reboard/early-exit guards.');
