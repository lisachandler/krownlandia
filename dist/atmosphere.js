import * as T from './vendor/three.module.js';

// Material relief is real-time surface detail, not a photographic backdrop.
export function enrich({scene,camera,stone,trim,grass,leaf,lamps,renderer}) {
  let seed=9127;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const data=new Uint8Array(128*128*4);
  for(let i=0;i<128*128;i++){const v=170+Math.floor(random()*70);data.set([v,v,v,255],i*4);}
  const grain=new T.DataTexture(data,128,128,T.RGBAFormat);grain.wrapS=grain.wrapT=T.RepeatWrapping;
  grain.magFilter=T.LinearFilter;grain.minFilter=T.LinearMipmapLinearFilter;grain.generateMipmaps=true;grain.repeat.set(5,5);grain.needsUpdate=true;
  for(const m of [stone,trim]){m.bumpMap=grain;m.bumpScale=.065;m.roughnessMap=grain;m.needsUpdate=true;}
  grass.bumpMap=grain;grass.bumpScale=.18;grass.needsUpdate=true;
  // A small environment map gives metal and glass something to reflect.
  const sky=new T.Scene();sky.background=new T.Color('#c3e2f2');
  const ground=new T.Mesh(new T.PlaneGeometry(400,400),new T.MeshBasicMaterial({color:'#738867'}));ground.rotation.x=-Math.PI/2;ground.position.y=-15;sky.add(ground);
  const glow=new T.Mesh(new T.SphereGeometry(8,12,8),new T.MeshBasicMaterial({color:'#fff5d8'}));glow.position.set(-50,75,20);sky.add(glow);
  const pmrem=new T.PMREMGenerator(renderer);const env=pmrem.fromScene(sky,.1);scene.environment=env.texture;scene.environmentIntensity=.55;pmrem.dispose();ground.geometry.dispose();ground.material.dispose();glow.geometry.dispose();glow.material.dispose();

  // Ground planting is instanced to keep thousands of blades to one draw call.
  const blades=new T.InstancedMesh(new T.ConeGeometry(.09,.55,3),leaf,1500),d=new T.Object3D();
  for(let i=0;i<1500;i++){const side=i%2?1:-1;d.position.set(side*(15+random()*36),.18,30-random()*109);d.rotation.set((random()-.5)*.35,random()*6.28,0);d.scale.setScalar(.5+random());if(d.position.x<-18&&d.position.z<-30&&d.position.z>-75)d.scale.setScalar(0);d.updateMatrix();blades.setMatrixAt(i,d.matrix);}
  blades.name='Ground planting';blades.receiveShadow=true;blades.computeBoundingSphere();scene.add(blades);
  const ripples=[];
  for(const [x,y,z,r] of [[0,.752,-35,5.8],[24,.322,-51,4.6]]){
    for(let i=0;i<5;i++){const ring=new T.Mesh(new T.RingGeometry(.97,1,80),new T.MeshBasicMaterial({color:'#b8e5f0',transparent:true,opacity:.18,side:T.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;ring.position.set(x,y+i*.001,z);scene.add(ring);ripples.push({ring,r,phase:i/5});}
  }
  const lightSources=lamps.filter((_,i)=>i%3===0).map(b=>{const l=new T.PointLight('#ffc572',0,11,2);l.position.copy(b.position);scene.add(l);return l;});
  const gardenLights=new T.InstancedMesh(new T.SphereGeometry(.04,5,4),new T.MeshBasicMaterial({color:'#fff4a2',transparent:true,opacity:0,depthWrite:false}),55);gardenLights.frustumCulled=false;scene.add(gardenLights);
  const fireflies=Array.from({length:55},()=>({x:14+random()*19,z:-40-random()*23,y:.8+random()*2.3,phase:random()*6.28}));

  // Small woodland groups remain outside home interiors and animate only nearby at night.
  const woodlandFireflies=[[-25,130,'Woodland edge'],[27,112,'Eldergrove clearing'],[36,143,'Eldergrove home path']].map(([x,z,name])=>{
    const mesh=new T.InstancedMesh(new T.SphereGeometry(.045,5,4),new T.MeshBasicMaterial({color:'#e8ef9c',transparent:true,opacity:.8,depthWrite:false}),24);
    mesh.name='Forest fireflies · '+name;mesh.position.set(x,0,z);mesh.visible=false;mesh.frustumCulled=false;mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);scene.add(mesh);
    const flies=Array.from({length:24},()=>({x:(random()-.5)*6,z:(random()-.5)*4,y:.85+random()*1.35,phase:random()*Math.PI*2,speed:.00035+random()*.00012}));
    return {mesh,flies};
  });

  // Decorative sky, fixed in direction and drawn behind the park in one call.
  const starPositions=new Float32Array(420*3),starColors=new Float32Array(420*3);
  for(let i=0;i<420;i++){const y=.14+random()*.86,angle=random()*Math.PI*2,r=Math.sqrt(1-y*y),brightness=.55+random()*.45;starPositions.set([280*r*Math.cos(angle),280*y,280*r*Math.sin(angle)],i*3);starColors.set([brightness*.88,brightness*.94,brightness],i*3);}
  const starGeometry=new T.BufferGeometry();starGeometry.setAttribute('position',new T.BufferAttribute(starPositions,3));starGeometry.setAttribute('color',new T.BufferAttribute(starColors,3));
  const starPixels=new Uint8Array(16*16*4);for(let y=0;y<16;y++)for(let x=0;x<16;x++){const radius=Math.hypot((x-7.5)/7.5,(y-7.5)/7.5),alpha=Math.max(0,1-radius);starPixels.set([255,255,255,Math.round(255*alpha*alpha)],(y*16+x)*4);}
  const starTexture=new T.DataTexture(starPixels,16,16,T.RGBAFormat);starTexture.magFilter=T.LinearFilter;starTexture.minFilter=T.LinearFilter;starTexture.needsUpdate=true;
  const stars=new T.Points(starGeometry,new T.PointsMaterial({map:starTexture,size:2.4,sizeAttenuation:false,vertexColors:true,transparent:true,opacity:0,alphaTest:.005,depthWrite:false,depthTest:true,fog:false,toneMapped:false}));
  stars.name='Krownlandia night sky';stars.frustumCulled=false;stars.visible=false;stars.renderOrder=-1;scene.add(stars);

  const sound=document.createElement('button');sound.id='sound';sound.textContent='Sound off';sound.setAttribute('aria-pressed','false');document.querySelector('nav').append(sound);
  let ac=null,source=null,master=null,panner=null,audioOn=false,audioBusy=false,audioFailed=false;
  async function toggleSound(){
    if(audioBusy||audioFailed)return;audioBusy=true;sound.disabled=true;
    try {
      if(!ac){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error('Audio unavailable');ac=new Audio();
        const buffer=ac.createBuffer(1,ac.sampleRate*3,ac.sampleRate),samples=buffer.getChannelData(0);let previous=0;
        for(let i=0;i<samples.length;i++){previous=(previous+(Math.random()*2-1)*.06)/1.03;samples[i]=previous*3;}
        source=ac.createBufferSource();source.buffer=buffer;source.loop=true;
        const filter=ac.createBiquadFilter();filter.type='lowpass';filter.frequency.value=1800;
        panner=ac.createPanner();panner.panningModel='HRTF';panner.distanceModel='inverse';panner.refDistance=6;panner.rolloffFactor=1.5;panner.setPosition(0,1,-35);
        master=ac.createGain();master.gain.value=0;source.connect(filter).connect(panner).connect(master).connect(ac.destination);source.start();
      }
      if(!audioOn)await ac.resume();audioOn=!audioOn;master.gain.setTargetAtTime(audioOn&&!document.hidden?.32:0,ac.currentTime,.15);sound.textContent=audioOn?'Sound on':'Sound off';sound.setAttribute('aria-pressed',String(audioOn));if(document.hidden||!audioOn)await ac.suspend().catch(()=>{});
    }catch{audioFailed=true;sound.textContent='Sound unavailable';}
    finally{audioBusy=false;sound.disabled=audioFailed;}
  }
  sound.onclick=toggleSound;
  document.addEventListener('visibilitychange',()=>{if(!ac)return;if(document.hidden){master.gain.setTargetAtTime(0,ac.currentTime,.15);ac.suspend().catch(()=>{});}else if(audioOn)ac.resume().then(()=>{if(document.hidden||!audioOn)return ac.suspend().catch(()=>{});master.gain.setTargetAtTime(.32,ac.currentTime,.15);}).catch(()=>{});});
  const direction=new T.Vector3();
  const animate=(ms,night)=>{
    const mix=Number(night);stars.visible=mix>0;stars.material.opacity=.9*mix*mix;stars.position.copy(camera.position);lightSources.forEach(l=>l.intensity=12*mix);scene.environmentIntensity=.55-.43*mix;gardenLights.visible=mix>0;gardenLights.material.opacity=mix;
    for(const {ring,r,phase} of ripples){const t=(ms*.00013+phase)%1;ring.scale.setScalar(.1+t*r);ring.material.opacity=(1-t)*.22;}
    if(night){fireflies.forEach((f,i)=>{d.position.set(f.x+Math.sin(ms*.0006+f.phase),f.y+Math.sin(ms*.001+f.phase)*.35,f.z+Math.cos(ms*.0007+f.phase));d.scale.setScalar(.6+.4*Math.sin(ms*.002+f.phase));d.rotation.set(0,0,0);d.updateMatrix();gardenLights.setMatrixAt(i,d.matrix);});gardenLights.instanceMatrix.needsUpdate=true;}
    for(const {mesh,flies} of woodlandFireflies){
      mesh.material.opacity=.8*mix;mesh.visible=mix>0&&Math.hypot(camera.position.x-mesh.position.x,camera.position.z-mesh.position.z)<65;
      if(!mesh.visible)continue;
      flies.forEach((f,i)=>{const t=ms*f.speed+f.phase;d.position.set(f.x+Math.sin(t)*.7,f.y+Math.sin(t*.7)*.22,f.z+Math.cos(t*.8)*.65);d.rotation.set(0,0,0);d.scale.setScalar(.7+.18*Math.sin(t*1.4));d.updateMatrix();mesh.setMatrixAt(i,d.matrix);});mesh.instanceMatrix.needsUpdate=true;
    }
    if(ac&&audioOn&&ac.state==='running'){
      const listener=ac.listener;camera.getWorldDirection(direction);listener.setPosition(camera.position.x,camera.position.y,camera.position.z);listener.setOrientation(direction.x,direction.y,direction.z,0,1,0);
    }
  };
  animate.clearPlanting=({x,z,w,d})=>{const matrix=new T.Matrix4(),position=new T.Vector3();for(let i=0;i<blades.count;i++){blades.getMatrixAt(i,matrix);position.setFromMatrixPosition(matrix);if(Math.abs(position.x-x)<=w/2&&Math.abs(position.z-z)<=d/2){matrix.scale(new T.Vector3(0,0,0));blades.setMatrixAt(i,matrix);}}blades.instanceMatrix.needsUpdate=true;blades.computeBoundingSphere();};
  return animate;
}
