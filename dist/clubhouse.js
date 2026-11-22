import * as T from './vendor/three.module.js';
export function installClubhouse({scene,camera,colliders,pause,rewards,getCurrentSeat=()=>null,getNearbyPlaces=()=>[],getManagedPlaces=()=>[]}){
 const root=new T.Group();root.name='Krownlandia Clubhouse · giant tree';scene.add(root);
 const mat=(color,extra={})=>new T.MeshStandardMaterial({color,roughness:.9,...extra}),bark=mat('#61452e'),ridge=mat('#493222'),wood=mat('#b28a58'),gold=mat('#cbaa66',{metalness:.3}),green=mat('#365a3b'),cushion=mat('#59766a');
 const mesh=(geometry,material,x,y,z)=>{const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;root.add(m);return m;};
 const box=(x,y,z,w,h,d,m)=>mesh(new T.BoxGeometry(w,h,d),m,x,y,z);
 // Level entry, a hollow trunk, and a wide south doorway keep the room walkable.
 const floor=mesh(new T.CylinderGeometry(8,8,.14,48),wood,-30,.08,151);floor.name='Clubhouse meeting-room floor';
 box(-30,.07,161,4,.12,8,wood);box(-15,.065,162,30,.12,3,wood);
 for(let i=0;i<32;i++){const a=i*Math.PI/16;if(Math.cos(a)>.94)continue;const x=-30+Math.sin(a)*7.6,z=151+Math.cos(a)*7.6;
  const wall=box(x,3.15,z,1.65,6.3,1,bark);wall.rotation.y=a;colliders.push({x,z,r:1});
  const rib=mesh(new T.CylinderGeometry(.12,.2,6.4,7),ridge,-30+Math.sin(a)*8.12,3.2,151+Math.cos(a)*8.12);rib.name='Clubhouse bark ridge';
 }
 mesh(new T.CylinderGeometry(6.9,8.05,.45,40),wood,-30,6.45,151);
 mesh(new T.CylinderGeometry(4.2,7.7,5.3,32),bark,-30,9.25,151);
 for(let i=0;i<7;i++){const a=i*Math.PI*2/7;const branch=mesh(new T.CylinderGeometry(.5,1,7,9),bark,-30+Math.sin(a)*4,10.7,151+Math.cos(a)*4);branch.rotation.z=Math.sin(a)*-.65;branch.rotation.x=Math.cos(a)*.65;const crown=mesh(new T.IcosahedronGeometry(5.6,2),green,-30+Math.sin(a)*4.2,14.3+(i%3)*.8,151+Math.cos(a)*4.2);crown.scale.y=.62;}
 for(const x of [-32.4,-27.6]){mesh(new T.CylinderGeometry(.28,.4,4,12),gold,x,2,158.4);}
 function sign(text,x,y,z,w,h){const canvas=document.createElement('canvas');canvas.width=Math.round(w*160);canvas.height=Math.round(h*160);const c=canvas.getContext('2d');c.fillStyle='#203e32';c.fillRect(0,0,canvas.width,canvas.height);c.fillStyle='#ffe8af';c.textAlign='center';c.textBaseline='middle';let size=Math.round(canvas.height*.48);c.font=size+'px Georgia';const width=c.measureText(text).width;if(width>canvas.width*.92){size=Math.floor(size*canvas.width*.92/width);c.font=size+'px Georgia';}c.fillText(text,canvas.width/2,canvas.height/2);const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;return mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:texture,side:T.DoubleSide,emissive:'#ffffff',emissiveMap:texture,emissiveIntensity:.15}),x,y,z);}
 sign('KROWNLANDIA CLUBHOUSE',-30,4.2,159,6.7,.9);sign('A gathering place for Place Managers',-30,3.45,159,5.6,.45);
 const table=mesh(new T.CylinderGeometry(1.8,1.8,.2,32),wood,-30,1.05,152);table.name='Clubhouse round meeting table';mesh(new T.CylinderGeometry(.35,.55,1,16),bark,-30,.5,152);colliders.push({x:-30,z:152,r:2.1});
 const seats=[];for(const [x,z,yaw,ax,az] of [[-33.5,152,-Math.PI/2,-34.7,152],[-26.5,152,Math.PI/2,-25.3,152],[-30,155.5,0,-31.4,155.5],[-30,148.5,Math.PI,-31.4,148.5]]){const chair=new T.Group();chair.position.set(x,0,z);chair.rotation.y=yaw;root.add(chair);for(const [g,m,y,dz] of [[new T.BoxGeometry(1,.18,1),cushion,.65,0],[new T.BoxGeometry(1,1,.14),wood,1.15,.5],[new T.BoxGeometry(.8,.6,.8),bark,.3,0]]){const o=new T.Mesh(g,m);o.position.set(0,y,dz);o.castShadow=true;chair.add(o);}colliders.push({x,z,r:.7});seats.push({name:'Clubhouse meeting chair',x,z,y:1.5,yaw,approach:{x:ax,z:az},kind:'clubhouse'});}
 box(-30,1.5,145.3,4,2.5,.18,wood);colliders.push({x:-30,z:145.3,w:2.2,d:.4});sign('PLACE MANAGERS BOARD',-30,2.1,145.42,3.7,.6);sign('Welcome · Care · Create',-30,1.4,145.43,3.4,.5);
 const glow=mat('#ffe5a0',{emissive:'#ffc16b',emissiveIntensity:.6});mesh(new T.SphereGeometry(.35,12,8),glow,-30,5,151);const light=new T.PointLight('#ffdfae',28,17,2);light.position.set(-30,4.8,151);root.add(light);
 const boardPoint={x:-30,z:147,name:'Krownlandia Clubhouse Place Managers board'},near=()=>Math.hypot(camera.position.x-boardPoint.x,camera.position.z-boardPoint.z)<1.6;
 const canRead=()=>near()||seats.includes(getCurrentSeat());
 const dialog=document.createElement('dialog');dialog.id='clubhouseMenu';dialog.setAttribute('aria-labelledby','clubhouseTitle');const title=document.createElement('h2');title.id='clubhouseTitle';title.textContent='Krownlandia Clubhouse';const intro=document.createElement('p');intro.textContent='The original community list describes a clubhouse for Place Managers inside a giant tree. This meeting room, its Eldergrove-area location and the activities below are our prototype interpretation. Everyone can visit; this board does not assign roles or publish messages.';const story=document.createElement('p');story.id='clubhouseStory';story.setAttribute('role','status');const status=document.createElement('p');status.id='clubhouseStatus';const actions=document.createElement('div');const topics=[['welcome','Welcome visitors','Help people find a place to begin, explain its activities, and make room for newcomers.'],['care','Care for a place','Keep entrances and paths clear, provide comfortable rest areas, and look after the character of the place.'],['create','Create together','Build on community ideas, preserve contributor credits, and invite others to imagine what could come next.']];for(const [id,label,text]of topics){const b=document.createElement('button');b.id='clubhouseTopic-'+id;b.textContent=label;b.onclick=()=>{if(!canRead()||!dialog.open)return;story.textContent=text;rewards.completeClubhouse();refresh();};actions.append(b);}const reward=document.createElement('button');reward.id='clubhouseRewards';reward.textContent='Find clubhouse rewards';reward.onclick=()=>{if(reward.disabled||!canRead()||!dialog.open)return;pause();rewards.guideTo('clubhouse');dialog.close();};const close=document.createElement('button');close.id='clubhouseClose';close.textContent='Return to the clubhouse';close.onclick=()=>dialog.close();dialog.append(title,intro,actions,story,status,reward,close);document.body.append(dialog);const css=document.createElement('link');css.rel='stylesheet';css.href='clubhouse.css';document.head.append(css);
 function refresh(){const st=rewards.state();reward.textContent=st.claims.includes('clubhouse:task')?'Revisit clubhouse rewards · task claimed':st.done.includes('clubhouse-board')?'Find my 20-point clubhouse reward':'Find clubhouse rewards';status.textContent=st.claims.includes('clubhouse:task')?'Your clubhouse task reward is collected.':st.done.includes('clubhouse-board')?'Board explored · 20 task points are ready at the clubhouse rewards station.':'Explore one topic to unlock 20 task points.';if(!st.saved)status.textContent+=' Progress lasts for this visit only.';}
 const nearby=document.createElement('details');nearby.id='clubhouseNearby';const nearbyTitle=document.createElement('summary');nearbyTitle.textContent='Explore nearby';const nearbyList=document.createElement('div');nearby.append(nearbyTitle,nearbyList);dialog.replaceChildren(title,intro,actions,story,status,reward,nearby,close);
 const managed=document.createElement('details');managed.id='clubhouseManaged';const managedTitle=document.createElement('summary');managedTitle.textContent='Places & their managers';const managedList=document.createElement('div');managed.append(managedTitle,managedList);
 const game=document.createElement('details');game.id='clubCrossing';
 const summary=document.createElement('summary');summary.textContent='Game Club · Crossing stones';
 const rules=document.createElement('p');rules.textContent='Trade ends of the path: suns travel right, moons travel left. Select a stone to slide one space or jump over one stone into the gap. Undo any move.';
 const credit=document.createElement('small');credit.textContent='Game Club · @laloreto, page 10. This solo puzzle and its Clubhouse location are prototype additions.';
 const path=document.createElement('div');path.className='crossing-path';path.setAttribute('role','group');path.setAttribute('aria-label','Five spaces, left to right');
 const message=document.createElement('p');message.id='crossingStatus';message.setAttribute('role','status');
 const undo=document.createElement('button'),restart=document.createElement('button');undo.id='crossingUndo';undo.textContent='Undo move';restart.textContent='Start over';restart.id='crossingReset';
 let stones='SS.MM',history=[];const cells=[],active=()=>game.open&&dialog.open&&canRead();
 function legal(i){const delta=stones.indexOf('.')-i;return stones[i]==='S'?(delta===1||delta===2):stones[i]==='M'&&(delta===-1||delta===-2);}
 function draw(note=''){
  cells.forEach((b,i)=>{const kind=stones[i],label={S:'Sun →',M:'← Moon','.':'Gap'}[kind];b.textContent=label;b.dataset.kind=kind;b.setAttribute('aria-label','Space '+(i+1)+': '+({S:'sun moving right',M:'moon moving left','.':'empty'}[kind]));b.setAttribute('aria-disabled',String(!legal(i)));});
  undo.disabled=history.length===0;restart.disabled=history.length===0;
  const moves=cells.flatMap((_,i)=>legal(i)?[i+1]:[]);
  message.textContent=(note?note+' ':'')+(stones==='MM.SS'?'Crossing complete! Both pairs traded ends in '+history.length+' moves.':moves.length?'Available spaces to move from: '+moves.join(', ')+'.':'No moves left. Undo a move or start over.');
 }
 for(let i=0;i<5;i++){const b=document.createElement('button');b.id='crossingCell'+i;b.onclick=()=>{if(!active()||!legal(i))return;const gap=stones.indexOf('.'),next=stones.split('');history.push(stones);next[gap]=next[i];next[i]='.';stones=next.join('');draw('Moved '+(i+1)+' to '+(gap+1)+'.');};cells.push(b);path.append(b);}
 undo.onclick=()=>{if(!active()||!history.length)return;stones=history.pop();draw('Move undone.');if(!history.length)cells[1].focus();};
 function resetGame(){stones='SS.MM';history=[];draw();}
 restart.onclick=()=>{if(!active()||restart.disabled)return;resetGame();cells[1].focus();};
 game.append(summary,rules,path,message,undo,restart,credit);
 const sewing=document.createElement('details');sewing.id='clubSewing';
 const sewingTitle=document.createElement('summary');sewingTitle.textContent='Sewing Club · Stitch sampler';
 const sewingCredit=document.createElement('small');sewingCredit.textContent='Sewing Club · @lisachandler, page 16. The sampler and its Clubhouse placement are prototype choices.';
 const pattern=['Short','Long','Short','Short','Long','Short'];
 const sewingRules=document.createElement('p');sewingRules.textContent='Follow the practice pattern: '+pattern.join(', ')+'. Pick a stitch length at each step.';
 const sewingStatus=document.createElement('p');sewingStatus.id='sewingStatus';sewingStatus.setAttribute('role','status');
 const short=document.createElement('button'),long=document.createElement('button'),unpick=document.createElement('button'),clear=document.createElement('button');
 short.id='sewingShort';short.textContent='Short stitch';long.id='sewingLong';long.textContent='Long stitch';
 unpick.id='sewingUndo';unpick.textContent='Undo stitch';clear.id='sewingReset';clear.textContent='Start sampler over';
 let stitched=0;
 function drawSewing(note=''){
  const finished=stitched===pattern.length;
  for(const button of [short,long])button.setAttribute('aria-disabled',String(finished));
  for(const button of [unpick,clear])button.setAttribute('aria-disabled',String(stitched===0));
  const made=stitched?' Your stitches: '+pattern.slice(0,stitched).join(', ')+'.':'';
  sewingStatus.textContent=(note?note+' ':'')+(finished?'Sampler complete.':'Stitch '+(stitched+1)+' of '+pattern.length+': '+pattern[stitched].toLowerCase()+'.')+made;
 }
 const sewingActive=()=>sewing.open&&dialog.open&&canRead();
 function addStitch(length){if(!sewingActive()||stitched===pattern.length)return;if(pattern[stitched]!==length){drawSewing('That stitch does not match.');return;}stitched++;drawSewing();}
 short.onclick=()=>addStitch('Short');long.onclick=()=>addStitch('Long');
 unpick.onclick=()=>{if(sewingActive()&&stitched){stitched--;drawSewing('Last stitch removed.');}};
 clear.onclick=()=>{if(sewingActive()&&stitched){stitched=0;drawSewing();short.focus();}};
 sewing.append(sewingTitle,sewingRules,short,long,sewingStatus,unpick,clear,sewingCredit);
 dialog.replaceChildren(title,intro,actions,story,status,reward,game,sewing,nearby,managed,close);
 let managedRevision=0;
 function refreshManaged(){const revision=++managedRevision;managed.open=false;managedList.replaceChildren();for(const point of getManagedPlaces()){const row=document.createElement('p'),label=document.createElement('span'),button=document.createElement('button');label.textContent=point.name+' · Place manager: '+point.manager;button.id='clubhouseManaged-'+point.id;button.textContent='Walk to '+point.name;button.onclick=()=>{if(button.disabled||revision!==managedRevision||!canRead()||!dialog.open)return;pause();rewards.guideToPoint({x:point.x,z:point.z,name:point.name});dialog.close();};row.append(label,button);managedList.append(row);}managed.hidden=managedList.children.length===0;}
 let nearbyRevision=0;
 function refreshNearby(){const revision=++nearbyRevision;nearby.open=false;nearbyList.replaceChildren();for(const point of getNearbyPlaces()){const button=document.createElement('button');button.id='clubhouseWalk-'+point.id;button.textContent='Walk to '+point.name;button.onclick=()=>{if(button.disabled||revision!==nearbyRevision||!canRead()||!dialog.open)return;pause();rewards.guideToPoint({x:point.x,z:point.z,name:point.name});dialog.close();};nearbyList.append(button);}nearby.hidden=nearbyList.children.length===0;}
 return {seats,boardPoint,get near(){return near()},get isOpen(){return dialog.open},open(){if(!canRead()||dialog.open)return false;pause();story.textContent='Choose a topic to explore the spirit of caring for a community place.';refresh();refreshNearby();refreshManaged();game.open=false;resetGame();sewing.open=false;stitched=0;drawSewing();dialog.showModal();return true;}};
}
