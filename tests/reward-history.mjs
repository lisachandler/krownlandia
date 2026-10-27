import assert from 'node:assert/strict';
import {createRewards} from '../dist/rewards-core.js';
import {exportBackup,parseBackup,restoreBackup} from '../dist/backup-core.js';
const key='krownlandia-rewards-v1',data=new Map([[key,JSON.stringify({claims:['arrival:arrival'],done:[]})]]);
const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
let now=Date.parse('2026-10-27T01:10:00Z'),r=createRewards(storage,()=>now);
assert.equal(r.history().legacy,10);assert.equal(r.history().totals.day,0);assert.equal(r.history().totals.all,10);
const before=data.get(key);r.history();assert.equal(data.get(key),before,'reading never rewrites legacy progress');
r.claim('gate','arrival','gate');assert.equal(r.history().totals.hour,10);assert.equal(r.history().totals.all,20);
assert.equal(r.history().period.day,'2026-10-26');assert.equal(r.history().entries.length,1);
now+=3600000;r.claim('gate','arrival','gate');assert.equal(r.history().entries.length,1);assert.equal(r.history().totals.hour,0);assert.equal(r.history().totals.day,10);
r.claim('gardens','task','gardens');assert.equal(r.history().entries.length,1,'incomplete claim has no event');
r.mark('meet-pip');r.claim('gardens','task','gardens');assert.equal(r.history().totals.hour,25);
r=createRewards(storage,()=>now);assert.equal(r.history().totals.all,45);assert.equal(r.history().legacy,10);
const backup=parseBackup(exportBackup(storage));restoreBackup(storage,backup);assert.deepEqual(createRewards(storage,()=>now).history(),r.history());
for(const claimTimes of [[],null,{'fake:task':now},{'cafe:pin':now},{'gate:arrival':-1},{'gate:arrival':'2026'},{'gate:arrival':1.5},{'gate:arrival':253402300800000},{'library:arrival':now}]){const bad={...backup,data:{...backup.data,[key]:JSON.stringify({...JSON.parse(backup.data[key]),claimTimes})}};assert.throws(()=>parseBackup(JSON.stringify(bad)));}
const old={...backup,data:{...backup.data,[key]:JSON.stringify({claims:['gate:arrival'],done:[]})}};restoreBackup(storage,old);assert.equal(createRewards(storage,()=>now).history().legacy,10);
function at(event,query){const model=createRewards({getItem:()=>JSON.stringify({claims:['gate:arrival'],done:[],claimTimes:{'gate:arrival':Date.parse(event)}}),setItem(){}},()=>Date.parse(query));return model.history();}
assert.equal(at('2026-11-01T08:30:00Z','2026-11-01T09:30:00Z').totals.hour,0,'repeated Pacific 1am hours are distinct');
assert.equal(at('2026-11-01T08:30:00Z','2026-11-01T09:30:00Z').totals.day,10);
assert.equal(at('2026-03-08T09:59:00Z','2026-03-08T10:01:00Z').totals.hour,0,'spring clock jump starts a new hour');
assert.equal(at('2026-03-08T09:59:00Z','2026-03-08T10:01:00Z').totals.day,10);
const midnight=at('2026-11-01T06:59:59Z','2026-11-01T07:00:00Z');assert.equal(midnight.totals.day,0);assert.equal(midnight.totals.month,0);assert.equal(midnight.totals.year,10);
assert.equal(at('2027-01-01T07:59:59Z','2027-01-01T08:00:00Z').totals.year,0);
const future=at('2026-10-27T02:00:00Z','2026-10-27T01:00:00Z');assert.equal(future.future,10);assert.equal(future.totals.day,0);assert.equal(future.totals.all,10);
const memory=createRewards({getItem(){return null},setItem(){throw Error('unavailable')}},()=>now);memory.claim('gate','arrival','gate');assert.equal(memory.history().saved,false);assert.equal(memory.history().totals.hour,10);
const malformed=createRewards({getItem:()=>JSON.stringify({claims:['gate:arrival'],done:[],claimTimes:{'gate:arrival':'invalid','fake:task':now}}),setItem(){}});assert.equal(malformed.history().legacy,10);assert.equal(malformed.state().points,10);
console.log('PASS: timestamped claims, duplicate/eligibility guards, legacy totals, Pacific hour/day/month/year and DST boundaries, future-clock handling, persistence, old/new backup compatibility, malformed timestamps and unavailable storage.');
