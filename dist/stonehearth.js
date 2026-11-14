import * as T from './vendor/three.module.js';
export function installStonehearth({scene,camera,colliders,pause,canUse=()=>false}){
 const root=new T.Group();root.name='Stonehearth masonry courtyard';scene.add(root);
 const stone=new T.MeshStandardMaterial({color:'#a49b88',roughness:.95}),dark=new T.MeshStandardMaterial({color:'#655f55',roughness:.9}),path=new T.MeshStandardMaterial({color:'#c3b89e',roughness:1}),bounds=[];
 function box(x,y,z,w,h,d,material,solid=false){const mesh=new T.Mesh(new T.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);if(solid){const c={x,z,w:w/2+.3,d:d/2+.3};colliders.push(c);bounds.push(c);}return mesh;}
 box(-15,.06,140,8,.12,6,path);box(-15,.07,134,3,.12,8,path);box(-15,.9,140,3,.25,1.2,stone,true);for(const x of [-16,-14])box(x,.4,140,.35,.8,.8,dark);box(-15,.45,142.4,5.4,.9,.4,stone,true);box(-18,.9,138,.2,1.8,.2,dark,true);
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=192;const ctx=canvas.getContext('2d');ctx.fillStyle='#302f2b';ctx.fillRect(0,0,768,192);ctx.fillStyle='#fff3ce';ctx.textAlign='center';ctx.font='46px Georgia';ctx.fillText('STONEHEARTH',384,78);ctx.font='30px sans-serif';ctx.fillText('Masonry courtyard',384,137);
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const sign=new T.Mesh(new T.PlaneGeometry(1.8,.7),new T.MeshStandardMaterial({map:texture,side:T.DoubleSide}));sign.position.set(-18,1.8,138);root.add(sign);
 const point={x:-15,z:138,name:'Stonehearth masonry workbench'},near=()=>Math.hypot(camera.position.x-point.x,camera.position.z-point.z)<1.65;
 const dialog=document.createElement('dialog');dialog.id='stonehearthMenu';dialog.setAttribute('aria-labelledby','stonehearthTitle');
 const title=document.createElement('h2');title.id='stonehearthTitle';title.textContent='Stonehearth masonry courtyard';
 const note=document.createElement('p');note.textContent='Stonehearth’s recorded village description celebrates stone architecture and masonry. This level courtyard and pattern practice are prototype interpretations. The historical Stonecarver’s Fair is not a scheduled event here.';
 const panel=document.createElement('details');panel.id='stonehearthPractice';const summary=document.createElement('summary');summary.textContent='Arrange a stone pattern';
 const help=document.createElement('p');help.textContent='Choose a surface, then each of four positions. This decorative practice lasts until reload, with no points or saved keepsakes.';
 const status=document.createElement('p');status.id='stonehearthStatus';status.setAttribute('role','status');
 const tiles=document.createElement('div');tiles.className='stonehearthTiles';const controls=document.createElement('div');let selected='Smooth',finished=false,values=Array(4).fill(null);const buttons={};
 const canAct=()=>dialog.open&&panel.open&&near()&&canUse();
 function button(id,label,parent,action){const b=document.createElement('button');b.id='stonehearth-'+id;b.type='button';b.textContent=label;b.onclick=()=>{if(!canAct()||b.disabled)return;action();};buttons[id]=b;parent.append(b);return b;}
 for(const surface of ['Smooth','Striped'])button(surface,surface+' surface',controls,()=>{selected=surface;render();});
 const positions=['Top left','Top right','Bottom left','Bottom right'];positions.forEach((name,i)=>button('tile'+i,name,tiles,()=>{values[i]=selected;render();}));
 button('finish','Finish pattern',controls,()=>{finished=true;render();buttons.reset.focus();});button('reset','Clear / start another',controls,()=>{values=Array(4).fill(null);finished=false;render();buttons.Smooth.focus();});
 function render(){positions.forEach((name,i)=>{const b=buttons['tile'+i];b.textContent=name+': '+(values[i]||'empty');b.disabled=finished;b.dataset.surface=values[i]||'';});for(const s of ['Smooth','Striped']){buttons[s].disabled=finished;buttons[s].setAttribute('aria-pressed',String(selected===s));}buttons.finish.disabled=finished||values.some(v=>!v);buttons.reset.disabled=values.every(v=>!v);status.textContent=(finished?'Finished pattern. ':selected+' surface selected. ')+positions.map((p,i)=>p+': '+(values[i]||'empty')).join('; ')+'.';}
 const close=document.createElement('button');close.id='stonehearthClose';close.textContent='Return to the courtyard';close.onclick=()=>dialog.close();dialog.addEventListener('close',()=>{pause();document.querySelector('#interact')?.focus();});
 panel.append(summary,help,tiles,controls,status);dialog.append(title,note,panel,close);document.body.append(dialog);const css=document.createElement('link');css.rel='stylesheet';css.href='stonehearth.css';document.head.append(css);render();
 return {point,bounds,root,get near(){return near()},get isOpen(){return dialog.open},open(){if(!near()||!canUse()||dialog.open||document.querySelector('dialog[open]')?.open)return false;pause();panel.open=false;dialog.showModal();close.focus();return true;}};
}
