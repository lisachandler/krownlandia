import * as T from './vendor/three.module.js';

export function installRoasted({scene,colliders}){
 const root=new T.Group();root.name='Roasted castle restaurant';scene.add(root);
 const mat=(color,metalness=0)=>new T.MeshStandardMaterial({color,metalness,roughness:metalness?.35:.8});
 const cream=mat('#f1e4c8'),olive=mat('#526344'),copper=mat('#b87043',.55),wood=mat('#70523b'),steel=mat('#c1c8c6',.75),orange=mat('#df8b35'),green=mat('#679452'),purple=mat('#884c71');
 function add(g,m,x,y,z){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;root.add(o);return o;}
 function box(x,y,z,w,h,d,m,solid=false){const o=add(new T.BoxGeometry(w,h,d),m,x,y,z);if(solid)colliders.push({x,z,w:w/2+.4,d:d/2+.4});return o;}
 function cylinder(x,y,z,r,h,m){return add(new T.CylinderGeometry(r,r,h,28),m,x,y,z);}
 function sign(text,x,y,z,w,h=.7){const c=document.createElement('canvas'),density=Math.min(160/h,2048/w);c.width=Math.round(w*density);c.height=Math.round(h*density);const a=c.getContext('2d');a.fillStyle='#344836';a.fillRect(0,0,c.width,c.height);a.fillStyle='#f6e2bb';a.textAlign='center';a.textBaseline='middle';let size=Math.floor(c.height*.55);a.font=size+'px Georgia';const measured=a.measureText(text).width;if(measured>c.width-32){size=Math.floor(size*(c.width-32)/measured);a.font=size+'px Georgia';}a.fillText(text,c.width/2,c.height/2+1);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;const board=add(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:t,side:T.DoubleSide}),x,y,z);board.name='Roasted sign · '+text;}

 box(0,.06,-87.5,24,.12,10,cream);
 sign('R O A S T E D',0,5.55,-83.15,9,1);sign('ROASTED VEGETABLES · READY TO GO',0,4.65,-83.13,9,.5);
 box(0,.65,-90,8,1.3,1.3,olive,true);box(0,1.36,-90,8.3,.12,1.6,copper);
 box(0,2.4,-92.15,3,2.5,.25,wood);box(0,2.3,-91.96,2.2,1.4,.1,mat('#33271e'));
 const menuCanvas=document.createElement('canvas');menuCanvas.width=1600;menuCanvas.height=320;const menuContext=menuCanvas.getContext('2d');menuContext.fillStyle='#344836';menuContext.fillRect(0,0,1600,320);menuContext.strokeStyle='#b87043';menuContext.lineWidth=5;menuContext.strokeRect(12,12,1576,296);menuContext.textAlign='center';menuContext.fillStyle='#f6e2bb';menuContext.font='bold 40px sans-serif';menuContext.fillText('ROASTED VEGETABLE BOWLS',800,55);menuContext.font='38px Georgia';['Rainbow Roast','Mediterranean Roast','Harvest Roast'].forEach((name,i)=>menuContext.fillText(name,800,110+i*50));menuContext.font='30px sans-serif';menuContext.fillText('Reusable bowls · return, wash, reuse',800,275);const menuTexture=new T.CanvasTexture(menuCanvas);menuTexture.colorSpace=T.SRGBColorSpace;const menu=add(new T.PlaneGeometry(10,2),new T.MeshStandardMaterial({map:menuTexture,side:T.DoubleSide,roughness:.8}),0,4.9,-92.08);menu.name='Roasted bowl menu';
 for(const x of [-7,7]){
  cylinder(x,1,-88,1,.12,wood);cylinder(x,.5,-88,.12,1,copper);colliders.push({x,z:-88,r:1.1});
  for(const dx of [-1.4,1.4]){box(x+dx,.5,-88,.7,.15,.75,olive,true);box(x+dx,.95,-88.32,.7,.8,.12,wood);}
  cylinder(x,.5,-91,.65,1,copper);add(new T.SphereGeometry(.9,12,8),green,x,1.5,-91);
 }
 box(-7,.75,-84.5,1.4,1.5,1,olive,true);box(-7,1.55,-84.5,1.55,.1,1.1,steel);
 sign('CONTAINER RETURN',-7,2.35,-83.9,3.4,.5);
 sign('Thank you for bringing it back',-7,1.95,-83.89,3.4,.32);
 const serving=new T.Group();serving.name='Roasted takeaway bowl';serving.position.set(0,1.45,-89.6);serving.visible=false;root.add(serving);
 const bowl=new T.Mesh(new T.CylinderGeometry(.55,.4,.24,28,1,true),steel);bowl.position.y=.14;serving.add(bowl);
 const base=new T.Mesh(new T.CylinderGeometry(.4,.4,.04,28),steel);base.position.y=.02;serving.add(base);
 const pieces=[];for(let i=0;i<16;i++){const piece=new T.Mesh(new T.DodecahedronGeometry(.12,0),[orange,green,purple][i%3]);const a=i*2.399,r=Math.sqrt(i/16)*.4;piece.position.set(Math.cos(a)*r,.23+(i%3)*.025,Math.sin(a)*r);piece.scale.set(1.1,.7,1);serving.add(piece);pieces.push(piece);}
 const lid=new T.Mesh(new T.CylinderGeometry(.56,.56,.05,28),steel);lid.position.set(.95,.025,0);serving.add(lid);
 const red=mat('#b95336'),pale=mat('#d6c89c');const palettes={'Rainbow Roast':[orange,green,pale],'Mediterranean Roast':[purple,red,green],'Harvest Roast':[orange,pale,green]};
 let previous='';
 return order=>{const key=order?order.name+order.status:'';if(key===previous)return;previous=key;serving.visible=order?.status==='ready';if(order){const palette=palettes[order.name]||palettes['Rainbow Roast'];pieces.forEach((piece,i)=>{piece.material=palette[i%3];piece.scale.set(i%3===1?.85:1.1,i%3===1?1:.7,1);});}};
}
