// Atmosphere extensions for the original bundled Floating Worlds scene.
// Reuse its cloud atlas, instancing, noise, lighting and adaptive quality settings.
export const islandAir = /* glsl */ `
  float lowerRock = 1. - smoothstep(.10, .62, vUv.y);
  float recess = (1. - dp.r) * (1. - warmE);
  float exposed = smoothstep(.16, .72, ao);
  vec3 skyBounce = vec3(.038, .057, .088) * uLook.x;
  col += skyBounce * lowerRock * exposed * (.55 + .45 * skyL) * lowlight;
  // Local air remains visible at close range, where distance fog alone vanishes.
  float tendril = texture2D(uNoise, vW.xy * .009 + uTime * vec2(.0018, .0007)).g;
  float localAir = lowerRock * (.27 + .18 * tendril) + recess * .055 + edge * .045;
  float airStrength = min(uLook.z, 1.8);
  vec3 localColour = fogCol(dir) + sunGlow(dir) * .32;
  col = mix(col, localColour, min(localAir * airStrength * lowlight, .55));
  col = mix(col, fogCol(dir), fogAmt(dist, uFogD * 1.18));
`;

export const cloudInteraction = /* glsl */ `
uniform vec3 uIslandCenters[5];
uniform float uIslandRadii[5];
vec2 islandWeather(vec3 p) {
  float shadow = 0.;
  float glow = 0.;
  for (int i = 0; i < 5; i++) {
    vec3 delta = p - uIslandCenters[i];
    float below = max(-delta.y, 0.);
    vec2 shadowOffset = delta.xz + uSun.xz * min(below * 1.5, 170.);
    float radius = uIslandRadii[i] * .72 + below * .12;
    shadow = max(shadow, exp(-dot(shadowOffset, shadowOffset) / (radius * radius) * 2.4)
      * smoothstep(4., 35., below) * exp(-below * .003));
    vec3 lamp = delta - vec3(0., uIslandRadii[i] * .14, 0.);
    glow = max(glow, exp(-dot(lamp, lamp) / (uIslandRadii[i] * uIslandRadii[i]) * 8.));
  }
  return vec2(shadow, glow);
}
`;

export function addAtmosphereClouds(islands, add, mobile) {
  islands.forEach((island, index) => {
    const w = island.W;
    const h = island.H;
    // Wisps at different depths cross the rock, leaving the upper landmarks clear.
    const ribbons = [
      [-.24, -.22, .42, 1.55, .32, .50, 10],
      [.30, -.38, .48, 1.30, .34, .58, 8],
      [-.06, -.57, .36, 1.85, .40, .62, 11],
      [.48, -.08, .03, .84, .30, .24, 10],
      [-.55, -.35, -.10, 1.02, .28, .36, 8],
    ];
    for (const [x, y, z, width, height, alpha, tile] of ribbons) {
      add({anchor:index, ox:x*w, oy:y*h, oz:z*w, sx:width*w,
        sy:height*w, alpha, vx:0, kind:3, tile,
        ph:index*1.71+x*4, amp:.09, x:0, y:0, z:0});
    }
  });

  // A small number of fixed world-space veils supplies real camera parallax.
  const veils = [
    [-290, -75, 430, 290, 46, .18],
    [285, -135, 360, 320, 54, .22],
    [-70, 20, -90, 410, 48, .14],
    [390, 80, -540, 430, 58, .17],
    [-420, 145, -760, 450, 55, .16],
  ];
  veils.slice(0, mobile ? 3 : veils.length).forEach(([x,y,z,sx,sy,alpha], i) => {
    add({x,y,z,sx,sy,alpha,vx:.6,kind:4,tile:7+i%3});
  });
}

// One quiet cascade on the garden island; its spray disappears into the lower mist.
export function addWaterfall({island, origin, Mesh, PlaneGeometry, ShaderMaterial,
  doubleSide, common, uniforms}) {
  const height = island.H * .86;
  const geometry = new PlaneGeometry(island.W * .035, height, 8, 32);
  const material = new ShaderMaterial({
    transparent:true, depthWrite:false, side:doubleSide,
    uniforms,
    vertexShader: /* glsl */ `
      varying vec2 vUv; varying vec3 vW;
      uniform float uTime;
      void main() {
        vUv=uv;
        vec3 p=position;
        float fall=1.-uv.y;
        p.x+=sin(fall*7.+uTime*.7)*fall*.28;
        vec4 world=modelMatrix*vec4(p,1.);
        vW=world.xyz;
        gl_Position=projectionMatrix*viewMatrix*world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime,uFogD;
      uniform vec3 uCam;
      uniform sampler2D uNoise;
      varying vec2 vUv; varying vec3 vW;
      ${common}
      void main() {
        float fall=1.-vUv.y;
        float stream=texture2D(uNoise,vec2(vUv.x*1.8,fall*2.-uTime*.23)).g;
        float width=mix(.20,.47,fall);
        float edge=1.-smoothstep(width*.36,width,abs(vUv.x-.5));
        float alpha=edge*(.20+.40*stream)*smoothstep(0.,.035,fall)
          *(1.-smoothstep(.28,1.,fall));
        vec3 delta=vW-uCam; float dist=length(delta); vec3 dir=delta/dist;
        vec3 col=vec3(.20,.27,.34)*uLook.x;
        col+=vec3(.28,.15,.065)*max(dot(dir,uSun),0.)*uLook.y;
        col=mix(col,fogCol(dir),fogAmt(dist,uFogD));
        gl_FragColor=vec4(col,alpha);
      }
    `,
  });
  const mesh=new Mesh(geometry,material);
  mesh.position.copy(origin);
  mesh.position.y-=height*.5;
  island.group.add(mesh);
}
