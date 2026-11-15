import './video-runtime.mjs';
import {exportBackup,parseBackup,restoreBackup} from '../dist/backup-core.js';
import {createNeighbors} from '../dist/neighbors-core.js';
globalThis.createNeighbors=createNeighbors;
// Deterministic scene/interaction checks, not a substitute for GPU visual QA.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import * as Real from '../dist/vendor/three.module.js';
import {CHAPTERS,createJourney} from '../dist/journey-core.js';
import {createNavigator} from '../dist/navigation-core.js';
import {createVisit} from '../dist/visit-core.js';
globalThis.createVisit=createVisit;
import {STATIONS,createRewards} from '../dist/rewards-core.js';
const nodes=new Map(),handlers={},ctx={fillRect(){},strokeRect(){},fillText(){},measureText(text){return{width:text.length*(parseFloat(this.font)||48)*.6}}};
function el(){return{set id(v){nodes.set('#'+v,this)},style:{},dataset:{},classList:{values:new Set(),add(v){this.values.add(v)},remove(v){this.values.delete(v)},toggle(v,on){if(on)this.values.add(v);else this.values.delete(v)},contains(v){return this.values.has(v)}},children:[],firstElementChild:{style:{}},append(...v){this.children.push(...v)},replaceChildren(...v){this.children=v},addEventListener(){},setAttribute(){},click(){this.clicked=true},focus(){document.activeElement=this},toBlob(callback){callback(new Blob(['mock PNG'],{type:'image/png'}))},remove(){},getContext(){return ctx},showModal(){this.open=true},close(){this.open=false}}}
globalThis.document={head:el(),body:el(),querySelector(s){if(!nodes.has(s))nodes.set(s,el());return nodes.get(s)},createElement:el,addEventListener(){}};
const saved=new Map();
saved.set('krownlandia-visit-v1',JSON.stringify({x:2,z:28,yaw:0,pitch:0,night:false}));
Object.assign(globalThis,{window:{},innerWidth:1280,innerHeight:800,devicePixelRatio:1,addEventListener:(n,f)=>handlers[n]=f,localStorage:{getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)}});
let next;globalThis.requestAnimationFrame=f=>next=f;
let testRenderer;class Renderer{constructor(){testRenderer=this;this.domElement=el();this.shadowMap={}}setSize(){}setPixelRatio(value){this.pixelRatio=value}render(){}}
class Environment{fromScene(){return{texture:new Real.Texture()}}dispose(){}}
const T={...Real,WebGLRenderer:Renderer,PMREMGenerator:Environment};
function source(file){return fs.readFileSync(new URL('../dist/'+file,import.meta.url),'utf8').replace(/^import .*;\n/gm,'').replace(/export function /g,'function ');}
globalThis.installFireflyBenches=new Function('T',source('firefly-benches.js')+';return installFireflyBenches;')(T);
globalThis.installFoodGuide=new Function(source('food-guide.js')+';return installFoodGuide;')();
globalThis.installCommunityWalk=new Function(source('community-walk.js')+';return installCommunityWalk;')();
const enrich=new Function('T',source('atmosphere.js')+';return enrich;')(T);
const {finishGardens,batchStatic}=new Function('T',source('scenery.js')+';return {finishGardens,batchStatic};')(T);
const installRewards=new Function('T','STATIONS','createRewards',source('rewards.js')+';return installRewards;')(T,STATIONS,createRewards);
const installJourney=new Function('T','CHAPTERS','createJourney',source('journey.js')+';return installJourney;')(T,CHAPTERS,createJourney);
const enrichCourtyard=new Function('T',source('courtyard.js')+';return enrichCourtyard;')(T);
const installParkMap=new Function('STATIONS',source('park-map.js')+';return installParkMap;')(STATIONS);
const installCoffeeScene=new Function('T',source('coffee-scene.js')+';return installCoffeeScene;')(T);
const installInterface=new Function(source('interface.js')+';return installInterface;')();
const enrichSafariLandscape=new Function('T',source('safari-landscape.js')+';return enrichSafariLandscape;')(T);
const installSafari=new Function('T','createJourney','enrichSafariLandscape',source('safari.js')+';return installSafari;')(T,createJourney,enrichSafariLandscape);
const installPhotography=new Function('URL','setTimeout','clearTimeout',source('photography.js')+';return installPhotography;')({createObjectURL:()=> 'blob:test-photo',revokeObjectURL(){}},()=>0,()=>{});
const installRoasted=new Function('T',source('roasted.js')+';return installRoasted;')(T);
const installNavigation=new Function('T','createNavigator',source('navigation.js')+';return installNavigation;')(T,createNavigator);
globalThis.installMagicSchool=new Function('T',source('magic-school.js')+';return installMagicSchool;')(T);
globalThis.installBridge=new Function('T',source('bridge.js')+';return installBridge;')(T);
globalThis.installRiverbend=new Function('T',source('riverbend.js')+';return installRiverbend;')(T);
globalThis.installGeneralStore=new Function('T',source('general-store.js')+';return installGeneralStore;')(T);
globalThis.installClubhouse=new Function('T',source('clubhouse.js')+';return installClubhouse;')(T);
globalThis.installProduceGarden=new Function('T',source('produce-garden.js')+';return installProduceGarden;')(T);
globalThis.installWhisperingPines=new Function('T',source('whispering-pines.js')+';return installWhisperingPines;')(T);
globalThis.installCompositionStudio=new Function('T',source('composition-studio.js')+';return installCompositionStudio;')(T);
globalThis.installStonehearth=new Function('T',source('stonehearth.js')+';return installStonehearth;')(T);
globalThis.installEldergrove=new Function('T',source('eldergrove.js')+';return installEldergrove;')(T);
globalThis.installLibrary=new Function('T',source('library.js')+';return installLibrary;')(T);
globalThis.installTownSquare=new Function('T',source('town-square.js')+';return installTownSquare;')(T);
globalThis.installOfficeGarden=new Function('T',source('office-garden.js')+';return installOfficeGarden;')(T);
globalThis.installBuilders=new Function('T',source('builders.js')+';return installBuilders;')(T);
globalThis.installHelp=new Function(source('help.js')+';return installHelp;')();
globalThis.installBackup=new Function('exportBackup','parseBackup','restoreBackup',source('backup.js')+';return installBackup;')(exportBackup,parseBackup,restoreBackup);
globalThis.installJournal=new Function(source('journal.js')+';return installJournal;')();
globalThis.installResidents=new Function('T',source('residents.js')+';return installResidents;')(T);
globalThis.installTram=new Function('T',source('tram.js')+';return installTram;')(T);
globalThis.installVillages=new Function('T','batchStatic',source('villages.js')+';return installVillages;')(T,batchStatic);
globalThis.installSeating=new Function(source('seating.js')+';return installSeating;')();
globalThis.installLounges=new Function('T','STATIONS',source('lounges.js')+';return installLounges;')(T,STATIONS);
globalThis.installPopcorn=new Function('T',source('popcorn.js')+';return installPopcorn;')(T);
globalThis.installCircus=new Function('T',source('circus.js')+';return installCircus;')(T);
const installGraphics=new Function(source('graphics.js')+';return installGraphics;')();
new Function('T','enrich','finishGardens','batchStatic','installRewards','installJourney','enrichCourtyard','installParkMap','installCoffeeScene','installInterface','installSafari','installPhotography','installRoasted','installNavigation','installGraphics',source('world.js').replace('window.krownlandia={','window.krownlandia={testColliders:colliders,'))(T,enrich,finishGardens,batchStatic,installRewards,installJourney,enrichCourtyard,installParkMap,installCoffeeScene,installInterface,installSafari,installPhotography,installRoasted,installNavigation,installGraphics);
let ms=0;const frame=()=>next(ms+=16);frame();
const a=window.krownlandia;



// Actual scene fixtures must match the surveyed layout.
const patch={minX:35,maxX:45,minZ:165,maxZ:173};
const proposed=[{name:'board support',x:39,z:168,w:.4,d:.4},{name:'bench',x:42,z:170,w:1.7,d:.75},...[[36.5,171.5],[43.5,166.5],[43.5,172]].map(([x,z])=>({name:'pine trunk',x,z,r:.35}))];
const board={x:39,z:166.5,name:'story board approach'},seat={x:42,z:168.6,name:'bench approach and fallback exit'},entry={x:39,z:164,name:'glade entry'};
function overlaps(c,p){if(c.r){const x=Math.max(p.minX,Math.min(c.x,p.maxX)),z=Math.max(p.minZ,Math.min(c.z,p.maxZ));return Math.hypot(x-c.x,z-c.z)<c.r+.3;}return c.x+c.w>p.minX&&c.x-c.w<p.maxX&&c.z+c.d>p.minZ&&c.z-c.d<p.maxZ;}
assert.deepEqual(a.testColliders.filter(c=>!a.whisperingPines.bounds.includes(c)&&overlaps(c,patch)),[],'Whole glade clear of existing obstacles');
assert.equal(a.whisperingPines.bounds.length,proposed.length);for(let i=0;i<proposed.length;i++)for(const k of ['x','z','w','d','r'])assert.equal(a.whisperingPines.bounds[i][k],proposed[i][k]);
for(const c of proposed){const w=c.r?c.r+.3:c.w,d=c.r?c.r+.3:c.d;assert(c.x-w>=35&&c.x+w<=45&&c.z-d>=165&&c.z+d<=173);}
const blocked=(x,z)=>a.blocked(x,z);
const nav=createNavigator(blocked);
const points=[{x:2,z:28,name:'gate'},...a.tram.stops.map(s=>({x:s.x+2.2,z:s.z,name:s.name})),...a.villages.homes.map(h=>({...h.door,name:h.name})),...a.villages.craftPlaces,a.stonehearth.point,...a.eldergrove.points,a.riverbend.boardPoint,a.bridge.boardPoint,a.school.deskPoint,a.library.deskPoint,a.library.terracePoint,a.townSquare.boardPoint,a.townSquare.stagePoint,a.officeGarden.boardPoint,a.generalStore.boardPoint,a.clubhouse.boardPoint,a.produceGarden.boardPoint];
for(const module of [a.villages,a.fireflyBenches,a.eldergrove,a.riverbend,a.bridge,a.school,a.library,a.townSquare,a.officeGarden,a.builders,a.clubhouse,a.produceGarden])for(const s of module.seats||[])points.push({...s.approach,name:s.name});
let routes=0;
for(const p of points){assert(!blocked(p.x,p.z),p.name);const path=nav.route(p,board);assert(path.length,'Route from '+p.name);assert(Math.hypot(path.at(-1).x-board.x,path.at(-1).z-board.z)<1.8);assert(nav.clear(path.at(-1),board),'Exact final approach');path.push(board);for(let i=1;i<path.length;i++){assert(nav.clear(path[i-1],path[i]),'Forward segment');assert(nav.clear(path[i],path[i-1]),'Reverse segment');}routes+=2;}
assert(nav.clear(board,seat),'Board to seat and stand-up approach');assert(nav.clear(entry,board),'Entry to board');
for(let x=37.5;x<=40.5;x+=.25)assert(nav.clear({x,z:161},{x,z:166}),'Three-unit connection from existing east-west path');
// Canopies stay above head height and outside the entry/reading space by design.
for(const c of proposed.filter(c=>c.r)){assert(Math.hypot(c.x-board.x,c.z-board.z)>2);assert(Math.hypot(c.x-seat.x,c.z-seat.z)>2);}
console.log('PASS Whispering Pines built footprint 35..45 / 165..173; five actual obstacles; '+points.length+' protected destinations / '+routes+' directed routes; exact board approach, bench exit, turning strip and existing path connection. Sightlines/GPU review unverified.');
// Integration: board opening pauses movement; bench reading and safe fallback exit.
const node=id=>document.querySelector('#'+id);node('enter').onclick();a.camera.position.set(board.x,1.75,board.z);frame();const progress=JSON.stringify(a.getState().rewards);a.interact();assert(a.whisperingPines.isOpen);const position=a.camera.position.clone();handlers.keydown({key:'w'});frame();assert(a.camera.position.equals(position));handlers.keyup({key:'w'});node('pinesClose').onclick();
a.camera.position.set(42.3,1.75,168.6);frame();assert.equal(a.seating.selected,a.whisperingPines.seats[0]);assert(a.seating.sit());frame();assert(!node('seatPinesStory').hidden);assert(node('seatPinesStory').onclick());assert(a.whisperingPines.isOpen);node('pinesClose').onclick();frame();
const temporary={x:42.3,z:168.6,w:.1,d:.1};a.testColliders.push(temporary);a.seating.stand();a.testColliders.pop();assert.equal(a.camera.position.x,seat.x);assert.equal(a.camera.position.z,seat.z);assert.equal(JSON.stringify(a.getState().rewards),progress);console.log('PASS world board pause, actual bench selection, seated story action and blocked-origin fallback exit without rewards changes.');
