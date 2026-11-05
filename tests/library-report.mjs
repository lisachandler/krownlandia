import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
const a=window.krownlandia,$=s=>document.querySelector(s);
a.camera.position.set(30,1.75,40);frame();assert(a.library.open());
const report=$('#libraryReport'),link=$('#libraryReportLink'),before=JSON.stringify(a.getState().rewards);
assert.equal(report.open,false);assert.equal(link.href,'reports/krownlandia-built-so-far.pdf');assert.equal(link.target,'_blank');assert.equal(link.rel,'noopener');assert(link.textContent.includes('PDF, new tab'));assert(report.children[1].textContent.includes('Version 247'));
report.open=true;assert.equal(JSON.stringify(a.getState().rewards),before);$('#libraryClose').onclick();assert(a.library.open());assert.equal(report.open,false);
console.log('PASS: optional dated report uses a same-site PDF link, announces its new tab, resets collapsed and adds no reward action.');

for(const [id,file]of [['libraryOpenSource','open-source-resources.html'],['libraryRoadmap','yet-to-build.html']]){const link=$('#'+id);assert.equal(link.href,'reports/'+file);assert.equal(link.target,'_blank');assert.equal(link.rel,'noopener');assert(link.textContent.includes('new tab'));}
