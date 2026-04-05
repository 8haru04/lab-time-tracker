const STORAGE_KEY = "ergonomics-lab-permissions-v3";
const CATEGORIES = [
  {
    key: "presence",
    label: "在室管理",
    description: "研究室メンバーの在室状況を扱う画面です。"
  },
  {
    key: "schedule",
    label: "スケジュール管理",
    description: "研究室の予定や共有スケジュールを扱う画面です。"
  },
  {
    key: "tasks",
    label: "マイタスク",
    description: "個人のタスクを整理する画面です。"
  },
  {
    key: "clock",
    label: "打刻",
    description: "入室・退出などの打刻を扱う画面です。"
  },
  {
    key: "settings",
    label: "設定",
    description: "ログイン情報や権限管理を扱う画面です。"
  }
];

const FALLBACK_CONFIG = {
  appName: "人間工学研究室 共有ツール",
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

const authView = document.getElementById("authView");
const workspaceView = document.getElementById("workspaceView");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const roleSelect = document.getElementById("roleSelect");
const userIdInput = document.getElementById("userIdInput");
const labName = document.getElementById("labName");
const sidebarLabName = document.getElementById("sidebarLabName");
const tagline = document.getElementById("tagline");
const loginDescription = document.getElementById("loginDescription");
const workspaceNav = document.getElementById("workspaceNav");
const sidebarUserText = document.getElementById("sidebarUserText");
const workspaceTitle = document.getElementById("workspaceTitle");
const workspaceDescription = document.getElementById("workspaceDescription");
const currentUserBadge = document.getElementById("currentUserBadge");
const logoutButton = document.getElementById("logoutButton");
const currentUserCard = document.getElementById("currentUserCard");
const permissionSummary = document.getElementById("permissionSummary");
const settingsNotice = document.getElementById("settingsNotice");
const adminSection = document.getElementById("adminSection");
const memberSection = document.getElementById("memberSection");
const memberTable = document.getElementById("memberTable");
const memberForm = document.getElementById("memberForm");
const memberNameInput = document.getElementById("memberNameInput");
const memberIdInput = document.getElementById("memberIdInput");
const memberRoleSelect = document.getElementById("memberRoleSelect");
const memberFormMessage = document.getElementById("memberFormMessage");

let appConfig = FALLBACK_CONFIG;
let memberDirectory = [];
let currentUser = null;
let activeCategory = null;

function buildOwnerRecord(config) {
  const permissions = {};

  CATEGORIES.forEach((category) => {
    permissions[category.key] = true;
  });

  return {
    id: config.ownerUser.id,
    displayName: config.ownerUser.displayName || config.ownerUser.id,
    role: config.ownerUser.role,
    isOwner: true,
    permissions
  };
}

function createEmptyPermissions() {
  const permissions = {};

  CATEGORIES.forEach((category) => {
    permissions[category.key] = false;
  });

  return permissions;
}

function normalizePermissions(rawPermissions) {
  return {
    ...createEmptyPermissions(),
    ...(rawPermissions && typeof rawPermissions === "object" ? rawPermissions : {})
  };
}

function normalizeMember(rawMember) {
  if (!rawMember || typeof rawMember !== "object") {
    return null;
  }

  const id = String(rawMember.id || "").trim();
  const role = String(rawMember.role || "").trim();

  if (!id || !role) {
    return null;
  }

  return {
    id,
    displayName: String(rawMember.displayName || id).trim() || id,
    role,
    isOwner: false,
    permissions: normalizePermissions(rawMember.permissions)
  };
}

function loadStoredDirectory(config) {
  const owner = buildOwnerRecord(config);

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const others = Array.isArray(parsed)
      ? parsed.map(normalizeMember).filter(Boolean).filter((member) => member.id !== owner.id)
      : [];

    return [owner, ...others];
  } catch (error) {
    console.warn("保存済みユーザーデータを読み込めませんでした。初期状態を利用します。", error);
    return [owner];
  }
}

function saveDirectory() {
  const others = memberDirectory.filter((member) => !member.isOwner);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(others));
}

function isOwner(member) {
  return Boolean(member && member.id === appConfig.ownerUser.id);
}

function canManagePermissions(member) {
  return isOwner(member);
}

function hasCategoryAccess(member, categoryKey) {
  return Boolean(member && member.permissions && member.permissions[categoryKey]);
}

function getAccessibleCategories(member) {
  return CATEGORIES.filter((category) => hasCategoryAccess(member, category.key));
}

function findMemberById(id) {
  return memberDirectory.find((member) => member.id === id) || null;
}

function renderRoleOptions(target, roles) {
  if (!target) {
    return;
  }

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
  sidebarLabName.textContent = config.labName;
  tagline.textContent = config.tagline;
  loginDescription.textContent = config.loginDescription;
  renderRoleOptions(roleSelect, config.userRoles);
  renderRoleOptions(memberRoleSelect, config.userRoles);
}

function updateHash(categoryKey) {
  const nextHash = categoryKey && categoryKey !== "empty" ? `#${categoryKey}` : "";

  if (window.location.hash !== nextHash) {
    history.replaceState(null, "", nextHash || window.location.pathname);
  }
}

function resolvePreferredCategory() {
  const accessible = getAccessibleCategories(currentUser);
  const hashKey = window.location.hash.replace(/^#/, "");

  if (hashKey && accessible.some((category) => category.key === hashKey)) {
    return hashKey;
  }

  if (activeCategory && accessible.some((category) => category.key === activeCategory)) {
    return activeCategory;
  }

  return accessible[0]?.key || "empty";
}

function setActiveCategory(categoryKey) {
  if (!currentUser) {
    return;
  }

  if (categoryKey !== "empty" && !hasCategoryAccess(currentUser, categoryKey)) {
    return;
  }

  activeCategory = categoryKey;
  updateHash(categoryKey);
  renderWorkspace();
}

function createNavButton(category) {
  const button = document.createElement("button");
  const allowed = hasCategoryAccess(currentUser, category.key);
  const active = activeCategory === category.key;

  button.type = "button";
  button.className = `nav-button${active ? " is-active" : ""}${allowed ? "" : " is-disabled"}`;
  button.disabled = !allowed;
  button.setAttribute("aria-current", active ? "page" : "false");
  button.innerHTML = `<strong>${category.label}</strong><small>${allowed ? "画面を開く" : "権限がありません"}</small>`;

  if (allowed) {
    button.addEventListener("click", () => {
      setActiveCategory(category.key);
    });
  }

  return button;
}

function renderSidebar() {
  workspaceNav.replaceChildren();

  CATEGORIES.forEach((category) => {
    workspaceNav.appendChild(createNavButton(category));
  });
}

function renderHeader() {
  if (activeCategory === "empty") {
    workspaceTitle.textContent = "利用できるカテゴリがありません";
    workspaceDescription.textContent = "管理者が権限を付与すると、ここから各画面へ切り替えられます。";
    return;
  }

  const currentCategory = CATEGORIES.find((category) => category.key === activeCategory);
  if (!currentCategory) {
    return;
  }

  workspaceTitle.textContent = currentCategory.label;
  workspaceDescription.textContent = currentCategory.description;
}

function createInfoBox(title, value) {
  const box = document.createElement("div");
  box.className = "info-box";
  box.innerHTML = `<strong>${title}</strong><small>${value}</small>`;
  return box;
}

function renderCurrentUserSummary() {
  currentUserCard.replaceChildren();
  permissionSummary.replaceChildren();

  currentUserCard.append(
    createInfoBox("表示名", currentUser.displayName),
    createInfoBox("利用者番号", currentUser.id),
    createInfoBox("ユーザー区分", currentUser.role),
    createInfoBox("権限レベル", isOwner(currentUser) ? "最上位管理者" : "一般ユーザー")
  );

  CATEGORIES.forEach((category) => {
    const chip = document.createElement("span");
    chip.className = `permission-chip${hasCategoryAccess(currentUser, category.key) ? "" : " is-off"}`;
    chip.textContent = category.label;
    permissionSummary.appendChild(chip);
  });
}

function createPermissionControl(member, category) {
  if (!canManagePermissions(currentUser)) {
    const chip = document.createElement("span");
    chip.className = `permission-chip${hasCategoryAccess(member, category.key) ? "" : " is-off"}`;
    chip.textContent = category.label;
    return chip;
  }

  const label = document.createElement("label");
  label.className = "permission-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = hasCategoryAccess(member, category.key);
  checkbox.disabled = member.isOwner;
  checkbox.addEventListener("change", () => {
    member.permissions[category.key] = checkbox.checked;
    saveDirectory();

    if (currentUser && currentUser.id === member.id) {
      currentUser = member;
      activeCategory = resolvePreferredCategory();
    }

    renderWorkspace();
  });

  const text = document.createElement("span");
  text.textContent = category.label;

  label.append(checkbox, text);
  return label;
}

function renderMemberTable() {
  memberTable.replaceChildren();

  memberDirectory.forEach((member) => {
    const row = document.createElement("article");
    row.className = "member-row";

    const memberCard = document.createElement("div");
    memberCard.className = "member-card";
    memberCard.innerHTML = `
      <strong>${member.displayName}</strong>
      <small>${member.id}</small>
      <small>${member.role}${member.isOwner ? " / 最上位管理者" : ""}</small>
    `;

    const permissionGrid = document.createElement("div");
    permissionGrid.className = "permission-grid";

    CATEGORIES.forEach((category) => {
      permissionGrid.appendChild(createPermissionControl(member, category));
    });

    row.append(memberCard, permissionGrid);
    memberTable.appendChild(row);
  });
}

function renderSettings() {
  renderCurrentUserSummary();

  const ownerMessage = "202304193 のみが、すべてのユーザーに対するカテゴリ権限を変更できます。";
  const userMessage = "権限変更は最上位管理者のみが実行できます。";

  settingsNotice.textContent = canManagePermissions(currentUser) ? ownerMessage : userMessage;
  adminSection.hidden = !canManagePermissions(currentUser);
  memberSection.hidden = !canManagePermissions(currentUser);

  if (canManagePermissions(currentUser)) {
    renderMemberTable();
  }
}

function renderViews() {
  const allViews = Array.from(document.querySelectorAll(".workspace-view"));

  allViews.forEach((view) => {
    view.hidden = view.id !== `view-${activeCategory}`;
  });

  if (activeCategory === "settings") {
    renderSettings();
  }
}

function renderWorkspace() {
  if (!currentUser) {
    return;
  }

  activeCategory = resolvePreferredCategory();

  authView.hidden = true;
  workspaceView.hidden = false;
  sidebarUserText.textContent = `${currentUser.displayName} / ${currentUser.id}`;
  currentUserBadge.textContent = isOwner(currentUser) ? "最上位管理者" : currentUser.role;

  renderSidebar();
  renderHeader();
  renderViews();
  updateHash(activeCategory);
}

function resetLoginFormMessage() {
  loginMessage.textContent = "ページを開き直した場合は、利用者番号をもう一度入力してください。";
}

function resetToLogin() {
  currentUser = null;
  activeCategory = null;
  workspaceView.hidden = true;
  authView.hidden = false;
  loginForm.reset();
  roleSelect.value = appConfig.userRoles[0];
  history.replaceState(null, "", window.location.pathname);
  resetLoginFormMessage();
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
    console.warn("設定ファイルを読み込めなかったため、既定値を使用します。", error);
    return FALLBACK_CONFIG;
  }
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !window.isSecureContext) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("./service-worker.js");
    await registration.update();
  } catch (error) {
    console.warn("Service Worker の登録に失敗しました。", error);
  }
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const userId = userIdInput.value.trim();
  const selectedRole = roleSelect.value;
  const member = findMemberById(userId);

  if (!member) {
    loginMessage.textContent = "その利用者番号はまだ登録されていません。管理者に登録を依頼してください。";
    return;
  }

  if (member.role !== selectedRole) {
    loginMessage.textContent = "利用者番号とユーザー区分が一致していません。";
    return;
  }

  currentUser = member;
  activeCategory = resolvePreferredCategory();
  renderWorkspace();
});

memberForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!canManagePermissions(currentUser)) {
    memberFormMessage.textContent = "ユーザー追加は最上位管理者のみが実行できます。";
    return;
  }

  const displayName = memberNameInput.value.trim();
  const memberId = memberIdInput.value.trim();
  const role = memberRoleSelect.value;

  if (!displayName || !memberId) {
    memberFormMessage.textContent = "表示名と利用者番号を入力してください。";
    return;
  }

  if (findMemberById(memberId)) {
    memberFormMessage.textContent = "その利用者番号はすでに登録されています。";
    return;
  }

  memberDirectory.push({
    id: memberId,
    displayName,
    role,
    isOwner: false,
    permissions: createEmptyPermissions()
  });

  saveDirectory();
  memberForm.reset();
  memberRoleSelect.value = appConfig.userRoles[0];
  memberFormMessage.textContent = `${displayName} を追加しました。カテゴリ権限を設定してください。`;
  renderSettings();
});

logoutButton.addEventListener("click", () => {
  resetToLogin();
});

window.addEventListener("hashchange", () => {
  if (!currentUser) {
    return;
  }

  const nextKey = window.location.hash.replace(/^#/, "");
  if (nextKey && hasCategoryAccess(currentUser, nextKey)) {
    activeCategory = nextKey;
    renderWorkspace();
  }
});

async function init() {
  appConfig = await loadConfig();
  memberDirectory = loadStoredDirectory(appConfig);
  renderConfig(appConfig);
  loginForm.reset();
  roleSelect.value = appConfig.userRoles[0];
  resetLoginFormMessage();
  await registerServiceWorker();
}

init();
