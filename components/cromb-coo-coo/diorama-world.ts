import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { getTargets, type GameState, type Target } from "@/lib/cromb-coo-coo";

type Point = [number, number, number];
type SceneState = { state: GameState; active: Target | null; reducedMotion: boolean; paused: boolean; disabled: boolean; travelling: "forward" | "back" | null };
type Projection = Partial<Record<Target, { x: number; y: number; visible: boolean }>>;
type Callbacks = {
  onTarget: (target: Target) => void;
  onHover: (target: Target | null) => void;
  onProject: (points: Projection) => void;
  onArrival: () => void;
  onTravelComplete: () => void;
  onFailure: () => void;
};
export type SceneControl = "left" | "right" | "in" | "out" | "reset";
export type Diorama = { update: (state: SceneState) => void; control: (action: SceneControl) => void; dispose: () => void };

const PALETTE = {
  ink: 0x343e36, paper: 0xf3e7c9, wood: 0xcbb68a, bark: 0x7c8064,
  pine: 0x3f6155, moss: 0x85916a, leaf: 0xa5ac75, gold: 0xd5b66c,
  rock: 0x75877e, cream: 0xf4e7c8, dark: 0x41473d, soil: 0x938967
};

/** Each stop is a complete, modeled island; illustrated plates are a separate fallback. */
export function createDiorama(host: HTMLElement, initial: SceneState, callbacks: Callbacks): Diorama {
  let state = initial;
  let disposed = false;
  let failed = false;
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let dirty = true;
  let visible = true;
  let yaw = .12;
  let tilt = .49;
  let zoom = 1;
  let arrival = initial.reducedMotion ? 1 : 0;
  let travel = 0;
  let arrivalSent = false;
  let travelSent = false;
  let hover: Target | null = null;
  let pointer: { id: number; x: number; y: number; lastX: number; lastY: number; moved: boolean } | null = null;
  let seed = 72641 + initial.state.sceneIndex * 943;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const v = (p: Point) => new THREE.Vector3(...p);
  const scene = new THREE.Scene();
  const sky = initial.state.sceneIndex === 4 ? 0xd1dac7 : initial.state.sceneIndex === 3 ? 0xdce5dc : 0xe6e5cf;
  scene.background = new THREE.Color(sky);
  scene.fog = new THREE.Fog(sky, 29, 74);
  const camera = new THREE.OrthographicCamera(-8, 8, 6, -6, .1, 140);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "width:100%;height:100%;display:block;touch-action:pan-y";
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
  const ambient = new THREE.HemisphereLight(0xfff2cf, 0x718c85, 1.5); scene.add(ambient);
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
  const anchors: Partial<Record<Target, THREE.Object3D>> = {};
  function target(id: Target, object: THREE.Object3D, at: Point) {
    object.userData.target = id; pickables.push(object); anchors[id] = group(object, at);
  }
  function batchScenery(parent: THREE.Object3D) {
    parent.updateWorldMatrix(true, true);
    const inverse = parent.matrixWorld.clone().invert();
    const batches = new Map<string, { surface: THREE.Material; objects: THREE.Mesh[] }>();
    parent.traverse(object => {
      if (!(object instanceof THREE.Mesh) || object instanceof THREE.InstancedMesh || Array.isArray(object.material) || object.userData.animated) return;
      // A material may be shared by indexed primitives and unindexed cliff faces.
      // Batch only identical layouts so every original surface is preserved.
      const geometry: THREE.BufferGeometry = object.geometry;
      const attributes = Object.entries(geometry.attributes).map(([name, attribute]) =>
        `${name}:${attribute.itemSize}:${attribute.normalized}:${attribute.array.constructor.name}`
      ).sort().join("|");
      const key = `${object.material.uuid}:${!!object.geometry.index}:${attributes}`;
      const batch: { surface: THREE.Material; objects: THREE.Mesh[] } = batches.get(key) ?? { surface: object.material, objects: [] };
      batch.objects.push(object); batches.set(key, batch);
    });
    batches.forEach(({ objects, surface }) => {
      if (objects.length < 2) return;
      const pieces = objects.map(object => object.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, object.matrixWorld)));
      let combined: THREE.BufferGeometry | null;
      try { combined = mergeGeometries(pieces, false); }
      finally { pieces.forEach(piece => piece.dispose()); }
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
  function pine(parent: THREE.Object3D, at: Point, size: number) {
    const tree = group(parent, at);
    cone(tree, [0, 0, 0], [.03, size * 1.2, 0], size * .065, size * .025, mat.bark, 5);
    for (let i = 0; i < 3; i++) {
      const height = size * (.3 + i * .28);
      cone(tree, [0, height, 0], [0, height + size * .65, 0], size * (.35 - i * .075), 0, i % 2 ? mat.moss : mat.pine, 7);
    }
    return tree;
  }
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

  const animations: ((time: number) => void)[] = [];
  const mainIsland = island(scene, [0, 0, 0], 4.65, 3.65, true);
  meadow(mainIsland, 4.2, 90);
  for (let i = 0; i < 12; i++) {
    const angle = Math.PI + i / 11 * Math.PI;
    pine(mainIsland, [Math.cos(angle) * 4.05, .03, Math.sin(angle) * 2.95], .45 + random() * .6);
  }
  function flower(parent: THREE.Object3D, at: Point, size: number) {
    const head = group(parent, at); head.rotation.x = -.28;
    for (let j = 0; j < 7; j++) {
      const a = j / 7 * Math.PI * 2;
      const petal = ball(head, [Math.sin(a) * size * .72, Math.cos(a) * size * .72, 0], [size * .3, size * .58, size * .14], mat.petal);
      petal.rotation.z = -a;
    }
    ball(head, [0, 0, size * .06], [size * .34, size * .34, size * .21], mat.gold); return head;
  }
  function flowers(parent: THREE.Object3D, center: Point, count: number) {
    for (let i = 0; i < count; i++) {
      const x = center[0] + (random() - .5) * 1.3, z = center[2] + (random() - .5) * .8;
      const y = .2 + random() * .45;
      tube(parent, [[x, 0, z], [x - .06, y * .6, z], [x, y, z]], .015, mat.pine, 8);
      flower(parent, [x, y, z], .13 + random() * .07);
    }
  }
  function pool(parent: THREE.Object3D, at: Point, scale: Point) {
    const water = material(0x88b8ae, false, { roughness: .22, metalness: .2, transparent: true, opacity: .88 });
    ball(parent, [at[0], at[1] - .025, at[2]], [scale[0] * 1.13, .065, scale[2] * 1.13], mat.lightWood);
    const surface = ball(parent, at, scale, water); surface.castShadow = false;
    for (let i = 0; i < 3; i++) {
      const ripple = ring(parent, [at[0] + .15, at[1] + .055, at[2]], .3 + i * .28, .008, mat.cream);
      ripple.userData.animated = true;
      ripple.rotation.x = -Math.PI / 2; ripple.scale.y = .7;
      animations.push(t => { ripple.scale.setScalar(1 + Math.sin(t * .9 + i) * .08); });
    }
    return surface;
  }
  function book(parent: THREE.Object3D, at: Point, size: Point, surface = mat.pine, angle = 0) {
    const item = group(parent, at); item.rotation.z = angle;
    const box = ownGeometry(new THREE.BoxGeometry(1, 1, 1));
    mesh(box, mat.cream, item, [0, 0, 0], size);
    [-1, 1].forEach(side => mesh(box, surface, item, [side * size[0] * .51, 0, 0], [size[0] * .07, size[1] * 1.04, size[2] * 1.08]));
    mesh(box, surface, item, [0, 0, size[2] * .51], [size[0] * 1.09, size[1] * 1.04, .025]);
    [-.3, .3].forEach(y => mesh(box, mat.gold, item, [0, size[1] * y, size[2] * .54], [size[0] * .7, .025, .015]));
    return item;
  }
  const path = group(scene);
  for (let i = 0; i < 10; i++) {
    const slab = mesh(ownGeometry(new THREE.BoxGeometry(.34, .12, .8)), mat.lightWood, path, [1.95 + i * .35, .15 + Math.sin(i * .23) * .07, 1.48]);
    slab.rotation.y = Math.sin(i) * .055;
  }
  [-1, 1].forEach(side => tube(path, [[1.8, .22, 1.48 + side * .42], [3.4, .24, 1.48 + side * .45], [5.2, .19, 1.48 + side * .4]], .04, mat.bark));
  const sign = group(path, [3.45, .15, 1.14]);
  cone(sign, [0, 0, 0], [0, 1.03, 0], .04, .04, mat.bark);
  const signBoard = mesh(ownGeometry(new THREE.BoxGeometry(.78, .3, .055)), mat.cream, sign, [.12, .86, 0]);
  signBoard.rotation.z = -.03;
  tube(sign, [[-.1, .86, .05], [.39, .86, .05], [.25, .97, .05]], .023, mat.pine, 8);
  tube(sign, [[.39, .86, .05], [.25, .75, .05]], .023, mat.pine, 5);
  target("path", path, [3.54, 1.45, 1.45]);
  const back = group(scene);
  for (let i = 0; i < 4; i++) ball(back, [-3.6 + i * .4, .14, 1.3], [.24, .05, .35], mat.lightWood);
  target("back", back, [-3.6, .65, 1.35]);

  // Background land gives the new scene a destination without crowding its cast.
  for (let i = 0; i < 4; i++) {
    const x = [-9, 8, -1, 14][i], y = [1.6, 2, 3.2, -.4][i], z = [-20, -14, -25, -22][i];
    const distant = island(scene, [x, y, z], 1.2 + random() * .75, 2.5);
    pine(distant, [0, .05, 0], 1.1 + random() * .5);
    batchScenery(distant);
    animations.push(t => { distant.position.y = y + Math.sin(t * .24 + i) * .1; });
  }
  mesh(sphere, ownMaterial(new THREE.MeshBasicMaterial({ color: 0xffefc6 })), scene, [-12, 10, -38], [3.1, 3.1, 3.1]);
  for (let i = 0; i < 10; i++) {
    const x = (random() - .5) * 34, y = -3 - random() * 5, z = -9 - random() * 24;
    const cloud = group(scene, [x, y, z]); const size = 1.2 + random() * 1.5;
    for (let j = 0; j < 4; j++) {
      const puff = mesh(pebble, mat.cloud, cloud, [(j - 1.5) * size * .65, Math.sin(j) * .2, j % 2 * .5], [size, size * .35, size * .7]);
      puff.castShadow = false; puff.receiveShadow = false;
    }
    animations.push(t => { cloud.position.x = x + Math.sin(t * .035 + i) * 1.4; });
  }

  function buildFrogIsland() {
    pool(mainIsland, [1.55, .14, -.35], [1.24, .04, .7]);
    for (let i = 0; i < 5; i++) {
      const pad = ball(mainIsland, [.85 + i * .27, .22, -.55 + Math.sin(i) * .25], [.23, .025, .18], mat.pine);
      pad.rotation.y = i;
    }
    flowers(mainIsland, [-.1, 0, -.45], 13); flowers(mainIsland, [2.45, 0, -.5], 11);
  // The familiar striped amphibian becomes a welcoming first conversation.
  const juggler = group(scene, [.85, .16, .4]); juggler.rotation.y = .05;
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
  tube(jugglerBody, [[-.26, .91, .44], [0, .81, .53], [.26, .91, .44]], .022, mat.dark, 14);
  target("resident", juggler, [0, 2.36, .1]);
  animations.push(t => { jugglerBody.position.y = Math.sin(t * 1.6) * .035; jugglerArms.forEach((arm, index) => { arm.rotation.z = Math.sin(t * 1.7 + index * Math.PI) * .07; }); });
  }

  function buildBirdTerrace() {
  // The Woodgrain Bird grows directly out of the terrace, like the original drawing.
  const bird = group(scene, [.85, .07, -.6]); bird.scale.setScalar(.76); bird.rotation.y = .12;
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
  target("resident", bird, [0, 4.05, 1]);
  animations.push(t => { crown.rotation.z = Math.sin(t * .47) * .016; crown.rotation.x = Math.cos(t * .37) * .012; bird.rotation.y = .12 + Math.sin(t * .36) * .022; });


    const detail = group(scene, [-1.55, .1, -.8]);
    for (let i = 0; i < 5; i++) {
      tube(detail, [[.3, .1, -.5], [-.3, .15, i * .25], [-.6 - i * .14, .3, .8]], .075, mat.lightWood);
    }
    flowers(detail, [-.6, 0, .3], 7);
    target("detail", detail, [-.4, .9, .5]);
    const bench = group(mainIsland, [2.4, .1, -.65]);
    [-.5, .5].forEach(x => cone(bench, [x, 0, 0], [x, .4, 0], .09, .08, mat.bark));
    mesh(ownGeometry(new THREE.BoxGeometry(1.4, .12, .55)), mat.wood, bench, [0, .45, 0]);
    flowers(mainIsland, [2.5, 0, -1.35], 13);
  }

  function buildGlasshouse() {
    const glasshouse = group(scene, [.65, .12, -1.4]);
    const glass = material(0xb9d4bd, false, { transparent: true, opacity: .24, roughness: .16, metalness: .1, side: THREE.DoubleSide, depthWrite: false });
    const box = ownGeometry(new THREE.BoxGeometry(1, 1, 1));
    [-1, 1].forEach(side => {
      mesh(box, glass, glasshouse, [side * 1.55, 1.2, 0], [.025, 2.4, 2.1]);
      for (let i = 0; i < 4; i++) cone(glasshouse, [side * 1.55, 0, -1 + i * .67], [side * 1.55, 2.4, -1 + i * .67], .026, .026, mat.lightWood, 6);
    });
    mesh(box, glass, glasshouse, [0, 1.2, -1.05], [3.1, 2.4, .025]);
    [-1, 1].forEach(z => {
      tube(glasshouse, [[-1.55, 0, z * 1.05], [-1.55, 2.4, z * 1.05], [0, 3.6, z * 1.05], [1.55, 2.4, z * 1.05], [1.55, 0, z * 1.05]], .058, mat.lightWood, 12);
      cone(glasshouse, [-1.55, 1.05, z * 1.05], [1.55, 1.05, z * 1.05], .025, .025, mat.lightWood, 5);
    });
    cone(glasshouse, [0, 3.6, -1.05], [0, 3.6, 1.05], .055, .055, mat.lightWood);
    [-1, 1].forEach(side => {
      for (let i = 0; i < 6; i++) {
        const leaf = ball(glasshouse, [side * .81, 3, -.93 + i * .37], [.95, .09, .32], i % 2 ? mat.moss : mat.leaf);
        leaf.rotation.z = -side * .61;
        tube(glasshouse, [[0, 3.59, -.93 + i * .37], [side * .8, 3.04, -.93 + i * .37], [side * 1.55, 2.38, -.93 + i * .37]], .014, mat.pine, 8);
      }
    });
    for (let i = 0; i < 7; i++) {
      const x = -1.1 + (i % 3) * .95, z = -.65 + Math.floor(i / 3) * .5;
      mesh(ownGeometry(new THREE.CylinderGeometry(.23, .16, .35, 8)), mat.soil, glasshouse, [x, .21, z]);
      cone(glasshouse, [x, .3, z], [x + .07, 1 + i % 3 * .15, z], .025, .012, mat.pine);
      foliage(glasshouse, [x, .87, z], [.33, .38, .26], 17, i % 3 === 0);
    }
    target("detail", glasshouse, [-.35, 3.45, 1]);
    const snail = group(scene, [.85, .14, 1]);
    ball(snail, [0, .22, 0], [1, .24, .4], mat.lightWood, true);
    ball(snail, [-.1, .77, -.09], [.65, .7, .36], mat.wood, true);
    const spiral: Point[] = [];
    for (let i = 0; i <= 100; i++) { const a = i / 100 * Math.PI * 5.4, r = .04 + i / 100 * .54; spiral.push([-.1 + Math.cos(a) * r, .77 + Math.sin(a) * r, .27]); }
    tube(snail, spiral, .03, mat.bark, 95);
    const snailHead = group(snail, [.65, .36, .14]);
    ball(snailHead, [0, .16, 0], [.29, .35, .28], mat.lightWood, true);
    [-1, 1].forEach(side => { tube(snailHead, [[side * .13, .35, 0], [side * .2, .7, 0], [side * .23, .83, .04]], .037, mat.wood); eye(snailHead, [side * .23, .84, .1], .13); });
    tube(snailHead, [[-.1, .13, .26], [0, .08, .28], [.12, .15, .24]], .019, mat.dark, 12);
    target("resident", snail, [.6, 1.8, .3]);
    flowers(mainIsland, [-2.55, 0, -.6], 14);
    animations.push(t => { snailHead.rotation.z = Math.sin(t * .7) * .055; });
  }

  function buildObservatory() {
    pool(mainIsland, [-.65, .14, -.4], [1.5, .04, .88]);
    const telescope = group(scene, [1.4, .1, -1]);
    for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2; cone(telescope, [Math.cos(a) * .85, 0, Math.sin(a) * .85], [0, 1.9, 0], .09, .06, mat.wood); }
    const brass = material(0xc2a15c, false, { roughness: .48, metalness: .52 });
    const telescopeHead = group(telescope, [0, 2, 0]); telescopeHead.rotation.z = -.38;
    cone(telescopeHead, [-1.05, 0, 0], [1.13, 0, 0], .2, .39, brass, 24);
    const lens = mesh(ownGeometry(new THREE.CircleGeometry(.34, 28)), material(0x467b76, false, { roughness: .06, metalness: .3 }), telescopeHead, [1.135, 0, 0]); lens.rotation.y = Math.PI / 2;
    [-.9, .85].forEach(x => { const band = ring(telescopeHead, [x, 0, 0], x < 0 ? .225 : .373, .035, mat.gold); band.rotation.y = Math.PI / 2; });
    cone(telescopeHead, [-1.32, 0, 0], [-1.05, 0, 0], .12, .16, mat.dark);
    const dial = ring(telescope, [0, 1.92, .23], .25, .032, brass);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; cone(dial, [0, 0, 0], [Math.cos(a) * .21, Math.sin(a) * .21, 0], .008, .008, brass, 4); }
    target("detail", telescope, [0, 3.2, 0]);
    const shorebird = group(scene, [.9, .12, 1.4]);
    [-.18, .18].forEach(x => { cone(shorebird, [x, .05, .12], [x, .9, 0], .034, .04, mat.gold); for (let j = 0; j < 3; j++) cone(shorebird, [x, .05, .12], [x + (j - 1) * .14, .035, .4], .025, .01, mat.gold); });
    const birdBody = group(shorebird, [0, .93, 0]);
    ball(birdBody, [0, .36, 0], [.52, .68, .4], mat.cream, true);
    ball(birdBody, [0, .88, .05], [.38, .37, .31], mat.cream, true);
    [-1, 1].forEach(side => { const wing = ball(birdBody, [side * .39, .32, -.06], [.18, .47, .36], mat.pine); wing.rotation.z = side * .23; eye(birdBody, [side * .135, .91, .32], .095); });
    cone(birdBody, [0, .84, .31], [.04, .78, .91], .095, .008, mat.gold, 6);
    for (let i = 0; i < 3; i++) cone(birdBody, [0, 1.13, 0], [i * .075 - .075, 1.5 - i * .04, -.12], .065, .009, mat.pine, 5);
    target("resident", shorebird, [0, 2.8, .1]);
    for (let i = 0; i < 8; i++) {
      const rock = mesh(pebble, i % 2 ? mat.stone : mat.lightWood, mainIsland, [-2.7 + random() * .8, .2, -.6 + random() * 1.7], [.2 + random() * .3, .18 + random() * .2, .25]); rock.rotation.y = i;
    }
    animations.push(t => { birdBody.rotation.z = Math.sin(t * .9) * .03; telescopeHead.rotation.y = Math.sin(t * .19) * .025; });
  }

  function buildArchive() {
    const library = group(scene, [.6, .1, -1.1]);
    const box = ownGeometry(new THREE.BoxGeometry(1, 1, 1));
    [-1, 1].forEach(side => {
      cone(library, [side * 1.45, 0, 0], [side * 1.25, 3.45, -.06], .46, .29, mat.wood, 11);
      tube(library, [[side * 1.25, 3.15, 0], [side * .75, 4.1, 0], [0, 4.23, 0]], .27, mat.wood);
      for (let i = 0; i < 3; i++) tube(library, [[side * 1.45, .4, 0], [side * (1.7 + i * .2), .12, .1 + i * .25], [side * (1.8 + i * .3), .06, .45 + i * .23]], .07, mat.bark);
    });
    for (let shelf = 0; shelf < 3; shelf++) {
      const y = .7 + shelf * .92;
      mesh(box, mat.wood, library, [0, y, -.02], [2.8, .1, .8]);
      for (let i = 0; i < 8; i++) book(library, [-1.12 + i * .31, y + .34, .02], [.18 + random() * .05, .43 + random() * .21, .45], [mat.pine, mat.bark, mat.gold][i % 3], (random() - .5) * .13);
    }
    foliage(library, [0, 4.15, -.1], [2.4, .95, 1.1], 290, true);
    [-1, 1].forEach(side => {
      const lantern = group(library, [side * 1.91, 2.7, .32]);
      tube(library, [[side * 1.3, 3.3, 0], [side * 1.83, 3.4, .25], [side * 1.91, 3.05, .32]], .035, mat.bark);
      const glow = material(0xf7cd70, false, { emissive: 0xf7bd50, emissiveIntensity: .85, roughness: .4 });
      mesh(ownGeometry(new THREE.CylinderGeometry(.21, .21, .5, 6)), glow, lantern);
      [-.27, .27].forEach(y => mesh(ownGeometry(new THREE.CylinderGeometry(.27, .25, .06, 6)), mat.bark, lantern, [0, y, 0]));
      for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; cone(lantern, [Math.cos(a) * .21, -.25, Math.sin(a) * .21], [Math.cos(a) * .21, .25, Math.sin(a) * .21], .015, .015, mat.bark); }
      animations.push(t => { lantern.rotation.z = Math.sin(t * .72 + side) * .045; glow.emissiveIntensity = .82 + Math.sin(t * 1.2 + side) * .08; });
    });
    const owl = group(scene, [.95, .13, 1.3]);
    const owlBody = group(owl);
    ball(owlBody, [0, .72, 0], [.64, .77, .43], mat.wood, true);
    ball(owlBody, [0, 1.32, .03], [.73, .54, .45], mat.wood, true);
    [-1, 1].forEach(side => {
      const wing = ball(owlBody, [side * .52, .72, -.03], [.2, .53, .36], mat.pine); wing.rotation.z = side * .16;
      ball(owlBody, [side * .31, 1.36, .36], [.32, .34, .1], mat.cream);
      eye(owlBody, [side * .3, 1.37, .44], .18);
      cone(owlBody, [side * .48, 1.57, -.04], [side * .66, 2, -.02], .18, .005, mat.bark, 6);
      for (let i = 0; i < 3; i++) cone(owlBody, [side * .26, .08, .1], [side * .26 + (i - 1) * .1, .05, .39], .036, .012, mat.gold, 5);
    });
    cone(owlBody, [0, 1.28, .44], [0, 1.03, .55], .13, .009, mat.gold, 5);
    for (let i = 0; i < 5; i++) { const feather = ball(owlBody, [(i % 2 ? .12 : -.12), .45 + i * .13, .39], [.13, .1, .035], mat.lightWood); feather.rotation.z = .4; }
    target("resident", owl, [0, 2.45, .1]);
    const desk = group(scene, [.95, .1, 1.87]);
    [-1, 1].forEach(side => cone(desk, [side * .7, 0, 0], [side * .7, .73, 0], .11, .085, mat.bark));
    mesh(box, mat.wood, desk, [0, .77, 0], [1.8, .15, .84]);
    [-1, 1].forEach(side => {
      const page = mesh(box, mat.cream, desk, [side * .28, .91, .03], [.54, .035, .6]);
      page.rotation.z = side * .17;
      for (let i = 0; i < 5; i++) cone(desk, [side * .12, .954, -.18 + i * .085], [side * .46, .985, -.18 + i * .085], .004, .004, mat.bark, 4);
    });
    target("detail", desk, [0, 1.24, .24]);
    // At the final island the forward route becomes a place to sit and finish.
    path.clear();
    const seat = group(path, [2.68, .12, 1.47]);
    [-.38, .38].forEach(x => [-.2, .2].forEach(z => cone(seat, [x, 0, z], [x, .47, z], .055, .05, mat.bark)));
    mesh(box, mat.wood, seat, [0, .51, 0], [1.05, .11, .66]);
    mesh(box, mat.wood, seat, [0, .95, -.25], [1.05, .45, .09]);
    anchors.path = group(seat, [0, 1.6, .25]);
    const pile = group(mainIsland, [-1.4, .3, .15]);
    for (let i = 0; i < 3; i++) { const volume = book(pile, [0, i * .19, 0], [.17, .67, .55], i % 2 ? mat.gold : mat.pine); volume.rotation.z = Math.PI / 2; volume.rotation.y = i * .13; }
    animations.push(t => { owlBody.rotation.y = Math.sin(t * .45) * .07; owlBody.position.y = Math.sin(t * 1.3) * .02; });
  }

  [buildFrogIsland, buildBirdTerrace, buildGlasshouse, buildObservatory, buildArchive][initial.state.sceneIndex]();
  batchScenery(mainIsland);

  // The visitor keeps the nervous posture and shirt from Michael's drawing.
  const visitor = group(scene, [-4.4, .15, 1.3]); visitor.rotation.y = .15;
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

  const seedCount = 24;
  const seedGeometry = ownGeometry(new THREE.BufferGeometry());
  const seedPositions = new Float32Array(seedCount * 3); const seedOrigins: Point[] = [];
  for (let i = 0; i < seedCount; i++) {
    const origin: Point = [(random() - .5) * 9, random() * 4 + .5, (random() - .5) * 6];
    seedOrigins.push(origin); seedPositions.set(origin, i * 3);
  }
  seedGeometry.setAttribute("position", new THREE.BufferAttribute(seedPositions, 3));
  scene.add(new THREE.Points(seedGeometry, ownMaterial(new THREE.PointsMaterial({ color: 0xe4bd67, size: .045, transparent: true, opacity: .7, depthWrite: false }))));

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const projectVector = new THREE.Vector3();
  const lookAt = new THREE.Vector3(0, .75, 0);
  const selection = mesh(ownGeometry(new THREE.RingGeometry(.68, .72, 48)), ownMaterial(new THREE.MeshBasicMaterial({ color: 0xe2bc70, transparent: true, opacity: .75, side: THREE.DoubleSide, depthWrite: false })), scene);
  selection.rotation.x = -Math.PI / 2; selection.visible = false; selection.castShadow = false;

  function cameraUpdate() {
    const width = Math.max(host.clientWidth, 1), height = Math.max(host.clientHeight, 1), aspect = width / height;
    // One island fills the frame at both laptop and phone widths.
    const vertical = Math.max(9.4, 11.9 / aspect) / zoom;
    camera.left = -vertical * aspect / 2; camera.right = vertical * aspect / 2; camera.top = vertical / 2; camera.bottom = -vertical / 2;
    camera.position.set(lookAt.x + Math.sin(yaw) * 27 * Math.cos(tilt), lookAt.y + Math.sin(tilt) * 27, lookAt.z + Math.cos(yaw) * 27 * Math.cos(tilt));
    camera.lookAt(lookAt); camera.updateProjectionMatrix(); camera.updateMatrixWorld();
  }
  function projectTargets() {
    const points: Projection = {};
    getTargets(state.state).forEach(({ id }) => {
      const anchor = anchors[id];
      if (!anchor) return;
      anchor.getWorldPosition(projectVector); projectVector.project(camera);
      points[id] = { x: (projectVector.x + 1) * 50, y: (1 - projectVector.y) * 50, visible: Math.abs(projectVector.x) < .97 && Math.abs(projectVector.y) < .9 && projectVector.z > -1 && projectVector.z < 1 };
    });
    callbacks.onProject(points);
  }
  function pick(event: PointerEvent) {
    const bounds = canvas.getBoundingClientRect();
    mouse.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    const available = new Set(getTargets(state.state).map(({ id }) => id));
    const hits = raycaster.intersectObjects(pickables, true);
    for (const hit of hits) {
      let object: THREE.Object3D | null = hit.object;
      while (object) {
        const id = object.userData.target as Target | undefined;
        if (id && available.has(id)) return id;
        object = object.parent;
      }
    }
    return null;
  }
  function setHover(id: Target | null) {
    if (hover === id) return;
    hover = id; canvas.style.cursor = id && !state.disabled ? "pointer" : "grab"; callbacks.onHover(id); dirty = true; wake();
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
        yaw = THREE.MathUtils.clamp(yaw - (event.clientX - pointer.lastX) * .004, -.5, .57);
        tilt = THREE.MathUtils.clamp(tilt + (event.clientY - pointer.lastY) * .0025, .32, .72);
        dirty = true; wake(); setHover(null); canvas.style.cursor = "grabbing";
      }
      pointer.lastX = event.clientX; pointer.lastY = event.clientY;
    } else if (event.pointerType !== "touch") setHover(state.disabled ? null : pick(event));
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
    if (state.reducedMotion) { arrival = 1; if (state.travelling) travel = 1; }
    else if (moving) {
      arrival = Math.min(1, arrival + delta / 1.5);
      if (state.travelling) travel = Math.min(1, travel + delta / 1.1);
    }
    if (moving || dirty) {
      cameraUpdate();
      animations.forEach(animate => animate(t));
      const walking = arrival < 1 || (!!state.travelling && travel < 1);
      const smoothArrival = THREE.MathUtils.smoothstep(arrival, 0, 1);
      let x = THREE.MathUtils.lerp(-4.25, -1.45, smoothArrival);
      if (state.travelling) x = THREE.MathUtils.lerp(-1.45, state.travelling === "forward" ? 5.25 : -4.7, THREE.MathUtils.smoothstep(travel, 0, 1));
      visitor.position.set(x, .16 + (walking ? Math.abs(Math.sin(t * 12)) * .055 : Math.sin(t * 1.65) * .012), state.travelling === "forward" ? 1.48 : 1.3);
      visitor.rotation.y = walking ? state.travelling === "back" ? -1.2 : 1.2 : .5;
      leftLeg.rotation.x = walking ? Math.sin(t * 12) * .47 : 0;
      rightLeg.rotation.x = walking ? -Math.sin(t * 12) * .47 : 0;
      visitorHead.rotation.z = Math.sin(t * .7) * .025;
      visitorArms.forEach((arm, index) => { arm.rotation.z = Math.sin(t * 1.3 + index) * .028; arm.rotation.x = walking ? Math.sin(t * 12 + index * Math.PI) * .2 : 0; });
      seedOrigins.forEach((origin, i) => {
        seedPositions[i * 3] = origin[0] + Math.sin(t * .19 + i) * .4;
        seedPositions[i * 3 + 1] = origin[1] + Math.sin(t * .3 + i * 2) * .22;
        seedPositions[i * 3 + 2] = origin[2] + Math.cos(t * .24 + i) * .2;
      });
      seedGeometry.attributes.position.needsUpdate = true;
      const selected = state.active || hover;
      const selectedObject = selected === "resident" ? anchors.resident?.parent : null;
      selection.visible = !!selectedObject;
      if (selectedObject) { selectedObject.getWorldPosition(selection.position); selection.position.y = .18; selection.scale.setScalar(state.state.sceneIndex === 1 ? 1.7 : 1.25); }
      scene.updateMatrixWorld();
      try { renderer.render(scene, camera); }
      catch { failed = true; callbacks.onHover(null); callbacks.onFailure(); return; }
      projectTargets(); dirty = false;
      canvas.dataset.sceneIndex = String(state.state.sceneIndex);
      canvas.dataset.arrivalProgress = arrival.toFixed(2);
      canvas.dataset.travelProgress = travel.toFixed(2);
      canvas.dataset.motion = state.reducedMotion ? "reduced" : state.paused ? "paused" : "animated";
    }
    // Set guards before invoking React callbacks: they may synchronously replace this scene.
    if (arrival === 1 && !arrivalSent) { arrivalSent = true; callbacks.onArrival(); }
    if (state.travelling && travel === 1 && !travelSent) { travelSent = true; callbacks.onTravelComplete(); }
    if (moving && !disposed) frame = requestAnimationFrame(render);
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
      if (next.travelling !== state.travelling) { travel = 0; travelSent = false; }
      state = next; dirty = true; wake();
    },
    control(action) {
      if (action === "left") yaw = Math.max(-.5, yaw - .16);
      if (action === "right") yaw = Math.min(.57, yaw + .16);
      if (action === "in") zoom = Math.min(1.45, zoom + .12);
      if (action === "out") zoom = Math.max(.85, zoom - .12);
      if (action === "reset") { yaw = .12; tilt = .49; zoom = 1; }
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
