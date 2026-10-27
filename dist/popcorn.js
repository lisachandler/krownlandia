import * as T from './vendor/three.module.js';
export function installPopcorn({scene,camera,colliders}){
 const root=new T.Group();root.name='Circus popcorn stand';root.position.set(34,0,-58);scene.add(root);
 const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.6,...extra});
 const red=mat('#b32343'),cream=mat('#fff1cf'),gold=mat('#dfb457',{metalness:.5}),dark=mat('#182947'),glass=mat('#cce7ee',{transparent:true,opacity:.16,depthWrite:false});
 function part(geo,m,x,y,z,parent=root){const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 const box=(x,y,z,w,h,d,m)=>part(new T.BoxGeometry(w,h,d),m,x,y,z);
 box(0,.7,0,2.7,1.15,1.2,cream);for(let i=0;i<7;i++)box(-1.2+i*.4,.7,.61,.2,1.15,.03,red);box(0,1.32,0,2.95,.15,1.4,gold);
 colliders.push({x:34,z:-58,w:1.8,d:1});
 for(const x of [-1.3,1.3])box(x,2.05,-.4,.07,1.5,.07,gold);
 box(0,2.8,-.05,3.1,.2,1.7,red);
 const c=document.createElement('canvas');c.width=768;c.height=160;const ctx=c.getContext('2d');ctx.fillStyle='#182947';ctx.fillRect(0,0,768,160);ctx.textAlign='center';ctx.fillStyle='#ffe2a0';ctx.font='bold 54px serif';ctx.fillText('CIRCUS POPCORN',384,69);ctx.font='27px sans-serif';ctx.fillText('A complimentary virtual treat',384,121);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;
 part(new T.PlaneGeometry(3,.63),mat('#ffffff',{map:tex}),0,2.55,.82);
 box(-.65,1.47,-.05,1,.16,.85,red);box(-.65,2.18,-.05,1,.12,.85,red);
 box(-.65,1.82,-.05,.95,.65,.8,glass);for(const x of [-1.1,-.2])for(const z of [-.4,.3])box(x,1.82,z,.035,.65,.035,gold);
 part(new T.CylinderGeometry(.25,.3,.22,16),dark,-.65,2,-.05);
 const kernels=new T.InstancedMesh(new T.IcosahedronGeometry(.07,1),cream,70),dummy=new T.Object3D();kernels.name='Popcorn in machine';root.add(kernels);
 for(let i=0;i<70;i++){dummy.position.set(-1.02+(i%7)*.12,1.57+Math.floor(i/35)*.1,-.32+(Math.floor(i/7)%5)*.13);dummy.rotation.set(i*.7,i*.4,0);dummy.updateMatrix();kernels.setMatrixAt(i,dummy.matrix);}
 const bag=new T.Group();bag.name='Popcorn serving';bag.position.set(.72,1.43,.25);bag.visible=false;root.add(bag);
 for(let i=0;i<12;i++)part(new T.CylinderGeometry(.24,.17,.5,1,1,true,i*Math.PI/6,Math.PI/6),i%2?cream:red,0,.25,0,bag);
 for(let i=0;i<19;i++){const a=i*2.399,r=.19*Math.sqrt(i/19);part(new T.IcosahedronGeometry(.065,1),cream,Math.cos(a)*r,.51+Math.sin(i)*.025,Math.sin(a)*r,bag);}
 let ready=false,collected=false;
 const near=()=>Math.hypot(camera.position.x-34,camera.position.z+56.5)<1.35;
 return {near,get collected(){return collected},get label(){return ready?'E · Pick up your popcorn':collected?'E · Get another popcorn':'E · Get complimentary popcorn';},interact(){if(!near())return false;if(ready){ready=false;collected=true;}else ready=true;bag.visible=ready;return true;}};
}
