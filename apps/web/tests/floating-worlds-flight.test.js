import {describe, expect, test} from 'bun:test';
import {Matrix4, PerspectiveCamera, Quaternion, Vector3} from 'three';
import {createFlightScroll, wheelPixels} from '../public/floating-worlds/flight-scroll.js';
import {createFlightCamera} from '../public/floating-worlds/flight-camera.js';

function simulate(scroll, seconds, hz=60, start=0) {
  const frames=Math.round(seconds*hz);
  for(let frame=1;frame<=frames;frame++)scroll.update(1/hz,start+frame*1000/hz);
}

describe('Floating Worlds continuous flight',()=>{
  test('holds for only 120 ms and resumes without a departure jump',()=>{
    const scroll=createFlightScroll({stopCount:6});scroll.goTo(3);
    let now=0;
    while(!scroll.state.holding&&now<5000){now+=1000/60;scroll.update(1/60,now);}
    expect(scroll.state.position).toBe(1);
    expect(scroll.state.holdUntil-now).toBeCloseTo(120,6);
    const release=scroll.state.holdUntil;
    scroll.inputPixels(30,now+50);
    scroll.update(.1,release-1);
    expect(scroll.state.position).toBe(1);
    scroll.update(.12,release+2);
    expect(scroll.state.holding).toBe(false);
    expect(scroll.state.position-1).toBeLessThan(.00001);
    simulate(scroll,.5,60,release+2);
    expect(scroll.state.position).toBeGreaterThan(1.1);
  });
  test('does not snap a released scroll gesture to a nearby island',()=>{
    const scroll=createFlightScroll({stopCount:6});
    scroll.jump(1);scroll.inputPixels(30,0);
    simulate(scroll,3);
    expect(scroll.state.position).toBeCloseTo(1+30/1100,6);
  });

  test('a wheel notch moves part of the route instead of launching a complete flight',()=>{
    const scroll=createFlightScroll({stopCount:6});
    scroll.inputPixels(120,0);
    simulate(scroll,2);
    expect(scroll.state.position).toBeGreaterThan(.10);
    expect(scroll.state.position).toBeLessThan(.12);
    expect(scroll.state.stop).toBe(0);
  });

  test('direct navigation visits every island',()=>{
    const visits=[];
    const scroll=createFlightScroll({stopCount:6,onArrive:index=>visits.push(index)});
    scroll.goTo(5,0);
    simulate(scroll,20);
    expect(visits).toEqual([1,2,3,4,5]);
    expect(scroll.state.position).toBe(5);
  });

  test('reverses smoothly mid-flight without resetting position or velocity',()=>{
    const scroll=createFlightScroll({stopCount:6});
    scroll.goTo(1,0);simulate(scroll,.3);
    const {position,velocity}=scroll.state;
    scroll.inputPixels(-180,300);
    scroll.inputPixels(-180,301);
    scroll.inputPixels(-180,302);
    scroll.inputPixels(-180,303);
    scroll.inputPixels(-180,304);
    scroll.inputPixels(-180,305);
    expect(scroll.state.position).toBe(position);
    expect(scroll.state.velocity).toBe(velocity);
    scroll.update(1/120,310);
    expect(Math.abs(scroll.state.position-position)).toBeLessThan(.02);
    simulate(scroll,3,60,310);
    expect(scroll.state.position).toBe(0);
  });

  test('tracking has the same result at 30, 60 and 120 fps',()=>{
    const results=[30,60,120].map(hz=>{
      const scroll=createFlightScroll({stopCount:6});
      scroll.inputPixels(180,0);scroll.inputPixels(180,0);scroll.inputPixels(180,0);
      simulate(scroll,.5,hz);
      return scroll.state.position;
    });
    expect(Math.max(...results)-Math.min(...results)).toBeLessThan(1e-8);
  });

  test('one reverse gesture brakes immediately instead of draining queued forward input',()=>{
    const scroll=createFlightScroll({stopCount:6});
    scroll.goTo(5,0);simulate(scroll,.3);
    const position=scroll.state.position,velocity=scroll.state.velocity;
    scroll.inputPixels(-40,300);
    expect(scroll.state.target).toBeLessThan(position);
    expect(scroll.state.velocity).toBe(velocity);
    simulate(scroll,.5,60,300);
    expect(scroll.state.velocity).toBeLessThan(0);
  });

  test('touch drags use incremental distance without a swipe-to-next threshold',()=>{
    const scroll=createFlightScroll({stopCount:6});
    scroll.inputPixels(20,0,true);scroll.inputPixels(20,30,true);
    simulate(scroll,.3);
    expect(scroll.state.position).toBeGreaterThan(.02);
    expect(scroll.state.position).toBeLessThan(.065);
    expect(scroll.state.stop).toBe(0);
  });

  test('does not wrap from the last island back to the overview',()=>{
    const scroll=createFlightScroll({stopCount:6});scroll.jump(5,0);
    for(let i=0;i<50;i++)scroll.inputPixels(180,i);
    simulate(scroll,3);
    expect(scroll.state.position).toBe(5);
    scroll.jump(0,0);scroll.inputPixels(-180,0);simulate(scroll,2);
    expect(scroll.state.position).toBe(0);
  });

  test('reduced motion changes stations without smooth camera travel',()=>{
    const scroll=createFlightScroll({stopCount:6,reducedMotion:true});
    scroll.inputPixels(180,0);
    expect(scroll.state.position).toBe(1);
    scroll.inputPixels(180,200);
    expect(scroll.state.position).toBe(2);
    scroll.inputPixels(180,251);
    expect(scroll.state.position).toBe(3);
    scroll.goTo(5,1100);
    expect(scroll.state.position).toBe(5);
  });

  test('normalizes wheel units and preserves pinch zoom and horizontal gestures',()=>{
    expect(wheelPixels({deltaX:0,deltaY:3,deltaMode:1},800)).toBe(54);
    expect(wheelPixels({deltaX:0,deltaY:1,deltaMode:2},800)).toBe(180);
    expect(wheelPixels({deltaX:0,deltaY:120,ctrlKey:true},800)).toBe(0);
    expect(wheelPixels({deltaX:100,deltaY:10},800)).toBe(0);
  });
});

test('camera route stays continuous and reaches every exact station',()=>{
  const stops=[new Vector3(0,30,650),new Vector3(-170,-40,450),new Vector3(260,-80,340),new Vector3(-430,100,-80),new Vector3(430,40,-220),new Vector3(20,200,-560)];
  const rig=createFlightCamera({Vector3,Quaternion,Matrix4,stopCount:stops.length,
    buildPose(index,position,look){position.copy(stops[index]);look.copy(stops[index]).add(new Vector3(0,0,-150));}});
  rig.rebuild();const camera=new PerspectiveCamera();
  for(let i=0;i<stops.length;i++){
    rig.update({position:i,velocity:0},camera,1/60,{reducedMotion:true});
    expect(camera.position.distanceTo(stops[i])).toBeLessThan(1e-8);
  }
  for(let i=1;i<stops.length-1;i++){
    rig.update({position:i-.0001,velocity:1},camera,1/60,{reducedMotion:true});
    const before=camera.position.distanceTo(stops[i]);
    rig.update({position:i+.0001,velocity:1},camera,1/60,{reducedMotion:true});
    const after=camera.position.distanceTo(stops[i]);
    expect(Math.min(before,after)).toBeGreaterThan(.01);
    expect(Math.abs(before-after)/Math.max(before,after)).toBeLessThan(.08);
  }
  const previous=new Vector3();
  for(let p=0;p<=5;p+=.002){
    rig.update({position:p,velocity:.4},camera,1/60,{reducedMotion:true});
    expect(Number.isFinite(camera.quaternion.w)).toBe(true);
    if(p>0)expect(camera.position.distanceTo(previous)).toBeLessThan(3);
    previous.copy(camera.position);
  }
});
