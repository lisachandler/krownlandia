import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {installGraphics} from '../dist/graphics.js';
const nodes=new Map(),events={};const element=()=>({set id(v){nodes.set(v,this)},append(){},setAttribute(){},showModal(){this.open=true},close(){this.open=false}});
globalThis.document={head:element(),body:element(),createElement:element,querySelector(s){const id=s.replace('#','');if(!nodes.has(id))nodes.set(id,element());return nodes.get(id);}};
let writes=0,stored='balanced',disposals=0,traversals=0;globalThis.localStorage={getItem:()=>stored,setItem:(k,v)=>{stored=v;writes++;}};globalThis.devicePixelRatio=2;globalThis.addEventListener=(name,fn)=>events[name]=fn;
const ratios=[],renderer={shadowMap:{enabled:true},setPixelRatio:r=>ratios.push(r)},sun={shadow:{map:{dispose(){disposals++}},mapSize:{x:2048,set(x,y){this.x=x;this.y=y;}}}},scene={traverse(){traversals++}};
const graphics=installGraphics({renderer,sun,scene,pause(){}}),choose=id=>nodes.get('graphics-'+id).onclick();
assert.equal(graphics.selected,'balanced');assert.deepEqual(ratios,[1.25]);assert.equal(disposals,1);const savedWrites=writes;
events.resize();events.resize();assert.deepEqual(ratios,[1.25]);assert.equal(writes,savedWrites);assert.equal(disposals,1);
devicePixelRatio=1;events.resize();assert.deepEqual(ratios,[1.25,1]);assert.equal(graphics.selected,'balanced');assert.equal(writes,savedWrites);
renderer.shadowMap.needsUpdate=false;sun.shadow.needsUpdate=false;choose('balanced');assert.equal(ratios.length,2);assert.equal(renderer.shadowMap.needsUpdate,false);assert.equal(sun.shadow.needsUpdate,false);
choose('lightweight');assert.equal(renderer.shadowMap.enabled,false);assert.equal(traversals,1);devicePixelRatio=3;events.resize();assert.equal(ratios.at(-1),1);
choose('detailed');assert.equal(renderer.shadowMap.enabled,true);assert.equal(ratios.at(-1),1.6);assert.equal(sun.shadow.mapSize.x,2048);assert.equal(stored,'detailed');
devicePixelRatio=.75;events.resize();assert.equal(ratios.at(-1),.75);devicePixelRatio=NaN;events.resize();assert.equal(ratios.at(-1),1);
console.log('PASS: restored quality caps, display-density changes, unchanged resize/selection avoids resolution resets, no resize storage writes, shadow transitions and invalid-density fallback.');

const world=readFileSync(new URL('../dist/world.js',import.meta.url),'utf8');
const resizeSource=world.match(/function resizeViewport\(\)\{[\s\S]*?\n\}/)[0];
const dimensions=[],viewportRenderer={setSize(w,h){dimensions.push([w,h]);}};let projections=0;
const camera={aspect:1280/800,updateProjectionMatrix(){projections++;}};
const resize=new Function('renderer','camera','let viewportWidth=1280,viewportHeight=800;'+resizeSource+'\nreturn resizeViewport;')(viewportRenderer,camera);
for(const [width,height] of [[1280,800],[800,0],[0,800],[NaN,800],[640,400],[640,400],[390,844],[390,844]]){
 globalThis.innerWidth=width;globalThis.innerHeight=height;resize();
}
assert.deepEqual(dimensions,[[640,400],[390,844]]);
assert.equal(camera.aspect,390/844);assert.equal(projections,1);
console.log('PASS: zero-sized and duplicate events leave the canvas intact; changed aspect and size recover correctly.');
