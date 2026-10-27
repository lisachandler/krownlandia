import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {createRewards} from '../dist/rewards-core.js';
import {installBuilders} from '../dist/builders.js';
const nodes=new Map(),saved=new Map();
function element(){return {children:[],set id(value){this._id=value;nodes.set(value,this)},get id(){return this._id},append(...items){this.children.push(...items)},replaceChildren(...items){this.children=items},setAttribute(){},showModal(){this.open=true},close(){this.open=false},getContext(){return {fillRect(){},strokeRect(){},fillText(){}}}};}
globalThis.document={createElement:element,head:element(),body:element()};
const storage={getItem:key=>saved.get(key),setItem:(key,value)=>saved.set(key,value)};
const camera=new T.PerspectiveCamera();camera.position.set(-26,1.75,30);let target;
const setup=()=>{const model=createRewards(storage);const rewards={state:model.state,recordBuildersPage:id=>model.mark('builders-page-'+id),completeBuilders:()=>model.mark('builders-story'),guideTo:id=>{target=id}};return {model,exhibit:installBuilders({scene:new T.Scene(),camera,colliders:[],pause(){},rewards})};};
let {model,exhibit}=setup();exhibit.open();assert(model.state().done.includes('builders-page-0'));assert(nodes.get('buildersClaim').disabled);
nodes.get('buildersChapter-1').onclick();nodes.get('buildersClose').onclick();
({model,exhibit}=setup());assert(model.state().done.includes('builders-page-0'));assert(model.state().done.includes('builders-page-1'));assert(!model.state().done.includes('builders-page-2'));
exhibit.open();assert(nodes.get('buildersStory').children[0].textContent==='The current 3D prototype');assert(!nodes.get('buildersClaim').disabled);assert.equal(exhibit.collection().length,0);assert(!model.status('builders').ready);
camera.position.set(0,1.75,0);nodes.get('buildersClaim').onclick();assert.equal(exhibit.collection().length,0);
camera.position.set(-26,1.75,30);nodes.get('buildersClaim').onclick();nodes.get('buildersClaim').onclick();assert.equal(exhibit.collection().length,1);assert.equal(model.state().points,0);assert(nodes.get('buildersStatus').textContent.includes('20-point task reward is ready'));
nodes.get('buildersRewards').onclick();assert.equal(target,'builders');assert(!exhibit.isOpen);assert.equal(model.state().points,0);
assert.equal(model.claim('builders','task','builders'),20);assert.equal(model.claim('builders','task','builders'),0);exhibit.open();assert(nodes.get('buildersStatus').textContent.includes('already collected'));
// Older saves containing only the collected crown remain complete.
const key=[...saved.keys()][0];saved.set(key,JSON.stringify({done:['builders-story'],claims:[]}));({model,exhibit}=setup());exhibit.open();assert.equal(exhibit.collection().length,1);assert(nodes.get('buildersClaim').disabled);assert(nodes.get('buildersChapters').children.every(b=>b.textContent.startsWith('✓ ')));
console.log('PASS: history chapters persist across reload, resume at next unread, require crown collection in person, guide to rewards, award once, and preserve legacy crowns.');
