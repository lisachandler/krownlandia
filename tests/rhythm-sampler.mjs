import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const dir=new URL('../dist/reports/',import.meta.url);
const html=readFileSync(new URL('rhythm-sampler.html',dir),'utf8');
assert.match(html,/Krown Concert Hall, credited to @dracrow/);
assert.doesNotMatch(html,/<script\b|\bautoplay\b|https?:\/\//i);
assert.match(readFileSync(new URL('arts-sampler.html',dir),'utf8'),/href="rhythm-sampler.html"/);
for(const [name,pattern,rest] of [['opening',['Low note','High note','Rest','High note'],2],['reply',['High note','Rest','Low note','Low note'],1]]){
 const section=html.match(new RegExp('<section aria-labelledby="'+name+'">([\\s\\S]*?)</section>'))[1];
 assert.deepEqual([...section.matchAll(/<li>([^<]+)/g)].map(m=>m[1]),pattern);
 assert.match(section,new RegExp('<audio controls preload="none"[^>]+src="rhythm-'+name+'\\.wav"'));
 const bytes=readFileSync(new URL('rhythm-'+name+'.wav',dir));
 assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WAVE');
 assert.equal(bytes.readUInt16LE(22),1);assert.equal(bytes.readUInt32LE(24),8000);
 assert.equal(bytes.readUInt16LE(34),16);assert.equal(bytes.length,44+32000);
 for(let beat=0;beat<4;beat++){
  const segment=bytes.subarray(44+beat*8000,44+(beat+1)*8000);
  assert.equal(segment.every(x=>x===0),beat===rest,'only the listed rest is silent');
 }
}
console.log('PASS: documented four-beat patterns, matching rests, local audio metadata and opt-in controls.');
