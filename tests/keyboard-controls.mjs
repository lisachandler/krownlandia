import assert from 'node:assert/strict';
import fs from 'node:fs';
// Exercise the actual event registrations with observable movement and seat actions.
const listeners={},keys={};let interactions=0,sits=0,stands=0;
const register=(type,fn)=>(listeners[type]??=[]).push(fn);
for(const file of ['world.js','seating.js']){
 const line=fs.readFileSync(new URL('../dist/'+file,import.meta.url),'utf8').split('\n').find(s=>s.includes("addEventListener('keydown'"));
 new Function('addEventListener','keys','interact','enabled','current','stand','sit',line)(register,keys,()=>interactions++,true,false,()=>stands++,()=>sits++);
}
function dispatch(key,options={}){let prevented=false;const event={key,preventDefault(){prevented=true},...options};for(const listener of listeners.keydown)listener(event);return prevented;}
for(const selector of ['input','textarea','select','dialog','[contenteditable="true"]']){
 const target={closest(query){return query.split(',').includes(selector)?this:null}};
 for(const key of [' ','ArrowDown','w','e','f'])assert.equal(dispatch(key,{target}),false,selector+' keeps native '+key);
}
for(const option of ['ctrlKey','metaKey','altKey','defaultPrevented'])for(const key of ['ArrowUp','e','f'])assert.equal(dispatch(key,{[option]:true}),false);
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
for(const listener of listeners.keyup)listener({key:'w',target:{}});assert.equal(keys.w,false);
console.log('PASS: native control keys, dialog scrolling, browser shortcuts, prevented events, world movement, sprint modifier, single E/F actions and key release.');
