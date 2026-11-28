import * as T from './vendor/three.module.js';
import {createNavigator} from './navigation-core.js';
export function installNavigation({scene,blocked,staticEdges=false}){
 const planner=createNavigator(blocked,{staticEdges}),dots=new T.InstancedMesh(new T.CircleGeometry(.12,10),new T.MeshBasicMaterial({color:'#ffe09b',transparent:true,opacity:.85,depthWrite:false}),160);
 dots.name='Walking guidance trail';dots.frustumCulled=false;dots.visible=false;scene.add(dots);const d=new T.Object3D();d.rotation.set(-Math.PI/2,0,0);
 const drawn=[];let path=[],key='',last=-Infinity;
 const navigate=(ms,position,target,visible,active=visible)=>{
  dots.visible=false;if(!target){key='';return null;}if(!active)return null;
  const nextKey=target.x+','+target.z;
  while(path.length>1&&Math.hypot(path[0].x-position.x,path[0].z-position.z)<1)path.shift();
  if(nextKey!==key||(ms-last>1500&&(!path.length||Math.hypot(path[0].x-position.x,path[0].z-position.z)>2))){path=planner.route({x:position.x,z:position.z},target);key=nextKey;last=ms;}
  if(!path.length)return {unreachable:true};
  let next=null,length=0,previous=position,count=0,changed=false;
  for(const p of path){
   if(Math.hypot(p.x-position.x,p.z-position.z)<=.65)continue;
   next??=p;
   length+=Math.hypot(p.x-previous.x,p.z-previous.z);previous=p;
   if(!visible||count>=160)continue;
   const lastPoint=drawn[count];
   if(!lastPoint||lastPoint.x!==p.x||lastPoint.z!==p.z){
    d.position.set(p.x,.19,p.z);d.updateMatrix();dots.setMatrixAt(count,d.matrix);drawn[count]=p;changed=true;
   }
   count++;
  }
  dots.count=count;dots.visible=count>0;
  if(changed)dots.instanceMatrix.needsUpdate=true;
  return {next:next??target,distance:length};
 };
 navigate.canReach=(position,target)=>planner.route(position,target).length>0;
 return navigate;
}
