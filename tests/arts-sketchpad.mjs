import assert from 'node:assert/strict';
import {installSketchpad} from '../dist/reports/arts-sketchpad.js';
let focused;
const tiles=['Top','Middle','Bottom'].flatMap(row=>['left','center','right'].map(col=>({
 'aria-label':row+' '+col,setAttribute(k,v){this[k]=v},getAttribute(k){return this[k]},focus(){focused=this}
})));
const reset={},status={},panel={open:false,hidden:true,querySelectorAll:()=>tiles,querySelector:s=>s==='#sketchReset'?reset:status};
installSketchpad(panel);
assert.equal(panel.hidden,false);
assert.equal(reset.disabled,true);
tiles[1].onclick();assert.equal(tiles[1]['aria-pressed'],'false');
panel.open=true;
tiles[8].onclick();tiles[1].onclick();
assert.equal(tiles[1]['aria-pressed'],'true');
assert.equal(status.textContent,'Marked: top center; bottom right.');
tiles[1].onclick();assert.equal(tiles[1]['aria-pressed'],'false');
panel.open=false;reset.onclick();assert.equal(status.textContent,'Marked: bottom right.');
panel.open=true;reset.onclick();
assert.equal(status.textContent,'The sketch is blank.');assert.equal(focused,tiles[0]);assert(reset.disabled);
assert(tiles.every(tile=>tile['aria-pressed']==='false'));
console.log('PASS: sketch toggles, ordered text summary, collapsed guards and clear/focus.');
