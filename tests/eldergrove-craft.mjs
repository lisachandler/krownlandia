import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
const nodes=new Map();
function el(){return {children:[],attrs:{},set id(id){nodes.set(id,this)},append(...xs){this.children.push(...xs)},setAttribute(k,v){this.attrs[k]=v},showModal(){this.open=true},close(){this.open=false},focus(){document.activeElement=this},getContext(){return {fillRect(){},fillText(){}}}};}
globalThis.document={createElement:el,head:el(),body:el()};
const {installEldergrove}=await import('../dist/eldergrove.js');
let seat=null,records=0;const camera=new T.PerspectiveCamera();camera.position.set(46,1.75,119);
const grove=installEldergrove({scene:new T.Scene(),camera,colliders:[],pause(){},getCurrentSeat:()=>seat,rewards:{state:()=>({done:[],claims:[],saved:true}),recordEldergrove(){records++}}});
const n=id=>nodes.get('eldergrove'+id),click=id=>n('Craft-'+id).onclick();
assert(grove.open());assert.equal(n('Craft').open,false);assert.equal(n('Craft').hidden,false);click('oval');assert.match(n('CraftStatus').textContent,/Step 1/);n('Craft').open=true;click('leaf');click('finish');assert.match(n('CraftStatus').textContent,/Step 1/);
for(const shape of ['oval','square'])for(const motif of ['leaf','branches']){click(shape);assert.equal(n('Craft-'+shape).attrs['aria-pressed'],'true');click(motif);assert.equal(document.activeElement,n('Craft-finish'));click('finish');assert.match(n('CraftStatus').textContent,new RegExp('Finished: '+shape+' plaque with '+motif));const text=n('CraftStatus').textContent;click('oval');click('leaf');click('finish');assert.equal(n('CraftStatus').textContent,text);click('reset');assert.equal(document.activeElement,n('Craft-oval'));assert(n('CraftPreview').hidden);}
click('square');n('Close').onclick();click('branches');assert.match(n('CraftStatus').textContent,/Step 2/);grove.open();assert.equal(n('Craft').open,false);n('Craft').open=true;camera.position.set(0,1.75,0);click('branches');assert.match(n('CraftStatus').textContent,/Step 2/);seat=grove.seats[2];click('branches');click('finish');assert.match(n('CraftStatus').textContent,/Finished/);assert.equal(records,0);assert.equal(grove.collection().length,0);
n('Close').onclick();seat=grove.seats[0];grove.open();assert(n('Craft').hidden);n('Craft').open=true;click('reset');assert.match(n('CraftStatus').textContent,/Finished/);assert.equal(n('CraftStatus').attrs.role,'status');
console.log('PASS four woodcraft designs, progression and repeat guards, focus, closed/collapsed/distant/wrong-topic guards, craft-bench access and unchanged discoveries/keepsakes. DOM simulation only.');
