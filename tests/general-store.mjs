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
function el(){return{set id(v){nodes.set('#'+v,this)},style:{},classList:{values:new Set(),add(v){this.values.add(v)},remove(v){this.values.delete(v)},toggle(v,on){if(on)this.values.add(v);else this.values.delete(v)},contains(v){return this.values.has(v)}},children:[],firstElementChild:{style:{}},append(...v){this.children.push(...v)},replaceChildren(...v){this.children=v},addEventListener(){},setAttribute(){},click(){this.clicked=true},focus(){document.activeElement=this},toBlob(callback){callback(new Blob(['mock PNG'],{type:'image/png'}))},remove(){},getContext(){return ctx},showModal(){this.open=true},close(){this.open=false}}}
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
new Function('T','enrich','finishGardens','batchStatic','installRewards','installJourney','enrichCourtyard','installParkMap','installCoffeeScene','installInterface','installSafari','installPhotography','installRoasted','installNavigation','installGraphics',source('world.js'))(T,enrich,finishGardens,batchStatic,installRewards,installJourney,enrichCourtyard,installParkMap,installCoffeeScene,installInterface,installSafari,installPhotography,installRoasted,installNavigation,installGraphics);
let ms=0;const frame=()=>next(ms+=16);frame();
const a=window.krownlandia;document.querySelector('#enter').onclick();const planner=createNavigator(a.blocked);
for(const p of [{x:38,z:-8},a.generalStore.boardPoint,{x:38,z:-3},{x:44,z:-20}]){assert(!a.blocked(p.x,p.z),'clear '+JSON.stringify(p));assert(planner.route({x:0,z:30},p).length,'route '+JSON.stringify(p));}
a.camera.position.set(38,1.75,-16.8);frame();assert.equal(a.getState().near,'generalstore');a.interact();assert(document.querySelector('#generalstoreMenu').open);assert(!a.getState().rewards.done.includes('generalstore-board'));const pos=a.camera.position.clone();handlers.keydown({key:'w',preventDefault(){}});frame();assert(a.camera.position.equals(pos));handlers.blur();document.querySelector('#generalstoreTopic-bottle').onclick();assert(a.getState().rewards.done.includes('generalstore-board'));document.querySelector('#generalstoreClose').onclick();
a.camera.position.set(38,1.75,-3);frame();a.interact();const task=document.querySelector('#rewardBody').children.find(n=>n.textContent?.startsWith('Claim task'));assert(task&&!task.disabled);const points=a.getState().rewards.points;task.onclick();task.onclick();assert.equal(a.getState().rewards.points,points+20);document.querySelector('#rewardClose').onclick();
const lounge=a.lounges.spots.find(s=>s.id==='generalstore');assert(lounge);const approach={x:lounge.x,z:lounge.z+1.3};assert(planner.route({x:0,z:30},approach).length);a.camera.position.set(approach.x,1.75,approach.z);frame();a.interact();assert(document.querySelector('#loungeMenu').open);document.querySelector('#loungeSnack').onclick();assert(lounge.treat.visible);document.querySelector('#loungeCollect').onclick();assert(a.journal.items().find(i=>i.id==='lounge-generalstore').owned);assert(parseBackup(exportBackup(localStorage)).data['krownlandia-lounge-souvenirs-v1'].includes('generalstore'));console.log('PASS: store entrance, browsing counter, safari approach, pause, explicit task, one-time points, lounge snack, souvenir and backup',lounge.x,lounge.z);
