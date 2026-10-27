import './school-seating.mjs';
import {installCircus} from '../dist/circus.js';
import assert from 'node:assert/strict';
const a=window.krownlandia,$=s=>document.querySelector(s);let guides=[],pauses=0,claimed=false;
const c=installCircus({scene:new a.scene.constructor(),camera:a.camera,colliders:[],guideTo:id=>guides.push(id),guideToPoint:p=>guides.push(p.name),pause:()=>pauses++,rewardClaimed:()=>claimed,getSeats:()=>[{name:'Audience bench',approach:{x:35,z:-61}}]});
a.camera.position.set(39,1.75,-57);
const click=id=>$('#'+id).onclick(),open=()=>click('circusProgramButton');
for(const id of ['circusProgramWatch','circusProgramEntrance','circusProgramSeat','circusProgramPopcorn','circusProgramReward','circusProgramClose','circusReplay','circusReward'])click(id);
assert(!c.active);assert.equal(guides.length,0);assert.equal(pauses,0);
open();click('circusProgramWatch');assert(c.active);assert(!c.isOpen);click('circusReward');assert.equal(guides.length,0);
open();assert($('#circusProgramWatch').disabled);click('circusProgramWatch');assert(c.isOpen);c.update(36,true);assert(!c.completed);click('circusProgramClose');c.update(36,false);assert(c.completed);
open();assert.equal(click('circusReplay'),false);click('circusReward');assert.equal(guides.length,0);click('circusProgramClose');assert(click('circusReplay'));assert(c.active);c.update(36,false);
claimed=true;click('circusReward');assert.equal(guides.length,0);claimed=false;click('circusReward');assert.deepEqual(guides,['circus']);click('circusReward');assert.equal(guides.length,1);
for(const id of ['circusProgramEntrance','circusProgramSeat','circusProgramPopcorn']){open();click(id);assert(!c.isOpen);const n=guides.length;click(id);assert.equal(guides.length,n);}
assert.deepEqual(guides,['circus','Crown Circus entrance','Audience bench','Circus popcorn stand']);
console.log('PASS: closed/disabled program actions, finished-show replay and reward guards, modal pause, normal starts and directions.');
