import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {installCompositionStudio} from '../dist/composition-studio.js';
const nodes=new Map();let dialog,other=false,current=null,allowed=false,pauses=0;
function el(){const handlers={};return {children:[],attrs:{},set id(id){nodes.set(id,this);if(id==='studioMenu')dialog=this},append(...v){this.children.push(...v)},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,f){handlers[k]=f},focus(){document.activeElement=this},showModal(){this.open=true},close(){this.open=false;handlers.close?.()},getContext(){return {fillRect(){},fillText(){}}}};}
const trigger=el(),seatedTrigger=el();globalThis.document={createElement:el,head:el(),body:el(),querySelector:s=>s==='#interact'?trigger:other?{open:true}:dialog?.open?dialog:null};globalThis.requestAnimationFrame=f=>f();globalThis.localStorage={setItem(){throw Error('No storage writes permitted')}};
const camera=new T.PerspectiveCamera();camera.position.set(24,1.75,168.5);const scene=new T.Scene(),colliders=[];
const options={scene,camera,colliders,pause(){pauses++},canUse:()=>allowed,getCurrentSeat:()=>current};const a=installCompositionStudio(options),n=id=>nodes.get(id),click=k=>n('studio'+k).onclick();

assert(!a.open());allowed=true;other=true;assert(!a.open());other=false;assert(a.open());const details=n('studioActivity'),desc=n('studioDescription'),empty=desc.textContent,count=a.root.children.length;click('Circle');assert.equal(desc.textContent,empty);details.open=true;
for(const pos of ['Left','Center','Right']){click(pos);for(const shape of ['Circle','Triangle','Square'])for(const color of ['Rose','Gold','Teal']){click(shape);click(color);assert(desc.textContent.includes(pos+': '+color+', '+shape));}}
click('Finish');assert(desc.textContent.startsWith('Finished.'));click('Rose');assert(!desc.textContent.startsWith('Finished.'));const last=desc.textContent;
dialog.close();assert.equal(document.activeElement,trigger);click('Reset');assert.equal(desc.textContent,last);assert(a.open());assert(!details.open);details.open=true;
allowed=false;click('Reset');allowed=true;camera.position.set(0,1.75,0);click('Reset');current={kind:'composition-studio'};click('Reset');assert.equal(desc.textContent,last);dialog.close();assert(!a.open());current=a.seats[0];assert(a.open(seatedTrigger));details.open=true;click('Reset');assert.equal(desc.textContent,empty);assert(n('studioFinish').disabled);click('Triangle');dialog.close();assert.equal(document.activeElement,seatedTrigger);assert.equal(count,a.root.children.length);
installCompositionStudio({...options,scene:new T.Scene(),colliders:[]});assert.equal(n('studioDescription').textContent,empty);console.log('PASS studio shapes/colors, text, edit/reset, collapse, reopen, reload, guards, focus and no storage writes.');
