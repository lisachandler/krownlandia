function installRecoveryBackup(){
 const panel=document.querySelector('#gatewayBackup'),prepare=document.querySelector('#gatewayBackupPrepare'),download=document.querySelector('#gatewayBackupDownload'),status=document.querySelector('#gatewayBackupStatus');
 let url=null,revision=0;
 function clearDownload(){
  download.hidden=true;download.removeAttribute('href');download.removeAttribute('download');
  if(url){URL.revokeObjectURL(url);url=null;}
 }
 panel.ontoggle=()=>{if(!panel.open){revision++;clearDownload();status.textContent='';prepare.disabled=false;}};
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
  installRecoveryBackup();
  document.querySelector('#gatewayReading').hidden=false;
  document.querySelector('#gatewayReadingTitle').focus();
  console.error('Krownlandia 3D startup failed.',error);
  return false;
 }
}
await startGateway();
