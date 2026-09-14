import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { GameState, Target } from "@/lib/cromb-coo-coo";

type Point = [number, number, number];
type SceneState = { state: GameState; active: Target | null; reducedMotion: boolean; paused: boolean; disabled: boolean };
type Projection = Record<Target, { x: number; y: number; visible: boolean }>;
type Callbacks = {
  onTarget: (target: Target) => void;
  onHover: (target: Target | null) => void;
  onProject: (points: Projection) => void;
  onFailure: () => void;
};
export type SceneControl = "left" | "right" | "in" | "out" | "reset";
export type Diorama = { update: (state: SceneState) => void; control: (action: SceneControl) => void; dispose: () => void };

const PALETTE = {
  ink: 0x343e36, paper: 0xf3e7c9, wood: 0xcbb68a, bark: 0x7c8064,
  pine: 0x3f6155, moss: 0x85916a, leaf: 0xa5ac75, gold: 0xd5b66c,
  rock: 0x75877e, cream: 0xf4e7c8, dark: 0x41473d, soil: 0x938967
};

/** The entire scene is modeled geometry; no scene image is used in the renderer. */
export function createDiorama(host: HTMLElement, initial: SceneState, callbacks: Callbacks): Diorama {
  let state = initial;
  let disposed = false;
  let failed = false;
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let dirty = true;
  let visible = true;
  let yaw = .13;
  let tilt = .53;
  let zoom = 1;
  let bridgeGrowth = initial.state.bridgeOpen ? 1 : 0;
  let crossing = initial.state.complete ? 1 : 0;
  let hover: Target | null = null;
  let pointer: { id: number; x: number; y: number; lastX: number; lastY: number; moved: boolean } | null = null;
  let seed = 72641;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const v = (p: Point) => new THREE.Vector3(...p);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe6e5cf);
  scene.fog = new THREE.Fog(0xe6e5cf, 28, 78);
  const camera = new THREE.OrthographicCamera(-12, 12, 7, -7, .1, 140);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  canvas.style.touchAction = "pan-y";
  host.appendChild(canvas);

  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const ownGeometry = <T extends THREE.BufferGeometry>(geometry: T): T => { geometries.add(geometry); return geometry; };
  const ownMaterial = <T extends THREE.Material>(material: T): T => { materials.add(material); return material; };
  const sphere = ownGeometry(new THREE.SphereGeometry(1, 16, 12));
  const pebble = ownGeometry(new THREE.IcosahedronGeometry(1, 1));
  const leafShape = ownGeometry(new THREE.IcosahedronGeometry(1, 0));
  const inkMaterial = ownMaterial(new THREE.MeshBasicMaterial({ color: PALETTE.ink, side: THREE.BackSide }));

  const grainCanvas = document.createElement("canvas");
  grainCanvas.width = 256; grainCanvas.height = 512;
  const grain = grainCanvas.getContext("2d");
  let grainTexture: THREE.CanvasTexture | undefined;
  if (grain) {
    grain.fillStyle = "#f8f2de"; grain.fillRect(0, 0, 256, 512);
    for (let i = 0; i < 65; i++) {
      const x = i * 4 + random() * 4;
      grain.beginPath(); grain.strokeStyle = `rgba(75,68,48,${.08 + random() * .14})`; grain.lineWidth = .6 + random();
      for (let y = 0; y <= 512; y += 8) {
        const bend = Math.sin(y * .027 + i * .31) * 3 + Math.sin(y * .008 + i) * 9;
        if (!y) grain.moveTo(x + bend, y); else grain.lineTo(x + bend, y);
      }
      grain.stroke();
    }
    for (let i = 0; i < 2600; i++) {
      grain.fillStyle = `rgba(85,72,52,${random() * .1})`; grain.fillRect(random() * 256, random() * 512, 1, 1);
    }
    grainTexture = new THREE.CanvasTexture(grainCanvas);
    grainTexture.colorSpace = THREE.SRGBColorSpace;
    grainTexture.wrapS = grainTexture.wrapT = THREE.RepeatWrapping;
    textures.add(grainTexture);
  }
  function material(color: number, wood = false, extra: THREE.MeshStandardMaterialParameters = {}) {
    return ownMaterial(new THREE.MeshStandardMaterial({ color, roughness: 1, metalness: 0, ...(wood && grainTexture ? { map: grainTexture } : {}), ...extra }));
  }
  const mat = {
    wood: material(PALETTE.wood, true), lightWood: material(0xe4d3a7, true), bark: material(PALETTE.bark, true),
    cream: material(PALETTE.cream), ink: material(PALETTE.ink), dark: material(PALETTE.dark),
    moss: material(PALETTE.moss), pine: material(PALETTE.pine), gold: material(PALETTE.gold),
    leaf: material(PALETTE.leaf), soil: material(PALETTE.soil), stone: material(PALETTE.rock),
    shoe: material(0x605845), hair: material(0x655644, true), petal: material(0xf5e6b5),
    orb: material(0xdfb96a, false, { emissive: 0x9b7839, emissiveIntensity: .4 }),
    cloud: material(0xf5eddb, false, { transparent: true, opacity: .52, depthWrite: false, flatShading: true })
  };
  const ambient = new THREE.HemisphereLight(0xfff2cf, 0x718c85, 1.75); scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffe8bb, 2.6); sun.position.set(-8, 16, 10);
  sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 12, bottom: -12, near: 1, far: 55 });
  sun.shadow.normalBias = .045; sun.shadow.bias = -.00015; scene.add(sun);
  const rim = new THREE.DirectionalLight(0xc4d8d0, 1.2); rim.position.set(4, 6, -9); scene.add(rim);

  function group(parent: THREE.Object3D, at: Point = [0, 0, 0]) {
    const result = new THREE.Group(); result.position.set(...at); parent.add(result); return result;
  }
  function mesh(geometry: THREE.BufferGeometry, surface: THREE.Material, parent: THREE.Object3D, at: Point = [0, 0, 0], scale: Point = [1, 1, 1], outline = false) {
    const result = new THREE.Mesh(geometry, surface);
    result.position.set(...at); result.scale.set(...scale); result.castShadow = true; result.receiveShadow = true; parent.add(result);
    if (outline) { const line = new THREE.Mesh(geometry, inkMaterial); line.scale.setScalar(1.028); result.add(line); }
    return result;
  }
  function ball(parent: THREE.Object3D, at: Point, scale: Point, surface = mat.wood, outline = false) { return mesh(sphere, surface, parent, at, scale, outline); }
  function tube(parent: THREE.Object3D, points: Point[], radius: number, surface = mat.wood, segments = 22) {
    const curve = new THREE.CatmullRomCurve3(points.map(v));
    const geometry = ownGeometry(new THREE.TubeGeometry(curve, segments, radius, 6, false));
    return mesh(geometry, surface, parent);
  }
  function cone(parent: THREE.Object3D, start: Point, end: Point, bottom: number, top: number, surface = mat.wood, sides = 9) {
    const a = v(start), b = v(end), delta = b.clone().sub(a);
    const result = mesh(ownGeometry(new THREE.CylinderGeometry(top, bottom, delta.length(), sides)), surface, parent);
    result.position.copy(a.add(b).multiplyScalar(.5)); result.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize()); return result;
  }
  function ring(parent: THREE.Object3D, at: Point, radius: number, thickness: number, surface = mat.ink) {
    return mesh(ownGeometry(new THREE.TorusGeometry(radius, thickness, 5, 32)), surface, parent, at);
  }
  function eye(parent: THREE.Object3D, at: Point, size: number, sleepy = false) {
    ball(parent, at, [size, size * .88, size * .48], mat.cream, true);
    ball(parent, [at[0] + size * .08, at[1] - size * .08, at[2] + size * .47], [size * .39, size * .42, size * .13], mat.ink);
    ball(parent, [at[0] + size * .18, at[1] + size * .05, at[2] + size * .58], [size * .08, size * .08, size * .05], mat.cream);
    if (sleepy) tube(parent, [[at[0] - size, at[1] + size * .26, at[2]], [at[0], at[1] + size * .45, at[2] + size * .49], [at[0] + size, at[1] + size * .06, at[2]]], size * .16, mat.wood, 12);
  }
  function foliage(parent: THREE.Object3D, at: Point, spread: Point, count: number, gold = false) {
    const leaves = new THREE.InstancedMesh(leafShape, mat.leaf, count);
    leaves.castShadow = true; leaves.receiveShadow = true;
    const object = new THREE.Object3D(); const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const angle = random() * Math.PI * 2, radius = Math.sqrt(random());
      object.position.set(at[0] + Math.cos(angle) * spread[0] * radius, at[1] + (random() - .5) * spread[1], at[2] + Math.sin(angle) * spread[2] * radius);
      object.rotation.set(random() * 1.4, random() * 6.28, random() * 1.5);
      const size = .15 + random() * .2; object.scale.set(size * 1.8, size * .42, size);
      object.updateMatrix(); leaves.setMatrixAt(i, object.matrix);
      color.setHex((gold ? [0xd0b570, 0xbca35e, 0xa0a371, 0xdfc482] : [0x426252, 0x657d55, 0x899661, 0xb2ad6f, 0xc8b875])[Math.floor(random() * (gold ? 4 : 5))]);
      leaves.setColorAt(i, color);
    }
    parent.add(leaves); return leaves;
  }
  const pickables: THREE.Object3D[] = [];
  const anchors = {} as Record<Target, THREE.Object3D>;
  function target(id: Target, object: THREE.Object3D, at: Point) {
    object.userData.target = id; pickables.push(object); anchors[id] = group(object, at);
  }
  function batchScenery(parent: THREE.Object3D) {
    parent.updateWorldMatrix(true, true);
    const inverse = parent.matrixWorld.clone().invert();
    const batches = new Map<THREE.Material, THREE.Mesh[]>();
    parent.traverse(object => {
      if (!(object instanceof THREE.Mesh) || object instanceof THREE.InstancedMesh || Array.isArray(object.material)) return;
      const entries = batches.get(object.material) ?? []; entries.push(object); batches.set(object.material, entries);
    });
    batches.forEach((objects, surface) => {
      if (objects.length < 2) return;
      const pieces = objects.map(object => object.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, object.matrixWorld)));
      const combined = mergeGeometries(pieces, false);
      pieces.forEach(piece => piece.dispose());
      if (!combined) return;
      objects.forEach(object => object.removeFromParent());
      mesh(ownGeometry(combined), surface, parent);
    });
  }

  // Radially layered cliffs make the islands solid from every permitted angle.
  function island(parent: THREE.Object3D, at: Point, radius: number, depth: number, main = false) {
    const result = group(parent, at);
    const vertices: number[] = [], colors: number[] = [];
    const rings: THREE.Vector3[][] = [];
    const sides = main ? 28 : 16;
    const levels = [{ r: 1, y: 0 }, { r: 1.04, y: -.45 }, { r: .76, y: -depth * .44 }, { r: .36, y: -depth * .87 }, { r: .1, y: -depth }];
    levels.forEach((level, layer) => {
      rings.push(Array.from({ length: sides }, (_, i) => {
        const angle = i / sides * Math.PI * 2;
        const irregular = 1 + Math.sin(i * 2.7) * .07 + (layer ? random() * .09 : 0);
        return new THREE.Vector3(Math.cos(angle) * radius * level.r * irregular, level.y + (layer ? random() * .32 : 0), Math.sin(angle) * radius * .77 * level.r * irregular);
      }));
    });
    const shade = new THREE.Color();
    const pushFace = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) => {
      const tint = random(); shade.setHex(tint > .74 ? 0xa6a58b : tint > .36 ? 0x7f8f83 : 0x647b73); shade.multiplyScalar(.87 + random() * .25);
      [a, b, c].forEach(point => { vertices.push(point.x, point.y, point.z); colors.push(shade.r, shade.g, shade.b); });
    };
    for (let layer = 0; layer < rings.length - 1; layer++) for (let i = 0; i < sides; i++) {
      const n = (i + 1) % sides;
      pushFace(rings[layer][i], rings[layer + 1][i], rings[layer][n]);
      pushFace(rings[layer][n], rings[layer + 1][i], rings[layer + 1][n]);
    }
    for (let i = 0; i < sides; i++) pushFace(new THREE.Vector3(0, 0, 0), rings[0][(i + 1) % sides], rings[0][i]);
    const cliff = ownGeometry(new THREE.BufferGeometry()); cliff.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3)); cliff.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3)); cliff.computeVertexNormals();
    mesh(cliff, material(0xffffff, false, { vertexColors: true, flatShading: true }), result);
    const top = ball(result, [0, -.02, 0], [radius * .985, .12, radius * .755], mat.moss);
    top.castShadow = false;
    const edgeLines = new THREE.LineSegments(ownGeometry(new THREE.EdgesGeometry(cliff, 25)), ownMaterial(new THREE.LineBasicMaterial({ color: 0x405f55, transparent: true, opacity: .18 })));
    result.add(edgeLines);
    for (let i = 0; i < (main ? 13 : 5); i++) {
      const angle = i / (main ? 13 : 5) * Math.PI * 2 + .1;
      const x = Math.cos(angle) * radius * .94, z = Math.sin(angle) * radius * .74;
      tube(result, [[x * .88, .04, z * .88], [x, -.4, z], [x * .84, -depth * .4, z * .83], [x * .64 + .1, -depth * (.6 + random() * .45), z * .55]], main ? .055 + random() * .04 : .03, mat.bark, 14);
    }
    return result;
  }
  const nearIsland = island(scene, [-3.8, 0, 1], 4.2, 4.7, true);
  const farIsland = island(scene, [5, .15, .25], 2.7, 4.3, true);

  function pine(parent: THREE.Object3D, at: Point, size: number) {
    const tree = group(parent, at);
    cone(tree, [0, 0, 0], [.03, size * 1.2, 0], size * .065, size * .025, mat.bark, 5);
    for (let i = 0; i < 3; i++) {
      const height = size * (.3 + i * .28);
      cone(tree, [0, height, 0], [0, height + size * .65, 0], size * (.35 - i * .075), 0, i % 2 ? mat.moss : mat.pine, 7);
    }
    return tree;
  }
  for (let i = 0; i < 14; i++) {
    const angle = Math.PI + i / 13 * Math.PI;
    pine(nearIsland, [Math.cos(angle) * 3.55, .05, Math.sin(angle) * 2.45 - .1], .38 + random() * .55);
  }
  for (let i = 0; i < 8; i++) {
    const angle = Math.PI + i / 7 * Math.PI;
    pine(farIsland, [Math.cos(angle) * 2.1, .07, Math.sin(angle) * 1.5], .45 + random() * .8);
  }

  // Scattered stones, grass and tiny flowers are instanced to keep mobile draw calls low.
  function meadow(parent: THREE.Object3D, radius: number, count: number) {
    const stones = new THREE.InstancedMesh(pebble, mat.wood, count);
    const grasses = new THREE.InstancedMesh(leafShape, mat.leaf, count * 3);
    const object = new THREE.Object3D(); const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const a = random() * Math.PI * 2, r = Math.sqrt(random()) * radius;
      const x = Math.cos(a) * r, z = Math.sin(a) * r * .74;
      object.position.set(x, .1, z); object.rotation.set(0, random() * 6, 0);
      object.scale.set(.05 + random() * .16, .04 + random() * .06, .06 + random() * .1); object.updateMatrix(); stones.setMatrixAt(i, object.matrix);
      color.setHex(i % 3 ? 0xbab69b : 0xe4d5ac); stones.setColorAt(i, color);
      for (let j = 0; j < 3; j++) {
        object.position.set(x + .2 + random() * .15, .16, z + random() * .15);
        object.rotation.set(.2, random() * 6, (random() - .5) * .7); object.scale.set(.035, .13 + random() * .1, .03); object.updateMatrix(); grasses.setMatrixAt(i * 3 + j, object.matrix);
      }
    }
    stones.receiveShadow = true; grasses.receiveShadow = true; parent.add(stones, grasses);
  }
  meadow(nearIsland, 3.9, 100); meadow(farIsland, 2.4, 55);
  batchScenery(nearIsland); batchScenery(farIsland);

  const archipelago = group(scene);
  const distantIslands: { object: THREE.Group; y: number; phase: number }[] = [];
  [[-12, 3.5, -17, 2], [-6, 5.2, -22, 2.6], [1, 4.5, -14, 2.1], [8, 5.4, -22, 2.8], [14, 2, -14, 1.8], [-16, -.5, -8, 1.5], [17, -1, -5, 2.1]].forEach(([x, y, z, size], i) => {
    const distant = island(archipelago, [x, y, z], size, size * 1.7);
    for (let j = 0; j < 4; j++) pine(distant, [(random() - .5) * size, .1, (random() - .5) * size * .5], size * (.25 + random() * .35));
    if (i === 2 || i === 3) {
      cone(distant, [0, 0, 0], [.2, 2.2, 0], .13, .06, mat.bark);
      foliage(distant, [.2, 2.2, 0], [1.2, .55, .8], 42, true);
    }
    batchScenery(distant);
    distantIslands.push({ object: distant, y, phase: i });
  });
  // A generous sphere is an actual glowing sun hanging beyond the valley.
  mesh(sphere, ownMaterial(new THREE.MeshBasicMaterial({ color: 0xffefc6 })), scene, [-17, 10, -38], [3.5, 3.5, 3.5]);
  const distantTarget = group(archipelago, [1, 5.4, -14]);
  target("islands", archipelago, [1, 6.7, -14]);
  // Invisible hit volume surrounds the little central island, never the foreground.
  mesh(sphere, ownMaterial(new THREE.MeshBasicMaterial({ visible: false })), distantTarget, [0, 0, 0], [2.2, 2.8, 2.2]);

  const clouds: { object: THREE.Group; x: number; speed: number; phase: number }[] = [];
  for (let i = 0; i < 14; i++) {
    const x = (random() - .5) * 42, y = -3 - random() * 7, z = -8 - random() * 24;
    const cloud = group(scene, [x, y, z]); const size = 1.3 + random() * 2;
    for (let j = 0; j < 4; j++) {
      const puff = mesh(pebble, mat.cloud, cloud, [(j - 1.5) * size * .65, Math.sin(j) * .2, j % 2 * .5], [size, size * .35, size * .7]);
      puff.castShadow = false; puff.receiveShadow = false;
    }
    clouds.push({ object: cloud, x, speed: .035 + random() * .02, phase: random() * 6 });
  }

  // The Woodgrain Bird grows directly out of the terrace, like the original drawing.
  const bird = group(scene, [-5.25, .07, -.05]); bird.rotation.y = .12;
  cone(bird, [0, 0, 0], [-.08, 4.45, -.1], 1, .62, mat.wood, 13);
  ball(bird, [0, 2.92, .1], [1.03, 1.3, .76], mat.wood, true);
  for (let i = 0; i < 7; i++) {
    const a = i / 7 * Math.PI * 2;
    tube(bird, [[Math.cos(a) * .25, 1.2, Math.sin(a) * .25], [Math.cos(a) * .7, .3, Math.sin(a) * .7], [Math.cos(a) * 1.65, .07, Math.sin(a) * 1.35]], .15 - (i % 3) * .018, mat.wood);
  }
  // A tapered curved beak, built from rings along a spatial curve.
  const beakCurve = new THREE.CatmullRomCurve3([[0, 3, .6], [.02, 2.93, 1.4], [.1, 2.74, 1.83], [.16, 2.14, 1.86]].map(p => new THREE.Vector3(...p)));
  const beakGeometry = ownGeometry(new THREE.TubeGeometry(beakCurve, 28, 1, 12, false));
  const beakPositions = beakGeometry.attributes.position;
  for (let row = 0; row <= 28; row++) {
    const t = row / 28, center = beakCurve.getPointAt(t), radius = .58 * Math.pow(1 - t, .72) + .012;
    for (let col = 0; col <= 12; col++) { const index = row * 13 + col; beakPositions.setXYZ(index, center.x + (beakPositions.getX(index) - center.x) * radius, center.y + (beakPositions.getY(index) - center.y) * radius * .62, center.z + (beakPositions.getZ(index) - center.z) * radius); }
  }
  beakGeometry.computeVertexNormals(); mesh(beakGeometry, mat.wood, bird, [0, 0, 0], [1, 1, 1], true);
  eye(bird, [-.43, 3.55, .7], .31, true); eye(bird, [.39, 3.56, .71], .31, true);
  tube(bird, [[-.82, 3.84, .64], [-.49, 3.98, .76], [-.15, 3.88, .72]], .065, mat.bark);
  tube(bird, [[.08, 3.88, .72], [.4, 3.99, .76], [.72, 3.87, .63]], .065, mat.bark);
  tube(bird, [[-.48, 2.79, 1.04], [0, 2.63, 1.48], [.28, 2.6, 1.65]], .018, mat.bark);
  for (let i = 0; i < 12; i++) {
    const x = -.78 + i * .137;
    tube(bird, [[x, .2, .65 + .13 * Math.cos(i)], [x + .08, 1.25, .68], [x - .05, 2, .76], [x + .04, 2.5, .68]], .009, mat.bark, 17);
  }
  const crown = group(bird, [0, 4.1, -.12]);
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2, x = Math.cos(a) * 1.65, z = Math.sin(a) * 1.1;
    tube(crown, [[0, 0, 0], [x * .5, 1.1, z * .5], [x, 1.55, z]], .12, mat.bark);
    tube(crown, [[x * .45, .9, z * .45], [x * 1.1, 1.25, z * .65], [x * 1.25, 1.65, z * .8]], .055, mat.bark);
    foliage(crown, [x, 1.55, z], [1.05, .65, .78], 75, i % 3 === 0);
    if (i % 2 === 0) tube(crown, [[x, 1.4, z], [x + .15, .9, z + .1], [x + .1, .25, z + .15]], .021, mat.bark);
  }
  batchScenery(crown);
  target("bird", bird, [0, 4.05, 1]);

  // A trumpet is a flared, hollow neck, with a rim and a dark interior.
  const turtle = group(scene, [-5, .12, 2.85]); turtle.rotation.y = -.2;
  ball(turtle, [-.18, .52, 0], [.94, .46, .65], mat.lightWood, true);
  ball(turtle, [-.3, .81, -.05], [.84, .56, .62], mat.moss, true);
  for (let i = 0; i < 5; i++) {
    const angle = -.95 + i * .47;
    const points: Point[] = [];
    for (let j = 0; j <= 14; j++) {
      const a = j / 14 * Math.PI;
      points.push([-.3 + Math.cos(a) * .82, .83 + Math.sin(a) * Math.cos(angle) * .55, -.05 + Math.sin(angle) * .6]);
    }
    tube(turtle, points, .018, mat.ink, 18);
  }
  for (let i = 0; i < 3; i++) {
    const x = -.79 + i * .49; const r = Math.sqrt(Math.max(.05, 1 - ((x + .3) / .84) ** 2));
    const points: Point[] = Array.from({ length: 15 }, (_, j) => { const a = j / 14 * Math.PI; return [x, .83 + Math.sin(a) * .56 * r, -.05 + Math.cos(a) * .62 * r]; });
    tube(turtle, points, .017, mat.ink, 18);
  }
  [-.72, .4].forEach(x => [-.4, .43].forEach(z => { cone(turtle, [x, .53, z], [x + .1, .13, z + .08], .15, .18, mat.lightWood); ball(turtle, [x + .15, .09, z + .17], [.24, .1, .2], mat.lightWood, true); }));
  const trumpet = group(turtle, [.61, .47, .12]);
  const trumpetProfile = [[.24, 0], [.25, .35], [.22, .78], [.26, 1.04], [.43, 1.3], [.58, 1.39], [.53, 1.42], [.38, 1.31], [.2, 1.02], [.16, .82]].map(([x, y]) => new THREE.Vector2(x, y));
  mesh(ownGeometry(new THREE.LatheGeometry(trumpetProfile, 28)), mat.lightWood, trumpet);
  const rimRing = ring(trumpet, [0, 1.4, 0], .555, .035, mat.wood); rimRing.rotation.x = Math.PI / 2;
  const inner = mesh(ownGeometry(new THREE.CircleGeometry(.17, 24)), mat.dark, trumpet, [0, .83, 0]); inner.rotation.x = -Math.PI / 2;
  eye(trumpet, [-.105, .63, .225], .11, true); eye(trumpet, [.12, .64, .22], .11, true);
  cone(trumpet, [-.19, .24, .23], [0, .24, .26], .105, .025, mat.shoe, 3);
  cone(trumpet, [.19, .24, .23], [0, .24, .26], .105, .025, mat.shoe, 3);
  const floweringTail = group(turtle, [-1, .47, -.05]);
  function flower(parent: THREE.Object3D, at: Point, size: number) {
    const head = group(parent, at); head.rotation.y = .18;
    for (let j = 0; j < 7; j++) { const a = j / 7 * Math.PI * 2; const petal = ball(head, [Math.sin(a) * size * .72, Math.cos(a) * size * .72, 0], [size * .3, size * .58, size * .14], mat.petal); petal.rotation.z = -a; }
    ball(head, [0, 0, size * .06], [size * .34, size * .34, size * .21], mat.gold); return head;
  }
  [[-.7, .65, 0], [-.95, .25, .14], [-.4, .96, -.08]].forEach(([x, y, z]) => {
    tube(floweringTail, [[0, 0, 0], [x * .6, y * .5, z], [x, y, z]], .027, mat.pine);
    flower(floweringTail, [x, y, z], .19);
  });
  target("turtle", turtle, [.54, 2.2, .1]);

  // The visitor keeps the nervous posture and shirt from Michael's drawing.
  const visitor = group(scene, [-2.15, .15, 2]); visitor.rotation.y = .15;
  const visitorBody = group(visitor);
  const leftLeg = group(visitorBody, [-.16, .87, 0]), rightLeg = group(visitorBody, [.16, .87, 0]);
  [leftLeg, rightLeg].forEach(leg => {
    cone(leg, [0, 0, 0], [.025, -.73, .06], .1, .125, mat.dark, 10);
    ball(leg, [.035, -.77, .16], [.15, .1, .27], mat.shoe, true);
  });
  const shirt = mesh(ownGeometry(new THREE.CylinderGeometry(.28, .32, .81, 10)), mat.cream, visitorBody, [0, 1.26, 0], [1, 1, .74], true);
  shirt.rotation.z = -.035;
  cone(visitorBody, [0, 1.63, 0], [0, 1.85, .015], .115, .11, mat.lightWood);
  for (let i = 0; i < 4; i++) ball(visitorBody, [.015, 1 + i * .15, .239], [.024, .024, .015], mat.ink);
  tube(visitorBody, [[-.13, 1.65, .16], [0, 1.5, .24], [.14, 1.66, .15]], .024, mat.lightWood, 12);
  const visitorHead = group(visitorBody, [0, 2.03, .04]);
  ball(visitorHead, [0, 0, 0], [.34, .48, .29], mat.lightWood, true);
  eye(visitorHead, [-.12, .07, .25], .073); eye(visitorHead, [.12, .07, .25], .073);
  cone(visitorHead, [0, .02, .28], [.012, -.095, .37], .043, .014, mat.wood, 6);
  tube(visitorHead, [[-.22, .21, .2], [-.13, .25, .265], [-.04, .21, .26]], .017, mat.hair, 10);
  tube(visitorHead, [[.05, .2, .26], [.15, .18, .26], [.23, .15, .2]], .017, mat.hair, 10);
  tube(visitorHead, [[-.11, -.25, .23], [0, -.18, .293], [.12, -.25, .22]], .025, mat.dark, 12);
  for (let i = 0; i < 19; i++) {
    const a = i / 19 * Math.PI * 2;
    const x = Math.cos(a) * .27, z = Math.sin(a) * .22;
    cone(visitorHead, [x, .3, z], [x * 1.45 + .03, .62 + random() * .19, z * 1.25 - .03], .085, .005, mat.hair, 5);
  }
  const visitorArms: THREE.Group[] = [];
  [-1, 1].forEach(side => {
    const arm = group(visitorBody, [side * .24, 1.52, 0]); visitorArms.push(arm);
    tube(arm, [[0, 0, 0], [side * .25, -.28, .01], [side * .35, .08, .09]], .087, mat.cream);
    ball(arm, [side * .36, .18, .09], [.095, .14, .055], mat.lightWood);
    for (let i = 0; i < 4; i++) tube(arm, [[side * (.29 + i * .042), .23, .09], [side * (.29 + i * .048), .34 + Math.sin(i) * .04, .09]], .019, mat.lightWood, 6);
  });
  target("visitor", visitor, [0, 2.9, 0]);

  // A striped little body, two eye stalks, open hands, and two orbiting heavy orbs.
  const juggler = group(scene, [5.25, .26, 1]); juggler.rotation.y = .05;
  const jugglerBody = group(juggler);
  const juggleProfile = [[.24, .27], [.47, .45], [.59, .7], [.79, .9], [.51, 1.08], [.22, 1.14]].map(([x, y]) => new THREE.Vector2(x, y));
  mesh(ownGeometry(new THREE.LatheGeometry(juggleProfile, 24)), mat.lightWood, jugglerBody, [0, 0, 0], [1, 1, .7], true);
  [[.35, .36], [.47, .46], [.55, .61], [.64, .76], [.75, .9]].forEach(([radius, y]) => { const stripe = ring(jugglerBody, [0, y, 0], radius, .021, mat.dark); stripe.rotation.x = Math.PI / 2; stripe.scale.y = .7; });
  [-1, 1].forEach(side => {
    tube(jugglerBody, [[side * .2, .37, 0], [side * .25, .12, .08], [side * .38, .07, .3]], .09, mat.lightWood, 13);
    for (let toe = 0; toe < 3; toe++) cone(jugglerBody, [side * .35, .08, .18], [side * (.22 + toe * .12), .04, .49], .067, .02, mat.lightWood, 6);
    tube(jugglerBody, [[side * .24, 1, 0], [side * .43, 1.3, 0], [side * .51, 1.63, 0]], .082, mat.lightWood);
    ball(jugglerBody, [side * .53, 1.87, 0], [.36, .38, .32], mat.lightWood, true);
    eye(jugglerBody, [side * .53, 1.91, .27], .23);
  });
  const jugglerArms: THREE.Group[] = [];
  [-1, 1].forEach(side => {
    const arm = group(jugglerBody, [side * .5, .91, 0]); jugglerArms.push(arm);
    tube(arm, [[0, 0, 0], [side * .39, .02, .02], [side * .7, .25, .06]], .068, mat.lightWood);
    ball(arm, [side * .73, .28, .06], [.12, .065, .12], mat.lightWood);
    for (let finger = 0; finger < 3; finger++) tube(arm, [[side * .73, .28, .06], [side * (.82 + finger * .07), .4 + finger * .05, .06]], .025, mat.lightWood, 6);
  });
  const orbs = [-1, 1].map(side => {
    const orb = group(juggler, [side * 1.25, 2.8, 0]);
    ball(orb, [0, 0, 0], [.19, .19, .19], mat.orb, true);
    const orbitRing = ring(orb, [0, 0, 0], .24, .013, mat.gold); orbitRing.rotation.x = .8;
    return orb;
  });
  target("juggler", juggler, [0, 2.5, .1]);

  // The bridge grows along real curves, so it remains a bridge when the view turns.
  const rootTips = group(scene);
  for (let i = 0; i < 4; i++) {
    const z = .48 + i * .33;
    tube(rootTips, [[-1.55, .13, z], [-.55, .23, z], [-.08, .46 + i * .04, z], [.08, .7, z]], .075, mat.lightWood);
    tube(rootTips, [[3.6, .3, z], [2.95, .31, z], [2.7, .56, z]], .06, mat.lightWood);
  }
  target("roots", rootTips, [-.3, 1.1, -.06]);
  const bridge = group(scene);
  const bridgeParts: { object: THREE.Mesh; count: number; from: number; until: number }[] = [];
  function bridgeRoot(points: Point[], radius: number, from = 0, until = 1) {
    const object = tube(bridge, points, radius, mat.lightWood, 44);
    bridgeParts.push({ object, count: object.geometry.index!.count, from, until }); return object;
  }
  const bridgePoint = (t: number, z: number, rail = false): Point => [-.55 + 3.63 * t, .24 + .17 * t + Math.sin(t * Math.PI) * .43 + (rail ? .83 : 0), z - t * .25];
  for (let i = 0; i < 6; i++) {
    const z = .55 + i * .21;
    bridgeRoot(Array.from({ length: 9 }, (_, j) => { const p = bridgePoint(j / 8, z); p[1] += Math.sin(j * 2 + i) * .028; return p; }), .13, i * .07, .74 + i * .05);
  }
  [.47, 1.71].forEach(z => {
    bridgeRoot(Array.from({ length: 9 }, (_, j) => bridgePoint(j / 8, z, true)), .065, .18, 1);
    for (let i = 0; i <= 6; i++) {
      const t = i / 6, base = bridgePoint(t, z), top = bridgePoint(t, z, true);
      bridgeRoot([base, [base[0] + .1, base[1] + .4, base[2]], top], .037, .15 + t * .55, .3 + t * .65);
    }
  });
  target("gap", bridge, [1.26, 1, 2.15]);
  // Select the empty crossing as well as the completed geometry.
  mesh(sphere, ownMaterial(new THREE.MeshBasicMaterial({ visible: false })), bridge, [1.2, .3, 1], [1.9, .5, .8]);
  const bridgeLeaves: { object: THREE.Group; threshold: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const point = bridgePoint(i / 6, i % 2 ? .4 : 1.77, true);
    const sprout = group(bridge, point); cone(sprout, [0, 0, 0], [.04, .24, 0], .018, .008, mat.pine, 5);
    const leaf = ball(sprout, [.1, .19, 0], [.13, .06, .05], mat.leaf); leaf.rotation.z = .5;
    bridgeLeaves.push({ object: sprout, threshold: .28 + i / 6 * .66 });
  }

  // Warm drifting seeds echo the specks of light among the illustrated leaves.
  const seedCount = 34;
  const seedGeometry = ownGeometry(new THREE.BufferGeometry());
  const seedPositions = new Float32Array(seedCount * 3); const seedOrigins: Point[] = [];
  for (let i = 0; i < seedCount; i++) { const origin: Point = [(random() - .5) * 17, random() * 6 + .6, (random() - .5) * 9]; seedOrigins.push(origin); seedPositions.set(origin, i * 3); }
  seedGeometry.setAttribute("position", new THREE.BufferAttribute(seedPositions, 3));
  const seeds = new THREE.Points(seedGeometry, ownMaterial(new THREE.PointsMaterial({ color: 0xe4bd67, size: .055, transparent: true, opacity: .73, sizeAttenuation: true, depthWrite: false }))); scene.add(seeds);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const projectVector = new THREE.Vector3();
  const lookAt = new THREE.Vector3(-.35, 1.3, -.2);
  const selection = mesh(ownGeometry(new THREE.RingGeometry(.5, .53, 48)), ownMaterial(new THREE.MeshBasicMaterial({ color: 0xe2bc70, transparent: true, opacity: .7, side: THREE.DoubleSide, depthWrite: false })), scene);
  selection.rotation.x = -Math.PI / 2; selection.visible = false; selection.castShadow = false;

  function cameraUpdate() {
    const width = Math.max(host.clientWidth, 1), height = Math.max(host.clientHeight, 1), aspect = width / height;
    const vertical = Math.max(12.4, 20.8 / aspect) / zoom;
    camera.left = -vertical * aspect / 2; camera.right = vertical * aspect / 2; camera.top = vertical / 2; camera.bottom = -vertical / 2;
    camera.position.set(lookAt.x + Math.sin(yaw) * 30 * Math.cos(tilt), lookAt.y + Math.sin(tilt) * 30, lookAt.z + Math.cos(yaw) * 30 * Math.cos(tilt));
    camera.lookAt(lookAt); camera.updateProjectionMatrix(); camera.updateMatrixWorld();
  }
  function projectTargets() {
    const points = {} as Projection;
    (Object.keys(anchors) as Target[]).forEach(id => {
      anchors[id].getWorldPosition(projectVector); projectVector.project(camera);
      points[id] = { x: (projectVector.x + 1) * 50, y: (1 - projectVector.y) * 50, visible: Math.abs(projectVector.x) < .97 && Math.abs(projectVector.y) < .9 && projectVector.z > -1 && projectVector.z < 1 };
    });
    callbacks.onProject(points);
  }
  function pick(event: PointerEvent) {
    const bounds = canvas.getBoundingClientRect();
    mouse.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(pickables, true);
    for (const hit of hits) {
      let object: THREE.Object3D | null = hit.object;
      while (object) { if (object.userData.target) return object.userData.target as Target; object = object.parent; }
    }
    return null;
  }
  function setHover(targetId: Target | null) {
    if (hover === targetId) return;
    hover = targetId; canvas.style.cursor = targetId && !state.disabled ? "pointer" : "grab"; callbacks.onHover(targetId); dirty = true; wake();
  }
  function onPointerDown(event: PointerEvent) {
    if (event.button !== 0 || state.disabled) return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, moved: false };
    canvas.setPointerCapture(event.pointerId);
  }
  function onPointerMove(event: PointerEvent) {
    if (pointer && pointer.id === event.pointerId) {
      if (Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) > 6) pointer.moved = true;
      if (pointer.moved) {
        yaw = THREE.MathUtils.clamp(yaw - (event.clientX - pointer.lastX) * .004, -.53, .61);
        tilt = THREE.MathUtils.clamp(tilt + (event.clientY - pointer.lastY) * .0025, .32, .77);
        dirty = true; wake(); setHover(null); canvas.style.cursor = "grabbing";
      }
      pointer.lastX = event.clientX; pointer.lastY = event.clientY;
    } else if (event.pointerType !== "touch") setHover(pick(event));
  }
  function onPointerUp(event: PointerEvent) {
    if (!pointer || pointer.id !== event.pointerId) return;
    if (!pointer.moved && !state.disabled) { const selected = pick(event); if (selected) callbacks.onTarget(selected); }
    pointer = null; if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    canvas.style.cursor = "grab";
  }
  function onPointerCancel() { pointer = null; canvas.style.cursor = "grab"; }
  function onPointerLeave() { if (!pointer) setHover(null); }
  function resize() {
    if (disposed || failed) return;
    renderer.setSize(Math.max(host.clientWidth, 1), Math.max(host.clientHeight, 1), false);
    dirty = true; wake();
  }
  function contextLost(event: Event) { event.preventDefault(); failed = true; cancelAnimationFrame(frame); callbacks.onHover(null); callbacks.onFailure(); }

  function render(time: number) {
    frame = 0;
    if (disposed || failed) return;
    const delta = lastTime ? Math.min((time - lastTime) / 1000, .05) : 0;
    lastTime = time;
    const moving = !state.reducedMotion && !state.paused && visible && !document.hidden;
    if (moving) elapsed += delta;
    const t = state.reducedMotion ? 0 : elapsed;
    if (state.reducedMotion) { bridgeGrowth = state.state.bridgeOpen ? 1 : 0; crossing = state.state.complete ? 1 : 0; }
    else if (moving) {
      bridgeGrowth = state.state.bridgeOpen ? Math.min(1, bridgeGrowth + delta / 4.2) : 0;
      crossing = state.state.complete ? Math.min(1, crossing + delta / 5.4) : 0;
    }
    if (moving || dirty) {
      cameraUpdate();
      crown.rotation.z = Math.sin(t * .47) * .016;
      crown.rotation.x = Math.cos(t * .37) * .012;
      turtle.rotation.z = Math.sin(t * 1.4) * .012;
      trumpet.rotation.x = Math.sin(t * 1.7) * (state.active === "turtle" ? .065 : .017);
      floweringTail.rotation.z = Math.sin(t * 1.9) * .085;
      bird.rotation.y = .12 + Math.sin(t * .36) * (state.active === "bird" ? .045 : .012);
      jugglerBody.position.y = Math.sin(t * 1.8) * .035;
      jugglerArms.forEach((arm, index) => { arm.rotation.z = Math.sin(t * 2 + index * Math.PI) * .11; });
      orbs.forEach((orb, index) => {
        const phase = t * (state.active === "juggler" ? 1.35 : 1.05) + index * Math.PI;
        orb.position.set(Math.cos(phase) * 1.22, 2.35 + Math.sin(phase) * .77, Math.sin(phase) * .22);
        orb.rotation.set(t * .5, t * .8, phase);
      });
      const walking = crossing > 0 && crossing < 1;
      let visitorX = -2.15, visitorZ = 2, visitorY = .15;
      if (crossing > 0) {
        if (crossing < .22) { const p = crossing / .22; visitorX = THREE.MathUtils.lerp(-2.15, -.55, p); visitorZ = THREE.MathUtils.lerp(2, 1.1, p); }
        else if (crossing < .78) { const p = (crossing - .22) / .56; [visitorX, visitorY, visitorZ] = bridgePoint(p, 1.1); }
        else { const p = (crossing - .78) / .22; visitorX = THREE.MathUtils.lerp(3.08, 4.35, p); visitorZ = THREE.MathUtils.lerp(.85, 1.9, p); visitorY = .27; }
      }
      visitor.position.set(visitorX, visitorY + (walking ? Math.abs(Math.sin(t * 11)) * .06 : Math.sin(t * 1.65) * .012), visitorZ);
      visitor.rotation.y = walking ? 1.12 : crossing === 1 ? -.36 : .15;
      leftLeg.rotation.x = walking ? Math.sin(t * 11) * .46 : 0; rightLeg.rotation.x = walking ? -Math.sin(t * 11) * .46 : 0;
      visitorHead.rotation.z = Math.sin(t * .7) * .025;
      visitorArms.forEach((arm, index) => { arm.rotation.z = crossing === 1 && index === 1 ? -.12 + Math.sin(t * 3.3) * .18 : Math.sin(t * 1.3 + index) * .028; arm.rotation.x = walking ? Math.sin(t * 11 + index * Math.PI) * .16 : 0; });
      bridgeParts.forEach(part => {
        const growth = THREE.MathUtils.clamp((bridgeGrowth - part.from) / (part.until - part.from), 0, 1);
        // Complete triangles, grown in tube-ring order, prevent slivers or missing caps.
        part.object.geometry.setDrawRange(0, Math.floor(part.count * growth / 36) * 36); part.object.visible = growth > 0;
      });
      bridgeLeaves.forEach(({ object, threshold }) => { const growth = THREE.MathUtils.clamp((bridgeGrowth - threshold) * 8, 0, 1); object.visible = growth > 0; object.scale.setScalar(growth); object.rotation.z = Math.sin(t * 1.6 + threshold) * .08; });
      rootTips.rotation.x = state.state.bridgeOpen ? 0 : Math.sin(t * 1.05) * .012;
      distantIslands.forEach(({ object, y, phase }) => { object.position.y = y + Math.sin(t * .2 + phase) * .14; });
      clouds.forEach(({ object, x, speed, phase }) => { object.position.x = x + Math.sin(t * speed + phase) * 1.8; });
      seedOrigins.forEach((origin, i) => { seedPositions[i * 3] = origin[0] + Math.sin(t * .19 + i) * .55; seedPositions[i * 3 + 1] = origin[1] + Math.sin(t * .3 + i * 2) * .28; seedPositions[i * 3 + 2] = origin[2] + Math.cos(t * .24 + i) * .24; });
      seedGeometry.attributes.position.needsUpdate = true;
      const selected = state.active || hover;
      const selectedObject = selected === "visitor" ? visitor : selected === "turtle" ? turtle : selected === "juggler" ? juggler : selected === "bird" ? bird : null;
      selection.visible = !!selectedObject;
      if (selectedObject) { selection.position.copy(selectedObject.position); selection.position.y += .075; selection.scale.setScalar(selected === "bird" ? 2 : selected === "turtle" ? 2.1 : 1.25); }
      scene.updateMatrixWorld();
      try { renderer.render(scene, camera); }
      catch { failed = true; callbacks.onHover(null); callbacks.onFailure(); return; }
      projectTargets(); dirty = false;
      canvas.dataset.bridgeProgress = bridgeGrowth.toFixed(2);
      canvas.dataset.crossingProgress = crossing.toFixed(2);
      canvas.dataset.motion = state.reducedMotion ? "reduced" : state.paused ? "paused" : "animated";
    }
    if (moving) frame = requestAnimationFrame(render);
  }
  function wake() { if (!frame && !disposed && !failed) frame = requestAnimationFrame(render); }
  function visibilityChanged() { lastTime = 0; dirty = true; wake(); }
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
  const intersectionObserver = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? true; lastTime = 0; if (visible) { dirty = true; wake(); } }, { threshold: 0 });
  intersectionObserver.observe(host);
  canvas.addEventListener("pointerdown", onPointerDown); canvas.addEventListener("pointermove", onPointerMove); canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerCancel); canvas.addEventListener("pointerleave", onPointerLeave); canvas.addEventListener("webglcontextlost", contextLost);
  document.addEventListener("visibilitychange", visibilityChanged);
  canvas.style.cursor = "grab";
  resize();

  return {
    update(next) {
      // Restarts reset the diorama too; restored saves were placed immediately above.
      if (!next.state.bridgeOpen) bridgeGrowth = 0;
      if (!next.state.complete) crossing = 0;
      state = next; dirty = true; wake();
    },
    control(action) {
      if (action === "left") yaw = Math.max(-.53, yaw - .16);
      if (action === "right") yaw = Math.min(.61, yaw + .16);
      if (action === "in") zoom = Math.min(1.55, zoom + .12);
      if (action === "out") zoom = Math.max(.82, zoom - .12);
      if (action === "reset") { yaw = .13; tilt = .53; zoom = 1; }
      dirty = true; wake();
    },
    dispose() {
      if (disposed) return; disposed = true; cancelAnimationFrame(frame);
      resizeObserver.disconnect(); intersectionObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown); canvas.removeEventListener("pointermove", onPointerMove); canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel); canvas.removeEventListener("pointerleave", onPointerLeave); canvas.removeEventListener("webglcontextlost", contextLost);
      document.removeEventListener("visibilitychange", visibilityChanged);
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(surface => surface.dispose()); textures.forEach(texture => texture.dispose());
      sun.shadow.dispose(); renderer.renderLists.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    }
  };
}
