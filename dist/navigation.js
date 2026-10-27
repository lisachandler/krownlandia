import * as T from './vendor/three.module.js';
import {createNavigator} from './navigation-core.js';
export function installNavigation({scene,blocked}){
 const planner=createNavigator(blocked),dots=new T.InstancedMesh(new T.CircleGeometry(.12,10),new T.MeshBasicMaterial({color:'#ffe09b',transparent:true,opacity:.85,depthWrite:false}),160);
 dots.name='Walking guidance trail';dots.frustumCulled=false;dots.visible=false;scene.add(dots);const d=new T.Object3D();let path=[],key='',last=-Infinity;
 const navigate=(ms,position,target,visible)=>{
  dots.visible=false;if(!target){key='';return null;}if(!visible)return null;
  const nextKey=target.x+','+target.z;
  while(path.length>1&&Math.hypot(path[0].x-position.x,path[0].z-position.z)<1)path.shift();
  if(nextKey!==key||(ms-last>1500&&(!path.length||Math.hypot(path[0].x-position.x,path[0].z-position.z)>2))){path=planner.route({x:position.x,z:position.z},target);key=nextKey;last=ms;}
  if(!path.length)return {unreachable:true};
  const remaining=path.filter(p=>Math.hypot(p.x-position.x,p.z-position.z)>.65);dots.count=Math.min(160,remaining.length);dots.visible=dots.count>0;
  remaining.slice(0,160).forEach((p,i)=>{d.position.set(p.x,.19,p.z);d.rotation.set(-Math.PI/2,0,0);d.updateMatrix();dots.setMatrixAt(i,d.matrix);});dots.instanceMatrix.needsUpdate=true;
  let length=0,previous=position;for(const p of remaining){length+=Math.hypot(p.x-previous.x,p.z-previous.z);previous=p;}
  return {next:remaining[0]||target,distance:length};
 };
 navigate.canReach=(position,target)=>planner.route(position,target).length>0;
 return navigate;
}
