import assert from 'node:assert/strict';
import {installPhotography} from '../dist/photography.js';
const nodes=new Map(),events={};globalThis.addEventListener=(name,fn)=>events[name]=fn;let lost=false,renders=0,downloads=0,urls=0,callback;
function element(){return {set id(value){nodes.set(value,this)},append(){},setAttribute(){},remove(){},click(){downloads++;}};}
globalThis.document={createElement:element,querySelector:()=>element(),body:element(),head:element()};
const timers=new Map();let timerId=0;globalThis.setTimeout=(fn,ms)=>{timers.set(++timerId,{fn,ms});return timerId;};globalThis.clearTimeout=id=>timers.delete(id);
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

pending=capture();const late=callback,encoding=[...timers].find(([,t])=>t.ms===10000);assert(encoding);timers.delete(encoding[0]);encoding[1].fn();assert.equal(await pending,false);assert.equal(nodes.get('takePhoto').disabled,false);assert.equal(downloads,2);assert(nodes.get('photoStatus').textContent.includes('Try again'));
const retry=capture();late(new Blob(['late timed-out image']));await Promise.resolve();assert.equal(downloads,2);assert(nodes.get('takePhoto').disabled,'old completion cannot unlock a new capture');callback(new Blob(['new image']));assert.equal(await retry,true);assert.equal(downloads,3);assert.equal([...timers.values()].filter(t=>t.ms===10000).length,0);
renderer.domElement.toBlob=()=>{throw Error('encoding failed synchronously');};assert.equal(await capture(),false);assert.equal([...timers.values()].filter(t=>t.ms===10000).length,0);assert.equal(nodes.get('takePhoto').disabled,false);
console.log('PASS: stalled photo encoding times out, late callbacks cannot download or disturb retry, and synchronous failures clear the watchdog.');

renderer.domElement.toBlob=fn=>callback=fn;
pending=capture();const abandoned=callback;events.pagehide();assert.equal(await pending,false);assert(nodes.get('photoStatus').hidden);assert.equal(nodes.get('takePhoto').disabled,false);assert.equal([...timers.values()].filter(t=>t.ms===10000||t.ms===6000).length,0);
const returned=capture();abandoned(new Blob(['abandoned']));await Promise.resolve();assert.equal(downloads,3);assert(nodes.get('takePhoto').disabled);callback(new Blob(['returned']));assert.equal(await returned,true);assert.equal(downloads,4);
// Departure after encoding resolves but before its continuation also prevents download.
pending=capture();callback(new Blob(['resolved before departure']));events.pagehide();assert.equal(await pending,false);assert.equal(downloads,4);assert(nodes.get('photoStatus').hidden);
console.log('PASS: page departure cancels pending photos and timers silently, late results cannot disturb a new capture, and returning allows a fresh download.');
