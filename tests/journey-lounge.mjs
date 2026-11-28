import './school-seating.mjs';
import {installJourney} from '../dist/journey.js';
import {createNavigator} from '../dist/navigation-core.js';
import assert from 'node:assert/strict';
const a=window.krownlandia,$=s=>document.querySelector(s),lounge=a.lounges.spots.find(s=>s.id==='journey');let target=null;
const scene=new a.scene.constructor();
const ride=installJourney({scene,camera:a.camera,colliders:[],pause:()=>{},onExit:()=>{},getLounge:()=>lounge,guideToPoint:p=>target=p});
const after=$('#journeyAfterRide'),button=$('#journeyLounge'),before=JSON.stringify(a.lounges.collection()),points=a.getState().rewards.points;
button.onclick();assert.equal(target,null);assert(after.hidden);assert(ride.board());
const exhibits=[1,2,3,4,5,6].map(i=>scene.getObjectByName('Great Journey exhibit '+i));
assert(exhibits.every(Boolean));
let writes=0;
for(const exhibit of exhibits){
 const scale=exhibit.scale,set=scale.setScalar.bind(scale),lerp=scale.lerp.bind(scale);
 scale.setScalar=(...args)=>{writes++;return set(...args)};
 scale.lerp=(...args)=>{writes++;return lerp(...args)};
}
for(let i=0;i<20;i++)ride.update(.1,false);
assert.equal(writes,0,'unchanged opening exhibits need no scale writes');
while(ride.state().phase==='travel')ride.update(.1,false);
$('#journeyAction').onclick();ride.update(.1,false);
const expected=.55+(1-.55)*(1-Math.exp(-.1*4));
assert.equal(exhibits[0].scale.x,expected);assert.equal(exhibits[0].scale.y,expected);assert.equal(exhibits[0].scale.z,expected);
assert.equal(writes,1,'only the activated exhibit changes');
let steps=0;while(ride.active&&steps++<500){assert(after.hidden);button.onclick();assert.equal(target,null);if(ride.state().phase==='stop')$('#journeyAction').onclick();ride.update(.1,false);}
assert(ride.completed);assert(!ride.active);assert(!after.hidden);assert(!after.open);assert($('#journeyLoungeInfo').textContent.includes(lounge.snack));assert($('#journeyLoungeInfo').textContent.includes(lounge.souvenir));
const position=a.camera.position.clone();assert(createNavigator(a.blocked).route({x:position.x,z:position.z},{x:lounge.x,z:lounge.z+1.3}).length>0);
after.open=true;button.onclick();assert.equal(target.name,lounge.name);assert.equal(target.z,lounge.z+1.3);assert(after.hidden);assert($('#journey').hidden);assert(a.camera.position.equals(position));assert.equal(a.getState().rewards.points,points);assert.equal(JSON.stringify(a.lounges.collection()),before);
target=null;button.onclick();assert.equal(target,null);ride.board();assert(after.hidden);assert(!after.open);const completedScale=exhibits[0].scale.x;ride.update(.1,false);assert(exhibits[0].scale.x<completedScale,'replay scales exhibits back down');ride.exit();assert(after.hidden);
console.log('PASS: lounge appears only after all Journey chapters, correct descriptions and navigable target, no automatic collection/movement/rewards, close/reboard/early-exit guards.');
