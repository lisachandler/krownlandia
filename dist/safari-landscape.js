import * as T from './vendor/three.module.js';

export function enrichSafariLandscape({root,curve,stops}){
 const group=new T.Group();group.name='Safari landscape detail';root.add(group);
 const material=color=>new T.MeshStandardMaterial({color,roughness:.95});
 const dry=material('#b5aa65'),green=material('#64784c'),stone=material('#998b73'),soil=material('#ad956c'),trunk=material('#65533e');
 let seed=8401;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const d=new T.Object3D(),route=curve.getPoints(180);
 const clear=(x,z)=>route.every(p=>(x-p.x)**2+(z-p.z)**2>12)&&stops.every(s=>(x-s.x)**2+(z-s.z)**2>50);
 function batch(name,geometry,mat,items){const b=new T.InstancedMesh(geometry,mat,items.length);b.name=name;items.forEach((p,i)=>{d.position.set(p.x,p.y,p.z);d.rotation.set(p.rx||0,p.ry||0,p.rz||0);d.scale.set(p.sx,p.sy,p.sz);d.updateMatrix();b.setMatrixAt(i,d.matrix);if(p.color)b.setColorAt(i,new T.Color(p.color));});b.castShadow=b.receiveShadow=true;b.computeBoundingSphere();group.add(b);return b;}
 const grass=[];
 // Keep clear corridors around the vehicle and open foregrounds at every stop.
 for(let i=0;i<6000&&grass.length<1800;i++){
  const x=51+random()*78,z=-86+random()*87;if(!clear(x,z))continue;
  const h=.25+random()*.5;grass.push({x,y:h/2,z,sx:.06+random()*.06,sy:h,sz:.06+random()*.06,ry:random()*Math.PI,rz:(random()-.5)*.2,color:random()>.55?'#b6aa64':'#78844b'});
 }
 batch('Safari grass',new T.ConeGeometry(1,1,3),dry,grass);
 const shrubs=[],rocks=[];
 for(let i=0;i<110;i++){const x=53+random()*78,z=-87+random()*88;if(!clear(x,z))continue;const size=.5+random()*.65;shrubs.push({x,y:size*.4,z,sx:size,sy:size*.6,sz:size*.85,ry:random()*6.28});}
 batch('Safari shrubs',new T.IcosahedronGeometry(1,1),green,shrubs);
 for(let i=0;i<28;i++){const a=random()*6.28,r=4+random()*5,x=103+Math.cos(a)*r,z=-79+Math.sin(a)*r;if(!clear(x,z))continue;const s=.6+random()*1.2;rocks.push({x,y:s*.4,z,sx:s,sy:s*.7,sz:s*.8,ry:random()*6.28,rx:random()*.2});}
 batch('Safari outcrop rocks',new T.DodecahedronGeometry(1,0),stone,rocks);
 const reeds=[];
 for(const i of [1,4,5]){
  const s=stops[i],rz=i===4?3:5,positions=[],indices=[];
  for(let j=0;j<=64;j++){const a=j/64*Math.PI*2,edge=.87+.07*Math.sin(a*5+i)+.04*Math.cos(a*9),outer=1.24+.08*Math.sin(a*3);for(const r of [edge,outer])positions.push(s.x+Math.cos(a)*6*r,.135,s.z+Math.sin(a)*rz*r);if(j<64){const n=j*2;indices.push(n,n+2,n+1,n+1,n+2,n+3);}}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();
  const bank=new T.Mesh(geo,new T.MeshStandardMaterial({color:i===4?'#8f8167':'#b4a178',roughness:1,side:T.DoubleSide}));bank.name='Irregular shoreline';bank.receiveShadow=true;group.add(bank);
  for(let j=0;j<45;j++){const a=random()*6.28,r=1.06+random()*.1,h=.6+random()*.65;reeds.push({x:s.x+Math.cos(a)*6*r,y:.13+h/2,z:s.z+Math.sin(a)*rz*r,sx:.028,sy:h,sz:.028,rz:(random()-.5)*.13});}
 }
 batch('Safari reeds',new T.CylinderGeometry(.5,1,1,5),green,reeds);
 // A distant treeline and low ridges close the horizon beyond the ride.
 const hills=[],trees=[],canopies=[];
 for(let i=0;i<18;i++){const z=-98+i*6.4,x=140+Math.sin(i*1.9)*5;hills.push({x,y:.5,z,sx:8+random()*4,sy:4+random()*4,sz:8+random()*3});}
 batch('Safari horizon ridges',new T.SphereGeometry(1,14,9),green,hills);
 for(let i=0;i<28;i++){const x=132+random()*9,z=-96+random()*113,h=3.5+random()*2;trees.push({x,y:h/2,z,sx:.24,sy:h,sz:.24});canopies.push({x,y:h,z,sx:2.6+random(),sy:.8,sz:2.3+random()});}
 batch('Safari distant trunks',new T.CylinderGeometry(.65,1,1,8),trunk,trees);batch('Safari distant canopies',new T.SphereGeometry(1,12,7),green,canopies);
 const ground=new T.Mesh(new T.BoxGeometry(110,.2,125),material('#879459'));ground.position.set(105,-.16,-42);ground.receiveShadow=true;group.add(ground);
 return {grass:grass.length,shrubs:shrubs.length,reeds:reeds.length};
}
