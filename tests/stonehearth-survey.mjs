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


// Verify actual scene fixtures against the surveyed specification.
const patch={minX:-19,maxX:-11,minZ:137,maxZ:143};
const proposed=[{x:-15,z:140,w:1.8,d:.9},{x:-15,z:142.4,w:3,d:.5},{x:-18,z:138,w:.4,d:.4}];
const targets=[{x:-15,z:138,name:'workbench approach'},{x:-15,z:136,name:'courtyard entry'}];
function overlaps(c,p){if(c.r){const x=Math.max(p.minX,Math.min(c.x,p.maxX)),z=Math.max(p.minZ,Math.min(c.z,p.maxZ));return Math.hypot(x-c.x,z-c.z)<c.r+.3;}return c.x+c.w>p.minX&&c.x-c.w<p.maxX&&c.z+c.d>p.minZ&&c.z-c.d<p.maxZ;}
assert.deepEqual(a.testColliders.filter(c=>!a.stonehearth.bounds.includes(c)&&overlaps(c,patch)),[],'No pre-existing collider overlaps courtyard');
assert.equal(a.stonehearth.bounds.length,3);
for(let i=0;i<3;i++)for(const k of ['x','z','w','d'])assert(Math.abs(a.stonehearth.bounds[i][k]-proposed[i][k])<1e-8,'Actual fixture matches surveyed bounds');
for(let x=patch.minX;x<=patch.maxX;x+=.25)for(let z=patch.minZ;z<=patch.maxZ;z+=.25)assert(x>=-61&&x<=53&&z>=-92&&z<=178,'Footprint inside existing bounds');
for(const c of proposed){assert(c.x-c.w>=patch.minX&&c.x+c.w<=patch.maxX&&c.z-c.d>=patch.minZ&&c.z+c.d<=patch.maxZ,'Fixtures include clearance within surveyed patch');}
const blocked=(x,z)=>a.blocked(x,z);
const nav=createNavigator(blocked),gate={x:2,z:28,name:'gate'};
const protectedPoints=[...a.tram.stops.map(s=>({x:s.x+2.2,z:s.z,name:s.name+' tram approach'})),...a.villages.homes.map(h=>({...h.door,name:h.name+' door'})),...a.villages.seats.map(s=>({...s.approach,name:s.name})),...a.riverbend.seats.map(s=>({...s.approach,name:s.name})),...a.eldergrove.seats.map(s=>({...s.approach,name:s.name})),a.riverbend.boardPoint,...a.eldergrove.points];
let routes=0;
function checkRoute(from,to){assert(!blocked(from.x,from.z),from.name);assert(!blocked(to.x,to.z),to.name);const path=nav.route(from,to);assert(path.length,'Route '+from.name+' to '+to.name);for(let i=1;i<path.length;i++)assert(nav.clear(path[i-1],path[i]),'No corner cutting');assert(Math.hypot(path.at(-1).x-to.x,path.at(-1).z-to.z)<1.8);routes++;}
for(const p of protectedPoints){checkRoute(gate,p);checkRoute(p,targets[0]);}
for(const t of targets)checkRoute(gate,t);
assert(nav.clear({x:-15,z:130},targets[0]),'Straight level approach from existing cross-path');
for(const x of [-16,-15,-14])assert(nav.clear({x,z:136},{x,z:138}),'Turning and entry width');
assert(nav.clear({x:-3,z:133},{x:-3,z:160}),'West side of central path retained');
// Actual world interaction pauses movement and retains existing rewards.
document.querySelector('#enter').onclick();a.camera.position.set(-15,1.75,138);frame();const before=JSON.stringify(a.getState().rewards);a.interact();assert(a.stonehearth.isOpen);const pos=a.camera.position.clone();handlers.keydown({key:'w'});frame();assert(a.camera.position.equals(pos));handlers.keyup({key:'w'});assert.equal(JSON.stringify(a.getState().rewards),before);
console.log('PASS Stonehearth built footprint x -19..-11 / z 137..143, three actual fixture bounds, '+routes+' protected routes, entry/turning clearance and unchanged world bounds. No GPU review.');
