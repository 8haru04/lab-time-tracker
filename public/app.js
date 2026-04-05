const installButton = document.getElementById("installButton");
const installHint = document.getElementById("installHint");
const labName = document.getElementById("labName");
const tagline = document.getElementById("tagline");
const heroTitle = document.getElementById("heroTitle");
const heroDescription = document.getElementById("heroDescription");
const summaryGrid = document.getElementById("summaryGrid");
const versionValue = document.getElementById("versionValue");
const urlValue = document.getElementById("urlValue");
const connectionValue = document.getElementById("connectionValue");
const modeValue = document.getElementById("modeValue");
const securityValue = document.getElementById("securityValue");
const visibilityValue = document.getElementById("visibilityValue");
const apiValue = document.getElementById("apiValue");
const sidebarLinks = Array.from(document.querySelectorAll(".sidebar-link"));
const sections = sidebarLinks
  .map((link) => document.getElementById(link.dataset.section))
  .filter(Boolean);

const FALLBACK_CONFIG = {
  appName: "人間工学研究室 共有ダッシュボード",
  labName: "人間工学研究室",
  tagline: "URL を知っているメンバーが、PC とスマートフォンから開ける共有ダッシュボードです。",
  heroTitle: "研究室業務を一つの画面に集約する",
  heroDescription:
    "左側の固定サイドバーから、在室管理、スケジュール管理、マイタスク、打刻、設定へ移動できる初期UIです。",
  deployment: {
    visibility: "URL を知っている人が利用可能",
    apiBaseUrl: ""
  },
  summaryCards: [
    {
      label: "カテゴリ数",
      value: "5",
      note: "在室管理から設定まで"
    },
    {
      label: "公開方式",
      value: "公開URL",
      note: "静的サイトとして配信中"
    },
    {
      label: "現在の段階",
      value: "試作UI",
      note: "次に各カテゴリを詳細化"
    }
  ],
  version: "基盤-2026-04"
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
    summaryCards: Array.isArray(config.summaryCards)
      ? config.summaryCards
      : FALLBACK_CONFIG.summaryCards
  };
}

function updateConnectionState() {
  connectionValue.textContent = navigator.onLine ? "オンライン" : "オフライン";
}

function updateDisplayMode() {
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  modeValue.textContent = isStandalone ? "アプリ" : "ブラウザ";
}

function updateRuntimeDetails(config) {
  urlValue.textContent = window.location.href;
  securityValue.textContent = window.isSecureContext ? "はい" : "いいえ";
  visibilityValue.textContent = config.deployment.visibility;
  apiValue.textContent = config.deployment.apiBaseUrl || "未接続";
}

function setInstallState(options) {
  installButton.disabled = !options.enabled;
  installHint.textContent = options.text;
}

function renderSummaryCards(items) {
  summaryGrid.replaceChildren();

  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "summary-card";

    const label = document.createElement("span");
    label.textContent = item.label;

    const value = document.createElement("strong");
    value.textContent = item.value;

    const note = document.createElement("small");
    note.textContent = item.note;

    article.append(label, value, note);
    summaryGrid.appendChild(article);
  });
}

function setActiveSidebarLink(sectionId) {
  sidebarLinks.forEach((link) => {
    const isActive = link.dataset.section === sectionId;
    link.classList.toggle("is-active", isActive);
  });
}

function setupSidebarNavigation() {
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setActiveSidebarLink(link.dataset.section);
    });
  });

  if (!("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSidebarLink(entry.target.id);
        }
      });
    },
    {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0.15
    }
  );

  sections.forEach((section) => observer.observe(section));
}

function renderConfig(config) {
  document.title = config.appName;
  labName.textContent = config.labName;
  tagline.textContent = config.tagline;
  heroTitle.textContent = config.heroTitle;
  heroDescription.textContent = config.heroDescription;
  versionValue.textContent = config.version || "基盤";

  renderSummaryCards(config.summaryCards);
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
    console.warn("設定ファイルの読み込みに失敗したため、既定値を使います。", error);
    return FALLBACK_CONFIG;
  }
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    setInstallState({
      enabled: false,
      text: "このブラウザは Service Worker に対応していません。"
    });
    return;
  }

  if (!window.isSecureContext) {
    setInstallState({
      enabled: false,
      text: "PWA は HTTPS または localhost で最も安定して動作します。"
    });
    return;
  }

  try {
    await navigator.serviceWorker.register("./service-worker.js");
  } catch (error) {
    setInstallState({
      enabled: false,
      text: "Service Worker の登録に失敗しました。HTTPS 配信を確認してください。"
    });
  }
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;

  setInstallState({
    enabled: true,
    text: "この端末ではアプリとして追加できます。"
  });
});

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
  updateDisplayMode();
  setInstallState({
    enabled: false,
    text: "アプリとして追加されました。"
  });
});

installButton.addEventListener("click", async () => {
  if (!deferredPrompt) {
    setInstallState({
      enabled: false,
      text: "このブラウザでは、まだインストール案内が表示されていません。"
    });
    return;
  }

  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;

  setInstallState({
    enabled: false,
    text: "インストール状態を確認しました。"
  });
});

window.addEventListener("online", updateConnectionState);
window.addEventListener("offline", updateConnectionState);

async function init() {
  updateConnectionState();
  updateDisplayMode();
  setInstallState({
    enabled: false,
    text: "HTTPS または localhost で開くと、アプリとして追加しやすくなります。"
  });

  const config = await loadConfig();
  renderConfig(config);
  setupSidebarNavigation();
  await registerServiceWorker();
}

init();
