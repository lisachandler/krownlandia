import * as T from './vendor/three.module.js';
import {STATIONS} from './rewards-core.js';
export function installLounges({scene,camera,colliders,blocked,pause,seat,stand,guideTo,getRewardState=()=>null,takePhoto=()=>false,faceForward=()=>{},lookUp=()=>{}}){
 const themes=[
 ['arrival','Welcome Terrace','#244d71','Citrus fruit cup','Welcome pennant'],
 ['gate','Crown Pavilion','#284b8d','Crown-shaped biscuit','Golden gate miniature'],
 ['gardens','Pollinator Nook','#58864e','Berry oat bites','Butterfly keepsake'],
 ['shop','Collectors’ Corner','#765794','Chocolate buttons','Collector’s ribbon'],
 ['cafe','Lisa’s Pink Patio','#ee78b5','Mini cinnamon roll','Pink coffee cup charm'],
 ['fountain','Fountain Retreat','#4199a8','Lemon ice','Water-drop charm'],
 ['discovery','Discovery Hideaway','#367d69','Apple crisps','Leaf bookmark'],
 ['palace','Royal Terrace','#54417d','Mini fruit tart','Crown ornament'],
 ['journey','World Travelers’ Rest','#397a92','Trail mix','Journey compass'],
 ['safari','Savanna Lookout','#a47739','Dried mango','Giraffe keepsake'],
 ['popcorn','Popcorn Picnic','#bb3d43','Sweet popcorn','Striped popcorn charm'],
 ['circus','Big Top Break','#982647','Soft pretzel','Circus star'],
 ['roasted','Harvest Patio','#69824a','Roasted carrot bites','Harvest recipe card'],
 ['library','Alexandria Readers’ Lounge','#254668','Honey oat bites','Miniature storybook'],
 ['eldergrove','Eldergrove Orchard Rest','#426a42','Baked apple slices','Carved wooden teacup'],
 ['produce','Community Harvest Nook','#527445','Carrot oat bites','Garden seed packet'],
 ['square','Town Square Festival Lounge','#805a87','Berry fruit cup','Festival pennant'],
 ['clubhouse','Treehouse Commons','#52735b','Seed and fruit bites','Miniature treehouse'],
 ['generalstore','Market Rest','#4e6c53','Apple and seed bites','Reusable shopping-bag charm'],
 ['riverbend','Riverbank Rest','#527e87','Apple oat bites','Miniature lantern boat'],
 ['bridge','Bridgekeeper’s Rest','#617d78','Pear and oat bites','Miniature Krown Bridge'],
 ['school','Starlight Study Nook','#76638b','Star-shaped oat bites','Lantern-star charm'],
 ['office','Office Garden Ideas Lounge','#35696d','Seed crackers','Pocket sketchbook']
 ];
 const $=s=>document.querySelector(s),spots=[],owned=new Set();let storageOK=true,current=null,sitting=null;
 function readSouvenirs(){const ids=JSON.parse(localStorage.getItem('krownlandia-lounge-souvenirs-v1')||'[]');if(!Array.isArray(ids))throw Error('Unreadable souvenir collection');return ids.filter(id=>themes.some(t=>t[0]===id));}
 try{for(const id of readSouvenirs())owned.add(id);}catch{storageOK=false;}
 function clear(x,z){if(x>-50&&x<-32&&z>38&&z<59)return false;if(x>20&&x<43&&z>26&&z<56)return false;if(Math.abs(x)<13&&z>39&&z<62)return false;if(x>11&&x<18&&z>-24&&z<0)return false;if(Math.abs(x+26)<8&&Math.abs(z-32)<8)return false;if(Math.abs(x)<9&&z>-80)return false;if(Math.abs(x-24)<10&&z>-26&&z<-3)return false;if(Math.abs(x+24)<10&&z>-26&&z<-3)return false;if(Math.hypot(x-39,z+62)<12)return false;if(Math.abs(x)<5&&z<-78)return false;if(x<-18&&z<-30&&z>-75)return false;for(let dx=-2;dx<=2;dx+=.5)for(let dz=-2;dz<=2;dz+=.5)if(blocked(x+dx,z+dz))return false;return !STATIONS.some(s=>Math.hypot(s.x-x,s.z-z)<4)&&!spots.some(s=>Math.hypot(s.x-x,s.z-z)<5);}
 for(const [id,name,color,snack,souvenir] of themes){
  const station=STATIONS.find(s=>s.id===id);let point=null;
  for(let radius=4;radius<=19&&!point;radius++)for(let i=0;i<32&&!point;i++){const a=i*Math.PI/16,x=station.x+Math.cos(a)*radius,z=station.z+Math.sin(a)*radius;if(clear(x,z))point={x,z};}
  if(!point)throw Error('No clear lounge placement: '+id);
  const spot={id,name,color,snack,souvenir,...point};spots.push(spot);
  const group=new T.Group();group.name=name;group.position.set(spot.x,0,spot.z);scene.add(group);
  const base=new T.MeshStandardMaterial({color}),cream=new T.MeshStandardMaterial({color:'#f5e4bd'}),wood=new T.MeshStandardMaterial({color:'#714c35'});
  const part=(geo,m,x,y,z)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;group.add(o);return o;};
  const box=(x,y,z,w,h,d,m)=>part(new T.BoxGeometry(w,h,d),m,x,y,z);
  box(0,.1,0,3.9,.12,3.9,cream);box(0,.57,-1.1,2.9,.25,.65,base);box(0,1.05,-1.43,2.9,.8,.12,wood);
  for(const x of [-1.15,1.15])box(x,.32,-1.1,.15,.5,.5,wood);
  colliders.push({x:spot.x,z:spot.z-1.1,w:1.7,d:.7});
  part(new T.CylinderGeometry(.52,.52,.1,20),cream,-1,.82,.6);part(new T.CylinderGeometry(.06,.06,.65,8),wood,-1,.46,.6);colliders.push({x:spot.x-1,z:spot.z+.6,r:.57});
  part(new T.CylinderGeometry(.035,.035,2.9,8),wood,1.5,1.6,-1.5);part(new T.ConeGeometry(2.4,.65,8),base,0,3.25,0);
  const plate=part(new T.CylinderGeometry(.3,.3,.03,20),base,-1,.9,.6);
  const treat=new T.Group();treat.position.set(-1,.93,.6);treat.visible=false;group.add(treat);spot.treat=treat;
  const foodColor=new T.MeshStandardMaterial({color:['roasted','safari'].includes(id)?'#eb9b39':id==='shop'?'#593628':id==='gardens'?'#ac5a74':'#e6be79'});
  const bite=(geo,m,x,y,z)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);treat.add(o);return o;};
  if(['arrival','fountain','square'].includes(id)){bite(new T.CylinderGeometry(.23,.16,.24,16),cream,0,.12,0);for(let i=0;i<6;i++)bite(new T.SphereGeometry(.07,8,6),i%2?base:foodColor,Math.cos(i)*.13,.28,Math.sin(i)*.13);}
  else if(['cafe','circus','palace'].includes(id)){const pastry=bite(new T.TorusGeometry(.16,.07,8,18),foodColor,0,.08,0);pastry.rotation.x=Math.PI/2;}
  else for(let i=0;i<6;i++){const food=bite(id==='roasted'?new T.CylinderGeometry(.06,.045,.22,8):new T.SphereGeometry(.075,8,6),foodColor,Math.cos(i*2.4)*.17,.07+(i%2)*.06,Math.sin(i*2.4)*.17);if(id==='roasted')food.rotation.z=1.2;else if(['gate','discovery','safari','eldergrove'].includes(id))food.scale.y=.35;}
  if(id==='produce'){box(1.4,1.3,.6,.32,.45,.07,cream);box(1.4,1.32,.645,.2,.2,.01,base);}
  else if(['library','office'].includes(id)){box(1.4,1.13,.6,.4,.13,.32,base);box(1.4,1.14,.62,.35,.075,.28,cream);box(1.4,1.21,.6,.4,.025,.32,base);}
  else if(id==='eldergrove'){part(new T.CylinderGeometry(.15,.11,.23,16),wood,1.4,1.2,.6);part(new T.CylinderGeometry(.12,.12,.012,16),foodColor,1.4,1.32,.6);part(new T.TorusGeometry(.075,.025,7,12),wood,1.56,1.23,.6);}
  else part(new T.OctahedronGeometry(.18),base,1.4,1.12,.6);
  box(1.4,.58,.6,.48,1,.48,wood);colliders.push({x:spot.x+1.4,z:spot.z+.6,r:.35});
  const c=document.createElement('canvas');c.width=768;c.height=192;const ctx=c.getContext('2d');ctx.fillStyle=color;ctx.fillRect(0,0,768,192);ctx.fillStyle='#ffffff';ctx.textAlign='center';ctx.font='bold 40px sans-serif';ctx.fillText(name.toUpperCase(),384,77);ctx.font='29px sans-serif';ctx.fillText('LOUNGE · SNACKS · SOUVENIRS',384,139);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;part(new T.PlaneGeometry(3.6,.9),new T.MeshStandardMaterial({map:texture}),0,2.35,-1.45);
 }
 const css=document.createElement('link');css.rel='stylesheet';css.href='lounges.css';document.head.append(css);
 const dialog=document.createElement('dialog');dialog.id='loungeMenu';dialog.setAttribute('aria-labelledby','loungeTitle');
 const title=document.createElement('h2');title.id='loungeTitle';const body=document.createElement('div');body.id='loungeBody';const close=document.createElement('button');close.textContent='Close';close.id='loungeClose';close.onclick=()=>dialog.close();dialog.append(title,body,close);document.body.append(dialog);
 const button=document.createElement('button');button.id='loungesButton';button.textContent='Lounges & souvenirs';$('nav').append(button);
 const dock=document.createElement('div');dock.id='loungeSeat';dock.hidden=true;document.body.append(dock);
 function btn(text,id,fn){const b=document.createElement('button');b.textContent=text;b.id=id;b.onclick=fn;return b;}
 function nearest(){return spots.find(s=>Math.hypot(camera.position.x-s.x,camera.position.z-(s.z+1.1))<1.8)||null;}
 function leave(){if(!sitting)return;const s=sitting;sitting=null;dock.hidden=true;stand(s);}
 dock.append(btn('Lounge menu','seatedMenu',()=>open(sitting)),btn('Stand up','loungeStand',leave));
 let uncollectedOnly=false;const filter=btn('Uncollected souvenirs','loungeUncollected',()=>{uncollectedOnly=!uncollectedOnly;render();});filter.setAttribute('aria-pressed','false');dialog.replaceChildren(title,filter,body,close);
 const retry=btn('Retry saving souvenirs','loungeRetrySave',()=>{if(!dialog.open)return;saveSouvenirs();render();});dialog.replaceChildren(title,filter,body,retry,close);
 const searchLabel=document.createElement('label');searchLabel.htmlFor='loungeSearch';searchLabel.textContent='Search lounges, snacks or souvenirs';const search=document.createElement('input');search.id='loungeSearch';search.type='search';search.placeholder='Try treehouse, popcorn or bookmark';search.oninput=()=>render();const clearSearch=btn('Clear search','loungeClearSearch',()=>{search.value='';render();search.focus();});const count=document.createElement('p');count.id='loungeResultCount';count.setAttribute('aria-live','polite');dialog.replaceChildren(title,searchLabel,search,clearSearch,filter,count,body,retry,close);
 let nearestFirst=false;const order=btn('Nearest first','loungeNearest',()=>{nearestFirst=!nearestFirst;render();});order.setAttribute('aria-pressed','false');const orderNote=document.createElement('p');orderNote.id='loungeOrderNote';orderNote.textContent='Nearby order uses straight-line distance. Walking directions follow the paths.';dialog.replaceChildren(title,searchLabel,search,clearSearch,filter,order,orderNote,count,body,retry,close);
 const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim();
 function saveSouvenirs(){try{for(const id of readSouvenirs())owned.add(id);localStorage.setItem('krownlandia-lounge-souvenirs-v1',JSON.stringify([...owned]));storageOK=true;}catch{storageOK=false;}}
 function canAct(s){return dialog.open&&current===s&&(nearest()===s||sitting===s);}
 function render(){const canSort=Number.isFinite(camera.position.x)&&Number.isFinite(camera.position.z),sorted=nearestFirst&&canSort;order.hidden=!!current;order.disabled=!canSort;order.setAttribute('aria-pressed',String(sorted));orderNote.hidden=!!current||!sorted;const distance=s=>Math.hypot(s.x-camera.position.x,s.z+1.3-camera.position.z);searchLabel.hidden=search.hidden=count.hidden=!!current;clearSearch.hidden=!!current||!(search.value||'').length;retry.hidden=storageOK;filter.hidden=!!current;filter.setAttribute('aria-pressed',String(uncollectedOnly));body.replaceChildren();title.textContent=current?current.name:'Lounges & souvenirs';
  if(!current){const p=document.createElement('p');p.textContent=owned.size+' / '+spots.length+' lounge souvenirs collected'+(storageOK?' on this browser.':' for this visit. Saving is unavailable; retry when browser storage is available.');body.append(p);const terms=normalize(search.value||'').split(' ').filter(Boolean);const remaining=spots.filter(s=>(!uncollectedOnly||!owned.has(s.id))&&terms.every(t=>normalize(s.name+' '+s.snack+' '+s.souvenir).includes(t)));if(sorted)remaining.sort((a,b)=>distance(a)-distance(b)||a.name.localeCompare(b.name));count.textContent=remaining.length+' '+(remaining.length===1?'lounge':'lounges')+' found'+(sorted?' · nearest first':'')+(uncollectedOnly?' · uncollected souvenirs':'');if(!remaining.length){const empty=document.createElement('p');empty.textContent=uncollectedOnly&&owned.size===spots.length?'All lounge souvenirs are collected. Turn off Uncollected souvenirs to revisit your favorite lounges.':'No matching lounges. Try another search, clear it, or turn off Uncollected souvenirs.';body.append(empty);}for(const s of remaining)body.append(btn(s.name+(sorted?' · About '+Math.round(distance(s))+' m away':'')+(owned.has(s.id)?' · Souvenir collected':''),'loungeGo-'+s.id,()=>{guideTo({x:s.x,z:s.z+1.3,name:s.name});dialog.close();}));return;}
  const s=current,local=nearest()===s||sitting===s,p=document.createElement('p');p.textContent='Complimentary virtual snack: '+s.snack+'. Souvenir: '+s.souvenir+'.';body.append(p);
  const snackButton=btn(s.treat.visible?'Snack served · '+s.snack:'Enjoy '+s.snack,'loungeSnack',()=>{if(!canAct(s)||s.treat.visible)return;s.treat.visible=true;render();});snackButton.disabled=!local||s.treat.visible;body.append(snackButton);
  const collect=btn(owned.has(s.id)?'Souvenir collected':'Collect '+s.souvenir,'loungeCollect',()=>{if(!canAct(s)||owned.has(s.id))return;owned.add(s.id);saveSouvenirs();render();});collect.disabled=!local||owned.has(s.id);body.append(collect);
  const rest=btn(sitting?'Stand up':'Take a seat','loungeSit',()=>{if(!canAct(s))return;if(sitting)leave();else if(nearest()===s){seat(s);sitting=s;dock.hidden=false;}dialog.close();});rest.disabled=!local;body.append(rest);if(sitting===s){body.append(btn('Face forward','loungeFaceForward',()=>{if(!canAct(s)||sitting!==s)return;pause();faceForward();dialog.close();}),btn('Look up','loungeLookUp',()=>{if(!canAct(s)||sitting!==s)return;pause();lookUp();dialog.close();}),btn('Take photo','loungePhoto',()=>{if(!canAct(s)||sitting!==s)return;pause();dialog.close();return takePhoto();}));}
  const station=STATIONS.find(station=>station.id===s.id);if(station){const progress=getRewardState(),claimed=progress?.claims?.includes(station.id+':task'),ready=progress?.done?.includes(station.task.id);const rewardLabel=claimed?'Revisit rewards station · task claimed':ready?'Find my '+station.task.points+'-point task reward':'Find location rewards';const rewardGuide=btn(rewardLabel,'loungeRewards',()=>{if(!canAct(s))return;pause();guideTo({x:station.x,z:station.z,name:station.name+' rewards'});dialog.close();});rewardGuide.disabled=!local;body.append(rewardGuide);}
  const note=document.createElement('p');note.textContent=storageOK?'Souvenirs are saved on this browser.':'Storage unavailable: souvenirs last for this visit.';body.append(note);
 }
 function open(s=null){if(dialog.open)return false;pause();current=s;render();dialog.showModal();return true;}button.onclick=()=>open();
 return {open,stand:leave,collection:()=>themes.filter(t=>owned.has(t[0])).map(t=>({id:t[0],name:t[4],color:t[2]})),get near(){return sitting?null:nearest()},get currentSeat(){return sitting},get seated(){return !!sitting},get isOpen(){return dialog.open},spots};
}
