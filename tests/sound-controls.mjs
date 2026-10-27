import fs from 'node:fs';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../dist/atmosphere.js',import.meta.url),'utf8');
const code=source.slice(source.indexOf('  const sound='),source.indexOf('  const direction='));
const events={},sound={setAttribute(k,v){this[k]=v}},document={hidden:false,createElement:()=>sound,querySelector:()=>({append(){}}),addEventListener:(k,f)=>events[k]=f};
let resumeResolve,resumes=0,suspends=0,lastGain=0;
const node=()=>({frequency:{},gain:{setTargetAtTime:v=>lastGain=v},connect(next){return next},start(){},setPosition(){}});
class Audio{sampleRate=1;currentTime=0;destination={};createBuffer(){return{getChannelData:()=>new Float32Array(3)}}createBufferSource=node;createBiquadFilter=node;createPanner=node;createGain=node;resume(){resumes++;return new Promise(r=>resumeResolve=r)}suspend(){suspends++;return Promise.resolve()}}
new Function('document','window',code)(document,{AudioContext:Audio});
const start=sound.onclick();assert(sound.disabled);await sound.onclick();assert.equal(resumes,1,'rapid repeated requests cannot reverse the pending toggle');
document.hidden=true;events.visibilitychange();resumeResolve();await start;assert.equal(lastGain,0);assert.equal(sound['aria-pressed'],'true');assert(!sound.disabled);assert(suspends>0);
document.hidden=false;events.visibilitychange();resumeResolve();await Promise.resolve();assert.equal(lastGain,.32);
const before=resumes;await sound.onclick();assert.equal(resumes,before,'turning sound off does not resume the audio engine');assert.equal(lastGain,0);assert.equal(sound['aria-pressed'],'false');assert(!sound.disabled);
events.visibilitychange();assert.equal(resumes,before,'disabled sound stays off when returning');
console.log('PASS: serialized sound startup, hidden-tab startup stays muted, visible restoration, explicit off without resume and retained off preference.');
