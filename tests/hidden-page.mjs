import {frame,documentHandlers,renderCount} from './school-seating.mjs';
import assert from 'node:assert/strict';
const a=window.krownlandia,$=s=>document.querySelector(s);
a.camera.position.set(-32,1.75,-36);frame();a.interact();frame();assert(a.getState().journey.active);
const visibleState=JSON.stringify(a.getState().journey),position=a.camera.position.clone(),points=a.getState().rewards.points;
document.hidden=true;documentHandlers.visibilitychange();const rendered=renderCount;
for(let i=0;i<20;i++)frame(1000);
assert.equal(renderCount,rendered,'hidden callbacks do not render');assert.equal(JSON.stringify(a.getState().journey),visibleState,'ride does not advance in a hidden tab');assert(a.camera.position.equals(position));assert.equal(a.getState().rewards.points,points);
document.hidden=false;documentHandlers.visibilitychange();frame(60000);assert.equal(renderCount,rendered,'first resumed frame resets time');assert.equal(JSON.stringify(a.getState().journey),visibleState);frame();assert.equal(renderCount,rendered+1);assert.notEqual(JSON.stringify(a.getState().journey),visibleState,'normal ride progression resumes');
// Browsers may suspend all animation callbacks while hidden.
document.hidden=true;documentHandlers.visibilitychange();const state=JSON.stringify(a.getState().journey),count=renderCount;document.hidden=false;documentHandlers.visibilitychange();frame(60000);assert.equal(renderCount,count);assert.equal(JSON.stringify(a.getState().journey),state);frame();assert.equal(renderCount,count+1);
$('#journeyExit').onclick();a.reset();frame();assert(!a.getState().journey.active);
console.log('PASS: hidden pages skip rendering and ride updates; return resets elapsed time with or without hidden callbacks, resumes normally and preserves points.');
