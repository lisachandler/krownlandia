// A bounded walking grid. Segment checks prevent routes cutting through corners.
export function createNavigator(blocked){
 const width=113,height=269,minX=-60,minZ=-91,walk=new Uint8Array(width*height);
 const point=i=>({x:minX+i%width,z:minZ+Math.floor(i/width)});
 for(let i=0;i<walk.length;i++){const p=point(i);walk[i]=!blocked(p.x,p.z);}
 function clear(a,b){const n=Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)*5);for(let j=0;j<=n;j++){const t=n?j/n:0;if(blocked(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t))return false;}return true;}
 function route(start,target){
  let first=-1,distance=Infinity;const goals=new Set();
  for(let i=0;i<walk.length;i++){if(!walk[i])continue;const p=point(i),d=Math.hypot(p.x-start.x,p.z-start.z);if(d<distance&&d<2&&clear(start,p)){first=i;distance=d;}if(Math.hypot(p.x-target.x,p.z-target.z)<1.8)goals.add(i);}
  if(first<0||!goals.size)return [];
  const costs=new Float64Array(walk.length).fill(Infinity),parents=new Int32Array(walk.length).fill(-1),closed=new Uint8Array(walk.length),heap=[];
  function push(i,f){let at=heap.length;heap.push({i,f});while(at){const up=(at-1)>>1;if(heap[up].f<=f)break;heap[at]=heap[up];at=up;}heap[at]={i,f};}
  function pop(){const top=heap[0],last=heap.pop();if(heap.length){let i=0;while(i*2+1<heap.length){let c=i*2+1;if(c+1<heap.length&&heap[c+1].f<heap[c].f)c++;if(heap[c].f>=last.f)break;heap[i]=heap[c];i=c;}heap[i]=last;}return top.i;}
  costs[first]=0;push(first,0);
  while(heap.length){const i=pop();if(closed[i])continue;closed[i]=1;if(goals.has(i)){const path=[];for(let j=i;j!==-1;j=parents[j])path.push(point(j));return [start,...path.reverse()];}
   const p=point(i),ix=i%width,iz=Math.floor(i/width);
   for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const x=ix+dx,z=iz+dz;if(x<0||x>=width||z<0||z>=height)continue;const j=z*width+x;if(!walk[j]||closed[j])continue;const q=point(j);if(!clear(p,q))continue;const g=costs[i]+Math.hypot(dx,dz);if(g>=costs[j])continue;costs[j]=g;parents[j]=i;push(j,g+Math.max(0,Math.hypot(q.x-target.x,q.z-target.z)-1.8));}
  }return [];
 }
 return {route,clear};
}
