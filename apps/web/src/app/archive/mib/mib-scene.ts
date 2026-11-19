import * as T from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const smooth = (n: number) => n * n * (3 - 2 * n);
const mix = T.MathUtils.lerp;
const seeded = (i: number) => {
  const n = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return n - Math.floor(n);
};

/** All transforms are pure functions of master progress. No clock or simulation runs. */
export async function mountCinema(
  host: HTMLElement,
  section: HTMLElement,
  cancelled: () => boolean,
) {
  gsap.registerPlugin(ScrollTrigger);
  const image = new Image();
  image.src = "/mib/opening.webp";
  const raisedImage = new Image();
  raisedImage.src = "/mib/raised-pose.webp";
  await Promise.all([image.decode(), raisedImage.decode()]);
  if (cancelled()) return;

  const renderer = new T.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "default",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x651724);
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  host.prepend(renderer.domElement);
  renderer.domElement.setAttribute("aria-hidden", "true");

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(36, 1, 0.025, 180);
  const textures: T.Texture[] = [];
  const geometries: T.BufferGeometry[] = [];
  const materials: T.Material[] = [];
  const ownGeometry = <G extends T.BufferGeometry>(g: G) => {
    geometries.push(g);
    return g;
  };
  const ownMaterial = <M extends T.Material>(m: M) => {
    materials.push(m);
    return m;
  };
  const canvasTexture = (canvas: HTMLCanvasElement, color = true) => {
    const texture = new T.CanvasTexture(canvas);
    if (color) texture.colorSpace = T.SRGBColorSpace;
    textures.push(texture);
    return texture;
  };
  const canvas = (width: number, height: number) => {
    const c = document.createElement("canvas");
    c.width = width;
    c.height = height;
    return c;
  };

  // Preserve the exact opening. A matched still pose is the brief's 2.5D fallback.
  const photo = canvas(1545, 1018);
  photo.getContext("2d")!.drawImage(image, 0, 0);
  const originalTexture = canvasTexture(photo);
  const plate = canvas(1545, 1018);
  // The unoccupied right-hand region supplies the texture, shadows and exact red palette.
  const plateContext = plate.getContext("2d")!;
  plateContext.drawImage(image, 835, 0, 710, 1018, 0, 0, 1545, 1018);
  const plateTexture = canvasTexture(plate);
  scene.background = plateTexture;
  const planeGeometry = ownGeometry(new T.PlaneGeometry(15.45, 10.18));

  function photoLayer(map: T.Texture) {
    const material = ownMaterial(
      new T.MeshBasicMaterial({ map, transparent: true, depthWrite: false, toneMapped: false }),
    );
    return new T.Mesh(planeGeometry, material);
  }

  const raisedCanvas = canvas(1545, 1018);
  raisedCanvas.getContext("2d")!.drawImage(raisedImage, 0, 0, 1545, 1018);
  const raised = photoLayer(canvasTexture(raisedCanvas));
  raised.position.z = 0.01;
  scene.add(raised);
  const opening = photoLayer(originalTexture);
  opening.position.z = 0.02;
  scene.add(opening);
  opening.renderOrder = 2;
  raised.renderOrder = 1;

  const pmrem = new T.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.05);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.9;
  room.dispose();
  pmrem.dispose();
  scene.add(new T.HemisphereLight(0xffd5ad, 0x390512, 2));
  const key = new T.DirectionalLight(0xffd8ae, 5);
  key.position.set(-3, 5, 7);
  scene.add(key);
  const rim = new T.DirectionalLight(0xf74330, 5);
  rim.position.set(5, 1, -3);
  scene.add(rim);
  const pulseLight = new T.PointLight(0xffbd64, 0, 16, 1.5);
  pulseLight.position.set(1.5, 0.3, 1);
  scene.add(pulseLight);

  function surface(wood: boolean) {
    const c = canvas(256, 256);
    const context = c.getContext("2d")!;
    context.fillStyle = wood ? "#64321d" : "#667078";
    context.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1800; i++) {
      const x = seeded(i + 4) * 256;
      const y = seeded(i + 1900) * 256;
      context.strokeStyle = wood
        ? `rgba(26,9,3,${seeded(i + 3) * 0.4})`
        : `rgba(10,15,20,${seeded(i + 3) * 0.3})`;
      context.lineWidth = wood ? 0.6 : 0.35;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + (wood ? 20 : 2), y + seeded(i + 600) * 2);
      context.stroke();
    }
    const map = canvasTexture(c);
    map.wrapS = map.wrapT = T.RepeatWrapping;
    return map;
  }
  const woodMap = surface(true);
  const steelMap = surface(false);
  const steel = ownMaterial(
    new T.MeshStandardMaterial({
      color: 0x42484b,
      map: steelMap,
      metalness: 0.94,
      roughness: 0.29,
      bumpMap: steelMap,
      bumpScale: 0.012,
      transparent: true,
    }),
  );
  const edge = ownMaterial(
    new T.MeshStandardMaterial({
      color: 0x414346,
      map: steelMap,
      metalness: 0.94,
      roughness: 0.38,
      transparent: true,
    }),
  );
  const bore = ownMaterial(
    new T.MeshBasicMaterial({ color: 0x050305, side: T.DoubleSide, transparent: true }),
  );
  const gun = new T.Group();
  scene.add(gun);
  function gunMesh(geometry: T.BufferGeometry, material: T.Material, z: number) {
    const m = new T.Mesh(ownGeometry(geometry), material);
    m.position.z = z;
    gun.add(m);
    return m;
  }
  // Open, hollow muzzle; the bore has actual depth instead of a capped cylinder.
  const tube = gunMesh(new T.CylinderGeometry(0.132, 0.155, 3.8, 48, 1, true), steel, -1.9);
  tube.rotation.x = Math.PI / 2;
  gunMesh(new T.RingGeometry(0.091, 0.134, 64), edge, 0.004);
  const inner = gunMesh(new T.CylinderGeometry(0.091, 0.091, 0.75, 48, 1, true), bore, -0.37);
  inner.rotation.x = Math.PI / 2;
  gunMesh(new T.CircleGeometry(0.12, 48), bore, -0.75);
  for (const z of [-0.05, -1.1, -2.8]) {
    const ring = gunMesh(new T.TorusGeometry(0.14, 0.018, 12, 48), steel, z);
    ring.rotation.z = 0.1;
  }
  const sight = gunMesh(new T.BoxGeometry(0.035, 0.15, 0.1), steel, -0.25);
  sight.position.y = 0.18;
  // Only model the close-up barrel. The matched pose supplies the stock and hands;
  // they have left the camera frustum before this handoff finishes.

  const copper = ownMaterial(
    new T.MeshStandardMaterial({
      color: 0xc88b4b,
      metalness: 0.94,
      roughness: 0.24,
      map: woodMap,
      bumpMap: steelMap,
      bumpScale: 0.002,
    }),
  );
  const projectile = new T.Group();
  scene.add(projectile);
  // Projectile only: no cartridge casing flies out of the muzzle.
  const profile = [
    [0, -0.3],
    [0.083, -0.3],
    [0.093, -0.27],
    [0.095, -0.18],
    [0.094, 0.08],
    [0.083, 0.2],
    [0.062, 0.32],
    [0.035, 0.41],
    [0, 0.47],
  ].map(([x, y]) => new T.Vector2(x, y));
  const bullet = new T.Mesh(ownGeometry(new T.LatheGeometry(profile, 48)), copper);
  bullet.rotation.x = Math.PI / 2;
  projectile.add(bullet);
  const grooveMaterial = ownMaterial(
    new T.MeshStandardMaterial({ color: 0x825029, metalness: 0.9, roughness: 0.3 }),
  );
  for (const z of [-0.19, -0.14]) {
    const groove = new T.Mesh(
      ownGeometry(new T.TorusGeometry(0.095, 0.006, 8, 40)),
      grooveMaterial,
    );
    groove.position.z = z;
    projectile.add(groove);
  }

  function glowTexture() {
    const c = canvas(128, 128);
    const context = c.getContext("2d")!;
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.15, "rgba(255,238,192,.95)");
    gradient.addColorStop(0.4, "rgba(255,135,44,.5)");
    gradient.addColorStop(1, "rgba(180,50,18,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    return canvasTexture(c);
  }
  const glow = glowTexture();
  const flashMaterial = ownMaterial(
    new T.SpriteMaterial({
      map: glow,
      blending: T.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    }),
  );
  const flash = new T.Sprite(flashMaterial);
  scene.add(flash);
  const smokeTextureCanvas = canvas(128, 128);
  const smokeContext = smokeTextureCanvas.getContext("2d")!;
  const smokeGradient = smokeContext.createRadialGradient(64, 64, 0, 64, 64, 64);
  smokeGradient.addColorStop(0, "rgba(205,175,165,.4)");
  smokeGradient.addColorStop(0.35, "rgba(166,142,139,.24)");
  smokeGradient.addColorStop(1, "rgba(100,70,80,0)");
  smokeContext.fillStyle = smokeGradient;
  smokeContext.fillRect(0, 0, 128, 128);
  const smokeTexture = canvasTexture(smokeTextureCanvas);
  const smoke = Array.from({ length: 18 }, () => {
    const material = ownMaterial(
      new T.SpriteMaterial({ map: smokeTexture, transparent: true, depthWrite: false, opacity: 0 }),
    );
    const sprite = new T.Sprite(material);
    scene.add(sprite);
    return sprite;
  });
  const sparks = Array.from({ length: 22 }, () => {
    const material = ownMaterial(
      new T.SpriteMaterial({
        map: glow,
        color: 0xffa549,
        blending: T.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    );
    const sprite = new T.Sprite(material);
    scene.add(sprite);
    return sprite;
  });

  let width = 1,
    height = 1,
    progress = 0,
    disposed = false;
  const look = new T.Vector3();
  const muzzle = new T.Vector3();
  const destination = new T.Vector3();
  const progressBar = host.querySelector<HTMLElement>(".mib-progress span");
  const cue = host.querySelector<HTMLElement>(".mib-scroll-cue");

  function render(p: number) {
    if (disposed) return;
    progress = p;
    const mobile = width / height < 0.8;
    const lift = smooth(range(p, 0.16, 0.285));
    const push = smooth(range(p, 0.32, 0.525));
    const handoff = smooth(range(p, 0.4, 0.475));
    const track = smooth(range(p, 0.59, 0.86));
    const exit = smooth(range(p, 0.87, 1));
    opening.material.opacity = 1 - lift;
    raised.material.opacity = 1 - smooth(range(p, 0.405, 0.475));
    raised.visible = p < 0.475;
    gun.position.set(4.275, 0.75, 0.12);
    gun.rotation.set(0, mix(Math.PI / 2, 0, smooth(range(p, 0.455, 0.525))), 0);
    gun.visible = p > 0.31 && p < 0.72;
    [steel, edge, bore].forEach((m) => (m.opacity = handoff * (1 - smooth(range(p, 0.63, 0.71)))));
    gun.updateMatrixWorld(true);
    gun.getWorldPosition(muzzle);

    // Fit the opening exactly as object-fit: cover, with a portrait-specific crop.
    const aspect = width / height;
    const fitHeight = Math.min(10.18, 15.45 / aspect);
    const startDistance = fitHeight / (2 * Math.tan(T.MathUtils.degToRad(18)));
    const startX = mobile ? -2.4 : 0;
    camera.position.set(
      mix(startX, muzzle.x + 0.035, push),
      mix(0, muzzle.y + 0.015, push),
      mix(startDistance, 1.38, push),
    );
    look.set(mix(startX, muzzle.x, push), mix(0, muzzle.y, push), 0);

    const flight = range(p, 0.565, 0.87);
    const distance = flight * 18 + exit * 65;
    projectile.visible = p >= 0.565 && p < 0.998;
    projectile.position.set(
      muzzle.x + Math.sin(flight * 2) * 0.35,
      muzzle.y + Math.sin(flight * 3) * 0.12,
      distance,
    );
    projectile.rotation.set(0, flight * 0.14, flight * 28);
    // Orbit to the flank, then trail behind the projectile before letting it go.
    if (p > 0.565) {
      const orbit = smooth(range(p, 0.565, 0.72));
      const angle = mix(0, 2.15, orbit);
      const lead = mix(1.38, mobile ? 4.3 : 2.4, mobile ? smooth(range(p, 0.565, 0.72)) : track);
      const followZ = Math.min(distance, 18);
      destination.set(
        projectile.position.x + Math.sin(angle) * lead,
        projectile.position.y + 0.12,
        followZ + Math.cos(angle) * lead,
      );
      camera.position.copy(destination);
      look.set(
        mix(muzzle.x, projectile.position.x, orbit),
        mix(muzzle.y, projectile.position.y, orbit),
        mix(0, distance, orbit),
      );
    }
    // A single restrained flash, still completely controlled by scroll position.
    const pulse = Math.pow(Math.max(0, 1 - Math.abs(p - 0.55) / 0.014), 2);
    flash.position.copy(muzzle);
    flash.position.z += 0.15;
    flash.scale.set(2.6 * pulse, 1.6 * pulse, 1);
    flashMaterial.opacity = pulse;
    pulseLight.position.copy(flash.position);
    pulseLight.intensity = pulse * 38;
    if (pulse > 0) camera.position.x += Math.sin(p * 2400) * pulse * 0.012;
    const smokeAge = range(p, 0.55, 0.82);
    smoke.forEach((s, i) => {
      const age = clamp(smokeAge - seeded(i + 50) * 0.15);
      s.position.set(
        muzzle.x + Math.sin(i * 2.4) * age * 1.9,
        muzzle.y + age * (0.5 + seeded(i + 40) * 1.5),
        age * (1 + seeded(i + 30) * 3),
      );
      s.scale.setScalar(0.12 + age * (1.2 + seeded(i + 20) * 2));
      s.material.opacity = p > 0.55 ? Math.sin(age * Math.PI) * 0.42 * (1 - track) : 0;
      s.material.rotation = i + age * 0.8;
    });
    sparks.forEach((s, i) => {
      const age = range(p, 0.55, 0.63);
      const a = seeded(i + 140) * Math.PI * 2;
      s.position.set(
        muzzle.x + Math.cos(a) * age * 2,
        muzzle.y + Math.sin(a) * age * 1.2,
        age * (1 + seeded(i + 60) * 3),
      );
      s.scale.set(0.015, 0.015 + age * 0.08, 1);
      s.material.opacity = p > 0.55 ? (1 - age) * 0.8 : 0;
    });
    camera.lookAt(look);
    if (cue) cue.style.opacity = String(0.7 * (1 - range(p, 0, 0.07)));
    if (progressBar) progressBar.style.transform = `scaleX(${p})`;
    section.dataset.progress = p.toFixed(4);
    renderer.render(scene, camera);
  }

  const resize = () => {
    width = host.clientWidth;
    height = host.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    render(progress);
  };
  resize();
  let context: gsap.Context;
  context = gsap.context(() => {
    const state = { progress: 0 };
    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        id: "mib-cinema",
        trigger: section,
        start: "top top",
        end: () => `+=${Math.round(innerHeight * 7)}`,
        pin: host,
        scrub: true,
        invalidateOnRefresh: true,
      },
      onUpdate: () => render(state.progress),
    });
    timeline.to(state, { progress: 1, duration: 1 }, 0);
    for (const [name, p] of Object.entries({
      establish: 0,
      lift: 0.14,
      pushIn: 0.32,
      barrel: 0.525,
      shot: 0.55,
      emergence: 0.565,
      tracking: 0.66,
      exit: 0.87,
      handoff: 1,
    }))
      timeline.addLabel(name, p);
  }, section);
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  const onLost = (event: Event) => {
    event.preventDefault();
    cleanup();
  };
  renderer.domElement.addEventListener("webglcontextlost", onLost);
  const onVisibility = () => {
    if (!document.hidden) render(progress);
  };
  document.addEventListener("visibilitychange", onVisibility);
  section.dataset.ready = "true";
  render(progress);
  ScrollTrigger.refresh();

  function cleanup() {
    if (disposed) return;
    disposed = true;
    context.revert();
    observer.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    renderer.domElement.removeEventListener("webglcontextlost", onLost);
    delete section.dataset.ready;
    delete section.dataset.progress;
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
    environment.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    cue?.style.removeProperty("opacity");
    progressBar?.style.removeProperty("transform");
  }
  return cleanup;
}
