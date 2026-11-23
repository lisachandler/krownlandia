import * as T from './vendor/three.module.js';
export function installProduceGarden({scene,camera,colliders,pause,rewards,getCurrentSeat=()=>null,getRoastedCounter=()=>null}){
 const root=new T.Group();root.name='Community Produce Garden';scene.add(root);
 const mat=color=>new T.MeshStandardMaterial({color,roughness:.85}),wood=mat('#80563c'),green=mat('#426d45'),stone=mat('#d9c7a1'),soil=mat('#826144'),orange=mat('#e89539'),red=mat('#c74737');
 const add=(g,m,x,y,z)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;root.add(o);return o;};
 const box=(x,y,z,w,h,d,m,solid=false)=>{const o=add(new T.BoxGeometry(w,h,d),m,x,y,z);if(solid)colliders.push({x,z,w:w/2+.3,d:d/2+.3});return o;};
 box(-40,.08,49,16,.14,18,stone);box(-22,.065,54,23,.12,3,stone);
 for(const [x,z,kind] of [[-44,45,'carrot'],[-36,45,'tomato'],[-44,51,'greens']]){box(x,.42,z,4,.65,3,wood,true);box(x,.77,z,3.7,.08,2.7,soil);for(let i=0;i<9;i++){const px=x-1.25+(i%3)*1.25,pz=z-.8+Math.floor(i/3)*.8;if(kind==='carrot'){add(new T.ConeGeometry(.15,.4,8),orange,px,.88,pz);for(let j=0;j<3;j++){const leaf=box(px+(j-1)*.07,1.17,pz,.05,.42,.08,green);leaf.rotation.z=(j-1)*.35;}}else if(kind==='tomato'){box(px,1.3,pz,.055,1.1,.055,wood);add(new T.SphereGeometry(.25,9,7),green,px,1.3,pz);add(new T.SphereGeometry(.13,10,7),red,px+.17,1.35,pz+.13);}else{const plant=add(new T.SphereGeometry(.3,9,7),green,px,1,pz);plant.scale.y=.65;}}}
 function sign(lines,x,y,z,w,h){const c=document.createElement('canvas');c.width=1024;c.height=320;const ctx=c.getContext('2d');ctx.fillStyle='#294c36';ctx.fillRect(0,0,1024,320);ctx.fillStyle='#fff0c7';ctx.textAlign='center';lines.forEach((s,i)=>{ctx.font=(i?'32':'46')+'px Georgia';ctx.fillText(s,512,80+i*85);});const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;add(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:tex,side:T.DoubleSide}),x,y,z);}
 sign(['COMMUNITY PRODUCE GARDEN','Grow · Care · Share','Original place idea: @lisachandler'],-40,3.2,40,12,2);for(const x of [-46,-34])box(x,1.55,40,.15,3.1,.15,wood,true);
 box(-37,1.1,51,3,.15,1.3,wood,true);for(const x of [-38,-36])box(x,.5,51,.12,1,.7,wood);add(new T.CylinderGeometry(.28,.28,.45,16),green,-37,1.42,51);const spout=add(new T.CylinderGeometry(.05,.07,.55,9),green,-36.6,1.45,51);spout.rotation.z=-.8;sign(['GARDEN CARE','Water the vegetable beds'],-37,2.15,51.05,3.8,1);
 const seats=[];for(const x of [-44,-35]){box(x,.6,56,3,.2,.85,wood,true);box(x,1.05,56.4,3,.8,.12,green);seats.push({name:'Community Produce Garden bench',x,z:56,y:1.45,yaw:0,approach:{x,z:54.7},kind:'produce'});}
 const boardPoint={x:-37,z:53,name:'Community Produce Garden watering bench'},near=()=>Math.hypot(camera.position.x-boardPoint.x,camera.position.z-boardPoint.z)<1.6,watered=()=>rewards.state().done.includes('produce-water');
 const canRead=()=>near()||seats.includes(getCurrentSeat());
 const dialog=document.createElement('dialog');dialog.id='produceMenu';dialog.setAttribute('aria-labelledby','produceTitle');const title=document.createElement('h2');title.id='produceTitle';title.textContent='Community Produce Garden';const intro=document.createElement('p');intro.textContent='An original community place idea contributed by @lisachandler. This garden brings it into the current world with carrots, tomatoes and leafy greens. Take a moment to care for a shared harvest.';const status=document.createElement('p');status.id='produceStatus';status.setAttribute('role','status');const water=document.createElement('button');water.id='produceWater';const reward=document.createElement('button');reward.id='produceRewards';reward.textContent='Find garden rewards';reward.onclick=()=>{rewards.guideTo('produce');dialog.close();};const close=document.createElement('button');close.id='produceClose';close.textContent='Return to the garden';close.onclick=()=>{pause();dialog.close();};dialog.append(title,intro,status,water,reward,close);document.body.append(dialog);const css=document.createElement('link');css.rel='stylesheet';css.href='produce-garden.css';document.head.append(css);

 const notes=document.createElement('details');notes.id='produceNotes';const summary=document.createElement('summary');summary.textContent='Explore the vegetable beds';const note=document.createElement('p');note.id='produceNote';note.setAttribute('aria-live','polite');const choices=document.createElement('div');const crops=[
  ['carrots','Carrots','Look for the orange tips and upright green leaves in the back-left bed when facing the garden from its benches. The repeated rows give this little patch its pattern.'],
  ['tomatoes','Tomatoes','The back-right bed has wooden supports, green foliage and red tomatoes. Can you spot the small red shapes tucked beside the leaves?'],
  ['greens','Leafy greens','The bed closest to the left bench holds low, rounded green plants. Compare their shapes with the taller carrot leaves and supported tomatoes.']
 ];let selectedCrop=0;const cropButtons=crops.map(([id,name,text],i)=>{const b=document.createElement('button');b.id='produceCrop-'+id;b.textContent=name;b.onclick=()=>{if(!dialog.open||!canRead())return;selectedCrop=i;renderNotes();};choices.append(b);return b;});function renderNotes(){note.textContent=crops[selectedCrop][2];cropButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===selectedCrop)));}
 const attribution=document.createElement('p');attribution.textContent='These observation notes describe the prototype garden.';const kitchen=document.createElement('button');kitchen.type='button';kitchen.id='produceVisitRoasted';kitchen.textContent='Get walking directions to Roasted';
 kitchen.onclick=()=>{if(!dialog.open||!notes.open||!canRead())return;const target=getRoastedCounter();if(!target)return;pause();rewards.guideToPoint({x:target.x,z:target.z,name:target.name});dialog.close();};
 const kitchenNote=document.createElement('p');kitchenNote.textContent='For a vegetable bowl, visit Roasted in Krown Palace. You can go before or after watering.';
 notes.append(summary,choices,note,attribution,kitchenNote,kitchen);renderNotes();
 const planner=createPracticePlot(()=>dialog.open&&canRead());
 const tend=document.createElement('button');tend.id='produceFindWater';tend.textContent='Walk to the watering bench';tend.onclick=()=>{if(!dialog.open||!canRead())return;pause();rewards.guideToPoint(boardPoint);dialog.close();};dialog.replaceChildren(title,intro,notes,planner.panel,status,water,tend,reward,close);

 function render(){soil.color.set(watered()?'#49392e':'#826144');const seated=seats.includes(getCurrentSeat());water.hidden=seated;water.disabled=watered()||seated;tend.hidden=!seated||watered();water.textContent=watered()?'Garden watered':'Water the vegetable beds';const st=rewards.state();reward.textContent=st.claims.includes('produce:task')?'Revisit garden rewards · task claimed':watered()?'Find my 20-point garden reward':'Find garden rewards';status.textContent=st.claims.includes('produce:task')?'Thank you for tending the garden. Your task reward is collected.':watered()?'The beds are watered. Collect 20 task points at the garden rewards station.':seated?'Stand up and follow directions to the watering bench to tend the beds and unlock 20 task points.':'Use the watering can here to tend the beds and unlock 20 task points.';if(!st.saved)status.textContent+=' Progress lasts for this visit; browser storage is unavailable.';}
 water.onclick=()=>{if(!dialog.open||!near()||seats.includes(getCurrentSeat())||watered())return;rewards.completeProduce();render();};soil.color.set(watered()?'#49392e':'#826144');
 return {seats,boardPoint,get watered(){return watered()},get near(){return near()},get isOpen(){return dialog.open},open(){if(!canRead()||dialog.open)return false;pause();notes.open=false;planner.close();render();dialog.showModal();return true;}};
}


function createPracticePlot(canRead){
 const el=(tag,id,text)=>{const node=document.createElement(tag);node.id='plot'+id;if(text)node.textContent=text;return node;};
 const panel=el('details','Planner'), summary=el('summary','Summary','Plan a practice plot');
 const note=el('p','Note','Arrange three beds on paper. Swap neighbors to design a layout, or rotate to move each crop one bed to the right. The last crop wraps to the first bed.');
 const list=el('ol','Beds');list.setAttribute('aria-label','Practice beds from left to right');
 const names=['Carrots','Tomatoes','Leafy greens'];let order=[...names];
 const status=el('p','Status');status.setAttribute('role','status');status.setAttribute('aria-atomic','true');
 const beds=names.map((name,i)=>el('li','Bed'+i,name));list.append(...beds);
 function draw(message){beds.forEach((node,i)=>node.textContent=order[i]);status.textContent=message?message+' Left to right: '+order.join(', ')+'.':'';}
 const control=(id,label,change)=>{const b=el('button',id,label);b.type='button';b.onclick=()=>{if(panel.open&&canRead()){change();draw(label+'.');}};return b;};
 const swap=i=>{[order[i],order[i+1]]=[order[i+1],order[i]];};
 const left=control('Left','Swap beds 1 and 2',()=>swap(0)),right=control('Right','Swap beds 2 and 3',()=>swap(1));
 const rotate=control('Rotate','Rotate crops',()=>order.unshift(order.pop()));
 const reset=control('Reset','Restore starting layout',()=>{order=[...names];});
 const care=el('details','Care'),careTitle=el('summary','CareTitle','Practice garden care');
 const credit=el('p','CareCredit','Inspired by Gardening, credited to @josefan12 on page 16 of the original places list. The practice beds are imagined and separate from the real park task.');
 const prompt=el('p','CarePrompt'),feedback=el('p','CareFeedback');feedback.setAttribute('role','status');
 const situations=[
  ['1 of 3 · The practice carrot bed is marked dry.',0,'Watering matches the dry-bed cue.'],
  ['2 of 3 · The practice tomato support is loose.',1,'Checking the support addresses the loose frame.'],
  ['3 of 3 · The leafy bed is marked tended, with nothing to fix.',2,'Observation is a choice: this bed needs no action now.']
 ];
 let situation=0,answered=false;
 const careActive=()=>panel.open&&care.open&&canRead();
 function showCare(){prompt.textContent=situations[situation][0];feedback.textContent='';answered=false;next.hidden=true;}
 const answers=['Water the practice bed','Check the support','Look without changing the bed'].map((label,i)=>{
  const b=el('button','CareChoice'+i,label);b.type='button';
  b.onclick=()=>{
   if(!careActive()||answered)return;
   const [cue,correct,message]=situations[situation];
   if(correct!==i){feedback.textContent='That does not match this cue. '+cue;return;}
   answered=true;feedback.textContent=message;next.hidden=false;
  };return b;
 });
 const next=el('button','CareNext','Next practice bed');next.type='button';
 next.onclick=()=>{if(!careActive()||!answered||next.hidden)return;situation=(situation+1)%situations.length;showCare();answers[0].focus();};
 care.append(careTitle,credit,prompt,...answers,feedback,next);showCare();
 panel.append(summary,note,list,left,right,rotate,reset,status,care);
 return {panel,close(){panel.open=false;care.open=false;situation=0;showCare();order=[...names];draw('');}};
}
