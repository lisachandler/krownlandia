import {photoFilename} from './photography.js';
export function installVideo({renderer,pause=()=>{},getContext=()=>({})}){
 const make=(tag,id,text)=>{const e=document.createElement(tag);e.id=id;if(text)e.textContent=text;return e;};
 const nav=make('button','recordVideo','Record video');document.querySelector('nav').append(nav);
 const dialog=make('dialog','videoPanel');dialog.setAttribute('aria-labelledby','videoTitle');
 const title=make('h2','videoTitle','Record your visit');
 const intro=make('p','videoIntro','Record up to 30 seconds of the 3D scene. Silent video only—no menus, webcam or microphone. Recording may reduce performance.');
 const status=make('p','videoStatus');status.setAttribute('role','status');
 const preview=make('video','videoPreview');preview.controls=true;preview.playsInline=true;preview.hidden=true;preview.setAttribute('aria-label','Your recorded Krownlandia clip');
 const download=make('a','videoDownload','Download clip');download.hidden=true;
 const start=make('button','videoStart','Start recording');
 const close=make('button','videoClose','Back to the world');
 const note=make('p','videoNote','Clips stay in this page only. Download before recording a replacement or leaving. Nothing is uploaded or included in progress backups.');
 dialog.append(title,intro,status,preview,download,start,close,note);document.body.append(dialog);
 const stop=make('button','videoStop','Stop recording');stop.hidden=true;document.body.append(stop);
 const css=make('link','videoStyle');css.rel='stylesheet';css.href='video.css';document.head.append(css);
 const canvas=renderer.domElement,Recorder=globalThis.MediaRecorder;
 let active=null,clipUrl=null,interval=null,timeout=null,readyNotice=false;
 const supported=typeof Recorder==='function'&&typeof canvas.captureStream==='function';
 const unavailable=()=>renderer.getContext?.()?.isContextLost?.()===true;
 function controls(){nav.textContent=active?'Recording…':clipUrl?'Video ready · preview':'Record video';start.disabled=!supported||!!active||unavailable();start.textContent=clipUrl?'Record new clip (replace current)':'Start recording';stop.hidden=!active&&!readyNotice;if(!active){stop.disabled=false;stop.textContent='Preview clip';}}
 function cleanup(session){clearInterval(interval);clearTimeout(timeout);interval=timeout=null;for(const track of session.stream.getTracks())track.stop();}
 function finish(session){
  if(active!==session)return;cleanup(session);active=null;controls();
  if(session.failed||!session.chunks.length){status.textContent='Recording could not be completed. Try a shorter clip or another browser.';return;}
  const type=session.recorder.mimeType||session.chunks[0].type||'video/webm';
  const blob=new Blob(session.chunks,{type});if(!blob.size){status.textContent='No video was captured. Please try again.';return;}
  clipUrl=URL.createObjectURL(blob);preview.src=clipUrl;preview.hidden=false;download.href=clipUrl;download.download=session.filename.replace(/\.png$/,type.includes('mp4')?'.mp4':'.webm');download.hidden=false;
  readyNotice=!dialog.open;status.textContent='Clip ready. Preview and download it before leaving.';controls();
 }
 function end(reason='Recording stopped.'){
  if(!active||active.stopping)return;const session=active;session.stopping=true;clearInterval(interval);clearTimeout(timeout);stop.disabled=true;stop.textContent='Finishing clip…';status.textContent=reason;
  try{if(session.recorder.state!=='inactive')session.recorder.stop();else finish(session);}catch{session.failed=true;finish(session);}
 }
 function open(){if(dialog.open)return;readyNotice=false;pause();controls();dialog.showModal();}
 nav.onclick=()=>{if(!nav.disabled)open();};close.onclick=()=>{if(dialog.open&&!close.disabled){preview.pause();dialog.close();pause();}};
 dialog.addEventListener('close',()=>preview.pause());
 start.onclick=()=>{
  if(!dialog.open||start.disabled||active)return;
  let stream;try{
   if(!supported||unavailable())throw Error('Unavailable');
   stream=canvas.captureStream(24);
   const type=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm','video/mp4'].find(t=>Recorder.isTypeSupported?.(t));
   const recorder=new Recorder(stream,{...(type?{mimeType:type}:{}),videoBitsPerSecond:4000000});
   const session={stream,recorder,chunks:[],bytes:0,failed:false,filename:photoFilename(getContext()),started:Date.now()};
   recorder.ondataavailable=e=>{if(active!==session||!e.data?.size)return;session.bytes+=e.data.size;if(session.bytes>24*1024*1024){session.failed=true;end('Recording reached its memory limit.');return;}session.chunks.push(e.data);};
   recorder.onstop=()=>finish(session);recorder.onerror=()=>{session.failed=true;end('Recording was interrupted.');};
   active=session;recorder.start(1000);readyNotice=false;
   if(clipUrl){preview.pause();preview.removeAttribute('src');URL.revokeObjectURL(clipUrl);clipUrl=null;}preview.hidden=true;download.hidden=true;download.removeAttribute('href');
   status.textContent='Recording the 3D scene. Stop anytime; recording ends after 30 seconds.';stop.disabled=false;controls();dialog.close();
   interval=setInterval(()=>{if(active===session)stop.textContent='Stop recording · '+Math.min(30,Math.floor((Date.now()-session.started)/1000))+'/30s';},1000);
   stop.textContent='Stop recording · 0/30s';timeout=setTimeout(()=>end('30-second clip finished.'),30000);
  }catch{if(stream)for(const t of stream.getTracks())t.stop();active=null;controls();status.textContent='Video recording is unavailable right now. Try another browser or use Take photo.';}
 };
 stop.onclick=()=>{if(stop.disabled||stop.hidden)return;if(active)end();else if(clipUrl&&readyNotice)open();};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)end('Recording stopped when this page was hidden.');});
 canvas.addEventListener('webglcontextlost',()=>end('Recording stopped while graphics recover.'));
 canvas.addEventListener('webglcontextrestored',controls);
 globalThis.addEventListener?.('pagehide',()=>{if(active){active.failed=true;end();}if(clipUrl){URL.revokeObjectURL(clipUrl);clipUrl=null;}});
 status.textContent=supported?'Ready when you are.':'This browser does not support scene recording. You can still use Take photo.';controls();
 return {get isOpen(){return dialog.open},get recording(){return !!active}};
}
