export function installSketchpad(panel){
 const tiles=Array.from(panel.querySelectorAll('[data-tile]'));
 const reset=panel.querySelector('#sketchReset'), status=panel.querySelector('#sketchStatus');
 const ink=new Set();
 function render(){
  tiles.forEach(tile=>{
   const marked=ink.has(tile);
   tile.setAttribute('aria-pressed',String(marked));
   tile.textContent=marked?'×':'·';
  });
  reset.disabled=!ink.size;
  const marked=tiles.filter(tile=>ink.has(tile)).map(tile=>tile.getAttribute('aria-label').toLowerCase());
  status.textContent=marked.length?'Marked: '+marked.join('; ')+'.':'The sketch is blank.';
 }
 tiles.forEach(tile=>{tile.onclick=()=>{
  if(!panel.open)return;
  if(ink.has(tile))ink.delete(tile);else ink.add(tile);
  render();
 };});
 reset.onclick=()=>{
  if(!panel.open||!ink.size)return;
  ink.clear();render();tiles[0].focus();
 };
 render();panel.hidden=false;
}

const panel=typeof document==='undefined'?null:document.querySelector('#artsSketchpad');
if(panel)installSketchpad(panel);
