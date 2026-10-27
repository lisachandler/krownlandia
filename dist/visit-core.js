const KEY='krownlandia-visit-v1';
export function createVisit(storage,blocked){
  function valid(v){return v&&[v.x,v.z,v.yaw,v.pitch].every(Number.isFinite)&&typeof v.night==='boolean'&&Math.abs(v.pitch)<=1.1&&Math.abs(v.yaw)<=Math.PI&&!blocked(v.x,v.z);}
  function extras(v){const t=v.destination;return {...(t&&Number.isFinite(t.x)&&Number.isFinite(t.z)&&t.x>=-61&&t.x<=53&&(t.x>=-53||t.z>=128)&&t.z>=-92&&t.z<=178&&typeof t.name==='string'&&t.name.trim().length>0&&t.name.length<=160?{destination:{x:t.x,z:t.z,name:t.name}}:{}),...(typeof v.directionsStopped==='boolean'?{directionsStopped:v.directionsStopped}:{})};}
  return {
    read(){try{const v=JSON.parse(storage.getItem(KEY));return valid(v)?{x:v.x,z:v.z,yaw:v.yaw,pitch:v.pitch,night:v.night,...extras(v)}:null;}catch{return null;}},
    save(v){if(!valid(v))return false;try{const value=JSON.stringify({x:v.x,z:v.z,yaw:v.yaw,pitch:v.pitch,night:v.night,...extras(v)});try{if(storage.getItem(KEY)===value)return true;}catch{/* A failed read must not prevent an available write. */}storage.setItem(KEY,value);return true;}catch{return false;}}
  };
}
