import assert from 'node:assert/strict';
import {createVisit} from '../dist/visit-core.js';
let raw=null;const storage={getItem:()=>raw,setItem:(k,v)=>raw=v};
const visit=createVisit(storage,(x,z)=>Math.abs(x)>53||z>40||z<-92||(x===0&&z===-35));
const good={x:24,z:-18,yaw:1,pitch:.2,night:true};
assert.equal(visit.read(),null);assert(visit.save(good));assert.deepEqual(visit.read(),good);
for(const bad of [{...good,x:Infinity},{...good,yaw:9},{...good,pitch:2},{...good,night:'true'},{...good,x:100},{...good,x:0,z:-35}]){assert(!visit.save(bad));raw=JSON.stringify(bad);assert.equal(visit.read(),null);}
raw='{broken';assert.equal(visit.read(),null);
const unavailable=createVisit({getItem(){throw Error();},setItem(){throw Error();}},()=>false);
assert.equal(unavailable.read(),null);assert(!unavailable.save(good));
console.log('Visit persistence checks passed');
const destination={x:20,z:-9,name:"Lisa's Coffee Shop rewards"};assert(visit.save({...good,destination,directionsStopped:false}));assert.deepEqual(visit.read().destination,destination);assert.equal(visit.read().directionsStopped,false);
assert(visit.save({...good,directionsStopped:true}));assert(!visit.read().destination);assert(visit.read().directionsStopped);
for(const destination of [{x:999,z:0,name:'Bad'},{x:0,z:0,name:''},{x:0,z:0,name:'x'.repeat(161)}]){assert(visit.save({...good,destination}));assert(!visit.read().destination);assert.equal(visit.read().x,good.x);}
console.log('PASS: destination and stopped-directions persistence; invalid destinations preserve the valid visitor position.');

// Repeated stationary autosaves should not perform synchronous writes. Compare
// actual storage each time so a cleared/replaced record is never mistaken for a save.
let stored=null,writes=0,failWrite=false;
const counting={getItem:()=>stored,setItem(k,v){writes++;if(failWrite)throw Error('unavailable');stored=v;}};
const efficient=createVisit(counting,()=>false);
assert(efficient.save(good));assert.equal(writes,1);
for(let i=0;i<12;i++)assert(efficient.save({...good}));assert.equal(writes,1);
for(const change of [{x:25},{z:-17},{yaw:.5},{pitch:.3},{night:false},{destination},{directionsStopped:true}]){
 const changed={...good,...change};assert(efficient.save(changed));const count=writes;assert(efficient.save(changed));assert.equal(writes,count);assert.deepEqual(efficient.read(),changed);
}
stored=null;let count=writes;assert(efficient.save(good));assert.equal(writes,count+1);
stored=JSON.stringify({...good,x:30});count=writes;assert(efficient.save(good));assert.equal(writes,count+1);assert.deepEqual(efficient.read(),good);
failWrite=true;const moved={...good,x:31};assert(!efficient.save(moved));failWrite=false;count=writes;assert(efficient.save(moved));assert.equal(writes,count+1);assert.deepEqual(efficient.read(),moved);
let fallback=null;const readFails=createVisit({getItem(){throw Error('read blocked');},setItem(k,v){fallback=v;}},()=>false);assert(readFails.save(good));assert.deepEqual(JSON.parse(fallback),good);
assert(efficient.save({...moved,destination:{x:999,z:0,name:'Bad'}}));count=writes;assert(efficient.save(moved));assert.equal(writes,count);
console.log('PASS: unchanged autosaves avoid writes, every persisted field updates, cleared/replaced records repair, failed writes retry and read failure preserves write fallback.');
