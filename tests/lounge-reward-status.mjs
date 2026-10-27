import './school-seating.mjs';
import assert from 'node:assert/strict';
import {installLounges} from '../dist/lounges.js';
import {STATIONS} from '../dist/rewards-core.js';
const a=window.krownlandia,$=s=>document.querySelector(s),state={done:[],claims:[]};let target=null;
const lounges=installLounges({scene:new a.scene.constructor(),camera:a.camera,colliders:[],blocked:()=>false,pause(){},seat(){},stand(){},guideTo:p=>target=p,getRewardState:()=>state});
for(const spot of lounges.spots){const station=STATIONS.find(s=>s.id===spot.id);a.camera.position.set(spot.x,1.75,spot.z+1.3);assert(lounges.open(spot));assert.equal($('#loungeRewards').textContent,'Find location rewards');$('#loungeClose').onclick();state.done.push(station.task.id);assert(lounges.open(spot));assert.equal($('#loungeRewards').textContent,'Find my '+station.task.points+'-point task reward');const before=JSON.stringify(state);$('#loungeRewards').onclick();assert.equal(JSON.stringify(state),before);assert.deepEqual(target,{x:station.x,z:station.z,name:station.name+' rewards'});state.claims.push(station.id+':task');assert(lounges.open(spot));assert.equal($('#loungeRewards').textContent,'Revisit rewards station · task claimed');$('#loungeClose').onclick();state.done=[];state.claims=[];}
assert.deepEqual(lounges.collection(),[]);
console.log('PASS: all lounge task rewards distinguish unfinished, ready and claimed state on reopening, with exact point amounts and read-only station directions.');
