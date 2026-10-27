export function createNeighbors(storage){
 const key='krownlandia-neighbors-v1',ids=['meadow','harbor','woodland'],met=new Set();let saved=true;
 try{const data=JSON.parse(storage.getItem(key)||'[]');if(Array.isArray(data))for(const id of data)if(ids.includes(id))met.add(id);}catch{saved=false;}
 function meet(id){if(!ids.includes(id))return false;const fresh=!met.has(id);met.add(id);try{storage.setItem(key,JSON.stringify([...met]));saved=true;}catch{saved=false;}return fresh;}
 return {meet,state:()=>({met:[...met],complete:met.size===ids.length,saved}),collection:()=>met.size===ids.length?[{id:'village-welcome',name:'Village Welcome Pennant',color:'#445b8a'}]:[]};
}
