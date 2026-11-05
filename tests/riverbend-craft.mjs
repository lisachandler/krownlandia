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
