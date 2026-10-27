export function installGraphics({renderer,scene,sun,pause}){
 const profiles={detailed:{label:'Detailed',ratio:1.6,shadows:true,size:2048,description:'Sharper edges and detailed shadows.'},balanced:{label:'Balanced',ratio:1.25,shadows:true,size:1024,description:'Lower rendering resolution with simpler shadows.'},lightweight:{label:'Lightweight',ratio:1,shadows:false,size:512,description:'Lower rendering resolution with cast shadows switched off.'}};
 const style=document.createElement('link');style.rel='stylesheet';style.href='graphics.css';document.head.append(style);
 const button=document.createElement('button');button.id='graphicsButton';button.textContent='Graphics';document.querySelector('nav').append(button);
 const dialog=document.createElement('dialog');dialog.id='graphicsSettings';dialog.setAttribute('aria-labelledby','graphicsTitle');dialog.innerHTML='<h2 id="graphicsTitle">Graphics quality</h2><p>Choose a lighter setting if walking or looking around feels slow.</p><div id="graphicsChoices"></div><p id="graphicsStatus" role="status"></p><button id="graphicsClose">Back to the park</button>';document.body.append(dialog);
 const $=s=>document.querySelector(s),buttons={};let selected='detailed',saved=true;
 try{const previous=localStorage.getItem('krownlandia-graphics-v1');if(Object.hasOwn(profiles,previous))selected=previous;}catch{saved=false;}
 let applied=null,pixelRatio=null;
 function syncResolution(){const density=Number.isFinite(devicePixelRatio)&&devicePixelRatio>0?devicePixelRatio:1,ratio=Math.min(density,profiles[selected].ratio);if(ratio!==pixelRatio){renderer.setPixelRatio(ratio);pixelRatio=ratio;}}
 addEventListener('resize',syncResolution);
 function apply(id,save=true){
  if(!Object.hasOwn(profiles,id))return;const p=profiles[id],changed=renderer.shadowMap.enabled!==p.shadows;selected=id;
  syncResolution();renderer.shadowMap.enabled=p.shadows;
  if(sun.shadow.mapSize.x!==p.size){sun.shadow.map?.dispose();sun.shadow.map=null;sun.shadow.mapSize.set(p.size,p.size);}
  if(applied!==id||changed){sun.shadow.needsUpdate=true;renderer.shadowMap.needsUpdate=true;}applied=id;
  if(changed){const seen=new Set();scene.traverse(o=>{for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[])if(!seen.has(m)){m.needsUpdate=true;seen.add(m);}});}
  if(save){try{localStorage.setItem('krownlandia-graphics-v1',id);saved=true;}catch{saved=false;}}
  for(const [key,b]of Object.entries(buttons))b.setAttribute('aria-pressed',String(key===id));
  $('#graphicsStatus').textContent=p.label+' selected. '+(saved?'Your preference is saved in this browser.':'This setting will last for this visit; browser storage is unavailable.');
 }
 for(const [id,p]of Object.entries(profiles)){const b=document.createElement('button');b.id='graphics-'+id;b.className='graphics-choice';b.textContent=p.label+' — '+p.description;b.setAttribute('aria-pressed','false');b.onclick=()=>apply(id);buttons[id]=b;$('#graphicsChoices').append(b);}
 button.onclick=()=>{pause();dialog.showModal();};$('#graphicsClose').onclick=()=>dialog.close();apply(selected);
 return {get isOpen(){return dialog.open},get selected(){return selected}};
}
