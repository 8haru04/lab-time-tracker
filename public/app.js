const installButton = document.getElementById("installButton");
const installHint = document.getElementById("installHint");
const labName = document.getElementById("labName");
const tagline = document.getElementById("tagline");
const heroTitle = document.getElementById("heroTitle");
const heroDescription = document.getElementById("heroDescription");
const moduleGrid = document.getElementById("moduleGrid");
const principlesList = document.getElementById("principlesList");
const nextDecisionsList = document.getElementById("nextDecisionsList");
const notesList = document.getElementById("notesList");
const versionValue = document.getElementById("versionValue");
const urlValue = document.getElementById("urlValue");
const connectionValue = document.getElementById("connectionValue");
const modeValue = document.getElementById("modeValue");
const securityValue = document.getElementById("securityValue");
const visibilityValue = document.getElementById("visibilityValue");
const apiValue = document.getElementById("apiValue");

const FALLBACK_CONFIG = {
  appName: "Lab Shared Hub",
  labName: "Lab Shared Hub",
  tagline: "A base that anyone with the URL can open from desktop or mobile.",
  heroTitle: "Set up the public URL first, then grow the tool later",
  description:
    "This foundation keeps deployment simple now and leaves room for attendance, schedules, bookings, and other lab workflows later.",
  deployment: {
    visibility: "Anyone who knows the URL",
    apiBaseUrl: ""
  },
  modules: [
    {
      title: "Attendance And Presence",
      summary: "Start with a simple list and manual updates, then expand to check-in history if needed.",
      status: "planned"
    },
    {
      title: "Lab Schedule",
      summary: "Add shared events, deadlines, seminars, and visitors without changing the public entry point.",
      status: "planned"
    },
    {
      title: "Equipment Booking",
      summary: "Use the same foundation later for room or equipment reservations.",
      status: "planned"
    }
  ],
  principles: [
    "Make the shared URL usable before adding complex features.",
    "Delay authentication and edit permissions until the need is clear.",
    "Keep the frontend decoupled from any future API."
  ],
  nextDecisions: [
    "Who can only view and who can edit.",
    "Where data should live: browser storage, an API, or a database.",
    "Whether editing should stay public-by-URL or become restricted."
  ],
  notes: [
    "The app includes noindex and robots.txt to reduce accidental search discovery.",
    "This is not strong security. Anyone with the URL can still open it.",
    "A backend can be added later without replacing the current entry page."
  ],
  version: "foundation"
};

let deferredPrompt = null;

function mergeConfig(config) {
  return {
    ...FALLBACK_CONFIG,
    ...config,
    deployment: {
      ...FALLBACK_CONFIG.deployment,
      ...(config.deployment || {})
    },
    modules: Array.isArray(config.modules) ? config.modules : FALLBACK_CONFIG.modules,
    principles: Array.isArray(config.principles) ? config.principles : FALLBACK_CONFIG.principles,
    nextDecisions: Array.isArray(config.nextDecisions)
      ? config.nextDecisions
      : FALLBACK_CONFIG.nextDecisions,
    notes: Array.isArray(config.notes) ? config.notes : FALLBACK_CONFIG.notes
  };
}

function updateConnectionState() {
  connectionValue.textContent = navigator.onLine ? "online" : "offline";
}

function updateDisplayMode() {
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  modeValue.textContent = isStandalone ? "app" : "browser";
}

function updateRuntimeDetails(config) {
  urlValue.textContent = window.location.href;
  securityValue.textContent = window.isSecureContext ? "secure" : "not secure";
  visibilityValue.textContent = config.deployment.visibility;
  apiValue.textContent = config.deployment.apiBaseUrl || "not connected";
}

function setInstallState(options) {
  installButton.disabled = !options.enabled;
  installHint.textContent = options.text;
}

function renderList(target, items) {
  target.replaceChildren();

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    target.appendChild(li);
  });
}

function getStatusLabel(status) {
  switch (status) {
    case "draft":
      return "draft";
    case "ready":
      return "ready";
    default:
      return "planned";
  }
}

function renderModules(items) {
  moduleGrid.replaceChildren();

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Future modules will appear here.";
    moduleGrid.appendChild(empty);
    return;
  }

  items.forEach((item, index) => {
    const article = document.createElement("article");
    const toneClass = `tone-${(index % 3) + 1}`;
    const status = getStatusLabel(item.status);

    article.className = `module-card ${toneClass}`;

    const kicker = document.createElement("p");
    kicker.className = "module-kicker";
    kicker.textContent = "Module";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const summary = document.createElement("p");
    summary.textContent = item.summary;

    const badge = document.createElement("span");
    badge.className = `status-badge status-${status}`;
    badge.textContent = status;

    article.append(kicker, title, summary, badge);
    moduleGrid.appendChild(article);
  });
}

function renderConfig(config) {
  document.title = config.appName;
  labName.textContent = config.labName;
  tagline.textContent = config.tagline;
  heroTitle.textContent = config.heroTitle;
  heroDescription.textContent = config.description;
  versionValue.textContent = config.version || "foundation";

  renderModules(config.modules);
  renderList(principlesList, config.principles);
  renderList(nextDecisionsList, config.nextDecisions);
  renderList(notesList, config.notes);
  updateRuntimeDetails(config);
}

async function loadConfig() {
  try {
    const response = await fetch("./app-config.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`config request failed: ${response.status}`);
    }

    const config = await response.json();
    return mergeConfig(config);
  } catch (error) {
    console.warn("Falling back to built-in config.", error);
    return FALLBACK_CONFIG;
  }
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    setInstallState({
      enabled: false,
      text: "This browser does not support service workers."
    });
    return;
  }

  if (!window.isSecureContext) {
    setInstallState({
      enabled: false,
      text: "PWA behavior is most reliable on HTTPS or localhost."
    });
    return;
  }

  try {
    await navigator.serviceWorker.register("./service-worker.js");
  } catch (error) {
    setInstallState({
      enabled: false,
      text: "Service worker registration failed. Check HTTPS delivery."
    });
  }
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;

  setInstallState({
    enabled: true,
    text: "This device can install the app."
  });
});

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
  updateDisplayMode();
  setInstallState({
    enabled: false,
    text: "The app was installed."
  });
});

installButton.addEventListener("click", async () => {
  if (!deferredPrompt) {
    setInstallState({
      enabled: false,
      text: "The install prompt is not available yet in this browser."
    });
    return;
  }

  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;

  setInstallState({
    enabled: false,
    text: "Install state was checked."
  });
});

window.addEventListener("online", updateConnectionState);
window.addEventListener("offline", updateConnectionState);

async function init() {
  updateConnectionState();
  updateDisplayMode();
  setInstallState({
    enabled: false,
    text: "Open this over HTTPS or localhost to make app installation easier."
  });

  const config = await loadConfig();
  renderConfig(config);
  await registerServiceWorker();
}

init();
