import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {installEldergrove} from '../dist/eldergrove.js';
import {createRewards} from '../dist/rewards-core.js';
const data=new Map(),model=createRewards({getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)});
let guided=null,calls=0;
const camera=new T.PerspectiveCamera();
const forest=installEldergrove({scene:new T.Scene(),camera,colliders:[],pause(){},rewards:{state:model.state,recordEldergrove(id){calls++;model.recordEldergrove(id)},guideTo(id){guided=id},guideToPoint(p){guided=p.name}}});
const $=s=>document.querySelector(s),move=p=>camera.position.set(p.x,1.75,p.z);
assert.equal(forest.open(),false);
for(const [i,p] of forest.points.entries()){
 move(p);$('#eldergroveDiscover').onclick();assert.equal(calls,i,'closed panel cannot record');
 assert(forest.open());assert.equal(forest.open(),false);assert($('#eldergroveStatus').textContent.includes(i+' / 3'));
 const position=camera.position.clone();camera.position.set(0,1.75,0);$('#eldergroveDiscover').onclick();$('#eldergroveRewards').onclick();assert.equal(calls,i);assert.equal(guided,null);camera.position.copy(position);
 $('#eldergroveDiscover').onclick();$('#eldergroveDiscover').onclick();assert.equal(calls,i+1,'one explicit record per stop');
 assert.equal(model.state().points,0,'discovery never claims points');
 $('#eldergroveClose').onclick();
}
assert(forest.open());assert($('#eldergroveStatus').textContent.includes('20-point task reward is ready'));assert.equal($('#eldergroveRewards').textContent,'Find my 20-point forest reward');
const before=JSON.stringify(model.state());$('#eldergroveRewards').onclick();assert.equal(guided,'eldergrove');assert.equal(JSON.stringify(model.state()),before);assert(!forest.isOpen);
guided=null;$('#eldergroveTram').onclick();$('#eldergroveNext').onclick();assert.equal(guided,null,'closed panel cannot replace directions');
assert.equal(model.claim('eldergrove','task','eldergrove'),20);assert(forest.open());assert($('#eldergroveStatus').textContent.includes('task reward are collected'));assert.equal($('#eldergroveRewards').textContent,'Find Eldergrove rewards');assert($('#eldergroveDiscover').disabled);
assert.equal(model.claim('eldergrove','task','eldergrove'),0);assert.equal(model.state().points,20);
assert.equal(createRewards({getItem:k=>data.get(k)}).status('eldergrove').claimed,true);
console.log('PASS: three explicit discoveries, duplicate/closed/remote guards, ready and claimed reward messages, read-only directions, persisted completion and no duplicate points.');
