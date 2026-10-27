import assert from 'node:assert/strict';
import {STATIONS} from '../dist/rewards-core.js';
import {installParkMap} from '../dist/park-map.js';

const nodes=new Map();
function element(){return {children:[],style:{},attributes:{},classList:{toggle(){}},set id(v){nodes.set('#'+v,this)},append(...items){this.children.push(...items)},replaceChildren(...items){this.children=items},setAttribute(k,v){this.attributes[k]=v},remove(){},focus(){document.activeElement=this},showModal(){this.open=true},close(){this.open=false}};}
globalThis.document={head:element(),body:element(),createElement:element,querySelector(s){if(!nodes.has(s))nodes.set(s,element());return nodes.get(s)}};
const $=s=>document.querySelector(s);
let state={visits:0,points:0,claims:[],done:[]},paused=0,guided=null;
const map=installParkMap({pause:()=>paused++,guideTo:id=>guided=id,rewards:()=>state,destinations:()=>[{id:'scenic-test',name:'Forest bench',kind:'Scenic seating',x:0,z:20}]});
const rows=()=>$('#mapLocations').children;
map.open();$('#mapCollectRewards').onclick();
assert.equal(rows().length,STATIONS.length);
assert.equal($('#mapCollectRewards').attributes['aria-pressed'],'true');
assert.equal(state.points,0);
state.claims=STATIONS.map(s=>s.id+':arrival');state.visits=STATIONS.length;
map.open();assert.equal(rows().length,0);
assert($('#mapSearchCount').textContent.includes('Complete more activities'));
const first=STATIONS[0];state.done=[first.task.id];
map.open();assert.equal(rows().length,1);
assert(rows()[0].children[1].textContent.includes('Task ready'));
$('#mapSearch').value='nonexistent-place';$('#mapSearch').oninput();assert.equal(rows().length,0);assert($('#mapSearchCount').textContent.includes('No rewards match'));
$('#mapSearch').value=first.name;$('#mapSearch').oninput();assert.equal(rows().length,1);
rows()[0].onclick();assert.equal(guided,first.id);assert(!map.isOpen);assert.equal(state.points,0);assert(!state.claims.includes(first.id+':task'));
state.claims.push(first.id+':task');map.open();assert.equal(rows().length,0);
$('#mapScenicSeats').onclick();assert.equal(rows().length,1);assert.equal($('#mapCollectRewards').attributes['aria-pressed'],'false');
$('#mapCollectRewards').onclick();$('#mapSearchClear').onclick();assert.equal(rows().length,STATIONS.length);
$('#mapCollectRewards').onclick();$('#mapView'+'safari').onclick();assert($('#mapSearchBox').hidden);$('#mapView'+'courtyard').onclick();assert.equal(rows().length,0);
map.open();assert.equal(rows().length,0);assert.equal($('#mapCollectRewards').attributes['aria-pressed'],'true');assert(paused>0);
// Distance ordering follows the visitor, preserves station marker numbers, and never mutates rewards.
state={visits:0,points:0,claims:[],done:[]};
for(const target of [STATIONS[0],STATIONS.at(-1)]){
 map.update({x:target.x,z:target.z,yaw:0});map.open();
 assert(rows()[0].children[0].textContent.endsWith(target.name));
 assert(rows()[0].children[0].textContent.startsWith((STATIONS.indexOf(target)+1)+'.'));
 assert(rows()[0].children[1].textContent.startsWith('About 0 m away'));
 const distances=rows().map(row=>Number(row.children[1].textContent.match(/About (\d+) m/)[1]));
 assert(distances.every((d,i)=>!i||d>=distances[i-1]));
 rows()[0].onclick();assert.equal(guided,target.id);assert.equal(state.points,0);
}
map.update({x:0,z:17,yaw:0});map.open();$('#mapScenicSeats').onclick();assert(rows()[0].children[1].textContent.includes('About 3 m away'));
console.log('PASS: nearest-first rewards, current-position refresh, stable station numbers, direct distance labels and scenic seating distances.');
console.log('PASS: arrival and ready-task filtering, claimed/unfinished exclusions, search and empty states, scenic/reset/safari compatibility, guidance and unchanged rewards.');

const search=$('#mapSearch');map.open();assert.equal(search.value,'scenic');assert.equal(rows().length,1);assert.equal($('#mapSearch'),search);
search.value='missing destination';search.oninput();$('#mapClose').onclick();map.open();assert.equal(search.value,'missing destination');assert.equal(rows().length,0);assert($('#mapSearchCount').textContent.includes('clear the search'));
$('#mapSearchClear').onclick();assert.equal(document.activeElement,search);assert.equal(rows().length,STATIONS.length);assert.equal(search.value,'');
$('#mapScenicSeats').onclick();map.update({x:60,z:-24,yaw:0,safari:{active:true,stop:0,phase:'stop'}});map.open();assert($('#mapSearchBox').hidden);assert.equal(search.value,'scenic');assert.equal(rows().length,6);
map.update({x:0,z:10,yaw:0,safari:{active:false}});map.open();assert(!$('#mapSearchBox').hidden);assert.equal(search.value,'scenic');assert.equal(rows().length,1);assert(rows()[0].children[1].textContent.includes('About 10 m away'));
$('#mapCollectRewards').onclick();assert.equal($('#mapSearchClear').textContent,'Clear search and filter');$('#mapSearchClear').onclick();assert.equal($('#mapCollectRewards').attributes['aria-pressed'],'false');assert($('#mapSearchClear').hidden);
console.log('PASS: retained query/filter and empty search, explicit clear/focus, unchanged input, safari auto-view and refreshed distances after returning.');
