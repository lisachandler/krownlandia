import assert from 'node:assert/strict';
import {installBackup} from '../dist/backup.js';
import {exportBackup} from '../dist/backup-core.js';
const nodes=new Map();
function el(){return {children:[],events:{},open:false,set id(v){nodes.set('#'+v,this)},append(...v){this.children.push(...v)},replaceChildren(...v){this.children=v},setAttribute(){},addEventListener(n,f){this.events[n]=f},showModal(){this.open=true},close(){this.open=false;this.events.close?.()}};}
globalThis.document={head:el(),body:el(),createElement:el,querySelector(s){if(!nodes.has(s))nodes.set(s,el());return nodes.get(s)}};
const values=new Map([['krownPin','1'],['krownlandia-home-v1','meadow-1'],['krownlandia-rewards-v1',JSON.stringify({claims:['gate:arrival'],done:[]})]]);
globalThis.localStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
let reloads=0;installBackup({pause(){},beforeExport(){},reload:()=>reloads++});
const $=s=>document.querySelector(s),open=()=>$('#backupButton').onclick(),pick=async text=>{$('#backupFile').files=[{size:text.length,text:async()=>text}];await $('#backupFile').onchange();};
const current=exportBackup(localStorage),empty=exportBackup({getItem:()=>null});open();assert($('#backupCurrent').textContent.includes('10 points · 1 keepsakes · Home: meadow-1'));const prior=JSON.stringify([...values]);await pick(empty);assert($('#backupStatus').textContent.includes('fewer points or keepsakes'));assert(!$('#backupRestore').hidden);assert.equal(JSON.stringify([...values]),prior);$('#backupClose').onclick();$('#backupRestore').onclick();assert.equal(reloads,0);assert.equal(JSON.stringify([...values]),prior);
open();let rejectOld;$('#backupFile').files=[{size:10,text:()=>new Promise((resolve,reject)=>rejectOld=reject)}];const slow=$('#backupFile').onchange();assert($('#backupStatus').textContent.includes('Reading'));await pick(current);const message=$('#backupStatus').textContent;rejectOld(Error('late failure'));await slow;assert.equal($('#backupStatus').textContent,message);assert(!$('#backupRestore').hidden);
let resolveOld;$('#backupFile').files=[{size:10,text:()=>new Promise(resolve=>resolveOld=resolve)}];const late=$('#backupFile').onchange();await pick('{bad');resolveOld(empty);await late;assert($('#backupRestore').hidden);assert($('#backupStatus').textContent.includes('not changed'));assert.equal(JSON.stringify([...values]),prior);
await pick(empty);$('#backupMenu').close();$('#backupRestore').onclick();assert.equal(reloads,0);open();await pick(empty);$('#backupRestore').onclick();assert.equal(reloads,1);assert.equal(values.size,0);assert($('#backupRestore').hidden);
open();const dated={...JSON.parse(current),createdAt:'2026-10-22T19:00:00.000Z'};await pick(JSON.stringify(dated));assert($('#backupStatus').textContent.includes(new Date(dated.createdAt).toLocaleString()));assert($('#backupStatus').textContent.includes('your local time'));
for(const createdAt of [undefined,null,'invalid',42]){await pick(JSON.stringify({...dated,createdAt}));assert($('#backupStatus').textContent.includes('creation time is unavailable'));assert(!$('#backupRestore').hidden);}
assert.equal(values.size,0,'date previews do not restore progress');
let downloaded=null,blob=null;const createElement=document.createElement;
document.createElement=tag=>{const node=createElement(tag);node.click=()=>{downloaded=node.download;};node.remove=()=>{};return node;};
URL.createObjectURL=value=>{blob=value;return 'blob:backup';};URL.revokeObjectURL=()=>{};globalThis.setTimeout=()=>0;
$('#backupDownload').onclick();const exported=JSON.parse(await blob.text());assert.equal(downloaded,'krownlandia-progress-'+exported.createdAt.replace(/[:.]/g,'-')+'.json');assert($('#backupStatus').textContent.includes('download started'));
console.log('PASS: backup comparison, date previews and legacy dates, read-only preview, stale read isolation and explicit restore.');
