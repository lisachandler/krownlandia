import assert from 'node:assert/strict';
import {createMeadowMarket} from '../dist/villages.js';
let nodes,focus;globalThis.document={createElement(){return {children:[],set id(v){nodes.set(v,this)},setAttribute(){},append(...x){this.children.push(...x)},replaceChildren(...x){this.children=x},focus(){focus=this}}}};
for(const pattern of [['apples','carrots','greens'],['apples','apples','apples'],['greens','carrots','greens']]){
 nodes=new Map();let active=true,visits=0;const p=createMeadowMarket(()=>active,()=>visits++),b=id=>nodes.get(id),click=id=>b(id).onclick();
 click('market-apples');assert.equal(b('marketUndo').disabled,true);p.open=true;click('marketVisit');assert.equal(visits,0);
 for(const item of pattern)click('market-'+item);assert.equal(focus,b('marketFinish'));assert.equal(b('market-apples').disabled,true);click('market-apples');assert.equal(b('marketBaskets').children.length,3);
 click('marketUndo');assert.equal(b('marketFinish').disabled,true);click('market-'+pattern[2]);click('marketFinish');assert.equal(focus,b('marketVisit'));assert.match(b('marketStatus').textContent,/Table ready/);assert.equal(b('marketUndo').disabled,true);
 active=false;click('marketVisit');assert.equal(visits,0);active=true;p.open=false;click('marketVisit');assert.equal(visits,0);p.open=true;click('marketVisit');assert.equal(visits,1);
 click('marketReset');assert.equal(focus,b('market-apples'));assert.equal(b('marketVisit').disabled,true);click('market-carrots');click('marketUndo');assert.equal(focus,b('market-apples'));
}
console.log('PASS market combinations, repeat choices, undo, finish, reset, focus and inactive/collapsed guards');
// Exercise the actual village directory and navigation wiring without a renderer.
const {installVillages}=await import('../dist/villages.js');
const T=await import('../dist/vendor/three.module.js');
nodes=new Map();const make=document.createElement;const ctx={fillRect(){},fillText(){},measureText(){return {width:100}}};
document.createElement=()=>Object.assign(make(),{style:{},addEventListener(n,fn){this['on'+n]=fn},getContext(){return ctx},showModal(){this.open=true},close(){this.open=false;this.onclose?.()}});document.head=document.createElement();document.body=document.createElement();const nav=document.createElement();document.querySelector=()=>nav;
let writes=0,guided=null,allowed=true;globalThis.localStorage={getItem(){return null},setItem(){writes++}};
const scene=new T.Scene(),camera=new T.PerspectiveCamera();camera.position.set(0,1.7,28);
const village=installVillages({scene,camera,colliders:[],canCraft:()=>allowed,pause(){},guideTo(p){guided=p},getSouvenirs:()=>[]});
village.open();const panel=nodes.get('meadowMarket');assert.equal(panel.open,false);panel.open=true;
for(const id of ['apples','carrots','greens'])nodes.get('market-'+id).onclick();nodes.get('marketFinish').onclick();nodes.get('marketVisit').onclick();assert.deepEqual(guided,{x:-40,z:97,name:'Meadow Picnic Garden'});assert.equal(village.isOpen,false);assert.equal(writes,0);
village.open();assert.equal(panel.open,false);assert.match(nodes.get('marketStatus').textContent,/Table ready/);assert.equal(writes,0);
console.log('PASS village integration: collapsed reopening, retained table, existing garden destination, closed dialog and no save writes');

nodes.get('villageMenu').close();camera.position.set(-28,1.7,92);allowed=false;village.openCraft();assert(!village.isOpen);allowed=true;village.openCraft();assert(village.isOpen);assert.equal(focus,nodes.get('weaveRose'));allowed=false;nodes.get('weaveRose').onclick();assert.equal(nodes.get('weaveUndo').disabled,true);allowed=true;nodes.get('weaveRose').onclick();assert.equal(nodes.get('weaveUndo').disabled,false);nav.hidden=true;nodes.get('villageMenu').close();assert.equal(nav.hidden,false);assert.equal(focus,nav,'Close returns focus to interaction control');nodes.get('weaveGold').onclick();assert.match(nodes.get('weavingStatus').textContent,/Pattern: rose\./);assert.equal(writes,0);console.log('PASS craft permission guard, stale closed controls, close focus return and zero storage writes');
