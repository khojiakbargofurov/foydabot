const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "bot.db");
let db = null;

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
async function initDB() {
  const SQL = await initSqlJs();
  db = fs.existsSync(DB_PATH)
    ? new SQL.Database(fs.readFileSync(DB_PATH))
    : new SQL.Database();

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      telegram_id INTEGER UNIQUE NOT NULL,
      first_name  TEXT DEFAULT '',
      username    TEXT DEFAULT '',
      lang        TEXT DEFAULT 'uz',
      score       INTEGER DEFAULT 0,
      created_at  TEXT DEFAULT (date('now')),
      last_seen   TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS reminders (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      telegram_id INTEGER NOT NULL,
      message     TEXT NOT NULL,
      remind_at   TEXT NOT NULL,
      done        INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS feedbacks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      telegram_id INTEGER NOT NULL,
      first_name  TEXT DEFAULT '',
      message     TEXT NOT NULL,
      created_at  TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS news (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT NOT NULL,
      body       TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  save();
  return db;
}

function save() {
  if (!db) return;
  fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
}

// ─────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────
function addUser(telegramId, firstName, username) {
  db.run(
    `INSERT INTO users (telegram_id, first_name, username) VALUES (?,?,?)
     ON CONFLICT(telegram_id) DO UPDATE SET
       first_name=excluded.first_name, username=excluded.username,
       last_seen=datetime('now')`,
    [telegramId, firstName || "", username || ""]
  );
  save();
}

function getUserLang(telegramId) {
  const stmt = db.prepare("SELECT lang FROM users WHERE telegram_id=?");
  stmt.bind([telegramId]);
  const found = stmt.step();
  const row = found ? stmt.getAsObject() : null;
  stmt.free();
  return row ? row.lang : "uz";
}

function setUserLang(telegramId, lang) {
  db.run("UPDATE users SET lang=? WHERE telegram_id=?", [lang, telegramId]);
  save();
}

function updateLastSeen(telegramId) {
  db.run("UPDATE users SET last_seen=datetime('now') WHERE telegram_id=?", [telegramId]);
  if (Math.random() < 0.1) save();
}

function getAllUsers() {
  const stmt = db.prepare("SELECT * FROM users ORDER BY created_at DESC");
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function getStats() {
  const q = (sql) => {
    const stmt = db.prepare(sql);
    stmt.step();
    const v = Object.values(stmt.getAsObject())[0] || 0;
    stmt.free();
    return v;
  };
  return {
    total:   q("SELECT COUNT(*) FROM users"),
    today:   q("SELECT COUNT(*) FROM users WHERE created_at=date('now')"),
    lang_uz: q("SELECT COUNT(*) FROM users WHERE lang='uz'"),
    lang_ru: q("SELECT COUNT(*) FROM users WHERE lang='ru'"),
    lang_en: q("SELECT COUNT(*) FROM users WHERE lang='en'"),
  };
}

// ─────────────────────────────────────────────
// SCORE / REYTING
// ─────────────────────────────────────────────
function addScore(telegramId, points) {
  db.run("UPDATE users SET score=score+? WHERE telegram_id=?", [points, telegramId]);
  save();
}

function getTopUsers(limit = 10) {
  const stmt = db.prepare(
    "SELECT telegram_id, first_name, username, score FROM users ORDER BY score DESC LIMIT ?"
  );
  stmt.bind([limit]);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function getUserScore(telegramId) {
  const stmt = db.prepare("SELECT score FROM users WHERE telegram_id=?");
  stmt.bind([telegramId]);
  const found = stmt.step();
  const row = found ? stmt.getAsObject() : null;
  stmt.free();
  return row ? row.score : 0;
}

// ─────────────────────────────────────────────
// REMINDERS
// ─────────────────────────────────────────────
function addReminder(telegramId, message, remindAt) {
  db.run(
    "INSERT INTO reminders (telegram_id, message, remind_at) VALUES (?,?,?)",
    [telegramId, message, remindAt]
  );
  save();
}

function getDueReminders() {
  const stmt = db.prepare(
    "SELECT * FROM reminders WHERE done=0 AND remind_at <= datetime('now')"
  );
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function markReminderDone(id) {
  db.run("UPDATE reminders SET done=1 WHERE id=?", [id]);
  save();
}

function getUserReminders(telegramId) {
  const stmt = db.prepare(
    "SELECT * FROM reminders WHERE telegram_id=? AND done=0 ORDER BY remind_at ASC"
  );
  stmt.bind([telegramId]);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

// ─────────────────────────────────────────────
// FEEDBACK
// ─────────────────────────────────────────────
function addFeedback(telegramId, firstName, message) {
  db.run(
    "INSERT INTO feedbacks (telegram_id, first_name, message) VALUES (?,?,?)",
    [telegramId, firstName || "", message]
  );
  save();
}

function getAllFeedbacks() {
  const stmt = db.prepare("SELECT * FROM feedbacks ORDER BY created_at DESC LIMIT 50");
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

// ─────────────────────────────────────────────
// NEWS
// ─────────────────────────────────────────────
function addNews(title, body) {
  db.run("INSERT INTO news (title, body) VALUES (?,?)", [title, body]);
  save();
}

function getLatestNews(limit = 5) {
  const stmt = db.prepare("SELECT * FROM news ORDER BY created_at DESC LIMIT ?");
  stmt.bind([limit]);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

module.exports = {
  initDB, save,
  addUser, getUserLang, setUserLang, updateLastSeen, getAllUsers, getStats,
  addScore, getTopUsers, getUserScore,
  addReminder, getDueReminders, markReminderDone, getUserReminders,
  addFeedback, getAllFeedbacks,
  addNews, getLatestNews,
};