import './school-seating.mjs';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {installOfficeGarden} from '../dist/office-garden.js';
const create=document.createElement.bind(document);document.createElement=(...args)=>{const el=create(...args);el.attributes={};el.setAttribute=(key,value)=>el.attributes[key]=value;return el;};
const camera=new T.PerspectiveCamera();camera.position.set(14.7,1.75,-13.7);let done=[],guided=null;
const office=installOfficeGarden({scene:new T.Scene(),camera,colliders:[],pause(){},rewards:{state:()=>({claims:[],done,saved:true}),completeOfficeIdea:()=>done=['office-idea'],guideToPoint:p=>guided=p,guideTo(){}}});
const $=s=>document.querySelector(s),choices=$('#officeProjects'),detail=$('#officeProjectDetail'),visit=$('#officeProjectVisit');
assert.equal(choices.attributes.role,'group');assert.equal(choices.attributes['aria-label'],'Community ideas');assert.equal(detail.attributes.role,'status');assert.equal(detail.attributes['aria-atomic'],'true');assert.equal(visit.attributes['aria-describedby'],'officeProjectDetail');assert.equal(choices.children.at(-1),visit);assert.deepEqual(choices.children.slice(0,-1),['library','square','produce'].map(id=>$('#officeProject-'+id)));
for(const [id,name] of [['library','Library of Alexandria'],['square','Krownlandia Town Square'],['produce','Community Produce Garden']]){assert(office.open());assert(visit.hidden);$('#officeProject-'+id).onclick();assert(!visit.hidden);assert.equal(visit.textContent,'Visit '+name);assert(detail.textContent.includes('Original place contribution'));assert.equal($('#officeProject-'+id).attributes['aria-pressed'],'true');visit.onclick();assert(!office.isOpen);assert(guided);}
assert(office.open());assert(visit.hidden);assert.equal(detail.textContent,'Choose a community idea to read its credit and get directions.');assert.deepEqual(done,['office-idea']);console.log('PASS: idea choices precede visit control, named group, polite atomic description, linked description, all selections and reset.');

$('#officeGardenClose').onclick();done=[];guided=null;
assert(office.open());
const green=$('#officeGreenCorner'),plan=$('#greenCornerPlan'),feedback=$('#greenCornerFeedback');
assert.equal(green.open,false);const initial=feedback.textContent;
plan.value='direct';plan.onchange();assert.equal(feedback.textContent,initial);
green.open=true;
for(const [key,message] of [['direct','straight path'],['loop','more path space'],['edge','larger planted area']]){
 plan.value=key;plan.onchange();assert(feedback.textContent.includes(message));
}
assert.deepEqual(done,[]);assert.equal(guided,null);
$('#officeGardenClose').onclick();assert(office.open());assert(!green.open);assert.equal(plan.value,'');assert.equal(feedback.textContent,initial);
console.log('PASS: optional Green World Park layout comparison, collapsed guard, clean reopening and unchanged task state.');
