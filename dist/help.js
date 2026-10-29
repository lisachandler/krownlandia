export function installHelp({pause}){
 const style=document.createElement('link');style.rel='stylesheet';style.href='help.css';document.head.append(style);
 const dialog=document.createElement('dialog');dialog.id='parkHelp';dialog.setAttribute('aria-labelledby','parkHelpTitle');
 const title=document.createElement('h2');title.id='parkHelpTitle';title.textContent='Make yourself at home';
 const intro=document.createElement('p');intro.textContent='A quick guide to your park. Close this panel to continue exploring.';
 const sections=[
  ['Walk, look & sit',[
   ['Computer','Walk with WASD or the arrow keys. Hold Shift to move faster. Drag the scene to look around, or use Q / R to turn.'],
   ['Touch','Use the left pad to walk and drag the scene to look. Tap the action buttons when they appear.'],
   ['Interact','Move close to a person, ride or rewards station, then press E or tap the action button.'],
   ['Take a seat','Explore → Find a place to rest sets walking directions to nearby seating. Follow the gold trail, then approach a seat and press F or tap Sit. You can look around while seated. Use Stand up to leave; F also leaves seats entered with F.'],
   ['Seated activities','While seated, open View options for the actions available at that seat. Selected community benches and chairs offer stories, project boards or lessons. The Riverbend viewing bench also starts the lantern-boat preview. Closing a story leaves you seated; use Stand up before following walking directions.']
  ]],
  ['Find your next stop',[
   ['Directions','Open Park menu → Explore → Park map and search for a station, home, lounge or gathering place, or choose a destination in a directory. Follow the gold trail on the ground. Directions show Arrived near your destination. Explore → Stop directions clears the trail; choose a new destination to start again.'],
   ['Village tram','Open Village tram in Explore for directions to a stop. Walk to the stop, board and choose your destination. Eldergrove homes are served by the woodland extension. Search tram on the map to find all five stops.'],
   ['Space to enjoy the view','Clear view hides extra panels and the gold trail. Show panels brings them back. Opening a menu pauses walking and rides.'],
   ['Home base','Home & keepsakes → Take me home sets a walking trail to your chosen home. If you have not chosen one, it opens the village directory. Visit a home and choose it as your home base.'],
   ['Lost?','Return to gate in Explore brings you back to the entrance and keeps your collection.'],
   ['Discovery walks','Explore → Community Walk offers the Community, Riverbend and Eldergrove walks. Choose a route and use Guide me to the next activity, or select any stop. Unfinished activities hides completed stops. Ready rewards shows completed activities with unclaimed task rewards. Choose either filter, or turn it off to show all stops. Rewards must be claimed at their stations. Expand Rest along this walk for themed lounge snacks, souvenirs and walking directions.'],
   ['Food and snacks','Activities → Food & snacks searches virtual refreshments by snack or place. Nearest first shows approximate straight-line distances; walking directions follow the paths. Choose Walk here, then use the destination’s action button when you arrive.'],
   ['Lounges and souvenirs','Activities → Lounges & souvenirs searches lounge names, snacks and keepsakes. Use Uncollected souvenirs to find missing pieces, and Nearest first to compare approximate straight-line distances. Choose a lounge for walking directions. At the lounge, open its menu to enjoy a virtual snack, collect its souvenir, take a seat or find the location’s rewards station. Points are claimed separately at the station.'],
   ['Events and anytime activities','Activities → What’s happening, also available on the Town Square community board, shows confirmed event announcements in Pacific Time. An empty calendar means no upcoming events are published. Scheduled now describes the published time window, not verified host attendance. Canceled or postponed events show their previous times. Expand Available anytime for circus, safari and Great Journey directions. Refresh event status updates timing labels; reload the Site to receive newly published announcements.'],
   ['Other visitors','Multiplayer visibility is not available yet. Each visitor explores a separate world; resident characters are part of the prototype. Event listings do not make other players visible, create a shared gathering, or send invitations.'],
   ['Living Sim Portal','Find Living Sim Portal west of Town Square. Search Living Sim or maxigram in Explore → Park map, or use Walk to Living Sim Portal on the Town Square community board. Follow the trail, approach the pavilion, then press E or tap Interact. Visit Living Sim opens its separate website in a new tab only when you choose the link. Accounts and progress are separate from Krownlandia. Place manager: @maxigram.'],
   ['Emoji House','Emoji House is beside Living Sim Portal, west of Town Square. Search emoji, sticker or maxigram on the Park map, or use the Town Square board for walking directions. Approach and interact to view the preferred Signal sticker pack link. It opens in a new tab by choice; individual artwork has not yet been imported into Krownlandia. Place manager: @maxigram.']
  ]],
  ['Keepsakes & settings',[
   ['Points','Visit rewards stations to claim arrival points and see local tasks. Come back after completing a task to claim its reward.'],
   ['Your collection','Home & keepsakes contains your village homes and keepsake journal. Collect lounge souvenirs and meet village hosts to find more things to display at home.'],
   ['Save your visit','Progress saves in this browser when storage is available. Settings → Back up progress lets you download a backup or restore one in another browser.'],
   ['Comfort & photos','The Day view or Night view button is beside Park menu. Its label names the view you can switch to. Settings has graphics quality and optional fountain sound. Try Lightweight graphics if movement feels slow. Activities → Take photo downloads a picture of the world. Activities → Record video captures a silent scene clip up to 30 seconds, without menus, webcam or microphone. Use Stop recording, then Video ready · preview to download. Download before leaving or recording a replacement; clips are not part of progress backups.'],
   ['Souvenir saving','If a lounge souvenir cannot be saved, it remains available for this visit. Keep this page open and use Retry saving souvenirs in Lounges & souvenirs or a lounge menu when browser storage is available again. Check that the panel confirms souvenirs are saved before leaving.'],
   ['My points over time','Open Activities → Rewards, then expand My points over time in the all-stations passport. See this hour, today, this month, this year and all-time points in Pacific Time. New point claims receive device-clock timestamps; undated legacy points remain in All time. This private history is not a public or verified leaderboard. Period boundaries do not erase lifetime points. Settings → Back up progress includes the recorded history; restoring older progress preserves points but cannot invent missing dates.']
  ]]
 ];
 dialog.append(title,intro);
 const label=document.createElement('label');label.htmlFor='helpSearch';label.textContent='Search help';
 const search=document.createElement('input');search.id='helpSearch';search.type='search';search.value='';search.placeholder='Try seating, rewards or backup';
 const clear=document.createElement('button');clear.id='helpSearchClear';clear.textContent='Clear search';clear.hidden=true;
 const count=document.createElement('p');count.id='helpSearchCount';count.setAttribute('role','status');search.setAttribute('aria-describedby','helpSearchCount');
 dialog.append(label,search,clear,count);
 const groups=sections.map(([heading,rows],index)=>{const details=document.createElement('details');details.id='helpSection-'+index;details.open=index===0;const summary=document.createElement('summary');summary.textContent=heading;details.append(summary);const entries=rows.map(([label,copy],i)=>{const p=document.createElement('p'),strong=document.createElement('strong'),text=document.createElement('span');p.id='helpEntry-'+index+'-'+i;strong.textContent=label+'. ';text.textContent=copy;p.append(strong,text);details.append(p);return {p,text:heading+' '+label+' '+copy};});dialog.append(details);return {details,entries};});
 const normalize=value=>value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim();let previousOpen=null;
 function filter(){const query=normalize(search.value.trim()),terms=query.split(/\s+/);let matches=0;
  if(query&&!previousOpen)previousOpen=groups.map(g=>g.details.open);
  groups.forEach(({details,entries},i)=>{let found=0;entries.forEach(({p,text})=>{p.hidden=!!query&&!terms.every(term=>normalize(text).includes(term));if(!p.hidden)found++;});matches+=found;details.hidden=!found;if(query)details.open=!!found;else if(previousOpen)details.open=previousOpen[i];});
  if(!query)previousOpen=null;clear.hidden=!query;count.hidden=!query;count.textContent=query?(matches?matches+' help '+(matches===1?'topic':'topics')+' found.':'No matching help. Try fewer words or clear search.') : '';
 }
 search.oninput=filter;clear.onclick=()=>{search.value='';filter();search.focus();};filter();
 const close=document.createElement('button');close.id='parkHelpClose';close.textContent='Back to the world';close.onclick=()=>{dialog.close();pause();};dialog.append(close);dialog.addEventListener('close',pause);document.body.append(dialog);
 const button=document.createElement('button');button.id='helpButton';button.textContent='Controls & help';button.onclick=()=>{pause();dialog.showModal();};document.querySelector('nav').append(button);
 return {get isOpen(){return dialog.open}};
}
