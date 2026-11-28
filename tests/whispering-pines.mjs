import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from '../dist/vendor/three.module.js';
import {installWhisperingPines} from '../dist/whispering-pines.js';
const nodes=new Map();let dialog,other=false,current=null,allowed=false,pauses=0;
function el(){const handlers={};return {children:[],attrs:{},set id(id){nodes.set(id,this);if(id==='pinesMenu')dialog=this},append(...v){this.children.push(...v)},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,f){handlers[k]=f},focus(){document.activeElement=this},showModal(){this.open=true},close(){this.open=false;handlers.close?.()},getContext(){return {fillRect(){},fillText(){}}}};}
const trigger=el(),seatedTrigger=el();globalThis.document={createElement:el,head:el(),body:el(),querySelector:s=>s==='#interact'?trigger:other?{open:true}:dialog?.open?dialog:null};globalThis.requestAnimationFrame=f=>f();globalThis.localStorage={setItem(){throw Error('No storage writes permitted')}};
const camera=new T.PerspectiveCamera();camera.position.set(39,1.75,166.5);const scene=new T.Scene(),colliders=[];
const options={scene,camera,colliders,pause(){pauses++},canUse:()=>allowed,getCurrentSeat:()=>current};const a=installWhisperingPines(options),n=id=>nodes.get(id),click=i=>n('pinesPrompt'+i).onclick();
assert(!a.open());allowed=true;other=true;assert(!a.open());other=false;assert(a.open());assert.equal(document.activeElement,n('pinesClose'));assert(!n('pinesPrompts').open);const empty=n('pinesStory').textContent;click(0);assert.equal(n('pinesStory').textContent,empty);n('pinesPrompts').open=true;
const count=a.root.children.length,materials=new Set(a.root.children.map(x=>x.material)).size;
for(let repeat=0;repeat<10;repeat++)for(let i=0;i<3;i++){click(i);assert.equal(n('pinesPrompt'+i).attrs['aria-pressed'],'true');assert.match(n('pinesStory').textContent,/Imagine/);}
const last=n('pinesStory').textContent;n('pinesClose').onclick();assert.equal(document.activeElement,trigger);click(0);assert.equal(n('pinesStory').textContent,last);assert(a.open());assert(!n('pinesPrompts').open);assert.equal(n('pinesStory').textContent,last);n('pinesPrompts').open=true;
allowed=false;click(0);assert.equal(n('pinesStory').textContent,last);allowed=true;camera.position.set(0,1.75,0);click(0);assert.equal(n('pinesStory').textContent,last);current={kind:'whispering-pines'};click(0);assert.equal(n('pinesStory').textContent,last);n('pinesClose').onclick();assert(!a.open());
current=a.seats[0];assert(a.open(seatedTrigger));n('pinesPrompts').open=true;click(0);assert.match(n('pinesStory').textContent,/small welcome/);dialog.close();assert.equal(document.activeElement,seatedTrigger);assert.equal(a.root.children.length,count);assert.equal(new Set(a.root.children.map(x=>x.material)).size,materials);assert.equal(a.bounds.length,5);assert.equal(n('pinesStory').attrs.role,'status');assert(pauses>0);
for(const mesh of a.root.children.filter(x=>x.geometry.type==='ConeGeometry')){assert.equal(mesh.geometry.parameters.radius,1.2);assert.equal(mesh.position.y-mesh.geometry.parameters.height/2,2.4);}
current=null;installWhisperingPines({...options,scene:new T.Scene(),colliders:[]});assert.equal(n('pinesStory').textContent,empty);
console.log('PASS three optional prompts, collapse/reopen/reload, standing and exact-seat guards, inactive-play/dialog guards, close/Escape-path focus, fixed geometry/material counts and no storage writes. DOM simulation only.');

const craft=n('pinesInlay'),state=n('pinesInlayStatus'),choose=i=>n('pinesInlayMaterial'+i).onclick(),place=i=>n('pinesInlaySlot'+i).onclick();
camera.position.set(39,1.75,166.5);
assert(n('pinesInlayReset').disabled);
assert(!craft.open);place(0);assert.match(state.textContent,/0 of 3/);
craft.open=true;place(0);assert.match(state.textContent,/0 of 3/,'closed dialog cannot change craft');
const inlayOptions={...options,scene:new T.Scene(),colliders:[]},inlay=installWhisperingPines(inlayOptions);
const panel=n('pinesInlay'),status=n('pinesInlayStatus');
assert(inlay.open());assert(!panel.open);place(0);assert.match(status.textContent,/0 of 3/);
panel.open=true;place(0);choose(1);place(1);place(2);assert.match(status.textContent,/ends differ/);
choose(0);place(2);assert.match(status.textContent,/ends match and the center contrasts/);
camera.position.set(0,1.75,0);place(1);assert.match(status.textContent,/center contrasts/);
camera.position.set(39,1.75,166.5);n('pinesInlayReset').onclick();assert.match(status.textContent,/0 of 3/);assert.equal(document.activeElement,n('pinesInlaySlot0'));
place(0);dialog.close();
current=inlay.seats[0];assert(inlay.open(seatedTrigger));assert(!panel.open);assert.match(status.textContent,/0 of 3/);
panel.open=true;place(1);assert.match(n('pinesInlaySlot1').textContent,/Pinewood/);dialog.close();assert.equal(document.activeElement,seatedTrigger);
assert.equal(inlay.root.children.length,count);assert.equal(inlay.bounds.length,5);
console.log('PASS: inlay choices, contrast feedback, remote and collapsed guards, fresh reopen, seated access, and fixed geometry.');

current=null;camera.position.set(39,1.75,166.5);assert(inlay.open());
const workshop=n('pinesWorkshop'),stage=n('pinesWorkshopStage'),draft=n('pinesWorkshopDraft');
const visible=()=>draft.children.filter(line=>!line.hidden);
const pick=i=>n('pinesWorkshopChoice'+i).onclick();assert(!workshop.open);pick(0);assert(draft.hidden);
workshop.open=true;pick(1);assert.match(stage.textContent,/discovery/);
camera.position.set(0,1.75,0);pick(1);assert.equal(visible().length,1);
camera.position.set(39,1.75,166.5);pick(1);pick(0);
assert.match(stage.textContent,/complete/);
assert.deepEqual(visible().map(el=>el.textContent),['A visitor began the morning under the pines.','Along the path, they heard a bell ringing softly beyond the trees.','A neighbor joined them, and they walked together to see what was ahead.']);
assert.equal(document.activeElement,n('pinesWorkshopUndo'));pick(0);assert.equal(visible().length,3);
n('pinesWorkshopUndo').onclick();assert.match(stage.textContent,/ending/);assert.equal(visible().length,2);
n('pinesWorkshopReset').onclick();assert(draft.hidden);assert.equal(document.activeElement,n('pinesWorkshopChoice0'));
pick(0);dialog.close();pick(0);assert.equal(visible().length,1);
current=inlay.seats[0];assert(inlay.open(seatedTrigger));assert(!workshop.open&&draft.hidden);
workshop.open=true;pick(0);assert.match(draft.children[0].textContent,/beside the river/);
dialog.close();assert.equal(document.activeElement,seatedTrigger);
assert.equal(inlay.root.children.length,count);
console.log('PASS: storytelling choices, coherent three-part recap, undo, restart, seated access and collapsed/remote/closed guards.');

const link=n('pinesWorkshopPaper');
assert(workshop.children.some(row=>row.children.includes(link)));
assert.equal(link.href,'/reports/pines-story-workshop.html');assert.equal(link.rel,'noopener');assert.equal(link.target,'_blank');
const page=readFileSync(new URL('../dist'+link.href,import.meta.url),'utf8');
assert.match(page,/@michaelnottoli in the historical inventory \(page 13\)/);
assert.doesNotMatch(page,/<script\b|<form\b/);
const paper=[...page.matchAll(/<h2 id="(?:beginning|discovery|ending)">[^<]+<\/h2><ul>([\s\S]*?)<\/ul>/g)]
 .map(([,section])=>[...section.matchAll(/<li><b>([^<]+):<\/b> ([^<]+)<\/li>/g)].map(m=>m.slice(1)));
assert.deepEqual(paper.map(group=>group.length),[2,2,2]);
assert(inlay.open(seatedTrigger));assert(!workshop.open);
workshop.open=true;
for(const beginning of [0,1])for(const middle of [0,1])for(const end of [0,1]){
 const choices=[beginning,middle,end];
 for(const [i,choice] of choices.entries()){
  assert.equal(n('pinesWorkshopChoice'+choice).textContent,paper[i][choice][0]);pick(choice);
 }
 assert.deepEqual(visible().map(el=>el.textContent),choices.map((choice,i)=>paper[i][choice][1]));
 n('pinesWorkshopReset').onclick();
}
console.log('PASS: both formats use the same six lines and support all eight story combinations.');
