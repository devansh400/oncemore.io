const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const ARC_SAMPLES = 256;

/** One continuous, arc-length sampled zigzag route. No moving endpoint tweens. */
export function createFlightCamera({Vector3, Quaternion, Matrix4, stopCount, buildPose}) {
  const positions = Array.from({length:stopCount}, () => new Vector3());
  const looks = positions.map(() => new Vector3());
  const tangents = positions.map(() => new Vector3());
  const lengths = Array.from({length:stopCount - 1}, () => new Float64Array(ARC_SAMPLES+1));
  const speeds = new Float64Array(stopCount);
  const sample = new Vector3(), previous = new Vector3(), up = new Vector3(0,1,0);
  const aim = new Vector3(), right = new Vector3(), cameraUp = new Vector3();
  const matrix = new Matrix4(), orientation = new Quaternion();
  let ambient = 0;
  let initialized = false;

  function curve(segment, t, out) {
    const t2 = t*t, t3 = t2*t;
    return out.set(0,0,0)
      .addScaledVector(positions[segment], 2*t3-3*t2+1)
      .addScaledVector(tangents[segment], t3-2*t2+t)
      .addScaledVector(positions[segment+1], -2*t3+3*t2)
      .addScaledVector(tangents[segment+1], t3-t2);
  }

  function rebuild() {
    for (let i=0; i<stopCount; i++) buildPose(i,positions[i],looks[i]);
    for (let i=0; i<stopCount; i++) {
      const a=Math.max(0,i-1), b=Math.min(stopCount-1,i+1);
      const before=i>0?positions[i].distanceTo(positions[a]):Infinity;
      const after=i<stopCount-1?positions[i].distanceTo(positions[b]):Infinity;
      tangents[i].subVectors(positions[b],positions[a]).normalize()
        .multiplyScalar(Math.min(before,after)*.48);
    }
    for (let segment=0; segment<stopCount-1; segment++) {
      const table=lengths[segment]; table[0]=0;
      curve(segment,0,previous);
      for (let j=1;j<table.length;j++) {
        curve(segment,j/(table.length-1),sample);
        table[j]=table[j-1]+previous.distanceTo(sample);
        previous.copy(sample);
      }
    }
    for (let i=0;i<stopCount;i++) {
      speeds[i]=Math.min(i>0?lengths[i-1][ARC_SAMPLES]:Infinity,i<stopCount-1?lengths[i][ARC_SAMPLES]:Infinity);
    }
  }

  function parameter(segment, fraction) {
    const table=lengths[segment], distance=fraction*table[ARC_SAMPLES];
    let low=0,high=ARC_SAMPLES;
    while(high-low>1){const mid=(low+high)>>1;if(table[mid]<distance)low=mid;else high=mid;}
    return (low+(distance-table[low])/Math.max(1e-8,table[high]-table[low]))/ARC_SAMPLES;
  }

  function update({position,velocity}, camera, dt, {time=0,mx=0,my=0,scale=120,reducedMotion=false}={}) {
    const progress=clamp(position,0,stopCount-1);
    const segment=Math.min(stopCount-2,Math.floor(progress));
    const fraction=progress-segment;
    // Match physical speed across joins between short and long route legs.
    // Positive endpoint slopes keep the camera moving through every island.
    const startSpeed=speeds[segment]/lengths[segment][ARC_SAMPLES];
    const endSpeed=speeds[segment+1]/lengths[segment][ARC_SAMPLES];
    const f2=fraction*fraction,f3=f2*fraction;
    const distanceFraction=(f3-2*f2+fraction)*startSpeed+(-2*f3+3*f2)+(f3-f2)*endSpeed;
    curve(segment,parameter(segment,distanceFraction),camera.position);
    // Aim slightly ahead in transit, settling precisely onto the landmark on arrival.
    const lead=clamp(velocity*.07,-.045,.045)*Math.sin(fraction*Math.PI);
    const lookT=clamp(fraction+lead,0,1);
    const eased=lookT*lookT*(3-2*lookT);
    aim.lerpVectors(looks[segment],looks[segment+1],eased);
    const desiredAmbient=reducedMotion?0:1/(1+Math.abs(velocity)*5);
    ambient+=(desiredAmbient-ambient)*(1-Math.exp(-dt*3));
    if(!reducedMotion){
      right.setFromMatrixColumn(camera.matrixWorld,0);
      cameraUp.setFromMatrixColumn(camera.matrixWorld,1);
      camera.position.addScaledVector(right,(mx*.016+Math.sin(time*.19)*.002)*scale*ambient)
        .addScaledVector(cameraUp,(-my*.009+Math.sin(time*.13+1)*.0015)*scale*ambient);
    }
    orientation.setFromRotationMatrix(matrix.lookAt(camera.position,aim,up));
    if(!initialized||reducedMotion){camera.quaternion.copy(orientation);initialized=true;}
    else camera.quaternion.slerp(orientation,1-Math.exp(-dt*9));
    return aim;
  }

  return {rebuild,update,resetOrientation(){initialized=false;}};
}
