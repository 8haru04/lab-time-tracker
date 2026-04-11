const STORAGE_KEY = "ergonomics-lab-permissions-v4";
const ACTIVE_USER_KEY = "ergonomics-lab-active-user-v1";
const DISPLAY_NAME_OVERRIDES_KEY = "ergonomics-lab-display-names-v1";
const PRESENCE_PLANS_KEY = "ergonomics-lab-presence-plans-v1";
const CLOCK_RECORDS_KEY = "ergonomics-lab-clock-records-v1";
const CLOCK_LOGS_KEY = "ergonomics-lab-clock-logs-v1";
const TASKS_STORAGE_KEY = "ergonomics-lab-my-tasks-v1";
const DEFAULT_SHARED_SYNC_INTERVAL_MS = 20000;
const CATEGORIES = [
  {
    key: "presence",
    label: "\u5728\u5ba4\u7ba1\u7406",
    short: "\u5728\u5ba4\u72b6\u6cc1\u3092\u78ba\u8a8d",
    description: "\u7814\u7a76\u5ba4\u30e1\u30f3\u30d0\u30fc\u306e\u5728\u5ba4\u72b6\u6cc1\u3092\u6271\u3046\u753b\u9762\u3067\u3059\u3002"
  },
  {
    key: "tasks",
    label: "\u30de\u30a4\u30bf\u30b9\u30af",
    short: "\u500b\u4eba\u30bf\u30b9\u30af\u3092\u6574\u7406",
    description: "\u500b\u4eba\u306e\u30bf\u30b9\u30af\u3092\u6574\u7406\u3059\u308b\u753b\u9762\u3067\u3059\u3002"
  },
  {
    key: "clock",
    label: "\u6d3b\u52d5\u8a18\u9332",
    short: "\u7814\u7a76\u6642\u9593\u3092\u8a18\u9332",
    description: "\u5165\u5ba4\u30fb\u9000\u5ba4\u30fb\u4f11\u61a9\u304b\u3089\u3001\u7814\u7a76\u6d3b\u52d5\u306e\u6642\u9593\u3092\u8a18\u9332\u3059\u308b\u753b\u9762\u3067\u3059\u3002"
  },
  {
    key: "clockMonthly",
    label: "\u6708\u9593\u7814\u7a76\u6642\u9593",
    short: "\u5168\u54e1\u306e\u7814\u7a76\u6642\u9593",
    description: "\u6708\u5358\u4f4d\u3067\u3001\u7814\u7a76\u5ba4\u30e1\u30f3\u30d0\u30fc\u5168\u54e1\u306e\u7814\u7a76\u6642\u9593\u3092\u78ba\u8a8d\u3059\u308b\u753b\u9762\u3067\u3059\u3002",
    isChild: true
  },
  {
    key: "settings",
    label: "\u8a2d\u5b9a",
    short: "\u8868\u793a\u540d\u3068\u767b\u9332\u8a2d\u5b9a",
    description: "\u30ed\u30b0\u30a4\u30f3\u60c5\u5831\u3084\u6a29\u9650\u7ba1\u7406\u3092\u6271\u3046\u753b\u9762\u3067\u3059\u3002"
  }
];

const AVAILABILITY_OPTIONS = [
  {
    value: "available",
    label: "\u5bfe\u5fdc\u53ef",
    symbol: "\u25ce",
    className: "is-available"
  },
  {
    value: "limited",
    label: "\u4e00\u90e8\u5bfe\u5fdc\u53ef",
    symbol: "\u25cb",
    className: "is-limited"
  },
  {
    value: "consult",
    label: "\u8981\u76f8\u8ac7",
    symbol: "\u25b3",
    className: "is-consult"
  },
  {
    value: "unavailable",
    label: "\u5bfe\u5fdc\u4e0d\u53ef",
    symbol: "\u00d7",
    className: "is-unavailable"
  }
];

const DEFAULT_AVAILABILITY = AVAILABILITY_OPTIONS[0].value;

const FALLBACK_CONFIG = {
  appName: "\u4eba\u9593\u5de5\u5b66\u7814\u7a76\u5ba4 \u5171\u6709\u30c4\u30fc\u30eb",
  labName: "\u4eba\u9593\u5de5\u5b66\u7814\u7a76\u5ba4",
  tagline:
    "\u7814\u7a76\u5ba4\u306e\u5171\u6709\u30c4\u30fc\u30eb\u3067\u3059\u3002",
  loginDescription:
    "\u5b66\u7c4d\u756a\u53f7\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
  userRoles: [
    "\u6559\u6388",
    "\u52a9\u6559",
    "\u96622\u5e74",
    "\u96621\u5e74",
    "\u5b66\u90e84\u5e74",
    "\u5b66\u90e83\u5e74"
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
    { id: "202304200", displayName: "202304200", role: "\u5b66\u90e84\u5e74" },
    { id: "202304135", displayName: "202304135", role: "\u672a\u8a2d\u5b9a" },
    { id: "01", displayName: "01", role: "\u672a\u8a2d\u5b9a" },
    { id: "02", displayName: "02", role: "\u672a\u8a2d\u5b9a" },
    { id: "202670231", displayName: "202670231", role: "\u672a\u8a2d\u5b9a" }
  ],
  sharedStore: {
    provider: "supabase",
    enabled: false,
    url: "",
    anonKey: "",
    syncIntervalSeconds: 20
  },
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
const presenceMonthLabel = document.getElementById("presenceMonthLabel");
const presencePrevButton = document.getElementById("presencePrevButton");
const presenceTodayButton = document.getElementById("presenceTodayButton");
const presenceNextButton = document.getElementById("presenceNextButton");
const presenceTableHead = document.getElementById("presenceTableHead");
const presenceTableBody = document.getElementById("presenceTableBody");
const presenceEditorModal = document.getElementById("presenceEditorModal");
const presenceEditorForm = document.getElementById("presenceEditorForm");
const presenceEditorTitle = document.getElementById("presenceEditorTitle");
const presenceEditorStartTimeInput = document.getElementById("presenceEditorStartTimeInput");
const presenceEditorEndTimeInput = document.getElementById("presenceEditorEndTimeInput");
const presenceEditorAvailabilitySelect = document.getElementById("presenceEditorAvailabilitySelect");
const presenceEditorSummaryPreview = document.getElementById("presenceEditorSummaryPreview");
const presenceEditorDeleteButton = document.getElementById("presenceEditorDeleteButton");
const presenceEditorMessage = document.getElementById("presenceEditorMessage");
const presenceEditorCloseButton = document.getElementById("presenceEditorCloseButton");
const taskOwnerText = document.getElementById("taskOwnerText");
const taskForm = document.getElementById("taskForm");
const taskTitleInput = document.getElementById("taskTitleInput");
const taskDueDateInput = document.getElementById("taskDueDateInput");
const taskNoteInput = document.getElementById("taskNoteInput");
const taskFormMessage = document.getElementById("taskFormMessage");
const taskList = document.getElementById("taskList");
const clockCurrentTime = document.getElementById("clockCurrentTime");
const clockCurrentDate = document.getElementById("clockCurrentDate");
const clockMonthTotalValue = document.getElementById("clockMonthTotalValue");
const clockMonthTotalNote = document.getElementById("clockMonthTotalNote");
const clockTotalValue = document.getElementById("clockTotalValue");
const clockTotalNote = document.getElementById("clockTotalNote");
const clockStatusText = document.getElementById("clockStatusText");
const clockStatusSubtext = document.getElementById("clockStatusSubtext");
const clockActionButtons = document.getElementById("clockActionButtons");
const clockSummaryText = document.getElementById("clockSummaryText");
const clockExportButton = document.getElementById("clockExportButton");
const clockHistoryList = document.getElementById("clockHistoryList");
const clockMonthSummaryLabel = document.getElementById("clockMonthSummaryLabel");
const clockMonthSummaryPrevButton = document.getElementById("clockMonthSummaryPrevButton");
const clockMonthSummaryTodayButton = document.getElementById("clockMonthSummaryTodayButton");
const clockMonthSummaryNextButton = document.getElementById("clockMonthSummaryNextButton");
const clockMonthSummaryTableBody = document.getElementById("clockMonthSummaryTableBody");
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
  "\u3053\u306e\u7aef\u672b\u306b\u4fdd\u5b58";
let presencePlans = {};
let presenceMonthKey = "";
let presenceEditorDateKey = "";
let clockMonthSummaryKey = "";
let clockRecords = {};
let clockLogs = {};
let myTasks = {};
let sharedStore = {
  provider: "supabase",
  configured: false,
  active: false,
  url: "",
  anonKey: "",
  syncIntervalMs: DEFAULT_SHARED_SYNC_INTERVAL_MS,
  statusText: "",
  lastError: ""
};
let sharedSyncTimer = 0;
let sharedSyncInFlight = null;

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

function loadClockRecords() {
  try {
    const raw = window.localStorage.getItem(CLOCK_RECORDS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.warn("Could not load clock records. Using defaults.", error);
    return {};
  }
}

function saveClockRecords() {
  window.localStorage.setItem(CLOCK_RECORDS_KEY, JSON.stringify(clockRecords));
}

function loadClockLogs() {
  try {
    const raw = window.localStorage.getItem(CLOCK_LOGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.warn("Could not load clock logs. Using defaults.", error);
    return {};
  }
}

function saveClockLogs() {
  window.localStorage.setItem(CLOCK_LOGS_KEY, JSON.stringify(clockLogs));
}

function loadMyTasks() {
  try {
    const raw = window.localStorage.getItem(TASKS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.warn("Could not load my tasks. Using defaults.", error);
    return {};
  }
}

function saveMyTasks() {
  window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(myTasks));
}

function saveDisplayNameOverrides() {
  window.localStorage.setItem(DISPLAY_NAME_OVERRIDES_KEY, JSON.stringify(displayNameOverrides));
}

function createSharedStoreConfig(config) {
  const rawConfig = config && typeof config === "object" ? config.sharedStore || {} : {};
  const url = typeof rawConfig.url === "string" ? rawConfig.url.trim().replace(/\/+$/, "") : "";
  const anonKey = typeof rawConfig.anonKey === "string" ? rawConfig.anonKey.trim() : "";
  const syncIntervalSeconds = Number(rawConfig.syncIntervalSeconds);
  const syncIntervalMs =
    Number.isFinite(syncIntervalSeconds) && syncIntervalSeconds > 0
      ? syncIntervalSeconds * 1000
      : DEFAULT_SHARED_SYNC_INTERVAL_MS;
  const configured = Boolean(
    rawConfig.provider === "supabase" &&
      rawConfig.enabled &&
      url &&
      anonKey
  );

  return {
    provider: "supabase",
    configured,
    active: false,
    url,
    anonKey,
    syncIntervalMs,
    statusText: configured
      ? "\u5171\u6709\u4fdd\u5b58\u5148\u306b\u63a5\u7d9a\u3057\u3066\u3044\u307e\u3059\u3002"
      : "\u5171\u6709\u4fdd\u5b58\u5148\u306f\u672a\u8a2d\u5b9a\u3067\u3001\u73fe\u5728\u306f\u3053\u306e\u7aef\u672b\u3060\u3051\u306b\u4fdd\u5b58\u3055\u308c\u307e\u3059\u3002",
    lastError: ""
  };
}

function isSharedStoreActive() {
  return Boolean(sharedStore && sharedStore.active);
}

function buildAuthHeaders(extraHeaders = {}) {
  const headers = {
    apikey: sharedStore.anonKey,
    ...extraHeaders
  };

  if (!sharedStore.anonKey.startsWith("sb_")) {
    headers.Authorization = `Bearer ${sharedStore.anonKey}`;
  }

  return headers;
}

async function requestSharedStore(path, options = {}) {
  if (!sharedStore.configured) {
    throw new Error("\u5171\u6709\u4fdd\u5b58\u5148\u304c\u672a\u8a2d\u5b9a\u3067\u3059\u3002");
  }

  const response = await fetch(`${sharedStore.url}/rest/v1/${path}`, {
    ...options,
    headers: buildAuthHeaders(options.headers || {})
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `shared store request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
}

async function selectSharedRows(table, query = {}) {
  const params = new URLSearchParams({ select: "*", ...query });
  return requestSharedStore(`${table}?${params.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });
}

async function insertSharedRows(table, rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return [];
  }

  return requestSharedStore(table, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify(rows)
  });
}

async function upsertSharedRows(table, rows, onConflict) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return [];
  }

  const params = new URLSearchParams();
  if (onConflict) {
    params.set("on_conflict", onConflict);
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";
  return requestSharedStore(`${table}${suffix}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation"
    },
    body: JSON.stringify(rows)
  });
}

async function deleteSharedRows(table, filters) {
  const params = new URLSearchParams();

  filters.forEach((filter) => {
    if (!filter || !filter.column) {
      return;
    }

    params.set(filter.column, `${filter.operator || "eq"}.${filter.value}`);
  });

  return requestSharedStore(`${table}?${params.toString()}`, {
    method: "DELETE",
    headers: {
      Prefer: "return=minimal"
    }
  });
}

function createClientId(prefix) {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getSharedStoreStatusText() {
  if (sharedStore.lastError) {
    return `\u7aef\u672b\u4fdd\u5b58\u4e2d / ${sharedStore.lastError}`;
  }

  if (isSharedStoreActive()) {
    return "\u5171\u6709\u4fdd\u5b58\u4e2d";
  }

  return sharedStore.statusText;
}

function getSharedSyncErrorText(error) {
  if (!sharedStore.configured) {
    return "";
  }

  const detail =
    error instanceof Error && error.message
      ? error.message
      : "\u5171\u6709\u4fdd\u5b58\u5148\u3068\u306e\u540c\u671f\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002";

  return `\u3053\u306e\u7aef\u672b\u306b\u306f\u4fdd\u5b58\u3057\u307e\u3057\u305f\u304c\u3001\u5171\u6709\u4fdd\u5b58\u5148\u3078\u306e\u53cd\u6620\u306f\u307e\u3060\u5b8c\u4e86\u3057\u3066\u3044\u307e\u305b\u3093\u3002 ${detail}`;
}

function padNumber(value) {
  return String(value).padStart(2, "0");
}

function normalizeTimeValue(value) {
  const text = typeof value === "string" ? value.trim() : "";
  return /^\d{2}:\d{2}$/.test(text) ? text : "";
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  }).format(date);
}

function formatDateKey(dateKey) {
  if (!dateKey) {
    return "\u671f\u65e5\u672a\u8a2d\u5b9a";
  }

  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
    weekday: "short"
  }).format(date);
}

function formatTime(date) {
  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

function formatDurationFromMinutes(totalMinutes) {
  const safeMinutes = Math.max(0, Math.floor(totalMinutes));
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  if (hours > 0) {
    return `${hours}\u6642\u9593${minutes}\u5206`;
  }

  return `${minutes}\u5206`;
}

function formatMonthRangeLabel(date) {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "numeric"
  }).format(date);
}

function normalizeRemoteUserRow(row) {
  if (!row || typeof row !== "object") {
    return null;
  }

  return normalizeMember({
    id: String(row.user_id || "").trim(),
    displayName: String(row.display_name || row.user_id || "").trim(),
    role: String(row.role || "\u672a\u8a2d\u5b9a").trim() || "\u672a\u8a2d\u5b9a",
    permissions: createEmptyPermissions()
  });
}

function buildDirectoryFromRemoteRows(config, rows) {
  const owner = buildOwnerRecord(config);
  const memberMap = new Map();

  buildSeedMembers(config).forEach((member) => {
    memberMap.set(member.id, member);
  });

  (Array.isArray(rows) ? rows : []).forEach((row) => {
    const member = normalizeRemoteUserRow(row);
    if (member) {
      memberMap.set(member.id, member);
    }
  });

  const remoteOwner = memberMap.get(config.ownerUser.id);
  const nextOwner = remoteOwner
    ? {
        ...owner,
        displayName: remoteOwner.displayName || owner.displayName,
        role: remoteOwner.role || owner.role
      }
    : owner;

  const others = Array.from(memberMap.values()).filter((member) => member.id !== nextOwner.id);
  return [nextOwner, ...others];
}

function buildPresencePlansFromRemoteRows(rows) {
  const nextPlans = {};

  (Array.isArray(rows) ? rows : []).forEach((row) => {
    const userId = String(row.user_id || "").trim();
    const dateKey = typeof row.date_key === "string" ? row.date_key : "";
    const entry = normalizePresenceEntry({
      availability: row.availability,
      startTime: row.start_time,
      endTime: row.end_time,
      note: row.note
    });

    if (!userId || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey) || !entry) {
      return;
    }

    if (!nextPlans[dateKey]) {
      nextPlans[dateKey] = {};
    }

    nextPlans[dateKey][userId] = entry;
  });

  return nextPlans;
}

function buildTasksFromRemoteRows(rows) {
  const nextTasks = {};

  (Array.isArray(rows) ? rows : []).forEach((row) => {
    const userId = String(row.user_id || "").trim();
    const title = typeof row.title === "string" ? row.title.trim() : "";
    const taskId = typeof row.id === "string" ? row.id.trim() : "";

    if (!userId || !taskId || !title) {
      return;
    }

    if (!Array.isArray(nextTasks[userId])) {
      nextTasks[userId] = [];
    }

    nextTasks[userId].push({
      id: taskId,
      title,
      dueDate: typeof row.due_date === "string" ? row.due_date : "",
      note: typeof row.note === "string" ? row.note.trim() : "",
      createdAt: typeof row.created_at === "string" ? row.created_at : "",
      updatedAt: typeof row.updated_at === "string" ? row.updated_at : ""
    });
  });

  return nextTasks;
}

function buildClockRecordsFromRemoteRows(rows) {
  const nextRecords = {};

  (Array.isArray(rows) ? rows : []).forEach((row) => {
    const userId = String(row.user_id || "").trim();
    if (!userId) {
      return;
    }

    nextRecords[userId] = normalizeClockRecord({
      status: row.status,
      lastActionType: row.last_action_type,
      lastActionAt: row.last_action_at
    });
  });

  return nextRecords;
}

function buildClockLogsFromRemoteRows(rows) {
  const nextLogs = {};

  (Array.isArray(rows) ? rows : []).forEach((row) => {
    const userId = String(row.user_id || "").trim();
    const timestamp = typeof row.timestamp === "string" ? row.timestamp : "";

    if (!userId || !timestamp) {
      return;
    }

    if (!Array.isArray(nextLogs[userId])) {
      nextLogs[userId] = [];
    }

    nextLogs[userId].push({
      id:
        typeof row.id === "string" && row.id.trim()
          ? row.id.trim()
          : `${userId}-${timestamp}-${row.action_type || ""}`,
      actionType: typeof row.action_type === "string" ? row.action_type : "",
      status: typeof row.status === "string" ? row.status : "out",
      timestamp
    });
  });

  return nextLogs;
}

function cacheSharedSnapshotLocally() {
  saveDirectory();
  savePresencePlans();
  saveClockRecords();
  saveClockLogs();
  saveMyTasks();
}

function renderClockNow() {
  const now = new Date();

  clockCurrentTime.textContent = new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(now);

  clockCurrentDate.textContent = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short"
  }).format(now);
}

function normalizeClockRecord(rawRecord) {
  if (!rawRecord || typeof rawRecord !== "object") {
    return {
      status: "out",
      lastActionType: "",
      lastActionAt: ""
    };
  }

  const allowed = ["out", "in", "break"];
  const status = allowed.includes(rawRecord.status) ? rawRecord.status : "out";
  const lastActionType = typeof rawRecord.lastActionType === "string" ? rawRecord.lastActionType : "";
  const lastActionAt = typeof rawRecord.lastActionAt === "string" ? rawRecord.lastActionAt : "";

  return {
    status,
    lastActionType,
    lastActionAt
  };
}

function getClockRecord(userId) {
  return normalizeClockRecord(clockRecords[userId]);
}

function getClockLogsForUser(userId) {
  const rawLogs = Array.isArray(clockLogs[userId]) ? clockLogs[userId] : [];

  return rawLogs
    .filter((entry) => entry && typeof entry === "object" && typeof entry.timestamp === "string")
    .map((entry) => ({
      id:
        typeof entry.id === "string" && entry.id.trim()
          ? entry.id.trim()
          : `${userId}-${entry.timestamp}-${entry.actionType || ""}`,
      actionType: typeof entry.actionType === "string" ? entry.actionType : "",
      status: typeof entry.status === "string" ? entry.status : "out",
      timestamp: entry.timestamp
    }))
    .sort((left, right) => new Date(left.timestamp) - new Date(right.timestamp));
}

function appendClockLog(userId, actionType, status) {
  if (!Array.isArray(clockLogs[userId])) {
    clockLogs[userId] = [];
  }

  const entry = {
    id: createClientId("clock"),
    actionType,
    status,
    timestamp: new Date().toISOString()
  };

  clockLogs[userId].push(entry);
  saveClockLogs();
  return entry;
}

function setClockRecord(userId, status, actionType) {
  const nextRecord = {
    status,
    lastActionType: actionType,
    lastActionAt: new Date().toISOString()
  };
  clockRecords[userId] = nextRecord;
  saveClockRecords();
  const logEntry = appendClockLog(userId, actionType, status);
  return {
    record: nextRecord,
    logEntry
  };
}

function getClockStatusMeta(status) {
  switch (status) {
    case "in":
      return {
        title: "\u5165\u5ba4\u4e2d",
        subtext: "\u9000\u5ba4\u307e\u305f\u306f\u4f11\u61a9\u3092\u9078\u3079\u307e\u3059\u3002"
      };
    case "break":
      return {
        title: "\u4f11\u61a9\u4e2d",
        subtext: "\u4f11\u61a9\u304c\u7d42\u308f\u3063\u305f\u3089\u4f11\u61a9\u7d42\u4e86\u3092\u62bc\u3057\u307e\u3059\u3002"
      };
    default:
      return {
        title: "\u9000\u5ba4\u4e2d",
        subtext: "\u5165\u5ba4\u3059\u308b\u3068\u3001\u9000\u5ba4\u3068\u4f11\u61a9\u304c\u9078\u3079\u308b\u3088\u3046\u306b\u306a\u308a\u307e\u3059\u3002"
      };
  }
}

function getClockActionLabel(actionType) {
  switch (actionType) {
    case "checkin":
      return "\u5165\u5ba4";
    case "checkout":
      return "\u9000\u5ba4";
    case "breakStart":
      return "\u4f11\u61a9";
    case "breakEnd":
      return "\u4f11\u61a9\u7d42\u4e86";
    default:
      return "";
  }
}

function getClockStatusLabel(status) {
  switch (status) {
    case "in":
      return "\u5165\u5ba4\u4e2d";
    case "break":
      return "\u4f11\u61a9\u4e2d";
    default:
      return "\u9000\u5ba4\u4e2d";
  }
}

function buildClockActions(status) {
  if (status === "in") {
    return [
      {
        label: "\u9000\u5ba4",
        note: "\u304a\u3064\u304b\u308c\u3055\u307e",
        icon: "\u2190",
        actionType: "checkout",
        nextStatus: "out",
        tone: "secondary"
      },
      {
        label: "\u4f11\u61a9",
        note: "\u3072\u3068\u606f\u3064\u304f",
        icon: "\u2615",
        actionType: "breakStart",
        nextStatus: "break",
        tone: "primary"
      }
    ];
  }

  if (status === "break") {
    return [
      {
        label: "\u4f11\u61a9\u7d42\u4e86",
        note: "\u4f5c\u696d\u306b\u623b\u308b",
        icon: "\u21ba",
        actionType: "breakEnd",
        nextStatus: "in",
        tone: "primary"
      }
    ];
  }

  return [
    {
      label: "\u5165\u5ba4",
      note: "\u4eca\u65e5\u3082\u3088\u308d\u3057\u304f",
      icon: "\u2192",
      actionType: "checkin",
      nextStatus: "in",
      tone: "primary"
    }
  ];
}

function getClockStartedAt(record, logs) {
  const reversed = [...logs].reverse();

  if (record.status === "in") {
    const event = reversed.find((entry) =>
      entry.actionType === "checkin" || entry.actionType === "breakEnd"
    );
    return event?.timestamp || record.lastActionAt;
  }

  if (record.status === "break") {
    const event = reversed.find((entry) => entry.actionType === "breakStart");
    return event?.timestamp || record.lastActionAt;
  }

  const event = reversed.find((entry) => entry.actionType === "checkout");
  return event?.timestamp || record.lastActionAt;
}

function getTodayClockLogs(logs, now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return logs.filter((entry) => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= start && entryDate < end;
  });
}

function getMonthClockLogs(logs, now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return logs.filter((entry) => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= start && entryDate < end;
  });
}

function getMonthClockLogsByKey(logs, monthKey) {
  const start = parseMonthKey(monthKey);
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);

  return logs.filter((entry) => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= start && entryDate < end;
  });
}

function isCurrentMonthKey(monthKey) {
  return monthKey === getMonthKey(new Date());
}

function getClockSummaryForMonth(logs, record, monthKey) {
  const monthLogs = getMonthClockLogsByKey(logs, monthKey);
  const summaryNow = isCurrentMonthKey(monthKey)
    ? new Date()
    : new Date(parseMonthKey(monthKey).getFullYear(), parseMonthKey(monthKey).getMonth() + 1, 1);
  const status = isCurrentMonthKey(monthKey) ? record.status : "out";
  return {
    logs: monthLogs,
    summary: getClockSummary(monthLogs, status, summaryNow)
  };
}

function getClockSummary(logs, currentStatus, now = new Date()) {
  let checkedInAt = null;
  let breakStartedAt = null;
  let stayMinutes = 0;
  let breakMinutes = 0;

  logs.forEach((entry) => {
    const entryDate = new Date(entry.timestamp);

    if (entry.actionType === "checkin") {
      checkedInAt = entryDate;
      breakStartedAt = null;
      return;
    }

    if (entry.actionType === "breakStart" && checkedInAt && !breakStartedAt) {
      breakStartedAt = entryDate;
      return;
    }

    if (entry.actionType === "breakEnd" && breakStartedAt) {
      breakMinutes += (entryDate - breakStartedAt) / 60000;
      breakStartedAt = null;
      return;
    }

    if (entry.actionType === "checkout" && checkedInAt) {
      stayMinutes += (entryDate - checkedInAt) / 60000;
      if (breakStartedAt) {
        breakMinutes += (entryDate - breakStartedAt) / 60000;
        breakStartedAt = null;
      }
      checkedInAt = null;
    }
  });

  if (checkedInAt) {
    stayMinutes += (now - checkedInAt) / 60000;
  }

  if (breakStartedAt && currentStatus === "break") {
    breakMinutes += (now - breakStartedAt) / 60000;
  }

  return {
    stayMinutes,
    breakMinutes,
    activeMinutes: Math.max(0, stayMinutes - breakMinutes)
  };
}

function getStatusStartedText(record, logs) {
  const statusStartedAt = getClockStartedAt(record, logs);

  if (!statusStartedAt) {
    return getClockStatusMeta(record.status).subtext;
  }

  const stamp = new Date(statusStartedAt);

  if (record.status === "in") {
    return `\u5165\u5ba4 / ${formatDateTime(stamp)}\u304b\u3089`;
  }

  if (record.status === "break") {
    return `\u4f11\u61a9 / ${formatDateTime(stamp)}\u304b\u3089`;
  }

  return `\u9000\u5ba4 / ${formatDateTime(stamp)}`;
}

function createClockHistoryItem(entry) {
  const row = document.createElement("article");
  const action = document.createElement("div");
  const time = document.createElement("div");
  const stamp = new Date(entry.timestamp);

  row.className = "clock-history-item";
  action.className = "clock-history-action";
  time.className = "clock-history-time";

  action.innerHTML = `
    <strong>${getClockActionLabel(entry.actionType)}</strong>
    <small>${getClockStatusLabel(entry.status)}</small>
  `;
  time.innerHTML = `
    <strong>${formatTime(stamp)}</strong>
    <small>${formatDate(stamp)}</small>
  `;

  row.append(action, time);
  return row;
}

function buildClockCsv(user, logs) {
  const lines = [
    ["\u5b66\u7c4d\u756a\u53f7", "\u8868\u793a\u540d", "\u30e6\u30fc\u30b6\u30fc\u533a\u5206", "\u64cd\u4f5c", "\u72b6\u614b", "\u65e5\u4ed8", "\u6642\u523b", "ISO\u65e5\u6642"]
  ];

  logs.forEach((entry) => {
    const stamp = new Date(entry.timestamp);
    lines.push([
      user.id,
      user.displayName,
      user.role,
      getClockActionLabel(entry.actionType),
      getClockStatusLabel(entry.status),
      formatDate(stamp),
      formatTime(stamp),
      entry.timestamp
    ]);
  });

  return `\uFEFF${lines
    .map((row) =>
      row
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n")}`;
}

function downloadClockCsv() {
  if (!currentUser) {
    return;
  }

  const logs = getClockLogsForUser(currentUser.id);
  if (logs.length === 0) {
    clockSummaryText.textContent = "\u307e\u3060 CSV \u306b\u51fa\u305b\u308b\u6d3b\u52d5\u8a18\u9332\u304c\u3042\u308a\u307e\u305b\u3093\u3002";
    return;
  }

  const csv = buildClockCsv(currentUser, logs);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `activity-log-${currentUser.id}-${toDateKey(new Date())}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function getAvailabilityMeta(value) {
  return AVAILABILITY_OPTIONS.find((option) => option.value === value) || null;
}

function normalizeAvailability(value) {
  return getAvailabilityMeta(value)?.value || "";
}

function toDateKey(date) {
  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;
}

function getTaskOwnerTasks(userId) {
  const rawTasks = Array.isArray(myTasks[userId]) ? myTasks[userId] : [];

  return rawTasks
    .filter((task) => task && typeof task === "object" && typeof task.id === "string")
    .map((task) => ({
      id: task.id,
      title: typeof task.title === "string" ? task.title.trim() : "",
      dueDate: typeof task.dueDate === "string" ? task.dueDate : "",
      note: typeof task.note === "string" ? task.note.trim() : "",
      createdAt: typeof task.createdAt === "string" ? task.createdAt : ""
    }))
    .filter((task) => task.title);
}

function sortTasksByDueDate(tasks) {
  return [...tasks].sort((left, right) => {
    if (left.dueDate && right.dueDate && left.dueDate !== right.dueDate) {
      return left.dueDate.localeCompare(right.dueDate);
    }

    if (left.dueDate && !right.dueDate) {
      return -1;
    }

    if (!left.dueDate && right.dueDate) {
      return 1;
    }

    if (left.createdAt && right.createdAt && left.createdAt !== right.createdAt) {
      return left.createdAt.localeCompare(right.createdAt);
    }

    return left.title.localeCompare(right.title, "ja");
  });
}

function addTaskForUser(userId, title, dueDate, note) {
  if (!Array.isArray(myTasks[userId])) {
    myTasks[userId] = [];
  }

  const task = {
    id: createClientId("task"),
    title,
    dueDate,
    note,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  myTasks[userId].push(task);

  saveMyTasks();
  return task;
}

function deleteTaskForUser(userId, taskId) {
  if (!Array.isArray(myTasks[userId])) {
    return false;
  }

  const previousLength = myTasks[userId].length;
  myTasks[userId] = myTasks[userId].filter((task) => task.id !== taskId);
  saveMyTasks();
  return myTasks[userId].length !== previousLength;
}

function getTaskDueState(dueDate) {
  if (!dueDate) {
    return {
      className: "",
      label: "\u671f\u65e5\u672a\u8a2d\u5b9a"
    };
  }

  const today = getTodayDateKey();
  if (dueDate < today) {
    return {
      className: "is-overdue",
      label: "\u671f\u65e5\u8d85\u904e"
    };
  }

  if (dueDate === today) {
    return {
      className: "is-today",
      label: "\u4eca\u65e5\u304c\u671f\u65e5"
    };
  }

  return {
    className: "is-upcoming",
    label: "\u671f\u65e5\u9806"
  };
}

function getTodayDateKey() {
  return toDateKey(new Date());
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}`;
}

function parseMonthKey(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

function formatMonthLabel(monthKey) {
  const date = parseMonthKey(monthKey);
  return `${date.getFullYear()}\u5e74${date.getMonth() + 1}\u6708`;
}

function shiftMonthKey(monthKey, delta) {
  const date = parseMonthKey(monthKey);
  date.setMonth(date.getMonth() + delta);
  return getMonthKey(date);
}

function getDaysForMonth(monthKey) {
  const weekdays = ["\u65e5", "\u6708", "\u706b", "\u6c34", "\u6728", "\u91d1", "\u571f"];
  const start = parseMonthKey(monthKey);
  const lastDate = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();

  return Array.from({ length: lastDate }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth(), index + 1);
    return {
      key: toDateKey(date),
      label: index + 1,
      weekday: weekdays[date.getDay()],
      isWeekend: date.getDay() === 0 || date.getDay() === 6
    };
  });
}

function normalizePresenceEntry(rawEntry) {
  if (!rawEntry || typeof rawEntry !== "object") {
    return null;
  }

  const availability = normalizeAvailability(rawEntry.availability);
  const startTime = normalizeTimeValue(rawEntry.startTime);
  const endTime = normalizeTimeValue(rawEntry.endTime);
  const note = typeof rawEntry.note === "string" ? rawEntry.note.trim() : "";
  const legacyStatus = typeof rawEntry.status === "string" ? rawEntry.status.trim() : "";
  const legacyNote = typeof rawEntry.note === "string" ? rawEntry.note.trim() : "";

  if (availability || startTime || endTime || note || legacyStatus || legacyNote) {
    return {
      availability: availability || "consult",
      startTime,
      endTime,
      note: note || [legacyStatus, legacyNote].filter(Boolean).join(" / ")
    };
  }

  return null;
}

function formatTimeRange(startTime, endTime) {
  if (startTime && endTime) {
    return `${startTime}-${endTime}`;
  }

  if (startTime || endTime) {
    return [startTime || "--:--", endTime || "--:--"].join("-");
  }

  return "\u6642\u9593\u672a\u8a2d\u5b9a";
}

function buildPresencePreview(entry) {
  if (!entry) {
    return "";
  }

  const availability = getAvailabilityMeta(entry.availability) || getAvailabilityMeta(DEFAULT_AVAILABILITY);
  const parts = [availability?.label || "\u5bfe\u5fdc\u53ef\u5426\u672a\u8a2d\u5b9a"];

  if (entry.startTime || entry.endTime) {
    parts.push(formatTimeRange(entry.startTime, entry.endTime));
  }

  if (entry.note) {
    parts.push(entry.note);
  }

  return parts.join(" / ");
}

function getPresenceEntryFromValues(availability, startTime, endTime) {
  return {
    availability: normalizeAvailability(availability) || DEFAULT_AVAILABILITY,
    startTime: normalizeTimeValue(startTime),
    endTime: normalizeTimeValue(endTime),
    note: ""
  };
}

function updatePresenceEditorPreview() {
  const previewEntry = getPresenceEntryFromValues(
    presenceEditorAvailabilitySelect.value,
    presenceEditorStartTimeInput.value,
    presenceEditorEndTimeInput.value
  );

  presenceEditorSummaryPreview.value = buildPresencePreview(previewEntry);
}

function closePresenceEditor() {
  presenceEditorDateKey = "";
  presenceEditorModal.hidden = true;
  document.body.classList.remove("is-modal-open");
  presenceEditorMessage.textContent = "";
}

function openPresenceEditor(dateKey) {
  if (!currentUser || !dateKey) {
    return;
  }

  const entry = getPresenceEntry(currentUser.id, dateKey);
  presenceEditorDateKey = dateKey;
  presenceEditorTitle.textContent = formatDateKey(dateKey);
  presenceEditorStartTimeInput.value = entry?.startTime || "";
  presenceEditorEndTimeInput.value = entry?.endTime || "";
  presenceEditorAvailabilitySelect.value = entry?.availability || DEFAULT_AVAILABILITY;
  updatePresenceEditorPreview();
  presenceEditorMessage.textContent = entry ? "\u4fdd\u5b58\u6e08\u307f\u3067\u3059\u3002" : "\u4fdd\u5b58\u524d\u3067\u3059\u3002";
  presenceEditorModal.hidden = false;
  document.body.classList.add("is-modal-open");

  window.requestAnimationFrame(() => {
    presenceEditorStartTimeInput.focus();
  });
}

async function savePresenceEntryForUser(userId, dateKey, startTime, endTime, availability, messageTarget) {
  if (!dateKey || !userId) {
    messageTarget.textContent = "\u65e5\u4ed8\u3092\u9078\u3093\u3067\u304f\u3060\u3055\u3044\u3002";
    return false;
  }

  if (!startTime || !endTime) {
    messageTarget.textContent = "\u6642\u9593\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002";
    return false;
  }

  if (startTime >= endTime) {
    messageTarget.textContent = "\u6642\u9593\u3092\u898b\u76f4\u3057\u3066\u304f\u3060\u3055\u3044\u3002";
    return false;
  }

  if (!availability) {
    messageTarget.textContent = "\u5bfe\u5fdc\u53ef\u5426\u3092\u9078\u3093\u3067\u304f\u3060\u3055\u3044\u3002";
    return false;
  }

  setPresenceEntry(userId, dateKey, availability, startTime, endTime);
  presenceMonthKey = dateKey.slice(0, 7);
  renderPresenceBoard();

  try {
    await syncPresenceEntryToShared(userId, dateKey);
  } catch (error) {
    messageTarget.textContent = getSharedSyncErrorText(error);
    return false;
  }

  messageTarget.textContent = "\u4fdd\u5b58\u3057\u307e\u3057\u305f\u3002";
  return true;
}

async function deletePresenceEntryForUser(userId, dateKey, messageTarget) {
  if (!dateKey || !userId) {
    messageTarget.textContent = "\u65e5\u4ed8\u3092\u9078\u3093\u3067\u304f\u3060\u3055\u3044\u3002";
    return false;
  }

  setPresenceEntry(userId, dateKey, "", "", "");
  presenceMonthKey = dateKey.slice(0, 7);
  renderPresenceBoard();

  try {
    await syncPresenceEntryToShared(userId, dateKey);
  } catch (error) {
    messageTarget.textContent = getSharedSyncErrorText(error);
    return false;
  }

  messageTarget.textContent = "\u524a\u9664\u3057\u307e\u3057\u305f\u3002";
  return true;
}

function loadPresencePlans() {
  try {
    const raw = window.localStorage.getItem(PRESENCE_PLANS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    const normalizedPlans = {};

    Object.entries(parsed).forEach(([dateKey, byUser]) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey) || !byUser || typeof byUser !== "object") {
        return;
      }

      const normalizedByUser = {};

      Object.entries(byUser).forEach(([userId, entry]) => {
        const normalizedEntry = normalizePresenceEntry(entry);
        if (normalizedEntry) {
          normalizedByUser[String(userId).trim()] = normalizedEntry;
        }
      });

      if (Object.keys(normalizedByUser).length > 0) {
        normalizedPlans[dateKey] = normalizedByUser;
      }
    });

    return normalizedPlans;
  } catch (error) {
    console.warn("Could not load presence plans. Using defaults.", error);
    return {};
  }
}

function savePresencePlans() {
  window.localStorage.setItem(PRESENCE_PLANS_KEY, JSON.stringify(presencePlans));
}

function getPresenceEntry(userId, dateKey) {
  const byDate = presencePlans[dateKey];
  return byDate && typeof byDate === "object" ? byDate[userId] || null : null;
}

function setPresenceEntry(userId, dateKey, availability, startTime, endTime) {
  const nextAvailability = normalizeAvailability(availability);
  const nextStartTime = normalizeTimeValue(startTime);
  const nextEndTime = normalizeTimeValue(endTime);

  if (!nextAvailability && !nextStartTime && !nextEndTime) {
    if (presencePlans[dateKey]) {
      delete presencePlans[dateKey][userId];
      if (Object.keys(presencePlans[dateKey]).length === 0) {
        delete presencePlans[dateKey];
      }
      savePresencePlans();
    }
    return;
  }

  if (!presencePlans[dateKey] || typeof presencePlans[dateKey] !== "object") {
    presencePlans[dateKey] = {};
  }

  presencePlans[dateKey][userId] = {
    availability: nextAvailability,
    startTime: nextStartTime,
    endTime: nextEndTime,
    note: ""
  };
  savePresencePlans();
}

function getDisplayName(id, fallback) {
  if (isSharedStoreActive()) {
    return fallback;
  }

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
  const role = String(rawMember.role || "\u672a\u8a2d\u5b9a").trim() || "\u672a\u8a2d\u5b9a";

  if (!id) {
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

function toSharedUserRow(member) {
  return {
    user_id: member.id,
    display_name: member.displayName,
    role: member.role,
    is_owner: Boolean(member.isOwner),
    updated_at: new Date().toISOString()
  };
}

function toSharedPresenceRow(userId, dateKey, entry) {
  return {
    user_id: userId,
    date_key: dateKey,
    availability: entry.availability,
    start_time: entry.startTime || "",
    end_time: entry.endTime || "",
    note: entry.note || "",
    updated_at: new Date().toISOString()
  };
}

function toSharedTaskRow(userId, task) {
  return {
    id: task.id,
    user_id: userId,
    title: task.title,
    due_date: task.dueDate || null,
    note: task.note || "",
    created_at: task.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function toSharedClockRecordRow(userId, record) {
  return {
    user_id: userId,
    status: record.status,
    last_action_type: record.lastActionType || "",
    last_action_at: record.lastActionAt || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function toSharedClockLogRow(userId, logEntry) {
  return {
    id: logEntry.id,
    user_id: userId,
    action_type: logEntry.actionType,
    status: logEntry.status,
    timestamp: logEntry.timestamp
  };
}

async function ensureSharedSeedMembers() {
  const remoteUsers = await selectSharedRows("lab_users", {
    order: "user_id.asc"
  });
  const remoteIds = new Set((remoteUsers || []).map((row) => String(row.user_id || "").trim()).filter(Boolean));
  const missingUsers = [
    buildOwnerRecord(appConfig),
    ...buildSeedMembers(appConfig)
  ].filter((member) => !remoteIds.has(member.id));

  if (missingUsers.length > 0) {
    await upsertSharedRows(
      "lab_users",
      missingUsers.map((member) => toSharedUserRow(member)),
      "user_id"
    );
  }
}

async function refreshSharedState(options = {}) {
  if (!sharedStore.configured) {
    return false;
  }

  if (sharedSyncInFlight) {
    return sharedSyncInFlight;
  }

  sharedSyncInFlight = (async () => {
    try {
      const [remoteUsers, remotePresence, remoteTasks, remoteClockRecords, remoteClockLogs] =
        await Promise.all([
          selectSharedRows("lab_users", { order: "user_id.asc" }),
          selectSharedRows("lab_presence_plans", { order: "date_key.asc" }),
          selectSharedRows("lab_tasks", { order: "created_at.asc" }),
          selectSharedRows("lab_clock_records", { order: "user_id.asc" }),
          selectSharedRows("lab_clock_logs", { order: "timestamp.asc" })
        ]);

      memberDirectory = buildDirectoryFromRemoteRows(appConfig, remoteUsers);
      presencePlans = buildPresencePlansFromRemoteRows(remotePresence);
      myTasks = buildTasksFromRemoteRows(remoteTasks);
      clockRecords = buildClockRecordsFromRemoteRows(remoteClockRecords);
      clockLogs = buildClockLogsFromRemoteRows(remoteClockLogs);
      cacheSharedSnapshotLocally();
      sharedStore.active = true;
      sharedStore.lastError = "";
      sharedStore.statusText =
        "\u5171\u6709\u4fdd\u5b58\u5148\u304c\u6709\u52b9\u3067\u3001\u4ed6\u306e\u30e6\u30fc\u30b6\u30fc\u306e\u5909\u66f4\u3082\u9806\u6b21\u53cd\u6620\u3055\u308c\u307e\u3059\u3002";

      if (currentUser) {
        const refreshedUser = findMemberById(currentUser.id);
        if (refreshedUser) {
          currentUser = refreshedUser;
          renderWorkspace();
        } else {
          resetToLogin();
        }
      } else if (!options.skipRender) {
        resetLoginFormMessage();
      }

      return true;
    } catch (error) {
      sharedStore.active = false;
      sharedStore.lastError =
        error instanceof Error ? error.message : "\u5171\u6709\u4fdd\u5b58\u5148\u3068\u306e\u540c\u671f\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002";
      if (!options.quiet) {
        console.warn("Shared store sync failed. Falling back to local cache.", error);
      }
      return false;
    } finally {
      sharedSyncInFlight = null;
    }
  })();

  return sharedSyncInFlight;
}

function startSharedSyncLoop() {
  if (!sharedStore.configured || sharedSyncTimer) {
    return;
  }

  sharedSyncTimer = window.setInterval(() => {
    if (document.hidden) {
      return;
    }

    refreshSharedState({ quiet: true, skipRender: false });
  }, sharedStore.syncIntervalMs);
}

function stopSharedSyncLoop() {
  if (!sharedSyncTimer) {
    return;
  }

  window.clearInterval(sharedSyncTimer);
  sharedSyncTimer = 0;
}

async function syncMemberToShared(member) {
  if (!sharedStore.configured) {
    return false;
  }

  await upsertSharedRows("lab_users", [toSharedUserRow(member)], "user_id");
  await refreshSharedState({ quiet: true });
  return true;
}

async function syncPresenceEntryToShared(userId, dateKey) {
  if (!sharedStore.configured) {
    return false;
  }

  const entry = getPresenceEntry(userId, dateKey);

  if (!entry) {
    await deleteSharedRows("lab_presence_plans", [
      { column: "user_id", value: userId },
      { column: "date_key", value: dateKey }
    ]);
  } else {
    await upsertSharedRows(
      "lab_presence_plans",
      [toSharedPresenceRow(userId, dateKey, entry)],
      "user_id,date_key"
    );
  }

  await refreshSharedState({ quiet: true });
  return true;
}

async function syncTaskToShared(userId, task) {
  if (!sharedStore.configured) {
    return false;
  }

  await upsertSharedRows("lab_tasks", [toSharedTaskRow(userId, task)], "id");
  await refreshSharedState({ quiet: true });
  return true;
}

async function deleteTaskFromShared(taskId) {
  if (!sharedStore.configured) {
    return false;
  }

  await deleteSharedRows("lab_tasks", [{ column: "id", value: taskId }]);
  await refreshSharedState({ quiet: true });
  return true;
}

async function syncClockToShared(userId, record, logEntry) {
  if (!sharedStore.configured) {
    return false;
  }

  await upsertSharedRows("lab_clock_records", [toSharedClockRecordRow(userId, record)], "user_id");
  if (logEntry) {
    await upsertSharedRows("lab_clock_logs", [toSharedClockLogRow(userId, logEntry)], "id");
  }
  await refreshSharedState({ quiet: true });
  return true;
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

function getOrderedMembers() {
  const roleOrder = Array.isArray(appConfig.userRoles) ? appConfig.userRoles : [];

  return [...memberDirectory].sort((left, right) => {
    if (left.isOwner && !right.isOwner) {
      return -1;
    }

    if (!left.isOwner && right.isOwner) {
      return 1;
    }

    const leftRoleIndex = roleOrder.indexOf(left.role) === -1 ? Number.MAX_SAFE_INTEGER : roleOrder.indexOf(left.role);
    const rightRoleIndex = roleOrder.indexOf(right.role) === -1 ? Number.MAX_SAFE_INTEGER : roleOrder.indexOf(right.role);

    if (leftRoleIndex !== rightRoleIndex) {
      return leftRoleIndex - rightRoleIndex;
    }

    return left.id.localeCompare(right.id, "ja");
  });
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

function renderAvailabilityOptions(target) {
  target.replaceChildren();

  AVAILABILITY_OPTIONS.forEach((option) => {
    const element = document.createElement("option");
    element.value = option.value;
    element.textContent = option.label;
    target.appendChild(element);
  });
}

function renderConfig(config) {
  document.title = config.appName;
  labName.textContent = config.labName;
  sidebarLabName.textContent = config.labName;
  tagline.textContent = config.tagline;
  loginDescription.textContent = config.loginDescription;
  renderRoleOptions(memberRoleSelect, config.userRoles);
  renderAvailabilityOptions(presenceEditorAvailabilitySelect);
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
  window.scrollTo({ top: 0 });
  renderWorkspace();
}

function createNavButton(category) {
  const button = document.createElement("button");
  const allowed = hasCategoryAccess(currentUser, category.key);
  const active = activeCategory === category.key;

  button.type = "button";
  button.className = `nav-button${category.isChild ? " is-child" : ""}${active ? " is-active" : ""}${allowed ? "" : " is-disabled"}`;
  button.disabled = !allowed;
  button.setAttribute("aria-current", active ? "page" : "false");
  button.innerHTML = `<strong>${category.label}</strong><small>${allowed ? category.short : "\u6a29\u9650\u304c\u3042\u308a\u307e\u305b\u3093"}</small>`;

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
  displayNameMessage.textContent = isSharedStoreActive()
    ? "\u5171\u6709\u4fdd\u5b58\u4e2d"
    : displayNameStatusMessage;

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

function renderPresenceBoard() {
  const orderedMembers = getOrderedMembers();
  const days = getDaysForMonth(presenceMonthKey);

  presenceMonthLabel.textContent = formatMonthLabel(presenceMonthKey);
  presenceTableHead.replaceChildren();
  presenceTableBody.replaceChildren();

  const headRow = document.createElement("tr");
  const corner = document.createElement("th");
  corner.textContent = "\u30e6\u30fc\u30b6\u30fc";
  headRow.appendChild(corner);

  days.forEach((day) => {
    const headCell = document.createElement("th");
    headCell.innerHTML = `
      <span class="presence-day-label">${day.label}</span>
      <span class="presence-weekday${day.isWeekend ? " presence-day-weekend" : ""}">${day.weekday}</span>
    `;
    headRow.appendChild(headCell);
  });

  presenceTableHead.appendChild(headRow);

  orderedMembers.forEach((member) => {
    const row = document.createElement("tr");
    const memberCell = document.createElement("th");
    memberCell.innerHTML = `
      <span class="presence-user-name">${member.displayName}</span>
      <span class="presence-user-meta">${member.role}</span>
    `;
    row.appendChild(memberCell);

    days.forEach((day) => {
      const cell = document.createElement("td");
      const entry = getPresenceEntry(member.id, day.key);
      const isEditableCell = currentUser && member.id === currentUser.id;
      let content;

      if (entry) {
        const availability = getAvailabilityMeta(entry.availability) || getAvailabilityMeta("consult");
        const wrapper = document.createElement("div");
        const badge = document.createElement("span");
        const time = document.createElement("span");

        wrapper.className = "presence-cell-entry";
        wrapper.title = buildPresencePreview(entry);
        badge.className = `presence-cell-value ${availability?.className || ""}`.trim();
        badge.textContent = availability?.symbol || "\u25b3";
        time.className = "presence-cell-time";
        time.textContent = entry.startTime || entry.endTime
          ? formatTimeRange(entry.startTime, entry.endTime)
          : entry.note || "\u4e88\u5b9a\u3042\u308a";

        wrapper.append(badge, time);
        content = wrapper;
      } else {
        const empty = document.createElement("span");
        empty.className = "presence-cell-empty";
        empty.textContent = "-";
        content = empty;
      }

      if (isEditableCell) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "presence-cell-button";
        button.title = `${formatDateKey(day.key)}\u3092\u7de8\u96c6`;
        button.setAttribute("aria-label", `${formatDateKey(day.key)}\u306e\u4e88\u5b9a\u3092\u7de8\u96c6`);
        button.appendChild(content);
        button.addEventListener("click", () => {
          openPresenceEditor(day.key);
        });
        cell.classList.add("is-own-cell");
        cell.appendChild(button);
      } else {
        cell.appendChild(content);
      }

      row.appendChild(cell);
    });

    presenceTableBody.appendChild(row);
  });
}

function createTaskCard(task) {
  const card = document.createElement("article");
  const dueState = getTaskDueState(task.dueDate);

  card.className = "task-card";
  card.innerHTML = `
    <div class="task-card-head">
      <div>
        <strong class="task-card-title">${task.title}</strong>
        <p class="task-card-date">${formatDateKey(task.dueDate)}</p>
      </div>
      <span class="task-chip ${dueState.className}">${dueState.label}</span>
    </div>
    ${task.note ? `<p class="task-card-note">${task.note}</p>` : ""}
    <div class="task-card-actions">
      <button class="secondary-button task-delete-button" type="button" data-task-id="${task.id}">&#x524a;&#x9664;</button>
    </div>
  `;

  return card;
}

function renderTasksView() {
  if (!currentUser) {
    return;
  }

  const tasks = sortTasksByDueDate(getTaskOwnerTasks(currentUser.id));

  taskOwnerText.textContent = `${currentUser.displayName} / ${currentUser.id}`;
  taskList.replaceChildren();

  if (tasks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "task-empty";
    empty.textContent = "\u307e\u3060\u30bf\u30b9\u30af\u304c\u3042\u308a\u307e\u305b\u3093\u3002\u53f3\u306e\u5165\u529b\u304b\u3089\u8ffd\u52a0\u3067\u304d\u307e\u3059\u3002";
    taskList.appendChild(empty);
    return;
  }

  tasks.forEach((task) => {
    taskList.appendChild(createTaskCard(task));
  });
}

function renderClockView() {
  if (!currentUser) {
    return;
  }

  const record = getClockRecord(currentUser.id);
  const logs = getClockLogsForUser(currentUser.id);
  const todayLogs = getTodayClockLogs(logs);
  const monthLogs = getMonthClockLogs(logs);
  const statusMeta = getClockStatusMeta(record.status);
  const actions = buildClockActions(record.status);
  const todaySummary = getClockSummary(todayLogs, record.status);
  const monthSummary = getClockSummary(monthLogs, record.status);
  const totalSummary = getClockSummary(logs, record.status);
  const latestAction = todayLogs.length > 0 ? todayLogs[todayLogs.length - 1] : null;

  clockStatusText.textContent = statusMeta.title;
  clockStatusSubtext.textContent = getStatusStartedText(record, logs);
  if (latestAction?.actionType === "checkout") {
    clockSummaryText.textContent = `\u672c\u65e5\u306e\u6d3b\u52d5\u6642\u9593: ${formatDurationFromMinutes(todaySummary.activeMinutes)}`;
  } else {
    clockSummaryText.textContent = todayLogs.length > 0
      ? `\u672c\u65e5: \u5728\u5ba4 ${formatDurationFromMinutes(todaySummary.stayMinutes)} / \u4f11\u61a9 ${formatDurationFromMinutes(todaySummary.breakMinutes)} / \u5b9f\u50cd ${formatDurationFromMinutes(todaySummary.activeMinutes)}`
      : "\u307e\u3060\u672c\u65e5\u306e\u6d3b\u52d5\u8a18\u9332\u306f\u3042\u308a\u307e\u305b\u3093\u3002";
  }
  clockMonthTotalValue.textContent = formatDurationFromMinutes(monthSummary.activeMinutes);
  clockMonthTotalNote.textContent = formatMonthRangeLabel(new Date());
  clockTotalValue.textContent = formatDurationFromMinutes(totalSummary.activeMinutes);
  clockTotalNote.textContent = logs.length > 0
    ? "\u7d2f\u8a08"
    : "";

  clockActionButtons.replaceChildren();
  clockActionButtons.className = `clock-actions${actions.length === 1 ? " is-single" : ""}`;

  actions.forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `clock-button ${action.tone === "secondary" ? "clock-button-secondary" : "clock-button-primary"}`;
    button.innerHTML = `
      <span class="clock-button-icon">${action.icon}</span>
      <span class="clock-button-label">${action.label}</span>
      <span class="clock-button-note">${action.note}</span>
    `;
    button.addEventListener("click", async () => {
      const result = setClockRecord(currentUser.id, action.nextStatus, action.actionType);
      renderClockView();
      try {
        await syncClockToShared(currentUser.id, result.record, result.logEntry);
      } catch (error) {
        clockSummaryText.textContent = getSharedSyncErrorText(error);
      }
    });
    clockActionButtons.appendChild(button);
  });

  clockHistoryList.replaceChildren();

  const recentEntries = [...todayLogs].reverse();
  if (recentEntries.length === 0) {
    const empty = document.createElement("p");
    empty.className = "clock-history-empty";
    empty.textContent = "\u672c\u65e5\u306e\u8a18\u9332\u306f\u307e\u3060\u3042\u308a\u307e\u305b\u3093\u3002";
    clockHistoryList.appendChild(empty);
  } else {
    recentEntries.forEach((entry) => {
      clockHistoryList.appendChild(createClockHistoryItem(entry));
    });
  }
}

function renderClockMonthlyView() {
  const orderedMembers = getOrderedMembers();

  clockMonthSummaryLabel.textContent = `${formatMonthLabel(clockMonthSummaryKey)}\u306e\u7814\u7a76\u6642\u9593`;
  clockMonthSummaryTableBody.replaceChildren();

  orderedMembers.forEach((member) => {
    const logs = getClockLogsForUser(member.id);
    const record = getClockRecord(member.id);
    const { logs: monthLogs, summary } = getClockSummaryForMonth(logs, record, clockMonthSummaryKey);
    const latestLog = monthLogs.length > 0 ? monthLogs[monthLogs.length - 1] : null;

    const row = document.createElement("tr");
    const userCell = document.createElement("th");
    const roleCell = document.createElement("td");
    const activeCell = document.createElement("td");
    const stayCell = document.createElement("td");
    const breakCell = document.createElement("td");
    const latestCell = document.createElement("td");

    userCell.innerHTML = `
      <span class="presence-user-name">${member.displayName}</span>
      <span class="presence-user-meta">${member.id}</span>
    `;
    roleCell.textContent = member.role;
    activeCell.innerHTML = `<strong class="clock-monthly-primary">${formatDurationFromMinutes(summary.activeMinutes)}</strong>`;
    stayCell.textContent = formatDurationFromMinutes(summary.stayMinutes);
    breakCell.textContent = formatDurationFromMinutes(summary.breakMinutes);
    latestCell.innerHTML = latestLog
      ? `
        <span class="clock-monthly-last-action">${getClockActionLabel(latestLog.actionType)}</span>
        <span class="clock-monthly-last-time">${formatDateTime(new Date(latestLog.timestamp))}</span>
      `
      : `<span class="clock-monthly-empty">\u672a\u6253\u523b</span>`;

    row.append(userCell, roleCell, activeCell, stayCell, breakCell, latestCell);
    clockMonthSummaryTableBody.appendChild(row);
  });
}

function renderSettings() {
  renderCurrentUserSummary();

  const baseNotice = canManagePermissions(currentUser)
    ? "\u57fa\u672c\u6a5f\u80fd\u5229\u7528\u53ef / \u30e6\u30fc\u30b6\u30fc\u8ffd\u52a0\u53ef"
    : "\u57fa\u672c\u6a5f\u80fd\u5229\u7528\u53ef / \u30e6\u30fc\u30b6\u30fc\u8ffd\u52a0\u4e0d\u53ef";
  settingsNotice.textContent = `${baseNotice} ${getSharedStoreStatusText()}`;

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

  if (activeCategory === "presence") {
    renderPresenceBoard();
  }

  if (activeCategory === "tasks") {
    renderTasksView();
  }

  if (activeCategory === "clock") {
    renderClockView();
  }

  if (activeCategory === "clockMonthly") {
    renderClockMonthlyView();
  }

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
  closePresenceEditor();
  workspaceView.hidden = true;
  authView.hidden = false;
  loginForm.reset();
  clearActiveUser();
  history.replaceState(null, "", window.location.pathname);
  resetLoginFormMessage();
  displayNameStatusMessage =
    "\u3053\u306e\u7aef\u672b\u306b\u4fdd\u5b58";
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

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userId = userIdInput.value.trim();
  let member = findMemberById(userId);

  if (!userId) {
    loginMessage.textContent = "\u5b66\u7c4d\u756a\u53f7\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002";
    return;
  }

  if (!member && sharedStore.configured) {
    loginMessage.textContent =
      "\u5171\u6709\u4fdd\u5b58\u5148\u3092\u518d\u78ba\u8a8d\u3057\u3066\u3044\u307e\u3059\u3002";
    await refreshSharedState({ quiet: true, skipRender: true });
    member = findMemberById(userId);
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

displayNameForm.addEventListener("submit", async (event) => {
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
  if (!isSharedStoreActive()) {
    displayNameOverrides[currentUser.id] = nextDisplayName;
    saveDisplayNameOverrides();
  }
  saveDirectory();
  displayNameStatusMessage = "\u8868\u793a\u540d\u3092\u66f4\u65b0\u3057\u307e\u3057\u305f\u3002";
  try {
    await syncMemberToShared(currentUser);
  } catch (error) {
    displayNameStatusMessage = getSharedSyncErrorText(error);
  }
  renderWorkspace();
});

presencePrevButton.addEventListener("click", () => {
  presenceMonthKey = shiftMonthKey(presenceMonthKey, -1);
  renderPresenceBoard();
});

presenceTodayButton.addEventListener("click", () => {
  presenceMonthKey = getMonthKey(new Date());
  renderPresenceBoard();
});

presenceNextButton.addEventListener("click", () => {
  presenceMonthKey = shiftMonthKey(presenceMonthKey, 1);
  renderPresenceBoard();
});

clockMonthSummaryPrevButton.addEventListener("click", () => {
  clockMonthSummaryKey = shiftMonthKey(clockMonthSummaryKey, -1);
  renderClockMonthlyView();
});

clockMonthSummaryTodayButton.addEventListener("click", () => {
  clockMonthSummaryKey = getMonthKey(new Date());
  renderClockMonthlyView();
});

clockMonthSummaryNextButton.addEventListener("click", () => {
  clockMonthSummaryKey = shiftMonthKey(clockMonthSummaryKey, 1);
  renderClockMonthlyView();
});

presenceEditorStartTimeInput.addEventListener("input", () => {
  updatePresenceEditorPreview();
});

presenceEditorEndTimeInput.addEventListener("input", () => {
  updatePresenceEditorPreview();
});

presenceEditorAvailabilitySelect.addEventListener("change", () => {
  updatePresenceEditorPreview();
});

presenceEditorForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const saved = await savePresenceEntryForUser(
    currentUser?.id,
    presenceEditorDateKey,
    presenceEditorStartTimeInput.value,
    presenceEditorEndTimeInput.value,
    presenceEditorAvailabilitySelect.value,
    presenceEditorMessage
  );

  if (saved) {
    closePresenceEditor();
  }
});

presenceEditorDeleteButton.addEventListener("click", async () => {
  const deleted = await deletePresenceEntryForUser(currentUser?.id, presenceEditorDateKey, presenceEditorMessage);

  if (deleted) {
    closePresenceEditor();
  }
});

presenceEditorCloseButton.addEventListener("click", () => {
  closePresenceEditor();
});

presenceEditorModal.addEventListener("click", (event) => {
  if (event.target === presenceEditorModal) {
    closePresenceEditor();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !presenceEditorModal.hidden) {
    closePresenceEditor();
  }
});

memberForm.addEventListener("submit", async (event) => {
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
  try {
    await syncMemberToShared(findMemberById(memberId));
  } catch (error) {
    memberFormMessage.textContent = getSharedSyncErrorText(error);
  }
  renderSettings();
});

logoutButton.addEventListener("click", () => {
  resetToLogin();
});

clockExportButton.addEventListener("click", () => {
  downloadClockCsv();
});

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentUser) {
    return;
  }

  const title = taskTitleInput.value.trim();
  const dueDate = taskDueDateInput.value;
  const note = taskNoteInput.value.trim();

  if (!title) {
    taskFormMessage.textContent = "\u30bf\u30b9\u30af\u540d\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002";
    return;
  }

  const task = addTaskForUser(currentUser.id, title, dueDate, note);
  taskForm.reset();
  taskFormMessage.textContent = "\u30bf\u30b9\u30af\u3092\u8ffd\u52a0\u3057\u307e\u3057\u305f\u3002";
  renderTasksView();
  try {
    await syncTaskToShared(currentUser.id, task);
  } catch (error) {
    taskFormMessage.textContent = getSharedSyncErrorText(error);
  }
});

taskList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-task-id]");
  if (!button || !currentUser) {
    return;
  }

  deleteTaskForUser(currentUser.id, button.dataset.taskId);
  taskFormMessage.textContent = "\u30bf\u30b9\u30af\u3092\u524a\u9664\u3057\u307e\u3057\u305f\u3002";
  renderTasksView();
  try {
    await deleteTaskFromShared(button.dataset.taskId);
  } catch (error) {
    taskFormMessage.textContent = getSharedSyncErrorText(error);
  }
});

window.addEventListener("hashchange", () => {
  if (!currentUser) {
    return;
  }

  const nextKey = window.location.hash.replace(/^#/, "");
  if (nextKey && hasCategoryAccess(currentUser, nextKey)) {
    activeCategory = nextKey;
    window.scrollTo({ top: 0 });
    renderWorkspace();
  }
});

async function init() {
  appConfig = await loadConfig();
  sharedStore = createSharedStoreConfig(appConfig);
  displayNameOverrides = loadDisplayNameOverrides();
  presencePlans = loadPresencePlans();
  clockRecords = loadClockRecords();
  clockLogs = loadClockLogs();
  myTasks = loadMyTasks();
  presenceMonthKey = getMonthKey(new Date());
  clockMonthSummaryKey = getMonthKey(new Date());
  memberDirectory = loadStoredDirectory(appConfig);

  if (sharedStore.configured) {
    try {
      await ensureSharedSeedMembers();
      await refreshSharedState({ quiet: true, skipRender: true });
      startSharedSyncLoop();
    } catch (error) {
      sharedStore.active = false;
      sharedStore.lastError =
        error instanceof Error ? error.message : "\u5171\u6709\u4fdd\u5b58\u5148\u3068\u306e\u63a5\u7d9a\u306b\u5931\u6557\u3057\u307e\u3057\u305f\u3002";
      console.warn("Shared store setup failed. Using local cache only.", error);
    }
  }

  renderConfig(appConfig);
  loginForm.reset();
  memberRoleSelect.value = appConfig.userRoles[0];
  resetLoginFormMessage();
  if (!restoreActiveUser()) {
    focusUserIdInput();
  }
  renderClockNow();
  window.setInterval(renderClockNow, 1000);
  await registerServiceWorker();
}

init();
