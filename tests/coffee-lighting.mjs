import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {installCoffeeScene} from '../dist/coffee-scene.js';
const scene=new T.Scene(),camera=new T.PerspectiveCamera();
const texture=new T.Texture(),nameSign=new T.Mesh(new T.PlaneGeometry(10.3,.65),new T.MeshStandardMaterial({map:texture}));
const slogan=new T.Mesh(new T.PlaneGeometry(8.8,.28),new T.MeshStandardMaterial({map:texture}));scene.add(nameSign,slogan);
const update=installCoffeeScene({scene,camera,nameSign,slogan});
const entrance=scene.getObjectByName('Cafe entrance light'),interior=scene.getObjectByName('Cafe warm interior light');
camera.position.set(24,1.75,-10);const before=camera.position.clone();
for(const mix of [0,.5,1,.5,0]){update(1000,null,mix);assert.equal(nameSign.material.emissiveIntensity,.8*mix);assert.equal(slogan.material.emissiveIntensity,.65*mix);assert.equal(entrance.intensity,12*mix);assert.equal(interior.intensity,14+10*mix);assert(camera.position.equals(before));}
assert.equal(nameSign.material.emissiveMap,texture);assert(!entrance.castShadow);assert.equal(entrance.distance,8);
camera.position.set(0,1.75,100);update(2000,null,1);assert.equal(entrance.intensity,0);assert.equal(interior.intensity,0);assert.equal(nameSign.material.emissiveIntensity,.8);
camera.position.set(24,1.75,-18);update(2500,{serial:1,name:'The Pink Latte'},1);assert(scene.getObjectByName('Served coffee').visible);assert.equal(entrance.intensity,12);
console.log('PASS: sign and entrance fade through day/dusk/night, distance cutoff, preserved camera and drink service, no added shadow light. GPU appearance is not covered.');

scene.updateMatrixWorld(true);const machine=scene.getObjectByName('Cafe espresso machine'),tray=scene.getObjectByName('Cafe cup and saucer tray');assert(machine&&tray);for(const object of [machine,tray]){const bounds=new T.Box3().setFromObject(object);assert(bounds.min.y>=1.39);assert(bounds.min.x>24.8&&bounds.max.x<28);assert(bounds.min.z>-20.7&&bounds.max.z<-19.3);}const machineBounds=new T.Box3().setFromObject(machine);assert(!machineBounds.containsPoint(new T.Vector3(24,1.7,-19.5)),'Drink handoff stays clear');update(3500,{serial:2,name:'Espresso'},1);assert(scene.getObjectByName('Served coffee').visible);assert.equal(scene.getObjectByName('Served coffee').scale.x,.72);console.log('PASS: detailed machine and cup tray sit on the counter, leave the handoff clear, and preserve espresso service.');
