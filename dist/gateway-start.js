import {createVisit} from './visit-core.js';

function installGatewayBackup(){
 const panel=document.querySelector('#gatewayBackup'),prepare=document.querySelector('#gatewayBackupPrepare'),download=document.querySelector('#gatewayBackupDownload'),status=document.querySelector('#gatewayBackupStatus');
 const inspect=document.querySelector('#gatewayBackupInspect'),file=document.querySelector('#gatewayBackupFile'),inspection=document.querySelector('#gatewayBackupInspection');
 let url=null,revision=0,inspectionRevision=0;
 function resetInspection(){inspectionRevision++;file.value='';inspection.textContent='';}
 inspect.hidden=false;
 inspect.ontoggle=()=>{if(!inspect.open)resetInspection();};
 file.onchange=async()=>{
  if(!panel.open||!inspect.open)return;
  const request=++inspectionRevision,selected=file.files?.[0];
  const active=()=>request===inspectionRevision&&panel.open&&inspect.open;
  inspection.textContent=selected?'Checking your backup…':'';
  if(!selected)return;
  try{
   if(selected.size>100000)throw Error('Backup is too large.');
   const {parseBackup}=await import('./backup-core.js');
   if(!active())return;
   const text=await selected.text();
   if(!active())return;
   const {summary,createdAt}=parseBackup(text);
   const date=createdAt?'Created '+new Date(createdAt).toLocaleString()+' (your local time). ':'Creation time unavailable. ';
   const keepsakes=summary.keepsakes===1?'keepsake':'keepsakes';
   inspection.textContent=date+summary.points+' points · '+summary.keepsakes+' '+keepsakes+' · Home: '+summary.home+'. No progress was changed.';
  }catch{
   if(active())inspection.textContent='This file could not be read as a Krownlandia backup. No progress was changed.';
  }
 };
 function clearDownload(){
  download.hidden=true;download.removeAttribute('href');download.removeAttribute('download');
  if(url){URL.revokeObjectURL(url);url=null;}
 }
 function reset(){
  revision++;clearDownload();status.textContent='';prepare.disabled=false;inspect.open=false;resetInspection();
 }
 panel.ontoggle=()=>{if(!panel.open)reset();};
 prepare.onclick=async()=>{
  if(!panel.open||prepare.disabled)return;
  const request=++revision;
  clearDownload();prepare.disabled=true;status.textContent='Preparing your backup…';
  try{
   const {exportBackup,parseBackup}=await import('./backup-core.js');
   if(request!==revision||!panel.open)return;
   const text=exportBackup(localStorage),data=parseBackup(text);
   if(Object.values(data.data).every(value=>value===null)){
    status.textContent='No saved park progress was found in this browser.';return;
   }
   url=URL.createObjectURL(new Blob([text],{type:'application/json'}));
   download.href=url;download.download='krownlandia-progress-'+data.createdAt.replace(/[:.]/g,'-')+'.json';
   download.hidden=false;status.textContent='Backup ready. Choose Download backup file.';
  }catch{
   if(request===revision&&panel.open)status.textContent='Could not prepare a backup. Your browser storage may be unavailable or the saved data could not be read.';
  }finally{
   if(request===revision)prepare.disabled=false;
  }
 };
 return ()=>{panel.open=false;reset();};
}

// Keep recovery separate from the game module so failed dependency loads are caught too.
export async function startGateway(loadWorld=()=>import('./world.js')){
 try{
  await loadWorld();
  return true;
 }catch(error){
  for(const selector of ['#world','#welcome','#quest','#crosshair','#joystick','#place','#interact','nav']){
   const control=document.querySelector(selector);
   control.hidden=true;
   control.inert=true;
  }
  document.querySelector('#gatewayRecoveryTools').append(document.querySelector('#gatewayBackup'));
  document.querySelector('#gatewayReading').hidden=false;
  document.querySelector('#gatewayReadingTitle').focus();
  console.error('Krownlandia 3D startup failed.',error);
  return false;
 }
}
// The text gateway and its links work without loading the park or creating WebGL.
export function installGatewayEntry(loadWorld){
 const $=selector=>document.querySelector(selector);
 const entry=$('#enter'),gate=$('#startAtGate'),status=$('#gatewayLoading');
 const closeBackup=installGatewayBackup();
 // Preview only; world.js still validates saved positions against actual scenery.
 const preview=createVisit({getItem:key=>localStorage.getItem(key)},()=>false).read();
 if(preview){
  entry.textContent='Continue exploring';
  gate.hidden=false;
  const summary=$('#resumeInfo');
  summary.hidden=false;
  summary.textContent='Saved visit found. Start at the gate to keep your rewards, home and keepsakes while changing your starting spot.';
 }
 let loading=false;
 async function enter(useGate){
  if(loading)return;
  loading=true;
  closeBackup();
  // Keep the focused button in place while import is pending. Ignore repeat activations.
  entry.setAttribute('aria-disabled','true');gate.setAttribute('aria-disabled','true');
  status.textContent='Loading the 3D park…';
  if(!await startGateway(loadWorld))return;
  entry.removeAttribute('aria-disabled');gate.removeAttribute('aria-disabled');
  status.textContent='';
  document.body.classList.remove('gateway-pending');
  (useGate?gate:entry).onclick();
  $('#world').focus();
 }
 entry.onclick=()=>enter(false);
 gate.onclick=()=>enter(true);
}

installGatewayEntry();
