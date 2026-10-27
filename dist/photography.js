export function photoFilename({location='Park',night=false}={},date=new Date()){
 const place=String(location).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/['’]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80)||'Park';
 const pad=(n,width=2)=>String(n).padStart(width,'0');
 const stamp=date.getFullYear()+'-'+pad(date.getMonth()+1)+'-'+pad(date.getDate())+'_'+pad(date.getHours())+'-'+pad(date.getMinutes())+'-'+pad(date.getSeconds())+'-'+pad(date.getMilliseconds(),3);
 return 'Krownlandia-'+place+'-'+(night?'Night':'Day')+'-'+stamp+'.png';
}
export function installPhotography({renderer,scene,camera,getContext=()=>({})}){
 const button=document.createElement('button');button.id='takePhoto';button.textContent='Take photo';button.title='Save the current 3D view as a PNG without menus';document.querySelector('nav').append(button);
 const status=document.createElement('p');status.id='photoStatus';status.hidden=true;status.setAttribute('role','status');document.body.append(status);
 const style=document.createElement('link');style.rel='stylesheet';style.href='photography.css';document.head.append(style);
 let busy=false,timer,graphicsGeneration=0;
 renderer.domElement.addEventListener('webglcontextlost',()=>{graphicsGeneration++;});
 const graphicsUnavailable=()=>renderer.getContext?.()?.isContextLost?.()===true;
 function message(text){clearTimeout(timer);status.textContent=text;status.hidden=false;timer=setTimeout(()=>status.hidden=true,6000);}
 async function capture(){
  if(busy)return false;busy=true;button.disabled=true;
  try{
   const generation=graphicsGeneration;
   if(graphicsUnavailable()){message('Photo paused while graphics recover. Try again when the 3D view returns.');return false;}
   const context=getContext(),filename=photoFilename(context),location=context.location||'Krownlandia';
   // Capture immediately after drawing, since the normal renderer clears its buffer.
   renderer.render(scene,camera);
   const blob=await new Promise((resolve,reject)=>renderer.domElement.toBlob(b=>b?resolve(b):reject(Error('Image unavailable')),'image/png'));
   if(generation!==graphicsGeneration||graphicsUnavailable()){message('Graphics were interrupted while taking the photo. Try again when the 3D view returns.');return false;}
   const url=URL.createObjectURL(blob),link=document.createElement('a');
   link.href=url;link.download=filename;link.hidden=true;document.body.append(link);
   try{link.click();}finally{link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
   message(location+' photo sent to your browser’s downloads.');return true;
  }catch{message('Photo could not be saved. Try again or use a screenshot.');return false;}
  finally{busy=false;button.disabled=false;}
 }
 button.onclick=capture;return capture;
}
