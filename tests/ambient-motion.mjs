import assert from 'node:assert/strict';

const preference={matches:false};
globalThis.matchMedia=()=>preference;
const {frame}=await import('./school-seating.mjs');
const {scene,camera}=window.krownlandia;
const waterfall=scene.getObjectByName('Palace waterfalls'),garden=scene.getObjectByName('Garden fireflies'),
 forest=scene.getObjectByName('Forest fireflies · Woodland edge'),ring=scene.getObjectByName('Pond ripple');
assert(waterfall&&garden&&forest&&ring);
document.querySelector('#night').onclick();
assert(window.krownlandia.getState().night);
camera.position.set(-25,1.75,130);frame();
assert(garden.visible&&forest.visible&&waterfall.visible);
const sample=()=>[waterfall.instanceMatrix.version,garden.instanceMatrix.version,forest.instanceMatrix.version,ring.scale.x];
const moving=sample();frame(50);assert(sample().every((v,i)=>v!==moving[i]));
preference.matches=true;frame();
const still=sample();assert(still.slice(0,3).every((v,i)=>v>moving[i]));
for(let i=0;i<20;i++)frame(50);
assert.deepEqual(sample(),still);assert(garden.visible&&forest.visible&&waterfall.visible);
camera.position.set(0,1.75,30);frame();assert(!forest.visible);
camera.position.set(-25,1.75,130);frame();assert(forest.visible);assert.deepEqual(sample(),still);
preference.matches=false;frame(50);assert(sample().every((v,i)=>v!==still[i]));
console.log('PASS: live motion preference freezes and resumes ambient effects, retaining nearby night visibility.');
