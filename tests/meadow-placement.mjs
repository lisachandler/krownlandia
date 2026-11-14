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

// Proposed expanded footprints include a .3-unit visitor clearance margin.
const tables=[{x:-28,z:90,w:1.3,d:1.05},{x:-24,z:90,w:1.3,d:1.05}];
const patch={minX:-30,maxX:-22,minZ:87,maxZ:93};
function overlap(c){if(c.r){const x=Math.max(patch.minX,Math.min(c.x,patch.maxX)),z=Math.max(patch.minZ,Math.min(c.z,patch.maxZ));return Math.hypot(x-c.x,z-c.z)<c.r+.3;}return c.x+c.w>patch.minX&&c.x-c.w<patch.maxX&&c.z+c.d>patch.minZ&&c.z-c.d<patch.maxZ;}
assert.deepEqual(a.testColliders.filter(overlap),tables,'Only the two planned table bounds occupy the patch');
const proposed=(x,z)=>a.blocked(x,z);
const nav=createNavigator(proposed),entry={x:-26,z:95},targets=[{x:-28,z:92,name:'loom approach'},{x:-24,z:92,name:'produce approach'},entry];
const homes=a.villages.homes.filter(h=>h.village==='meadow');
const starts=[{x:2,z:28,name:'gate'},{x:-26.8,z:76,name:'tram approach'},{x:-29,z:84.5,name:'reward station approach'},{x:-40,z:97,name:'picnic approach'},...homes.map(h=>({...h.door,name:h.name})),...a.villages.seats.filter(s=>homes.some(h=>h.id===s.homeId)||s.name.startsWith('Meadow Picnic Garden')).map(s=>({...s.approach,name:s.name}))];
let routes=0;for(const start of starts){assert(!proposed(start.x,start.z),'Existing access: '+start.name);for(const target of targets){assert(!proposed(target.x,target.z));const path=nav.route(start,target);assert(path.length,'Route: '+start.name);for(let i=1;i<path.length;i++)assert(nav.clear(path[i-1],path[i]),'No corner cutting');assert(Math.hypot(path.at(-1).x-target.x,path.at(-1).z-target.z)<1.8);routes++;}}
assert(nav.clear({x:-26,z:87},{x:-26,z:97}),'Central aisle');assert(nav.clear({x:-40,z:97},{x:-22,z:97}),'Usable picnic path remains clear');assert(nav.route({x:-40,z:97},entry).length,'Picnic connection');
assert.deepEqual(homes.map(h=>h.id),['meadow-1','meadow-2','meadow-3']);
console.log('PASS: full-scene patch has no existing collider overlap; '+routes+' routes preserve homes, nearby seats, tram, rewards and picnic access with actual table footprints.');
console.log('LIMIT: deterministic collision checks; GPU rendering remains unverified.');

// The world control opens the same activity instance as the directory.
const node=id=>document.querySelector('#'+id),click=id=>node(id).onclick();
click('enter');a.camera.position.set(-28,1.75,92);frame();assert.equal(a.getState().near,'craft');a.interact();assert(a.villages.isOpen);assert.equal(document.activeElement,node('weaveRose'));
click('weaveRose');assert.match(node('weavingStatus').textContent,/Pattern: rose/);
const meshes=[];a.scene.traverse(m=>{if(m.isMesh)meshes.push(m)});const tile=meshes.find(m=>m.position.x===-28.7&&m.position.y===1.1);assert(tile);assert.equal(tile.material.color.getHexString(),'a94c75');
const counts=()=>{let meshes=0;const materials=new Set(),geometry=new Set();a.scene.traverse(m=>{if(m.isMesh){meshes++;materials.add(m.material);geometry.add(m.geometry)}});return [meshes,materials.size,geometry.size]};
const before=counts();a.camera.position.x=0;click('weaveGold');assert.match(node('weavingStatus').textContent,/Pattern: rose\./);node('villageMenu').close();a.villages.open();node('meadowWeaving').open=true;click('weaveGold');assert.match(node('weavingStatus').textContent,/rose, gold/);
node('villageMenu').close();a.camera.position.set(-24,1.75,92);frame();a.interact();assert.equal(document.activeElement,node('market-apples'));click('market-apples');click('market-carrots');click('market-greens');click('marketFinish');assert.match(node('marketStatus').textContent,/Table ready/);
node('villageMenu').close();a.villages.open();node('meadowMarket').open=true;assert.match(node('marketStatus').textContent,/Apples, Carrots, Leafy greens/);click('marketReset');assert.equal(meshes.filter(m=>m.geometry.type==='SphereGeometry'&&m.position.y===1.3&&m.position.z>=89.9&&m.position.z<90.2&&m.position.x<-23&&m.position.x>-25&&m.visible).length,0);
assert.equal(counts()[0],before[0]);assert.equal(counts()[2],before[2]);
node('villageMenu').close();a.camera.position.set(-28,1.75,92);a.reset();a.villages.openCraft();assert(!a.villages.isOpen,'Not playing guard');
assert.equal(a.villages.craftPlaces.length,2);assert(a.villages.craftPlaces.every(p=>!a.blocked(p.x,p.z)));
console.log('PASS world interaction, distance/playing guards, shared directory state, display updates and stable mesh/geometry counts.');

click('enter');click('mapButton');click('mapCollectRewards');click('mapCraftActivities');const craftRows=node('mapLocations').children;assert.equal(craftRows.length,5);const names=craftRows.map(r=>r.children[0].textContent);for(const word of ['weaving','market','Riverbend','woodcraft','Stonehearth'])assert(names.some(n=>n.includes(word)));for(const row of craftRows)assert.match(row.children[1].textContent,/until reload/);const oldPosition=a.camera.position.clone();const rewardBefore=JSON.stringify(a.getState().rewards);craftRows[0].onclick();assert(a.camera.position.equals(oldPosition));assert.equal(JSON.stringify(a.getState().rewards),rewardBefore);assert(!node('parkMap').open);console.log('PASS five real craft map destinations, session-only descriptions, reward-filter handoff and guidance without teleporting or rewards.');
