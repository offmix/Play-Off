import * as THREE from 'three';

const start = document.getElementById('start');
const gameover = document.getElementById('gameover');
const complete = document.getElementById('complete');
const levelLabel = document.getElementById('level');
const score = document.getElementById('score');

let level = 1;
let crowdCount = 1;
let playing = false;
let targetX = 0;
let playerZ = 0;
let gates = [];
let coins = [];
let finishZ = -95;
let crowd = [];

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 25, 120);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 200);
camera.position.set(0, 8, 8);
camera.lookAt(0, 0, -8);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
document.body.prepend(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x668855, 1.6));
const sun = new THREE.DirectionalLight(0xffffff, 1.8);
sun.position.set(8, 20, 10);
sun.castShadow = true;
scene.add(sun);

const playerGroup = new THREE.Group();
scene.add(playerGroup);

const track = new THREE.Mesh(
  new THREE.BoxGeometry(8, .2, 160),
  new THREE.MeshStandardMaterial({color:0xe9edf3, roughness:.8})
);
track.position.set(0, -.12, -70);
track.receiveShadow = true;
scene.add(track);

for(let i=-8;i<=8;i+=4){
  const edge = new THREE.Mesh(new THREE.BoxGeometry(.12,.35,160),new THREE.MeshStandardMaterial({color:0xaab4c2}));
  edge.position.set(i%8===0?4:-4,0,-70);
  scene.add(edge);
}

function createUnit(color=0x2196f3){
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({color,roughness:.55});
  const head = new THREE.Mesh(new THREE.SphereGeometry(.13,10,10),mat); head.position.y=1.02;
  const body = new THREE.Mesh(new THREE.CylinderGeometry(.07,.055,.48,8),mat); body.position.y=.64;
  const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.38,6),mat); leg1.position.set(-.08,.2,0);
  const leg2 = leg1.clone(); leg2.position.x=.08;
  g.add(head,body,leg1,leg2); g.traverse(o=>{if(o.isMesh)o.castShadow=true});
  return g;
}

function syncCrowd(){
  while(crowd.length>Math.max(0,crowdCount)) playerGroup.remove(crowd.pop());
  while(crowd.length<Math.max(0,crowdCount) && crowd.length<160){
    const u=createUnit(); playerGroup.add(u); crowd.push(u);
  }
  const cols=Math.ceil(Math.sqrt(crowd.length));
  crowd.forEach((u,i)=>{
    const row=Math.floor(i/cols), col=i%cols, rowCount=Math.min(cols,crowd.length-row*cols);
    u.position.set((col-(rowCount-1)/2)*.38,row*.38,0);
  });
}

function clearWorld(){
  for(const g of gates) scene.remove(g.group);
  for(const c of coins) scene.remove(c.mesh);
  gates=[];coins=[];
}

function gatePanel(text,color){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;
  const ctx=canvas.getContext('2d');ctx.fillStyle=color;ctx.fillRect(0,0,512,256);ctx.fillStyle='#fff';ctx.font='bold 150px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,128);
  return new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(canvas)});
}

function makeGate(z,index){
  const group=new THREE.Group();group.position.z=z;
  const leftOp=Math.random()<.35?'sub':'add';const rightOp=Math.random()<.45?'mul':'add';
  const leftVal=leftOp==='sub'?2+Math.floor(Math.random()*4):2+Math.floor(Math.random()*7);
  const rightVal=rightOp==='mul'?2+Math.floor(Math.random()*3):3+Math.floor(Math.random()*8);
  const left=new THREE.Mesh(new THREE.BoxGeometry(3.8,2.4,.18),gatePanel(leftOp==='sub'?'-'+leftVal:'+'+leftVal,leftOp==='sub'?'#ef4444':'#22a863'));left.position.set(-2,1.2,0);
  const right=new THREE.Mesh(new THREE.BoxGeometry(3.8,2.4,.18),gatePanel(rightOp==='mul'?'×'+rightVal:'+'+rightVal,rightOp==='mul'?'#3b82f6':'#22a863'));right.position.set(2,1.2,0);
  group.add(left,right);scene.add(group);
  gates.push({z,group,left:{op:leftOp,val:leftVal},right:{op:rightOp,val:rightVal},passed:false});
}

function makeCoin(z,x){
  const mesh=new THREE.Mesh(new THREE.TorusGeometry(.28,.09,10,16),new THREE.MeshStandardMaterial({color:0xffd700,metalness:.5,roughness:.25}));mesh.position.set(x,.8,z);scene.add(mesh);coins.push({mesh,z,x,collected:false});
}

function makeFinish(){
  const g=new THREE.Group();g.position.z=finishZ;
  const mat=new THREE.MeshStandardMaterial({color:0x39cf8e});
  for(let i=-4;i<=4;i++){const s=new THREE.Mesh(new THREE.BoxGeometry(.5,.05,.9),mat);s.position.set(i*.9,.02,0);g.add(s)}
  for(const x of [-4,4]){const p=new THREE.Mesh(new THREE.BoxGeometry(.18,3,.18),mat);p.position.set(x,1.5,0);g.add(p)}
  scene.add(g);
}

function generateLevel(){
  clearWorld();playerZ=0;targetX=0;finishZ=-85-level*8;
  track.position.z=finishZ/2;
  track.geometry.dispose();track.geometry=new THREE.BoxGeometry(8,.2,Math.abs(finishZ)+25);
  for(let z=-10;z>finishZ+5;z-=14)makeGate(z,0);
  for(let z=-7;z>finishZ;z-=9) if(Math.random()<.7)makeCoin((Math.random()-.5)*6,z);
  makeFinish();syncCrowd();levelLabel.textContent='LEVEL '+level;
}

function applyGate(g){
  const side=targetX<0?g.left:g.right;
  const before=crowdCount;
  if(side.op==='sub')crowdCount=Math.max(0,crowdCount-side.val);
  if(side.op==='add')crowdCount+=side.val;
  if(side.op==='mul')crowdCount*=side.val;
  syncCrowd();
  if(crowdCount<=0)endGame();
}

function endGame(){playing=false;gameover.style.display='flex'}
function levelClear(){playing=false;score.textContent=`LEVEL ${level} / 人数 ${crowdCount}`;complete.style.display='flex'}

function startGame(){start.style.display='none';gameover.style.display='none';complete.style.display='none';playing=true;crowdCount=1;generateLevel()}

document.getElementById('startBtn').addEventListener('click',startGame);
document.getElementById('retryBtn').addEventListener('click',()=>{level=1;startGame()});
document.getElementById('nextBtn').addEventListener('click',()=>{level++;startGame()});

addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
let dragging=false,lastX=0;
function pointerX(e){return e.clientX??e.touches?.[0]?.clientX??0}
renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;lastX=pointerX(e)});
renderer.domElement.addEventListener('pointermove',e=>{if(!dragging||!playing)return;const x=pointerX(e);targetX+=(x-lastX)/innerWidth*10;targetX=Math.max(-3.2,Math.min(3.2,targetX));lastX=x});
addEventListener('pointerup',()=>dragging=false);
addEventListener('keydown',e=>{
  if(e.code==='ArrowLeft'||e.code==='KeyA')targetX-=.5;
  if(e.code==='ArrowRight'||e.code==='KeyD')targetX+=.5;
  targetX=Math.max(-3.2,Math.min(3.2,targetX));
  if(e.code==='Space'&&!playing&&start.style.display!=='none')startGame();
});

const clock=new THREE.Clock();
function animate(){
  requestAnimationFrame(animate);
  const dt=Math.min(clock.getDelta(),.05);
  if(playing){
    playerZ-=.13;
    playerGroup.position.z=playerZ;
    playerGroup.position.x+=(targetX-playerGroup.position.x)*Math.min(1,dt*10);
    for(const g of gates){if(!g.passed&&playerZ<g.z+.5&&playerZ>g.z-1){g.passed=true;applyGate(g)}}
    for(const c of coins){if(!c.collected&&Math.abs(playerZ-c.z)<.7&&Math.abs(playerGroup.position.x-c.x)<.8){c.collected=true;c.mesh.visible=false;crowdCount++;syncCrowd()}}
    if(playerZ<=finishZ+1)levelClear();
  }
  camera.position.x+=(playerGroup.position.x*.35-camera.position.x)*.08;
  camera.lookAt(playerGroup.position.x*.15,0,playerZ-8);
  for(const c of coins)if(!c.collected)c.mesh.rotation.y+=dt*3;
  renderer.render(scene,camera);
}

generateLevel();syncCrowd();animate();
