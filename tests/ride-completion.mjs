import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {installJourney} from '../dist/journey.js';
import {installSafari} from '../dist/safari.js';
const nodes=new Map();
function el(){return {set id(v){nodes.set('#'+v,this)},children:[],append(...v){this.children.push(...v)},attributes:{},setAttribute(key,value){this.attributes[key]=value},classList:{values:new Set(),toggle(key,value){if(value)this.values.add(key);else this.values.delete(key)},contains(key){return this.values.has(key)}},getContext(){return {fillRect(){},fillText(){},measureText(text){return {width:text.length*40}}}}};}
globalThis.document={body:el(),createElement:el,querySelector(s){if(!nodes.has(s))nodes.set(s,el());return nodes.get(s)}};
for(const [id,install,action] of [['journey',installJourney,'journeyAction'],['safari',installSafari,'safariNext']]){
 let claimed=false,target=null,exits=0;const camera=new T.PerspectiveCamera();const ride=install({scene:new T.Scene(),camera,colliders:[],pause(){},onExit(){exits++},guideTo:id=>{target=id},rewardClaimed:()=>claimed,takePhoto(){}});const get=name=>document.querySelector('#'+name);
 const tick=()=>{for(let i=0;i<61;i++)ride.update(.1,false,i*100)};
 const complete=()=>{ride.board();for(let i=0;i<6;i++){tick();assert.equal(ride.state().phase,'stop');get(action).onclick();}tick();};
 ride.board();if(id==='journey'){get('journeyCompact').onclick();assert(get(id).classList.contains('journey-minimized'));assert.equal(get('journeyCompact').attributes['aria-expanded'],'false');assert.equal(get('journeyCompact').textContent,'Show details');get('journeyCompact').onclick();assert(!get(id).classList.contains('journey-minimized'));assert.equal(get('journeyCompact').attributes['aria-expanded'],'true');}tick();ride.exit();assert(get(id).hidden);assert.equal(target,null);assert(!ride.completed);
 complete();assert(!ride.active);assert(ride.completed);assert(!get(id).hidden);assert(get(id+'Text').textContent.includes('ready'));assert.equal(get(action).textContent,'Find my reward');assert.equal(get(id+'Exit').textContent,'Close');assert.equal(target,null);assert(!get(action).hidden);
 get(action).onclick();assert.equal(target,id);assert(get(id).hidden);assert.equal(exits,2);
 // Cancelling a replay must not show a completion even after an earlier success.
 ride.board();assert.equal(get(id+'Exit').textContent,'Leave ride');ride.exit();assert(get(id).hidden);
 claimed=true;complete();assert(!get(id).hidden);assert(get(id+'Text').textContent.includes('already collected'));assert(get(action).hidden);camera.position.set(12,1.75,12);get(id+'Exit').onclick();assert(get(id).hidden);assert.equal(camera.position.x,12);assert.equal(camera.position.z,12);
 if(id==='safari'){assert(get('safariPause').hidden);ride.board();assert(!get('safariViewing').hidden);assert(!get('safariCompact').hidden);assert.equal(get('safariNext').textContent,'Continue safari');ride.exit();}
 claimed=false;complete();camera.position.x+=7;ride.update(.01,false,0);assert(!get(id).hidden);camera.position.x+=2;ride.update(.01,false,0);assert(get(id).hidden);assert(ride.completed);assert.equal(target,id);
 console.log('PASS: '+id+' completion, explicit reward navigation, cancel/replay behavior, collected-state message control reset and completion dismissal after walking away.');
}
