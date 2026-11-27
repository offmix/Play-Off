import * as THREE from 'three';
// GLTFLoader removed — GLB boss had material issues

// ─────────────────────────────────────────────────
// GAME STATE
// ─────────────────────────────────────────────────
const state = {
  phase: 'start',  // start, running, battle, complete, gameover
  level: 1,
  coins: 0,
  crowdCount: 1,
  crowdDisplay: 1, // 화면에 보이는 인원 (애니메이션용, crowdCount를 향해 lerp)
  bestCount: 0, // 이번 런에서 최대 인원
  speed: 0,
  baseSpeed: 0.08,
  trackZ: 0,
  targetX: 0,
  trackWidth: 4,
  gates: [],
  obstacles: [],
  grinders: [],
  collectibles: [],
  hammers: [],
  arrows: [],
  pits: [],
  bombs: [],
  lasers: [],
  jumpRamps: [],
  jumping: false, jumpY: 0, jumpVelY: 0, jumpGrace: 0, // 크라우드 점프 상태
  finishLine: null,
  finishZ: 0,
  levelLength: 0,
  // 전투 시스템
  battle: null, // { obs, enemyLeft, allyLeft, timer, fighters }
  // 보스
  boss: null, // { z, requiredCount, group, label, defeated }
  adOwed: 0, // 골든게이트 통과 횟수 (광고 부채)
};

// ─────────────────────────────────────────────────
// RENDERER / SCENE / CAMERA
// ─────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.prepend(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 8, 6);
camera.lookAt(0, 0, -4);

// ─────────────────────────────────────────────────
// LIGHTING
// ─────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 15, 5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(1024, 1024);
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.far = 50;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;
scene.add(dirLight);

// ─────────────────────────────────────────────────
// MATERIALS
// ─────────────────────────────────────────────────
const trackMat = new THREE.MeshStandardMaterial({ color: 0xE8E8F0, roughness: 0.8 });
const trackEdgeMat = new THREE.MeshStandardMaterial({ color: 0xB0B8C8, roughness: 0.6 });
const coinMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.3, metalness: 0.6 });
const finishMat = new THREE.MeshStandardMaterial({ color: 0x4CAF50, roughness: 0.5 });
const grinderMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.8 });
const grinderBladeMat = new THREE.MeshStandardMaterial({ color: 0xCC3333, roughness: 0.4, metalness: 0.5 });

// ─────────────────────────────────────────────────
// STAGE THEMES
// ─────────────────────────────────────────────────
const themes = [
  { // 초원 (Grassland) - Level 1~3
    name: 'grassland',
    sky: ['#87CEEB', '#C8E6C9', '#E8F5E9'],
    ground: 0x4CAF50,
    trackColor: 0xE8E8F0, trackEdge: 0xB0B8C8, stripe: 0xD0D4E0,
    fog: 0xC8E6C9, fogNear: 30, fogFar: 80,
  },
  { // 사막 (Desert) - Level 4~6
    name: 'desert',
    sky: ['#FFA726', '#FFE0B2', '#FFF8E1'],
    ground: 0xE8C87A,
    trackColor: 0xF5E6CC, trackEdge: 0xC8A870, stripe: 0xEAD9B5,
    fog: 0xFFE0B2, fogNear: 35, fogFar: 90,
  },
  { // 겨울 (Winter) - Level 7~9
    name: 'winter',
    sky: ['#B3E5FC', '#E1F5FE', '#FFFFFF'],
    ground: 0xF0F4F8,
    trackColor: 0xDDE4ED, trackEdge: 0xA8B8CC, stripe: 0xCCD5E0,
    fog: 0xE1F5FE, fogNear: 25, fogFar: 70,
  },
  { // 용암 (Volcanic) - Level 10~12
    name: 'volcanic',
    sky: ['#4A0000', '#BF360C', '#FF6E40'],
    ground: 0x3E2723,
    trackColor: 0x5D4037, trackEdge: 0x4E342E, stripe: 0x6D4C41,
    fog: 0x4A0000, fogNear: 20, fogFar: 60,
  },
  { // 우주 (Space) - Level 13~15
    name: 'space',
    sky: ['#0D0D2B', '#1A1A4E', '#2E1065'],
    ground: 0x1A1A2E,
    trackColor: 0x2A2A4A, trackEdge: 0x4A4A8A, stripe: 0x3A3A5A,
    fog: null,
  },
  { // 네온 (Neon City) - Level 16+
    name: 'neon',
    sky: ['#1A0033', '#330066', '#660099'],
    ground: 0x1A0033,
    trackColor: 0x2A1A3A, trackEdge: 0x9C27B0, stripe: 0x3A2A4A,
    fog: 0x1A0033, fogNear: 25, fogFar: 70,
  },
];

function getTheme(level) {
  const idx = Math.min(Math.floor((level - 1) / 3), themes.length - 1);
  return themes[idx];
}

// ─────────────────────────────────────────────────
// GRADIENT BACKGROUND
// ─────────────────────────────────────────────────
function updateBackground(theme) {
  const t = theme || themes[0];
  const canvas = document.createElement('canvas');
  canvas.width = 2; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, t.sky[0]);
  g.addColorStop(0.5, t.sky[1]);
  g.addColorStop(1, t.sky[2]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 2, 256);
  scene.background = new THREE.CanvasTexture(canvas);
  // Fog
  if (t.fog !== null && t.fog !== undefined) {
    scene.fog = new THREE.Fog(t.fog, t.fogNear, t.fogFar);
  } else {
    scene.fog = null;
  }
}
updateBackground();

// ─────────────────────────────────────────────────
// SCENERY DECORATIONS
// ─────────────────────────────────────────────────
const sceneryGroup = new THREE.Group();
scene.add(sceneryGroup);

function clearScenery() {
  while (sceneryGroup.children.length) sceneryGroup.remove(sceneryGroup.children[0]);
}

function createTree(x, z, scale = 1) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08 * scale, 0.12 * scale, 0.8 * scale, 6),
    new THREE.MeshStandardMaterial({ color: 0x795548 })
  );
  trunk.position.y = 0.4 * scale; g.add(trunk);
  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(0.4 * scale, 1.0 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0x388E3C })
  );
  leaves.position.y = 1.2 * scale; g.add(leaves);
  // 두 번째 층
  const leaves2 = new THREE.Mesh(
    new THREE.ConeGeometry(0.3 * scale, 0.7 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0x43A047 })
  );
  leaves2.position.y = 1.7 * scale; g.add(leaves2);
  g.position.set(x, 0, z);
  return g;
}

function createCactus(x, z, scale = 1) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x558B2F });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * scale, 0.14 * scale, 1.2 * scale, 8), mat);
  body.position.y = 0.6 * scale; g.add(body);
  // 팔
  const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06 * scale, 0.06 * scale, 0.5 * scale, 6), mat);
  arm1.position.set(0.2 * scale, 0.8 * scale, 0); arm1.rotation.z = -0.8; g.add(arm1);
  const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06 * scale, 0.06 * scale, 0.4 * scale, 6), mat);
  arm2.position.set(-0.18 * scale, 0.6 * scale, 0); arm2.rotation.z = 0.9; g.add(arm2);
  g.position.set(x, 0, z);
  return g;
}

function createSnowTree(x, z, scale = 1) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08 * scale, 0.12 * scale, 0.7 * scale, 6),
    new THREE.MeshStandardMaterial({ color: 0x5D4037 })
  );
  trunk.position.y = 0.35 * scale; g.add(trunk);
  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(0.45 * scale, 1.1 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0xE0E0E0 })
  );
  leaves.position.y = 1.1 * scale; g.add(leaves);
  const leaves2 = new THREE.Mesh(
    new THREE.ConeGeometry(0.32 * scale, 0.7 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0xF5F5F5 })
  );
  leaves2.position.y = 1.6 * scale; g.add(leaves2);
  g.position.set(x, 0, z);
  return g;
}

function createSnowman(x, z) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0xFAFAFA });
  const bottom = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), mat);
  bottom.position.y = 0.3; g.add(bottom);
  const mid = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), mat);
  mid.position.y = 0.7; g.add(mid);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), mat);
  head.position.y = 1.0; g.add(head);
  // 코
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.15, 6), new THREE.MeshStandardMaterial({ color: 0xFF6D00 }));
  nose.position.set(0, 1.0, 0.15); nose.rotation.x = -Math.PI / 2; g.add(nose);
  g.position.set(x, 0, z);
  return g;
}

function createRock(x, z, scale = 1, color = 0x616161) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.9 });
  const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3 * scale, 0), mat);
  rock.position.y = 0.2 * scale; rock.rotation.set(Math.random(), Math.random(), 0); g.add(rock);
  if (Math.random() > 0.5) {
    const r2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18 * scale, 0), mat);
    r2.position.set(0.25 * scale, 0.12 * scale, 0.1); r2.rotation.set(Math.random(), Math.random(), 0); g.add(r2);
  }
  g.position.set(x, 0, z);
  return g;
}

function createLavaRock(x, z, scale = 1) {
  const g = createRock(x, z, scale, 0x4E342E);
  // 용암 빛
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.15 * scale, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xFF6E40, transparent: true, opacity: 0.6 })
  );
  glow.position.set(x > 0 ? -0.1 : 0.1, 0.05, 0);
  g.add(glow);
  return g;
}

function createCrystal(x, z, scale = 1) {
  const g = new THREE.Group();
  const colors = [0x7C4DFF, 0xE040FB, 0x00E5FF, 0x76FF03];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.8 });
  const crystal = new THREE.Mesh(new THREE.ConeGeometry(0.12 * scale, 0.8 * scale, 5), mat);
  crystal.position.y = 0.4 * scale; g.add(crystal);
  if (Math.random() > 0.4) {
    const c2 = new THREE.Mesh(new THREE.ConeGeometry(0.08 * scale, 0.5 * scale, 5), mat);
    c2.position.set(0.15 * scale, 0.25 * scale, 0.05); c2.rotation.z = 0.3; g.add(c2);
  }
  g.position.set(x, 0, z);
  return g;
}

function createNeonBuilding(x, z, scale = 1) {
  const g = new THREE.Group();
  const h = (0.8 + Math.random() * 1.5) * scale;
  const w = (0.3 + Math.random() * 0.4) * scale;
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, w),
    new THREE.MeshStandardMaterial({ color: 0x1A1A2E, roughness: 0.3 })
  );
  body.position.y = h / 2; g.add(body);
  // 네온 라인
  const neonColors = [0xFF00FF, 0x00FFFF, 0xFF0066, 0x66FF00];
  const nc = neonColors[Math.floor(Math.random() * neonColors.length)];
  const stripe = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.02, 0.04, w + 0.02),
    new THREE.MeshBasicMaterial({ color: nc })
  );
  stripe.position.y = h * 0.7; g.add(stripe);
  const stripe2 = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.02, 0.04, w + 0.02),
    new THREE.MeshBasicMaterial({ color: nc })
  );
  stripe2.position.y = h * 0.4; g.add(stripe2);
  g.position.set(x, 0, z);
  return g;
}

function createStar(x, z) {
  const mat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
  const star = new THREE.Mesh(new THREE.SphereGeometry(0.04 + Math.random() * 0.04, 6, 6), mat);
  star.position.set(x, 3 + Math.random() * 5, z);
  return star;
}

function generateScenery(level, totalLength) {
  clearScenery();
  const theme = getTheme(level);
  const hw = state.trackWidth / 2;
  const spacing = 5 + Math.random() * 3;

  // 바닥 평면 (트랙 바깥)
  const groundMat = new THREE.MeshStandardMaterial({ color: theme.ground, roughness: 0.9 });
  const groundL = new THREE.Mesh(new THREE.BoxGeometry(20, 0.15, totalLength + 40), groundMat);
  groundL.position.set(-hw - 10, -0.15, -(totalLength / 2)); groundL.receiveShadow = true; sceneryGroup.add(groundL);
  const groundR = new THREE.Mesh(new THREE.BoxGeometry(20, 0.15, totalLength + 40), groundMat);
  groundR.position.set(hw + 10, -0.15, -(totalLength / 2)); groundR.receiveShadow = true; sceneryGroup.add(groundR);

  const count = Math.floor(totalLength / spacing);

  for (let i = 0; i < count; i++) {
    const z = -i * spacing - Math.random() * 3;
    const sideL = -hw - 1.5 - Math.random() * 4;
    const sideR = hw + 1.5 + Math.random() * 4;
    const scale = 0.7 + Math.random() * 0.8;

    switch (theme.name) {
      case 'grassland':
        if (Math.random() > 0.3) sceneryGroup.add(createTree(sideL, z, scale));
        if (Math.random() > 0.3) sceneryGroup.add(createTree(sideR, z, scale));
        // 풀밭 돌
        if (Math.random() > 0.7) sceneryGroup.add(createRock(sideL + 1, z - 1, 0.4, 0x9E9E9E));
        break;
      case 'desert':
        if (Math.random() > 0.4) sceneryGroup.add(createCactus(sideL, z, scale));
        if (Math.random() > 0.4) sceneryGroup.add(createCactus(sideR, z, scale));
        if (Math.random() > 0.6) sceneryGroup.add(createRock(sideR + 1, z - 1, scale * 0.5, 0xBCAAA4));
        break;
      case 'winter':
        if (Math.random() > 0.25) sceneryGroup.add(createSnowTree(sideL, z, scale));
        if (Math.random() > 0.25) sceneryGroup.add(createSnowTree(sideR, z, scale));
        if (Math.random() > 0.8) sceneryGroup.add(createSnowman(sideL + 1.5, z - 2));
        break;
      case 'volcanic':
        if (Math.random() > 0.3) sceneryGroup.add(createLavaRock(sideL, z, scale));
        if (Math.random() > 0.3) sceneryGroup.add(createLavaRock(sideR, z, scale));
        break;
      case 'space':
        if (Math.random() > 0.3) sceneryGroup.add(createCrystal(sideL, z, scale));
        if (Math.random() > 0.3) sceneryGroup.add(createCrystal(sideR, z, scale));
        // 별 (공중)
        for (let s = 0; s < 3; s++) {
          sceneryGroup.add(createStar(
            (Math.random() - 0.5) * 30,
            z + (Math.random() - 0.5) * spacing
          ));
        }
        break;
      case 'neon':
        if (Math.random() > 0.3) sceneryGroup.add(createNeonBuilding(sideL - 1, z, scale));
        if (Math.random() > 0.3) sceneryGroup.add(createNeonBuilding(sideR + 1, z, scale));
        break;
    }
  }
}

// ─────────────────────────────────────────────────
// STICKMAN FACTORY + ANIMATION
// ─────────────────────────────────────────────────
function createStickman(color = 0x2196F3) {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.5 });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), mat);
  head.position.y = 1.05; head.castShadow = true; group.add(head);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.5, 8), mat);
  body.position.y = 0.65; body.castShadow = true; group.add(body);
  const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 6);
  const leftLeg = new THREE.Mesh(legGeo, mat); leftLeg.position.set(-0.08, 0.2, 0); leftLeg.castShadow = true; group.add(leftLeg);
  const rightLeg = new THREE.Mesh(legGeo, mat); rightLeg.position.set(0.08, 0.2, 0); rightLeg.castShadow = true; group.add(rightLeg);
  const armGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.35, 6);
  const leftArm = new THREE.Mesh(armGeo, mat); leftArm.position.set(-0.18, 0.72, 0); leftArm.rotation.z = 0.3; leftArm.castShadow = true; group.add(leftArm);
  const rightArm = new THREE.Mesh(armGeo, mat); rightArm.position.set(0.18, 0.72, 0); rightArm.rotation.z = -0.3; rightArm.castShadow = true; group.add(rightArm);
  group.userData = { leftLeg, rightLeg, leftArm, rightArm, animPhase: Math.random() * Math.PI * 2 };
  return group;
}

function animateStickman(stickman, time, speed) {
  const d = stickman.userData;
  const t = time * 8 + d.animPhase;
  const intensity = Math.min(speed / 0.08, 1);
  // 부드러운 사인파 기반 다리/팔 스윙
  const legSwing = Math.sin(t) * 0.6 * intensity;
  const armSwing = Math.sin(t + 0.5) * 0.5 * intensity;
  // lerp로 부드럽게 보간
  d.leftLeg.rotation.x += (legSwing - d.leftLeg.rotation.x) * 0.3;
  d.rightLeg.rotation.x += (-legSwing - d.rightLeg.rotation.x) * 0.3;
  d.leftArm.rotation.x += (-armSwing - d.leftArm.rotation.x) * 0.3;
  d.rightArm.rotation.x += (armSwing - d.rightArm.rotation.x) * 0.3;
  // 바운스
  const bounce = Math.abs(Math.sin(t)) * 0.05 * intensity;
  if (d._baseY === undefined) d._baseY = stickman.position.y;
  stickman.position.y += (d._baseY + bounce - stickman.position.y) * 0.4;
  // 몸체 기울기 (부드럽게)
  stickman.rotation.x += (-0.1 * intensity - stickman.rotation.x) * 0.15;
  // 좌우 흔들림
  stickman.rotation.z += (Math.sin(t * 0.7) * 0.04 * intensity - stickman.rotation.z) * 0.15;
}

// ─────────────────────────────────────────────────
// CROWD SYSTEM
// ─────────────────────────────────────────────────
const crowdGroup = new THREE.Group();
scene.add(crowdGroup);

// 3D 카운트 라벨 (크라우드 바로 위에 고정)
let countLabel = null;
let countLabelCanvas = null;
function updateCountLabel() {
  // 기존 라벨 제거
  if (countLabel) crowdGroup.remove(countLabel);

  const canvas = countLabelCanvas || document.createElement('canvas');
  countLabelCanvas = canvas;
  canvas.width = 128; canvas.height = 80;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 128, 80);
  // 말풍선 배경
  ctx.fillStyle = '#2196F3';
  ctx.beginPath();
  ctx.roundRect(8, 4, 112, 52, 14);
  ctx.fill();
  // 꼬리 (아래 삼각형)
  ctx.beginPath();
  ctx.moveTo(52, 56); ctx.lineTo(64, 72); ctx.lineTo(76, 56);
  ctx.fill();
  // 숫자
  ctx.fillStyle = '#fff'; ctx.font = 'bold 32px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(String(state.crowdCount), 64, 30);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  countLabel = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  countLabel.scale.set(1.0, 0.65, 1);
  countLabel.position.set(0, 2.0, 0); // crowdGroup 로컬 좌표 기준
  crowdGroup.add(countLabel);
}

// 인원 수에 따른 스케일 (많아지면 작아짐)
function getCrowdScale(count) {
  return Math.max(0.45, 1.0 - Math.max(0, count - 10) * 0.007);
}
// 인원 수에 따른 간격 — 80명일 때 게이트 한쪽(폭 ~1.8)에 딱 맞도록 설계
// 80명: cols=9, spacing≈0.2 → 폭=9*0.2=1.8 (게이트 한쪽과 일치)
// 80명 초과 시 트랙 절반 이상 차지 → 게이트 벽에 부딪힘
function getCrowdSpacing(count) {
  const scale = getCrowdScale(count);
  // 80명 기준: scale≈0.51, spacing=0.2
  return Math.max(0.18 * scale, 0.45 * scale - count * 0.0015);
}
// 크라우드 폭 계산 (트랙 벽 충돌용)
function getCrowdHalfWidth() {
  const count = state.crowdCount;
  const cols = Math.ceil(Math.sqrt(count));
  const spacing = getCrowdSpacing(count);
  return (cols * spacing) / 2;
}

// 데미지 등 감소 시: display도 즉시 싱크
function syncCrowdDisplay() {
  if (state.crowdDisplay > state.crowdCount) state.crowdDisplay = state.crowdCount;
}
function updateCrowd() {
  syncCrowdDisplay();
  if (state.crowdCount > state.bestCount) state.bestCount = state.crowdCount;
  // 화면 표시 인원 (crowdDisplay)를 사용 — 애니메이션 중간 값
  const displayCount = Math.round(state.crowdDisplay);
  const stickmen = crowdGroup.children.filter(c => !c.isSprite);
  while (stickmen.length > displayCount) {
    const last = stickmen.pop();
    crowdGroup.remove(last);
  }
  while (stickmen.length < displayCount) {
    const s = createStickman(0x2196F3);
    crowdGroup.add(s);
    stickmen.push(s);
  }
  const count = stickmen.length;
  if (count === 0) { updateCountLabel(); return; }

  // 사람이 많을수록 간격/크기 조절 (덜 붙고, 대신 작아짐)
  const crowdScale = getCrowdScale(count);
  const spacing = getCrowdSpacing(count);
  const cols = Math.ceil(Math.sqrt(count));
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const rowCount = Math.min(cols, count - row * cols);
    stickmen[i].position.set((col - (rowCount - 1) / 2) * spacing, 0, row * spacing);
    stickmen[i].scale.setScalar(crowdScale);
  }
  updateCountLabel();
}

// ─────────────────────────────────────────────────
// TRACK
// ─────────────────────────────────────────────────
const trackGroup = new THREE.Group();
scene.add(trackGroup);

function createTrackSegment(z, length, theme) {
  const t = theme || themes[0];
  const tMat = new THREE.MeshStandardMaterial({ color: t.trackColor, roughness: 0.8 });
  const eMat = new THREE.MeshStandardMaterial({ color: t.trackEdge, roughness: 0.6 });
  const track = new THREE.Mesh(new THREE.BoxGeometry(state.trackWidth, 0.2, length), tMat);
  track.position.set(0, -0.1, z - length / 2); track.receiveShadow = true; trackGroup.add(track);
  const stripeCount = Math.floor(length / 2);
  for (let i = 0; i < stripeCount; i++) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(state.trackWidth - 0.1, 0.01, 0.6), new THREE.MeshStandardMaterial({ color: t.stripe, roughness: 0.9 }));
    stripe.position.set(0, 0.01, z - i * 2 - 1); trackGroup.add(stripe);
  }
  const edgeGeo = new THREE.BoxGeometry(0.15, 0.3, length);
  const l = new THREE.Mesh(edgeGeo, eMat); l.position.set(-state.trackWidth / 2 - 0.075, 0, z - length / 2); trackGroup.add(l);
  const r = new THREE.Mesh(edgeGeo, eMat); r.position.set(state.trackWidth / 2 + 0.075, 0, z - length / 2); trackGroup.add(r);
}

// ─────────────────────────────────────────────────
// GATE FACTORY
// ─────────────────────────────────────────────────
function getGateColor(op, isGolden) {
  if (isGolden) return { hex: 0xFFD740, css: '#FFD740' };
  if (op === 'add') return { hex: 0x4CAF50, css: '#4CAF50' };
  if (op === 'mul') return { hex: 0x2196F3, css: '#2196F3' };
  return { hex: 0xFF5252, css: '#FF5252' };
}
function getGateText(op, val) {
  if (op === 'add') return `+${val}`;
  if (op === 'sub') return `-${val}`;
  return `x${val}`;
}
function createGatePanel(text, colorCss, width, height, isGolden) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  if (isGolden) {
    grad.addColorStop(0, '#FFD740'); grad.addColorStop(1, '#FFA000');
  } else {
    grad.addColorStop(0, colorCss); grad.addColorStop(1, colorCss + 'CC');
  }
  ctx.fillStyle = grad; ctx.roundRect(8, 8, 496, 496, 32); ctx.fill();
  // 골든: 반짝이는 테두리
  if (isGolden) {
    ctx.strokeStyle = '#FFF176'; ctx.lineWidth = 8;
    ctx.roundRect(8, 8, 496, 496, 32); ctx.stroke();
  }
  ctx.fillStyle = isGolden ? '#4E342E' : '#ffffff';
  ctx.font = 'bold 160px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 230);
  // 광고 아이콘 표시
  if (isGolden) {
    ctx.font = '80px Arial'; ctx.fillStyle = '#4E342E';
    ctx.fillText('🎬 AD', 256, 400);
  }
  return new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true, opacity: 0.92 }));
}

function createGate(z, leftOp, leftVal, rightOp, rightVal, goldenSide) {
  // goldenSide: null, 'left', 'right' — 골든 게이트 쪽
  const gateGroup = new THREE.Group();
  gateGroup.position.z = z;
  const hw = state.trackWidth / 2;
  const gateDepth = 1.5, gateHeight = 2.2;

  const divider = new THREE.Mesh(new THREE.BoxGeometry(0.12, gateHeight, gateDepth), new THREE.MeshStandardMaterial({ color: 0x555555 }));
  divider.position.y = gateHeight / 2; gateGroup.add(divider);

  const leftGolden = goldenSide === 'left';
  const rightGolden = goldenSide === 'right';

  const leftCol = getGateColor(leftOp, leftGolden);
  const leftMesh = new THREE.Mesh(new THREE.BoxGeometry(hw - 0.1, gateHeight, gateDepth), new THREE.MeshStandardMaterial({ color: leftCol.hex, transparent: true, opacity: leftGolden ? 0.5 : 0.35, roughness: 0.4, metalness: leftGolden ? 0.4 : 0 }));
  leftMesh.position.set(-hw / 2, gateHeight / 2, 0); gateGroup.add(leftMesh);
  const ll = createGatePanel(getGateText(leftOp, leftVal), leftCol.css, hw - 0.2, gateHeight - 0.2, leftGolden);
  ll.position.set(-hw / 2, gateHeight / 2, gateDepth / 2 + 0.01); gateGroup.add(ll);

  const rightCol = getGateColor(rightOp, rightGolden);
  const rightMesh = new THREE.Mesh(new THREE.BoxGeometry(hw - 0.1, gateHeight, gateDepth), new THREE.MeshStandardMaterial({ color: rightCol.hex, transparent: true, opacity: rightGolden ? 0.5 : 0.35, roughness: 0.4, metalness: rightGolden ? 0.4 : 0 }));
  rightMesh.position.set(hw / 2, gateHeight / 2, 0); gateGroup.add(rightMesh);
  const rl = createGatePanel(getGateText(rightOp, rightVal), rightCol.css, hw - 0.2, gateHeight - 0.2, rightGolden);
  rl.position.set(hw / 2, gateHeight / 2, gateDepth / 2 + 0.01); gateGroup.add(rl);

  const pillarGeo = new THREE.BoxGeometry(0.15, gateHeight + 0.3, gateDepth);
  const pm = new THREE.MeshStandardMaterial({ color: 0x444466 });
  const lPillar = new THREE.Mesh(pillarGeo, pm); lPillar.position.set(-hw - 0.075, gateHeight / 2, 0); gateGroup.add(lPillar);
  const rPillar = new THREE.Mesh(pillarGeo, pm); rPillar.position.set(hw + 0.075, gateHeight / 2, 0); gateGroup.add(rPillar);

  trackGroup.add(gateGroup);
  return { z, passed: false, trimmed: false, chosenSide: null, left: { op: leftOp, val: leftVal, golden: leftGolden }, right: { op: rightOp, val: rightVal, golden: rightGolden }, group: gateGroup };
}

// ─────────────────────────────────────────────────
// OBSTACLE (ENEMY - 원작처럼 트랙에 개별 배치)
// ─────────────────────────────────────────────────
function createObstacle(z, count) {
  const group = new THREE.Group();
  const enemies = [];
  // 원작처럼 트랙 곳곳에 퍼져 배치 - 부딪힌 적만큼만 감소
  for (let i = 0; i < count; i++) {
    const enemy = createStickman(0xFF5252);
    const x = (Math.random() - 0.5) * (state.trackWidth - 0.6);
    const zOff = (Math.random() - 0.5) * 1.5;
    enemy.position.set(x, 0, zOff);
    group.add(enemy);
    enemies.push({ mesh: enemy, localX: x, hit: false });
  }
  group.position.set(0, 0, z);
  trackGroup.add(group);

  // Label (총 적 수)
  const canvas = document.createElement('canvas');
  canvas.width = 128; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FF5252'; ctx.roundRect(8, 4, 112, 56, 12); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = 'bold 36px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(String(count), 64, 34);
  const label = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true }));
  label.position.set(0, 1.8, z); label.rotation.x = -0.2; trackGroup.add(label);

  return { z, count, group, label, enemies, passed: false };
}

// ─────────────────────────────────────────────────
// GRINDER (회전 톱날 - 원작의 그라인더)
// ─────────────────────────────────────────────────
function createGrinder(z, side) {
  // 바닥에 평평하게 눕힌 톱니바퀴, y축 회전으로 트루퍼를 갉아먹음
  const group = new THREE.Group();
  const hw = state.trackWidth / 2;
  const radius = 1.3;
  const thickness = 0.2;

  // 톱니바퀴 그룹 (y축 회전)
  const bladeGroup = new THREE.Group();

  // 메인 디스크 (바닥에 평평 — CylinderGeometry 기본이 y축 세로이므로 그대로 두면 평평)
  const disc = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, thickness, 24),
    grinderBladeMat
  );
  bladeGroup.add(disc);

  // 톱니 (10개, xz 평면에서 바깥으로 돌출)
  for (let i = 0; i < 10; i++) {
    const tooth = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, thickness + 0.04, 0.25),
      grinderBladeMat
    );
    const angle = (i / 10) * Math.PI * 2;
    tooth.position.set(
      Math.cos(angle) * (radius + 0.12),
      0,
      Math.sin(angle) * (radius + 0.12)
    );
    tooth.rotation.y = -angle;
    bladeGroup.add(tooth);
  }

  // 중심 허브 (빨간색, 약간 솟아오름)
  const hubMat = new THREE.MeshBasicMaterial({ color: 0xFF3333 });
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, thickness + 0.15, 12), hubMat);
  hub.position.y = 0.05;
  bladeGroup.add(hub);

  // 트랙 가장자리에 걸치도록 배치 (절반이 트랙 위에 올라옴)
  let gx;
  if (side === 'left') gx = -hw + radius * 0.35;
  else if (side === 'right') gx = hw - radius * 0.35;
  else gx = (Math.random() > 0.5 ? -1 : 1) * (hw - radius * 0.35);

  // 바닥 높이에 배치 (살짝 위로)
  bladeGroup.position.set(gx, thickness / 2 + 0.05, 0);
  group.add(bladeGroup);

  // 중심축 기둥 (짧고 굵게)
  const support = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.18, 0.4, 8),
    grinderMat
  );
  support.position.set(gx, 0.2, 0);
  group.add(support);

  group.position.set(0, 0, z);
  trackGroup.add(group);

  return { z, x: gx, side, group, bladeGroup, lastDamageTick: 0, sweepPhase: Math.random() * Math.PI * 2, radius };
}

// ─────────────────────────────────────────────────
// SWING HAMMER (스윙 해머)
// ─────────────────────────────────────────────────
function createHammer(z) {
  const group = new THREE.Group();
  const hammerMat = new THREE.MeshStandardMaterial({ color: 0x795548, roughness: 0.4 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x9E9E9E, roughness: 0.3, metalness: 0.7 });

  // 지주 (양쪽 기둥)
  const pillarGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.5, 8);
  const lPillar = new THREE.Mesh(pillarGeo, metalMat);
  lPillar.position.set(-state.trackWidth / 2 - 0.2, 1.75, 0); group.add(lPillar);
  const rPillar = new THREE.Mesh(pillarGeo, metalMat);
  rPillar.position.set(state.trackWidth / 2 + 0.2, 1.75, 0); group.add(rPillar);

  // 상단 빔
  const beam = new THREE.Mesh(new THREE.BoxGeometry(state.trackWidth + 0.6, 0.15, 0.15), metalMat);
  beam.position.y = 3.5; group.add(beam);

  // 해머 암 (스윙하는 부분)
  const armGroup = new THREE.Group();
  armGroup.position.set(0, 3.5, 0); // 피벗 포인트 = 상단

  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.5, 8), metalMat);
  arm.position.y = -1.25; armGroup.add(arm);

  // 해머 헤드
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.6), hammerMat);
  head.position.y = -2.5; armGroup.add(head);
  // 해머 양쪽 금속
  const side1 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.15, 0.65), metalMat);
  side1.position.y = -2.2; armGroup.add(side1);
  const side2 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.15, 0.65), metalMat);
  side2.position.y = -2.8; armGroup.add(side2);

  group.add(armGroup);
  group.position.set(0, 0, z);
  trackGroup.add(group);

  return { z, group, armGroup, lastDamageTick: 0, phase: Math.random() * Math.PI * 2 };
}

// ─────────────────────────────────────────────────
// ARROW TRAP (화살 함정)
// ─────────────────────────────────────────────────
function createArrowTrap(z, fromSide) {
  // fromSide: 'left' or 'right'
  const group = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x8D6E63 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x5D4037 });

  // 발사대 (트랙 옆)
  const sideX = fromSide === 'left' ? -state.trackWidth / 2 - 0.5 : state.trackWidth / 2 + 0.5;
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.6), woodMat);
  base.position.set(sideX, 0.4, 0); group.add(base);
  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.8), darkMat);
  slot.position.set(sideX, 0.6, 0); group.add(slot);

  // 화살 (날아다니는 것들은 동적으로 생성)
  const arrowProto = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6), woodMat);
  shaft.rotation.z = Math.PI / 2; arrowProto.add(shaft);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.15, 6), new THREE.MeshStandardMaterial({ color: 0xCCCCCC, metalness: 0.8 }));
  tip.rotation.z = fromSide === 'left' ? -Math.PI / 2 : Math.PI / 2;
  tip.position.x = fromSide === 'left' ? 0.35 : -0.35;
  arrowProto.add(tip);

  group.position.set(0, 0, z);
  trackGroup.add(group);

  return {
    z, group, fromSide, sideX,
    arrows: [], // 활성 화살들 { mesh, x, active }
    fireTimer: 0,
    fireInterval: 1.2, // 1.2초마다 발사
    arrowProto,
  };
}

// ─────────────────────────────────────────────────
// PIT (함정 구덩이)
// ─────────────────────────────────────────────────
function createPit(z, pitSide) {
  // 원작 스타일: 트랙 자체가 잘려나간 빈 공간 (아래가 보이는 절벽)
  const group = new THREE.Group();
  const hw = state.trackWidth / 2;
  const pitLen = 4.0;

  let pitX, pitW;
  if (pitSide === 'left') { pitX = -hw / 2; pitW = hw + 0.1; }
  else if (pitSide === 'right') { pitX = hw / 2; pitW = hw + 0.1; }
  else { pitX = 0; pitW = hw * 1.3; }

  // ── 트랙 바닥을 가리는 빈 공간 (하늘색/어두운 색 = 아래가 보이는 느낌) ──
  const voidMat = new THREE.MeshBasicMaterial({ color: 0x1a2a3a }); // 어두운 하늘색
  const voidBox = new THREE.Mesh(new THREE.BoxGeometry(pitW, 0.2, pitLen), voidMat);
  voidBox.position.set(pitX, 0.07, 0);
  voidBox.renderOrder = 1;
  group.add(voidBox);

  // ── 절벽 단면 (트랙 절단면 — 밝은 회색) ──
  const cliffMat = new THREE.MeshStandardMaterial({ color: 0x9E9E9E, roughness: 0.8 });
  const cliffH = 1.2; // 절벽 깊이

  // 앞쪽 절벽면
  const cliffFront = new THREE.Mesh(new THREE.BoxGeometry(pitW, cliffH, 0.08), cliffMat);
  cliffFront.position.set(pitX, -cliffH / 2 + 0.05, pitLen / 2); group.add(cliffFront);
  // 뒤쪽 절벽면
  const cliffBack = new THREE.Mesh(new THREE.BoxGeometry(pitW, cliffH, 0.08), cliffMat);
  cliffBack.position.set(pitX, -cliffH / 2 + 0.05, -pitLen / 2); group.add(cliffBack);
  // 옆 절벽면
  const cliffL = new THREE.Mesh(new THREE.BoxGeometry(0.08, cliffH, pitLen), cliffMat);
  cliffL.position.set(pitX - pitW / 2, -cliffH / 2 + 0.05, 0); group.add(cliffL);
  const cliffR = new THREE.Mesh(new THREE.BoxGeometry(0.08, cliffH, pitLen), cliffMat);
  cliffR.position.set(pitX + pitW / 2, -cliffH / 2 + 0.05, 0); group.add(cliffR);

  // ── 깊은 바닥 (매우 아래, 어둡게) ──
  const deepMat = new THREE.MeshBasicMaterial({ color: 0x0a0f14 });
  const deepFloor = new THREE.Mesh(new THREE.BoxGeometry(pitW - 0.1, 0.05, pitLen - 0.1), deepMat);
  deepFloor.position.set(pitX, -cliffH, 0); group.add(deepFloor);

  // ── 트랙 가장자리 (남은 안전 영역 강조 — 밝은 테두리) ──
  const edgeMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.3 });
  const edgeT = 0.06;
  const eFront = new THREE.Mesh(new THREE.BoxGeometry(pitW + 0.2, edgeT, edgeT), edgeMat);
  eFront.position.set(pitX, 0.15, pitLen / 2 + edgeT); group.add(eFront);
  const eBack = new THREE.Mesh(new THREE.BoxGeometry(pitW + 0.2, edgeT, edgeT), edgeMat);
  eBack.position.set(pitX, 0.15, -pitLen / 2 - edgeT); group.add(eBack);

  group.position.set(0, 0, z);
  trackGroup.add(group);

  return { z, pitX, pitW, pitSide, group, lastDamageTick: 0 };
}

// ─────────────────────────────────────────────────
// BOMB (폭탄)
// ─────────────────────────────────────────────────
function createBomb(z, x) {
  const group = new THREE.Group();

  // 폭탄 몸체
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.4, metalness: 0.3 })
  );
  body.position.y = 0.3; body.castShadow = true; group.add(body);

  // 심지
  const fuse = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.2, 6),
    new THREE.MeshStandardMaterial({ color: 0x8D6E63 })
  );
  fuse.position.set(0, 0.6, 0); fuse.rotation.z = 0.3; group.add(fuse);

  // 불꽃 (빛)
  const spark = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xFF6E40 })
  );
  spark.position.set(0.05, 0.72, 0); group.add(spark);

  // 위험 범위 표시 (반투명 원)
  const range = new THREE.Mesh(
    new THREE.CircleGeometry(1.2, 24),
    new THREE.MeshBasicMaterial({ color: 0xFF0000, transparent: true, opacity: 0.1 })
  );
  range.rotation.x = -Math.PI / 2; range.position.y = 0.02; group.add(range);

  group.position.set(x, 0, z);
  trackGroup.add(group);

  return { z, x, group, spark, exploded: false, blastRadius: 3.0 };
}

// ─────────────────────────────────────────────────
// LASER WALL (레이저 벽)
// ─────────────────────────────────────────────────
function createLaser(z) {
  // 레이저 터렛: 트랙 한쪽 절반만 커버 (폭탄처럼 범위 표시, 반대쪽으로 피할 수 있음)
  const laserSide = Math.random() > 0.5 ? 'left' : 'right';
  const group = new THREE.Group();
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x616161, roughness: 0.3, metalness: 0.8 });
  const hw = state.trackWidth / 2;

  // 터렛 기둥 (트랙 옆)
  const pillarX = laserSide === 'left' ? -hw - 0.3 : hw + 0.3;
  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 2.5, 8), metalMat);
  pillar.position.set(pillarX, 1.25, 0); group.add(pillar);

  // 터렛 헤드
  const headMat = new THREE.MeshStandardMaterial({ color: 0x424242, roughness: 0.2, metalness: 0.9 });
  const turretHead = new THREE.Group();
  const headBody = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.4), headMat);
  turretHead.add(headBody);
  const lensMat = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
  const lens = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), lensMat);
  lens.position.set(laserSide === 'left' ? 0.2 : -0.2, 0, 0);
  turretHead.add(lens);
  turretHead.position.set(pillarX, 2.6, 0);
  group.add(turretHead);

  // ── 위험 구역 (바닥): 트랙 중앙까지만 커버 ──
  const dangerW = hw; // 트랙 절반 폭
  const dangerLen = 3.5;
  const dangerX = laserSide === 'left' ? -hw / 2 : hw / 2; // 한쪽 절반 중심

  // 바닥 위험 영역 (빨간 반투명)
  const dangerZone = new THREE.Mesh(
    new THREE.BoxGeometry(dangerW, 0.03, dangerLen),
    new THREE.MeshBasicMaterial({ color: 0xFF0000, transparent: true, opacity: 0.15 })
  );
  dangerZone.position.set(dangerX, 0.06, 0); group.add(dangerZone);

  // 위험 영역 테두리 (빨간 선)
  const borderMat = new THREE.MeshBasicMaterial({ color: 0xFF0000, transparent: true, opacity: 0.5 });
  const bThick = 0.06;
  const bF = new THREE.Mesh(new THREE.BoxGeometry(dangerW, 0.04, bThick), borderMat);
  bF.position.set(dangerX, 0.07, dangerLen / 2); group.add(bF);
  const bB = new THREE.Mesh(new THREE.BoxGeometry(dangerW, 0.04, bThick), borderMat);
  bB.position.set(dangerX, 0.07, -dangerLen / 2); group.add(bB);
  const bL = new THREE.Mesh(new THREE.BoxGeometry(bThick, 0.04, dangerLen), borderMat);
  bL.position.set(dangerX - dangerW / 2, 0.07, 0); group.add(bL);
  const bR = new THREE.Mesh(new THREE.BoxGeometry(bThick, 0.04, dangerLen), borderMat);
  bR.position.set(dangerX + dangerW / 2, 0.07, 0); group.add(bR);

  // 레이저 빔 (고정: 터렛→위험구역 중심, 기본 숨김)
  const beamMat = new THREE.MeshBasicMaterial({ color: 0xFF0000, transparent: true, opacity: 0 });
  const beamDx = dangerX - pillarX;
  const beamLen = Math.abs(beamDx) + 0.2;
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, beamLen, 6), beamMat);
  beam.rotation.z = Math.PI / 2;
  beam.position.set((pillarX + dangerX) / 2, 0.6, 0);
  beam.visible = false;
  group.add(beam);

  // 넓은 빔 글로우
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xFF4444, transparent: true, opacity: 0 });
  const beamGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, beamLen, 6), glowMat);
  beamGlow.rotation.z = Math.PI / 2;
  beamGlow.position.copy(beam.position);
  beamGlow.visible = false;
  group.add(beamGlow);

  // ⚠ LASER 라벨
  const warnCanvas = document.createElement('canvas');
  warnCanvas.width = 128; warnCanvas.height = 64;
  const wctx = warnCanvas.getContext('2d');
  wctx.fillStyle = '#FF0000'; wctx.font = 'bold 40px Arial'; wctx.textAlign = 'center'; wctx.textBaseline = 'middle';
  wctx.fillText('⚠ LASER', 64, 34);
  const warnLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(1.0, 0.4),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(warnCanvas), transparent: true })
  );
  warnLabel.position.set(pillarX, 3.2, 0); warnLabel.rotation.x = -0.15; group.add(warnLabel);

  group.position.set(0, 0, z);
  trackGroup.add(group);

  return {
    z, group, turretHead, beam, beamGlow, lens, laserSide, pillarX,
    dangerX, dangerW, dangerLen, dangerZone, borderMeshes: [bF, bB, bL, bR],
    firing: false, lastDamageTick: 0
  };
}

// ─────────────────────────────────────────────────
// JUMP RAMP + HAZARD ZONE (점프대 + 위험지대)
// ─────────────────────────────────────────────────
function getHazardStyle(themeName) {
  switch (themeName) {
    case 'grassland': return { color: 0x4CAF50, emissive: 0x2E7D32, name: '🌿 THORNS', labelBg: '#2E7D32', particleColor: 0x66BB6A, surfaceDetail: 'thorns' };
    case 'desert':    return { color: 0xD4A017, emissive: 0xBF8C00, name: '🏜 QUICKSAND', labelBg: '#BF8C00', particleColor: 0xE8C87A, surfaceDetail: 'sand' };
    case 'winter':    return { color: 0x81D4FA, emissive: 0x4FC3F7, name: '🧊 ICE SPIKES', labelBg: '#0288D1', particleColor: 0xB3E5FC, surfaceDetail: 'ice' };
    case 'volcanic':  return { color: 0xFF5722, emissive: 0xE64A19, name: '🔥 LAVA', labelBg: '#BF360C', particleColor: 0xFF6E40, surfaceDetail: 'lava' };
    case 'space':     return { color: 0x7C4DFF, emissive: 0x651FFF, name: '⚡ VOID', labelBg: '#4527A0', particleColor: 0xB388FF, surfaceDetail: 'void' };
    case 'neon':      return { color: 0xE040FB, emissive: 0xAA00FF, name: '⚡ ELECTRIC', labelBg: '#7B1FA2', particleColor: 0xEA80FC, surfaceDetail: 'electric' };
    default:          return { color: 0xFF5722, emissive: 0xE64A19, name: '🔥 LAVA', labelBg: '#BF360C', particleColor: 0xFF6E40, surfaceDetail: 'lava' };
  }
}

function createJumpRamp(z, level) {
  const rampSide = Math.random() > 0.5 ? 'left' : 'right';
  const group = new THREE.Group();
  const hw = state.trackWidth / 2;
  const theme = getTheme(level);
  const hazard = getHazardStyle(theme.name);

  const rampW = hw * 0.85; // 트랙 절반보다 살짝 좁게
  const rampLen = 2.0;
  const hazardLen = 5.0;
  const rampX = rampSide === 'left' ? -hw / 2 : hw / 2;

  // ── 점프대 (경사로) — 플레이어가 먼저 밟는 쪽 (z 양수 = 뒤쪽) ──
  const rampMat = new THREE.MeshStandardMaterial({ color: 0xFFC107, roughness: 0.4, metalness: 0.3 });
  const rampBody = new THREE.Mesh(new THREE.BoxGeometry(rampW, 0.12, rampLen), rampMat);
  rampBody.position.set(rampX, 0.25, hazardLen / 2 + rampLen / 2);
  rampBody.rotation.x = -0.15; // 앞으로 올라가는 경사
  group.add(rampBody);

  // 점프대 측면 가드 (노란색)
  const guardMat = new THREE.MeshStandardMaterial({ color: 0xFFA000, roughness: 0.5 });
  const guardL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, rampLen), guardMat);
  guardL.position.set(rampX - rampW / 2, 0.25, hazardLen / 2 + rampLen / 2);
  group.add(guardL);
  const guardR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, rampLen), guardMat);
  guardR.position.set(rampX + rampW / 2, 0.25, hazardLen / 2 + rampLen / 2);
  group.add(guardR);

  // 점프대 위 화살표 (▲ 방향 표시)
  const arrowCanvas = document.createElement('canvas');
  arrowCanvas.width = 128; arrowCanvas.height = 128;
  const actx = arrowCanvas.getContext('2d');
  actx.fillStyle = '#FFFFFF';
  actx.font = 'bold 80px Arial'; actx.textAlign = 'center'; actx.textBaseline = 'middle';
  actx.fillText('⬆', 64, 54);
  actx.font = 'bold 24px Arial';
  actx.fillText('JUMP', 64, 105);
  const arrowTex = new THREE.CanvasTexture(arrowCanvas);
  const arrowLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.8, 0.8),
    new THREE.MeshBasicMaterial({ map: arrowTex, transparent: true })
  );
  arrowLabel.rotation.x = -Math.PI / 2 - 0.15;
  arrowLabel.position.set(rampX, 0.36, hazardLen / 2 + rampLen / 2);
  group.add(arrowLabel);

  // ── 위험지대 (점프대 바로 앞 = z 중심) ──
  const hazardMat = new THREE.MeshBasicMaterial({ color: hazard.color });
  const hazardBox = new THREE.Mesh(
    new THREE.BoxGeometry(state.trackWidth + 0.2, 0.14, hazardLen),
    hazardMat
  );
  hazardBox.position.set(0, 0.07, 0);
  hazardBox.renderOrder = 1;
  group.add(hazardBox);

  // 위험지대 표면 디테일
  if (hazard.surfaceDetail === 'lava' || hazard.surfaceDetail === 'electric') {
    // 발광 효과
    const glowMat = new THREE.MeshBasicMaterial({ color: hazard.emissive, transparent: true, opacity: 0.4 });
    const glow = new THREE.Mesh(new THREE.BoxGeometry(state.trackWidth, 0.02, hazardLen), glowMat);
    glow.position.set(0, 0.16, 0); group.add(glow);
  }
  if (hazard.surfaceDetail === 'thorns') {
    // 가시 돌기
    const thornMat = new THREE.MeshStandardMaterial({ color: 0x33691E, roughness: 0.8 });
    for (let i = 0; i < 20; i++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.25, 4), thornMat);
      spike.position.set(
        (Math.random() - 0.5) * (state.trackWidth - 0.3),
        0.22,
        (Math.random() - 0.5) * (hazardLen - 0.4)
      );
      group.add(spike);
    }
  }
  if (hazard.surfaceDetail === 'ice') {
    // 얼음 기둥
    const iceMat = new THREE.MeshStandardMaterial({ color: 0xB3E5FC, transparent: true, opacity: 0.7, roughness: 0.1, metalness: 0.3 });
    for (let i = 0; i < 12; i++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.4 + Math.random() * 0.3, 5), iceMat);
      spike.position.set(
        (Math.random() - 0.5) * (state.trackWidth - 0.3),
        0.3,
        (Math.random() - 0.5) * (hazardLen - 0.4)
      );
      group.add(spike);
    }
  }
  if (hazard.surfaceDetail === 'sand') {
    // 모래 소용돌이
    const sandMat = new THREE.MeshBasicMaterial({ color: 0xC8A960, transparent: true, opacity: 0.5 });
    for (let i = 0; i < 5; i++) {
      const swirl = new THREE.Mesh(new THREE.RingGeometry(0.15, 0.3 + Math.random() * 0.2, 12), sandMat);
      swirl.rotation.x = -Math.PI / 2;
      swirl.position.set(
        (Math.random() - 0.5) * (state.trackWidth - 0.5),
        0.16,
        (Math.random() - 0.5) * (hazardLen - 0.5)
      );
      group.add(swirl);
    }
  }
  if (hazard.surfaceDetail === 'void') {
    // 보이드 에너지 파동
    const voidMat = new THREE.MeshBasicMaterial({ color: 0xB388FF, transparent: true, opacity: 0.3 });
    for (let i = 0; i < 4; i++) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.5, 16), voidMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(
        (Math.random() - 0.5) * (state.trackWidth - 0.5),
        0.16,
        (Math.random() - 0.5) * (hazardLen - 0.5)
      );
      group.add(ring);
    }
  }

  // 위험지대 테두리
  const edgeMat = new THREE.MeshBasicMaterial({ color: hazard.emissive });
  const edgeH = 0.2;
  const edgeT = 0.08;
  const eFront = new THREE.Mesh(new THREE.BoxGeometry(state.trackWidth + 0.3, edgeH, edgeT), edgeMat);
  eFront.position.set(0, edgeH / 2, hazardLen / 2); group.add(eFront);
  const eBack = new THREE.Mesh(new THREE.BoxGeometry(state.trackWidth + 0.3, edgeH, edgeT), edgeMat);
  eBack.position.set(0, edgeH / 2, -hazardLen / 2); group.add(eBack);

  // ⚠ 경고 라벨 (위험지대 이름)
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 256; labelCanvas.height = 72;
  const lctx = labelCanvas.getContext('2d');
  lctx.fillStyle = hazard.labelBg;
  lctx.beginPath(); lctx.roundRect(4, 4, 248, 64, 10); lctx.fill();
  lctx.strokeStyle = '#FFD740'; lctx.lineWidth = 2;
  lctx.beginPath(); lctx.roundRect(4, 4, 248, 64, 10); lctx.stroke();
  lctx.fillStyle = '#FFFFFF'; lctx.font = 'bold 28px Arial'; lctx.textAlign = 'center'; lctx.textBaseline = 'middle';
  lctx.fillText(hazard.name, 128, 36);
  const hazardLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 0.45),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(labelCanvas), transparent: true })
  );
  hazardLabel.position.set(0, 2.2, hazardLen / 2 + rampLen + 1.0);
  hazardLabel.rotation.x = -0.15;
  group.add(hazardLabel);

  // ── JUMP 방향 안내 라벨 ──
  const dirCanvas = document.createElement('canvas');
  dirCanvas.width = 200; dirCanvas.height = 64;
  const dctx = dirCanvas.getContext('2d');
  dctx.fillStyle = '#FFC107'; dctx.font = 'bold 32px Arial'; dctx.textAlign = 'center'; dctx.textBaseline = 'middle';
  const arrow = rampSide === 'left' ? '← JUMP' : 'JUMP →';
  dctx.fillText(arrow, 100, 34);
  const dirLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 0.4),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(dirCanvas), transparent: true })
  );
  dirLabel.position.set(0, 1.6, hazardLen / 2 + rampLen + 1.0);
  dirLabel.rotation.x = -0.15;
  group.add(dirLabel);

  group.position.set(0, 0, z);
  trackGroup.add(group);

  return {
    z, rampSide, rampX, rampW, rampLen, hazardLen, group, hazardBox,
    hazardStyle: hazard, triggered: false, jumpActive: false, jumpTimer: 0,
    lastDamageTick: 0
  };
}

// ─────────────────────────────────────────────────
// COLLECTIBLE (COIN)
// ─────────────────────────────────────────────────
function createCollectible(z, x) {
  const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 16), coinMat);
  coin.rotation.x = Math.PI / 2; coin.position.set(x, 0.5, z); coin.castShadow = true;
  trackGroup.add(coin);
  return { z, x, mesh: coin, collected: false };
}

// ─────────────────────────────────────────────────
// FINISH LINE
// ─────────────────────────────────────────────────
function createFinishLine(z) {
  const group = new THREE.Group(); group.position.z = z;
  const banner = new THREE.Mesh(new THREE.BoxGeometry(state.trackWidth + 0.5, 0.8, 0.15), finishMat);
  banner.position.y = 2.8; group.add(banner);
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 128;
  const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.font = 'bold 72px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('FINISH', 256, 64);
  const tm = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.7), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true }));
  tm.position.set(0, 2.8, 0.09); group.add(tm);
  const pg = new THREE.CylinderGeometry(0.1, 0.1, 3.2, 8);
  const pm = new THREE.MeshStandardMaterial({ color: 0x4CAF50 });
  const lp = new THREE.Mesh(pg, pm); lp.position.set(-state.trackWidth / 2 - 0.15, 1.6, 0); group.add(lp);
  const rp = new THREE.Mesh(pg, pm); rp.position.set(state.trackWidth / 2 + 0.15, 1.6, 0); group.add(rp);
  for (let i = 0; i < 8; i++) {
    const sq = new THREE.Mesh(new THREE.BoxGeometry(state.trackWidth / 8, 0.02, 0.5), new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0x000000 : 0xffffff }));
    sq.position.set(-state.trackWidth / 2 + state.trackWidth / 16 + i * state.trackWidth / 8, 0.01, 0); group.add(sq);
  }
  trackGroup.add(group);
  return { z, group };
}

// ─────────────────────────────────────────────────
// BOSS (골인 전 대형 적)
// ─────────────────────────────────────────────────
function createBoss(z, requiredCount) {
  const group = new THREE.Group();

  // 대형 스틱맨 보스 (진한 빨강 + 뿔)
  const bossMat = new THREE.MeshStandardMaterial({ color: 0xCC0000, roughness: 0.4 });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), bossMat);
  head.position.y = 2.7; head.castShadow = true; group.add(head);
  const hornMat = new THREE.MeshStandardMaterial({ color: 0x440000, roughness: 0.3 });
  const hornGeo = new THREE.ConeGeometry(0.08, 0.35, 8);
  const lHorn = new THREE.Mesh(hornGeo, hornMat);
  lHorn.position.set(-0.18, 3.1, -0.05); lHorn.rotation.z = 0.3; group.add(lHorn);
  const rHorn = new THREE.Mesh(hornGeo, hornMat);
  rHorn.position.set(0.18, 3.1, -0.05); rHorn.rotation.z = -0.3; group.add(rHorn);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 1.2, 10), bossMat);
  body.position.y = 1.7; body.castShadow = true; group.add(body);
  const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.9, 8);
  const leftLeg = new THREE.Mesh(legGeo, bossMat); leftLeg.position.set(-0.18, 0.5, 0); group.add(leftLeg);
  const rightLeg = new THREE.Mesh(legGeo, bossMat); rightLeg.position.set(0.18, 0.5, 0); group.add(rightLeg);
  const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8);
  const leftArm = new THREE.Mesh(armGeo, bossMat); leftArm.position.set(-0.42, 1.8, 0); leftArm.rotation.z = 0.4; group.add(leftArm);
  const rightArm = new THREE.Mesh(armGeo, bossMat); rightArm.position.set(0.42, 1.8, 0); rightArm.rotation.z = -0.4; group.add(rightArm);
  group.userData = { leftLeg, rightLeg, leftArm, rightArm, animPhase: 0 };

  // 필요 인원 라벨 (빨간 배지)
  const canvas = document.createElement('canvas');
  canvas.width = 192; canvas.height = 96;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#CC0000';
  ctx.beginPath(); ctx.roundRect(8, 4, 176, 88, 16); ctx.fill();
  ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(8, 4, 176, 88, 16); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.font = 'bold 48px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(`⚔️ ${requiredCount}`, 96, 50);
  const labelTex = new THREE.CanvasTexture(canvas);
  const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTex, transparent: true, depthTest: false }));
  label.scale.set(1.6, 0.8, 1);
  label.position.set(0, 3.8, 0);
  group.add(label);

  group.position.set(0, 0, z);
  group.visible = false; // 처음에 숨김, 가까워지면 표시
  trackGroup.add(group);

  return { z, requiredCount, group, label, defeated: false };
}

// ─────────────────────────────────────────────────
// LEVEL GENERATION
// ─────────────────────────────────────────────────
function generateLevel(level) {
  while (trackGroup.children.length) trackGroup.remove(trackGroup.children[0]);
  state.gates = []; state.obstacles = []; state.grinders = []; state.collectibles = [];
  state.hammers = []; state.arrows = []; state.pits = []; state.bombs = []; state.lasers = [];
  state.jumpRamps = []; state.jumping = false; state.jumpY = 0; state.jumpVelY = 0;
  state.finishLine = null; state.boss = null;

  const difficulty = Math.min(level, 20);
  const gateCount = 5 + Math.floor(difficulty * 0.8);
  const halfObs = state._halfObstacles ? 0.5 : 1;
  state._halfObstacles = false; // 사용 후 리셋
  const obstacleCount = Math.ceil(Math.min(3, 2 + Math.floor(difficulty * 0.3)) * halfObs);
  const grinderCount = Math.ceil((2 + Math.floor(difficulty * 0.5)) * halfObs);
  const gap = 14; // 게이트/장애물 간격 (여유있는 배치)
  const totalItems = gateCount + obstacleCount + grinderCount;

  // 이벤트 배치: 게이트, 적, 그라인더를 빽빽하게 교대 배치
  const events = [];

  // 첫 게이트: 무조건 양쪽 다 +add
  events.push({ type: 'gate', index: 0 });

  // 나머지 게이트
  for (let i = 1; i < gateCount; i++) events.push({ type: 'gate', index: i });

  // 적 (unavoidable) — 모든 스테이지
  for (let i = 0; i < obstacleCount; i++) events.push({ type: 'obstacle' });

  // 그라인더 — 모든 스테이지
  for (let i = 0; i < grinderCount; i++) events.push({ type: 'grinder' });

  // 장애물 해금 (테마별 점진적 추가)
  // 🌿 초원 (1~3): 적 + 그라인더만
  // 🏜 사막 (4~6): + 해머, 화살
  if (level >= 4) {
    events.push({ type: 'hammer' });
    events.push({ type: 'arrow' });
  }
  // 🧊 겨울 (7~9): + 구덩이, 폭탄
  if (level >= 7) {
    events.push({ type: 'pit' });
    events.push({ type: 'bomb' });
  }
  // 🌋 용암 (10~12): + 레이저, 점프대
  if (level >= 10) {
    events.push({ type: 'laser' });
    events.push({ type: 'jump' });
  }
  // 🌌 우주 (13+): 전부 + 추가 배치
  if (level >= 13) {
    events.push({ type: 'hammer' });
    events.push({ type: 'pit' });
    events.push({ type: 'laser' });
    events.push({ type: 'jump' });
  }

  // 섞기 (첫 번째는 고정)
  const rest = events.slice(1);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  let ordered = [events[0], ...rest];

  // 게이트 연속 방지: 게이트가 2개 연속이면 비게이트와 swap
  for (let i = 1; i < ordered.length - 1; i++) {
    if (ordered[i].type === 'gate' && ordered[i - 1].type === 'gate') {
      // i 이후에서 비게이트를 찾아 swap
      for (let j = i + 1; j < ordered.length; j++) {
        if (ordered[j].type !== 'gate') {
          [ordered[i], ordered[j]] = [ordered[j], ordered[i]];
          break;
        }
      }
    }
  }

  const totalLength = (ordered.length + 1) * gap + 10;
  state.levelLength = totalLength;
  const theme = getTheme(level);
  updateBackground(theme);
  createTrackSegment(0, totalLength + 20, theme);
  generateScenery(level, totalLength);

  let coinSlots = [];

  for (let i = 0; i < ordered.length; i++) {
    const z = -(i + 1) * gap;
    const ev = ordered[i];

    if (ev.type === 'gate') {
      let leftOp, leftVal, rightOp, rightVal;

      if (ev.index === 0) {
        // 첫 게이트: 양쪽 모두 + (유닛 추가), 값은 반드시 다르게
        leftOp = 'add'; rightOp = 'add';
        leftVal = Math.floor(3 + Math.random() * (3 + difficulty));
        do { rightVal = Math.floor(3 + Math.random() * (3 + difficulty)); } while (rightVal === leftVal);
      } else {
        // 일반 게이트 — 레벨 높을수록 곱하기 출현율 감소, sub 증가
        // lv1~3: mul 50%, lv4~6: 30%, lv7~9: 20%, lv10+: 10%
        const mulChance = level <= 3 ? 0.5 : level <= 6 ? 0.3 : level <= 9 ? 0.2 : 0.1;
        // sub가 나올 확률도 레벨에 따라 증가
        const subChance = level <= 3 ? 0.3 : level <= 6 ? 0.45 : 0.55;
        do {
          if (Math.random() > 0.3) {
            leftOp = Math.random() < mulChance ? 'mul' : 'add';
            leftVal = leftOp === 'add' ? Math.floor(2 + Math.random() * (3 + difficulty * 0.5)) : Math.floor(2 + Math.random() * 2);
            rightOp = Math.random() < subChance ? 'sub' : 'add';
            rightVal = rightOp === 'sub' ? Math.floor(2 + Math.random() * (2 + difficulty / 2)) : Math.floor(1 + Math.random() * 2);
          } else {
            rightOp = Math.random() < mulChance ? 'mul' : 'add';
            rightVal = rightOp === 'add' ? Math.floor(2 + Math.random() * (3 + difficulty * 0.5)) : Math.floor(2 + Math.random() * 2);
            leftOp = Math.random() < subChance ? 'sub' : 'add';
            leftVal = leftOp === 'sub' ? Math.floor(2 + Math.random() * (2 + difficulty / 2)) : Math.floor(1 + Math.random() * 2);
          }
        } while (leftOp === rightOp && leftVal === rightVal);
      }

      // 골든 게이트 (약 25% 확률, 첫 게이트 제외)
      // 골든 쪽: 항상 곱하기 (x3~x5), 반대쪽: 곱하기 금지 (add 또는 sub만)
      let goldenSide = null;
      if (ev.index > 0 && Math.random() < 0.25) {
        goldenSide = Math.random() > 0.5 ? 'left' : 'right';
        // 골든 쪽 = 강력한 곱하기
        const goldenVal = Math.floor(3 + Math.random() * 3); // x3 ~ x5
        // 반대쪽 = add 또는 sub (곱하기 금지 → 광고 유인)
        const otherOp = Math.random() > 0.5 ? 'add' : 'sub';
        const otherVal = otherOp === 'add'
          ? Math.floor(1 + Math.random() * 3) // 약한 +1~+3
          : Math.floor(2 + Math.random() * (2 + difficulty / 2)); // -2~-N
        if (goldenSide === 'left') {
          leftOp = 'mul'; leftVal = goldenVal;
          rightOp = otherOp; rightVal = otherVal;
        } else {
          rightOp = 'mul'; rightVal = goldenVal;
          leftOp = otherOp; leftVal = otherVal;
        }
      }
      state.gates.push(createGate(z, leftOp, leftVal, rightOp, rightVal, goldenSide));
    } else if (ev.type === 'obstacle') {
      const count = Math.floor(4 + Math.random() * (difficulty * 0.9));
      state.obstacles.push(createObstacle(z, count));
    } else if (ev.type === 'grinder') {
      const sides = ['left', 'right', 'center', 'sweep'];
      const side = sides[Math.floor(Math.random() * sides.length)];
      state.grinders.push(createGrinder(z, side));
    } else if (ev.type === 'hammer') {
      state.hammers.push(createHammer(z));
    } else if (ev.type === 'arrow') {
      const fromSide = Math.random() > 0.5 ? 'left' : 'right';
      state.arrows.push(createArrowTrap(z, fromSide));
    } else if (ev.type === 'pit') {
      const pitSides = ['left', 'right', 'center'];
      state.pits.push(createPit(z, pitSides[Math.floor(Math.random() * pitSides.length)]));
    } else if (ev.type === 'bomb') {
      const bx = (Math.random() - 0.5) * (state.trackWidth - 1);
      state.bombs.push(createBomb(z, bx));
    } else if (ev.type === 'laser') {
      state.lasers.push(createLaser(z));
    } else if (ev.type === 'jump') {
      state.jumpRamps.push(createJumpRamp(z, level));
    }

    // 코인은 이벤트 사이에 배치
    if (Math.random() > 0.5) {
      const cx = (Math.random() - 0.5) * (state.trackWidth - 1);
      coinSlots.push({ z: z + gap / 2, x: cx });
    }
  }

  // 코인 생성
  for (const cs of coinSlots) state.collectibles.push(createCollectible(cs.z, cs.x));

  state.finishZ = -totalLength + 5;

  // 보스 HP: 현재 인원 기반으로 고정 (레인포스 전 시점)
  // 레벨 높을수록 비율 증가 → 레인포스 없이는 못 이김
  const bossRatio = Math.min(0.95, 0.7 + state.level * 0.015);
  let bossRequired = Math.max(Math.floor(8 + difficulty * 3), Math.floor(state.crowdCount * bossRatio));
  if (state._weakBoss) { bossRequired = Math.ceil(bossRequired * 0.5); state._weakBoss = false; }
  const bossZ = state.finishZ + 10;
  state.boss = createBoss(bossZ, bossRequired);

  // 룰렛 지원군 영역: 보스 앞 (플레이어가 보스 전에 먼저 도착)
  state.reinforceZ = bossZ + 12; // 보스보다 z 양수 쪽 = 플레이어가 먼저 닿음
  state.reinforcePhase = false;
  state.reinforceDone = false;
  createReinforcementZone(state.reinforceZ);

  state.finishLine = createFinishLine(state.finishZ);

  // 충전소~보스~피니시 영역과 겹치는 게이트/장애물 제거
  const safeZoneStart = state.finishZ - 2; // 피니시 약간 앞
  const safeZoneEnd = state.reinforceZ + 4; // 충전소 약간 뒤
  state.gates = state.gates.filter(g => {
    if (g.z < safeZoneEnd && g.z > safeZoneStart) { trackGroup.remove(g.group); return false; }
    return true;
  });
}

// ─────────────────────────────────────────────────
// REINFORCEMENT ROULETTE (보스전 전 지원군)
// ─────────────────────────────────────────────────
const REINFORCE_VALUES = [10, 20, 40, 80, 40, 20]; // 순환 값
const REINFORCE_COLORS = ['#4FC3F7', '#66BB6A', '#FFC107', '#FF5722', '#FFC107', '#66BB6A'];
let reinforceGroup = null;
let reinforceSlots = []; // { mesh, label, value }
let reinforcePointer = null;
let reinforceIdx = 0;
let reinforceSpeed = 0;
let reinforceStopping = false;

function createReinforcementZone(z) {
  if (reinforceGroup) trackGroup.remove(reinforceGroup);
  reinforceGroup = new THREE.Group();
  reinforceSlots = [];
  reinforceIdx = 0;
  reinforceSpeed = 8; // 초기 순환 속도
  reinforceStopping = false;

  const hw = state.trackWidth / 2;
  const slotW = (state.trackWidth - 0.4) / REINFORCE_VALUES.length;
  const slotH = 0.8;
  const baseY = 2.5; // 트루퍼 머리 위로 올림

  // 바닥 영역 (살짝 밝은 구역)
  const zoneMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.08 });
  const zoneFloor = new THREE.Mesh(new THREE.BoxGeometry(state.trackWidth, 0.02, 3), zoneMat);
  zoneFloor.position.set(0, 0.02, 0);
  reinforceGroup.add(zoneFloor);

  // 슬롯 카드들 (가로 배열)
  for (let i = 0; i < REINFORCE_VALUES.length; i++) {
    const val = REINFORCE_VALUES[i];
    const x = -hw + 0.2 + slotW / 2 + i * slotW;

    // 카드 배경
    const cardMat = new THREE.MeshBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.7 });
    const card = new THREE.Mesh(new THREE.BoxGeometry(slotW - 0.08, slotH, 0.05), cardMat);
    card.position.set(x, baseY + slotH / 2, 0);
    reinforceGroup.add(card);

    // 라벨
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = REINFORCE_COLORS[i];
    ctx.font = 'bold 36px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(`+${val}`, 64, 32);
    const labelMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(slotW - 0.12, slotH - 0.1),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas), transparent: true })
    );
    labelMesh.position.set(x, baseY + slotH / 2, 0.03);
    reinforceGroup.add(labelMesh);

    reinforceSlots.push({ card, label: labelMesh, value: val, x, origColor: REINFORCE_COLORS[i] });
  }

  // 선택 포인터 (위에 ▼ 화살표)
  const ptrCanvas = document.createElement('canvas');
  ptrCanvas.width = 64; ptrCanvas.height = 64;
  const pctx = ptrCanvas.getContext('2d');
  pctx.fillStyle = '#FFFFFF';
  pctx.font = 'bold 48px Arial'; pctx.textAlign = 'center'; pctx.textBaseline = 'middle';
  pctx.fillText('▼', 32, 32);
  reinforcePointer = new THREE.Mesh(
    new THREE.PlaneGeometry(0.4, 0.4),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(ptrCanvas), transparent: true })
  );
  reinforcePointer.position.set(reinforceSlots[0].x, baseY + slotH + 0.3, 0.05);
  reinforceGroup.add(reinforcePointer);

  // "TAP / SPACE" 안내 — 크게, 슬롯 위에 배치
  const hintCanvas = document.createElement('canvas');
  hintCanvas.width = 512; hintCanvas.height = 80;
  const hctx = hintCanvas.getContext('2d');
  hctx.fillStyle = 'rgba(0,0,0,0.7)';
  hctx.beginPath(); hctx.roundRect(8, 4, 496, 72, 14); hctx.fill();
  hctx.fillStyle = '#FFD740'; hctx.font = 'bold 34px Arial'; hctx.textAlign = 'center'; hctx.textBaseline = 'middle';
  hctx.fillText('⚡ TAP to Get Reinforcements!', 256, 42);
  const hintMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 0.5),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(hintCanvas), transparent: true })
  );
  hintMesh.position.set(0, baseY + slotH + 0.9, 0.05);
  reinforceGroup.add(hintMesh);

  reinforceGroup.position.set(0, 0, z);
  trackGroup.add(reinforceGroup);
}

function updateReinforcementRoulette(dt, time) {
  if (!state.reinforcePhase || state.reinforceDone) return;

  // 포인터 순환
  if (!reinforceStopping) {
    reinforceIdx = (reinforceIdx + reinforceSpeed * dt) % REINFORCE_VALUES.length;
  } else {
    // 감속 중
    reinforceSpeed *= 0.96;
    reinforceIdx = (reinforceIdx + reinforceSpeed * dt) % REINFORCE_VALUES.length;
    if (reinforceSpeed < 0.3) {
      // 정지 → 확정
      reinforceSpeed = 0;
      const finalIdx = Math.round(reinforceIdx) % REINFORCE_VALUES.length;
      const reward = REINFORCE_VALUES[finalIdx];
      state.crowdCount += reward;
      state.crowdDisplay = state.crowdCount;
      updateCrowd();
      spawnParticles(new THREE.Vector3(crowdGroup.position.x, 1, 0), 0x4CAF50, 20);
      state.reinforceDone = true;
      state.reinforcePhase = false;
      state.speed = state.baseSpeed;
      state.phase = 'running'; // 이동 재개 → 보스에게 진행
      // 선택된 슬롯 강조 후 페이드아웃
      reinforceSlots.forEach((s, i) => {
        s.card.material.opacity = i === finalIdx ? 1.0 : 0.2;
      });
      // 1초 후 룰렛 UI 숨김
      setTimeout(() => {
        if (reinforceGroup) reinforceGroup.visible = false;
      }, 800);
      return;
    }
  }

  // 포인터 위치 업데이트
  const currentSlot = reinforceSlots[Math.floor(reinforceIdx) % reinforceSlots.length];
  if (reinforcePointer && currentSlot) {
    reinforcePointer.position.x = currentSlot.x;
  }
  // 현재 슬롯 하이라이트
  const curIdx = Math.floor(reinforceIdx) % reinforceSlots.length;
  reinforceSlots.forEach((s, i) => {
    s.card.material.opacity = i === curIdx ? 0.95 : 0.5;
    s.card.material.color.setHex(i === curIdx ? 0xFFFFFF : 0x333333);
  });
}

// ─────────────────────────────────────────────────
// PARTICLES
// ─────────────────────────────────────────────────
const particles = [];
function spawnParticles(position, color, count = 10) {
  for (let i = 0; i < count; i++) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), new THREE.MeshBasicMaterial({ color }));
    mesh.position.copy(position); scene.add(mesh);
    particles.push({ mesh, vel: new THREE.Vector3((Math.random() - 0.5) * 0.15, Math.random() * 0.2 + 0.05, (Math.random() - 0.5) * 0.15), life: 1 });
  }
}
function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]; p.mesh.position.add(p.vel); p.vel.y -= 0.005; p.life -= dt * 2;
    p.mesh.scale.setScalar(Math.max(p.life, 0));
    if (p.life <= 0) { scene.remove(p.mesh); particles.splice(i, 1); }
  }
}

// 바닥 스플래시 자국 (그라인더 등 타격 시)
const splashMarks = [];
function spawnSplashMark(x, z, color = 0x2196F3) {
  const size = 0.3 + Math.random() * 0.4;
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6 });
  const mark = new THREE.Mesh(new THREE.CircleGeometry(size, 8), mat);
  mark.rotation.x = -Math.PI / 2;
  mark.position.set(x, 0.02, z);
  trackGroup.add(mark);
  splashMarks.push({ mesh: mark, life: 3.0 });
}
function updateSplashMarks(dt) {
  for (let i = splashMarks.length - 1; i >= 0; i--) {
    const s = splashMarks[i];
    s.life -= dt;
    s.mesh.material.opacity = Math.max(0, s.life / 3.0) * 0.6;
    if (s.life <= 0) { trackGroup.remove(s.mesh); splashMarks.splice(i, 1); }
  }
}

// ─────────────────────────────────────────────────
// INPUT (모바일 대응 강화)
// ─────────────────────────────────────────────────
let pointerDown = false;
let lastPointerX = 0;

function onPointerDown(e) {
  if (state.phase === 'start') { startGame(); return; }
  if (state.phase === 'reinforce' && !reinforceStopping) { reinforceStopping = true; return; }
  pointerDown = true;
  lastPointerX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
}
function clampTargetX() {
  const hw = state.trackWidth / 2;
  const crowdHW = getCrowdHalfWidth();
  const limit = hw - crowdHW - 0.15; // 벽 안쪽으로 제한
  state.targetX = Math.max(-limit, Math.min(limit, state.targetX));
}

function onPointerMove(e) {
  if (!pointerDown || state.phase !== 'running') return;
  const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
  const delta = (x - lastPointerX) / window.innerWidth * 8;
  state.targetX += delta;
  clampTargetX();
  lastPointerX = x;
}
function onPointerUp() { pointerDown = false; }

// Mouse
renderer.domElement.addEventListener('mousedown', onPointerDown);
renderer.domElement.addEventListener('mousemove', onPointerMove);
renderer.domElement.addEventListener('mouseup', onPointerUp);

// Touch (모바일)
renderer.domElement.addEventListener('touchstart', (e) => { e.preventDefault(); onPointerDown(e.touches[0]); }, { passive: false });
renderer.domElement.addEventListener('touchmove', (e) => { e.preventDefault(); onPointerMove(e.touches[0]); }, { passive: false });
renderer.domElement.addEventListener('touchend', (e) => { e.preventDefault(); onPointerUp(); }, { passive: false });
renderer.domElement.addEventListener('touchcancel', onPointerUp);

// Keyboard
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && state.phase === 'start') startGame();
  if (e.code === 'Space' && state.phase === 'reinforce' && !reinforceStopping) {
    reinforceStopping = true; // 룰렛 감속 시작
  }
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') { state.targetX -= 0.3; clampTargetX(); }
  if (e.code === 'ArrowRight' || e.code === 'KeyD') { state.targetX += 0.3; clampTargetX(); }
  // 디버그: G키 → 레벨 클리어 (카드 선택 화면)
  if (e.code === 'KeyG' && (state.phase === 'running' || state.phase === 'battle')) {
    state.battle = null;
    state.crowdCount = Math.max(state.crowdCount, 10);
    state.crowdDisplay = state.crowdCount;
    completeLevel();
    console.log(`[DEBUG] Completed LEVEL ${state.level}`);
  }
});

document.getElementById('continue-btn').addEventListener('click', () => nextLevel());
document.getElementById('retry-btn').addEventListener('click', () => restartLevel());
document.getElementById('ad-retry-btn').addEventListener('click', () => adRetry());
// 모바일 터치 대응
document.getElementById('continue-btn').addEventListener('touchend', (e) => { e.preventDefault(); nextLevel(); });
document.getElementById('retry-btn').addEventListener('touchend', (e) => { e.preventDefault(); restartLevel(); });
document.getElementById('ad-retry-btn').addEventListener('touchend', (e) => { e.preventDefault(); adRetry(); });

// ─────────────────────────────────────────────────
// GAME FLOW
// ─────────────────────────────────────────────────
function showControlHint() {
  const hint = document.getElementById('control-hint');
  hint.style.display = 'flex';
  hint.style.opacity = '1';
  setTimeout(() => { hint.style.opacity = '0'; }, 3000);
  setTimeout(() => { hint.style.display = 'none'; }, 3600);
}

function updateStageDisplay() {
  document.getElementById('level-label').textContent = `LEVEL ${state.level}`;
}

function startGame() {
  document.getElementById('start-screen').style.display = 'none';
  state.phase = 'running'; state.crowdCount = 1; state.crowdDisplay = 1; state.trackZ = 0; state.targetX = 0; state.speed = state.baseSpeed;
  generateLevel(state.level); updateCrowd();
  updateStageDisplay();
  if (state.level === 1) showControlHint();
}

// ─────────────────────────────────────────────────
// CARD REWARD SYSTEM
// ─────────────────────────────────────────────────
const CARD_POOL = [
  // Common (즉시 효과)
  { id: 'troops10',  rarity: 'common', icon: '👥', name: '+10 Troops',        desc: 'Start next stage with 10 extra', cost: 5,  effect: s => { s.crowdCount += 10; s.crowdDisplay += 10; } },
  { id: 'troops20',  rarity: 'common', icon: '👥', name: '+20 Troops',        desc: 'Start next stage with 20 extra', cost: 10, effect: s => { s.crowdCount += 20; s.crowdDisplay += 20; } },
  { id: 'coins2x',   rarity: 'common', icon: '🪙', name: 'Coin Bonus',       desc: 'Double your current coins',      cost: 8,  effect: s => { s.coins *= 2; } },
  { id: 'speedup',   rarity: 'common', icon: '⚡', name: 'Speed Boost',      desc: 'Move 20% faster next stage',     cost: 6,  effect: s => { s.baseSpeed *= 1.2; } },
  // Rare (즉시 + 다음 스테이지)
  { id: 'troops50p', rarity: 'rare',   icon: '🎖', name: '+50% Troops',      desc: 'Boost starting troops by 50%',   cost: 15, effect: s => { const add = Math.ceil(s.crowdCount * 0.5); s.crowdCount += add; s.crowdDisplay += add; } },
  { id: 'halfobs',   rarity: 'rare',   icon: '🛡', name: 'Clear Path',       desc: 'Half obstacles next stage',      cost: 18, effect: s => { s._halfObstacles = true; } },
  { id: 'weakboss',  rarity: 'rare',   icon: '💀', name: 'Weaken Boss',      desc: 'Boss has 50% less HP',           cost: 15, effect: s => { s._weakBoss = true; } },
  { id: 'coinmag',   rarity: 'rare',   icon: '🧲', name: 'Coin Magnet',      desc: 'Auto-collect coins next stage',  cost: 12, effect: s => { s._coinMagnet = true; } },
  // Epic (특수 능력)
  { id: 'shield',    rarity: 'epic',   icon: '🔰', name: 'Shield',           desc: 'Block first hit (saves all)',    cost: 25, effect: s => { s._shield = 1; } },
  { id: 'giant',     rarity: 'epic',   icon: '🦖', name: 'Giant Mode',       desc: '5s invincible at stage start',   cost: 30, effect: s => { s._giantTimer = 5.0; } },
  { id: 'double',    rarity: 'epic',   icon: '✨', name: 'Double Gates',     desc: 'Gate effects apply twice',       cost: 28, effect: s => { s._doubleGate = true; } },
];

let selectedCardIdx = -1;
let currentCards = [];
let rerollCount = 0;
const AD_GOLD_REWARD = 50;

function pickCards() {
  const commons = CARD_POOL.filter(c => c.rarity === 'common');
  const rares   = CARD_POOL.filter(c => c.rarity === 'rare');
  const epics   = CARD_POOL.filter(c => c.rarity === 'epic');
  return [
    commons[Math.floor(Math.random() * commons.length)],
    rares[Math.floor(Math.random() * rares.length)],
    epics[Math.floor(Math.random() * epics.length)],
  ];
}

function getCardBudget() { return state.coins; }
function getRerollCost() { return rerollCount === 0 ? 0 : rerollCount * 10; }

function renderCards() {
  const budget = getCardBudget();
  document.getElementById('card-budget').textContent = budget;

  const row = document.getElementById('card-row');
  row.innerHTML = '';
  selectedCardIdx = -1;

  currentCards.forEach((card, i) => {
    const affordable = card.cost <= budget;
    const el = document.createElement('div');
    el.className = 'reward-card' + (!affordable ? ' locked' : '') + (card._purchased ? ' purchased' : '');
    el.innerHTML = `
      <span class="card-rarity ${card.rarity}">${card.rarity.toUpperCase()}</span>
      <span class="card-icon">${card.icon}</span>
      <span class="card-name">${card.name}</span>
      <span class="card-desc">${card.desc}</span>
      <span class="card-cost ${!affordable ? 'too-expensive' : ''}">🪙 ${card.cost}</span>
    `;
    if (!card._purchased) {
      el.addEventListener('click', () => {
        if (card.cost > getCardBudget()) return;
        if (selectedCardIdx === i) {
          // 두 번째 탭 → 구매 확정!
          buyCard(i);
        } else {
          // 첫 번째 탭 → 선택
          row.querySelectorAll('.reward-card').forEach(c => c.classList.remove('selected'));
          el.classList.add('selected');
          selectedCardIdx = i;
        }
      });
    }
    row.appendChild(el);
  });

  // 리롤 버튼 업데이트
  const rerollCost = getRerollCost();
  const rerollBtn = document.getElementById('card-reroll-btn');
  rerollBtn.textContent = rerollCost === 0 ? '🔄 Reroll (Free)' : `🔄 Reroll (🪙 ${rerollCost})`;
  if (rerollCost > budget) {
    rerollBtn.style.opacity = '0.3';
    rerollBtn.style.pointerEvents = 'none';
  } else {
    rerollBtn.style.opacity = '1';
    rerollBtn.style.pointerEvents = 'auto';
  }
}

function buyCard(idx) {
  const card = currentCards[idx];
  if (card._purchased || card.cost > getCardBudget()) return;
  // 코스트 차감
  state.coins = Math.max(0, state.coins - card.cost);
  document.getElementById('coin-display').textContent = state.coins;
  // 효과 적용
  card.effect(state);
  card._purchased = true;
  selectedCardIdx = -1;
  // 카드 다시 렌더
  renderCards();
}

function showCardSelect() {
  selectedCardIdx = -1;
  rerollCount = 0;
  currentCards = pickCards();

  // 광고 버튼 리셋
  const adBtn = document.getElementById('card-ad-btn');
  adBtn.style.opacity = '1';
  adBtn.style.pointerEvents = 'auto';
  adBtn.innerHTML = '<span>🎬</span> +50 Gold';

  renderCards();
  document.getElementById('card-select').style.display = 'flex';
}

function closeCardSelect() {
  document.getElementById('card-select').style.display = 'none';
}

// Done(Skip) → 다음 레벨
document.getElementById('card-skip-btn').addEventListener('click', () => {
  closeCardSelect();
  nextLevel();
});

// 광고 → +50 Gold
document.getElementById('card-ad-btn').addEventListener('click', () => {
  state.coins += AD_GOLD_REWARD;
  document.getElementById('coin-display').textContent = state.coins;
  const btn = document.getElementById('card-ad-btn');
  btn.style.opacity = '0.3';
  btn.style.pointerEvents = 'none';
  btn.textContent = '✅ +50 Gold!';
  renderCards(); // 예산 갱신 → 잠금 해제
});

// 리롤 → 새 카드 3장
document.getElementById('card-reroll-btn').addEventListener('click', () => {
  const cost = getRerollCost();
  if (cost > getCardBudget()) return;
  if (cost > 0) {
    state.coins = Math.max(0, state.coins - cost);
    document.getElementById('coin-display').textContent = state.coins;
  }
  rerollCount++;
  currentCards = pickCards();
  renderCards();
});

function completeLevel() {
  state.phase = 'complete';
  state.coins += state.crowdCount;
  document.getElementById('coin-display').textContent = state.coins;
  for (let i = 0; i < 30; i++) {
    spawnParticles(new THREE.Vector3(crowdGroup.position.x + (Math.random() - 0.5) * 2, 1 + Math.random(), 0), [0xFFD700, 0x4CAF50, 0xFF7043, 0x2196F3][Math.floor(Math.random() * 4)], 3);
  }
  // 카드 선택 화면 표시 (level-complete 대신)
  showCardSelect();
}

function gameOver() {
  state.phase = 'gameover';
  const reviveCount = state.level * 10;
  document.getElementById('go-level').textContent = `LEVEL ${state.level}`;
  document.getElementById('go-coins').textContent = state.coins;
  document.getElementById('go-best').textContent = state.bestCount;
  document.getElementById('ad-revive-info').innerHTML =
    `👥 Revive here with <span class="revive-count">+${reviveCount}</span> troops!`;
  document.getElementById('game-over').style.display = 'flex';
}

function nextLevel() {
  document.getElementById('level-complete').style.display = 'none';
  state.level++;
  // 카드로 증가된 인원 유지 (최소 1명)
  state.crowdCount = Math.max(1, state.crowdCount);
  state.crowdDisplay = state.crowdCount;
  state.trackZ = 0; state.targetX = 0;
  state.baseSpeed = Math.min(0.08 + state.level * 0.003, 0.16);
  state.speed = state.baseSpeed; state.phase = 'running';
  state.jumping = false; state.jumpY = 0; state.jumpVelY = 0;
  crowdGroup.position.y = 0;
  document.getElementById('level-label').textContent = `LEVEL ${state.level}`;
  document.getElementById('progress-bar-fill').style.width = '0%';
  document.getElementById('coin-display').textContent = state.coins;
  generateLevel(state.level); updateCrowd();
  updateStageDisplay();
}

function adRetry() {
  // 광고 시청 후 사망 지점에서 부활 (레벨 * 10명)
  document.getElementById('game-over').style.display = 'none';
  state.crowdCount = state.level * 10;
  state.crowdDisplay = state.level * 10;

  // 사망한 장애물'만' 넘기기 (바로 근처 2m 이내만 스킵)
  const cz = state.trackZ;
  const skip = 2;
  for (const g of state.gates) { if (!g.passed && Math.abs(cz - g.z) < skip) { g.passed = true; g.trimmed = true; } }
  for (const o of state.obstacles) { if (!o.passed && Math.abs(cz - o.z) < skip) { o.passed = true; o.group.visible = false; } }
  for (const g of state.grinders) { if (Math.abs(cz - g.z) < skip) g.group.visible = false; }
  for (const h of state.hammers) { if (Math.abs(cz - h.z) < skip) h.group.visible = false; }
  for (const a of state.arrows) { if (Math.abs(cz - a.z) < skip) a.group.visible = false; }
  for (const p of state.pits) { if (Math.abs(cz - p.z) < skip) { p.lastDamageTick = Infinity; p.group.visible = false; } }
  for (const b of state.bombs) { if (!b.exploded && Math.abs(cz - b.z) < skip) { b.exploded = true; b.group.visible = false; } }
  for (const l of state.lasers) { if (Math.abs(cz - l.z) < skip) { l.lastDamageTick = Infinity; l.group.visible = false; } }
  for (const jr of state.jumpRamps) { if (Math.abs(cz - jr.z) < skip) { jr.lastDamageTick = Infinity; jr.triggered = true; jr.group.visible = false; } }

  // 보스전 중 사망 → 보스만 스킵, 피니시로 이동 (보스가 마지막 장애물이므로)
  if (state.boss && !state.boss.defeated && state.battle) {
    state.boss.defeated = true;
    state.boss.group.visible = false;
    state.battle = null;
    state.trackZ = state.finishZ + 2;
  }

  state.speed = state.baseSpeed;
  state.phase = 'running';
  updateCrowd();
}

function restartLevel() {
  // 처음부터 다시 시작
  document.getElementById('game-over').style.display = 'none';
  state.level = 1; state.coins = 0; state.bestCount = 0;
  state.baseSpeed = 0.08;
  state.crowdCount = 1; state.crowdDisplay = 1; state.trackZ = 0; state.targetX = 0; state.speed = state.baseSpeed; state.phase = 'running';
  document.getElementById('coin-display').textContent = '0';
  document.getElementById('level-label').textContent = 'LEVEL 1';
  document.getElementById('progress-bar-fill').style.width = '0%';
  generateLevel(state.level); updateCrowd();
  updateStageDisplay();
}

// ─────────────────────────────────────────────────
// COLLISION
// ─────────────────────────────────────────────────
// 게이트 개구부에 맞는 최대 인원 계산
function getMaxCountForGateWidth(gateWidth) {
  for (let c = 200; c >= 1; c--) {
    const cols = Math.ceil(Math.sqrt(c));
    const spacing = getCrowdSpacing(c);
    if (cols * spacing <= gateWidth) return c;
  }
  return 1;
}

// 떨어져나가는 캐릭터 연출용
const fallingUnits = [];

function spawnFallingUnit(worldX, worldZ, side) {
  const unit = createStickman(0x2196F3);
  unit.position.set(worldX, 0, worldZ);
  scene.add(unit);
  fallingUnits.push({
    mesh: unit,
    velX: side * (0.03 + Math.random() * 0.04), // 좌 or 우로 날아감
    velY: 0.08 + Math.random() * 0.04,
    velZ: (Math.random() - 0.5) * 0.02,
    rotSpeed: (Math.random() - 0.5) * 0.3,
    life: 1.5,
  });
}

// 구덩이 전용: 아래로 똑바로 떨어지는 모션
function spawnPitFallingUnit(worldX, worldZ, count) {
  const spacing = getCrowdSpacing(count);
  const scale = getCrowdScale(count);
  for (let i = 0; i < Math.min(count, 8); i++) {
    const unit = createStickman(0x2196F3);
    unit.scale.setScalar(scale);
    const ox = (Math.random() - 0.5) * spacing * 3;
    const oz = (Math.random() - 0.5) * spacing * 2;
    unit.position.set(worldX + ox, 0, worldZ + oz);
    scene.add(unit);
    fallingUnits.push({
      mesh: unit,
      velX: (Math.random() - 0.5) * 0.005, // 거의 좌우 이동 없음
      velY: -0.01 - Math.random() * 0.02,   // 처음부터 아래로
      velZ: (Math.random() - 0.5) * 0.005,
      rotSpeed: (Math.random() - 0.5) * 0.15,
      life: 1.2,
      isPitFall: true, // 구덩이 떨어지기 플래그
    });
  }
}

function updateFallingUnits(dt) {
  for (let i = fallingUnits.length - 1; i >= 0; i--) {
    const f = fallingUnits[i];
    f.mesh.position.x += f.velX;
    f.mesh.position.y += f.velY;
    f.mesh.position.z += f.velZ;
    if (f.isPitFall) {
      // 구덩이: 강한 중력으로 빠르게 아래로
      f.velY -= 0.012;
      // 팔다리 허우적 효과
      f.mesh.rotation.x += f.rotSpeed * 0.3;
      f.mesh.rotation.z += Math.sin(f.life * 20) * 0.05;
    } else {
      f.velY -= 0.006; // 일반 중력
      f.mesh.rotation.z += f.rotSpeed;
      f.mesh.rotation.x += f.rotSpeed * 0.5;
    }
    f.life -= dt;
    if (f.life <= 0 || f.mesh.position.y < -5) {
      scene.remove(f.mesh);
      fallingUnits.splice(i, 1);
    }
  }
}

const GATE_MAX = 200; // 절대 상한 (안전장치)
const GATE_TRIM_RATIO = 0.7; // 게이트 통과 시 최대 70%만 통과 (30% 삭감)

function applyGate(op, val, gateZ) {
  // 1) 게이트 통과 전: 80명 초과 인원 나가떨어짐
  if (state.crowdCount > GATE_MAX) {
    const excess = state.crowdCount - GATE_MAX;
    const crowdWorldX = crowdGroup.position.x;
    const worldZ = gateZ !== undefined ? gateZ : 0;
    for (let i = 0; i < excess; i++) {
      const side = (i % 2 === 0) ? 1 : -1;
      spawnFallingUnit(
        crowdWorldX + (Math.random() * 0.5) * side,
        -state.trackZ + worldZ,
        side
      );
    }
    state.crowdCount = GATE_MAX;
    updateCrowd();
  }

  // 2) 통과한 80명(이하)에게 게이트 효과 적용 (캡 제거 — 수백명도 가능)
  const before = state.crowdCount;
  if (op === 'add') state.crowdCount += val;
  else if (op === 'sub') state.crowdCount = Math.max(0, state.crowdCount - val);
  else if (op === 'mul') state.crowdCount *= val;

  if (state.crowdCount > before) spawnParticles(new THREE.Vector3(crowdGroup.position.x, 1, 0), 0x4CAF50, 15);
  else if (state.crowdCount < before) spawnParticles(new THREE.Vector3(crowdGroup.position.x, 1, 0), 0xFF5252, 15);
  if (state.crowdCount <= 0) { state.crowdCount = 0; gameOver(); }
  updateCrowd();
}

// 데미지 처리 헬퍼 — 쉴드/무적 체크
function takeDamage(dmg, particlePos, particleColor, particleCount) {
  if (state.crowdCount <= 0) return 0;
  // 거인 모드 (무적)
  if (state._giantTimer > 0) {
    spawnParticles(particlePos || new THREE.Vector3(0, 1, 0), 0xFFD700, 5);
    return 0; // 데미지 무효
  }
  // 쉴드 (첫 피격 무효)
  if (state._shield > 0) {
    state._shield--;
    spawnParticles(particlePos || new THREE.Vector3(0, 1, 0), 0x00E5FF, 12);
    return 0; // 데미지 무효
  }
  // 일반 데미지
  const actual = Math.min(dmg, state.crowdCount);
  state.crowdCount = Math.max(0, state.crowdCount - dmg);
  if (particlePos) spawnParticles(particlePos, particleColor || 0xFF0000, particleCount || 6);
  if (state.crowdCount <= 0) { state.crowdCount = 0; gameOver(); }
  updateCrowd();
  return actual;
}

function checkCollisions() {
  const crowdZ = state.trackZ;
  const crowdX = crowdGroup.position.x;

  // Gates (2단계: 접근 시 trim → 완전 통과 후 효과 적용)
  // dz = crowdZ - gate.z: 양수=접근중, 0=게이트위치, 음수=통과함
  for (const gate of state.gates) {
    if (gate.passed) continue;
    const dz = crowdZ - gate.z;

    // 1단계: 게이트에 접근 → 게이트 폭 + 비율 삭감
    if (!gate.trimmed && dz < 1.0 && dz > -0.3) {
      gate.trimmed = true;
      gate.chosenSide = crowdX <= 0 ? gate.left : gate.right;
      // 게이트 한쪽 물리적 통과 폭
      const gateOpenW = state.trackWidth / 2 - 0.15;
      const maxFit = getMaxCountForGateWidth(gateOpenW);
      // 비율 삭감: 현재 인원의 70%만 통과 (최소 maxFit, 최대 GATE_MAX)
      const ratioCap = Math.floor(state.crowdCount * GATE_TRIM_RATIO);
      const cap = Math.min(GATE_MAX, Math.max(maxFit, ratioCap));
      if (state.crowdCount > cap) {
        const excess = state.crowdCount - cap;
        for (let i = 0; i < Math.min(excess, 40); i++) {
          const s = (i % 2 === 0) ? 1 : -1;
          spawnFallingUnit(crowdX + (Math.random() * 0.5) * s, -state.trackZ + gate.z, s);
        }
        state.crowdCount = cap;
        state.crowdDisplay = cap; // trim은 즉시 반영
        updateCrowd();
      }
    }

    // 2단계: 게이트를 완전히 통과 (dz < -1.2) → 게이트 효과 적용
    if (gate.trimmed && dz < -1.2) {
      gate.passed = true;
      const side = gate.chosenSide;
      if (side.golden) state.adOwed++;
      const before = state.crowdCount;
      if (side.op === 'add') state.crowdCount += side.val;
      else if (side.op === 'sub') state.crowdCount = Math.max(0, state.crowdCount - side.val);
      else if (side.op === 'mul') state.crowdCount *= side.val;
      if (state.crowdCount > before) spawnParticles(new THREE.Vector3(crowdX, 1, 0), 0x4CAF50, 15);
      else if (state.crowdCount < before) spawnParticles(new THREE.Vector3(crowdX, 1, 0), 0xFF5252, 15);
      if (state.crowdCount <= 0) { state.crowdCount = 0; gameOver(); }
      // crowdDisplay는 건드리지 않음 → 애니메이션 루프에서 서서히 crowdCount까지 증가
      gate.group.traverse((c) => { if (c.material) { c.material.transparent = true; c.material.opacity = 0.2; } });
    }
  }

  // Obstacles → 전투 개시
  for (const obs of state.obstacles) {
    if (obs.passed) continue;
    const dz = crowdZ - obs.z;
    if (dz > 0 && dz < 1.5) {
      obs.passed = true;
      startBattle(obs);
      return; // 전투 중에는 다른 충돌 체크 안 함
    }
  }

  // Grinders (큰 톱니바퀴 — 트랙 옆에서 돌출, 가까이 가면 연속 데미지)
  const now = performance.now();
  for (const gr of state.grinders) {
    const gx = gr.x; // 톱니바퀴 중심 x
    const dz = Math.abs(crowdZ - gr.z);
    const crowdHW = getCrowdHalfWidth();
    // 톱니바퀴의 트랙 침범 범위 (중심에서 반지름만큼 돌출)
    const bladeReach = Math.abs(gx) - gr.radius;
    const crowdEdge = gx > 0 ? crowdX + crowdHW : crowdX - crowdHW;
    const inBladeX = gx > 0 ? crowdEdge > bladeReach : crowdEdge < -bladeReach;
    if (dz < 1.0 && inBladeX && state.crowdCount > 0) {
      const tickInterval = 100;
      if (now - gr.lastDamageTick > tickInterval) {
        gr.lastDamageTick = now;
        const hitPos = new THREE.Vector3(
          gx > 0 ? crowdX + crowdHW : crowdX - crowdHW,
          0.5, crowdZ
        );
        const gDmg = Math.max(1, Math.ceil(state.crowdCount * 0.06));
        const dealt = takeDamage(gDmg, hitPos, 0x2196F3, Math.min(gDmg * 3, 20));
        // 추가 스플래시 파티클 (파란 물감 효과)
        if (dealt > 0) {
          for (let i = 0; i < 8; i++) {
            spawnParticles(new THREE.Vector3(
              hitPos.x + (Math.random() - 0.5) * 0.8,
              Math.random() * 0.6,
              hitPos.z + (Math.random() - 0.5) * 0.5
            ), 0x64B5F6, 2);
          }
          // 날아가는 유닛
          const dir = gx > 0 ? -1 : 1;
          for (let i = 0; i < dealt; i++) {
            spawnFallingUnit(hitPos.x, -state.trackZ + gr.z, dir);
          }
          // 바닥 스플래시 자국
          for (let i = 0; i < 3; i++) {
            spawnSplashMark(
              hitPos.x + (Math.random() - 0.5) * 0.6,
              gr.z + (Math.random() - 0.5) * 0.5,
              0x64B5F6
            );
          }
        }
      }
    }
  }

  // Hammers (스윙 해머 — 맞은 인원 날아감)
  for (const h of state.hammers) {
    const dz = Math.abs(crowdZ - h.z);
    if (dz < 1.0 && state.crowdCount > 0) {
      const swing = h.armGroup.rotation.z;
      const hammerX = Math.sin(swing) * 2.5;
      const dx = Math.abs(crowdX - hammerX);
      if (dx < 0.8) {
        if (now - h.lastDamageTick > 150) {
          h.lastDamageTick = now;
          const dmg = Math.max(1, Math.ceil(state.crowdCount * 0.08));
          const dealt = takeDamage(dmg, new THREE.Vector3(hammerX, 1, h.z), 0x795548, Math.min(dmg * 3, 20));
          // 맞은 인원 날아가는 연출
          const hitDir = swing > 0 ? 1 : -1;
          for (let i = 0; i < dealt; i++) {
            spawnFallingUnit(crowdX + (Math.random() - 0.5) * 0.5, -state.trackZ + h.z, hitDir);
          }
        }
      }
    }
  }

  // Arrow traps (화살 — 활성 화살과 크라우드 충돌)
  for (const at of state.arrows) {
    for (const a of at.arrows) {
      if (!a.active) continue;
      const dz = Math.abs(crowdZ - at.z);
      const dx = Math.abs(crowdX - a.x);
      if (dz < 0.5 && dx < 0.6 && state.crowdCount > 0) {
        a.active = false;
        trackGroup.remove(a.mesh);
        const aDmg = Math.max(1, Math.ceil(state.crowdCount * 0.03));
        takeDamage(aDmg, new THREE.Vector3(a.x, 0.6, at.z), 0x8D6E63, Math.min(aDmg * 2, 12));
      }
    }
  }

  // Pits (구덩이 — 구덩이 위에 있으면 인원 탈락)
  for (const p of state.pits) {
    const dz = Math.abs(crowdZ - p.z);
    if (dz < 1.0 && state.crowdCount > 0) {
      // 크라우드 중심이 구덩이 범위 안에 있는지
      const crowdHW = getCrowdHalfWidth();
      const pitLeft = p.pitX - p.pitW / 2;
      const pitRight = p.pitX + p.pitW / 2;
      const crowdLeft = crowdX - crowdHW;
      const crowdRight = crowdX + crowdHW;
      // 겹침 계산
      const overlap = Math.max(0, Math.min(crowdRight, pitRight) - Math.max(crowdLeft, pitLeft));
      if (overlap > 0.15) {
        if (now - p.lastDamageTick > 100) {
          p.lastDamageTick = now;
          const dmg = Math.max(1, Math.ceil(state.crowdCount * 0.1 * (overlap / crowdHW)));
          const dealt = takeDamage(dmg, new THREE.Vector3(crowdX, 0.3, -state.trackZ + p.z), 0x333333, Math.min(dmg * 2, 15));
          if (dealt > 0) spawnPitFallingUnit(crowdX, -state.trackZ + p.z, dealt);
        }
      }
    }
  }

  // Bombs (폭탄 — 옆을 지나가기만 해도 폭발, 범위 밖이면 무해)
  for (const b of state.bombs) {
    if (b.exploded) continue;
    const dz = Math.abs(crowdZ - b.z);
    if (dz < 2.5) { // 옆을 지나가면 무조건 터짐
      b.exploded = true;
      // 폭발 구체 (팽창 후 소멸)
      const blastSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xFF6E40, transparent: true, opacity: 0.8 })
      );
      blastSphere.position.set(b.x, 0.5, b.z);
      trackGroup.add(blastSphere);
      // 팽창 애니메이션
      let blastScale = 0.1;
      const blastAnim = setInterval(() => {
        blastScale += 0.3;
        blastSphere.scale.setScalar(blastScale);
        blastSphere.material.opacity = Math.max(0, 0.8 - blastScale / 4);
        if (blastScale > 4) { clearInterval(blastAnim); trackGroup.remove(blastSphere); }
      }, 16);
      // 파티클
      for (let i = 0; i < 40; i++) {
        spawnParticles(new THREE.Vector3(
          b.x + (Math.random() - 0.5) * 2,
          0.3 + Math.random() * 2.5,
          b.z + (Math.random() - 0.5) * 2
        ), [0xFF6E40, 0xFFD740, 0xFF0000, 0x333333][Math.floor(Math.random() * 4)], 3);
      }
      b.group.visible = false;
      // 바닥 스플래시
      for (let i = 0; i < 5; i++) {
        spawnSplashMark(b.x + (Math.random() - 0.5), b.z + (Math.random() - 0.5), 0x333333);
      }
      // 범위 내 데미지
      const dx = Math.abs(crowdX - b.x);
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < b.blastRadius) {
        const proximity = 1 - dist / b.blastRadius; // 1=직격, 0=범위 끝
        const dmg = Math.max(1, Math.ceil(state.crowdCount * 0.2 * proximity));
        const dealt = takeDamage(dmg, new THREE.Vector3(crowdX, 0.8, crowdZ), 0xFF6E40, Math.min(dmg * 2, 25));
        // 폭풍에 날아가는 유닛
        for (let i = 0; i < Math.min(dealt, 5); i++) {
          spawnFallingUnit(crowdX, -state.trackZ + b.z, (Math.random() > 0.5 ? 1 : -1));
        }
      }
    }
  }

  // Lasers (터렛 — 위험 구역 안에 있는 인원만 데미지)
  for (const l of state.lasers) {
    if (l.firing && state.crowdCount > 0) {
      // 크라우드가 위험 구역 X범위 안에 겹치는지 체크
      const crowdHW = getCrowdHalfWidth();
      const dLeft = l.dangerX - l.dangerW / 2;
      const dRight = l.dangerX + l.dangerW / 2;
      const cLeft = crowdX - crowdHW;
      const cRight = crowdX + crowdHW;
      const overlap = Math.max(0, Math.min(cRight, dRight) - Math.max(cLeft, dLeft));
      if (overlap > 0.1) {
        if (now - l.lastDamageTick > 120) {
          l.lastDamageTick = now;
          const overlapRatio = crowdHW > 0 ? overlap / (crowdHW * 2) : 0.5;
          const dmg = Math.max(1, Math.ceil(state.crowdCount * 0.05 * (0.5 + overlapRatio)));
          const dealt = takeDamage(dmg, new THREE.Vector3(crowdX, 0.8, crowdZ), 0xFF0000, Math.min(dmg * 2, 18));
          for (let i = 0; i < Math.min(dealt, 3); i++) {
            const side = l.laserSide === 'left' ? 1 : -1;
            spawnFallingUnit(crowdX, -state.trackZ + l.z, side);
          }
        }
      }
    }
  }

  // Jump Ramps + Hazard zones
  for (const jr of state.jumpRamps) {
    // 점프대 접촉 체크 (램프 Z 범위)
    // 점프대: 위험지대 뒤쪽(z 양수 방향, 플레이어가 먼저 닿는 쪽)
    const rampStartZ = jr.z + jr.hazardLen / 2; // 점프대 시작
    const rampEndZ = jr.z + jr.hazardLen / 2 + jr.rampLen; // 점프대 끝
    if (crowdZ < rampEndZ && crowdZ > rampStartZ && !jr.triggered && !state.jumping) {
      // 크라우드가 점프대 위에 있는지 (X 범위 체크)
      const onRamp = Math.abs(crowdX - jr.rampX) < jr.rampW / 2 + 0.2;
      if (onRamp) {
        // 점프 발동!
        jr.triggered = true;
        state.jumping = true;
        state.jumpVelY = 0.25; // 위로 강하게 발사 (위험지대 확실히 넘기)
        state.jumpY = 0;
      }
    }

    // 위험지대 데미지 (점프 안 한 경우만)
    const hazardStartZ = jr.z - jr.hazardLen / 2;
    const hazardEndZ = jr.z + jr.hazardLen / 2;
    if (crowdZ > hazardStartZ && crowdZ < hazardEndZ && !state.jumping && state.jumpGrace <= 0 && state.crowdCount > 0) {
      if (now - jr.lastDamageTick > 80) {
        jr.lastDamageTick = now;
        const dmg = Math.max(2, Math.ceil(state.crowdCount * 0.12));
        takeDamage(dmg, new THREE.Vector3(crowdX, 0.5, crowdZ), jr.hazardStyle.particleColor, Math.min(dmg * 2, 20));
      }
    }
  }

  // Collectibles
  for (const col of state.collectibles) {
    if (col.collected) continue;
    if (Math.abs(crowdZ - col.z) < 0.8 && Math.abs(crowdX - col.x) < 0.8) {
      col.collected = true; col.mesh.visible = false; state.coins += 1;
      document.getElementById('coin-display').textContent = state.coins;
      spawnParticles(col.mesh.position.clone(), 0xFFD700, 8);
    }
  }

  // Reinforcement roulette (보스 전 지원군)
  if (!state.reinforceDone && !state.reinforcePhase && state.reinforceZ) {
    const rDz = crowdZ - state.reinforceZ;
    if (rDz < 0.5 && rDz > -0.5) {
      state.reinforcePhase = true;
      state.phase = 'reinforce'; // 이동 멈춤
      state.speed = 0;
    }
  }

  // Boss → 전투 개시
  if (state.boss && !state.boss.defeated) {
    const bz = state.boss.z;
    const dz = crowdZ - bz;
    if (dz > 0 && dz < 1.5) {
      startBossBattle(state.boss);
      return;
    }
  }

  // Finish
  if (crowdZ <= state.finishZ + 1 && state.crowdCount > 0) completeLevel();
}

// ─────────────────────────────────────────────────
// BATTLE SYSTEM (원작처럼 1:1 전투)
// ─────────────────────────────────────────────────
const battleFighters = []; // 전투 중 날아다니는 유닛들

function startBattle(obs) {
  state.phase = 'battle';
  // 적 수: 기본값 + 현재 트루퍼의 20~40% (적이 항상 위협적)
  const baseEnemies = obs.enemies.filter(e => !e.hit).length;
  const scaled = Math.max(baseEnemies, Math.floor(state.crowdCount * (0.2 + Math.random() * 0.2)));
  // 부족한 적 추가 스폰
  while (obs.enemies.filter(e => !e.hit).length < scaled) {
    const enemy = createStickman(0xFF5252);
    const x = (Math.random() - 0.5) * (state.trackWidth - 0.6);
    const zOff = (Math.random() - 0.5) * 1.5;
    enemy.position.set(x, 0, zOff);
    obs.group.add(enemy);
    obs.enemies.push({ mesh: enemy, localX: x, hit: false });
  }
  const enemyAlive = obs.enemies.filter(e => !e.hit);
  state.battle = {
    obs,
    enemyLeft: enemyAlive.length,
    allyLeft: state.crowdCount,
    timer: 0,
    tickInterval: Math.max(0.05, 0.12 - state.crowdCount * 0.0002),
    battleZ: obs.z,
    isBoss: false,
  };
  obs.label.visible = false;
}

function startBossBattle(boss) {
  state.phase = 'battle';
  // 보스 HP: generateLevel에서 미리 결정된 requiredCount 사용 (레인포스 무관)
  const hp = boss.requiredCount;
  state.battle = {
    obs: null,
    enemyLeft: hp,
    allyLeft: state.crowdCount,
    timer: 0,
    tickInterval: Math.max(0.04, 0.08 - state.crowdCount * 0.0002),
    battleZ: boss.z,
    isBoss: true,
    boss: boss,
    bossHp: hp,
  };
  boss.label.visible = false;
}

function updateBossBattleLabel(boss, hpLeft) {
  // 보스 HP 라벨 업데이트
  const canvas = document.createElement('canvas');
  canvas.width = 192; canvas.height = 96;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#CC0000';
  ctx.beginPath(); ctx.roundRect(8, 4, 176, 88, 16); ctx.fill();
  ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(8, 4, 176, 88, 16); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.font = 'bold 48px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(`⚔️ ${hpLeft}`, 96, 50);
  boss.label.material.map = new THREE.CanvasTexture(canvas);
  boss.label.material.map.needsUpdate = true;
  boss.label.visible = true;
}

function updateBattle(dt, time) {
  const b = state.battle;
  if (!b) return;

  b.timer += dt;

  // 매 tickInterval마다 1쌍 제거
  if (b.timer >= b.tickInterval) {
    b.timer -= b.tickInterval;

    if (b.allyLeft > 0 && b.enemyLeft > 0) {
      b.allyLeft--;
      b.enemyLeft--;

      if (b.isBoss) {
        // ── 보스 전투 연출 ──
        b.bossHp = b.enemyLeft;
        const boss = b.boss;

        // 파티클: 보스 위치에서 충돌 이펙트
        const bossWorldZ = boss.z;
        spawnParticles(new THREE.Vector3(crowdGroup.position.x + (Math.random() - 0.5) * 0.8, 1.5, bossWorldZ), 0xFF5252, 5);
        spawnParticles(new THREE.Vector3(crowdGroup.position.x + (Math.random() - 0.5) * 0.8, 1.0, bossWorldZ), 0x2196F3, 4);

        // 보스 흔들림 (피격 반응)
        boss.group.position.x = (Math.random() - 0.5) * 0.3;
        boss.group.rotation.z = (Math.random() - 0.5) * 0.2;

        // 보스 크기가 HP에 따라 줄어듦
        const hpRatio = b.bossHp / boss.requiredCount;
        const bossScale = 0.5 + hpRatio * 0.5; // 1.0 → 0.5
        boss.group.scale.setScalar(bossScale);

        // 보스 HP 라벨 업데이트
        updateBossBattleLabel(boss, b.bossHp);

        // 보스가 빨간색 → 더 어두워짐 (체력 낮을수록)
        boss.group.traverse(c => {
          if (c.isMesh && c.material && c.material.color) {
            const r = 0.3 + hpRatio * 0.5;
            c.material.color.setRGB(r, 0, 0);
          }
        });

      } else {
        // ── 일반 전투 연출 ──
        const alive = b.obs.enemies.filter(e => !e.hit);
        if (alive.length > 0) {
          const en = alive[0];
          en.hit = true;

          const clashX = crowdGroup.position.x;
          spawnParticles(new THREE.Vector3(clashX + (Math.random() - 0.5), 0.8, b.battleZ), 0xFF5252, 4);
          spawnParticles(new THREE.Vector3(clashX + (Math.random() - 0.5), 0.8, b.battleZ), 0x2196F3, 4);

          en.mesh.position.y = 2;
          en.mesh.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
          setTimeout(() => { en.mesh.visible = false; }, 150);
        }
      }

      // 아군 수 업데이트
      state.crowdCount = b.allyLeft;
      updateCrowd();

    } else {
      // 전투 종료
      if (b.allyLeft <= 0) {
        state.crowdCount = 0;
        updateCrowd();
        state.battle = null;
        gameOver();
        return;
      }

      if (b.isBoss) {
        // 보스 격파 연출
        const boss = b.boss;
        boss.defeated = true;
        // 대형 폭발 파티클
        for (let i = 0; i < 50; i++) {
          spawnParticles(new THREE.Vector3(
            boss.group.position.x + (Math.random() - 0.5) * 2,
            Math.random() * 3,
            boss.z
          ), [0xFF5252, 0xFFD700, 0xFF7043, 0xFFFFFF][Math.floor(Math.random() * 4)], 5);
        }
        boss.group.visible = false;
      } else {
        // 아군 승리 — 남은 적 제거
        for (const en of b.obs.enemies) {
          en.hit = true;
          en.mesh.visible = false;
        }
      }

      state.crowdCount = b.allyLeft;
      if (state.crowdCount <= 0) state.crowdCount = 1; state.crowdDisplay = 1; // 보스전 후 최소 1명
      updateCrowd();
      state.battle = null;
      state.phase = 'running';
    }
  }

  // 전투 중 카메라 흔들림
  const shake = (b.allyLeft > 0 && b.enemyLeft > 0) ? Math.sin(time * 30) * (b.isBoss ? 0.06 : 0.03) : 0;
  camera.position.x += shake;

  // 전투 중 애니메이션
  if (b.isBoss && b.boss && !b.boss.defeated) {
    animateStickman(b.boss.group, time, 0.06);
  }
  if (!b.isBoss && b.obs) {
    for (const en of b.obs.enemies) {
      if (!en.hit) animateStickman(en.mesh, time, 0.04);
    }
  }
  // 아군 애니메이션
  for (const child of crowdGroup.children) { if (!child.isSprite) animateStickman(child, time, 0.04); }
}

// ─────────────────────────────────────────────────
// GAME LOOP
// ─────────────────────────────────────────────────
const clock = new THREE.Clock();

function update() {
  const dt = Math.min(clock.getDelta(), 0.05);
  const time = clock.elapsedTime;

  if (state.phase === 'running') {
    state.trackZ -= state.speed;

    // 부드러운 dt 기반 보간 (프레임 독립적)
    const lerpFactor = 1 - Math.pow(0.001, dt); // ~0.15 at 60fps
    const prevX = crowdGroup.position.x;
    crowdGroup.position.x += (state.targetX - crowdGroup.position.x) * lerpFactor;
    const moveVelX = crowdGroup.position.x - prevX;

    // 부드러운 기울기 (이동 시 자연스러운 기울어짐)
    const tiltLerp = 1 - Math.pow(0.01, dt);
    crowdGroup.rotation.z += (-moveVelX * 10 - crowdGroup.rotation.z) * tiltLerp;
    crowdGroup.rotation.x += (-0.06 - crowdGroup.rotation.x) * tiltLerp * 0.5;
    trackGroup.position.z = -state.trackZ;

    for (const child of crowdGroup.children) { if (!child.isSprite) animateStickman(child, time, state.speed); }

    for (const obs of state.obstacles) {
      if (!obs.passed) for (const child of obs.group.children) animateStickman(child, time, 0.03);
    }

    // Grinder animation: 큰 톱니바퀴 회전
    for (const gr of state.grinders) {
      gr.bladeGroup.rotation.y += dt * 4; // y축 회전 (평평한 톱니바퀴)
    }

    for (const col of state.collectibles) {
      if (!col.collected) { col.mesh.rotation.z += dt * 3; col.mesh.position.y = 0.5 + Math.sin(time * 3 + col.z) * 0.1; }
    }

    // 보스 idle 애니메이션 (위협적인 움직임)
    if (state.boss && !state.boss.defeated) {
      // 가까워지면 보이기 (거리 20 이내)
      const bossDist = Math.abs(state.trackZ - state.boss.z);
      state.boss.group.visible = bossDist < 25;

      if (state.boss.group.visible) {
        animateStickman(state.boss.group, time, 0.03);
        const bossScale = 1 + Math.sin(time * 2) * 0.03;
        state.boss.group.scale.setScalar(bossScale);
      }
    }

    // 스윙 해머 애니메이션
    for (const h of state.hammers) {
      const swing = Math.sin(time * 2.5 + h.phase) * 1.2; // 좌우 스윙 각도
      h.armGroup.rotation.z = swing;
    }

    // 화살 함정 애니메이션 + 발사
    for (const at of state.arrows) {
      at.fireTimer += dt;
      if (at.fireTimer >= at.fireInterval) {
        at.fireTimer = 0;
        // 새 화살 생성
        const arrow = at.arrowProto.clone();
        const startX = at.sideX;
        arrow.position.set(startX, 0.6, at.z);
        trackGroup.add(arrow);
        at.arrows.push({ mesh: arrow, x: startX, active: true });
      }
      // 활성 화살 이동
      for (const a of at.arrows) {
        if (!a.active) continue;
        const dir = at.fromSide === 'left' ? 1 : -1;
        a.x += dir * dt * 6;
        a.mesh.position.x = a.x;
        // 트랙 벗어나면 제거
        if (Math.abs(a.x) > state.trackWidth / 2 + 1) {
          a.active = false;
          trackGroup.remove(a.mesh);
        }
      }
      // 비활성 화살 정리
      at.arrows = at.arrows.filter(a => a.active);
    }

    // 폭탄 심지 반짝임
    for (const b of state.bombs) {
      if (!b.exploded) {
        b.spark.material.color.setHex(Math.sin(time * 10) > 0 ? 0xFF6E40 : 0xFFD740);
        b.spark.scale.setScalar(0.8 + Math.sin(time * 15) * 0.4);
      }
    }

    // 레이저 터렛: 크라우드가 위험 구역 z범위 안에 있으면 빔 발사
    for (const l of state.lasers) {
      const dz = Math.abs(state.trackZ - l.z);
      const inZone = dz < l.dangerLen / 2 + 0.5;

      if (inZone && state.crowdCount > 0 && state.phase === 'running') {
        // 빔 활성화 (고정 위치: 터렛→위험구역)
        l.beam.visible = true;
        l.beamGlow.visible = true;
        l.beam.material.opacity = 0.5 + Math.sin(time * 15) * 0.3;
        l.beamGlow.material.opacity = 0.2 + Math.sin(time * 10) * 0.1;
        // 렌즈 깜빡임
        l.lens.material.color.setHex(Math.sin(time * 20) > 0 ? 0xFF0000 : 0xFF6600);
        // 위험 구역 바닥 깜빡임 (강조)
        l.dangerZone.material.opacity = 0.15 + Math.sin(time * 8) * 0.1;
        for (const b of l.borderMeshes) b.material.opacity = 0.5 + Math.sin(time * 10) * 0.3;

        l.firing = true;
      } else {
        // 구역 밖 — 빔 숨김
        l.beam.visible = false;
        l.beamGlow.visible = false;
        l.beam.material.opacity = 0;
        l.beamGlow.material.opacity = 0;
        l.lens.material.color.setHex(0xFF0000);
        l.dangerZone.material.opacity = 0.15;
        for (const b of l.borderMeshes) b.material.opacity = 0.5;
        l.firing = false;
      }
    }

    // 점프 물리 업데이트
    if (state.jumping) {
      state.jumpY += state.jumpVelY;
      state.jumpVelY -= 0.005; // 낮은 중력 → 더 멀리 비행
      if (state.jumpY <= 0) {
        state.jumpY = 0;
        state.jumpVelY = 0;
        state.jumping = false;
        state.jumpGrace = 0.3; // 착지 후 0.3초 무적
      }
      crowdGroup.position.y = state.jumpY;
    } else {
      if (state.jumpGrace > 0) state.jumpGrace -= dt;
      crowdGroup.position.y = 0;
    }

    // 위험지대 표면 애니메이션
    for (const jr of state.jumpRamps) {
      if (jr.hazardStyle.surfaceDetail === 'lava' || jr.hazardStyle.surfaceDetail === 'electric') {
        // 위험지대 깜빡임
        jr.hazardBox.material.color.setHex(
          Math.sin(time * 6) > 0 ? jr.hazardStyle.color : jr.hazardStyle.emissive
        );
      }
    }

    const progress = Math.min(Math.abs(state.trackZ) / Math.abs(state.finishZ), 1) * 100;
    document.getElementById('progress-bar-fill').style.width = progress + '%';

    checkCollisions();

    // 자연감소: 100명 이상이면 크라우드가 트랙보다 넓어서 가장자리 유닛 탈락
    if (state.crowdCount > 100 && state.phase === 'running') {
      const crowdHW = getCrowdHalfWidth();
      const trackHW = state.trackWidth / 2;
      if (crowdHW > trackHW * 0.85) {
        // 넘치는 비율에 따라 자연감소 (0.5초마다)
        if (!state._attritionTimer) state._attritionTimer = 0;
        state._attritionTimer += dt;
        if (state._attritionTimer > 0.5) {
          state._attritionTimer = 0;
          const overflow = (crowdHW - trackHW * 0.85) / trackHW;
          const loss = Math.max(1, Math.ceil(state.crowdCount * overflow * 0.05));
          state.crowdCount = Math.max(80, state.crowdCount - loss);
          state.crowdDisplay = state.crowdCount;
          // 가장자리에서 떨어지는 연출
          for (let i = 0; i < Math.min(loss, 3); i++) {
            const side = Math.random() > 0.5 ? 1 : -1;
            spawnFallingUnit(crowdGroup.position.x + side * trackHW, 0, side);
          }
          updateCrowd();
        }
      }
    }

    // 거인 모드 타이머 + 시각 효과
    if (state._giantTimer > 0) {
      state._giantTimer -= dt;
      // 크라우드 살짝 커지고 금색 깜빡임
      const pulse = 1.15 + Math.sin(time * 10) * 0.05;
      crowdGroup.scale.setScalar(pulse);
      // 무적 파티클
      if (Math.random() < 0.3) {
        spawnParticles(new THREE.Vector3(
          crowdGroup.position.x + (Math.random() - 0.5),
          0.5 + Math.random(),
          0
        ), 0xFFD700, 2);
      }
      if (state._giantTimer <= 0) {
        state._giantTimer = 0;
        crowdGroup.scale.setScalar(1);
      }
    }

    // 크라우드 인원 애니메이션 (crowdDisplay → crowdCount로 서서히 이동)
    if (Math.round(state.crowdDisplay) !== state.crowdCount) {
      const diff = state.crowdCount - state.crowdDisplay;
      // 증가: 프레임당 최대 3명씩 팍팍 추가 (곱하기 시 빠르게 늘어나는 연출)
      // 감소: 즉시 반영 (데미지는 바로 보여야 함)
      if (diff > 0) {
        const step = Math.max(1, Math.ceil(Math.abs(diff) * 0.15));
        state.crowdDisplay = Math.min(state.crowdDisplay + step, state.crowdCount);
      } else {
        state.crowdDisplay = state.crowdCount; // 감소는 즉시
      }
      updateCrowd();
    }

    // 부드러운 카메라 추적
    const camLerp = 1 - Math.pow(0.005, dt);
    const camTargetX = crowdGroup.position.x * 0.4;
    camera.position.x += (camTargetX - camera.position.x) * camLerp;
    camera.lookAt(crowdGroup.position.x * 0.15, 0, -4);

    // 매 프레임 크라우드 폭 변화에 맞춰 targetX 재클램프
    clampTargetX();
  }

  // 전투 페이즈
  if (state.phase === 'battle') {
    updateBattle(dt, time);
    trackGroup.position.z = -state.trackZ;
    camera.lookAt(crowdGroup.position.x * 0.15, 0, -4);
  }

  updateParticles(dt);
  updateSplashMarks(dt);
  updateFallingUnits(dt);
  // 룰렛 지원군 업데이트 (reinforce 페이즈에서 돌아감)
  updateReinforcementRoulette(dt, time);

  renderer.render(scene, camera);
  requestAnimationFrame(update);
}

// ─────────────────────────────────────────────────
// RESIZE
// ─────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─────────────────────────────────────────────────
// ─────────────────────────────────────────────────
// AUDIO SYSTEM
// ─────────────────────────────────────────────────
const audio = {
  bgm: null,
  bgmOn: true,
  bgmVol: 0.5,
  sfxOn: true,
  sfxVol: 0.7,
};

// BGM 트랙 목록
const BGM_TRACKS = [
  '/Road Gates Ahead.mp3',
  '/Verse8 Gates.mp3',
  '/Verse8 Victory March v2.mp3',
  '/Verse8 Victory March.mp3',
];
let bgmTrackIdx = 0;

function initBGM() {
  if (audio.bgm) return;
  // 랜덤 시작
  bgmTrackIdx = Math.floor(Math.random() * BGM_TRACKS.length);
  playBGMTrack(bgmTrackIdx);
}

function playBGMTrack(idx) {
  if (audio.bgm) { audio.bgm.pause(); audio.bgm = null; }
  audio.bgm = new Audio(BGM_TRACKS[idx]);
  audio.bgm.volume = audio.bgmVol;
  audio.bgm.play().catch(() => {});
  // 곡 끝나면 다음 곡 재생
  audio.bgm.addEventListener('ended', () => {
    if (!audio.bgmOn) return;
    bgmTrackIdx = (bgmTrackIdx + 1) % BGM_TRACKS.length;
    playBGMTrack(bgmTrackIdx);
  });
}

// 설정 패널 토글
document.getElementById('settings-btn').addEventListener('click', () => {
  document.getElementById('settings-panel').classList.toggle('open');
});
document.getElementById('settings-close').addEventListener('click', () => {
  document.getElementById('settings-panel').classList.remove('open');
});

// BGM 볼륨
document.getElementById('bgm-vol').addEventListener('input', (e) => {
  audio.bgmVol = e.target.value / 100;
  if (audio.bgm) audio.bgm.volume = audio.bgmVol;
});

// BGM 토글
document.getElementById('bgm-toggle').addEventListener('click', () => {
  audio.bgmOn = !audio.bgmOn;
  const btn = document.getElementById('bgm-toggle');
  btn.textContent = audio.bgmOn ? 'ON' : 'OFF';
  btn.classList.toggle('off', !audio.bgmOn);
  if (audio.bgm) {
    if (audio.bgmOn) { audio.bgm.play().catch(() => {}); }
    else { audio.bgm.pause(); }
  }
});

// SFX 볼륨
document.getElementById('sfx-vol').addEventListener('input', (e) => {
  audio.sfxVol = e.target.value / 100;
});

// SFX 토글
document.getElementById('sfx-toggle').addEventListener('click', () => {
  audio.sfxOn = !audio.sfxOn;
  const btn = document.getElementById('sfx-toggle');
  btn.textContent = audio.sfxOn ? 'ON' : 'OFF';
  btn.classList.toggle('off', !audio.sfxOn);
});

// 게임 시작 시 BGM 재생 (유저 인터랙션 후에만 자동재생 가능)
const origStartGame = startGame;
startGame = function() {
  initBGM();
  origStartGame();
};

// ─────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────
generateLevel(1);
updateCrowd();
update();
