import * as T from './vendor/three.module.js';
import {CHAPTERS,createJourney} from './journey-core.js';
export function installJourney({scene,camera,colliders,pause,onExit,guideTo=()=>{},guideToPoint=()=>{},getLounge=()=>null,rewardClaimed=()=>false}){
 const model=createJourney(),group=new T.Group();scene.add(group);
 const navy=new T.MeshStandardMaterial({color:'#123b67'}),gold=new T.MeshStandardMaterial({color:'#efbe51',metalness:.7,roughness:.28}),stone=new T.MeshStandardMaterial({color:'#ebdfc6'});
 const points=[[-32,-36],[-43,-42],[-45,-54],[-40,-65],[-29,-67],[-22,-57],[-24,-44],[-32,-36]].map(([x,z])=>new T.Vector3(x,.35,z));
 const exhibits=[],looks=[];
 function part(geo,mat,x,y,z,parent=group){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
 function label(text,x,y,z,w){const c=document.createElement('canvas');c.width=1024;c.height=160;const a=c.getContext('2d');a.fillStyle='#123b67';a.fillRect(0,0,1024,160);a.fillStyle='#f4d895';a.textAlign='center';a.font='42px Georgia';a.fillText(text,512,96);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return part(new T.PlaneGeometry(w,.85),new T.MeshStandardMaterial({map:t,side:T.DoubleSide}),x,y,z);}
 part(new T.BoxGeometry(10,.16,8),stone,-30,.05,-35);
 label('THE GREAT JOURNEY',-32,3.8,-38,8);
 for(const x of [-36,-28])part(new T.CylinderGeometry(.18,.25,4,12),gold,x,2,-38);
 const curve=new T.CatmullRomCurve3(points);
 part(new T.TubeGeometry(curve,180,.14,8,false),gold,0,0,0);
 for(let i=0;i<6;i++){
  const p=points[i+1],center=new T.Vector3(-33,0,-53),out=p.clone().sub(center).setY(0).normalize();
  const pos=p.clone().addScaledVector(out,4);pos.y=0;looks.push(pos.clone().setY(2));
  const g=new T.Group();g.position.copy(pos);group.add(g);exhibits.push(g);
  part(new T.CylinderGeometry(2.1,2.3,.4,24),stone,0,.2,0,g);colliders.push({x:pos.x,z:pos.z,r:2.3});
  const mat=new T.MeshStandardMaterial({color:CHAPTERS[i].color,emissive:CHAPTERS[i].color,emissiveIntensity:.04,metalness:.15,roughness:.4});
  const display=new T.Group();g.add(display);g.userData.display=display;g.userData.mat=mat;
  if(i===0){part(new T.CylinderGeometry(.16,.3,1.8,10),gold,0,1.2,0,display);for(let j=0;j<3;j++)part(new T.SphereGeometry(.85,12,10),mat,(j-1)*.6,2+j*.25,0,display);}
  if(i===1){for(let j=0;j<3;j++)part(new T.CylinderGeometry(1.7-j*.5,1.7-j*.5,.18,24),mat,0,.5+j*.8,0,display);part(new T.CylinderGeometry(.12,.2,2.6,12),gold,0,1.5,0,display);}
  if(i===2){for(let j=0;j<3;j++){const b=part(new T.OctahedronGeometry(.65),mat,(j-1)*1.15,1.3+j*.45,0,display);b.scale.set(1.4,.6,.6);}}
  if(i===3){for(let j=0;j<5;j++){const a=j/5*Math.PI*2;part(new T.CylinderGeometry(.22,.35,1.2,12),mat,Math.cos(a)*1.3,1,Math.sin(a)*1.3,display);part(new T.SphereGeometry(.23,10,8),gold,Math.cos(a)*1.3,1.85,Math.sin(a)*1.3,display);}part(new T.SphereGeometry(.55,16,12),mat,0,2.1,0,display);}
  if(i===4){for(let j=0;j<5;j++){const m=part(new T.OctahedronGeometry(.5),mat,(j-2)*.6,1.2+Math.sin(j)*.6,0,display);m.scale.y=2.5;}}
  if(i===5){part(new T.CylinderGeometry(1.3,1.3,.35,24),gold,0,.7,0,display);for(let j=0;j<7;j++){const a=j/7*Math.PI*2;part(new T.ConeGeometry(.3,1.6,8),mat,Math.cos(a),1.5,Math.sin(a),display);}}
  display.scale.setScalar(.55);label(String(i+1).padStart(2,'0')+' · '+CHAPTERS[i].title,pos.x,3.8,pos.z,6);
 }
 const car=new T.Group();group.add(car);part(new T.BoxGeometry(1.7,.55,2.3),navy,0,.25,0,car);part(new T.BoxGeometry(1.8,.1,2.4),gold,0,.55,0,car);part(new T.BoxGeometry(1.5,.8,.2),navy,0,1.05,.75,car);car.position.copy(points[0]);
 const panel=document.createElement('section');panel.id='journey';panel.tabIndex=0;panel.hidden=true;panel.setAttribute('aria-label','The Great Journey ride');panel.innerHTML='<span class="label">THE GREAT JOURNEY</span><h2 id="journeyTitle"></h2><p id="journeyText" role="status" aria-live="polite"></p><button id="journeyAction"></button><button id="journeyExit">Leave ride</button>';document.body.append(panel);
 const $=s=>document.querySelector(s),action=$('#journeyAction');let signature='',wasActive=false,finished=false,minimized=false;
 const compact=document.createElement('button');compact.id='journeyCompact';compact.textContent='Hide details';compact.setAttribute('aria-expanded','true');compact.setAttribute('aria-controls','journeyText');compact.onclick=()=>{minimized=!minimized;panel.classList.toggle('journey-minimized',minimized);compact.textContent=minimized?'Show details':'Hide details';compact.setAttribute('aria-expanded',String(!minimized));};panel.append(compact);
 const after=document.createElement('details');after.id='journeyAfterRide';after.hidden=true;const afterTitle=document.createElement('summary');afterTitle.textContent='After the journey';const loungeInfo=document.createElement('p');loungeInfo.id='journeyLoungeInfo';const loungeButton=document.createElement('button');loungeButton.id='journeyLounge';loungeButton.onclick=()=>{if(!finished)return;const lounge=getLounge();if(!lounge)return;guideToPoint({x:lounge.x,z:lounge.z+1.3,name:lounge.name});finished=false;render();};after.append(afterTitle,loungeInfo,loungeButton);panel.append(after);
 function render(){const s=model.state(),sig=s.phase+':'+s.stop+':'+finished+':'+rewardClaimed();if(sig===signature)return;signature=sig;const lounge=finished?getLounge():null;after.hidden=!lounge;if(!finished)after.open=false;if(lounge){loungeInfo.textContent=lounge.name+' · Virtual snack: '+lounge.snack+'. Souvenir: '+lounge.souvenir+'. Collect it from the lounge menu when you arrive.';loungeButton.textContent='Walk to '+lounge.name;}panel.hidden=!s.active&&!finished;panel.classList.toggle('ride-finished',finished);compact.hidden=finished;$('#journeyExit').textContent=finished?'Close':'Leave ride';if(finished){$('#journeyTitle').textContent='Journey complete';$('#journeyText').textContent=rewardClaimed()?'Your 75-point reward and Great Journey pin are already collected.':'75 points and the Great Journey pin are ready at the ride’s rewards station.';action.hidden=rewardClaimed();action.textContent='Find my reward';return;}if(!s.active)return;
  $('#journeyTitle').textContent=s.phase==='return'?'Your light travels onward':(s.stop+1)+' / 6 · '+CHAPTERS[s.stop].title;
  $('#journeyText').textContent=s.phase==='return'?'Returning to the entrance. Claim your completion reward at the station.':s.phase==='travel'?'Enjoy the journey to your next stop.':CHAPTERS[s.stop].text;
  action.hidden=s.phase!=='stop';action.textContent=CHAPTERS[s.stop]?.action||'';
 }
 action.onclick=()=>{if(finished){guideTo('journey');finished=false;render();return;}const s=model.state();if(model.act()){exhibits[s.stop].userData.activated=true;render();}};
 function exit(){if(finished){finished=false;render();return;}if(!model.state().active)return;model.cancel();finish();render();}
 function finish(completed=false){finished=completed;wasActive=false;camera.position.set(-29,1.75,-33);onExit();car.position.copy(points[0]);car.rotation.set(0,0,0);}
 $('#journeyExit').onclick=exit;
 function board(){if(model.start()){finished=false;pause();wasActive=true;signature='';for(const e of exhibits)e.userData.activated=false;render();return true;}return false;}
 function update(dt,paused){if(finished&&Math.hypot(camera.position.x+29,camera.position.z+33)>8)finished=false;if(!paused)model.tick(dt);const s=model.state();if(wasActive&&!s.active)finish(true);
  if(s.active){const returning=s.phase==='return',index=returning?6:s.stop,t=s.phase==='stop'?1:s.progress,smooth=t*t*(3-2*t);camera.position.copy(curve.getPoint((index+smooth)/7));camera.position.y=1.8;
   const focus=returning?points[7].clone().setY(1.8):looks[s.stop];camera.lookAt(focus);car.position.copy(camera.position).setY(.35);car.rotation.y=camera.rotation.y;
  }
  for(const e of exhibits){const target=e.userData.activated?1:.55;e.userData.display.scale.lerp(new T.Vector3(target,target,target),1-Math.exp(-dt*4));e.userData.mat.emissiveIntensity=e.userData.activated?.6:.04;}
  render();
 }
 return {board,update,exit,state:model.state,get active(){return model.state().active},get completed(){return model.state().completed},near:()=>Math.hypot(camera.position.x+32,camera.position.z+36)<4};
}
