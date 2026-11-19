import { mountFloatingWorlds } from "./app.js";

const element = (id) => document.getElementById(id);
const numerals = ["I", "II", "III", "IV", "V"];
const dots = element("dots");
const title = element("title");
const lookList = element("lookList");
const presets = element("lookPresets");
const output = element("lookCode");
const pathToggle = element("hideCloudPath");
const vignetteToggle = element("enableEdgeVignette");
const fields = new Map();
let currentStop = -1;

const scene = mountFloatingWorlds(element("gl"), {
  onProgress: (progress) => {
    element("bar").style.transform = `scaleX(${progress})`;
  },
  onVeil: (opacity) => {
    element("veil").style.opacity = opacity;
  },
  ignoreInput: (event) => event.target?.closest?.("#look,#lookBtn"),
  onError: () => {
    element("loader").querySelector("span").textContent = "The 3D sky is unavailable";
  },
  onScene: ({ stop, worlds, ready, moving, moved, diving, inside }) => {
    if (!dots.children.length) {
      [null, ...worlds].forEach((world, index) => {
        const button = document.createElement("button");
        button.setAttribute(
          "aria-label",
          world ? `Go to island ${index}: ${world.title}` : "All islands",
        );
        button.addEventListener("click", () => scene.goTo(index));
        dots.append(button);
      });
    }
    if (stop !== currentStop) {
      currentStop = stop;
      const island = worlds[stop - 1];
      const kicker = island ? `Island ${numerals[stop - 1]}` : "Five floating worlds";
      element("kicker").textContent = kicker;
      element("counter").textContent =
        `${String(stop).padStart(2, "0")} / ${String(worlds.length).padStart(2, "0")}`;
      title.replaceChildren();
      island?.title.split(" ").forEach((word, index) => {
        const wrapper = document.createElement("span");
        const text = document.createElement("span");
        wrapper.className = "w";
        text.textContent = word;
        text.style.transitionDelay = `${index * 70}ms`;
        wrapper.append(text);
        title.append(wrapper, " ");
      });
      title.classList.toggle("soon", island?.title === "Coming Soon");
      element("inTitle").textContent = island?.title ?? "";
      element("inKicker").textContent = kicker;
      element("inNote").textContent = "This world is still being built.";
      Array.from(dots.children).forEach((button, index) =>
        button.classList.toggle("on", index === stop),
      );
    }
    document.body.classList.toggle("wide", stop === 0);
    document.body.classList.toggle("moved", moved);
    document.body.classList.toggle("diving", diving);
    element("loader").classList.toggle("done", ready);
    element("block").classList.toggle("on", ready && !moving && !diving);
    element("inside").classList.toggle("on", inside);
    element("inside").setAttribute("aria-hidden", String(!inside));
  },
  onLook: ({
    name,
    presets: names,
    controls,
    values,
    hideCloudPath,
    edgeVignetteEnabled,
    code,
  }) => {
    if (!fields.size) {
      names.forEach((preset) => {
        const button = document.createElement("button");
        button.textContent = preset;
        button.addEventListener("click", () => scene.setPreset(preset));
        presets.append(button);
      });
      controls.forEach(([key, caption, min, max]) => {
        const label = document.createElement("label");
        const text = document.createElement("span");
        const value = document.createElement("b");
        const input = document.createElement("input");
        text.textContent = caption;
        Object.assign(input, { type: "range", min, max, step: 0.01 });
        input.addEventListener("input", () => scene.setLookValue(key, input.valueAsNumber));
        label.append(text, value, input);
        lookList.append(label);
        fields.set(key, { value, input });
      });
    }
    Array.from(presets.children).forEach((button) =>
      button.classList.toggle("on", button.textContent === name),
    );
    fields.forEach(({ value, input }, key) => {
      input.value = values[key];
      value.textContent = values[key].toFixed(2);
      input.disabled = key === "vignette" && !edgeVignetteEnabled;
    });
    pathToggle.checked = hideCloudPath;
    vignetteToggle.checked = edgeVignetteEnabled;
    element("vig").hidden = !edgeVignetteEnabled;
    output.value = code;
  },
});

window.__world = scene.debug;
element("enterBtn").addEventListener("click", scene.enter);
element("back").addEventListener("click", scene.leave);
element("lookBtn").addEventListener("click", (event) => {
  const open = element("look").classList.toggle("on");
  document.body.classList.toggle("looking", open);
  event.currentTarget.setAttribute("aria-expanded", String(open));
});
pathToggle.addEventListener("change", () => scene.setCloudPathHidden(pathToggle.checked));
vignetteToggle.addEventListener("change", () => scene.setVignetteEnabled(vignetteToggle.checked));
element("lookReset").addEventListener("click", scene.resetLook);
element("lookCopy").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(output.value);
    button.textContent = "Copied";
  } catch {
    output.select();
    button.textContent = "Select and copy";
  }
  setTimeout(() => {
    button.textContent = "Copy settings";
  }, 1600);
});
