import './school-seating.mjs';
import {installCircus} from '../dist/circus.js';
import assert from 'node:assert/strict';
const a=window.krownlandia,$=s=>document.querySelector(s);let guides=[],pauses=0,claimed=false;
const scene=new a.scene.constructor();
const c=installCircus({scene,camera:a.camera,colliders:[],guideTo:id=>guides.push(id),guideToPoint:p=>guides.push(p.name),pause:()=>pauses++,rewardClaimed:()=>claimed,getSeats:()=>[{name:'Audience bench',approach:{x:35,z:-61}}]});
a.camera.position.set(39,1.75,-57);
const click=id=>$('#'+id).onclick(),open=()=>click('circusProgramButton');
for(const id of ['circusProgramWatch','circusProgramEntrance','circusProgramSeat','circusProgramPopcorn','circusProgramReward','circusProgramClose','circusReplay','circusReward'])click(id);
assert(!c.active);assert.equal(guides.length,0);assert.equal(pauses,0);
open();click('circusProgramWatch');assert(c.active);assert(!c.isOpen);click('circusReward');assert.equal(guides.length,0);
open();assert($('#circusProgramWatch').disabled);click('circusProgramWatch');assert(c.isOpen);c.update(36,true);assert(!c.completed);click('circusProgramClose');c.update(36,false);assert(c.completed);
open();assert.equal(click('circusReplay'),false);click('circusReward');assert.equal(guides.length,0);click('circusProgramClose');assert(click('circusReplay'));assert(c.active);c.update(36,false);
claimed=true;click('circusReward');assert.equal(guides.length,0);claimed=false;click('circusReward');assert.deepEqual(guides,['circus']);click('circusReward');assert.equal(guides.length,1);
for(const id of ['circusProgramEntrance','circusProgramSeat','circusProgramPopcorn']){open();click(id);assert(!c.isOpen);const n=guides.length;click(id);assert.equal(guides.length,n);}
assert.deepEqual(guides,['circus','Krown Circus entrance','Audience bench','Circus popcorn stand']);
console.log('PASS: closed/disabled program actions, finished-show replay and reward guards, modal pause, normal starts and directions.');

const juggler=scene.getObjectByName('Circus juggler'),light=scene.getObjectByName('Circus performance light');
const ball=juggler.children.at(-1),progress=$('#circusProgress');
const setPosition=ball.position.set.bind(ball.position),copyColor=light.color.copy.bind(light.color);
let poses=0,lights=0,progressWrites=0,progressValue=progress.value;
ball.position.set=(...args)=>{poses++;return setPosition(...args);};
light.color.copy=(color)=>{lights++;return copyColor(color);};
Object.defineProperty(progress,'value',{get(){return progressValue;},set(value){progressWrites++;progressValue=value;}});
const counts=()=>[poses,lights,progressWrites];
function steady(paused){
 const before=counts();for(let i=0;i<20;i++)c.update(.05,paused);
 assert.deepEqual(counts(),before);
}
c.update(.05,false);steady(false);
assert(c.start());c.update(1,false);const moving=counts();c.update(1,false);
assert(counts().every((n,i)=>n===moving[i]+1));
click('circusPause');c.update(.05,false);steady(false);
click('circusPause');steady(true);
c.update(34,false);assert(c.completed&&!c.active);assert(juggler.rotation.x>0);steady(false);
click('circusStop');c.update(.05,false);assert.equal(juggler.rotation.x,0);steady(false);
assert.deepEqual(guides,['circus','Krown Circus entrance','Audience bench','Circus popcorn stand']);
console.log('PASS: idle, paused and finished frames avoid duplicate pose, light and progress writes; active motion and pose reset are preserved.');
