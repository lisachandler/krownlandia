import * as T from './vendor/three.module.js';

export function installCoffeeScene({scene,camera,nameSign=null,slogan=null}){
 const pink=new T.MeshStandardMaterial({color:'#f18ab9',roughness:.7}),black=new T.MeshStandardMaterial({color:'#201b23'}),skin=new T.MeshStandardMaterial({color:'#bd8968'}),cream=new T.MeshStandardMaterial({color:'#ffe7d4'});
 const barista=new T.Group();barista.name="Lisa's barista";barista.position.set(23,0,-21);scene.add(barista);
 function part(g,m,x,y,z,parent){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
 const steel=new T.MeshStandardMaterial({color:'#bdc5c9',metalness:.8,roughness:.28}),coffee=new T.MeshStandardMaterial({color:'#482c20',roughness:.9});
 const machine=new T.Group();machine.name='Cafe espresso machine';machine.position.set(25.4,1.4,-20);scene.add(machine);
 part(new T.BoxGeometry(.95,.6,.5),black,0,.4,0,machine);part(new T.BoxGeometry(.88,.36,.025),steel,0,.48,.263,machine);
 part(new T.BoxGeometry(.98,.045,.55),steel,0,.722,0,machine);part(new T.BoxGeometry(.92,.035,.3),steel,0,.075,.33,machine);
 for(let i=0;i<8;i++)part(new T.BoxGeometry(.025,.006,.25),black,-.35+i*.1,.096,.33,machine);
 for(const x of [-.22,.22]){part(new T.CylinderGeometry(.1,.08,.1,16),steel,x,.265,.3,machine);const handle=part(new T.CylinderGeometry(.027,.027,.23,12),black,x,.26,.43,machine);handle.rotation.x=Math.PI/2;part(new T.CylinderGeometry(.018,.018,.07,10),steel,x,.19,.32,machine);const button=part(new T.CylinderGeometry(.037,.037,.015,16),pink,x,.55,.287,machine);button.rotation.x=Math.PI/2;}
 const gauge=part(new T.CylinderGeometry(.067,.067,.02,20),cream,0,.55,.29,machine);gauge.rotation.x=Math.PI/2;const needle=part(new T.BoxGeometry(.008,.07,.006),black,0,.55,.304,machine);needle.rotation.z=-.5;
 for(const x of [-.37,.37])part(new T.CylinderGeometry(.04,.04,.1,12),black,x,.05,0,machine);
 const wand=part(new T.CylinderGeometry(.012,.012,.28,10),steel,.46,.29,.31,machine);wand.rotation.z=.2;
 const cupTray=new T.Group();cupTray.name='Cafe cup and saucer tray';cupTray.position.set(26.65,1.4,-20);scene.add(cupTray);
 part(new T.BoxGeometry(.95,.035,.65),black,0,.02,0,cupTray);
 for(const x of [-.23,.23]){part(new T.CylinderGeometry(.19,.19,.025,24),cream,x,.052,0,cupTray);part(new T.CylinderGeometry(.12,.09,.19,24,1,true),pink,x,.16,0,cupTray);part(new T.CylinderGeometry(.107,.107,.008,24),coffee,x,.246,0,cupTray);const handle=part(new T.TorusGeometry(.06,.014,8,16),pink,x+.13,.16,0,cupTray);handle.rotation.y=Math.PI/2;}
 part(new T.CylinderGeometry(.34,.29,.8,16),black,0,1.18,0,barista);
 part(new T.BoxGeometry(.44,.62,.08),pink,0,1.21,.29,barista);
 part(new T.SphereGeometry(.28,18,12),skin,0,1.89,0,barista);
 part(new T.SphereGeometry(.285,18,12,0,Math.PI*2,0,Math.PI/2),black,0,1.93,0,barista);
 for(const x of [-.1,.1])part(new T.SphereGeometry(.028,8,6),black,x,1.93,.25,barista);
 for(const x of [-.19,.19])part(new T.CylinderGeometry(.1,.11,.72,12),black,x,.43,0,barista);
 const arm=new T.Group();arm.position.set(.38,1.5,0);barista.add(arm);
 part(new T.CylinderGeometry(.09,.1,.5,12),pink,0,-.2,0,arm);part(new T.SphereGeometry(.1,10,8),skin,0,-.48,0,arm);
 const left=part(new T.CylinderGeometry(.09,.1,.6,12),pink,-.4,1.24,0,barista);left.rotation.z=-.18;
 const cup=new T.Group();cup.name='Served coffee';cup.visible=false;scene.add(cup);
 part(new T.CylinderGeometry(.31,.31,.035,28),black,0,.025,0,cup);
 part(new T.CylinderGeometry(.21,.15,.3,28,1,true),pink,0,.2,0,cup);
 const liquid=part(new T.CylinderGeometry(.197,.197,.015,28),cream,0,.345,0,cup);
 const handle=part(new T.TorusGeometry(.12,.033,8,18),pink,.23,.21,0,cup);handle.rotation.y=Math.PI/2;
 const steamMaterial=new T.MeshBasicMaterial({color:'#fff7f1',transparent:true,opacity:.2,depthWrite:false});
 const steam=new T.InstancedMesh(new T.SphereGeometry(.07,7,5),steamMaterial,12);steam.name='Coffee steam';steam.visible=false;steam.frustumCulled=false;scene.add(steam);
 const fixtures=new T.Group();fixtures.name='Cafe pendant lights';scene.add(fixtures);
 const brass=new T.MeshStandardMaterial({color:'#b89259',metalness:.65,roughness:.3}),warmGlow=new T.MeshStandardMaterial({color:'#fff0d5',emissive:'#ffd09a',emissiveIntensity:.5,roughness:.45});
 const foliage=new T.MeshStandardMaterial({color:'#3b654c',roughness:.9}),petal=new T.MeshStandardMaterial({color:'#f4a5c6',roughness:.85});
 const vaseGeometry=new T.LatheGeometry([new T.Vector2(0,0),new T.Vector2(.075,0),new T.Vector2(.095,.04),new T.Vector2(.075,.16),new T.Vector2(.04,.22),new T.Vector2(.04,.24)],20);
 const leafGeometry=new T.SphereGeometry(1,10,6),flowerGeometry=new T.SphereGeometry(.028,10,6);
 const flowerParts=[['stems',new T.CylinderGeometry(.005,.005,1,6),foliage,9],['leaves',leafGeometry,foliage,9],['petals',flowerGeometry,petal,45],['centers',new T.SphereGeometry(.014,8,6),cream,9]].map(([name,geometry,material,count])=>{const mesh=new T.InstancedMesh(geometry,material,count);mesh.name='Cafe flower '+name;mesh.castShadow=mesh.receiveShadow=true;scene.add(mesh);return mesh;});
 const flowerTransform=new T.Object3D();let bloomIndex=0,stemIndex=0;
 function flowerInstance(batch,index,x,y,z,sx=1,sy=1,sz=1,ry=0,rz=0){flowerTransform.position.set(x,y,z);flowerTransform.scale.set(sx,sy,sz);flowerTransform.rotation.set(0,ry,rz);flowerTransform.updateMatrix();batch.setMatrixAt(index,flowerTransform.matrix);}
 for(const [x,z] of [[20,-17],[28,-17],[27,-7]]){
  const arrangement=new T.Group();arrangement.name='Cafe table flowers';arrangement.position.set(x,1.11,z);scene.add(arrangement);
  part(vaseGeometry,pink,0,0,0,arrangement);part(new T.TorusGeometry(.041,.008,8,20),brass,0,.237,0,arrangement).rotation.x=Math.PI/2;
  for(let i=0;i<3;i++){
   const a=i*Math.PI*2/3,fx=Math.cos(a)*.045,fz=Math.sin(a)*.045,fy=.36+i*.025;
   flowerInstance(flowerParts[0],stemIndex,x+fx,1.11+(fy+.18)/2,z+fz,1,fy-.18,1);
   flowerInstance(flowerParts[1],stemIndex,x+fx+Math.cos(a)*.023,1.40,z+fz+Math.sin(a)*.023,.045,.012,.019,-a,.45);
   for(let p=0;p<5;p++){const angle=p*Math.PI*2/5;flowerInstance(flowerParts[2],bloomIndex++,x+fx+Math.cos(angle)*.023,1.11+fy,z+fz+Math.sin(angle)*.023,1,.55,1);}
   flowerInstance(flowerParts[3],stemIndex++,x+fx,1.11+fy+.012,z+fz);
  }
 }
 for(const batch of flowerParts){batch.instanceMatrix.needsUpdate=true;batch.computeBoundingBox();batch.computeBoundingSphere();}
 const napkins=new T.Group();napkins.name='Cafe counter napkins';napkins.position.set(21.5,1.4,-20);scene.add(napkins);
 part(new T.BoxGeometry(.48,.035,.33),black,0,.018,0,napkins);
 for(const x of [-.21,.21])part(new T.BoxGeometry(.025,.19,.3),brass,x,.11,0,napkins);
 for(let i=0;i<5;i++)part(new T.BoxGeometry(.37,.012,.26),cream,0,.047+i*.014,0,napkins);
 for(const x of [22,26]){part(new T.CylinderGeometry(.035,.035,1.04,10),brass,x,4.91,-19,fixtures);part(new T.CylinderGeometry(.17,.4,.35,20),black,x,4.25,-19,fixtures);part(new T.CylinderGeometry(.32,.32,.045,20),warmGlow,x,4.055,-19,fixtures);}
 const counterLight=new T.PointLight('#ffd5ac',14,9,2);counterLight.name='Cafe warm interior light';counterLight.position.set(24,3.8,-18);fixtures.add(counterLight);
 const entranceGlow=new T.MeshStandardMaterial({color:'#fff0db',emissive:'#ffddb2',emissiveIntensity:0,roughness:.5});
 part(new T.BoxGeometry(3.9,.065,.22),black,24,4.005,-11.5,fixtures);part(new T.BoxGeometry(3.7,.025,.15),entranceGlow,24,3.96,-11.5,fixtures);
 const entranceLight=new T.PointLight('#ffddb5',0,8,2);entranceLight.name='Cafe entrance light';entranceLight.position.set(24,3.7,-11.5);fixtures.add(entranceLight);
 for(const sign of [nameSign,slogan])if(sign){sign.material.emissive.set('#ffffff');sign.material.emissiveMap=sign.material.map;sign.material.emissiveIntensity=0;sign.material.needsUpdate=true;}
 const d=new T.Object3D();let serial=0,servedAt=0,nearAt=0,wasNear=false;
 return (ms,drink,night=0)=>{
  const evening=Number(night);if(slogan)slogan.material.emissiveIntensity=.65*evening;if(nameSign)nameSign.material.emissiveIntensity=.8*evening;entranceGlow.emissiveIntensity=1.2*evening;entranceLight.intensity=Math.hypot(camera.position.x-24,camera.position.z+11.5)<30?12*evening:0;
  warmGlow.emissiveIntensity=.5+Number(night)*.7;counterLight.intensity=Math.hypot(camera.position.x-24,camera.position.z+18)<30?14+10*Number(night):0;
  const near=Math.hypot(camera.position.x-23,camera.position.z+21)<6;
  if(near&&!wasNear)nearAt=ms;wasNear=near;
  if(drink&&drink.serial!==serial){serial=drink.serial;servedAt=ms;cup.visible=steam.visible=true;const espresso=drink.name==='Espresso';cup.scale.setScalar(espresso?.72:1);liquid.material.color.set(drink.name==='Garden Tea'?'#b77b32':espresso?'#432519':drink.name==='The Pink Latte'?'#ffe1ec':'#ffe7d4');}
  const wave=near&&ms-nearAt<2200;
  arm.rotation.z=wave?-2.3+Math.sin(ms*.011)*.23:-.15;
  barista.rotation.y=near?Math.max(-.55,Math.min(.55,Math.atan2(camera.position.x-23,camera.position.z+21))):0;
  if(!cup.visible)return;
  const t=Math.min(1,Math.max(0,(ms-servedAt)/900)),ease=t*t*(3-2*t);
  cup.position.set(24,1.41,-20.3+ease*.8);
  for(let i=0;i<12;i++){const phase=(ms*.00032+i/12)%1;d.position.set(24+Math.sin(ms*.001+i)*phase*.12,1.7+phase*.55,-19.5+Math.cos(i*2.4)*phase*.09);d.scale.setScalar(Math.sin(phase*Math.PI)*.6);d.updateMatrix();steam.setMatrixAt(i,d.matrix);}steam.instanceMatrix.needsUpdate=true;
 };
}
