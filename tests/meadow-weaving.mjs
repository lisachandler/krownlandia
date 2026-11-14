import assert from 'node:assert/strict';
import {createMeadowWeaving} from '../dist/villages.js';
const nodes=new Map();let focus;
globalThis.document={createElement(){return {children:[],style:{},set id(v){nodes.set(v,this)},setAttribute(){},append(...x){this.children.push(...x)},replaceChildren(...x){this.children=x},focus(){focus=this}}}};
let active=true;const p=createMeadowWeaving(()=>active),b=id=>nodes.get(id),click=id=>b(id).onclick();
assert.equal(b('weaveFinish').disabled,true);click('weaveRose');assert.equal(b('weaveUndo').disabled,true);
p.open=true;for(let i=0;i<6;i++)click(i%2?'weaveGold':'weaveRose');
assert.equal(focus,b('weaveFinish'));assert.equal(b('weaveRose').disabled,true);assert.match(b('weavingStatus').textContent,/rose, gold, rose, gold, rose, gold/);
click('weaveUndo');assert.equal(b('weaveFinish').disabled,true);click('weaveGold');click('weaveFinish');assert.equal(focus,b('weaveRestart'));assert.match(b('weavingStatus').textContent,/Finished/);click('weaveUndo');assert.equal(b('weaveUndo').disabled,true);
click('weaveRestart');assert.equal(focus,b('weaveRose'));assert.equal(b('weaveUndo').disabled,true);
active=false;click('weaveRose');assert.equal(b('weaveUndo').disabled,true);
active=true;click('weaveGold');p.open=false;click('weaveRose');p.open=true;assert.match(b('weavingStatus').textContent,/Pattern: gold\./);
assert.equal(createMeadowWeaving(()=>true).open,undefined); // A new page starts collapsed and empty.
console.log('PASS weaving progression, undo, finish, focus, collapse and inactive-dialog guards');
