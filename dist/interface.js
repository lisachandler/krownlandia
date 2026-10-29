export function installInterface({pause=()=>{}}={}){
 const $=s=>document.querySelector(s),body=document.body;
 const style=document.createElement('link');style.rel='stylesheet';style.href='interface.css';document.head.append(style);
 const controls=document.createElement('div');controls.id='viewControls';
 const menu=document.createElement('button');menu.id='parkMenuToggle';menu.textContent='Park menu';menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-controls','parkNavigation');
 const clear=document.createElement('button');clear.id='clearView';clear.textContent='Clear view';clear.setAttribute('aria-pressed','false');
 const lighting=$('#night');lighting.textContent='Night view';lighting.title='Switch to night';lighting.setAttribute('aria-label','Switch to night');controls.append(menu,lighting,clear);body.append(controls);$('nav').id='parkNavigation';$('nav').setAttribute('aria-label','Park navigation');
 const details=document.createElement('button');details.id='questToggle';details.textContent='Show quest';details.setAttribute('aria-expanded','false');$('#quest').append(details);
 let expanded=false,menuOpen=false,clearView=false;
 body.classList.add('compact-interface');
 const sync=()=>{body.classList.toggle('quest-expanded',expanded);body.classList.toggle('park-menu-open',menuOpen&&!clearView);body.classList.toggle('clear-view',clearView);menu.setAttribute('aria-expanded',String(menuOpen&&!clearView));details.setAttribute('aria-expanded',String(expanded));details.textContent=expanded?'Hide quest':'Show quest';clear.textContent=clearView?'Show panels':'Clear view';clear.setAttribute('aria-pressed',String(clearView));};
 menu.onclick=()=>{if(clearView){clearView=false;menuOpen=true;}else menuOpen=!menuOpen;if(menuOpen)pause();sync();};
 clear.onclick=()=>{clearView=!clearView;menuOpen=false;sync();};
 details.onclick=()=>{expanded=!expanded;sync();};
 // Selecting a menu item returns space to the scene immediately.
 $('nav').addEventListener('click',e=>{if(e.target.closest('button')){menuOpen=false;sync();}});
 $('nav').addEventListener('keydown',e=>{if(e.key==='Escape'){menuOpen=false;sync();menu.focus();e.preventDefault();}});
 menu.addEventListener('keydown',e=>{if(e.key==='Escape'){menuOpen=false;sync();e.preventDefault();}});
 sync();
 return {get isOpen(){return menuOpen&&!clearView},organize(){
  const groups=[['explore','Explore',['mapButton','communityWalkButton','tramButton','findRest','stopDirections','home']],['activities','Activities',['eventsButton','rewardButton','foodGuideButton','loungesButton','circusProgramButton','takePhoto','recordVideo']],['home','Home & keepsakes',['takeMeHome','villagesButton','journalButton']],['settings','Settings',['sound','graphicsButton','helpButton','backupButton','reference']]];
  const sections=groups.map(([id,label,ids])=>{const section=document.createElement('section');section.className='park-menu-group';section.id='menuGroup-'+id;const heading=document.createElement('h2');heading.id='menuHeading-'+id;heading.textContent=label;section.setAttribute('aria-labelledby',heading.id);const actions=document.createElement('div');actions.className='park-menu-actions';for(const name of ids){const button=$('#'+name);if(button)actions.append(button);}section.append(heading,actions);return section;});
  $('nav').replaceChildren(...sections);
 }};
}
