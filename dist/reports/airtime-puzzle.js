const rules={
 morning:[['Keep Interview last.',order=>order[2]==='interview'],['Put Song after Weather.',order=>order.indexOf('song')>order.indexOf('weather')]],
 evening:[['Keep News in the middle.',order=>order[1]==='news'],['Put Instrumental before Story.',order=>order.indexOf('instrumental')<order.indexOf('story')]]
};
export function installAirtimePuzzle(form){
 const checks=rules[form.dataset.puzzle],slots=[...form.querySelectorAll('[data-slot]')],status=form.querySelector('[role=status]');
 if(!checks||slots.length!==3||!status)return;
 form.onsubmit=event=>{
  event.preventDefault();
  const order=slots.map(slot=>slot.value);
  if(order.some(v=>!v)){status.textContent='Choose a segment for every slot.';return;}
  if(new Set(order).size!==3){status.textContent='Use each segment once.';return;}
  const problem=checks.find(([,passes])=>!passes(order));
  status.textContent=problem?'Try again. '+problem[0]:'That order fits both clues.';
 };
 form.onreset=()=>{status.textContent='';};
 form.hidden=false;
}
if(typeof document!=='undefined')document.querySelectorAll('[data-puzzle]').forEach(installAirtimePuzzle);
