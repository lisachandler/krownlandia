import './library-seating.mjs';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {installLibrary} from '../dist/library.js';
const createElement=document.createElement.bind(document);document.createElement=(...args)=>{const node=createElement(...args);node.attributes={};node.setAttribute=(key,value)=>{node.attributes[key]=value;};node.getAttribute=key=>node.attributes[key];return node;};
const state={done:[],claims:[],saved:true};let guided=null;
const camera=new T.PerspectiveCamera();camera.position.set(30,1.75,40);
const library=installLibrary({scene:new T.Scene(),camera,colliders:[],pause(){},rewards:{state:()=>state,recordLibraryPage(i){if(!state.done.includes('library-page-'+i))state.done.push('library-page-'+i)},completeLibrary(){state.done.push('library-read')},guideTo(id){guided=id},guideToPoint(){}}});
const $=s=>document.querySelector(s);assert(library.open());assert($('#libraryStatus').textContent.includes('1 / 3'));
$('#libraryChapter-1').onclick();$('#libraryChapter-2').onclick();assert($('#libraryStatus').textContent.includes('Collect your Alexandria Bookmark below'));assert(!state.done.includes('library-read'));
$('#libraryClaim').onclick();assert($('#libraryStatus').textContent.includes('20-point task reward is ready'));assert.equal($('#libraryRewards').textContent,'Find my 20-point library reward');
const before=JSON.stringify(state);$('#libraryRewards').onclick();assert.equal(guided,'library');assert.equal(JSON.stringify(state),before);assert(!library.isOpen);
state.claims.push('library:task');assert(library.open());assert($('#libraryStatus').textContent.includes('task reward are collected'));assert.equal($('#libraryRewards').textContent,'Find library rewards');assert($('#libraryClaim').disabled);
state.saved=false;$('#libraryClose').onclick();library.open();assert($('#libraryStatus').textContent.includes('browser storage is unavailable'));
console.log('PASS: reading, bookmark-ready, points-ready and points-collected messages, read-only station directions and visit-only disclosure.');

assert.equal($('#libraryChapters').getAttribute('role'),'group');assert.equal($('#libraryChapters').getAttribute('aria-label'),'Community readings');assert.equal($('#libraryStory').getAttribute('aria-labelledby'),'libraryReadingTitle');assert.equal($('#libraryStory').getAttribute('aria-live'),'polite');assert.equal($('#libraryStory').getAttribute('aria-atomic'),'true');
for(const [i,title] of ['Community beginnings','Places imagined together','A page for tomorrow'].entries()){const button=$('#libraryChapter-'+i);button.focus();button.onclick();assert.equal($('#libraryReadingTitle').textContent,title);assert.equal(document.activeElement,button);assert.equal(button.getAttribute('aria-pressed'),'true');}
assert(state.done.includes('library-read'));assert.deepEqual(state.claims,['library:task']);
console.log('PASS: named reading controls, heading-associated polite reading region and focus retained across all chapters.');

$('#libraryClose').onclick();state.done=[];state.claims=[];state.saved=true;assert(library.open());const next=$('#libraryNextReading');assert(!next.hidden);assert.equal(next.getAttribute('aria-describedby'),'libraryStatus');const firstRead=JSON.stringify(state);next.disabled=true;next.onclick();assert.equal(JSON.stringify(state),firstRead);next.disabled=false;next.onclick();assert.equal(library.progress().count,2);assert.equal(document.activeElement,$('#libraryChapter-1'));assert(!next.hidden);
$('#libraryClose').onclick();next.onclick();assert.equal(library.progress().count,2);assert(library.open());assert.equal(library.progress().count,3);assert(next.hidden);assert(!state.done.includes('library-read'),'bookmark remains explicit');next.onclick();assert(!state.done.includes('library-read'));
$('#libraryClose').onclick();state.done=['library-page-2'];assert(library.open());assert(state.done.includes('library-page-0'));next.onclick();assert.equal(library.progress().count,3);assert.equal(document.activeElement,$('#libraryChapter-1'));assert(next.hidden);assert.deepEqual(state.claims,[]);
console.log('PASS: next unread follows saved gaps, disabled/closed guards, focus transfer, completion hiding and separate bookmark collection.');
