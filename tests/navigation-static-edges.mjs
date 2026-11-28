import assert from 'node:assert/strict';
import {createNavigator} from '../dist/navigation-core.js';

const blocked=(x,z)=>(x>-.2&&x<6.2&&z>3.1&&z<3.8)||(x>6.6&&x<9.1&&z>6.2&&z<13.6);
let checks=0;
const cached=createNavigator((x,z)=>{checks++;return blocked(x,z);},{staticEdges:true});
const original=createNavigator(blocked);
const start={x:.03,z:.04},target={x:11.2,z:16.3};
checks=0;
const first=cached.route(start,target),firstCost=checks;
assert(first.length>2);assert.deepEqual(first,original.route(start,target));
checks=0;
assert.deepEqual(cached.route(start,target),first);
assert(checks>0&&checks<firstCost/3,'repeated route skips fixed-edge samples but still checks the visitor approach');
for(const [a,b] of [[target,start],[{x:.33,z:1},target],[start,{x:1,z:14}],[{x:7,z:10},start]]){
 const actual=cached.route(a,b);
 assert.deepEqual(actual,original.route(a,b));
 for(let i=1;i<actual.length;i++)assert(cached.clear(actual[i-1],actual[i]));
}
// Callers with mutable collision tests get fresh edge samples by default.
let changed=false;
const dynamic=createNavigator((x,z)=>changed&&z>3.1&&z<3.8);
assert(dynamic.route(start,target).length);
changed=true;assert.equal(dynamic.route(start,target).length,0);
console.log('PASS: cached and uncached routes match, repeated checks drop, and mutable callers remain uncached.');
