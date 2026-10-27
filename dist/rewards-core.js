// Every future ride can add the same station + arrival + task definition.
export const STATIONS=[
 {id:'arrival',name:'Arrival Plaza',x:-4,z:26,arrival:10,task:{id:'first-gate',label:'Check in at the Crown Gate',points:20}},
 {id:'gate',name:'Crown Gate',x:4,z:10,arrival:10,task:{id:'three-stops',label:'Check in at three different stations',points:15}},
 {id:'gardens',name:'Welcome Gardens',x:-5,z:-4,arrival:10,task:{id:'meet-pip',label:'Talk to Pip, Keeper of the Gardens',points:25}},
 {id:'shop',name:'Crown & Co.',x:-20,z:-9,arrival:10,task:{id:'collection',label:'Open your collection at this station',points:15}},
 {id:'cafe',name:"Lisa's Coffee Shop",x:20,z:-9,arrival:10,task:{id:'rest',label:"Take a 15-second break near Lisa's rewards station",points:15}},
 {id:'fountain',name:'Royal Plaza Fountain',x:4,z:-25,arrival:10,task:{id:'night-water',label:'Visit this station after dark',points:25}},
 {id:'discovery',name:'Discovery Garden',x:17,z:-53,arrival:10,task:{id:'find-crown',label:"Find the Founder's Crown pin",points:50}},
 {id:'palace',name:'Crown Palace Approach',x:4,z:-73,arrival:10,task:{id:'all-stops',label:'Check in at all eight Gateway stations',points:50}},
 {id:'journey',name:'The Great Journey',x:-26,z:-34,arrival:10,task:{id:'great-journey',label:'Complete all six stops of The Great Journey',points:75}},
 {id:'safari',name:'Safari entrance',x:44,z:-22,arrival:10,task:{id:'safari-complete',label:'Visit all six safari habitats and return to the entrance',points:60}},
 {id:'popcorn',name:'Circus Popcorn',x:35,z:-51,arrival:10,task:{id:'popcorn-pickup',label:'Pick up a serving at the popcorn stand inside the tent',points:15}},
 {id:'circus',name:'Crown Circus',x:45,z:-49,arrival:10,task:{id:'circus-complete',label:'Watch the complete 36-second circus performance',points:30}},
 {id:'meadow',name:'Meadow Village',x:-29,z:83,arrival:10,task:{id:'visit-meadow',label:'Step inside a Meadow Village home',points:20}},
 {id:'harbor',name:'Bluewater Village',x:29,z:83,arrival:10,task:{id:'visit-harbor',label:'Step inside a Bluewater Village home',points:20}},
 {id:'woodland',name:'Woodland Village',x:0,z:123,arrival:10,task:{id:'visit-woodland',label:'Step inside a Woodland Village home',points:20}},
 {id:'roasted',name:'Roasted · Crown Palace',x:5,z:-85,arrival:10,task:{id:'roasted-return',label:'Choose a vegetable bowl, then return its reusable container',points:25}}
 ,{id:'builders',name:'Making of Krownlandia Garden',x:-18,z:33,arrival:10,task:{id:'builders-story',label:'Explore all three garden exhibit chapters and collect the Builder’s Crown',points:20}}
 ,{id:'office',name:'Community Office Garden',x:13.5,z:-2.3,arrival:10,task:{id:'office-idea',label:'Explore a community idea at the garden project board',points:20}}
 ,{id:'library',name:'Library of Alexandria',x:39,z:49,arrival:10,task:{id:'library-read',label:'Explore three readings and collect the Alexandria Bookmark',points:20}}
 ,{id:'square',name:'Krownlandia Town Square',x:8,z:57,arrival:10,task:{id:'square-welcome',label:'Read the community welcome at the Town Square board',points:20}}
 ,{id:'eldergrove',name:'Eldergrove',x:45,z:128,arrival:10,task:{id:'eldergrove-trail',label:'Discover the Great Elder Tree, woodcraft shelter and herb garden',points:20}}
 ,{id:'eldergrove-homes',name:'Eldergrove Homes',x:5,z:164,arrival:10,task:{id:'visit-eldergrove',label:'Step inside an Eldergrove home',points:20}}
 ,{id:'produce',name:'Community Produce Garden',x:-30,z:53,arrival:10,task:{id:'produce-water',label:'Water the vegetable beds at the garden care bench',points:20}}
 ,{id:'clubhouse',name:'Krownlandia Clubhouse',x:-19,z:163,arrival:10,task:{id:'clubhouse-board',label:'Explore a topic at the Place Managers board',points:20}}
 ,{id:'generalstore',name:'General Store',x:38,z:-5,arrival:10,task:{id:'generalstore-board',label:'Browse a sample product at the General Store counter',points:20}}
 ,{id:'riverbend',name:'Riverbend Riverside',x:-36,z:128,arrival:10,task:{id:'riverbend-board',label:'Explore a story at the Riverbend discovery display',points:20}}
 ,{id:'riverbend-homes',name:'Riverbend Cottages',x:-8,z:163,arrival:10,task:{id:'visit-riverbend',label:'Step inside a Riverbend cottage',points:20}}
 ,{id:'bridge',name:'Krown Bridge',x:-57,z:158,arrival:10,task:{id:'bridge-board',label:'Read the Krown Bridge story at the west-bank lookout',points:20}}
 ,{id:'school',name:'Magic School',x:-57,z:148,arrival:10,task:{id:'school-pattern',label:'Match Gold, Teal and Rose in the lantern classroom',points:20}}
];
export function createRewards(storage){
 const key='krownlandia-rewards-v1',valid=new Map(STATIONS.flatMap(s=>[[s.id+':arrival',s.arrival],[s.id+':task',s.task.points]])),tasks=new Set(STATIONS.map(s=>s.task.id));
 valid.set('cafe:pin',0);for(const id of ['giraffe','elephant','zebra','lion','hippo','flamingo'])tasks.add('safari-sighting-'+id);tasks.add('coffee-order');tasks.add('roasted-order');for(const id of [0,1,2]){tasks.add('library-page-'+id);tasks.add('builders-page-'+id);}const elderStops=['tree','craft','herbs'];for(const id of elderStops)tasks.add('eldergrove-stop-'+id);
 const meals=['Rainbow Roast','Mediterranean Roast','Harvest Roast'];let claims=new Set(),done=new Set(),saved=true,meal=null;
 try{const data=JSON.parse(storage.getItem(key)||'{}');if(Array.isArray(data.claims))claims=new Set(data.claims.filter(x=>valid.has(x)));if(Array.isArray(data.done))done=new Set(data.done.filter(x=>tasks.has(x)));if(meals.includes(data.meal?.name)&&['ready','carried'].includes(data.meal?.status))meal={name:data.meal.name,status:data.meal.status};}catch{saved=false;}
 const persist=()=>{try{storage.setItem(key,JSON.stringify({claims:[...claims],done:[...done],meal}));saved=true;}catch{saved=false;}};
 const visits=()=>STATIONS.filter(s=>claims.has(s.id+':arrival')).length;
 function mark(id){if(tasks.has(id)&&!done.has(id)){done.add(id);persist();}}
 function recordEldergrove(id){if(!elderStops.includes(id))return false;done.add('eldergrove-stop-'+id);if(elderStops.every(s=>done.has('eldergrove-stop-'+s)))done.add('eldergrove-trail');persist();return true;}
 function derive(){if(elderStops.every(s=>done.has('eldergrove-stop-'+s)))mark('eldergrove-trail');if(claims.has('gate:arrival'))mark('first-gate');if(visits()>=3)mark('three-stops');if(STATIONS.filter(s=>!['journey','safari','roasted','circus','popcorn','meadow','harbor','woodland','builders','office','square','library','eldergrove','eldergrove-homes','produce','clubhouse','generalstore','riverbend','riverbend-homes','bridge','school'].includes(s.id)).every(s=>claims.has(s.id+':arrival')))mark('all-stops');}
 function claim(id,type,near){const s=STATIONS.find(s=>s.id===id);if(!s||!['arrival','task'].includes(type)||near!==id)return 0;const k=id+':'+type;if(claims.has(k)||type==='task'&&!done.has(s.task.id))return 0;claims.add(k);derive();persist();return valid.get(k);}
 derive();
 function claimCoffeePin(near){if(near!=='cafe'||!done.has('coffee-order')||claims.has('cafe:pin'))return false;claims.add('cafe:pin');persist();return true;}
 function orderRoasted(name,near){if(near!==true||meal||!meals.includes(name))return false;meal={name,status:'ready'};done.add('roasted-order');persist();return true;}
 function pickupRoasted(near){if(near!==true||meal?.status!=='ready')return false;meal={...meal,status:'carried'};persist();return true;}
 function returnRoasted(near){if(near!==true||meal?.status!=='carried')return false;meal=null;done.add('roasted-return');persist();return true;}
 function nextReward(position={}){const x=Number.isFinite(position.x)?position.x:0,z=Number.isFinite(position.z)?position.z:30;const choices=[];for(const s of STATIONS){const taskReady=done.has(s.task.id)&&!claims.has(s.id+':task'),pinReady=s.id==='cafe'&&done.has('coffee-order')&&!claims.has('cafe:pin');const steps=s.id==='library'?[0,1,2].map(i=>'library-page-'+i):s.id==='builders'?[0,1,2].map(i=>'builders-page-'+i):s.id==='eldergrove'?elderStops.map(id=>'eldergrove-stop-'+id):[];const progress=steps.filter(id=>done.has(id)).length;const started=progress>0&&!done.has(s.task.id)&&!claims.has(s.id+':task');const kind=taskReady?'task':pinReady?'pin':started?'progress':!claims.has(s.id+':arrival')?'arrival':!claims.has(s.id+':task')?'pending':null;if(kind)choices.push({id:s.id,name:s.name,kind,points:kind==='arrival'?s.arrival:kind==='task'?s.task.points:0,task:s.task.label,progress,total:steps.length,rank:['task','pin'].includes(kind)?0:kind==='progress'?1:kind==='arrival'?2:3,distance:Math.hypot(s.x-x,s.z-z)});}choices.sort((a,b)=>a.rank-b.rank||a.distance-b.distance);return choices[0]||null;}
 return {mark,recordEldergrove,nextReward,claim,claimCoffeePin,orderRoasted,pickupRoasted,returnRoasted,state:()=>({meal:meal?{...meal}:null,points:[...claims].reduce((n,k)=>n+valid.get(k),0),visits:visits(),saved,claims:[...claims],done:[...done],pins:[...(claims.has('journey:task')?['great-journey']:[]),...(claims.has('cafe:pin')?['lisas-coffee']:[]),...(claims.has('safari:task')?['safari-explorer']:[])]}),
 status:id=>({arrived:claims.has(id+':arrival'),claimed:claims.has(id+':task'),ready:done.has(STATIONS.find(s=>s.id===id)?.task.id)})};
}
