import * as T from './vendor/three.module.js';
// Add only owner-confirmed events. Keep the production calendar empty until then.
const CONFIRMED_EVENTS=[];
export function installEventCalendar({pause,rewards,events=CONFIRMED_EVENTS,clock=()=>Date.now()}){
 const venues={square:{x:-7.5,z:50,name:'Town Square stage'},library:{x:30,z:40,name:'Library of Alexandria reading desk'},clubhouse:{x:-30,z:147,name:'Krownlandia Clubhouse Place Managers board'}};
 const anytime=[{id:'circus',name:'Crown Circus',point:{x:39,z:-51,name:'Crown Circus entrance'},description:'Enter the tent and choose Watch the circus show.'},{id:'safari',name:'Krownlandia Safari',point:{x:47,z:-26,name:'Safari boarding area'},description:'Approach the jeep and choose Board the safari.'},{id:'journey',name:'The Great Journey',point:{x:-30,z:-34,name:'The Great Journey boarding area'},description:'At the boarding area, choose Board The Great Journey.'}];
 const explicitTime=value=>typeof value==='string'&&/T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value)&&Number.isFinite(Date.parse(value));
 const valid=events.filter(e=>e&&typeof e.id==='string'&&/^[a-z0-9-]+$/.test(e.id)&&typeof e.title==='string'&&e.title.trim()&&typeof e.description==='string'&&Object.hasOwn(venues,e.venue)&&['confirmed','canceled','postponed'].includes(e.status)&&explicitTime(e.start)&&explicitTime(e.end)&&Date.parse(e.end)>Date.parse(e.start));
 const dates=new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'});
 const dialog=document.createElement('dialog');dialog.id='eventCalendar';dialog.setAttribute('aria-labelledby','eventCalendarTitle');
 const title=document.createElement('h2');title.id='eventCalendarTitle';title.textContent='What’s happening';
 const intro=document.createElement('p');intro.textContent='Event times are shown in Pacific Time. Status follows the published schedule, not a live attendance feed. Other visitors are not yet visible in this prototype.';
 const list=document.createElement('div');list.id='eventCalendarList';const updated=document.createElement('p');updated.id='eventCalendarUpdated';
 const activities=document.createElement('details');activities.id='eventCalendarAnytime';const summary=document.createElement('summary');summary.textContent='Available anytime · rides and performances';activities.append(summary);
 let revision=0,lastMinute=null,lastStatus='',directions=[];
 const statusKey=now=>JSON.stringify(valid.filter(e=>Date.parse(e.end)>now).map(e=>[e.id,e.status,e.status==='confirmed'&&Date.parse(e.start)<=now]));
 function direction(label,id,point,enabled=()=>true){const b=document.createElement('button');b.id=id;b.textContent=label;const version=revision;directions.push({id,button:b});b.onclick=()=>{if(!dialog.open||b.disabled||version!==revision||!enabled())return;pause();rewards.guideToPoint({...point});dialog.close();};return b;}
 function render(){const focused=directions.find(d=>d.button===document.activeElement)?.id;directions=[];revision++;const now=clock();lastMinute=Math.floor(now/60000);lastStatus=statusKey(now);list.replaceChildren();updated.textContent='As of: '+dates.format(now);const upcoming=valid.filter(e=>Date.parse(e.end)>now).sort((a,b)=>Date.parse(a.start)-Date.parse(b.start)||a.id.localeCompare(b.id));
  if(!upcoming.length){const empty=document.createElement('p');empty.id='eventCalendarEmpty';empty.textContent='No confirmed upcoming events are scheduled yet. Check back for announcements, or explore the anytime activities below.';list.append(empty);}
  for(const e of upcoming){const card=document.createElement('article'),heading=document.createElement('h3'),status=document.createElement('p'),time=document.createElement('p'),description=document.createElement('p');heading.textContent=e.title;status.id='eventStatus-'+e.id;status.textContent=e.status==='canceled'?'Canceled':e.status==='postponed'?'Postponed · new time not announced':Date.parse(e.start)<=now?'Scheduled now':'Upcoming';time.textContent=(e.status==='confirmed'?'':'Previously scheduled: ')+dates.format(Date.parse(e.start))+' – '+dates.format(Date.parse(e.end));description.textContent=e.description;const location=document.createElement('p');location.textContent='Location: '+venues[e.venue].name;card.append(heading,status,time,location,description);if(e.status==='confirmed')card.append(direction('Walk to '+venues[e.venue].name,'eventGo-'+e.id,venues[e.venue],()=>Date.parse(e.end)>clock()));list.append(card);}
  activities.replaceChildren(summary);for(const a of anytime){const p=document.createElement('p');p.textContent=a.description;activities.append(direction('Walk to '+a.name,'eventAnytime-'+a.id,a.point),p);}
  if(focused)(directions.find(d=>d.id===focused)?.button||refresh).focus();
 }
 const refresh=document.createElement('button');refresh.id='eventCalendarRefresh';refresh.textContent='Refresh event status';refresh.onclick=()=>{if(dialog.open)render();};
 const close=document.createElement('button');close.id='eventCalendarClose';close.textContent='Back to the world';close.onclick=()=>{if(dialog.open){pause();dialog.close();}};
 dialog.append(title,intro,updated,list,activities,refresh,close);document.body.append(dialog);const css=document.createElement('link');css.rel='stylesheet';css.href='events.css';document.head.append(css);
 function open(){pause();if(!dialog.open)activities.open=false;render();if(!dialog.open)dialog.showModal();}
 const nav=document.createElement('button');nav.id='eventsButton';nav.textContent='What’s happening';nav.onclick=open;document.querySelector('nav').append(nav);
 return {open,update(){if(!dialog.open)return;const now=clock();if(Math.floor(now/60000)===lastMinute)return;if(statusKey(now)!==lastStatus)render();else{lastMinute=Math.floor(now/60000);updated.textContent='As of: '+dates.format(now);}},get isOpen(){return !!dialog.open}};
}
export function installTownSquare({scene,camera,colliders,pause,rewards,getCurrentSeat=()=>null}){
 const calendar=installEventCalendar({pause,rewards});
 const portals=installCommunityPortals({scene,camera,colliders,pause,rewards});
 const root=new T.Group();root.name='Krownlandia Town Square';scene.add(root);
 const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.72}),stone=mat('#e7d9b9'),navy=mat('#254668'),gold=mat('#dcb55d'),wood=mat('#80583e'),leaf=mat('#46744b'),pink=mat('#d587a1');
 const add=(geo,m,x,y,z)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;root.add(o);return o;};
 const box=(x,y,z,w,h,d,m,solid=false)=>{const o=add(new T.BoxGeometry(w,h,d),m,x,y,z);if(solid)colliders.push({x,z,w:w/2+.3,d:d/2+.3});return o;};
 box(0,.09,50,23,.16,20,stone);for(const x of [-11,11])box(x,.19,50,.2,.1,20,gold);for(const z of [40,60])box(0,.19,z,22,.1,.2,gold);
 // A broad central aisle preserves the existing walking and tram route.
 for(const x of [-2.5,2.5])box(x,.19,50,.15,.08,20,navy);
 box(-8,.18,50,6,.25,5,wood);box(-11,1.9,50,.18,3.5,5,navy,true);box(-8,3.7,50,6.3,.18,5.4,navy);
 for(const z of [47.5,52.5]){box(-5.2,1.9,z,.14,3.7,.14,gold,true);box(-10.8,1.9,z,.14,3.7,.14,gold,true);}
 function sign(lines,x,y,z,w,h,rotation=0){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=384;const c=canvas.getContext('2d');c.fillStyle='#254668';c.fillRect(0,0,1024,384);c.fillStyle='#fff0c7';c.textAlign='center';lines.forEach((line,i)=>{c.font=(i===0?'bold 48px':'32px')+' Georgia';c.fillText(line,512,95+i*100);});const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const o=add(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:texture,side:T.DoubleSide}),x,y,z);o.rotation.y=rotation;}
 sign(['KROWNLANDIA TOWN SQUARE','A place to gather and imagine','Community idea: @lisachandler'],-10.87,2.5,50,4.7,1.75,Math.PI/2);
 box(-9.7,.7,50,.5,1.2,.8,wood,true);box(-9.6,1.4,50,.65,.13,1,stone); // Stage lectern.
 const glow=new T.MeshStandardMaterial({color:'#ffe1a0',emissive:'#ffc575',emissiveIntensity:.15});for(let i=0;i<5;i++)add(new T.SphereGeometry(.12,10,7),glow,-5.05,3.5,48+i);const light=new T.PointLight('#ffe0a0',0,13,1.5);light.position.set(-7,3.3,50);root.add(light);let lit=false;
 const seats=[];function bench(name,x,z,side){box(x,.62,z,side?.9:3,.2,side?3:.9,wood,true);box(x+(side?.4:0),1.08,z+(side?0:.4),side?.12:3,.8,side?3:.12,navy);seats.push({name,x,z,y:1.45,yaw:side?Math.PI/2:0,approach:{x:x+(side?-1.25:0),z:z+(side?0:-1.25)},kind:'square'});}
 bench('Town Square stage bench',-3.8,46.5,true);bench('Town Square stage bench',-3.8,54,true);bench('Town Square garden bench',8,52,true);bench('Town Square arrival bench',5,59,false);
 for(const [x,z] of [[-10,42],[10,42],[-10,59],[10,59]]){box(x,.35,z,1.1,.65,1.1,navy,true);add(new T.CylinderGeometry(.1,.14,2.5,10),wood,x,1.6,z);add(new T.SphereGeometry(.85,12,8),leaf,x,3,z);for(let i=0;i<5;i++)add(new T.SphereGeometry(.13,7,5),pink,x+Math.sin(i)*.38,.85,z+Math.cos(i)*.38);}
 box(8,1.5,45,.13,2.8,.13,gold,true);box(8,2.1,45,3.4,1.8,.16,navy,true);sign(['COMMUNITY BOARD','Welcome · Discover · Gather','Read the Town Square story'],8,2.1,45.12,3.2,1.4);
 const boardPoint={x:8,z:47,name:'Town Square community board'},stagePoint={x:-7.5,z:50,name:'Town Square stage'};
 const near=()=>Math.hypot(camera.position.x-boardPoint.x,camera.position.z-boardPoint.z)<1.8;
 const canRead=()=>near()||seats.includes(getCurrentSeat());
 const dialog=document.createElement('dialog');dialog.id='townSquareMenu';dialog.setAttribute('aria-labelledby','townSquareTitle');const title=document.createElement('h2');title.id='townSquareTitle';title.textContent='Krownlandia Town Square';const intro=document.createElement('p');intro.textContent='A gathering place from the original community places list, contributed by @lisachandler. Rest by the stage, explore nearby places, and imagine what you would bring to a community gathering.';const story=document.createElement('p');story.id='townSquareStory';story.hidden=true;story.textContent='Krownlandia began in the KROWN DAC and Token community in January 2020. Members imagined an ideal town together, contributing places, homes and activities. Town Square was a place for meeting townspeople and celebrating together. This square carries that community idea into the current 3D prototype.';
 const status=document.createElement('p');status.id='townSquareStatus';status.setAttribute('role','status');const actions=document.createElement('div');actions.id='townSquareActions';
 let actionTarget=actions;
 const button=(id,text,fn)=>{const b=document.createElement('button');b.id=id;b.textContent=text;b.onclick=fn;actionTarget.append(b);return b;};
 const welcome=button('squareWelcome','Read our community welcome',()=>{if(welcome.disabled||!canRead()||!dialog.open)return;setStoryVisible(story.hidden);if(!story.hidden){rewards.completeSquareWelcome();updateStatus();}});welcome.setAttribute('aria-controls','townSquareStory');
 function setStoryVisible(visible){story.hidden=!visible;welcome.textContent=visible?'Hide community welcome':'Read our community welcome';welcome.setAttribute('aria-expanded',String(visible));}setStoryVisible(false);
 button('squareEvents','What’s happening · event calendar',()=>{if(!canRead()||!dialog.open)return;dialog.close();calendar.open();});
 const lights=button('squareLights','Light the stage',()=>{if(!canRead()||!dialog.open)return;lit=!lit;light.intensity=lit?28:0;glow.emissiveIntensity=lit?2:.15;lights.textContent=lit?'Turn stage lights off':'Light the stage';lights.setAttribute('aria-pressed',String(lit));});lights.setAttribute('aria-pressed','false');
 const directions=document.createElement('details');directions.id='squareDirections';const directionsTitle=document.createElement('summary');directionsTitle.textContent='Walking directions & rewards';const directionActions=document.createElement('div');directionActions.id='squareDirectionActions';directions.append(directionsTitle,directionActions);actionTarget=directionActions;
 const guide=p=>{if(!canRead()||!dialog.open)return;pause();rewards.guideToPoint(p);dialog.close();};button('squareStage','Walk to the stage',()=>guide(stagePoint));button('squareOffice','Visit Community Office Garden',()=>guide({x:14.7,z:-13.7,name:'Community Office Garden project board'}));button('squareHistory','Visit the history garden',()=>guide({x:-26,z:30,name:'Making of Krownlandia exhibit'}));button('squareTram','Walk to the village tram',()=>guide({x:2.2,z:36,name:'Park entrance tram stop'}));button('squareRewards','Find Town Square rewards',()=>{if(!canRead()||!dialog.open)return;pause();rewards.guideTo('square');dialog.close();});
 const stageBench=seats[0];const rest=button('squareRest','Walk to a stage-view bench',()=>{if(rest.disabled)return;guide({...stageBench.approach,name:stageBench.name});});
 for(const p of portals.places)button('square-'+p.id,'Walk to '+p.name,()=>guide(p));
 const close=document.createElement('button');close.id='townSquareClose';close.textContent='Return to the square';close.onclick=()=>{pause();dialog.close();};dialog.append(title,intro,story,status,actions,directions,close);document.body.append(dialog);const css=document.createElement('link');css.rel='stylesheet';css.href='town-square.css';document.head.append(css);
 function updateStatus(){const s=rewards.state();status.textContent=s.claims.includes('square:task')?'Welcome reward collected. Enjoy the square.':s.done.includes('square-welcome')?'Welcome explored · 20 task points are ready at the Town Square rewards station.':'Read the community welcome to unlock 20 task points.';if(!s.saved)status.textContent+=' Progress is available for this visit; browser storage is unavailable.';}
 function open(){if(portals.near)return portals.open();if(!canRead()||dialog.open)return false;pause();directions.open=false;setStoryVisible(false);updateStatus();dialog.showModal();return true;}
 return {open,seats,boardPoint,stagePoint,portalPlaces:portals.places,update:calendar.update,get interactLabel(){return portals.near?.name||'Town Square community board'},get near(){return near()||!!portals.near},get isOpen(){return dialog.open||calendar.isOpen||portals.isOpen},get lightsOn(){return lit}};
}

// New places requested by Lisa; managerial credit is not an original-document attribution.
export function installCommunityPortals({scene,camera,colliders,pause,rewards}){
 const places=[
  {id:'living-sim',name:'Living Sim Portal',x:-20,z:46,kind:'Community portal',keywords:'maxigram living simulation external',detail:'Place manager: @maxigram · Opens an external site',url:'https://xeroemoji.grok.me/',action:'Visit Living Sim',description:'A doorway to the Living Sim. Choose the link below to visit its separate website in a new tab.',color:'#77cfc0'},
  {id:'emoji-house',name:'Emoji House',x:-20,z:56,kind:'Community pavilion',keywords:'maxigram emoji sticker signal art pack',detail:'Place manager: @maxigram · Preferred sticker collection',url:'https://signal.art/addstickers/#pack_id=36a2965e47352588ba3a683119dec0d0&pack_key=4e1a9fe28a3e055d8a7035fecfb76c581ab1b967ae3beff262dafbf7bddc1a68',action:'View the Signal sticker pack',description:'Home of Krownlandia’s preferred emoji and sticker collection. View or add the pack through Signal. Individual artwork is not yet displayed in Krownlandia.',color:'#e7b4d9'}
 ];
 const root=new T.Group();root.name='Community portals · @maxigram';scene.add(root);
 for(const p of places){
  const stone=new T.MeshStandardMaterial({color:'#233e50',roughness:.8}),accent=new T.MeshStandardMaterial({color:p.color,roughness:.6,emissive:p.color,emissiveIntensity:.18});
  const box=(x,y,z,w,h,d,m,solid=false)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;root.add(o);if(solid)colliders.push({x,z,w:w/2+.3,d:d/2+.3});};
  box(p.x,.1,p.z-1,6,.18,5,stone);
  for(const dx of [-2.3,2.3])box(p.x+dx,1.8,p.z-1,.35,3.6,.45,accent,true);
  box(p.x,3.6,p.z-1,5, .4,.65,accent);box(p.x,4,p.z-1,5.8,.15,3,stone);
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;const c=canvas.getContext('2d');c.fillStyle='#233e50';c.fillRect(0,0,1024,256);c.fillStyle='#fff4dc';c.textAlign='center';c.font='bold 64px Georgia';c.fillText(p.name,512,95);c.font='36px sans-serif';c.fillText('Place manager: @maxigram',512,175);const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
  const sign=new T.Mesh(new T.PlaneGeometry(4.4,1.1),new T.MeshStandardMaterial({map:texture,side:T.DoubleSide}));sign.position.set(p.x,2.65,p.z-1);root.add(sign);
 }
 const near=()=>places.find(p=>Math.hypot(camera.position.x-p.x,camera.position.z-p.z)<1.8);
 const dialog=document.createElement('dialog');dialog.id='communityPortal';dialog.setAttribute('aria-labelledby','communityPortalTitle');
 const title=document.createElement('h2');title.id='communityPortalTitle';const manager=document.createElement('p');manager.textContent='Place manager: @maxigram';const description=document.createElement('p');const link=document.createElement('a');link.id='communityPortalLink';link.target='_blank';link.rel='noopener noreferrer';const notice=document.createElement('p');notice.textContent='Opens outside Krownlandia in a new tab. Progress and accounts are separate.';
 const nearby=document.createElement('details');nearby.id='communityPortalNearby';const nearbyTitle=document.createElement('summary');nearbyTitle.textContent='Explore nearby';const nearbyList=document.createElement('div');nearby.append(nearbyTitle,nearbyList);
 let selected=null,revision=0;
 function refreshNearby(p){const version=++revision;nearby.open=false;nearbyList.replaceChildren();const targets=[...places.filter(other=>other!==p),{id:'square',name:'Town Square community board',x:8,z:47}];for(const point of targets){const button=document.createElement('button');button.id='communityPortalWalk-'+point.id;button.textContent='Walk to '+point.name;button.onclick=()=>{if(button.disabled||version!==revision||!dialog.open||near()!==p||selected!==p)return;pause();rewards.guideToPoint({x:point.x,z:point.z,name:point.name});dialog.close();};nearbyList.append(button);}}

 link.onclick=e=>{if(!dialog.open||near()!==selected)e.preventDefault();};
 const close=document.createElement('button');close.id='communityPortalClose';close.textContent='Back to Krownlandia';close.onclick=()=>{pause();dialog.close();};dialog.append(title,manager,description,link,notice,nearby,close);document.body.append(dialog);
 return {places,get near(){return near()},get isOpen(){return dialog.open},open(){const p=near();if(!p||dialog.open)return false;selected=p;refreshNearby(p);title.textContent=p.name;description.textContent=p.description;link.textContent=p.action+' ↗';link.href=p.url;pause();dialog.showModal();return true;}};
}
