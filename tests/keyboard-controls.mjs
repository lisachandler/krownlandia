import assert from 'node:assert/strict';
import fs from 'node:fs';
// Exercise the actual event registrations with observable movement and seat actions.
const listeners={},keys={},document={hidden:false};let interactions=0,sits=0,stands=0;
const register=(type,fn)=>(listeners[type]??=[]).push(fn);
const read=file=>fs.readFileSync(new URL('../dist/'+file,import.meta.url),'utf8').split('\n');
const lines=read('world.js');
const input=lines.slice(lines.findIndex(l=>l.startsWith('function worldInputAvailable')),lines.findIndex(l=>l.startsWith('const canvas='))).join('\n');
const api=new Function('document','addEventListener','keys','interact',`let playing=true,contextLost=false;${input}
return {available:worldInputAvailable,set:(play,lost)=>{playing=play;contextLost=lost;}};`)(document,register,keys,()=>interactions++);
const seat=read('seating.js').find(s=>s.includes("addEventListener('keydown'"));
new Function('addEventListener','enabled','current','stand','sit','keyboardAvailable',seat)(register,true,false,()=>stands++,()=>sits++,api.available);
function dispatch(key,options={}){let prevented=false;const event={key,preventDefault(){prevented=true},...options};for(const listener of listeners.keydown)listener(event);return prevented;}
for(const selector of ['input','textarea','select','dialog','[contenteditable="true"]','#error','#gatewayReading']){
 const target={closest(query){return query.split(',').includes(selector)?this:null}};
 for(const key of [' ','ArrowDown','w','e','f'])assert.equal(dispatch(key,{target}),false,selector+' keeps native '+key);
}
for(const option of ['ctrlKey','metaKey','altKey','defaultPrevented','isComposing'])for(const key of ['ArrowUp','e','f'])assert.equal(dispatch(key,{[option]:true}),false);
for(const [playing,lost,hidden] of [[false,false,false],[true,true,false],[true,false,true]]){
 api.set(playing,lost);document.hidden=hidden;
 for(const key of [' ','ArrowDown','w','e','f'])assert.equal(dispatch(key),false);
}
document.hidden=false;api.set(true,false);
assert.equal(dispatch(' '),false,'space keeps its native behavior even during active play');
dispatch('z');assert.equal(keys.z,undefined);
assert.deepEqual(keys,{});assert.equal(interactions,0);assert.equal(sits,0);
for(const selector of ['button','a','summary','#journey','#safari']){
 const target={closest(query){return query.split(',').includes(selector)?this:null}};
 for(const key of [' ','Enter','ArrowDown','Home','End'])assert.equal(dispatch(key,{target}),false);
 dispatch('w',{target});assert(keys.w,'WASD remains available after using a toolbar control');
}
assert.equal(keys.arrowdown,undefined,'scrolling focused ride panels does not start movement');
assert(dispatch('ArrowUp'));assert(keys.arrowup);dispatch('w',{shiftKey:true});assert(keys.w);
dispatch('e');dispatch('e',{repeat:true});assert.equal(interactions,1);
dispatch('f');dispatch('f',{repeat:true});assert.equal(sits,1);assert.equal(stands,0);
api.set(true,true);for(const listener of listeners.keyup)listener({key:'w',target:{}});assert.equal(keys.w,false);
console.log('PASS: native control keys, dialog scrolling, browser shortcuts, prevented events, world movement, sprint modifier, single E/F actions and key release.');
