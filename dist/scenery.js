import * as T from './vendor/three.module.js';

export function finishGardens({scene,stone,trim,gold,navy,glass,leaf,blue,colliders}) {
  const add=(g,m,x,y,z)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o;};
  const block=(x,y,z,w,h,d,m)=>add(new T.BoxGeometry(w,h,d),m,x,y,z);
  const cylinder=(x,y,z,r,h,m)=>add(new T.CylinderGeometry(r,r,h,20),m,x,y,z);
  const vineMaterial=new T.MeshStandardMaterial({color:'#356e43',roughness:.9});
  // Repeating carved bands articulate the limestone piers.
  for(const side of [-1,1]){
    for(let y=1.2;y<9.4;y+=1.25)block(side*8,y,14,2.58,.065,3.08,trim);
    for(const x of [side*8-.97,side*8+.97]){cylinder(x,5,15.58,.13,8,gold);cylinder(x,5,12.42,.13,8,gold);}
    // Hanging leaves follow the piers, leaving the main passage open.
    for(let i=0;i<50;i++){const a=i*2.4,x=side*8+Math.cos(a)*1.45,y=9.7-i*.11,z=14+Math.sin(a)*1.65;
      const o=add(new T.SphereGeometry(.2,7,5),vineMaterial,x,y,z);o.scale.set(.6,1.15,.32);o.rotation.set(i*.3,i*.7,i*.2);}
    // Conservatory wings beside the palace, viewed from the approach.
    block(side*20,2.7,-87,8,5.4,7,stone);colliders.push({x:side*20,z:-87,w:4.4,d:3.9});
    for(let dx=-3;dx<=3;dx+=1.5){block(side*20+dx,3.2,-83.45,1.24,3.5,.1,glass);block(side*20+dx-.69,3.2,-83.3,.1,4,.15,gold);}
    const dome=add(new T.SphereGeometry(4.6,28,16,0,Math.PI*2,0,Math.PI/2),glass,side*20,5.4,-87);dome.scale.z=.83;
    for(let a=0;a<Math.PI*2;a+=Math.PI/4){const pts=[];for(let j=0;j<=20;j++){let p=j/20*Math.PI/2;pts.push(new T.Vector3(side*20+4.65*Math.sin(p)*Math.cos(a),5.4+4.65*Math.cos(p),-87+3.86*Math.sin(p)*Math.sin(a)));}
      add(new T.TubeGeometry(new T.CatmullRomCurve3(pts),20,.065,6,false),gold,0,0,0);}
    // Formal garden terraces frame the last part of the walk.
    for(let i=0;i<3;i++){const x=side*(11+i*4),z=-70-i*3;block(x,.35+i*.2,z,3.7,.7+i*.4,6,trim);block(x,.78+i*.4,z,3.3,.25,5.6,leaf);colliders.push({x,z,w:2.25,d:3.4});}
    // Raised basins catch each of the palace waterfalls.
    block(side*5,.45,-80.5,4.6,.9,2.6,trim);block(side*5,.93,-80.5,4.2,.08,2.2,blue);
    colliders.push({x:side*5,z:-80.5,w:2.7,d:1.7});
  }
  const waterfallMaterial=new T.MeshStandardMaterial({color:'#a9e2ef',roughness:.18,metalness:.15,transparent:true,opacity:.62,emissive:'#215365',emissiveIntensity:.2});
  const falling=new T.InstancedMesh(new T.CylinderGeometry(.035,.08,.9,5),waterfallMaterial,160);falling.frustumCulled=false;scene.add(falling);
  const obj=new T.Object3D();
  return ms=>{
    for(let i=0;i<160;i++){const side=i%2?1:-1,t=(ms*.00027+i*.137)%1;obj.position.set(side*5+Math.sin(i*2.4)*1.45,1+(1-t)*8,-81.2+Math.cos(i*1.7)*.22+t*.6);obj.scale.set(1,.6+(i%5)*.2,1);obj.updateMatrix();falling.setMatrixAt(i,obj.matrix);}
    falling.instanceMatrix.needsUpdate=true;
  };
}

// Batch only static direct-child meshes with identical geometry/materials.
// Animated meshes, signs, transparent surfaces and character groups stay separate.
export function batchStatic(scene,materials) {
  const groups=new Map();scene.updateMatrixWorld(true);
  for(const o of [...scene.children]){
    if(!o.isMesh||o.isInstancedMesh||!materials.has(o.material)||o.material.transparent||!o.geometry.parameters)continue;
    const key=o.material.uuid+'|'+o.geometry.type+'|'+JSON.stringify(o.geometry.parameters)+'|'+o.castShadow+'|'+o.receiveShadow;
    if(!groups.has(key))groups.set(key,[]);groups.get(key).push(o);
  }
  let removed=0,batches=0;
  for(const group of groups.values()){if(group.length<4)continue;const first=group[0],batch=new T.InstancedMesh(first.geometry,first.material,group.length);batch.castShadow=first.castShadow;batch.receiveShadow=first.receiveShadow;
    group.forEach((o,i)=>{batch.setMatrixAt(i,o.matrixWorld);scene.remove(o);if(i&&o.geometry!==first.geometry)o.geometry.dispose();});
    batch.instanceMatrix.needsUpdate=true;batch.computeBoundingSphere();scene.add(batch);removed+=group.length;batches++;}
  return {meshesBatched:removed,batches};
}
