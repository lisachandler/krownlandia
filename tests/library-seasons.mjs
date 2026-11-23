import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
const a=window.krownlandia,$=s=>document.querySelector(s),library=a.library,point=library.deskPoint;
a.camera.position.set(point.x,1.75,point.z);frame();assert(library.open());
const panel=$('#librarySeasons'),text=$('#seasonCaption'),art=$('#seasonArt'),pick=i=>$('#seasonChoice'+i).onclick();
assert(!panel.open);pick(2);assert.match(text.textContent,/^Spring/);
const before=JSON.stringify(a.getState().rewards),position=a.camera.position.clone();
panel.open=true;
for(const [i,season] of ['spring','summer','autumn','winter'].entries()){
 pick(i);assert.equal(art.dataset.season,season);assert(text.textContent.toLowerCase().startsWith(season+' · '));
}
assert(a.camera.position.equals(position));assert.equal(JSON.stringify(a.getState().rewards),before);
a.camera.position.set(0,1.75,0);pick(1);assert.match(text.textContent,/^Winter/);
$('#libraryClose').onclick();pick(0);assert.match(text.textContent,/^Winter/);
const bench=library.seats.at(-1);
a.camera.position.set(bench.approach.x,1.75,bench.approach.z);frame();assert(a.seating.sit());frame();assert(library.open());
assert(!panel.open);assert.match(text.textContent,/^Spring/);
const seated=a.camera.position.clone(),saved=JSON.stringify(a.getState().rewards);
panel.open=true;pick(2);assert.match(text.textContent,/^Autumn/);
assert(a.seating.active&&a.camera.position.equals(seated));assert.equal(JSON.stringify(a.getState().rewards),saved);
console.log('PASS: optional Four Seasons views, text, closed/remote guards, fresh reopening, seated access and unchanged rewards.');
