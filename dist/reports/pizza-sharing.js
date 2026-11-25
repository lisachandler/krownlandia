export function installPizzaPuzzle(panel){
 const buttons=[...panel.querySelectorAll('[data-slice]')];
 const status=panel.querySelector('#pizzaStatus'),check=panel.querySelector('#pizzaCheck'),reset=panel.querySelector('#pizzaReset');
 const chosen=new Set(), mushroom=new Set([1,3,6,8]);
 function describe(note=''){
  const slices=[...chosen].sort((a,b)=>a-b),mushrooms=slices.filter(n=>mushroom.has(n)).length;
  status.textContent='First plate: '+(slices.length?'slices '+slices.join(', ')+' · '+mushrooms+' mushroom, '+(slices.length-mushrooms)+' pepper.':'no slices.')+(note?' '+note:'');
 }
 for(const button of buttons)button.onclick=()=>{
  if(!panel.open)return;
  const n=Number(button.dataset.slice);
  if(chosen.has(n))chosen.delete(n);else if(chosen.size<4)chosen.add(n);else{describe('Remove a slice before choosing another.');return;}
  button.setAttribute('aria-pressed',String(chosen.has(n)));describe();
 };
 check.onclick=()=>{
  if(!panel.open)return;
  if(chosen.size!==4){describe('Choose four slices.');return;}
  if([...chosen].filter(n=>mushroom.has(n)).length!==2){describe('Choose two of each topping.');return;}
  if([1,2,3,4].some(n=>chosen.has(n)===chosen.has(n+4))){describe('Put one slice from each opposite pair on this plate.');return;}
  describe('Both plates work: four slices, two of each topping, and every opposite pair split.');
 };
 reset.onclick=()=>{
  if(!panel.open)return;
  chosen.clear();buttons.forEach(button=>button.setAttribute('aria-pressed','false'));describe();buttons[0].focus();
 };
 describe();panel.hidden=false;
}
const panel=typeof document==='undefined'?null:document.querySelector('#pizzaPuzzle');
if(panel)installPizzaPuzzle(panel);
