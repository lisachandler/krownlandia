import * as T from './vendor/three.module.js';

export function installCircus({scene,camera,colliders,guideTo,rewardClaimed,rewardCompleted=()=>false,pause=()=>{},guideToPoint=()=>{},getSeats=()=>[],getLounge=()=>null}){
 const root=new T.Group();root.name='Crown Circus Tent';root.position.set(39,0,-62);scene.add(root);
 const material=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.75,...extra});
 const red=material('#ae2442',{side:T.DoubleSide}),cream=material('#fff0cf',{side:T.DoubleSide}),gold=material('#e5b553',{metalness:.55}),navy=material('#182947'),skin=material('#ba7957'),pink=material('#ec6fbd'),floor=material('#bd966a');
 function part(geometry,mat,x,y,z,parent=root){const m=new T.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 const box=(x,y,z,w,h,d,mat)=>part(new T.BoxGeometry(w,h,d),mat,x,y,z);
 const ball=(x,y,z,r,mat,parent=root)=>part(new T.SphereGeometry(r,12,8),mat,x,y,z,parent);
 part(new T.CylinderGeometry(9,9,.14,48),floor,0,.1,0);
 box(0,.08,10.3,4,.12,4.5,cream);
 for(let i=0;i<24;i++){
  const a=i*Math.PI/12,mat=i%2?cream:red;
  part(new T.ConeGeometry(9,7,2,1,true,a,Math.PI/12),mat,0,7.9,0);
  if(i!==0&&i!==23)part(new T.CylinderGeometry(9,9,4.4,2,1,true,a,Math.PI/12),mat,0,2.3,0);
 }
 for(let i=2;i<47;i++){const a=i*Math.PI/24;colliders.push({x:39+Math.sin(a)*9,z:-62+Math.cos(a)*9,r:.55});}
 for(let i=0;i<12;i++){const a=(i+.5)*Math.PI/6;part(new T.CylinderGeometry(.075,.075,4.4,8),gold,Math.sin(a)*9,2.3,Math.cos(a)*9);}
 part(new T.CylinderGeometry(.08,.08,2,8),gold,0,11.9,0);box(.65,12.3,0,1.3,.65,.07,red);ball(0,12.95,0,.16,gold);
 const c=document.createElement('canvas');c.width=768;c.height=192;const ctx=c.getContext('2d');ctx.fillStyle='#182947';ctx.fillRect(0,0,768,192);ctx.fillStyle='#ffe2a0';ctx.textAlign='center';ctx.font='bold 60px serif';ctx.fillText('CROWN CIRCUS',384,83);ctx.font='30px sans-serif';ctx.fillText('JUGGLING · AERIAL HOOP · WONDER',384,145);
 const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;part(new T.PlaneGeometry(5.7,1.4),material('#ffffff',{map:texture,side:T.DoubleSide}),0,3.9,9.12);
 part(new T.CylinderGeometry(3.5,3.5,.1,48),red,0,.22,-2);
 const ring=part(new T.TorusGeometry(3.5,.09,8,48),gold,0,.3,-2);ring.rotation.x=Math.PI/2;
 for(const side of [-1,1])for(let i=0;i<3;i++){box(side*5.7,.55,-3+i*2,2.1,.4,1,navy);box(side*6.65,1,-3+i*2,.15,.7,1,red);colliders.push({x:39+side*5.7,z:-65+i*2,w:1.35,d:.8});}
 const performer=new T.Group();performer.name='Circus juggler';root.add(performer);performer.position.set(-1.4,.3,-2);
 part(new T.CylinderGeometry(.25,.34,.85,12),navy,0,1,0,performer);ball(0,1.7,0,.26,skin,performer);
 for(const s of [-1,1]){part(new T.CylinderGeometry(.09,.09,.65,8),navy,s*.16,.35,0,performer);ball(s*.44,1.05,.1,.12,skin,performer);}
 const balls=[gold,pink,cream].map(m=>ball(0,0,0,.13,m,performer));
 const aerial=new T.Group();aerial.name='Circus aerial hoop';aerial.position.set(1.6,4.3,-2.5);root.add(aerial);
 part(new T.TorusGeometry(.95,.055,8,40),gold,0,0,0,aerial);part(new T.CylinderGeometry(.025,.025,4,6),gold,1.6,7.25,-2.5);
 part(new T.CylinderGeometry(.19,.23,.7,10),pink,0,-.25,0,aerial);ball(0,.34,0,.22,skin,aerial);
 for(const s of [-1,1]){const arm=part(new T.CylinderGeometry(.065,.065,.68,8),skin,s*.36,.1,0,aerial);arm.rotation.z=-s*.9;const leg=part(new T.CylinderGeometry(.08,.08,.65,8),pink,s*.24,-.78,0,aerial);leg.rotation.z=s*.55;}
 const light=new T.PointLight('#ffda95',35,20,1.5);light.name='Circus performance light';light.position.set(-1.4,6,-1);root.add(light);
 const warm=new T.Color('#ffda95'),aerialColor=new T.Color('#b5caff');
 const style=document.createElement('link');style.rel='stylesheet';style.href='circus.css';document.head.append(style);
 const panel=document.createElement('section');panel.id='circusShow';panel.hidden=true;panel.setAttribute('aria-label','Circus performance');
 const title=document.createElement('span');title.id='circusAct';title.setAttribute('aria-live','polite');const stop=document.createElement('button');stop.id='circusStop';stop.textContent='Leave show';panel.append(title,stop);document.body.append(panel);
 const toggle=document.createElement('button');toggle.id='circusPause';toggle.textContent='Pause';
 const replay=document.createElement('button');replay.id='circusReplay';replay.textContent='Watch again';
 const reward=document.createElement('button');reward.id='circusReward';reward.textContent='Guide me to rewards';
 const time=document.createElement('small');time.id='circusTime';
 const progress=document.createElement('progress');progress.id='circusProgress';progress.max=36;progress.value=0;progress.setAttribute('aria-label','Circus show progress');
 panel.append(toggle,replay,reward,time,progress);
 let active=false,elapsed=0,completed=false,act=-1,manualPause=false,finished=false;
 function controls(){toggle.hidden=!active;replay.hidden=!finished;reward.hidden=!finished||rewardClaimed();time.hidden=!active;progress.hidden=!active;stop.textContent=finished?'Close':'Leave show';toggle.textContent=manualPause?'Resume':'Pause';toggle.setAttribute('aria-pressed',String(manualPause));}
 function leave(){active=false;finished=false;manualPause=false;elapsed=0;panel.hidden=true;controls();}
 function start(){if(!inside()||active)return false;active=true;finished=false;manualPause=false;elapsed=0;act=-1;panel.hidden=false;controls();return true;}
 toggle.onclick=()=>{if(active){manualPause=!manualPause;controls();}};
 replay.onclick=()=>{if(panel.hidden||!finished||program.open)return false;return start();};
 reward.onclick=()=>{if(panel.hidden||!finished||program.open||rewardClaimed())return;guideTo('circus');leave();};
 stop.onclick=leave;
 const inside=()=>Math.hypot(camera.position.x-39,camera.position.z+62)<8.3;
 const program=document.createElement('dialog');program.id='circusProgram';program.setAttribute('aria-labelledby','circusProgramTitle');const programTitle=document.createElement('h2');programTitle.id='circusProgramTitle';programTitle.textContent='Crown Circus · Show program';const introduction=document.createElement('p');introduction.textContent='A 36-second performance in three acts. Start when you are ready inside the tent; you can pause or replay the show.';const acts=document.createElement('ol');acts.id='circusProgramActs';for(const text of ['Golden juggling · A three-ball opening act.','Aerial hoop · A turning hoop routine above the ring.','Grand finale · Both performers join in, then take a bow.']){const item=document.createElement('li');item.textContent=text;acts.append(item);}program.append(programTitle,introduction,acts);
 function programButton(id,label,action){const b=document.createElement('button');b.id=id;b.textContent=label;b.onclick=()=>{if(!program.open||b.disabled)return false;return action();};program.append(b);return b;}
 const programStatus=document.createElement('p');programStatus.id='circusProgramStatus';programStatus.setAttribute('role','status');program.append(programStatus);
 const programReward=programButton('circusProgramReward','Find circus rewards',()=>{if(!program.open)return;pause();guideTo('circus');program.close();});
 const programWatch=programButton('circusProgramWatch','Start the show',()=>{if(start()){pause();program.close();}});
 const walk=p=>{pause();guideToPoint(p);program.close();};
 programButton('circusProgramEntrance','Walk to the circus entrance',()=>walk({x:39,z:-51,name:'Crown Circus entrance'}));
 const programSeat=programButton('circusProgramSeat','Find an audience bench',()=>{const seat=[...getSeats()].sort((a,b)=>Math.hypot(camera.position.x-a.approach.x,camera.position.z-a.approach.z)-Math.hypot(camera.position.x-b.approach.x,camera.position.z-b.approach.z))[0];if(seat)walk({...seat.approach,name:seat.name});});
 programButton('circusProgramPopcorn','Find the popcorn stand',()=>walk({x:34,z:-56.3,name:'Circus popcorn stand'}));
 const after=document.createElement('details');after.id='circusAfterShow';const afterTitle=document.createElement('summary');afterTitle.textContent='After the show';const loungeInfo=document.createElement('p');loungeInfo.id='circusLoungeInfo';const loungeButton=programButton('circusProgramLounge','Find the circus lounge',()=>{const lounge=getLounge();if(lounge)walk({x:lounge.x,z:lounge.z+1.3,name:lounge.name});});after.append(afterTitle,loungeInfo,loungeButton);program.append(after);
 const programHint=document.createElement('p');programHint.id='circusProgramHint';programHint.textContent='At a bench, choose Sit or press F, then choose Watch circus. Complete the performance to unlock its task reward at the circus station.';program.append(programHint);
 programButton('circusProgramClose','Back to the world',()=>{pause();program.close();});document.body.append(program);
 const programNav=document.createElement('button');programNav.id='circusProgramButton';programNav.textContent='Circus program';programNav.onclick=()=>{if(program.open)return;pause();const claimed=rewardClaimed(),ready=completed||rewardCompleted();programStatus.textContent=claimed?'Your 30-point circus task reward is collected. Enjoy another performance anytime.':ready?'Performance complete · Your 30-point task reward is ready at the circus rewards station.':'Watch the complete performance to unlock 30 task points at the circus rewards station.';programReward.textContent=ready&&!claimed?'Find my 30-point circus reward':'Find circus rewards';programWatch.disabled=!inside()||active;programWatch.textContent=active?'Show in progress':inside()?'Start the show':'Enter the tent to start';programSeat.disabled=!getSeats().length;const lounge=getLounge();after.open=false;after.hidden=!lounge;loungeButton.disabled=!lounge;if(lounge){loungeInfo.textContent=lounge.name+' · Virtual snack: '+lounge.snack+'. Souvenir: '+lounge.souvenir+'. Follow directions, then open the lounge menu to enjoy a snack or collect the keepsake.';loungeButton.textContent='Walk to '+lounge.name;}program.showModal();};document.querySelector('nav').append(programNav);
 return {
  get isOpen(){return program.open},near:()=>inside(),get active(){return active},get completed(){return completed},
  start,
  stop:leave,
  update(dt,paused){
   if((active||finished)&&!inside())leave();
   if(active&&!paused&&!manualPause){elapsed+=dt;if(elapsed>=36){elapsed=36;completed=true;active=false;finished=true;title.textContent=rewardClaimed()?'Bravo! Circus reward already collected.':'Bravo! Your 30-point reward is ready at the circus station.';controls();}}
   const next=Math.min(2,Math.floor(elapsed/12));if(active&&act!==next){act=next;title.textContent=['Crown Circus · Golden juggling','Crown Circus · Aerial hoop','Crown Circus · Grand finale'][act];}
   const t=active||finished?elapsed:0;
   if(active){progress.value=t;const label=(manualPause||paused?'Paused · ':'')+'Act '+(next+1)+' / 3 · '+Math.ceil(36-t)+'s left';if(time.textContent!==label)time.textContent=label;}
   // Each solo has its own clock; both performers join the finale, then hold a bow.
   const juggling=Math.min(t,12)+Math.max(0,Math.min(t,32)-24),flying=Math.max(0,Math.min(t,32)-12);
   const bow=Math.min(1,Math.max(0,(t-32)/2));performer.rotation.x=bow*.38;
   balls.forEach((b,i)=>{const a=juggling*3.7+i*Math.PI*2/3;b.position.set(Math.sin(a)*.65,1.55+Math.max(0,Math.cos(a))*1.4,.15);b.visible=bow<1;});
   aerial.rotation.y=flying*.6;aerial.rotation.z=Math.sin(flying*.8)*.12*(1-bow);aerial.rotation.x=-bow*.18;
   const fade=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);};
   const aerialFocus=fade((t-11)/2)*(1-fade((t-23)/2));
   light.color.copy(warm).lerp(aerialColor,aerialFocus);light.position.x=-1.4+3*aerialFocus;light.position.y=6+aerialFocus;
  }
 };
}
