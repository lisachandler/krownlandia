import './school-seating.mjs';
import {installLounges} from '../dist/lounges.js';
import assert from 'node:assert/strict';
const a=window.krownlandia,$=s=>document.querySelector(s),key='krownlandia-lounge-souvenirs-v1';
const read=localStorage.getItem,write=localStorage.setItem;
write(key,JSON.stringify(['cafe','library']));
let fail=true,writes=0;
localStorage.getItem=k=>{if(k===key&&fail)throw Error('temporarily unreadable');return read(k);};
localStorage.setItem=(k,v)=>{if(k===key)writes++;write(k,v);};
const l=installLounges({scene:new a.scene.constructor(),camera:a.camera,colliders:[],blocked:()=>false,pause:()=>{},seat:()=>{},stand:()=>{},guideTo:()=>{}});
const spot=l.spots[0],points=a.getState().rewards.points;
a.camera.position.set(spot.x,1.75,spot.z+1.1);l.open(spot);$('#loungeCollect').onclick();
assert.equal(writes,0,'failed read must never replace the prior save');assert(l.collection().some(s=>s.id===spot.id));
$('#loungeRetrySave').onclick();assert.equal(writes,0);assert(!$('#loungeRetrySave').hidden);
fail=false;$('#loungeRetrySave').onclick();
assert.deepEqual(new Set(JSON.parse(read(key))),new Set(['cafe','library',spot.id]));assert.equal(l.collection().length,3);assert($('#loungeRetrySave').hidden);
// A save made by another tab is merged too.
write(key,JSON.stringify(['cafe','library','bridge']));$('#loungeRetrySave').onclick();
assert.deepEqual(new Set(JSON.parse(read(key))),new Set(['cafe','library','bridge',spot.id]));
for(const invalid of ['{broken','{"unexpected":true}']){write(key,invalid);const before=writes;$('#loungeRetrySave').onclick();assert.equal(writes,before);assert.equal(read(key),invalid);assert(!$('#loungeRetrySave').hidden);}
assert.equal(a.getState().rewards.points,points);assert.equal(l.collection().length,4);
localStorage.getItem=read;localStorage.setItem=write;
console.log('PASS: unreadable startup and retry never overwrite prior souvenirs, recovery merges old/new keepsakes, concurrent collections merge, malformed saves remain untouched.');
