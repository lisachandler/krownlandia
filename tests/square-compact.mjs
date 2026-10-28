import {frame} from './school-seating.mjs';
import assert from 'node:assert/strict';
const a=window.krownlandia,$=s=>document.querySelector(s),square=a.townSquare;
a.camera.position.set(square.boardPoint.x,1.75,square.boardPoint.z);frame();const before=JSON.stringify(a.getState().rewards);assert(square.open());
const directions=$('#squareDirections');assert(!directions.open);assert.equal($('#townSquareActions').children.length,3);assert.equal($('#squareDirectionActions').children.length,8);
for(const id of ['squareStage','squareRest','squareOffice','squareHistory','squareTram','squareRewards','square-living-sim','square-emoji-house'])assert($('#squareDirectionActions').children.includes($('#'+id)));
directions.open=true;assert.equal(square.open(),false);assert(directions.open,'duplicate open preserves current disclosure');const position=a.camera.position.clone();$('#squareStage').onclick();frame();assert(!square.isOpen);assert(a.camera.position.equals(position));assert($('#guide').textContent.includes('stage'));assert(square.open());assert(!directions.open,'new opening starts compact');$('#townSquareClose').onclick();
const seat=square.seats[0];a.camera.position.set(seat.approach.x,1.75,seat.approach.z);frame();assert(a.seating.sit());assert(square.open());assert(!directions.open);directions.open=true;const seated=a.camera.position.clone();$('#square-emoji-house').onclick();assert(a.seating.active);assert(a.camera.position.equals(seated));assert.equal(JSON.stringify(a.getState().rewards),before);
console.log('PASS: three primary actions, eight grouped shortcuts, compact reopening, duplicate-open continuity and seated/standing guidance without progress changes.');
