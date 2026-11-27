import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const world=readFileSync(new URL('../dist/world.js',import.meta.url),'utf8');
const sampler=world.match(/^const sprayShapes=.*\n[\s\S]*?^function updateFountainSpray[\s\S]*?^}/m)[0];
const frames=[];
let position,scale;
const drops={count:240,instanceMatrix:{},setMatrixAt(i,m){frames[i]=m;}};
const dummy={position:{set(...values){position=values;}},scale:{setScalar(n){scale=n;}},updateMatrix(){this.matrix=[...position,scale];}};
const sample=new Function('drops','dummy',sampler+'\nreturn updateFountainSpray;')(drops,dummy);
function reference(ms,show,i){
 const angle=i*2.399,t=(ms*.0005+i/240)%1;
 let height=2.3;
 if(show>=0){
  const phase=Math.floor(show/4000),u=Math.min(1,(show%4000)/600);
  const pair=.55+2.25*Math.cos(angle)**4,crown=.6+2.6*Math.cos(2*angle)**6;
  const target=phase===0?.65:phase===1?pair:crown,previous=phase===0?2.3:phase===1?.65:pair;
  height=previous+(target-previous)*u*u*(3-2*u);
  if(show>11400){const v=(show-11400)/600;height+=(2.3-height)*v*v*(3-2*v);}
 }
 return [Math.cos(angle)*(1+t*4.2),3.8+Math.sin(t*Math.PI)*height-t*3.1,Math.sin(angle)*(1+t*4.2)-35,.65+Math.sin(t*Math.PI)*.7];
}
for(const [i,show] of [-1,0,300,950,4000,4233,8000,8137,10955,11786,11999].entries()){
 const ms=11237+i*471;
 drops.instanceMatrix.needsUpdate=false;sample(ms,show);
 assert(drops.instanceMatrix.needsUpdate);assert.equal(frames.length,240);
 frames.forEach((frame,j)=>assert.deepEqual(frame,reference(ms,show,j)));
}
console.log('PASS: all 240 drop transforms match ordinary spray and each choreography transition.');
