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
new Function('T','enrich','finishGardens','batchStatic','installRewards','installJourney','enrichCourtyard','installParkMap','installCoffeeScene','installInterface','installSafari','installPhotography','installRoasted','installNavigation','installGraphics',source('world.js'))(T,enrich,finishGardens,batchStatic,installRewards,installJourney,enrichCourtyard,installParkMap,installCoffeeScene,installInterface,installSafari,installPhotography,installRoasted,installNavigation,installGraphics);
let ms=0;const frame=()=>next(ms+=16);frame();
const a=window.krownlandia,root=a.scene.getObjectByName('Krownlandia residential villages');const expected=new Map([['b6aca0',46],['c9beb0',24],['a39b8c',6],['b9b1a2',9]]),found=[];root.traverse(o=>{if(o.isMesh&&expected.has(o.material.color?.getHexString()))found.push(o);});assert.equal(found.length,4);for(const mesh of found){assert(mesh.isInstancedMesh);assert.equal(mesh.count,expected.get(mesh.material.color.getHexString()));assert(mesh.castShadow&&mesh.receiveShadow);assert.equal(mesh.material.roughness,.8);}assert.equal(new Set(a.villages.homes.map(h=>h.furniture)).size,15);assert.equal(new Set(a.villages.homes.map(h=>h.porchGlow)).size,15);console.log('PASS: 85 Riverbend stone pieces in four instanced batches, original finish/shadow settings and independent home palettes and lantern materials');

// Count actual writes and collection reads using the production update method.
let reads=0,items=[];
const makeVillages=()=>globalThis.installVillages({
 scene:new Real.Scene(),camera:new Real.PerspectiveCamera(),colliders:[],
 pause(){},guideTo(){},getSouvenirs(){reads++;return items;}
});
const unconfigured=makeVillages();
unconfigured.update(0,0);unconfigured.update(1,2000);
assert.equal(reads,0,'blank frames do not read the collection');
saved.set('krownlandia-home-decor-v1',JSON.stringify({'riverbend-1':{palette:'rose',souvenir:'later',porchLight:false}}));
const village=makeVillages();
const [chosen,other]=village.homes.filter(h=>h.village==='riverbend');
let writes=0,level=other.porchLight.intensity;
Object.defineProperty(other.porchLight,'intensity',{get:()=>level,set(value){level=value;writes++;}});
village.update(0,0);
const textureVersion=chosen.display.texture.version;
for(let t=16;t<1000;t+=16)village.update(0,t);
assert.equal(writes,1);assert.equal(reads,1);assert.equal(chosen.display.key,'rose:');
village.update(.5,999);
assert.equal(writes,2);assert.equal(level,4);assert.equal(chosen.porchLight.intensity,0);
assert.equal(chosen.interiorLight.intensity,7.5);assert.equal(reads,1);
items=[{id:'later',name:'A later keepsake',color:'#654321'}];
village.update(.5,1000);
assert.equal(reads,2);assert.equal(chosen.display.key,'rose:later');
assert.equal(chosen.display.texture.version,textureVersion+1);
village.update(.5,2000);
assert.equal(reads,3);assert.equal(writes,2);
assert.equal(chosen.display.texture.version,textureVersion+1);
items=[];
village.update(.5); // Explicit changes do not wait for the next frame check.
assert.equal(chosen.display.key,'rose:');
assert.equal(chosen.display.texture.version,textureVersion+2);
console.log('PASS: steady lighting skips writes, dusk still changes lights, and framed keepsakes refresh without rebuilding the collection every frame.');
