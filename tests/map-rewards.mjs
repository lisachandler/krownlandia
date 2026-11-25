import assert from 'node:assert/strict';
import {STATIONS} from '../dist/rewards-core.js';
import {installParkMap} from '../dist/park-map.js';

const nodes=new Map();
function element(){return {children:[],style:{},attributes:{},classList:{toggle(){}},set id(v){nodes.set('#'+v,this)},append(...items){for(const item of items)item.parentElement=this;this.children.push(...items)},replaceChildren(...items){this.children=items},setAttribute(k,v){this.attributes[k]=v},remove(){if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(item=>item!==this);},focus(){document.activeElement=this},showModal(){this.open=true},close(){this.open=false}};}
globalThis.document={head:element(),body:element(),createElement:element,querySelector(s){if(!nodes.has(s))nodes.set(s,element());return nodes.get(s)}};
const $=s=>document.querySelector(s);
let state={visits:0,points:0,claims:[],done:[]},paused=0,guided=null;
let walk=null;const recreationPlaces=[];
const map=installParkMap({pause:()=>paused++,guideTo:id=>guided=id,guideToPoint:p=>walk=p,rewards:()=>state,destinations:()=>[{id:'scenic-test',name:'Forest bench',kind:'Scenic seating',x:0,z:20},...recreationPlaces]});
const drawing=$('#mapDrawing');let drawingWrites=0;
Object.defineProperty(drawing,'innerHTML',{set(){drawingWrites++;this.children=[]}});
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

map.open();$('#mapCraftActivities').onclick();assert.equal(search.value,'craft activity');assert.equal($('#mapCraftActivities').attributes['aria-pressed'],'true');assert.equal($('#mapCollectRewards').attributes['aria-pressed'],'false');assert.equal(rows().length,0);$('#mapScenicSeats').onclick();assert.equal($('#mapCraftActivities').attributes['aria-pressed'],'false');$('#mapCraftActivities').onclick();$('#mapSearchClear').onclick();assert.equal(search.value,'');assert.equal($('#mapCraftActivities').attributes['aria-pressed'],'false');assert.equal(document.activeElement,search);console.log('PASS craft shortcut query, pressed state, no-result state, switching shortcuts and clear focus.');

const card=$('#mapBowling'),aim=$('#bowlingAim'),roll=$('#bowlingRoll'),restart=$('#bowlingRestart'),status=$('#bowlingStatus');
const saved=JSON.stringify(state),priorGuidance=guided;
card.open=true;roll.onclick();aim.value='Left';roll.onclick();
assert.match(status.textContent,/Rolls: 2 of 2. Standing pins: 6, 9, 10\./);
assert.equal(document.activeElement,restart);assert(roll.disabled);
const end=status.textContent;roll.onclick();assert.equal(status.textContent,end);
restart.onclick();assert.equal(document.activeElement,aim);roll.onclick();roll.onclick();
assert.match(status.textContent,/No more pins fell.*Standing pins: 4, 6, 7, 8, 9, 10/);
card.open=false;card.ontoggle();card.open=true;aim.value='Right';roll.onclick();
assert.match(status.textContent,/Rolls: 1 of 2. Standing pins: 1, 2, 4, 5, 7, 8/);
$('#mapClose').onclick();map.open();assert.equal(card.open,false);
assert.match(status.textContent,/Rolls: 0 of 2. Standing pins: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10/);
assert.equal(JSON.stringify(state),saved);assert.equal(guided,priorGuidance);
console.log('PASS: bowling overlap, misses, two-roll limit, reset, focus targets, map reopen and unchanged rewards/guidance.');

recreationPlaces.push({id:'display',name:'Riverside display',kind:'Craft activity',keywords:'fishing recreation',x:1,z:2});
function find(term){search.value=term;search.oninput();}
find('bowling');assert.equal(rows().length,1);assert.match($('#mapSearchCount').textContent,/1 activity to play/);
const selected=map.selected;rows()[0].onclick();
assert(map.isOpen&&card.open);assert.equal(document.activeElement,$('#bowlingOpener'));assert.equal(walk,null);assert.equal(map.selected,selected);
find('recreation');assert.equal(rows().length,2);assert.match($('#mapSearchCount').textContent,/1 walking destination and 1 activity/);
find('fishing');assert.equal(rows().length,1);rows()[0].onclick();assert(!map.isOpen);assert.deepEqual(walk,{x:1,z:2,name:'Riverside display'});
map.open();$('#mapCollectRewards').onclick();find('bowling');assert.equal(rows().length,0);assert.equal(JSON.stringify(state),saved);
console.log('PASS: play here versus walking directions, mixed count, tabletop focus, reward-only exclusion and unchanged progress.');

state={visits:0,points:0,claims:[],done:[]};map.open();
const mapWrites=drawingWrites,markers=[...drawing.children],firstMarker=markers.find(m=>m.textContent==='1');
assert.deepEqual(markers.map(m=>Number(m.textContent)),STATIONS.map((_,i)=>i+1));
search.value='nothingmatches';search.oninput();
assert.equal(drawingWrites,mapWrites);assert.deepEqual(drawing.children,markers);
assert(markers.every(m=>m.hidden));const oldGuide=guided;firstMarker.onclick();assert.equal(guided,oldGuide);
search.value=STATIONS[0].name;search.oninput();
assert.equal(drawingWrites,mapWrites);assert(drawing.children.includes(firstMarker));assert(!firstMarker.hidden);
firstMarker.onclick();assert.equal(guided,STATIONS[0].id);assert(!map.isOpen);
map.open();$('#mapViewsafari').onclick();assert.equal(drawingWrites,mapWrites+1);assert.equal(drawing.children.length,6);
$('#mapViewcourtyard').onclick();assert.equal(drawingWrites,mapWrites+2);
assert(!drawing.children.includes(firstMarker));
console.log('PASS: search and reopening reuse map artwork and markers; hidden markers are inert; changing map view redraws once.');

const orientation=$('#mapOrientation'),orientationInfo=$('#mapOrientationInfo');
guided=null;walk=null;
map.open();assert.equal(orientation.open,false);
const landmark=STATIONS[0];
map.update({x:landmark.x,z:landmark.z,yaw:0});
orientation.open=true;orientation.ontoggle();
assert.match(orientationInfo.textContent,/Facing north/);
assert(orientationInfo.textContent.includes(landmark.name+' · about 0 m'));
map.update({x:landmark.x,z:landmark.z,yaw:-Math.PI/2});
assert.match(orientationInfo.textContent,/Facing east/);
map.update({x:landmark.x,z:landmark.z,yaw:Math.PI/2});
assert.match(orientationInfo.textContent,/Facing west/);
map.update({x:90,z:-30,yaw:0});
assert.match(orientationInfo.textContent,/Outside the park map/);
$('#mapViewsafari').onclick();assert(orientation.hidden);assert.equal(orientation.open,false);
$('#mapViewcourtyard').onclick();assert(!orientation.hidden);assert.equal(orientation.open,false);
assert.equal(guided,null);assert.equal(walk,null);
console.log('PASS: optional map text orientation follows heading and nearest landmark without starting directions; hides in Safari.');

$('#mapClose').onclick();
const arrow=$('#mapVisitor');let transforms=0,currentTransform=arrow.style.transform;
Object.defineProperty(arrow.style,'transform',{get:()=>currentTransform,set:value=>{currentTransform=value;transforms++;}});
map.update({x:4,z:22,yaw:-Math.PI/2});
map.update({x:7,z:24,yaw:Math.PI/2});
assert.equal(transforms,0,'closed map does not redraw the arrow');
map.open();assert.equal(transforms,1);assert.match(arrow.style.transform,/rotate\(-90deg\)/);
assert.equal(arrow.style.left,((7+63)/118)*100+'%');
map.update({x:7,z:24,yaw:Math.PI/2});assert.equal(transforms,1,'unchanged heading and position do not repaint');
$('#mapViewsafari').onclick();assert.equal(transforms,2);assert(arrow.hidden);
$('#mapViewcourtyard').onclick();assert.equal(transforms,3);assert(!arrow.hidden);
$('#mapClose').onclick();
console.log('PASS: closed map retains the latest position without DOM writes; opening and switching map views refresh the arrow.');
