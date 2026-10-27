import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {installRewards} from '../dist/rewards.js';
const nodes=new Map(),saved=new Map();
function element(){return {children:[],append(...items){this.children.push(...items)},replaceChildren(...items){this.children=items},setAttribute(){},focus(){},showModal(){this.open=true},close(){this.open=false},getContext(){return {fillRect(){},fillText(){}}}};}
globalThis.document={head:element(),body:element(),createElement:element,querySelector(key){if(!nodes.has(key))nodes.set(key,element());return nodes.get(key);}};
globalThis.localStorage={getItem:key=>saved.get(key),setItem:(key,value)=>saved.set(key,value)};
const testHomes=['meadow','harbor','woodland','eldergrove'].flatMap((village,i)=>[0,1].map(j=>({village,name:village+' home '+j,door:{x:i*10+j*3,z:70}})));
const rewards=installRewards({scene:new T.Scene(),colliders:[],pause(){},getHomes:()=>testHomes});
const body=()=>document.querySelector('#rewardBody');
const guide=()=>body().children.find(child=>child.id==='roastedMealGuide');
rewards.update(1000,{x:0,z:-88,playing:false});rewards.open('roasted-menu');
assert(!guide());body().children.find(child=>child.className==='roasted-choice').onclick();
assert.equal(guide().textContent,'Find my bowl at Roasted');guide().onclick();
assert.deepEqual(rewards.target,{x:0,z:-88,name:'Roasted food counter'});assert(!rewards.isOpen);
assert.equal(rewards.roastedOrder.status,'ready');assert.equal(rewards.state().points,0);
rewards.open('roasted-menu');body().children.find(child=>child.textContent==='Pick up my bowl').onclick();
assert.equal(guide().textContent,'Find the container return');
rewards.update(2000,{x:24,z:-10,playing:false});rewards.open();
assert.equal(guide().textContent,'Find the container return');guide().onclick();
assert.deepEqual(rewards.target,{x:-7,z:-86,name:'Roasted container return'});assert(!rewards.isOpen);
assert.equal(rewards.roastedOrder.status,'carried');assert.equal(rewards.state().points,0);
rewards.update(3000,{x:-7,z:-86,playing:false});rewards.open('roasted-return');
assert(!body().children.some(child=>child.id==='roastedReturnRewardGuide'));
body().children.find(child=>child.textContent==='Return this bowl').onclick();
const rewardGuide=body().children.find(child=>child.id==='roastedReturnRewardGuide');assert.equal(rewardGuide.textContent,'Find my 25-point reward');rewardGuide.onclick();assert(!rewards.isOpen);assert.equal(rewards.state().points,0);assert.deepEqual(rewards.target,{x:5,z:-85,name:'Roasted · Crown Palace rewards'});
rewards.update(4000,{x:5,z:-85,playing:false});rewards.open('roasted');const claim=body().children.find(child=>child.textContent?.startsWith('Claim task'));assert(claim&&!claim.disabled);claim.onclick();assert.equal(rewards.state().points,25);
rewards.open('roasted-return');assert(!body().children.some(child=>child.id==='roastedReturnRewardGuide'));assert(body().children.some(child=>child.textContent?.includes('already been collected')));rewards.open();
assert(!guide());assert.equal(rewards.roastedOrder,null);assert.equal(rewards.state().points,25);
console.log('PASS: waiting and carried bowl directions, remote Rewards access, panel closing, no automatic returns or points, and removal after return.');

console.log('PASS: earned reward directions, no automatic award, and guidance removed after the one-time claim.');
rewards.update(5000,{x:35,z:-51,playing:false});rewards.open('popcorn');
const hint=()=>body().children.find(child=>child.id==='popcornRewardHint');
assert(hint().textContent.includes('prepare a serving'));const popcornPoints=rewards.state().points;
body().children.find(child=>child.id==='popcornCounterGuide').onclick();assert(!rewards.isOpen);assert.deepEqual(rewards.target,{x:34,z:-56.3,name:'Circus popcorn stand'});assert.equal(rewards.state().points,popcornPoints);assert(!rewards.state().done.includes('popcorn-pickup'));
rewards.update(6000,{x:35,z:-51,playing:false,popcornCollected:true});rewards.open('popcorn');assert(hint().textContent.includes('pickup is complete'));body().children.find(child=>child.textContent?.startsWith('Claim task')).onclick();assert.equal(rewards.state().points,popcornPoints+15);assert(hint().textContent.includes('reward is collected'));assert(body().children.find(child=>child.textContent==='Task reward collected').disabled);
console.log('PASS: popcorn counter guidance, prepare/pickup instructions, ready/claimed messages and no reward from navigation.');
for(const [id,x,z] of [['journey',-30,-34],['safari',47,-26],['circus',39,-51]]){rewards.open(id);const before=JSON.stringify(rewards.state());const button=body().children.find(child=>child.id==='activityGuide-'+id);assert(button);button.onclick();assert(!rewards.isOpen);assert.equal(rewards.target.x,x);assert.equal(rewards.target.z,z);assert.equal(JSON.stringify(rewards.state()),before);}
console.log('PASS: three activity-entry links close Rewards and set walking targets without changing progress.');
for(const [id,x,z] of [['arrival',4,12],['gardens',-7,-9],['discovery',17,-46]]){rewards.open(id);const before=JSON.stringify(rewards.state());body().children.find(child=>child.id==='firstTaskGuide-'+id).onclick();assert(!rewards.isOpen);assert.equal(rewards.target.x,x);assert.equal(rewards.target.z,z);assert.equal(JSON.stringify(rewards.state()),before);}
rewards.update(7000,{x:4,z:10,playing:false,metPip:true,collected:true});rewards.open('gate');body().children.find(child=>child.textContent?.startsWith('Check in')).onclick();for(const id of ['arrival','gardens','discovery']){rewards.open(id);assert(!body().children.some(child=>child.id==='firstTaskGuide-'+id));}
console.log('PASS: first-task guidance preserves progress and disappears after gate check-in, meeting Pip or crown collection.');
const progressText=()=>body().children.find(child=>child.id==='checkInProgress')?.textContent;
rewards.open('gate');assert.equal(progressText(),'1 of 3 required check-ins completed');const beforeNext=JSON.stringify(rewards.state());body().children.find(child=>child.id==='nextCheckInGuide').onclick();assert(!rewards.isOpen);assert.equal(rewards.target.name,'Community Office Garden rewards');assert.equal(JSON.stringify(rewards.state()),beforeNext);
rewards.open('palace');assert.equal(progressText(),'1 of 8 required check-ins completed');assert(!body().children.find(child=>child.id==='missingGatewayStations').textContent.includes('Crown Gate'));
let checkTime=8000;for(const [id,x,z] of [['safari',44,-22],['popcorn',35,-51]]){rewards.update(checkTime++,{x,z,playing:false});rewards.open(id);body().children.find(child=>child.textContent?.startsWith('Check in')).onclick();}
rewards.open('gate');assert.equal(progressText(),'3 of 3 required check-ins completed');assert(!body().children.some(child=>child.id==='nextCheckInGuide'));rewards.open('palace');assert.equal(progressText(),'1 of 8 required check-ins completed');
for(const [id,x,z] of [['arrival',-4,26],['gardens',-5,-4],['shop',-20,-9],['cafe',20,-9],['fountain',4,-25],['discovery',17,-53],['palace',4,-73]]){rewards.update(checkTime++,{x,z,playing:false});rewards.open(id);body().children.find(child=>child.textContent?.startsWith('Check in')).onclick();}
assert.equal(progressText(),'8 of 8 required check-ins completed');assert(!body().children.some(child=>child.id==='nextCheckInGuide'));assert(!body().children.some(child=>child.id==='missingGatewayStations'));assert(body().children.some(child=>child.textContent==='Claim task · +50 points'&&!child.disabled));
console.log('PASS: three-stop and eight-Gateway counts, nearest unvisited guidance, excluded attraction visits and completed-goal cleanup.');

for(const [id,village] of [['meadow','meadow'],['harbor','harbor'],['woodland','woodland'],['eldergrove-homes','eldergrove'],['riverbend-homes','riverbend']]){if(village==='riverbend'&&!testHomes.some(h=>h.village===village))testHomes.push({id:'riverbend-1',village,name:'Riverbend · Home 1',door:{x:-30,z:174}});const home=testHomes.find(h=>h.village===village);rewards.update(checkTime++,{x:home.door.x,z:home.door.z+1,playing:false});rewards.open(id);const before=JSON.stringify(rewards.state());body().children.find(child=>child.id==='villageHomeGuide').onclick();assert(!rewards.isOpen);assert.deepEqual(rewards.target,{...home.door,name:home.name});assert.equal(JSON.stringify(rewards.state()),before);assert(!saved.has('krownlandia-home-v1'));rewards.update(checkTime++,{x:home.door.x,z:home.door.z,playing:false,visitedVillage:village});rewards.open(id);assert(!body().children.some(child=>child.id==='villageHomeGuide'));}
console.log('PASS: all five housing rewards guide to the nearest home without choosing a home or awarding visit progress.');
const progressById=id=>body().children.find(child=>child.id===id).textContent;
rewards.open('library');assert(progressById('libraryRewardProgress').includes('0 of 3'));rewards.recordLibraryPage(0);rewards.open('library');assert(progressById('libraryRewardProgress').includes('2, 3'));rewards.recordLibraryPage(1);rewards.recordLibraryPage(2);rewards.open('library');assert(progressById('libraryRewardProgress').includes('Return to the reading desk'));rewards.completeLibrary();rewards.open('library');assert(progressById('libraryRewardProgress').includes('Bookmark collected'));
for(const [id,x,z,count] of [['tree',35,121,0],['craft',46,119,1],['herbs',26.5,122.8,2]]){rewards.open('eldergrove');assert(progressById('forestRewardProgress').startsWith(count+' of 3'));const before=JSON.stringify(rewards.state());body().children.find(child=>child.id==='eldergroveTreeGuide').onclick();assert.equal(rewards.target.x,x);assert.equal(rewards.target.z,z);assert.equal(JSON.stringify(rewards.state()),before);rewards.recordEldergrove(id);}rewards.open('eldergrove');assert.equal(progressById('forestRewardProgress'),'3 of 3 forest discoveries recorded');assert.equal(body().children.find(child=>child.id==='eldergroveTreeGuide').textContent,'Visit the Great Elder Tree');
console.log('PASS: reading progress, separate bookmark collection and forest guidance skipping recorded discoveries.');

// Passport filters expose earned tasks without granting points remotely.
const rows=()=>body().children.filter(child=>child.className==='reward-row');
const filter=value=>body().children.find(child=>child.className==='passport-filters').children.find(child=>child.id==='passportFilter-'+value);
rewards.open();assert.equal(rows().length,29);
const passportBefore=JSON.stringify(rewards.state());
filter('ready').onclick();assert(rows().length>0);
assert(rows().every(row=>row.children[0].children[0].textContent.startsWith('Task ready to claim')));
assert(!rows().some(row=>row.id==='passportStation-roasted'));
const libraryRow=rows().find(row=>row.id==='passportStation-library');assert(libraryRow);
libraryRow.children[1].children[0].onclick();assert.equal(document.querySelector('#rewardTitle').textContent,'Library of Alexandria');
assert(body().children.find(child=>child.textContent?.startsWith('Claim task')).disabled);
body().children.find(child=>child.textContent==='All stations').onclick();
assert(rows().every(row=>row.children[0].children[0].textContent.startsWith('Task ready to claim')));
rows().find(row=>row.id==='passportStation-library').children[1].children[1].onclick();assert(!rewards.isOpen);assert.deepEqual(rewards.target,{x:39,z:49,name:'Library of Alexandria rewards'});
assert.equal(JSON.stringify(rewards.state()),passportBefore);
rewards.open();filter('unvisited').onclick();assert(rows().every(row=>row.children[0].textContent.endsWith('Not visited')));assert(!rows().some(row=>row.id==='passportStation-gate'));
filter('all').onclick();assert.equal(rows().length,29);
// Empty states use a fresh visitor and a visitor who has checked in everywhere.
saved.clear();const fresh=installRewards({scene:new T.Scene(),colliders:[],pause(){}});fresh.open();filter('ready').onclick();assert.equal(rows().length,0);assert(body().children.some(child=>child.id==='passportEmpty'));assert(body().children.find(child=>child.id==='readyTaskSummary').textContent.startsWith('No task rewards'));
const {STATIONS}=await import('../dist/rewards-core.js');let clock=20000;
for(const station of STATIONS){fresh.update(clock++,{x:station.x,z:station.z,playing:false});fresh.open(station.id);body().children.find(child=>child.textContent?.startsWith('Check in')).onclick();}
fresh.open();filter('unvisited').onclick();assert.equal(rows().length,0);assert(body().children.find(child=>child.id==='passportEmpty').textContent.includes('every station'));
console.log('PASS: passport ready/unvisited filters, details, remote claim guards, walking directions, filter retention and empty states.');
fresh.open('builders');assert(body().children.find(child=>child.id==='buildersRewardProgress').textContent.startsWith('0 of 3'));fresh.recordBuildersPage(0);fresh.recordBuildersPage(7);fresh.open('builders');assert(body().children.find(child=>child.id==='buildersRewardProgress').textContent.includes('2, 3'));assert(!fresh.state().done.includes('builders-page-7'));fresh.recordBuildersPage(1);fresh.recordBuildersPage(2);fresh.open('builders');assert(body().children.find(child=>child.id==='buildersRewardProgress').textContent.includes('Return to the exhibit'));const beforeHistory=JSON.stringify(fresh.state());body().children.find(child=>child.id==='buildersExhibitGuide').onclick();assert.deepEqual(fresh.target,{x:-26,z:30,name:'Making of Krownlandia exhibit'});assert(!fresh.isOpen);assert.equal(JSON.stringify(fresh.state()),beforeHistory);fresh.completeBuilders();fresh.open('builders');assert(body().children.find(child=>child.id==='buildersRewardProgress').textContent.includes('Crown collected'));
console.log('PASS: history reward station progress, valid chapter IDs, explicit crown collection and exhibit directions.');
fresh.open();filter('all').onclick();const passportSearch=document.querySelector('#passportSearch');const searchFor=value=>{passportSearch.value=value;passportSearch.oninput();};const searchBefore=JSON.stringify(fresh.state());searchFor('  LÍSA’S coffee  ');assert.equal(rows().length,1);assert.equal(rows()[0].id,'passportStation-cafe');assert.equal(document.querySelector('#passportSearchCount').textContent,'1 of 29 stations shown');const originalInput=passportSearch;rows()[0].children[1].children[0].onclick();assert(document.querySelector('#passportSearchControls').hidden);body().children.find(child=>child.textContent==='All stations').onclick();assert(!document.querySelector('#passportSearchControls').hidden);assert.equal(document.querySelector('#passportSearch'),originalInput);assert.equal(rows().length,1);filter('unvisited').onclick();assert.equal(rows().length,0);assert(body().children.find(child=>child.id==='passportEmpty').textContent.includes('this filter'));filter('all').onclick();searchFor('zzzzzz');assert.equal(rows().length,0);document.querySelector('#passportSearchClear').onclick();assert.equal(rows().length,29);assert.equal(passportSearch.value,'');assert(document.querySelector('#passportSearchClear').hidden);assert.equal(JSON.stringify(fresh.state()),searchBefore);
console.log('PASS: passport search normalization, multiword matching, combined filters, detail-return retention, input identity, empty/clear states and unchanged rewards.');
for(const [page,x,z] of [['library',30,40],['builders',-26,30],['eldergrove',46,119]]){saved.clear();const next=installRewards({scene:new T.Scene(),colliders:[],pause(){}});if(page==='library')next.recordLibraryPage(0);else if(page==='builders')next.recordBuildersPage(0);else next.recordEldergrove('tree');next.open();const dialog=document.body.children.at(-1);const continueButton=dialog.children.find(b=>b.id==='nextReward');assert.equal(continueButton.textContent,'Continue my discovery');const before=JSON.stringify(next.state());continueButton.onclick();assert.equal(next.target.x,x);assert.equal(next.target.z,z);assert(!next.isOpen);assert.equal(JSON.stringify(next.state()),before);}
console.log('PASS: continuing discoveries guides directly to the reading desk, history exhibit or next unrecorded forest stop without awarding progress.');
