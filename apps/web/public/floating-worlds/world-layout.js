// World-space staging: equal-scale landmarks recede along one alternating route.
export function arrangeWorlds(islands, aspect) {
  const portrait=aspect<.8;
  const positions=portrait
    ? [[-80,175,350],[150,30,-450],[-190,220,-1500],[340,180,-2650],[70,430,-4300]]
    : [[-260,207,350],[410,30,-300],[-275,220,-1200],[800,180,-2100],[375,430,-3600]];
  const widths=portrait?[260,350,350,380,400]:[300,420,350,400,400];
  const compression=portrait?1:Math.min(1,aspect/1.65);
  islands.forEach((island,index)=>{
    island.pos=[positions[index][0]*compression,positions[index][1],positions[index][2]];
    island.width=widths[index];
    island.rotY=[-.08,.06,-.05,-.08,.02][index];
    island.farYaw=0;
    island.tilt=[0,0];
    island.portrait=portrait;
  });
}

export function overviewPose(aspect, position, look) {
  if(aspect<.8){position.set(0,280,1150);look.set(0,-100,-1300);}
  else {position.set(0,250,1000);look.set(0,-100,-1000);}
}

export function createCloudRoute(islands) {
  const points=[[islands[0].portrait?120:350,-210,1250,300],...islands.map((island,index)=>[
    island.pos.x+island.W*(index===0?.25:.05),
    island.pos.y-island.H*(index===0?.15:.03),
    island.pos.z+island.W*.30,
    [130,125,100,90,70][index],
  ])];
  function sample(progress,out={}) {
    const p=Math.max(0,Math.min(points.length-1,progress));
    const i=Math.min(points.length-2,Math.floor(p)),t=p-i;
    const ease=t*t*(3-2*t),a=points[i],b=points[i+1];
    out.x=a[0]+(b[0]-a[0])*ease;
    out.y=a[1]+(b[1]-a[1])*ease;
    out.z=a[2]+(b[2]-a[2])*t;
    out.width=a[3]+(b[3]-a[3])*ease;
    return out;
  }
  return {points,sample,length:points.length-1};
}
