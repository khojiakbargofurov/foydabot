# 🤖 Telegram Bot — To'liq versiya

## 📦 O'rnatish

```bash
npm install
```

## ⚙️ Sozlash

1. `.env.example` faylini nusxa oling:
```bash
cp .env.example .env
```

2. `.env` faylini oching va quyidagilarni to'ldiring:
   - `BOT_TOKEN` — @BotFather dan oling
   - `ADMIN_IDS` — @userinfobot orqali bilib oling

3. `bot.js` faylida ham TOKEN va ADMIN_IDS ni o'zgartiring:
```js
const TOKEN = "sizning_tokeningiz";
const ADMIN_IDS = [sizning_id_ingiz];
```

## 🚀 Ishga tushirish

```bash
npm start
```

## 📁 Fayl tuzilmasi

```
tg-bot/
├── bot.js         — Asosiy bot kodi
├── database.js    — SQLite bilan ishlash
├── lang.js        — Ko'p tillik tarjimalar
├── package.json   — Kutubxonalar
├── bot.db         — SQLite bazasi (avtomatik yaratiladi)
└── .env           — Token va sozlamalar
```

## ✨ Funksiyalar

| Funksiya | Tavsif |
|---|---|
| 💵 Valyuta kursi | CBU API dan 7 ta valyuta (USD, EUR, RUB, GBP, JPY, CNY, KZT) |
| 🌤 Ob-havo | 5 ta O'zbek shahri bo'yicha batafsil ma'lumot |
| 🌐 Til o'zgartirish | O'zbek / Rus / English |
| 📊 Statistika | Jami, bugungi foydalanuvchilar, til taqsimoti |
| 📝 Foydalanuvchilar | Ro'yxat (50 ta) |
| 📢 Broadcast | Hammaga xabar yuborish |
| 🗄 SQLite | Foydalanuvchilar, til, last_seen saqlash |

## 🔑 Admin komandalar

```
/admin   — Admin panelni ochish
/stats   — Statistika
/cancel  — Broadcast bekor qilish
```

## 💬 Admin ID'ni bilish

@userinfobot ga Telegram'da yozing — u sizning ID'ingizni ko'rsatadi.# foydabot
