import {installWhisperingPines} from './whispering-pines.js';
import {installCompositionStudio} from './composition-studio.js';
import {installStonehearth} from './stonehearth.js';
import {installFireflyBenches} from './firefly-benches.js';
import {installFoodGuide} from './food-guide.js';
import {installCommunityWalk} from './community-walk.js';
import {installMagicSchool} from './magic-school.js';
import {installBridge} from './bridge.js';
import {installRiverbend} from './riverbend.js';
import {installGeneralStore} from './general-store.js';
import {installClubhouse} from './clubhouse.js';
import {installProduceGarden} from './produce-garden.js';
import {installEldergrove} from './eldergrove.js';
import {installLibrary} from './library.js';
import {installTownSquare} from './town-square.js';
import {installOfficeGarden} from './office-garden.js';
import {installBuilders} from './builders.js';
import {installHelp} from './help.js';
import {installBackup} from './backup.js';
import {installJournal} from './journal.js';
import {installResidents} from './residents.js';
import {installTram} from './tram.js';
import {installVillages} from './villages.js';
import {installSeating} from './seating.js';
import {installLounges} from './lounges.js';
import {installPopcorn} from './popcorn.js';
import {installCircus} from './circus.js';
import {createVisit} from './visit-core.js';
import * as T from './vendor/three.module.js';
import {enrich} from './atmosphere.js';
import {finishGardens,batchStatic} from './scenery.js';
import {installRewards} from './rewards.js';
import {installJourney} from './journey.js';
import {enrichCourtyard} from './courtyard.js';
import {installParkMap} from './park-map.js';
import {installCoffeeScene} from './coffee-scene.js';
import {installInterface} from './interface.js';
import {installSafari} from './safari.js';
import {installPhotography} from './photography.js';
import {installVideo} from './video.js';
import {installRoasted} from './roasted.js';
import {installNavigation} from './navigation.js';
import {installGraphics} from './graphics.js';
let viewportWidth=Number.isFinite(innerWidth)&&innerWidth>0?innerWidth:1,viewportHeight=Number.isFinite(innerHeight)&&innerHeight>0?innerHeight:1;
const $=s=>document.querySelector(s), scene=new T.Scene(), camera=new T.PerspectiveCamera(65,viewportWidth/viewportHeight,.1,350);
const renderer=new T.WebGLRenderer({antialias:true});
renderer.setSize(viewportWidth,viewportHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;$('#world').append(renderer.domElement);
scene.background=new T.Color('#9fcfe5');scene.fog=new T.Fog('#9fcfe5',85,240);camera.position.set(0,1.75,30);camera.rotation.order='YXZ';
const hemi=new T.HemisphereLight(0xcdeeff,0x748253,2.1);scene.add(hemi);
const sun=new T.DirectionalLight(0xffe4b2,3.3);sun.position.set(-30,65,25);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-65,right:65,top:65,bottom:-80,far:200});sun.shadow.bias=-.0003;scene.add(sun);
const mat=(c,rough=.65,metal=0)=>new T.MeshStandardMaterial({color:c,roughness:rough,metalness:metal});
const stone=mat('#ebdfc6'),trim=mat('#c7b48e'),gold=mat('#efbe51',.24,.78),navy=mat('#123b67'),blue=mat('#2db4e6',.14,.45),grass=mat('#5e8751'),leaf=mat('#2b653e'),wood=mat('#6a4932'),white=mat('#fcf6df');
const glass=new T.MeshPhysicalMaterial({color:'#98d6dd',transparent:true,opacity:.35,roughness:.12,metalness:.2,side:T.DoubleSide,depthWrite:false});
const colliders=[],waterMeshes=[],lamps=[],pipGroup=new T.Group();
function mesh(g,m,x,y,z,parent=scene){let o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function box(x,y,z,w,h,d,m=stone,solid=false,parent=scene){let o=mesh(new T.BoxGeometry(w,h,d),m,x,y,z,parent);if(solid)colliders.push({x,z,w:w/2+.4,d:d/2+.4});return o;}
function cyl(x,y,z,r,h,m=stone,top=r,parent=scene){return mesh(new T.CylinderGeometry(top,r,h,32),m,x,y,z,parent);}
function sphere(x,y,z,r,m,parent=scene){return mesh(new T.SphereGeometry(r,16,12),m,x,y,z,parent);}
function tube(points,r,m,parent=scene){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),48,r,8,false),m,0,0,0,parent);}
function sign(text,x,y,z,w=8,h=1.3,color='#edcc7d',bg='#143451',parent=scene){
 const c=document.createElement('canvas'),density=Math.min(160/h,2048/w);c.width=Math.round(w*density);c.height=Math.round(h*density);
 const a=c.getContext('2d'),padding=Math.max(6,c.height*.1);a.fillStyle=bg;a.fillRect(0,0,c.width,c.height);a.strokeStyle=color;a.lineWidth=Math.max(2,c.height*.02);a.strokeRect(padding/2,padding/2,c.width-padding,c.height-padding);a.textAlign='center';a.textBaseline='middle';
 let fontSize=Math.floor(c.height*.55);a.font=fontSize+'px Georgia';const measured=a.measureText(text).width;if(measured>c.width-padding*2){fontSize=Math.max(1,Math.floor(fontSize*(c.width-padding*2)/measured));a.font=fontSize+'px Georgia';}
 a.fillStyle=color;a.fillText(text,c.width/2,c.height/2+1);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const board=mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:tex,side:T.DoubleSide}),x,y,z,parent);board.name='Park sign · '+text;return board;
}
// Full-dimensional terrain and paths.
box(0,-.3,-25,130,.5,180,grass);box(0,0,-25,14,.16,145,stone);
cyl(0,.02,-35,18,.18,stone);box(-21,.01,-25,42,.15,7,stone);box(21,.01,-50,42,.15,6,stone);
for(let z=35;z>-98;z-=3){for(let x=-6;x<=6;x+=3){box(x,.092,z,2.96,.015,2.96,(Math.round(z)%2===0)?stone:trim);}}
for(let s of [-1,1])box(s*7.3,.13,-20,.22,.22,120,trim);
// Krown gate with two supporting piers, a true open arch, and dimensional crown.
for(let s of [-1,1]){box(s*8,5,14,2.5,10,3,stone,true);box(s*8,.35,14,3.3,.7,3.8,trim);box(s*8,9.9,14,3.2,.55,3.8,gold);cyl(s*8,10.7,14,1.3,1.2,navy,.7);sphere(s*8,11.5,14,.3,gold);box(s*8,6,15.6,1.65,5,.12,navy);sign('PEOPLE · PLANET',s*8,6.2,15.68,1.6,.32);sign('A BRIGHTER WORLD',s*8,5.7,15.68,1.6,.32);}
const archPts=[];for(let i=0;i<=40;i++){let x=-8+16*i/40;archPts.push([x,8.2+2*Math.sqrt(Math.max(0,1-x*x/64)),14]);}tube(archPts,.62,stone);tube(archPts.map(p=>[p[0],p[1]+.65,p[2]]),.12,gold);sign('K R O W N L A N D I A',0,10.45,14.68,12,1.2);
for(let i=0;i<9;i++){let x=-6+i*1.5,h=1.6+(i===4?2.8:i%2?0:1.5);tube([[x-.7,11.2,14],[x,11.2+h,14],[x+.7,11.2,14]],.13,gold);sphere(x,11.2+h,14,.2,gold);mesh(new T.OctahedronGeometry(.37),blue,x,11.8,14.18);}
// Glass roof wings use curved structural ribs and translucent canopy meshes.
for(let s of [-1,1]){for(let z=9;z<=19;z+=5){let pts=[];for(let i=0;i<=12;i++){let x=9+i;pts.push([s*x,8-((x-9)/11)**2*3,z]);}tube(pts,.09,trim);}
for(let i=0;i<11;i++){let x=9+i,y=8-((x-9)/11)**2*3;let pane=box(s*(x+.5),y-.08,14,1.05,.06,10,glass);pane.rotation.z=s*(-.03-i*.04);}for(let x of [12,19])for(let z of [9,19])cyl(s*x,2.5,z,.12,5,trim);}
// Fountain basin, tiers, and moving spray particles.
cyl(0,.32,-35,6.6,.65,trim);cyl(0,.68,-35,6.05,.12,blue);colliders.push({x:0,z:-35,r:6.8});cyl(0,1,-35,1.3,1.2,stone);cyl(0,1.8,-35,3,.35,stone);cyl(0,2,-35,2.7,.08,blue);cyl(0,2.8,-35,.7,1.8,gold);cyl(0,3.6,-35,1.4,.2,stone);sphere(0,4,-35,.4,gold);
const drops=new T.InstancedMesh(new T.SphereGeometry(.065,5,4),new T.MeshStandardMaterial({color:'#c5f2ff',roughness:.1,emissive:'#77bbcc',emissiveIntensity:.15}),240);drops.name="Royal Plaza Fountain spray";scene.add(drops);const dummy=new T.Object3D();
// Palace exterior, conservatory hall and needle towers.
box(-12.5,5,-88,.4,10,9,stone,true);box(12.5,5,-88,.4,10,9,stone,true);box(0,5,-92.5,25,10,.4,stone,true);for(const x of [-7.5,7.5])box(x,3,-83.5,10,6,.4,stone,true);box(0,8,-88,25,4,9,stone);sign('KROWN PALACE',0,8,-82.8,10,1);
for(let x of [-14,-9,0,9,14]){let h=x===0?23:Math.abs(x)===9?17:13;cyl(x,(h+(x===0?10:0))/2,-87,2.2,h-(x===0?10:0),stone);cyl(x,h+2.8,-87,2.6,5.6,navy,0);cyl(x,h+5.8,-87,.06,1.2,gold);sphere(x,h+6.5,-87,.18,gold);box(x,h*.6,-84.76,1.25,4,.07,blue);box(x,h*.6+2.2,-84.7,1.5,.16,.16,gold);}
for(let x=-10;x<=10;x+=4){box(x,4,-83.4,1.5,4,.12,blue);box(x,6.3,-83.3,1.8,.18,.15,gold);}
// Krown & Co. retains its original facade.
box(-24,3,-18,12,6,8,stone,true);const shopRoof=mesh(new T.ConeGeometry(9,3,4),navy,-24,7.5,-18);shopRoof.rotation.y=Math.PI/4;sign('KROWN & CO.',-24,5.4,-13.9,9,1);for(let dx of [-4,0,4]){box(-24+dx,2.7,-13.88,2.3,3.5,.1,blue);cyl(-24+dx,1.6,-10,.1,3.2,gold);}box(-24,3.5,-11,12,.18,6,navy);
// Lisa's Coffee Shop: open doorway, pink plaster, black trim and a covered terrace.
const coffeePink=mat('#ed80b1'),coffeeBlack=mat('#19171d'),coffeeBlush=mat('#ffd3e4'),coffeeBrown=mat('#41251d');
const coffeeWall=mat('#ed80b1',.9),coffeeFloor=mat('#bcb4af',.9),coffeePanel=mat('#302a32',.7);
// Fine surface relief supports the existing colors without adding painted scenery.
let coffeeGrainSeed=137;const coffeeGrainData=new Uint8Array(64*64*4);for(let i=0;i<64*64;i++){coffeeGrainSeed=(coffeeGrainSeed*1664525+1013904223)>>>0;const value=150+(coffeeGrainSeed>>>26);coffeeGrainData.set([value,value,value,255],i*4);}const coffeeGrain=new T.DataTexture(coffeeGrainData,64,64,T.RGBAFormat);coffeeGrain.wrapS=coffeeGrain.wrapT=T.RepeatWrapping;coffeeGrain.magFilter=T.LinearFilter;coffeeGrain.minFilter=T.LinearMipmapLinearFilter;coffeeGrain.generateMipmaps=true;coffeeGrain.repeat.set(8,4);coffeeGrain.needsUpdate=true;coffeeWall.bumpMap=coffeeGrain;coffeeWall.bumpScale=.018;coffeeFloor.bumpMap=coffeeGrain;coffeeFloor.bumpScale=.012;
// Café plaster: seamless, softly blended tonal variation beneath the fine relief.
{
 let seed=421;const noiseGrid=Array.from({length:64},()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;});
 const smooth=t=>t*t*(3-2*t),sample=(x,y)=>{const ix=Math.floor(x),iy=Math.floor(y),fx=smooth(x-ix),fy=smooth(y-iy),at=(dx,dy)=>noiseGrid[((iy+dy)%8)*8+(ix+dx)%8];return (at(0,0)*(1-fx)+at(1,0)*fx)*(1-fy)+(at(0,1)*(1-fx)+at(1,1)*fx)*fy;};
 const plasterData=new Uint8Array(128*128*4);
 for(let y=0;y<128;y++)for(let x=0;x<128;x++){const tone=sample(x/16,y/16)*.75+sample(x/8,y/8)*.25;const shade=Math.round(235+20*tone);plasterData.set([shade,shade,shade,255],(y*128+x)*4);}
 const plasterMap=new T.DataTexture(plasterData,128,128,T.RGBAFormat);plasterMap.colorSpace=T.SRGBColorSpace;plasterMap.wrapS=plasterMap.wrapT=T.RepeatWrapping;plasterMap.magFilter=T.LinearFilter;plasterMap.minFilter=T.LinearMipmapLinearFilter;plasterMap.generateMipmaps=true;plasterMap.repeat.set(2,1);plasterMap.needsUpdate=true;
 coffeeWall.map=plasterMap;coffeeWall.bumpScale=.024;
}
box(24,.08,-14,12,.16,18,mat('#aaa19c',.95));
// Shared beveled tiles keep the paving quiet and add only one instanced draw.
const coffeeTileGrain=coffeeGrain.clone();coffeeTileGrain.repeat.set(2,2);coffeeTileGrain.needsUpdate=true;coffeeFloor.bumpMap=coffeeTileGrain;coffeeFloor.bumpScale=.006;
const coffeeTiles=new T.InstancedMesh(cafeRoundedBox(1.488,.016,1.488,.006),coffeeFloor,96);coffeeTiles.name='Cafe stone tiles';coffeeTiles.receiveShadow=true;
const coffeeTileTransform=new T.Object3D(),coffeeTileColor=new T.Color();let coffeeTileIndex=0;
for(let row=0;row<12;row++)for(let col=0;col<8;col++){
 coffeeTileTransform.position.set(18.75+col*1.5,.16,-22.25+row*1.5);coffeeTileTransform.rotation.y=((row*7+col*3)%4)*Math.PI/2;coffeeTileTransform.updateMatrix();coffeeTiles.setMatrixAt(coffeeTileIndex,coffeeTileTransform.matrix);
 const shade=.955+((row*17+col*13)%11)*.007;coffeeTileColor.setRGB(shade,shade,shade);coffeeTiles.setColorAt(coffeeTileIndex++,coffeeTileColor);
}
coffeeTiles.instanceMatrix.needsUpdate=true;coffeeTiles.instanceColor.needsUpdate=true;coffeeTiles.computeBoundingBox();coffeeTiles.computeBoundingSphere();scene.add(coffeeTiles);
box(18,2.7,-18,.4,5.4,8,coffeeWall,true);box(30,2.7,-18,.4,5.4,8,coffeeWall,true);box(24,2.7,-22,12,5.4,.4,coffeeWall,true);
const coffeeGlass=new T.MeshPhysicalMaterial({color:'#e5f4f5',transparent:true,opacity:.18,roughness:.08,metalness:0,side:T.DoubleSide,depthWrite:false});
for(const x of [20,28]){
 // Preserve the original collision barrier, with real openings in the visible wall.
 colliders.push({x,z:-14,w:2.4,d:.525});
 box(x,.525,-14,4,1.05,.25,coffeeBlack);box(x,4.175,-14,4,.45,.25,coffeeBlack);
 for(const side of [-1,1])box(x+side*1.825,2.5,-14,.35,2.9,.25,coffeeBlack);
 const pane=mesh(new T.PlaneGeometry(3.3,2.9),coffeeGlass,x,2.5,-14);pane.name='Cafe window · '+x;pane.castShadow=false;
 for(const side of [-1,1]){box(x+side*1.67,2.5,-13.84,.055,2.98,.045,coffeePink);box(x,2.5+side*1.475,-13.84,3.4,.055,.045,coffeePink);}
 // Projecting sills and inset lower panels give the glazing a finished surround.
 box(x,1.025,-13.95,3.65,.10,.55,coffeeBlush);
 box(x,.57,-13.855,3.35,.57,.025,coffeePanel);
 for(const side of [-1,1]){box(x+side*1.69,.57,-13.82,.035,.64,.035,coffeePink);box(x,.57+side*.32,-13.82,3.41,.035,.035,coffeePink);}
}
// Keep the four-metre doorway open; trim sits on the existing wall edges.
for(const x of [21.96,26.04])box(x,2.27,-13.81,.075,4.22,.08,gold);
box(24,4.37,-13.81,4.15,.06,.08,gold);
box(24,.174,-14,3.85,.012,.20,gold);
const coffeeEntryMat=box(24,.18,-13.1,2.7,.024,1.25,coffeePanel);coffeeEntryMat.name='Cafe entrance mat';
for(const x of [22.72,25.28])box(x,.195,-13.1,.025,.004,1.12,coffeePink);
for(const z of [-13.66,-12.54])box(24,.195,z,2.58,.004,.025,coffeePink);

box(24,5,-14,12,1.2,.45,coffeeBlack);box(24,5.5,-18,12.5,.25,8.6,coffeeBlack);
box(24,4.56,-10.79,10.6,.76,.12,coffeeBlack);
// Match canvas and physical aspect ratios so café lettering is never stretched.
function cafeSign(text,x,y,z,w,h,font){const c=document.createElement('canvas');c.width=Math.round(w*200);c.height=Math.round(h*200);const ctx=c.getContext('2d');ctx.fillStyle='#19171d';ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle='#ffabd2';ctx.lineWidth=3;ctx.strokeRect(5,5,c.width-10,c.height-10);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=font;ctx.fillStyle='#ffabd2';ctx.fillText(text,c.width/2,c.height/2+2);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;return mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:texture,side:T.DoubleSide}),x,y,z);}
const coffeeNameSign=cafeSign("LISA'S COFFEE SHOP",24,4.56,-10.71,10.3,.65,'bold 96px Georgia');coffeeNameSign.name='Cafe entrance name sign';
box(24,4.1,-12.4,12.5,.12,3.2,coffeeBlack);
for(let i=0;i<14;i++)box(18.2+i*.89,4.175,-12.4,.43,.025,3.2,coffeePink);
for(const x of [18.1,29.9])cyl(x,2.02,-10.95,.07,4.04,coffeeBlack);
const coffeeSlogan=cafeSign('COFFEE · CONNECTION · COMMUNITY',24,3.94,-10.76,8.8,.28,'bold 38px sans-serif');coffeeSlogan.name='Cafe awning slogan';
box(24,.65,-20,8,1.3,1.2,coffeeBlack,true);
const coffeeCounterFinish=new T.MeshPhysicalMaterial({color:'#ed80b1',roughness:.38,clearcoat:.25,clearcoatRoughness:.3});
const coffeeCounterTop=mesh(cafeRoundedBox(8.3,.12,1.4,.045),coffeeCounterFinish,24,1.34,-20);coffeeCounterTop.name='Cafe rounded countertop';
for(const x of [18.24,29.76]){box(x,.68,-18,.035,1.04,7.6,coffeePanel);box(x,1.23,-18,.065,.045,7.6,coffeeBlush);}box(24,.68,-21.76,11.5,1.04,.035,coffeePanel);
const coffeeFlutes=new T.InstancedMesh(new T.BoxGeometry(.10,.96,.035),coffeePanel,29);coffeeFlutes.name='Cafe counter flutes';coffeeFlutes.castShadow=coffeeFlutes.receiveShadow=true;const coffeeFluteTransform=new T.Object3D();for(let i=0;i<29;i++){coffeeFluteTransform.position.set(20.15+i*.275,.73,-19.365);coffeeFluteTransform.updateMatrix();coffeeFlutes.setMatrixAt(i,coffeeFluteTransform.matrix);}coffeeFlutes.instanceMatrix.needsUpdate=true;coffeeFlutes.computeBoundingBox();coffeeFlutes.computeBoundingSphere();scene.add(coffeeFlutes);box(24,.22,-19.34,7.8,.035,.045,gold);box(24,1.24,-19.34,7.8,.025,.045,coffeeBlush);
// Detailed espresso machine and cup tray are installed by coffee-scene.js.
const coffeeMenuCanvas=document.createElement('canvas');coffeeMenuCanvas.width=1200;coffeeMenuCanvas.height=400;const coffeeMenuCtx=coffeeMenuCanvas.getContext('2d');coffeeMenuCtx.fillStyle='#201b23';coffeeMenuCtx.fillRect(0,0,1200,400);coffeeMenuCtx.strokeStyle='#e9a6c5';coffeeMenuCtx.lineWidth=5;coffeeMenuCtx.strokeRect(14,14,1172,372);coffeeMenuCtx.textAlign='center';coffeeMenuCtx.fillStyle='#ffbddb';coffeeMenuCtx.font='bold 52px sans-serif';coffeeMenuCtx.fillText('LISA’S COFFEE',600,88);coffeeMenuCtx.fillStyle='#fff3e9';coffeeMenuCtx.font='48px sans-serif';for(const [text,x,y] of [['The Pink Latte',320,185],['Espresso',880,185],['Cappuccino',320,280],['Garden Tea',880,280]])coffeeMenuCtx.fillText(text,x,y);coffeeMenuCtx.fillStyle='#e9a6c5';coffeeMenuCtx.font='28px sans-serif';coffeeMenuCtx.fillText('Choose your drink at the counter',600,353);const coffeeMenuTexture=new T.CanvasTexture(coffeeMenuCanvas);coffeeMenuTexture.colorSpace=T.SRGBColorSpace;const coffeeMenu=mesh(new T.PlaneGeometry(6,2),new T.MeshStandardMaterial({map:coffeeMenuTexture,emissive:'#ffffff',emissiveMap:coffeeMenuTexture,emissiveIntensity:.15,roughness:.7}),24,3.55,-21.73);coffeeMenu.name='Cafe drinks menu';

// Shared rounded furniture geometry keeps the existing seating footprints.
function cafeRoundedBox(w,h,d,r){const g=new T.BoxGeometry(w,h,d,8,4,8),p=g.attributes.position,v=new T.Vector3(),inner=new T.Vector3(),normal=new T.Vector3();for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);inner.set(Math.max(-w/2+r,Math.min(w/2-r,v.x)),Math.max(-h/2+r,Math.min(h/2-r,v.y)),Math.max(-d/2+r,Math.min(d/2-r,v.z)));normal.copy(v).sub(inner).normalize();v.copy(inner).addScaledVector(normal,r);p.setXYZ(i,v.x,v.y,v.z);}g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();return g;}
const cafeCushion=new T.MeshPhysicalMaterial({color:'#ed91bc',roughness:.92,sheen:.25,sheenColor:'#ffcadf'}),cafeFrame=mat('#28242c',.48),cafeMetal=mat('#ac8a60',.33,.65);
const cafeSeatGeometry=cafeRoundedBox(.65,.16,.7,.055),cafeBackGeometry=cafeRoundedBox(.65,.7,.12,.05),cafeBackPadGeometry=cafeRoundedBox(.53,.51,.07,.03);
for(const [x,z] of [[20,-17],[28,-17],[27,-7]]){
 cyl(x,1.05,z,.8,.12,coffeeBlack);cyl(x,.53,z,.08,1,coffeeBlack);cyl(x,.07,z,.35,.1,coffeeBlack);colliders.push({x,z,r:.85});
 const rim=mesh(new T.TorusGeometry(.785,.018,8,48),cafeMetal,x,1.105,z);rim.rotation.x=Math.PI/2;
 for(const offset of [-1.25,1.25]){const sx=x+offset;colliders.push({x:sx,z,w:.725,d:.75});const cushion=mesh(cafeSeatGeometry,cafeCushion,sx,.53,z);cushion.name='Cafe rounded seat cushion';mesh(cafeBackGeometry,cafeFrame,sx,.92,z-.3);mesh(cafeBackPadGeometry,cafeCushion,sx,.96,z-.218);for(const dx of [-.24,.24])for(const dz of [-.24,.24])cyl(sx+dx,.25,z+dz,.028,.5,cafeFrame);}

 cyl(x,1.24,z,.13,.25,coffeeBlush,.16);cyl(x,1.369,z,.13,.012,coffeeBrown);
}
// The nearby kiosk carries the rewards label; keep the window view clear.
// Garden trees and flowering beds, seeded for stable placement.
let seed=42;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
const pink=mat('#ef6e9c'),yellow=mat('#f6ce57'),purple=mat('#9271c8');
for(let i=0;i<65;i++){let s=i%2?-1:1,x=s*(14+rand()*35),z=24-rand()*117;if((Math.abs(z+18)<10&&Math.abs(x)<33)||(x<-18&&z<-30&&z>-75)||(x>35&&z<-15&&z>-38)||(x>27&&z<-43&&z>-77))continue;let h=3+rand()*4;cyl(x,h/2,z,.23,h,wood);for(let j=0;j<3;j++){let tree=sphere(x+(rand()-.5)*1.3,h+j*.6,z,1.6+rand(),leaf);tree.scale.set(1,1.1,1);}colliders.push({x,z,r:.6});}
for(let s of [-1,1])for(let z=5;z>-75;z-=11){if(z<-24&&z>-47)continue;box(s*10,.25,z,4,.5,6,trim,true);box(s*10,.55,z,3.7,.12,5.7,leaf);for(let i=0;i<18;i++){let x=s*10+(rand()-.5)*3.5,zz=z+(rand()-.5)*5.5;sphere(x,.8+rand()*.2,zz,.18,[pink,yellow,purple,white][i%4]);}}
// Eastern discovery pond and pin, western gardener.
cyl(24,.12,-51,5,.16,trim);cyl(24,.23,-51,4.7,.08,blue);colliders.push({x:24,z:-51,r:4.9});
sign('DISCOVERY GARDEN',24,2.8,-58,7,1);sign('WELCOME GARDENS',-13,2.4,1,5,.8);
const pin=new T.Group();pin.position.set(18,1.3,-47);scene.add(pin);cyl(0,0,0,.55,.18,gold,.55,pin);for(let i=0;i<5;i++){let a=i/5*Math.PI*2;cyl(Math.cos(a)*.43,.38,Math.sin(a)*.43,.13,.7,gold,0,pin);}mesh(new T.OctahedronGeometry(.17),blue,0,.3,.5,pin);
scene.add(pipGroup);pipGroup.position.set(-9,0,-9);cyl(0,.9,0,.38,.9,leaf,.5,pipGroup);sphere(0,1.7,0,.42,trim,pipGroup);cyl(0,2.03,0,.65,.09,wood,.65,pipGroup);cyl(0,2.16,0,.37,.25,gold,.3,pipGroup);for(let s of [-1,1]){sphere(s*.15,1.76,.36,.09,navy,pipGroup);cyl(s*.23,.29,0,.13,.6,trim,.13,pipGroup);sphere(s*.56,.85,0,.16,gold,pipGroup);}mesh(new T.OctahedronGeometry(.15),blue,0,.98,.42,pipGroup);sign('PIP · GARDEN KEEPER',-9,2.85,-8.9,4,.5);colliders.push({x:-9,z:-9,r:.7});
// Lanterns and benches.
for(let s of [-1,1])for(let z=22;z>-78;z-=15){cyl(s*7.8,1.65,z,.08,3.3,navy);let bulb=sphere(s*7.8,3.5,z,.25,new T.MeshStandardMaterial({color:'#ffe8b3',emissive:'#ffc26a',emissiveIntensity:.2}));lamps.push(bulb);cyl(s*7.8,3.82,z,.38,.28,navy,0);if(z%2===0){box(s*12,.65,z,3,.2,1,wood,true);box(s*12,1.1,z-.4,3,.8,.12,wood);}}
const systemMotion=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
const scenery=finishGardens({scene,stone,trim,gold,navy,glass,leaf,blue,colliders});
const courtyard=enrichCourtyard({scene,stone,trim,gold,navy,colliders});
batchStatic(scene.getObjectByName('Courtyard craftsmanship'),new Set([stone,trim,gold,navy]));
const rewards=installRewards({scene,colliders,stillWater:()=>graphics.stillWater,pause:()=>keysReset(),getHomes:()=>villages.homes});
const school=installMagicSchool({scene,camera,colliders,pause:()=>keysReset(),rewards,getCurrentSeat:()=>seating.currentSeat,getNearbyPlaces:()=>{const lounge=lounges.spots.find(s=>s.id==='school');return [{id:'lounge',x:lounge.x,z:lounge.z+1.3,name:lounge.name},{id:'bridge',...bridge.boardPoint},{id:'riverbend',...riverbend.boardPoint}];}});
const bridge=installBridge({scene,camera,colliders,getCurrentSeat:()=>seating.currentSeat,pause:()=>keysReset(),rewards,getNearbyPlaces:()=>{const lounge=lounges.spots.find(s=>s.id==='bridge');return [{id:'school',...school.deskPoint},{id:'lounge',x:lounge.x,z:lounge.z+1.3,name:lounge.name},{id:'riverbend',...riverbend.boardPoint}];}});
const riverbend=installRiverbend({scene,camera,colliders,getCurrentSeat:()=>seating.currentSeat,pause:()=>keysReset(),rewards,getVillagePlaces:()=>{const home=villages.homes.find(h=>h.id===villages.home&&h.village==='riverbend')||villages.homes.find(h=>h.village==='riverbend'),courtyard=villages.commons.find(c=>c.id==='riverbend'),lounge=lounges.spots.find(s=>s.id==='riverbend'),stop=tram.stops.find(s=>s.id==='eldergrove');return [{id:'cottage',...home.door,name:home.name},{id:'courtyard',x:courtyard.x,z:courtyard.z+5,name:courtyard.name},{id:'lounge',x:lounge.x,z:lounge.z+1.3,name:lounge.name},{id:'tram',x:stop.x+2.2,z:stop.z,name:stop.name+' tram stop'}];}});
const generalStore=installGeneralStore({scene,camera,colliders,pause:()=>keysReset(),rewards,getNearbyPlaces:()=>{const coffee=foodGuide.places().find(p=>p.id==='coffee'),lounge=lounges.spots.find(s=>s.id==='generalstore');return [{...coffee,id:'coffee'},{id:'lounge',name:lounge.name,x:lounge.x,z:lounge.z+1.3},{id:'office',...officeGarden.boardPoint},{id:'produce',...produceGarden.boardPoint}];}});
const clubhouse=installClubhouse({scene,camera,colliders,getManagedPlaces:()=>townSquare.portalPlaces.map(p=>({...p,manager:'@maxigram'})),getCurrentSeat:()=>seating.currentSeat,pause:()=>keysReset(),rewards,getNearbyPlaces:()=>{const lounge=lounges.spots.find(s=>s.id==='clubhouse'),home=villages.homes.find(h=>h.id==='eldergrove-1'),stop=tram.stops.find(s=>s.id==='eldergrove');return [{id:'lounge',x:lounge.x,z:lounge.z+1.3,name:lounge.name},{id:'home',...home.door,name:home.name},{id:'tram',x:stop.x+2.2,z:stop.z,name:stop.name+' tram stop'}];}});
const produceGarden=installProduceGarden({scene,camera,colliders,pause:()=>keysReset(),rewards,getCurrentSeat:()=>seating.currentSeat,getRoastedCounter:()=>foodGuide.places().find(p=>p.id==='roasted')});
const whisperingPines=installWhisperingPines({scene,camera,colliders,pause:()=>keysReset(),getCurrentSeat:()=>seating.currentSeat,canUse:()=>playing&&!contextLost&&!journey.active&&!safari.active&&!tram.active&&!lounges.seated});
const studio=installCompositionStudio({scene,camera,colliders,pause:()=>keysReset(),getCurrentSeat:()=>seating.currentSeat,canUse:()=>playing&&!contextLost&&!journey.active&&!safari.active&&!tram.active&&!lounges.seated});
const stonehearth=installStonehearth({scene,camera,colliders,pause:()=>keysReset(),canUse:()=>playing&&!contextLost&&!journey.active&&!safari.active&&!tram.active&&!seating.active&&!lounges.seated});
const eldergrove=installEldergrove({scene,camera,colliders,getCurrentSeat:()=>seating.currentSeat,pause:()=>keysReset(),rewards});
const library=installLibrary({scene,camera,colliders,pause:()=>keysReset(),rewards,getCurrentSeat:()=>seating.currentSeat,getNearbyPlaces:()=>{const lounge=lounges.spots.find(s=>s.id==='library'),stop=tram.stops.find(s=>s.id==='park');return [{id:'lounge',x:lounge.x,z:lounge.z+1.3,name:lounge.name},{id:'square',...townSquare.boardPoint},{id:'tram',x:stop.x+2.2,z:stop.z,name:stop.name+' tram stop'}];}});
const townSquare=installTownSquare({scene,camera,colliders,pause:()=>keysReset(),rewards,getCurrentSeat:()=>seating.currentSeat});
const officeGarden=installOfficeGarden({scene,camera,colliders,pause:()=>keysReset(),rewards,getCurrentSeat:()=>seating.currentSeat});
const builders=installBuilders({scene,camera,colliders,getCurrentSeat:()=>seating.currentSeat,pause:()=>keysReset(),rewards});
const coffeeScene=installCoffeeScene({scene,camera,nameSign:coffeeNameSign,slogan:coffeeSlogan});
const roastedScene=installRoasted({scene,colliders});
const popcorn=installPopcorn({scene,camera,colliders});
const circus=installCircus({scene,camera,colliders,getLounge:()=>lounges.spots.find(s=>s.id==='circus'),pause:()=>keysReset(),guideToPoint:rewards.guideToPoint,getSeats:()=>seating.seats.filter(s=>s.kind==='circus'),guideTo:rewards.guideTo,rewardCompleted:()=>rewards.state().done.includes('circus-complete'),rewardClaimed:()=>rewards.state().claims.includes('circus:task')});
const takePhoto=installPhotography({renderer,scene,camera,getContext:()=>({location:safari.active?'Krownlandia Safari':tram.active?'Village tram':journey.active?'The Great Journey':seating.currentSeat?.name||lounges.currentSeat?.name||$('#place').textContent||'Park',night})});
const video=installVideo({renderer,pause:keysReset,getContext:()=>({location:$('#place').textContent||'Park',night})});
const safari=installSafari({scene,camera,takePhoto,getLounge:()=>lounges.spots.find(s=>s.id==='safari'),guideToPoint:rewards.guideToPoint,guideTo:rewards.guideTo,rewardClaimed:()=>rewards.state().claims.includes('safari:task'),getProgress:rewards.state,recordSighting:rewards.recordSafariSighting,pause:()=>{keysReset();document.body.classList.add('riding');},onExit:()=>{keysReset();yaw=0;pitch=0;document.body.classList.remove('riding');}});
const safariStyle=document.createElement('link');safariStyle.rel='stylesheet';safariStyle.href='safari.css';document.head.append(safariStyle);
const parkMap=installParkMap({pause:()=>keysReset(),guideTo:rewards.guideTo,rewards:rewards.state,guideToPoint:rewards.guideToPoint,destinations:()=>[{id:'express-studio',...studio.point,kind:'Art studio',keywords:'Express Yourself School of Arts composition shapes colors',detail:'Arrange shapes and colors at the board or studio bench.'},{id:'pines-story',...whisperingPines.point,kind:'Forest stories',keywords:'Whispering Pines reading bench glade woodworking resin pinewood inlay Krownlandia Storytelling story workshop',detail:'Open the board or story bench for forest prompts, the short story workshop, or pinewood inlay practice'},{id:'stonehearth-craft',...stonehearth.point,kind:'Craft activity',keywords:'Stonehearth masonry stone pattern',detail:'Open the courtyard panel, then Arrange a stone pattern · Designs last until reload; no extra points or keepsakes'},...townSquare.portalPlaces,...fireflyBenches.seats.map(s=>({id:'firefly-'+s.id,name:s.name,kind:'Night viewing',keywords:'scenic fireflies forest sit rest bench',detail:'Fireflies after dark · Sit, then open View options for a photo',...s.approach})),...[library.seats.find(s=>s.name.includes('terrace')),eldergrove.seats[0],builders.seats[0]].map((s,i)=>({id:'scenic-'+i,name:s.name,kind:'Scenic seating',keywords:'scenic photo view sit rest bench',detail:'Sit and look around · View options includes Take photo',...s.approach})),{id:'school-classroom',...school.deskPoint,kind:'Learning activity',keywords:'Magic School lantern puzzle lesson Dragons Math Club share treasure division',detail:'Open the classroom for the lantern lesson or Dragons Math Club'}, {id:'bridge-story',...bridge.boardPoint,kind:'Community landmark',keywords:'Krown Bridge ed033 west bank'}, {id:'bridge-bench',...bridge.seats[0].approach,name:bridge.seats[0].name,kind:'Scenic seating',keywords:'scenic bridge river lookout bench sit rest'}, {id:'riverbend-viewing-bench',name:riverbend.seats[0].name,...riverbend.seats[0].approach,kind:'Scenic seating',keywords:'scenic Riverbend lantern boats festival sit rest bench fishing casting riverside float reel recreation',detail:'Sit, then use View options for Riverbend stories and casting, lantern boats or a photo'}, {id:'riverbend-display',...riverbend.boardPoint,kind:'Craft activity',keywords:'Riverbend lantern boats pottery baskets fishing casting riverside float reel recreation',detail:'Open Discover Riverbend for casting, pottery or basket practice'}, {id:'generalstore-counter',...generalStore.boardPoint,kind:'Shopping',keywords:'General Store everyday goods browse Lisa’s Sticker Shop paper strip stamps recreation',detail:'Open the counter, then Lisa’s Sticker Shop to make a sticker strip'}, {id:'clubhouse-board',...clubhouse.boardPoint,kind:'Community gathering',keywords:'giant tree Place Managers meeting Game Club Crossing stones solo puzzle recreation Sewing Club stitch sampler',detail:'Open the board for Game Club · Crossing stones or Sewing Club · Stitch sampler'}, {id:'produce-board',...produceGarden.boardPoint,kind:'Garden activity',keywords:'vegetables water harvest'},...tram.stops.map(s=>({id:'tram-'+s.id,name:s.name+' tram stop',kind:'Tram stop',x:s.x+2.2,z:s.z})),...eldergrove.points.map(p=>({...p,id:'eldergrove-'+p.id,kind:p.id==='craft'?'Craft activity':'Forest discovery',keywords:'Eldergrove '+(p.id==='craft'?'woodcraft plaque':''),...(p.id==='craft'?{detail:'Open the woodcraft discovery panel, then Woodcraft practice · Designs last until reload; no extra points or keepsakes'}:{})})),{id:'library-desk',...library.deskPoint,kind:'Reading room',keywords:'books bookmark'},{id:'library-terrace',...library.terracePoint,kind:'Reading terrace',keywords:'tea oat bites'},{id:'square-board',...townSquare.boardPoint,kind:'Community space'},{id:'square-stage',...townSquare.stagePoint,kind:'Stage'},{id:'office-board',...officeGarden.boardPoint,kind:'Workspace',keywords:'coworking white arches'},...villages.craftPlaces,...villages.homes.map(h=>({id:'home-'+h.id,name:h.name,kind:'Home',...h.door})),...lounges.spots.map(s=>({id:'lounge-'+s.id,name:s.name,kind:'Lounge',keywords:s.snack+' '+s.souvenir,x:s.x,z:s.z+1.3})),...villages.commons.map(c=>({id:'commons-'+c.id,name:c.name,kind:'Gathering place',keywords:c.id+' village',x:c.x,z:c.z+5}))]});
const journey=installJourney({scene,camera,colliders,getLounge:()=>lounges.spots.find(s=>s.id==='journey'),guideToPoint:rewards.guideToPoint,guideTo:rewards.guideTo,rewardClaimed:()=>rewards.state().claims.includes('journey:task'),pause:()=>{keysReset();document.body.classList.add('riding');},onExit:()=>{keysReset();yaw=0;pitch=0;document.body.classList.remove('riding');}});
const rideStyle=document.createElement('link');rideStyle.rel='stylesheet';rideStyle.href='journey.css';document.head.append(rideStyle);
const atmosphere=enrich({scene,camera,stone,trim,grass,leaf,lamps,renderer});
const batching=batchStatic(scene,new Set([stone,trim,gold,navy,blue,grass,leaf,wood,white,pink,yellow,purple,coffeePink,coffeeBlack,coffeeBlush,coffeeBrown]));
drops.frustumCulled=false;
// Drop directions and choreography shapes are constant across frames.
const sprayShapes=Array.from({length:drops.count},(_,i)=>{
 const angle=i*2.399,x=Math.cos(angle),z=Math.sin(angle);
 return {offset:i/drops.count,x,z,pair:.55+2.25*x**4,crown:.6+2.6*Math.cos(2*angle)**6};
});
function updateFountainSpray(ms,showTime){
 const show=showTime>=0,phase=Math.floor(showTime/4000);
 const u=Math.min(1,(showTime%4000)/600),v=showTime>11400?(showTime-11400)/600:0;
 const clock=ms*.0005;
 for(let i=0;i<sprayShapes.length;i++){
  const {offset,x,z,pair,crown}=sprayShapes[i],t=(clock+offset)%1,arc=Math.sin(t*Math.PI),radius=1+t*4.2;
  let height=2.3;
  if(show){
   const target=phase===0?.65:phase===1?pair:crown,previous=phase===0?2.3:phase===1?.65:pair;
   height=previous+(target-previous)*u*u*(3-2*u);
   if(v>0)height+=(2.3-height)*v*v*(3-2*v);
  }
  dummy.position.set(x*radius,3.8+arc*height-t*3.1,z*radius-35);
  dummy.scale.setScalar(.65+arc*.7);dummy.updateMatrix();drops.setMatrixAt(i,dummy.matrix);
 }
 drops.instanceMatrix.needsUpdate=true;
}

const guide=document.createElement('p');guide.id='guide';guide.setAttribute('aria-live','off');$('#quest').append(guide);
const guideStatus=document.createElement('p');guideStatus.id='walkingGuideStatus';guideStatus.setAttribute('role','status');guideStatus.setAttribute('aria-atomic','true');document.body.append(guideStatus);
function announcePath(message){if(guideStatus.textContent!==message)guideStatus.textContent=message;}
const parkInterface=installInterface({pause:()=>keysReset()});
const villages=installVillages({scene,camera,colliders,canCraft:()=>playing&&!contextLost&&!journey.active&&!safari.active&&!tram.active&&!seating.active&&!lounges.seated,pause:()=>keysReset(),guideTo:rewards.guideToPoint,getSouvenirs:()=>[...lounges.collection(),...residents.collection(),...builders.collection(),...library.collection(),...eldergrove.collection(),...safari.collection(),...school.collection()],getHosts:()=>residents.people,getTramStops:()=>tram.stops,getRiverbendDestinations:()=>{const lounge=lounges.spots.find(s=>s.id==='riverbend');return [{id:'display',...riverbend.boardPoint},{id:'bench',...riverbend.seats[0].approach,name:riverbend.seats[0].name},{id:'lounge',x:lounge.x,z:lounge.z+1.3,name:lounge.name}];}});
const residents=installResidents({scene,camera,colliders,villages,pause:()=>keysReset(),guideTo:rewards.guideToPoint,rewards:rewards.state,guideRewards:rewards.guideTo});
const lounges=installLounges({scene,camera,colliders,blocked,takePhoto,lookUp:lookUpFromSeat,faceForward:()=>{yaw=Math.PI;pitch=0;camera.rotation.set(pitch,yaw,0);},pause:()=>keysReset(),guideTo:rewards.guideToPoint,getRewardState:rewards.state,seat:s=>{saveVisit();keysReset();camera.position.set(s.x,1.25,s.z-1.1);yaw=Math.PI;pitch=0;},stand:s=>{keysReset();camera.position.set(s.x,1.75,s.z+1.3);yaw=0;pitch=0;}});
const fireflyBenches=installFireflyBenches({scene,colliders});
atmosphere.clearPlanting({x:24,z:-14,w:14,d:20});const coffeePatio=lounges.spots.find(s=>s.id==='cafe');if(coffeePatio)atmosphere.clearPlanting({...coffeePatio,w:5.5,d:5.5});
atmosphere.clearPlanting({x:26,z:170,w:8,d:6});atmosphere.clearPlanting({x:24,z:164,w:3,d:6});
atmosphere.clearPlanting({x:40,z:169,w:10,d:8});atmosphere.clearPlanting({x:39,z:163.5,w:3,d:5});
atmosphere.clearPlanting({x:-15,z:140,w:8,d:6});atmosphere.clearPlanting({x:-15,z:134,w:3,d:8});
atmosphere.clearPlanting({x:-30,z:151,w:20,d:23});atmosphere.clearPlanting({x:-15,z:162,w:30,d:4});const clubhousePatio=lounges.spots.find(s=>s.id==='clubhouse');if(clubhousePatio)atmosphere.clearPlanting({...clubhousePatio,w:5.5,d:5.5});
atmosphere.clearPlanting({x:38,z:-13,w:12,d:16});const storePatio=lounges.spots.find(s=>s.id==='generalstore');if(storePatio)atmosphere.clearPlanting({...storePatio,w:5.5,d:5.5});
atmosphere.clearPlanting({x:-46,z:153,w:14,d:46});atmosphere.clearPlanting({x:-33,z:130,w:25,d:4});atmosphere.clearPlanting({x:-36,z:165,w:17,d:4});
atmosphere.clearPlanting({x:-16,z:170,w:41,d:16});atmosphere.clearPlanting({x:14,z:170,w:12,d:13});
const seating=installSeating({camera,blocked,lounges,takePhoto,keyboardAvailable:worldInputAvailable,onLookUp:lookUpFromSeat,onFace:s=>{keysReset();yaw=s.yaw;pitch=0;camera.rotation.set(pitch,yaw,0);},extraSeats:[...studio.seats,...whisperingPines.seats,...fireflyBenches.seats,...villages.seats,...builders.seats,...officeGarden.seats,...townSquare.seats,...library.seats,...eldergrove.seats,...produceGarden.seats,...clubhouse.seats,...riverbend.seats,...bridge.seats,...school.seats],onSit:s=>{saveVisit();keysReset();camera.position.set(s.x,s.y,s.z);yaw=s.yaw;pitch=0;},onStand:p=>{keysReset();camera.position.set(p.x,1.75,p.z);},openStudio:launcher=>studio.open(launcher),openWhisperingStory:launcher=>whisperingPines.open(launcher),openEldergroveStory:()=>eldergrove.open(),openRiverbendStory:()=>riverbend.open(),openBuildersStory:()=>builders.open(),openBridgeStory:()=>bridge.open(),openOfficeBoard:()=>officeGarden.open(),openSquareBoard:()=>townSquare.open(),openGardenNotes:()=>produceGarden.open(),openClubhouseBoard:()=>clubhouse.open(),openLibraryReading:()=>library.open(),openSchoolLesson:()=>school.open(),watchCircus:()=>circus.start(),watchRiverFestival:()=>riverbend.start(),riverFestivalActive:()=>riverbend.state().active});
const tram=installTram({scene,camera,pause:()=>keysReset(),guideTo:rewards.guideToPoint,canBoard:()=>playing&&!journey.active&&!safari.active&&!seating.active&&!lounges.seated,beforeBoard:()=>{saveVisit();keysReset();},onExit:p=>{keysReset();camera.position.set(p.x,1.75,p.z);yaw=0;pitch=0;}});
const journal=installJournal({pause:()=>keysReset(),rewards,lounges,residents,villages,builders,library,eldergrove,school,founder:()=>collected});
// All walking colliders have been assembled; their dimensions stay fixed for the visit.
const navigation=installNavigation({scene,blocked,staticEdges:true});
const graphics=installGraphics({renderer,scene,sun,pause:()=>keysReset()});
let restoringProgress=false;
const backup=installBackup({pause:()=>keysReset(),beforeExport:()=>saveVisit(),reload:()=>{restoringProgress=true;location.reload();}});
const foodGuide=installFoodGuide({roastedReturnPoint:rewards.roastedReturnPoint,roastedMenu:rewards.roastedMenu,pause:()=>keysReset(),guideTo:rewards.guideToPoint,lounges,getPosition:()=>camera.position});
const help=installHelp({pause:()=>keysReset()});
const communityWalk=installCommunityWalk({pause:()=>keysReset(),rewards,getLounges:()=>lounges.spots,stops:[
 {id:'office',name:'Community Office Garden',point:officeGarden.boardPoint,task:'office-idea',description:'Explore the community project board and choose an idea to learn where it has taken shape.',credit:'Community idea · @lisachandler'},
 {id:'builders',name:'Making of Krownlandia Garden',point:{x:-26,z:30},task:'builders-story',description:'Read the three exhibit chapters and collect the Builder’s Krown.',credit:'Krownlandia history and the recent prototype’s making'},
 {id:'produce',name:'Community Produce Garden',point:produceGarden.boardPoint,task:'produce-water',description:'Visit the care bench and water the vegetable beds.',credit:'Community idea · @lisachandler'},
 {id:'square',name:'Krownlandia Town Square',point:townSquare.boardPoint,task:'square-welcome',description:'Read the community welcome at the square’s board, then explore the stage and gathering space.',credit:'Community idea · @lisachandler'},
 {id:'library',name:'Library of Alexandria',point:library.deskPoint,task:'library-read',description:'Explore all three readings at the desk and collect the Alexandria Bookmark.',credit:'Community idea · @Jauregui9821'}
],routes:[{id:'riverbend',name:'Riverbend Discovery Walk',description:'Follow the riverside stories across Krown Bridge to the Magic School. Choose any stop or continue your next unfinished activity. These are prototype interpretations of community ideas; existing progress and rewards count.',stops:[
 {id:'riverbend',name:'Riverbend Riverside',point:riverbend.boardPoint,task:'riverbend-board',description:'Explore the stories of the river, lantern boats and village crafts. The optional boat preview is available nearby.',credit:'Inspired by the original Riverbend village description'},
 {id:'bridge',name:'Krown Bridge',point:bridge.boardPoint,task:'bridge-board',description:'Cross the timber bridge and read its story at the west-bank lookout.',credit:'Community idea · @ed033'},
 {id:'school',name:'Magic School',point:school.deskPoint,task:'school-pattern',description:'Match Gold, Teal and Rose in the lantern classroom. Study at the board or sit at a desk to earn your First Lesson Star.',credit:'Community idea · @elizabeths14'}
 ]},{id:'eldergrove',name:'Eldergrove Discovery Walk',description:'Discover the Great Elder Tree clearing, visit a timber home, and explore the giant-tree Clubhouse. These settings interpret the original community ideas. Follow the route or choose any stop; your existing progress and rewards count.',stops:[
 {id:'eldergrove',name:'Great Elder Tree clearing',get point(){return eldergrove.progress().next||eldergrove.points[0]},task:'eldergrove-trail',description:'Record the tree, woodcraft and herb-garden discoveries to earn the Woodcarved Leaf. Directions continue at your next unrecorded stop.',credit:'Inspired by the original Eldergrove village description'},
 {id:'eldergrove-homes',name:'Eldergrove timber homes',point:villages.homes.find(h=>h.id==='eldergrove-1').door,task:'visit-eldergrove',description:'Walk through a timber home’s doorway to complete a visit. Choosing a home base is optional; benches and the Woodland Table offer places to rest.',credit:'Prototype homes inspired by Eldergrove’s woodland and craft traditions'},
 {id:'clubhouse',name:'Krownlandia Clubhouse',point:clubhouse.boardPoint,task:'clubhouse-board',description:'Explore Welcome, Care or Create at the Place Managers board inside the giant tree. The meeting chairs and Treehouse Commons are nearby.',credit:'Original community idea · a clubhouse for Place Managers inside a giant tree'}
 ]},{id:'crafts',name:'Village Craft Trail',description:'Visit five existing craft stops in any order. The practice designs are optional and the trail does not track completion or add rewards.',selfGuided:true,stops:[
 {id:'meadowbrook-crafts',name:'Meadowbrook weaving table',point:villages.craftPlaces.find(p=>p.id==='meadow-loom'),description:'Open the weaving sampler at the loom and choose a color for each of six rows.',credit:'Inspired by Meadowbrook’s recorded weaving tradition · page 2'},
 {id:'riverbend-crafts',name:'Riverbend pottery and baskets',point:riverbend.boardPoint,description:'At Discover Riverbend, open pottery or basket practice.',credit:'Original village description · page 3'},
 {id:'eldergrove-crafts',name:'Eldergrove woodcraft shelter',point:eldergrove.points.find(p=>p.id==='craft'),description:'Open the woodcraft discovery panel, then Woodcraft practice to design a plaque.',credit:'Inspired by Eldergrove’s recorded woodcraft tradition'},
 {id:'stonehearth-crafts',name:'Stonehearth pattern courtyard',point:stonehearth.point,description:'Open the courtyard panel and choose Arrange a stone pattern.',credit:'Inspired by Stonehearth’s recorded masonry tradition'},
 {id:'pines-crafts',name:'Whispering Pines inlay bench',point:whisperingPines.seats[0].approach,description:'Sit at the story bench. Under View options, select Open forest story prompts, then expand Pinewood inlay practice.',credit:'Inspired by the recorded Whispering Pines woodworking and resin crafts'}
 ]},{id:'photo',name:'Photo Walk',description:'Try three ways to frame a scene in any order. Inspired by Krown Photo Studio (@AlexHM, page 10). Use Activities → Take photo if you want a local PNG, or describe your view aloud. This prototype walk tracks no completion and adds no rewards.',selfGuided:true,framingGuide:'/reports/arts-sampler.html#framing',stops:[
 {id:'photo-garden',name:'Community Office Garden',point:officeGarden.boardPoint,description:'Try a wide view: put a path or garden edge in the foreground to lead the eye into the scene.',credit:'Original place idea · @lisachandler'},
 {id:'photo-terrace',name:'Library of Alexandria reading terrace',point:library.seats.find(s=>s.name==='Alexandria reading terrace bench').approach,description:'Try a detail: pick one shape or texture on the terrace. Move or turn to leave some space around it.',credit:'Original Library idea · @Jauregui9821'},
 {id:'photo-bridge',name:'Krown Bridge west-bank lookout',point:bridge.boardPoint,description:'Try a layered view: choose something near you, something across the water, and a feature farther back.',credit:'Original bridge idea · @ed033'}
 ]},{id:'square-loop',name:'Town Square at your pace',description:'Follow an untimed loop from the stage to the reading terrace and community board, then back to the stage. Inspired by Krownlandia Olympic Stadium (@elizabeths14, page 10). Choose each leg yourself, skip any stop or rest along the way. This prototype route records no time, lap or reward.',selfGuided:true,restPoints:[
 {id:'pace-stage',name:'Town Square stage bench',point:townSquare.seats[0].approach},
 {id:'pace-terrace',name:'Alexandria reading terrace bench',point:library.seats.find(s=>s.name==='Alexandria reading terrace bench').approach},
 {id:'pace-garden',name:'Town Square garden bench',point:townSquare.seats.find(s=>s.name==='Town Square garden bench').approach,detail:'Look for the Hydration Station sign. It marks a spot to pause, inspired by the idea credited to @cocovinny (page 11).'}
 ],stops:[
 {id:'pace-stage',name:'Town Square stage',point:townSquare.stagePoint,description:'Start here, or choose this stop again to finish the loop. Take a moment to set a comfortable pace. The stage-view benches are nearby.',credit:'Original Town Square idea · @lisachandler'},
 {id:'pace-terrace',name:'Library of Alexandria reading terrace',point:library.seats.find(s=>s.name==='Alexandria reading terrace bench').approach,description:'Pause by the terrace bench if you like. Notice one detail along the path that would help you recognize the way back.',credit:'Original Library idea · @Jauregui9821'},
 {id:'pace-board',name:'Town Square community board',point:townSquare.boardPoint,description:'From here choose Town Square stage to close the loop, or finish at the board. There is no need to enter either panel.',credit:'Original Town Square idea · @lisachandler'}
 ]}]});
let directionsStopped=false,textOnlyDirections=false;
const textDirections=document.createElement('button');textDirections.id='textDirections';textDirections.textContent='Text-only directions';textDirections.setAttribute('aria-pressed','false');
textDirections.onclick=()=>{textOnlyDirections=!textOnlyDirections;textDirections.setAttribute('aria-pressed',String(textOnlyDirections));keysReset();};$('nav').append(textDirections);
const stopDirections=document.createElement('button');stopDirections.id='stopDirections';stopDirections.textContent='Stop directions';stopDirections.onclick=()=>{keysReset();rewards.clearGuide();directionsStopped=true;announcePath('Walking directions stopped.');saveVisit();};$('nav').append(stopDirections);
const findRest=document.createElement('button');findRest.id='findRest';findRest.textContent='Find a place to rest';findRest.title='Walking directions to nearby seating';
const canFindRest=()=>playing&&!journey.active&&!safari.active&&!tram.active&&!seating.active&&!lounges.seated;
findRest.onclick=()=>{if(!canFindRest())return;keysReset();const p=camera.position,candidates=[...seating.seats].sort((a,b)=>Math.hypot(p.x-a.approach.x,p.z-a.approach.z)-Math.hypot(p.x-b.approach.x,p.z-b.approach.z)),seat=candidates.find(s=>!blocked(s.approach.x,s.approach.z)&&navigation.canReach(p,s.approach));if(seat){rewards.guideToPoint({...seat.approach,name:seat.name});findRest.textContent='Find a place to rest';}else findRest.textContent='No seat route found · try after moving';};$('nav').append(findRest);
parkInterface.organize();
let metPip=false,collected=false,persisted=true;try{collected=localStorage.getItem('krownPin')==='1';}catch{persisted=false;}function refreshPin(){pin.visible=!collected;$('#pins').textContent=collected?('Collection · 1 / 1 · '+(persisted?'saved on this device':'this visit only')):'Collection · 0 / 1';if(collected)$('#questTitle').textContent="Founder's Krown discovered";}refreshPin();
let playing=false,night=false,near=null,yaw=0,pitch=0,drag=null,padPointer=null,last=0;const keys={},joy={x:0,y:0},velocity={x:0,z:0};
$('#welcome small').textContent='WASD / arrows: walk · drag: look · Q / R: turn · Shift: faster · E: interact. Touch: left pad to walk, drag the scene to look. Fountain sound is optional.';
function blocked(x,z){if(x<-61||x>53||(x<-53&&z<128)||z<-92||z>178||(z<-79&&Math.abs(x)>12))return true;return colliders.some(c=>c.r?Math.hypot(x-c.x,z-c.z)<c.r+.3:Math.abs(x-c.x)<c.w&&Math.abs(z-c.z)<c.d);}
const visit=createVisit({getItem:k=>localStorage.getItem(k),setItem:(k,v)=>localStorage.setItem(k,v)},blocked);
let pendingVisit=visit.read(),lastVisitSave=0;
const resumeInfo=$('#resumeInfo'),gateStart=$('#startAtGate');
function refreshResume(){resumeInfo.hidden=gateStart.hidden=!pendingVisit;if(!pendingVisit)return;$('#enter').textContent='Continue exploring';$('#welcome h2').textContent='Welcome back to Krownlandia.';resumeInfo.textContent='Continue from your saved spot · '+(pendingVisit.night?'Night':'Day')+' view'+(pendingVisit.destination?' · Walking to '+pendingVisit.destination.name:pendingVisit.directionsStopped?' · Exploring freely':'')+'. Starting at the gate keeps your rewards, home and keepsakes.';}
refreshResume();
gateStart.onclick=()=>{if(pendingVisit){night=pendingVisit.night;applyLighting(true);}reset();$('#enter').onclick();};
function saveVisit(){if(restoringProgress||!playing)return;const v=tram.active||safari.active||journey.active||lounges.seated||seating.active?visit.read():{x:camera.position.x,z:camera.position.z,yaw:Math.atan2(Math.sin(yaw),Math.cos(yaw)),pitch,night};if(v)visit.save({...v,night,destination:rewards.target||null,directionsStopped:rewards.target?false:directionsStopped});}
let visibilityResumed=false;
addEventListener('pagehide',saveVisit);document.addEventListener('visibilitychange',()=>{visibilityResumed=true;if(document.hidden){rewards.stopFountain();keysReset();saveVisit();}else queueFrame();});
function reset(){tram.cancel();seating.stand();lounges.stand();circus.stop();if(safari.active)safari.exit();if(journey.active)journey.exit();camera.position.set(0,1.75,30);yaw=0;pitch=0;velocity.x=velocity.z=0;pendingVisit=null;resumeInfo.hidden=gateStart.hidden=true;rewards.clearGuide();directionsStopped=false;$('#enter').textContent='Enter the park';visit.save({x:0,z:30,yaw:0,pitch:0,night});}$('#home').onclick=reset;
$('#enter').onclick=()=>{if(pendingVisit){camera.position.set(pendingVisit.x,1.75,pendingVisit.z);yaw=pendingVisit.yaw;pitch=pendingVisit.pitch;night=pendingVisit.night;if(pendingVisit.destination)rewards.guideToPoint(pendingVisit.destination);directionsStopped=pendingVisit.directionsStopped===true&&!pendingVisit.destination;applyLighting(true);pendingVisit=null;}playing=true;$('#welcome').hidden=true;saveVisit();};
let nightBlend=0;
const daySky=new T.Color('#9fcfe5'),nightSky=new T.Color('#09172d'),daySun=new T.Color('#ffe4b2'),nightSun=new T.Color('#8daeff');
function paintLighting(){scene.background.copy(daySky).lerp(nightSky,nightBlend);scene.fog.color.copy(scene.background);hemi.intensity=2.1-1.6*nightBlend;sun.intensity=3.3-2.95*nightBlend;sun.color.copy(daySun).lerp(nightSun,nightBlend);lamps.forEach(l=>l.material.emissiveIntensity=.2+4.8*nightBlend);}
function lookUpFromSeat(){keysReset();yaw=camera.rotation.y;pitch=.85;camera.rotation.set(pitch,yaw,0);}
function applyLighting(immediate=false){if(immediate||systemMotion?.matches){nightBlend=Number(night);paintLighting();}$('#night').textContent=night?'Day view':'Night view';$('#night').title=night?'Switch to day':'Switch to night';$('#night').setAttribute('aria-label',night?'Switch to day':'Switch to night');}
function advanceLighting(dt){const target=Number(night);if(nightBlend===target)return;nightBlend=systemMotion?.matches?target:nightBlend<target?Math.min(target,nightBlend+dt/3):Math.max(target,nightBlend-dt/3);paintLighting();}
$('#night').onclick=()=>{night=!night;applyLighting();if(pendingVisit){pendingVisit.night=night;visit.save(pendingVisit);refreshResume();}else saveVisit();};
$('#reference').onclick=()=>{$('#art').showModal();keysReset();};$('#closeArt').onclick=()=>$('#art').close();$('#closeTalk').onclick=()=>$('#talk').close();$('#hint').onclick=()=>$('#speech').textContent='Pollinators help flowering plants reproduce. Our first pin is east of the Krown Fountain, on the near edge of the Discovery Garden pond.';
function interact(){if(contextLost||!playing||seating.active||$('#talk').open||$('#art').open||rewards.isOpen||parkMap.isOpen||graphics.isOpen||lounges.isOpen||villages.isOpen||tram.isOpen||residents.isOpen||journal.isOpen||parkInterface.isOpen||backup.isOpen||help.isOpen||builders.isOpen||officeGarden.isOpen||townSquare.isOpen||library.isOpen||studio.isOpen||whisperingPines.isOpen||stonehearth.isOpen||eldergrove.isOpen||school.isOpen||bridge.isOpen||riverbend.isOpen||generalStore.isOpen||clubhouse.isOpen||produceGarden.isOpen||circus.isOpen||communityWalk.isOpen||foodGuide.isOpen||video.isOpen||journey.active||safari.active||tram.active)return;if(near==='studio'){studio.open();return;}if(near==='pines'){whisperingPines.open();return;}if(near==='stonehearth'){stonehearth.open();return;}if(near==='craft'){villages.openCraft();return;}if(near==='school'){school.open();return;}if(near==='bridge'){bridge.open();return;}if(near==='riverbend'){riverbend.open();return;}if(near==='generalstore'){generalStore.open();return;}if(near==='clubhouse'){clubhouse.open();return;}if(near==='produce'){produceGarden.open();return;}if(near==='eldergrove'){eldergrove.open();return;}if(near==='library'){library.open();return;}if(near==='square'){townSquare.open();return;}if(near==='office'){officeGarden.open();return;}if(near==='builders'){builders.open();return;}if(near==='resident'){residents.open();return;}if(near==='tram'){tram.open();return;}if(near==='mailbox'){villages.openMailbox();return;}if(near==='home'){villages.open();return;}if(near==='lounge'){lounges.open(lounges.near);return;}if(near==='popcorn'){popcorn.interact();return;}if(near==='circus'){circus.start();return;}if(near==='roasted-menu'||near==='roasted-return'){rewards.open(near);return;}if(near==='safari'){saveVisit();safari.board();return;}if(near==='coffee'){rewards.open('coffee');return;}if(near==='journey'){saveVisit();journey.board();return;}if(near?.startsWith('reward:')){rewards.open(near.slice(7));return;}if(near==='pip'){metPip=true;$('#talk').showModal();keysReset();}if(near==='pin'){collected=true;try{localStorage.setItem('krownPin','1');}catch{persisted=false;$('#quest p').textContent='Collected this visit; browser storage is unavailable.';}refreshPin();}}$('#interact').onclick=interact;
function keysReset(){for(let k in keys)keys[k]=false;joy.x=joy.y=0;velocity.x=velocity.z=0;drag=null;padPointer=null;const knob=$('#joystick')?.firstElementChild;if(knob)knob.style.transform='';}addEventListener('blur',keysReset);
function worldInputAvailable(){return playing&&!document.hidden&&!contextLost;}
const movementKeys=new Set(['w','a','s','d','q','r','arrowup','arrowdown','arrowleft','arrowright','shift']);
addEventListener('keydown',e=>{if(!worldInputAvailable()||e.defaultPrevented||e.isComposing||e.ctrlKey||e.metaKey||e.altKey||e.target?.closest?.('input,textarea,select,dialog,[contenteditable="true"],#error,#gatewayReading'))return;const key=e.key.toLowerCase();if(key==='e'){if(!e.repeat)interact();return;}if(!movementKeys.has(key))return;if(key.startsWith('arrow')){if(e.target?.closest?.('button,a,summary,#journey,#safari'))return;e.preventDefault();}keys[key]=true;});addEventListener('keyup',e=>{const key=e.key.toLowerCase();if(movementKeys.has(key))keys[key]=false;});
const canvas=renderer.domElement;canvas.onpointerdown=e=>{if(!playing||document.hidden||contextLost||journey.active||drag)return;try{canvas.setPointerCapture(e.pointerId);}catch{return;}drag={id:e.pointerId,x:e.clientX,y:e.clientY};};canvas.onpointermove=e=>{if(!drag||drag.id!==e.pointerId)return;if(tram.active){tram.look(e.clientX-drag.x,e.clientY-drag.y);drag={id:e.pointerId,x:e.clientX,y:e.clientY};return;}if(safari.active){safari.look(e.clientX-drag.x,e.clientY-drag.y);drag={id:e.pointerId,x:e.clientX,y:e.clientY};return;}yaw-=(e.clientX-drag.x)*.004;pitch=Math.max(-1.1,Math.min(1.1,pitch-(e.clientY-drag.y)*.004));drag={id:e.pointerId,x:e.clientX,y:e.clientY};};canvas.onpointerup=canvas.onpointercancel=canvas.onlostpointercapture=e=>{if(drag?.id===e.pointerId)drag=null;};
const pad=$('#joystick');function padMove(e){const r=pad.getBoundingClientRect();if(r.width<=0||r.height<=0){joy.x=joy.y=0;pad.firstElementChild.style.transform='';return;}const dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,diameter=Math.min(r.width,r.height),n=Math.max(diameter*.35,Math.hypot(dx,dy));joy.x=dx/n;joy.y=dy/n;pad.firstElementChild.style.transform='translate('+joy.x*diameter*.28+'px,'+joy.y*diameter*.28+'px)';}pad.onpointerdown=e=>{if(!playing||document.hidden||contextLost||journey.active||tram.active||safari.active||padPointer!==null)return;try{pad.setPointerCapture(e.pointerId);}catch{return;}padPointer=e.pointerId;padMove(e);};pad.onpointermove=e=>{if(padPointer===e.pointerId&&pad.hasPointerCapture(e.pointerId))padMove(e);};pad.onpointerup=pad.onpointercancel=pad.onlostpointercapture=e=>{if(padPointer!==e.pointerId)return;padPointer=null;joy.x=joy.y=0;pad.firstElementChild.style.transform='';};
function resizeViewport(){
 const width=innerWidth,height=innerHeight;
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)return;
 if(width===viewportWidth&&height===viewportHeight)return;
 const aspect=width/height;
 if(aspect!==camera.aspect){camera.aspect=aspect;camera.updateProjectionMatrix();}
 renderer.setSize(width,height);viewportWidth=width;viewportHeight=height;
}
addEventListener('resize',resizeViewport);
let contextLost=false,contextResumed=false,frameQueued=false;
function queueFrame(){
 if(frameQueued||contextLost||document.hidden)return;
 frameQueued=true;requestAnimationFrame(frame);
}
renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();if(contextLost)return;contextLost=true;atmosphere.setGraphicsPaused(true);rewards.stopFountain();keysReset();saveVisit();$('#interact').hidden=true;$('#error').hidden=false;});
renderer.domElement.addEventListener('webglcontextrestored',()=>{if(!contextLost)return;contextLost=false;contextResumed=true;atmosphere.setGraphicsPaused(false);keysReset();$('#error').hidden=true;queueFrame();});
function frame(ms){frameQueued=false;if(document.hidden||visibilityResumed||contextLost||contextResumed){last=ms;visibilityResumed=false;contextResumed=false;queueFrame();return;}if(ms-lastVisitSave>=5000){saveVisit();lastVisitSave=ms;}const dt=Math.min((ms-last)/1000,.05);last=ms;advanceLighting(dt);let modal=$('#art').open||$('#talk').open||rewards.isOpen||parkMap.isOpen||graphics.isOpen||lounges.isOpen||villages.isOpen||tram.isOpen||residents.isOpen||journal.isOpen||parkInterface.isOpen||backup.isOpen||help.isOpen||builders.isOpen||officeGarden.isOpen||townSquare.isOpen||library.isOpen||studio.isOpen||whisperingPines.isOpen||stonehearth.isOpen||eldergrove.isOpen||school.isOpen||bridge.isOpen||riverbend.isOpen||generalStore.isOpen||clubhouse.isOpen||produceGarden.isOpen||circus.isOpen||communityWalk.isOpen||foodGuide.isOpen||video.isOpen;if(playing&&!modal&&!journey.active&&!safari.active&&!tram.active&&!lounges.seated&&!seating.active){let f=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0)-joy.y,r=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+joy.x,n=Math.max(1,Math.hypot(f,r)),v=(keys.shift?8:4.5)/n;const blend=1-Math.exp(-16*dt);velocity.x+=((-Math.sin(yaw)*f+Math.cos(yaw)*r)*v-velocity.x)*blend;velocity.z+=((-Math.cos(yaw)*f-Math.sin(yaw)*r)*v-velocity.z)*blend;let dx=velocity.x*dt,dz=velocity.z*dt;if(!blocked(camera.position.x+dx,camera.position.z))camera.position.x+=dx;else velocity.x=0;if(!blocked(camera.position.x,camera.position.z+dz))camera.position.z+=dz;else velocity.z=0;}
townSquare.update();
seating.update(playing&&!modal&&!journey.active&&!safari.active&&!tram.active&&!lounges.seated);
camera.rotation.set(pitch,yaw,0);journey.update(dt,modal||document.hidden);safari.update(dt,modal||document.hidden,ms);tram.update(dt,modal||document.hidden);circus.update(dt,modal||document.hidden||!playing);riverbend.update(dt,modal||document.hidden||!playing||journey.active||safari.active||tram.active,night);let p=camera.position;rewards.update(ms,{x:p.x,z:p.z,metPip,collected,playing:playing&&!journey.active&&!safari.active&&!tram.active,night,journeyCompleted:journey.completed,safariCompleted:safari.completed,circusCompleted:circus.completed,popcornCollected:popcorn.collected,visitedVillage:villages.visitedVillage});near=studio.near?'studio':whisperingPines.near?'pines':stonehearth.near?'stonehearth':villages.craftNear?'craft':school.near?'school':bridge.near?'bridge':riverbend.near?'riverbend':generalStore.near?'generalstore':clubhouse.near?'clubhouse':villages.mailboxNear?'mailbox':produceGarden.near?'produce':eldergrove.near?'eldergrove':library.near?'library':townSquare.near?'square':officeGarden.near?'office':builders.near?'builders':residents.near?'resident':tram.near?'tram':villages.near?'home':lounges.near?'lounge':popcorn.near()?'popcorn':circus.near()&&!circus.active?'circus':Math.hypot(p.x,p.z+88)<2.2?'roasted-menu':Math.hypot(p.x+7,p.z+84.5)<2?'roasted-return':Math.hypot(p.x-24,p.z+18)<2.2?'coffee':safari.near()?'safari':journey.near()?'journey':Math.hypot(p.x+9,p.z+9)<3.4?'pip':!collected&&Math.hypot(p.x-18,p.z+47)<3?'pin':rewards.near?'reward:'+rewards.near:null;$('#interact').hidden=seating.active||lounges.seated||!near||!playing||modal||journey.active||safari.active||tram.active;$('#interact').textContent=near==='studio'?'E · Composition studio':near==='pines'?'E · Whispering Pines stories':near==='stonehearth'?'E · Stonehearth pattern practice':near==='craft'?'E · '+villages.craftNear.name:near==='school'?'E · Magic School lantern lesson':near==='bridge'?'E · Krown Bridge story':near==='riverbend'?'E · Discover Riverbend':near==='generalstore'?'E · Browse General Store':near==='clubhouse'?'E · Place Managers board':near==='mailbox'?'E · Read welcome note':near==='produce'?'E · Tend the community garden':near==='eldergrove'?'E · Explore Eldergrove':near==='library'?'E · Library reading desk':near==='square'?'E · '+townSquare.interactLabel:near==='office'?'E · Community project board':near==='builders'?'E · Making of Krownlandia':near==='resident'?'E · Talk to '+residents.near.name:near==='tram'?'E · Village tram':near==='home'?'E · Visit / choose this home':near==='lounge'?'E · Relax at '+lounges.near.name:near==='popcorn'?popcorn.label:near==='circus'?'E · Watch the circus show':near==='roasted-menu'?'E · Order at Roasted':near==='roasted-return'?'E · Return reusable bowl':near==='safari'?'E · Board the safari':near==='coffee'?'E · Choose a virtual drink':near==='journey'?'E · Board The Great Journey':near==='pip'?'E · Talk to Pip':near==='pin'?'E · Collect Krown':'E · Rewards station';$('#place').textContent=p.x>=22&&p.x<=30&&p.z>=167&&p.z<=173?'Express Yourself composition studio':p.x>=35&&p.x<=45&&p.z>=165&&p.z<=173?'Whispering Pines story glade':p.x>=-19&&p.x<=-11&&p.z>=137&&p.z<=143?'Stonehearth masonry courtyard':p.x<-53&&p.z>134&&p.z<146?'Magic School':p.x<-53&&p.z>=128?'Krown Bridge west-bank lookout':p.z>164&&p.x<21?'Riverbend cottages & courtyard':p.x<-39&&p.z>127?'Riverbend Riverside':p.x>32&&p.x<44&&p.z>-21&&p.z<-6?'General Store':Math.hypot(p.x+30,p.z-151)<10?'Krownlandia Clubhouse':p.x>-48&&p.x<-32&&p.z>40&&p.z<58?'Community Produce Garden':p.z>133?(villages.near?villages.near.name:'Eldergrove homes & woodland paths'):p.x>21&&p.z>106?'Eldergrove · Great Elder Tree clearing':p.x>21&&p.x<39&&p.z>28&&p.z<53?'Library of Alexandria':Math.abs(p.x)<11.5&&p.z>40&&p.z<60?'Krownlandia Town Square':p.x>12.3&&p.x<17.3&&p.z<-3&&p.z>-22?'Community Office Garden':Math.abs(p.x+26)<6&&Math.abs(p.z-32)<6?'Making of Krownlandia Garden':villages.near?villages.near.name:p.z>95?'Woodland Village':p.z>40?(p.x<0?'Meadow Village':'Bluewater Village'):circus.near()?'Krown Circus':safari.active?'Krownlandia Safari':p.z<-83&&Math.abs(p.x)<12?'Roasted · Krown Palace':journey.active?'The Great Journey':p.x>17&&p.x<31&&p.z<-5&&p.z>-23?"Lisa's Coffee Shop":p.x<-18&&p.z<-30?'The Great Journey gardens':p.z>14?'Arrival Plaza':p.z>-22?'Welcome Gardens':p.z>-58?(p.x>13?'Discovery Garden':'Royal Plaza'):'Krown Palace approach';
if(rewards.target)directionsStopped=false;
const target=rewards.target||(directionsStopped?null:collected?{x:0,z:-75,name:'Palace approach'}:metPip?{x:18,z:-47,name:'Garden Krown'}:{x:-9,z:-9,name:'Pip'});
const seated=seating.active||lounges.seated,riding=journey.active||safari.active||tram.active;
const walking=playing&&!riding&&!seated,trailVisible=walking&&!textOnlyDirections&&!document.body.classList.contains('clear-view');
const route=navigation(ms,p,rewards.target,trailVisible,walking);
stopDirections.disabled=!target;
findRest.disabled=!canFindRest();
let guidanceText,announcement='';
if(target&&seated){guidanceText='Stand up to continue to '+target.name;announcement=guidanceText+'.';}
else if(target&&riding){guidanceText='Walking directions paused · '+target.name;announcement='Walking directions paused for '+target.name+'.';}
else if(target&&route?.unreachable){guidanceText='No walking route found to '+target.name+' · move to an open path or choose another destination.';announcement='No walking route found to '+target.name+'. Move to an open path or choose another destination.';}
else if(target){const directDistance=Math.hypot(target.x-p.x,target.z-p.z),arrived=walking&&directDistance<2.2&&(route?route.distance<2.4:!rewards.target);
 if(arrived){navigation(ms,p,rewards.target,false);guidanceText='Arrived · '+target.name;announcement='Arrived at '+target.name+'.';}
 else{const direction=route?.next||target;let angle=Math.atan2(direction.x-p.x,-(direction.z-p.z))+yaw;angle=Math.atan2(Math.sin(angle),Math.cos(angle));
 guidanceText=target.name+' · '+Math.round(route?.distance??directDistance)+' m · '+(route&&trailVisible?'follow the gold trail · ':'')+(Math.abs(angle)<.35?'ahead':Math.abs(angle)>2.5?'behind you':angle>0?'to your right':'to your left');announcement='Walking directions to '+target.name+'.';}
}else guidanceText='Explore freely · choose a destination in the Park map.';
if(guide.textContent!==guidanceText)guide.textContent=guidanceText;
if(rewards.target)announcePath(announcement);
else if(!directionsStopped)announcePath('');

if(playing&&!modal&&!journey.active&&!safari.active&&!tram.active){if(keys.q)yaw+=dt*1.3;if(keys.r)yaw-=dt*1.3;}
residents.update(ms);villages.update(nightBlend,ms);const stillDecor=systemMotion?.matches===true;
atmosphere(ms,nightBlend,stillDecor);scenery(ms,stillDecor);
coffeeScene(ms,rewards.drink,nightBlend);
roastedScene(rewards.roastedOrder);
courtyard(ms,nightBlend);
parkMap.update({x:p.x,z:p.z,yaw:camera.rotation.y,safari:safari.state()});
pipGroup.rotation.y=Math.atan2(p.x+9,p.z+9);pin.rotation.y=ms*.001;pin.position.y=1.3+Math.sin(ms*.002)*.12;
const showTime=rewards.fountainTime(ms);
drops.visible=!graphics.stillWater;
if(drops.visible)updateFountainSpray(ms,showTime);
renderer.render(scene,camera);queueFrame();}queueFrame();
window.krownlandia={studio,whisperingPines,stonehearth,fireflyBenches,foodGuide,communityWalk,camera,scene,blocked,interact,reset,lounges,seating,villages,tram,residents,journal,builders,officeGarden,townSquare,library,eldergrove,produceGarden,clubhouse,generalStore,riverbend,bridge,school,getState:()=>({collected,near,playing,night,position:camera.position.toArray(),batching,safari:safari.state(),journey:journey.state(),rewards:rewards.state()})};
