import {expect,test} from 'bun:test';
import {PerspectiveCamera,Vector3} from 'three';
import {arrangeWorlds,overviewPose,createCloudRoute} from '../public/floating-worlds/world-layout.js';

function layout(aspect){
  const islands=[{px:[1163,1272]},{px:[1330,836]},{px:[1738,820]},{px:[1530,891]},{px:[1396,908]}];
  arrangeWorlds(islands,aspect);
  for(const island of islands){island.pos=new Vector3(...island.pos);island.W=island.width;island.H=island.W*island.px[1]/island.px[0];}
  const camera=new PerspectiveCamera(aspect<.8?56:42,aspect,2,12000),look=new Vector3();
  overviewPose(aspect,camera.position,look);camera.lookAt(look);camera.updateMatrixWorld();
  const width=(point,size)=>{
    const a=point.clone().add(new Vector3(-size/2,0,0)).project(camera);
    const b=point.clone().add(new Vector3(size/2,0,0)).project(camera);
    return Math.abs(b.x-a.x);
  };
  return {islands,camera,width};
}

test('opening composition has a dominant foreground and a receding zigzag',()=>{
  const {islands,camera,width}=layout(16/9);
  const sizes=islands.map(i=>width(i.pos,i.W));
  expect(sizes[0]/sizes[1]).toBeGreaterThan(1.3);
  expect(sizes[0]/sizes[4]).toBeGreaterThan(4.5);
  for(let i=1;i<islands.length;i++)expect(islands[i].pos.z).toBeLessThan(islands[i-1].pos.z);
  const xs=islands.map(i=>i.pos.clone().project(camera).x);
  expect(xs[0]).toBeLessThan(0);expect(xs[1]).toBeGreaterThan(0);
  expect(xs[2]).toBeLessThan(0);expect(xs[3]).toBeGreaterThan(0);
});

test('the cloud road has real perspective taper and connects every island',()=>{
  const {islands,width}=layout(16/9),route=createCloudRoute(islands);
  const near=route.sample(.7),far=route.sample(4.5);
  expect(width(new Vector3(near.x,near.y,near.z),near.width)/width(new Vector3(far.x,far.y,far.z),far.width)).toBeGreaterThan(5);
  islands.forEach((island,i)=>{
    const p=route.sample(i+1);
    expect(Math.abs(p.x-island.pos.x)).toBeLessThan(island.W*.4);
    expect(Math.abs(p.y-island.pos.y)).toBeLessThan(island.H*.2);
    expect(p.z-island.pos.z).toBeLessThan(island.W*.4);
  });
});

test('mobile staging keeps a foreground hierarchy and a visible route',()=>{
  const {islands,camera,width}=layout(390/844);
  expect(width(islands[0].pos,islands[0].W)/width(islands[4].pos,islands[4].W)).toBeGreaterThan(3);
  for(const island of islands)expect(Math.abs(island.pos.clone().project(camera).x)).toBeLessThan(1);
});
