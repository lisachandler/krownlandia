import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
const $=s=>document.querySelector(s),a=window.krownlandia,search=$('#helpSearch'),clear=$('#helpSearchClear');
const before=JSON.stringify(a.getState().rewards),position=a.camera.position.clone();
$('#helpButton').onclick();assert($('#parkHelp').open);assert(clear.hidden);assert($('#helpSearchCount').hidden);
$('#helpSection-0').open=false;$('#helpSection-1').open=true;
function find(value){search.value=value;search.oninput();}
find('BACKUP');assert(!$('#helpEntry-2-2').hidden);assert($('#helpSection-2').open);assert($('#helpSection-0').hidden);assert.equal($('#helpSearchCount').textContent,'1 help topic found.');
find('village tram');assert(!$('#helpEntry-1-1').hidden);assert($('#helpEntry-1-0').hidden);
find('seating');assert(!$('#helpEntry-0-3').hidden);assert($('#helpSection-0').open);
find('uncollected souvenirs');assert(!$('#helpEntry-1-7').hidden);assert.equal($('#helpSearchCount').textContent,'1 help topic found.');
find('retry saving');assert(!$('#helpEntry-2-4').hidden);assert.equal($('#helpSearchCount').textContent,'1 help topic found.');
find('rest along');assert(!$('#helpEntry-1-5').hidden);assert.equal($('#helpSearchCount').textContent,'1 help topic found.');
find('no-such-help');assert($('#helpSearchCount').textContent.includes('No matching help'));assert($('#helpSection-0').hidden);assert(!clear.hidden);
$('#parkHelpClose').onclick();$('#helpButton').onclick();assert.equal(search.value,'no-such-help');
let focused=false;search.focus=()=>{focused=true;};clear.onclick();assert(focused);assert.equal(search.value,'');assert(clear.hidden);assert(!$('#helpSection-0').open);assert($('#helpSection-1').open);assert(!$('#helpSection-2').open);assert(!$('#helpEntry-2-2').hidden);
find('   ');assert(clear.hidden);assert(!$('#helpSection-0').hidden);
assert.equal(JSON.stringify(a.getState().rewards),before);assert(a.camera.position.equals(position));$('#parkHelpClose').onclick();frame();
console.log('PASS: matching and multiword help search, empty results, retained query, clear focus, restored disclosure choices and unchanged visitor progress.');
