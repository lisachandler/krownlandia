import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from '../dist/vendor/three.module.js';
const nodes=new Map();
function element(tag){return {tag,children:[],attrs:{},set id(id){nodes.set(id,this)},append(...xs){this.children.push(...xs)},setAttribute(k,v){this.attrs[k]=v},replaceChildren(...xs){this.children=xs},showModal(){this.open=true},close(){this.open=false},focus(){document.activeElement=this},getContext(){return {fillRect(){},fillText(){},measureText(){return {width:100}}}}};}
globalThis.document={createElement:element,head:element('head'),body:element('body')};

const {installProduceGarden}=await import('../dist/produce-garden.js');
const camera=new T.PerspectiveCamera();camera.position.set(-37,1.75,53);
let seat=null,waterCalls=0,guide=null;
globalThis.document.querySelector=()=>element('nav');
const {installFoodGuide}=await import('../dist/food-guide.js');
const food=installFoodGuide({pause(){},guideTo(){},lounges:{spots:[]}});
const garden=installProduceGarden({scene:new T.Scene(),camera,colliders:[],pause(){},getCurrentSeat:()=>seat,getRoastedCounter:()=>food.places().find(p=>p.id==="roasted"),rewards:{guideToPoint:p=>guide=p,state:()=>({done:waterCalls?['produce-water']:[],claims:[],saved:true}),completeProduce(){waterCalls++;}}});
const node=id=>nodes.get(id),press=id=>node('plot'+id).onclick();
const layout=()=>[0,1,2].map(i=>node('plotBed'+i).textContent).join('/');
const first='Carrots/Tomatoes/Leafy greens';
assert(garden.open());press('Left');assert.equal(layout(),first);
node('plotPlanner').open=true;
const seen=new Set();for(let i=0;i<6;i++){seen.add(layout());press(i%2?'Right':'Left');}
assert.equal(seen.size,6);assert.equal(layout(),first);
press('Rotate');assert.equal(layout(),'Leafy greens/Carrots/Tomatoes');assert(node('plotStatus').textContent.includes('Leafy greens, Carrots, Tomatoes'));
press('Rotate');press('Rotate');assert.equal(layout(),first);
camera.position.set(0,1.75,0);press('Left');assert.equal(layout(),first);
for(seat of garden.seats){press('Left');assert.notEqual(layout(),first);press('Reset');assert.equal(layout(),first);}
press('Right');node('produceClose').onclick();press('Left');assert.equal(layout(),'Carrots/Leafy greens/Tomatoes');
assert(garden.open());assert.equal(node('plotPlanner').open,false);assert.equal(layout(),first);assert.equal(waterCalls,0);
seat=null;camera.position.set(-37,1.75,53);node('produceWater').onclick();node('produceWater').onclick();assert.equal(waterCalls,1);
console.log('PASS: six layouts, rotation cycle, status text, reset, both seats, closed/collapsed/distant guards and independent one-time watering.');

const walk=()=>node('produceVisitRoasted').onclick();
walk();assert.equal(guide,null,'collapsed notes do not route');
for(const current of [null,...garden.seats]){
 seat=current;camera.position.set(current?0:-37,1.75,current?0:53);
 if(!garden.isOpen)assert(garden.open());
 node('produceNotes').open=true;const pos=camera.position.clone();walk();
 assert.deepEqual(guide,{name:'Roasted · Krown Palace',x:0,z:-86.5});assert(!garden.isOpen);assert(camera.position.equals(pos));assert.equal(waterCalls,1);
 guide=null;walk();assert.equal(guide,null,'closed dialog does not route');
}
console.log('PASS: board and both seated visitors receive actual food-guide counter directions without moving or watering.');

seat=null;camera.position.set(garden.boardPoint.x,1.75,garden.boardPoint.z);assert(garden.open());
const care=node('plotCare'),planner=node('plotPlanner'),prompt=node('plotCarePrompt'),feedback=node('plotCareFeedback'),next=node('plotCareNext');
const choose=i=>node('plotCareChoice'+i).onclick();
assert(!care.open&&!planner.open);choose(0);assert.equal(feedback.textContent,'');
planner.open=true;care.open=true;choose(1);assert.match(feedback.textContent,/does not match/);assert(next.hidden);
camera.position.set(0,1.75,0);choose(0);assert(next.hidden);
seat=garden.seats[0];choose(0);assert.match(feedback.textContent,/dry-bed cue/);assert(!next.hidden);
next.onclick();assert.equal(document.activeElement,node('plotCareChoice0'));assert.match(prompt.textContent,/2 of 3/);
choose(1);next.onclick();assert.match(prompt.textContent,/3 of 3/);
choose(2);assert.match(feedback.textContent,/needs no action/);assert.equal(waterCalls,1);
node('produceClose').onclick();next.onclick();assert.match(prompt.textContent,/3 of 3/);
assert(garden.open());assert(!care.open&&!planner.open);assert.match(prompt.textContent,/1 of 3/);assert.equal(feedback.textContent,'');
console.log('PASS: three practice care choices, retry, seated access, focus, remote/closed guards and no watering writes.');

const guideLink=node('plotPaperGuide');
assert(planner.children.some(row=>row.children.includes(guideLink)));
assert.equal(guideLink.href,'/reports/garden-practice.html');assert.equal(guideLink.target,'_blank');assert.equal(guideLink.rel,'noopener');
const paper=readFileSync(new URL('../dist'+guideLink.href,import.meta.url),'utf8');
assert.match(paper,/@lisachandler, historical inventory page 15/);
assert.match(paper,/@josefan12, page 16/);assert.doesNotMatch(paper,/<script\b/);
const cues=[...paper.matchAll(/<li><p>([^<]+)<\/p><details>/g)].map(m=>m[1]);
assert.equal(cues.length,3);
planner.open=true;care.open=true;
press('Rotate');press('Rotate');assert.equal(layout(),'Tomatoes/Leafy greens/Carrots');
press('Right');assert.equal(layout(),'Tomatoes/Carrots/Leafy greens');
assert(paper.includes('Tomatoes, Carrots, Leafy greens'));
for(const [i,cue] of cues.entries()){assert(prompt.textContent.endsWith(cue));choose(i);assert(!next.hidden);next.onclick();}
assert.equal(waterCalls,1,'paper-equivalent practice adds no watering');
console.log('PASS: the no-3D guide matches the practice layout, three care clues and recorded credits.');
