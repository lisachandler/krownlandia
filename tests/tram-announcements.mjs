import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {installTram} from '../dist/tram.js';

const nodes=new Map(),messages=[];
function element(){
 const node={children:[],attrs:{},append(...children){this.children.push(...children)},replaceChildren(){this.children=[];},setAttribute(k,v){this.attrs[k]=v;},showModal(){this.open=true;},close(){this.open=false;},focus(){document.activeElement=this;},getContext(){return {fillRect(){},fillText(){}};}};
 let id='',text='';
 Object.defineProperties(node,{id:{set(value){id=value;nodes.set('#'+id,this);}},textContent:{get(){return text;},set(value){text=value;if(id==='tramAnnouncement')messages.push(value);}}});
 return node;
}
globalThis.document={createElement:element,querySelector(s){if(!nodes.has(s))nodes.set(s,element());return nodes.get(s)},head:element(),body:element()};
const camera=new T.PerspectiveCamera(),scene=new T.Scene(),at=(x,z)=>camera.position.set(x,1.75,z);
const tram=installTram({scene,camera,beforeBoard(){},pause(){},guideTo(){},canBoard:()=>true,onExit:({x,z})=>at(x,z)});
const $=s=>document.querySelector(s);
const pause=$('#tramPause'),cancel=$('#tramCancel'),dock=$('#tramRide'),world=$('#world');
assert.equal($('#tramAnnouncement').attrs.role,'status');
assert(document.body.children.includes($('#tramAnnouncement')),'arrival region remains outside the disappearing dock');
at(2.2,36);tram.open();$('#tramTo-meadow').onclick();
assert.equal(document.activeElement,pause);assert.equal(messages.at(-1),'Riding to Meadow Village.');
for(let i=0;i<20;i++)tram.update(.1,false);
assert.equal(messages.length,1);
pause.onclick();assert.equal(messages.at(-1),'Paused · Meadow Village.');
const stopped=camera.position.clone();tram.update(.1,false);assert(camera.position.equals(stopped));
pause.onclick();assert.equal(messages.at(-1),'Riding to Meadow Village.');
tram.update(30,false);assert(dock.hidden);assert.equal(messages.at(-1),'Arrived at Meadow Village.');
assert.equal(document.activeElement,world);assert.equal(camera.position.x,-29+2.2);
tram.open();$('#tramTo-park').onclick();cancel.focus();cancel.onclick();
assert(dock.hidden);assert.equal(messages.at(-1),'Returned to Meadow Village.');assert.equal(document.activeElement,world);
pause.onclick();assert.equal(messages.at(-1),'Returned to Meadow Village.');
tram.open();$('#tramTo-park').onclick();const different=element();different.focus();
tram.update(30,false);assert.equal(document.activeElement,different);assert.equal(messages.at(-1),'Arrived at Park entrance.');
console.log('PASS: tram announces intentional transitions without per-frame repetition and returns focus only from disappearing ride controls.');
