const STORAGE_KEY = "ergonomics-lab-permissions-v4";
const ACTIVE_USER_KEY = "ergonomics-lab-active-user-v1";
const DISPLAY_NAME_OVERRIDES_KEY = "ergonomics-lab-display-names-v1";
const CATEGORIES = [
  {
    key: "presence",
    label: "\u5728\u5ba4\u7ba1\u7406",
    description: "\u7814\u7a76\u5ba4\u30e1\u30f3\u30d0\u30fc\u306e\u5728\u5ba4\u72b6\u6cc1\u3092\u6271\u3046\u753b\u9762\u3067\u3059\u3002"
  },
  {
    key: "schedule",
    label: "\u30b9\u30b1\u30b8\u30e5\u30fc\u30eb\u7ba1\u7406",
    description: "\u7814\u7a76\u5ba4\u306e\u4e88\u5b9a\u3084\u5171\u6709\u30b9\u30b1\u30b8\u30e5\u30fc\u30eb\u3092\u6271\u3046\u753b\u9762\u3067\u3059\u3002"
  },
  {
    key: "tasks",
    label: "\u30de\u30a4\u30bf\u30b9\u30af",
    description: "\u500b\u4eba\u306e\u30bf\u30b9\u30af\u3092\u6574\u7406\u3059\u308b\u753b\u9762\u3067\u3059\u3002"
  },
  {
    key: "clock",
    label: "\u6253\u523b",
    description: "\u5165\u5ba4\u30fb\u9000\u5ba4\u306a\u3069\u306e\u6253\u523b\u3092\u6271\u3046\u753b\u9762\u3067\u3059\u3002"
  },
  {
    key: "settings",
    label: "\u8a2d\u5b9a",
    description: "\u30ed\u30b0\u30a4\u30f3\u60c5\u5831\u3084\u6a29\u9650\u7ba1\u7406\u3092\u6271\u3046\u753b\u9762\u3067\u3059\u3002"
  }
];

const FALLBACK_CONFIG = {
  appName: "\u4eba\u9593\u5de5\u5b66\u7814\u7a76\u5ba4 \u5171\u6709\u30c4\u30fc\u30eb",
  labName: "\u4eba\u9593\u5de5\u5b66\u7814\u7a76\u5ba4",
  tagline:
    "\u7814\u7a76\u5ba4\u306e\u5728\u5ba4\u7ba1\u7406\u3001\u30b9\u30b1\u30b8\u30e5\u30fc\u30eb\u7ba1\u7406\u3001\u30de\u30a4\u30bf\u30b9\u30af\u3001\u6253\u523b\u3092\u4e00\u3064\u306e\u5165\u53e3\u304b\u3089\u5229\u7528\u3059\u308b\u305f\u3081\u306e\u5171\u6709\u30c4\u30fc\u30eb\u3067\u3059\u3002",
  loginDescription:
    "\u30da\u30fc\u30b8\u3092\u958b\u3044\u305f\u3068\u304d\u306f\u3001\u5b66\u7c4d\u756a\u53f7\u3092\u5165\u529b\u3057\u3066\u30ed\u30b0\u30a4\u30f3\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
  userRoles: [
    "\u6559\u6388",
    "\u52a9\u6559",
    "\u5b66\u90e83\u5e74",
    "\u5b66\u90e84\u5e74",
    "\u96621\u5e74",
    "\u96622\u5e74"
  ],
  ownerUser: {
    id: "202304193",
    displayName: "202304193",
    role: "\u5b66\u90e84\u5e74"
  },
  seedUsers: [
    { id: "202304161", displayName: "202304161", role: "\u5b66\u90e84\u5e74" },
    { id: "202304179", displayName: "202304179", role: "\u5b66\u90e84\u5e74" },
    { id: "202304177", displayName: "202304177", role: "\u5b66\u90e84\u5e74" },
    { id: "202304154", displayName: "202304154", role: "\u5b66\u90e84\u5e74" },
    { id: "202304167", displayName: "202304167", role: "\u5b66\u90e84\u5e74" },
    { id: "202304181", displayName: "202304181", role: "\u5b66\u90e84\u5e74" },
    { id: "202304200", displayName: "202304200", role: "\u5b66\u90e84\u5e74" }
  ],
  version: "\u57fa\u76e4-2026-04"
};

const authView = document.getElementById("authView");
const workspaceView = document.getElementById("workspaceView");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const userIdInput = document.getElementById("userIdInput");
const displayNameForm = document.getElementById("displayNameForm");
const displayNameInput = document.getElementById("displayNameInput");
const displayNameMessage = document.getElementById("displayNameMessage");
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
let displayNameOverrides = {};
let displayNameStatusMessage =
  "\u8868\u793a\u540d\u306f\u3053\u306e\u7aef\u672b\u306e\u30ed\u30b0\u30a4\u30f3\u60c5\u5831\u3068\u4e00\u7dd2\u306b\u4fdd\u5b58\u3055\u308c\u307e\u3059\u3002";

function loadDisplayNameOverrides() {
  try {
    const raw = window.localStorage.getItem(DISPLAY_NAME_OVERRIDES_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.warn("Could not load display name overrides. Using defaults.", error);
    return {};
  }
}

function saveDisplayNameOverrides() {
  window.localStorage.setItem(DISPLAY_NAME_OVERRIDES_KEY, JSON.stringify(displayNameOverrides));
}

function getDisplayName(id, fallback) {
  const override = displayNameOverrides[id];
  return typeof override === "string" && override.trim() ? override.trim() : fallback;
}

function buildOwnerRecord(config) {
  const permissions = {};

  CATEGORIES.forEach((category) => {
    permissions[category.key] = true;
  });

  return {
    id: config.ownerUser.id,
    displayName: getDisplayName(
      config.ownerUser.id,
      config.ownerUser.displayName || config.ownerUser.id
    ),
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
    displayName: getDisplayName(id, String(rawMember.displayName || id).trim() || id),
    role,
    isOwner: false,
    permissions: normalizePermissions(rawMember.permissions)
  };
}

function buildSeedMembers(config) {
  const seedUsers = Array.isArray(config.seedUsers) ? config.seedUsers : [];

  return seedUsers
    .map((member) =>
      normalizeMember({
        ...member,
        permissions: createEmptyPermissions()
      })
    )
    .filter(Boolean)
    .filter((member) => member.id !== config.ownerUser.id);
}

function loadStoredDirectory(config) {
  const owner = buildOwnerRecord(config);
  const seededMembers = buildSeedMembers(config);

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const storedMembers = Array.isArray(parsed)
      ? parsed.map(normalizeMember).filter(Boolean).filter((member) => member.id !== owner.id)
      : [];
    const memberMap = new Map();

    seededMembers.forEach((member) => {
      memberMap.set(member.id, member);
    });

    storedMembers.forEach((member) => {
      memberMap.set(member.id, member);
    });

    const others = Array.from(memberMap.values());

    return [owner, ...others];
  } catch (error) {
    console.warn("Could not load stored user directory. Using initial state.", error);
    return [owner, ...seededMembers];
  }
}

function saveDirectory() {
  const others = memberDirectory.filter((member) => !member.isOwner);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(others));
}

function saveActiveUser(member) {
  if (!member) {
    return;
  }

  window.localStorage.setItem(ACTIVE_USER_KEY, member.id);
}

function clearActiveUser() {
  window.localStorage.removeItem(ACTIVE_USER_KEY);
}

function isOwner(member) {
  return Boolean(member && member.id === appConfig.ownerUser.id);
}

function canManagePermissions(member) {
  return isOwner(member);
}

function hasCategoryAccess(member, categoryKey) {
  return Boolean(member && categoryKey);
}

function getAccessibleCategories(member) {
  return CATEGORIES.filter((category) => hasCategoryAccess(member, category.key));
}

function findMemberById(id) {
  return memberDirectory.find((member) => member.id === id) || null;
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
  sidebarLabName.textContent = config.labName;
  tagline.textContent = config.tagline;
  loginDescription.textContent = config.loginDescription;
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
  button.innerHTML = `<strong>${category.label}</strong><small>${allowed ? "\u753b\u9762\u3092\u958b\u304f" : "\u6a29\u9650\u304c\u3042\u308a\u307e\u305b\u3093"}</small>`;

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
    workspaceTitle.textContent = "\u5229\u7528\u3067\u304d\u308b\u30ab\u30c6\u30b4\u30ea\u304c\u3042\u308a\u307e\u305b\u3093";
    workspaceDescription.textContent =
      "\u7ba1\u7406\u8005\u304c\u30ab\u30c6\u30b4\u30ea\u6a29\u9650\u3092\u4ed8\u4e0e\u3059\u308b\u3068\u3001\u3053\u3053\u304b\u3089\u5404\u753b\u9762\u3078\u5207\u308a\u66ff\u3048\u3089\u308c\u307e\u3059\u3002";
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

function createPermissionChip(text, isOff = false) {
  const chip = document.createElement("span");
  chip.className = `permission-chip${isOff ? " is-off" : ""}`;
  chip.textContent = text;
  return chip;
}

function renderCurrentUserSummary() {
  currentUserCard.replaceChildren();
  permissionSummary.replaceChildren();

  displayNameInput.value = currentUser.displayName;
  displayNameMessage.textContent = displayNameStatusMessage;

  currentUserCard.append(
    createInfoBox("\u8868\u793a\u540d", currentUser.displayName),
    createInfoBox("\u5b66\u7c4d\u756a\u53f7", currentUser.id),
    createInfoBox("\u30e6\u30fc\u30b6\u30fc\u533a\u5206", currentUser.role),
    createInfoBox("\u6a29\u9650\u30ec\u30d9\u30eb", isOwner(currentUser) ? "\u6700\u4e0a\u4f4d\u7ba1\u7406\u8005" : "\u4e00\u822c\u30e6\u30fc\u30b6\u30fc")
  );

  permissionSummary.append(
    createPermissionChip("\u57fa\u672c\u6a5f\u80fd / \u5229\u7528\u53ef"),
    createPermissionChip(
      canManagePermissions(currentUser)
        ? "\u30e6\u30fc\u30b6\u30fc\u767b\u9332 / \u64cd\u4f5c\u53ef"
        : "\u30e6\u30fc\u30b6\u30fc\u767b\u9332 / \u4e0d\u53ef",
      !canManagePermissions(currentUser)
    )
  );
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
      <small>${member.role}${member.isOwner ? " / \u6700\u4e0a\u4f4d\u7ba1\u7406\u8005" : ""}</small>
    `;

    const permissionGrid = document.createElement("div");
    permissionGrid.className = "permission-grid";

    permissionGrid.append(
      createPermissionChip("\u57fa\u672c\u6a5f\u80fd / \u5229\u7528\u53ef"),
      createPermissionChip("\u8a2d\u5b9a\u753b\u9762 / \u5229\u7528\u53ef"),
      createPermissionChip(
        member.isOwner
          ? "\u30e6\u30fc\u30b6\u30fc\u767b\u9332 / \u64cd\u4f5c\u53ef"
          : "\u30e6\u30fc\u30b6\u30fc\u767b\u9332 / \u64cd\u4f5c\u4e0d\u53ef",
        !member.isOwner
      ),
      createPermissionChip(
        member.isOwner
          ? "\u6700\u4e0a\u4f4d\u7ba1\u7406\u8005"
          : "\u4eca\u5f8c\u306e\u8ffd\u52a0\u6a29\u9650\u306f\u672a\u8a2d\u5b9a",
        !member.isOwner
      )
    );

    row.append(memberCard, permissionGrid);
    memberTable.appendChild(row);
  });
}

function renderSettings() {
  renderCurrentUserSummary();

  settingsNotice.textContent = canManagePermissions(currentUser)
    ? "\u73fe\u5728\u306f\u3001\u3059\u3079\u3066\u306e\u30e6\u30fc\u30b6\u30fc\u304c\u57fa\u672c\u6a5f\u80fd\u3092\u5229\u7528\u3067\u304d\u307e\u3059\u3002\u30e6\u30fc\u30b6\u30fc\u767b\u9332\u3060\u3051\u304c\u7ba1\u7406\u8005\u306e\u64cd\u4f5c\u5bfe\u8c61\u3067\u3059\u3002"
    : "\u73fe\u5728\u306f\u3001\u3059\u3079\u3066\u306e\u57fa\u672c\u6a5f\u80fd\u3092\u5229\u7528\u3067\u304d\u307e\u3059\u3002\u30e6\u30fc\u30b6\u30fc\u767b\u9332\u3060\u3051\u304c\u7ba1\u7406\u8005\u9650\u5b9a\u3067\u3059\u3002";

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
  currentUserBadge.textContent = isOwner(currentUser)
    ? `\u6700\u4e0a\u4f4d\u7ba1\u7406\u8005 / ${currentUser.role}`
    : currentUser.role;

  renderSidebar();
  renderHeader();
  renderViews();
  updateHash(activeCategory);
}

function restoreActiveUser() {
  const activeUserId = window.localStorage.getItem(ACTIVE_USER_KEY);
  if (!activeUserId) {
    return false;
  }

  const member = findMemberById(activeUserId);
  if (!member) {
    clearActiveUser();
    return false;
  }

  currentUser = member;
  activeCategory = resolvePreferredCategory();
  renderWorkspace();
  return true;
}

function focusUserIdInput() {
  window.requestAnimationFrame(() => {
    userIdInput.focus();
  });
}

function resetLoginFormMessage() {
  loginMessage.textContent =
    "\u5b66\u7c4d\u756a\u53f7\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002";
}

function resetToLogin() {
  currentUser = null;
  activeCategory = null;
  workspaceView.hidden = true;
  authView.hidden = false;
  loginForm.reset();
  clearActiveUser();
  history.replaceState(null, "", window.location.pathname);
  resetLoginFormMessage();
  displayNameStatusMessage =
    "\u8868\u793a\u540d\u306f\u3053\u306e\u7aef\u672b\u306e\u30ed\u30b0\u30a4\u30f3\u60c5\u5831\u3068\u4e00\u7dd2\u306b\u4fdd\u5b58\u3055\u308c\u307e\u3059\u3002";
  focusUserIdInput();
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
      },
      seedUsers: Array.isArray(config.seedUsers) ? config.seedUsers : FALLBACK_CONFIG.seedUsers
    };
  } catch (error) {
    console.warn("Could not load config file. Using fallback config.", error);
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
    console.warn("Service Worker registration failed.", error);
  }
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const userId = userIdInput.value.trim();
  const member = findMemberById(userId);

  if (!userId) {
    loginMessage.textContent = "\u5b66\u7c4d\u756a\u53f7\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002";
    return;
  }

  if (!member) {
    loginMessage.textContent =
      "\u305d\u306e\u5b66\u7c4d\u756a\u53f7\u306f\u307e\u3060\u767b\u9332\u3055\u308c\u3066\u3044\u307e\u305b\u3093\u3002\u7ba1\u7406\u8005\u306b\u767b\u9332\u3092\u4f9d\u983c\u3057\u3066\u304f\u3060\u3055\u3044\u3002";
    return;
  }

  currentUser = member;
  activeCategory = resolvePreferredCategory();
  saveActiveUser(member);
  renderWorkspace();
});

displayNameForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!currentUser) {
    return;
  }

  const nextDisplayName = displayNameInput.value.trim();
  if (!nextDisplayName) {
    displayNameMessage.textContent = "\u8868\u793a\u540d\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002";
    return;
  }

  currentUser.displayName = nextDisplayName;
  displayNameOverrides[currentUser.id] = nextDisplayName;
  saveDisplayNameOverrides();
  saveDirectory();
  displayNameStatusMessage = "\u8868\u793a\u540d\u3092\u66f4\u65b0\u3057\u307e\u3057\u305f\u3002";
  renderWorkspace();
});

memberForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!canManagePermissions(currentUser)) {
    memberFormMessage.textContent =
      "\u30e6\u30fc\u30b6\u30fc\u8ffd\u52a0\u306f\u6700\u4e0a\u4f4d\u7ba1\u7406\u8005\u306e\u307f\u304c\u5b9f\u884c\u3067\u304d\u307e\u3059\u3002";
    return;
  }

  const displayName = memberNameInput.value.trim();
  const memberId = memberIdInput.value.trim();
  const role = memberRoleSelect.value;

  if (!displayName || !memberId) {
    memberFormMessage.textContent =
      "\u8868\u793a\u540d\u3068\u5b66\u7c4d\u756a\u53f7\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002";
    return;
  }

  if (findMemberById(memberId)) {
    memberFormMessage.textContent =
      "\u305d\u306e\u5b66\u7c4d\u756a\u53f7\u306f\u3059\u3067\u306b\u767b\u9332\u3055\u308c\u3066\u3044\u307e\u3059\u3002";
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
  memberFormMessage.textContent = `${displayName} \u3092\u8ffd\u52a0\u3057\u307e\u3057\u305f\u3002\u57fa\u672c\u6a5f\u80fd\u306f\u3059\u3050\u306b\u5229\u7528\u3067\u304d\u307e\u3059\u3002`;
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
  displayNameOverrides = loadDisplayNameOverrides();
  memberDirectory = loadStoredDirectory(appConfig);
  renderConfig(appConfig);
  loginForm.reset();
  memberRoleSelect.value = appConfig.userRoles[0];
  resetLoginFormMessage();
  if (!restoreActiveUser()) {
    focusUserIdInput();
  }
  await registerServiceWorker();
}

init();
