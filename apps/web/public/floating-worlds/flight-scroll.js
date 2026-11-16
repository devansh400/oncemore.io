const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const PAUSE_MS = 120;
const RELEASE_MS = 180;

export function wheelPixels(event, viewportHeight) {
  if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return 0;
  const unit = event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? viewportHeight : 1;
  return clamp(event.deltaY * unit, -180, 180);
}

/** Continuous scroll position with a brief, softly released island hold. */
export function createFlightScroll({stopCount, onArrive = () => {}, reducedMotion = false}) {
  const last = stopCount - 1;
  const state = {position:0, target:0, velocity:0, stop:0, active:false, reducedMotion, holding:false, holdUntil:0};
  let reducedPixels = 0;
  let lastDirection = 0;
  let departurePending = false;
  let departureStart = null;
  let departurePosition = 0;
  let departed = false;

  function notify(index) {
    if (state.stop === index) return;
    state.stop = index;
    onArrive(index);
  }

  function jump(index) {
    state.position = state.target = state.stop = clamp(Math.round(index), 0, last);
    state.velocity = 0;
    state.active = false;
    reducedPixels = 0;
    lastDirection = 0;
    state.holding = false;
    state.holdUntil = 0;
    departurePending = false;
    departureStart = null;
    departed = false;
    onArrive(state.stop);
  }

  function goTo(index) {
    const destination = clamp(Math.round(index), 0, last);
    if (state.reducedMotion) return jump(destination);
    state.target = destination;
    lastDirection = Math.sign(destination - state.position);
  }

  function inputPixels(pixels, _now, touch = false) {
    if (!Number.isFinite(pixels) || pixels === 0) return;
    if (state.reducedMotion) {
      reducedPixels += pixels;
      if (Math.abs(reducedPixels) >= (touch ? 80 : 160)) jump(state.stop + Math.sign(reducedPixels));
      return;
    }
    const direction = Math.sign(pixels);
    if (lastDirection !== 0 && direction !== lastDirection) state.target = state.position;
    lastDirection = direction;
    const distance = clamp(pixels, -180, 180) / (touch ? 650 : 1100);
    state.target = clamp(state.target + distance, 0, last);
    // Keep buffered gestures bounded while preserving proportional input.
    state.target = clamp(state.target, Math.max(0, state.position - 1.35), Math.min(last, state.position + 1.35));
  }

  function update(deltaSeconds, now = performance.now()) {
    if (state.reducedMotion) return state;
    if(now < state.holdUntil){state.holding=true;state.active=false;return state;}
    state.holding=false;
    const dt = Math.min(clamp(deltaSeconds, 0, .12),Math.max(0,(now-state.holdUntil)/1000));
    if (dt === 0) return state;
    const direction=Math.sign(state.target-state.position);
    const rounded=Math.round(state.position);
    const atIsland=Math.abs(state.position-rounded)<1e-8;
    const boundary=direction>0?(atIsland?rounded+1:Math.ceil(state.position))
      :(atIsland?rounded-1:Math.floor(state.position));
    let goal=direction>0?Math.min(state.target,boundary):direction<0?Math.max(state.target,boundary):state.target;
    if(departurePending&&Math.abs(goal-departurePosition)>1e-8){
      if(departureStart===null)departureStart=Math.max(state.holdUntil,now-dt*1000);
      const t=clamp((now-departureStart)/RELEASE_MS,0,1);
      const release=t*t*t*(t*(t*6-15)+10);
      goal=departurePosition+(goal-departurePosition)*release;
      if(t===1)departurePending=false;
    }
    // Analytic damping brakes softly; the release ramp prevents a restart kick.
    const omega = 7.5;
    const offset = state.position - goal;
    const momentum = state.velocity + omega * offset;
    const decay = Math.exp(-omega * dt);
    const previous = state.position;
    const next = goal + (offset + momentum * dt) * decay;
    state.position = clamp(next, 0, last);
    state.velocity = next < 0 || next > last ? 0 : (state.velocity - omega * momentum * dt) * decay;
    const movement=state.position-previous;
    const previousNode=Math.round(previous),wasAtIsland=Math.abs(previous-previousNode)<1e-8;
    const crossing=movement>0?(wasAtIsland?previousNode+1:Math.ceil(previous))
      :(wasAtIsland?previousNode-1:Math.floor(previous));
    const crossed=movement>0?state.position>=crossing:movement<0&&state.position<=crossing;
    const arrival=crossed?clamp(crossing,0,last):goal,index=Math.round(arrival);
    if(Math.abs(state.position-state.stop)>.025)departed=true;
    if(Math.abs(arrival-index)<1e-8&&(crossed||(Math.abs(state.position-index)<.0015&&Math.abs(state.velocity)<.012))){
      const arrived=departed||state.stop!==index;
      state.position=index;state.velocity=0;
      if(arrived){
        notify(index);state.holdUntil=now+PAUSE_MS;state.holding=true;
        departurePosition=index;departurePending=true;departureStart=null;
        departed=false;
      }
    }
    if (Math.abs(state.position - state.target) < 1e-7 && Math.abs(state.velocity) < 1e-5) {
      state.position = state.target;
      state.velocity = 0;
    }
    // A user can rest near an island without snapping the camera onto it.
    const nearest = Math.round(state.position);
    if (Math.abs(state.velocity) < .012 && Math.abs(state.position - nearest) < .025) notify(nearest);
    state.active = !state.holding&&(Math.abs(state.position - state.stop) > .025 || Math.abs(state.velocity) > .012);
    return state;
  }

  return {state, inputPixels, goTo, jump, update,
    setReducedMotion(value) {state.reducedMotion = value; jump(Math.round(state.position));}};
}
