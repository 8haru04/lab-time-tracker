const STORAGE_KEY = "ergonomics-lab-permissions-v1";
const PERMISSIONS = [
  { key: "presence", label: "在室管理" },
  { key: "schedule", label: "スケジュール管理" },
  { key: "tasks", label: "マイタスク" },
  { key: "clock", label: "打刻" },
  { key: "settings", label: "設定" },
  { key: "permissionAdmin", label: "権限管理" }
];

const authView = document.getElementById("authView");
const appView = document.getElementById("appView");
const installButton = document.getElementById("installButton");
const installHint = document.getElementById("installHint");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const roleSelect = document.getElementById("roleSelect");
const userIdInput = document.getElementById("userIdInput");
const memberRoleSelect = document.getElementById("memberRoleSelect");
const memberForm = document.getElementById("memberForm");
const memberFormMessage = document.getElementById("memberFormMessage");
const backToLoginButton = document.getElementById("backToLoginButton");
const adminPanel = document.getElementById("adminPanel");
const adminNotice = document.getElementById("adminNotice");
const memberTable = document.getElementById("memberTable");
const currentUserCard = document.getElementById("currentUserCard");
const permissionSummary = document.getElementById("permissionSummary");
const labName = document.getElementById("labName");
const tagline = document.getElementById("tagline");
const loginDescription = document.getElementById("loginDescription");
const versionValue = document.getElementById("versionValue");
const urlValue = document.getElementById("urlValue");
const connectionValue = document.getElementById("connectionValue");
const modeValue = document.getElementById("modeValue");

const FALLBACK_CONFIG = {
  appName: "人間工学研究室 ログイン",
  labName: "人間工学研究室",
  tagline:
    "研究室の在室管理、スケジュール管理、マイタスク、打刻を一つの入口から利用するための共有ツールです。",
  loginDescription: "利用者番号とユーザー区分でサインインしてください。",
  userRoles: ["教授", "助教", "学部3年", "学部4年", "院1年", "院2年"],
  ownerUser: {
    id: "202304193",
    displayName: "202304193",
    role: "学部4年"
  },
  version: "基盤-2026-04"
};

let deferredPrompt = null;
let appConfig = FALLBACK_CONFIG;
let memberDirectory = [];
let currentUser = null;

function buildOwnerRecord(config) {
  const permissions = {};

  PERMISSIONS.forEach((permission) => {
    permissions[permission.key] = true;
  });

  return {
    id: config.ownerUser.id,
    displayName: config.ownerUser.displayName,
    role: config.ownerUser.role,
    isOwner: true,
    permissions
  };
}

function createEmptyPermissions() {
  const permissions = {};

  PERMISSIONS.forEach((permission) => {
    permissions[permission.key] = false;
  });

  return permissions;
}

function mergeDirectory(savedMembers, config) {
  const ownerRecord = buildOwnerRecord(config);
  const filtered = Array.isArray(savedMembers)
    ? savedMembers.filter((member) => member.id !== ownerRecord.id)
    : [];

  return [ownerRecord, ...filtered];
}

function loadStoredDirectory(config) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return mergeDirectory([], config);
    }

    const parsed = JSON.parse(raw);
    return mergeDirectory(parsed, config);
  } catch (error) {
    console.warn("保存済みの権限設定を読み込めなかったため、初期状態を使用します。", error);
    return mergeDirectory([], config);
  }
}

function saveDirectory() {
  const nonOwnerMembers = memberDirectory.filter((member) => !member.isOwner);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nonOwnerMembers));
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

function updateRuntimeDetails() {
  urlValue.textContent = window.location.href;
}

function setInstallState(options) {
  installButton.disabled = !options.enabled;
  installHint.textContent = options.text;
}

function renderRoleOptions(target, roles) {
  target.replaceChildren();

  roles.forEach((role) => {
    const option = document.createElement("option");
    option.value = role;
    option.textContent = role;
    target.appendChild(option);
  });
}

function renderConfig(config) {
  document.title = config.appName;
  labName.textContent = config.labName;
  tagline.textContent = config.tagline;
  loginDescription.textContent = config.loginDescription;
  versionValue.textContent = config.version || "基盤";
  renderRoleOptions(roleSelect, config.userRoles || FALLBACK_CONFIG.userRoles);
  renderRoleOptions(memberRoleSelect, config.userRoles || FALLBACK_CONFIG.userRoles);
  updateRuntimeDetails();
}

function hasPermission(member, key) {
  return Boolean(member.permissions && member.permissions[key]);
}

function isOwner(member) {
  return Boolean(member && member.id === appConfig.ownerUser.id);
}

function renderCurrentUser() {
  currentUserCard.replaceChildren();

  const name = document.createElement("div");
  name.className = "summary-box";
  name.innerHTML = `<span class="section-kicker">利用者</span><strong>${currentUser.displayName}</strong><small>${currentUser.id} / ${currentUser.role}</small>`;

  const scope = document.createElement("div");
  scope.className = "summary-box";
  scope.innerHTML = `<span class="section-kicker">権限レベル</span><strong>${isOwner(currentUser) ? "最上位管理者" : "一般ユーザー"}</strong><small>${isOwner(currentUser) ? "すべての権限を保有" : "管理者が付与した権限のみ利用可能"}</small>`;

  currentUserCard.append(name, scope);
}

function renderPermissionSummary() {
  permissionSummary.replaceChildren();

  PERMISSIONS.forEach((permission) => {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    const note = document.createElement("small");

    title.textContent = permission.label;
    note.textContent = hasPermission(currentUser, permission.key) ? "利用できます" : "利用できません";

    item.append(title, note);
    permissionSummary.appendChild(item);
  });
}

function createPermissionToggle(member, permission) {
  const label = document.createElement("label");
  label.className = "permission-toggle";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = hasPermission(member, permission.key);
  checkbox.disabled = member.isOwner;
  checkbox.addEventListener("change", () => {
    member.permissions[permission.key] = checkbox.checked;
    saveDirectory();
    if (currentUser && currentUser.id === member.id) {
      currentUser = member;
      renderPermissionSummary();
    }
  });

  const text = document.createElement("span");
  text.textContent = permission.label;

  label.append(checkbox, text);
  return label;
}

function createPermissionBadge(member, permission) {
  const badge = document.createElement("span");
  badge.className = `permission-badge${hasPermission(member, permission.key) ? "" : " is-off"}`;
  badge.textContent = permission.label;
  return badge;
}

function renderMemberTable() {
  memberTable.replaceChildren();

  memberDirectory.forEach((member) => {
    const row = document.createElement("article");
    row.className = "member-row";

    const info = document.createElement("div");
    info.className = "member-cell";
    info.innerHTML = `
      <span class="member-name">${member.displayName}</span>
      <small>${member.id}</small>
      <small>${member.role}${member.isOwner ? " / 最上位管理者" : ""}</small>
    `;

    const status = document.createElement("div");
    status.className = "member-cell";
    status.innerHTML = `
      <strong>権限状態</strong>
      <small>${member.isOwner ? "すべて固定で許可" : "管理者が個別に変更できます"}</small>
    `;

    const permissions = document.createElement("div");
    permissions.className = "permission-grid";

    PERMISSIONS.forEach((permission) => {
      if (isOwner(currentUser)) {
        permissions.appendChild(createPermissionToggle(member, permission));
      } else {
        permissions.appendChild(createPermissionBadge(member, permission));
      }
    });

    row.append(info, status, permissions);
    memberTable.appendChild(row);
  });
}

function renderDashboard() {
  authView.hidden = true;
  appView.hidden = false;
  adminPanel.hidden = !isOwner(currentUser);
  adminNotice.textContent = isOwner(currentUser)
    ? "202304193 のみが権限を変更できます。"
    : "権限変更は最上位管理者のみ実行できます。";

  renderCurrentUser();
  renderPermissionSummary();
  renderMemberTable();
}

function resetToLogin() {
  currentUser = null;
  appView.hidden = true;
  authView.hidden = false;
  loginMessage.textContent = "ログアウトしました。別の利用者番号でも確認できます。";
  loginForm.reset();
  roleSelect.value = appConfig.userRoles[0];
}

function findMemberById(id) {
  return memberDirectory.find((member) => member.id === id) || null;
}

async function loadConfig() {
  try {
    const response = await fetch("./app-config.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`config request failed: ${response.status}`);
    }

    const config = await response.json();
    return {
      ...FALLBACK_CONFIG,
      ...config,
      ownerUser: {
        ...FALLBACK_CONFIG.ownerUser,
        ...(config.ownerUser || {})
      }
    };
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
    const registration = await navigator.serviceWorker.register("./service-worker.js");
    await registration.update();
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

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const userId = userIdInput.value.trim();
  const role = roleSelect.value;
  const member = findMemberById(userId);

  if (!member) {
    loginMessage.textContent = "その利用者番号は未登録です。管理者が追加してからログインしてください。";
    return;
  }

  if (member.role !== role) {
    loginMessage.textContent = "利用者番号とユーザー区分が一致しません。";
    return;
  }

  currentUser = member;
  renderDashboard();
});

memberForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!isOwner(currentUser)) {
    memberFormMessage.textContent = "ユーザー追加は最上位管理者のみ実行できます。";
    return;
  }

  const displayName = document.getElementById("memberNameInput").value.trim();
  const id = document.getElementById("memberIdInput").value.trim();
  const role = memberRoleSelect.value;

  if (!displayName || !id) {
    memberFormMessage.textContent = "表示名と利用者番号を入力してください。";
    return;
  }

  if (findMemberById(id)) {
    memberFormMessage.textContent = "その利用者番号はすでに登録されています。";
    return;
  }

  memberDirectory.push({
    id,
    displayName,
    role,
    isOwner: false,
    permissions: createEmptyPermissions()
  });

  saveDirectory();
  renderMemberTable();
  memberForm.reset();
  memberRoleSelect.value = appConfig.userRoles[0];
  memberFormMessage.textContent = `${displayName} を追加しました。必要な権限をチェックで付与してください。`;
});

backToLoginButton.addEventListener("click", () => {
  resetToLogin();
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

  appConfig = await loadConfig();
  memberDirectory = loadStoredDirectory(appConfig);
  renderConfig(appConfig);
  await registerServiceWorker();
}

init();
