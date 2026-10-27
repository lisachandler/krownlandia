import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
import {createNavigator} from '../dist/navigation-core.js';
const a=window.krownlandia,$=s=>document.querySelector(s),planner=createNavigator(a.blocked),open=()=>$('#communityWalkButton').onclick();
a.camera.position.set(0,1.75,30);frame();const before=a.camera.position.clone(),progress=JSON.stringify(a.getState().rewards),collection=JSON.stringify(a.lounges.collection());
const groups={community:['office','produce','square','library'],riverbend:['riverbend','bridge','school'],eldergrove:['eldergrove','clubhouse']};
let stale;
for(const [route,ids] of Object.entries(groups)){
 open();$('#communityWalkRest').open=true;$('#communityWalkRoute-'+route).onclick();const rest=$('#communityWalkRest');assert(!rest.hidden&&!rest.open);assert.equal(rest.children[1].children.length,ids.length*2);
 const paragraphs=rest.children[1].children.filter(n=>typeof n.onclick!=='function').map(n=>n.textContent);
 for(const id of ids){const lounge=a.lounges.spots.find(s=>s.id===id),target={x:lounge.x,z:lounge.z+1.3};assert(paragraphs.includes(lounge.snack+' · '+lounge.souvenir));assert(planner.route(a.communityWalk.stops.find(s=>s.id===id).point,target).length,'reachable lounge '+id);rest.open=true;const button=$('#communityWalkLounge-'+id);button.onclick();frame();assert(!a.communityWalk.isOpen);assert($('#guide').textContent.includes(lounge.name));assert(a.camera.position.equals(before));const guide=$('#guide').textContent;button.onclick();assert.equal($('#guide').textContent,guide);open();assert(!rest.open);stale=button;}
 $('#communityWalkUnfinished').onclick();assert.equal(rest.children[1].children.length,ids.length*2,'breaks stay available with activity filtering');$('#communityWalkUnfinished').onclick();$('#communityWalkClose').onclick();
}
open();$('#communityWalkRoute-community').onclick();const guide=$('#guide').textContent;stale.onclick();assert(a.communityWalk.isOpen);assert.equal($('#guide').textContent,guide,'previous route controls are inert');$('#communityWalkRest').open=true;open();assert($('#communityWalkRest').open,'duplicate open preserves expanded details');$('#communityWalkClose').onclick();
assert.equal(JSON.stringify(a.getState().rewards),progress);assert.equal(JSON.stringify(a.lounges.collection()),collection);assert(!a.lounges.seated);
open();const replacedLounge=$('#communityWalkLounge-office');$('#communityWalkUnfinished').onclick();replacedLounge.onclick();assert(a.communityWalk.isOpen);assert.equal($('#guide').textContent,guide,'replaced same-route lounge controls are inert');$('#communityWalkClose').onclick();
console.log('PASS: all three walks show matching live lounge snacks and souvenirs, reachable approaches, collapsed reopening/route changes, filter compatibility and read-only guarded directions.');
