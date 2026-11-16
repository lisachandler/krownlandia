import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
const nodes=new Map();
function element(tag){return {tag,children:[],attrs:{},set id(id){nodes.set(id,this)},append(...xs){this.children.push(...xs)},setAttribute(k,v){this.attrs[k]=v},replaceChildren(...xs){this.children=xs},showModal(){this.open=true},close(){this.open=false},focus(){document.activeElement=this},getContext(){return {fillRect(){},fillText(){},measureText(){return {width:100}}}}};}
globalThis.document={createElement:element,head:element('head'),body:element('body')};
const {installRiverbend}=await import('../dist/riverbend.js');
const camera=new T.PerspectiveCamera();camera.position.set(-41,1.75,133.5);
let discoveries=0,seat=null;
const river=installRiverbend({scene:new T.Scene(),camera,colliders:[],pause(){},rewards:{state:()=>({claims:[],done:[],saved:true}),completeRiverbend(){discoveries++}},getCurrentSeat:()=>seat});
const $=id=>nodes.get('riverbend'+id),click=id=>$('Craft-'+id).onclick();
assert(river.open());assert.equal($('Craft').open,false);click('bowl');assert.match($('CraftStatus').textContent,/Step 1/);
$('Craft').open=true;click('waves');click('finish');assert.match($('CraftStatus').textContent,/Step 1/);
for(const shape of ['bowl','vase'])for(const pattern of ['waves','dots']){
 click(shape);assert.equal($('Craft-'+shape).attrs['aria-pressed'],'true');assert.match($('CraftStatus').textContent,/Step 2/);
 click(pattern);assert.equal($('Craft-finish').disabled,false);assert($('Vessel').className.includes(pattern));click('finish');assert.match($('CraftStatus').textContent,new RegExp('Finished: your '+shape));
 const finished=$('CraftStatus').textContent;click('bowl');click('dots');click('finish');assert.equal($('CraftStatus').textContent,finished);
 click('reset');assert.equal(document.activeElement,$('Craft-bowl'));assert($('Vessel').hidden);
}
click('vase');$('Close').onclick();click('waves');assert.match($('CraftStatus').textContent,/Step 2/);
river.open();assert.equal($('Craft').open,false);$('Craft').open=true;camera.position.set(0,1.75,0);click('waves');assert.match($('CraftStatus').textContent,/Step 2/);
seat=river.seats[0];click('waves');click('finish');assert.match($('CraftStatus').textContent,/Finished: your vase with river waves/);
assert.equal(discoveries,0,'practice does not alter discovery eligibility');
assert.equal($('CraftStatus').attrs.role,'status');assert.equal($('Vessel').attrs['aria-hidden'],'true');
console.log('PASS: four pottery designs, step guards, finish/restart, focus target, collapsed reopen, closed/distant guards, seated use and unchanged discovery eligibility. DOM simulation only.');

// Basket practice is independent of pottery/rewards.
let writes=0;globalThis.localStorage={getItem(){return null},setItem(){writes++}};
const basket=id=>$('Basket'+id),bclick=id=>basket(id).onclick();
assert.equal(basket('').open,false);bclick('light');assert.match(basket('Status').textContent,/Bands 0/);
basket('').open=true;bclick('arched');bclick('Finish');assert.match(basket('Status').textContent,/Bands 0/);
for(let n=0;n<16;n++)for(const handle of ['arched','low']){
 const bands=Array.from({length:4},(_,i)=>n&(1<<i)?'dark':'light');
 bands.forEach(bclick);assert.equal(document.activeElement,basket('arched'));
 bclick('dark');assert.equal(basket('Preview').children.length,4,'fifth band ignored');
 bclick(handle);assert.equal(document.activeElement,basket('Finish'));
 assert.equal(basket(handle).attrs['aria-pressed'],'true');bclick('Finish');
 assert.equal(document.activeElement,basket('Reset'));assert.match(basket('Status').textContent,new RegExp('Finished basket with a '+handle));
 assert(basket('Status').textContent.includes(bands.join(', ')));const result=basket('Status').textContent;
 for(const id of ['light','Undo','arched','Finish'])bclick(id);assert.equal(basket('Status').textContent,result);
 bclick('Reset');assert.equal(document.activeElement,basket('light'));assert(basket('Preview').hidden);
}
for(let i=0;i<4;i++)bclick('light');bclick('low');bclick('Undo');assert.equal(basket('Finish').disabled,true);assert.equal(basket('low').attrs['aria-pressed'],'false');assert.equal(document.activeElement,basket('light'));
bclick('dark');assert.match(basket('Status').textContent,/Choose a handle/);bclick('arched');bclick('Finish');
const done=basket('Status').textContent;basket('').open=false;bclick('Reset');assert.equal(basket('Status').textContent,done);
$('Close').onclick();basket('').open=true;bclick('Reset');assert.equal(basket('Status').textContent,done);
assert(river.open());assert.equal(basket('').open,false);assert.equal(basket('Status').textContent,done);
basket('').open=true;seat=null;bclick('Reset');assert.equal(basket('Status').textContent,done,'distant guard');
seat=river.seats[0];bclick('Reset');assert.match(basket('Status').textContent,/Bands 0/,'bench access');
assert.equal(discoveries,0);assert.equal(writes,0);assert.equal(basket('Status').attrs.role,'status');assert.equal(basket('Preview').attrs['aria-hidden'],'true');
assert.match($('CraftStatus').textContent,/Finished: your vase/,'pottery independent');
const cast=id=>$('Cast'+id);
const festivalBefore=river.state();
cast('Near').onclick();assert.equal(cast('Reel').disabled,true);
cast('').open=true;seat=null;cast('Far').onclick();assert.equal(cast('Reel').disabled,true);
seat=river.seats[0];
for(const [id,pattern] of [['Near',/ring by the bank/],['Far',/curved wake/]]){
 cast(id).onclick();assert.equal(document.activeElement,cast('Reel'));assert(cast('Near').disabled&&cast('Far').disabled);
 cast(id==='Far'?'Near':'Far').onclick();cast('Reel').onclick();assert.match(cast('Status').textContent,pattern);assert.equal(document.activeElement,cast(id));assert(cast('Reel').disabled);
}
cast('Far').onclick();$('Close').onclick();cast('Reel').onclick();assert.match(cast('Status').textContent,/drifts/);
assert(river.open());assert.equal(cast('').open,false);assert(cast('Reel').disabled);
seat=null;camera.position.set(-41,1.75,133.5);cast('').open=true;cast('Near').onclick();assert.match(cast('Status').textContent,/rests beside/);
cast('').open=false;cast('').ontoggle();assert(cast('Reel').disabled);
assert.deepEqual(river.state(),festivalBefore);assert.equal(discoveries,0);assert.equal(writes,0);
console.log('PASS: both casts, board and bench, guarded actions, focus, reset, and unchanged boat/reward/storage state.');
installRiverbend({scene:new T.Scene(),camera,colliders:[],pause(){},rewards:{state:()=>({claims:[],done:[],saved:true})},getCurrentSeat:()=>null});
assert.equal(basket('').open,false);assert.match(basket('Status').textContent,/Bands 0/,'new page starts empty');
console.log('PASS: all 32 basket patterns/handles, undo invalidation, stage focus, collapsed/closed/distant guards, reopen/reload, seated access, independent pottery and zero storage/reward writes. DOM simulation only.');
