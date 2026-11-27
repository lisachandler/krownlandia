import assert from 'node:assert/strict';
import {installSeating} from '../dist/seating.js';

let writes=0;
const nodes=new Map();
function element(){
 const values={hidden:false,disabled:false,textContent:'',open:false};
 const node={append(){},set id(value){nodes.set(value,this)}};
 for(const key of Object.keys(values))Object.defineProperty(node,key,{get:()=>values[key],set:value=>{writes++;values[key]=value;}});
 return node;
}
globalThis.document={createElement:element,body:element(),head:element()};
globalThis.addEventListener=()=>{};
const camera={position:{x:-41.5,z:143}};
const river={kind:'riverbend',name:'Riverbend bench',approach:{x:-41.5,z:143}};
const school={kind:'school',name:'Classroom chair',approach:{x:-50,z:140}};
let lanterns=false;
const seating=installSeating({camera,blocked:()=>false,lounges:{spots:[]},extraSeats:[river,school],onSit(){},onStand(){},watchCircus(){},riverFestivalActive:()=>lanterns});
const get=id=>nodes.get(id);
function steady(available){
 writes=0;
 for(let i=0;i<20;i++)seating.update(available);
 assert.equal(writes,0,'unchanged frames do not rewrite seating controls');
}
seating.update(true);
assert.equal(seating.selected,river);assert.match(get('sitNearby').textContent,/Riverbend bench/);
steady(true);
assert(seating.sit());assert(!get('seatRiverFestival').hidden&&!get('seatRiverbendStory').hidden);
assert(get('seatSchoolLesson').hidden);seating.update(true);steady(true);
lanterns=true;seating.update(true);
assert(get('seatRiverFestival').disabled);assert.equal(get('seatRiverFestival').textContent,'Lantern boats playing');steady(true);
const options=get('seatViewOptions');options.open=true;seating.update(false);
assert(!options.open);assert(get('seatControls').hidden);steady(false);
lanterns=false;seating.update(true);assert(!get('seatRiverFestival').disabled);assert(!get('seatControls').hidden);
seating.stand();assert(get('seatRiverFestival').hidden&&get('seatRiverbendStory').hidden);
camera.position={...school.approach};seating.update(true);assert(seating.sit());
assert(!get('seatSchoolLesson').hidden&&get('seatRiverbendStory').hidden);steady(true);
console.log('PASS: stable frames do not write seating controls; seat, preview and modal transitions still update them.');
