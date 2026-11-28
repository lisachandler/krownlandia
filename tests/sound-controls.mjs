import fs from 'node:fs';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../dist/atmosphere.js',import.meta.url),'utf8');
const code=source.slice(source.indexOf('  const sound='),source.indexOf('  const direction='));
const events={},sound={setAttribute(k,v){this[k]=v}},document={hidden:false,createElement:()=>sound,querySelector:()=>({append(){}}),addEventListener:(k,f)=>events[k]=f};
const pending=[];let resumes=0,suspends=0,lastGain=0;
const node=()=>({frequency:{},gain:{setTargetAtTime:v=>lastGain=v},connect(next){return next},start(){},setPosition(){}});
class Audio{sampleRate=1;currentTime=0;destination={};createBuffer(){return{getChannelData:()=>new Float32Array(3)}}createBufferSource=node;createBiquadFilter=node;createPanner=node;createGain=node;resume(){resumes++;return new Promise(r=>pending.push(r))}suspend(){suspends++;return Promise.resolve()}}
const setPaused=new Function('document','window',code+';return setGraphicsPaused;')(document,{AudioContext:Audio});
const resolve=async()=>{assert(pending.length,'expected an outstanding audio resume');pending.shift()();await Promise.resolve();};
const start=sound.onclick();assert(sound.disabled);await sound.onclick();assert.equal(resumes,1,'rapid repeated requests cannot reverse the pending toggle');
setPaused(true);document.hidden=true;events.visibilitychange();await resolve();await start;
assert.equal(lastGain,0);assert.equal(sound['aria-pressed'],'true');assert(!sound.disabled);assert(suspends>0);
setPaused(false);assert.equal(resumes,1,'graphics recovery cannot resume audio in a hidden tab');
document.hidden=false;events.visibilitychange();await resolve();assert.equal(lastGain,.32);

setPaused(true);assert.equal(lastGain,0,'graphics loss mutes already playing audio');
setPaused(false);setPaused(true);setPaused(false);
await resolve();assert.equal(lastGain,0,'a stale resume cannot unmute a newer recovery');
await resolve();assert.equal(lastGain,.32);

setPaused(true);document.hidden=true;events.visibilitychange();
const before=resumes;document.hidden=false;events.visibilitychange();
assert.equal(resumes,before,'returning to a visible tab cannot resume while graphics are lost');
setPaused(false);assert.equal(resumes,before+1);
await sound.onclick();assert.equal(resumes,before+1,'turning sound off does not resume the audio engine');
await resolve();assert.equal(lastGain,0);assert.equal(sound['aria-pressed'],'false');assert(!sound.disabled);
setPaused(true);setPaused(false);assert.equal(resumes,before+1,'explicit off survives graphics recovery');
console.log('PASS: ambient sound respects graphics loss, tab visibility, late resumes, and explicit off.');
