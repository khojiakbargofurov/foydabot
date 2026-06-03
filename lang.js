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
  btn_ai:       { uz:"🤖 AI Chat",           ru:"🤖 AI Чат",           en:"🤖 AI Chat" },
  btn_crypto:   { uz:"🪙 Kripto",            ru:"🪙 Крипто",           en:"🪙 Crypto" },
  btn_qr:       { uz:"🔤 QR Kod",           ru:"🔤 QR Код",           en:"🔤 QR Code" },
  btn_downloader: { uz:"📥 Yuklovchi",        ru:"📥 Скачать",          en:"📥 Downloader" },
  btn_tts:      { uz:"🗣 Ovozga",            ru:"🗣 В голос",          en:"🗣 TTS" },

  // ── Yangi bo'lim matnlari ──
  ai_prompt: {
    uz: "🤖 AI ga savolingizni yozing:\n(/cancel — bekor qilish)",
    ru: "🤖 Напишите ваш вопрос для AI:\n(/cancel — отмена)",
    en: "🤖 Write your question for AI:\n(/cancel — cancel)"
  },
  ai_thinking: { uz: "🤔 O'ylayapman...", ru: "🤔 Думаю...", en: "🤔 Thinking..." },
  ai_error: { uz: "❌ Sun'iy intellekt javob berishda xatolik yuz berdi.", ru: "❌ Произошла ошибка ИИ.", en: "❌ An error occurred with AI." },
  downloader_prompt: {
    uz: "📥 Instagram, TikTok yoki YouTube video havolasini (link) yuboring:\n(/cancel — bekor qilish)",
    ru: "📥 Отправьте ссылку на Instagram, TikTok или YouTube видео:\n(/cancel — отмена)",
    en: "📥 Send Instagram, TikTok, or YouTube video link:\n(/cancel — cancel)"
  },
  downloader_downloading: { uz: "⚡ Video yuklab olinmoqda, iltimos kuting...", ru: "⚡ Видео скачивается, пожалуйста подождите...", en: "⚡ Video is downloading, please wait..." },
  downloader_error: { uz: "❌ Videoni yuklab bo'lmadi. Havola to'g'riligini tekshiring.", ru: "❌ Не удалось скачать видео. Проверьте ссылку.", en: "❌ Failed to download video. Check the link." },
  crypto_title: { uz: "🪙 Kriptovalyuta kurslari", ru: "🪙 Курсы криптовалют", en: "🪙 Cryptocurrency rates" },
  qr_prompt: {
    uz: "🔤 QR kod yaratish uchun matn yozing, yoki skanerlash uchun QR kod rasmini yuboring:\n(/cancel — bekor qilish)",
    ru: "🔤 Напишите текст для QR или отправьте фото QR для сканирования:\n(/cancel — отмена)",
    en: "🔤 Send text to generate QR, or send QR photo to scan:\n(/cancel — cancel)"
  },
  qr_scan_result: { uz: "🔍 QR Kod skanerlash natijasi:\n\n`{result}`", ru: "🔍 Результат сканирования QR:\n\n`{result}`", en: "🔍 QR Code scan result:\n\n`{result}`" },
  qr_scan_error: { uz: "❌ Rasmda QR kod aniqlanmadi.", ru: "❌ QR код на фото не найден.", en: "❌ QR code not detected in the image." },
  tts_prompt: {
    uz: "🗣 Ovozli xabarga aylantirish uchun matn yozing:\n(/cancel — bekor qilish)",
    ru: "🗣 Напишите текст для озвучки:\n(/cancel — отмена)",
    en: "🗣 Write text to convert to voice:\n(/cancel — cancel)"
  },
  stt_transcribing: { uz: "🎙 Ovozli xabar matnga o'tkazilmoqda...", ru: "🎙 Голосовое сообщение переводится в текст...", en: "🎙 Transcribing voice message..." },
  stt_result: { uz: "📝 Ovoz matni:\n\n_{text}_", ru: "📝 Текст голоса:\n\n_{text}_", en: "📝 Transcribed text:\n\n_{text}_" },
  stt_error: { uz: "❌ Ovozni matnga o'girib bo'lmadi. Muammo Gemini API kalitida bo'lishi mumkin.", ru: "❌ Не удалось перевести голос в текст.", en: "❌ Failed to transcribe voice." },
  user_blocked: { uz: "⛔ Siz botdan bloklangansiz!", ru: "⛔ Вы заблокированы в боте!", en: "⛔ You are blocked in this bot!" },

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
      "🌤 Ob-havo — O'zbekiston shaharlari bo'yicha\n" +
      "🎮 O'yinlar — Viktorina, So'z o'yini, Reyting\n" +
      "📰 Yangiliklar — kun.uz dan so'nggi xabarlar\n" +
      "🧮 Kalkulyator — Hisoblash + valyuta konvertor\n" +
      "⏰ Eslatma — Vaqtga eslatma o'rnating\n" +
      "🤖 AI Chat — Gemini AI bilan jonli suhbat\n" +
      "📥 Yuklovchi — Instagram, TikTok, YouTube video yuklovchi\n" +
      "🪙 Kripto — BTC, ETH, TON, SOL kurslari\n" +
      "🔤 QR Kod — QR yaratish va skanerlash\n" +
      "🗣 Ovozga — Matnni ovozga aylantirish (TTS)\n" +
      "🎙 Ovozli xabarlar yuborsangiz, bot ularni matnga o'girib beradi!\n" +
      "🗳 Baho bering — Botga baho qoldiring\n" +
      "📸 Rasm/Stiker — Yuborsangiz file ID chiqadi\n\n" +
      "Komandalar:\n" +
      "/myreminds — eslatmalarim\n" +
      "/score — ballingiz\n" +
      "/ai <savol> — AI chatidan tezkor foydalanish\n" +
      "/cancel — joriy amalni bekor qilish",
    ru:
      "❓ *Помощь*\n\n" +
      "💵 Курс валют — Актуальные курсы ЦБУ\n" +
      "🌤 Погода — Детальная погода по городам\n" +
      "🎮 Игры — Викторина, Слово, Рейтинг\n" +
      "📰 Новости — Последние новости с kun.uz\n" +
      "🧮 Калькулятор — Вычисления + конвертор\n" +
      "⏰ Напоминание — Установите таймер\n" +
      "🤖 AI Чат — Общение с Gemini AI\n" +
      "📥 Скачать — Скачивание видео с Instagram, TikTok, YouTube\n" +
      "🪙 Крипто — Курсы BTC, ETH, TON, SOL\n" +
      "🔤 QR Код — Генерация и сканирование QR\n" +
      "🗣 В голос — Перевод текста в голосовое сообщение\n" +
      "🎙 Отправляйте голосовые сообщения, бот переведет их в текст!\n" +
      "🗳 Оценить — Оставьте оценку боту\n" +
      "📸 Фото/Стикер — Получите file ID\n\n" +
      "Команды:\n" +
      "/myreminds — мои напоминания\n" +
      "/score — ваш счёт\n" +
      "/ai <вопрос> — быстрый вопрос ИИ\n" +
      "/cancel — отмена текущего действия",
    en:
      "❓ *Help*\n\n" +
      "💵 Currency — CBU real-time rates\n" +
      "🌤 Weather — Detailed weather forecast\n" +
      "🎮 Games — Quiz, Word game, Leaderboard\n" +
      "📰 News — Latest from kun.uz\n" +
      "🧮 Calculator — Math + currency converter\n" +
      "⏰ Reminder — Set a timed reminder\n" +
      "🤖 AI Chat — Chat with Gemini AI\n" +
      "📥 Downloader — Download from Instagram, TikTok, YouTube\n" +
      "🪙 Crypto — Live rates of BTC, ETH, TON, SOL\n" +
      "🔤 QR Code — Generate and scan QR codes\n" +
      "🗣 TTS — Convert text to voice message\n" +
      "🎙 Send voice messages, the bot will transcribe them to text!\n" +
      "🗳 Rate — Rate this bot\n" +
      "📸 Photo/Sticker — Get file ID\n\n" +
      "Commands:\n" +
      "/myreminds — my reminders\n" +
      "/score — your score\n" +
      "/ai <question> — quick question to AI\n" +
      "/cancel — cancel current action",
  },
};

function t(key, lang = "uz") {
  const entry = translations[key];
  if (!entry) return `[${key}]`;
  return entry[lang] || entry["uz"] || `[${key}]`;
}

module.exports = { t };