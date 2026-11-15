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



// Placement only: introduce simulated collision bounds into this isolated scene.
const patch={minX:22,maxX:30,minZ:167,maxZ:173};
const fixtures=[{name:'board',x:24,z:170,w:.4,d:.4},{name:'bench',x:28,z:171,w:1.7,d:.75}];
const board={x:24,z:168.5},seat={x:28,z:169.6};
function overlaps(c,p){if(c.r){const x=Math.max(p.minX,Math.min(c.x,p.maxX)),z=Math.max(p.minZ,Math.min(c.z,p.maxZ));return Math.hypot(x-c.x,z-c.z)<c.r+.3;}return c.x+c.w>p.minX&&c.x-c.w<p.maxX&&c.z+c.d>p.minZ&&c.z-c.d<p.maxZ;}

assert(!a.testColliders.some(c=>!a.studio.bounds.includes(c)&&overlaps(c,patch)),'Occupied studio footprint');
for(let x=22;x<=30;x+=.25)for(let z=167;z<=173;z+=.25)assert(!a.blocked(x,z)||fixtures.some(c=>Math.abs(x-c.x)<=c.w&&Math.abs(z-c.z)<=c.d),'Unexpected blocked position');
for(const c of fixtures)assert(c.x-c.w>=22&&c.x+c.w<=30&&c.z-c.d>=167&&c.z+c.d<=173);
assert.deepEqual(a.studio.bounds,fixtures.map(({name,...bounds})=>bounds));assert(a.studio.bounds.every(c=>a.testColliders.includes(c)));
const blocked=(x,z)=>a.blocked(x,z),nav=createNavigator(blocked);
for(const c of fixtures)assert(blocked(c.x,c.z),'Fixture participates in real collision logic');
for(let x=22.5;x<=25.5;x+=.25)assert(nav.clear({x,z:161},{x,z:168.5}),'Three-unit corridor and turning strip');
assert(nav.clear(board,seat)&&nav.clear(seat,board),'Board to bench and fallback exit');
const points=[{x:2,z:28,name:'gate'},...a.tram.stops.map(s=>({x:s.x+2.2,z:s.z,name:s.name})),...a.villages.homes.map(h=>({...h.door,name:h.name})),...a.villages.craftPlaces,a.stonehearth.point,...a.eldergrove.points,a.riverbend.boardPoint,a.bridge.boardPoint,a.school.deskPoint,a.library.deskPoint,a.library.terracePoint,a.townSquare.boardPoint,a.townSquare.stagePoint,a.officeGarden.boardPoint,a.generalStore.boardPoint,a.clubhouse.boardPoint,a.produceGarden.boardPoint];
for(const module of [a.villages,a.fireflyBenches,a.eldergrove,a.riverbend,a.bridge,a.school,a.library,a.townSquare,a.officeGarden,a.builders,a.clubhouse,a.produceGarden])for(const s of module.seats||[])points.push({...s.approach,name:s.name});

points.push(a.whisperingPines.point,...a.whisperingPines.seats.map(s=>s.approach),...a.townSquare.portalPlaces,...a.lounges.spots.map(s=>({x:s.x,z:s.z+1.3,name:s.name})));
function verify(path,label){assert(path.length,label);for(let i=1;i<path.length;i++)assert(nav.clear(path[i-1],path[i])&&nav.clear(path[i],path[i-1]),label+' segment');}
for(const p of points){assert(!blocked(p.x,p.z),p.name);const path=nav.route(p,board);assert(path.length,p.name);path.push(board);verify(path,p.name||'walking approach');}
// Reward station centers are solid kiosks; verify arrival within guide tolerance.
for(const p of STATIONS){const path=nav.route(board,p);verify(path,p.name);assert(Math.hypot(path.at(-1).x-p.x,path.at(-1).z-p.z)<1.8,p.name+' arrival');}
console.log('PASS studio footprint, turning strip, board/bench/fallback; '+points.length+' named approaches and '+STATIONS.length+' reward kiosks, all path segments clear both ways. Actual fixtures; no rendering claim.');

const get=id=>document.querySelector('#'+id);get('enter').onclick();a.camera.position.set(board.x,1.75,board.z);frame();const rewards=JSON.stringify(a.getState().rewards);a.interact();assert(a.studio.isOpen);get('studioClose').onclick();
a.camera.position.set(28.3,1.75,169.6);frame();assert.equal(a.seating.selected,a.studio.seats[0]);assert(a.seating.sit());frame();assert(get('seatStudioArt').onclick());assert(a.studio.isOpen);get('studioClose').onclick();frame();
a.testColliders.push({x:28.3,z:169.6,w:.1,d:.1});a.seating.stand();a.testColliders.pop();assert.equal(a.camera.position.x,seat.x);assert.equal(a.camera.position.z,seat.z);assert.equal(JSON.stringify(a.getState().rewards),rewards);
