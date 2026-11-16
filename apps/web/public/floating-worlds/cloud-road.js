import {createCloudRoute} from './world-layout.js';

// Depth-layered, sorted cloud volumes form a continuous perspective road.
export function createCloudRoad({scene,islands,atlas,noise,shared,common,mobile,
  BufferGeometry,BufferAttribute,InstancedBufferGeometry,InstancedBufferAttribute,
  PlaneGeometry,Mesh,ShaderMaterial,Vector3,DoubleSide}) {
  const route=createCloudRoute(islands);
  const point={},before={},after={};
  const uniforms={uTime:shared.time,uLook:shared.look,uSun:shared.sun,uCam:shared.cam,uFogD:shared.fog,uNoise:{value:noise}};
  // A feathered vapor bed closes gaps when the camera is directly over the road.
  const bedPositions=[],bedUvs=[],bedIndices=[],bedSteps=320;
  for(let j=0;j<=bedSteps;j++){
    const p=j/bedSteps*route.length;
    route.sample(p,point);route.sample(Math.max(0,p-.002),before);route.sample(Math.min(route.length,p+.002),after);
    const dx=after.x-before.x,dz=after.z-before.z,len=Math.hypot(dx,dz)||1;
    for(let side=0;side<2;side++){
      const cross=(side-.5)*point.width;
      bedPositions.push(point.x+dz/len*cross,point.y-14,point.z-dx/len*cross);bedUvs.push(j/bedSteps,side);
    }
    if(j<bedSteps){const a=j*2;bedIndices.push(a,a+2,a+1,a+2,a+3,a+1);}
  }
  const bedGeometry=new BufferGeometry();
  bedGeometry.setAttribute('position',new BufferAttribute(new Float32Array(bedPositions),3));
  bedGeometry.setAttribute('uv',new BufferAttribute(new Float32Array(bedUvs),2));bedGeometry.setIndex(bedIndices);
  const bed=new Mesh(bedGeometry,new ShaderMaterial({transparent:true,depthWrite:false,side:DoubleSide,uniforms,
    vertexShader:`varying vec2 vUv;varying vec3 vW;void main(){vUv=uv;vW=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vW,1.);}`,
    fragmentShader:`precision highp float;uniform sampler2D uNoise;uniform vec3 uCam;uniform float uFogD;varying vec2 vUv;varying vec3 vW;${common}
      void main(){float n=texture2D(uNoise,vW.xz*.014).g;float edge=1.-smoothstep(.10,1.,abs(vUv.y*2.-1.)+(n-.5)*.18);vec3 d=normalize(vW-uCam);
      float dist=length(vW-uCam),depth=smoothstep(450.,3400.,dist);
      vec3 col=mix(vec3(.12,.16,.22),vec3(.31,.28,.25),n)*uLook.x;col=mix(col,fogCol(d),.12+fogAmt(dist,uFogD)*.7);
      gl_FragColor=vec4(col,edge*(.76+.20*n)*mix(1.,.32,depth)*smoothstep(0.,.075,vUv.x));}`,
  }));bed.renderOrder=3;scene.add(bed);
  let seed=7281;const random=()=>((seed=seed*48271%2147483647)/2147483647);
  const clouds=[];
  const add=(x,y,z,sx,sy,alpha=1,tone=1.12)=>clouds.push({x,y,z,sx,sy,alpha,tone,tile:Math.floor(random()*4),phase:random()*6.283,d:0});
  // Overlapping cloud masses give the road its turbulent, pillowy silhouette.
  const steps=mobile?180:300;
  for(let j=0;j<=steps;j++){
    const progress=j/steps*route.length;route.sample(progress,point);
    route.sample(Math.max(0,progress-.002),before);route.sample(Math.min(route.length,progress+.002),after);
    const dx=after.x-before.x,dz=after.z-before.z,len=Math.hypot(dx,dz)||1;
    for(let side=-1;side<=1;side++){
      const lateral=side*point.width*.32+(random()-.5)*point.width*.14;
      const size=point.width*(.65+random()*.45);
      const blend=Math.min(.85,Math.abs(side)*.60+Math.max(0,1-progress)*.35);
      add(point.x+dz/len*lateral,point.y-9+(random()-.5)*14,point.z-dx/len*lateral,size,size*(.62+random()*.14),(.85+random()*.15)*(1-blend*.45),1.12-blend*.34);
    }
    // A sparse, lower skirt bridges the bright road into the surrounding banks.
    if(j%3===0){
      for(const side of [-1,1]){
        const lateral=side*point.width*(.60+random()*.25),size=point.width*(.7+random()*.45);
        add(point.x+dz/len*lateral,point.y-28-random()*18,point.z-dx/len*lateral,size,size*.65,.18+random()*.14,.82);
      }
    }
  }
  // Broad banks below and beside the road establish a deep cloud valley.
  for(let j=0;j<(mobile?40:85);j++){
    const p=random()*route.length;route.sample(p,point);
    const side=random()<.5?-1:1,size=300+random()*500;
    add(point.x+side*(point.width+120+random()*900),point.y-130-random()*200,point.z+(random()-.5)*400,size,size*.65,.72+random()*.25,.70);
  }
  const quad=new PlaneGeometry(1,1),instanced=new InstancedBufferGeometry();
  instanced.index=quad.index;instanced.setAttribute('position',quad.attributes.position);instanced.setAttribute('uv',quad.attributes.uv);
  const centers=new InstancedBufferAttribute(new Float32Array(clouds.length*3),3);
  const sizes=new InstancedBufferAttribute(new Float32Array(clouds.length*4),4);
  const tones=new InstancedBufferAttribute(new Float32Array(clouds.length),1);
  const seeds=new InstancedBufferAttribute(new Float32Array(clouds.length),1);
  instanced.setAttribute('aSeed',seeds);
  instanced.setAttribute('aTone',tones);
  instanced.setAttribute('aCenter',centers);instanced.setAttribute('aSize',sizes);instanced.instanceCount=clouds.length;
  const right=new Vector3(1,0,0),up=new Vector3(0,1,0);
  const billows=new Mesh(instanced,new ShaderMaterial({transparent:true,depthWrite:false,uniforms:{...uniforms,uAtlas:{value:atlas},uRight:{value:right},uUp:{value:up}},
    vertexShader:`attribute vec3 aCenter;attribute vec4 aSize;attribute float aTone,aSeed;uniform vec3 uRight,uUp,uCam;varying vec2 vUv,vLocal;varying vec3 vW;varying float vAlpha;varying float vTone;
      void main(){vec2 tile=vec2(mod(aSize.z,2.),1.-floor(aSize.z/2.));vLocal=uv;vUv=(tile+mix(vec2(.006),vec2(.994),uv))*.5;
      float depth=smoothstep(450.,3400.,length(aCenter-uCam));float density=mix(1.16,.45,depth);
      float keep=1.-smoothstep(density-.15,density+.15,aSeed);
      vAlpha=aSize.w*keep*mix(1.,.55,depth);vTone=aTone;
      vW=aCenter+uRight*position.x*aSize.x+uUp*position.y*aSize.y;gl_Position=projectionMatrix*viewMatrix*vec4(vW,1.);}`,
    fragmentShader:`precision highp float;uniform sampler2D uAtlas;uniform vec3 uCam;uniform float uFogD;varying vec2 vUv,vLocal;varying vec3 vW;varying float vAlpha;varying float vTone;${common}
      void main(){vec4 tex=texture2D(uAtlas,vUv);float dist=length(vW-uCam);float boundaryBlend=1.-smoothstep(.76,1.10,vTone);vec2 edge=min(vLocal,1.-vLocal);float a=tex.a*vAlpha*smoothstep(10.,85.,dist)*smoothstep(0.,mix(.055,.18,boundaryBlend),min(edge.x,edge.y));if(a<.008)discard;
      vec3 d=normalize(vW-uCam),col=pow(tex.rgb,vec3(1.45))*.72*uLook.x*vTone;
      float depth=smoothstep(450.,3400.,dist);
      vec3 air=fogCol(d)+sunGlow(d)*.15;
      col=mix(col,air,.10+.35*depth+.20*boundaryBlend);
      col=mix(col,fogCol(d),fogAmt(dist,uFogD));gl_FragColor=vec4(col,a);}`,
  }));
  billows.frustumCulled=false;billows.renderOrder=6;scene.add(billows);
  let frame=0;
  const lastSort=new Vector3(Infinity,Infinity,Infinity);
  function update(camera){
    right.setFromMatrixColumn(camera.matrixWorld,0);up.setFromMatrixColumn(camera.matrixWorld,1);
    if(frame++%8!==0&&camera.position.distanceToSquared(lastSort)<100)return;
    lastSort.copy(camera.position);
    for(const c of clouds)c.d=(c.x-camera.position.x)**2+(c.y-camera.position.y)**2+(c.z-camera.position.z)**2;
    clouds.sort((a,b)=>b.d-a.d);
    clouds.forEach((c,i)=>{centers.setXYZ(i,c.x,c.y,c.z);sizes.setXYZW(i,c.sx,c.sy,c.tile,c.alpha);tones.setX(i,c.tone);seeds.setX(i,c.phase/6.283);});
    centers.needsUpdate=true;sizes.needsUpdate=true;tones.needsUpdate=true;seeds.needsUpdate=true;
  }
  return {route,update,billows,bed};
}
