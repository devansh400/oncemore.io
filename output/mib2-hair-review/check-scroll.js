(async () => {
const scene = document.querySelector('[data-loading]');
const start = scene.getBoundingClientRect().top + scrollY;
const end = scene.querySelector('[data-shot-end]').getBoundingClientRect().top + scrollY;
const results = [];
for (const frame of [0,15,30,45,55,56,57,60,329,57,30,0]) {
  scrollTo({top:start+(end-start)*(frame/329)*(11/16),behavior:'instant'});
  await new Promise(r=>setTimeout(r,700));
  results.push({requested:frame,drawn:Number(scene.dataset.frame),fallback:scene.dataset.fallback||null,loading:scene.dataset.loading});
}
const resources = performance.getEntriesByType('resource').filter(r=>r.name.includes('/frames/'));
return JSON.stringify({results, frameRequests:resources.length,originalFrameRequests:resources.filter(r=>r.name.includes('/maa-inti-bangaaram/v2/')).length, repairedFrameRequests:resources.filter(r=>r.name.includes('/mib2/hair-clean-v1/')).length, overflow:document.documentElement.scrollWidth>innerWidth});
})();
