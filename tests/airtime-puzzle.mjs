import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {installAirtimePuzzle} from '../dist/reports/airtime-puzzle.js';
const items={
 morning:['weather','song','interview'],
 evening:['instrumental','news','story']
};
for(const [puzzle,correct] of Object.entries(items)){
 const slots=[{},{},{}],status={},form={dataset:{puzzle},hidden:true,querySelectorAll:()=>slots,querySelector:()=>status};
 installAirtimePuzzle(form);assert.equal(form.hidden,false);
 const enter=(order)=>{order.forEach((v,i)=>slots[i].value=v);let prevented=false;form.onsubmit({preventDefault(){prevented=true;}});assert(prevented);return status.textContent;};
 assert.match(enter(['',...correct.slice(1)]),/every slot/);
 assert.match(enter([correct[0],correct[0],correct[1]]),/each segment once/);
 let fits=0;
 for(const a of correct)for(const b of correct.filter(x=>x!==a)){
  const order=[a,b,correct.find(x=>x!==a&&x!==b)];
  const passed=enter(order)==='That order fits both clues.';
  if(passed){fits++;assert.deepEqual(order,correct);}
 }
 assert.equal(fits,1);form.onreset();assert.equal(status.textContent,'');
}
const page=readFileSync(new URL('../dist/reports/airtime-puzzle.html',import.meta.url),'utf8');
assert.match(page,/@tytomiwa \(page 11\)/);
assert.equal([...page.matchAll(/<form data-puzzle="[^"]+" hidden>/g)].length,2);
assert.equal([...page.matchAll(/<summary>Read the solution<\/summary>/g)].length,2);
assert.match(page,/src="airtime-puzzle.js"/);
console.log('PASS: each puzzle has exactly one valid order; duplicate, missing, retry and reset paths work; written solutions are always available.');
