import * as T from './vendor/three.module.js';
import {createJourney} from './journey-core.js';
import {enrichSafariLandscape} from './safari-landscape.js';

export function installSafari({scene,camera,pause,onExit,takePhoto,getProgress=()=>({done:[],saved:false}),recordSighting=()=>{},guideTo=()=>{},guideToPoint=()=>{},getLounge=()=>null,rewardClaimed=()=>false}){
 const root=new T.Group();root.name='Safari habitats';scene.add(root);
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.85});
 const sand=mat('#bfa374'),grass=mat('#879459'),bark=mat('#66503c'),leaf=mat('#58734a'),rock=mat('#9a8b72'),water=mat('#648f91'),dark=mat('#292926'),ivory=mat('#f4e9c9'),pink=mat('#ed9cac');
 const tan=mat('#cca568'),gray=mat('#8f9290'),hippoGray=mat('#857e82'),brown=mat('#755337'),white=mat('#e6e0cf');
 const sphere=new T.SphereGeometry(1,12,8),legGeo=new T.CylinderGeometry(1,1,1,8),boxGeo=new T.BoxGeometry(1,1,1);
 function shape(parent,geo,m,x,y,z,sx,sy,sz){const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
 const ball=(p,m,x,y,z,sx,sy=sx,sz=sx)=>shape(p,sphere,m,x,y,z,sx,sy,sz);
 const cyl=(p,m,x,y,z,r,h)=>shape(p,legGeo,m,x,y,z,r,h,r);
 const box=(p,m,x,y,z,xs,ys,zs)=>shape(p,boxGeo,m,x,y,z,xs,ys,zs);
 function sign(text,x,y,z,w=9){
  const c=document.createElement('canvas');c.width=Math.round(w*160);c.height=176;const a=c.getContext('2d');a.fillStyle='#263c32';a.fillRect(0,0,c.width,c.height);a.fillStyle='#f6dfad';a.textAlign='center';a.textBaseline='middle';let fontSize=82;a.font=fontSize+'px Georgia';const measured=a.measureText(text).width;if(measured>c.width-48){fontSize=Math.floor(fontSize*(c.width-48)/measured);a.font=fontSize+'px Georgia';}a.fillText(text,c.width/2,c.height/2+2);
  const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;const o=new T.Mesh(new T.PlaneGeometry(w,1.1),new T.MeshStandardMaterial({map:t,side:T.DoubleSide}));o.name='Safari sign · '+text;o.position.set(x,y,z);root.add(o);
 }
 box(root,grass,88,-.25,-43,80,.45,91);box(root,sand,31,.06,-26,36,.13,5);box(root,sand,48,.07,-28,8,.15,8);
 sign('KROWNLANDIA SAFARI',48,4,-31,11);for(const x of [42,54])cyl(root,bark,x,2,-31,.18,4);
 const points=[[48,-28],[64,-24],[87,-26],[105,-43],[95,-66],[70,-65],[55,-48],[48,-28]].map(([x,z])=>new T.Vector3(x,.16,z));
 const curve=new T.CatmullRomCurve3(points),road=new T.Mesh(new T.TubeGeometry(curve,200,1.3,8,false),sand);road.scale.y=.08;root.add(road);
 const stops=[
  {name:'Acacia savanna',animal:'Giraffes',x:65,z:-15,kind:'giraffe',text:'Watch the giraffes move among the acacia trees.'},
  {name:'The waterhole',animal:'Elephants',x:87,z:-15,kind:'elephant',text:'Pause beside the water as the elephant herd gathers.'},
  {name:'Open grassland',animal:'Zebras',x:116,z:-42,kind:'zebra',text:'Look across the grassland for the striped herd.'},
  {name:'Rocky savanna',animal:'Lions',x:102,z:-77,kind:'lion',text:'Observe the lions beside the warm rocks from your vehicle.'},
  {name:'Riverbank',animal:'Hippos',x:70,z:-77,kind:'hippo',text:'Look for the hippos along the edge of the river.'},
  {name:'Shallow wetlands',animal:'Flamingos',x:61,z:-44,kind:'flamingo',text:'Find the pink flock among the reeds and shallow water.'}
 ];
 function tree(x,z){cyl(root,bark,x,2.2,z,.23,4.4);ball(root,leaf,x,4.6,z,3,.65,2.3);ball(root,leaf,x+1.5,4.8,z-.5,2.1,.55,1.9);}
 enrichSafariLandscape({root,curve,stops});
 for(const [x,z]of [[60,-9],[72,-12],[78,-8],[99,-13],[120,-32],[118,-53],[91,-82],[57,-69],[51,-54],[108,-68],[82,-55]])tree(x,z);
 for(let i=0;i<25;i++){const a=i*2.399,x=94+Math.sin(a)*29,z=-44+Math.cos(a)*34;ball(root,grass,x,.6,z,1.3,.6,1);}
 for(const i of [1,4,5]){const s=stops[i],pond=shape(root,new T.CylinderGeometry(1,1,1,48),water,s.x,.07,s.z,6,.08,i===4?3:5);for(let j=0;j<12;j++){const a=j/12*Math.PI*2;cyl(root,leaf,s.x+Math.cos(a)*6,.6,s.z+Math.sin(a)*4,.055,1.2);}}
 for(let i=0;i<6;i++)ball(root,rock,98+(i%3)*2,.6+(i%2)*.5,-79+Math.floor(i/3)*2,2,1.1,1.4);
 const animals=[],ripples=[];
 const rippleMaterial=new T.MeshBasicMaterial({color:'#c2d9c3',transparent:true,opacity:.22,side:T.DoubleSide,depthWrite:false});
 for(const i of [1,4,5])for(let j=0;j<3;j++){const mesh=new T.Mesh(new T.RingGeometry(.96,1,40),rippleMaterial.clone());mesh.rotation.x=-Math.PI/2;mesh.position.set(stops[i].x+(j-1)*2.3,.12,stops[i].z);root.add(mesh);ripples.push({mesh,offset:j/3});}
 function animal(kind,x,z,index){const g=new T.Group();g.name='Safari '+kind+' '+index;g.position.set(x,0,z);root.add(g);const m=kind==='elephant'?gray:kind==='hippo'?hippoGray:kind==='zebra'?white:kind==='flamingo'?pink:tan;
  const tall=kind==='giraffe',flamingo=kind==='flamingo',heavy=kind==='elephant'||kind==='hippo',bodyY=tall?2.1:flamingo?1.4:heavy?1.35:1;
  ball(g,m,0,bodyY,0,flamingo?.35:heavy?1.05:.7,flamingo?.3:heavy?.85:.5,flamingo?.55:heavy?1.55:1.1);
  let trunk=null;const ears=[];
  const legs=[];for(const dx of flamingo?[-.12,.12]:[-.45,.45])for(const zz of flamingo?[0]:[-.7,.7]){const h=tall?1.8:flamingo?1.2:heavy?.9:.8;const l=cyl(g,flamingo?pink:m,dx,h/2,zz,flamingo?.035:heavy?.22:.09,h);legs.push(l);}
  const headY=tall?4.1:flamingo?2.3:heavy?1.7:1.45;
  if(tall||flamingo){const neck=cyl(g,m,0,(headY+bodyY)/2,.65,flamingo?.07:.19,headY-bodyY);neck.rotation.x=.13;}
  ball(g,m,0,headY,flamingo?.7:1.05,flamingo?.17:heavy?.6:.32,flamingo?.2:heavy?.65:.35,flamingo?.25:heavy?.55:.46);
  for(const dx of [-1,1])ball(g,dark,dx*(flamingo?.12:heavy?.4:.23),headY+.08,flamingo?.83:1.3,.035);
  if(kind==='elephant'){for(const dx of [-.65,.65])ears.push(ball(g,m,dx,1.8,.8,.52,.68,.16));trunk=cyl(g,m,0,1.05,1.55,.18,1.6);trunk.rotation.x=-.22;for(const dx of [-.3,.3]){const tusk=shape(g,new T.ConeGeometry(1,1,8),ivory,dx,1.1,1.65,.08,.6,.08);tusk.rotation.x=-.6;}}
  if(kind==='giraffe'){for(const dx of [-.17,.17]){cyl(g,brown,dx,4.5,.95,.055,.3);ball(g,brown,dx,4.68,.95,.08);}for(let i=0;i<12;i++)ball(g,brown,(i%2?1:-1)*.65,1.95+(i%3)*.2,-.7+Math.floor(i/3)*.4,.12,.15,.14);for(let i=0;i<5;i++)ball(g,brown,.18,2.6+i*.25,.65,.065,.09,.09);}
  if(kind==='zebra'){for(let i=0;i<7;i++){const band=shape(g,new T.TorusGeometry(.7,.065,5,16),dark,0,bodyY,-.82+i*.27,1,.72,1);band.rotation.set(0,0,0);}box(g,dark,0,1.6,.8,.1,.3,.55);}
  if(kind==='lion'){ball(g,brown,0,1.45,.9,.5,.53,.38);ball(g,tan,0,1.47,1.15,.32,.35,.34);for(const dx of [-.19,.19])ball(g,dark,dx,1.55,1.4,.035);}
  if(kind==='hippo')ball(g,m,0,1.32,1.6,.68,.34,.4);
  if(flamingo){const beak=shape(g,new T.ConeGeometry(1,1,8),dark,0,2.26,1,.065,.3,.065);beak.rotation.x=Math.PI/2;}
  const head=new T.Group();head.name=kind+' head movement';head.position.set(0,tall?2.15:flamingo?1.4:kind==='zebra'?.8:1.15,tall||flamingo?.6:.45);
  const upper=[...g.children].filter(o=>tall?o.position.y>2.35:flamingo?o.position.y>1.6:kind==='zebra'?o.position.y>1.35&&o.position.z>.65:kind==='lion'?o.position.y>1.3&&o.position.z>.7:kind==='hippo'?o.position.z>1: false);
  g.add(head);for(const o of upper){o.position.sub(head.position);head.add(o);}
  let tail=null;if(!flamingo){tail=new T.Group();tail.position.set(0,bodyY,-(heavy?1.4:1));g.add(tail);cyl(tail,m,0,-.32,-.05,.035,.65);ball(tail,dark,0,-.68,-.05,.075,.13,.075);}
  if(kind==='giraffe'||kind==='zebra')for(const side of [-1,1]){const ear=ball(head,m,side*.3,headY-head.position.y+.2,1-head.position.z,.18,.085,.1);ear.rotation.z=side*.4;}
  animals.push({g,legs,head,trunk,ears,tail,x,z,index,kind});return g;
 }
 stops.forEach((s,i)=>{const count=i===5?7:3;for(let j=0;j<count;j++)animal(s.kind,s.x+(j%3-1)*2.6,s.z+Math.floor(j/3)*1.8,j+i*3);sign(s.animal,s.x,5.4,s.z-3,7);});
 const jeep=new T.Group();jeep.name='Safari vehicle';root.add(jeep);box(jeep,bark,0,.65,0,2.2,.65,3.5);box(jeep,dark,0,1.05,1.1,1.9,.6,.2);for(const x of [-1.1,1.1])for(const z of [-1,1]){const wheel=cyl(jeep,dark,x,.45,z,.4,.25);wheel.rotation.z=Math.PI/2;}jeep.position.copy(points[0]);
 const panel=document.createElement('section');panel.id='safari';panel.tabIndex=0;panel.hidden=true;panel.setAttribute('aria-label','Safari ride');panel.innerHTML='<span class="label">KROWNLANDIA SAFARI</span><h2 id="safariTitle"></h2><p id="safariText" aria-live="polite"></p><details id="safariViewing"><summary>Look around &amp; zoom</summary><p>Drag the scene to look, or use these buttons.</p><div><button id="safariLeft" aria-label="Look left">←</button><button id="safariRight" aria-label="Look right">→</button><button id="safariUp" aria-label="Look up">↑</button><button id="safariDown" aria-label="Look down">↓</button><button id="safariZoom" aria-pressed="false">Binoculars</button><button id="safariCenter">Face animals</button><button id="safariPace" aria-pressed="false">Slow pace</button></div></details><button id="safariPause">Pause drive</button><button id="safariNext">Continue safari</button><button id="safariExit">Leave ride</button><button id="safariCompact" aria-expanded="true">Hide details</button>';document.body.append(panel);
 const $=s=>document.querySelector(s),model=createJourney();let signature='',wasActive=false,finished=false,lookYaw=0,lookPitch=0,zoomed=false,manualPause=false,pace=1,minimized=false,normalFov=camera.fov;const smoothFocus=new T.Vector3(65,2.1,-15);
 const fieldNotes=[
  {animal:'Giraffes',slug:'giraffe',fact:'Giraffes browse leaves on tree-dotted African plains. Their height helps them reach foliage above many other plant-eaters.',look:'Watch the gentle head movements and look for the acacia canopies.'},
  {animal:'Elephants',slug:'elephant',fact:'African savanna elephants live in varied habitats, including woodlands and savannas. Their ears help release body heat.',look:'Watch the moving trunks and gently flapping ears beside the waterhole.'},
  {animal:'Zebras',slug:'zebra',fact:'Zebras eat mostly grasses. Different zebra species occupy different habitats, from grasslands to rocky slopes.',look:'Look for the herd lowering their heads toward the grass.'},
  {animal:'Lions',slug:'lion',fact:'Lions live in habitats that include grassland and open woodland. They spend much of their time resting between periods of activity.',look:'Find the resting lions near the rocks and watch their slow head turns.'},
  {animal:'Hippos',slug:'hippo',fact:'Common hippos spend much of the day in water and come onto land to graze after sunset.',look:'Look along the riverbank for partly submerged bodies and small ripples.'},
  {animal:'Flamingos',slug:'flamingo',fact:'Flamingos feed in shallow lakes and lagoons, filtering food with specialized bills. Their food supplies the pigments behind their pink color.',look:'Watch the flock bend their necks toward the shallow water.'}
 ];
 const field=document.createElement('details');field.id='safariFieldGuide';field.hidden=true;const fieldTitle=document.createElement('summary');fieldTitle.id='safariFieldTitle';const fieldFact=document.createElement('p');fieldFact.id='safariFieldFact';const fieldLook=document.createElement('p');fieldLook.id='safariFieldLook';const fieldSource=document.createElement('a');fieldSource.id='safariFieldSource';fieldSource.textContent='Wildlife source · San Diego Zoo (opens a new tab)';fieldSource.target='_blank';fieldSource.rel='noopener noreferrer';field.append(fieldTitle,fieldFact,fieldLook,fieldSource);panel.append(field);
 const sightingStatus=document.createElement('p');sightingStatus.id='safariSightings';sightingStatus.setAttribute('aria-live','polite');const sightingList=document.createElement('p');sightingList.id='safariSightingList';const record=document.createElement('button');record.id='safariRecordSighting';field.append(sightingStatus,sightingList,record);
 function refreshSightings(){const state=getProgress(),seen=note=>state.done.includes('safari-sighting-'+note.slug),s=model.state(),note=fieldNotes[s.stop];sightingStatus.textContent=fieldNotes.filter(seen).length+' / 6 animal groups recorded · '+(state.saved?'saved on this browser':'this visit only')+(fieldNotes.every(seen)?' · Safari Field Notebook earned for your home display.':'');sightingList.textContent=fieldNotes.map(n=>(seen(n)?'✓ ':'○ ')+n.animal).join(' · ');record.disabled=!s.active||s.phase!=='stop'||!note||seen(note);record.textContent=note&&seen(note)?'Sighting recorded':'Record '+(note?.animal.toLowerCase()||'sighting');}
 record.onclick=()=>{const s=model.state();if(!s.active||s.phase!=='stop')return;recordSighting(fieldNotes[s.stop].slug);refreshSightings();};
 const photo=document.createElement('button');photo.id='safariPhoto';photo.textContent='Take photo';$('#safariViewing div').append(photo);photo.onclick=takePhoto;
 $('#safariPause').onclick=()=>{const s=model.state();if(!s.active||s.phase==='stop')return;manualPause=!manualPause;render();};
 $('#safariPace').onclick=()=>{pace=pace===1?.5:1;$('#safariPace').textContent=pace===.5?'Normal pace':'Slow pace';$('#safariPace').setAttribute('aria-pressed',String(pace===.5));};
 $('#safariCompact').onclick=()=>{minimized=!minimized;panel.classList.toggle('safari-minimized',minimized);$('#safariCompact').textContent=minimized?'Show details':'Hide details';$('#safariCompact').setAttribute('aria-expanded',String(!minimized));};
 function look(dx,dy){if(!model.state().active)return;lookYaw=Math.max(-Math.PI,Math.min(Math.PI,lookYaw-dx*.004));lookPitch=Math.max(-.8,Math.min(.8,lookPitch-dy*.004));}
 function zoom(value){zoomed=value;camera.fov=value?normalFov/2:normalFov;camera.updateProjectionMatrix();$('#safariZoom').textContent=value?'Put binoculars away':'Binoculars';$('#safariZoom').setAttribute('aria-pressed',String(value));}
 $('#safariLeft').onclick=()=>look(-100,0);$('#safariRight').onclick=()=>look(100,0);$('#safariUp').onclick=()=>look(0,-75);$('#safariDown').onclick=()=>look(0,75);$('#safariCenter').onclick=()=>{lookYaw=lookPitch=0;};$('#safariZoom').onclick=()=>{if(model.state().active)zoom(!zoomed);};
 const after=document.createElement('details');after.id='safariAfterRide';after.hidden=true;const afterTitle=document.createElement('summary');afterTitle.textContent='After the safari';const loungeInfo=document.createElement('p');loungeInfo.id='safariLoungeInfo';const loungeButton=document.createElement('button');loungeButton.id='safariLounge';loungeButton.onclick=()=>{if(!finished)return;const lounge=getLounge();if(!lounge)return;guideToPoint({x:lounge.x,z:lounge.z+1.3,name:lounge.name});finished=false;render();};after.append(afterTitle,loungeInfo,loungeButton);panel.append(after);
 function render(){const s=model.state(),key=s.phase+s.stop+manualPause+':'+finished+':'+rewardClaimed();if(key===signature)return;signature=key;const lounge=finished?getLounge():null;after.hidden=!lounge;if(!finished)after.open=false;if(lounge){loungeInfo.textContent=lounge.name+' · Virtual snack: '+lounge.snack+'. Souvenir: '+lounge.souvenir+'. Collect it from the lounge menu when you arrive.';loungeButton.textContent='Walk to '+lounge.name;}panel.hidden=!s.active&&!finished;panel.classList.toggle('ride-finished',finished);$('#safariExit').textContent=finished?'Close':'Leave ride';$('#safariViewing').hidden=finished;$('#safariCompact').hidden=finished;field.hidden=!s.active||s.phase!=='stop';field.open=false;if(finished){$('#safariTitle').textContent='Safari complete';$('#safariText').textContent=rewardClaimed()?'Your 60-point reward and Safari Explorer pin are already collected.':'60 points and the Safari Explorer pin are ready at the safari rewards station.';$('#safariNext').hidden=rewardClaimed();$('#safariNext').textContent='Find my reward';$('#safariPause').hidden=true;return;}$('#safariNext').textContent='Continue safari';if(!s.active)return;if(s.phase==='stop'){const note=fieldNotes[s.stop];fieldTitle.textContent='Field guide · '+note.animal;fieldFact.textContent=note.fact;fieldLook.textContent='Look for · '+note.look;fieldSource.href='https://animals.sandiegozoo.org/animals/'+note.slug;refreshSightings();}$('#safariTitle').textContent=s.phase==='return'?'Returning to the safari station':(s.stop+1)+' / 6 · '+stops[s.stop].name;$('#safariText').textContent=s.phase==='return'?'Claim your safari completion points at the entrance.':s.phase==='travel'?'Enjoy the drive to the next habitat.':stops[s.stop].text;$('#safariNext').hidden=s.phase!=='stop';$('#safariPause').hidden=s.phase==='stop';$('#safariPause').textContent=manualPause?'Resume drive':'Pause drive';if(manualPause)$('#safariText').textContent='Drive paused. Look around or use binoculars; resume when you are ready.';}
 function finish(completed=false){finished=completed;wasActive=false;manualPause=false;lookYaw=lookPitch=0;zoom(false);camera.position.set(47,1.75,-24);jeep.position.copy(points[0]);onExit();}
 function exit(){if(finished){finished=false;render();return;}if(!model.state().active)return;model.cancel();finish();render();}
 $('#safariNext').onclick=()=>{if(finished){guideTo('safari');finished=false;render();return;}if(model.act()){manualPause=false;lookYaw=lookPitch=0;zoom(false);}render();};$('#safariExit').onclick=exit;
 return {collection:()=>fieldNotes.every(n=>getProgress().done.includes('safari-sighting-'+n.slug))?[{id:'safari-notebook',name:'Safari Field Notebook',color:'#42694b'}]:[],look,board(){if(model.start()){finished=false;manualPause=false;normalFov=camera.fov;smoothFocus.set(65,2.1,-15);lookYaw=lookPitch=0;zoom(false);pause();wasActive=true;signature='';render();}},exit,state:()=>({...model.state(),paused:manualPause,pace}),get active(){return model.state().active},get completed(){return model.state().completed},near:()=>Math.hypot(camera.position.x-48,camera.position.z+28)<3.5,
 update(dt,paused,ms){if(finished&&Math.hypot(camera.position.x-47,camera.position.z+24)>8)finished=false;if(!paused&&!manualPause)model.tick(dt*pace);const s=model.state();if(wasActive&&!s.active)finish(true);if(s.active){const i=s.phase==='return'?6:s.stop,t=s.phase==='stop'?1:s.progress,e=t*t*(3-2*t);camera.position.copy(curve.getPoint((i+e)/7));camera.position.y=2.05;const focus=i===6?new T.Vector3(48,2,-28):new T.Vector3(stops[i].x,2.1,stops[i].z);smoothFocus.lerp(focus,1-Math.exp(-dt*2.5));camera.lookAt(smoothFocus);jeep.position.copy(camera.position).setY(.1);jeep.rotation.y=camera.rotation.y;camera.rotation.y+=lookYaw;camera.rotation.x=Math.max(-1.1,Math.min(1.1,camera.rotation.x+lookPitch));}
  for(const a of animals){const phase=ms*.00065+a.index,sway=Math.sin(phase),slow=Math.sin(phase*.4);a.g.rotation.y=slow*.16;
   if(a.kind==='giraffe'){a.head.rotation.x=.08+sway*.09;a.head.rotation.y=slow*.12;}
   if(a.kind==='elephant'){a.trunk.rotation.z=sway*.2;a.trunk.rotation.x=-.22+slow*.15;a.ears.forEach((ear,i)=>ear.rotation.y=(i?1:-1)*(.08+.12*Math.sin(phase*.6)));}
   if(a.kind==='zebra'){a.head.rotation.x=.55+.5*Math.sin(phase*.45);}
   if(a.kind==='lion'){a.g.position.y=-.48;a.head.rotation.y=slow*.25;a.legs.forEach(l=>l.rotation.x=-1.15);}
   if(a.kind==='hippo'){a.g.position.y=-.8+sway*.09;a.head.rotation.x=slow*.04;}
   if(a.kind==='flamingo'){a.head.rotation.x=.35+Math.max(0,sway)*1.25;a.legs[0].rotation.x=.12+Math.max(0,-sway)*.35;}
   if(a.tail)a.tail.rotation.z=Math.sin(phase*1.8)*.22;
  }
  for(const r of ripples){const t=(ms*.00016+r.offset)%1;r.mesh.scale.setScalar(.4+t*2);r.mesh.material.opacity=(1-t)*.2;}
  render();}
 };
}
