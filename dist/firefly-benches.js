import * as T from './vendor/three.module.js';
export function installFireflyBenches({scene,colliders}){
 const root=new T.Group();root.name='Forest firefly viewing benches';scene.add(root);
 const wood=new T.MeshStandardMaterial({color:'#79583e',roughness:.9}),cushion=new T.MeshStandardMaterial({color:'#426950',roughness:.9}),path=new T.MeshStandardMaterial({color:'#b5a487',roughness:1});
 const seats=[];
 function box(x,y,z,w,h,d,material){const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);return mesh;}
 for(const [id,name,x,z,face]of [['woodland','Woodland Firefly Bench',-25,134,-1],['clearing','Eldergrove Clearing Firefly Bench',27,109,1],['homes','Eldergrove Homes Firefly Bench',36,147,-1]]){
  box(x,.08,z,3.8,.12,3.2,path);box(x,.6,z,2.8,.24,.8,wood);box(x,.75,z,2.6,.08,.72,cushion);box(x,1.13,z-face*.38,2.8,.85,.12,wood);for(const dx of [-1.2,1.2]){box(x+dx,.32,z,.15,.5,.7,wood);box(x+dx,.96,z,.14,.38,.85,wood);}
  colliders.push({x,z,w:1.7,d:.75});
  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle='#234637';ctx.fillRect(0,0,768,128);ctx.fillStyle='#ffe7ab';ctx.textAlign='center';ctx.font='36px serif';ctx.fillText('FIREFLY WATCH · NIGHT',384,80);const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const sign=new T.Mesh(new T.PlaneGeometry(2.8,.46),new T.MeshStandardMaterial({map:texture,side:T.DoubleSide}));sign.position.set(x,1.77,z-face*.4);root.add(sign);
  seats.push({id,name,x,z,y:1.5,yaw:face===1?Math.PI:0,approach:{x,z:z+face*1.4},kind:'firefly'});
 }
 return {seats};
}
