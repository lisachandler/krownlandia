import assert from 'node:assert/strict';
import {createJourney} from '../dist/journey-core.js';
import {STATIONS,createRewards} from '../dist/rewards-core.js';
const j=createJourney();assert(!j.act());j.start();assert(!j.start());assert(!j.act());
for(let i=0;i<70;i++)j.tick(.1);assert.equal(j.state().phase,'stop');j.act();j.cancel();assert(!j.state().completed);assert(!j.state().active);
j.start();for(let stop=0;stop<6;stop++){for(let i=0;i<70;i++)j.tick(.1);assert.equal(j.state().stop,stop);assert(j.act());assert(!j.act());}
assert(!j.state().completed);for(let i=0;i<70;i++)j.tick(.1);assert(j.state().completed);assert(!j.state().active);
const r=createRewards({getItem(){return null},setItem(){}});
for(const s of STATIONS.filter(s=>!['journey','safari','roasted'].includes(s.id)))r.claim(s.id,'arrival',s.id);
assert(r.status('palace').ready,'Original eight-station achievement preserved');assert(!r.status('journey').ready);
r.mark('great-journey');assert.equal(r.claim('journey','task','palace'),0);assert.equal(r.claim('journey','task','journey'),75);assert.equal(r.claim('journey','task','journey'),0);
console.log('PASS: ride cancellation, ordered actions, safe completion, original rewards compatibility and one-time ride bonus.');
