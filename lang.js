const translations = {
  // ── Asosiy tugmalar ──
  btn_currency: { uz:"💵 Valyuta kursi",    ru:"💵 Курс валют",      en:"💵 Currency" },
  btn_weather:  { uz:"🌤 Ob-havo",          ru:"🌤 Погода",           en:"🌤 Weather" },
  btn_games:    { uz:"🎮 O'yinlar",         ru:"🎮 Игры",             en:"🎮 Games" },
  btn_news:     { uz:"📰 Yangiliklar",      ru:"📰 Новости",          en:"📰 News" },
  btn_calc:     { uz:"🧮 Kalkulyator",      ru:"🧮 Калькулятор",      en:"🧮 Calculator" },
  btn_reminder: { uz:"⏰ Eslatma",          ru:"⏰ Напоминание",      en:"⏰ Reminder" },
  btn_poll:     { uz:"🗳 Baho bering",      ru:"🗳 Оценить бота",     en:"🗳 Rate bot" },
  btn_language: { uz:"🌐 Til",             ru:"🌐 Язык",              en:"🌐 Language" },
  btn_help:     { uz:"❓ Yordam",           ru:"❓ Помощь",            en:"❓ Help" },

  // ── Xush kelibsiz ──
  welcome: {
    uz:"Assalomu alaykum, {name}! 👋\n\nKerakli bo'limni tanlang:",
    ru:"Привет, {name}! 👋\n\nВыберите нужный раздел:",
    en:"Hello, {name}! 👋\n\nChoose a section:",
  },

  // ── Til ──
  lang_changed: {
    uz:"✅ Til O'zbekcha ga o'zgartirildi!",
    ru:"✅ Язык изменён на Русский!",
    en:"✅ Language changed to English!",
  },

  // ── Valyuta ──
  currency_title: { uz:"Valyuta kurslari (CBU)", ru:"Курсы валют (ЦБУ)", en:"Currency Rates (CBU)" },
  error_currency: { uz:"❌ Kurslarni olishda xatolik.", ru:"❌ Ошибка курсов.", en:"❌ Failed to fetch rates." },

  // ── Ob-havo ──
  choose_city:   { uz:"🏙 Shaharni tanlang:",  ru:"🏙 Выберите город:", en:"🏙 Choose a city:" },
  weather_title: { uz:"Ob-havo",               ru:"Погода",              en:"Weather" },
  temp:          { uz:"Harorat",               ru:"Температура",         en:"Temperature" },
  feels:         { uz:"his",                   ru:"ощущается",           en:"feels like" },
  condition:     { uz:"Holat",                 ru:"Состояние",           en:"Condition" },
  humidity:      { uz:"Namlik",                ru:"Влажность",           en:"Humidity" },
  wind:          { uz:"Shamol",                ru:"Ветер",               en:"Wind" },
  error_weather: { uz:"❌ Ob-havo xatolik.",   ru:"❌ Ошибка погоды.",   en:"❌ Weather error." },

  // ── O'yinlar ──
  choose_game: {
    uz:"🎮 O'yinni tanlang:",
    ru:"🎮 Выберите игру:",
    en:"🎮 Choose a game:",
  },
  quiz_done: {
    uz:"Viktorina tugadi!",
    ru:"Викторина завершена!",
    en:"Quiz finished!",
  },

  // ── Yangiliklar ──
  news_title: { uz:"Yangiliklar", ru:"Новости", en:"News" },
  no_news:    { uz:"📭 Hozircha yangilik yo'q.", ru:"📭 Новостей пока нет.", en:"📭 No news yet." },

  // ── Eslatma ──
  no_reminders: {
    uz:"📭 Aktiv eslatmalar yo'q. /myreminds — ro'yxat",
    ru:"📭 Нет активных напоминаний.",
    en:"📭 No active reminders.",
  },
  my_reminders: { uz:"Eslatmalarim", ru:"Мои напоминания", en:"My reminders" },

  // ── So'rovnoma ──
  poll_question: {
    uz:"Bot sizga qanchalik yoqdi?",
    ru:"Как вам бот?",
    en:"How do you rate this bot?",
  },

  // ── Reyting / Ball ──
  your_score: { uz:"Sizning ballingiz", ru:"Ваш счёт", en:"Your score" },

  // ── Boshqa ──
  no_access:  { uz:"⛔ Ruxsat yo'q.", ru:"⛔ Нет доступа.", en:"⛔ No access." },
  cancelled:  { uz:"❌ Bekor qilindi.", ru:"❌ Отменено.", en:"❌ Cancelled." },

  help_text: {
    uz:
      "❓ *Yordam*\n\n" +
      "💵 Valyuta kursi — CBU dan real kurslar\n" +
      "🌤 Ob-havo — 7 shahar, batafsil\n" +
      "🎮 O'yinlar — Viktorina, So'z o'yini, Reyting\n" +
      "📰 Yangiliklar — kun.uz dan so'nggi xabarlar\n" +
      "🧮 Kalkulyator — Hisoblash + valyuta konvertor\n" +
      "⏰ Eslatma — Vaqtga eslatma o'rnating\n" +
      "🗳 Baho bering — Botga baho qoldiring\n" +
      "📸 Rasm/Stiker — Yuborsangiz file ID chiqadi\n\n" +
      "Komandalar:\n" +
      "/myreminds — eslatmalarim\n" +
      "/score — ballingiz\n" +
      "/cancel — bekor qilish",
    ru:
      "❓ *Помощь*\n\n" +
      "💵 Курс валют — Актуальные курсы ЦБУ\n" +
      "🌤 Погода — 7 городов, подробно\n" +
      "🎮 Игры — Викторина, Слово, Рейтинг\n" +
      "📰 Новости — Последние новости с kun.uz\n" +
      "🧮 Калькулятор — Вычисления + конвертор\n" +
      "⏰ Напоминание — Установите таймер\n" +
      "🗳 Оценить — Оставьте оценку боту\n" +
      "📸 Фото/Стикер — Получите file ID\n\n" +
      "Команды:\n" +
      "/myreminds — мои напоминания\n" +
      "/score — ваш счёт\n" +
      "/cancel — отмена",
    en:
      "❓ *Help*\n\n" +
      "💵 Currency — CBU real-time rates\n" +
      "🌤 Weather — 7 cities, detailed\n" +
      "🎮 Games — Quiz, Word game, Leaderboard\n" +
      "📰 News — Latest from kun.uz\n" +
      "🧮 Calculator — Math + currency converter\n" +
      "⏰ Reminder — Set a timed reminder\n" +
      "🗳 Rate — Rate this bot\n" +
      "📸 Photo/Sticker — Get file ID\n\n" +
      "Commands:\n" +
      "/myreminds — my reminders\n" +
      "/score — your score\n" +
      "/cancel — cancel",
  },
};

function t(key, lang = "uz") {
  const entry = translations[key];
  if (!entry) return `[${key}]`;
  return entry[lang] || entry["uz"] || `[${key}]`;
}

module.exports = { t };