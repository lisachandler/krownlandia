export function installFoodGuide({pause,guideTo,lounges,roastedReturnPoint,roastedMenu=()=>[],getPosition=()=>null}){
 const places=()=>[
  {id:'coffee',name:'Lisa’s Coffee Shop',menu:'The Pink Latte · Espresso · Cappuccino · Garden Tea',detail:'Virtual drinks at the pink-and-black coffee counter.',x:24,z:-18},
  {id:'roasted',name:'Roasted · Krown Palace',menu:roastedMenu().map(([name])=>name).join(' · '),detail:'Roasted vegetable bowls in reusable containers. Pick up your bowl at the food counter. Bring the empty bowl to the container return beside the entrance.',x:0,z:-86.5},
  {id:'popcorn',name:'Circus popcorn stand',menu:'Popcorn',detail:'Order and pick up a virtual snack inside the circus tent.',x:34,z:-56.3},
  ...lounges.spots.map(s=>({id:'lounge-'+s.id,name:s.name,menu:s.snack,detail:'Themed lounge · seating and '+s.souvenir+'.',x:s.x,z:s.z+1.3}))
 ];
 const dialog=document.createElement('dialog');dialog.id='foodGuide';dialog.setAttribute('aria-labelledby','foodGuideTitle');const title=document.createElement('h2');title.id='foodGuideTitle';title.textContent='Food & snacks';const intro=document.createElement('p');intro.textContent='Find virtual refreshments around Krownlandia. Follow directions, then use the location’s action button to order.';
 const label=document.createElement('label');label.htmlFor='foodGuideSearch';label.textContent='Search by snack, bowl ingredient, or place';const search=document.createElement('input');search.id='foodGuideSearch';search.type='search';search.placeholder='Try broccoli, tea, or Eldergrove';const results=document.createElement('p');results.id='foodGuideCount';results.setAttribute('aria-live','polite');search.setAttribute('aria-describedby','foodGuideCount');const list=document.createElement('div');list.id='foodGuidePlaces';const close=document.createElement('button');close.id='foodGuideClose';close.textContent='Back to the world';close.onclick=()=>{if(!dialog.open||close.disabled)return;pause();dialog.close();};dialog.append(title,intro,label,search,results,list,close);document.body.append(dialog);
 let nearestFirst=false,revision=0;const order=document.createElement('button');order.id='foodGuideNearest';order.textContent='Nearest first';order.setAttribute('aria-pressed','false');const orderNote=document.createElement('p');orderNote.id='foodGuideOrderNote';orderNote.textContent='Nearby order uses straight-line distance. Walking directions follow the paths.';orderNote.hidden=true;order.onclick=()=>{if(!dialog.open||order.disabled)return;nearestFirst=!nearestFirst;render();};dialog.replaceChildren(title,intro,label,search,order,orderNote,results,list,close);
 const clear=document.createElement('button');clear.id='foodGuideClear';clear.textContent='Clear search';clear.hidden=true;clear.onclick=()=>{if(!dialog.open||clear.disabled)return;search.value='';render();search.focus();};dialog.replaceChildren(title,intro,label,search,clear,order,orderNote,results,list,close);
 const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\bcrown\b/g,'krown').replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim();
 function render(){const rendered=++revision;
  clear.hidden=!(search.value||'').length;
  const terms=normalize(search.value||'').split(' ').filter(Boolean),matches=places().flatMap(p=>{
   const base=normalize(p.name+' '+p.detail);
   if(p.id==='roasted'&&terms.length){
    const bowls=roastedMenu().filter(([name,ingredients])=>terms.every(t=>(base+' '+normalize(name+' '+ingredients)).includes(t)));
    if(!bowls.length)return [];
    if(!terms.every(t=>base.includes(t)))return [{...p,menu:bowls.map(([name,ingredients])=>name+' · '+ingredients).join('\n')}];
   }
   return terms.every(t=>normalize(p.name+' '+p.menu+' '+p.detail).includes(t))?[p]:[];
  });
  const position=getPosition(),canSort=Number.isFinite(position?.x)&&Number.isFinite(position?.z),sorted=nearestFirst&&canSort;
  order.disabled=!canSort;order.setAttribute('aria-pressed',String(sorted));orderNote.hidden=!sorted;
  if(sorted)matches.sort((a,b)=>Math.hypot(a.x-position.x,a.z-position.z)-Math.hypot(b.x-position.x,b.z-position.z)||a.name.localeCompare(b.name));
  results.textContent=matches.length+' '+(matches.length===1?'place':'places')+' found'+(sorted?' · nearest first':'');list.replaceChildren();
  for(const p of matches){const card=document.createElement('article'),heading=document.createElement('h3'),menu=document.createElement('p'),detail=document.createElement('p'),walk=document.createElement('button');heading.textContent=p.name;menu.textContent=p.menu;menu.className='food-guide-menu';detail.textContent=p.detail;walk.id='foodGuideGo-'+p.id;walk.textContent=p.id==='roasted'?'Walk to the food counter':'Walk here';walk.setAttribute('aria-label',p.id==='roasted'?'Walk to the Roasted food counter':'Walk to '+p.name);walk.onclick=()=>{if(!dialog.open||walk.disabled||rendered!==revision)return;pause();guideTo({x:p.x,z:p.z,name:p.name});dialog.close();};card.append(heading,menu,detail,walk);
   if(p.id==='roasted'&&roastedReturnPoint){
    const back=document.createElement('button');back.id='foodGuideReturn';back.textContent='Walk to the container return';
    back.onclick=()=>{if(!dialog.open||back.disabled||rendered!==revision)return;pause();guideTo(roastedReturnPoint());dialog.close();};card.append(back);
   }
   if(sorted){const distance=document.createElement('p');distance.id='foodGuideDistance-'+p.id;distance.textContent='About '+Math.round(Math.hypot(p.x-position.x,p.z-position.z))+' m away · straight-line distance';card.append(distance);}list.append(card);}
  if(!matches.length){const empty=document.createElement('p');empty.textContent='No matching refreshments. Try another snack or place name, or clear the search to see all places.';list.append(empty);}
 }
 search.oninput=()=>{if(dialog.open&&!search.disabled)render();};const nav=document.createElement('button');nav.id='foodGuideButton';nav.textContent='Food & snacks';nav.onclick=()=>{if(nav.disabled||dialog.open)return;pause();render();dialog.showModal();};document.querySelector('nav').append(nav);const css=document.createElement('link');css.rel='stylesheet';css.href='food-guide.css';document.head.append(css);
 return {places,get isOpen(){return dialog.open}};
}
