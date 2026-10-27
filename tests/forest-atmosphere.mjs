import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as Real from '../dist/vendor/three.module.js';
const node=()=>({setAttribute(){},append(){}});
globalThis.document={createElement:node,querySelector:node,addEventListener(){}};
class Environment{fromScene(){return {texture:new Real.Texture()}}dispose(){}}
const T={...Real,PMREMGenerator:Environment};
const source=fs.readFileSync(new URL('../dist/atmosphere.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'').replace('export function enrich','function enrich');
const enrich=new Function('T',source+';return enrich;')(T);
const scene=new T.Scene(),camera=new T.PerspectiveCamera(),material=()=>new T.MeshStandardMaterial();
const animate=enrich({scene,camera,stone:material(),trim:material(),grass:material(),leaf:material(),lamps:[],renderer:{}});
const groups=scene.children.filter(o=>o.name.startsWith('Forest fireflies'));
assert.equal(groups.length,3);assert(groups.every(g=>g.count===24&&!g.visible&&!g.castShadow));assert.equal(scene.children.filter(o=>o.isLight).length,0,'Forest effect adds no light sources');
const m=new T.Matrix4(),p=new T.Vector3(),q=new T.Quaternion(),scale=new T.Vector3();
for(const group of groups){camera.position.copy(group.position);animate(1000,false);assert(groups.every(g=>!g.visible));animate(1000,true);assert(group.visible);group.getMatrixAt(0,m);const before=m.clone();animate(7000,true);group.getMatrixAt(0,m);assert(!m.equals(before),'Fireflies drift with time');for(let i=0;i<group.count;i++){group.getMatrixAt(i,m);m.decompose(p,q,scale);assert(Math.abs(p.x)<=3.71&&Math.abs(p.z)<=2.66);assert(p.y>.6&&p.y<2.43);assert(scale.x>.51&&scale.x<.89,'Gentle glow never flashes off');}}
camera.position.set(0,1.75,-80);const versions=groups.map(g=>g.instanceMatrix.version);animate(10000,true);assert(groups.every(g=>!g.visible));assert.deepEqual(groups.map(g=>g.instanceMatrix.version),versions,'Distant groups skip animation uploads');camera.position.copy(groups[0].position);animate(12000,true);assert(groups[0].visible);animate(13000,false);assert(groups.every(g=>!g.visible));
console.log('PASS: 72 forest fireflies in three groups, day/night and distance visibility, bounded gentle motion, skipped distant updates, no extra lights or shadows. GPU appearance is not covered.');

const stars=scene.getObjectByName('Krownlandia night sky');assert(stars?.isPoints);assert.equal(stars.geometry.attributes.position.count,420);assert.equal(stars.geometry.attributes.color.count,420);assert(!stars.material.fog&&!stars.material.depthWrite&&stars.material.depthTest);assert(!stars.castShadow);
const original=Array.from(stars.geometry.attributes.position.array);for(let i=0;i<420;i++){p.fromBufferAttribute(stars.geometry.attributes.position,i);assert(Math.abs(p.length()-280)<.001);assert(p.y>=39.19);}
camera.position.set(29,1.75,153);animate(14000,0);assert(!stars.visible);assert.equal(stars.material.opacity,0);animate(14500,.5);assert(stars.visible);assert.equal(stars.material.opacity,.225);assert(stars.position.equals(camera.position));animate(15000,1);assert.equal(stars.material.opacity,.9);camera.position.set(-29,1.75,68);animate(16000,1);assert(stars.position.equals(camera.position));assert.deepEqual(Array.from(stars.geometry.attributes.position.array),original,'Stars stay fixed in direction without flicker or drifting');animate(17000,0);assert(!stars.visible);assert.equal(scene.children.filter(o=>o.isLight).length,0);console.log('PASS: 420 static sky stars, upper-hemisphere bounds, smooth night fade, camera-relative sky and depth-tested scenery occlusion settings. GPU appearance is not covered.');

const planting=scene.getObjectByName('Ground planting');animate.clearPlanting({x:24,z:-14,w:14,d:20});let checked=0;for(let i=0;i<planting.count;i++){planting.getMatrixAt(i,m);m.decompose(p,q,scale);if(Math.abs(p.x-24)<=7&&Math.abs(p.z+14)<=10){checked++;assert.equal(scale.length(),0);}}assert(checked>0);console.log('PASS: cafe floor and terrace planting removed within the intended footprint.');
