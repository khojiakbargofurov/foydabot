require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const db = require("./database");
const { t } = require("./lang");
const http = require("http");

// ╔══════════════════════════════════════╗
// ║  QUYIDAGILARNI O'ZGARTIRING:        ║
// ║  TOKEN    — @BotFather dan           ║
// ║  ADMIN_IDS — @userinfobot dan        ║
// ╚══════════════════════════════════════╝
const TOKEN = process.env.BOT_TOKEN || "8886292829:AAFTEiKetZwfxJGq-df_HN1p0GU7plFvI5g";
const ADMIN_IDS = process.env.ADMIN_IDS
  ? process.env.ADMIN_IDS.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id))
  : [8158002704]; // <- Telegram ID ingiz

db.initDB().then(() => {
  startBot();
}).catch((err) => {
  console.error("❌ DB xatosi:", err.message);
  process.exit(1);
});

function startBot() {
  let bot;

  if (process.env.RENDER_EXTERNAL_URL) {
    // Webhook mode (Render for Web Services)
    bot = new TelegramBot(TOKEN, { webHook: true });
    bot.setWebHook(`${process.env.RENDER_EXTERNAL_URL}/bot${TOKEN}`);
    console.log(`📡 Webhook rejimida ishga tushdi: ${process.env.RENDER_EXTERNAL_URL}/bot${TOKEN}`);

    // Create a native HTTP server for webhooks and Render Health Check
    const server = http.createServer((req, res) => {
      if (req.method === "POST" && req.url === `/bot${TOKEN}`) {
        let body = "";
        req.on("data", chunk => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            bot.processUpdate(payload);
          } catch (e) {
            console.error("❌ Webhook parser xatoligi:", e.message);
          }
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("OK");
        });
      } else if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("OK");
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      }
    });

    const port = process.env.PORT || 10000;
    server.listen(port, () => {
      console.log(`📡 Webhook HTTP server ${port}-portda tinglamoqda`);
    });
  } else {
    // Polling mode (Local testing / Worker)
    bot = new TelegramBot(TOKEN, { polling: true });
    console.log("🔌 Polling (so'rov) rejimi faollashtirildi");
  }

// ═══════════════════════════════════════════════════
//  KLAVIATURALAR
// ═══════════════════════════════════════════════════

function isAdmin(userId) { return ADMIN_IDS.includes(userId); }

function mainKeyboard(lang) {
  return {
    reply_markup: {
      keyboard: [
        [{ text: t("btn_currency", lang) },   { text: t("btn_weather", lang) }],
        [{ text: t("btn_games", lang) },       { text: t("btn_news", lang) }],
        [{ text: t("btn_calc", lang) },        { text: t("btn_reminder", lang) }],
        [{ text: t("btn_poll", lang) },        { text: t("btn_language", lang) }],
        [{ text: t("btn_help", lang) }],
      ],
      resize_keyboard: true,
    },
  };
}

function adminKeyboard() {
  return {
    reply_markup: {
      keyboard: [
        [{ text: "📊 Statistika" },   { text: "📝 Foydalanuvchilar" }],
        [{ text: "📢 Broadcast" },    { text: "💬 Feedbacklar" }],
        [{ text: "🏆 Reyting" },      { text: "🔙 Asosiy menyu" }],
      ],
      resize_keyboard: true,
    },
  };
}

function langKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: [[
        { text: "🇺🇿 O'zbek",  callback_data: "lang_uz" },
        { text: "🇷🇺 Русский", callback_data: "lang_ru" },
        { text: "🇬🇧 English", callback_data: "lang_en" },
      ]],
    },
  };
}

// ═══════════════════════════════════════════════════
//  HOLATLAR (state machine)
// ═══════════════════════════════════════════════════
const userState = new Map();
// state: { mode: 'broadcast'|'reminder_msg'|'reminder_time'|'calc'|'poll'|'feedback', data: {} }

function setState(userId, mode, data = {}) {
  userState.set(userId, { mode, data });
}
function getState(userId) { return userState.get(userId) || null; }
function clearState(userId) { userState.delete(userId); }

// ═══════════════════════════════════════════════════
//  /start
// ═══════════════════════════════════════════════════

bot.onText(/\/start/, (msg) => {
  const { id: userId, first_name: firstName, username } = msg.from;
  db.addUser(userId, firstName, username);
  clearState(userId);
  const lang = db.getUserLang(userId);
  bot.sendMessage(msg.chat.id,
    t("welcome", lang).replace("{name}", firstName || ""),
    mainKeyboard(lang)
  );
});

// ═══════════════════════════════════════════════════
//  /admin
// ═══════════════════════════════════════════════════

bot.onText(/\/admin/, (msg) => {
  if (!isAdmin(msg.from.id)) return;
  bot.sendMessage(msg.chat.id, "👨‍💼 *Admin panel*", { parse_mode: "Markdown", ...adminKeyboard() });
});

// ═══════════════════════════════════════════════════
//  /cancel
// ═══════════════════════════════════════════════════

bot.onText(/\/cancel/, (msg) => {
  const lang = db.getUserLang(msg.from.id);
  clearState(msg.from.id);
  bot.sendMessage(msg.chat.id, t("cancelled", lang), mainKeyboard(lang));
});

// ═══════════════════════════════════════════════════
//  /myreminds
// ═══════════════════════════════════════════════════

bot.onText(/\/myreminds/, (msg) => {
  const userId = msg.from.id;
  const lang = db.getUserLang(userId);
  const rems = db.getUserReminders(userId);
  if (!rems.length) return bot.sendMessage(msg.chat.id, t("no_reminders", lang));
  const text = rems.map((r, i) => `${i+1}. ⏰ ${r.remind_at}\n   📝 ${r.message}`).join("\n\n");
  bot.sendMessage(msg.chat.id, `📋 *${t("my_reminders", lang)}:*\n\n${text}`, { parse_mode: "Markdown" });
});

// ═══════════════════════════════════════════════════
//  /score
// ═══════════════════════════════════════════════════

bot.onText(/\/score/, (msg) => {
  const userId = msg.from.id;
  const lang = db.getUserLang(userId);
  const score = db.getUserScore(userId);
  bot.sendMessage(msg.chat.id, `🏆 ${t("your_score", lang)}: *${score}* ball`, { parse_mode: "Markdown" });
});

// ═══════════════════════════════════════════════════
//  ESLATMA TEKSHIRUVCHI (har 30 soniyada)
// ═══════════════════════════════════════════════════

setInterval(() => {
  const due = db.getDueReminders();
  for (const rem of due) {
    bot.sendMessage(rem.telegram_id, `⏰ *Eslatma!*\n\n${rem.message}`, { parse_mode: "Markdown" })
      .catch(() => {});
    db.markReminderDone(rem.id);
  }
}, 30000);

// ═══════════════════════════════════════════════════
//  VIKTORINA SAVOLLARI
// ═══════════════════════════════════════════════════

const QUIZ_QUESTIONS = [
  { q: "🌍 O'zbekistonning poytaxti?", options: ["Samarqand","Toshkent","Buxoro","Namangan"], answer: 1 },
  { q: "🔢 2^10 = ?", options: ["512","1024","2048","256"], answer: 1 },
  { q: "🧪 Suvning kimyoviy formulasi?", options: ["CO2","NaCl","H2O","O2"], answer: 2 },
  { q: "🎨 Quyosh necha planeta?", options: ["7","8","9","10"], answer: 1 },
  { q: "📚 Shakespeare qaysi mamlakatdan?", options: ["Fransiya","Germaniya","Angliya","Italiya"], answer: 2 },
  { q: "🏔 Dunyo eng baland tog'i?", options: ["K2","Everest","Elbrus","Kilimanjaro"], answer: 1 },
  { q: "⚽ FIFA JCh qaysi mamlakatda tug'ilgan?", options: ["Fransiya","Braziliya","Argentina","Angliya"], answer: 1 },
  { q: "🔭 Quyosh sistemasida nechta planeta?", options: ["7","8","9","6"], answer: 1 },
  { q: "💻 HTML nima uchun ishlatiladi?", options: ["Dizayn","Ma'lumotlar bazasi","Veb sahifa","Dasturlash"], answer: 2 },
  { q: "🇺🇿 O'zbek so'mi qachon joriy etilgan?", options: ["1991","1993","1994","1995"], answer: 2 },
];

const userQuiz = new Map(); // userId → { qIndex, score, total }

function sendQuizQuestion(chatId, userId, qIndex) {
  if (qIndex >= QUIZ_QUESTIONS.length) {
    const quiz = userQuiz.get(userId);
    const earned = quiz.score * 5;
    db.addScore(userId, earned);
    userQuiz.delete(userId);
    clearState(userId);
    const lang = db.getUserLang(userId);
    return bot.sendMessage(chatId,
      `🎉 *${t("quiz_done", lang)}*\n\n` +
      `✅ To'g'ri: ${quiz.score}/${QUIZ_QUESTIONS.length}\n` +
      `🏆 +${earned} ball qo'shildi!\n\n` +
      `/score — umumiy ballingiz`,
      { parse_mode: "Markdown", ...mainKeyboard(lang) }
    );
  }

  const q = QUIZ_QUESTIONS[qIndex];
  setState(userId, "quiz", { qIndex });

  bot.sendMessage(chatId, `❓ *${q.q}*\n\n_(${qIndex+1}/${QUIZ_QUESTIONS.length})_`, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: q.options.map((opt, i) => [
        { text: opt, callback_data: `quiz_${qIndex}_${i}` }
      ]),
    },
  });
}

// ═══════════════════════════════════════════════════
//  SO'Z O'YINI — kim kim
// ═══════════════════════════════════════════════════

const WORD_GAMES = [
  { clue: "🔵 Ko'k rangdagi dengiz hayvoni, 8 oyoqli", answer: "ahtapot" },
  { clue: "📱 Har kuni ishlatadigan qurilma, qo'lda ushlaymiz", answer: "telefon" },
  { clue: "☀️ Ertalab chiqadi, kechqurun botadi", answer: "quyosh" },
  { clue: "📚 Kitobdan ham katta, do'konda ham bor", answer: "kutubxona" },
  { clue: "🌊 Yer yuzining 71%ini qoplaydi", answer: "okean" },
];

const userWordGame = new Map();

// ═══════════════════════════════════════════════════
//  ASOSIY MESSAGE HANDLER
// ═══════════════════════════════════════════════════

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const lang = db.getUserLang(userId);

  db.updateLastSeen(userId);

  // Rasm/Stiker saqlash
  if (msg.photo || msg.sticker) {
    return handleMedia(msg, chatId, userId, lang);
  }

  if (!msg.text) return;
  const text = msg.text;

  // ── HOLAT TEKSHIRUVI ──
  const state = getState(userId);

  if (state) {
    // BROADCAST
    if (state.mode === "broadcast" && isAdmin(userId)) {
      clearState(userId);
      const users = db.getAllUsers();
      let sent = 0, failed = 0;
      await bot.sendMessage(chatId, "📤 Yuborilmoqda...");
      for (const u of users) {
        try {
          await bot.sendMessage(u.telegram_id, `📢 *Yangilik:*\n\n${text}`, { parse_mode: "Markdown" });
          sent++;
          await new Promise(r => setTimeout(r, 50));
        } catch { failed++; }
      }
      return bot.sendMessage(chatId, `✅ Tugadi! ✔️ ${sent} ta | ❌ ${failed} ta`, adminKeyboard());
    }

    // ESLATMA — xabar
    if (state.mode === "reminder_msg") {
      setState(userId, "reminder_time", { message: text });
      return bot.sendMessage(chatId,
        `⏰ *Qachon eslataylik?*\n\nFormat: \`YYYY-MM-DD HH:MM\`\nMisol: \`${new Date().toISOString().slice(0,16).replace("T"," ")}\``,
        { parse_mode: "Markdown", reply_markup: { remove_keyboard: true } }
      );
    }

    // ESLATMA — vaqt
    if (state.mode === "reminder_time") {
      const timeStr = text.trim();
      const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
      if (!dateRegex.test(timeStr)) {
        return bot.sendMessage(chatId, `❌ Format noto'g'ri!\nTo'g'ri format: \`2025-12-31 09:00\``, { parse_mode: "Markdown" });
      }
      db.addReminder(userId, state.data.message, timeStr + ":00");
      clearState(userId);
      return bot.sendMessage(chatId,
        `✅ *Eslatma qo'shildi!*\n📝 ${state.data.message}\n⏰ ${timeStr}\n\n/myreminds — eslatmalarim`,
        { parse_mode: "Markdown", ...mainKeyboard(lang) }
      );
    }

    // KALKULYATOR
    if (state.mode === "calc") {
      const expr = text.trim();
      // Son konvertatsiyasi: "100 USD" kabi
      const convMatch = expr.match(/^(\d+(?:\.\d+)?)\s+(USD|EUR|RUB|GBP|KZT)\s+(?:to\s+)?(USD|EUR|RUB|GBP|KZT|so'm|uzs)?$/i);
      if (convMatch) {
        return handleCurrencyConvert(chatId, convMatch, lang);
      }
      // Matematik hisoblash
      try {
        const safeExpr = expr.replace(/[^0-9+\-*/().% ]/g, "");
        // eslint-disable-next-line no-new-func
        const result = Function(`"use strict"; return (${safeExpr})`)();
        if (isNaN(result) || !isFinite(result)) throw new Error("NaN");
        bot.sendMessage(chatId,
          `🧮 \`${expr}\` = *${result}*\n\nYangi hisoblash uchun yozing yoki /cancel`,
          { parse_mode: "Markdown" }
        );
      } catch {
        bot.sendMessage(chatId, `❌ Noto'g'ri ifoda!\nMisol: \`2+2\`, \`100*1.2\`, \`500 USD\``, { parse_mode: "Markdown" });
      }
      return;
    }

    // SO'ROVNOMA JAVOB
    if (state.mode === "poll_answer") {
      clearState(userId);
      db.addFeedback(userId, msg.from.first_name, `📊 So'rovnoma: ${text}`);
      return bot.sendMessage(chatId, `✅ Javobingiz qabul qilindi! Rahmat 🙏`, mainKeyboard(lang));
    }

    // SO'Z O'YINI JAVOB
    if (state.mode === "wordgame") {
      const game = userWordGame.get(userId);
      if (game) {
        if (text.toLowerCase().trim() === game.answer) {
          db.addScore(userId, 10);
          userWordGame.delete(userId);
          clearState(userId);
          return bot.sendMessage(chatId,
            `🎉 *To'g'ri!* +10 ball!\n\nJavob: *${game.answer}*`,
            { parse_mode: "Markdown", ...mainKeyboard(lang) }
          );
        } else {
          return bot.sendMessage(chatId, `❌ Noto'g'ri, yana urinib ko'ring yoki /cancel`);
        }
      }
    }
  }

  // ── ADMIN TUGMALARI ──
  if (isAdmin(userId)) {
    if (text === "📊 Statistika") return sendStats(chatId);
    if (text === "📝 Foydalanuvchilar") return sendUserList(chatId);
    if (text === "🏆 Reyting") return sendTopRating(chatId);
    if (text === "💬 Feedbacklar") return sendFeedbacks(chatId);
    if (text === "📢 Broadcast") {
      setState(userId, "broadcast");
      return bot.sendMessage(chatId,
        "✍️ Hammaga yuboriladigan xabarni yozing:\n(/cancel — bekor qilish)",
        { reply_markup: { remove_keyboard: true } }
      );
    }
    if (text === "🔙 Asosiy menyu") return bot.sendMessage(chatId, "🏠 Asosiy menyu:", mainKeyboard(lang));
  }

  // ── TIL ──
  if (text === t("btn_language", lang)) {
    return bot.sendMessage(chatId, "🌐 Tilni tanlang:", langKeyboard());
  }

  // ── YORDAM ──
  if (text === t("btn_help", lang)) {
    return bot.sendMessage(chatId, t("help_text", lang), { parse_mode: "Markdown" });
  }

  // ── VALYUTA ──
  if (text === t("btn_currency", lang)) {
    try {
      const { data } = await axios.get("https://cbu.uz/uz/arkhiv-kursov-valyut/json/");
      const codes = ["USD","EUR","RUB","GBP","JPY","CNY","KZT"];
      const flags = { USD:"🇺🇸",EUR:"🇪🇺",RUB:"🇷🇺",GBP:"🇬🇧",JPY:"🇯🇵",CNY:"🇨🇳",KZT:"🇰🇿" };
      const lines = codes.map(c => {
        const item = data.find(d => d.Ccy === c);
        return item ? `${flags[c]} ${c}: *${parseFloat(item.Rate).toLocaleString("uz")}* so'm` : null;
      }).filter(Boolean).join("\n");
      await bot.sendMessage(chatId,
        `💵 *${t("currency_title", lang)}*\n📅 ${data[0]?.Date||""}\n\n${lines}`,
        { parse_mode: "Markdown" }
      );
    } catch { bot.sendMessage(chatId, t("error_currency", lang)); }
    return;
  }

  // ── OB-HAVO ──
  if (text === t("btn_weather", lang)) {
    const cities = {
      uz: ["Toshkent","Samarqand","Farg'ona","Buxoro","Andijon","Namangan","Qarshi"],
      ru: ["Tashkent","Samarkand","Fergana","Buxoro","Andijan","Namangan","Karshi"],
      en: ["Tashkent","Samarkand","Fergana","Bukhara","Andijan","Namangan","Karshi"],
    };
    return bot.sendMessage(chatId, t("choose_city", lang), {
      reply_markup: {
        inline_keyboard: (cities[lang]||cities.uz).map(c => [
          { text: `🏙 ${c}`, callback_data: `weather_${c}` }
        ]),
      },
    });
  }

  // ── O'YINLAR ──
  if (text === t("btn_games", lang)) {
    return bot.sendMessage(chatId, t("choose_game", lang), {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🎯 Viktorina",   callback_data: "game_quiz" }],
          [{ text: "🔤 So'z o'yini", callback_data: "game_word" }],
          [{ text: "🏆 Reyting",     callback_data: "game_top" }],
        ],
      },
    });
  }

  // ── YANGILIKLAR ──
  if (text === t("btn_news", lang)) {
    return sendNews(chatId, lang);
  }

  // ── KALKULYATOR ──
  if (text === t("btn_calc", lang)) {
    setState(userId, "calc");
    return bot.sendMessage(chatId,
      `🧮 *Kalkulyator / Konvertor*\n\n` +
      `📐 Matematik: \`2+2\`, \`100*1.2\`, \`(5+3)*2\`\n` +
      `💱 Valyuta: \`100 USD\`, \`50 EUR\`\n\n` +
      `/cancel — chiqish`,
      { parse_mode: "Markdown", reply_markup: { remove_keyboard: true } }
    );
  }

  // ── ESLATMA ──
  if (text === t("btn_reminder", lang)) {
    setState(userId, "reminder_msg");
    return bot.sendMessage(chatId,
      `⏰ *Eslatma qo'shish*\n\nQanday eslatma qo'shmoqchisiz?`,
      { parse_mode: "Markdown", reply_markup: { remove_keyboard: true } }
    );
  }

  // ── SO'ROVNOMA ──
  if (text === t("btn_poll", lang)) {
    setState(userId, "poll_answer");
    return bot.sendMessage(chatId,
      `🗳 *${t("poll_question", lang)}*`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "⭐⭐⭐⭐⭐ 5 — A'lo",     callback_data: "poll_5" }],
            [{ text: "⭐⭐⭐⭐ 4 — Yaxshi",      callback_data: "poll_4" }],
            [{ text: "⭐⭐⭐ 3 — O'rtacha",      callback_data: "poll_3" }],
            [{ text: "⭐⭐ 2 — Yomon",           callback_data: "poll_2" }],
            [{ text: "⭐ 1 — Juda yomon",        callback_data: "poll_1" }],
          ],
        },
      }
    );
  }
});

// ═══════════════════════════════════════════════════
//  RASM / STIKER HANDLER
// ═══════════════════════════════════════════════════

async function handleMedia(msg, chatId, userId, lang) {
  if (msg.sticker) {
    const s = msg.sticker;
    return bot.sendMessage(chatId,
      `🎭 *Stiker ma'lumoti*\n\n` +
      `📦 Pack: ${s.set_name || "—"}\n` +
      `🆔 File ID: \`${s.file_id}\`\n` +
      `📐 ${s.width}×${s.height}px\n` +
      `😀 Emoji: ${s.emoji || "—"}`,
      { parse_mode: "Markdown" }
    );
  }

  if (msg.photo) {
    const photo = msg.photo[msg.photo.length - 1]; // eng katta
    return bot.sendMessage(chatId,
      `📸 *Rasm ma'lumoti*\n\n` +
      `🆔 File ID: \`${photo.file_id}\`\n` +
      `📐 ${photo.width}×${photo.height}px\n\n` +
      `_File ID ni boshqa botlarda ishlatishingiz mumkin_`,
      { parse_mode: "Markdown" }
    );
  }
}

// ═══════════════════════════════════════════════════
//  YANGILIKLAR
// ═══════════════════════════════════════════════════

async function sendNews(chatId, lang) {
  try {
    // RSS orqali kun.uz dan yangiliklar
    const { data } = await axios.get(
      "https://kun.uz/rss/",
      { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 8000 }
    );

    // RSS ni parse qilish (oddiy regex bilan)
    const items = [...data.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 5);
    if (!items.length) throw new Error("Empty RSS");

    let text = `📰 *${t("news_title", lang)}* — kun.uz\n\n`;
    items.forEach((m, i) => {
      const title = (m[1].match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)||[])[1]
                 || (m[1].match(/<title>(.*?)<\/title>/)||[])[1]
                 || "—";
      const link  = (m[1].match(/<link>(.*?)<\/link>/)||[])[1] || "";
      text += `${i+1}. [${title.trim()}](${link.trim()})\n\n`;
    });

    bot.sendMessage(chatId, text, { parse_mode: "Markdown", disable_web_page_preview: true });

  } catch {
    // Fallback: DB dagi yangiliklar
    const news = db.getLatestNews(5);
    if (!news.length) {
      return bot.sendMessage(chatId, t("no_news", lang));
    }
    const text = news.map((n,i) => `*${i+1}. ${n.title}*\n${n.body}`).join("\n\n");
    bot.sendMessage(chatId, `📰 *${t("news_title", lang)}*\n\n${text}`, { parse_mode: "Markdown" });
  }
}

// ═══════════════════════════════════════════════════
//  VALYUTA KONVERTOR
// ═══════════════════════════════════════════════════

async function handleCurrencyConvert(chatId, match, lang) {
  const amount = parseFloat(match[1]);
  const from = match[2].toUpperCase();
  const to = (match[3] || "UZS").toUpperCase();

  try {
    const { data } = await axios.get("https://cbu.uz/uz/arkhiv-kursov-valyut/json/");

    const getRate = (code) => {
      if (code === "UZS" || code === "SO'M") return 1;
      const item = data.find(d => d.Ccy === code);
      return item ? parseFloat(item.Rate) : null;
    };

    const rateFrom = getRate(from);
    const rateTo   = to === "UZS" || to === "SO'M" ? 1 : getRate(to);

    if (!rateFrom) return bot.sendMessage(chatId, `❌ ${from} topilmadi`);
    if (!rateTo)   return bot.sendMessage(chatId, `❌ ${to} topilmadi`);

    const inUZS  = amount * rateFrom;
    const result = to === "UZS" || to === "SO'M" ? inUZS : inUZS / rateTo;

    bot.sendMessage(chatId,
      `💱 *${amount} ${from}* = *${result.toLocaleString("uz", {maximumFractionDigits:2})} ${to}*`,
      { parse_mode: "Markdown" }
    );
  } catch {
    bot.sendMessage(chatId, t("error_currency", lang));
  }
}

// ═══════════════════════════════════════════════════
//  ADMIN FUNKSIYALAR
// ═══════════════════════════════════════════════════

function sendStats(chatId) {
  const s = db.getStats();
  bot.sendMessage(chatId,
    `📊 *Bot statistikasi*\n\n` +
    `👥 Jami: *${s.total}*\n` +
    `📅 Bugun: *${s.today}*\n\n` +
    `🌐 Tillar:\n` +
    `  🇺🇿 O'zbek: ${s.lang_uz}\n` +
    `  🇷🇺 Русский: ${s.lang_ru}\n` +
    `  🇬🇧 English: ${s.lang_en}`,
    { parse_mode: "Markdown", ...adminKeyboard() }
  );
}

function sendUserList(chatId) {
  const users = db.getAllUsers();
  if (!users.length) return bot.sendMessage(chatId, "Hali foydalanuvchi yo'q.");
  const lines = users.slice(0,50).map((u,i) => {
    const un = u.username ? `@${u.username}` : "—";
    return `${i+1}. ${u.first_name} (${un}) | ${u.lang.toUpperCase()} | 🏆${u.score||0}`;
  }).join("\n");
  bot.sendMessage(chatId,
    `📝 *Foydalanuvchilar* (${users.length} ta):\n\n\`\`\`\n${lines}\n\`\`\``,
    { parse_mode: "Markdown", ...adminKeyboard() }
  );
}

function sendTopRating(chatId) {
  const top = db.getTopUsers(10);
  if (!top.length) return bot.sendMessage(chatId, "Hali ball yo'q.");
  const medals = ["🥇","🥈","🥉"];
  const lines = top.map((u,i) => {
    const icon = medals[i] || `${i+1}.`;
    const un = u.username ? `@${u.username}` : u.first_name;
    return `${icon} ${un} — *${u.score}* ball`;
  }).join("\n");
  bot.sendMessage(chatId, `🏆 *Top o'yinchilar:*\n\n${lines}`, { parse_mode: "Markdown", ...adminKeyboard() });
}

function sendFeedbacks(chatId) {
  const fbs = db.getAllFeedbacks();
  if (!fbs.length) return bot.sendMessage(chatId, "Hali feedback yo'q.");
  const lines = fbs.slice(0,20).map((f,i) =>
    `${i+1}. [${f.first_name}] ${f.message}\n_${f.created_at}_`
  ).join("\n\n");
  bot.sendMessage(chatId, `💬 *Feedbacklar:*\n\n${lines}`, { parse_mode: "Markdown", ...adminKeyboard() });
}

// ═══════════════════════════════════════════════════
//  CALLBACK QUERY
// ═══════════════════════════════════════════════════

bot.on("callback_query", async (query) => {
  const chatId  = query.message.chat.id;
  const userId  = query.from.id;
  const msgId   = query.message.message_id;
  const data    = query.data;
  const lang    = db.getUserLang(userId);

  await bot.answerCallbackQuery(query.id);

  // ── TIL ──
  if (data.startsWith("lang_")) {
    const newLang = data.replace("lang_", "");
    db.setUserLang(userId, newLang);
    await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: msgId });
    return bot.sendMessage(chatId, t("lang_changed", newLang), mainKeyboard(newLang));
  }

  // ── OB-HAVO ──
  if (data.startsWith("weather_")) {
    const city = data.replace("weather_", "");
    try {
      const { data: wd } = await axios.get(
        `https://wttr.in/${encodeURIComponent(city)}?format=j1`,
        { headers: { "User-Agent": "Mozilla/5.0" } }
      );
      const cur = wd.current_condition[0];
      const day = wd.weather[0];
      bot.sendMessage(chatId,
        `🌤 *${city} — ${t("weather_title", lang)}*\n\n` +
        `🌡 ${t("temp", lang)}: *${cur.temp_C}°C* (${t("feels", lang)}: ${cur.FeelsLikeC}°C)\n` +
        `🔼 Max: ${day.maxtempC}°C  🔽 Min: ${day.mintempC}°C\n` +
        `☁️ ${t("condition", lang)}: ${cur.weatherDesc[0]?.value||"—"}\n` +
        `💧 ${t("humidity", lang)}: ${cur.humidity}%\n` +
        `💨 ${t("wind", lang)}: ${cur.windspeedKmph} km/h`,
        { parse_mode: "Markdown" }
      );
    } catch { bot.sendMessage(chatId, t("error_weather", lang)); }
    return;
  }

  // ── O'YINLAR ──
  if (data === "game_quiz") {
    userQuiz.set(userId, { score: 0, total: QUIZ_QUESTIONS.length });
    return sendQuizQuestion(chatId, userId, 0);
  }

  if (data === "game_word") {
    const game = WORD_GAMES[Math.floor(Math.random() * WORD_GAMES.length)];
    userWordGame.set(userId, game);
    setState(userId, "wordgame");
    return bot.sendMessage(chatId,
      `🔤 *So'z toping!*\n\n${game.clue}\n\n_Javobni yozing:_`,
      { parse_mode: "Markdown", reply_markup: { remove_keyboard: true } }
    );
  }

  if (data === "game_top") {
    const top = db.getTopUsers(10);
    if (!top.length) return bot.sendMessage(chatId, "Hali o'yinchilar yo'q.");
    const medals = ["🥇","🥈","🥉"];
    const lines = top.map((u,i) => {
      const icon = medals[i] || `${i+1}.`;
      const un = u.username ? `@${u.username}` : u.first_name;
      return `${icon} ${un} — *${u.score}* ball`;
    }).join("\n");
    return bot.sendMessage(chatId, `🏆 *Top o'yinchilar:*\n\n${lines}`, { parse_mode: "Markdown" });
  }

  // ── VIKTORINA JAVOB ──
  if (data.startsWith("quiz_")) {
    const [, qIdx, aIdx] = data.split("_").map(Number);
    const quiz = userQuiz.get(userId);
    if (!quiz) return;

    const q = QUIZ_QUESTIONS[qIdx];
    const correct = aIdx === q.answer;

    if (correct) {
      quiz.score++;
      await bot.answerCallbackQuery(query.id, { text: "✅ To'g'ri!", show_alert: false });
    } else {
      await bot.answerCallbackQuery(query.id, { text: `❌ Noto'g'ri! To'g'ri: ${q.options[q.answer]}`, show_alert: true });
    }

    await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: msgId });
    sendQuizQuestion(chatId, userId, qIdx + 1);
    return;
  }

  // ── SO'ROVNOMA ──
  if (data.startsWith("poll_")) {
    const rating = data.replace("poll_", "");
    clearState(userId);
    db.addFeedback(userId, query.from.first_name, `⭐ Baho: ${rating}/5`);
    await bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: msgId });
    return bot.sendMessage(chatId, `✅ *${rating}/5 baho qoldirdingiz!* Rahmat 🙏`, { parse_mode: "Markdown" });
  }
});

// ═══════════════════════════════════════════════════
//  POLLING XATO
// ═══════════════════════════════════════════════════

bot.on("polling_error", (err) => {
  console.error("Polling xato:", err.message);
});

console.log("✅ Bot ishga tushdi — barcha funksiyalar faol!");

} // startBot() end