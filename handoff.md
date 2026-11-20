# Continuous AI Handoff & Session Memory (handoff.md)

> **DIQQAT HAR QANDAY YANGI AI MODELI / SESSIYA UCHUN QAT'IY QOIDA:**  
> Ushbu fayl loyihaning "bosh miyasi" va uzluksiz xotira zanjiridir. Har qanday yangi sessiyaga kirgan AI ushbu faylni to'liq o'qib chiqishi, loyihaning joriy holatini anglab yetishi va o'z ishini tugatgandan so'ng **nima qilganini ushbu faylga batafsil yozib ketishi SHART**.

---

## 1. AI Ishlash Qoidalari va Standartlari (Rules of Engagement)

1. **Kontekstni tiklash:** Yangi sessiya boshlanganda hech narsani qaytadan so'ramang. `handoff.md`, `info.md` va `tasks/task_list.md` fayllarini o'qing va to'xtagan joydan davom eting.
2. **Frontend va Backend chegarasi:** Hech qachon backend kodini frontendga, yoki frontend kodini backendga aralashtirmang. Ular `backend/` va `frontend/` papkalarida qat'iy alohida bo'lishi shart.
3. **Docs -> Task -> Info -> Handoff intizomi:**
   * Yangi qadam boshlashdan oldin `docs/` dagi tegishli hujjatni ko'ring.
   * `info.md` da qilinayotgan faol taskni belgilang.
   * Kodni yozing va sinovdan o'tkazing.
   * `tasks/task_list.md` da taskni `[x]` qilib belgilang.
   * Ish yakunida ushbu `handoff.md` fayliga to'liq hisobot yozib yangilang.
4. **Git Intizomi:** Har bir asosiy task yoki faza tugagach, toza va tushunarli commit qiling.

---

## 2. Loyiha Xulosasi va Biznes Maqsadi

* **Loyiha nomi:** RealEstate CRM & ERP System.
* **Mijozlar:** Rieltorlar, ko'chmas mulk agentliklari (Multi-tenant SaaS).
* **Asosiy qiymat:**
  * Telegram Mini App (Rieltor va mijoz uchun tezkor mobil katalog va kabinet).
  * Ikki toifali mijozlar: Oluvchi (Buyer) va Beruvchi (Seller/Owner).
  * **Smart Matching Engine:** Yangi uy kiritilganda bazadagi talablar bilan solishtirib, mos kelgan xaridorga 3 kundan keyin bo'lsa ham avtomatik **SMS / Telegram** xabar jo'natish.
  * Filiallar, rieltorlar o'rtasida telefon raqamlarni himoyalash (masking) va to'liq audit jurnali.

---

## 3. Loyiha Tuzilishi va Fayllar Xaritasi

```text
c:\Users\miraz\Desktop\New_project\
│
├── docs/                                  # Tizimning to'liq texnik hujjatlari (TZ)
│   ├── 01_system_architecture_tz.md       # Bosh arxitektura, rollar va TZ
│   ├── 02_database_schema.md              # PostgreSQL + Prisma to'liq schema
│   ├── 03_smart_matching_engine.md        # Matching algoritmi, formula va SMS triggerlar
│   ├── 04_telegram_mini_app_ui_ux.md      # Mini App ekranlari va oqimi
│   └── 05_cloud_deploy_security.md        # Docker, Nginx, Xavfsizlik, Auth
│
├── tasks/
│   └── task_list.md                       # Fazalar va bajariladigan tasklar ro'yxati
│
├── info.md                                # Hozirgi bajarilayotgan faol task holati
├── handoff.md                             # Sessiyalararo uzluksiz xotira jurnali (SHU FAYL)
│
├── backend/                               # Node.js + TypeScript + Prisma API
│   ├── (Faza 2 da to'liq quriladi)
│
└── frontend/                              # React + Vite + Tailwind (Telegram Mini App)
    ├── (Faza 5 da to'liq quriladi)
```

---

## 4. Amalga Oshirilgan Ishlar Jurnali (Changelog)

### Sessiya 1 (2026-11-21):
* **Faza 1 (Arxitektura, TZ & Skelet) 100% muvaffaqiyatli yakunlandi:**
  * Audio talablari asosida 5 ta to'liq arxitektura va texnik topshiriq hujjati yaratildi (`docs/`).
  * `tasks/task_list.md` da 6 ta fazaga bo'lingan aniq harakatlar rejasi belgilandi.
  * `info.md` da joriy faol vazifa ko'rsatildi.
  * Loyihada Git initsializatsiya qilindi, `.gitignore` va `README.md` qo'shildi.
  * `backend/` va `frontend/` papkalari izolyatsiya qilingan holda yaratildi.
  * Barcha o'zgarishlar Git ga muhrlandi (`feat(docs): initialize project architecture...`).

---

## 5. Joriy Holat va Keyingi AI Qadami (Next Steps)

* **Hozirgi holat:** Faza 1 to'liq yakunlandi. Navbat **Faza 2: Backend Core & Multi-Tenant Baza Infratuzilmasi** ga keldi.
* **Keyingi aniq topshiriq (Immediate Next Step):**
  * `Task 2.1`: `backend/` papkasida TypeScript + Express loyihasini initsializatsiya qilish (`package.json`, `tsconfig.json`).
  * `Task 2.2`: `backend/prisma/schema.prisma` ni yaratish va Prisma Client ni sozlash.
  * `Task 2.3`: Telegram WebApp `initData` tekshiruvi (HMAC-SHA256) va JWT Auth modulini yozish.

Har qanday yangi AI modeli yoki sessiya ushbu nuqtadan to'g'ridan-to'g'ri `Task 2.1` ni boshlashi lozim.
