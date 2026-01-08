var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// .wrangler/tmp/bundle-i9MzN3/checked-fetch.js
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
var urls;
var init_checked_fetch = __esm({
  ".wrangler/tmp/bundle-i9MzN3/checked-fetch.js"() {
    urls = /* @__PURE__ */ new Set();
    __name(checkURL, "checkURL");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        const [request, init] = argArray;
        checkURL(request, init);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_checked_fetch();
    init_modules_watch_stub();
  }
});

// ../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// database.js
var database_exports = {};
__export(database_exports, {
  createTables: () => createTables,
  decryptWithAES: () => decryptWithAES,
  encryptWithAES: () => encryptWithAES,
  fetchAndParseM3U: () => fetchAndParseM3U,
  generateEncryptionKey: () => generateEncryptionKey,
  generatePlayToken: () => generatePlayToken,
  getDB: () => getDB,
  getHomepageDisplayConfig: () => getHomepageDisplayConfig,
  getIPBlacklistConfig: () => getIPBlacklistConfig,
  getSecurityConfig: () => getSecurityConfig,
  getSyncFilterConfig: () => getSyncFilterConfig,
  getSystemConfig: () => getSystemConfig,
  initDB: () => initDB,
  parseM3UContent: () => parseM3UContent,
  updateHomepageDisplayConfig: () => updateHomepageDisplayConfig,
  updateIPBlacklistConfig: () => updateIPBlacklistConfig,
  updateSecurityConfig: () => updateSecurityConfig,
  updateSyncFilterConfig: () => updateSyncFilterConfig,
  updateSystemConfig: () => updateSystemConfig,
  verifyPlayToken: () => verifyPlayToken,
  verifyReferer: () => verifyReferer
});
async function initDB(env) {
  if (!DB) {
    DB = env.DB;
  }
  return DB;
}
function getDB() {
  if (!DB) {
    throw new Error("Database not initialized");
  }
  return DB;
}
async function createTables(env) {
  const db = env.DB;
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS sources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT, 
      url TEXT, 
      type TEXT DEFAULT 'm3u',
      parse_mode TEXT DEFAULT 'strict',
      last_updated DATETIME
    )
  `).run();
  try {
    await db.prepare("ALTER TABLE sources ADD COLUMN is_active BOOLEAN DEFAULT 1").run();
    console.log("Migrated sources table: added is_active column");
  } catch (e) {
    if (!e.message.includes("duplicate column name")) {
      console.error("Migration error:", e);
    }
  }
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS channels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id INTEGER,
      channel_name TEXT, 
      group_title TEXT,
      logo TEXT,
      play_url TEXT, 
      headers TEXT,
      channel_hash TEXT,
      is_active BOOLEAN DEFAULT 1,
      FOREIGN KEY(source_id) REFERENCES sources(id)
    )
  `).run();
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_channel_hash ON channels(channel_hash)
  `).run();
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_channels_is_active ON channels(is_active)
  `).run();
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_channels_source_id ON channels(source_id)
  `).run();
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_sources_is_active ON sources(is_active)
  `).run();
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS codes (
      code TEXT PRIMARY KEY,
      status TEXT DEFAULT 'unused',
      duration_days INTEGER,
      activated_at DATETIME,
      expired_at DATETIME,
      max_ips INTEGER DEFAULT 3,
      remark TEXT,
      banned_until DATETIME
    )
  `).run();
  await db.prepare(`
    CREATE INDEX IF NOT EXISTS idx_code_status ON codes(status)
  `).run();
  try {
    await db.prepare("ALTER TABLE codes ADD COLUMN banned_until DATETIME").run();
    console.log("Migrated codes table: added banned_until column");
  } catch (e) {
    if (!e.message.includes("duplicate column name")) {
      console.error("Migration error:", e);
    }
  }
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `).run();
  const defaultSettings = {
    "channel_daily_limit": "100",
    "ban_duration_days": "7",
    "auto_ban_on_exceed": "true",
    // IP黑名单配置
    "sub_rate_min": "1",
    "sub_rate_hour": "60",
    "sub_rate_day": "500",
    "live_rate_min": "5",
    "live_rate_hour": "300",
    "live_rate_day": "2000",
    "admin_rate_hour": "10",
    // 首页展示配置（JSON格式）
    "homepage_display_config": "{}",
    // 系统安全配置
    "enable_ref_check": "false",
    "ref_whitelist": "",
    "enable_play_token": "true",
    "play_token_expire_seconds": "3600",
    "enable_ip_bind": "true",
    "enable_burn_after_read": "true",
    // URL加密配置
    "enable_url_encryption": "false",
    "url_encryption_key": "",
    // 同步过滤规则配置（JSON格式）
    "sync_filter_config": "{}"
  };
  for (const [key, value] of Object.entries(defaultSettings)) {
    const existing = await db.prepare("SELECT value FROM settings WHERE key = ?").bind(key).first();
    if (!existing) {
      await db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").bind(key, value).run();
    }
  }
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS play_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL,
      channel_hash TEXT NOT NULL,
      client_ip TEXT,
      played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_date DATE DEFAULT (DATE('now'))
    )
  `).run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_play_logs_code ON play_logs(code)").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_play_logs_code_date ON play_logs(code, created_date)").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_play_logs_code_hash_date ON play_logs(code, channel_hash, created_date)").run();
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS play_counts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL,
      channel_hash TEXT NOT NULL,
      play_count INTEGER DEFAULT 0,
      created_date DATE DEFAULT (DATE('now')),
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(code, channel_hash, created_date)
    )
  `).run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_play_counts_unique ON play_counts(code, channel_hash, created_date)").run();
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS ip_access_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
      path TEXT NOT NULL,
      request_count INTEGER DEFAULT 1,
      first_access DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_access DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_date DATE DEFAULT (DATE('now'))
    )
  `).run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_ip_access_logs_ip_date ON ip_access_logs(ip, created_date)").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_ip_access_logs_ip_path_date ON ip_access_logs(ip, path, created_date)").run();
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS ip_blacklist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL UNIQUE,
      banned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reason TEXT,
      details TEXT,
      permanent BOOLEAN DEFAULT 1
    )
  `).run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_ip_blacklist_ip ON ip_blacklist(ip)").run();
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS used_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT NOT NULL UNIQUE,
      used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME
    )
  `).run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_used_tokens_token ON used_tokens(token)").run();
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      enabled BOOLEAN DEFAULT 1,
      display_frequency TEXT DEFAULT 'once',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
  try {
    await db.prepare("ALTER TABLE announcements ADD COLUMN display_frequency TEXT DEFAULT 'once'").run();
    console.log("Migrated announcements table: added display_frequency column");
  } catch (e) {
    if (!e.message.includes("duplicate column name")) {
      console.error("Migration error:", e);
    }
  }
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_announcements_enabled ON announcements(enabled)").run();
  await db.prepare("CREATE INDEX IF NOT EXISTS idx_announcements_updated ON announcements(updated_at DESC)").run();
  console.log("Tables created successfully");
}
async function getSecurityConfig() {
  const db = getDB();
  const settings = await db.prepare("SELECT key, value FROM settings WHERE key IN (?, ?, ?)").bind("channel_daily_limit", "ban_duration_days", "auto_ban_on_exceed").all();
  const config = {
    channel_daily_limit: 100,
    ban_duration_days: 7,
    auto_ban_on_exceed: true
  };
  settings.results?.forEach((row) => {
    if (row.key === "channel_daily_limit") {
      config.channel_daily_limit = parseInt(row.value) || 100;
    } else if (row.key === "ban_duration_days") {
      config.ban_duration_days = parseInt(row.value) || 7;
    } else if (row.key === "auto_ban_on_exceed") {
      config.auto_ban_on_exceed = row.value === "true";
    }
  });
  return config;
}
async function getIPBlacklistConfig() {
  const db = getDB();
  const settings = await db.prepare("SELECT key, value FROM settings WHERE key IN (?, ?, ?, ?, ?, ?, ?)").bind("sub_rate_min", "sub_rate_hour", "sub_rate_day", "live_rate_min", "live_rate_hour", "live_rate_day", "admin_rate_hour").all();
  const config = {
    sub_rate_min: 1,
    sub_rate_hour: 60,
    sub_rate_day: 500,
    live_rate_min: 5,
    live_rate_hour: 300,
    live_rate_day: 2e3,
    admin_rate_hour: 10
  };
  settings.results?.forEach((row) => {
    if (config.hasOwnProperty(row.key)) {
      config[row.key] = parseInt(row.value) || config[row.key];
    }
  });
  return config;
}
async function updateIPBlacklistConfig(config) {
  const db = getDB();
  const fields = ["sub_rate_min", "sub_rate_hour", "sub_rate_day", "live_rate_min", "live_rate_hour", "live_rate_day", "admin_rate_hour"];
  for (const field of fields) {
    if (config[field] !== void 0 && config[field] > 0) {
      await db.prepare("UPDATE settings SET value = ? WHERE key = ?").bind(config[field].toString(), field).run();
    }
  }
}
async function getHomepageDisplayConfig() {
  const db = getDB();
  const result = await db.prepare("SELECT value FROM settings WHERE key = ?").bind("homepage_display_config").first();
  if (!result) {
    return {
      sources: [],
      // 启用的数据源ID列表，空表示全部
      groups: [],
      // 启用的分类列表，空表示全部
      hosts: [],
      // 启用的host列表，空表示全部
      hasHeaders: null,
      // null=全部, true=有请求头, false=无请求头
      manualHosts: []
      // 手动添加的域名列表
    };
  }
  try {
    const config = JSON.parse(result.value);
    return {
      sources: config.sources || [],
      groups: config.groups || [],
      hosts: config.hosts || [],
      hasHeaders: config.hasHeaders !== void 0 ? config.hasHeaders : null,
      manualHosts: config.manualHosts || []
    };
  } catch (e) {
    console.error("Failed to parse homepage_display_config:", e);
    return {
      sources: [],
      groups: [],
      hosts: [],
      hasHeaders: null,
      manualHosts: []
    };
  }
}
async function updateHomepageDisplayConfig(config) {
  const db = getDB();
  const configJson = JSON.stringify(config);
  await db.prepare("UPDATE settings SET value = ? WHERE key = ?").bind(configJson, "homepage_display_config").run();
}
async function getSystemConfig() {
  const db = getDB();
  const settings = await db.prepare("SELECT key, value FROM settings WHERE key IN (?, ?, ?, ?, ?, ?, ?, ?, ?)").bind("enable_ref_check", "ref_whitelist", "enable_play_token", "play_token_expire_seconds", "homepage_display_config", "enable_ip_bind", "enable_burn_after_read", "enable_url_encryption", "url_encryption_key").all();
  const config = {
    enable_ref_check: false,
    ref_whitelist: "",
    enable_play_token: false,
    play_token_expire_seconds: 3600,
    homepage_display_config: {},
    enable_ip_bind: false,
    enable_burn_after_read: false,
    enable_url_encryption: false,
    url_encryption_key: ""
  };
  settings.results?.forEach((row) => {
    if (row.key === "enable_ref_check") {
      config.enable_ref_check = row.value === "true";
    } else if (row.key === "ref_whitelist") {
      config.ref_whitelist = row.value || "";
    } else if (row.key === "enable_play_token") {
      config.enable_play_token = row.value === "true";
    } else if (row.key === "play_token_expire_seconds") {
      config.play_token_expire_seconds = parseInt(row.value) || 3600;
    } else if (row.key === "homepage_display_config") {
      try {
        config.homepage_display_config = JSON.parse(row.value);
      } catch (e) {
        config.homepage_display_config = {};
      }
    } else if (row.key === "enable_ip_bind") {
      config.enable_ip_bind = row.value === "true";
    } else if (row.key === "enable_burn_after_read") {
      config.enable_burn_after_read = row.value === "true";
    } else if (row.key === "enable_url_encryption") {
      config.enable_url_encryption = row.value === "true";
    } else if (row.key === "url_encryption_key") {
      config.url_encryption_key = row.value || "";
    }
  });
  return config;
}
async function getSyncFilterConfig() {
  const db = getDB();
  const result = await db.prepare("SELECT value FROM settings WHERE key = ?").bind("sync_filter_config").first();
  if (!result) {
    return {
      excludeGroups: [],
      excludeUrls: [],
      excludeNames: [],
      excludeDuplicateUrls: false,
      groupRenameRules: [],
      groupRenameExclude: []
    };
  }
  try {
    return JSON.parse(result.value);
  } catch (e) {
    console.error("Failed to parse sync_filter_config:", e);
    return {
      excludeGroups: [],
      excludeUrls: [],
      excludeNames: [],
      excludeDuplicateUrls: false,
      groupRenameRules: [],
      groupRenameExclude: []
    };
  }
}
async function updateSyncFilterConfig(config) {
  const db = getDB();
  const configJson = JSON.stringify(config);
  const existing = await db.prepare("SELECT value FROM settings WHERE key = ?").bind("sync_filter_config").first();
  if (existing) {
    await db.prepare("UPDATE settings SET value = ? WHERE key = ?").bind(configJson, "sync_filter_config").run();
  } else {
    await db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").bind("sync_filter_config", configJson).run();
  }
}
async function updateSystemConfig(config) {
  const db = getDB();
  if (config.enable_ref_check !== void 0) {
    await db.prepare("UPDATE settings SET value = ? WHERE key = ?").bind(config.enable_ref_check.toString(), "enable_ref_check").run();
  }
  if (config.ref_whitelist !== void 0) {
    await db.prepare("UPDATE settings SET value = ? WHERE key = ?").bind(config.ref_whitelist || "", "ref_whitelist").run();
  }
  if (config.enable_play_token !== void 0) {
    await db.prepare("UPDATE settings SET value = ? WHERE key = ?").bind(config.enable_play_token.toString(), "enable_play_token").run();
  }
  if (config.play_token_expire_seconds !== void 0) {
    await db.prepare("UPDATE settings SET value = ? WHERE key = ?").bind(config.play_token_expire_seconds.toString(), "play_token_expire_seconds").run();
  }
  if (config.enable_ip_bind !== void 0) {
    await db.prepare("UPDATE settings SET value = ? WHERE key = ?").bind(config.enable_ip_bind.toString(), "enable_ip_bind").run();
  }
  if (config.enable_burn_after_read !== void 0) {
    await db.prepare("UPDATE settings SET value = ? WHERE key = ?").bind(config.enable_burn_after_read.toString(), "enable_burn_after_read").run();
  }
  if (config.enable_url_encryption !== void 0) {
    await db.prepare("UPDATE settings SET value = ? WHERE key = ?").bind(config.enable_url_encryption.toString(), "enable_url_encryption").run();
  }
  if (config.url_encryption_key !== void 0) {
    await db.prepare("UPDATE settings SET value = ? WHERE key = ?").bind(config.url_encryption_key || "", "url_encryption_key").run();
  }
}
function generateEncryptionKey(length = 32) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}
async function generatePlayToken(channelHash, clientIp, secret) {
  const timestamp = Math.floor(Date.now() / 1e3);
  const nonce = crypto.randomUUID();
  const ipEncoder = new TextEncoder();
  const ipHashBuffer = await crypto.subtle.digest("SHA-256", ipEncoder.encode(clientIp || "unknown"));
  const ipHashArray = Array.from(new Uint8Array(ipHashBuffer));
  const ipHash = ipHashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  const encoder = new TextEncoder();
  const data = encoder.encode(`${channelHash}:${timestamp}:${nonce}`);
  const keyData = encoder.encode(secret || "default-secret-key");
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  ).then((key) => {
    return crypto.subtle.sign("HMAC", key, data);
  }).then((signature) => {
    const signatureArray = Array.from(new Uint8Array(signature));
    const signatureHex = signatureArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return `${channelHash}:${timestamp}:${nonce}:${ipHash}:${signatureHex}`;
  });
}
async function verifyPlayToken(token, secret, env, request, db = null) {
  try {
    const parts = token.split(":");
    if (parts.length !== 5) {
      console.log("[Token] Invalid token format");
      return false;
    }
    const [channelHash, timestampStr, nonce, ipHash, signature] = parts;
    const timestamp = parseInt(timestampStr);
    const now = Math.floor(Date.now() / 1e3);
    const config = await getSystemConfig();
    const expireSeconds = config.play_token_expire_seconds || 3600;
    if (now - timestamp > expireSeconds) {
      console.log("[Token] Token expired");
      return false;
    }
    if (request && config.enable_ip_bind !== false) {
      const clientIp = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For")?.split(",")[0] || "unknown";
      const ipEncoder = new TextEncoder();
      const requestIpHashBuffer = await crypto.subtle.digest("SHA-256", ipEncoder.encode(clientIp || "unknown"));
      const requestIpHashArray = Array.from(new Uint8Array(requestIpHashBuffer));
      const requestIpHash = requestIpHashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      if (requestIpHash !== ipHash) {
        console.log("[Token] IP mismatch (anti-proxy protection)", { expected: ipHash.substring(0, 8), got: requestIpHash.substring(0, 8) });
        return false;
      }
    }
    if (db && config.enable_burn_after_read !== false) {
      const usedResult = await db.prepare(`
        SELECT id FROM used_tokens WHERE token = ?
      `).bind(token).first();
      if (usedResult) {
        console.log("[Token] Token already used (replay attack prevented)", { token: token.substring(0, 30) + "..." });
        return false;
      }
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(`${channelHash}:${timestampStr}:${nonce}`);
    const keyData = encoder.encode(secret || "default-secret-key");
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const signatureArray = new Uint8Array(signature.match(/.{2}/g).map((byte) => parseInt(byte, 16)));
    const isValid = await crypto.subtle.verify("HMAC", key, signatureArray, data);
    if (!isValid) {
      console.log("[Token] Invalid signature");
      return false;
    }
    if (db && config.enable_burn_after_read !== false) {
      await db.prepare(`
        INSERT INTO used_tokens (token, used_at, expires_at)
        VALUES (?, CURRENT_TIMESTAMP, datetime('now', '+' || ? || ' seconds'))
      `).bind(token, expireSeconds).run();
      console.log("[Token] Token marked as used (burn after read)", { token, expireSeconds });
    }
    return true;
  } catch (e) {
    console.error("Token verification error:", e);
    return false;
  }
}
function verifyReferer(referer, whitelist) {
  if (!whitelist || whitelist.trim() === "") return true;
  const allowedDomains = whitelist.split(",").map((d) => d.trim()).filter((d) => d);
  if (allowedDomains.length === 0) return true;
  if (!referer) return false;
  try {
    const refererUrl = new URL(referer);
    return allowedDomains.some((domain) => {
      if (domain === "*") return true;
      return refererUrl.hostname === domain || refererUrl.hostname.endsWith("." + domain);
    });
  } catch (e) {
    return false;
  }
}
async function updateSecurityConfig(config) {
  const db = getDB();
  if (config.channel_daily_limit !== void 0) {
    await db.prepare("UPDATE settings SET value = ? WHERE key = ?").bind(config.channel_daily_limit.toString(), "channel_daily_limit").run();
  }
  if (config.ban_duration_days !== void 0) {
    await db.prepare("UPDATE settings SET value = ? WHERE key = ?").bind(config.ban_duration_days.toString(), "ban_duration_days").run();
  }
  if (config.auto_ban_on_exceed !== void 0) {
    await db.prepare("UPDATE settings SET value = ? WHERE key = ?").bind(config.auto_ban_on_exceed.toString(), "auto_ban_on_exceed").run();
  }
}
function normalizeChannelName(name) {
  if (!name) return name;
  const cctvRegex = /^cctv[-\s+]?(\d{1,2})(\+)?\b([\u4e00-\u9fa5A-Za-z0-9\s-]*)?/iu;
  const match = name.match(cctvRegex);
  if (match) {
    const num = parseInt(match[1]);
    const plus = match[2] || "";
    if (num >= 1 && num <= 17) {
      const newName = "CCTV" + num + plus;
      if (match[3] && match[3].trim()) {
        return newName + match[3];
      }
      return newName;
    }
  }
  return name;
}
function customChannelSort(a, b) {
  const nameA = a.channel_name || "";
  const nameB = b.channel_name || "";
  const cctvMatchA = nameA.match(/^([A-Za-z]+)(\d+)/);
  const cctvMatchB = nameB.match(/^([A-Za-z]+)(\d+)/);
  if (cctvMatchA && cctvMatchB && cctvMatchA[1].toUpperCase() === cctvMatchB[1].toUpperCase()) {
    const numA = parseInt(cctvMatchA[2]);
    const numB = parseInt(cctvMatchB[2]);
    if (numA !== numB) {
      return numA - numB;
    }
    const suffixA = nameA.substring(cctvMatchA[1].length + cctvMatchA[2].length);
    const suffixB = nameB.substring(cctvMatchB[1].length + cctvMatchB[2].length);
    const hasSuffixA = suffixA.trim().length > 0;
    const hasSuffixB = suffixB.trim().length > 0;
    if (hasSuffixA !== hasSuffixB) {
      return hasSuffixA ? 1 : -1;
    }
    return suffixA.localeCompare(suffixB, "zh-CN", { numeric: true });
  }
  for (let i = 0; i < Math.min(nameA.length, nameB.length); i++) {
    const charA = nameA.charCodeAt(i);
    const charB = nameB.charCodeAt(i);
    const isAlphaA = charA >= 65 && charA <= 90 || charA >= 97 && charA <= 122;
    const isAlphaB = charB >= 65 && charB <= 90 || charB >= 97 && charB <= 122;
    const isDigitA = charA >= 48 && charA <= 57;
    const isDigitB = charB >= 48 && charB <= 57;
    const isChineseA = charA >= 19968 && charA <= 40869;
    const isChineseB = charB >= 19968 && charB <= 40869;
    const typeA = isAlphaA ? 1 : isDigitA ? 2 : isChineseA ? 3 : 4;
    const typeB = isAlphaB ? 1 : isDigitB ? 2 : isChineseB ? 3 : 4;
    if (typeA !== typeB) {
      return typeA - typeB;
    }
    if (charA !== charB) {
      return charA - charB;
    }
  }
  return nameA.length - nameB.length;
}
async function parseM3UContent(content, sourceId, filter = {}) {
  const db = getDB();
  const channels = [];
  let globalHeaders = {};
  const processedUrls = /* @__PURE__ */ new Set();
  sourceId = parseInt(sourceId);
  if (isNaN(sourceId) || sourceId <= 0) {
    throw new Error("Invalid source ID");
  }
  const extm3uMatch = content.match(/^#EXTM3U\s*(.*)$/m);
  if (extm3uMatch) {
    const extm3uLine = extm3uMatch[1];
    const uaMatch = extm3uLine.match(/user-agent\s*=\s*"([^"]+)"/i);
    if (uaMatch) {
      globalHeaders["User-Agent"] = uaMatch[1];
    }
  }
  const blocks = content.split(/^#EXTINF:/m);
  console.log(`[Sync] Found ${blocks.length - 1} potential channels in M3U`);
  for (const block of blocks) {
    if (!block.trim()) continue;
    const lines = block.trim().split("\n");
    if (lines.length === 0) continue;
    const currentChannel = {
      source_id: sourceId,
      headers: { ...globalHeaders }
    };
    const extinfLine = "#EXTINF:" + lines[0];
    const nameMatch = extinfLine.match(/,([^,\n]+)$/);
    if (nameMatch) {
      currentChannel.channel_name = nameMatch[1].trim();
      currentChannel.channel_name = normalizeChannelName(currentChannel.channel_name);
    } else {
      const idMatch = extinfLine.match(/tvg-id="([^"]+)"/i);
      if (idMatch) {
        currentChannel.channel_name = idMatch[1].trim();
        currentChannel.channel_name = normalizeChannelName(currentChannel.channel_name);
      } else {
        currentChannel.channel_name = "Unknown";
        console.warn("[Sync] No channel name found for line:", extinfLine.substring(0, 100));
      }
    }
    const groupMatch = extinfLine.match(/group-title\s*=\s*"([^"]+)"/i);
    if (groupMatch) {
      currentChannel.group_title = groupMatch[1];
    }
    const logoMatch = extinfLine.match(/tvg-logo\s*=\s*"([^"]+)"/i);
    if (logoMatch) {
      currentChannel.logo = logoMatch[1];
    }
    const uaMatch = extinfLine.match(/http-user-agent\s*=\s*"([^"]+)"/i);
    if (uaMatch) {
      currentChannel.headers["User-Agent"] = uaMatch[1];
    }
    const uaMatch2 = extinfLine.match(/ua\s*=\s*"([^"]+)"/i);
    if (uaMatch2) {
      currentChannel.headers["User-Agent"] = uaMatch2[1];
    }
    const uaMatch3 = extinfLine.match(/user_agent\s*=\s*"([^"]+)"/i);
    if (uaMatch3) {
      currentChannel.headers["User-Agent"] = uaMatch3[1];
    }
    const httpHeaderMatch = extinfLine.match(/http-header\s*=\s*"([^"]+)"/i);
    if (httpHeaderMatch) {
      let parts = httpHeaderMatch[1].split("=", 2);
      if (parts.length !== 2 || parts[0].trim() === "") {
        parts = httpHeaderMatch[1].split(":", 2);
      }
      if (parts.length === 2) {
        const headerKey = parts[0].trim();
        const headerValue = parts[1].trim();
        currentChannel.headers[headerKey] = headerValue;
      }
    }
    const httpRefererMatch = extinfLine.match(/http-referer\s*=\s*"([^"]+)"/i);
    if (httpRefererMatch) {
      currentChannel.headers["Referer"] = httpRefererMatch[1];
    }
    const refererMatch = extinfLine.match(/(?:^|[^-])referer\s*=\s*"([^"]+)"/i);
    if (refererMatch) {
      currentChannel.headers["Referer"] = refererMatch[1];
    }
    let urlLine = null;
    let vlcOptProcessed = false;
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!vlcOptProcessed && line.startsWith("#EXTVLCOPT:")) {
        const vlcUAMatch = line.match(/http-user-agent\s*=\s*([^\s]+)/i);
        if (vlcUAMatch) {
          currentChannel.headers["User-Agent"] = vlcUAMatch[1];
        }
        const vlcRefererMatch = line.match(/http-referrer\s*=\s*([^\s]+)/i);
        if (vlcRefererMatch) {
          currentChannel.headers["Referer"] = vlcRefererMatch[1];
        }
        vlcOptProcessed = true;
        continue;
      }
      if (!line.startsWith("#") && line) {
        urlLine = line;
        break;
      }
    }
    if (!urlLine) continue;
    currentChannel.play_url = urlLine;
    try {
      const urlObj = new URL(urlLine);
      if (urlObj.searchParams.has("User-Agent")) {
        currentChannel.headers["User-Agent"] = urlObj.searchParams.get("User-Agent");
      }
    } catch (e) {
    }
    if (filter) {
      if (filter.excludeGroups && filter.excludeGroups.length > 0) {
        if (currentChannel.group_title && filter.excludeGroups.some(
          (keyword) => currentChannel.group_title.toLowerCase().includes(keyword.toLowerCase())
        )) {
          console.log(`[Filter] Excluding group: "${currentChannel.group_title}" (matched keyword: ${filter.excludeGroups.find((k) => currentChannel.group_title.toLowerCase().includes(k.toLowerCase()))})`);
          continue;
        }
      }
      if (filter.excludeUrls && filter.excludeUrls.length > 0) {
        if (currentChannel.play_url && filter.excludeUrls.some(
          (keyword) => currentChannel.play_url.toLowerCase().includes(keyword.toLowerCase())
        )) {
          console.log(`[Filter] Excluding URL: "${currentChannel.play_url}" (matched keyword: ${filter.excludeUrls.find((k) => currentChannel.play_url.toLowerCase().includes(k.toLowerCase()))})`);
          continue;
        }
      }
      if (filter.excludeNames && filter.excludeNames.length > 0) {
        if (currentChannel.channel_name && filter.excludeNames.some(
          (keyword) => currentChannel.channel_name.toLowerCase().includes(keyword.toLowerCase())
        )) {
          console.log(`[Filter] Excluding channel: "${currentChannel.channel_name}" (matched keyword: ${filter.excludeNames.find((k) => currentChannel.channel_name.toLowerCase().includes(k.toLowerCase()))})`);
          continue;
        }
      }
      if (filter.excludeDuplicateUrls && currentChannel.play_url) {
        if (processedUrls.has(currentChannel.play_url)) {
          console.log(`[Filter] Excluding duplicate URL: "${currentChannel.play_url}"`);
          continue;
        }
        processedUrls.add(currentChannel.play_url);
      }
      if (currentChannel.group_title && filter.groupRenameRules && filter.groupRenameRules.length > 0) {
        const shouldExclude = filter.groupRenameExclude && filter.groupRenameExclude.length > 0 && filter.groupRenameExclude.some(
          (exclude) => currentChannel.group_title.toLowerCase().includes(exclude.toLowerCase())
        );
        if (!shouldExclude) {
          for (const rule of filter.groupRenameRules) {
            if (currentChannel.group_title.toLowerCase().includes(rule.keyword.toLowerCase())) {
              const originalGroup = currentChannel.group_title;
              currentChannel.group_title = rule.newName;
              console.log(`[Group Rename] "${originalGroup}" -> "${rule.newName}" (matched keyword: "${rule.keyword}")`);
              break;
            }
          }
        }
      }
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(urlLine);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    currentChannel.channel_hash = hashHex.substring(0, 8);
    currentChannel.channel_name = currentChannel.channel_name || "Unknown";
    currentChannel.group_title = currentChannel.group_title || "";
    currentChannel.logo = currentChannel.logo || "";
    currentChannel.headers = Object.keys(currentChannel.headers).length > 0 ? JSON.stringify(currentChannel.headers) : JSON.stringify({});
    if (currentChannel.channel_name && currentChannel.channel_name.length > 500) {
      currentChannel.channel_name = currentChannel.channel_name.substring(0, 500);
    }
    if (currentChannel.play_url && currentChannel.play_url.length > 2e3) {
      console.warn(`[Sync] URL too long, truncating: ${currentChannel.play_url.substring(0, 50)}...`);
      continue;
    }
    if (currentChannel.logo && currentChannel.logo.length > 500) {
      currentChannel.logo = currentChannel.logo.substring(0, 500);
    }
    channels.push(currentChannel);
  }
  console.log(`[Sync] Starting batch insert for ${channels.length} channels`);
  if (channels.length > 0) {
    channels.sort((a, b) => {
      const groupA = a.group_title || "";
      const groupB = b.group_title || "";
      if (groupA !== groupB) {
        return groupA.localeCompare(groupB, "zh-CN", { numeric: true });
      }
      return customChannelSort(a, b);
    });
    console.log(`[Sync] Channels sorted`);
  }
  if (channels.length > 0) {
    const BATCH_SIZE = 500;
    let processedCount = 0;
    for (let i = 0; i < channels.length; i += BATCH_SIZE) {
      const batch = channels.slice(i, i + BATCH_SIZE);
      const statements = batch.map(
        (channel) => db.prepare(`
          INSERT INTO channels (source_id, channel_name, group_title, logo, play_url, headers, channel_hash, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          channel.source_id,
          channel.channel_name,
          channel.group_title || "",
          channel.logo || "",
          channel.play_url,
          channel.headers,
          channel.channel_hash,
          1
          // is_active 使用数字1
        )
      );
      try {
        await db.batch(statements);
        processedCount += batch.length;
        console.log(`[Sync] Batch processed: ${processedCount}/${channels.length}`);
      } catch (batchError) {
        console.error(`[Sync] Batch insert error at batch ${i}:`, batchError);
        if (batch.length > 0) {
          console.error("[Sync] First channel data:", batch[0]);
        }
        throw batchError;
      }
    }
  }
  console.log(`[Sync] Parse completed, returning ${channels.length} channels`);
  return channels.length;
}
async function fetchAndParseM3U(sourceUrl, sourceId, filter = null) {
  try {
    console.log(`[Sync] Fetching M3U from: ${sourceUrl} for source ID: ${sourceId}`);
    if (filter) {
      console.log(`[Sync] Filters:`, filter);
    }
    const fetchStartTime = Date.now();
    const response = await fetch(sourceUrl);
    const fetchEndTime = Date.now();
    console.log(`[Sync] Fetch completed in ${fetchEndTime - fetchStartTime}ms`);
    if (!response.ok) {
      throw new Error(`Failed to fetch M3U: ${response.status} ${response.statusText}`);
    }
    const content = await response.text();
    console.log(`[Sync] M3U content size: ${content.length} bytes`);
    if (!content || !content.startsWith("#EXTM3U")) {
      console.error(`[Sync] Invalid M3U content: starts with ${content ? content.substring(0, 50) : "empty"}...`);
      throw new Error("Invalid M3U content");
    }
    const parseStartTime = Date.now();
    const channelCount = await parseM3UContent(content, sourceId, filter);
    const parseEndTime = Date.now();
    console.log(`[Sync] Parse completed in ${parseEndTime - parseStartTime}ms`);
    const db = getDB();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await db.prepare(`
      UPDATE sources SET last_updated = ? WHERE id = ?
    `).bind(now, sourceId).run();
    console.log(`[Sync] Successfully parsed ${channelCount} channels`);
    return { success: true, channelCount };
  } catch (error) {
    console.error(`[Sync] Error fetching and parsing M3U: ${error.message}`);
    console.error(`[Sync] Stack:`, error.stack);
    return { success: false, error: error.message };
  }
}
async function encryptWithAES(text, secret) {
  try {
    const keyData = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const textData = new TextEncoder().encode(text);
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      textData
    );
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error("AES \u52A0\u5BC6\u5931\u8D25:", error);
    throw error;
  }
}
async function decryptWithAES(encryptedBase64, secret) {
  try {
    const keyData = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
    const binaryString = atob(encryptedBase64);
    const combined = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      combined[i] = binaryString.charCodeAt(i);
    }
    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedData
    );
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error("AES \u89E3\u5BC6\u5931\u8D25:", error);
    throw error;
  }
}
var DB;
var init_database = __esm({
  "database.js"() {
    init_checked_fetch();
    init_modules_watch_stub();
    DB = null;
    __name(initDB, "initDB");
    __name(getDB, "getDB");
    __name(createTables, "createTables");
    __name(getSecurityConfig, "getSecurityConfig");
    __name(getIPBlacklistConfig, "getIPBlacklistConfig");
    __name(updateIPBlacklistConfig, "updateIPBlacklistConfig");
    __name(getHomepageDisplayConfig, "getHomepageDisplayConfig");
    __name(updateHomepageDisplayConfig, "updateHomepageDisplayConfig");
    __name(getSystemConfig, "getSystemConfig");
    __name(getSyncFilterConfig, "getSyncFilterConfig");
    __name(updateSyncFilterConfig, "updateSyncFilterConfig");
    __name(updateSystemConfig, "updateSystemConfig");
    __name(generateEncryptionKey, "generateEncryptionKey");
    __name(generatePlayToken, "generatePlayToken");
    __name(verifyPlayToken, "verifyPlayToken");
    __name(verifyReferer, "verifyReferer");
    __name(updateSecurityConfig, "updateSecurityConfig");
    __name(normalizeChannelName, "normalizeChannelName");
    __name(customChannelSort, "customChannelSort");
    __name(parseM3UContent, "parseM3UContent");
    __name(fetchAndParseM3U, "fetchAndParseM3U");
    __name(encryptWithAES, "encryptWithAES");
    __name(decryptWithAES, "decryptWithAES");
  }
});

// .wrangler/tmp/bundle-i9MzN3/middleware-loader.entry.ts
init_checked_fetch();
init_modules_watch_stub();

// .wrangler/tmp/bundle-i9MzN3/middleware-insertion-facade.js
init_checked_fetch();
init_modules_watch_stub();

// worker.js
init_checked_fetch();
init_modules_watch_stub();
init_database();

// handlers/live.js
init_checked_fetch();
init_modules_watch_stub();
init_database();

// security/ip-blacklist.js
init_checked_fetch();
init_modules_watch_stub();
init_database();

// utils/cache.js
init_checked_fetch();
init_modules_watch_stub();
var playCountCache2 = /* @__PURE__ */ new Map();
var ipAccessCache = /* @__PURE__ */ new Map();
var lastCacheFlush = Date.now();
var CACHE_FLUSH_INTERVAL = 10 * 60 * 1e3;
async function initCache(env) {
  if (!env?.KV) return;
  try {
    const cacheData = await env.KV.get("memory_cache_backup", { type: "json" });
    if (cacheData) {
      if (cacheData.playCountCache) {
        Object.entries(cacheData.playCountCache).forEach(([key, value]) => {
          playCountCache2.set(key, value);
        });
      }
      if (cacheData.ipAccessCache) {
        Object.entries(cacheData.ipAccessCache).forEach(([key, value]) => {
          ipAccessCache.set(key, value);
        });
      }
      if (cacheData.lastCacheFlush) {
        lastCacheFlush = cacheData.lastCacheFlush;
      }
      console.log("Cache restored from KV:", {
        playCounts: playCountCache2.size,
        ipAccess: ipAccessCache.size
      });
    }
  } catch (error) {
    console.error("Failed to restore cache from KV:", error);
  }
}
__name(initCache, "initCache");
async function backupCache(env) {
  if (!env?.KV) return;
  try {
    const cacheData = {
      playCountCache: Object.fromEntries(playCountCache2),
      ipAccessCache: Object.fromEntries(ipAccessCache),
      lastCacheFlush: Date.now()
    };
    await env.KV.put("memory_cache_backup", JSON.stringify(cacheData), {
      expirationTtl: CACHE_FLUSH_INTERVAL / 1e3 + 60
    });
    console.log("Cache backed up to KV:", {
      playCounts: playCountCache2.size,
      ipAccess: ipAccessCache.size
    });
  } catch (error) {
    console.error("Failed to backup cache to KV:", error);
  }
}
__name(backupCache, "backupCache");
function incrementPlayCount(code, channelHash, date) {
  const key = `${code}:${channelHash}:${date}`;
  const current = playCountCache2.get(key) || 0;
  playCountCache2.set(key, current + 1);
  return current + 1;
}
__name(incrementPlayCount, "incrementPlayCount");
function getPlayCount(code, channelHash, date) {
  const key = `${code}:${channelHash}:${date}`;
  return playCountCache2.get(key) || 0;
}
__name(getPlayCount, "getPlayCount");
function incrementIPAccess(ip, path, date) {
  const key = `${ip}:${path}:${date}`;
  const current = ipAccessCache.get(key) || 0;
  ipAccessCache.set(key, current + 1);
  return current + 1;
}
__name(incrementIPAccess, "incrementIPAccess");
function getIPAccessCount(ip, path, date) {
  const key = `${ip}:${path}:${date}`;
  return ipAccessCache.get(key) || 0;
}
__name(getIPAccessCount, "getIPAccessCount");
function getIPTotalAccess(ip, date) {
  let total = 0;
  const prefix = `${ip}:`;
  for (const [key, count] of ipAccessCache.entries()) {
    if (key.startsWith(prefix) && key.endsWith(`:${date}`)) {
      total += count;
    }
  }
  return total;
}
__name(getIPTotalAccess, "getIPTotalAccess");
async function flushCacheToDB(env, ctx) {
  const now = Date.now();
  if (now - lastCacheFlush < CACHE_FLUSH_INTERVAL) {
    return false;
  }
  console.log("Flushing cache to database...");
  try {
    const { getDB: getDB2 } = await Promise.resolve().then(() => (init_database(), database_exports));
    const db = getDB2();
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const playBatch = [];
    for (const [key, count] of playCountCache2.entries()) {
      const [code, channelHash, date] = key.split(":");
      if (date === today) {
        playBatch.push({ code, channelHash, count });
      }
    }
    if (playBatch.length > 0) {
      for (const { code, channelHash, count } of playBatch) {
        await db.prepare(`
          INSERT OR REPLACE INTO play_counts (code, channel_hash, play_count, created_date, updated_at)
          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        `).bind(code, channelHash, count, today).run();
      }
      console.log(`Flushed ${playBatch.length} play count records to play_counts table`);
    }
    const ipBatch = [];
    for (const [key, count] of ipAccessCache.entries()) {
      const [ip, path, date] = key.split(":");
      if (date === today) {
        ipBatch.push({ ip, path, count });
      }
    }
    if (ipBatch.length > 0) {
      for (const { ip, path, count } of ipBatch) {
        const existing = await db.prepare(`
          SELECT request_count FROM ip_access_logs
          WHERE ip = ? AND path = ? AND created_date = ?
        `).bind(ip, path, today).first();
        if (existing) {
          if (existing.request_count !== count) {
            await db.prepare(`
              UPDATE ip_access_logs
              SET request_count = ?, last_access = CURRENT_TIMESTAMP
              WHERE ip = ? AND path = ? AND created_date = ?
            `).bind(count, ip, path, today).run();
          }
        } else {
          await db.prepare(`
            INSERT INTO ip_access_logs (ip, path, request_count, created_date)
            VALUES (?, ?, ?, ?)
          `).bind(ip, path, count, today).run();
        }
      }
      console.log(`Flushed ${ipBatch.length} IP access records`);
    }
    playCountCache2.clear();
    ipAccessCache.clear();
    lastCacheFlush = now;
    await backupCache(env);
    console.log("Cache flushed successfully");
    return true;
  } catch (error) {
    console.error("Failed to flush cache:", error);
    return false;
  }
}
__name(flushCacheToDB, "flushCacheToDB");

// security/ip-blacklist.js
function getClientIP(request) {
  const forwarded = request.headers.get("CF-Connecting-IP");
  if (forwarded) {
    return forwarded;
  }
  const xForwardedFor = request.headers.get("X-Forwarded-For");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  const xRealIP = request.headers.get("X-Real-IP");
  if (xRealIP) {
    return xRealIP;
  }
  return null;
}
__name(getClientIP, "getClientIP");
async function checkIPRateLimit(env, ctx, ip, path) {
  if (!ip) return { allowed: true, blocked: false, message: "" };
  const blacklisted = await isIPBlacklisted(env, ip);
  if (blacklisted) {
    return {
      allowed: false,
      blocked: true,
      message: "Your IP has been permanently banned due to suspicious activity."
    };
  }
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  await flushCacheToDB(env, ctx);
  let pathRequests = getIPAccessCount(ip, path, today);
  let todayRequests = getIPTotalAccess(ip, today);
  if (pathRequests === 0 || todayRequests === 0) {
    const { getDB: getDB2 } = await Promise.resolve().then(() => (init_database(), database_exports));
    const db = getDB2();
    const dbPathRequests = await db.prepare(`
      SELECT SUM(request_count) as total
      FROM ip_access_logs
      WHERE ip = ? AND path = ? AND created_date = ?
    `).bind(ip, path, today).first();
    const dbTotalRequests = await db.prepare(`
      SELECT SUM(request_count) as total
      FROM ip_access_logs
      WHERE ip = ? AND created_date = ?
    `).bind(ip, today).first();
    if (dbPathRequests?.total) {
      ipAccessCache.set(`${ip}:${path}:${today}`, dbPathRequests.total);
      pathRequests = dbPathRequests.total;
    }
    if (dbTotalRequests?.total) {
      todayRequests = dbTotalRequests.total;
    }
  }
  pathRequests = incrementIPAccess(ip, path, today);
  todayRequests = getIPTotalAccess(ip, today);
  const config = await getIPBlacklistConfig();
  const THRESHOLDS = {
    // 订阅地址
    "/sub": {
      maxPerMin: config.sub_rate_min,
      maxPerHour: config.sub_rate_hour,
      maxPerDay: config.sub_rate_day
    },
    // 播放地址
    "/live": {
      maxPerMin: config.live_rate_min,
      maxPerHour: config.live_rate_hour,
      maxPerDay: config.live_rate_day
    },
    // 管理地址
    "/admin": {
      maxPerMin: 10,
      maxPerHour: config.admin_rate_hour,
      maxPerDay: 50
    }
  };
  let threshold = null;
  for (const [key, value] of Object.entries(THRESHOLDS)) {
    if (path.startsWith(key)) {
      threshold = value;
      break;
    }
  }
  if (!threshold) {
    threshold = { maxPerHour: 60, maxPerDay: 500 };
  }
  if (todayRequests > threshold.maxPerDay) {
    await banIP(env, ip, "Daily request limit exceeded", {
      totalRequests: todayRequests,
      threshold: threshold.maxPerDay
    });
    return {
      allowed: false,
      blocked: true,
      message: "Your IP has been permanently banned due to excessive requests."
    };
  }
  if (pathRequests > threshold.maxPerHour) {
    await banIP(env, ip, `Excessive requests to path: ${path}`, {
      path,
      count: pathRequests,
      threshold: threshold.maxPerHour
    });
    return {
      allowed: false,
      blocked: true,
      message: "Your IP has been permanently banned due to excessive requests to a specific endpoint."
    };
  }
  return { allowed: true, blocked: false, message: "" };
}
__name(checkIPRateLimit, "checkIPRateLimit");
async function getBlacklistedIPs(env, limit = 100, offset = 0) {
  const { getDB: getDB2 } = await Promise.resolve().then(() => (init_database(), database_exports));
  const db = getDB2();
  const result = await db.prepare(`
    SELECT ip, banned_at, reason, details
    FROM ip_blacklist
    ORDER BY banned_at DESC
    LIMIT ? OFFSET ?
  `).bind(limit, offset).all();
  const totalResult = await db.prepare("SELECT COUNT(*) as total FROM ip_blacklist").first();
  const total = totalResult?.total || 0;
  const data = (result.results || []).map((item) => ({
    ip: item.ip,
    bannedAt: item.banned_at,
    reason: item.reason,
    details: JSON.parse(item.details || "{}")
  }));
  return { data, total };
}
__name(getBlacklistedIPs, "getBlacklistedIPs");
async function banIP(env, ip, reason, details = {}) {
  const { getDB: getDB2 } = await Promise.resolve().then(() => (init_database(), database_exports));
  const db = getDB2();
  await db.prepare(`
    INSERT OR REPLACE INTO ip_blacklist (ip, banned_at, reason, details, permanent)
    VALUES (?, CURRENT_TIMESTAMP, ?, ?, 1)
  `).bind(ip, reason, JSON.stringify(details)).run();
  console.log(`IP ${ip} has been permanently banned. Reason: ${reason}`);
}
__name(banIP, "banIP");
async function unbanIP(env, ip) {
  const { getDB: getDB2 } = await Promise.resolve().then(() => (init_database(), database_exports));
  const db = getDB2();
  await db.prepare("DELETE FROM ip_blacklist WHERE ip = ?").bind(ip).run();
  console.log(`IP ${ip} has been unbanned`);
  return true;
}
__name(unbanIP, "unbanIP");
async function getIPAccessStats(env, ip) {
  const { getDB: getDB2 } = await Promise.resolve().then(() => (init_database(), database_exports));
  const db = getDB2();
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const result = await db.prepare(`
    SELECT
      SUM(request_count) as total_requests,
      MIN(first_access) as first_access,
      GROUP_CONCAT(path || ':' || request_count, ',') as paths
    FROM ip_access_logs
    WHERE ip = ? AND created_date = ?
  `).bind(ip, today).first();
  const paths = {};
  if (result?.paths) {
    result.paths.split(",").forEach((p) => {
      const [path, count] = p.split(":");
      if (path && count) {
        paths[path] = parseInt(count);
      }
    });
  }
  return {
    requests: result?.total_requests || 0,
    paths,
    firstAccess: result?.first_access || null
  };
}
__name(getIPAccessStats, "getIPAccessStats");
async function isIPBlacklisted(env, ip) {
  if (!ip) return false;
  const { getDB: getDB2 } = await Promise.resolve().then(() => (init_database(), database_exports));
  const db = getDB2();
  const result = await db.prepare("SELECT ip FROM ip_blacklist WHERE ip = ?").bind(ip).first();
  return !!result;
}
__name(isIPBlacklisted, "isIPBlacklisted");

// security/code-ban-cache.js
init_checked_fetch();
init_modules_watch_stub();
async function addBannedCodeToCache(env, codeInfo) {
  console.log(`Code ${codeInfo.code} ban status updated in database`);
}
__name(addBannedCodeToCache, "addBannedCodeToCache");
async function removeBannedCodeFromCache(env, code) {
  console.log(`Code ${code} unban status updated in database`);
}
__name(removeBannedCodeFromCache, "removeBannedCodeFromCache");
async function getBannedCodesFromCache(env, limit = 100, offset = 0) {
  const { getDB: getDB2 } = await Promise.resolve().then(() => (init_database(), database_exports));
  const db = getDB2();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const result = await db.prepare(`
    SELECT code, status, duration_days, activated_at, expired_at, max_ips, remark, banned_until
    FROM codes
    WHERE banned_until IS NOT NULL AND banned_until > ?
    ORDER BY banned_until DESC
    LIMIT ? OFFSET ?
  `).bind(now, limit, offset).all();
  const totalResult = await db.prepare(`
    SELECT COUNT(*) as total
    FROM codes
    WHERE banned_until IS NOT NULL AND banned_until > ?
  `).bind(now).first();
  const total = totalResult?.total || 0;
  return { data: result.results || [], total };
}
__name(getBannedCodesFromCache, "getBannedCodesFromCache");
async function syncBannedCodesToCache(env, db) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const bannedCodes = await db.prepare(`
    SELECT COUNT(*) as count
    FROM codes
    WHERE banned_until IS NOT NULL AND banned_until > ?
  `).bind(now).first();
  const count = bannedCodes?.count || 0;
  console.log(`Found ${count} banned codes in database (no sync needed)`);
  return count;
}
__name(syncBannedCodesToCache, "syncBannedCodesToCache");

// utils/channel-cache.js
init_checked_fetch();
init_modules_watch_stub();
init_database();
var CHANNELS_CACHE_KEY = "channels_cache";
var GROUPS_CACHE_KEY = "groups_cache";
var CACHE_VERSION_KEY = "channels_cache_version";
async function cacheChannelsToKV(env) {
  try {
    const db = getDB();
    const channels = await db.prepare(`
      SELECT
        c.id,
        c.channel_name,
        c.group_title,
        c.logo,
        c.play_url,
        c.headers,
        c.channel_hash,
        c.is_active,
        c.source_id,
        s.name as source_name,
        s.is_active as source_active
      FROM channels c
      LEFT JOIN sources s ON c.source_id = s.id
    `).all();
    const groupsResult = await db.prepare(`
      SELECT DISTINCT group_title
      FROM channels
      WHERE group_title IS NOT NULL AND group_title != ''
      ORDER BY group_title
    `).all();
    const groups = (groupsResult.results || []).map((r) => r.group_title);
    const version = Date.now();
    const cacheData = {
      version,
      channels: channels.results || [],
      groups,
      cached_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    await env.KV.put(CHANNELS_CACHE_KEY, JSON.stringify(cacheData), {
      expirationTtl: 24 * 60 * 60
      // 24 小时
    });
    await env.KV.put(GROUPS_CACHE_KEY, JSON.stringify({
      version,
      groups,
      cached_at: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      expirationTtl: 24 * 60 * 60
    });
    await env.KV.put(CACHE_VERSION_KEY, version.toString(), {
      expirationTtl: 24 * 60 * 60
    });
    console.log(`[ChannelCache] Cached ${channels.results?.length || 0} channels and ${groups.length} groups to KV`);
    return {
      success: true,
      channels: channels.results?.length || 0,
      groups: groups.length,
      version
    };
  } catch (error) {
    console.error("[ChannelCache] Failed to cache channels:", error);
    return {
      success: false,
      error: error.message
    };
  }
}
__name(cacheChannelsToKV, "cacheChannelsToKV");
async function getChannelByHash(env, channelHash) {
  try {
    const cacheData = await env.KV.get(CHANNELS_CACHE_KEY, { type: "json" });
    if (cacheData && cacheData.channels) {
      const channel2 = cacheData.channels.find((c) => c.channel_hash === channelHash);
      if (channel2) {
        console.log(`[ChannelCache] Got channel ${channelHash} from KV cache`);
        return channel2;
      }
    }
    const db = getDB();
    const channel = await db.prepare(`
      SELECT
        c.id,
        c.channel_name,
        c.group_title,
        c.logo,
        c.play_url,
        c.headers,
        c.channel_hash,
        c.is_active,
        c.source_id,
        s.name as source_name,
        s.is_active as source_active
      FROM channels c
      LEFT JOIN sources s ON c.source_id = s.id
      WHERE c.channel_hash = ?
    `).bind(channelHash).first();
    return channel;
  } catch (error) {
    console.error("[ChannelCache] Failed to get channel:", error);
    return null;
  }
}
__name(getChannelByHash, "getChannelByHash");
async function getAllChannels(env) {
  try {
    const cacheData = await env.KV.get(CHANNELS_CACHE_KEY, { type: "json" });
    if (cacheData && cacheData.channels) {
      return {
        channels: cacheData.channels,
        fromCache: true
      };
    }
    const db = getDB();
    const result = await db.prepare(`
      SELECT
        c.id,
        c.channel_name,
        c.group_title,
        c.logo,
        c.play_url,
        c.headers,
        c.channel_hash,
        c.is_active,
        c.source_id,
        s.name as source_name,
        s.is_active as source_active
      FROM channels c
      LEFT JOIN sources s ON c.source_id = s.id
    `).all();
    return {
      channels: result.results || [],
      fromCache: false
    };
  } catch (error) {
    console.error("[ChannelCache] Failed to get all channels:", error);
    return {
      channels: [],
      fromCache: false
    };
  }
}
__name(getAllChannels, "getAllChannels");
async function getAllGroups(env) {
  try {
    const cacheData = await env.KV.get(GROUPS_CACHE_KEY, { type: "json" });
    if (cacheData && cacheData.groups) {
      return {
        groups: cacheData.groups,
        fromCache: true
      };
    }
    const db = getDB();
    const result = await db.prepare(`
      SELECT DISTINCT group_title
      FROM channels
      WHERE group_title IS NOT NULL AND group_title != ''
      ORDER BY group_title
    `).all();
    return {
      groups: (result.results || []).map((r) => r.group_title),
      fromCache: false
    };
  } catch (error) {
    console.error("[ChannelCache] Failed to get groups:", error);
    return {
      groups: [],
      fromCache: false
    };
  }
}
__name(getAllGroups, "getAllGroups");
async function clearChannelCache(env) {
  try {
    await env.KV.delete(CHANNELS_CACHE_KEY);
    await env.KV.delete(GROUPS_CACHE_KEY);
    await env.KV.delete(CACHE_VERSION_KEY);
    console.log("[ChannelCache] Cache cleared");
    return true;
  } catch (error) {
    console.error("[ChannelCache] Failed to clear cache:", error);
    return false;
  }
}
__name(clearChannelCache, "clearChannelCache");
async function getCacheStatus(env) {
  try {
    const version = await env.KV.get(CACHE_VERSION_KEY);
    const channelsCache = await env.KV.get(CHANNELS_CACHE_KEY, { type: "json" });
    const groupsCache = await env.KV.get(GROUPS_CACHE_KEY, { type: "json" });
    return {
      version: version || null,
      channelsCached: !!channelsCache,
      groupsCached: !!groupsCache,
      channelsCount: channelsCache?.channels?.length || 0,
      groupsCount: groupsCache?.groups?.length || 0,
      cachedAt: channelsCache?.cached_at || null
    };
  } catch (error) {
    console.error("[ChannelCache] Failed to get cache status:", error);
    return {
      version: null,
      channelsCached: false,
      groupsCached: false
    };
  }
}
__name(getCacheStatus, "getCacheStatus");

// handlers/live.js
async function handleLiveRequest(request, env, ctx) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const clientIP = getClientIP(request);
    const ipCheck = await checkIPRateLimit(env, ctx, clientIP, "/live");
    if (!ipCheck.allowed) {
      return new Response(ipCheck.message, { status: 403 });
    }
    if (pathParts.length < 4) {
      return new Response("Invalid request format", { status: 400 });
    }
    const code = pathParts[2];
    const hash = pathParts[3];
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);
    let response = await cache.match(cacheKey);
    if (response) {
      if (response.status === 403) {
        response = null;
      } else {
        return response;
      }
    }
    const db = getDB();
    const auth = await db.prepare("SELECT status, expired_at, max_ips, banned_until FROM codes WHERE code = ?").bind(code).first();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (!auth || auth.status !== "active" || auth.expired_at < now) {
      if (auth && auth.expired_at < now && auth.status === "active") {
        await db.prepare("UPDATE codes SET status = 'disabled' WHERE code = ?").bind(code).run();
      }
      response = new Response("Forbidden: Invalid or Expired Code", { status: 403 });
      response.headers.set("Cache-Control", "public, max-age=300");
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }
    if (auth.banned_until && auth.banned_until > now) {
      response = new Response(`Forbidden: Code is banned until ${new Date(auth.banned_until).toLocaleString("zh-CN")}`, { status: 403 });
      response.headers.set("Cache-Control", "public, max-age=60");
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }
    const securityConfig = await getSecurityConfig();
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    await flushCacheToDB(env, ctx);
    let todayPlays = getPlayCount(code, hash, today);
    if (todayPlays === 0) {
      const dbCount = await db.prepare(`
        SELECT play_count
        FROM play_counts
        WHERE code = ? AND channel_hash = ? AND created_date = ?
      `).bind(code, hash, today).first();
      if (dbCount) {
        playCountCache.set(`${code}:${hash}:${today}`, dbCount.play_count);
        todayPlays = dbCount.play_count;
      }
    }
    if (todayPlays >= securityConfig.channel_daily_limit) {
      if (securityConfig.auto_ban_on_exceed) {
        const existingRemark = await db.prepare("SELECT remark FROM codes WHERE code = ?").bind(code).first();
        const bannedUntil = /* @__PURE__ */ new Date();
        bannedUntil.setTime(bannedUntil.getTime() + securityConfig.ban_duration_days * 24 * 60 * 60 * 1e3);
        const banReason = `\u7CFB\u7EDF\u81EA\u52A8\u5C01\u7981\uFF1A\u9891\u9053\u6BCF\u65E5\u64AD\u653E\u6B21\u6570\u8D85\u51FA${securityConfig.channel_daily_limit}\u6B21\uFF0C\u5C01\u7981${securityConfig.ban_duration_days}\u5929 (${today})`;
        const newRemark = existingRemark?.remark ? `${existingRemark.remark}
${banReason}` : banReason;
        await db.prepare("UPDATE codes SET status = 'disabled', remark = ?, banned_until = ? WHERE code = ?").bind(newRemark, bannedUntil.toISOString(), code).run();
        const codeInfo = await db.prepare("SELECT code, status, duration_days, activated_at, expired_at, max_ips, remark, banned_until FROM codes WHERE code = ?").bind(code).first();
        if (codeInfo) {
          await addBannedCodeToCache(env, codeInfo);
        }
        console.warn(`Code ${code} auto-banned due to exceeding limit: ${todayPlays} plays for channel ${hash}`);
        console.warn(`Code ${code} auto-banned due to exceeding limit: ${todayPlays} plays for channel ${hash}`);
      }
      response = new Response(`Forbidden: Daily play limit (${securityConfig.channel_daily_limit}) exceeded for this channel`, { status: 403 });
      response.headers.set("Cache-Control", "public, max-age=300");
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }
    incrementPlayCount(code, hash, today);
    const tenMinutesAgo = new Date(Date.now() - 6e5).toISOString();
    const activeIPsResult = await db.prepare(`
      SELECT DISTINCT client_ip
      FROM play_logs
      WHERE code = ? AND played_at > ?
    `).bind(code, tenMinutesAgo).all();
    const activeIPs = new Set((activeIPsResult.results || []).map((r) => r.client_ip));
    if (!activeIPs.has(clientIP)) {
      if (activeIPs.size >= (auth.max_ips || 3)) {
        response = new Response("Forbidden: Too many devices", { status: 403 });
        response.headers.set("Cache-Control", "public, max-age=300");
        ctx.waitUntil(cache.put(cacheKey, response.clone()));
        return response;
      }
      ctx.waitUntil(db.prepare(`
        INSERT INTO play_logs (code, channel_hash, client_ip, created_date)
        VALUES (?, ?, ?, ?)
      `).bind(code, hash, clientIP, today).run());
    }
    const channel = await getChannelByHash(env, hash);
    if (!channel || !channel.is_active) {
      response = new Response("Channel Not Found", { status: 404 });
      response.headers.set("Cache-Control", "public, max-age=300");
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }
    const headers = new Headers({
      "Location": channel.play_url,
      "Cache-Control": "public, max-age=300, s-maxage=300"
    });
    response = new Response(null, { status: 302, headers });
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (error) {
    console.error("Live request error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
__name(handleLiveRequest, "handleLiveRequest");

// handlers/sub.js
init_checked_fetch();
init_modules_watch_stub();
init_database();
async function handleSubRequest(request, env, ctx) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/");
  const clientIP = getClientIP(request);
  const ipCheck = await checkIPRateLimit(env, ctx, clientIP, "/sub");
  if (!ipCheck.allowed) {
    const response2 = new Response(ipCheck.message, { status: 403 });
    response2.headers.set("X-IP-Blacklisted", "true");
    return response2;
  }
  const filename = pathParts[pathParts.length - 1];
  const code = filename.replace(".m3u", "");
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const requestCount = getIPAccessCount(clientIP, "/sub", today);
  if (requestCount > 20) {
    return new Response("Forbidden: Daily request limit exceeded", { status: 403 });
  }
  const cache = caches.default;
  const cacheKey = new Request(url.toString(), request);
  let response = await cache.match(cacheKey);
  if (response) {
    return response;
  }
  const db = getDB();
  const auth = await db.prepare("SELECT status, expired_at FROM codes WHERE code = ?").bind(code).first();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  if (!auth || auth.status !== "active" || auth.expired_at < now) {
    if (auth && auth.expired_at < now && auth.status === "active") {
      await db.prepare("UPDATE codes SET status = 'disabled' WHERE code = ?").bind(code).run();
    }
    response = new Response("Forbidden: Invalid or Expired Code", { status: 403 });
    response.headers.set("Cache-Control", "public, max-age=600");
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  }
  const cacheResult = await getAllChannels(env);
  let allChannels = cacheResult.channels;
  if (!cacheResult.fromCache) {
    allChannels = allChannels.filter((c) => c.is_active && c.source_active);
  }
  if (!allChannels || allChannels.length === 0) {
    response = new Response("#EXTM3U\n# No channels available", {
      headers: { "Content-Type": "application/vnd.apple.mpegurl" }
    });
    response.headers.set("Cache-Control", "public, max-age=600");
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  }
  const sortedChannels = sortChannels(allChannels);
  const host = url.origin;
  const m3uLines = ["#EXTM3U"];
  for (const channel of sortedChannels) {
    const infoParts = ["#EXTINF:-1"];
    if (channel.group_title) infoParts.push(`group-title="${channel.group_title}"`);
    if (channel.logo) infoParts.push(`tvg-logo="${channel.logo}"`);
    if (channel.headers && channel.headers !== "{}") {
      try {
        const headers = JSON.parse(channel.headers);
        if (headers["User-Agent"]) {
          const ua = headers["User-Agent"].replace(/"/g, '\\"');
          infoParts.push(`http-user-agent="${ua}"`);
        }
        if (headers["Referer"]) {
          const referer = headers["Referer"].replace(/"/g, '\\"');
          infoParts.push(`http-header="Referer: ${referer}"`);
          infoParts.push(`referer="${referer}"`);
        }
      } catch (e) {
      }
    }
    infoParts.push("," + channel.channel_name);
    m3uLines.push(infoParts.join(" "));
    m3uLines.push(`${host}/live/${code}/${channel.channel_hash}`);
  }
  const m3uContent = m3uLines.join("\n");
  response = new Response(m3uContent, {
    headers: {
      "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=43200"
    }
  });
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}
__name(handleSubRequest, "handleSubRequest");
function sortChannels(channels) {
  if (!channels || channels.length === 0) {
    return [];
  }
  return channels.sort((a, b) => {
    const groupA = a.group_title || "";
    const groupB = b.group_title || "";
    if (groupA !== groupB) {
      return groupA.localeCompare(groupB, "zh-CN", { numeric: true });
    }
    const nameA = a.channel_name || "";
    const nameB = b.channel_name || "";
    const cctvMatchA = nameA.match(/^([A-Za-z]+)(\d+)/);
    const cctvMatchB = nameB.match(/^([A-Za-z]+)(\d+)/);
    if (cctvMatchA && cctvMatchB && cctvMatchA[1].toUpperCase() === cctvMatchB[1].toUpperCase()) {
      const numA = parseInt(cctvMatchA[2]);
      const numB = parseInt(cctvMatchB[2]);
      if (numA !== numB) {
        return numA - numB;
      }
      const suffixA = nameA.substring(cctvMatchA[1].length + cctvMatchA[2].length);
      const suffixB = nameB.substring(cctvMatchB[1].length + cctvMatchB[2].length);
      const hasSuffixA = suffixA.trim().length > 0;
      const hasSuffixB = suffixB.trim().length > 0;
      if (hasSuffixA !== hasSuffixB) {
        return hasSuffixA ? 1 : -1;
      }
      return suffixA.localeCompare(suffixB, "zh-CN", { numeric: true });
    }
    for (let i = 0; i < Math.min(nameA.length, nameB.length); i++) {
      const charA = nameA.charCodeAt(i);
      const charB = nameB.charCodeAt(i);
      const isAlphaA = charA >= 65 && charA <= 90 || charA >= 97 && charA <= 122;
      const isAlphaB = charB >= 65 && charB <= 90 || charB >= 97 && charB <= 122;
      const isDigitA = charA >= 48 && charA <= 57;
      const isDigitB = charB >= 48 && charB <= 57;
      const isChineseA = charA >= 19968 && charA <= 40869;
      const isChineseB = charB >= 19968 && charB <= 40869;
      const typeA = isAlphaA ? 1 : isDigitA ? 2 : isChineseA ? 3 : 4;
      const typeB = isAlphaB ? 1 : isDigitB ? 2 : isChineseB ? 3 : 4;
      if (typeA !== typeB) {
        return typeA - typeB;
      }
      if (charA !== charB) {
        return charA - charB;
      }
    }
    return nameA.length - nameB.length;
  });
}
__name(sortChannels, "sortChannels");

// handlers/admin.js
init_checked_fetch();
init_modules_watch_stub();
init_database();

// handlers/scheduler.js
init_checked_fetch();
init_modules_watch_stub();
init_database();
async function handleScheduledEvent(event, env, ctx) {
  try {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    console.log(`[${now}] Scheduled task started: Auto-sync enabled sources`);
    const db = await initDB(env);
    if (!db) {
      console.error("[Scheduler] Failed to initialize database");
      return;
    }
    console.log("[Scheduler] Database initialized successfully");
    let filter = null;
    try {
      filter = await getSyncFilterConfig();
      console.log("[Scheduler] Loaded sync filter config:", filter);
    } catch (error) {
      console.error("[Scheduler] Failed to load sync filter config:", error);
      filter = null;
    }
    const sources = await db.prepare(`
      SELECT id, name, url, type, parse_mode
      FROM sources
      WHERE is_active = 1
      ORDER BY id
    `).all();
    if (!sources.results || sources.results.length === 0) {
      console.log("No enabled sources found");
      return;
    }
    const enabledSources = sources.results;
    console.log(`Found ${enabledSources.length} enabled source(s) to sync`);
    const results = [];
    for (const source of enabledSources) {
      try {
        console.log(`Syncing source ${source.id}: ${source.name}`);
        const oldCountResult = await db.prepare("SELECT COUNT(*) as count FROM channels WHERE source_id = ?").bind(source.id).first();
        const oldChannelCount = oldCountResult?.count || 0;
        await db.prepare("DELETE FROM channels WHERE source_id = ?").bind(source.id).run();
        console.log(`[Sync] Starting fetch and parse for source ${source.id}: ${source.name}`);
        const syncResult = await fetchAndParseM3U(source.url, source.id, filter);
        console.log(`[Sync] Sync result for source ${source.id}:`, syncResult);
        if (syncResult.success) {
          results.push({
            source_id: source.id,
            source_name: source.name,
            success: true,
            deleted_channels: oldChannelCount,
            new_channels: syncResult.channelCount,
            error: null
          });
          console.log(`[Sync] Source ${source.id} synced successfully: deleted ${oldChannelCount}, added ${syncResult.channelCount}`);
        } else {
          results.push({
            source_id: source.id,
            source_name: source.name,
            success: false,
            deleted_channels: oldChannelCount,
            new_channels: 0,
            error: syncResult.error
          });
          console.error(`Source ${source.id} sync failed: ${syncResult.error}`);
        }
      } catch (error) {
        console.error(`Error syncing source ${source.id}:`, error);
        results.push({
          source_id: source.id,
          source_name: source.name,
          success: false,
          deleted_channels: 0,
          new_channels: 0,
          error: error.message
        });
      }
    }
    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;
    const totalDeleted = results.reduce((sum, r) => sum + r.deleted_channels, 0);
    const totalAdded = results.reduce((sum, r) => sum + r.new_channels, 0);
    console.log(`Scheduled task completed: ${successCount}/${enabledSources.length} sources synced, ${failCount} failed`);
    console.log(`Total: ${totalDeleted} channels deleted, ${totalAdded} channels added`);
    const tenMinutesAgo = new Date(Date.now() - 6e5).toISOString();
    const deleteResult = await db.prepare(`
      DELETE FROM play_logs
      WHERE played_at < ?
    `).bind(tenMinutesAgo).run();
    console.log(`Cleaned up ${deleteResult.meta?.changes || 0} expired play_logs records`);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0];
    const deleteCountsResult = await db.prepare(`
      DELETE FROM play_counts
      WHERE created_date < ?
    `).bind(sevenDaysAgo).run();
    console.log(`Cleaned up ${deleteCountsResult.meta?.changes || 0} old play_counts records`);
    const deleteIpResult = await db.prepare(`
      DELETE FROM ip_access_logs
      WHERE created_date < ?
    `).bind(sevenDaysAgo).run();
    console.log(`Cleaned up ${deleteIpResult.meta?.changes || 0} old ip_access_logs records`);
    console.log("Caching channels to KV...");
    const cacheResult = await cacheChannelsToKV(env);
    if (cacheResult.success) {
      console.log(`Channels cached successfully: ${cacheResult.channels} channels, ${cacheResult.groups} groups`);
    } else {
      console.error("Failed to cache channels:", cacheResult.error);
    }
  } catch (error) {
    console.error("Scheduled task error:", error);
  }
}
__name(handleScheduledEvent, "handleScheduledEvent");
async function manualSyncAll(env, filter = null) {
  try {
    const db = await initDB(env);
    if (!db) {
      console.error("[ManualSync] Failed to initialize database");
      return { success: false, error: "Database initialization failed" };
    }
    const sources = await db.prepare(`
      SELECT id, name, url, type, parse_mode
      FROM sources
      WHERE is_active = 1
      ORDER BY id
    `).all();
    if (!sources.results || sources.results.length === 0) {
      return { success: true, message: "\u6CA1\u6709\u542F\u7528\u7684\u6570\u636E\u6E90", results: [] };
    }
    const enabledSources = sources.results;
    const results = [];
    for (const source of enabledSources) {
      try {
        const oldCountResult = await db.prepare("SELECT COUNT(*) as count FROM channels WHERE source_id = ?").bind(source.id).first();
        const oldChannelCount = oldCountResult?.count || 0;
        await db.prepare("DELETE FROM channels WHERE source_id = ?").bind(source.id).run();
        const syncResult = await fetchAndParseM3U(source.url, source.id, filter);
        if (syncResult.success) {
          results.push({
            source_id: source.id,
            source_name: source.name,
            success: true,
            deleted_channels: oldChannelCount,
            new_channels: syncResult.channelCount,
            error: null
          });
        } else {
          results.push({
            source_id: source.id,
            source_name: source.name,
            success: false,
            deleted_channels: oldChannelCount,
            new_channels: 0,
            error: syncResult.error
          });
        }
      } catch (error) {
        results.push({
          source_id: source.id,
          source_name: source.name,
          success: false,
          deleted_channels: 0,
          new_channels: 0,
          error: error.message
        });
      }
    }
    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;
    return {
      success: true,
      message: `\u540C\u6B65\u5B8C\u6210\uFF1A${successCount}\u4E2A\u6210\u529F\uFF0C${failCount}\u4E2A\u5931\u8D25`,
      total_sources: enabledSources.length,
      success_count: successCount,
      fail_count: failCount,
      results
    };
  } catch (error) {
    console.error("Manual sync error:", error);
    return { success: false, error: error.message };
  }
}
__name(manualSyncAll, "manualSyncAll");

// handlers/admin.js
async function handleAdminRequest(request, env, ctx) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/");
  const action = pathParts[2] || "";
  const adminKey = request.headers.get("X-Admin-Key");
  if (adminKey !== env.ADMIN_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    switch (action) {
      case "init":
        await createTables(env);
        return new Response(JSON.stringify({ success: true, message: "Database tables initialized" }), {
          headers: { "Content-Type": "application/json" }
        });
      case "migrate":
        try {
          await createTables(env);
          return new Response(JSON.stringify({ success: true, message: "Database migration completed" }), {
            headers: { "Content-Type": "application/json" }
          });
        } catch (error) {
          return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
        break;
      case "sources":
        if (request.method === "GET") {
          const sources = await getDB().prepare("SELECT * FROM sources ORDER BY id").all();
          return new Response(JSON.stringify(sources), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (request.method === "POST") {
          const data = await request.json();
          const result2 = await getDB().prepare(`
            INSERT INTO sources (name, url, type, parse_mode) 
            VALUES (?, ?, ?, ?)
          `).bind(
            data.name,
            data.url,
            data.type || "m3u",
            data.parse_mode || "strict"
          ).run();
          return new Response(JSON.stringify({ success: true, id: result2.meta.last_row_id }), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (request.method === "PUT") {
          const data = await request.json();
          await getDB().prepare(`
            UPDATE sources SET name = ?, url = ?, type = ?, parse_mode = ? 
            WHERE id = ?
          `).bind(
            data.name,
            data.url,
            data.type,
            data.parse_mode,
            data.id
          ).run();
          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (request.method === "PATCH" && pathParts[3] === "toggle") {
          const sourceId2 = pathParts[4];
          if (!sourceId2) {
            return new Response("Missing source ID", { status: 400 });
          }
          const data = await request.json();
          const isActive = data.is_active !== void 0 ? data.is_active ? 1 : 0 : null;
          if (isActive === null) {
            const source2 = await getDB().prepare("SELECT is_active FROM sources WHERE id = ?").bind(sourceId2).first();
            if (!source2) {
              return new Response("Source not found", { status: 404 });
            }
            const newStatus = source2.is_active ? 0 : 1;
            await getDB().prepare("UPDATE sources SET is_active = ? WHERE id = ?").bind(newStatus, sourceId2).run();
            return new Response(JSON.stringify({
              success: true,
              is_active: newStatus === 1,
              message: newStatus === 1 ? "\u6E90\u5DF2\u542F\u7528" : "\u6E90\u5DF2\u7981\u7528"
            }), {
              headers: { "Content-Type": "application/json" }
            });
          } else {
            await getDB().prepare("UPDATE sources SET is_active = ? WHERE id = ?").bind(isActive, sourceId2).run();
            return new Response(JSON.stringify({
              success: true,
              is_active: isActive === 1,
              message: isActive === 1 ? "\u6E90\u5DF2\u542F\u7528" : "\u6E90\u5DF2\u7981\u7528"
            }), {
              headers: { "Content-Type": "application/json" }
            });
          }
        } else if (request.method === "DELETE") {
          const sourceId2 = pathParts[3];
          if (!sourceId2) {
            return new Response("Missing source ID", { status: 400 });
          }
          const db2 = getDB();
          const countResult = await db2.prepare("SELECT COUNT(*) as count FROM channels WHERE source_id = ?").bind(sourceId2).first();
          const channelCount = countResult?.count || 0;
          const stmts = [
            db2.prepare("DELETE FROM channels WHERE source_id = ?").bind(sourceId2),
            db2.prepare("DELETE FROM sources WHERE id = ?").bind(sourceId2)
          ];
          await db2.batch(stmts);
          return new Response(JSON.stringify({
            success: true,
            message: `\u5DF2\u5220\u9664\u6E90\u53CA\u5176\u5173\u8054\u7684 ${channelCount} \u4E2A\u9891\u9053`
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }
        break;
      case "sync":
        const syncSubAction = pathParts[3];
        if (syncSubAction === "filter" && request.method === "GET") {
          const config = await getSyncFilterConfig();
          return new Response(JSON.stringify({
            success: true,
            config
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }
        if (syncSubAction === "filter" && request.method === "POST") {
          const data = await request.json();
          const validConfig = {
            excludeGroups: Array.isArray(data.excludeGroups) ? data.excludeGroups : [],
            excludeUrls: Array.isArray(data.excludeUrls) ? data.excludeUrls : [],
            excludeNames: Array.isArray(data.excludeNames) ? data.excludeNames : [],
            excludeDuplicateUrls: typeof data.excludeDuplicateUrls === "boolean" ? data.excludeDuplicateUrls : false,
            groupRenameRules: Array.isArray(data.groupRenameRules) ? data.groupRenameRules : [],
            groupRenameExclude: Array.isArray(data.groupRenameExclude) ? data.groupRenameExclude : []
          };
          await updateSyncFilterConfig(validConfig);
          return new Response(JSON.stringify({
            success: true,
            message: "\u540C\u6B65\u8FC7\u6EE4\u89C4\u5219\u5DF2\u66F4\u65B0",
            config: validConfig
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }
        if (syncSubAction === "all" && request.method === "POST") {
          const filter2 = await request.json();
          console.log("[Admin] Sync all with filter:", filter2);
          const result2 = await manualSyncAll(env, filter2);
          return new Response(JSON.stringify(result2), {
            headers: { "Content-Type": "application/json" }
          });
        }
        const sourceId = syncSubAction;
        if (!sourceId) {
          return new Response("Missing source ID", { status: 400 });
        }
        const db = getDB();
        const oldCountResult = await db.prepare("SELECT COUNT(*) as count FROM channels WHERE source_id = ?").bind(sourceId).first();
        const oldChannelCount = oldCountResult?.count || 0;
        await db.prepare("DELETE FROM channels WHERE source_id = ?").bind(sourceId).run();
        const source = await db.prepare("SELECT url FROM sources WHERE id = ?").bind(sourceId).first();
        if (!source) {
          return new Response("Source not found", { status: 404 });
        }
        let filter = null;
        if (request.method === "POST") {
          try {
            filter = await request.json();
            console.log("[Admin] Sync source with filter:", filter);
          } catch (e) {
            console.error("Failed to parse filter:", e);
          }
        }
        const now = (/* @__PURE__ */ new Date()).toISOString();
        await db.prepare(`UPDATE sources SET last_updated = ? WHERE id = ?`).bind(now, sourceId).run();
        const result = await fetchAndParseM3U(source.url, sourceId, filter);
        result.deletedChannels = oldChannelCount;
        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json" }
        });
      case "codes":
        if (request.method === "GET") {
          if (url.searchParams.get("action") === "export") {
            const codes2 = await getCodesForExport(url.searchParams);
            let csv = "\u5361\u5BC6,\u72B6\u6001,\u6709\u6548\u671F(\u5929),\u6700\u5927IP\u6570,\u6FC0\u6D3B\u65F6\u95F4,\u8FC7\u671F\u65F6\u95F4,\u5907\u6CE8\n";
            codes2.forEach((code) => {
              const statusMap = { "unused": "\u672A\u4F7F\u7528", "active": "\u6D3B\u8DC3", "disabled": "\u7981\u7528" };
              const status = statusMap[code.status] || code.status;
              const activatedAt = code.activated_at ? formatDateTime(code.activated_at) : "-";
              const expiredAt = code.expired_at ? formatDateTime(code.expired_at) : "-";
              const remark2 = code.remark || "-";
              const cleanCode = escapeCsvField(code.code);
              const cleanRemark = escapeCsvField(remark2);
              csv += `${cleanCode},${status},${code.duration_days},${code.max_ips || 3},${activatedAt},${expiredAt},${cleanRemark}
`;
            });
            return new Response(csv, {
              headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": 'attachment; filename="codes_export_' + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) + '.csv"'
              }
            });
          }
          const codeQuery = url.searchParams.get("code");
          if (codeQuery) {
            const code = await getDB().prepare("SELECT * FROM codes WHERE code = ?").bind(codeQuery).first();
            if (!code) {
              return new Response(JSON.stringify({ success: false, error: "Code not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
              });
            }
            return new Response(JSON.stringify(code), {
              headers: { "Content-Type": "application/json" }
            });
          }
          const page2 = parseInt(url.searchParams.get("page")) || 1;
          const pageSize2 = Math.min(parseInt(url.searchParams.get("page_size")) || 100, 100);
          const statusFilter = url.searchParams.get("status") || "";
          const expiredFrom = url.searchParams.get("expired_from") || "";
          const expiredTo = url.searchParams.get("expired_to") || "";
          const activatedFrom = url.searchParams.get("activated_from") || "";
          const activatedTo = url.searchParams.get("activated_to") || "";
          const durationMin = url.searchParams.get("duration_min") || "";
          const durationMax = url.searchParams.get("duration_max") || "";
          const remark = url.searchParams.get("remark") || "";
          let codesQuery = "SELECT * FROM codes";
          const countQuery2 = "SELECT COUNT(*) as total FROM codes";
          const params2 = [];
          const whereConditions2 = [];
          if (statusFilter) {
            whereConditions2.push("status = ?");
            params2.push(statusFilter);
          }
          if (expiredFrom) {
            whereConditions2.push("expired_at >= ?");
            params2.push(expiredFrom);
          }
          if (expiredTo) {
            whereConditions2.push("expired_at <= ?");
            params2.push(expiredTo);
          }
          if (activatedFrom) {
            whereConditions2.push("activated_at >= ?");
            params2.push(activatedFrom);
          }
          if (activatedTo) {
            whereConditions2.push("activated_at <= ?");
            params2.push(activatedTo);
          }
          if (durationMin) {
            whereConditions2.push("duration_days >= ?");
            params2.push(parseInt(durationMin));
          }
          if (durationMax) {
            whereConditions2.push("duration_days <= ?");
            params2.push(parseInt(durationMax));
          }
          if (remark) {
            whereConditions2.push("remark LIKE ?");
            params2.push("%" + remark + "%");
          }
          if (whereConditions2.length > 0) {
            const whereClause = " WHERE " + whereConditions2.join(" AND ");
            codesQuery += whereClause;
          }
          const totalResult2 = await getDB().prepare(countQuery2 + (whereConditions2.length > 0 ? " WHERE " + whereConditions2.join(" AND ") : "")).bind(...params2).first();
          const total2 = totalResult2.total;
          const offset2 = (page2 - 1) * pageSize2;
          codesQuery += " ORDER BY code DESC LIMIT ? OFFSET ?";
          const codes = await getDB().prepare(codesQuery).bind(...params2, pageSize2, offset2).all();
          return new Response(JSON.stringify({
            results: codes.results,
            pagination: {
              page: page2,
              page_size: pageSize2,
              total: total2,
              total_pages: Math.ceil(total2 / pageSize2)
            }
          }), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (request.method === "POST" && url.searchParams.get("action") === "activate") {
          const data = await request.json();
          const now2 = (/* @__PURE__ */ new Date()).toISOString();
          const code = await getDB().prepare("SELECT * FROM codes WHERE code = ?").bind(data.code).first();
          if (!code) {
            return new Response(JSON.stringify({ success: false, error: "Code not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" }
            });
          }
          if (code.status !== "unused") {
            return new Response(JSON.stringify({ success: false, error: "Code already used" }), {
              status: 400,
              headers: { "Content-Type": "application/json" }
            });
          }
          const expiredAt = /* @__PURE__ */ new Date();
          expiredAt.setTime(expiredAt.getTime() + code.duration_days * 24 * 60 * 60 * 1e3);
          await getDB().prepare(`
            UPDATE codes SET status = 'active', activated_at = ?, expired_at = ?
            WHERE code = ?
          `).bind(
            now2,
            expiredAt.toISOString(),
            data.code
          ).run();
          return new Response(JSON.stringify({
            success: true,
            activated_at: now2,
            expired_at: expiredAt.toISOString()
          }), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (request.method === "POST" && url.searchParams.get("action") === "import") {
          const data = await request.json();
          const { codes: importCodes, skip_duplicates, update_existing } = data;
          if (!Array.isArray(importCodes) || importCodes.length === 0) {
            return new Response(JSON.stringify({ success: false, error: "Invalid data format" }), {
              status: 400,
              headers: { "Content-Type": "application/json" }
            });
          }
          const db2 = getDB();
          let imported = 0;
          let skipped = 0;
          let errors = 0;
          const errorDetails = [];
          for (const item of importCodes) {
            const { code, duration_days, activated_at, expired_at, remark } = item;
            if (!code || !duration_days) {
              errors++;
              errorDetails.push(`Missing required fields for code: ${code || "unknown"}`);
              continue;
            }
            try {
              const existing = await db2.prepare("SELECT * FROM codes WHERE code = ?").bind(code).first();
              if (existing) {
                if (skip_duplicates && !update_existing) {
                  skipped++;
                } else if (update_existing) {
                  let updateFields = [];
                  let updateParams = [];
                  updateFields.push("duration_days = ?");
                  updateParams.push(duration_days);
                  if (activated_at) {
                    updateFields.push("activated_at = ?");
                    updateParams.push(parseBeijingTime(activated_at));
                  }
                  if (expired_at) {
                    updateFields.push("expired_at = ?");
                    updateParams.push(parseBeijingTime(expired_at));
                  } else {
                    const defaultExpiredAt = /* @__PURE__ */ new Date();
                    defaultExpiredAt.setTime(defaultExpiredAt.getTime() + duration_days * 24 * 60 * 60 * 1e3);
                    updateFields.push("expired_at = ?");
                    updateParams.push(defaultExpiredAt.toISOString());
                  }
                  if (remark !== void 0) {
                    updateFields.push("remark = ?");
                    updateParams.push(remark || "");
                  }
                  updateParams.push(code);
                  await db2.prepare(`
                    UPDATE codes SET ${updateFields.join(", ")} WHERE code = ?
                  `).bind(...updateParams).run();
                  imported++;
                } else {
                  skipped++;
                }
              } else {
                let activatedAtISO = null;
                let expiredAtISO = null;
                if (activated_at) {
                  activatedAtISO = parseBeijingTime(activated_at);
                }
                if (expired_at) {
                  expiredAtISO = parseBeijingTime(expired_at);
                } else {
                  const defaultExpiredAt = /* @__PURE__ */ new Date();
                  defaultExpiredAt.setTime(defaultExpiredAt.getTime() + duration_days * 24 * 60 * 60 * 1e3);
                  expiredAtISO = defaultExpiredAt.toISOString();
                }
                const status = activatedAtISO ? "active" : "unused";
                await db2.prepare(`
                  INSERT INTO codes (code, status, duration_days, activated_at, expired_at, max_ips, remark)
                  VALUES (?, ?, ?, ?, ?, ?, ?)
                `).bind(
                  code,
                  status,
                  duration_days,
                  activatedAtISO,
                  expiredAtISO,
                  3,
                  remark || ""
                ).run();
                imported++;
              }
            } catch (error) {
              errors++;
              errorDetails.push(`Error importing code ${code}: ${error.message}`);
            }
          }
          return new Response(JSON.stringify({
            success: true,
            imported,
            skipped,
            errors,
            errorDetails
          }), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (request.method === "POST") {
          const data = await request.json();
          const codes = [];
          const db2 = getDB();
          for (let i = 0; i < data.count; i++) {
            let code;
            let isUnique = false;
            let attempts = 0;
            const maxAttempts = 100;
            while (!isUnique && attempts < maxAttempts) {
              code = generateCode();
              const existing = await db2.prepare("SELECT code FROM codes WHERE code = ?").bind(code).first();
              if (!existing) {
                isUnique = true;
              }
              attempts++;
            }
            if (!isUnique) {
              return new Response(JSON.stringify({ success: false, error: "Failed to generate unique code" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
              });
            }
            const now2 = (/* @__PURE__ */ new Date()).toISOString();
            const expiredAt = /* @__PURE__ */ new Date();
            expiredAt.setTime(expiredAt.getTime() + data.duration_days * 24 * 60 * 60 * 1e3);
            await db2.prepare(`
              INSERT INTO codes (code, status, duration_days, activated_at, expired_at, max_ips, remark)
              VALUES (?, 'unused', ?, ?, ?, ?, ?)
            `).bind(
              code,
              data.duration_days,
              now2,
              expiredAt.toISOString(),
              data.max_ips || 3,
              data.remark || ""
            ).run();
            codes.push({
              code,
              expired_at: expiredAt.toISOString(),
              remark: data.remark || ""
            });
          }
          return new Response(JSON.stringify({ success: true, codes }), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (request.method === "PUT") {
          const data = await request.json();
          await getDB().prepare(`
            UPDATE codes SET status = ?, remark = ?
            WHERE code = ?
          `).bind(
            data.status,
            data.remark,
            data.code
          ).run();
          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (request.method === "DELETE") {
          const db2 = getDB();
          const countResult = await db2.prepare("SELECT COUNT(*) as count FROM codes").first();
          const codeCount = countResult?.count || 0;
          await db2.prepare("DELETE FROM codes").run();
          return new Response(JSON.stringify({
            success: true,
            message: "Deleted " + codeCount + " codes"
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }
        break;
      case "channels":
        const action2 = url.searchParams.get("action");
        const sourceIdFilter = url.searchParams.get("source_id");
        const groupTitleFilter = url.searchParams.get("group_title");
        const page = parseInt(url.searchParams.get("page")) || 1;
        const pageSize = parseInt(url.searchParams.get("page_size")) || 100;
        const search = url.searchParams.get("search") || "";
        if (action2 === "get_groups") {
          const db2 = getDB();
          let query = "SELECT DISTINCT c.group_title FROM channels c";
          const params2 = [];
          const conditions = [];
          conditions.push("c.group_title IS NOT NULL");
          conditions.push('c.group_title != ""');
          if (sourceIdFilter) {
            query += " INNER JOIN sources s ON c.source_id = s.id";
            conditions.push("s.id = ?");
            params2.push(sourceIdFilter);
          }
          query += " WHERE " + conditions.join(" AND ") + " ORDER BY c.group_title";
          const groups = await db2.prepare(query).bind(...params2).all();
          return new Response(JSON.stringify({ groups: groups.results.map((g) => g.group_title) }), {
            headers: { "Content-Type": "application/json" }
          });
        }
        if (request.method === "DELETE") {
          const db2 = getDB();
          const countResult = await db2.prepare("SELECT COUNT(*) as count FROM channels").first();
          const channelCount = countResult?.count || 0;
          await db2.prepare("DELETE FROM channels").run();
          return new Response(JSON.stringify({
            success: true,
            message: `\u5DF2\u6E05\u7A7A ${channelCount} \u4E2A\u9891\u9053\u6570\u636E`
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }
        let channelsQuery = "SELECT c.*, s.name as source_name FROM channels c LEFT JOIN sources s ON c.source_id = s.id";
        const countQuery = "SELECT COUNT(*) as total FROM channels c LEFT JOIN sources s ON c.source_id = s.id";
        const params = [];
        const whereConditions = [];
        if (sourceIdFilter) {
          whereConditions.push("c.source_id = ?");
          params.push(sourceIdFilter);
        }
        if (groupTitleFilter) {
          whereConditions.push("c.group_title = ?");
          params.push(groupTitleFilter);
        }
        if (search) {
          whereConditions.push("(c.channel_name LIKE ? OR c.group_title LIKE ?)");
          const searchPattern = `%${search}%`;
          params.push(searchPattern, searchPattern);
        }
        if (whereConditions.length > 0) {
          const whereClause = " WHERE " + whereConditions.join(" AND ");
          channelsQuery += whereClause;
        }
        const totalResult = await getDB().prepare(countQuery + (whereConditions.length > 0 ? " WHERE " + whereConditions.join(" AND ") : "")).bind(...params).first();
        const total = totalResult.total;
        const offset = (page - 1) * pageSize;
        channelsQuery += " ORDER BY c.group_title, c.channel_name LIMIT ? OFFSET ?";
        const channels = await getDB().prepare(channelsQuery).bind(...params, pageSize, offset).all();
        const formattedResults = channels.results.map((channel) => ({
          id: channel.id,
          source_id: channel.source_id,
          channel_name: channel.channel_name,
          group_title: channel.group_title,
          logo: channel.logo,
          play_url: channel.play_url,
          headers: channel.headers,
          channel_hash: channel.channel_hash,
          is_active: channel.is_active,
          source_name: channel.source_name
        }));
        if (formattedResults.length > 0) {
          formattedResults.sort((a, b) => {
            const groupA = a.group_title || "";
            const groupB = b.group_title || "";
            if (groupA !== groupB) {
              return groupA.localeCompare(groupB, "zh-CN", { numeric: true });
            }
            const nameA = a.channel_name || "";
            const nameB = b.channel_name || "";
            const cctvMatchA = nameA.match(/^([A-Za-z]+)(\d+)/);
            const cctvMatchB = nameB.match(/^([A-Za-z]+)(\d+)/);
            if (cctvMatchA && cctvMatchB && cctvMatchA[1].toUpperCase() === cctvMatchB[1].toUpperCase()) {
              const numA = parseInt(cctvMatchA[2]);
              const numB = parseInt(cctvMatchB[2]);
              if (numA !== numB) {
                return numA - numB;
              }
              const suffixA = nameA.substring(cctvMatchA[1].length + cctvMatchA[2].length);
              const suffixB = nameB.substring(cctvMatchB[1].length + cctvMatchB[2].length);
              const hasSuffixA = suffixA.trim().length > 0;
              const hasSuffixB = suffixB.trim().length > 0;
              if (hasSuffixA !== hasSuffixB) {
                return hasSuffixA ? 1 : -1;
              }
              return suffixA.localeCompare(suffixB, "zh-CN", { numeric: true });
            }
            for (let i = 0; i < Math.min(nameA.length, nameB.length); i++) {
              const charA = nameA.charCodeAt(i);
              const charB = nameB.charCodeAt(i);
              const isAlphaA = charA >= 65 && charA <= 90 || charA >= 97 && charA <= 122;
              const isAlphaB = charB >= 65 && charB <= 90 || charB >= 97 && charB <= 122;
              const isDigitA = charA >= 48 && charA <= 57;
              const isDigitB = charB >= 48 && charB <= 57;
              const isChineseA = charA >= 19968 && charA <= 40869;
              const isChineseB = charB >= 19968 && charB <= 40869;
              const typeA = isAlphaA ? 1 : isDigitA ? 2 : isChineseA ? 3 : 4;
              const typeB = isAlphaB ? 1 : isDigitB ? 2 : isChineseB ? 3 : 4;
              if (typeA !== typeB) {
                return typeA - typeB;
              }
              if (charA !== charB) {
                return charA - charB;
              }
            }
            return nameA.length - nameB.length;
          });
        }
        return new Response(JSON.stringify({
          results: formattedResults,
          pagination: {
            page,
            page_size: pageSize,
            total,
            total_pages: Math.ceil(total / pageSize)
          }
        }), {
          headers: { "Content-Type": "application/json" }
        });
      case "ip-blacklist-config":
        if (request.method === "GET") {
          const config = await getIPBlacklistConfig();
          return new Response(JSON.stringify({
            success: true,
            config
          }), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (request.method === "POST") {
          const data = await request.json();
          const fields = ["sub_rate_min", "sub_rate_hour", "sub_rate_day", "live_rate_min", "live_rate_hour", "live_rate_day", "admin_rate_hour"];
          const validConfig = {};
          for (const field of fields) {
            if (data[field] !== void 0 && data[field] > 0) {
              validConfig[field] = parseInt(data[field]);
            }
          }
          await updateIPBlacklistConfig(validConfig);
          return new Response(JSON.stringify({
            success: true,
            message: "IP\u9ED1\u540D\u5355\u914D\u7F6E\u5DF2\u66F4\u65B0",
            config: validConfig
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }
        break;
      case "homepage-display":
        if (request.method === "GET") {
          const config = await getHomepageDisplayConfig();
          const sources = await getDB().prepare("SELECT id, name, url FROM sources WHERE is_active = 1 ORDER BY id").all();
          const sourceList = sources.results || [];
          const groups = await getDB().prepare(`
            SELECT DISTINCT group_title
            FROM channels
            WHERE is_active = 1
            ORDER BY group_title
          `).all();
          const groupList = (groups.results || []).map((g) => g.group_title).filter((g) => g);
          const hostResult = await getDB().prepare(`
            SELECT DISTINCT play_url
            FROM channels
            WHERE is_active = 1
            LIMIT 1000
          `).all();
          const hostSet = /* @__PURE__ */ new Set();
          (hostResult.results || []).forEach((row) => {
            try {
              const url2 = new URL(row.play_url);
              hostSet.add(url2.hostname);
            } catch (e) {
            }
          });
          const hostList = Array.from(hostSet).sort();
          return new Response(JSON.stringify({
            success: true,
            config,
            options: {
              sources: sourceList,
              groups: groupList,
              hosts: hostList
            }
          }), {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate"
            }
          });
        } else if (request.method === "POST") {
          const data = await request.json();
          const validConfig = {
            sources: Array.isArray(data.sources) ? data.sources : [],
            groups: Array.isArray(data.groups) ? data.groups : [],
            hosts: Array.isArray(data.hosts) ? data.hosts : [],
            hasHeaders: data.hasHeaders !== void 0 ? data.hasHeaders : null
          };
          console.log("[admin/homepage-display] \u4FDD\u5B58\u914D\u7F6E\uFF0ChasHeaders:", validConfig.hasHeaders);
          await updateHomepageDisplayConfig(validConfig);
          return new Response(JSON.stringify({
            success: true,
            message: "\u9996\u9875\u5C55\u793A\u914D\u7F6E\u5DF2\u66F4\u65B0",
            config: validConfig
          }), {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
              "Pragma": "no-cache",
              "Expires": "0"
            }
          });
        }
        break;
      case "system-config":
        if (request.method === "GET") {
          const config = await getSystemConfig();
          return new Response(JSON.stringify({
            success: true,
            config
          }), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (request.method === "POST") {
          const data = await request.json();
          const config = {};
          if (data.enable_ref_check !== void 0) {
            config.enable_ref_check = data.enable_ref_check;
          }
          if (data.ref_whitelist !== void 0) {
            config.ref_whitelist = data.ref_whitelist;
          }
          if (data.enable_play_token !== void 0) {
            config.enable_play_token = data.enable_play_token;
          }
          if (data.play_token_expire_seconds !== void 0 && data.play_token_expire_seconds > 0) {
            config.play_token_expire_seconds = parseInt(data.play_token_expire_seconds);
          }
          if (data.enable_ip_bind !== void 0) {
            config.enable_ip_bind = data.enable_ip_bind;
          }
          if (data.enable_burn_after_read !== void 0) {
            config.enable_burn_after_read = data.enable_burn_after_read;
          }
          if (data.enable_url_encryption !== void 0) {
            config.enable_url_encryption = data.enable_url_encryption;
          }
          if (data.url_encryption_key !== void 0) {
            config.url_encryption_key = data.url_encryption_key;
          }
          if (data.rotate_encryption_key === true) {
            const newKey = generateRandomEncryptionKey();
            config.url_encryption_key = newKey;
            config.rotate_encryption_key = true;
          }
          await updateSystemConfig(config);
          return new Response(JSON.stringify({
            success: true,
            message: "\u7CFB\u7EDF\u914D\u7F6E\u5DF2\u66F4\u65B0",
            config
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }
        break;
      case "security":
        const securitySubAction = pathParts[3];
        if (request.method === "GET" && securitySubAction === "banned-codes") {
          let codes = [];
          const cacheResult = await getBannedCodesFromCache(env, 100, 0);
          codes = cacheResult.data;
          if (codes.length === 0) {
            const db2 = getDB();
            await syncBannedCodesToCache(env, db2);
            const cacheResult2 = await getBannedCodesFromCache(env, 100, 0);
            codes = cacheResult2.data;
          }
          return new Response(JSON.stringify({
            success: true,
            count: cacheResult.total,
            codes
          }), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (request.method === "GET" && securitySubAction === "config") {
          const config = await getSecurityConfig();
          return new Response(JSON.stringify({
            success: true,
            config: {
              channel_daily_limit: config.channel_daily_limit,
              ban_duration_days: config.ban_duration_days,
              auto_ban_on_exceed: config.auto_ban_on_exceed
            }
          }), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (request.method === "POST" && securitySubAction === "config") {
          const data = await request.json();
          const config = {};
          if (data.channel_daily_limit !== void 0 && data.channel_daily_limit > 0) {
            config.channel_daily_limit = data.channel_daily_limit;
          }
          if (data.ban_duration_days !== void 0 && data.ban_duration_days >= 0) {
            config.ban_duration_days = data.ban_duration_days;
          }
          if (data.auto_ban_on_exceed !== void 0) {
            config.auto_ban_on_exceed = data.auto_ban_on_exceed;
          }
          await updateSecurityConfig(config);
          return new Response(JSON.stringify({
            success: true,
            message: "\u914D\u7F6E\u5DF2\u66F4\u65B0",
            config
          }), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (request.method === "GET" && securitySubAction === "quota") {
          const code = url.searchParams.get("code");
          if (!code) {
            return new Response("Missing code parameter", { status: 400 });
          }
          const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          const quotaRecords = [];
          const quotaKey = `code_quota:${today}:${code}`;
          const quotaData = await env.KV.get(quotaKey, { type: "json" }) || {
            totalPlays: 0,
            channelPlays: {},
            bannedChannels: [],
            exceededChannels: []
          };
          const channelHashes = Object.keys(quotaData.channelPlays || {});
          const channelNames = {};
          if (channelHashes.length > 0) {
            const channels2 = await getDB().prepare(
              "SELECT channel_hash, channel_name FROM channels WHERE channel_hash IN (" + channelHashes.map(() => "?").join(",") + ")"
            ).bind(...channelHashes).all();
            if (channels2.results) {
              channels2.results.forEach((channel) => {
                channelNames[channel.channel_hash] = channel.channel_name;
              });
            }
          }
          const codeInfo = await getDB().prepare("SELECT banned_until FROM codes WHERE code = ?").bind(code).first();
          const isBanned = codeInfo?.banned_until && codeInfo.banned_until > (/* @__PURE__ */ new Date()).toISOString();
          return new Response(JSON.stringify({
            success: true,
            date: today,
            total_plays: quotaData.totalPlays || 0,
            exceeded_channels_count: quotaData.exceededChannels?.length || 0,
            is_banned: isBanned,
            banned_at: quotaData.bannedAt || null,
            banned_until: quotaData.bannedUntil || (isBanned ? codeInfo.banned_until : null),
            ban_duration_days: quotaData.banDurationDays || null,
            channel_names: channelNames,
            details: quotaData
          }), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (request.method === "POST" && securitySubAction === "unban") {
          const data = await request.json();
          const code = data.code;
          if (!code) {
            return new Response("Missing code parameter", { status: 400 });
          }
          const codeInfo = await getDB().prepare("SELECT status, remark FROM codes WHERE code = ?").bind(code).first();
          if (!codeInfo) {
            return new Response("Code not found", { status: 404 });
          }
          const newRemark = codeInfo.remark ? codeInfo.remark.replace(/系统自动封禁：[^\n]*/g, "").trim() : "";
          await getDB().prepare("UPDATE codes SET status = 'active', remark = ?, banned_until = NULL WHERE code = ?").bind(newRemark, code).run();
          await removeBannedCodeFromCache(env, code);
          const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          await env.KV.delete(`code_quota:${today}:${code}`);
          return new Response(JSON.stringify({
            success: true,
            message: "\u5361\u5BC6\u5DF2\u89E3\u5C01"
          }), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (request.method === "GET" && securitySubAction === "stats") {
          const code = url.searchParams.get("code");
          if (!code) {
            return new Response("Missing code parameter", { status: 400 });
          }
          const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          const accessData = await env.KV.get(`access:${code}:${today}`, { type: "json" }) || {
            totalPlays: 0,
            channels: {},
            ips: [],
            lastAccess: 0
          };
          const abuseFlag = await env.KV.get(`abuse_flag:${code}`, { type: "json" });
          const suspiciousFlag = await env.KV.get(`suspicious:${code}`, { type: "json" });
          return new Response(JSON.stringify({
            success: true,
            date: today,
            total_plays: accessData.totalPlays || 0,
            unique_ips: accessData.ips ? accessData.ips.length : 0,
            channel_count: Object.keys(accessData.channels || {}).length,
            top_channels: Object.entries(accessData.channels || {}).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([hash, count]) => ({ channel_hash: hash, play_count: count })),
            abuse_detected: !!abuseFlag,
            suspicious_detected: !!suspiciousFlag,
            abuse_details: abuseFlag,
            suspicious_details: suspiciousFlag
          }), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (request.method === "DELETE" && securitySubAction === "reset") {
          const code = url.searchParams.get("code");
          if (!code) {
            return new Response("Missing code parameter", { status: 400 });
          }
          const keysToDelete = [
            `access:${code}:*`,
            `limit:play:*:${code}`,
            `abuse:${code}`,
            `abuse_flag:${code}`,
            `suspicious:${code}`
          ];
          const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          await env.KV.delete(`access:${code}:${today}`);
          await env.KV.delete(`abuse:${code}`);
          await env.KV.delete(`abuse_flag:${code}`);
          await env.KV.delete(`suspicious:${code}`);
          return new Response(JSON.stringify({
            success: true,
            message: "\u5B89\u5168\u8BA1\u6570\u5DF2\u91CD\u7F6E"
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }
      case "ip-blacklist":
        const blacklistSubAction = pathParts[3];
        if (request.method === "GET" && !blacklistSubAction) {
          const result2 = await getBlacklistedIPs(env, 100, 0);
          return new Response(JSON.stringify({
            success: true,
            count: result2.total,
            ips: result2.data
          }), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (request.method === "DELETE" && blacklistSubAction === "remove") {
          const ip = url.searchParams.get("ip");
          if (!ip) {
            return new Response("Missing IP parameter", { status: 400 });
          }
          await unbanIP(env, ip);
          return new Response(JSON.stringify({
            success: true,
            message: `IP ${ip} has been unbanned`
          }), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (request.method === "GET" && blacklistSubAction === "stats") {
          const ip = url.searchParams.get("ip");
          if (!ip) {
            return new Response("Missing IP parameter", { status: 400 });
          }
          const stats = await getIPAccessStats(env, ip);
          return new Response(JSON.stringify({
            success: true,
            ip,
            stats
          }), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (request.method === "POST" && blacklistSubAction === "ban") {
          const data = await request.json();
          if (!data.ip) {
            return new Response("Missing IP parameter", { status: 400 });
          }
          await banIP(env, data.ip, data.reason || "Manual ban", data.details || {});
          return new Response(JSON.stringify({
            success: true,
            message: `IP ${data.ip} has been banned`
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }
        break;
      case "cache":
        const cacheSubAction = pathParts[3];
        if (cacheSubAction === "status" && request.method === "GET") {
          const status = await getCacheStatus(env);
          return new Response(JSON.stringify({
            success: true,
            ...status
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }
        if (cacheSubAction === "refresh" && request.method === "POST") {
          const result2 = await cacheChannelsToKV(env);
          return new Response(JSON.stringify({
            success: result2.success,
            message: result2.success ? `\u7F13\u5B58\u5237\u65B0\u6210\u529F\uFF1A${result2.channels} \u4E2A\u9891\u9053\uFF0C${result2.groups} \u4E2A\u5206\u7EC4` : "\u7F13\u5B58\u5237\u65B0\u5931\u8D25",
            channels: result2.channels,
            groups: result2.groups,
            version: result2.version,
            error: result2.error
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }
        if (cacheSubAction === "clear" && request.method === "POST") {
          const cleared = await clearChannelCache(env);
          return new Response(JSON.stringify({
            success: cleared,
            message: cleared ? "\u7F13\u5B58\u5DF2\u6E05\u7A7A" : "\u7F13\u5B58\u6E05\u7A7A\u5931\u8D25"
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }
        return new Response("Invalid cache action", { status: 400 });
      case "announcement":
        if (request.method === "GET") {
          const db2 = getDB();
          const announcement = await db2.prepare(`
            SELECT * FROM announcements
            ORDER BY updated_at DESC
            LIMIT 1
          `).first();
          return new Response(JSON.stringify({
            success: true,
            data: announcement
          }), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (request.method === "POST") {
          const data = await request.json();
          const db2 = getDB();
          const now2 = (/* @__PURE__ */ new Date()).toISOString();
          if (data.id) {
            await db2.prepare(`
              UPDATE announcements
              SET title = ?, content = ?, enabled = ?, display_frequency = ?, updated_at = ?
              WHERE id = ?
            `).bind(
              data.title,
              data.content,
              data.enabled !== void 0 ? data.enabled ? 1 : 0 : 1,
              data.display_frequency || "once",
              now2,
              data.id
            ).run();
            return new Response(JSON.stringify({
              success: true,
              message: "\u516C\u544A\u66F4\u65B0\u6210\u529F"
            }), {
              headers: { "Content-Type": "application/json" }
            });
          } else {
            const result2 = await db2.prepare(`
              INSERT INTO announcements (title, content, enabled, display_frequency, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?)
            `).bind(
              data.title,
              data.content,
              data.enabled !== void 0 ? data.enabled ? 1 : 0 : 1,
              data.display_frequency || "once",
              now2,
              now2
            ).run();
            return new Response(JSON.stringify({
              success: true,
              message: "\u516C\u544A\u521B\u5EFA\u6210\u529F",
              id: result2.meta.last_row_id
            }), {
              headers: { "Content-Type": "application/json" }
            });
          }
        }
        break;
      default:
        return new Response("Invalid admin action", { status: 400 });
    }
  } catch (error) {
    console.error("Admin API error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleAdminRequest, "handleAdminRequest");
function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
__name(generateCode, "generateCode");
function parseBeijingTime(dateStr) {
  if (!dateStr) return null;
  try {
    let parsedDate;
    const trimmedStr = dateStr.trim();
    if (trimmedStr.includes(" ") && trimmedStr.includes(":")) {
      const parts = trimmedStr.split(" ");
      const datePart = parts[0];
      const timePart = parts.slice(1).join(" ");
      const isoStr = `${datePart}T${timePart}+08:00`;
      parsedDate = new Date(isoStr);
    } else {
      parsedDate = /* @__PURE__ */ new Date(trimmedStr + "T00:00:00+08:00");
    }
    if (isNaN(parsedDate.getTime())) {
      return null;
    }
    return parsedDate.toISOString();
  } catch (error) {
    console.error("Error parsing Beijing time:", error);
    return null;
  }
}
__name(parseBeijingTime, "parseBeijingTime");
async function getCodesForExport(params) {
  const db = getDB();
  let codesQuery = "SELECT * FROM codes";
  const queryParams = [];
  const whereConditions = [];
  const statusFilter = params.get("status") || "";
  const expiredFrom = params.get("expired_from") || "";
  const expiredTo = params.get("expired_to") || "";
  const activatedFrom = params.get("activated_from") || "";
  const activatedTo = params.get("activated_to") || "";
  const durationMin = params.get("duration_min") || "";
  const durationMax = params.get("duration_max") || "";
  const remark = params.get("remark") || "";
  if (statusFilter) {
    whereConditions.push("status = ?");
    queryParams.push(statusFilter);
  }
  if (expiredFrom) {
    whereConditions.push("expired_at >= ?");
    queryParams.push(expiredFrom);
  }
  if (expiredTo) {
    whereConditions.push("expired_at <= ?");
    queryParams.push(expiredTo);
  }
  if (activatedFrom) {
    whereConditions.push("activated_at >= ?");
    queryParams.push(activatedFrom);
  }
  if (activatedTo) {
    whereConditions.push("activated_at <= ?");
    queryParams.push(activatedTo);
  }
  if (durationMin) {
    whereConditions.push("duration_days >= ?");
    queryParams.push(parseInt(durationMin));
  }
  if (durationMax) {
    whereConditions.push("duration_days <= ?");
    queryParams.push(parseInt(durationMax));
  }
  if (remark) {
    whereConditions.push("remark LIKE ?");
    queryParams.push("%" + remark + "%");
  }
  if (whereConditions.length > 0) {
    codesQuery += " WHERE " + whereConditions.join(" AND ");
  }
  codesQuery += " ORDER BY code DESC";
  const codes = await db.prepare(codesQuery).bind(...queryParams).all();
  return codes.results || [];
}
__name(getCodesForExport, "getCodesForExport");
function formatDateTime(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
}
__name(formatDateTime, "formatDateTime");
function escapeCsvField(field) {
  if (!field) return "";
  const str = String(field);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}
__name(escapeCsvField, "escapeCsvField");
function generateRandomEncryptionKey(length = 32) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}
__name(generateRandomEncryptionKey, "generateRandomEncryptionKey");

// handlers/user.js
init_checked_fetch();
init_modules_watch_stub();
init_database();
async function handleUserActivate(request, env, ctx) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return new Response(JSON.stringify({ success: false, error: "\u5361\u5BC6\u4E0D\u80FD\u4E3A\u7A7A" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const db = getDB();
    const codeRecord = await db.prepare("SELECT * FROM codes WHERE code = ?").bind(code).first();
    if (!codeRecord) {
      return new Response(JSON.stringify({ success: false, error: "\u5361\u5BC6\u4E0D\u5B58\u5728" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (codeRecord.status === "disabled") {
      return new Response(JSON.stringify({ success: false, error: "\u8BE5\u5361\u5BC6\u5DF2\u88AB\u7981\u7528" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    const now = /* @__PURE__ */ new Date();
    if (codeRecord.expired_at && new Date(codeRecord.expired_at) < now) {
      await db.prepare("UPDATE codes SET status = 'disabled' WHERE code = ?").bind(code).run();
      return new Response(JSON.stringify({ success: false, error: "\u8BE5\u5361\u5BC6\u5DF2\u8FC7\u671F" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (codeRecord.banned_until) {
      const bannedUntil = new Date(codeRecord.banned_until);
      if (bannedUntil > now) {
        return new Response(JSON.stringify({
          success: false,
          error: `\u8BE5\u5361\u5BC6\u5DF2\u88AB\u5C01\u7981\uFF0C\u89E3\u5C01\u65F6\u95F4\uFF1A${bannedUntil.toLocaleString("zh-CN")}`
        }), {
          status: 403,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    if (codeRecord.status === "unused") {
      const activatedAt = now.toISOString();
      let expiredAt = codeRecord.expired_at;
      if (!expiredAt) {
        const expDate = /* @__PURE__ */ new Date();
        expDate.setTime(expDate.getTime() + (codeRecord.duration_days || 30) * 24 * 60 * 60 * 1e3);
        expiredAt = expDate.toISOString();
      }
      await db.prepare(`
        UPDATE codes SET status = 'active', activated_at = ?, expired_at = ?
        WHERE code = ?
      `).bind(activatedAt, expiredAt, code).run();
      return new Response(JSON.stringify({
        success: true,
        activated_at: activatedAt,
        expired_at: expiredAt,
        message: "\u5361\u5BC6\u6FC0\u6D3B\u6210\u529F"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    if (codeRecord.status === "active") {
      return new Response(JSON.stringify({
        success: true,
        activated_at: codeRecord.activated_at,
        expired_at: codeRecord.expired_at,
        message: "\u8BE5\u5361\u5BC6\u5DF2\u6FC0\u6D3B"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ success: false, error: "\u5361\u5BC6\u72B6\u6001\u5F02\u5E38" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("\u6FC0\u6D3B\u5361\u5BC6\u5931\u8D25:", error);
    return new Response(JSON.stringify({ success: false, error: "\u670D\u52A1\u5668\u9519\u8BEF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleUserActivate, "handleUserActivate");

// handlers/public.js
init_checked_fetch();
init_modules_watch_stub();
init_database();
async function handlePublicAnnouncement(request, env, ctx) {
  try {
    const db = getDB();
    const announcementResult = await db.prepare(`
      SELECT * FROM announcements
      WHERE enabled = 1
      ORDER BY updated_at DESC
      LIMIT 1
    `).first();
    if (!announcementResult) {
      return new Response(JSON.stringify({
        success: false,
        message: "No active announcement"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      data: announcementResult
    }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"
      }
    });
  } catch (error) {
    console.error("[Announcement] \u83B7\u53D6\u516C\u544A\u5931\u8D25:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handlePublicAnnouncement, "handlePublicAnnouncement");
async function handleRandomChannels(env, count = 30) {
  console.log("[RandomChannels] \u83B7\u53D6\u968F\u673A\u63A8\u8350\uFF0C\u6570\u91CF:", count);
  try {
    const cacheResult = await getAllChannels(env);
    const allChannels = cacheResult.channels || [];
    console.log("[RandomChannels] \u4ECE\u7F13\u5B58\u83B7\u53D6\u9891\u9053\u6570\u91CF:", allChannels.length, "fromCache:", cacheResult.fromCache);
    if (allChannels.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        channels: [],
        count: 0
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    const shuffled = [...allChannels].sort(() => 0.5 - Math.random());
    const randomChannels = shuffled.slice(0, Math.min(count, allChannels.length));
    console.log("[RandomChannels] \u8FD4\u56DE\u968F\u673A\u9891\u9053\u6570\u91CF:", randomChannels.length, "\u603B\u9891\u9053\u6570:", allChannels.length);
    return new Response(JSON.stringify({
      success: true,
      channels: randomChannels,
      count: randomChannels.length
    }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (error) {
    console.error("[RandomChannels] \u83B7\u53D6\u968F\u673A\u63A8\u8350\u5931\u8D25:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "\u83B7\u53D6\u968F\u673A\u63A8\u8350\u5931\u8D25: " + error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handleRandomChannels, "handleRandomChannels");
async function handleChannelDebug(request, env, ctx) {
  const url = new URL(request.url);
  const hash = url.searchParams.get("hash");
  const test = url.searchParams.get("test") === "true";
  if (!hash) {
    return new Response("Missing hash parameter", { status: 400 });
  }
  try {
    const db = getDB();
    const channel = await db.prepare(`
      SELECT channel_name, group_title, logo, play_url, headers, id, source_id
      FROM channels
      WHERE channel_hash = ? AND is_active = 1
    `).bind(hash).first();
    if (!channel) {
      return new Response("Channel not found", { status: 404 });
    }
    if (channel.source_active === 0) {
      return new Response("Channel source is inactive", { status: 404 });
    }
    let headersObj = {};
    if (channel.headers) {
      try {
        headersObj = JSON.parse(channel.headers);
      } catch (e) {
        headersObj = { error: e.message };
      }
    }
    if (test) {
      const results = [];
      const encodedUrl = channel.play_url.replace("id=\u4E94\u661F\u4F53\u80B2", "id=" + encodeURIComponent("\u4E94\u661F\u4F53\u80B2"));
      const tests = [
        {
          name: "\u539F\u59CBURL\uFF0CGET\u8BF7\u6C42",
          method: "GET",
          url: channel.play_url,
          headers: { "User-Agent": "iPhone" }
        },
        {
          name: "URL\u7F16\u7801\u4E2D\u6587\uFF0CGET\u8BF7\u6C42",
          method: "GET",
          url: encodedUrl,
          headers: { "User-Agent": "iPhone" }
        },
        {
          name: "POST\u8BF7\u6C42\uFF0C\u8868\u5355\u6570\u636E",
          method: "POST",
          url: channel.play_url,
          headers: { "User-Agent": "iPhone", "Content-Type": "application/x-www-form-urlencoded" },
          body: "id=" + encodeURIComponent("\u4E94\u661F\u4F53\u80B2")
        },
        {
          name: "GET + \u5B8C\u6574\u6D4F\u89C8\u5668headers",
          method: "GET",
          url: encodedUrl,
          headers: {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
            "Accept": "application/x-mpegURL, application/vnd.apple.mpegurl, application/json, video/mp2t, video/mp4",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
            "Referer": new URL(channel.play_url).origin + "/"
          }
        },
        {
          name: "GET + iPhone headers",
          method: "GET",
          url: encodedUrl,
          headers: {
            "User-Agent": "iPhone",
            "Accept": "*/*",
            "Referer": new URL(channel.play_url).origin + "/"
          }
        },
        {
          name: "GET + m3u8\u64AD\u653E\u5668headers",
          method: "GET",
          url: encodedUrl,
          headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            "Accept": "*/*",
            "Referer": new URL(channel.play_url).origin + "/",
            "Origin": new URL(channel.play_url).origin
          }
        }
      ];
      for (const testConfig of tests) {
        try {
          const options = {
            method: testConfig.method,
            headers: testConfig.headers,
            redirect: "follow"
          };
          if (testConfig.body) {
            options.body = testConfig.body;
          }
          const response = await fetch(testConfig.url, options);
          let responseText = "";
          try {
            responseText = await response.text();
            if (responseText.length > 500) {
              responseText = responseText.substring(0, 500) + "...";
            }
          } catch (e) {
            responseText = "(\u65E0\u6CD5\u8BFB\u53D6\u54CD\u5E94)";
          }
          results.push({
            name: testConfig.name,
            url: testConfig.url,
            method: testConfig.method,
            headers: testConfig.headers,
            body: testConfig.body,
            status: response.status,
            statusText: response.statusText,
            contentType: response.headers.get("Content-Type"),
            success: response.ok,
            responsePreview: responseText
          });
        } catch (e) {
          results.push({
            name: testConfig.name,
            url: testConfig.url,
            method: testConfig.method,
            headers: testConfig.headers,
            error: e.message,
            success: false
          });
        }
      }
      return new Response(JSON.stringify({
        channel_name: channel.channel_name,
        play_url: channel.play_url,
        encoded_url: encodedUrl,
        headers: channel.headers,
        headers_parsed: headersObj,
        test_results: results
      }, null, 2));
    }
    return new Response(JSON.stringify({
      channel_name: channel.channel_name,
      play_url: channel.play_url,
      headers: channel.headers,
      headers_parsed: headersObj,
      headers_count: Object.keys(headersObj).length
    }, null, 2));
  } catch (error) {
    console.error("\u83B7\u53D6\u9891\u9053\u8C03\u8BD5\u4FE1\u606F\u5931\u8D25:", error);
    return new Response("Error", { status: 500 });
  }
}
__name(handleChannelDebug, "handleChannelDebug");
async function handlePublicChannels(request, env, ctx) {
  console.log("[PublicChannels] ===== \u8BF7\u6C42\u5F00\u59CB =====");
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const group = url.searchParams.get("group") || "";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("page_size") || "50", 10);
    const action = url.searchParams.get("action") || "";
    if (action === "random") {
      const count = parseInt(url.searchParams.get("count") || "30", 10);
      return await handleRandomChannels(env, count);
    }
    const db = getDB();
    const displayConfig = await getHomepageDisplayConfig();
    console.log("[PublicChannels] displayConfig\u914D\u7F6E:", JSON.stringify(displayConfig));
    const useCache = !search && !group && (!displayConfig.sources || displayConfig.sources.length === 0) && (!displayConfig.groups || displayConfig.groups.length === 0) && (!displayConfig.hosts || displayConfig.hosts.length === 0) && (displayConfig.hasHeaders === null || displayConfig.hasHeaders === void 0);
    console.log("[PublicChannels] useCache:", useCache, "search:", search, "group:", group, "sources:", displayConfig.sources, "groups:", displayConfig.groups, "hosts:", displayConfig.hosts, "hasHeaders:", displayConfig.hasHeaders);
    let shouldUseCache = useCache;
    let allChannels, allGroups, total;
    if (shouldUseCache) {
      console.log("[PublicChannels] \u4F7F\u7528 KV \u7F13\u5B58");
      try {
        const cacheResult = await getAllChannels(env);
        const groupsResult = await getAllGroups(env);
        console.log("[PublicChannels] \u7F13\u5B58\u7ED3\u679C - channels:", cacheResult.channels?.length || 0, "fromCache:", cacheResult.fromCache, "groups:", groupsResult.groups?.length || 0, "fromCache:", groupsResult.fromCache);
        allChannels = cacheResult.channels || [];
        allGroups = groupsResult.groups || [];
        if (allChannels.length > 0) {
          allChannels.sort((a, b) => {
            const groupA = a.group_title || "";
            const groupB = b.group_title || "";
            if (groupA !== groupB) {
              return groupA.localeCompare(groupB, "zh-CN", { numeric: true });
            }
            const nameA = a.channel_name || "";
            const nameB = b.channel_name || "";
            return nameA.localeCompare(nameB, "zh-CN", { numeric: true });
          });
        }
        total = allChannels.length;
        const offset = (page - 1) * pageSize;
        const totalPages = Math.ceil(total / pageSize);
        const paginatedChannels = allChannels.slice(offset, offset + pageSize);
        const pagination = {
          page,
          page_size: pageSize,
          total,
          total_pages: totalPages,
          has_prev: page > 1,
          has_next: page < totalPages
        };
        return new Response(JSON.stringify({
          success: true,
          channels: paginatedChannels,
          groups: allGroups,
          pagination
        }), {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
          }
        });
      } catch (cacheError) {
        console.error("[PublicChannels] \u83B7\u53D6\u7F13\u5B58\u5931\u8D25,\u964D\u7EA7\u5230\u6570\u636E\u5E93:", cacheError);
        shouldUseCache = false;
      }
    }
    if (!shouldUseCache) {
      console.log("[PublicChannels] \u4F7F\u7528\u6570\u636E\u5E93\u67E5\u8BE2");
      let whereConditions = ["c.is_active = 1", "s.is_active = 1"];
      let params = [];
      if (displayConfig.sources && displayConfig.sources.length > 0) {
        const placeholders = displayConfig.sources.map(() => "?").join(",");
        whereConditions.push(`c.source_id IN (${placeholders})`);
        params.push(...displayConfig.sources);
      }
      if (displayConfig.groups && displayConfig.groups.length > 0) {
        const placeholders = displayConfig.groups.map(() => "?").join(",");
        whereConditions.push(`c.group_title IN (${placeholders})`);
        params.push(...displayConfig.groups);
      }
      if (displayConfig.hosts && displayConfig.hosts.length > 0) {
        const hostConditions = displayConfig.hosts.map((host) => `c.play_url LIKE '%${host}%'`).join(" OR ");
        whereConditions.push(`(${hostConditions})`);
      }
      if (displayConfig.hasHeaders !== null && displayConfig.hasHeaders !== void 0) {
        console.log("[PublicChannels] hasHeaders\u8FC7\u6EE4\u914D\u7F6E:", displayConfig.hasHeaders);
        if (displayConfig.hasHeaders === true) {
          whereConditions.push(`c.headers IS NOT NULL AND length(c.headers) > 2`);
        } else {
          whereConditions.push(`c.headers IS NULL OR c.headers = '{}' OR c.headers = ''`);
        }
        console.log("[PublicChannels] hasHeaders\u6761\u4EF6\u5DF2\u6DFB\u52A0");
      }
      if (search) {
        whereConditions.push("(c.channel_name LIKE ? OR c.group_title LIKE ?)");
        params.push(`%${search}%`, `%${search}%`);
      }
      const whereClause = whereConditions.join(" AND ");
      console.log("[PublicChannels] WHERE\u6761\u4EF6:", whereClause);
      console.log("[PublicChannels] \u67E5\u8BE2\u53C2\u6570:", params);
      let channelWhereConditions = [...whereConditions];
      let channelParams = [...params];
      if (group) {
        channelWhereConditions.push("c.group_title = ?");
        channelParams.push(group);
      }
      const channelWhereClause = channelWhereConditions.join(" AND ");
      const countResult = await db.prepare(`
      SELECT COUNT(*) as total
      FROM channels c
      INNER JOIN sources s ON c.source_id = s.id
      WHERE ${channelWhereClause}
    `).bind(...channelParams).first();
      const total2 = countResult ? countResult.total : 0;
      const offset = (page - 1) * pageSize;
      const totalPages = Math.ceil(total2 / pageSize);
      const channelsResult = await db.prepare(`
      SELECT c.id, c.channel_name, c.group_title, c.logo, c.channel_hash, c.source_id, s.name as source_name, c.headers
      FROM channels c
      INNER JOIN sources s ON c.source_id = s.id
      WHERE ${channelWhereClause}
      ORDER BY c.group_title, c.channel_name
      LIMIT ? OFFSET ?
    `).bind(...channelParams, pageSize, offset).all();
      const groupsResult = await db.prepare(`
      SELECT DISTINCT group_title
      FROM channels c
      INNER JOIN sources s ON c.source_id = s.id
      WHERE ${whereClause}
      ORDER BY group_title
    `).bind(...params).all();
      let channels = channelsResult.results || [];
      let groups = groupsResult.results?.map((g) => g.group_title).filter((g) => g) || [];
      if (channels.length > 0) {
        channels.sort((a, b) => {
          const groupA = a.group_title || "";
          const groupB = b.group_title || "";
          if (groupA !== groupB) {
            return groupA.localeCompare(groupB, "zh-CN", { numeric: true });
          }
          const nameA = a.channel_name || "";
          const nameB = b.channel_name || "";
          const cctvMatchA = nameA.match(/^([A-Za-z]+)(\d+)/);
          const cctvMatchB = nameB.match(/^([A-Za-z]+)(\d+)/);
          if (cctvMatchA && cctvMatchB && cctvMatchA[1].toUpperCase() === cctvMatchB[1].toUpperCase()) {
            const numA = parseInt(cctvMatchA[2]);
            const numB = parseInt(cctvMatchB[2]);
            if (numA !== numB) {
              return numA - numB;
            }
            const suffixA = nameA.substring(cctvMatchA[1].length + cctvMatchA[2].length);
            const suffixB = nameB.substring(cctvMatchB[1].length + cctvMatchB[2].length);
            const hasSuffixA = suffixA.trim().length > 0;
            const hasSuffixB = suffixB.trim().length > 0;
            if (hasSuffixA !== hasSuffixB) {
              return hasSuffixA ? 1 : -1;
            }
            return suffixA.localeCompare(suffixB, "zh-CN", { numeric: true });
          }
          for (let i = 0; i < Math.min(nameA.length, nameB.length); i++) {
            const charA = nameA.charCodeAt(i);
            const charB = nameB.charCodeAt(i);
            const isAlphaA = charA >= 65 && charA <= 90 || charA >= 97 && charA <= 122;
            const isAlphaB = charB >= 65 && charB <= 90 || charB >= 97 && charB <= 122;
            const isDigitA = charA >= 48 && charA <= 57;
            const isDigitB = charB >= 48 && charB <= 57;
            const isChineseA = charA >= 19968 && charA <= 40869;
            const isChineseB = charB >= 19968 && charB <= 40869;
            const typeA = isAlphaA ? 1 : isDigitA ? 2 : isChineseA ? 3 : 4;
            const typeB = isAlphaB ? 1 : isDigitB ? 2 : isChineseB ? 3 : 4;
            if (typeA !== typeB) {
              return typeA - typeB;
            }
            if (charA !== charB) {
              return charA - charB;
            }
          }
          return nameA.length - nameB.length;
        });
      }
      const pagination = {
        page,
        page_size: pageSize,
        total: total2,
        total_pages: totalPages,
        has_prev: page > 1,
        has_next: page < totalPages
      };
      const debugInfo = {
        hasHeadersConfig: displayConfig.hasHeaders,
        channelWhereClause,
        groupsWhereClause: whereClause,
        channelParamsCount: channelParams.length,
        groupsParamsCount: params.length,
        channelsCount: channels.length,
        groupsCount: groups.length
      };
      console.log("[PublicChannels] \u8C03\u8BD5\u4FE1\u606F:", JSON.stringify(debugInfo));
      return new Response(JSON.stringify({
        success: true,
        channels,
        groups,
        pagination,
        debug: debugInfo
        // 添加调试信息
      }), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      });
    }
  } catch (error) {
    console.error("[PublicChannels] \u83B7\u53D6\u516C\u5F00\u9891\u9053\u5217\u8868\u5931\u8D25:", error);
    console.error("[PublicChannels] \u9519\u8BEF\u5806\u6808:", error.stack);
    console.error("[PublicChannels] \u9519\u8BEF\u8BE6\u7EC6\u4FE1\u606F:", JSON.stringify({
      message: error.message,
      name: error.name,
      cause: error.cause
    }));
    return new Response(JSON.stringify({
      success: false,
      error: "\u83B7\u53D6\u9891\u9053\u5217\u8868\u5931\u8D25: " + error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(handlePublicChannels, "handlePublicChannels");
async function handlePublicPlay(request, env, ctx) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/");
  const hash = pathParts[3];
  if (!hash) {
    return new Response("Missing channel hash", { status: 400 });
  }
  try {
    const db = getDB();
    const systemConfig = await getSystemConfig();
    const tokenParam = url.searchParams.get("token");
    if (systemConfig.enable_play_token) {
      if (!tokenParam) {
        return new Response(JSON.stringify({
          success: false,
          error: "Token required",
          requireToken: true
        }), {
          status: 403,
          headers: { "Content-Type": "application/json" }
        });
      }
      const isValid = await verifyPlayToken(tokenParam, env.SECRET_KEY || "default-secret-key", env, request, db);
      if (!isValid) {
        return new Response(JSON.stringify({
          success: false,
          error: "Invalid or expired token"
        }), {
          status: 403,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    if (systemConfig.enable_ref_check) {
      const referer = request.headers.get("Referer");
      if (!verifyReferer(referer, systemConfig.ref_whitelist)) {
        return new Response(JSON.stringify({
          success: false,
          error: "Invalid referer"
        }), {
          status: 403,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    const channel = await getChannelByHash(env, hash);
    if (!channel || !channel.is_active) {
      return new Response("Channel not found", { status: 404 });
    }
    if (channel.source_active === 0) {
      return new Response("Channel source is inactive", { status: 404 });
    }
    let headersObj = {};
    if (channel.headers) {
      try {
        headersObj = JSON.parse(channel.headers);
      } catch (e) {
        console.error("Failed to parse headers:", e);
      }
    }
    const enableEncryption = systemConfig.enable_url_encryption && systemConfig.url_encryption_key;
    if (enableEncryption) {
      const encryptionKey = systemConfig.url_encryption_key;
      const encryptedUrl = await encryptWithAES(channel.play_url, encryptionKey);
      return new Response(JSON.stringify({
        success: true,
        play_url: encryptedUrl,
        // AES-GCM 加密的数据
        headers: headersObj,
        channel_name: channel.channel_name,
        encoded: true,
        // 标识数据已加密
        encryption: "aes-gcm"
        // 标识加密方式
      }), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"
        }
      });
    } else {
      return new Response(JSON.stringify({
        success: true,
        play_url: channel.play_url,
        // 原始URL
        headers: headersObj,
        channel_name: channel.channel_name,
        encoded: false,
        // 标识数据未加密
        encryption: "none"
        // 标识未加密
      }), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"
        }
      });
    }
  } catch (error) {
    console.error("\u83B7\u53D6\u64AD\u653E\u5730\u5740\u5931\u8D25:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
__name(handlePublicPlay, "handlePublicPlay");
async function handleGetPlayToken(request, env, ctx) {
  const url = new URL(request.url);
  const hash = url.searchParams.get("hash");
  if (!hash) {
    return new Response("Missing channel hash", { status: 400 });
  }
  try {
    const db = getDB();
    const systemConfig = await getSystemConfig();
    if (systemConfig.enable_ref_check) {
      const referer = request.headers.get("Referer");
      if (!verifyReferer(referer, systemConfig.ref_whitelist)) {
        return new Response(JSON.stringify({
          success: false,
          error: "Invalid referer"
        }), {
          status: 403,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    const channel = await db.prepare(`
      SELECT channel_name
      FROM channels
      WHERE channel_hash = ? AND is_active = 1
    `).bind(hash).first();
    if (!channel) {
      return new Response("Channel not found", { status: 404 });
    }
    const clientIp = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For")?.split(",")[0] || "unknown";
    const token = await generatePlayToken(hash, clientIp, env.SECRET_KEY || "default-secret-key");
    return new Response(JSON.stringify({
      success: true,
      token,
      expire_seconds: systemConfig.play_token_expire_seconds
    }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (error) {
    console.error("\u751F\u6210token\u5931\u8D25:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
__name(handleGetPlayToken, "handleGetPlayToken");
async function handlePublicConfig(request, env, ctx) {
  try {
    const systemConfig = await getSystemConfig();
    const publicConfig = {
      enable_play_token: systemConfig.enable_play_token,
      enable_url_encryption: systemConfig.enable_url_encryption,
      url_encryption_key: systemConfig.url_encryption_key || ""
    };
    return new Response(JSON.stringify({
      success: true,
      config: publicConfig
    }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"
      }
    });
  } catch (error) {
    console.error("\u83B7\u53D6\u516C\u5F00\u914D\u7F6E\u5931\u8D25:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
__name(handlePublicConfig, "handlePublicConfig");

// admin-page.js
init_checked_fetch();
init_modules_watch_stub();
var ADMIN_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\u76F4\u64AD\u670D\u52A1\u7BA1\u7406\u540E\u53F0</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#f5f5f7;color:#1d1d1f}
    .login-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000}
    .login-box{background:white;padding:40px;border-radius:12px;width:100%;max-width:400px;box-shadow:0 20px 60px rgba(0,0,0,.3)}
    .login-box h2{margin-bottom:24px;text-align:center;color:#1d1d1f}
    .login-box input{width:100%;padding:12px 16px;border:1px solid #d2d2d7;border-radius:8px;font-size:16px;margin-bottom:16px}
    .login-box button{width:100%;padding:12px;background:#0071e3;color:white;border:none;border-radius:8px;font-size:16px;cursor:pointer;transition:background .2s}
    .login-box button:hover{background:#0077ed}
    .login-error{color:#ff3b30;text-align:center;margin-bottom:12px;font-size:14px}
    .container{max-width:1400px;margin:0 auto;padding:20px}
    .header{background:white;padding:20px 30px;border-radius:12px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 2px 8px rgba(0,0,0,.04)}
    .header h1{font-size:24px;font-weight:600}
    .logout-btn{padding:8px 16px;background:#f5f5f7;border:1px solid #d2d2d7;border-radius:6px;cursor:pointer;font-size:14px}
    .logout-btn:hover{background:#e8e8ed}
    .nav-tabs{display:flex;gap:8px;margin-bottom:20px}
    .nav-tab{padding:10px 20px;background:white;border:1px solid #d2d2d7;border-radius:8px;cursor:pointer;font-size:14px;transition:all .2s}
    .nav-tab:hover{background:#f5f5f7}
    .nav-tab.active{background:#0071e3;color:white;border-color:#0071e3}
    .tab-content{display:none}
    .tab-content.active{display:block}
    .card{background:white;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,.04);margin-bottom:20px}
    .card h3{margin-bottom:16px;font-size:18px;font-weight:600}
    .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}
    .stat-item{padding:20px;background:#f5f5f7;border-radius:8px;text-align:center}
    .stat-value{font-size:32px;font-weight:600;color:#0071e3}
    .stat-label{margin-top:8px;color:#86868b;font-size:14px}
    .toolbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
    .btn{padding:8px 16px;border-radius:6px;border:none;cursor:pointer;font-size:14px;transition:all .2s}
    .btn-primary{background:#0071e3;color:white}
    .btn-primary:hover{background:#0077ed}
    .btn-danger{background:#ff3b30;color:white}
    .btn-danger:hover{background:#ff453a}
    .btn-success{background:#34c759;color:white}
    .btn-success:hover{background:#30d158}
    .btn-sm{padding:4px 8px;font-size:12px}
    table{width:100%;border-collapse:collapse}
    th,td{padding:12px;text-align:left;border-bottom:1px solid #f5f5f7}
    th{background:#f5f5f7;font-weight:600;font-size:13px;color:#86868b;text-transform:uppercase}
    tr:hover{background:#f9f9fb}
    .badge{padding:2px 8px;border-radius:10px;font-size:11px;font-weight:500}
    .badge-success{background:#e8f5e9;color:#2e7d32}
    .badge-warning{background:#fff3e0;color:#e65100}
    .badge-danger{background:#ffebee;color:#c62828}
    .modal{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);align-items:center;justify-content:center;z-index:100}
    .modal.active{display:flex}
    .modal-content{background:white;padding:24px;border-radius:12px;width:100%;max-width:500px;max-height:80vh;overflow-y:auto}
    .modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
    .modal-header h3{margin:0}
    .close-btn{background:none;border:none;font-size:24px;cursor:pointer;color:#86868b}
    .form-group{margin-bottom:16px}
    .form-group label{display:block;margin-bottom:6px;font-weight:500;font-size:14px}
    .form-group input,.form-group select,.form-group textarea{width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;font-size:14px}
    .form-group textarea{min-height:80px;resize:vertical}
    .form-row{display:flex;gap:16px}
    .form-row .form-group{flex:1}
    .modal-footer{display:flex;justify-content:flex-end;gap:8px;margin-top:24px}
    .search-box{padding:8px 12px;border:1px solid #d2d2d7;border-radius:6px;font-size:14px;width:200px}
    .filter-select{padding:8px 12px;border:1px solid #d2d2d7;border-radius:6px;font-size:14px}
    .empty-state{text-align:center;padding:40px;color:#86868b}
    .action-buttons{display:flex;gap:4px}
    .toast{position:fixed;bottom:20px;right:20px;padding:12px 20px;border-radius:8px;color:white;font-size:14px;z-index:1000;animation:slideIn .3s ease}
    .toast.success{background:#34c759}
    .toast.error{background:#ff3b30}
    .toast.info{background:#0071e3}
    @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
    .loading-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(255,255,255,.8);display:none;align-items:center;justify-content:center;z-index:2000}
    .loading-overlay.active{display:flex}
    .loading-spinner{width:40px;height:40px;border:3px solid #e5e5ea;border-top-color:#0071e3;border-radius:50%;animation:spin 1s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    .loading-text{margin-top:16px;color:#86868b;font-size:14px}
    .sync-indicator{position:fixed;top:80px;right:20px;padding:12px 16px;background:#fff3e0;border:1px solid #ff9800;border-radius:8px;z-index:1500;display:none;align-items:center;gap:8px;box-shadow:0 2px 8px rgba(0,0,0,.1)}
    .sync-indicator.active{display:flex}
    .sync-spinner{width:16px;height:16px;border:2px solid #ffe0b2;border-top-color:#ff9800;border-radius:50%;animation:spin 1s linear infinite}
    .code-display{font-family:'Courier New',monospace;background:#f5f5f7;padding:8px;border-radius:4px;font-size:13px}
    .generated-codes{background:#f5f5f7;padding:16px;border-radius:8px;margin-top:16px}
    .generated-codes h4{margin-bottom:12px}
    .generated-codes-item{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #e5e5ea}
    .generated-codes-item:last-child{border-bottom:none}
    .pagination{display:flex;justify-content:center;align-items:center;gap:8px;margin-top:20px}
    .pagination button{padding:6px 12px;border:1px solid #d2d2d7;background:white;border-radius:6px;cursor:pointer;font-size:14px}
    .pagination button:hover:not(:disabled){background:#f5f5f7}
    .pagination button:disabled{color:#86868b;cursor:not-allowed}
    .pagination button.active{background:#0071e3;color:white;border-color:#0071e3}
    .pagination-info{color:#86868b;font-size:14px;margin-right:12px}
    .hidden{display:none!important}
    .play-url-cell{max-width:300px;padding:8px}
    .play-url{display:inline-block;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#0071e3;font-size:12px}
    .btn-copy{padding:2px 8px;font-size:11px;margin-left:6px;background:#f5f5f7}
    .btn-copy:hover{background:#e8e8ed}
    .headers-cell{max-width:200px;padding:8px;font-size:11px;color:#86868b}
    .headers-tag{display:inline-block;padding:2px 6px;background:#f5f5f7;border-radius:4px;margin:2px;font-size:10px}
  </style>
</head>
<body>
  <div id="loginOverlay" class="login-overlay hidden">
    <div class="login-box">
      <h2>\u7BA1\u7406\u540E\u53F0\u767B\u5F55</h2>
      <div id="loginError" class="login-error" style="display:none;"></div>
      <input type="password" id="adminKey" placeholder="\u8BF7\u8F93\u5165\u7BA1\u7406\u5458\u5BC6\u94A5">
      <button onclick="login()">\u767B\u5F55</button>
    </div>
  </div>
  <div class="container" id="mainContent" style="display:none;">
    <div class="header">
      <h1>\u76F4\u64AD\u670D\u52A1\u7BA1\u7406\u540E\u53F0</h1>
      <button class="logout-btn" onclick="logout()">\u9000\u51FA\u767B\u5F55</button>
    </div>
    <div class="nav-tabs">
      <button class="nav-tab active" onclick="showTab('sources')">\u76F4\u64AD\u6E90\u7BA1\u7406</button>
      <button class="nav-tab" onclick="showTab('channels')">\u9891\u9053\u7BA1\u7406</button>
      <button class="nav-tab" onclick="showTab('codes')">\u5361\u5BC6\u7BA1\u7406</button>
      <button class="nav-tab" onclick="showTab('security')">\u5B89\u5168\u76D1\u63A7</button>
      <button class="nav-tab" onclick="showTab('ip-blacklist')">IP\u9ED1\u540D\u5355</button>
      <button class="nav-tab" onclick="showTab('homepage-display')">\u9996\u9875\u5C55\u793A</button>
      <button class="nav-tab" onclick="showTab('system-settings')">\u7CFB\u7EDF\u8BBE\u7F6E</button>
    </div>
    <div id="sources" class="tab-content active">
      <div class="card">
        <div class="toolbar">
          <h3>\u76F4\u64AD\u6E90\u5217\u8868</h3>
          <div style="display:flex;gap:16px;">
            <button class="btn btn-success" onclick="syncAllSources()">\u540C\u6B65\u5168\u90E8</button>
            <button class="btn btn-primary" onclick="showSourceModal()">\u6DFB\u52A0\u6E90</button>
            <button class="btn" onclick="toggleSyncFilter()">\u540C\u6B65\u8FC7\u6EE4</button>
          </div>
        </div>
        <div id="syncFilterPanel" class="card" style="display:none;padding:16px;background:#f9f9fb;">
          <h4 style="margin-bottom:12px;font-weight:600;">\u540C\u6B65\u8FC7\u6EE4\u89C4\u5219</h4>
          <p style="margin-bottom:16px;color:#86868b;font-size:14px;">\u5728\u540C\u6B65\u6E90\u65F6\uFF0C\u53EF\u4EE5\u6839\u636E\u5206\u7EC4\u540D\u3001\u64AD\u653E\u5730\u5740\u6216\u9891\u9053\u540D\u6392\u9664\u4E0D\u9700\u8981\u7684\u9891\u9053\uFF0C\u4E5F\u53EF\u4EE5\u91CD\u547D\u540D\u5206\u7EC4\u540D\u3002\u7559\u7A7A\u5219\u4E0D\u8FC7\u6EE4\u3002</p>
          <div class="form-row">
            <div class="form-group">
              <label>\u6392\u9664\u5206\u7EC4\u540D\uFF08\u5305\u542B\u4EE5\u4E0B\u5173\u952E\u5B57\u7684\u5206\u7EC4\u5C06\u4E0D\u88AB\u540C\u6B65\uFF09</label>
              <textarea id="syncExcludeGroups" rows="3" placeholder="\u4F8B\u5982\uFF1A\u7535\u5F71, \u7535\u89C6\u5267, \u4F53\u80B2&#10;\u6216\u8005\u6BCF\u884C\u4E00\u4E2A\uFF1A&#10;\u7535\u5F71&#10;\u7535\u89C6\u5267&#10;\u4F53\u80B2" style="font-family:monospace;font-size:13px;"></textarea>
            </div>
            <div class="form-group">
              <label>\u6392\u9664\u64AD\u653E\u5730\u5740\uFF08\u5305\u542B\u4EE5\u4E0B\u5173\u952E\u5B57\u7684URL\u5C06\u4E0D\u88AB\u540C\u6B65\uFF09</label>
              <textarea id="syncExcludeUrls" rows="3" placeholder="\u4F8B\u5982\uFF1Aexample.com, test.com, ads" style="font-family:monospace;font-size:13px;"></textarea>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>\u6392\u9664\u9891\u9053\u540D\uFF08\u5305\u542B\u4EE5\u4E0B\u5173\u952E\u5B57\u7684\u9891\u9053\u5C06\u4E0D\u88AB\u540C\u6B65\uFF09</label>
              <textarea id="syncExcludeNames" rows="3" placeholder="\u4F8B\u5982\uFF1A\u6D4B\u8BD5, \u9884\u544A, \u5E7F\u544A" style="font-family:monospace;font-size:13px;"></textarea>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>
                <input type="checkbox" id="excludeDuplicateUrls" style="margin-right:8px;">
                \u8FC7\u6EE4\u91CD\u590D\u64AD\u653E\u5730\u5740\uFF08\u53EA\u4FDD\u7559\u6BCF\u4E2A\u64AD\u653E\u5730\u5740\u7684\u7B2C\u4E00\u4E2A\u9891\u9053\uFF09
              </label>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>\u5206\u7EC4\u91CD\u547D\u540D\u89C4\u5219\uFF08\u6839\u636E\u5173\u952E\u5B57\u91CD\u547D\u540D\u5206\u7EC4\uFF09</label>
              <textarea id="groupRenameRules" rows="4" placeholder="\u683C\u5F0F\uFF1A\u5173\u952E\u5B57->\u65B0\u5206\u7EC4\u540D&#10;\u4F8B\u5982\uFF1A&#10;\u592E\u89C6->\u4E2D\u592E\u7535\u89C6\u53F0&#10;CCTV->\u592E\u89C6\u9891\u9053&#10;\u4F53\u80B2->\u4F53\u80B2\u8D5B\u4E8B&#10;\u7535\u5F71->\u5F71\u89C6\u5A31\u4E50&#10;\u6BCF\u884C\u4E00\u4E2A\u89C4\u5219\uFF0C\u652F\u6301'\u5305\u542B'\u5339\u914D" style="font-family:monospace;font-size:13px;"></textarea>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>\u6392\u9664\u5206\u7EC4\u91CD\u547D\u540D\uFF08\u4EE5\u4E0B\u5206\u7EC4\u4E0D\u91CD\u547D\u540D\uFF09</label>
              <textarea id="groupRenameExclude" rows="2" placeholder="\u4F8B\u5982\uFF1A\u592E\u89C6, CCTV, \u4F53\u80B2&#10;\u6216\u8005\u6BCF\u884C\u4E00\u4E2A\uFF1A&#10;\u592E\u89C6&#10;CCTV&#10;\u4F53\u80B2" style="font-family:monospace;font-size:13px;"></textarea>
            </div>
          </div>
          <div style="display:flex;gap:8px;margin-top:8px;">
            <button class="btn btn-primary" onclick="saveSyncFilters()">\u4FDD\u5B58\u89C4\u5219</button>
            <button class="btn" onclick="clearSyncFilters()">\u6E05\u7A7A\u89C4\u5219</button>
            <button class="btn" onclick="toggleSyncFilter()">\u6536\u8D77</button>
          </div>
        </div>
        <table><thead><tr><th>ID</th><th>\u540D\u79F0</th><th>\u7C7B\u578B</th><th>\u89E3\u6790\u6A21\u5F0F</th><th>\u72B6\u6001</th><th>\u9891\u9053\u6570</th><th>\u6700\u540E\u66F4\u65B0</th><th>\u64CD\u4F5C</th></tr></thead><tbody id="sourcesTable"></tbody></table>
      </div>
    </div>
    <div id="channels" class="tab-content">
      <div class="card">
        <div class="toolbar"><h3>\u9891\u9053\u5217\u8868</h3><div><select class="filter-select" id="channelSourceFilter" onchange="onSourceFilterChange()"><option value="">\u5168\u90E8\u6E90</option></select><select class="filter-select" id="channelGroupFilter" onchange="resetChannelPage()"><option value="">\u5168\u90E8\u5206\u7EC4</option></select><input type="text" class="search-box" id="channelSearch" placeholder="\u641C\u7D22\u9891\u9053..." oninput="resetChannelPage()"><select class="filter-select" id="channelPageSize" onchange="resetChannelPage()"><option value="10">10\u6761/\u9875</option><option value="20">20\u6761/\u9875</option><option value="30" selected>30\u6761/\u9875</option><option value="50">50\u6761/\u9875</option><option value="100">100\u6761/\u9875</option></select><button class="btn btn-danger" onclick="clearChannels()">\u6E05\u7A7A\u6570\u636E</button></div></div>
        <table><thead><tr><th>\u9891\u9053\u540D\u79F0</th><th>\u5206\u7EC4</th><th>\u76F4\u64AD\u6E90</th><th>\u64AD\u653E\u5730\u5740</th><th>\u8BF7\u6C42\u5934</th><th>\u72B6\u6001</th><th>\u64CD\u4F5C</th></tr></thead><tbody id="channelsTable"></tbody></table>
        <div id="channelPagination" class="pagination"></div>
      </div>
    </div>
    <div id="codes" class="tab-content">
      <div class="card">
        <div class="toolbar">
          <h3>\u5361\u5BC6\u5217\u8868</h3>
          <div>
            <button class="btn btn-success" onclick="toggleAdvancedFilter()">\u9AD8\u7EA7\u67E5\u8BE2</button>
            <button class="btn btn-primary" onclick="exportCodesCSV()">\u5BFC\u51FACSV</button>
            <button class="btn btn-primary" onclick="showImportCodeModal()">\u6279\u91CF\u5BFC\u5165</button>
            <button class="btn btn-primary" onclick="showGenerateCodeModal()">\u751F\u6210\u5361\u5BC6</button>
            <button class="btn btn-danger" onclick="clearCodes()">\u6E05\u7A7A\u6570\u636E</button>
          </div>
        </div>
        <div id="advancedFilterPanel" class="card" style="display:none;margin-bottom:16px;padding:16px;background:#f9f9fb;">
          <div class="form-row" style="margin-bottom:12px;">
            <div class="form-group"><label>\u72B6\u6001</label><select class="filter-select" id="codeStatusFilter" onchange="resetCodePage()"><option value="">\u5168\u90E8</option><option value="unused">\u672A\u4F7F\u7528</option><option value="active">\u6D3B\u8DC3</option><option value="disabled">\u7981\u7528</option></select></div>
            <div class="form-group"><label>\u6709\u6548\u671F(\u5929)</label><div style="display:flex;gap:8px;"><input type="number" id="durationMin" placeholder="\u6700\u5C0F" class="search-box" style="width:80px;"><span>-</span><input type="number" id="durationMax" placeholder="\u6700\u5927" class="search-box" style="width:80px;"></div></div>
            <div class="form-group"><label>\u8FC7\u671F\u65F6\u95F4</label><div style="display:flex;gap:8px;"><input type="date" id="expiredFrom" class="search-box"><span>-</span><input type="date" id="expiredTo" class="search-box"></div></div>
          </div>
          <div class="form-row" style="margin-bottom:12px;">
            <div class="form-group"><label>\u6FC0\u6D3B\u65F6\u95F4</label><div style="display:flex;gap:8px;"><input type="date" id="activatedFrom" class="search-box"><span>-</span><input type="date" id="activatedTo" class="search-box"></div></div>
            <div class="form-group"><label>\u5907\u6CE8</label><input type="text" id="remarkFilter" placeholder="\u5907\u6CE8\u5173\u952E\u8BCD" class="search-box" style="width:200px;"></div>
            <div class="form-group"><label>\u6BCF\u9875\u6761\u6570</label><select class="filter-select" id="codePageSize" onchange="resetCodePage()"><option value="10">10\u6761/\u9875</option><option value="20">20\u6761/\u9875</option><option value="30" selected>30\u6761/\u9875</option><option value="50">50\u6761/\u9875</option><option value="100">100\u6761/\u9875</option></select></div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" onclick="resetCodePage()">\u67E5\u8BE2</button>
            <button class="btn" onclick="clearCodeFilters()">\u91CD\u7F6E</button>
          </div>
        </div>
        <table><thead><tr><th>\u5361\u5BC6</th><th>\u72B6\u6001</th><th>\u6709\u6548\u671F(\u5929)</th><th>\u6700\u5927IP\u6570</th><th>\u6FC0\u6D3B\u65F6\u95F4</th><th>\u8FC7\u671F\u65F6\u95F4</th><th>\u5907\u6CE8</th><th>\u64CD\u4F5C</th></tr></thead><tbody id="codesTable"></tbody></table>
        <div id="codePagination" class="pagination"></div>
      </div>
    </div>
    <div id="security" class="tab-content">
      <div class="card">
        <div class="toolbar"><h3>\u5B89\u5168\u914D\u7F6E</h3><button class="btn btn-primary" onclick="loadSecurityConfig()">\u5237\u65B0\u914D\u7F6E</button></div>
        <div id="securityConfigForm" style="display:none;padding:16px;background:#f9f9fb;border-radius:8px;">
          <div class="form-row" style="margin-bottom:16px;">
            <div class="form-group">
              <label>\u6BCF\u65E5\u64AD\u653E\u6B21\u6570\u9650\u5236\uFF08\u6BCF\u4E2A\u9891\u9053\uFF09</label>
              <input type="number" id="channelDailyLimit" min="1" max="1000" value="100">
              <small style="color:#86868b;font-size:12px;">\u6BCF\u4E2A\u9891\u9053\u6BCF\u5929\u6700\u591A\u64AD\u653E\u6B21\u6570</small>
            </div>
            <div class="form-group">
              <label>\u81EA\u52A8\u5C01\u7981\u65F6\u957F\uFF08\u5929\uFF09</label>
              <input type="number" id="banDurationDays" min="0" max="365" value="7">
              <small style="color:#86868b;font-size:12px;">0\u8868\u793A\u6C38\u4E45\u5C01\u7981</small>
            </div>
          </div>
          <div class="form-group" style="margin-bottom:16px;">
            <label style="display:flex;align-items:center;gap:8px;">
              <input type="checkbox" id="autoBanOnExceed" checked style="width:auto;">
              <span>\u8D85\u51FA\u9650\u5236\u81EA\u52A8\u5C01\u7981</span>
            </label>
            <small style="color:#86868b;font-size:12px;">\u52FE\u9009\u540E\uFF0C\u9891\u9053\u64AD\u653E\u6B21\u6570\u8D85\u9650\u4F1A\u81EA\u52A8\u5C01\u7981\u5361\u5BC6</small>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" onclick="saveSecurityConfig()">\u4FDD\u5B58\u914D\u7F6E</button>
            <button class="btn" onclick="resetSecurityConfig()">\u91CD\u7F6E\u4E3A\u9ED8\u8BA4</button>
          </div>
        </div>
        <div id="noSecurityConfig" class="empty-state">\u70B9\u51FB"\u5237\u65B0\u914D\u7F6E"\u6309\u94AE\u52A0\u8F7D\u5F53\u524D\u914D\u7F6E</div>
      </div>
      <div class="card">
        <div class="toolbar"><h3>\u5361\u5BC6\u989D\u5EA6\u7BA1\u7406</h3><div><input type="text" id="quotaCode" placeholder="\u8F93\u5165\u5361\u5BC6" class="search-box"><button class="btn btn-primary" onclick="loadQuotaInfo()">\u67E5\u8BE2\u989D\u5EA6</button><button class="btn btn-success" onclick="unbanCode()">\u89E3\u5C01\u5361\u5BC6</button></div></div>
        <div id="quotaInfo" style="display:none;">
          <div class="stats-grid">
            <div class="stat-item"><div class="stat-value" id="quotaTotalPlays">0</div><div class="stat-label">\u4ECA\u65E5\u64AD\u653E\u6B21\u6570</div></div>
            <div class="stat-item"><div class="stat-value" id="quotaExceededCount">0</div><div class="stat-label">\u8D85\u9650\u9891\u9053\u6570</div></div>
            <div class="stat-item" id="quotaBanStatus"><div class="stat-value" style="color:#34c759;">\u6B63\u5E38</div><div class="stat-label">\u72B6\u6001</div></div>
            <div class="stat-item"><div class="stat-value" id="quotaBanTime">-</div><div class="stat-label">\u5C01\u7981\u65F6\u95F4</div></div>
          </div>
          <div id="banAlert" style="margin-top:20px;display:none;padding:16px;background:#ffebee;border-left:4px solid #ff3b30;border-radius:4px;">
            <h4 style="margin-bottom:12px;color:#d32f2f;">\u26A0\uFE0F \u5361\u5BC6\u5DF2\u88AB\u5C01\u7981</h4>
            <p style="margin-bottom:8px;"><strong>\u539F\u56E0\uFF1A</strong>\u8BE5\u5361\u5BC6\u4ECA\u65E5\u6709\u9891\u9053\u8D85\u51FA\u64AD\u653E\u989D\u5EA6\uFF08<span id="banLimitText">100</span>\u6B21/\u5929\uFF09</p>
            <p style="margin-bottom:8px;"><strong>\u5C01\u7981\u65F6\u957F\uFF1A</strong><span id="banDurationText">-</span></p>
            <p style="margin-bottom:8px;"><strong>\u5C01\u7981\u5230\u671F\uFF1A</strong><span id="banUntilText">-</span></p>
            <p><strong>\u5F71\u54CD\uFF1A</strong>\u65E0\u6CD5\u4F7F\u7528\u8BA2\u9605\u548C\u64AD\u653E\u529F\u80FD</p>
            <p style="margin-top:8px;"><strong>\u89E3\u51B3\u65B9\u6CD5\uFF1A</strong></p>
            <ul style="margin-left:20px;">
              <li>\u5982\u679C\u662F\u8BEF\u5C01\uFF0C\u70B9\u51FB"\u89E3\u5C01\u5361\u5BC6"\u6309\u94AE\u624B\u52A8\u89E3\u5C01</li>
              <li>\u7B49\u5F85\u5C01\u7981\u65F6\u95F4\u81EA\u52A8\u89E3\u9664</li>
              <li>\u8054\u7CFB\u7BA1\u7406\u5458\u83B7\u53D6\u65B0\u5361\u5BC6</li>
            </ul>
          </div>
          <div id="channelPlaysSection" style="margin-top:20px;display:none;">
            <h4 style="margin-bottom:12px;">\u9891\u9053\u64AD\u653E\u8BE6\u60C5</h4>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr>
                  <th>\u9891\u9053\u540D\u79F0</th>
                  <th>\u64AD\u653E\u6B21\u6570</th>
                  <th>\u72B6\u6001</th>
                </tr>
              </thead>
              <tbody id="channelPlaysTable">
              </tbody>
            </table>
          </div>
        </div>
        <div id="noQuotaData" class="empty-state">\u8BF7\u8F93\u5165\u5361\u5BC6\u67E5\u770B\u989D\u5EA6\u4F7F\u7528\u60C5\u51B5</div>
      </div>
      <div class="card" style="margin-top:20px;">
        <div class="toolbar">
          <h3>\u5361\u5BC6\u5C01\u7981\u5217\u8868</h3>
          <button class="btn btn-primary" onclick="loadBannedCodes()">\u5237\u65B0\u5217\u8868</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>\u5361\u5BC6</th>
              <th>\u72B6\u6001</th>
              <th>\u6709\u6548\u671F(\u5929)</th>
              <th>\u6FC0\u6D3B\u65F6\u95F4</th>
              <th>\u8FC7\u671F\u65F6\u95F4</th>
              <th>\u5C01\u7981\u5230\u671F</th>
              <th>\u5907\u6CE8</th>
              <th>\u64CD\u4F5C</th>
            </tr>
          </thead>
          <tbody id="bannedCodesTable"></tbody>
        </table>
        <div id="noBannedCodes" class="empty-state">\u6682\u65E0\u5C01\u7981\u5361\u5BC6</div>
      </div>
      <div class="card" style="margin-top:20px;">
        <h3>\u989D\u5EA6\u8BF4\u660E</h3>
        <div style="line-height:1.8;color:#86868b;font-size:14px;">
          <p><strong>\u{1F4CA} \u989D\u5EA6\u89C4\u5219[\u9650\u5236\u7528\u6237\u5206\u4EAB\u6216\u4E8C\u6B21\u4EE3\u7406]\uFF1A</strong></p>
          <ul style="margin-left:20px;margin-bottom:16px;">
            <li>\u6BCF\u4E2A\u9891\u9053\u6BCF\u5929\u64AD\u653E\u6B21\u6570\u9650\u5236\u53EF\u5728\u4E0A\u65B9\u914D\u7F6E\u4E2D\u8BBE\u7F6E</li>
            <li>\u8D85\u8FC7\u989D\u5EA6\u4F1A\u6839\u636E\u914D\u7F6E\u81EA\u52A8\u5C01\u7981\u5361\u5BC6\uFF08\u53EF\u8BBE\u7F6E\u5C01\u7981\u65F6\u957F\uFF09</li>
            <li>\u6BCF\u5929\u51CC\u66680\u70B9\u81EA\u52A8\u91CD\u7F6E\u989D\u5EA6</li>
            <li>\u6240\u6709\u9891\u9053\u72EC\u7ACB\u8BA1\u7B97\u989D\u5EA6</li>
          </ul>
          <p><strong>\u2705 \u6B63\u5E38\u4F7F\u7528\uFF1A</strong></p>
          <p>\u6BCF\u5929\u770B10\u4E2A\u9891\u9053\uFF0C\u6BCF\u4E2A\u9891\u9053\u64AD\u653E10\u6B21\uFF0C\u8FDC\u4F4E\u4E8E\u9650\u5236</p>
          <p style="margin-bottom:16px;">\u6B63\u5E38\u89C2\u770B\u5B8C\u5168\u591F\u7528\uFF0C\u4E0D\u4F1A\u89E6\u53D1\u5C01\u7981</p>
          <p><strong>\u274C \u5F02\u5E38\u884C\u4E3A\uFF1A</strong></p>
          <p>\u4F7F\u7528\u811A\u672C\u6216\u4EE3\u7406\u5237\u64AD\u653E\u5730\u5740\uFF0C\u77ED\u65F6\u95F4\u5185\u5927\u91CF\u64AD\u653E</p>
          <p>\u4F1A\u89E6\u53D1\u81EA\u52A8\u5C01\u7981\u673A\u5236\uFF08\u4E34\u65F6\u6216\u6C38\u4E45\uFF0C\u53D6\u51B3\u4E8E\u914D\u7F6E\uFF09</p>
        </div>
      </div>
    </div>
    <div id="ip-blacklist" class="tab-content">
      <div class="card">
        <div class="toolbar">
          <h3>IP\u9ED1\u540D\u5355\u914D\u7F6E</h3>
          <button class="btn btn-primary" onclick="loadIPBlacklistConfig()">\u5237\u65B0\u914D\u7F6E</button>
        </div>
        <div id="ipBlacklistConfigForm" style="display:none;padding:16px;background:#f9f9fb;border-radius:8px;">
          <h4 style="margin-bottom:16px;">\u8BA2\u9605\u5730\u5740\uFF08/sub\uFF09\u9650\u5236</h4>
          <div class="form-row" style="margin-bottom:16px;">
            <div class="form-group">
              <label>\u6BCF\u5206\u949F\u6700\u5927\u8BF7\u6C42</label>
              <input type="number" id="subRateMin" min="1" value="1">
            </div>
            <div class="form-group">
              <label>\u6BCF\u5C0F\u65F6\u6700\u5927\u8BF7\u6C42</label>
              <input type="number" id="subRateHour" min="1" value="60">
            </div>
            <div class="form-group">
              <label>\u6BCF\u5929\u6700\u5927\u8BF7\u6C42</label>
              <input type="number" id="subRateDay" min="1" value="500">
            </div>
          </div>

          <h4 style="margin-bottom:16px;">\u64AD\u653E\u5730\u5740\uFF08/live\uFF09\u9650\u5236</h4>
          <div class="form-row" style="margin-bottom:16px;">
            <div class="form-group">
              <label>\u6BCF\u5206\u949F\u6700\u5927\u8BF7\u6C42</label>
              <input type="number" id="liveRateMin" min="1" value="5">
            </div>
            <div class="form-group">
              <label>\u6BCF\u5C0F\u65F6\u6700\u5927\u8BF7\u6C42</label>
              <input type="number" id="liveRateHour" min="1" value="300">
            </div>
            <div class="form-group">
              <label>\u6BCF\u5929\u6700\u5927\u8BF7\u6C42</label>
              <input type="number" id="liveRateDay" min="1" value="2000">
            </div>
          </div>

          <h4 style="margin-bottom:16px;">\u7BA1\u7406\u5730\u5740\uFF08/admin\uFF09\u9650\u5236</h4>
          <div class="form-row" style="margin-bottom:16px;">
            <div class="form-group">
              <label>\u6BCF\u5C0F\u65F6\u6700\u5927\u8BF7\u6C42</label>
              <input type="number" id="adminRateHour" min="1" value="10">
            </div>
          </div>

          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" onclick="saveIPBlacklistConfig()">\u4FDD\u5B58\u914D\u7F6E</button>
            <button class="btn" onclick="resetIPBlacklistConfig()">\u91CD\u7F6E\u4E3A\u9ED8\u8BA4</button>
          </div>
        </div>
        <div id="noIPBlacklistConfig" class="empty-state">\u70B9\u51FB"\u5237\u65B0\u914D\u7F6E"\u6309\u94AE\u52A0\u8F7D\u5F53\u524D\u914D\u7F6E</div>
      </div>
      <div class="card">
        <div class="toolbar">
          <h3>IP\u9ED1\u540D\u5355\u7BA1\u7406</h3>
          <button class="btn btn-primary" onclick="loadIPBlacklist()">\u5237\u65B0\u5217\u8868</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>IP\u5730\u5740</th>
              <th>\u5C01\u7981\u65F6\u95F4</th>
              <th>\u5C01\u7981\u539F\u56E0</th>
              <th>\u8BE6\u60C5</th>
              <th>\u64CD\u4F5C</th>
            </tr>
          </thead>
          <tbody id="ipBlacklistTable"></tbody>
        </table>
        <div id="noIPBlacklist" class="empty-state">\u6682\u65E0\u5C01\u7981IP</div>
      </div>
      <div class="card">
        <h3>\u624B\u52A8\u5C01\u7981IP</h3>
        <div class="form-group">
          <label>IP\u5730\u5740</label>
          <input type="text" id="manualBanIP" placeholder="\u8F93\u5165\u8981\u5C01\u7981\u7684IP\u5730\u5740">
        </div>
        <div class="form-group">
          <label>\u5C01\u7981\u539F\u56E0</label>
          <input type="text" id="manualBanReason" placeholder="\u8F93\u5165\u5C01\u7981\u539F\u56E0">
        </div>
        <button class="btn btn-danger" onclick="manualBanIP()">\u5C01\u7981</button>
      </div>
      <div class="card">
        <h3>\u5C01\u7981\u8BF4\u660E</h3>
        <div style="line-height:1.8;color:#86868b;font-size:14px;">
          <p><strong>\u{1F512} \u81EA\u52A8\u5C01\u7981\u89C4\u5219[\u9650\u5236\u653B\u51FB\u8005\u649E\u5E93]\uFF1A</strong></p>
          <ul style="margin-left:20px;margin-bottom:16px;">
            <li>\u8BA2\u9605\u5730\u5740\uFF08/sub\uFF09\uFF1A\u6839\u636E\u914D\u7F6E\u9650\u5236\u8BF7\u6C42\u9891\u7387</li>
            <li>\u64AD\u653E\u5730\u5740\uFF08/live\uFF09\uFF1A\u6839\u636E\u914D\u7F6E\u9650\u5236\u8BF7\u6C42\u9891\u7387</li>
            <li>\u7BA1\u7406\u5730\u5740\uFF08/admin\uFF09\uFF1A\u6839\u636E\u914D\u7F6E\u9650\u5236\u8BF7\u6C42\u9891\u7387</li>
            <li>\u8D85\u51FA\u9650\u5236\u4F1A\u6C38\u4E45\u5C01\u7981\u8BE5IP</li>
          </ul>
          <p><strong>\u26A0\uFE0F \u9632\u649E\u5E93\u4FDD\u62A4\uFF1A</strong></p>
          <p>\u9632\u6B62\u653B\u51FB\u8005\u901A\u8FC7\u5927\u91CF\u5C1D\u8BD5\u8BA2\u9605\u5730\u5740\u6765\u7834\u89E3\u6709\u6548\u5361\u5BC6</p>
          <p style="margin-bottom:16px;">\u8D85\u51FA\u8BBF\u95EE\u9891\u7387\u4F1A\u81EA\u52A8\u5C01\u7981IP\uFF0C\u4FDD\u62A4\u7CFB\u7EDF\u5B89\u5168</p>
          <p><strong>\u2705 \u7BA1\u7406\u5458\u64CD\u4F5C\uFF1A</strong></p>
          <p>\u53EF\u4EE5\u5728\u4E0A\u65B9\u914D\u7F6E\u8C03\u6574\u9650\u5236\u9608\u503C\uFF0C\u624B\u52A8\u5C01\u7981\u53EF\u7591IP\u6216\u89E3\u5C01\u8BEF\u5C01\u7684IP</p>
        </div>
      </div>
    </div>
    <div id="homepage-display" class="tab-content">
      <div class="card">
        <div class="toolbar">
          <h3>\u9996\u9875\u5C55\u793A\u914D\u7F6E</h3>
          <button class="btn btn-primary" onclick="saveHomepageDisplayConfig()">\u4FDD\u5B58\u914D\u7F6E</button>
        </div>
        <div style="padding:20px;background:#f9f9fb;border-radius:8px;margin-bottom:20px;">
          <p style="color:#86868b;margin-bottom:12px;">
            \u914D\u7F6E\u9996\u9875\u5C55\u793A\u54EA\u4E9B\u6570\u636E\u6E90\u3001\u5206\u7C7B\u3001host\u6216\u8BF7\u6C42\u5934\u3002\u7559\u7A7A\u8868\u793A\u5C55\u793A\u5168\u90E8\u6570\u636E\u3002
          </p>
          <div style="background:#fff3e0;border-left:4px solid #ff9800;padding:12px;border-radius:4px;">
            <strong style="color:#e65100;">\u6CE8\u610F\uFF1A</strong>
            <ul style="margin:8px 0 0 20px;color:#666;">
              <li>\u6570\u636E\u6E90\u3001\u5206\u7C7B\u3001host\u3001\u8BF7\u6C42\u5934\u56DB\u4E2A\u6761\u4EF6\u662F"\u6216(OR)"\u5173\u7CFB\uFF0C\u53EA\u8981\u6EE1\u8DB3\u4EFB\u4E00\u6761\u4EF6\u5C31\u4F1A\u5C55\u793A</li>
              <li>\u4F8B\u5982\uFF1A\u9009\u62E9\u4E86\u6570\u636E\u6E901\u548C\u5206\u7C7BA\uFF0C\u90A3\u4E48\u6570\u636E\u6E901\u7684\u6240\u6709\u9891\u9053\u548C\u5206\u7C7BA\u7684\u6240\u6709\u9891\u9053\u90FD\u4F1A\u5C55\u793A</li>
              <li>"\u53EA\u663E\u793A\u6709\u8BF7\u6C42\u5934"\uFF1A\u53EA\u5C55\u793A\u914D\u7F6E\u4E86 User-Agent\u3001Referer \u7B49\u8BF7\u6C42\u5934\u7684\u9891\u9053</li>
              <li>"\u53EA\u663E\u793A\u65E0\u8BF7\u6C42\u5934"\uFF1A\u53EA\u5C55\u793A\u672A\u914D\u7F6E\u8BF7\u6C42\u5934\u7684\u9891\u9053</li>
              <li>\u57DF\u540D\u90E8\u5206\u4F1A\u81EA\u52A8\u663E\u793A\u7CFB\u7EDF\u8BC6\u522B\u7684\u57DF\u540D\uFF0C\u4E5F\u652F\u6301\u624B\u52A8\u8F93\u5165\u57DF\u540D</li>
              <li>\u624B\u52A8\u6DFB\u52A0\u7684\u57DF\u540D\u53EF\u4EE5\u70B9\u51FB"\u5220\u9664"\u6309\u94AE\u79FB\u9664</li>
              <li>\u6E05\u7A7A\u6240\u6709\u9009\u9879\u540E\u4F1A\u5C55\u793A\u6240\u6709\u9891\u9053\u6570\u636E</li>
            </ul>
          </div>
        </div>

        <div style="margin-bottom:24px;">
          <h4 style="margin-bottom:12px;font-weight:600;">\u6570\u636E\u6E90</h4>
          <div id="sourceCheckboxes" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">
            <div style="color:#86868b;">\u52A0\u8F7D\u4E2D...</div>
          </div>
        </div>

        <div style="margin-bottom:24px;">
          <h4 style="margin-bottom:12px;font-weight:600;">\u5206\u7C7B</h4>
          <div id="groupCheckboxes" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">
            <div style="color:#86868b;">\u52A0\u8F7D\u4E2D...</div>
          </div>
        </div>

        <div style="margin-bottom:24px;">
          <h4 style="margin-bottom:12px;font-weight:600;">Host\uFF08\u57DF\u540D\uFF09</h4>
          <div style="margin-bottom:12px;display:flex;gap:8px;">
            <input type="text" id="manualHostInput" placeholder="\u8F93\u5165\u57DF\u540D\uFF0C\u4F8B\u5982\uFF1Aexample.com" style="flex:1;padding:8px 12px;border:1px solid #d2d2d7;border-radius:6px;font-size:14px;">
            <button class="btn btn-primary" onclick="addManualHost()">\u6DFB\u52A0\u57DF\u540D</button>
          </div>
          <div id="hostCheckboxes" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;">
            <div style="color:#86868b;">\u52A0\u8F7D\u4E2D...</div>
          </div>
        </div>

        <div style="margin-bottom:24px;">
          <h4 style="margin-bottom:12px;font-weight:600;">\u662F\u5426\u542B\u6709\u8BF7\u6C42\u5934</h4>
          <div style="display:flex;gap:16px;align-items:center;">
            <label style="display:flex;align-items:center;padding:10px 20px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;">
              <input type="radio" name="hasHeaders" value="null" checked onchange="updateHomepageConfig('hasHeaders', null)" style="margin-right:8px;">
              <span style="font-size:14px;">\u5168\u90E8</span>
            </label>
            <label style="display:flex;align-items:center;padding:10px 20px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;">
              <input type="radio" name="hasHeaders" value="true" onchange="updateHomepageConfig('hasHeaders', true)" style="margin-right:8px;">
              <span style="font-size:14px;">\u53EA\u663E\u793A\u6709\u8BF7\u6C42\u5934</span>
            </label>
            <label style="display:flex;align-items:center;padding:10px 20px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;">
              <input type="radio" name="hasHeaders" value="false" onchange="updateHomepageConfig('hasHeaders', false)" style="margin-right:8px;">
              <span style="font-size:14px;">\u53EA\u663E\u793A\u65E0\u8BF7\u6C42\u5934</span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div id="system-settings" class="tab-content">
      <div class="card">
        <div class="toolbar">
          <h3>\u516C\u544A\u7BA1\u7406</h3>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" onclick="saveAnnouncement()">\u4FDD\u5B58\u516C\u544A</button>
            <button class="btn" onclick="loadAnnouncement()">\u5237\u65B0\u516C\u544A</button>
          </div>
        </div>
        <div style="padding:20px;background:#f9f9fb;border-radius:8px;margin-bottom:20px;">
          <p style="color:#86868b;margin-bottom:12px;">
            \u53D1\u5E03\u7CFB\u7EDF\u516C\u544A\uFF0C\u516C\u544A\u5C06\u663E\u793A\u5728\u9996\u9875\u9876\u90E8\u3002\u652F\u6301\u9009\u62E9\u9884\u8BBE\u6A21\u677F\u5FEB\u901F\u7F16\u8F91\u3002
          </p>

          <div class="form-group" style="margin-bottom:16px;">
            <label>\u516C\u544A\u72B6\u6001</label>
            <label style="display:flex;align-items:center;padding:12px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;">
              <input type="checkbox" id="announcementEnabled" checked style="margin-right:12px;">
              <span style="font-size:14px;">\u542F\u7528\u516C\u544A</span>
            </label>
          </div>

          <div class="form-group" style="margin-bottom:16px;">
            <label>\u5F39\u51FA\u9891\u7387</label>
            <select class="filter-select" id="announcementFrequency" style="width:100%;">
              <option value="once">\u4EC5\u4E00\u6B21\uFF08\u5173\u95ED\u540E\u4E0D\u518D\u663E\u793A\uFF09</option>
              <option value="daily">\u6BCF\u5929\u4E00\u6B21</option>
              <option value="weekly">\u6BCF\u5468\u4E00\u6B21</option>
              <option value="always">\u6BCF\u6B21\u90FD\u663E\u793A</option>
            </select>
            <p style="margin-top:8px;color:#86868b;font-size:12px;">\u9009\u62E9\u516C\u544A\u7684\u663E\u793A\u9891\u7387\u3002\u8BBE\u7F6E\u4E3A"\u4EC5\u4E00\u6B21"\u65F6\uFF0C\u7528\u6237\u5173\u95ED\u540E\u4E0D\u4F1A\u518D\u770B\u5230\u8BE5\u516C\u544A\u3002</p>
          </div>

          <div class="form-group" style="margin-bottom:16px;">
            <label>\u5FEB\u901F\u6A21\u677F</label>
            <select class="filter-select" id="announcementTemplate" onchange="applyAnnouncementTemplate()" style="width:100%;">
              <option value="">-- \u9009\u62E9\u6A21\u677F --</option>
              <option value="update">\u7CFB\u7EDF\u66F4\u65B0\u901A\u77E5</option>
              <option value="maintenance">\u7EF4\u62A4\u901A\u77E5</option>
              <option value="feature">\u65B0\u529F\u80FD\u4E0A\u7EBF</option>
              <option value="notice">\u91CD\u8981\u63D0\u793A</option>
              <option value="custom">\u81EA\u5B9A\u4E49\u5185\u5BB9</option>
            </select>
          </div>

          <div class="form-group">
            <label>\u516C\u544A\u6807\u9898</label>
            <input type="text" id="announcementTitleInput" placeholder="\u8F93\u5165\u516C\u544A\u6807\u9898" style="width:100%;">
          </div>

          <div class="form-group">
            <label>\u516C\u544A\u5185\u5BB9\uFF08\u652F\u6301HTML\uFF09</label>
            <textarea id="announcementContentInput" rows="6" placeholder="\u8F93\u5165\u516C\u544A\u5185\u5BB9" style="font-family:monospace;font-size:13px;"></textarea>
            <p style="margin-top:8px;color:#86868b;font-size:12px;">\u652F\u6301HTML\u6807\u7B7E\uFF0C\u5982 &lt;p&gt;\u3001&lt;br&gt;\u3001&lt;strong&gt; \u7B49</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="toolbar">
          <h3>\u7F13\u5B58\u7BA1\u7406</h3>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" onclick="refreshCache()">\u5237\u65B0\u7F13\u5B58</button>
            <button class="btn btn-danger" onclick="clearCache()">\u6E05\u7A7A\u7F13\u5B58</button>
            <button class="btn" onclick="loadCacheStatus()">\u5237\u65B0\u72B6\u6001</button>
          </div>
        </div>
        <div style="padding:20px;background:#f9f9fb;border-radius:8px;margin-bottom:20px;">
          <p style="color:#86868b;margin-bottom:12px;">
            \u9891\u9053\u6570\u636E\u4F1A\u81EA\u52A8\u7F13\u5B58\u5230 KV \u5B58\u50A8\u4E2D\uFF0C\u63D0\u9AD8\u9996\u9875\u52A0\u8F7D\u901F\u5EA6\u548C\u51CF\u5C11\u6570\u636E\u5E93\u67E5\u8BE2\u3002\u7F13\u5B58\u4F1A\u5728\u6E90\u6570\u636E\u540C\u6B65\u540E\u81EA\u52A8\u66F4\u65B0\uFF0C\u4E5F\u53EF\u4EE5\u624B\u52A8\u5237\u65B0\u3002
          </p>
          <div id="cacheStatusInfo" style="padding:12px;background:white;border:1px solid #d2d2d7;border-radius:6px;font-size:14px;">
            <div style="color:#86868b;">\u52A0\u8F7D\u4E2D...</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="toolbar">
          <h3>\u7CFB\u7EDF\u5B89\u5168\u8BBE\u7F6E</h3>
          <button class="btn btn-primary" onclick="saveSystemConfig()">\u4FDD\u5B58\u914D\u7F6E</button>
        </div>
        <div style="padding:20px;background:#f9f9fb;border-radius:8px;margin-bottom:20px;">
          <p style="color:#86868b;margin-bottom:12px;">
            \u914D\u7F6E\u7CFB\u7EDF\u7684\u5B89\u5168\u7B56\u7565\uFF0C\u5305\u62ECReferer\u9A8C\u8BC1\u548C\u64AD\u653EToken\u9A8C\u8BC1\u3002
          </p>
          <div style="background:#fff3e0;border-left:4px solid #ff9800;padding:12px;border-radius:4px;">
            <strong style="color:#e65100;">\u6CE8\u610F\uFF1A</strong>
            <ul style="margin:8px 0 0 20px;color:#666;">
              <li>Referer\u9A8C\u8BC1\uFF1A\u542F\u7528\u540E\uFF0C\u53EA\u6709\u6765\u81EA\u5141\u8BB8\u57DF\u540D\u7684\u8BF7\u6C42\u624D\u80FD\u83B7\u53D6\u64AD\u653E\u5730\u5740</li>
              <li>Token\u9A8C\u8BC1\uFF1A\u542F\u7528\u540E\uFF0C\u64AD\u653E\u5730\u5740\u9700\u8981\u901A\u8FC7Token\u9A8C\u8BC1\uFF0CToken\u6709\u6548\u671F\u53EF\u81EA\u5B9A\u4E49</li>
              <li><strong>\u65B0\u589E\u529F\u80FD\uFF1A</strong>Token\u7ED1\u5B9AIP\u5730\u5740+\u9605\u540E\u5373\u711A\uFF0C\u9632\u6B62\u91CD\u653E\u653B\u51FB\u548C\u4EE3\u7406\u76D7\u7528</li>
              <li>\u5EFA\u8BAE\u540C\u65F6\u542F\u7528\u4E24\u9879\u529F\u80FD\u4EE5\u63D0\u9AD8\u5B89\u5168\u6027</li>
              <li>\u4FEE\u6539\u914D\u7F6E\u540E\uFF0C\u9700\u8981\u5237\u65B0\u9996\u9875\u624D\u80FD\u751F\u6548</li>
            </ul>
          </div>
        </div>

        <div style="margin-bottom:24px;">
          <h4 style="margin-bottom:12px;font-weight:600;">Referer\u9A8C\u8BC1</h4>
          <div style="margin-bottom:16px;">
            <label style="display:flex;align-items:center;padding:12px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;">
              <input type="checkbox" id="enableRefCheck" style="margin-right:12px;">
              <span style="font-size:14px;">\u542F\u7528Referer\u9A8C\u8BC1</span>
            </label>
          </div>
          <div class="form-group">
            <label>\u5141\u8BB8\u7684\u57DF\u540D\uFF08\u9017\u53F7\u5206\u9694\uFF0C\u4F8B\u5982\uFF1Aexample.com,*.example.com\uFF09</label>
            <input type="text" id="refWhitelist" placeholder="\u4F8B\u5982\uFF1Ayourdomain.com,*.yourdomain.com,*" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;font-size:14px;">
            <p style="margin-top:8px;color:#86868b;font-size:12px;">\u4F7F\u7528 * \u8868\u793A\u5141\u8BB8\u6240\u6709\u57DF\u540D\uFF08\u4E0D\u5EFA\u8BAE\uFF09</p>
          </div>
        </div>

        <div style="margin-bottom:24px;">
          <h4 style="margin-bottom:12px;font-weight:600;">Token\u9A8C\u8BC1\uFF08\u9632\u4EE3\u7406/\u9632\u91CD\u653E\uFF09</h4>
          <div style="margin-bottom:16px;">
            <label style="display:flex;align-items:center;padding:12px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;">
              <input type="checkbox" id="enablePlayToken" style="margin-right:12px;">
              <span style="font-size:14px;">\u542F\u7528\u64AD\u653EToken\u9A8C\u8BC1</span>
            </label>
          </div>
          <div class="form-group">
            <label>Token\u6709\u6548\u671F\uFF08\u79D2\uFF09</label>
            <input type="number" id="playTokenExpireSeconds" placeholder="\u4F8B\u5982\uFF1A3600" min="60" max="86400" style="width:100%;padding:10px;border:1px solid #d2d2d7;border-radius:6px;font-size:14px;">
            <p style="margin-top:8px;color:#86868b;font-size:12px;">\u5EFA\u8BAE\u503C\uFF1A3600\uFF081\u5C0F\u65F6\uFF09\u6216 1800\uFF0830\u5206\u949F\uFF09</p>
          </div>
          <div style="margin-bottom:16px;">
            <label style="display:flex;align-items:center;padding:12px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;">
              <input type="checkbox" id="enableIPBind" style="margin-right:12px;">
              <span style="font-size:14px;">\u542F\u7528IP\u7ED1\u5B9A</span>
            </label>
            <p style="margin-top:8px;color:#86868b;font-size:12px;">Token\u4E0E\u83B7\u53D6\u65F6\u7684\u5BA2\u6237\u7AEFIP\u7ED1\u5B9A\uFF0C\u5373\u4F7F\u6CC4\u9732\u4E5F\u65E0\u6CD5\u5728\u5176\u4ED6IP\u4E0A\u4F7F\u7528</p>
          </div>
          <div style="margin-bottom:16px;">
            <label style="display:flex;align-items:center;padding:12px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;">
              <input type="checkbox" id="enableBurnAfterRead" style="margin-right:12px;">
              <span style="font-size:14px;">\u542F\u7528\u9605\u540E\u5373\u711A</span>
            </label>
            <p style="margin-top:8px;color:#86868b;font-size:12px;">Token\u4F7F\u7528\u4E00\u6B21\u540E\u7ACB\u5373\u5931\u6548\uFF0C\u9632\u6B62\u91CD\u653E\u653B\u51FB</p>
          </div>
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e5e5ea;">
            <h4 style="margin-bottom:16px;color:#000;font-size:16px;">\u{1F510} URL \u52A0\u5BC6\u914D\u7F6E</h4>
            <div style="margin-bottom:16px;">
              <label style="display:flex;align-items:center;padding:12px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;">
                <input type="checkbox" id="enableURLEncryption" style="margin-right:12px;">
                <span style="font-size:14px;">\u542F\u7528 URL \u52A0\u5BC6</span>
              </label>
              <p style="margin-top:8px;color:#86868b;font-size:12px;">\u5BF9\u64AD\u653E\u5730\u5740\u8FDB\u884C AES-GCM \u52A0\u5BC6\uFF0C\u9632\u6B62\u76F4\u63A5\u5206\u4EAB\u548C\u6293\u53D6</p>
            </div>
            <div style="margin-bottom:16px;">
              <label>\u52A0\u5BC6\u5BC6\u94A5</label>
              <div style="display:flex;gap:8px;">
                <input type="text" id="urlEncryptionKey" placeholder="\u7559\u7A7A\u81EA\u52A8\u751F\u6210\u6216\u8F93\u5165\u81EA\u5B9A\u4E49\u5BC6\u94A5" style="flex:1;padding:10px;border:1px solid #d2d2d7;border-radius:6px;font-size:14px;monospace;">
                <button type="button" class="btn" onclick="rotateEncryptionKey()" title="\u8F6E\u6362\u5BC6\u94A5">\u{1F504} \u8F6E\u6362</button>
              </div>
              <p style="margin-top:8px;color:#86868b;font-size:12px;">\u5EFA\u8BAE\u957F\u5EA6\u81F3\u5C11 16 \u4E2A\u5B57\u7B26\uFF0C\u4EC5\u652F\u6301\u5B57\u6BCD\u548C\u6570\u5B57</p>
            </div>
            <div style="background:#fff3cd;border-left:4px solid #ffc107;padding:12px;border-radius:4px;margin-top:12px;">
              <strong style="color:#856404;">\u26A0\uFE0F \u52A0\u5BC6\u6CE8\u610F\u4E8B\u9879\uFF1A</strong>
              <ul style="margin:8px 0 0 20px;color:#856404;font-size:13px;line-height:1.6;">
                <li><strong>\u5BC6\u94A5\u5B89\u5168\uFF1A</strong>\u8F6E\u6362\u5BC6\u94A5\u540E\uFF0C\u65E7\u7684\u64AD\u653E\u5730\u5740\u5C06\u5931\u6548\uFF0C\u7528\u6237\u9700\u91CD\u65B0\u83B7\u53D6</li>
                <li><strong>\u81EA\u52A8\u8F6E\u6362\uFF1A</strong>\u5EFA\u8BAE\u5B9A\u671F\u8F6E\u6362\u5BC6\u94A5\uFF08\u5982\u6BCF\u6708\u4E00\u6B21\uFF09\u4EE5\u589E\u5F3A\u5B89\u5168\u6027</li>
                <li><strong>\u524D\u7AEF\u540C\u6B65\uFF1A</strong>\u8F6E\u6362\u5BC6\u94A5\u540E\uFF0C\u524D\u7AEF\u9875\u9762\u9700\u8981\u91CD\u65B0\u52A0\u8F7D\u624D\u80FD\u83B7\u53D6\u65B0\u5BC6\u94A5</li>
                <li><strong>\u517C\u5BB9\u6027\uFF1A</strong>\u542F\u7528\u52A0\u5BC6\u540E\uFF0C\u64AD\u653E\u5668\u9700\u8981\u652F\u6301\u89E3\u5BC6\uFF08Hls.js \u5DF2\u652F\u6301\uFF09</li>
              </ul>
            </div>
          </div>
          <div style="background:#e8f5e9;border-left:4px solid #2e7d32;padding:12px;border-radius:4px;margin-top:12px;">
            <strong style="color:#1b5e20;">\u{1F512} Token\u5B89\u5168\u7279\u6027\u8BF4\u660E\uFF1A</strong>
            <ul style="margin:8px 0 0 20px;color:#1b5e20;font-size:13px;line-height:1.6;">
              <li><strong>IP\u7ED1\u5B9A\uFF1A</strong>Token\u4E0E\u83B7\u53D6\u65F6\u7684\u5BA2\u6237\u7AEFIP\u7ED1\u5B9A\uFF0C\u5373\u4F7F\u6CC4\u9732\u4E5F\u65E0\u6CD5\u5728\u5176\u4ED6IP\u4E0A\u4F7F\u7528</li>
              <li><strong>\u9605\u540E\u5373\u711A\uFF1A</strong>Token\u4F7F\u7528\u4E00\u6B21\u540E\u7ACB\u5373\u5931\u6548\uFF0C\u9632\u6B62\u91CD\u653E\u653B\u51FB</li>
              <li><strong>\u9632\u4EE3\u7406\uFF1A</strong>\u5373\u4F7F\u6709\u4EBA\u901A\u8FC7PHP\u4EE3\u7406\u4F60\u7684\u9875\u9762\uFF0CIP\u4E0D\u5339\u914D\u4E5F\u4F1A\u88AB\u62D2\u7EDD</li>
              <li><strong>\u9632\u5206\u4EAB\uFF1A</strong>Token\u65E0\u6CD5\u88AB\u591A\u6B21\u4F7F\u7528\uFF0C\u6709\u6548\u9650\u5236\u5730\u5740\u5206\u4EAB\u884C\u4E3A</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="loadingOverlay" class="loading-overlay">
    <div class="loading-spinner"></div>
  </div>
  <div id="syncIndicator" class="sync-indicator">
    <div class="sync-spinner"></div>
    <span id="syncText">\u6B63\u5728\u540C\u6B65\u4E2D...</span>
  </div>
  <div id="sourceModal" class="modal">
    <div class="modal-content">
      <div class="modal-header"><h3 id="sourceModalTitle">\u6DFB\u52A0\u6E90</h3><button class="close-btn" onclick="closeSourceModal()">&times;</button></div>
      <div class="form-group"><label>\u6E90\u540D\u79F0</label><input type="text" id="sourceName" placeholder="\u8F93\u5165\u6E90\u540D\u79F0"></div>
      <div class="form-group"><label>M3U URL</label><input type="text" id="sourceUrl" placeholder="\u8F93\u5165M3U\u6587\u4EF6URL"></div>
      <div class="form-row"><div class="form-group"><label>\u7C7B\u578B</label><select id="sourceType"><option value="m3u">M3U</option><option value="m3u8">M3U8</option></select></div><div class="form-group"><label>\u89E3\u6790\u6A21\u5F0F</label><select id="sourceParseMode"><option value="strict">\u4E25\u683C</option><option value="loose">\u5BBD\u677E</option></select></div></div>
      <div class="modal-footer"><button class="btn" onclick="closeSourceModal()">\u53D6\u6D88</button><button class="btn btn-primary" onclick="saveSource()">\u4FDD\u5B58</button></div>
    </div>
  </div>
  <div id="generateCodeModal" class="modal">
    <div class="modal-content">
      <div class="modal-header"><h3>\u751F\u6210\u5361\u5BC6</h3><button class="close-btn" onclick="closeGenerateCodeModal()">&times;</button></div>
      <div class="form-row"><div class="form-group"><label>\u751F\u6210\u6570\u91CF</label><input type="number" id="generateCount" value="1" min="1" max="100"></div><div class="form-group"><label>\u6709\u6548\u671F(\u5929)</label><input type="number" id="generateDuration" value="30" min="1"></div></div>
      <div class="form-row"><div class="form-group"><label>\u6700\u5927IP\u6570</label><input type="number" id="generateMaxIps" value="3" min="1"></div><div class="form-group"><label>\u5907\u6CE8</label><input type="text" id="generateRemark" placeholder="\u53EF\u9009\u5907\u6CE8"></div></div>
      <div class="modal-footer"><button class="btn" onclick="closeGenerateCodeModal()">\u53D6\u6D88</button><button class="btn btn-primary" onclick="generateCodes()">\u751F\u6210</button></div>
    </div>
  </div>
  <div id="codeResultModal" class="modal">
    <div class="modal-content" style="max-width:600px">
      <div class="modal-header"><h3>\u751F\u6210\u7684\u5361\u5BC6</h3><button class="close-btn" onclick="closeCodeResultModal()">&times;</button></div>
      <div id="generatedCodesList" class="generated-codes"></div>
      <div class="modal-footer"><button class="btn" onclick="closeCodeResultModal()">\u5173\u95ED</button></div>
    </div>
  </div>
  <div id="codeEditModal" class="modal">
    <div class="modal-content">
      <div class="modal-header"><h3>\u7F16\u8F91\u5361\u5BC6</h3><button class="close-btn" onclick="closeCodeEditModal()">&times;</button></div>
      <div class="form-group"><label>\u5361\u5BC6</label><input type="text" id="editCode" disabled></div>
      <div class="form-group"><label>\u72B6\u6001</label><select id="editStatus"><option value="unused">\u672A\u4F7F\u7528</option><option value="active">\u6D3B\u8DC3</option><option value="disabled">\u7981\u7528</option></select></div>
      <div class="form-group"><label>\u5907\u6CE8</label><input type="text" id="editRemark" placeholder="\u5907\u6CE8\u4FE1\u606F"></div>
      <div class="modal-footer"><button class="btn" onclick="closeCodeEditModal()">\u53D6\u6D88</button><button class="btn btn-primary" onclick="saveCodeEdit()">\u4FDD\u5B58</button></div>
    </div>
  </div>
  <div id="importCodeModal" class="modal">
    <div class="modal-content" style="max-width:800px">
      <div class="modal-header"><h3>\u6279\u91CF\u5BFC\u5165\u5361\u5BC6</h3><button class="close-btn" onclick="closeImportCodeModal()">&times;</button></div>
      <div style="margin-bottom:16px;padding:12px;background:#e3f2fd;border-left:4px solid #2196f3;border-radius:4px;font-size:13px;color:#1976d2;line-height:1.6;">
        <p style="margin:0;font-weight:600;">CSV\u6587\u4EF6\u683C\u5F0F\u8981\u6C42\uFF1A</p>
        <ul style="margin:8px 0 0 20px;">
          <li>\u7B2C\u4E00\u884C\u4E3A\u8868\u5934\uFF1A\u5361\u5BC6,\u6709\u6548\u671F,\u6FC0\u6D3B\u65F6\u95F4,\u8FC7\u671F\u65F6\u95F4,\u5907\u6CE8</li>
          <li>\u6FC0\u6D3B\u65F6\u95F4\u548C\u8FC7\u671F\u65F6\u95F4\u4E3A\u53EF\u9009\u5B57\u6BB5\uFF0C\u53EF\u7559\u7A7A</li>
          <li>\u65E5\u671F\u683C\u5F0F\uFF1A\u5317\u4EAC\u65F6\u95F4\u683C\u5F0F\uFF08YYYY-MM-DD HH:mm:ss \u6216 YYYY-MM-DD\uFF09</li>
          <li>\u793A\u4F8B\uFF1AABC12345,30,2024-01-01 10:00:00,2024-02-01 10:00:00,VIP\u5361\u5BC6</li>
        </ul>
      </div>
      <div class="form-group"><label>\u9009\u62E9CSV\u6587\u4EF6</label><input type="file" id="importFile" accept=".csv" onchange="handleImportFileSelect()"></div>
      <div class="form-group" id="fileInfo" style="display:none;padding:8px;background:#f5f5f7;border-radius:4px;font-size:13px;"><span id="fileName"></span></div>
      <div class="form-group">
        <label>\u5BFC\u5165\u9009\u9879</label>
        <label style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <input type="checkbox" id="skipDuplicates" checked style="width:auto;">
          <span style="font-size:14px;">\u8DF3\u8FC7\u5DF2\u5B58\u5728\u7684\u5361\u5BC6</span>
        </label>
        <label style="display:flex;align-items:center;gap:8px;">
          <input type="checkbox" id="updateExisting" style="width:auto;">
          <span style="font-size:14px;">\u66F4\u65B0\u5DF2\u5B58\u5728\u7684\u5361\u5BC6\u6570\u636E</span>
        </label>
      </div>
      <div class="modal-footer"><button class="btn" onclick="closeImportCodeModal()">\u53D6\u6D88</button><button class="btn btn-primary" onclick="importCodesFromCSV()">\u5F00\u59CB\u5BFC\u5165</button></div>
    </div>
  </div>
  <script>
    const API_BASE='/admin';
    const STORAGE_KEY = 'admin_auth_key';
    const SYNC_KEY = 'admin_sync_status';
    let adminKey = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    let currentChannelPage = 1;
    let totalChannelPages = 1;
    let totalChannels = 0;
    let currentCodePage = 1;
    let totalCodePages = 1;
    let totalCodes = 0;

    // Loading\u63A7\u5236
    function showLoading() {
      document.getElementById('loadingOverlay').classList.add('active');
    }

    function hideLoading() {
      document.getElementById('loadingOverlay').classList.remove('active');
    }

    // \u540C\u6B65\u72B6\u6001\u7BA1\u7406
    function setSyncStatus(status) {
      localStorage.setItem(SYNC_KEY, JSON.stringify({
        status,
        timestamp: Date.now()
      }));
      updateSyncIndicator();
    }

    function getSyncStatus() {
      const data = localStorage.getItem(SYNC_KEY);
      if (!data) return null;
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }

    function clearSyncStatus() {
      localStorage.removeItem(SYNC_KEY);
      updateSyncIndicator();
    }

    function updateSyncIndicator() {
      const syncStatus = getSyncStatus();
      const indicator = document.getElementById('syncIndicator');
      if (syncStatus && syncStatus.status === 'syncing') {
        const elapsed = Math.floor((Date.now() - syncStatus.timestamp) / 1000);
        document.getElementById('syncText').textContent = '\u6B63\u5728\u540C\u6B65\u4E2D... (' + elapsed + '\u79D2)';
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    }

    // \u5B9A\u671F\u66F4\u65B0\u540C\u6B65\u72B6\u6001\u663E\u793A
    setInterval(updateSyncIndicator, 1000);

    // \u9875\u9762\u52A0\u8F7D\u65F6\u81EA\u52A8\u68C0\u67E5\u767B\u5F55\u72B6\u6001
    if (adminKey) {
      autoLogin();
    } else {
      document.getElementById('loginOverlay').classList.remove('hidden');
    }

    // \u9875\u9762\u52A0\u8F7D\u65F6\u66F4\u65B0\u540C\u6B65\u6307\u793A\u5668
    updateSyncIndicator();

    function autoLogin() {
      fetch(API_BASE + '/init', {
        method: 'GET',
        headers: { 'X-Admin-Key': adminKey }
      })
      .then(res => {
        if (res.ok) {
          document.getElementById('mainContent').style.display = 'block';
          loadSources();
        } else {
          clearAuth();
          document.getElementById('loginOverlay').classList.remove('hidden');
        }
      })
      .catch(() => {
        // \u9759\u9ED8\u5931\u8D25\uFF0C\u8BA9\u7528\u6237\u624B\u52A8\u767B\u5F55
        document.getElementById('loginOverlay').classList.remove('hidden');
      });
    }

    function login() {
      const key = document.getElementById('adminKey').value;
      if (!key) {
        showLoginError('\u8BF7\u8F93\u5165\u7BA1\u7406\u5458\u5BC6\u94A5');
        return;
      }
      adminKey = key;
      // \u540C\u65F6\u4FDD\u5B58\u5230 localStorage \u548C sessionStorage
      localStorage.setItem(STORAGE_KEY, key);
      sessionStorage.setItem(STORAGE_KEY, key);
      fetch(API_BASE + '/init', {
        method: 'GET',
        headers: { 'X-Admin-Key': adminKey }
      })
      .then(res => {
        if (res.ok) {
          document.getElementById('loginOverlay').classList.add('hidden');
          document.getElementById('mainContent').style.display = 'block';
          loadSources();
        } else {
          showLoginError('\u5BC6\u94A5\u65E0\u6548');
          clearAuth();
        }
      })
      .catch(() => {
        showLoginError('\u767B\u5F55\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5');
        clearAuth();
      });
    }

    function showLoginError(msg) {
      const el = document.getElementById('loginError');
      el.textContent = msg;
      el.style.display = 'block';
    }

    function logout() {
      clearAuth();
      adminKey = null;
      document.getElementById('mainContent').style.display = 'none';
      document.getElementById('loginOverlay').classList.remove('hidden');
      document.getElementById('adminKey').value = '';
      document.getElementById('loginError').style.display = 'none';
    }

    function clearAuth() {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    }

    function apiRequest(url, options = {}) {
      const showLoadingIndicator = options.showLoading !== false;
      delete options.showLoading;

      if (showLoadingIndicator) {
        showLoading();
      }

      options.headers = options.headers || {};
      options.headers['X-Admin-Key'] = adminKey;
      options.headers['Content-Type'] = 'application/json';

      return fetch(API_BASE + url, options).then(res => {
        if (showLoadingIndicator) {
          hideLoading();
        }
        if (res.status === 401) {
          logout();
          throw new Error('Unauthorized');
        }
        return res.json();
      }).catch(error => {
        if (showLoadingIndicator) {
          hideLoading();
        }
        throw error;
      });
    }

    function showTab(tabName) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));
      document.getElementById(tabName).classList.add('active');
      event.target.classList.add('active');
      if (tabName === 'sources') {
        loadSources();
        loadSyncFilters(); // \u52A0\u8F7D\u540C\u6B65\u8FC7\u6EE4\u89C4\u5219
      }
      else if (tabName === 'channels') { loadSources(); loadChannels(); }
      else if (tabName === 'codes') loadCodes();
      else if (tabName === 'security') {
        loadSecurityConfig();
        document.getElementById('quotaInfo').style.display = 'none';
        document.getElementById('noQuotaData').style.display = 'block';
        loadBannedCodes(); // \u52A0\u8F7D\u5C01\u7981\u5361\u5BC6\u5217\u8868
      }
      else if (tabName === 'ip-blacklist') {
        loadIPBlacklistConfig();
        loadIPBlacklist();
      }
      else if (tabName === 'homepage-display') loadHomepageDisplayConfig();
      else if (tabName === 'system-settings') {
        loadSystemConfig();
        loadAnnouncement(); // \u52A0\u8F7D\u516C\u544A
        loadCacheStatus(); // \u52A0\u8F7D\u7F13\u5B58\u72B6\u6001
      }
    }

    async function loadSources() {
      try {
        showLoading();
        // \u52A0\u8F7D\u4E4B\u524D\u4FDD\u5B58\u7684\u8FC7\u6EE4\u89C4\u5219
        loadSyncFilters();

        const sources = await apiRequest('/sources', { showLoading: false });
        const sourceList = sources.results || sources;
        const tbody = document.getElementById('sourcesTable');
        if (!sourceList || sourceList.length === 0) {
          tbody.innerHTML = '<tr><td colspan="7" class="empty-state">\u6682\u65E0\u76F4\u64AD\u6E90</td></tr>';
          return;
        }
        const sourcesWithCounts = await Promise.all(sourceList.map(async source => {
          try {
            const channels = await apiRequest('/channels?source_id=' + source.id + '&page=1&page_size=1', { showLoading: false });
            source.channelCount = channels.pagination?.total || 0;
          } catch (e) {
            source.channelCount = 0;
          }
          return source;
        }));
        tbody.innerHTML = sourcesWithCounts.map(source => \`
          <tr>
            <td>\${source.id}</td>
            <td>\${escapeHtml(source.name)}</td>
            <td><span class="badge badge-warning">\${escapeHtml(source.type)}</span></td>
            <td>\${escapeHtml(source.parse_mode)}</td>
            <td>
              <span class="badge \${source.is_active ? 'badge-success' : 'badge-danger'}">
                \${source.is_active ? '\u542F\u7528' : '\u7981\u7528'}
              </span>
            </td>
            <td>\${source.channelCount}</td>
            <td>\${source.last_updated ? new Date(source.last_updated).toLocaleString('zh-CN', { timeZone: window.TIMEZONE || 'Asia/Shanghai' }) : '-'}</td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-sm \${source.is_active ? 'btn-danger' : 'btn-success'}" onclick="toggleSource(\${source.id}, \${!source.is_active})">
                  \${source.is_active ? '\u7981\u7528' : '\u542F\u7528'}
                </button>
                <button class="btn btn-sm btn-primary" onclick="syncSource(\${source.id})">\u540C\u6B65</button>
                <button class="btn btn-sm" onclick="editSource(\${source.id})">\u7F16\u8F91</button>
                <button class="btn btn-sm btn-danger" onclick="deleteSource(\${source.id})">\u5220\u9664</button>
              </div>
            </td>
          </tr>
        \`).join('');
        const filterSelect = document.getElementById('channelSourceFilter');
        // \u53EA\u663E\u793A\u5DF2\u542F\u7528\u7684\u6E90
        const enabledSources = sourceList.filter(s => s.is_active);
        filterSelect.innerHTML = '<option value="">\u5168\u90E8\u6E90</option>' + enabledSources.map(s => \`<option value="\${s.id}">\${escapeHtml(s.name)}</option>\`).join('');

        // \u52A0\u8F7D\u6240\u6709\u5206\u7EC4\u5E76\u586B\u5145\u5206\u7EC4\u4E0B\u62C9\u6846
        try {
          const groupsData = await apiRequest('/channels?action=get_groups', { showLoading: false });
          const groupFilter = document.getElementById('channelGroupFilter');
          const groups = groupsData.groups || [];
          groupFilter.innerHTML = '<option value="">\u5168\u90E8\u5206\u7EC4</option>' + groups.map(g => \`<option value="\${escapeHtml(g)}">\${escapeHtml(g)}</option>\`).join('');
        } catch (e) {
          console.error('\u52A0\u8F7D\u5206\u7EC4\u5931\u8D25:', e);
        }
      } catch (error) {
        console.error('\u52A0\u8F7D\u6E90\u5931\u8D25:', error);
      } finally {
        hideLoading();
      }
    }

    function showSourceModal(source = null) {
      document.getElementById('sourceModalTitle').textContent = source ? '\u7F16\u8F91\u6E90' : '\u6DFB\u52A0\u6E90';
      document.getElementById('sourceName').value = source ? source.name : '';
      document.getElementById('sourceUrl').value = source ? source.url : '';
      document.getElementById('sourceType').value = source ? source.type : 'm3u';
      document.getElementById('sourceParseMode').value = source ? source.parse_mode : 'strict';
      document.getElementById('sourceModal').classList.add('active');
    }

    function closeSourceModal() {
      document.getElementById('sourceModal').classList.remove('active');
      document.getElementById('sourceModal').dataset.editId = '';
    }

    async function saveSource() {
      const name = document.getElementById('sourceName').value.trim();
      const url = document.getElementById('sourceUrl').value.trim();
      const type = document.getElementById('sourceType').value;
      const parseMode = document.getElementById('sourceParseMode').value;

      if (!name || !url) {
        showToast('\u8BF7\u586B\u5199\u5B8C\u6574\u4FE1\u606F', 'error');
        return;
      }

      try {
        const editingSourceId = document.getElementById('sourceModal').dataset.editId;
        if (editingSourceId) {
          await apiRequest('/sources', {
            method: 'PUT',
            body: JSON.stringify({ id: parseInt(editingSourceId), name, url, type, parse_mode: parseMode })
          });
          showToast('\u6E90\u66F4\u65B0\u6210\u529F', 'success');
        } else {
          await apiRequest('/sources', {
            method: 'POST',
            body: JSON.stringify({ name, url, type, parse_mode: parseMode })
          });
          showToast('\u6E90\u6DFB\u52A0\u6210\u529F', 'success');
        }
        closeSourceModal();
        loadSources();
      } catch (error) {
        showToast('\u4FDD\u5B58\u5931\u8D25: ' + error.error, 'error');
      }
    }

    function editSource(id) {
      apiRequest('/sources').then(data => {
        const sources = data.results || data;
        const source = sources.find(s => s.id === id);
        if (source) {
          document.getElementById('sourceModal').dataset.editId = id;
          showSourceModal(source);
        }
      });
    }

    async function deleteSource(id) {
      if (!confirm('\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u4E2A\u6E90\u5417\uFF1F\u6240\u6709\u5173\u8054\u7684\u9891\u9053\u4E5F\u4F1A\u88AB\u5220\u9664\u3002')) return;
      try {
        const result = await apiRequest('/sources/' + id, { method: 'DELETE' });
        showToast(result.message || '\u6E90\u5220\u9664\u6210\u529F', 'success');
        loadSources();
      } catch (error) {
        showToast('\u5220\u9664\u5931\u8D25: ' + error.error, 'error');
      }
    }

    async function toggleSource(id, isActive) {
      try {
        const result = await apiRequest('/sources/toggle/' + id, {
          method: 'PATCH',
          body: JSON.stringify({ is_active: isActive })
        });
        showToast(result.message || '\u64CD\u4F5C\u6210\u529F', 'success');
        loadSources();
      } catch (error) {
        showToast('\u64CD\u4F5C\u5931\u8D25: ' + error.error, 'error');
      }
    }

    async function syncAllSources() {
      if (!confirm('\u786E\u5B9A\u8981\u540C\u6B65\u6240\u6709\u5DF2\u542F\u7528\u7684\u6E90\u5417\uFF1F\u8FD9\u5C06\u5220\u9664\u6240\u6709\u65E7\u9891\u9053\u6570\u636E\u5E76\u91CD\u65B0\u83B7\u53D6\u3002')) return;
      showLoading();
      showToast('\u5F00\u59CB\u540C\u6B65\u6240\u6709\u6E90\uFF0C\u8FD9\u53EF\u80FD\u9700\u8981\u51E0\u5206\u949F...', 'info');
      try {
        // \u83B7\u53D6\u8FC7\u6EE4\u89C4\u5219\uFF08\u652F\u6301\u9017\u53F7\u548C\u6362\u884C\u7B26\u5206\u9694\uFF09
        const excludeGroups = document.getElementById('syncExcludeGroups').value
          .split(new RegExp('[\\n,]+'))
          .map(s => s.trim())
          .filter(s => s.length > 0);
        const excludeUrls = document.getElementById('syncExcludeUrls').value
          .split(new RegExp('[\\n,]+'))
          .map(s => s.trim())
          .filter(s => s.length > 0);
        const excludeNames = document.getElementById('syncExcludeNames').value
          .split(new RegExp('[\\n,]+'))
          .map(s => s.trim())
          .filter(s => s.length > 0);

        const filter = {
          excludeGroups,
          excludeUrls,
          excludeNames
        };

        console.log('Sync filter:', filter); // \u8C03\u8BD5\u65E5\u5FD7

        const result = await apiRequest('/sync/all', {
          method: 'POST',
          body: JSON.stringify(filter)
        });
        if (result.success) {
          const summary = \`\u540C\u6B65\u5B8C\u6210\uFF1A\${result.success_count}\u4E2A\u6210\u529F\uFF0C\${result.fail_count}\u4E2A\u5931\u8D25\`;
          showToast(summary, result.fail_count > 0 ? 'error' : 'success');
          // \u663E\u793A\u8BE6\u7EC6\u7ED3\u679C
          if (result.results && result.results.length > 0) {
            const details = result.results.map(r => {
              const status = r.success ? '\u2713' : '\u2717';
              return \`\${status} \${r.source_name}: \${r.success ? r.new_channels + '\u4E2A\u9891\u9053' : r.error}\`;
            }).join('\\n');
            alert(summary + '\\n\\n\u8BE6\u7EC6\u7ED3\u679C:\\n' + details);
          }
          loadSources();
        } else {
          showToast('\u540C\u6B65\u5931\u8D25: ' + result.error, 'error');
        }
      } catch (error) {
        showToast('\u540C\u6B65\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }


    function toggleSyncFilter() {
      const panel = document.getElementById('syncFilterPanel');
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    function clearSyncFilters() {
      document.getElementById('syncExcludeGroups').value = '';
      document.getElementById('syncExcludeUrls').value = '';
      document.getElementById('syncExcludeNames').value = '';
      document.getElementById('excludeDuplicateUrls').checked = false;
      document.getElementById('groupRenameRules').value = '';
      document.getElementById('groupRenameExclude').value = '';
      showToast('\u5DF2\u6E05\u7A7A\u540C\u6B65\u8FC7\u6EE4\u89C4\u5219', 'success');
    }

    async function saveSyncFilters() {
      // \u83B7\u53D6\u8FC7\u6EE4\u89C4\u5219\uFF08\u652F\u6301\u9017\u53F7\u548C\u6362\u884C\u7B26\u5206\u9694\uFF09
      const excludeGroups = document.getElementById('syncExcludeGroups').value
        .split(new RegExp('[\\n,]+'))
        .map(s => s.trim())
        .filter(s => s.length > 0);
      const excludeUrls = document.getElementById('syncExcludeUrls').value
        .split(new RegExp('[\\n,]+'))
        .map(s => s.trim())
        .filter(s => s.length > 0);
      const excludeNames = document.getElementById('syncExcludeNames').value
        .split(new RegExp('[\\n,]+'))
        .map(s => s.trim())
        .filter(s => s.length > 0);

      // \u89E3\u6790\u5206\u7EC4\u91CD\u547D\u540D\u89C4\u5219
      const groupRenameRules = document.getElementById('groupRenameRules').value
        .split(new RegExp('[\\n]+'))
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(rule => {
          const parts = rule.split('->');
          if (parts.length === 2) {
            return {
              keyword: parts[0].trim(),
              newName: parts[1].trim()
            };
          }
          return null;
        })
        .filter(rule => rule !== null);

      const groupRenameExclude = document.getElementById('groupRenameExclude').value
        .split(new RegExp('[\\n,]+'))
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const filters = {
        excludeGroups,
        excludeUrls,
        excludeNames,
        excludeDuplicateUrls: document.getElementById('excludeDuplicateUrls').checked,
        groupRenameRules,
        groupRenameExclude
      };

      // \u540C\u65F6\u4FDD\u5B58\u5230 localStorage\uFF08\u7528\u4E8E\u56DE\u663E\uFF09\u548C\u6570\u636E\u5E93\uFF08\u7528\u4E8E\u5B9A\u65F6\u4EFB\u52A1\uFF09
      localStorage.setItem('syncFilters', JSON.stringify({
        excludeGroups: document.getElementById('syncExcludeGroups').value,
        excludeUrls: document.getElementById('syncExcludeUrls').value,
        excludeNames: document.getElementById('syncExcludeNames').value,
        excludeDuplicateUrls: document.getElementById('excludeDuplicateUrls').checked,
        groupRenameRules: document.getElementById('groupRenameRules').value,
        groupRenameExclude: document.getElementById('groupRenameExclude').value
      }));

      try {
        const result = await apiRequest('/sync/filter', {
          method: 'POST',
          body: JSON.stringify(filters)
        });
        if (result.success) {
          showToast('\u8FC7\u6EE4\u89C4\u5219\u5DF2\u4FDD\u5B58\u5230\u6570\u636E\u5E93\uFF0C\u5B9A\u65F6\u4EFB\u52A1\u5C06\u81EA\u52A8\u5E94\u7528', 'success');
        } else {
          showToast('\u4FDD\u5B58\u5931\u8D25: ' + result.error, 'error');
        }
      } catch (error) {
        console.error('Failed to save sync filters:', error);
        showToast('\u4FDD\u5B58\u5931\u8D25\uFF0C\u4EC5\u4FDD\u5B58\u5728\u672C\u5730\u6D4F\u89C8\u5668\u7F13\u5B58', 'error');
      }
    }

    async function loadSyncFilters() {
      // \u4F18\u5148\u4ECE\u6570\u636E\u5E93\u52A0\u8F7D\uFF0C\u5982\u679C\u5931\u8D25\u5219\u4ECE localStorage \u52A0\u8F7D
      try {
        const result = await apiRequest('/sync/filter', { showLoading: false });
        if (result.success && result.config) {
          const config = result.config;
          // \u5C06\u6570\u7EC4\u8F6C\u6362\u4E3A\u591A\u884C\u6587\u672C\u683C\u5F0F\u7528\u4E8E\u663E\u793A
          document.getElementById('syncExcludeGroups').value = (config.excludeGroups || []).join('\\n');
          document.getElementById('syncExcludeUrls').value = (config.excludeUrls || []).join('\\n');
          document.getElementById('syncExcludeNames').value = (config.excludeNames || []).join('\\n');
          document.getElementById('excludeDuplicateUrls').checked = config.excludeDuplicateUrls || false;

          // \u5C06\u5206\u7EC4\u91CD\u547D\u540D\u89C4\u5219\u6570\u7EC4\u8F6C\u6362\u4E3A\u591A\u884C\u6587\u672C\u683C\u5F0F
          const groupRenameRulesText = (config.groupRenameRules || [])
            .map(rule => rule.keyword + ' -> ' + rule.newName)
            .join('\\n');
          document.getElementById('groupRenameRules').value = groupRenameRulesText;

          document.getElementById('groupRenameExclude').value = (config.groupRenameExclude || []).join('\\n');
          console.log('Loaded sync filters from database:', config);
          return;
        }
      } catch (error) {
        console.error('Failed to load sync filters from database:', error);
      }

      // \u5982\u679C\u4ECE\u6570\u636E\u5E93\u52A0\u8F7D\u5931\u8D25\uFF0C\u4ECE localStorage \u52A0\u8F7D
      const saved = localStorage.getItem('syncFilters');
      if (saved) {
        try {
          const filters = JSON.parse(saved);
          document.getElementById('syncExcludeGroups').value = filters.excludeGroups || '';
          document.getElementById('syncExcludeUrls').value = filters.excludeUrls || '';
          document.getElementById('syncExcludeNames').value = filters.excludeNames || '';
          document.getElementById('excludeDuplicateUrls').checked = filters.excludeDuplicateUrls || false;
          document.getElementById('groupRenameRules').value = filters.groupRenameRules || '';
          document.getElementById('groupRenameExclude').value = filters.groupRenameExclude || '';
          console.log('Loaded sync filters from localStorage:', filters);
        } catch (e) {
          console.error('Failed to load sync filters from localStorage:', e);
        }
      }
    }

    async function syncSource(id) {
      // \u8BBE\u7F6E\u540C\u6B65\u72B6\u6001
      setSyncStatus('syncing');
      showToast('\u540C\u6B65\u4EFB\u52A1\u5DF2\u5F00\u59CB\uFF0C\u53EF\u4EE5\u5728\u540E\u53F0\u7EE7\u7EED\u6267\u884C', 'info');

      // \u83B7\u53D6\u8FC7\u6EE4\u89C4\u5219\uFF08\u652F\u6301\u9017\u53F7\u548C\u6362\u884C\u7B26\u5206\u9694\uFF09
      const excludeGroups = document.getElementById('syncExcludeGroups').value
        .split(new RegExp('[\\n,]+'))
        .map(s => s.trim())
        .filter(s => s.length > 0);
      const excludeUrls = document.getElementById('syncExcludeUrls').value
        .split(new RegExp('[\\n,]+'))
        .map(s => s.trim())
        .filter(s => s.length > 0);
      const excludeNames = document.getElementById('syncExcludeNames').value
        .split(new RegExp('[\\n,]+'))
        .map(s => s.trim())
        .filter(s => s.length > 0);

      // \u89E3\u6790\u5206\u7EC4\u91CD\u547D\u540D\u89C4\u5219
      const groupRenameRules = document.getElementById('groupRenameRules').value
        .split(new RegExp('[\\n]+'))
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(rule => {
          const parts = rule.split('->');
          if (parts.length === 2) {
            return {
              keyword: parts[0].trim(),
              newName: parts[1].trim()
            };
          }
          return null;
        })
        .filter(rule => rule !== null);

      const groupRenameExclude = document.getElementById('groupRenameExclude').value
        .split(new RegExp('[\\n,]+'))
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const filter = {
        excludeGroups,
        excludeUrls,
        excludeNames,
        excludeDuplicateUrls: document.getElementById('excludeDuplicateUrls').checked,
        groupRenameRules,
        groupRenameExclude
      };

      console.log('Sync filter:', filter); // \u8C03\u8BD5\u65E5\u5FD7

      // \u540E\u53F0\u6267\u884C\u540C\u6B65\uFF0C\u4E0D\u7B49\u5F85\u7ED3\u679C
      const syncUrl = API_BASE + '/sync/' + id;
      const syncId = Date.now();

      fetch(syncUrl, {
        method: 'POST',
        headers: {
          'X-Admin-Key': adminKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filter)
      })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          const message = result.deletedChannels
            ? '\u540C\u6B65\u6210\u529F\uFF1A\u5220\u9664\u4E86 ' + result.deletedChannels + ' \u4E2A\u65E7\u9891\u9053\uFF0C\u65B0\u589E ' + result.channelCount + ' \u4E2A\u9891\u9053'
            : '\u540C\u6B65\u6210\u529F\uFF0C\u5171 ' + result.channelCount + ' \u4E2A\u9891\u9053';
          showToast(message, 'success');
          // \u5982\u679C\u7528\u6237\u8FD8\u5728\u6E90\u5217\u8868\u9875\uFF0C\u5237\u65B0\u6570\u636E
          if (document.getElementById('sources').classList.contains('active')) {
            loadSources();
          }
        } else {
          showToast('\u540C\u6B65\u5931\u8D25: ' + result.error, 'error');
        }
      })
      .catch(error => {
        showToast('\u540C\u6B65\u5931\u8D25: ' + error.error, 'error');
      })
      .finally(() => {
        // \u6E05\u9664\u540C\u6B65\u72B6\u6001
        clearSyncStatus();
      });
    }

    async function loadChannels() {
      try {
        showLoading();
        let url = '/channels';
        const sourceId = document.getElementById('channelSourceFilter').value;
        const groupTitle = document.getElementById('channelGroupFilter').value;
        const search = document.getElementById('channelSearch').value.trim();
        const pageSize = Math.min(parseInt(document.getElementById('channelPageSize').value) || 100, 100);
        const params = new URLSearchParams({
          page: currentChannelPage,
          page_size: pageSize
        });
        if (sourceId) params.append('source_id', sourceId);
        if (groupTitle) params.append('group_title', groupTitle);
        if (search) params.append('search', search);
        url += '?' + params.toString();
        const data = await apiRequest(url, { showLoading: false });
        const channels = data.results || [];
        const pagination = data.pagination || {};
        totalChannelPages = pagination.total_pages || 1;
        totalChannels = pagination.total || 0;
        const tbody = document.getElementById('channelsTable');
        if (channels.length === 0) {
          tbody.innerHTML = '<tr><td colspan="7" class="empty-state">\u6682\u65E0\u9891\u9053</td></tr>';
        } else {
          tbody.innerHTML = channels.map(channel => \`
            <tr>
              <td>
                \${channel.logo ? \`<img src="\${escapeHtml(channel.logo)}" style="width:24px;height:24px;margin-right:8px;vertical-align:middle;">\` : ''}
                \${escapeHtml(channel.channel_name)}
              </td>
              <td>\${escapeHtml(channel.group_title || '-')}</td>
              <td>\${escapeHtml(channel.source_name || '-')}</td>
              <td class="play-url-cell">
                <span class="play-url" title="\${escapeHtml(channel.play_url)}">\${escapeHtml(channel.play_url)}</span>
                <button class="btn btn-sm btn-copy" onclick="copyToClipboard('\${escapeHtml(channel.play_url)}')" title="\u590D\u5236\u5730\u5740">\u590D\u5236</button>
              </td>
              <td class="headers-cell">
                \${formatHeaders(channel.headers)}
              </td>
              <td>
                <span class="badge \${channel.is_active ? 'badge-success' : 'badge-danger'}">
                  \${channel.is_active ? '\u542F\u7528' : '\u7981\u7528'}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-sm \${channel.is_active ? 'btn-danger' : 'btn-success'}"
                    onclick="toggleChannel(\${channel.id}, \${!channel.is_active})">
                    \${channel.is_active ? '\u7981\u7528' : '\u542F\u7528'}
                  </button>
                </div>
              </td>
            </tr>
          \`).join('');
        }
        renderChannelPagination();
      } catch (error) {
        console.error('\u52A0\u8F7D\u9891\u9053\u5931\u8D25:', error);
      } finally {
        hideLoading();
      }
    }

    // \u6E90\u9009\u62E9\u6539\u53D8\u65F6\uFF0C\u91CD\u65B0\u52A0\u8F7D\u5206\u7EC4\u4E0B\u62C9\u6846
    async function onSourceFilterChange() {
      const sourceId = document.getElementById('channelSourceFilter').value;
      const groupFilter = document.getElementById('channelGroupFilter');
      
      if (sourceId) {
        // \u83B7\u53D6\u8BE5\u6E90\u7684\u5206\u7EC4
        try {
          const groupsData = await apiRequest('/channels?action=get_groups&source_id=' + sourceId, { showLoading: false });
          const groups = groupsData.groups || [];
          groupFilter.innerHTML = '<option value="">\u5168\u90E8\u5206\u7EC4</option>' + groups.map(g => \`<option value="\${escapeHtml(g)}">\${escapeHtml(g)}</option>\`).join('');
        } catch (e) {
          console.error('\u52A0\u8F7D\u5206\u7EC4\u5931\u8D25:', e);
        }
      } else {
        // \u663E\u793A\u6240\u6709\u5206\u7EC4
        try {
          const groupsData = await apiRequest('/channels?action=get_groups', { showLoading: false });
          const groups = groupsData.groups || [];
          groupFilter.innerHTML = '<option value="">\u5168\u90E8\u5206\u7EC4</option>' + groups.map(g => \`<option value="\${escapeHtml(g)}">\${escapeHtml(g)}</option>\`).join('');
        } catch (e) {
          console.error('\u52A0\u8F7D\u5206\u7EC4\u5931\u8D25:', e);
        }
      }
      
      // \u91CD\u7F6E\u5206\u7EC4\u9009\u62E9
      groupFilter.value = '';
      
      // \u91CD\u65B0\u52A0\u8F7D\u9891\u9053\u5217\u8868
      resetChannelPage();
    }

    function resetChannelPage() {
      currentChannelPage = 1;
      loadChannels();
    }

    function goToChannelPage(page) {
      if (page >= 1 && page <= totalChannelPages) {
        currentChannelPage = page;
        loadChannels();
      }
    }

    function renderChannelPagination() {
      const container = document.getElementById('channelPagination');
      if (totalChannelPages <= 1) {
        container.innerHTML = '';
        return;
      }
      let html = \`<span class="pagination-info">\u5171 \${totalChannels} \u4E2A\u9891\u9053\uFF0C\u7B2C \${currentChannelPage}/\${totalChannelPages} \u9875</span>\`;
      html += \`<button onclick="goToChannelPage(1)" \${currentChannelPage === 1 ? 'disabled' : ''}>\u9996\u9875</button>\`;
      html += \`<button onclick="goToChannelPage(\${currentChannelPage - 1})" \${currentChannelPage === 1 ? 'disabled' : ''}>\u4E0A\u4E00\u9875</button>\`;
      const maxButtons = 5;
      let startPage = Math.max(1, currentChannelPage - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalChannelPages, startPage + maxButtons - 1);
      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }
      for (let i = startPage; i <= endPage; i++) {
        html += \`<button onclick="goToChannelPage(\${i})" class="\${i === currentChannelPage ? 'active' : ''}">\${i}</button>\`;
      }
      html += \`<button onclick="goToChannelPage(\${currentChannelPage + 1})" \${currentChannelPage === totalChannelPages ? 'disabled' : ''}>\u4E0B\u4E00\u9875</button>\`;
      html += \`<button onclick="goToChannelPage(\${totalChannelPages})" \${currentChannelPage === totalChannelPages ? 'disabled' : ''}>\u672B\u9875</button>\`;
      container.innerHTML = html;
    }

    async function toggleChannel(id, isActive) {
      showToast('\u529F\u80FD\u5F00\u53D1\u4E2D', 'error');
    }

    async function clearChannels() {
      if (!confirm('\u786E\u5B9A\u8981\u6E05\u7A7A\u6240\u6709\u9891\u9053\u6570\u636E\u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u6062\u590D\uFF01')) return;

      try {
        const result = await apiRequest('/channels', { method: 'DELETE' });
        showToast(result.message || '\u6E05\u7A7A\u6210\u529F', 'success');
        loadChannels();
        loadSources(); // \u66F4\u65B0\u6E90\u4E2D\u7684\u9891\u9053\u6570\u7EDF\u8BA1
      } catch (error) {
        showToast('\u6E05\u7A7A\u5931\u8D25: ' + error.error, 'error');
      }
    }

    async function loadCodes() {
      try {
        showLoading();
        let url = '/codes';
        const statusFilter = document.getElementById('codeStatusFilter').value;
        const durationMin = document.getElementById('durationMin').value;
        const durationMax = document.getElementById('durationMax').value;
        const expiredFrom = document.getElementById('expiredFrom').value;
        const expiredTo = document.getElementById('expiredTo').value;
        const activatedFrom = document.getElementById('activatedFrom').value;
        const activatedTo = document.getElementById('activatedTo').value;
        const remarkFilter = document.getElementById('remarkFilter').value.trim();
        const pageSize = Math.min(parseInt(document.getElementById('codePageSize').value) || 100, 100);
        const params = new URLSearchParams({
          page: currentCodePage,
          page_size: pageSize
        });
        if (statusFilter) params.append('status', statusFilter);
        if (durationMin) params.append('duration_min', durationMin);
        if (durationMax) params.append('duration_max', durationMax);
        if (expiredFrom) params.append('expired_from', expiredFrom);
        if (expiredTo) params.append('expired_to', expiredTo);
        if (activatedFrom) params.append('activated_from', activatedFrom);
        if (activatedTo) params.append('activated_to', activatedTo);
        if (remarkFilter) params.append('remark', remarkFilter);
        url += '?' + params.toString();
        const data = await apiRequest(url, { showLoading: false });
        const codeList = data.results || [];
        const pagination = data.pagination || {};
        totalCodePages = pagination.total_pages || 1;
        totalCodes = pagination.total || 0;
        const tbody = document.getElementById('codesTable');
        if (!codeList || codeList.length === 0) {
          tbody.innerHTML = '<tr><td colspan="8" class="empty-state">\u6682\u65E0\u5361\u5BC6</td></tr>';
        } else {
          const statusMap = {
            'unused': { text: '\u672A\u4F7F\u7528', class: 'badge-warning' },
            'active': { text: '\u6D3B\u8DC3', class: 'badge-success' },
            'disabled': { text: '\u7981\u7528', class: 'badge-danger' }
          };
          tbody.innerHTML = codeList.map(code => {
            const status = statusMap[code.status] || { text: code.status, class: 'badge-warning' };
            return \`
              <tr>
                <td><span class="code-display">\${escapeHtml(code.code)}</span></td>
                <td><span class="badge \${status.class}">\${status.text}</span></td>
                <td>\${code.duration_days}</td>
                <td>\${code.max_ips || 3}</td>
                <td>\${code.activated_at ? new Date(code.activated_at).toLocaleString('zh-CN', { timeZone: window.TIMEZONE || 'Asia/Shanghai' }) : '-'}</td>
                <td>\${code.expired_at ? new Date(code.expired_at).toLocaleString('zh-CN', { timeZone: window.TIMEZONE || 'Asia/Shanghai' }) : '-'}</td>
                <td>\${escapeHtml(code.remark || '-')}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn btn-sm" onclick="editCode('\${code.code}')">\u7F16\u8F91</button>
                  </div>
                </td>
              </tr>
            \`;
          }).join('');
        }
        renderCodePagination();
      } catch (error) {
        console.error('\u52A0\u8F7D\u5361\u5BC6\u5931\u8D25:', error);
      } finally {
        hideLoading();
      }
    }

    function resetCodePage() {
      currentCodePage = 1;
      loadCodes();
    }

    function goToCodePage(page) {
      if (page >= 1 && page <= totalCodePages) {
        currentCodePage = page;
        loadCodes();
      }
    }

    function renderCodePagination() {
      const container = document.getElementById('codePagination');
      if (totalCodePages <= 1) {
        container.innerHTML = '';
        return;
      }
      let html = \`<span class="pagination-info">\u5171 \${totalCodes} \u4E2A\u5361\u5BC6\uFF0C\u7B2C \${currentCodePage}/\${totalCodePages} \u9875</span>\`;
      html += \`<button onclick="goToCodePage(1)" \${currentCodePage === 1 ? 'disabled' : ''}>\u9996\u9875</button>\`;
      html += \`<button onclick="goToCodePage(\${currentCodePage - 1})" \${currentCodePage === 1 ? 'disabled' : ''}>\u4E0A\u4E00\u9875</button>\`;
      const maxButtons = 5;
      let startPage = Math.max(1, currentCodePage - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalCodePages, startPage + maxButtons - 1);
      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }
      for (let i = startPage; i <= endPage; i++) {
        html += \`<button onclick="goToCodePage(\${i})" class="\${i === currentCodePage ? 'active' : ''}">\${i}</button>\`;
      }
      html += \`<button onclick="goToCodePage(\${currentCodePage + 1})" \${currentCodePage === totalCodePages ? 'disabled' : ''}>\u4E0B\u4E00\u9875</button>\`;
      html += \`<button onclick="goToCodePage(\${totalCodePages})" \${currentCodePage === totalCodePages ? 'disabled' : ''}>\u672B\u9875</button>\`;
      container.innerHTML = html;
    }

    function toggleAdvancedFilter() {
      const panel = document.getElementById('advancedFilterPanel');
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    function clearCodeFilters() {
      document.getElementById('codeStatusFilter').value = '';
      document.getElementById('durationMin').value = '';
      document.getElementById('durationMax').value = '';
      document.getElementById('expiredFrom').value = '';
      document.getElementById('expiredTo').value = '';
      document.getElementById('activatedFrom').value = '';
      document.getElementById('activatedTo').value = '';
      document.getElementById('remarkFilter').value = '';
      resetCodePage();
    }

    async function exportCodesCSV() {
      try {
        showLoading();
        let url = '/codes?action=export';
        const params = new URLSearchParams();
        const statusFilter = document.getElementById('codeStatusFilter').value;
        const durationMin = document.getElementById('durationMin').value;
        const durationMax = document.getElementById('durationMax').value;
        const expiredFrom = document.getElementById('expiredFrom').value;
        const expiredTo = document.getElementById('expiredTo').value;
        const activatedFrom = document.getElementById('activatedFrom').value;
        const activatedTo = document.getElementById('activatedTo').value;
        const remarkFilter = document.getElementById('remarkFilter').value.trim();

        if (statusFilter) params.append('status', statusFilter);
        if (durationMin) params.append('duration_min', durationMin);
        if (durationMax) params.append('duration_max', durationMax);
        if (expiredFrom) params.append('expired_from', expiredFrom);
        if (expiredTo) params.append('expired_to', expiredTo);
        if (activatedFrom) params.append('activated_from', activatedFrom);
        if (activatedTo) params.append('activated_to', activatedTo);
        if (remarkFilter) params.append('remark', remarkFilter);

        if (params.toString()) {
          url += '&' + params.toString();
        }

        const response = await fetch(API_BASE + url, {
          headers: { 'X-Admin-Key': adminKey }
        });

        if (!response.ok) {
          throw new Error('\u5BFC\u51FA\u5931\u8D25');
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'codes_export_' + new Date().toISOString().slice(0, 10) + '.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
        showToast('\u5BFC\u51FA\u6210\u529F', 'success');
      } catch (error) {
        console.error('\u5BFC\u51FA\u5931\u8D25:', error);
        showToast('\u5BFC\u51FA\u5931\u8D25: ' + error.message, 'error');
      } finally {
        hideLoading();
      }
    }

    function showGenerateCodeModal() {
      document.getElementById('generateCount').value = 1;
      document.getElementById('generateDuration').value = 30;
      document.getElementById('generateMaxIps').value = 3;
      document.getElementById('generateRemark').value = '';
      document.getElementById('generateCodeModal').classList.add('active');
    }

    function closeGenerateCodeModal() {
      document.getElementById('generateCodeModal').classList.remove('active');
    }

    async function generateCodes() {
      const count = parseInt(document.getElementById('generateCount').value);
      const durationDays = parseInt(document.getElementById('generateDuration').value);
      const maxIps = parseInt(document.getElementById('generateMaxIps').value);
      const remark = document.getElementById('generateRemark').value.trim();

      if (!count || count < 1 || count > 100) {
        showToast('\u751F\u6210\u6570\u91CF\u5FC5\u987B\u57281-100\u4E4B\u95F4', 'error');
        return;
      }

      try {
        const result = await apiRequest('/codes', {
          method: 'POST',
          body: JSON.stringify({ count, duration_days: durationDays, max_ips: maxIps, remark })
        });

        if (result.success && result.codes) {
          showGeneratedCodes(result.codes);
          closeGenerateCodeModal();
          showToast('\u6210\u529F\u751F\u6210 ' + result.codes.length + ' \u4E2A\u5361\u5BC6', 'success');
          loadCodes();
        } else {
          showToast('\u751F\u6210\u5361\u5BC6\u5931\u8D25', 'error');
        }
      } catch (error) {
        showToast('\u751F\u6210\u5361\u5BC6\u5931\u8D25: ' + error.error, 'error');
      }
    }

    function showGeneratedCodes(codes) {
      const container = document.getElementById('generatedCodesList');
      container.innerHTML = \`<h4>\u5171\u751F\u6210 \${codes.length} \u4E2A\u5361\u5BC6</h4>\` +
        codes.map(c => \`
          <div class="generated-codes-item">
            <span class="code-display">\${escapeHtml(c.code)}</span>
            <span>\${escapeHtml(c.remark || '\u65E0\u5907\u6CE8')}</span>
          </div>
        \`).join('');
      document.getElementById('codeResultModal').classList.add('active');
    }

    function closeCodeResultModal() {
      document.getElementById('codeResultModal').classList.remove('active');
    }

    function editCode(code) {
      apiRequest('/codes?code=' + encodeURIComponent(code)).then(targetCode => {
        if (targetCode) {
          document.getElementById('editCode').value = targetCode.code;
          document.getElementById('editStatus').value = targetCode.status;
          document.getElementById('editRemark').value = targetCode.remark || '';
          document.getElementById('codeEditModal').classList.add('active');
        }
      });
    }

    function closeCodeEditModal() {
      document.getElementById('codeEditModal').classList.remove('active');
    }

    async function saveCodeEdit() {
      const code = document.getElementById('editCode').value;
      const status = document.getElementById('editStatus').value;
      const remark = document.getElementById('editRemark').value.trim();

      try {
        await apiRequest('/codes', {
          method: 'PUT',
          body: JSON.stringify({ code, status, remark })
        });
        showToast('\u5361\u5BC6\u66F4\u65B0\u6210\u529F', 'success');
        closeCodeEditModal();
        loadCodes();
      } catch (error) {
        showToast('\u66F4\u65B0\u5931\u8D25: ' + error.error, 'error');
      }
    }

    function showImportCodeModal() {
      document.getElementById('importFile').value = '';
      document.getElementById('fileInfo').style.display = 'none';
      document.getElementById('importCodeModal').classList.add('active');
    }

    function closeImportCodeModal() {
      document.getElementById('importCodeModal').classList.remove('active');
    }

    function handleImportFileSelect() {
      const fileInput = document.getElementById('importFile');
      const fileInfo = document.getElementById('fileInfo');
      const fileName = document.getElementById('fileName');

      if (fileInput.files && fileInput.files[0]) {
        fileName.textContent = '\u5DF2\u9009\u62E9: ' + fileInput.files[0].name + ' (' + formatFileSize(fileInput.files[0].size) + ')';
        fileInfo.style.display = 'block';
      } else {
        fileInfo.style.display = 'none';
      }
    }

    function formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    async function importCodesFromCSV() {
      const fileInput = document.getElementById('importFile');

      if (!fileInput.files || !fileInput.files[0]) {
        showToast('\u8BF7\u9009\u62E9CSV\u6587\u4EF6', 'error');
        return;
      }

      try {
        showLoading();
        const file = fileInput.files[0];
        const text = await file.text();
        const lines = text.split('\\n').map(line => line.trim()).filter(line => line);

        if (lines.length < 2) {
          showToast('CSV\u6587\u4EF6\u5185\u5BB9\u4E3A\u7A7A\u6216\u683C\u5F0F\u4E0D\u6B63\u786E', 'error');
          hideLoading();
          return;
        }

        const skipDuplicates = document.getElementById('skipDuplicates').checked;
        const updateExisting = document.getElementById('updateExisting').checked;

        const codes = [];
        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;
        const errors = [];

        for (let i = 1; i < lines.length; i++) {
          const parts = parseCSVLine(lines[i]);

          if (parts.length < 2) {
            errorCount++;
            errors.push('Row ' + (i + 1) + ': Format error, need at least 2 columns');
            continue;
          }

          const code = parts[0].trim();
          const durationDays = parseInt(parts[1]);
          const activatedAt = parts[2] ? parts[2].trim() : null;
          const expiredAt = parts[3] ? parts[3].trim() : null;
          const remark = parts[4] ? parts[4].trim() : '';

          if (!code || isNaN(durationDays)) {
            errorCount++;
            errors.push('Row ' + (i + 1) + ': Invalid code or duration format');
            continue;
          }

          codes.push({
            code,
            duration_days: durationDays,
            activated_at: activatedAt,
            expired_at: expiredAt,
            remark
          });
        }

        if (codes.length === 0) {
          showToast('\u6CA1\u6709\u6709\u6548\u7684\u5361\u5BC6\u6570\u636E', 'error');
          hideLoading();
          return;
        }

        const result = await apiRequest('/codes?action=import', {
          method: 'POST',
          body: JSON.stringify({
            codes,
            skip_duplicates: skipDuplicates,
            update_existing: updateExisting
          }),
          showLoading: false
        });

        if (result.success) {
          successCount = result.imported || 0;
          skipCount = result.skipped || 0;
          errorCount = result.errors || 0;

          let message = '\u5BFC\u5165\u5B8C\u6210: ';
          message += '\u6210\u529F ' + successCount + ' \u6761';
          if (skipCount > 0) message += ', \u8DF3\u8FC7 ' + skipCount + ' \u6761';
          if (errorCount > 0) message += ', \u5931\u8D25 ' + errorCount + ' \u6761';

          showToast(message, successCount > 0 ? 'success' : 'error');
          closeImportCodeModal();
          loadCodes();
        } else {
          showToast('\u5BFC\u5165\u5931\u8D25: ' + (result.error || '\u672A\u77E5\u9519\u8BEF'), 'error');
        }
      } catch (error) {
        console.error('\u5BFC\u5165\u5931\u8D25:', error);
        showToast('\u5BFC\u5165\u5931\u8D25: ' + (error.error || error.message), 'error');
      } finally {
        hideLoading();
      }
    }

    function parseCSVLine(line) {
      const result = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current);
          current = '';
        } else {
          current += char;
        }
      }

      result.push(current);
      return result;
    }

    async function clearCodes() {
      if (!confirm('\u786E\u5B9A\u8981\u6E05\u7A7A\u6240\u6709\u5361\u5BC6\u6570\u636E\u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u6062\u590D\uFF01')) return;

      try {
        showLoading();
        const result = await apiRequest('/codes', {
          method: 'DELETE'
        });
        showToast(result.message || '\u6E05\u7A7A\u6210\u529F', 'success');
        loadCodes();
      } catch (error) {
        showToast('\u6E05\u7A7A\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function loadSecurityConfig() {
      try {
        showLoading();
        const data = await apiRequest('/security/config', { showLoading: false });

        if (data.success && data.config) {
          document.getElementById('securityConfigForm').style.display = 'block';
          document.getElementById('noSecurityConfig').style.display = 'none';

          document.getElementById('channelDailyLimit').value = data.config.channel_daily_limit;
          document.getElementById('banDurationDays').value = data.config.ban_duration_days;
          document.getElementById('autoBanOnExceed').checked = data.config.auto_ban_on_exceed;
        } else {
          showToast('\u52A0\u8F7D\u914D\u7F6E\u5931\u8D25', 'error');
        }
      } catch (error) {
        showToast('\u52A0\u8F7D\u914D\u7F6E\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function saveSecurityConfig() {
      try {
        showLoading();
        const config = {
          channel_daily_limit: parseInt(document.getElementById('channelDailyLimit').value),
          ban_duration_days: parseInt(document.getElementById('banDurationDays').value),
          auto_ban_on_exceed: document.getElementById('autoBanOnExceed').checked
        };

        if (config.channel_daily_limit < 1 || config.channel_daily_limit > 10000) {
          showToast('\u64AD\u653E\u6B21\u6570\u9650\u5236\u5FC5\u987B\u57281-10000\u4E4B\u95F4', 'error');
          hideLoading();
          return;
        }

        if (config.ban_duration_days < 0 || config.ban_duration_days > 365) {
          showToast('\u5C01\u7981\u65F6\u957F\u5FC5\u987B\u57280-365\u4E4B\u95F4', 'error');
          hideLoading();
          return;
        }

        const result = await apiRequest('/security/config', {
          method: 'POST',
          body: JSON.stringify(config),
          showLoading: false
        });

        if (result.success) {
          showToast('\u914D\u7F6E\u5DF2\u4FDD\u5B58', 'success');
        } else {
          showToast('\u4FDD\u5B58\u914D\u7F6E\u5931\u8D25: ' + (result.error || '\u672A\u77E5\u9519\u8BEF'), 'error');
        }
      } catch (error) {
        showToast('\u4FDD\u5B58\u914D\u7F6E\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function resetSecurityConfig() {
      if (!confirm('\u786E\u5B9A\u8981\u91CD\u7F6E\u4E3A\u9ED8\u8BA4\u914D\u7F6E\u5417\uFF1F\\n\u9ED8\u8BA4\uFF1A\u6BCF\u4E2A\u9891\u9053100\u6B21/\u5929\uFF0C\u5C01\u79817\u5929')) {
        return;
      }

      document.getElementById('channelDailyLimit').value = 100;
      document.getElementById('banDurationDays').value = 7;
      document.getElementById('autoBanOnExceed').checked = true;

      await saveSecurityConfig();
    }

    async function loadQuotaInfo() {
      const code = document.getElementById('quotaCode').value.trim();
      if (!code) {
        showToast('\u8BF7\u8F93\u5165\u5361\u5BC6', 'error');
        return;
      }

      try {
        showLoading();
        const quotaUrl = '/security/quota?code=' + encodeURIComponent(code);
        const data = await apiRequest(quotaUrl, { showLoading: false });

        document.getElementById('quotaInfo').style.display = 'block';
        document.getElementById('noQuotaData').style.display = 'none';

        // \u66F4\u65B0\u7EDF\u8BA1\u6570\u636E
        document.getElementById('quotaTotalPlays').textContent = data.total_plays || 0;
        document.getElementById('quotaExceededCount').textContent = data.exceeded_channels_count || 0;

        // \u66F4\u65B0\u72B6\u6001
        const banStatus = document.getElementById('quotaBanStatus');
        const banTimeEl = document.getElementById('quotaBanTime');
        const banAlert = document.getElementById('banAlert');

        if (data.is_banned) {
          banStatus.innerHTML = '<div class="stat-value" style="color:#ff3b30;">\u5DF2\u5C01\u7981</div><div class="stat-label">\u72B6\u6001</div>';
          const timezone = window.TIMEZONE || 'Asia/Shanghai';
          const banInfo = data.banned_until ? ' \u81F3 ' + new Date(data.banned_until).toLocaleString('zh-CN', { timeZone: timezone }) : '';
          banTimeEl.textContent = (data.banned_at ? new Date(data.banned_at).toLocaleString('zh-CN', { timeZone: timezone }) : '-') + banInfo;
          banAlert.style.display = 'block';

          // \u66F4\u65B0\u5C01\u7981\u8BE6\u7EC6\u4FE1\u606F
          document.getElementById('banLimitText').textContent = data.channel_daily_limit || '\u672A\u77E5';
          document.getElementById('banDurationText').textContent = data.ban_duration_days === 0 ? '\u6C38\u4E45' : (data.ban_duration_days + '\u5929');
          document.getElementById('banUntilText').textContent = data.banned_until ? new Date(data.banned_until).toLocaleString('zh-CN', { timeZone: timezone }) : '\u6C38\u4E45';
        } else {
          banStatus.innerHTML = '<div class="stat-value" style="color:#34c759;">\u6B63\u5E38</div><div class="stat-label">\u72B6\u6001</div>';
          banTimeEl.textContent = '-';
          banAlert.style.display = 'none';
        }

        // \u663E\u793A\u9891\u9053\u64AD\u653E\u8BE6\u60C5
        const channelPlaysSection = document.getElementById('channelPlaysSection');
        const channelPlaysTable = document.getElementById('channelPlaysTable');

        console.log('Quota data:', data);
        console.log('Channel plays section:', channelPlaysSection);
        console.log('Channel plays table:', channelPlaysTable);
        console.log('Channel plays:', data.details?.channelPlays);

        if (!channelPlaysSection || !channelPlaysTable) {
          console.error('DOM elements not found');
          return;
        }

        const channelPlays = data.details?.channelPlays || {};
        const channelNames = data.channel_names || {};

        if (Object.keys(channelPlays).length > 0) {
          channelPlaysSection.style.display = 'block';

          // \u83B7\u53D6\u5F53\u524D\u914D\u7F6E\u7684\u64AD\u653E\u6B21\u6570\u9650\u5236
          const dailyLimit = data.channel_daily_limit || 100;

          const tableRows = Object.entries(channelPlays)
            .sort((a, b) => b[1] - a[1]) // \u6309\u64AD\u653E\u6B21\u6570\u964D\u5E8F\u6392\u5217
            .map(([hash, count]) => {
              const isExceeded = count >= dailyLimit;
              const statusBadge = isExceeded
                ? '<span class="badge badge-danger">\u8D85\u9650</span>'
                : '<span class="badge badge-success">\u6B63\u5E38</span>';
              const channelName = channelNames[hash] || hash; // \u5982\u679C\u627E\u4E0D\u5230\u540D\u79F0\uFF0C\u663E\u793Ahash
              return '<tr>' +
                '<td>' + escapeHtml(channelName) + '</td>' +
                '<td>' + count + '</td>' +
                '<td>' + statusBadge + '</td>' +
                '</tr>';
            }).join('');

          channelPlaysTable.innerHTML = tableRows || '<tr><td colspan="3" class="empty-state">\u6682\u65E0\u64AD\u653E\u6570\u636E</td></tr>';
        } else {
          channelPlaysSection.style.display = 'none';
        }
      } catch (error) {
        showToast('\u52A0\u8F7D\u989D\u5EA6\u4FE1\u606F\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function unbanCode() {
      const code = document.getElementById('quotaCode').value.trim();
      if (!code) {
        showToast('\u8BF7\u8F93\u5165\u5361\u5BC6', 'error');
        return;
      }

      if (!confirm('\u786E\u5B9A\u8981\u89E3\u5C01\u8BE5\u5361\u5BC6\u5417\uFF1F\u89E3\u5C01\u540E\u5361\u5BC6\u5C06\u6062\u590D\u6B63\u5E38\u4F7F\u7528\u3002')) {
        return;
      }

      try {
        showLoading();
        const result = await apiRequest('/security/unban', {
          method: 'POST',
          body: JSON.stringify({ code }),
          showLoading: false
        });

        if (result.success) {
          showToast('\u5361\u5BC6\u5DF2\u89E3\u5C01', 'success');
          loadQuotaInfo();
          // \u5237\u65B0\u5361\u5BC6\u5217\u8868\u4EE5\u66F4\u65B0\u72B6\u6001
          loadCodes();
        } else {
          showToast('\u89E3\u5C01\u5931\u8D25: ' + (result.error || '\u672A\u77E5\u9519\u8BEF'), 'error');
        }
      } catch (error) {
        showToast('\u89E3\u5C01\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    // \u52A0\u8F7D\u5C01\u7981\u5361\u5BC6\u5217\u8868
    async function loadBannedCodes() {
      try {
        showLoading();
        const data = await apiRequest('/security/banned-codes', { showLoading: false });
        const tbody = document.getElementById('bannedCodesTable');
        const noDataDiv = document.getElementById('noBannedCodes');

        if (!data.codes || data.codes.length === 0) {
          tbody.innerHTML = '';
          noDataDiv.style.display = 'block';
          return;
        }

        noDataDiv.style.display = 'none';
        const timezone = window.TIMEZONE || 'Asia/Shanghai';
        const statusMap = {
          'active': { text: '\u6D3B\u8DC3', class: 'badge-success' },
          'disabled': { text: '\u7981\u7528', class: 'badge-danger' }
        };

        tbody.innerHTML = data.codes.map(code => {
          const status = statusMap[code.status] || { text: code.status, class: 'badge-warning' };
          const isExpired = code.banned_until && new Date(code.banned_until) <= new Date();
          return \`
            <tr>
              <td><span class="code-display">\${escapeHtml(code.code)}</span></td>
              <td><span class="badge \${status.class}">\${status.text}</span></td>
              <td>\${code.duration_days}</td>
              <td>\${code.activated_at ? new Date(code.activated_at).toLocaleString('zh-CN', { timeZone: timezone }) : '-'}</td>
              <td>\${code.expired_at ? new Date(code.expired_at).toLocaleString('zh-CN', { timeZone: timezone }) : '-'}</td>
              <td>
                \${code.banned_until
                  ? (isExpired
                    ? '<span style="color:#ff3b30;">\u5DF2\u8FC7\u671F</span>'
                    : new Date(code.banned_until).toLocaleString('zh-CN', { timeZone: timezone })
                  )
                  : '-'}
              </td>
              <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="\${escapeHtml(code.remark || '')}">
                \${escapeHtml(code.remark || '-')}
              </td>
              <td>
                <button class="btn btn-sm btn-success" onclick="unbanCodeFromList('\${escapeHtml(code.code)}')">\u89E3\u5C01</button>
              </td>
            </tr>
          \`;
        }).join('');
      } catch (error) {
        console.error('\u52A0\u8F7D\u5C01\u7981\u5361\u5BC6\u5931\u8D25:', error);
        showToast('\u52A0\u8F7D\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    // \u4ECE\u5217\u8868\u89E3\u5C01\u5361\u5BC6
    async function unbanCodeFromList(code) {
      if (!confirm('\u786E\u5B9A\u8981\u89E3\u5C01\u5361\u5BC6 ' + code + ' \u5417\uFF1F')) {
        return;
      }

      try {
        showLoading();
        const result = await apiRequest('/security/unban', {
          method: 'POST',
          body: JSON.stringify({ code }),
          showLoading: false
        });

        if (result.success) {
          showToast('\u5361\u5BC6\u5DF2\u89E3\u5C01', 'success');
          loadBannedCodes(); // \u5237\u65B0\u5C01\u7981\u5217\u8868
          loadCodes(); // \u5237\u65B0\u5361\u5BC6\u5217\u8868
        } else {
          showToast('\u89E3\u5C01\u5931\u8D25: ' + (result.error || '\u672A\u77E5\u9519\u8BEF'), 'error');
        }
      } catch (error) {
        showToast('\u89E3\u5C01\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    function showToast(message, type = 'success') {
      const toast = document.createElement('div');
      toast.className = 'toast ' + type;
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }

    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F', 'success');
      }).catch(err => {
        // \u5907\u7528\u65B9\u6848\uFF1A\u4F7F\u7528 textarea
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F', 'success');
      });
    }

    function formatHeaders(headersStr) {
      if (!headersStr || headersStr === '{}') return '-';

      try {
        const headers = JSON.parse(headersStr);
        const tags = [];

        if (headers['User-Agent']) {
          let ua = headers['User-Agent'];
          if (ua.length > 20) {
            ua = ua.substring(0, 20) + '...';
          }
          tags.push(\`<span class="headers-tag" title="\${escapeHtml(headers['User-Agent'])}">UA: \${escapeHtml(ua)}</span>\`);
        }

        if (headers['Referer']) {
          let referer = headers['Referer'];
          if (referer.length > 20) {
            referer = referer.substring(0, 20) + '...';
          }
          tags.push(\`<span class="headers-tag" title="\${escapeHtml(headers['Referer'])}">Ref: \${escapeHtml(referer)}</span>\`);
        }

        return tags.join('');
      } catch (e) {
        return headersStr;
      }
    }

    function escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // IP\u9ED1\u540D\u5355\u7BA1\u7406
    async function loadIPBlacklist() {
      try {
        showLoading();
        const data = await apiRequest('/ip-blacklist', { showLoading: false });
        const tbody = document.getElementById('ipBlacklistTable');
        const noDataDiv = document.getElementById('noIPBlacklist');

        if (!data.ips || data.ips.length === 0) {
          tbody.innerHTML = '';
          noDataDiv.style.display = 'block';
          return;
        }

        noDataDiv.style.display = 'none';
        const timezone = window.TIMEZONE || 'Asia/Shanghai';

        tbody.innerHTML = data.ips.map(item => \`
          <tr>
            <td><span class="code-display">\${escapeHtml(item.ip)}</span></td>
            <td>\${item.bannedAt ? new Date(item.bannedAt).toLocaleString('zh-CN', { timeZone: timezone }) : '-'}</td>
            <td>\${escapeHtml(item.reason)}</td>
            <td>\${item.details ? '<button class="btn btn-sm" onclick="showIPDetails(\\\`' + JSON.stringify(item).replace(/"/g, '&quot;') + '\\\`)">\u67E5\u770B</button>' : '-'}</td>
            <td>
              <button class="btn btn-sm btn-success" onclick="unbanIP('\${escapeHtml(item.ip)}')">\u89E3\u5C01</button>
            </td>
          </tr>
        \`).join('');

        document.getElementById('statBannedIPs').textContent = data.count || 0;
      } catch (error) {
        console.error('\u52A0\u8F7DIP\u9ED1\u540D\u5355\u5931\u8D25:', error);
        showToast('\u52A0\u8F7D\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function unbanIP(ip) {
      if (!confirm('\u786E\u5B9A\u8981\u89E3\u5C01IP ' + ip + ' \u5417\uFF1F')) {
        return;
      }

      try {
        showLoading();
        const result = await apiRequest('/ip-blacklist/remove?ip=' + encodeURIComponent(ip), {
          method: 'DELETE',
          showLoading: false
        });

        if (result.success) {
          showToast('IP\u5DF2\u89E3\u5C01', 'success');
          loadIPBlacklist();
        } else {
          showToast('\u89E3\u5C01\u5931\u8D25: ' + (result.error || '\u672A\u77E5\u9519\u8BEF'), 'error');
        }
      } catch (error) {
        showToast('\u89E3\u5C01\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function manualBanIP() {
      const ip = document.getElementById('manualBanIP').value.trim();
      const reason = document.getElementById('manualBanReason').value.trim();

      if (!ip) {
        showToast('\u8BF7\u8F93\u5165IP\u5730\u5740', 'error');
        return;
      }

      if (!reason) {
        showToast('\u8BF7\u8F93\u5165\u5C01\u7981\u539F\u56E0', 'error');
        return;
      }

      try {
        showLoading();
        const result = await apiRequest('/ip-blacklist/ban', {
          method: 'POST',
          body: JSON.stringify({ ip, reason }),
          showLoading: false
        });

        if (result.success) {
          showToast('IP\u5DF2\u5C01\u7981', 'success');
          document.getElementById('manualBanIP').value = '';
          document.getElementById('manualBanReason').value = '';
          loadIPBlacklist();
        } else {
          showToast('\u5C01\u7981\u5931\u8D25: ' + (result.error || '\u672A\u77E5\u9519\u8BEF'), 'error');
        }
      } catch (error) {
        showToast('\u5C01\u7981\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    function showIPDetails(item) {
      const details = item.details || {};
      let detailsText = '\u5C01\u7981IP\uFF1A' + item.ip + '\\n';
      detailsText += '\u5C01\u7981\u65F6\u95F4\uFF1A' + (item.bannedAt || '-') + '\\n';
      detailsText += '\u5C01\u7981\u539F\u56E0\uFF1A' + item.reason + '\\n\\n';
      detailsText += '\u8BE6\u7EC6\u4FE1\u606F\uFF1A\\n';
      for (const [key, value] of Object.entries(details)) {
        detailsText += key + ': ' + value + '\\n';
      }
      alert(detailsText);
    }

    // IP\u9ED1\u540D\u5355\u914D\u7F6E\u7BA1\u7406
    async function loadIPBlacklistConfig() {
      try {
        showLoading();
        const data = await apiRequest('/ip-blacklist-config', { showLoading: false });

        if (data.success && data.config) {
          document.getElementById('ipBlacklistConfigForm').style.display = 'block';
          document.getElementById('noIPBlacklistConfig').style.display = 'none';

          document.getElementById('subRateMin').value = data.config.sub_rate_min || 1;
          document.getElementById('subRateHour').value = data.config.sub_rate_hour || 60;
          document.getElementById('subRateDay').value = data.config.sub_rate_day || 500;
          document.getElementById('liveRateMin').value = data.config.live_rate_min || 5;
          document.getElementById('liveRateHour').value = data.config.live_rate_hour || 300;
          document.getElementById('liveRateDay').value = data.config.live_rate_day || 2000;
          document.getElementById('adminRateHour').value = data.config.admin_rate_hour || 10;
        } else {
          showToast('\u52A0\u8F7D\u914D\u7F6E\u5931\u8D25', 'error');
        }
      } catch (error) {
        showToast('\u52A0\u8F7D\u914D\u7F6E\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function saveIPBlacklistConfig() {
      try {
        showLoading();
        const config = {
          sub_rate_min: parseInt(document.getElementById('subRateMin').value),
          sub_rate_hour: parseInt(document.getElementById('subRateHour').value),
          sub_rate_day: parseInt(document.getElementById('subRateDay').value),
          live_rate_min: parseInt(document.getElementById('liveRateMin').value),
          live_rate_hour: parseInt(document.getElementById('liveRateHour').value),
          live_rate_day: parseInt(document.getElementById('liveRateDay').value),
          admin_rate_hour: parseInt(document.getElementById('adminRateHour').value)
        };

        // \u9A8C\u8BC1\u914D\u7F6E\u503C
        if (config.sub_rate_min < 1 || config.sub_rate_min > 60) {
          showToast('\u8BA2\u9605\u6BCF\u5206\u949F\u9650\u5236\u5FC5\u987B\u57281-60\u4E4B\u95F4', 'error');
          hideLoading();
          return;
        }
        if (config.sub_rate_hour < 1 || config.sub_rate_hour > 10000) {
          showToast('\u8BA2\u9605\u6BCF\u5C0F\u65F6\u9650\u5236\u5FC5\u987B\u57281-10000\u4E4B\u95F4', 'error');
          hideLoading();
          return;
        }
        if (config.sub_rate_day < 1 || config.sub_rate_day > 100000) {
          showToast('\u8BA2\u9605\u6BCF\u5929\u9650\u5236\u5FC5\u987B\u57281-100000\u4E4B\u95F4', 'error');
          hideLoading();
          return;
        }

        if (config.live_rate_min < 1 || config.live_rate_min > 60) {
          showToast('\u64AD\u653E\u6BCF\u5206\u949F\u9650\u5236\u5FC5\u987B\u57281-60\u4E4B\u95F4', 'error');
          hideLoading();
          return;
        }
        if (config.live_rate_hour < 1 || config.live_rate_hour > 10000) {
          showToast('\u64AD\u653E\u6BCF\u5C0F\u65F6\u9650\u5236\u5FC5\u987B\u57281-10000\u4E4B\u95F4', 'error');
          hideLoading();
          return;
        }
        if (config.live_rate_day < 1 || config.live_rate_day > 100000) {
          showToast('\u64AD\u653E\u6BCF\u5929\u9650\u5236\u5FC5\u987B\u57281-100000\u4E4B\u95F4', 'error');
          hideLoading();
          return;
        }

        if (config.admin_rate_hour < 1 || config.admin_rate_hour > 1000) {
          showToast('\u7BA1\u7406\u6BCF\u5C0F\u65F6\u9650\u5236\u5FC5\u987B\u57281-1000\u4E4B\u95F4', 'error');
          hideLoading();
          return;
        }

        const result = await apiRequest('/ip-blacklist-config', {
          method: 'POST',
          body: JSON.stringify(config),
          showLoading: false
        });

        if (result.success) {
          showToast('\u914D\u7F6E\u5DF2\u4FDD\u5B58', 'success');
        } else {
          showToast('\u4FDD\u5B58\u914D\u7F6E\u5931\u8D25: ' + (result.error || '\u672A\u77E5\u9519\u8BEF'), 'error');
        }
      } catch (error) {
        showToast('\u4FDD\u5B58\u914D\u7F6E\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function resetIPBlacklistConfig() {
      if (!confirm('\u786E\u5B9A\u8981\u91CD\u7F6E\u4E3A\u9ED8\u8BA4\u914D\u7F6E\u5417\uFF1F\\n\u8BA2\u9605\uFF1A\u6BCF\u5206\u949F1\u6B21\uFF0C\u6BCF\u5C0F\u65F660\u6B21\uFF0C\u6BCF\u5929500\u6B21\\n\u64AD\u653E\uFF1A\u6BCF\u5206\u949F5\u6B21\uFF0C\u6BCF\u5C0F\u65F6300\u6B21\uFF0C\u6BCF\u59292000\u6B21\\n\u7BA1\u7406\uFF1A\u6BCF\u5C0F\u65F610\u6B21')) {
        return;
      }

      document.getElementById('subRateMin').value = 1;
      document.getElementById('subRateHour').value = 60;
      document.getElementById('subRateDay').value = 500;
      document.getElementById('liveRateMin').value = 5;
      document.getElementById('liveRateHour').value = 300;
      document.getElementById('liveRateDay').value = 2000;
      document.getElementById('adminRateHour').value = 10;

      await saveIPBlacklistConfig();
    }

    // \u9996\u9875\u5C55\u793A\u914D\u7F6E\u7BA1\u7406
    let homepageConfig = {
      sources: [],
      groups: [],
      hosts: [],
      hasHeaders: null,
      manualHosts: [] // \u8DDF\u8E2A\u624B\u52A8\u6DFB\u52A0\u7684\u57DF\u540D
    };

    async function loadHomepageDisplayConfig() {
      try {
        showLoading();
        const data = await apiRequest('/homepage-display', { showLoading: false });

        if (data.success) {
          homepageConfig = data.config;

          // \u517C\u5BB9\u65E7\u6570\u636E\uFF1A\u5C06\u5B57\u7B26\u4E32\u7684hasHeaders\u8F6C\u6362\u4E3A\u5E03\u5C14\u503C
          if (typeof homepageConfig.hasHeaders === 'string') {
            if (homepageConfig.hasHeaders === 'null') {
              homepageConfig.hasHeaders = null;
            } else if (homepageConfig.hasHeaders === 'true') {
              homepageConfig.hasHeaders = true;
            } else if (homepageConfig.hasHeaders === 'false') {
              homepageConfig.hasHeaders = false;
            }
            console.log('[loadHomepageDisplayConfig] \u517C\u5BB9\u65E7\u6570\u636E\uFF0ChasHeaders\u4ECE\u5B57\u7B26\u4E32\u8F6C\u6362:', homepageConfig.hasHeaders);
          }

          // \u4FDD\u5B58\u7CFB\u7EDF\u8BC6\u522B\u7684\u57DF\u540D\uFF0C\u7528\u4E8E\u533A\u5206\u624B\u52A8\u6DFB\u52A0\u7684\u57DF\u540D
          homepageConfig.systemHosts = data.options.hosts || [];

          // \u786E\u4FDD manualHosts \u6570\u7EC4\u5B58\u5728
          if (!homepageConfig.manualHosts) {
            homepageConfig.manualHosts = [];
          }

          // \u5408\u5E76\u7CFB\u7EDF\u8BC6\u522B\u7684\u57DF\u540D\u548C\u624B\u52A8\u6DFB\u52A0\u7684\u57DF\u540D\uFF08\u53BB\u91CD\uFF09
          const allHosts = [...new Set([...homepageConfig.systemHosts, ...homepageConfig.manualHosts])];
          const optionsWithHosts = { ...data.options, hosts: allHosts };
          renderHomepageOptions(optionsWithHosts);
        } else {
          showToast('\u52A0\u8F7D\u914D\u7F6E\u5931\u8D25', 'error');
        }
      } catch (error) {
        showToast('\u52A0\u8F7D\u914D\u7F6E\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    function renderHomepageOptions(options) {
      // \u6E32\u67D3\u6570\u636E\u6E90\u9009\u9879
      const sourcesContainer = document.getElementById('sourceCheckboxes');
      if (options.sources && options.sources.length > 0) {
        sourcesContainer.innerHTML = options.sources.map(source => {
          const isChecked = homepageConfig.sources.includes(source.id) ? 'checked' : '';
          return \`
            <label style="display:flex;align-items:center;padding:8px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;transition:all .2s;">
              <input type="checkbox" value="\${source.id}" \${isChecked} onchange="updateHomepageConfig('sources', \${source.id}, this.checked)" style="margin-right:8px;">
              <span style="font-size:14px;">\${escapeHtml(source.name)}</span>
            </label>
          \`;
        }).join('');
      } else {
        sourcesContainer.innerHTML = '<div style="color:#86868b;">\u6682\u65E0\u6570\u636E\u6E90</div>';
      }

      // \u6E32\u67D3\u5206\u7C7B\u9009\u9879
      const groupsContainer = document.getElementById('groupCheckboxes');
      if (options.groups && options.groups.length > 0) {
        groupsContainer.innerHTML = options.groups.map(group => {
          const isChecked = homepageConfig.groups.includes(group) ? 'checked' : '';
          return \`
            <label style="display:flex;align-items:center;padding:8px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;transition:all .2s;">
              <input type="checkbox" value="\${escapeHtml(group)}" \${isChecked} onchange="updateHomepageConfig('groups', '\${escapeHtml(group)}', this.checked)" style="margin-right:8px;">
              <span style="font-size:14px;">\${escapeHtml(group)}</span>
            </label>
          \`;
        }).join('');
      } else {
        groupsContainer.innerHTML = '<div style="color:#86868b;">\u6682\u65E0\u5206\u7C7B</div>';
      }

      // \u6E32\u67D3host\u9009\u9879\uFF08\u53EA\u6E32\u67D3\u9009\u4E2D\u7684\u57DF\u540D\uFF09
      const hostsContainer = document.getElementById('hostCheckboxes');
      if (homepageConfig.hosts && homepageConfig.hosts.length > 0) {
        hostsContainer.innerHTML = homepageConfig.hosts.map(host => {
          const isChecked = true; // \u90FD\u5728 homepageConfig.hosts \u4E2D\uFF0C\u6240\u4EE5\u90FD\u662F\u9009\u4E2D\u72B6\u6001
          const isManual = !homepageConfig.systemHosts || !homepageConfig.systemHosts.includes(host);
          return \`
            <label style="display:flex;align-items:center;padding:8px;background:white;border:1px solid #e5e5ea;border-radius:6px;cursor:pointer;transition:all .2s;position:relative;">
              <input type="checkbox" value="\${escapeHtml(host)}" checked onchange="updateHomepageConfig('hosts', '\${escapeHtml(host)}', this.checked)" style="margin-right:8px;">
              <span style="font-size:14px;flex:1;">\${escapeHtml(host)}</span>
              \${isManual ? '<button onclick="event.stopPropagation();removeManualHost(\\\`' + escapeHtml(host) + '\\\`)" style="padding:2px 8px;font-size:11px;margin-left:8px;border:1px solid #ff3b30;background:white;color:#ff3b30;border-radius:4px;cursor:pointer;">\u5220\u9664</button>' : ''}
            </label>
          \`;
        }).join('');
      } else {
        hostsContainer.innerHTML = '<div style="color:#86868b;">\u6682\u65E0\u9009\u4E2D\u7684Host\uFF0C\u8BF7\u4ECE\u4E0B\u65B9\u6DFB\u52A0\u6216\u624B\u52A8\u8F93\u5165</div>';
      }

      // \u6E32\u67D3"\u662F\u5426\u542B\u6709\u8BF7\u6C42\u5934"\u9009\u9879
      const hasHeadersRadios = document.getElementsByName('hasHeaders');
      for (const radio of hasHeadersRadios) {
        if (homepageConfig.hasHeaders === null && radio.value === 'null') {
          radio.checked = true;
        } else if (homepageConfig.hasHeaders === true && radio.value === 'true') {
          radio.checked = true;
        } else if (homepageConfig.hasHeaders === false && radio.value === 'false') {
          radio.checked = true;
        }
      }
    }

    function updateHomepageConfig(type, value, checked) {
      if (type === 'hasHeaders') {
        // \u5C06\u5B57\u7B26\u4E32\u8F6C\u6362\u4E3A\u5E03\u5C14\u503C
        if (value === 'null') {
          homepageConfig.hasHeaders = null;
        } else if (value === 'true') {
          homepageConfig.hasHeaders = true;
        } else if (value === 'false') {
          homepageConfig.hasHeaders = false;
        } else {
          homepageConfig.hasHeaders = value;
        }
        console.log('[updateHomepageConfig] hasHeaders\u66F4\u65B0\u4E3A:', homepageConfig.hasHeaders, '\u539F\u59CB\u503C:', value);
      } else if (type === 'hosts') {
        if (checked) {
          if (!homepageConfig.hosts.includes(value)) {
            homepageConfig.hosts.push(value);
          }
        } else {
          // \u53D6\u6D88\u9009\u4E2D\uFF1A\u4ECE hosts \u4E2D\u79FB\u9664
          homepageConfig.hosts = homepageConfig.hosts.filter(item => item !== value);
          // \u5982\u679C\u662F\u624B\u52A8\u6DFB\u52A0\u7684\u57DF\u540D\uFF0C\u540C\u65F6\u4ECE manualHosts \u4E2D\u79FB\u9664
          if (homepageConfig.manualHosts && homepageConfig.manualHosts.includes(value)) {
            homepageConfig.manualHosts = homepageConfig.manualHosts.filter(item => item !== value);
          }
        }
      } else {
        if (checked) {
          if (!homepageConfig[type].includes(value)) {
            homepageConfig[type].push(value);
          }
        } else {
          homepageConfig[type] = homepageConfig[type].filter(item => item !== value);
        }
      }
    }

    function addManualHost() {
      const input = document.getElementById('manualHostInput');
      const host = input.value.trim();

      if (!host) {
        showToast('\u8BF7\u8F93\u5165\u57DF\u540D', 'error');
        return;
      }

      // \u9A8C\u8BC1\u57DF\u540D\u683C\u5F0F\uFF08\u7B80\u5355\u9A8C\u8BC1\uFF09
      const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?.)*[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
      if (!domainRegex.test(host)) {
        showToast('\u57DF\u540D\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u8BF7\u8F93\u5165\u6709\u6548\u7684\u57DF\u540D', 'error');
        return;
      }

      // \u68C0\u67E5\u662F\u5426\u5DF2\u5728\u914D\u7F6E\u4E2D\u5B58\u5728
      if (homepageConfig.hosts.includes(host)) {
        showToast('\u8BE5\u57DF\u540D\u5DF2\u5B58\u5728', 'error');
        return;
      }

      // \u6DFB\u52A0\u5230\u914D\u7F6E\u4E2D\u5E76\u81EA\u52A8\u9009\u4E2D
      homepageConfig.hosts.push(host);
      // \u8BB0\u5F55\u4E3A\u624B\u52A8\u6DFB\u52A0\u7684\u57DF\u540D
      if (!homepageConfig.manualHosts) {
        homepageConfig.manualHosts = [];
      }
      homepageConfig.manualHosts.push(host);
      input.value = '';

      // \u91CD\u65B0\u6E32\u67D3\u5217\u8868
      loadHomepageDisplayConfig();
      showToast('\u57DF\u540D\u5DF2\u6DFB\u52A0', 'success');
    }

    function removeManualHost(host) {
      if (!confirm('\u786E\u5B9A\u8981\u5220\u9664\u57DF\u540D ' + host + ' \u5417\uFF1F')) {
        return;
      }

      // \u4ECE\u914D\u7F6E\u4E2D\u79FB\u9664
      homepageConfig.hosts = homepageConfig.hosts.filter(item => item !== host);
      // \u4ECE\u624B\u52A8\u6DFB\u52A0\u7684\u57DF\u540D\u5217\u8868\u4E2D\u79FB\u9664
      if (homepageConfig.manualHosts) {
        homepageConfig.manualHosts = homepageConfig.manualHosts.filter(item => item !== host);
      }

      // \u91CD\u65B0\u6E32\u67D3\u5217\u8868
      loadHomepageDisplayConfig();
      showToast('\u57DF\u540D\u5DF2\u5220\u9664', 'success');
    }

    async function saveHomepageDisplayConfig() {
      try {
        showLoading();
        // \u53EA\u4FDD\u5B58\u9700\u8981\u7684\u5B57\u6BB5
        const configToSave = {
          sources: homepageConfig.sources,
          groups: homepageConfig.groups,
          hosts: homepageConfig.hosts,
          hasHeaders: homepageConfig.hasHeaders,
          manualHosts: homepageConfig.manualHosts || [] // \u4FDD\u5B58\u624B\u52A8\u6DFB\u52A0\u7684\u57DF\u540D\u5217\u8868
        };
        const result = await apiRequest('/homepage-display', {
          method: 'POST',
          body: JSON.stringify(configToSave),
          showLoading: false
        });

        if (result.success) {
          showToast('\u9996\u9875\u5C55\u793A\u914D\u7F6E\u5DF2\u4FDD\u5B58', 'success');
        } else {
          showToast('\u4FDD\u5B58\u914D\u7F6E\u5931\u8D25: ' + (result.error || '\u672A\u77E5\u9519\u8BEF'), 'error');
        }
      } catch (error) {
        showToast('\u4FDD\u5B58\u914D\u7F6E\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    // \u7CFB\u7EDF\u8BBE\u7F6E\u7BA1\u7406
    async function loadSystemConfig() {
      try {
        showLoading();
        const data = await apiRequest('/system-config', { showLoading: false });

        if (data.success && data.config) {
          document.getElementById('enableRefCheck').checked = data.config.enable_ref_check || false;
          document.getElementById('refWhitelist').value = data.config.ref_whitelist || '';
          document.getElementById('enablePlayToken').checked = data.config.enable_play_token !== undefined ? data.config.enable_play_token : true;
          document.getElementById('playTokenExpireSeconds').value = data.config.play_token_expire_seconds || 3600;
          document.getElementById('enableIPBind').checked = data.config.enable_ip_bind !== undefined ? data.config.enable_ip_bind : true;
          document.getElementById('enableBurnAfterRead').checked = data.config.enable_burn_after_read !== undefined ? data.config.enable_burn_after_read : true;
          document.getElementById('enableURLEncryption').checked = data.config.enable_url_encryption !== undefined ? data.config.enable_url_encryption : false;
          document.getElementById('urlEncryptionKey').value = data.config.url_encryption_key || '';
        } else {
          showToast('\u52A0\u8F7D\u914D\u7F6E\u5931\u8D25', 'error');
        }
      } catch (error) {
        showToast('\u52A0\u8F7D\u914D\u7F6E\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function saveSystemConfig() {
      try {
        showLoading();
        const config = {
          enable_ref_check: document.getElementById('enableRefCheck').checked,
          ref_whitelist: document.getElementById('refWhitelist').value.trim(),
          enable_play_token: document.getElementById('enablePlayToken').checked,
          play_token_expire_seconds: parseInt(document.getElementById('playTokenExpireSeconds').value),
          enable_ip_bind: document.getElementById('enableIPBind').checked,
          enable_burn_after_read: document.getElementById('enableBurnAfterRead').checked,
          enable_url_encryption: document.getElementById('enableURLEncryption').checked,
          url_encryption_key: document.getElementById('urlEncryptionKey').value.trim()
        };

        // \u9A8C\u8BC1\u914D\u7F6E\u503C
        if (config.play_token_expire_seconds < 60 || config.play_token_expire_seconds > 86400) {
          showToast('Token\u6709\u6548\u671F\u5FC5\u987B\u572860-86400\u79D2\u4E4B\u95F4', 'error');
          hideLoading();
          return;
        }

        // \u9A8C\u8BC1\u52A0\u5BC6\u5BC6\u94A5
        if (config.enable_url_encryption && config.url_encryption_key.length > 0) {
          if (config.url_encryption_key.length < 8) {
            showToast('\u52A0\u5BC6\u5BC6\u94A5\u957F\u5EA6\u4E0D\u80FD\u5C11\u4E8E 8 \u4E2A\u5B57\u7B26', 'error');
            hideLoading();
            return;
          }
          if (!/^[A-Za-z0-9]+$/.test(config.url_encryption_key)) {
            showToast('\u52A0\u5BC6\u5BC6\u94A5\u53EA\u80FD\u5305\u542B\u5B57\u6BCD\u548C\u6570\u5B57', 'error');
            hideLoading();
            return;
          }
        }

        const result = await apiRequest('/system-config', {
          method: 'POST',
          body: JSON.stringify(config),
          showLoading: false
        });

        if (result.success) {
          showToast('\u7CFB\u7EDF\u914D\u7F6E\u5DF2\u4FDD\u5B58', 'success');
        } else {
          showToast('\u4FDD\u5B58\u914D\u7F6E\u5931\u8D25: ' + (result.error || '\u672A\u77E5\u9519\u8BEF'), 'error');
        }
      } catch (error) {
        showToast('\u4FDD\u5B58\u914D\u7F6E\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    // ========== \u516C\u544A\u7BA1\u7406 ==========

    // \u516C\u544A\u6A21\u677F
    const announcementTemplates = {
      update: {
        title: '\u{1F4E3} \u7CFB\u7EDF\u66F4\u65B0\u901A\u77E5',
        content: '<p>\u7CFB\u7EDF\u5DF2\u5B8C\u6210\u91CD\u8981\u66F4\u65B0\uFF0C\u672C\u6B21\u66F4\u65B0\u5305\u542B\uFF1A</p><p><strong>\u2728 \u65B0\u589E\u529F\u80FD\uFF1A</strong></p><ul><li>\u4F18\u5316\u64AD\u653E\u4F53\u9A8C\uFF0C\u63D0\u5347\u52A0\u8F7D\u901F\u5EA6</li><li>\u4FEE\u590D\u5DF2\u77E5\u95EE\u9898\uFF0C\u63D0\u5347\u7A33\u5B9A\u6027</li></ul><p>\u5982\u6709\u95EE\u9898\uFF0C\u8BF7\u8054\u7CFB\u5BA2\u670D\u3002</p>'
      },
      maintenance: {
        title: '\u{1F527} \u7CFB\u7EDF\u7EF4\u62A4\u901A\u77E5',
        content: '<p>\u7CFB\u7EDF\u5C06\u4E8E <strong>YYYY-MM-DD HH:MM</strong> \u8FDB\u884C\u7EF4\u62A4\u5347\u7EA7\u3002</p><p>\u7EF4\u62A4\u671F\u95F4\uFF0C\u90E8\u5206\u529F\u80FD\u53EF\u80FD\u65E0\u6CD5\u6B63\u5E38\u4F7F\u7528\uFF0C\u9884\u8BA1\u7EF4\u62A4\u65F6\u95F4 <strong>X \u5C0F\u65F6</strong>\u3002</p><p>\u7ED9\u60A8\u5E26\u6765\u7684\u4E0D\u4FBF\uFF0C\u656C\u8BF7\u8C05\u89E3\uFF01</p><p>\u7EF4\u62A4\u5B8C\u6210\u540E\uFF0C\u7CFB\u7EDF\u4F1A\u81EA\u52A8\u6062\u590D\u6B63\u5E38\u670D\u52A1\u3002</p>'
      },
      feature: {
        title: '\u{1F389} \u65B0\u529F\u80FD\u4E0A\u7EBF',
        content: '<p>\u4E3A\u4E86\u7ED9\u60A8\u5E26\u6765\u66F4\u597D\u7684\u4F7F\u7528\u4F53\u9A8C\uFF0C\u6211\u4EEC\u9686\u91CD\u63A8\u51FA\u65B0\u529F\u80FD\uFF01</p><p><strong>\u2728 \u672C\u6B21\u66F4\u65B0\u4EAE\u70B9\uFF1A</strong></p><ul><li>\u652F\u6301\u66F4\u591A\u9891\u9053\u6E90</li><li>\u4F18\u5316\u64AD\u653E\u6027\u80FD</li><li>\u5168\u65B0\u7684\u7528\u6237\u754C\u9762</li></ul><p>\u5FEB\u6765\u4F53\u9A8C\u65B0\u529F\u80FD\u5427\uFF01</p>'
      },
      notice: {
        title: '\u26A0\uFE0F \u91CD\u8981\u63D0\u793A',
        content: '<p><strong>\u91CD\u8981\u901A\u77E5\uFF1A</strong></p><p>1. \u8BF7\u52FF\u5206\u4EAB\u8D26\u53F7\u4FE1\u606F\u7ED9\u4ED6\u4EBA</p><p>2. \u6CE8\u610F\u4FDD\u62A4\u4E2A\u4EBA\u9690\u79C1</p><p>3. \u5982\u53D1\u73B0\u5F02\u5E38\u60C5\u51B5\uFF0C\u8BF7\u53CA\u65F6\u8054\u7CFB\u5BA2\u670D</p><p>\u611F\u8C22\u60A8\u7684\u914D\u5408\uFF01</p>'
      },
      custom: {
        title: '',
        content: ''
      }
    };

    // \u52A0\u8F7D\u516C\u544A
    async function loadAnnouncement() {
      try {
        showLoading();
        const result = await apiRequest('/announcement', { showLoading: false });

        if (result.success && result.data) {
          const announcementData = result.data;
          document.getElementById('announcementTitleInput').value = announcementData.title || '';
          document.getElementById('announcementContentInput').value = announcementData.content || '';
          document.getElementById('announcementEnabled').checked = announcementData.enabled === 1;
          document.getElementById('announcementFrequency').value = announcementData.display_frequency || 'once';
        } else {
          // \u6E05\u7A7A\u8868\u5355
          document.getElementById('announcementTitleInput').value = '';
          document.getElementById('announcementContentInput').value = '';
          document.getElementById('announcementEnabled').checked = false;
          document.getElementById('announcementFrequency').value = 'once';
          document.getElementById('announcementTemplate').value = '';
        }
      } catch (error) {
        showToast('\u52A0\u8F7D\u516C\u544A\u5931\u8D25: ' + (error.error || '\u672A\u77E5\u9519\u8BEF'), 'error');
      } finally {
        hideLoading();
      }
    }

    // \u4FDD\u5B58\u516C\u544A
    async function saveAnnouncement() {
      try {
        showLoading();

        const title = document.getElementById('announcementTitleInput').value.trim();
        const content = document.getElementById('announcementContentInput').value.trim();
        const enabled = document.getElementById('announcementEnabled').checked;
        const displayFrequency = document.getElementById('announcementFrequency').value;

        if (!title) {
          showToast('\u8BF7\u8F93\u5165\u516C\u544A\u6807\u9898', 'error');
          hideLoading();
          return;
        }

        if (!content) {
          showToast('\u8BF7\u8F93\u5165\u516C\u544A\u5185\u5BB9', 'error');
          hideLoading();
          return;
        }

        // \u5148\u83B7\u53D6\u73B0\u6709\u516C\u544A
        const getResult = await apiRequest('/announcement', { showLoading: false });
        const data = {
          title,
          content,
          enabled,
          display_frequency: displayFrequency
        };

        // \u5982\u679C\u5DF2\u6709\u516C\u544A\uFF0C\u5219\u66F4\u65B0
        if (getResult.success && getResult.data) {
          data.id = getResult.data.id;
        }

        const result = await apiRequest('/announcement', {
          method: 'POST',
          body: JSON.stringify(data),
          showLoading: false
        });

        if (result.success) {
          showToast('\u516C\u544A\u4FDD\u5B58\u6210\u529F', 'success');
        } else {
          showToast('\u4FDD\u5B58\u516C\u544A\u5931\u8D25: ' + (result.error || '\u672A\u77E5\u9519\u8BEF'), 'error');
        }
      } catch (error) {
        showToast('\u4FDD\u5B58\u516C\u544A\u5931\u8D25: ' + (error.error || '\u672A\u77E5\u9519\u8BEF'), 'error');
      } finally {
        hideLoading();
      }
    }

    // \u5E94\u7528\u516C\u544A\u6A21\u677F
    function applyAnnouncementTemplate() {
      const templateKey = document.getElementById('announcementTemplate').value;

      if (templateKey && announcementTemplates[templateKey]) {
        const template = announcementTemplates[templateKey];
        document.getElementById('announcementTitleInput').value = template.title;
        document.getElementById('announcementContentInput').value = template.content;
      }
    }

    // \u8F6E\u6362\u52A0\u5BC6\u5BC6\u94A5
    async function rotateEncryptionKey() {
      if (!confirm('\u786E\u5B9A\u8981\u8F6E\u6362\u52A0\u5BC6\u5BC6\u94A5\u5417\uFF1F\\n\\n\u26A0\uFE0F \u6CE8\u610F\uFF1A\\n- \u8F6E\u6362\u540E\uFF0C\u65E7\u7684\u64AD\u653E\u5730\u5740\u5C06\u5931\u6548\\n- \u7528\u6237\u9700\u8981\u91CD\u65B0\u83B7\u53D6\u64AD\u653E\u5730\u5740\\n- \u524D\u7AEF\u9875\u9762\u9700\u8981\u5237\u65B0\u624D\u80FD\u83B7\u53D6\u65B0\u5BC6\u94A5')) {
        return;
      }

      try {
        showLoading();
        const config = {
          rotate_encryption_key: true
        };

        const result = await apiRequest('/system-config', {
          method: 'POST',
          body: JSON.stringify(config),
          showLoading: false
        });

        if (result.success) {
          showToast('\u52A0\u5BC6\u5BC6\u94A5\u5DF2\u8F6E\u6362', 'success');
          // \u91CD\u65B0\u52A0\u8F7D\u914D\u7F6E\u4EE5\u663E\u793A\u65B0\u5BC6\u94A5
          await loadSystemConfig();
        } else {
          showToast('\u8F6E\u6362\u5BC6\u94A5\u5931\u8D25: ' + (result.error || '\u672A\u77E5\u9519\u8BEF'), 'error');
        }
      } catch (error) {
        showToast('\u8F6E\u6362\u5BC6\u94A5\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    // \u7F13\u5B58\u7BA1\u7406
    async function loadCacheStatus() {
      try {
        const statusDiv = document.getElementById('cacheStatusInfo');
        statusDiv.innerHTML = '<div style="color:#86868b;">\u52A0\u8F7D\u4E2D...</div>';

        const data = await apiRequest('/cache/status', { showLoading: false });

        if (data.success) {
          const hasCache = data.channelsCached || data.groupsCached;
          let html = '';

          if (hasCache) {
            html = '<div style="color:#2e7d32;">\u2713 \u7F13\u5B58\u72B6\u6001\uFF1A</div>';
            if (data.channelsCached) {
              html += '<div style="margin-top:8px;">\u2022 \u9891\u9053\u6570\u636E\uFF1A<span style="color:#0071e3;font-weight:600;">\u5DF2\u7F13\u5B58 (' + (data.channelsCount || 0) + ' \u4E2A)</span></div>';
            } else {
              html += '<div style="margin-top:8px;">\u2022 \u9891\u9053\u6570\u636E\uFF1A<span style="color:#ff9800;">\u672A\u7F13\u5B58</span></div>';
            }
            if (data.groupsCached) {
              html += '<div style="margin-top:4px;">\u2022 \u5206\u7EC4\u5217\u8868\uFF1A<span style="color:#0071e3;font-weight:600;">\u5DF2\u7F13\u5B58 (' + (data.groupsCount || 0) + ' \u4E2A)</span></div>';
            } else {
              html += '<div style="margin-top:4px;">\u2022 \u5206\u7EC4\u5217\u8868\uFF1A<span style="color:#ff9800;">\u672A\u7F13\u5B58</span></div>';
            }
            if (data.cachedAt) {
              const cachedTime = new Date(data.cachedAt);
              html += '<div style="margin-top:8px;font-size:12px;color:#86868b;">\u7F13\u5B58\u65F6\u95F4\uFF1A' + cachedTime.toLocaleString('zh-CN') + '</div>';
            }
            if (data.version) {
              html += '<div style="margin-top:4px;font-size:12px;color:#86868b;">\u7F13\u5B58\u7248\u672C\uFF1A' + data.version + '</div>';
            }
          } else {
            html = '<div style="color:#ff9800;">\u26A0 \u7F13\u5B58\u72B6\u6001\uFF1A</div>';
            html += '<div style="margin-top:8px;">\u5F53\u524D\u65E0\u7F13\u5B58\u6570\u636E\uFF0C\u8BF7\u70B9\u51FB"\u5237\u65B0\u7F13\u5B58"\u6309\u94AE</div>';
          }

          statusDiv.innerHTML = html;
        } else {
          statusDiv.innerHTML = '<div style="color:#ff3b30;">\u52A0\u8F7D\u7F13\u5B58\u72B6\u6001\u5931\u8D25</div>';
        }
      } catch (error) {
        console.error('\u52A0\u8F7D\u7F13\u5B58\u72B6\u6001\u5931\u8D25:', error);
        const statusDiv = document.getElementById('cacheStatusInfo');
        statusDiv.innerHTML = '<div style="color:#ff3b30;">\u52A0\u8F7D\u7F13\u5B58\u72B6\u6001\u5931\u8D25: ' + (error.error || '\u672A\u77E5\u9519\u8BEF') + '</div>';
      }
    }

    async function refreshCache() {
      if (!confirm('\u786E\u5B9A\u8981\u5237\u65B0\u9891\u9053\u7F13\u5B58\u5417\uFF1F\\n\\n\u6B64\u64CD\u4F5C\u5C06\u4ECE\u6570\u636E\u5E93\u8BFB\u53D6\u6240\u6709\u9891\u9053\u6570\u636E\u5E76\u7F13\u5B58\u5230KV\u5B58\u50A8\u4E2D\u3002')) {
        return;
      }

      try {
        showLoading();
        const result = await apiRequest('/cache/refresh', {
          method: 'POST',
          showLoading: false
        });

        if (result.success) {
          showToast('\u7F13\u5B58\u5237\u65B0\u6210\u529F\uFF1A' + (result.channels || 0) + ' \u4E2A\u9891\u9053\uFF0C' + (result.groups || 0) + ' \u4E2A\u5206\u7EC4', 'success');
          // \u5237\u65B0\u7F13\u5B58\u72B6\u6001\u663E\u793A
          await loadCacheStatus();
        } else {
          showToast('\u7F13\u5B58\u5237\u65B0\u5931\u8D25: ' + (result.error || '\u672A\u77E5\u9519\u8BEF'), 'error');
        }
      } catch (error) {
        showToast('\u7F13\u5B58\u5237\u65B0\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }

    async function clearCache() {
      if (!confirm('\u786E\u5B9A\u8981\u6E05\u7A7A\u9891\u9053\u7F13\u5B58\u5417\uFF1F\\n\\n\u26A0\uFE0F \u6CE8\u610F\uFF1A\u6E05\u7A7A\u540E\uFF0C\u9996\u9875\u548C\u64AD\u653E\u8BF7\u6C42\u5C06\u4ECE\u6570\u636E\u5E93\u8BFB\u53D6\u6570\u636E\uFF0C\u53EF\u80FD\u4F1A\u5BFC\u81F4\u52A0\u8F7D\u901F\u5EA6\u53D8\u6162\u3002')) {
        return;
      }

      try {
        showLoading();
        const result = await apiRequest('/cache/clear', {
          method: 'POST',
          showLoading: false
        });

        if (result.success) {
          showToast('\u7F13\u5B58\u5DF2\u6E05\u7A7A', 'success');
          // \u5237\u65B0\u7F13\u5B58\u72B6\u6001\u663E\u793A
          await loadCacheStatus();
        } else {
          showToast('\u7F13\u5B58\u6E05\u7A7A\u5931\u8D25: ' + (result.error || '\u672A\u77E5\u9519\u8BEF'), 'error');
        }
      } catch (error) {
        showToast('\u7F13\u5B58\u6E05\u7A7A\u5931\u8D25: ' + error.error, 'error');
      } finally {
        hideLoading();
      }
    }
  <\/script>
</body>
</html>`;

// user-activate.js
init_checked_fetch();
init_modules_watch_stub();
var USER_ACTIVATE_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>\u5361\u5BC6\u6FC0\u6D3B - \u7535\u89C6\u76F4\u64AD\u670D\u52A1</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:15px}
    .container{background:white;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.3);padding:30px;max-width:480px;width:100%}
    .logo{text-align:center;margin-bottom:25px}
    .logo h1{font-size:24px;font-weight:700;color:#1d1d1f;margin-bottom:6px}
    .logo p{color:#86868b;font-size:13px}
    .form-group{margin-bottom:18px}
    .form-group label{display:block;margin-bottom:8px;font-weight:500;color:#1d1d1f;font-size:14px}
    .form-group input{width:100%;padding:12px 14px;border:2px solid #e5e5ea;border-radius:8px;font-size:16px;transition:border-color .2s;letter-spacing:1px;-webkit-appearance:none}
    .form-group input:focus{outline:none;border-color:#667eea}
    .btn{width:100%;padding:14px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;transition:transform .2s,box-shadow .2s;-webkit-tap-highlight-color:transparent}
    .btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(102,126,234,.4)}
    .btn:active{transform:translateY(0);scale:.98}
    .btn:disabled{background:#d2d2d7;cursor:not-allowed;transform:none;scale:1}
    .error{color:#ff3b30;text-align:center;margin-bottom:12px;font-size:14px;display:none;padding:12px;background:#ffebee;border-radius:8px}
    .success{color:#34c759;text-align:center;margin-bottom:12px;font-size:14px;display:none;padding:12px;background:#e8f5e9;border-radius:8px}
    .result{display:none;margin-top:25px;padding:20px;background:#f5f5f7;border-radius:12px}
    .result.active{display:block}
    .result h3{font-size:16px;font-weight:600;margin-bottom:14px;color:#1d1d1f}
    .info-item{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #e5e5ea}
    .info-item:last-child{border-bottom:none}
    .info-label{color:#86868b;font-size:13px}
    .info-value{color:#1d1d1f;font-weight:500;font-size:13px}
    .sub-url-container{margin-top:14px;padding:14px;background:#667eea;border-radius:8px}
    .sub-url-label{color:white;font-size:11px;margin-bottom:6px}
    .sub-url{color:white;font-size:12px;font-weight:600;word-break:break-all;line-height:1.6}
    .copy-btn{width:100%;margin-top:14px;padding:12px;background:#0071e3;color:white;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;transition:background .2s;-webkit-tap-highlight-color:transparent}
    .copy-btn:hover{background:#0077ed}
    .copy-btn:active{scale:.98}
    .instructions{margin-top:16px;padding:14px;background:#fff3e0;border-radius:8px;border-left:4px solid #ff9800}
    .instructions h4{color:#e65100;margin-bottom:10px;font-size:13px}
    .instructions ul{list-style:none;padding:0}
    .instructions li{padding:5px 0;color:#86868b;font-size:12px;line-height:1.5}
    .instructions li:before{content:"\u2713";color:#ff9800;margin-right:6px;font-weight:bold}
    .loading{display:none;text-align:center;padding:20px}
    .loading.active{display:block}
    .spinner{width:40px;height:40px;border:3px solid #e5e5ea;border-top-color:#667eea;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto}
    @keyframes spin{to{transform:rotate(360deg)}}
    .loading-text{margin-top:12px;color:#86868b;font-size:14px}
    @media (max-width:480px){
      body{padding:10px}
      .container{padding:20px;border-radius:12px}
      .logo h1{font-size:20px}
      .logo p{font-size:12px}
      .form-group input{font-size:16px;padding:11px 13px}
      .btn{padding:13px;font-size:15px}
      .result{padding:16px}
      .info-item{padding:8px 0}
      .info-label,.info-value{font-size:12px}
      .sub-url-container{padding:12px}
      .sub-url{font-size:11px}
      .instructions{padding:12px}
      .instructions h4{font-size:12px}
      .instructions li{font-size:11px;padding:4px 0}
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h1>\u{1F4FA} \u7535\u89C6\u76F4\u64AD\u670D\u52A1</h1>
      <p>\u5361\u5BC6\u6FC0\u6D3B\u83B7\u53D6\u8BA2\u9605\u5730\u5740</p>
    </div>

    <div id="errorBox" class="error"></div>
    <div id="successBox" class="success"></div>

    <div class="form-group">
      <label for="code">\u8BF7\u8F93\u5165\u5361\u5BC6</label>
      <input type="text" id="code" placeholder="\u8F93\u5165\u60A8\u7684\u5361\u5BC6" autocomplete="off">
    </div>

    <button id="activateBtn" class="btn" onclick="activateCode()">\u7ACB\u5373\u6FC0\u6D3B</button>

    <div id="loading" class="loading">
      <div class="spinner"></div>
      <p class="loading-text">\u6B63\u5728\u6FC0\u6D3B...</p>
    </div>

    <div id="result" class="result">
      <h3>\u2705 \u6FC0\u6D3B\u6210\u529F</h3>
      <div class="info-item">
        <span class="info-label">\u5361\u5BC6</span>
        <span class="info-value" id="resultCode">-</span>
      </div>
      <div class="info-item">
        <span class="info-label">\u6709\u6548\u671F</span>
        <span class="info-value" id="resultDuration">-</span>
      </div>
      <div class="info-item">
        <span class="info-label">\u8FC7\u671F\u65F6\u95F4</span>
        <span class="info-value" id="resultExpired">-</span>
      </div>

      <div class="sub-url-container">
        <div class="sub-url-label">\u8BA2\u9605\u5730\u5740\uFF08\u70B9\u51FB\u590D\u5236\uFF09</div>
        <div class="sub-url" id="subUrl" onclick="copySubUrl()">-</div>
      </div>

      <button class="copy-btn" onclick="copySubUrl()">\u590D\u5236\u8BA2\u9605\u5730\u5740</button>

      <div class="instructions">
        <h4>\u{1F4F1} \u4F7F\u7528\u8BF4\u660E</h4>
        <ul>
          <li>\u5C06\u8BA2\u9605\u5730\u5740\u6DFB\u52A0\u5230\u64AD\u653E\u5668</li>
          <li>\u652F\u6301IPTV\u3001PotPlayer\u7B49\u64AD\u653E\u5668</li>
          <li>\u652F\u6301\u5404\u7C7B\u7535\u89C6\u76D2\u5B50</li>
          <li>\u5EFA\u8BAE\u5B9A\u671F\u66F4\u65B0\u8BA2\u9605\u5217\u8868</li>
          <li>\u8BF7\u52FF\u4F7F\u7528\u8F6F\u4EF6\u5BF9\u64AD\u653E\u5217\u8868\u6D4B\u8BD5\uFF0C\u5426\u5219\u53EF\u80FD\u89E6\u53D1\u7CFB\u7EDF\u9632\u5FA1</li>
        </ul>
      </div>
    </div>
  </div>
  
  <script>
    const API_BASE = '/api/activate';
    
    function showError(message) {
      const errorBox = document.getElementById('errorBox');
      const successBox = document.getElementById('successBox');
      errorBox.textContent = message;
      errorBox.style.display = 'block';
      successBox.style.display = 'none';
      setTimeout(() => {
        errorBox.style.display = 'none';
      }, 5000);
    }
    
    function showSuccess(message) {
      const errorBox = document.getElementById('errorBox');
      const successBox = document.getElementById('successBox');
      successBox.textContent = message;
      successBox.style.display = 'block';
      errorBox.style.display = 'none';
      setTimeout(() => {
        successBox.style.display = 'none';
      }, 5000);
    }
    
    function showLoading(show) {
      const loading = document.getElementById('loading');
      const btn = document.getElementById('activateBtn');
      if (show) {
        loading.classList.add('active');
        btn.disabled = true;
      } else {
        loading.classList.remove('active');
        btn.disabled = false;
      }
    }
    
    async function activateCode() {
      const code = document.getElementById('code').value.trim();
      
      if (!code) {
        showError('\u8BF7\u8F93\u5165\u5361\u5BC6');
        return;
      }
      
      showLoading(true);
      document.getElementById('result').classList.remove('active');
      
      try {
        const response = await fetch(API_BASE + '?code=' + encodeURIComponent(code), {
          method: 'POST'
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          showSuccess('\u5361\u5BC6\u6FC0\u6D3B\u6210\u529F\uFF01');
          showResult(code, data);
        } else {
          showError(data.error || '\u6FC0\u6D3B\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u5361\u5BC6\u662F\u5426\u6B63\u786E');
        }
      } catch (error) {
        console.error('\u6FC0\u6D3B\u5931\u8D25:', error);
        showError('\u7F51\u7EDC\u9519\u8BEF\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5');
      } finally {
        showLoading(false);
      }
    }
    
    function showResult(code, data) {
      const result = document.getElementById('result');
      const now = new Date();
      const expiredAt = new Date(data.expired_at);
      const durationDays = Math.ceil((expiredAt - now) / (1000 * 60 * 60 * 24));
      
      document.getElementById('resultCode').textContent = code;
      document.getElementById('resultDuration').textContent = durationDays + ' \u5929';
      document.getElementById('resultExpired').textContent = expiredAt.toLocaleString('zh-CN');
      
      const host = window.location.origin;
      const subUrl = host + '/sub/' + code + '.m3u';
      document.getElementById('subUrl').textContent = subUrl;
      
      result.classList.add('active');
    }
    
    function copySubUrl() {
      const subUrl = document.getElementById('subUrl').textContent;
      if (subUrl && subUrl !== '-') {
        navigator.clipboard.writeText(subUrl).then(() => {
          showSuccess('\u8BA2\u9605\u5730\u5740\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F');
        }).catch(err => {
          const textarea = document.createElement('textarea');
          textarea.value = subUrl;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          showSuccess('\u8BA2\u9605\u5730\u5740\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F');
        });
      }
    }
    
    // \u652F\u6301\u56DE\u8F66\u952E\u6FC0\u6D3B
    document.getElementById('code').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        activateCode();
      }
    });
  <\/script>
</body>
</html>`;

// playstation-page.js
init_checked_fetch();
init_modules_watch_stub();
var PLAYSTATION_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- ========== SEO Meta Tags ========== -->
  <!-- \u57FA\u7840Meta\u6807\u7B7E -->
  <meta name="description" content="IPTV Live\u63D0\u4F9B\u514D\u8D39\u7684\u5728\u7EBF\u7535\u89C6\u89C2\u770B\u670D\u52A1\uFF0C\u5305\u542B10000+\u9AD8\u6E05\u9891\u9053\uFF0C\u652F\u6301\u4F53\u80B2\u3001\u65B0\u95FB\u3001\u5A31\u4E50\u3001\u7535\u5F71\u7B49\u5168\u7C7B\u578B\u9891\u9053\uFF0C\u65E0\u9700\u6CE8\u518C\uFF0C\u4E00\u952E\u64AD\u653E\uFF0C\u591A\u8BBE\u5907\u540C\u6B65\u89C2\u770B\u3002">
  <meta name="keywords" content="IPTV,\u514D\u8D39\u76F4\u64AD,\u5728\u7EBF\u770B\u7535\u89C6,\u4F53\u80B2\u76F4\u64AD,\u65B0\u95FB\u76F4\u64AD,\u9AD8\u6E05\u76F4\u64AD,\u514D\u8D39\u7535\u89C6,\u5728\u7EBF\u89C6\u9891,\u76F4\u64AD\u5E73\u53F0,IPTV Live">
  <meta name="author" content="IPTV Live">
  <meta name="robots" content="index, follow">
  <meta name="googlebot" content="index, follow">
  <meta name="baiduspider" content="index, follow">
  <meta name="revisit-after" content="1 days">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://iptv-search.com">
  <meta property="og:title" content="IPTV Live - \u514D\u8D39\u9AD8\u6E05\u7535\u89C6\u89C2\u770B\u5E73\u53F0">
  <meta property="og:description" content="\u63D0\u4F9B10000+\u514D\u8D39\u9AD8\u6E05\u9891\u9053\uFF0C\u652F\u6301\u4F53\u80B2\u3001\u65B0\u95FB\u3001\u5A31\u4E50\u3001\u7535\u5F71\u7B49\u5168\u7C7B\u578B\uFF0C\u65E0\u9700\u6CE8\u518C\uFF0C\u4E00\u952E\u64AD\u653E\u3002">
  <meta property="og:image" content="https://iptv-search.com/og-image.svg">
  <meta property="og:site_name" content="IPTV Live">
  <meta property="og:locale" content="zh_CN">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://iptv-search.com">
  <meta name="twitter:title" content="IPTV Live - \u514D\u8D39\u9AD8\u6E05\u7535\u89C6\u89C2\u770B\u5E73\u53F0">
  <meta name="twitter:description" content="\u63D0\u4F9B10000+\u514D\u8D39\u9AD8\u6E05\u9891\u9053\uFF0C\u652F\u6301\u4F53\u80B2\u3001\u65B0\u95FB\u3001\u5A31\u4E50\u3001\u7535\u5F71\u7B49\u5168\u7C7B\u578B\u3002">
  <meta name="twitter:image" content="https://iptv-search.com/og-image.svg">

  <!-- Canonical URL -->
  <link rel="canonical" href="https://iptv-search.com">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="shortcut icon" href="/favicon.svg">

  <!-- \u79FB\u52A8\u7AEF\u4F18\u5316 -->
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="IPTV Live">
  <meta name="theme-color" content="#e50914">

  <!-- \u7ED3\u6784\u5316\u6570\u636E (JSON-LD) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "IPTV Live",
    "url": "https://iptv-search.com",
    "description": "\u63D0\u4F9B\u514D\u8D39\u7684\u5728\u7EBF\u7535\u89C6\u89C2\u770B\u670D\u52A1\uFF0C\u5305\u542B10000+\u9AD8\u6E05\u9891\u9053",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://iptv-search.com/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "IPTV Live",
      "url": "https://iptv-search.com"
    }
  }
  <\/script>

  <!-- \u9762\u5305\u5C51\u5BFC\u822A\u7ED3\u6784\u5316\u6570\u636E -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "\u9996\u9875",
        "item": "https://iptv-search.com"
      }
    ]
  }
  <\/script>

  <title>IPTV Live - \u514D\u8D39\u9AD8\u6E05\u7535\u89C6\u89C2\u770B\u5E73\u53F0</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0a0a0a;color:#fff}
    ::-webkit-scrollbar{width:8px}
    ::-webkit-scrollbar-track{background:#1a1a1a}
    ::-webkit-scrollbar-thumb{background:#333;border-radius:4px}
    ::-webkit-scrollbar-thumb:hover{background:#555}

    .header{position:fixed;top:0;left:0;right:0;height:70px;background:rgba(20,20,20,.95);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.1);z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 40px}
    .logo{display:flex;align-items:center;gap:10px}
    .logo img{height:40px;width:auto}
    .logo-text{font-size:24px;font-weight:800;background:linear-gradient(135deg,#e50914 0%,#b81d24 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .header-left{display:flex;align-items:center;gap:40px}
    .header-right{display:flex;align-items:center;margin-left:auto}
    .search-box{max-width:500px;margin-right:20px}
    .search-input{width:100%;padding:12px 20px;border:1px solid rgba(255,255,255,.2);border-radius:8px;background:rgba(255,255,255,.05);color:#fff;font-size:15px;transition:all .2s}
    .search-input:focus{outline:none;border-color:#e50914;background:rgba(255,255,255,.1)}
    .search-input::placeholder{color:rgba(255,255,255,.5)}
    .nav-links{display:flex;gap:20px;margin-left:auto}
    .nav-links a{color:rgba(255,255,255,.8);text-decoration:none;font-size:14px;transition:color .2s}
    .nav-links a:hover{color:#fff}
    .nav-links a.active{color:#e50914}

    /* \u8BED\u8A00\u5207\u6362\u4E0B\u62C9\u5217\u8868 */
    .lang-switcher{position:relative}
    .lang-dropdown{position:relative;display:inline-block}
    .lang-dropdown-menu{position:absolute;top:100%;right:0;margin-top:8px;background:#1a1a1a;border:1px solid rgba(255,255,255,.15);border-radius:8px;padding:8px 0;min-width:120px;opacity:0;visibility:hidden;transform:translateY(-10px);transition:all .2s;z-index:1000}
    .lang-dropdown.open .lang-dropdown-menu{opacity:1;visibility:visible;transform:translateY(0)}
    .lang-dropdown-item{padding:10px 20px;cursor:pointer;transition:background .15s;color:rgba(255,255,255,.8);font-size:14px}
    .lang-dropdown-item:hover{background:rgba(229,9,20,.15);color:#fff}
    .lang-dropdown-item.active{background:rgba(229,9,20,.2);color:#fff;font-weight:600}

    /* \u5FEB\u6377\u5165\u53E3\u6309\u94AE */
    .quick-entries{display:flex;gap:8px;margin-left:0}
    .quick-entry{position:relative;width:40px;height:40px;border-radius:8px;background:rgba(255,255,255,.1);border:none;cursor:pointer;color:rgba(255,255,255,.7);font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .2s}
    .quick-entry:hover{background:rgba(255,255,255,.2);color:#fff}
    .quick-entry-badge{position:absolute;top:-2px;right:-2px;min-width:18px;height:18px;background:#e50914;border-radius:9px;font-size:11px;font-weight:600;color:#fff;display:flex;align-items:center;justify-content:center;padding:0 5px;display:none}
    .quick-entry-tip{position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:6px;white-space:nowrap;font-size:12px;color:rgba(255,255,255,.6);opacity:0;transition:opacity .2s;pointer-events:none}
    .quick-entry:hover .quick-entry-tip{opacity:1}

    .main{display:flex;margin-top:70px;min-height:calc(100vh - 70px)}
    .sidebar{width:260px;background:#141414;border-right:1px solid rgba(255,255,255,.1);overflow-y:auto;padding:20px 0;position:fixed;height:calc(100vh - 70px)}
    .group-item{padding:12px 24px;color:rgba(255,255,255,.7);cursor:pointer;transition:all .2s;font-size:14px;border-left:3px solid transparent}
    .group-item:hover{color:#fff;background:rgba(255,255,255,.05)}
    .group-item.active{color:#fff;background:rgba(229,9,20,.1);border-left-color:#e50914}
    .content{flex:1;margin-left:260px;padding:30px}

    .section-title{font-size:18px;font-weight:600;margin-bottom:20px;color:#fff}
    .channels-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px}
    .channel-card{background:#141414;border-radius:8px;overflow:hidden;cursor:pointer;transition:all .3s;border:2px solid transparent;position:relative}
    .channel-card:hover{transform:scale(1.05);border-color:#e50914;z-index:10;box-shadow:0 8px 30px rgba(0,0,0,.5)}
    .channel-poster{aspect-ratio:16/9;background:#1a1a1a;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
    .channel-poster img{width:100%;height:100%;object-fit:contain;transition:transform .3s}
    .channel-card:hover .channel-poster img{transform:scale(1.1)}
    .channel-icon{font-size:48px;opacity:.5}
    .play-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(229,9,20,.8);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s}
    .channel-card:hover .play-overlay{opacity:1}
    .play-icon{width:60px;height:60px;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center}
    .play-icon::after{content:'';width:0;height:0;border-left:20px solid #fff;border-top:12px solid transparent;border-bottom:12px solid transparent;margin-left:4px}
    .channel-info{padding:14px}
    .channel-name{font-size:14px;font-weight:500;color:#fff;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .channel-group{font-size:12px;color:rgba(255,255,255,.5)}
    .pagination{display:flex;justify-content:center;align-items:center;gap:12px;margin-top:30px;padding:20px 0}
    .pagination button{padding:8px 16px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:#fff;border-radius:6px;cursor:pointer;font-size:14px;transition:all .2s}
    .pagination button:hover:not(:disabled){background:rgba(255,255,255,.1);border-color:#e50914}
    .pagination button:disabled{color:rgba(255,255,255,.3);cursor:not-allowed;border-color:rgba(255,255,255,.1)}
    .pagination button.active{background:#e50914;border-color:#e50914}
    .pagination-info{color:rgba(255,255,255,.6);font-size:14px}
    
    /* \u64AD\u653E\u5668\u6837\u5F0F - \u53EF\u6298\u53E0\u7684\u53F3\u4E0B\u89D2\u6D6E\u7A97 */
    .player-wrapper{display:none;position:fixed;right:20px;bottom:20px;z-index:1000;background:#0a0a0a;border-radius:12px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.1);transition:all .3s ease}
    .player-wrapper.expanded{width:calc(100vw - 40px);height:calc(100vh - 80px);right:20px;top:70px;bottom:20px}
    .player-wrapper.collapsed{width:480px;height:270px;aspect-ratio:16/9}
    .player-wrapper.active{display:block}
    .player-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:rgba(255,255,255,.05);border-bottom:1px solid rgba(255,255,255,.1);cursor:move;user-select:none}
    .player-info{flex:1;min-width:0}
    .player-title{font-size:14px;font-weight:600;color:#fff;margin-bottom:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .player-group{font-size:12px;color:rgba(255,255,255,.5);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .player-controls{display:flex;gap:8px}
    .player-btn{width:32px;height:32px;border-radius:6px;background:rgba(255,255,255,.1);border:none;cursor:pointer;color:#fff;display:flex;align-items:center;justify-content:center;transition:all .2s;font-size:14px}
    .player-btn:hover{background:rgba(255,255,255,.2)}
    .player-container{position:relative;width:100%;height:calc(100% - 50px);background:#000;display:flex;align-items:center;justify-content:center}
    .player-container video{width:100%;height:100%;object-fit:contain}
    .close-modal{background:rgba(231,9,20,.2)}
    .close-modal:hover{background:rgba(231,9,20,.4)}

    /* AdSense \u5E7F\u544A\u4F4D\u6837\u5F0F */
    .ad-banner-top{display:flex;justify-content:center;padding:10px;background:rgba(0,0,0,.2);margin-bottom:10px}
    .ad-banner-bottom{display:flex;justify-content:center;padding:10px;background:rgba(0,0,0,.2);margin-top:10px}
    .ad-sidebar{margin-bottom:20px}
    .ad-responsive{width:100%;max-width:728px}
    .ad-mobile-top{display:none;padding:10px;background:rgba(0,0,0,.2);margin-bottom:10px}
    .ad-mobile-bottom{display:none;padding:10px;background:rgba(0,0,0,.2);margin-top:10px}

    .loading{display:flex;align-items:center;justify-content:center;padding:60px;color:rgba(255,255,255,.5)}
    .spinner{width:40px;height:40px;border:3px solid rgba(255,255,255,.1);border-top-color:#e50914;border-radius:50%;animation:spin 1s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    .loading-text{margin-left:16px;font-size:14px}
    
    .empty-state{text-align:center;padding:80px 20px;color:rgba(255,255,255,.5)}
    .empty-icon{font-size:64px;margin-bottom:20px;opacity:.3}
    .empty-title{font-size:20px;font-weight:600;margin-bottom:10px}
    .empty-desc{font-size:14px}
    
    .footer{text-align:center;padding:30px;color:rgba(255,255,255,.4);font-size:13px;border-top:1px solid rgba(255,255,255,.1);margin-top:40px;margin-left:260px}

    /* \u70ED\u95E8\u9891\u9053\u6807\u7B7E */
    .hot-tag{position:absolute;top:8px;left:8px;padding:4px 10px;background:#ff4757;color:white;border-radius:4px;font-size:11px;font-weight:600;z-index:10}
    .hot-tag::before{content:'\u{1F525} ';margin-right:2px}

    /* \u6536\u85CF\u529F\u80FD */
    .favorite-btn{position:absolute;top:8px;right:8px;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.6);border:none;cursor:pointer;color:rgba(255,255,255,.7);font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .2s;z-index:10}
    .favorite-btn:hover{background:rgba(0,0,0,.8);color:#fff}
    .favorite-btn.favorited{color:#ffd700}
    .favorite-section{display:none}
    .favorite-section.active{display:block}

    /* \u5FEB\u6377\u9762\u677F */
    .quick-panel{display:none;position:fixed;top:70px;right:20px;width:400px;max-height:calc(100vh - 100px);background:rgba(20,20,20,.98);border:1px solid rgba(255,255,255,.1);border-radius:12px;overflow:hidden;z-index:900;box-shadow:0 8px 40px rgba(0,0,0,.6)}
    .quick-panel.active{display:block;animation:slideIn 0.3s ease}
    @keyframes slideIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
    .quick-panel-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid rgba(255,255,255,.1)}
    .quick-panel-title{font-size:16px;font-weight:600;color:#fff;display:flex;align-items:center;gap:8px}
    .quick-panel-close{width:28px;height:28px;border-radius:6px;background:rgba(255,255,255,.1);border:none;cursor:pointer;color:rgba(255,255,255,.6);font-size:18px;display:flex;align-items:center;justify-content:center;transition:all .2s}
    .quick-panel-close:hover{background:rgba(255,255,255,.2);color:#fff}
    .quick-panel-content{padding:16px;overflow-y:auto;max-height:calc(100vh - 180px)}
    .quick-panel-item{display:flex;align-items:center;gap:12px;padding:10px;border-radius:8px;background:rgba(255,255,255,.03);cursor:pointer;transition:all .2s;margin-bottom:8px}
    .quick-panel-item:hover{background:rgba(255,255,255,.08);transform:translateX(4px)}
    .quick-panel-item-poster{width:80px;height:45px;background:#141414;border-radius:6px;display:flex;align-items:center;justify-content:center;overflow:hidden}
    .quick-panel-item-poster img{width:100%;height:100%;object-fit:contain}
    .quick-panel-item-icon{font-size:24px;opacity:.5}
    .quick-panel-item-info{flex:1;min-width:0}
    .quick-panel-item-name{font-size:14px;font-weight:500;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .quick-panel-item-group{font-size:12px;color:rgba(255,255,255,.5);margin-top:2px}
    .quick-panel-item-time{font-size:11px;color:rgba(255,255,255,.4)}
    .quick-panel-empty{text-align:center;padding:40px 20px;color:rgba(255,255,255,.5)}
    .quick-panel-empty-icon{font-size:48px;margin-bottom:12px;opacity:.3}
    .quick-panel-empty-text{font-size:14px}

    /* \u5728\u7EBF\u4EBA\u6570\u663E\u793A */
    .online-counter{display:flex;align-items:center;gap:8px;color:rgba(255,255,255,.6);font-size:13px;margin-left:40px}
    .online-dot{width:8px;height:8px;border-radius:50%;background:#34c759;animation:pulse 2s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    .online-count{font-weight:600;color:#34c759}

    /* \u70B9\u51FB\u6CE2\u7EB9\u6548\u679C */
    .ripple{position:relative;overflow:hidden}
    .ripple-effect{position:absolute;border-radius:50%;background:rgba(255,255,255,.3);transform:scale(0);animation:ripple 0.6s linear;pointer-events:none}
    @keyframes ripple{to{transform:scale(4);opacity:0}}

    /* \u52A0\u8F7D\u6307\u793A\u5668 */
    .loading-indicator{position:fixed;top:70px;left:50%;transform:translateX(-50%);z-index:1001;background:rgba(20,20,20,.95);backdrop-filter:blur(20px);padding:16px 32px;border-radius:8px;display:none;align-items:center;gap:12px;box-shadow:0 4px 20px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.1)}
    .loading-indicator.active{display:flex;animation:fadeIn 0.3s ease}
    @keyframes fadeIn{from{opacity:0;transform:translateX(-50%) translateY(-10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
    .loading-spinner{width:20px;height:20px;border:2px solid rgba(255,255,255,.2);border-top-color:#e50914;border-radius:50%;animation:spin 0.8s linear infinite}
    .loading-text{font-size:14px;color:#fff}

    /* \u70B9\u51FB\u9AD8\u4EAE\u52A8\u753B */
    .click-highlight{animation:clickPulse 0.3s ease}
    @keyframes clickPulse{0%{transform:scale(1)}50%{transform:scale(0.95)}100%{transform:scale(1)}}

    /* \u64AD\u653E\u63D0\u793A\u52A8\u753B */
    .playing-indicator{display:flex;align-items:center;gap:6px;color:#e50914;font-size:12px;font-weight:600;animation:fadeInUp 0.3s ease}
    @keyframes fadeInUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    .playing-dots{display:flex;gap:3px}
    .playing-dot{width:6px;height:6px;background:#e50914;border-radius:50%;animation:playingDot 1s ease-in-out infinite}
    .playing-dot:nth-child(2){animation-delay:0.2s}
    .playing-dot:nth-child(3){animation-delay:0.4s}
    @keyframes playingDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(0.8)}}

    /* Toast \u63D0\u793A\u7EC4\u4EF6\uFF08\u5DF2\u9690\u85CF\uFF09 */
    /* .toast-container{position:fixed;top:90px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;flex-direction:column;gap:12px;pointer-events:none}
    .toast{min-width:320px;max-width:500px;padding:16px 20px;border-radius:10px;color:#fff;font-size:14px;line-height:1.5;box-shadow:0 8px 30px rgba(0,0,0,.4);pointer-events:auto;backdrop-filter:blur(10px);animation:toastSlideIn 0.3s ease;transition:all 0.2s}
    .toast.error{background:linear-gradient(135deg,rgba(231,9,20,.9) 0%,rgba(220,38,38,.9) 100%);border:1px solid rgba(239,68,68,.3)}
    .toast.warning{background:linear-gradient(135deg,rgba(234,179,8,.9) 0%,rgba(245,158,11,.9) 100%);border:1px solid rgba(251,191,36,.3)}
    .toast.success{background:linear-gradient(135deg,rgba(34,197,94,.9) 0%,rgba(22,163,74,.9) 100%);border:1px solid rgba(74,222,128,.3)}
    .toast.info{background:linear-gradient(135deg,rgba(59,130,246,.9) 0%,rgba(37,99,235,.9) 100%);border:1px solid rgba(96,165,250,.3)}
    .toast-title{font-weight:600;margin-bottom:4px;font-size:15px}
    .toast-message{color:rgba(255,255,255,.85);white-space:pre-wrap}
    .toast-close{position:absolute;top:12px;right:12px;width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,.15);border:none;cursor:pointer;color:#fff;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .2s}
    .toast-close:hover{background:rgba(255,255,255,.25);transform:scale(1.1)}
    @keyframes toastSlideIn{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes toastSlideOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-20px)}}
    .toast.hiding{animation:toastSlideOut 0.3s ease forwards} */

    /* \u516C\u544A\u6837\u5F0F - \u5F39\u7A97\u5F0F\u901A\u77E5 */
    .announcement-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.6);display:none;align-items:center;justify-content:center;z-index:2000;backdrop-filter:blur(4px)}
    .announcement-modal.active{display:flex}
    .announcement-modal-box{background:#1a1a1a;border-radius:16px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.1);animation:announcementSlideIn 0.3s ease}
    @keyframes announcementSlideIn{from{opacity:0;transform:scale(0.9) translateY(-20px)}to{opacity:1;transform:scale(1) translateY(0)}}
    .announcement-modal-header{display:flex;align-items:center;justify-content:space-between;padding:20px 24px 16px;border-bottom:1px solid rgba(255,255,255,.1)}
    .announcement-modal-title{display:flex;align-items:center;gap:10px;font-size:18px;font-weight:600;color:#fff}
    .announcement-modal-icon{font-size:24px}
    .announcement-close{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.1);border:none;cursor:pointer;color:rgba(255,255,255,.6);font-size:22px;display:flex;align-items:center;justify-content:center;transition:all .2s}
    .announcement-close:hover{background:rgba(255,255,255,.2);color:#fff;transform:rotate(90deg)}
    .announcement-modal-body{padding:24px;color:rgba(255,255,255,.85);font-size:15px;line-height:1.7}
    .announcement-modal-body p{margin-bottom:12px}
    .announcement-modal-body p:last-child{margin-bottom:0}
    .announcement-modal-body a{color:#60a5fa;text-decoration:underline}
    .announcement-modal-footer{display:flex;align-items:center;justify-content:space-between;padding:16px 24px 20px;border-top:1px solid rgba(255,255,255,.1)}
    .announcement-modal-time{display:flex;align-items:center;gap:6px;font-size:13px;color:rgba(255,255,255,.5)}
    .announcement-modal-button{padding:10px 24px;background:#60a5fa;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;transition:all .2s}
    .announcement-modal-button:hover{background:#3b82f6}


    @media (max-width:1024px){
      .sidebar{display:none}
      .content{margin-left:0}
      .footer{margin-left:0}
      .channels-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}
      .player-wrapper.collapsed{width:360px;height:200px}
    }
    .mobile-menu-btn{display:none}
    .mobile-menu{display:none}
    .mobile-menu-overlay{display:none}
    .mobile-search-header{display:none}

    @media (max-width:768px){
      .header{padding:0 12px;height:60px;justify-content:flex-start;gap:12px}
      .logo{font-size:18px;flex-shrink:0}
      .header-left{gap:10px}
      .online-counter{font-size:11px;display:none}
      .header-right{display:none}
      .mobile-search-header{display:flex;flex:1;max-width:200px;margin-left:auto}
      .mobile-search-header .search-input{width:100%;padding:8px 12px;font-size:14px}
      .mobile-menu-btn{display:flex;width:40px;height:40px;align-items:center;justify-content:center;background:rgba(255,255,255,.1);border:none;border-radius:8px;cursor:pointer;color:rgba(255,255,255,.7);font-size:20px;flex-shrink:0}
      .mobile-menu{display:block;position:fixed;top:0;right:-100%;width:280px;height:100vh;background:#1a1a1a;z-index:1000;transition:right .3s ease;overflow-y:auto;padding:20px}
      .mobile-menu.open{right:0}
      .mobile-menu-overlay{display:block;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:999;opacity:0;visibility:hidden;transition:all .3s}
      .mobile-menu-overlay.open{opacity:1;visibility:visible}
      .mobile-menu-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid rgba(255,255,255,.1)}
      .mobile-menu-title{font-size:16px;font-weight:600;color:#fff}
      .ad-banner-top{display:none}
      .ad-banner-bottom{display:none}
      .ad-sidebar{display:none}
      .ad-mobile-top{display:flex;justify-content:center}
      .ad-mobile-bottom{display:flex;justify-content:center}
      .mobile-menu-close{width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.1);border:none;border-radius:6px;cursor:pointer;color:rgba(255,255,255,.7);font-size:20px}
      .mobile-section{margin-bottom:25px}
      .mobile-section-title{font-size:12px;font-weight:600;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}
      .mobile-actions{display:flex;gap:10px;margin-bottom:20px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-ms-overflow-style:none;padding-bottom:5px}
      .mobile-actions::-webkit-scrollbar{display:none}
      .mobile-actions::-webkit-scrollbar{display:none}
      .mobile-action-btn{display:flex;flex-direction:column;align-items:center;gap:6px;min-width:70px;padding:12px 8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;cursor:pointer;transition:all .2s;color:rgba(255,255,255,.7);flex-shrink:0}
      .mobile-action-btn:hover{background:rgba(255,255,255,.1);color:#fff}
      .mobile-action-btn .icon{font-size:24px}
      .mobile-action-btn .label{font-size:11px;color:rgba(255,255,255,.6);white-space:nowrap}
      .mobile-lang-menu{display:flex;gap:8px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;-ms-overflow-style:none;padding-bottom:5px}
      .mobile-lang-menu::-webkit-scrollbar{display:none}
      .mobile-lang-item{padding:10px 16px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;cursor:pointer;transition:all .2s;color:rgba(255,255,255,.7);font-size:14px;white-space:nowrap;flex-shrink:0}
      .mobile-lang-item:hover{background:rgba(255,255,255,.1);color:#fff}
      .mobile-lang-item.active{background:rgba(229,9,20,.2);border-color:#e50914;color:#fff;font-weight:600}
      .mobile-group-item{padding:12px 16px;color:rgba(255,255,255,.7);cursor:pointer;transition:all .2s;font-size:14px;border-left:3px solid transparent}
      .mobile-group-item:hover{color:#fff;background:rgba(255,255,255,.05)}
      .mobile-group-item.active{color:#fff;background:rgba(229,9,20,.1);border-left-color:#e50914;font-weight:600}
      .sidebar{display:none}
      .sidebar.mobile-open{display:block;position:static;width:100%;height:auto;border-right:none;border-bottom:1px solid rgba(255,255,255,.1);padding:0 0 20px 0}
      .content{margin-left:0;padding:15px}
      .channels-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
      /* \u79FB\u52A8\u7AEF\u64AD\u653E\u5668\u7279\u6B8A\u6837\u5F0F */
      .player-wrapper{position:fixed;top:60px;left:0;right:0;width:100% !important;height:0;overflow:hidden;border-radius:0;box-shadow:0 4px 20px rgba(0,0,0,.5);transition:all .3s ease}
      .player-wrapper.active{height:calc(100vw * 9 / 16 + 50px);min-height:270px;max-height:370px;z-index:999}
      .player-wrapper.expanded{height:calc(100vh - 60px);width:100% !important;right:0 !important;left:0 !important;top:60px;bottom:auto}
      .player-wrapper.collapsed{height:calc(100vw * 9 / 16 + 50px);min-height:270px;max-height:370px;width:100% !important;right:0 !important;left:0 !important;top:60px;bottom:auto}
      .player-container{height:calc(100% - 50px)}
      /* \u5185\u5BB9\u533A\u57DF\u6DFB\u52A0\u9876\u90E8\u95F4\u8DDD\uFF0C\u907F\u514D\u88AB\u64AD\u653E\u5668\u906E\u6321 */
      .main{margin-top:60px;padding-top:0}
      .main.player-active{padding-top:330px}
      .main.player-expanded{padding-top:calc(100vh - 60px)}
      .player-title{font-size:12px}
      .player-group{font-size:11px}
      .pagination{flex-wrap:wrap;gap:6px;padding:15px 0}
      .pagination button{padding:6px 12px;font-size:12px}
      .pagination-info{width:100%;text-align:center;margin-bottom:10px}
    }
    @media (max-width:480px){
      .header{padding:0 10px}
      .logo{font-size:16px}
      .mobile-menu{width:100%}
      .mobile-action-btn{min-width:60px;padding:10px 6px}
      .mobile-action-btn .icon{font-size:20px}
      .mobile-action-btn .label{font-size:10px}
      .main{margin-top:60px}
      .channels-grid{grid-template-columns:repeat(2,1fr);gap:8px}
      .channel-card{padding:8px}
      .channel-name{font-size:13px}
      .channel-group{font-size:11px}
    }
  </style>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2205598928191137"
     crossorigin="anonymous"><\/script>
</head>
<body>
  <header class="header">
    <div class="header-left">
      <div class="logo">
        <img src="/logo.svg" alt="IPTV Live Logo" />
      </div>
      <div class="online-counter">
        <span class="online-dot"></span>
        <span class="online-count" id="onlineCount">0</span> <span id="onlineCountText">\u4EBA\u5728\u89C2\u770B</span>
      </div>
    </div>
    <div class="header-right">
      <div class="search-box">
        <input type="text" class="search-input" id="searchInput" placeholder="\u641C\u7D22\u9891\u9053..." oninput="handleSearch()">
      </div>
      <div class="quick-entries">
        <button class="quick-entry ripple" onclick="handleQuickEntryClick(event, 'history')" data-tip-key="history">
          \u{1F550}
          <span class="quick-entry-tip">\u64AD\u653E\u5386\u53F2</span>
          <span class="quick-entry-badge" id="historyBadge" style="display:none;">0</span>
        </button>
        <button class="quick-entry ripple" onclick="handleQuickEntryClick(event, 'favorites')" data-tip-key="favorites">
          \u2B50
          <span class="quick-entry-tip">\u6211\u7684\u6536\u85CF</span>
          <span class="quick-entry-badge" id="favoritesBadge" style="display:none;">0</span>
        </button>
        <button class="quick-entry ripple" onclick="handleQuickEntryClick(event, 'random')" data-tip-key="random">
          \u{1F3AF}
          <span class="quick-entry-tip">\u968F\u673A\u63A8\u8350</span>
        </button>
        <button class="quick-entry ripple" onclick="handleQuickEntryClick(event, 'clearCache')" data-tip-key="clearCache" style="display:none;">
          \u{1F5D1}\uFE0F
          <span class="quick-entry-tip">\u6E05\u9664\u7F13\u5B58</span>
        </button>
        <div class="lang-dropdown" id="langDropdown">
          <button class="quick-entry ripple lang-switcher" onclick="toggleLangDropdown()">
            \u{1F310}
            <span class="quick-entry-tip">\u5207\u6362\u8BED\u8A00</span>
          </button>
          <div class="lang-dropdown-menu">
            <div class="lang-dropdown-item active" data-lang="zh-CN" onclick="switchLanguage('zh-CN')">\u7B80\u4F53\u4E2D\u6587</div>
            <div class="lang-dropdown-item" data-lang="zh-TW" onclick="switchLanguage('zh-TW')">\u7E41\u9AD4\u4E2D\u6587</div>
            <div class="lang-dropdown-item" data-lang="en" onclick="switchLanguage('en')">English</div>
          </div>
        </div>
      </div>
    </div>
    <div class="mobile-search-header">
      <input type="text" class="search-input" id="mobileHeaderSearchInput" placeholder="\u641C\u7D22..." oninput="handleMobileHeaderSearch()">
    </div>
    <button class="mobile-menu-btn" onclick="toggleMobileMenu()">
      \u2630
    </button>
  </header>

  <!-- \u79FB\u52A8\u7AEF\u83DC\u5355 -->
  <div class="mobile-menu-overlay" id="mobileMenuOverlay" onclick="toggleMobileMenu()"></div>
  <div class="mobile-menu" id="mobileMenu">
    <div class="mobile-menu-header">
      <div class="mobile-menu-title" data-i18n="menu">\u83DC\u5355</div>
      <button class="mobile-menu-close" onclick="toggleMobileMenu()">\u2715</button>
    </div>

    <div class="mobile-section">
      <div class="mobile-section-title" data-i18n="quickActions">\u5FEB\u6377\u64CD\u4F5C</div>
      <div class="mobile-actions">
        <div class="mobile-action-btn" onclick="handleMobileAction('history')">
          <span class="icon">\u{1F550}</span>
        </div>
        <div class="mobile-action-btn" onclick="handleMobileAction('favorites')">
          <span class="icon">\u2B50</span>
        </div>
        <div class="mobile-action-btn" onclick="handleMobileAction('random')">
          <span class="icon">\u{1F3AF}</span>
        </div>
      </div>
    </div>

    <div class="mobile-section">
      <div class="mobile-section-title" data-i18n="language">\u8BED\u8A00</div>
      <div class="mobile-lang-menu">
        <div class="mobile-lang-item active" data-lang="zh-CN" onclick="switchLanguage('zh-CN')">\u7B80\u4F53\u4E2D\u6587</div>
        <div class="mobile-lang-item" data-lang="zh-TW" onclick="switchLanguage('zh-TW')">\u7E41\u9AD4\u4E2D\u6587</div>
        <div class="mobile-lang-item" data-lang="en" onclick="switchLanguage('en')">English</div>
      </div>
    </div>

    <div class="mobile-section">
      <div class="mobile-section-title" data-i18n="groupNav">\u5206\u7EC4\u5BFC\u822A</div>
      <div id="mobileGroupList"></div>
    </div>
  </div>

  <div class="main">
    <aside class="sidebar" id="sidebar">
      <div class="group-item active" data-group="" onclick="filterByGroup('')">\u5168\u90E8\u9891\u9053</div>
      <div id="groupList"></div>
    </aside>

    <div class="content">
      <div id="loading" class="loading">
        <div class="spinner"></div>
        <span class="loading-text">Loading...</span>
      </div>

      <div id="channelList" style="display:none;">
        <!-- \u516C\u544A\u5F39\u7A97 -->
        <div class="announcement-modal" id="announcementModal">
          <div class="announcement-modal-box">
            <div class="announcement-modal-header">
              <div class="announcement-modal-title">
                <span class="announcement-modal-icon">\u{1F4E2}</span>
                <span id="announcementTitle">\u7CFB\u7EDF\u516C\u544A</span>
              </div>
              <button class="announcement-close" onclick="closeAnnouncement()">&times;</button>
            </div>
            <div class="announcement-modal-body" id="announcementContent">
              <p>\u52A0\u8F7D\u4E2D...</p>
            </div>
            <div class="announcement-modal-footer">
              <div class="announcement-modal-time" id="announcementTime">
                <span>\u{1F550}</span>
                <span>\u53D1\u5E03\u65F6\u95F4\u52A0\u8F7D\u4E2D</span>
              </div>
              <button class="announcement-modal-button" onclick="closeAnnouncement()">\u77E5\u9053\u4E86</button>
            </div>
          </div>
        </div>

        <div class="section-title" id="sectionTitle">\u5168\u90E8\u9891\u9053</div>
        <div class="channels-grid" id="channelsGrid"></div>
        <div class="pagination" id="pagination"></div>


      </div>

      <div id="emptyState" class="empty-state" style="display:none;">
        <div class="empty-icon">\u{1F4FA}</div>
        <div class="empty-title">\u672A\u627E\u5230\u9891\u9053</div>
        <div class="empty-desc">\u8BF7\u5C1D\u8BD5\u5176\u4ED6\u641C\u7D22\u8BCD\u6216\u5206\u7EC4</div>
      </div>

    </div>
  </div>

  <!-- \u5FEB\u6377\u9762\u677F -->
  <div class="quick-panel" id="quickPanel">
    <div class="quick-panel-header">
      <div class="quick-panel-title" id="quickPanelTitle">\u{1F4CC} \u9762\u677F</div>
      <button class="quick-panel-close" onclick="closeQuickPanel()">&times;</button>
    </div>
    <div class="quick-panel-content" id="quickPanelContent"></div>
  </div>

  <!-- \u52A0\u8F7D\u6307\u793A\u5668 -->
  <div class="loading-indicator" id="loadingIndicator">
    <div class="loading-spinner"></div>
    <div class="loading-text" id="loadingText">Loading...</div>
  </div>

      <!-- Toast \u63D0\u793A\u5BB9\u5668\uFF08\u5DF2\u9690\u85CF\uFF09 -->
  <!-- <div class="toast-container" id="toastContainer"></div> -->

  <footer class="footer">
    <p>&copy; 2024 IPTV Live. \u514D\u8D39\u9AD8\u6E05\u7535\u89C6\u5728\u7EBF\u89C2\u770B\u5E73\u53F0</p>
    <!-- SEO \u53CB\u597D\u94FE\u63A5 -->
    <div style="margin-top:15px;font-size:12px;color:rgba(255,255,255,.4);">
      <a href="/sitemap.xml" style="color:rgba(255,255,255,.6);text-decoration:none;margin:0 10px;">\u7F51\u7AD9\u5730\u56FE</a>
      <a href="/robots.txt" style="color:rgba(255,255,255,.6);text-decoration:none;margin:0 10px;">Robots</a>
      <a href="/privacy-policy" style="color:rgba(255,255,255,.6);text-decoration:none;margin:0 10px;">\u9690\u79C1\u653F\u7B56</a>
      <a href="/terms" style="color:rgba(255,255,255,.6);text-decoration:none;margin:0 10px;">\u670D\u52A1\u6761\u6B3E</a>
    </div>
    <!-- Cloudflare\u6258\u7BA1\u8BF4\u660E\u548C\u5FBD\u7AE0 -->
    <div style="margin-top:20px;display:flex;align-items:center;justify-content:center;gap:10px;">
      <span style="font-size:12px;color:rgba(255,255,255,.6);">\u672C\u7AD9\u7531 Cloudflare \u63D0\u4F9B\u52A0\u901F\u4E0E\u5B89\u5168\u4FDD\u62A4</span>
      <a href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer">
        <img src="https://www.cloudflare.com/static/logo-2.svg" alt="Cloudflare" style="height:24px;width:auto;opacity:0.8;transition:opacity 0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.8">
      </a>
    </div>
  </footer>

  <div class="player-wrapper collapsed" id="playerWrapper">
    <div class="player-header" id="playerHeader">
      <div class="player-info">
        <div class="player-title" id="playerTitle">\u9891\u9053\u540D\u79F0</div>
        <div class="player-group" id="playerGroup">\u5206\u7EC4</div>
      </div>
      <div class="player-controls">
        <button class="player-btn" onclick="togglePlayerSize()" title="\u5207\u6362\u5927\u5C0F">\u26F6</button>
        <button class="player-btn close-modal" onclick="closePlayer()" title="\u5173\u95ED">&times;</button>
      </div>
    </div>
    <div class="player-container">
      <video id="videoPlayer" controls autoplay>
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"><\/script>
  <script>
    // \u5B89\u5168\u68C0\u6D4B\uFF1A\u963B\u6B62\u5728\u975E\u539F\u59CB\u57DF\u540D\u4E0A\u8FD0\u884C\uFF08\u9632\u6B62\u4EE3\u7406\uFF09
    (function() {
      const currentDomain = window.location.hostname;
      const originalDomain = window.location.hostname; // \u5B9E\u9645\u90E8\u7F72\u65F6\u5E94\u8BE5\u786C\u7F16\u7801\u4F60\u7684\u57DF\u540D
      // \u5141\u8BB8 localhost \u548C\u539F\u59CB\u57DF\u540D
      const allowedDomains = [originalDomain, 'localhost', '127.0.0.1'];
      // \u6CE8\u610F\uFF1A\u8FD9\u91CC\u6CA1\u6709\u786C\u7F16\u7801\u57DF\u540D\uFF0C\u56E0\u4E3A\u4EE3\u7801\u662F\u5728\u8FD0\u884C\u65F6\u5D4C\u5165\u7684
      // \u53EF\u4EE5\u901A\u8FC7 worker \u6CE8\u5165\u4E00\u4E2A ALLOWED_DOMAIN \u53D8\u91CF
      if (window.ALLOWED_DOMAINS && !window.ALLOWED_DOMAINS.some(d => currentDomain === d || currentDomain.endsWith('.' + d))) {
        alert('\u6B64\u9875\u9762\u65E0\u6CD5\u5728\u5F53\u524D\u57DF\u540D\u8FD0\u884C\uFF0C\u8BF7\u8BBF\u95EE\u539F\u59CB\u7AD9\u70B9');
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#fff;background:#000;"><h1>\u8BBF\u95EE\u88AB\u62D2\u7EDD</h1></div>';
        throw new Error('Domain mismatch');
      }
    })();

    // ========== \u8BED\u8A00\u914D\u7F6E\u548C\u7FFB\u8BD1 ==========
    const translations = {
      'zh-CN': {
        title: 'IPTV Live - \u514D\u8D39\u76F4\u64AD',
        searchPlaceholder: '\u641C\u7D22\u9891\u9053...',
        allChannels: '\u5168\u90E8\u9891\u9053',
        search: '\u641C\u7D22',
        history: '\u64AD\u653E\u5386\u53F2',
        favorites: '\u6211\u7684\u6536\u85CF',
        random: '\u968F\u673A\u63A8\u8350',
        clearCache: '\u6E05\u9664\u7F13\u5B58',
        onlineCount: '\u4EBA\u5728\u89C2\u770B',
        hot: '\u70ED\u95E8',
        recommend: '\u63A8\u8350',
        quickActions: '\u5FEB\u6377\u64CD\u4F5C',
        language: '\u8BED\u8A00',
        menu: '\u83DC\u5355',
        groupNav: '\u5206\u7EC4\u5BFC\u822A',
        noHistory: '\u6682\u65E0\u64AD\u653E\u5386\u53F2',
        noHistoryDesc: '\u89C2\u770B\u7684\u9891\u9053\u4F1A\u81EA\u52A8\u663E\u793A\u5728\u8FD9\u91CC',
        noFavorites: '\u8FD8\u6CA1\u6709\u6536\u85CF',
        noFavoritesDesc: '\u70B9\u51FB\u9891\u9053\u5361\u7247\u4E0A\u7684\u661F\u661F\u6309\u94AE\u6DFB\u52A0\u6536\u85CF',
        noRecommendations: '\u6682\u65E0\u63A8\u8350\u9891\u9053',
        noRecommendationsDesc: '\u8BF7\u7A0D\u540E\u518D\u8BD5',
        noChannels: '\u672A\u627E\u5230\u9891\u9053',
        noChannelsDesc: '\u8BF7\u5C1D\u8BD5\u5176\u4ED6\u641C\u7D22\u8BCD\u6216\u5206\u7EC4',
        loading: '\u52A0\u8F7D\u9891\u9053\u5217\u8868...',
        loadingRecommendations: '\u6B63\u5728\u52A0\u8F7D\u63A8\u8350...',
        searching: '\u641C\u7D22\u4E2D...',
        page: '\u9875',
        totalPages: '\u5171',
        firstPage: '\u9996\u9875',
        prevPage: '\u4E0A\u4E00\u9875',
        nextPage: '\u4E0B\u4E00\u9875',
        lastPage: '\u672B\u9875',
        loadingCache: '\u6B63\u5728\u52A0\u8F7D\u9891\u9053...',
        cacheCleared: '\u7F13\u5B58\u5DF2\u6E05\u9664',
        playing: '\u6B63\u5728\u64AD\u653E'
      },
      'zh-TW': {
        title: 'IPTV Live - \u514D\u8CBB\u76F4\u64AD',
        searchPlaceholder: '\u641C\u5C0B\u983B\u9053...',
        allChannels: '\u5168\u90E8\u983B\u9053',
        search: '\u641C\u5C0B',
        history: '\u64AD\u653E\u6B77\u53F2',
        favorites: '\u6211\u7684\u6536\u85CF',
        random: '\u96A8\u6A5F\u63A8\u85A6',
        clearCache: '\u6E05\u9664\u7DE9\u5B58',
        onlineCount: '\u4EBA\u5728\u89C0\u770B',
        hot: '\u71B1\u9580',
        recommend: '\u63A8\u85A6',
        quickActions: '\u5FEB\u6377\u64CD\u4F5C',
        language: '\u8A9E\u8A00',
        menu: '\u83DC\u55AE',
        groupNav: '\u5206\u7D44\u5C0E\u822A',
        noHistory: '\u66AB\u7121\u64AD\u653E\u6B77\u53F2',
        noHistoryDesc: '\u89C0\u770B\u7684\u983B\u9053\u6703\u81EA\u52D5\u986F\u793A\u5728\u9019\u88E1',
        noFavorites: '\u9084\u6C92\u6709\u6536\u85CF',
        noFavoritesDesc: '\u9EDE\u64CA\u983B\u9053\u5361\u7247\u4E0A\u7684\u661F\u661F\u6309\u9215\u6DFB\u52A0\u6536\u85CF',
        noRecommendations: '\u66AB\u7121\u63A8\u85A6\u983B\u9053',
        noRecommendationsDesc: '\u8ACB\u7A0D\u5F8C\u518D\u8A66',
        noChannels: '\u672A\u627E\u5230\u983B\u9053',
        noChannelsDesc: '\u8ACB\u5617\u8A66\u5176\u4ED6\u641C\u5C0B\u8A5E\u6216\u5206\u7D44',
        loading: '\u52A0\u8F09\u983B\u9053\u5217\u8868...',
        loadingRecommendations: '\u6B63\u5728\u52A0\u8F09\u63A8\u85A6...',
        searching: '\u641C\u5C0B\u4E2D...',
        page: '\u9801',
        totalPages: '\u5171',
        firstPage: '\u9996\u9801',
        prevPage: '\u4E0A\u4E00\u9801',
        nextPage: '\u4E0B\u4E00\u9801',
        lastPage: '\u672B\u9801',
        loadingCache: '\u6B63\u5728\u52A0\u8F09\u983B\u9053...',
        cacheCleared: '\u7DE9\u5B58\u5DF2\u6E05\u9664',
        playing: '\u6B63\u5728\u64AD\u653E'
      },
      'en': {
        title: 'IPTV Live - Free Live TV',
        searchPlaceholder: 'Search channels...',
        allChannels: 'All Channels',
        search: 'Search',
        history: 'Watch History',
        favorites: 'My Favorites',
        random: 'Random Picks',
        clearCache: 'Clear Cache',
        onlineCount: 'viewers online',
        hot: 'HOT',
        recommend: 'RECOMMENDED',
        quickActions: 'Quick Actions',
        language: 'Language',
        menu: 'Menu',
        groupNav: 'Group Navigation',
        noHistory: 'No watch history',
        noHistoryDesc: 'Channels you watch will appear here',
        noFavorites: 'No favorites yet',
        noFavoritesDesc: 'Click the star button on channel cards to add favorites',
        noRecommendations: 'No recommendations',
        noRecommendationsDesc: 'Please try again later',
        noChannels: 'No channels found',
        noChannelsDesc: 'Try different search terms or groups',
        loading: 'Loading channels...',
        loadingRecommendations: 'Loading recommendations...',
        searching: 'Searching...',
        page: 'Page',
        totalPages: 'Total',
        firstPage: 'First',
        prevPage: 'Prev',
        nextPage: 'Next',
        lastPage: 'Last',
        loadingCache: 'Loading channels...',
        cacheCleared: 'Cache cleared',
        playing: 'Now Playing'
      }
    };

    // \u83B7\u53D6\u5F53\u524D\u8BED\u8A00\u7684\u7FFB\u8BD1\u6587\u672C
    function t(key) {
      return translations[currentLanguage][key] || translations['zh-CN'][key] || key;
    }

    // \u5207\u6362\u8BED\u8A00
    function toggleLangDropdown() {
      const dropdown = document.getElementById('langDropdown');
      dropdown.classList.toggle('open');
    }

    // \u79FB\u52A8\u7AEF\u83DC\u5355
    function toggleMobileMenu() {
      const menu = document.getElementById('mobileMenu');
      const overlay = document.getElementById('mobileMenuOverlay');
      menu.classList.toggle('open');
      overlay.classList.toggle('open');
    }

    function handleMobileSearch() {
      const value = document.getElementById('mobileHeaderSearchInput').value;
      document.getElementById('searchInput').value = value;
      handleSearch();
    }

    function handleMobileHeaderSearch() {
      const value = document.getElementById('mobileHeaderSearchInput').value;
      document.getElementById('searchInput').value = value;
      handleSearch();
    }

    function handleMobileAction(action) {
      toggleMobileMenu();
      // \u79FB\u52A8\u7AEF\u4E0D\u9700\u8981\u6CE2\u7EB9\u6548\u679C\uFF0C\u76F4\u63A5\u8C03\u7528\u5BF9\u5E94\u7684\u64CD\u4F5C
      switch (action) {
        case 'history':
          showHistoryInMain();
          break;
        case 'favorites':
          showFavoritesInMain();
          break;
        case 'random':
          showRandomInMain();
          break;
      }
    }

    function switchLanguage(lang) {
      currentLanguage = lang;

      // \u66F4\u65B0\u6309\u94AE\u72B6\u6001
      document.querySelectorAll('.lang-dropdown-item').forEach(item => {
        item.classList.toggle('active', item.dataset.lang === lang);
      });

      // \u66F4\u65B0\u79FB\u52A8\u7AEF\u8BED\u8A00\u83DC\u5355\u72B6\u6001
      document.querySelectorAll('.mobile-lang-item').forEach(item => {
        item.classList.toggle('active', item.dataset.lang === lang);
      });

      // \u5173\u95ED\u4E0B\u62C9\u83DC\u5355
      document.getElementById('langDropdown').classList.remove('open');

      // \u5173\u95ED\u79FB\u52A8\u7AEF\u83DC\u5355\uFF08\u5982\u679C\u6253\u5F00\uFF09
      const mobileMenu = document.getElementById('mobileMenu');
      const overlay = document.getElementById('mobileMenuOverlay');
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        overlay.classList.remove('open');
      }

      // \u66F4\u65B0 HTML lang \u5C5E\u6027
      document.documentElement.lang = lang;

      // \u4FDD\u5B58\u8BED\u8A00\u8BBE\u7F6E
      localStorage.setItem('iptv_language', lang);

      // \u5237\u65B0\u9875\u9762\u5185\u5BB9
      updateLanguageContent();
    }

    // \u66F4\u65B0\u9875\u9762\u8BED\u8A00\u5185\u5BB9
    function updateLanguageContent() {
      // \u66F4\u65B0\u6807\u9898
      document.title = t('title');

      // \u66F4\u65B0\u641C\u7D22\u6846
      document.getElementById('searchInput').placeholder = t('searchPlaceholder');

      // \u66F4\u65B0\u79FB\u52A8\u7AEFheader\u641C\u7D22\u6846
      const mobileHeaderSearchInput = document.getElementById('mobileHeaderSearchInput');
      if (mobileHeaderSearchInput) {
        mobileHeaderSearchInput.placeholder = t('searchPlaceholder');
      }

      // \u66F4\u65B0\u6240\u6709\u5E26\u6709 data-i18n \u5C5E\u6027\u7684\u5143\u7D20
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
          el.textContent = t(key);
        }
      });

      // \u66F4\u65B0\u79FB\u52A8\u7AEF\u5168\u90E8\u9891\u9053\u5206\u7EC4
      const mobileAllChannelsItem = document.querySelector('.mobile-group-item[data-group=""]');
      if (mobileAllChannelsItem) {
        mobileAllChannelsItem.textContent = t('allChannels');
      }

      // \u66F4\u65B0\u5FEB\u6377\u6309\u94AE\u63D0\u793A
      document.querySelectorAll('.quick-entry[data-tip-key]').forEach(btn => {
        const tipKey = btn.dataset.tipKey;
        const tipEl = btn.querySelector('.quick-entry-tip');
        if (tipEl && tipKey) {
          tipEl.textContent = t(tipKey);
          btn.setAttribute('title', t(tipKey));
        }
      });

      // \u66F4\u65B0\u5728\u7EBF\u4EBA\u6570\u6587\u672C
      document.getElementById('onlineCountText').textContent = t('onlineCount');

      // \u66F4\u65B0\u5168\u90E8\u9891\u9053\u5206\u7EC4
      const allChannelsItem = document.querySelector('.group-item[data-group=""]');
      if (allChannelsItem) {
        allChannelsItem.textContent = t('allChannels');
      }

      // \u66F4\u65B0\u79FB\u52A8\u7AEF\u5206\u7EC4\u5217\u8868
      document.querySelectorAll('.mobile-group-item[data-group]:not([data-group=""])').forEach(item => {
        // \u5206\u7EC4\u540D\u79F0\u4E0D\u7FFB\u8BD1\uFF0C\u4FDD\u6301\u539F\u6837
      });

      // \u66F4\u65B0\u79FB\u52A8\u7AEF\u8BED\u8A00\u9009\u9879 - \u4E0D\u66F4\u65B0\uFF0C\u4FDD\u6301\u5404\u8BED\u8A00\u7684\u539F\u540D\u663E\u793A
      // \u8BED\u8A00\u9009\u9879\u5E94\u8BE5\u662F\uFF1A\u7B80\u4F53\u4E2D\u6587\u3001\u7E41\u9AD4\u4E2D\u6587\u3001English\uFF0C\u4E0D\u968F\u9009\u62E9\u7684\u8BED\u8A00\u53D8\u5316\u800C\u53D8\u5316

      // \u66F4\u65B0\u5F53\u524D\u9875\u9762\u6807\u9898
      const sectionTitle = document.getElementById('sectionTitle');
      if (sectionTitle) {
        if (currentGroup === 'history') {
          sectionTitle.textContent = '\u{1F550} ' + t('history');
        } else if (currentGroup === 'favorites') {
          sectionTitle.textContent = '\u2B50 ' + t('favorites');
        } else if (currentGroup === 'random') {
          sectionTitle.textContent = '\u{1F3AF} ' + t('random');
        } else if (currentSearch) {
          sectionTitle.textContent = t('search') + ': ' + currentSearch;
        } else {
          sectionTitle.textContent = currentGroup || t('allChannels');
        }
      }

      // \u91CD\u65B0\u6E32\u67D3\u5F53\u524D\u5185\u5BB9\u4EE5\u66F4\u65B0\u6587\u672C
      if (currentGroup === 'history') {
        showHistoryInMain();
      } else if (currentGroup === 'favorites') {
        showFavoritesInMain();
      } else if (currentGroup === 'random') {
        showRandomInMain();
      } else if (allChannels.length > 0) {
        renderChannels(allChannels);
      }

      // \u66F4\u65B0\u5206\u9875
      renderPagination();
    }

    // ========== AES-GCM \u89E3\u5BC6\u51FD\u6570 ==========
    async function decryptAES(encryptedBase64, secret) {
      try {
        // \u4ECE\u5BC6\u94A5\u6D3E\u751F\u52A0\u5BC6\u5BC6\u94A5
        const keyData = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
        const key = await crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'AES-GCM', length: 256 },
          false,
          ['decrypt']
        );

        // \u4ECE Base64 \u89E3\u7801
        const binaryString = atob(encryptedBase64);
        const combined = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          combined[i] = binaryString.charCodeAt(i);
        }

        // \u5206\u79BB IV (\u524D 12 bytes)
        const iv = combined.slice(0, 12);
        const encryptedData = combined.slice(12);

        // \u89E3\u5BC6
        const decrypted = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: iv },
          key,
          encryptedData
        );

        return new TextDecoder().decode(decrypted);
      } catch (error) {
        console.error('AES \u89E3\u5BC6\u5931\u8D25:', error);
        throw error;
      }
    }

    // \u89E3\u5BC6\u5BC6\u94A5\uFF08\u9700\u8981\u4E0E\u670D\u52A1\u5668\u7AEFSECRET_KEY\u4FDD\u6301\u4E00\u81F4\uFF09
    // \u6CE8\u610F\uFF1A\u751F\u4EA7\u73AF\u5883\u4E2D\u4E0D\u5E94\u8BE5\u5728\u524D\u7AEF\u786C\u7F16\u7801\u5BC6\u94A5\uFF0C\u5E94\u8BE5\u901A\u8FC7\u5176\u4ED6\u65B9\u5F0F\u4F20\u9012
    // \u8FD9\u91CC\u4E3A\u4E86\u6F14\u793A\uFF0C\u4F7F\u7528\u4E00\u4E2A\u9ED8\u8BA4\u503C\u3002\u5B9E\u9645\u90E8\u7F72\u65F6\u5E94\u8BE5\u901A\u8FC7\u73AF\u5883\u53D8\u91CF\u6216\u914D\u7F6E\u6CE8\u5165
    const DECRYPTION_KEY = window.DECRYPTION_KEY || 'default-secret-key';

    const API_BASE = '/api';
    let currentLanguage = 'zh-CN';  // \u5F53\u524D\u8BED\u8A00
    let allChannels = [];
    let allGroups = [];
    let currentGroup = '';
    let searchTimeout = null;
    let currentHls = null;
    let isPlayerOpen = false;
    let isPlayerExpanded = false;
    let currentPlayRequestId = 0;  // \u64AD\u653E\u8BF7\u6C42ID\uFF0C\u7528\u4E8E\u53D6\u6D88\u4E4B\u524D\u7684\u8BF7\u6C42
    let activeFetchControllers = [];  // \u6D3B\u8DC3\u7684 AbortController \u5217\u8868
    let currentPage = 1;
    let pageSize = 50;
    let totalPages = 1;
    let totalChannels = 0;

    // \u7CFB\u7EDF\u914D\u7F6E
    let systemConfig = {
      enable_play_token: false,
      enable_url_encryption: false
    };

    // \u516C\u544A\u6570\u636E
    let announcement = null;
    let announcementClosed = false;
    let currentSearch = '';
    let favorites = JSON.parse(localStorage.getItem('iptv_favorites') || '[]');
    let history = JSON.parse(localStorage.getItem('iptv_history') || '[]');
    let featuredChannels = [];
    let isUpdatingKey = false;  // \u9632\u6B62\u91CD\u590D\u66F4\u65B0\u5BC6\u94A5
    // let lastErrorTime = 0;  // \u9632\u6B62\u91CD\u590D\u663E\u793A\u76F8\u540C\u9519\u8BEF\uFF08\u5DF2\u7981\u7528\uFF09
    // let lastErrorMsg = '';   // \u8BB0\u5F55\u4E0A\u4E00\u6761\u9519\u8BEF\u6D88\u606F\uFF08\u5DF2\u7981\u7528\uFF09

    // \u4ECE localStorage \u8BFB\u53D6\u7528\u6237\u8BED\u8A00\u8BBE\u7F6E
    const savedLanguage = localStorage.getItem('iptv_language');
    if (savedLanguage && ['zh-CN', 'zh-TW', 'en'].includes(savedLanguage)) {
      currentLanguage = savedLanguage;
    }

    // \u9875\u9762\u52A0\u8F7D\u65F6\u83B7\u53D6\u9891\u9053\u5217\u8868
    window.addEventListener('DOMContentLoaded', async () => {
      // \u521D\u59CB\u5316\u8BED\u8A00
      switchLanguage(currentLanguage);

      // \u83B7\u53D6\u7CFB\u7EDF\u914D\u7F6E
      try {
        await updateEncryptionKey();
      } catch (error) {
        console.error('[Init] \u83B7\u53D6\u7CFB\u7EDF\u914D\u7F6E\u5931\u8D25:', error);
      }

      // \u52A0\u8F7D\u516C\u544A
      loadAnnouncement();

      // SEO: \u52A8\u6001\u66F4\u65B0\u9875\u9762\u6807\u9898\u548C\u63CF\u8FF0
      updateSEOMeta();

      // \u5C1D\u8BD5\u4ECE\u7F13\u5B58\u52A0\u8F7D\u5206\u7EC4\u6570\u636E\uFF0C\u5FEB\u901F\u6E32\u67D3\u5206\u7EC4\u5217\u8868
      const cachedGroups = getFromCache(getCacheKey('groups'));
      if (cachedGroups && cachedGroups.length > 0) {
        allGroups = cachedGroups;
        renderGroups();
        console.log('[Cache] \u4ECE\u7F13\u5B58\u52A0\u8F7D\u5206\u7EC4:', allGroups.length, '\u4E2A\u5206\u7EC4');
      }

      loadChannels();
      updateOnlineCounter();
      updateBadges();
      setInterval(updateOnlineCounter, 30000); // \u6BCF30\u79D2\u66F4\u65B0\u5728\u7EBF\u4EBA\u6570
    });

    // ========== SEO \u4F18\u5316\u51FD\u6570 ==========

    // \u52A8\u6001\u66F4\u65B0\u9875\u9762SEO\u5143\u4FE1\u606F
    function updateSEOMeta() {
      // \u66F4\u65B0\u9875\u9762\u6807\u9898
      let title = 'IPTV Live - \u514D\u8D39\u9AD8\u6E05\u7535\u89C6\u5728\u7EBF\u89C2\u770B\u5E73\u53F0';
      let description = 'IPTV Live\u63D0\u4F9B\u514D\u8D39\u7684\u5728\u7EBF\u76F4\u64AD\u670D\u52A1\uFF0C\u5305\u542B2000+\u9AD8\u6E05\u9891\u9053\uFF0C\u652F\u6301\u4F53\u80B2\u3001\u65B0\u95FB\u3001\u5A31\u4E50\u3001\u7535\u5F71\u7B49\u5168\u7C7B\u578B\u9891\u9053\uFF0C\u65E0\u9700\u6CE8\u518C\uFF0C\u4E00\u952E\u64AD\u653E\uFF0C\u591A\u8BBE\u5907\u540C\u6B65\u89C2\u770B\u3002';

      if (currentGroup) {
        title = currentGroup + ' - IPTV Live \u514D\u8D39\u76F4\u64AD';
        description = '\u89C2\u770B' + currentGroup + '\u9891\u9053\u76F4\u64AD\uFF0CIPTV Live\u63D0\u4F9B' + currentGroup + '\u76F8\u5173\u7684\u514D\u8D39\u9AD8\u6E05\u76F4\u64AD\u5185\u5BB9\uFF0C\u5B9E\u65F6\u66F4\u65B0\uFF0C\u753B\u9762\u6E05\u6670\uFF0C\u64AD\u653E\u6D41\u7545\u3002';
      } else if (currentSearch) {
        title = currentSearch + ' - IPTV Live \u641C\u7D22\u7ED3\u679C';
        description = '\u641C\u7D22"' + currentSearch + '"\u7684\u9891\u9053\uFF0C\u627E\u5230' + totalChannels + '\u4E2A\u76F8\u5173\u9891\u9053\uFF0CIPTV Live\u514D\u8D39\u9AD8\u6E05\u7535\u89C6\u5728\u7EBF\u89C2\u770B\u5E73\u53F0\u3002';
      } else if (currentGroup === 'history') {
        title = '\u64AD\u653E\u5386\u53F2 - IPTV Live';
        description = '\u67E5\u770B\u60A8\u7684\u89C2\u770B\u5386\u53F2\u8BB0\u5F55\uFF0CIPTV Live\u81EA\u52A8\u4FDD\u5B58\u6700\u8FD1\u89C2\u770B\u7684\u9891\u9053\uFF0C\u65B9\u4FBF\u5FEB\u901F\u8BBF\u95EE\u3002';
      } else if (currentGroup === 'favorites') {
        title = '\u6211\u7684\u6536\u85CF - IPTV Live';
        description = '\u7BA1\u7406\u60A8\u6536\u85CF\u7684\u9891\u9053\uFF0CIPTV Live\u6536\u85CF\u529F\u80FD\u8BA9\u60A8\u5FEB\u901F\u8BBF\u95EE\u559C\u7231\u7684\u5185\u5BB9\u3002';
      } else if (currentGroup === 'random') {
        title = '\u968F\u673A\u63A8\u8350 - IPTV Live';
        description = '\u968F\u673A\u53D1\u73B0\u7CBE\u5F69\u9891\u9053\uFF0CIPTV Live\u667A\u80FD\u63A8\u8350\u8BA9\u60A8\u63A2\u7D22\u66F4\u591A\u4F18\u8D28\u76F4\u64AD\u5185\u5BB9\u3002';
      }

      // \u66F4\u65B0document title
      document.title = title;

      // \u66F4\u65B0meta description
      updateMetaTag('name', 'description', description);
      updateMetaTag('property', 'og:title', title);
      updateMetaTag('property', 'og:description', description);
      updateMetaTag('name', 'twitter:title', title);
      updateMetaTag('name', 'twitter:description', description);
    }

    // \u66F4\u65B0\u6216\u521B\u5EFAmeta\u6807\u7B7E
    function updateMetaTag(attribute, name, content) {
      let meta = document.querySelector(\`meta[\${attribute}="\${name}"]\`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    }

    function showToast(message, type = 'info', duration = 4000, checkModal = false) {
      // \u5982\u679C\u9700\u8981\u68C0\u67E5modal\u72B6\u6001\u4E14modal\u5DF2\u5173\u95ED\uFF0C\u5219\u4E0D\u663E\u793AToast
      if (checkModal && !isModalOpen) {
        console.log('[Toast] Modal\u5DF2\u5173\u95ED\uFF0C\u8DF3\u8FC7Toast\u663E\u793A');
        return;
      }

      // \u9632\u6B62\u91CD\u590D\u663E\u793A\u76F8\u540C\u9519\u8BEF\uFF081\u79D2\u5185\u7684\u76F8\u540C\u9519\u8BEF\u53EA\u663E\u793A\u4E00\u6B21\uFF09
      const now = Date.now();
      if (type === 'error' && message === lastErrorMsg && now - lastErrorTime < 1000) {
        console.log('[Toast] \u8DF3\u8FC7\u91CD\u590D\u9519\u8BEF');
        return;
      }
      lastErrorMsg = message;
      lastErrorTime = now;

      const container = document.getElementById('toastContainer');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = \`toast \${type}\`;

      let title = '';
      switch (type) {
        case 'error':
          title = '\u274C \u64AD\u653E\u5931\u8D25';
          break;
        case 'warning':
          title = '\u26A0\uFE0F \u63D0\u793A';
          break;
        case 'success':
          title = '\u2705 \u6210\u529F';
          break;
        case 'info':
        default:
          title = '\u2139\uFE0F \u63D0\u793A';
          break;
      }

      toast.innerHTML = \`
        <div style="position:relative;padding-right:30px">
          <div class="toast-title">\${title}</div>
          <div class="toast-message">\${message}</div>
          <button class="toast-close">&times;</button>
        </div>
      \`;

      container.appendChild(toast);

      // \u70B9\u51FB\u5173\u95ED\u6309\u94AE
      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.onclick = () => removeToast(toast);

      // \u81EA\u52A8\u79FB\u9664
      const timeout = setTimeout(() => removeToast(toast), duration);

      // \u9F20\u6807\u60AC\u505C\u65F6\u6682\u505C\u81EA\u52A8\u79FB\u9664
      toast.onmouseenter = () => clearTimeout(timeout);
      toast.onmouseleave = () => {
        setTimeout(() => removeToast(toast), duration);
      };
    }

    function removeToast(toast) {
      if (!toast || toast.classList.contains('hiding')) return;
      toast.classList.add('hiding');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }

    // \u9875\u9762\u52A0\u8F7D\u65F6\u83B7\u53D6\u9891\u9053\u5217\u8868
    window.addEventListener('DOMContentLoaded', () => {
      // \u5C1D\u8BD5\u4ECE\u7F13\u5B58\u52A0\u8F7D\u5206\u7EC4\u6570\u636E\uFF0C\u5FEB\u901F\u6E32\u67D3\u5206\u7EC4\u5217\u8868
      const cachedGroups = getFromCache(getCacheKey('groups'));
      if (cachedGroups && cachedGroups.length > 0) {
        allGroups = cachedGroups;
        renderGroups();
        console.log('[Cache] \u4ECE\u7F13\u5B58\u52A0\u8F7D\u5206\u7EC4:', allGroups.length, '\u4E2A\u5206\u7EC4');
      }

      loadChannels();
      updateOnlineCounter();
      updateBadges();
      setInterval(updateOnlineCounter, 30000); // \u6BCF30\u79D2\u66F4\u65B0\u5728\u7EBF\u4EBA\u6570
    });

    // ========== \u672C\u5730\u7F13\u5B58\u5DE5\u5177\u51FD\u6570 ==========

    // \u7F13\u5B58\u952E\u524D\u7F00
    const CACHE_PREFIX = 'iptv_cache_';
    const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6\u5C0F\u65F6\uFF08\u6BEB\u79D2\uFF09

    // \u751F\u6210\u7F13\u5B58\u952E
    function getCacheKey(type, params = '') {
      return CACHE_PREFIX + type + '_' + params;
    }

    // \u4ECE\u672C\u5730\u7F13\u5B58\u8BFB\u53D6
    function getFromCache(key) {
      try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const data = JSON.parse(cached);
        const now = Date.now();

        // \u68C0\u67E5\u662F\u5426\u8FC7\u671F
        if (data.timestamp && now - data.timestamp < CACHE_DURATION) {
          console.log('[Cache] \u4ECE\u7F13\u5B58\u8BFB\u53D6:', key);
          return data.value;
        } else {
          // \u8FC7\u671F\u5220\u9664
          localStorage.removeItem(key);
          console.log('[Cache] \u7F13\u5B58\u5DF2\u8FC7\u671F:', key);
          return null;
        }
      } catch (error) {
        console.error('[Cache] \u8BFB\u53D6\u7F13\u5B58\u5931\u8D25:', error);
        return null;
      }
    }

    // \u5199\u5165\u672C\u5730\u7F13\u5B58
    function setCache(key, value) {
      try {
        const data = {
          timestamp: Date.now(),
          value: value
        };
        localStorage.setItem(key, JSON.stringify(data));
        console.log('[Cache] \u5DF2\u7F13\u5B58:', key);
      } catch (error) {
        console.error('[Cache] \u5199\u5165\u7F13\u5B58\u5931\u8D25:', error);
      }
    }

    // \u6E05\u9664\u7F13\u5B58
    function clearCache() {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(CACHE_PREFIX)) {
            localStorage.removeItem(key);
          }
        });
        console.log('[Cache] \u5DF2\u6E05\u9664\u6240\u6709\u7F13\u5B58');
      } catch (error) {
        console.error('[Cache] \u6E05\u9664\u7F13\u5B58\u5931\u8D25:', error);
      }
    }
    
    async function loadChannels(page = 1, updateGroups = true) {
      try {
        const params = new URLSearchParams({
          page: page,
          page_size: pageSize
        });
        if (currentSearch) {
          params.append('search', currentSearch);
        }
        // \u641C\u7D22\u65F6\u4E0D\u8981\u5206\u7EC4\u9650\u5236\uFF0C\u53EA\u5728\u975E\u641C\u7D22\u72B6\u6001\u4E0B\u624D\u5E94\u7528\u5206\u7EC4\u8FC7\u6EE4
        if (currentGroup && !currentSearch) {
          params.append('group', currentGroup);
        }

        // \u751F\u6210\u7F13\u5B58\u952E\uFF08\u641C\u7D22\u65F6\u548C\u5206\u7EC4\u8FC7\u6EE4\u65F6\u4F7F\u7528\u7F13\u5B58\uFF0C\u5206\u9875\u4F7F\u7528\u7F13\u5B58\uFF09
        const paramsStr = params.toString();
        const cacheKey = getCacheKey('channels', paramsStr);

        // \u5C1D\u8BD5\u4ECE\u7F13\u5B58\u8BFB\u53D6
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
          // \u4F7F\u7528\u7F13\u5B58\u6570\u636E
          currentPage = cachedData.pagination?.page || 1;
          totalPages = cachedData.pagination?.total_pages || 1;
          totalChannels = cachedData.pagination?.total || 0;
          allChannels = cachedData.channels || [];

          // \u9700\u8981\u66F4\u65B0\u5206\u7EC4\u65F6\u624D\u66F4\u65B0\uFF08\u641C\u7D22\u65F6\u4E0D\u66F4\u65B0\uFF09
          if (updateGroups) {
            allGroups = cachedData.groups || [];
            renderGroups();
          }

          renderChannels(allChannels);
          renderPagination();

          document.getElementById('loading').style.display = 'none';
          document.getElementById('channelList').style.display = 'block';

          // \u9690\u85CF\u52A0\u8F7D\u6307\u793A\u5668
          hideLoadingIndicator();

          return;
        }

        // \u7F13\u5B58\u672A\u547D\u4E2D\uFF0C\u4ECE\u670D\u52A1\u5668\u83B7\u53D6
        const response = await fetch(API_BASE + '/channels?' + paramsStr);
        const data = await response.json();


        if (data.success) {
          currentPage = data.pagination?.page || 1;
          totalPages = data.pagination?.total_pages || 1;
          totalChannels = data.pagination?.total || 0;
          allChannels = data.channels || [];

          // \u9700\u8981\u66F4\u65B0\u5206\u7EC4\u65F6\u624D\u66F4\u65B0\uFF08\u641C\u7D22\u65F6\u4E0D\u66F4\u65B0\uFF09
          if (updateGroups) {
            allGroups = data.groups || [];
            renderGroups();
          }

          renderChannels(allChannels);
          renderPagination();

          document.getElementById('loading').style.display = 'none';
          document.getElementById('channelList').style.display = 'block';

          // \u7F13\u5B58\u6570\u636E\uFF086\u5C0F\u65F6\uFF09
          setCache(cacheKey, data);

          // \u5355\u72EC\u7F13\u5B58\u5206\u7EC4\u6570\u636E\uFF08\u7528\u4E8E\u5FEB\u901F\u8BBF\u95EE\uFF09
          if (updateGroups && data.groups) {
            const groupsCacheKey = getCacheKey('groups');
            setCache(groupsCacheKey, data.groups);
          }

          // \u9690\u85CF\u52A0\u8F7D\u6307\u793A\u5668
          hideLoadingIndicator();
        } else {
          showError(t('noChannels') + ': ' + t('noChannelsDesc'));
          hideLoadingIndicator();
        }
      } catch (error) {
        console.error('\u52A0\u8F7D\u5931\u8D25:', error);
        showError(t('noChannels') + ': ' + t('noChannelsDesc'));
        hideLoadingIndicator();
      }
    }
    
    function renderGroups() {
      const container = document.getElementById('groupList');
      container.innerHTML = allGroups.map(group =>
        \`<div class="group-item ripple" data-group="\${escapeHtml(group)}" onclick="filterByGroup('\${escapeHtml(group)}')">
          \${escapeHtml(group)}
        </div>\`
      ).join('');

      // \u6E32\u67D3\u79FB\u52A8\u7AEF\u5206\u7EC4\u5217\u8868
      const mobileContainer = document.getElementById('mobileGroupList');
      if (mobileContainer) {
        mobileContainer.innerHTML = \`<div class="mobile-group-item active" data-group="" onclick="filterByGroup('')">\${t('allChannels')}</div>\` +
          allGroups.map(group =>
            \`<div class="mobile-group-item" data-group="\${escapeHtml(group)}" onclick="filterByGroup(&apos;\${escapeHtml(group)}&apos;)">
              \${escapeHtml(group)}
            </div>\`
          ).join('');
      }

      // \u66F4\u65B0\u9009\u4E2D\u72B6\u6001\uFF08\u5305\u62EC\u786C\u7F16\u7801\u7684"\u5168\u90E8\u9891\u9053"\u9009\u9879\uFF09
      document.querySelectorAll('.group-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.group === currentGroup) {
          item.classList.add('active');
        }

        // \u6DFB\u52A0\u6CE2\u7EB9\u6548\u679C
        item.addEventListener('click', function(e) {
          createRipple(item);
        });
      });

      // \u66F4\u65B0\u79FB\u52A8\u7AEF\u5206\u7EC4\u9009\u4E2D\u72B6\u6001
      document.querySelectorAll('.mobile-group-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.group === currentGroup) {
          item.classList.add('active');
        }

        // \u6DFB\u52A0\u70B9\u51FB\u4E8B\u4EF6\u5173\u95ED\u83DC\u5355
        item.addEventListener('click', function() {
          const mobileMenu = document.getElementById('mobileMenu');
          const overlay = document.getElementById('mobileMenuOverlay');
          if (mobileMenu && overlay) {
            mobileMenu.classList.remove('open');
            overlay.classList.remove('open');
          }
        });
      });
    }
    
    function renderChannels(channels) {
      const container = document.getElementById('channelsGrid');
      const emptyState = document.getElementById('emptyState');

      if (channels.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
      }

      emptyState.style.display = 'none';
      container.innerHTML = channels.map(channel => {
        const logo = channel.logo
          ? \`<img src="\${escapeHtml(channel.logo)}" alt="\${escapeHtml(channel.channel_name)}">\`
          : '<div class="channel-icon">\u{1F4FA}</div>';

        const isFavorited = favorites.some(f => f.hash === channel.channel_hash);
        const hotIndex = Math.floor(Math.random() * 20); // \u968F\u673A\u663E\u793A\u70ED\u95E8\u6807\u7B7E
        const showHotTag = hotIndex === 0;

        return \`
          <div class="channel-card ripple" onclick="handleChannelClick(event, '\${escapeHtml(channel.channel_hash)}', '\${escapeHtml(channel.channel_name)}', '\${escapeHtml(channel.group_title || '')}')">
            <div class="channel-poster">
              \${logo}
              \${showHotTag ? '<div class="hot-tag">' + t('hot') + '</div>' : ''}
              <button class="favorite-btn \${isFavorited ? 'favorited' : ''}" onclick="event.stopPropagation();toggleFavorite('\${escapeHtml(channel.channel_hash)}', '\${escapeHtml(channel.channel_name)}', '\${escapeHtml(channel.group_title || '')}')" data-hash="\${escapeHtml(channel.channel_hash)}">\${isFavorited ? '\u2B50' : '\u2606'}</button>
              <div class="play-overlay">
                <div class="play-icon"></div>
              </div>
            </div>
            <div class="channel-info">
              <div class="channel-name">\${escapeHtml(channel.channel_name)}</div>
              <div class="channel-group">\${escapeHtml(channel.group_title || '')}</div>
            </div>
          </div>
        \`;
      }).join('');

      // \u6DFB\u52A0\u6CE2\u7EB9\u6548\u679C
      container.querySelectorAll('.channel-card').forEach(card => {
        card.addEventListener('click', function(e) {
          createRipple(card);
        });
      });
    }
    
    function filterByGroup(group) {
      // \u79FB\u52A8\u7AEF\uFF1A\u5173\u95ED\u83DC\u5355
      const mobileMenu = document.getElementById('mobileMenu');
      const overlay = document.getElementById('mobileMenuOverlay');
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        overlay.classList.remove('open');
      }

      // \u6DFB\u52A0\u70B9\u51FB\u6CE2\u7EB9\u6548\u679C
      const escapedGroup = escapeHtml(group);
      const clickedItem = document.querySelector(\`.group-item[data-group="\${escapedGroup}"]\`);
      if (clickedItem) {
        createRipple(clickedItem);
      }

      // \u663E\u793A\u52A0\u8F7D\u63D0\u793A
      showLoadingIndicator(t('loadingCache'));

      currentGroup = group;
      currentPage = 1; // \u91CD\u7F6E\u5230\u7B2C\u4E00\u9875

      // \u66F4\u65B0\u6807\u9898
      if (group === 'history') {
        document.getElementById('sectionTitle').textContent = \`\u{1F550} \${t('history')}\`;
      } else if (group === 'favorites') {
        document.getElementById('sectionTitle').textContent = \`\u2B50 \${t('favorites')}\`;
      } else if (group === 'random') {
        document.getElementById('sectionTitle').textContent = \`\u{1F3AF} \${t('random')}\`;
      } else {
        document.getElementById('sectionTitle').textContent = group || t('allChannels');
      }

      // \u5982\u679C\u662F\u6536\u85CF\u5206\u7EC4\uFF0C\u663E\u793A\u6536\u85CF\u5217\u8868
      if (group === 'favorites') {
        renderFavorites();
        document.getElementById('pagination').innerHTML = '';
        hideLoadingIndicator();
        return;
      }

      // \u5982\u679C\u662F\u64AD\u653E\u5386\u53F2\uFF0C\u663E\u793A\u5386\u53F2\u5217\u8868
      if (group === 'history') {
        showHistoryInMain();
        hideLoadingIndicator();
        return;
      }

      // \u5982\u679C\u662F\u968F\u673A\u63A8\u8350\uFF0C\u663E\u793A\u63A8\u8350\u5217\u8868
      if (group === 'random') {
        showRandomInMain();
        hideLoadingIndicator();
        return;
      }

      // \u91CD\u65B0\u52A0\u8F7D\u9891\u9053
      loadChannels(1);
    }

    // \u5904\u7406\u9891\u9053\u70B9\u51FB
    function handleChannelClick(event, hash, name, group) {
      // \u6DFB\u52A0\u70B9\u51FB\u9AD8\u4EAE\u6548\u679C
      const card = event.currentTarget;
      card.classList.add('click-highlight');
      setTimeout(() => {
        card.classList.remove('click-highlight');
      }, 300);

      // \u64AD\u653E\u9891\u9053
      playChannel(hash, name, group);
    }

    // \u5904\u7406\u5FEB\u6377\u6309\u94AE\u70B9\u51FB
    function handleQuickEntryClick(event, type) {
      const button = event.currentTarget;
      createRipple(button);

      switch (type) {
        case 'history':
          showHistoryInMain();
          break;
        case 'favorites':
          showFavoritesInMain();
          break;
        case 'random':
          showRandomInMain();
          break;
        case 'clearCache':
          // \u6E05\u9664\u7F13\u5B58\u5E76\u5237\u65B0
          clearCache();
          // \u91CD\u65B0\u52A0\u8F7D\u9891\u9053\u5217\u8868
          loadChannels(1, true);
          // \u663E\u793A\u63D0\u793A
          showPlayingIndicator(t('cacheCleared'));
          break;
      }
    }

    // \u521B\u5EFA\u6CE2\u7EB9\u6548\u679C
    function createRipple(element) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');

      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';

      element.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    }

    // \u663E\u793A\u52A0\u8F7D\u6307\u793A\u5668
    function showLoadingIndicator(text) {
      const indicator = document.getElementById('loadingIndicator');
      const loadingText = document.getElementById('loadingText');
      loadingText.textContent = text;
      indicator.classList.add('active');
    }

    // \u9690\u85CF\u52A0\u8F7D\u6307\u793A\u5668
    function hideLoadingIndicator() {
      const indicator = document.getElementById('loadingIndicator');
      indicator.classList.remove('active');
    }

    // \u663E\u793A\u64AD\u653E\u63D0\u793A
    function showPlayingIndicator(channelName) {
      // \u521B\u5EFA\u64AD\u653E\u63D0\u793A\u5143\u7D20
      let indicator = document.getElementById('playingIndicator');
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'playingIndicator';
        indicator.className = 'playing-indicator';
        indicator.style.cssText = 'position:fixed;top:80px;right:20px;z-index:1000;background:rgba(20,20,20,.95);backdrop-filter:blur(20px);padding:12px 20px;border-radius:8px;border:1px solid rgba(255,255,255,.1);box-shadow:0 4px 20px rgba(0,0,0,.5);';
        document.body.appendChild(indicator);
      }

      indicator.innerHTML = \`
        <div class="playing-dots">
          <div class="playing-dot"></div>
          <div class="playing-dot"></div>
          <div class="playing-dot"></div>
        </div>
        <span>\${t('playing')}: \${escapeHtml(channelName)}</span>
      \`;

      // 3\u79D2\u540E\u81EA\u52A8\u6D88\u5931
      setTimeout(() => {
        if (indicator.parentNode) {
          indicator.style.animation = 'fadeInUp 0.3s ease reverse';
          setTimeout(() => {
            if (indicator.parentNode) {
              indicator.remove();
            }
          }, 300);
        }
      }, 3000);
    }
    
    function handleSearch() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const keyword = document.getElementById('searchInput').value.trim();

        if (!keyword) {
          currentSearch = '';
          currentPage = 1;
          // \u6E05\u7A7A\u641C\u7D22\u65F6\u9700\u8981\u66F4\u65B0\u5206\u7EC4\u5217\u8868
          loadChannels(1, true);
          return;
        }

        showLoadingIndicator(t('searching'));
        currentSearch = keyword;
        currentPage = 1; // \u91CD\u7F6E\u5230\u7B2C\u4E00\u9875

        // \u641C\u7D22\u65F6\u4E0D\u66F4\u65B0\u5206\u7EC4\u5217\u8868\uFF0C\u4FDD\u6301\u539F\u6709\u5206\u7EC4\u663E\u793A
        loadChannels(1, false);
        document.getElementById('sectionTitle').textContent = \`\${t('search')}: \${escapeHtml(keyword)}\`;
      }, 300);
    }

    function goToPage(page) {
      if (page >= 1 && page <= totalPages) {
        loadChannels(page);
        // \u6EDA\u52A8\u5230\u9891\u9053\u5217\u8868\u9876\u90E8
        document.getElementById('channelList').scrollIntoView({ behavior: 'smooth' });
      }
    }

    function renderPagination() {
      const container = document.getElementById('pagination');
      if (totalPages <= 1) {
        container.innerHTML = '';
        return;
      }

      let html = \`<span class="pagination-info">\${t('totalPages')} \${totalChannels}, \${t('page')} \${currentPage}/\${totalPages}</span>\`;
      html += \`<button onclick="goToPage(1)" \${currentPage === 1 ? 'disabled' : ''}>\${t('firstPage')}</button>\`;
      html += \`<button onclick="goToPage(\${currentPage - 1})" \${currentPage === 1 ? 'disabled' : ''}>\${t('prevPage')}</button>\`;

      const maxButtons = 7;
      let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalPages, startPage + maxButtons - 1);

      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        html += \`<button onclick="goToPage(\${i})" class="\${i === currentPage ? 'active' : ''}">\${i}</button>\`;
      }

      html += \`<button onclick="goToPage(\${currentPage + 1})" \${currentPage === totalPages ? 'disabled' : ''}>\${t('nextPage')}</button>\`;
      html += \`<button onclick="goToPage(\${totalPages})" \${currentPage === totalPages ? 'disabled' : ''}>\${t('lastPage')}</button>\`;

      container.innerHTML = html;
    }

    function playChannel(hash, name, group, retryCount = 0) {
      // \u751F\u6210\u65B0\u7684\u64AD\u653E\u8BF7\u6C42ID
      const requestId = ++currentPlayRequestId;
      console.log('[PlayChannel] Request #' + requestId + ':', name);

      // \u53D6\u6D88\u4E4B\u524D\u6240\u6709\u672A\u5B8C\u6210\u7684\u8BF7\u6C42
      abortAllFetches();
      cleanupVideoResources();

      
      // \u68C0\u67E5\u8FD9\u4E2A\u8BF7\u6C42\u662F\u5426\u5DF2\u7ECF\u88AB\u53D6\u6D88
      if (requestId !== currentPlayRequestId) {
        console.log('[PlayChannel] Request #' + requestId + ' was cancelled');
        return;
      }

      // \u663E\u793A\u64AD\u653E\u63D0\u793A
      showPlayingIndicator(name);

      // \u6DFB\u52A0\u5230\u5386\u53F2\u8BB0\u5F55 - \u652F\u6301\u76F4\u63A5\u4F7F\u7528\u4F20\u5165\u7684\u53C2\u6570
      const channel = allChannels.find(c => c.channel_hash === hash);
      if (channel) {
        addToHistory(channel);
      } else if (hash && name) {
        // \u5982\u679C\u5728\u5F53\u524D\u5217\u8868\u4E2D\u627E\u4E0D\u5230\u9891\u9053\uFF0C\u76F4\u63A5\u7528\u4F20\u5165\u53C2\u6570\u521B\u5EFA\u5386\u53F2\u8BB0\u5F55
        addToHistory({
          channel_hash: hash,
          channel_name: name,
          group_title: group
        });
      }

      const playerWrapper = document.getElementById('playerWrapper');
      const video = document.getElementById('videoPlayer');
      const title = document.getElementById('playerTitle');
      const groupName = document.getElementById('playerGroup');

      title.textContent = name;
      groupName.textContent = group;

      // \u5982\u679C\u64AD\u653E\u5668\u8FD8\u6CA1\u6253\u5F00\uFF0C\u5148\u663E\u793A\u51FA\u6765
      if (!isPlayerOpen) {
        playerWrapper.classList.add('active');
        // \u79FB\u52A8\u7AEF\uFF1A\u64AD\u653E\u5668\u6FC0\u6D3B\u65F6\uFF0C\u5728main\u4E0A\u6DFB\u52A0class
        if (window.innerWidth <= 768) {
          document.querySelector('.main').classList.add('player-active');
        }
      }


      isPlayerOpen = true;

      // \u521B\u5EFA\u65B0\u7684 AbortController \u7528\u4E8E\u8FD9\u6B21\u8BF7\u6C42
      const tokenController = new AbortController();
      const playController = new AbortController();
      activeFetchControllers.push(tokenController, playController);

      // \u6839\u636E\u7CFB\u7EDF\u914D\u7F6E\u51B3\u5B9A\u662F\u5426\u4F7F\u7528token
      const useToken = systemConfig.enable_play_token;

      if (useToken) {
        // \u5148\u83B7\u53D6token\uFF0C\u518D\u83B7\u53D6\u64AD\u653E\u5730\u5740
        fetch(window.location.origin + '/api/token?hash=' + encodeURIComponent(hash), {
          signal: tokenController.signal
        })
          .then(res => {
            // \u68C0\u67E5\u8BF7\u6C42\u662F\u5426\u88AB\u53D6\u6D88
            if (requestId !== currentPlayRequestId) {
              throw new Error('Request cancelled');
            }
            return res.json();
          })
          .then(data => {
            // \u518D\u6B21\u68C0\u67E5
            if (requestId !== currentPlayRequestId) {
              throw new Error('Request cancelled');
            }

            if (data.success && data.token) {
              console.log('[PlayChannel] Request #' + requestId + ': Token received');
              // \u4F7F\u7528token\u83B7\u53D6\u64AD\u653E\u5730\u5740
              return fetch(window.location.origin + '/api/play/' + hash + '?token=' + encodeURIComponent(data.token), {
                signal: playController.signal
              });
            } else {
              throw new Error('Failed to get token');
            }
          })
          .then(res => {
            // \u518D\u6B21\u68C0\u67E5
            if (requestId !== currentPlayRequestId) {
              throw new Error('Request cancelled');
            }
            return res.json();
          })
          .then(data => {
            // \u518D\u6B21\u68C0\u67E5
            if (requestId !== currentPlayRequestId) {
              console.log('[PlayChannel] Request #' + requestId + ': Response received but cancelled');
              return;
            }

            if (data.success && data.play_url) {
              let playUrl = data.play_url;

              // \u5982\u679C\u8FD4\u56DE\u7684\u662F\u52A0\u5BC6\u7684URL\uFF0C\u8FDB\u884C\u89E3\u5BC6
              if (data.encoded && data.encryption === 'aes-gcm') {
                decryptAES(playUrl, DECRYPTION_KEY)
                  .then(decryptedUrl => {
                    // \u6700\u540E\u4E00\u6B21\u68C0\u67E5
                    if (requestId !== currentPlayRequestId) {
                      console.log('[PlayChannel] Request #' + requestId + ': Decrypted but cancelled');
                      return;
                    }
                    console.log('[PlayChannel] Request #' + requestId + ': URL decrypted:', decryptedUrl);
                    startPlay(decryptedUrl, video);
                  })
                  .catch(async (e) => {
                    console.error('[PlayChannel] URL decryption failed:', e);

                    // \u5982\u679C\u662F\u7B2C\u4E00\u6B21\u89E3\u5BC6\u5931\u8D25\uFF0C\u5C1D\u8BD5\u66F4\u65B0\u5BC6\u94A5\u5E76\u91CD\u8BD5
                    if (retryCount === 0) {
                      console.log('[PlayChannel] Try updating key and retry');
                      const keyUpdated = await updateEncryptionKey();
                      if (keyUpdated) {
                        console.log('[PlayChannel] Key updated, retrying');
                        playChannel(hash, name, group, 1);  // \u91CD\u8BD5\u4E00\u6B21
                        return;
                      }
                    }

                    // \u66F4\u65B0\u5BC6\u94A5\u5931\u8D25\u6216\u5DF2\u91CD\u8BD5\u8FC7\uFF0C\u5173\u95ED\u64AD\u653E\u5668
                    console.error('[PlayChannel] Decryption failed, cannot play');
                    closePlayer();
                  });
                return; // \u5F02\u6B65\u89E3\u5BC6\uFF0C\u63D0\u524D\u8FD4\u56DE
              }

              console.log('[PlayChannel] Request #' + requestId + ': Play URL:', playUrl);
              startPlay(playUrl, video);
            } else {
              console.error('Channel temporarily unavailable');
              closePlayer();
            }
          })
          .catch(function(error) {
            if (error.name === 'AbortError' || error.message === 'Request cancelled') {
              console.log('[PlayChannel] Request #' + requestId + ' was cancelled');
              return;  // \u9759\u9ED8\u5904\u7406\u53D6\u6D88\u7684\u9519\u8BEF
            }
            console.error('[PlayChannel] Playback failed:', error);
            closePlayer();
          })
          .finally(() => {
            // \u6E05\u7406\u63A7\u5236\u5668
            const index = activeFetchControllers.indexOf(tokenController);
            if (index > -1) activeFetchControllers.splice(index, 1);
            const index2 = activeFetchControllers.indexOf(playController);
            if (index2 > -1) activeFetchControllers.splice(index2, 1);
          });
      } else {
        // \u4E0D\u4F7F\u7528token\uFF0C\u76F4\u63A5\u83B7\u53D6\u64AD\u653E\u5730\u5740
        console.log('[PlayChannel] Request #' + requestId + ': Direct play (no token)');
        fetch(window.location.origin + '/api/play/' + hash, {
          signal: playController.signal
        })
          .then(res => {
            // \u68C0\u67E5\u8BF7\u6C42\u662F\u5426\u88AB\u53D6\u6D88
            if (requestId !== currentPlayRequestId) {
              throw new Error('Request cancelled');
            }
            return res.json();
          })
          .then(data => {
            // \u518D\u6B21\u68C0\u67E5
            if (requestId !== currentPlayRequestId) {
              console.log('[PlayChannel] Request #' + requestId + ': Response received but cancelled');
              return;
            }

            if (data.success && data.play_url) {
              let playUrl = data.play_url;

              // \u5982\u679C\u8FD4\u56DE\u7684\u662F\u52A0\u5BC6\u7684URL\uFF0C\u8FDB\u884C\u89E3\u5BC6
              if (data.encoded && data.encryption === 'aes-gcm') {
                decryptAES(playUrl, DECRYPTION_KEY)
                  .then(decryptedUrl => {
                    // \u6700\u540E\u4E00\u6B21\u68C0\u67E5
                    if (requestId !== currentPlayRequestId) {
                      console.log('[PlayChannel] Request #' + requestId + ': Decrypted but cancelled');
                      return;
                    }
                    console.log('[PlayChannel] Request #' + requestId + ': URL decrypted:', decryptedUrl);
                    startPlay(decryptedUrl, video);
                  })
                  .catch(async (e) => {
                    console.error('[PlayChannel] URL decryption failed:', e);

                    // \u5982\u679C\u662F\u7B2C\u4E00\u6B21\u89E3\u5BC6\u5931\u8D25\uFF0C\u5C1D\u8BD5\u66F4\u65B0\u5BC6\u94A5\u5E76\u91CD\u8BD5
                    if (retryCount === 0) {
                      console.log('[PlayChannel] Try updating key and retry');
                      const keyUpdated = await updateEncryptionKey();
                      if (keyUpdated) {
                        console.log('[PlayChannel] Key updated, retrying');
                        playChannel(hash, name, group, 1);  // \u91CD\u8BD5\u4E00\u6B21
                        return;
                      }
                    }

                    // \u66F4\u65B0\u5BC6\u94A5\u5931\u8D25\u6216\u5DF2\u91CD\u8BD5\u8FC7\uFF0C\u5173\u95ED\u64AD\u653E\u5668
                    console.error('[PlayChannel] Decryption failed, cannot play');
                    closePlayer();
                  });
                return; // \u5F02\u6B65\u89E3\u5BC6\uFF0C\u63D0\u524D\u8FD4\u56DE
              }

              console.log('[PlayChannel] Request #' + requestId + ': Play URL:', playUrl);
              startPlay(playUrl, video);
            } else {
              console.error('Channel temporarily unavailable');
              closePlayer();
            }
          })
          .catch(function(error) {
            if (error.name === 'AbortError' || error.message === 'Request cancelled') {
              console.log('[PlayChannel] Request #' + requestId + ' was cancelled');
              return;  // \u9759\u9ED8\u5904\u7406\u53D6\u6D88\u7684\u9519\u8BEF
            }
            console.error('[PlayChannel] Playback failed:', error);
            closePlayer();
          })
          .finally(() => {
            // \u6E05\u7406\u63A7\u5236\u5668
            const index2 = activeFetchControllers.indexOf(playController);
            if (index2 > -1) activeFetchControllers.splice(index2, 1);
          });
      }
    }

    // \u53D6\u6D88\u6240\u6709\u8FDB\u884C\u4E2D\u7684 fetch \u8BF7\u6C42
    function abortAllFetches() {
      if (activeFetchControllers.length > 0) {
        console.log('[Abort] Canceling ' + activeFetchControllers.length + ' pending requests');
        activeFetchControllers.forEach(controller => {
          try {
            controller.abort();
          } catch (e) {
            // \u5FFD\u7565\u5DF2\u53D6\u6D88\u7684\u63A7\u5236\u5668
          }
        });
        activeFetchControllers = [];
      }
    }

    // \u6E05\u7406\u89C6\u9891\u8D44\u6E90
    function cleanupVideoResources() {
      const video = document.getElementById('videoPlayer');

      // \u9500\u6BC1 HLS \u5B9E\u4F8B
      if (currentHls) {
        console.log('[Cleanup] Destroying HLS instance');
        currentHls.destroy();
        currentHls = null;
      }

      // \u505C\u6B62\u89C6\u9891\u5E76\u6E05\u7A7A\u6E90
      video.pause();
      video.src = '';
      video.load();
      video.removeAttribute('src');

      console.log('[Cleanup] Video resources cleaned');
    }

    function togglePlayerSize() {
      const playerWrapper = document.getElementById('playerWrapper');
      const mainElement = document.querySelector('.main');
      const rect = playerWrapper.getBoundingClientRect();
      const isMobile = window.innerWidth <= 768;

      if (!isPlayerExpanded) {
        // \u4ECE\u6298\u53E0\u72B6\u6001\u5207\u6362\u5230\u5C55\u5F00\u72B6\u6001
        if (isMobile) {
          // \u79FB\u52A8\u7AEF\uFF1A\u5C55\u5F00\u65F6\u8C03\u6574main\u7684padding-top
          mainElement.classList.remove('player-active');
          mainElement.classList.add('player-expanded');
        } else {
          // \u684C\u9762\u7AEF\uFF1A\u4FDD\u5B58\u5F53\u524D\u4E2D\u5FC3\u70B9
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          // \u6E05\u9664\u5B9A\u4F4D\uFF0C\u8BA9 CSS \u7C7B\u63A7\u5236
          playerWrapper.style.left = '';
          playerWrapper.style.right = '';
          playerWrapper.style.top = '';
          playerWrapper.style.bottom = '';
        }
      } else {
        // \u4ECE\u5C55\u5F00\u72B6\u6001\u5207\u6362\u5230\u6298\u53E0\u72B6\u6001
        if (isMobile) {
          // \u79FB\u52A8\u7AEF\uFF1A\u6298\u53E0\u65F6\u6062\u590Dmain\u7684padding
          mainElement.classList.remove('player-expanded');
          mainElement.classList.add('player-active');
        } else {
          // \u684C\u9762\u7AEF\uFF1A\u6062\u590D\u5230\u53F3\u4E0B\u89D2\u9ED8\u8BA4\u4F4D\u7F6E
          playerWrapper.style.left = '';
          playerWrapper.style.right = '20px';
          playerWrapper.style.top = '';
          playerWrapper.style.bottom = '20px';
        }
      }

      isPlayerExpanded = !isPlayerExpanded;
      playerWrapper.classList.toggle('expanded', isPlayerExpanded);
      playerWrapper.classList.toggle('collapsed', !isPlayerExpanded);
    }

    // \u542F\u52A8\u64AD\u653E
    function startPlay(playUrl, video) {
      console.log('\u5F00\u59CB\u64AD\u653E:', playUrl);

      // \u68C0\u6D4B\u6E90\u7C7B\u578B
      const isHls = playUrl.includes('.m3u8') ||
                     playUrl.includes('m3u8') ||
                     playUrl.includes('application/x-mpegURL') ||
                     playUrl.includes('.ts') ||
                     playUrl.endsWith('.ts') ||
                     playUrl.includes('application/x-mpegTS');

      console.log('\u89C6\u9891\u6E90\u7C7B\u578B:', { url: playUrl, isHls });

      if (isHls && Hls.isSupported()) {
        // \u4F7F\u7528 Hls.js \u64AD\u653E
        console.log('\u4F7F\u7528 Hls.js \u64AD\u653E');
        currentHls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30
        });

        currentHls.loadSource(playUrl);
        currentHls.attachMedia(video);

        currentHls.on(Hls.Events.MANIFEST_PARSED, function() {
          console.log('HLS manifest parsed, \u5F00\u59CB\u64AD\u653E');
          video.play().catch(function(e) { console.error('\u64AD\u653E\u5931\u8D25:', e); });
        });

        currentHls.on(Hls.Events.ERROR, function(event, data) {
          console.error('HLS\u9519\u8BEF:', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('\u7F51\u7EDC\u9519\u8BEF:', data);
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('\u5C1D\u8BD5\u6062\u590D\u5A92\u4F53\u9519\u8BEF');
                currentHls.recoverMediaError();
                break;
              default:
                console.log('\u65E0\u6CD5\u6062\u590D\u7684\u9519\u8BEF\uFF0C\u9500\u6BC1Hls\u5B9E\u4F8B');
                currentHls.destroy();
                break;
            }
          }
        });
      } else {
        // \u975EHLS\u6E90\uFF0C\u4F7F\u7528\u539F\u751Fvideo\u64AD\u653E
        console.log('\u4F7F\u7528\u539F\u751Fvideo\u64AD\u653E\uFF08\u975EHLS\uFF09');
        video.src = playUrl;
        video.load();

        video.addEventListener('error', function(e) {
          const errorCode = video.error ? video.error.code : 0;
          console.error('\u539F\u751Fvideo\u9519\u8BEF:', errorCode, video.error);
        });

        video.addEventListener('play', function() {
          console.log('\u89C6\u9891\u5F00\u59CB\u64AD\u653E');
          setTimeout(function() {
            if (video.readyState >= 2) {
              const videoWidth = video.videoWidth;
              const videoHeight = video.videoHeight;
              console.log('\u89C6\u9891\u5206\u8FA8\u7387:', videoWidth, 'x', videoHeight);

              if (videoWidth === 0 || videoHeight === 0) {
                console.warn('\u68C0\u6D4B\u5230\u9ED1\u5C4F\u95EE\u9898: \u5206\u8FA8\u7387\u4E3A0');
              }
            }
          }, 3000);
        });

        video.play().catch(function(e) {
          console.error('\u64AD\u653E\u5931\u8D25:', e);
        });
      }
    }
    
    function closePlayer() {
      const playerWrapper = document.getElementById('playerWrapper');
      const mainElement = document.querySelector('.main');

      // \u53D6\u6D88\u6240\u6709\u8FDB\u884C\u4E2D\u7684\u8BF7\u6C42
      abortAllFetches();

      // \u6E05\u7406\u89C6\u9891\u8D44\u6E90
      cleanupVideoResources();

      isPlayerOpen = false;
      isPlayerExpanded = false;

      playerWrapper.classList.remove('active');
      playerWrapper.classList.remove('expanded');
      playerWrapper.classList.add('collapsed');

      // \u79FB\u52A8\u7AEF\uFF1A\u79FB\u9664main\u4E0A\u7684\u64AD\u653E\u5668\u76F8\u5173class
      if (window.innerWidth <= 768) {
        mainElement.classList.remove('player-active');
        mainElement.classList.remove('player-expanded');
      } else {
        // \u684C\u9762\u7AEF\uFF1A\u91CD\u7F6E\u5B9A\u4F4D\u5230\u9ED8\u8BA4\u4F4D\u7F6E
        playerWrapper.style.left = '';
        playerWrapper.style.right = '20px';
        playerWrapper.style.top = '';
        playerWrapper.style.bottom = '20px';
      }
    }
    
    function showError(message) {
      document.getElementById('loading').innerHTML = \`<div style="color:#e50914">\${escapeHtml(message)}</div>\`;
    }
    
    function escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    // \u6309ESC\u5173\u95ED\u64AD\u653E\u5668
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        // \u5982\u679C\u64AD\u653E\u5668\u5C55\u5F00\uFF0C\u5148\u6298\u53E0\uFF1B\u5982\u679C\u5DF2\u6298\u53E0\uFF0C\u5219\u5173\u95ED
        if (isPlayerOpen && isPlayerExpanded) {
          togglePlayerSize();
        } else {
          closePlayer();
        }
      }
    });

    // \u9875\u9762\u5378\u8F7D\u65F6\u6E05\u7406\u8D44\u6E90
    window.addEventListener('beforeunload', function() {
      console.log('[Player] Page unloading, cleaning up');
      if (currentHls) {
        currentHls.destroy();
        currentHls = null;
      }
    });

    // \u70B9\u51FB\u5916\u90E8\u5173\u95ED\u8BED\u8A00\u4E0B\u62C9\u83DC\u5355
    document.addEventListener('click', function(e) {
      const dropdown = document.getElementById('langDropdown');
      if (dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });

    // \u64AD\u653E\u5668\u62D6\u52A8\u529F\u80FD
    (function() {
      const playerWrapper = document.getElementById('playerWrapper');
      const playerHeader = document.getElementById('playerHeader');
      let isDragging = false;
      let startX, startY, startLeft, startBottom;

      playerHeader.addEventListener('mousedown', function(e) {
        if (e.target.classList.contains('player-btn')) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = playerWrapper.getBoundingClientRect();
        startLeft = rect.left;
        startBottom = window.innerHeight - rect.bottom;
        playerHeader.style.cursor = 'grabbing';
        e.preventDefault();
      });

      document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const newLeft = startLeft + dx;
        const newBottom = startBottom - dy;

        // \u9650\u5236\u62D6\u52A8\u8303\u56F4\uFF0C\u9632\u6B62\u8D85\u51FA\u5C4F\u5E55
        const maxX = window.innerWidth - 50;
        const maxY = window.innerHeight - 50;

        playerWrapper.style.right = 'auto';
        playerWrapper.style.left = Math.max(0, Math.min(newLeft, maxX)) + 'px';
        playerWrapper.style.bottom = Math.max(0, Math.min(newBottom, maxY)) + 'px';
        playerWrapper.style.top = 'auto';
      });

      document.addEventListener('mouseup', function() {
        if (isDragging) {
          isDragging = false;
          playerHeader.style.cursor = 'move';
        }
      });

      // \u5F53\u70B9\u51FB\u653E\u5927\u65F6\uFF0C\u8BB0\u5F55\u662F\u5426\u88AB\u62D6\u52A8\u8FC7
      playerWrapper.addEventListener('transitionend', function(e) {
        if (e.propertyName === 'width' && isPlayerExpanded) {
          // \u5982\u679C\u5DF2\u7ECF\u5C55\u5F00\uFF0C\u786E\u4FDD\u4F7F\u7528 CSS \u5B9A\u4F4D\u800C\u4E0D\u662F\u5185\u8054\u6837\u5F0F
          if (playerWrapper.style.left || playerWrapper.style.top) {
            // \u6E05\u9664\u624B\u52A8\u5B9A\u4F4D\uFF0C\u8BA9 CSS \u7C7B\u5B8C\u5168\u63A7\u5236
            playerWrapper.style.left = '';
            playerWrapper.style.right = '';
            playerWrapper.style.top = '';
            playerWrapper.style.bottom = '';
          }
        }
      });
    })();

    // ========== \u65B0\u589E\u529F\u80FD\u51FD\u6570 ==========

    // \u66F4\u65B0\u52A0\u5BC6\u5BC6\u94A5\uFF08\u4ECE\u670D\u52A1\u5668\u83B7\u53D6\u6700\u65B0\u914D\u7F6E\uFF09
    async function updateEncryptionKey() {
      if (isUpdatingKey) {
        console.log('[KeyUpdate] \u6B63\u5728\u66F4\u65B0\u5BC6\u94A5\uFF0C\u8DF3\u8FC7\u91CD\u590D\u8BF7\u6C42');
        return false;
      }

      try {
        isUpdatingKey = true;
        console.log('[KeyUpdate] \u5F00\u59CB\u83B7\u53D6\u6700\u65B0\u914D\u7F6E');

        const response = await fetch(window.location.origin + '/api/config');
        const result = await response.json();

        if (result.success && result.config) {
          const { enable_play_token, enable_url_encryption, url_encryption_key } = result.config;

          // \u66F4\u65B0\u7CFB\u7EDF\u914D\u7F6E
          systemConfig.enable_play_token = enable_play_token;
          systemConfig.enable_url_encryption = enable_url_encryption;

          // \u5982\u679C\u542F\u7528\u4E86URL\u52A0\u5BC6\u4E14\u6709\u5BC6\u94A5\uFF0C\u66F4\u65B0\u5168\u5C40\u5BC6\u94A5
          if (enable_url_encryption && url_encryption_key) {
            DECRYPTION_KEY = url_encryption_key;
            console.log('[KeyUpdate] \u5BC6\u94A5\u5DF2\u66F4\u65B0');
            return true;
          } else {
            console.log('[KeyUpdate] \u672A\u542F\u7528URL\u52A0\u5BC6\u6216\u65E0\u5BC6\u94A5');
            return false;
          }
        } else {
          console.error('[KeyUpdate] \u83B7\u53D6\u914D\u7F6E\u5931\u8D25:', result);
          return false;
        }
      } catch (error) {
        console.error('[KeyUpdate] \u66F4\u65B0\u5BC6\u94A5\u5931\u8D25:', error);
        return false;
      } finally {
        isUpdatingKey = false;
      }
    }

    // ========== \u516C\u544A\u529F\u80FD ==========

    // \u52A0\u8F7D\u516C\u544A
    async function loadAnnouncement() {
      try {
        const response = await fetch(window.location.origin + '/api/announcement');
        const result = await response.json();

        if (result.success && result.data && result.data.enabled) {
          announcement = result.data;
          const displayFrequency = announcement.display_frequency || 'once';

          // \u6839\u636E\u5F39\u51FA\u9891\u7387\u51B3\u5B9A\u662F\u5426\u663E\u793A\u516C\u544A
          let shouldDisplay = false;

          if (displayFrequency === 'always') {
            // \u6BCF\u6B21\u90FD\u663E\u793A
            shouldDisplay = true;
          } else if (displayFrequency === 'once') {
            // \u4EC5\u4E00\u6B21\uFF08\u5173\u95ED\u540E\u4E0D\u518D\u663E\u793A\uFF09
            const closedKey = 'announcement_closed_' + announcement.id;
            const userClosed = localStorage.getItem(closedKey);
            shouldDisplay = !userClosed;
          } else if (displayFrequency === 'daily') {
            // \u6BCF\u5929\u4E00\u6B21
            const closedKey = 'announcement_closed_' + announcement.id;
            const lastClosed = localStorage.getItem(closedKey);

            if (!lastClosed) {
              shouldDisplay = true;
            } else {
              // \u68C0\u67E5\u662F\u5426\u662F\u4ECA\u5929
              const lastClosedDate = new Date(parseInt(lastClosed));
              const today = new Date();
              shouldDisplay = lastClosedDate.toDateString() !== today.toDateString();
            }
          } else if (displayFrequency === 'weekly') {
            // \u6BCF\u5468\u4E00\u6B21
            const closedKey = 'announcement_closed_' + announcement.id;
            const lastClosed = localStorage.getItem(closedKey);

            if (!lastClosed) {
              shouldDisplay = true;
            } else {
              // \u68C0\u67E5\u662F\u5426\u662F\u540C\u4E00\u5468
              const lastClosedDate = new Date(parseInt(lastClosed));
              const now = new Date();
              const oneWeek = 7 * 24 * 60 * 60 * 1000;
              shouldDisplay = (now.getTime() - lastClosedDate.getTime()) > oneWeek;
            }
          }

          if (shouldDisplay) {
            renderAnnouncement();
          } else {
            console.log('[Announcement] \u516C\u544A\u5DF2\u6839\u636E\u9891\u7387\u89C4\u5219\u9690\u85CF');
          }
        } else {
          console.log('[Announcement] \u65E0\u6709\u6548\u516C\u544A\u6216\u516C\u544A\u5DF2\u7981\u7528');
        }
      } catch (error) {
        console.error('[Announcement] \u52A0\u8F7D\u516C\u544A\u5931\u8D25:', error);
      }
    }

    // \u6E32\u67D3\u516C\u544A
    function renderAnnouncement() {
      if (!announcement) return;

      const modal = document.getElementById('announcementModal');
      const titleEl = document.getElementById('announcementTitle');
      const contentEl = document.getElementById('announcementContent');
      const timeEl = document.getElementById('announcementTime');

      titleEl.textContent = announcement.title || '\u7CFB\u7EDF\u516C\u544A';
      contentEl.innerHTML = announcement.content || '\u6682\u65E0\u5185\u5BB9';
      modal.classList.add('active');

      // \u683C\u5F0F\u5316\u65F6\u95F4
      if (announcement.updated_at) {
        const date = new Date(announcement.updated_at);
        const timeStr = date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
        timeEl.querySelector('span:last-child').textContent = timeStr;
      } else {
        timeEl.querySelector('span:last-child').textContent = '\u53D1\u5E03\u65F6\u95F4\u672A\u77E5';
      }
    }

    // \u5173\u95ED\u516C\u544A
    window.closeAnnouncement = function() {
      if (!announcement) return;

      const modal = document.getElementById('announcementModal');
      modal.classList.remove('active');

      // \u6839\u636E\u5F39\u51FA\u9891\u7387\u8BB0\u5F55\u5173\u95ED\u65F6\u95F4
      const displayFrequency = announcement.display_frequency || 'once';
      const closedKey = 'announcement_closed_' + announcement.id;

      if (displayFrequency === 'once') {
        // \u4EC5\u4E00\u6B21\uFF1A\u6C38\u4E45\u8BB0\u5F55
        localStorage.setItem(closedKey, 'true');
      } else if (displayFrequency === 'daily' || displayFrequency === 'weekly') {
        // \u6BCF\u5929\u4E00\u6B21\u6216\u6BCF\u5468\u4E00\u6B21\uFF1A\u8BB0\u5F55\u65F6\u95F4\u6233
        localStorage.setItem(closedKey, Date.now().toString());
      }
      // 'always' \u6A21\u5F0F\u4E0D\u8BB0\u5F55\u5173\u95ED\u72B6\u6001

      console.log('[Announcement] \u7528\u6237\u5173\u95ED\u516C\u544A ID:', announcement.id, '\u9891\u7387:', displayFrequency);
    }

    // \u5728\u7EBF\u4EBA\u6570\u663E\u793A\uFF08\u6A21\u62DF\uFF09
    function updateOnlineCounter() {
      const baseCount = Math.floor(Math.random() * 100) + 50;
      const randomOffset = Math.floor(Math.random() * 20) - 10;
      const count = baseCount + randomOffset;
      document.getElementById('onlineCount').textContent = count.toLocaleString();
    }


    // \u968F\u673A\u63A8\u8350
    async function initFeaturedChannels() {
      // \u4ECE\u540E\u7AEF\u83B7\u53D6\u968F\u673A\u63A8\u8350\u9891\u9053
      try {
        const response = await fetch(API_BASE + '/channels?action=random&count=30');
        const data = await response.json();

        if (data.success && data.channels) {
          featuredChannels = data.channels;
          console.log('\u83B7\u53D6\u5230\u968F\u673A\u63A8\u8350\u9891\u9053:', featuredChannels.length);
        } else {
          console.error('\u83B7\u53D6\u968F\u673A\u63A8\u8350\u5931\u8D25:', data.error);
          featuredChannels = [];
        }
      } catch (error) {
        console.error('\u83B7\u53D6\u968F\u673A\u63A8\u8350\u5931\u8D25:', error);
        featuredChannels = [];
      }
      // \u4E0D\u5728\u8FD9\u91CC\u9690\u85CF\u52A0\u8F7D\u63D0\u793A\uFF0C\u7531\u8C03\u7528\u65B9\u63A7\u5236
    }




    function showRandomInMain() {
      // \u663E\u793A\u52A0\u8F7D\u63D0\u793A
      showLoadingIndicator(t('loadingRecommendations'));

      // \u91CD\u65B0\u751F\u6210\u968F\u673A\u63A8\u8350
      initFeaturedChannels().then(() => {
        // \u6E05\u9664\u5206\u7EC4\u9009\u62E9
        currentGroup = 'random';
        renderGroups();

      // \u66F4\u65B0\u6807\u9898
      document.getElementById('sectionTitle').textContent = \`\u{1F3AF} \${t('random')}\`;

        // \u9690\u85CF\u52A0\u8F7D\u6307\u793A\u5668
        hideLoadingIndicator();

        // \u9690\u85CF\u52A0\u8F7D\u548C\u5206\u9875
        document.getElementById('loading').style.display = 'none';
        document.getElementById('channelList').style.display = 'block';
        document.getElementById('pagination').innerHTML = '';

        // \u83B7\u53D6\u524D30\u6761\u63A8\u8350
        const randomChannels = featuredChannels.slice(0, 30);

        if (!randomChannels || randomChannels.length === 0) {
          const container = document.getElementById('channelsGrid');
          const emptyState = document.getElementById('emptyState');
          container.innerHTML = '';
          emptyState.style.display = 'block';
        document.querySelector('.empty-title').textContent = t('noRecommendations');
        document.querySelector('.empty-desc').textContent = t('noRecommendationsDesc');
          return;
        }

        // \u6E32\u67D3\u63A8\u8350\u5217\u8868
        const container = document.getElementById('channelsGrid');
        const emptyState = document.getElementById('emptyState');
        emptyState.style.display = 'none';

        container.innerHTML = randomChannels.map((channel, index) => {
          const logo = channel.logo
            ? \`<img src="\${escapeHtml(channel.logo)}" alt="logo">\`
            : '<div class="channel-icon">\u{1F4FA}</div>';

          return \`
            <div class="channel-card ripple" onclick="handleChannelClick(event, '\${escapeHtml(channel.channel_hash)}', '\${escapeHtml(channel.channel_name)}', '\${escapeHtml(channel.group_title || '')}')">
              <div class="channel-poster">
                \${logo}
                \${index < 5 ? '<div class="hot-tag">' + t('recommend') + '</div>' : ''}
                <div class="play-overlay">
                  <div class="play-icon"></div>
                </div>
              </div>
              <div class="channel-info">
                <div class="channel-name">\${escapeHtml(channel.channel_name)}</div>
                <div class="channel-group">\${escapeHtml(channel.group_title || '')}</div>
              </div>
            </div>
          \`;
        }).join('');

        // \u6DFB\u52A0\u6CE2\u7EB9\u6548\u679C
        container.querySelectorAll('.channel-card').forEach(card => {
          card.addEventListener('click', function(e) {
            createRipple(card);
          });
        });
      });
    }

    // \u6536\u85CF\u529F\u80FD
    function toggleFavorite(hash, name, group) {
      const index = favorites.findIndex(f => f.hash === hash);
      if (index > -1) {
        favorites.splice(index, 1);
      } else {
        favorites.push({ hash, name, group, addedAt: Date.now() });
      }
      localStorage.setItem('iptv_favorites', JSON.stringify(favorites));

      // \u66F4\u65B0\u5FBD\u7AE0
      updateBadges();

      // \u5982\u679C\u5728\u6536\u85CF\u9875\u9762\uFF0C\u91CD\u65B0\u6E32\u67D3
      if (currentGroup === 'favorites') {
        renderFavorites();
      }

      // \u66F4\u65B0\u5F53\u524D\u9875\u9762\u7684\u6536\u85CF\u6309\u94AE\u72B6\u6001
      const btn = document.querySelector(\`.favorite-btn[data-hash="\${hash}"]\`);
      if (btn) {
        btn.textContent = index > -1 ? '\u2606' : '\u2B50';
        btn.classList.toggle('favorited', index > -1);
      }
    }

    function renderFavorites() {
      const container = document.getElementById('channelsGrid');
      const emptyState = document.getElementById('emptyState');
      document.getElementById('pagination').innerHTML = '';

      // \u83B7\u53D6\u524D30\u6761\u6536\u85CF
      const favoritesItems = favorites.slice(0, 30);

      if (favoritesItems.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        document.querySelector('.empty-title').textContent = t('noFavorites');
        document.querySelector('.empty-desc').textContent = t('noFavoritesDesc');
        return;
      }

      emptyState.style.display = 'none';
      container.innerHTML = favoritesItems.map(fav => {
        const logo = getLogoByHash(fav.hash);
        return \`
          <div class="channel-card" onclick="playChannel('\${escapeHtml(fav.hash)}', '\${escapeHtml(fav.name)}', '\${escapeHtml(fav.group)}')">
            <div class="channel-poster">
              \${logo}
              <button class="favorite-btn favorited" onclick="event.stopPropagation();toggleFavorite('\${escapeHtml(fav.hash)}', '\${escapeHtml(fav.name)}', '\${escapeHtml(fav.group)}')" data-hash="\${escapeHtml(fav.hash)}">\u2B50</button>
              <div class="play-overlay">
                <div class="play-icon"></div>
              </div>
            </div>
            <div class="channel-info">
              <div class="channel-name">\${escapeHtml(fav.name)}</div>
              <div class="channel-group">\${escapeHtml(fav.group)}</div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function getLogoByHash(hash) {
      // \u4F18\u5148\u4ECE\u5F53\u524D\u52A0\u8F7D\u7684\u9891\u9053\u5217\u8868\u4E2D\u67E5\u627E
      let channel = allChannels.find(c => c.channel_hash === hash);

      // \u5982\u679C\u5F53\u524D\u5217\u8868\u4E2D\u6CA1\u6709\uFF0C\u5C1D\u8BD5\u4ECE\u7F13\u5B58\u6570\u636E\u4E2D\u67E5\u627E
      if (!channel) {
        // \u83B7\u53D6\u6240\u6709\u5206\u9875\u7684\u7F13\u5B58\u6570\u636E
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(CACHE_PREFIX + 'channels_')) {
            try {
              const cached = JSON.parse(localStorage.getItem(key));
              if (cached && cached.value && cached.value.channels) {
                const found = cached.value.channels.find(c => c.channel_hash === hash);
                if (found) {
                  channel = found;
                }
              }
            } catch (e) {
              // \u5FFD\u7565\u89E3\u6790\u9519\u8BEF
            }
          }
        });
      }

      if (channel && channel.logo) {
        return \`<img src="\${escapeHtml(channel.logo)}" alt="logo">\`;
      }
      return '<div class="channel-icon">\u{1F4FA}</div>';
    }

    // \u64AD\u653E\u5386\u53F2
    function addToHistory(channel) {
      const hash = channel.channel_hash || channel.hash;
      const index = history.findIndex(h => h.hash === hash);
      if (index > -1) {
        history.splice(index, 1);
      }

      // \u7EDF\u4E00\u5B57\u6BB5\u540D\u4E3A hash, name, group
      history.unshift({
        hash: hash,
        name: channel.channel_name,
        group: channel.group_title,
        watchedAt: Date.now()
      });

      // \u53EA\u4FDD\u7559\u6700\u8FD130\u6761
      if (history.length > 30) {
        history = history.slice(0, 30);
      }

      localStorage.setItem('iptv_history', JSON.stringify(history));
      updateBadges();
    }

    function getTimeAgo(timestamp) {
      const seconds = Math.floor((Date.now() - timestamp) / 1000);

      if (seconds < 60) return '\u521A\u521A';
      if (seconds < 3600) return Math.floor(seconds / 60) + '\u5206\u949F\u524D';
      if (seconds < 86400) return Math.floor(seconds / 3600) + '\u5C0F\u65F6\u524D';
      if (seconds < 604800) return Math.floor(seconds / 86400) + '\u5929\u524D';
      return '\u4E00\u5468\u524D';
    }

    // ========== \u5FEB\u6377\u9762\u677F\u529F\u80FD ==========

    // \u663E\u793A\u64AD\u653E\u5386\u53F2\u9762\u677F

    function showHistoryInMain() {
      // \u6E05\u9664\u5206\u7EC4\u9009\u62E9
      currentGroup = 'history';
      renderGroups();

      // \u66F4\u65B0\u6807\u9898
      document.getElementById('sectionTitle').textContent = \`\u{1F550} \${t('history')}\`;

      // \u9690\u85CF\u52A0\u8F7D\u548C\u5206\u9875
      document.getElementById('loading').style.display = 'none';
      document.getElementById('channelList').style.display = 'block';
      document.getElementById('pagination').innerHTML = '';

      // \u83B7\u53D6\u524D30\u6761\u5386\u53F2\u8BB0\u5F55
      const historyItems = history.slice(0, 30);

      if (historyItems.length === 0) {
        const container = document.getElementById('channelsGrid');
        const emptyState = document.getElementById('emptyState');
        container.innerHTML = '';
        emptyState.style.display = 'block';
        document.querySelector('.empty-title').textContent = t('noHistory');
        document.querySelector('.empty-desc').textContent = t('noHistoryDesc');
        return;
      }

      // \u6E32\u67D3\u5386\u53F2\u8BB0\u5F55
      const container = document.getElementById('channelsGrid');
      const emptyState = document.getElementById('emptyState');
      emptyState.style.display = 'none';

      container.innerHTML = historyItems.map(h => {
        const logo = getLogoByHash(h.hash);
        const timeAgo = getTimeAgo(h.watchedAt);
        const logoHtml = logo ? \`<img src="\${escapeHtml(logo)}" alt="\${escapeHtml(h.name)}">\` : '<div class="channel-icon">\u{1F4FA}</div>';

        return \`
          <div class="channel-card" onclick="playChannel('\${escapeHtml(h.hash)}', '\${escapeHtml(h.name)}', '\${escapeHtml(h.group)}')">
            <div class="channel-poster">
              \${logoHtml}
              <div class="play-overlay">
                <div class="play-icon"></div>
              </div>
            </div>
            <div class="channel-info">
              <div class="channel-name">\${escapeHtml(h.name)}</div>
              <div class="channel-group">\${escapeHtml(h.group)}</div>
              <div class="channel-group" style="margin-top:4px;font-size:11px;color:#e50914">\${timeAgo}</div>
            </div>
          </div>
        \`;
      }).join('');
    }

    // \u5728\u4E3B\u6570\u636E\u533A\u57DF\u663E\u793A\u6536\u85CF
    function showFavoritesInMain() {
      // \u6E05\u9664\u5206\u7EC4\u9009\u62E9
      currentGroup = 'favorites';
      renderGroups();

      // \u66F4\u65B0\u6807\u9898
      document.getElementById('sectionTitle').textContent = \`\u2B50 \${t('favorites')}\`;

      // \u9690\u85CF\u52A0\u8F7D\u548C\u5206\u9875
      document.getElementById('loading').style.display = 'none';
      document.getElementById('channelList').style.display = 'block';
      document.getElementById('pagination').innerHTML = '';

      // \u83B7\u53D6\u524D30\u6761\u6536\u85CF
      const favoritesItems = favorites.slice(0, 30);

      if (favoritesItems.length === 0) {
        const container = document.getElementById('channelsGrid');
        const emptyState = document.getElementById('emptyState');
        container.innerHTML = '';
        emptyState.style.display = 'block';
        document.querySelector('.empty-title').textContent = '\u8FD8\u6CA1\u6709\u6536\u85CF';
        document.querySelector('.empty-desc').textContent = '\u70B9\u51FB\u9891\u9053\u5361\u7247\u4E0A\u7684\u661F\u661F\u6DFB\u52A0\u6536\u85CF';
        return;
      }

      // \u6E32\u67D3\u6536\u85CF\u5217\u8868
      const container = document.getElementById('channelsGrid');
      const emptyState = document.getElementById('emptyState');
      emptyState.style.display = 'none';

      container.innerHTML = favoritesItems.map(fav => {
        const logo = getLogoByHash(fav.hash);
        const logoHtml = logo ? \`<img src="\${escapeHtml(logo)}" alt="\${escapeHtml(fav.name)}">\` : '<div class="channel-icon">\u{1F4FA}</div>';

        return \`
          <div class="channel-card" onclick="playChannel('\${escapeHtml(fav.hash)}', '\${escapeHtml(fav.name)}', '\${escapeHtml(fav.group)}')">
            <div class="channel-poster">
              \${logoHtml}
              <button class="favorite-btn favorited" onclick="event.stopPropagation();toggleFavorite('\${escapeHtml(fav.hash)}', '\${escapeHtml(fav.name)}', '\${escapeHtml(fav.group)}')" data-hash="\${escapeHtml(fav.hash)}">\u2B50</button>
              <div class="play-overlay">
                <div class="play-icon"></div>
              </div>
            </div>
            <div class="channel-info">
              <div class="channel-name">\${escapeHtml(fav.name)}</div>
              <div class="channel-group">\${escapeHtml(fav.group)}</div>
            </div>
          </div>
        \`;
      }).join('');
    }

    // \u663E\u793A\u64AD\u653E\u5386\u53F2\u9762\u677F
    function showHistoryPanel() {
      showHistoryInMain();
    }

    // \u663E\u793A\u6536\u85CF\u9762\u677F
    function showFavoritesPanel() {
      showFavoritesInMain();
    }

    // \u5173\u95ED\u5FEB\u6377\u9762\u677F
    function closeQuickPanel() {
      const panel = document.getElementById('quickPanel');
      panel.classList.remove('active');
      document.removeEventListener('click', handlePanelOutsideClick);
    }

    // \u5904\u7406\u9762\u677F\u5916\u90E8\u70B9\u51FB
    function handlePanelOutsideClick(e) {
      const panel = document.getElementById('quickPanel');
      const quickEntries = document.querySelector('.quick-entries');
      if (!panel.contains(e.target) && !quickEntries.contains(e.target)) {
        closeQuickPanel();
      }
    }

    // \u66F4\u65B0\u5FBD\u7AE0\u6570\u91CF\uFF08\u5DF2\u7981\u7528\uFF0C\u4E0D\u518D\u663E\u793A\u5FBD\u7AE0\uFF09
    function updateBadges() {
      // \u5FBD\u7AE0\u529F\u80FD\u5DF2\u7981\u7528\uFF0C\u4E0D\u518D\u663E\u793A\u6570\u91CF
      return;
    }

    // ========== Google AdSense \u5E7F\u544A\u63A7\u5236 ==========


    // \u52A8\u6001\u52A0\u8F7D\u5E7F\u544A\uFF08\u53EF\u9009\uFF09
    function loadAdsenseAds() {
      // \u5982\u679C\u9700\u8981\u52A8\u6001\u52A0\u8F7D\u5E7F\u544A\uFF0C\u53EF\u4EE5\u5728\u8FD9\u91CC\u5B9E\u73B0
      console.log('AdSense ads ready to load');
    }

    // \u9875\u9762\u52A0\u8F7D\u5B8C\u6210\u540E\u5C1D\u8BD5\u52A0\u8F7D\u5E7F\u544A
    window.addEventListener('load', () => {
      // \u5982\u679C\u542F\u7528\u4E86AdSense\uFF0C\u5E7F\u544A\u4F1A\u81EA\u52A8\u52A0\u8F7D
      console.log('Page loaded, AdSense ready');
    });
  <\/script>
</body>
</html>`;

// pages.js
init_checked_fetch();
init_modules_watch_stub();
function generateSitemap(origin) {
  const currentDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${origin}/activate</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${origin}/privacy-policy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${origin}/terms</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;
}
__name(generateSitemap, "generateSitemap");
function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# \u7981\u6B62\u722C\u53D6\u7BA1\u7406\u540E\u53F0
Disallow: /admin/
Disallow: /admin

# \u7981\u6B62\u722C\u53D6API\u63A5\u53E3
Disallow: /api/

# \u7981\u6B62\u722C\u53D6\u6FC0\u6D3B\u9875\u9762
Disallow: /activate/

# \u7F51\u7AD9\u5730\u56FE
Sitemap: https://iptv-search.com/sitemap.xml`;
}
__name(generateRobotsTxt, "generateRobotsTxt");
function generatePrivacyPolicy() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\u9690\u79C1\u653F\u7B56 - IPTV Live</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0a0a0a;color:#fff;line-height:1.6;padding:20px}
    .container{max-width:900px;margin:0 auto}
    h1{font-size:28px;margin-bottom:20px;color:#e50914}
    h2{font-size:22px;margin:30px 0 15px;color:#fff}
    h3{font-size:18px;margin:20px 0 10px;color:rgba(255,255,255,.9)}
    p{margin-bottom:15px;color:rgba(255,255,255,.8)}
    ul{margin-bottom:15px;padding-left:30px;color:rgba(255,255,255,.8)}
    li{margin-bottom:8px}
    .section{background:#141414;padding:25px;border-radius:8px;margin-bottom:20px}
    .last-updated{color:rgba(255,255,255,.5);font-size:14px;margin-bottom:20px}
    a{color:#e50914;text-decoration:none}
    a:hover{text-decoration:underline}
    @media (max-width:768px){
      body{padding:15px}
      h1{font-size:24px}
      h2{font-size:20px}
      .section{padding:20px}
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>\u9690\u79C1\u653F\u7B56</h1>
    <p class="last-updated">\u6700\u540E\u66F4\u65B0\u65E5\u671F\uFF1A2024\u5E741\u67081\u65E5</p>

    <div class="section">
      <h2>\u5F15\u8A00</h2>
      <p>IPTV Live\uFF08\u4EE5\u4E0B\u7B80\u79F0"\u6211\u4EEC"\uFF09\u5C0A\u91CD\u5E76\u4FDD\u62A4\u60A8\u7684\u9690\u79C1\u6743\u3002\u672C\u9690\u79C1\u653F\u7B56\u65E8\u5728\u8BF4\u660E\u6211\u4EEC\u5982\u4F55\u6536\u96C6\u3001\u4F7F\u7528\u3001\u5B58\u50A8\u548C\u4FDD\u62A4\u60A8\u7684\u4E2A\u4EBA\u4FE1\u606F\u3002\u4F7F\u7528\u6211\u4EEC\u7684\u670D\u52A1\u5373\u8868\u793A\u60A8\u540C\u610F\u672C\u653F\u7B56\u7684\u6761\u6B3E\u3002</p>
    </div>

    <div class="section">
      <h2>1. \u4FE1\u606F\u6536\u96C6</h2>
      <h3>1.1 \u6211\u4EEC\u6536\u96C6\u7684\u4FE1\u606F\u7C7B\u578B\uFF1A</h3>
      <ul>
        <li><strong>\u6D4F\u89C8\u4FE1\u606F\uFF1A</strong>\u60A8\u7684IP\u5730\u5740\u3001\u6D4F\u89C8\u5668\u7C7B\u578B\u3001\u8BBE\u5907\u4FE1\u606F\u3001\u8BBF\u95EE\u65F6\u95F4\u548C\u9875\u9762\u6D4F\u89C8\u8BB0\u5F55</li>
        <li><strong>\u4F7F\u7528\u4FE1\u606F\uFF1A</strong>\u60A8\u89C2\u770B\u7684\u9891\u9053\u3001\u641C\u7D22\u8BB0\u5F55\u3001\u6536\u85CF\u548C\u64AD\u653E\u5386\u53F2\uFF08\u5B58\u50A8\u5728\u672C\u5730\uFF09</li>
        <li><strong>\u6280\u672F\u4FE1\u606F\uFF1A</strong>Cookies\u3001Web\u4FE1\u6807\u548C\u5176\u4ED6\u8DDF\u8E2A\u6280\u672F</li>
      </ul>

      <h3>1.2 \u4FE1\u606F\u6536\u96C6\u65B9\u5F0F\uFF1A</h3>
      <ul>
        <li>\u81EA\u52A8\u6536\u96C6\uFF1A\u901A\u8FC7\u6D4F\u89C8\u5668\u548C\u670D\u52A1\u5668\u65E5\u5FD7</li>
        <li>\u672C\u5730\u5B58\u50A8\uFF1A\u901A\u8FC7\u6D4F\u89C8\u5668 localStorage \u5B58\u50A8\u7528\u6237\u504F\u597D\u548C\u5386\u53F2\u8BB0\u5F55</li>
      </ul>
    </div>

    <div class="section">
      <h2>2. \u4FE1\u606F\u4F7F\u7528</h2>
      <p>\u6211\u4EEC\u4F7F\u7528\u6536\u96C6\u7684\u4FE1\u606F\u7528\u4E8E\uFF1A</p>
      <ul>
        <li>\u63D0\u4F9B\u3001\u7EF4\u62A4\u548C\u6539\u8FDB\u6211\u4EEC\u7684\u670D\u52A1</li>
        <li>\u5206\u6790\u7528\u6237\u4F7F\u7528\u60C5\u51B5\uFF0C\u4F18\u5316\u7528\u6237\u4F53\u9A8C</li>
        <li>\u9632\u6B62\u6B3A\u8BC8\u3001\u6EE5\u7528\u548C\u5B89\u5168\u5A01\u80C1</li>
        <li>\u7B26\u5408\u6CD5\u5F8B\u8981\u6C42\u548C\u76D1\u7BA1\u4E49\u52A1</li>
      </ul>
    </div>

    <div class="section">
      <h2>3. \u4FE1\u606F\u5B58\u50A8</h2>
      <ul>
        <li>\u60A8\u7684\u89C2\u770B\u5386\u53F2\u548C\u6536\u85CF\u5B58\u50A8\u5728\u672C\u5730\u6D4F\u89C8\u5668\u7684 localStorage \u4E2D\uFF0C\u4E0D\u4F1A\u4E0A\u4F20\u5230\u6211\u4EEC\u7684\u670D\u52A1\u5668</li>
        <li>\u670D\u52A1\u5668\u65E5\u5FD7\u53EF\u80FD\u5305\u542BIP\u5730\u5740\u7B49\u4FE1\u606F\uFF0C\u4F46\u4E0D\u4F1A\u4E0E\u4E2A\u4EBA\u8EAB\u4EFD\u5173\u8054</li>
        <li>\u6570\u636E\u91C7\u7528\u884C\u4E1A\u6807\u51C6\u7684\u5B89\u5168\u63AA\u65BD\u8FDB\u884C\u4FDD\u62A4</li>
      </ul>
    </div>

    <div class="section">
      <h2>4. \u4FE1\u606F\u5171\u4EAB</h2>
      <p>\u6211\u4EEC\u4E0D\u4F1A\u51FA\u552E\u3001\u51FA\u79DF\u6216\u4EA4\u6613\u60A8\u7684\u4E2A\u4EBA\u4FE1\u606F\u3002\u4F46\u5728\u4EE5\u4E0B\u60C5\u51B5\u4E0B\uFF0C\u6211\u4EEC\u53EF\u80FD\u4F1A\u5171\u4EAB\u4FE1\u606F\uFF1A</p>
      <ul>
        <li><strong>\u670D\u52A1\u63D0\u4F9B\u5546\uFF1A</strong>\u4E0E\u5E2E\u52A9\u6211\u4EEC\u63D0\u4F9B\u670D\u52A1\u7684\u7B2C\u4E09\u65B9\u5171\u4EAB\u5FC5\u8981\u4FE1\u606F\uFF08\u5982Cloudflare\u7B49\uFF09</li>
        <li><strong>\u6CD5\u5F8B\u8981\u6C42\uFF1A</strong>\u54CD\u5E94\u6CD5\u5F8B\u8981\u6C42\u3001\u6CD5\u9662\u547D\u4EE4\u6216\u653F\u5E9C\u8C03\u67E5</li>
        <li><strong>\u4E1A\u52A1\u8F6C\u8BA9\uFF1A</strong>\u5728\u5408\u5E76\u3001\u6536\u8D2D\u6216\u8D44\u4EA7\u8F6C\u8BA9\u7684\u60C5\u51B5\u4E0B</li>
        <li><strong>\u7B2C\u4E09\u65B9\u5E7F\u544A\uFF1A</strong>\u6211\u4EEC\u53EF\u80FD\u4F7F\u7528\u7B2C\u4E09\u65B9\u5E7F\u544A\u670D\u52A1\uFF08\u5982Google AdSense\uFF09\uFF0C\u8FD9\u4E9B\u670D\u52A1\u53EF\u80FD\u4F1A\u6536\u96C6\u60A8\u7684\u6D4F\u89C8\u4FE1\u606F</li>
      </ul>
    </div>

    <div class="section">
      <h2>5. Cookies</h2>
      <p>\u6211\u4EEC\u4F7F\u7528 Cookies \u548C\u7C7B\u4F3C\u6280\u672F\u6765\uFF1A</p>
      <ul>
        <li>\u8BB0\u4F4F\u60A8\u7684\u8BED\u8A00\u504F\u597D\u548C\u8BBE\u7F6E</li>
        <li>\u5206\u6790\u7F51\u7AD9\u6D41\u91CF\u548C\u4F7F\u7528\u6A21\u5F0F</li>
        <li>\u63D0\u4F9B\u4E2A\u6027\u5316\u5185\u5BB9</li>
      </ul>
      <p>\u60A8\u53EF\u4EE5\u901A\u8FC7\u6D4F\u89C8\u5668\u8BBE\u7F6E\u7981\u7528 Cookies\uFF0C\u4F46\u8FD9\u53EF\u80FD\u4F1A\u5F71\u54CD\u7F51\u7AD9\u7684\u67D0\u4E9B\u529F\u80FD\u3002</p>
    </div>

    <div class="section">
      <h2>6. \u7B2C\u4E09\u65B9\u94FE\u63A5</h2>
      <p>\u6211\u4EEC\u7684\u7F51\u7AD9\u53EF\u80FD\u5305\u542B\u6307\u5411\u7B2C\u4E09\u65B9\u7F51\u7AD9\u7684\u94FE\u63A5\u3002\u6211\u4EEC\u5BF9\u8FD9\u4E9B\u7B2C\u4E09\u65B9\u7F51\u7AD9\u7684\u9690\u79C1\u653F\u7B56\u548C\u505A\u6CD5\u4E0D\u627F\u62C5\u4EFB\u4F55\u8D23\u4EFB\u3002\u6211\u4EEC\u5EFA\u8BAE\u60A8\u67E5\u770B\u8FD9\u4E9B\u7F51\u7AD9\u7684\u9690\u79C1\u653F\u7B56\u3002</p>
    </div>

    <div class="section">
      <h2>7. \u6570\u636E\u5B89\u5168</h2>
      <p>\u6211\u4EEC\u91C7\u53D6\u9002\u5F53\u7684\u6280\u672F\u548C\u7EC4\u7EC7\u63AA\u65BD\u6765\u4FDD\u62A4\u60A8\u7684\u4E2A\u4EBA\u4FE1\u606F\u514D\u53D7\u672A\u7ECF\u6388\u6743\u7684\u8BBF\u95EE\u3001\u4F7F\u7528\u6216\u62AB\u9732\u3002\u7136\u800C\uFF0C\u6CA1\u6709\u4EFB\u4F55\u4E92\u8054\u7F51\u4F20\u8F93\u6216\u5B58\u50A8\u65B9\u6CD5\u662F100%\u5B89\u5168\u7684\u3002</p>
    </div>

    <div class="section">
      <h2>8. \u60A8\u7684\u6743\u5229</h2>
      <p>\u6839\u636E\u9002\u7528\u7684\u6570\u636E\u4FDD\u62A4\u6CD5\u5F8B\uFF0C\u60A8\u53EF\u80FD\u62E5\u6709\u4EE5\u4E0B\u6743\u5229\uFF1A</p>
      <ul>
        <li>\u8BBF\u95EE\u548C\u83B7\u53D6\u60A8\u7684\u4E2A\u4EBA\u4FE1\u606F\u526F\u672C</li>
        <li>\u66F4\u6B63\u4E0D\u51C6\u786E\u7684\u4FE1\u606F</li>
        <li>\u5220\u9664\u60A8\u7684\u4E2A\u4EBA\u4FE1\u606F</li>
        <li>\u53CD\u5BF9\u6216\u9650\u5236\u67D0\u4E9B\u5904\u7406\u6D3B\u52A8</li>
        <li>\u6570\u636E\u53EF\u643A\u5E26\u6027</li>
      </ul>
    </div>

    <div class="section">
      <h2>9. \u513F\u7AE5\u9690\u79C1</h2>
      <p>\u6211\u4EEC\u7684\u670D\u52A1\u4E0D\u9488\u5BF913\u5C81\u4EE5\u4E0B\u7684\u513F\u7AE5\u3002\u6211\u4EEC\u4E0D\u4F1A\u6545\u610F\u6536\u96C613\u5C81\u4EE5\u4E0B\u513F\u7AE5\u7684\u4E2A\u4EBA\u4FE1\u606F\u3002\u5982\u679C\u6211\u4EEC\u53D1\u73B0\u6536\u96C6\u4E86\u6B64\u7C7B\u4FE1\u606F\uFF0C\u5C06\u7ACB\u5373\u5220\u9664\u3002</p>
    </div>

    <div class="section">
      <h2>10. \u56FD\u9645\u6570\u636E\u4F20\u8F93</h2>
      <p>\u60A8\u7684\u4FE1\u606F\u53EF\u80FD\u4F1A\u4F20\u8F93\u5230\u60A8\u6240\u5728\u56FD\u5BB6\u6216\u5730\u533A\u4EE5\u5916\u7684\u56FD\u5BB6\u6216\u5730\u533A\uFF0C\u5E76\u5728\u90A3\u91CC\u8FDB\u884C\u5904\u7406\u3002\u8FD9\u4E9B\u56FD\u5BB6/\u5730\u533A\u7684\u6570\u636E\u4FDD\u62A4\u6CD5\u5F8B\u53EF\u80FD\u4E0E\u60A8\u6240\u5728\u53F8\u6CD5\u7BA1\u8F96\u533A\u4E0D\u540C\u3002</p>
    </div>

    <div class="section">
      <h2>11. \u653F\u7B56\u53D8\u66F4</h2>
      <p>\u6211\u4EEC\u53EF\u80FD\u4F1A\u4E0D\u65F6\u66F4\u65B0\u672C\u9690\u79C1\u653F\u7B56\u3002\u66F4\u65B0\u540E\u7684\u653F\u7B56\u5C06\u5728\u672C\u9875\u9762\u4E0A\u53D1\u5E03\uFF0C\u5E76\u66F4\u65B0"\u6700\u540E\u66F4\u65B0\u65E5\u671F"\u3002\u91CD\u5927\u53D8\u66F4\u65F6\uFF0C\u6211\u4EEC\u5C06\u901A\u8FC7\u7F51\u7AD9\u901A\u77E5\u60A8\u3002</p>
    </div>

    <div class="section">
      <h2>12. \u8054\u7CFB\u6211\u4EEC</h2>
      <p>\u5982\u679C\u60A8\u5BF9\u672C\u9690\u79C1\u653F\u7B56\u6709\u4EFB\u4F55\u95EE\u9898\u6216\u7591\u8651\uFF0C\u8BF7\u901A\u8FC7\u4EE5\u4E0B\u65B9\u5F0F\u8054\u7CFB\u6211\u4EEC\uFF1A</p>
      <ul>
        <li>\u7535\u5B50\u90AE\u4EF6\uFF1Asupport@iptv-search.com</li>
        <li>\u7F51\u7AD9\uFF1A<a href="https://iptv-search.com">https://iptv-search.com</a></li>
      </ul>
    </div>

    <p style="text-align:center;color:rgba(255,255,255,.5);margin-top:40px;">&copy; 2024 IPTV Live. \u4FDD\u7559\u6240\u6709\u6743\u5229\u3002</p>
  </div>
</body>
</html>`;
}
__name(generatePrivacyPolicy, "generatePrivacyPolicy");
function generateTermsOfService() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\u670D\u52A1\u6761\u6B3E - IPTV Live</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0a0a0a;color:#fff;line-height:1.6;padding:20px}
    .container{max-width:900px;margin:0 auto}
    h1{font-size:28px;margin-bottom:20px;color:#e50914}
    h2{font-size:22px;margin:30px 0 15px;color:#fff}
    h3{font-size:18px;margin:20px 0 10px;color:rgba(255,255,255,.9)}
    p{margin-bottom:15px;color:rgba(255,255,255,.8)}
    ul{margin-bottom:15px;padding-left:30px;color:rgba(255,255,255,.8)}
    li{margin-bottom:8px}
    .section{background:#141414;padding:25px;border-radius:8px;margin-bottom:20px}
    .last-updated{color:rgba(255,255,255,.5);font-size:14px;margin-bottom:20px}
    a{color:#e50914;text-decoration:none}
    a:hover{text-decoration:underline}
    .warning{background:rgba(231,9,20,.1);border-left:4px solid #e50914;padding:15px;margin:15px 0}
    @media (max-width:768px){
      body{padding:15px}
      h1{font-size:24px}
      h2{font-size:20px}
      .section{padding:20px}
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>\u670D\u52A1\u6761\u6B3E</h1>
    <p class="last-updated">\u6700\u540E\u66F4\u65B0\u65E5\u671F\uFF1A2024\u5E741\u67081\u65E5</p>

    <div class="section">
      <h2>\u6B22\u8FCE\u4F7F\u7528 IPTV Live</h2>
      <p>\u611F\u8C22\u60A8\u4F7F\u7528 IPTV Live \u670D\u52A1\uFF08\u4EE5\u4E0B\u7B80\u79F0"\u672C\u670D\u52A1"\uFF09\u3002\u901A\u8FC7\u4F7F\u7528\u672C\u670D\u52A1\uFF0C\u60A8\u540C\u610F\u9075\u5B88\u4EE5\u4E0B\u670D\u52A1\u6761\u6B3E\u3002\u5982\u679C\u60A8\u4E0D\u540C\u610F\u8FD9\u4E9B\u6761\u6B3E\uFF0C\u8BF7\u4E0D\u8981\u4F7F\u7528\u672C\u670D\u52A1\u3002</p>
    </div>

    <div class="section">
      <h2>1. \u670D\u52A1\u8BF4\u660E</h2>
      <h3>1.1 \u670D\u52A1\u5185\u5BB9\uFF1A</h3>
      <ul>
        <li>IPTV Live \u63D0\u4F9B\u514D\u8D39\u7684\u5728\u7EBF\u7535\u89C6\u89C2\u770B\u670D\u52A1</li>
        <li>\u670D\u52A1\u5305\u62EC\u9891\u9053\u5217\u8868\u3001\u641C\u7D22\u3001\u6536\u85CF\u3001\u64AD\u653E\u5386\u53F2\u7B49\u529F\u80FD</li>
        <li>\u7528\u6237\u53EF\u4EE5\u901A\u8FC7\u7F51\u9875\u6D4F\u89C8\u5668\u8BBF\u95EE\u672C\u670D\u52A1</li>
      </ul>

      <h3>1.2 \u670D\u52A1\u6027\u8D28\uFF1A</h3>
      <ul>
        <li>\u672C\u670D\u52A1\u4E3A\u514D\u8D39\u670D\u52A1\uFF0C\u4E0D\u6536\u53D6\u4EFB\u4F55\u8D39\u7528</li>
        <li>\u6211\u4EEC\u4FDD\u7559\u968F\u65F6\u4FEE\u6539\u3001\u6682\u505C\u6216\u7EC8\u6B62\u670D\u52A1\u7684\u6743\u5229</li>
        <li>\u670D\u52A1\u7684\u53EF\u7528\u6027\u53EF\u80FD\u53D7\u5230\u7F51\u7EDC\u72B6\u51B5\u548C\u6280\u672F\u9650\u5236\u7684\u5F71\u54CD</li>
      </ul>
    </div>

    <div class="section">
      <h2>2. \u7528\u6237\u8D23\u4EFB</h2>
      <h3>2.1 \u4F7F\u7528\u8981\u6C42\uFF1A</h3>
      <ul>
        <li>\u60A8\u5FC5\u987B\u5E74\u6EE113\u5C81\u624D\u80FD\u4F7F\u7528\u672C\u670D\u52A1</li>
        <li>\u60A8\u6709\u8D23\u4EFB\u786E\u4FDD\u60A8\u7684\u8D26\u6237\u5B89\u5168</li>
        <li>\u60A8\u4E0D\u5F97\u5171\u4EAB\u60A8\u7684\u8D26\u6237\u4FE1\u606F\u6216\u51ED\u636E</li>
      </ul>

      <h3>2.2 \u7981\u6B62\u884C\u4E3A\uFF1A</h3>
      <ul>
        <li>\u4E0D\u5F97\u5C06\u672C\u670D\u52A1\u7528\u4E8E\u4EFB\u4F55\u975E\u6CD5\u76EE\u7684</li>
        <li>\u4E0D\u5F97\u5E72\u6270\u6216\u7834\u574F\u672C\u670D\u52A1\u7684\u6B63\u5E38\u8FD0\u884C</li>
        <li>\u4E0D\u5F97\u4E0A\u4F20\u75C5\u6BD2\u3001\u6076\u610F\u4EE3\u7801\u6216\u5176\u4ED6\u6709\u5BB3\u8F6F\u4EF6</li>
        <li>\u4E0D\u5F97\u5C1D\u8BD5\u672A\u7ECF\u6388\u6743\u8BBF\u95EE\u6211\u4EEC\u7684\u7CFB\u7EDF\u6216\u6570\u636E</li>
        <li>\u4E0D\u5F97\u4FB5\u72AF\u4ED6\u4EBA\u7684\u77E5\u8BC6\u4EA7\u6743\u6216\u9690\u79C1\u6743</li>
        <li>\u4E0D\u5F97\u4F7F\u7528\u81EA\u52A8\u5316\u5DE5\u5177\uFF08\u5982\u673A\u5668\u4EBA\u3001\u722C\u866B\uFF09\u8BBF\u95EE\u672C\u670D\u52A1</li>
      </ul>
    </div>

    <div class="section">
      <h2>3. \u5185\u5BB9\u7248\u6743</h2>
      <div class="warning">
        <strong>\u91CD\u8981\u58F0\u660E\uFF1A</strong>
        <p>IPTV Live \u4EC5\u4F5C\u4E3A\u5185\u5BB9\u805A\u5408\u5E73\u53F0\uFF0C\u63D0\u4F9B\u9891\u9053\u94FE\u63A5\u670D\u52A1\u3002\u672C\u5E73\u53F0\u4E0D\u62E5\u6709\u3001\u4E0D\u5236\u4F5C\u3001\u4E0D\u5B58\u50A8\u4EFB\u4F55\u89C6\u9891\u5185\u5BB9\u3002\u6240\u6709\u9891\u9053\u7684\u7248\u6743\u5C5E\u4E8E\u5176\u5404\u81EA\u7684\u6240\u6709\u8005\u3002</p>
      </div>

      <h3>3.1 \u77E5\u8BC6\u4EA7\u6743\uFF1A</h3>
      <ul>
        <li>\u672C\u7F51\u7AD9\u7684\u754C\u9762\u3001\u8BBE\u8BA1\u3001\u6587\u672C\u3001\u56FE\u5F62\u7B49\u53D7\u7248\u6743\u4FDD\u62A4</li>
        <li>\u672A\u7ECF\u8BB8\u53EF\uFF0C\u4E0D\u5F97\u590D\u5236\u3001\u4FEE\u6539\u3001\u5206\u53D1\u672C\u7F51\u7AD9\u7684\u5185\u5BB9</li>
        <li>\u9891\u9053\u5185\u5BB9\u7684\u77E5\u8BC6\u4EA7\u6743\u5C5E\u4E8E\u5176\u539F\u59CB\u6240\u6709\u8005</li>
      </ul>

      <h3>3.2 \u7528\u6237\u5185\u5BB9\uFF1A</h3>
      <ul>
        <li>\u60A8\u5BF9\u63D0\u4EA4\u7684\u5185\u5BB9\u4FDD\u7559\u6240\u6709\u6743</li>
        <li>\u901A\u8FC7\u4F7F\u7528\u672C\u670D\u52A1\uFF0C\u60A8\u6388\u4E88\u6211\u4EEC\u5C55\u793A\u548C\u4F7F\u7528\u76F8\u5173\u5185\u5BB9\u7684\u6743\u5229</li>
        <li>\u60A8\u4FDD\u8BC1\u62E5\u6709\u6240\u6709\u5FC5\u8981\u6743\u5229\u6765\u63D0\u4EA4\u8FD9\u4E9B\u5185\u5BB9</li>
      </ul>
    </div>

    <div class="section">
      <h2>4. \u514D\u8D23\u58F0\u660E</h2>
      <h3>4.1 \u670D\u52A1\u6309"\u73B0\u72B6"\u63D0\u4F9B\uFF1A</h3>
      <ul>
        <li>\u672C\u670D\u52A1\u6309"\u73B0\u72B6"\u548C"\u53EF\u7528"\u57FA\u7840\u63D0\u4F9B</li>
        <li>\u6211\u4EEC\u4E0D\u5BF9\u670D\u52A1\u7684\u51C6\u786E\u6027\u3001\u53EF\u9760\u6027\u6216\u5B8C\u6574\u6027\u505A\u51FA\u4EFB\u4F55\u4FDD\u8BC1</li>
        <li>\u6211\u4EEC\u4E0D\u4FDD\u8BC1\u670D\u52A1\u4E0D\u4F1A\u4E2D\u65AD\u6216\u65E0\u9519\u8BEF</li>
      </ul>

      <h3>4.2 \u95F4\u63A5\u635F\u5931\uFF1A</h3>
      <p>\u5728\u4EFB\u4F55\u60C5\u51B5\u4E0B\uFF0C\u6211\u4EEC\u90FD\u4E0D\u5BF9\u4EFB\u4F55\u95F4\u63A5\u3001\u5076\u7136\u3001\u7279\u6B8A\u6216\u540E\u679C\u6027\u635F\u5BB3\u627F\u62C5\u8D23\u4EFB\uFF0C\u5305\u62EC\u4F46\u4E0D\u9650\u4E8E\u5229\u6DA6\u635F\u5931\u3001\u6570\u636E\u4E22\u5931\u6216\u4E1A\u52A1\u4E2D\u65AD\u3002</p>

      <h3>4.3 \u7B2C\u4E09\u65B9\u5185\u5BB9\uFF1A</h3>
      <ul>
        <li>\u6211\u4EEC\u4E0D\u5BF9\u7B2C\u4E09\u65B9\u63D0\u4F9B\u7684\u5185\u5BB9\u6216\u670D\u52A1\u627F\u62C5\u8D23\u4EFB</li>
        <li>\u9891\u9053\u5185\u5BB9\u7684\u8D28\u91CF\u3001\u53EF\u7528\u6027\u548C\u51C6\u786E\u6027\u7531\u5185\u5BB9\u63D0\u4F9B\u8005\u8D1F\u8D23</li>
        <li>\u6211\u4EEC\u4E0D\u5BF9\u9891\u9053\u7684\u7248\u6743\u95EE\u9898\u8D1F\u8D23</li>
      </ul>
    </div>

    <div class="section">
      <h2>5. \u670D\u52A1\u4E2D\u65AD</h2>
      <ul>
        <li>\u6211\u4EEC\u4FDD\u7559\u968F\u65F6\u4FEE\u6539\u3001\u6682\u505C\u6216\u7EC8\u6B62\u5168\u90E8\u6216\u90E8\u5206\u670D\u52A1\u7684\u6743\u5229</li>
        <li>\u670D\u52A1\u4E2D\u65AD\u53EF\u80FD\u53D1\u751F\u5728\u7CFB\u7EDF\u7EF4\u62A4\u3001\u5347\u7EA7\u6216\u4E0D\u53EF\u6297\u529B\u60C5\u51B5\u4E0B</li>
        <li>\u6211\u4EEC\u4E0D\u5BF9\u670D\u52A1\u4E2D\u65AD\u9020\u6210\u7684\u635F\u5931\u627F\u62C5\u8D23\u4EFB</li>
      </ul>
    </div>

    <div class="section">
      <h2>6. \u8D26\u6237\u4E0E\u5B89\u5168</h2>
      <ul>
        <li>\u60A8\u5BF9\u4F7F\u7528\u60A8\u8D26\u6237\u7684\u6240\u6709\u6D3B\u52A8\u8D1F\u8D23</li>
        <li>\u5982\u53D1\u73B0\u4EFB\u4F55\u672A\u7ECF\u6388\u6743\u4F7F\u7528\u60A8\u8D26\u6237\u7684\u60C5\u51B5\uFF0C\u8BF7\u7ACB\u5373\u901A\u77E5\u6211\u4EEC</li>
        <li>\u6211\u4EEC\u4E0D\u5BF9\u56E0\u7528\u6237\u672A\u80FD\u4FDD\u62A4\u5176\u8D26\u6237\u800C\u9020\u6210\u7684\u635F\u5931\u8D1F\u8D23</li>
      </ul>
    </div>

    <div class="section">
      <h2>7. \u9690\u79C1\u4FDD\u62A4</h2>
      <p>\u60A8\u7684\u9690\u79C1\u5BF9\u6211\u4EEC\u5F88\u91CD\u8981\u3002\u8BF7\u67E5\u770B\u6211\u4EEC\u7684<a href="/privacy-policy">\u9690\u79C1\u653F\u7B56</a>\uFF0C\u4E86\u89E3\u6211\u4EEC\u5982\u4F55\u6536\u96C6\u3001\u4F7F\u7528\u548C\u4FDD\u62A4\u60A8\u7684\u4E2A\u4EBA\u4FE1\u606F\u3002</p>
    </div>

    <div class="section">
      <h2>8. \u9002\u7528\u6CD5\u5F8B</h2>
      <p>\u672C\u6761\u6B3E\u53D7\u60A8\u6240\u5728\u56FD\u5BB6/\u5730\u533A\u7684\u6CD5\u5F8B\u7BA1\u8F96\u3002\u5982\u679C\u56E0\u4F7F\u7528\u672C\u670D\u52A1\u4EA7\u751F\u4EFB\u4F55\u4E89\u8BAE\uFF0C\u5E94\u901A\u8FC7\u534F\u5546\u89E3\u51B3\u3002</p>
    </div>

    <div class="section">
      <h2>9. \u6761\u6B3E\u4FEE\u6539</h2>
      <ul>
        <li>\u6211\u4EEC\u4FDD\u7559\u968F\u65F6\u4FEE\u6539\u8FD9\u4E9B\u6761\u6B3E\u7684\u6743\u5229</li>
        <li>\u4FEE\u6539\u540E\u7684\u6761\u6B3E\u5C06\u5728\u672C\u9875\u9762\u53D1\u5E03</li>
        <li>\u7EE7\u7EED\u4F7F\u7528\u672C\u670D\u52A1\u5373\u8868\u793A\u60A8\u63A5\u53D7\u4FEE\u6539\u540E\u7684\u6761\u6B3E</li>
        <li>\u91CD\u5927\u53D8\u66F4\u5C06\u901A\u8FC7\u7F51\u7AD9\u901A\u77E5\u60A8</li>
      </ul>
    </div>

    <div class="section">
      <h2>10. \u7EC8\u6B62\u670D\u52A1</h2>
      <ul>
        <li>\u5982\u679C\u60A8\u8FDD\u53CD\u8FD9\u4E9B\u6761\u6B3E\uFF0C\u6211\u4EEC\u6709\u6743\u6682\u505C\u6216\u7EC8\u6B62\u60A8\u4F7F\u7528\u672C\u670D\u52A1\u7684\u6743\u5229</li>
        <li>\u60A8\u53EF\u4EE5\u968F\u65F6\u505C\u6B62\u4F7F\u7528\u672C\u670D\u52A1</li>
        <li>\u670D\u52A1\u7EC8\u6B62\u540E\uFF0C\u67D0\u4E9B\u6761\u6B3E\u4ECD\u5C06\u7EE7\u7EED\u6709\u6548</li>
      </ul>
    </div>

    <div class="section">
      <h2>11. \u4E0D\u53EF\u6297\u529B</h2>
      <p>\u6211\u4EEC\u4E0D\u5BF9\u56E0\u4E0D\u53EF\u6297\u529B\u4E8B\u4EF6\u5BFC\u81F4\u7684\u670D\u52A1\u4E2D\u65AD\u6216\u5EF6\u8FDF\u627F\u62C5\u8D23\u4EFB\uFF0C\u5305\u62EC\u4F46\u4E0D\u9650\u4E8E\u81EA\u7136\u707E\u5BB3\u3001\u6218\u4E89\u3001\u653F\u5E9C\u884C\u4E3A\u3001\u7F51\u7EDC\u653B\u51FB\u7B49\u3002</p>
    </div>

    <div class="section">
      <h2>12. \u5B8C\u6574\u534F\u8BAE</h2>
      <p>\u8FD9\u4E9B\u6761\u6B3E\u6784\u6210\u60A8\u4E0E\u6211\u4EEC\u4E4B\u95F4\u5173\u4E8E\u4F7F\u7528\u672C\u670D\u52A1\u7684\u5B8C\u6574\u534F\u8BAE\u3002\u8FD9\u4E9B\u6761\u6B3E\u53D6\u4EE3\u6240\u6709\u5148\u524D\u7684\u534F\u8BAE\u6216\u8C05\u89E3\u3002</p>
    </div>

    <div class="section">
      <h2>13. \u53EF\u5206\u5272\u6027</h2>
      <p>\u5982\u679C\u8FD9\u4E9B\u6761\u6B3E\u7684\u4EFB\u4F55\u6761\u6B3E\u88AB\u8BA4\u5B9A\u4E3A\u4E0D\u53EF\u6267\u884C\u6216\u65E0\u6548\uFF0C\u5176\u4F59\u6761\u6B3E\u4ECD\u5C06\u4FDD\u6301\u5B8C\u5168\u6709\u6548\u548C\u53EF\u6267\u884C\u3002</p>
    </div>

    <div class="section">
      <h2>14. \u8054\u7CFB\u6211\u4EEC</h2>
      <p>\u5982\u679C\u60A8\u5BF9\u672C\u670D\u52A1\u6761\u6B3E\u6709\u4EFB\u4F55\u95EE\u9898\u6216\u7591\u8651\uFF0C\u8BF7\u901A\u8FC7\u4EE5\u4E0B\u65B9\u5F0F\u8054\u7CFB\u6211\u4EEC\uFF1A</p>
      <ul>
        <li>\u7535\u5B50\u90AE\u4EF6\uFF1Asupport@iptv-search.com</li>
        <li>\u7F51\u7AD9\uFF1A<a href="https://iptv-search.com">https://iptv-search.com</a></li>
      </ul>
    </div>

    <p style="text-align:center;color:rgba(255,255,255,.5);margin-top:40px;">&copy; 2024 IPTV Live. \u4FDD\u7559\u6240\u6709\u6743\u5229\u3002</p>
  </div>
</body>
</html>`;
}
__name(generateTermsOfService, "generateTermsOfService");

// worker.js
init_database();

// assets.js
init_checked_fetch();
init_modules_watch_stub();
var LOGO_SVG = `<svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e50914;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#b81d24;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="tvGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#e50914;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff3b30;stop-opacity:1" />
    </linearGradient>
  </defs>

  <g transform="translate(10, 8)">
    <rect x="0" y="0" width="44" height="32" rx="4" fill="url(#tvGradient)" />
    <rect x="4" y="4" width="36" height="24" rx="2" fill="#0a0a0a" />
    <path d="M18 10 L30 16 L18 22 Z" fill="#fff" />
    <rect x="12" y="34" width="8" height="4" rx="1" fill="#333" />
    <rect x="24" y="34" width="8" height="4" rx="1" fill="#333" />
    <g stroke="#e50914" stroke-width="2" fill="none">
      <path d="M48 8 Q52 12 48 16" opacity="0.8" />
      <path d="M52 4 Q60 12 52 20" opacity="0.6" />
    </g>
  </g>

  <text x="65" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="20" font-weight="800" fill="url(#logoGradient)">IPTV</text>
  <text x="65" y="48" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="14" font-weight="500" fill="#fff" opacity="0.8">Live</text>
</svg>`;
var FAVICON_SVG = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="faviconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e50914;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#b81d24;stop-opacity:1" />
    </linearGradient>
  </defs>

  <rect width="32" height="32" rx="6" fill="url(#faviconGradient)" />

  <g transform="translate(5, 4)">
    <rect x="1" y="1" width="20" height="15" rx="2" fill="#0a0a0a" />
    <path d="M9 5 L16 9 L9 13 Z" fill="#e50914" />
    <rect x="5" y="18" width="4" height="2" rx="1" fill="#0a0a0a" />
    <rect x="12" y="18" width="4" height="2" rx="1" fill="#0a0a0a" />
  </g>
</svg>`;
var OG_IMAGE_SVG = `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#141414;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e50914;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff3b30;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#e50914;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff6b6b;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#bgGradient)" />

  <circle cx="100" cy="100" r="80" fill="#e50914" opacity="0.1" />
  <circle cx="200" cy="150" r="40" fill="#e50914" opacity="0.05" />

  <circle cx="1100" cy="530" r="100" fill="#e50914" opacity="0.1" />
  <circle cx="1000" cy="480" r="50" fill="#e50914" opacity="0.05" />

  <g transform="translate(480, 200)" filter="url(#glow)">
    <rect x="0" y="0" width="240" height="180" rx="12" fill="url(#logoGradient)" />
    <rect x="20" y="20" width="200" height="140" rx="8" fill="#0a0a0a" />
    <path d="M100 60 L160 90 L100 120 Z" fill="#fff" />
    <rect x="60" y="190" width="40" height="15" rx="4" fill="#333" />
    <rect x="140" y="190" width="40" height="15" rx="4" fill="#333" />
    <g stroke="#e50914" stroke-width="3" fill="none">
      <path d="M250 30 Q270 60 250 90" opacity="0.6" />
      <path d="M260 10 Q300 60 260 110" opacity="0.4" />
    </g>
  </g>

  <text x="600" y="450" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="72" font-weight="800" fill="url(#textGradient)" text-anchor="middle" filter="url(#glow)">IPTV Live</text>

  <text x="600" y="510" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="28" font-weight="400" fill="#fff" opacity="0.8" text-anchor="middle">\u514D\u8D39\u9AD8\u6E05\u7535\u89C6\u89C2\u770B\u5E73\u53F0</text>

  <line x1="300" y1="530" x2="900" y2="530" stroke="#e50914" stroke-width="2" opacity="0.3" />

  <g transform="translate(400, 560)">
    <rect x="0" y="0" width="100" height="30" rx="15" fill="rgba(229,9,20,0.2)" stroke="#e50914" stroke-width="1" />
    <text x="50" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="14" fill="#fff" text-anchor="middle">10000+\u9891\u9053</text>
  </g>
  <g transform="translate(520, 560)">
    <rect x="0" y="0" width="80" height="30" rx="15" fill="rgba(229,9,20,0.2)" stroke="#e50914" stroke-width="1" />
    <text x="40" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="14" fill="#fff" text-anchor="middle">\u514D\u8D39\u89C2\u770B</text>
  </g>
  <g transform="translate(620, 560)">
    <rect x="0" y="0" width="80" height="30" rx="15" fill="rgba(229,9,20,0.2)" stroke="#e50914" stroke-width="1" />
    <text x="40" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="14" fill="#fff" text-anchor="middle">\u9AD8\u6E05\u753B\u8D28</text>
  </g>
  <g transform="translate(720, 560)">
    <rect x="0" y="0" width="80" height="30" rx="15" fill="rgba(229,9,20,0.2)" stroke="#e50914" stroke-width="1" />
    <text x="40" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="14" fill="#fff" text-anchor="middle">\u65E0\u9700\u6CE8\u518C</text>
  </g>
</svg>`;

// worker.js
var worker_default = {
  async fetch(request, env, ctx) {
    try {
      await initDB(env);
      await initCache(env);
      const url = new URL(request.url);
      const path = url.pathname;
      if (request.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "86400"
          }
        });
      }
      if (path === "/favicon.svg" || path === "/favicon.ico") {
        return new Response(FAVICON_SVG, {
          headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=86400"
          }
        });
      } else if (path === "/logo.svg") {
        return new Response(LOGO_SVG, {
          headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=86400"
          }
        });
      } else if (path === "/og-image.svg" || path === "/og-image.jpg") {
        return new Response(OG_IMAGE_SVG, {
          headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=86400"
          }
        });
      }
      if (path === "/" || path === "") {
        const systemConfig = await getSystemConfig();
        const allowedDomains = [url.hostname];
        const decryptionKey = systemConfig.enable_url_encryption && systemConfig.url_encryption_key ? systemConfig.url_encryption_key : env.SECRET_KEY || "default-secret-key";
        const htmlWithConfig = PLAYSTATION_HTML.replace(
          "<script>",
          `<script>window.ALLOWED_DOMAINS = ${JSON.stringify(allowedDomains)};
window.DECRYPTION_KEY = '${decryptionKey}';
window.ENABLE_URL_ENCRYPTION = ${systemConfig.enable_url_encryption};
`
        );
        return new Response(htmlWithConfig, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "X-Frame-Options": "DENY",
            // 禁止在iframe中加载
            "Content-Security-Policy": "frame-ancestors 'none'",
            // 禁止被嵌入任何框架
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
          }
        });
      } else if (path === "/api/config") {
        return await handlePublicConfig(request, env, ctx);
      } else if (path === "/api/announcement") {
        return await handlePublicAnnouncement(request, env, ctx);
      } else if (path === "/api/channels") {
        return await handlePublicChannels(request, env, ctx);
      } else if (path === "/api/debug") {
        return await handleChannelDebug(request, env, ctx);
      } else if (path === "/api/token") {
        return await handleGetPlayToken(request, env, ctx);
      } else if (path.startsWith("/api/play/")) {
        return await handlePublicPlay(request, env, ctx);
      } else if (path === "/activate" || path === "/activate/" || path === "/activate/index" || path === "/activate/index.html") {
        const timezone = env.TIMEZONE || "Asia/Shanghai";
        const htmlWithConfig = USER_ACTIVATE_HTML.replace(
          "<script>",
          `<script>window.TIMEZONE = '${timezone}';
`
        );
        return new Response(htmlWithConfig, {
          headers: { "Content-Type": "text/html; charset=utf-8" }
        });
      } else if (path === "/api/activate") {
        return await handleUserActivate(request, env, ctx);
      } else if (path === "/admin" || path === "/admin/" || path === "/admin/index" || path === "/admin/index.html") {
        const timezone = env.TIMEZONE || "Asia/Shanghai";
        const htmlWithConfig = ADMIN_HTML.replace(
          "<script>",
          `<script>window.TIMEZONE = '${timezone}';
`
        );
        return new Response(htmlWithConfig, {
          headers: { "Content-Type": "text/html; charset=utf-8" }
        });
      } else if (path.startsWith("/live/")) {
        return await handleLiveRequest(request, env, ctx);
      } else if (path.startsWith("/sub/") && path.endsWith(".m3u")) {
        return await handleSubRequest(request, env, ctx);
      } else if (path.startsWith("/admin/")) {
        return await handleAdminRequest(request, env, ctx);
      } else if (path === "/sitemap.xml") {
        return new Response(generateSitemap(url.origin), {
          headers: { "Content-Type": "application/xml; charset=utf-8" }
        });
      } else if (path === "/robots.txt") {
        return new Response(generateRobotsTxt(), {
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      } else if (path === "/privacy-policy") {
        return new Response(generatePrivacyPolicy(), {
          headers: { "Content-Type": "text/html; charset=utf-8" }
        });
      } else if (path === "/terms") {
        return new Response(generateTermsOfService(), {
          headers: { "Content-Type": "text/html; charset=utf-8" }
        });
      } else {
        return new Response("Not Found", { status: 404 });
      }
    } catch (error) {
      console.error("Worker error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
  // 定时任务处理
  async scheduled(event, env, ctx) {
    await handleScheduledEvent(event, env, ctx);
  }
};

// ../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_checked_fetch();
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_checked_fetch();
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-i9MzN3/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// ../../AppData/Local/npm-cache/_npx/d77349f55c2be1c0/node_modules/wrangler/templates/middleware/common.ts
init_checked_fetch();
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-i9MzN3/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map
