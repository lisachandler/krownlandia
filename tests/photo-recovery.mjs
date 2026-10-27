import assert from 'node:assert/strict';
import {installPhotography} from '../dist/photography.js';
const nodes=new Map(),events={};let lost=false,renders=0,downloads=0,urls=0,callback;
function element(){return {set id(value){nodes.set(value,this)},append(){},setAttribute(){},remove(){},click(){downloads++;}};}
globalThis.document={createElement:element,querySelector:()=>element(),body:element(),head:element()};
globalThis.setTimeout=()=>0;globalThis.clearTimeout=()=>{};
URL.createObjectURL=()=>{urls++;return 'blob:test';};URL.revokeObjectURL=()=>{};
const renderer={getContext:()=>({isContextLost:()=>lost}),render(){renders++;},domElement:{addEventListener:(name,fn)=>events[name]=fn,toBlob(fn){callback=fn;}}};
const capture=installPhotography({renderer,scene:{},camera:{},getContext:()=>({location:'Krown Bridge',night:true})});
lost=true;assert.equal(await capture(),false);assert.equal(renders,0);assert.equal(urls,0);assert(nodes.get('photoStatus').textContent.includes('recover'));assert.equal(nodes.get('takePhoto').disabled,false);
lost=false;let pending=capture();assert.equal(renders,1);assert.equal(await capture(),false,'duplicate requests do not start another image');assert(nodes.get('takePhoto').disabled);
lost=true;events.webglcontextlost();lost=false;callback(new Blob(['old image']));assert.equal(await pending,false,'even an already-restored interruption invalidates the pending image');assert.equal(urls,0);assert.equal(downloads,0);assert(nodes.get('photoStatus').textContent.includes('interrupted'));assert.equal(nodes.get('takePhoto').disabled,false);
pending=capture();callback(new Blob(['fresh image']));assert.equal(await pending,true);assert.equal(downloads,1);assert.equal(urls,1);assert(nodes.get('photoStatus').textContent.includes('Krown Bridge'));
pending=capture();callback(null);assert.equal(await pending,false);assert.equal(downloads,1);assert.equal(nodes.get('takePhoto').disabled,false);
pending=capture();callback(new Blob(['retry']));assert.equal(await pending,true);assert.equal(downloads,2);
console.log('PASS: unavailable graphics prevent capture, interrupted async images are discarded, duplicates are blocked, restored captures download and encoding failures remain retryable.');
