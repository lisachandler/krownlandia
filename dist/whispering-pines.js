import * as T from './vendor/three.module.js';
// New prototype interpretation of the recorded pine-forest/story tradition.
export function installWhisperingPines({scene,camera,colliders,pause,canUse=()=>false,getCurrentSeat=()=>null}){
 const root=new T.Group();root.name='Whispering Pines story glade';scene.add(root);const bounds=[];
 const mat=color=>new T.MeshStandardMaterial({color,roughness:.9}),wood=mat('#79583e'),pine=mat('#345a46'),path=mat('#b9ad89');
 function add(geometry,material,x,y,z){const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;root.add(m);return m;}
 function box(x,y,z,w,h,d,m){return add(new T.BoxGeometry(w,h,d),m,x,y,z);}
 function bound(c){bounds.push(c);colliders.push(c);}
 box(40,.06,169,10,.12,8,path);box(39,.07,163.5,3,.12,5,path);
 box(39,1,168,.2,2,.2,wood);bound({x:39,z:168,w:.4,d:.4});
 const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#203d31';ctx.fillRect(0,0,1024,256);ctx.fillStyle='#fff3ce';ctx.textAlign='center';ctx.font='58px Georgia';ctx.fillText('WHISPERING PINES',512,105);ctx.font='38px sans-serif';ctx.fillText('A place for forest stories',512,185);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;
 const sign=add(new T.PlaneGeometry(2.4,.8),new T.MeshStandardMaterial({map:texture,side:T.DoubleSide}),39,2,168);sign.rotation.y=Math.PI;
 box(42,.6,170,2.8,.2,.9,wood);box(42,1.05,170.38,2.8,.85,.14,wood);for(const x of [40.9,43.1])box(x,.3,170,.15,.6,.75,wood);bound({x:42,z:170,w:1.7,d:.75});
 for(const [x,z] of [[36.5,171.5],[43.5,166.5],[43.5,172]]){add(new T.CylinderGeometry(.25,.35,3,8),wood,x,1.5,z);add(new T.ConeGeometry(1.2,3.2,10),pine,x,4,z);bound({x,z,r:.35});}
 const point={x:39,z:166.5,name:'Whispering Pines story board'},seat={name:'Whispering Pines story bench',x:42,z:170,y:1.5,yaw:0,approach:{x:42,z:168.6},kind:'whispering-pines'};
 const near=()=>Math.hypot(camera.position.x-point.x,camera.position.z-point.z)<1.65;
 const accessible=()=>getCurrentSeat()===seat||(!getCurrentSeat()&&near());
 const dialog=document.createElement('dialog');dialog.id='pinesMenu';dialog.setAttribute('aria-labelledby','pinesTitle');const title=document.createElement('h2');title.id='pinesTitle';title.textContent='Whispering Pines story glade';
 const intro=document.createElement('p');intro.textContent='The recorded Whispering Pines village description celebrates pine forest and forest stories. This glade is a prototype interpretation, not the full village. Pinewood Festival remains historical context, not a scheduled event.';
 const details=document.createElement('details');details.id='pinesPrompts';const summary=document.createElement('summary');summary.textContent='Forest story prompts';const note=document.createElement('p');note.textContent='New imaginative prompts inspired by the forest-story tradition—not historical tales. Imagine an answer privately; nothing is recorded or shared. Your selected prompt lasts until reload. No points or keepsakes are added.';
 const prompts=[['A place to meet','Imagine a visitor arriving beneath the pines. What small welcome would help them feel at home?'],['An object to share','Imagine a neighbor bringing an object that holds a happy memory. What might it be, and what story might they tell?'],['A path home','Imagine following a familiar woodland path at the end of the day. What detail would tell you that you are nearly home?']];
 const controls=document.createElement('div'),story=document.createElement('p');story.id='pinesStory';story.setAttribute('role','status');let selected=-1,returnFocus=null;
 const buttons=prompts.map(([label,text],i)=>{const b=document.createElement('button');b.type='button';b.id='pinesPrompt'+i;b.textContent=label;b.onclick=()=>{if(!dialog.open||!details.open||!canUse()||!accessible())return;selected=i;render();};controls.append(b);return b;});
 function render(){story.textContent=selected<0?'Choose any prompt. There is no required order.':prompts[selected][1];buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===selected)));}
 const close=document.createElement('button');close.id='pinesClose';close.textContent='Return to the glade';close.onclick=()=>dialog.close();dialog.addEventListener('close',()=>{pause();requestAnimationFrame(()=>{if(!dialog.open)returnFocus?.focus();});});
 const craft=document.createElement('details');craft.id='pinesInlay';
 const craftSummary=document.createElement('summary');craftSummary.textContent='Pinewood inlay practice';
 const craftNote=document.createElement('p');craftNote.textContent='Inspired by the recorded Whispering Pines woodworking and resin crafts. These dry, imaginary pieces and their pattern are prototype choices. Choose a piece and fill three slots. Try matching the two ends with a different piece in the center.';
 const craftStatus=document.createElement('p');craftStatus.id='pinesInlayStatus';craftStatus.setAttribute('role','status');
 const materials=['Pinewood','Amber inlay'],names=['Left','Center','Right'];
 let material=0,slots=[null,null,null];
 const canCraft=()=>dialog.open&&craft.open&&canUse()&&accessible();
 function craftButton(id,text,action){
  const b=document.createElement('button');b.id=id;b.type='button';b.textContent=text;
  b.onclick=()=>{if(canCraft()&&!b.disabled)action();};return b;
 }
 const selectors=materials.map((name,i)=>craftButton('pinesInlayMaterial'+i,name,()=>{material=i;renderCraft();}));
 const positions=names.map((name,i)=>craftButton('pinesInlaySlot'+i,name,()=>{slots[i]=material;renderCraft();}));
 const reset=craftButton('pinesInlayReset','Clear pattern',()=>{slots.fill(null);renderCraft();positions[0].focus();});
 function renderCraft(){
  selectors.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===material)));
  positions.forEach((b,i)=>{b.textContent=names[i]+': '+(materials[slots[i]]||'empty');});
  reset.disabled=slots.every(v=>v===null);
  const count=slots.filter(v=>v!==null).length;
  const feedback=count<3?count+' of 3 slots filled.':slots[0]!==slots[2]?'The ends differ.':slots[0]===slots[1]?'The ends match; try a different center for contrast.':'The ends match and the center contrasts.';
  craftStatus.textContent=feedback;
 }
 const craftMaterials=document.createElement('div');craftMaterials.setAttribute('role','group');craftMaterials.setAttribute('aria-label','Choose an inlay piece');craftMaterials.append(...selectors);
 const craftSlots=document.createElement('div');craftSlots.setAttribute('role','group');craftSlots.setAttribute('aria-label','Place the chosen piece');craftSlots.append(...positions);
 craft.append(craftSummary,craftNote,craftMaterials,craftSlots,reset,craftStatus);renderCraft();
 details.append(summary,note,controls,story);dialog.append(title,intro,details,craft,close);document.body.append(dialog);const css=document.createElement('link');css.rel='stylesheet';css.href='whispering-pines.css';document.head.append(css);render();
 return {root,bounds,point,seats:[seat],get near(){return near()},get isOpen(){return dialog.open},open(launcher){if(!canUse()||!accessible()||dialog.open||document.querySelector('dialog[open]')?.open)return false;returnFocus=launcher||document.querySelector('#interact');pause();details.open=false;craft.open=false;material=0;slots.fill(null);renderCraft();dialog.showModal();close.focus();return true;}};
}
