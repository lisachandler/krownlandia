import './school-seating.mjs';
import {installJourney} from '../dist/journey.js';
import {installSafari} from '../dist/safari.js';
import assert from 'node:assert/strict';
const a=window.krownlandia,$=s=>document.querySelector(s),points=a.getState().rewards.points;
for(const [id,install,action,returnPoint] of [['journey',installJourney,'journeyAction',[-29,1.75,-33]],['safari',installSafari,'safariNext',[47,1.75,-24]]]){
 let exits=0;const ride=install({scene:new a.scene.constructor(),camera:a.camera,colliders:[],pause:()=>{},onExit:()=>exits++,takePhoto:()=>{}});
 const moveAway=()=>{a.camera.position.set(8,1.75,22);return a.camera.position.clone();};
 let position=moveAway();ride.exit();$('#'+id+'Exit').onclick();assert(a.camera.position.equals(position));assert.equal(exits,0);
 ride.board();ride.update(.1,false,100);ride.exit();assert(!ride.active);assert.deepEqual(a.camera.position.toArray(),returnPoint);assert.equal(exits,1);assert(!ride.completed);
 position=moveAway();ride.exit();assert(a.camera.position.equals(position));assert.equal(exits,1);
 ride.board();let steps=0;while(ride.active&&steps++<500){if(ride.state().phase==='stop')$('#'+action).onclick();ride.update(.1,false,steps*100);}
 assert(ride.completed);assert.equal(exits,2);position=a.camera.position.clone();ride.exit();assert($('#'+id).hidden);assert(a.camera.position.equals(position));assert.equal(exits,2,'closing completion does not repeat onExit');
 position=moveAway();ride.exit();assert(a.camera.position.equals(position));assert.equal(exits,2);assert(ride.completed,'earned completion survives dismissal');
 ride.board();assert(ride.active);ride.exit();assert.equal(exits,3);
}
assert.equal(a.getState().rewards.points,points);
console.log('PASS: both rides ignore idle/repeated exits, preserve normal early returns, close completion without moving or repeating callbacks, retain completion and allow reboarding.');
