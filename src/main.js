import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
const projects = [
 ['Coinbase x Warriors','A mobile-first collectible experience built for game-day energy, blending motion, storytelling, and seamless on-chain minting for fans.',['Sports','Brand activation','3D','On-chain'],'Coinbase.mp4','microsite-golden-state-warriors-and-coinbase-collectible'],
 ['Salesforce Agentforce 360 platform','An interactive storytelling experience that translates complex AI and platform capabilities into a clear, engaging visual journey.',['AI','Enterprise','B2B','Product marketing'],'SF.mp4','enterprise-3d-platform-website-salesforce'],
 ['Vogue Business | Archrival x Gen Z interactive report','An editorial-style digital experience built to present gen z insights in a way that feels visual, dynamic, and easy to explore.',['Editorial','Interactive','Storytelling','Data-driven','Brand experience'],'Vogue.mp4','vogue-business-gen-z-report-editorial-website'],
 ['AMD AI Factory interactive event experience','A stylized 3D world that showcases AMD’s data center and AI infrastructure through immersive storytelling and product-driven scenes.',['Enterprise tech','Event experience','3D','Storytelling','Product visualization'],'amd_720p.mp4','amd-ai-factory-digital-event-experience'],
 ['Coinbase x Clippers collectible','A fast, high-impact digital experience designed for live momentum, where fans could mint and collect in a smooth mobile flow.',['Sports','Web3','Collectible','Brand activation','Mobile'],'Clippers.mp4','coinbase-la-clippers-digital-activation-website'],
 ['Noomo ValenTime immersive storytelling','A playful seasonal microsite where visitors create and share custom hearts through an expressive, interactive visual experience.',['Microsite','3D','Seasonal campaign','Interactive','Storytelling'],'val_720p.mp4','https://valentime.noomoagency.com/'],
 ['Dandy Vision product launch page','A premium product launch page for Dandy’s first intraoral scanner, built to create a first-scroll wow moment while driving demo requests and supporting the broader campaign rollout.',['Healthtech','Product launch','Landing page','3D product visualization'],'Dandy.mp4','dandy-vision-storytelling-website'],
 ['Vibrant Wellness 3D body systems experience','An immersive summit experience that turns complex lab testing into guided exploration — from body overview to system-level insights and test deep dives with videos and case examples.',['Healthtech','Event experience','3D','Immersive','Data visualization'],'car_720p.mp4','vibrant-wellness-immersive-digital-experience'],
 ['Jasmina Denner website','A personal storytelling platform designed to introduce a new voice at the intersection of health, technology, and future-focused ideas.',['Storytelling','Immersive website','Editorial experience','Interactive'],'jas_720p.mp4','https://noomoagency.com/insights/shaping-jasmina-denners-story-through-digital-storitelling']
];
const $ = s => document.querySelector(s);
const mobile = () => innerWidth < 700;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, .1, 100);
camera.position.set(0,0,8);
let renderer;
try {renderer = new THREE.WebGLRenderer({canvas:$('#scene'),antialias:true,powerPreference:'high-performance'});} catch {$('#error').hidden=false;$('#error').textContent='This experience needs WebGL. Please open it in a browser with hardware acceleration enabled.';throw new Error('WebGL unavailable');}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setSize(innerWidth,innerHeight);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
const env = new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();scene.environment=env.fromScene(room,.04).texture;room.dispose();env.dispose();
scene.add(new THREE.HemisphereLight(0xf6dfc3,0x1a1008,2));
const blueLight=new THREE.PointLight(0xff9d60,32,20);blueLight.position.set(0,0,3);scene.add(blueLight);
const key=new THREE.DirectionalLight(0xffffff,5);key.position.set(-3,4,5);scene.add(key);
const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
const post=new ShaderPass({uniforms:{tDiffuse:{value:null},time:{value:0},resolution:{value:new THREE.Vector2(innerWidth,innerHeight)}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`uniform sampler2D tDiffuse;uniform float time;uniform vec2 resolution;varying vec2 vUv;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){vec2 shift=vec2(.00025,0.);vec3 c=vec3(texture2D(tDiffuse,vUv+shift).r,texture2D(tDiffuse,vUv).g,texture2D(tDiffuse,vUv-shift).b);float n=hash(vUv*resolution+fract(time)*37.);c+=(n-.5)*.018;float vig=1.-.35*pow(length(vUv-.5),1.4);gl_FragColor=vec4(c*vig,1.);}`});composer.addPass(post);
const bg=new THREE.Mesh(new THREE.PlaneGeometry(100,70),new THREE.ShaderMaterial({depthWrite:false,uniforms:{time:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec2 vUv;uniform float time;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}void main(){vec2 p=(vUv-.5)*6.;float n=0.,a=.5;for(int i=0;i<5;i++){n+=a*noise(p*7.+time*.008);p*=2.;a*=.5;}float glow=exp(-length((vUv-.5)*vec2(10.,13.)));vec3 c=vec3(.022,.018,.014)+vec3(.16,.073,.027)*pow(n,2.)*glow*4.;gl_FragColor=vec4(c,1.);}`}));bg.position.z=-20;scene.add(bg);
let seed=1729;function random(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646;}
const starsGeo=new THREE.BufferGeometry(),positions=[],colors=[];for(let i=0;i<230;i++){positions.push((random()-.5)*42,(random()-.5)*30,-random()*23);let q=random();colors.push(.65+q*.3,.48+q*.3,.32+q*.3);}starsGeo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));starsGeo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));const stars=new THREE.Points(starsGeo,new THREE.PointsMaterial({size:.028,vertexColors:true,transparent:true,opacity:.35,sizeAttenuation:true}));scene.add(stars);
const metal=new THREE.MeshPhysicalMaterial({color:0xba8760,metalness:1,roughness:.095,clearcoat:1,envMapIntensity:2.8});
const fragments=new THREE.Group();const fragmentGeometry=new THREE.IcosahedronGeometry(.07,0);for(let i=0;i<55;i++){const m=new THREE.Mesh(fragmentGeometry,metal);m.position.set((random()-.5)*20,(random()-.5)*15,(random()-.5)*12-3);m.rotation.set(random()*6,random()*6,random()*6);m.scale.setScalar(.2+random()*1.6);fragments.add(m);}scene.add(fragments);
const manager=new THREE.LoadingManager();manager.onProgress=(_url,loaded,total)=>{$('#load-number').textContent=`${Math.round(loaded/total*100)}%`;};const draco=new DRACOLoader(manager);draco.setDecoderPath('/draco/');const loader=new GLTFLoader(manager);loader.setDRACOLoader(draco);
const caseGeometries=[];
const logoGroup=new THREE.Group();scene.add(logoGroup);
const sculptureMaterial=new THREE.MeshPhysicalMaterial({color:0xd8ac86,metalness:1,roughness:.17,clearcoat:1,envMapIntensity:2.4});
const sculpture=new THREE.Mesh(new THREE.TorusKnotGeometry(1.18,.31,220,36,2,3),sculptureMaterial);logoGroup.add(sculpture);
const orbitMaterial=new THREE.MeshBasicMaterial({color:0xa9937d,transparent:true,opacity:.38});
for(let i=0;i<2;i++){const orbit=new THREE.Mesh(new THREE.TorusGeometry(1.98+i*.18,.006,6,160),orbitMaterial);orbit.rotation.set(.9+i*.8,.35+i*.7,.2);logoGroup.add(orbit);}
const satellite=new THREE.Mesh(new THREE.SphereGeometry(.11,24,16),sculptureMaterial);logoGroup.add(satellite);
const loading=loader.loadAsync('/models/casesStone16.glb').then(g=>{g.scene.traverse(o=>{if(o.isMesh&&o.name.startsWith('stone')){const geometry=o.geometry.clone();geometry.computeBoundingBox();const size=geometry.boundingBox.getSize(new THREE.Vector3());geometry.center();geometry.scale(2.5/size.x,2.5/size.x,2.5/size.x);caseGeometries.push(geometry);}});});
const videos=projects.map(p=>{let v=document.createElement('video');v.src='/videos/'+p[3];v.loop=true;v.muted=true;v.playsInline=true;v.preload='none';return v;});
const textures=videos.map(v=>{const t=new THREE.VideoTexture(v);t.colorSpace=THREE.SRGBColorSpace;return t;});
const crystalGroup=new THREE.Group();scene.add(crystalGroup);
const crystalGeo=new THREE.IcosahedronGeometry(1.26,1);
const crystalMat=new THREE.ShaderMaterial({uniforms:{video:{value:textures[0]},time:{value:0}},vertexShader:`varying vec3 vNormal;varying vec3 vPosition;void main(){vNormal=normalize(normalMatrix*normal);vPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform sampler2D video;uniform float time;varying vec3 vNormal;varying vec3 vPosition;void main(){vec3 n=normalize(vNormal);vec2 uv=vPosition.xy*.43+.5;uv+=n.xy*.055;vec3 c=texture2D(video,clamp(uv,0.,1.)).rgb;float edge=pow(1.-abs(n.z),2.);float shine=pow(max(dot(n,normalize(vec3(-.5,.8,1.))),0.),25.);c=c*.92+edge*vec3(.3,.15,.06)+shine*.5;gl_FragColor=vec4(c,1.);}`});
const crystal=new THREE.Mesh(crystalGeo,crystalMat);crystalGroup.add(crystal);
const rim=new THREE.LineSegments(new THREE.EdgesGeometry(crystalGeo,22),new THREE.LineBasicMaterial({color:0xd8ac86,transparent:true,opacity:.26}));crystalGroup.add(rim);crystalGroup.visible=false;
let current=-1,scroll=0,pointer=new THREE.Vector2(),target=new THREE.Vector2();
function selectProject(index){if(index===current)return;videos.forEach((v,i)=>{if(i!==index)v.pause();});current=index;if(caseGeometries[index]){crystal.geometry=caseGeometries[index];rim.geometry.dispose();rim.geometry=new THREE.EdgesGeometry(crystal.geometry,25);}const p=projects[index];$('#case-title').textContent=p[0];$('#case-description').textContent=p[1];$('#case-link').href=p[4].startsWith('https')?p[4]:'https://noomoagency.com/work/'+p[4];$('#tags').replaceChildren(...p[2].map(t=>{const s=document.createElement('span');s.textContent=t;return s;}));$('#number').textContent=String(index+1).padStart(2,'0');$('.track i').style.transform=`scaleX(${(index+1)/9})`;crystalMat.uniforms.video.value=textures[index];videos[index].play().catch(()=>{});}
const audio=new Audio('/audio/ShowcaseBG.mp3');audio.loop=true;audio.volume=.3;
$('#sound').addEventListener('click',async()=>{if(audio.paused){try{await audio.play();$('#sound').setAttribute('aria-pressed','true');$('#sound').setAttribute('aria-label','Mute sound');$('#sound-label').textContent='Sound on';}catch{}}else{audio.pause();$('#sound').setAttribute('aria-pressed','false');$('#sound').setAttribute('aria-label','Enable sound');$('#sound-label').textContent='Sound off';}});
$('#start').addEventListener('click',()=>window.scrollTo({top:innerHeight*1.1,behavior:reduced?'instant':'smooth'}));$('#back').addEventListener('click',()=>window.scrollTo({top:0,behavior:reduced?'instant':'smooth'}));$('.brand').addEventListener('click',e=>{e.preventDefault();window.scrollTo({top:0,behavior:reduced?'instant':'smooth'});});
window.addEventListener('pointermove',e=>{target.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);});
function resize(){renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();post.uniforms.resolution.value.set(innerWidth,innerHeight);}
window.addEventListener('resize',resize);document.addEventListener('visibilitychange',()=>{if(document.hidden){audio.pause();videos.forEach(v=>v.pause());}else{if($('#sound').getAttribute('aria-pressed')==='true')audio.play().catch(()=>{});if(current>=0)videos[current].play().catch(()=>{});}});
await loading.catch(err=>{console.error(err);$('#error').hidden=false;$('#error').textContent='The 3D assets could not load. Please refresh to try again.';});resize();$('#loader').classList.add('done');
let last=performance.now();
function frame(now){requestAnimationFrame(frame);if(document.hidden)return;const dt=Math.min((now-last)/1000,.05);last=now;const time=reduced?0:now*.001;scroll=THREE.MathUtils.damp(scroll,window.scrollY/innerHeight,7,dt);pointer.lerp(target,1-Math.exp(-3*dt));const entering=THREE.MathUtils.smoothstep(scroll,.12,.85);const end=THREE.MathUtils.smoothstep(scroll,11.3,11.8);const inCase=scroll>.7&&scroll<11.5;
 const viewWidth=2*Math.tan(THREE.MathUtils.degToRad(21))*8*camera.aspect;
 logoGroup.visible=scroll<1;logoGroup.position.set((mobile()?0:viewWidth*.235)+pointer.x*.12,mobile()?-.85:pointer.y*.1,.15+entering*4);logoGroup.rotation.set(.12+pointer.y*.15,time*.12+pointer.x*.18+entering*1.2,-.28);logoGroup.scale.setScalar((mobile()?.50:Math.min(1.13,viewWidth*.105))*(1-entering*.6));
 satellite.position.set(Math.cos(time*.5)*2.1,Math.sin(time*.5)*1.25,Math.sin(time*.5)*1.6);
 $('.hero-copy').style.opacity=String(1-entering);$('.hero-foot').style.opacity=String(1-entering);
 stars.rotation.z=time*.002;stars.position.x=pointer.x*.06;fragments.rotation.y=time*.015+scroll*.05;fragments.rotation.z=scroll*.06;fragments.scale.setScalar(.7+entering*.3);fragments.visible=scroll>.1;
 bg.material.uniforms.time.value=time;post.uniforms.time.value=time;crystalGroup.visible=inCase;
 if(inCase){const raw=Math.max(0,(scroll-.85)/1.2),index=Math.min(8,Math.floor(raw));selectProject(index);const phase=raw%1;const transition=THREE.MathUtils.smoothstep(phase,.82,1);crystalGroup.position.set((mobile()?0:viewWidth*.22)+pointer.x*.13,mobile()?1:.05+Math.sin(time*.5)*.055,-transition*2);crystalGroup.scale.setScalar((mobile()?.78:1.15)*(1-transition*.45)*(1-end));crystalGroup.rotation.set(pointer.y*.06,Math.sin(time*.25)*.12+transition*1.5,Math.sin(time*.3)*.025);crystalMat.uniforms.time.value=time;}
 $('#case').classList.toggle('visible',inCase&&entering>.9&&end<.3);$('#position').style.opacity=inCase?'1':'0';$('#start').style.opacity=String(1-entering);$('#start').style.pointerEvents=entering>.5?'none':'auto';composer.render();}
requestAnimationFrame(frame);
