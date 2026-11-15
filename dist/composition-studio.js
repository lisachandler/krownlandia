import * as T from './vendor/three.module.js';
// Prototype activity for the historically recorded Express Yourself School of Arts.
export function installCompositionStudio({scene,camera,colliders,pause,canUse=()=>false,getCurrentSeat=()=>null}){
 const root=new T.Group();root.name='Express Yourself composition studio';scene.add(root);const bounds=[];
 const mat=color=>new T.MeshStandardMaterial({color,roughness:.9}),wood=mat('#79583e'),path=mat('#b9ad89');
 function add(geometry,material,x,y,z){const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;root.add(m);return m;}
 function box(x,y,z,w,h,d,m){return add(new T.BoxGeometry(w,h,d),m,x,y,z);}
 function bound(c){bounds.push(c);colliders.push(c);}
 box(26,.06,170,8,.12,6,path);box(24,.07,164,3,.12,6,path);
 box(24,1,170,.2,2,.2,wood);bound({x:24,z:170,w:.4,d:.4});
 const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#203d31';ctx.fillRect(0,0,1024,256);ctx.fillStyle='#fff3ce';ctx.textAlign='center';ctx.font='58px Georgia';ctx.fillText('EXPRESS YOURSELF',512,105);ctx.font='38px sans-serif';ctx.fillText('Composition studio',512,185);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;
 const sign=add(new T.PlaneGeometry(2.4,.8),new T.MeshStandardMaterial({map:texture,side:T.DoubleSide}),24,2,170);sign.rotation.y=Math.PI;
 box(28,.6,171,2.8,.2,.9,wood);box(28,1.05,171.38,2.8,.85,.14,wood);for(const x of [26.9,29.1])box(x,.3,171,.15,.6,.75,wood);bound({x:28,z:171,w:1.7,d:.75});
 const point={x:24,z:168.5,name:'Express Yourself composition board'},seat={name:'Composition studio bench',x:28,z:171,y:1.5,yaw:0,approach:{x:28,z:169.6},kind:'composition-studio'};
 const near=()=>Math.hypot(camera.position.x-point.x,camera.position.z-point.z)<1.65;
 const accessible=()=>getCurrentSeat()===seat||(!getCurrentSeat()&&near());
 const el=(tag,id,text)=>{const e=document.createElement(tag);if(id)e.id=id;if(text)e.textContent=text;return e;};
 const dialog=el('dialog','studioMenu'),title=el('h2','studioTitle','Express Yourself composition studio');
 dialog.setAttribute('aria-labelledby','studioTitle');
 const intro=el('p',null,'Express Yourself School of Arts is credited to @elizabeths14 in the historical inventory. This small studio is a new interpretation.');
 const details=el('details','studioActivity'),summary=el('summary',null,'Arrange a composition');
 const note=el('p',null,'Choose a position, shape and color. There is no score. Your composition stays here until you reload.');
 const positions=['Left','Center','Right'],shapes=['Circle','Triangle','Square'],colors=['Rose','Gold','Teal'];
 const slots=positions.map(()=>({shape:null,color:null}));let active=0,finished=false,launcher=null;
 const preview=el('div','studioPreview');preview.setAttribute('aria-hidden','true');
 const marks=slots.map(()=>{const cell=el('span'),mark=el('i');cell.append(mark);preview.append(cell);return mark;});
 const status=el('p','studioDescription');status.setAttribute('role','status');
 const allowed=()=>dialog.open&&details.open&&canUse()&&accessible();
 const button=(id,label,fn)=>{const b=el('button',id,label);b.type='button';b.onclick=()=>{if(allowed()){fn();render();}};return b;};
 function choices(label,values,select){const group=el('fieldset');group.append(el('legend',null,label));const buttons=values.map((v,i)=>button('studio'+v,v,()=>select(i)));group.append(...buttons);details.append(group);return buttons;}
 details.append(summary,note,preview);
 const pButtons=choices('Position',positions,i=>{active=i;}),sButtons=choices('Shape',shapes,i=>{finished=false;slots[active].shape=i;}),cButtons=choices('Color',colors,i=>{finished=false;slots[active].color=i;});
 const finish=button('studioFinish','Finish composition',()=>{if(slots.every(complete))finished=true;}),reset=button('studioReset','Start again',()=>{for(const v of slots){v.shape=v.color=null;}active=0;finished=false;pButtons[0].focus();});
 function complete(v){return v.shape!==null&&v.color!==null;}
 function render(){
  for(const [buttons,n] of [[pButtons,active],[sButtons,slots[active].shape],[cButtons,slots[active].color]])buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===n)));
  slots.forEach((v,i)=>{marks[i].className=(colors[v.color]||'Outline')+' '+(shapes[v.shape]||'Blank');});
  status.textContent=(finished?'Finished. ':'')+slots.map((v,i)=>positions[i]+': '+(colors[v.color]||'no color')+', '+(shapes[v.shape]||'no shape')).join('; ')+'.';
  finish.disabled=finished||!slots.every(complete);
 }
 const close=el('button','studioClose','Return to the park');close.onclick=()=>dialog.close();dialog.addEventListener('close',()=>{pause();requestAnimationFrame(()=>{if(!dialog.open)launcher?.focus();});});
 details.append(status,finish,reset);dialog.append(title,intro,details,close);document.body.append(dialog);
 const css=el('link');css.rel='stylesheet';css.href='composition-studio.css';document.head.append(css);render();
 return {root,bounds,point,seats:[seat],get near(){return near()},get isOpen(){return dialog.open},open(from){if(!accessible()||!canUse()||dialog.open||document.querySelector('dialog[open]')?.open)return false;launcher=from||document.querySelector('#interact');pause();details.open=false;dialog.showModal();close.focus();return true;}};
}
