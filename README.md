# RealEstate CRM & ERP System (Telegram Mini App + Smart Matching)

Ko'chmas mulk agentliklari va mustaqil rieltorlar uchun ixtisoslashgan Multi-tenant CRM/ERP platformasi.

---

## 📌 Asosiy Imkoniyatlar
* 📱 **Telegram Mini App (Web App):** Rieltorlar va mijozlar uchun qulay, tezkor, o'rnatish talab qilmaydigan mobil katalog va boshqaruv paneli.
* 👥 **2 Toifali Mijozlar Boshqaruvi:**
  * **Beruvchilar (Mulk egalari):** Mulk parametrlari, fotosuratlar, geolokatsiya, narxlar.
  * **Oluvchilar (Xaridorlar / Ijarachilar):** Xaridor talablari (byudjet, tuman, xonalar soni).
* 🧠 **Smart Matching Engine (Aqlli Moslashtirish):**
  * Yangi mulk kiritilganda bazadagi talablarni skaner qilib, mos xaridorni bir zumda topish.
  * Xaridor kelganda mos uylar bo'lmasa, bir necha kundan so'ng yangi mos uy kiritilganda tizim avtomatik eslaydi.
* 📨 **Avtomatlashtirilgan Xabarnomalar:** Mos uy topilishi bilan xaridorga to'g'ridan-to'g'ri SMS (Eskiz) yoki Telegram xabari yetkaziladi.
* 🏢 **Agentlik ERP & Filiallar:** Filiallar, rieltorlar, telefon raqamlarini himoyalash (Phone Masking), to'liq Audit jurnali.

---

## 📂 Loyiha Strukturasi
```text
├── docs/                                  # Tizimning to'liq texnik hujjatlari (TZ)
│   ├── 01_system_architecture_tz.md       # Bosh arxitektura, rollar va TZ
│   ├── 02_database_schema.md              # PostgreSQL + Prisma to'liq schema
│   ├── 03_smart_matching_engine.md        # Matching algoritmi, formula va SMS triggerlar
│   ├── 04_telegram_mini_app_ui_ux.md      # Mini App ekranlari va oqimi
│   └── 05_cloud_deploy_security.md        # Docker, Nginx, Xavfsizlik, Auth
├── tasks/
│   └── task_list.md                       # Fazalar va bajariladigan tasklar ro'yxati
├── info.md                                # Hozirgi bajarilayotgan faol task holati
├── handoff.md                             # Sessiyalararo uzluksiz xotira jurnali
├── backend/                               # Node.js + TypeScript + Prisma API
└── frontend/                              # React + Vite + Tailwind (Telegram Mini App)
```

---

## 🛠️ Tezkor Ishga Tushirish
Tizim hujjatlari bilan `docs/` papkasida tanishishingiz mumkin.  
Ishlab chiqish rejasi: `tasks/task_list.md`.  
AI bilan ishlash protokoli: `handoff.md`.
