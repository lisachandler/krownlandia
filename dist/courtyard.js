import * as T from './vendor/three.module.js';

// Architectural detail remains full 3D; repeated planting uses shared geometry.
export function enrichCourtyard({scene,stone,trim,gold,navy,colliders}){
 const root=new T.Group();root.name='Courtyard craftsmanship';scene.add(root);
 const plants=new T.MeshStandardMaterial({color:'#487744',roughness:.85});
 const petals=new T.MeshStandardMaterial({color:'#fff2dd',roughness:.65,side:T.DoubleSide});
 const waterLight=new T.MeshStandardMaterial({color:'#e6c87f',emissive:'#ffc774',emissiveIntensity:.1});
 const object=new T.Object3D(),flowerData=[],leafData=[],lit=[];
 let seed=737;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 function add(geometry,material,x,y,z){const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;root.add(m);return m;}
 function block(x,y,z,w,h,d,m){return add(new T.BoxGeometry(w,h,d),m,x,y,z);}
 function ring(x,y,z,r,thickness,m){const o=add(new T.TorusGeometry(r,thickness,8,72),m,x,y,z);o.rotation.x=Math.PI/2;return o;}
 // Flush concentric inlays give the fountain plaza a deliberate stone pattern.
 for(const r of [7.5,8,13.5,14])ring(0,.125,-35,r,.025,gold);
 for(let i=0;i<32;i++){
  const a=i/32*Math.PI*2,r=10.7,m=block(Math.cos(a)*r,.127,-35+Math.sin(a)*r,.025,.012,5.45,trim);m.rotation.y=Math.PI/2-a;
 }
 for(let i=0;i<48;i++){
  const a=i/48*Math.PI*2,x=Math.cos(a)*6.6,z=-35+Math.sin(a)*6.6;
  const coping=block(x,.71,z,.81,.17,.48,stone);coping.rotation.y=-a+Math.PI/2;
 }
 // Turned stone urns frame the walk without narrowing the central passage.
 const profile=[[.45,0],[.5,.1],[.35,.2],[.24,.45],[.3,.7],[.62,.95],[.72,1.3],[.76,1.4]].map(p=>new T.Vector2(...p));
 for(const x of [-5.7,5.7])for(const z of [21,-20]){
  block(x,.22,z,1.25,.4,1.25,trim);add(new T.LatheGeometry(profile,24),stone,x,.42,z);
  ring(x,1.81,z,.75,.045,gold);colliders.push({x,z,r:.95});
  for(let i=0;i<24;i++){const a=random()*Math.PI*2,r=Math.sqrt(random())*.64;flowerData.push({x:x+Math.cos(a)*r,y:1.85+random()*.35,z:z+Math.sin(a)*r,scale:.16+random()*.08,a});}
 }
 // Flowering borders: individual petals, stems and leaves replace flat color alone.
 for(const side of [-1,1])for(const z of [5,-6,-17,-50,-61]){
  for(let i=0;i<32;i++){const x=side*10+(random()-.5)*3.3,zz=z+(random()-.5)*5.3,y=.95+random()*.45;flowerData.push({x,y,z:zz,scale:.12+random()*.08,a:random()*6.28});}
 }
 for(const f of flowerData)for(let j=0;j<3;j++)leafData.push({x:f.x+Math.cos(f.a+j*2.1)*.12,y:f.y-.16-j*.1,z:f.z+Math.sin(f.a+j*2.1)*.12,a:f.a+j*2.1});
 const petalMesh=new T.InstancedMesh(new T.SphereGeometry(1,7,5),petals,flowerData.length*5);
 const stems=new T.InstancedMesh(new T.CylinderGeometry(.012,.017,.45,5),plants,flowerData.length);
 const leaves=new T.InstancedMesh(new T.SphereGeometry(1,6,4),plants,leafData.length);
 const colors=['#f7e7c9','#eed09a','#d77d9e','#bda2d0'];
 flowerData.forEach((f,i)=>{
  object.position.set(f.x,f.y-.24,f.z);object.rotation.set(0,0,0);object.scale.set(1,1,1);object.updateMatrix();stems.setMatrixAt(i,object.matrix);
  for(let j=0;j<5;j++){const a=j/5*Math.PI*2+f.a;object.position.set(f.x+Math.cos(a)*f.scale*.65,f.y,f.z+Math.sin(a)*f.scale*.65);object.rotation.set(0,-a,0);object.scale.set(f.scale,.035,f.scale*.52);object.updateMatrix();petalMesh.setMatrixAt(i*5+j,object.matrix);petalMesh.setColorAt(i*5+j,new T.Color(colors[i%4]));}
 });
 leafData.forEach((l,i)=>{object.position.set(l.x,l.y,l.z);object.rotation.set(.35,l.a,.4);object.scale.set(.15,.025,.065);object.updateMatrix();leaves.setMatrixAt(i,object.matrix);});
 for(const mesh of [petalMesh,stems,leaves]){mesh.castShadow=mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 // A pair of balustrades finishes the outer edges of the gate conservatories.
 for(const side of [-1,1]){
  const x=side*21.5;
  for(const y of [.3,1.5])block(x,y,14,.48,.2,12.5,stone);
  for(let z=8;z<=20;z+=1){add(new T.CylinderGeometry(.09,.13,1.1,10),stone,x,.92,z);add(new T.SphereGeometry(.14,10,8),trim,x,1.02,z);}
  colliders.push({x,z:14,w:.65,d:6.5});
  for(const z of [8,20]){block(x,.85,z,.7,1.7,.7,stone);add(new T.SphereGeometry(.28,12,10),gold,x,1.92,z);}
  // Fluted pier faces and inset lighting emphasize the original crown arch.
  for(let i=-3;i<=3;i++)block(side*8+i*.22,4.7,15.66,.045,6,.055,trim);
  for(const z of [12.2,15.8]){const l=add(new T.BoxGeometry(1.7,.09,.18),waterLight,side*8,.8,z);lit.push(l);}
  const spot=new T.SpotLight('#ffcd83',0,22,.48,.7,1.5);spot.position.set(side*8,.65,18);spot.target.position.set(side*8,8,14);root.add(spot,spot.target);lit.push(spot);
 }
 // Small recessed fountain lights add depth after sunset without extra shadows.
 for(let i=0;i<12;i++){const a=i/12*Math.PI*2;add(new T.SphereGeometry(.075,8,6),waterLight,Math.cos(a)*5.9,.8,-35+Math.sin(a)*5.9);}
 let previous=null;
 return (ms,night)=>{if(night===previous)return;previous=night;waterLight.emissiveIntensity=.1+2.9*Number(night);for(const l of lit)if(l.isLight)l.intensity=55*Number(night);};
}
