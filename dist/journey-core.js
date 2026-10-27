export const CHAPTERS=[
 {title:'A seed of possibility',action:'Plant the seed',text:'Help a new garden take root.',color:'#75b66a'},
 {title:'Water brings life',action:'Restore the spring',text:'Bring fresh water back to the valley.',color:'#49bfe5'},
 {title:'Room for the wild',action:'Open the sanctuary',text:'Create a safe place for wildlife to flourish.',color:'#dfad62'},
 {title:'Better together',action:'Light the gathering place',text:'Connect a community around a shared light.',color:'#efaa79'},
 {title:'Imagine a brighter world',action:'Build the dream',text:'Raise a sparkling symbol of possibility.',color:'#ba91df'},
 {title:'Carry the light forward',action:'Make the crown shine',text:'Bring everything you have discovered into the future.',color:'#f0cf72'}
];
export function createJourney(){
 let phase='idle',stop=-1,elapsed=0,completed=false;
 return {start(){if(phase!=='idle')return false;phase='travel';stop=0;elapsed=0;return true;},
 tick(dt){if(phase!=='travel'&&phase!=='return')return;elapsed=Math.min(6,elapsed+Math.max(0,Math.min(dt,.1)));if(elapsed>=6){if(phase==='return'){completed=true;phase='idle';}else phase='stop';}},
 act(){if(phase!=='stop')return false;stop++;elapsed=0;phase=stop===CHAPTERS.length?'return':'travel';return true;},
 cancel(){phase='idle';stop=-1;elapsed=0;},
 state:()=>({phase,stop,progress:elapsed/6,completed,active:phase!=='idle'})};
}
