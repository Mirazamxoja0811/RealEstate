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
* **Faza 1 (Arxitektura & TZ) 100% bajarildi:**
  * Foydalanuvchi taqdim etgan audio to'liq eshitildi, tahlil qilindi va talablar aniqlandi.
  * `docs/01_system_architecture_tz.md` yaratildi: 30 yillik tajribaga ega arxitektor darajasidagi 20x mukammal TZ yozildi.
  * `docs/02_database_schema.md` yaratildi: Multi-tenancy, RBAC, Agency, Branch, User, Client, ClientPreference, Property, MatchResult, NotificationQueue, AuditLog modellari Prisma formatida ishlab chiqildi.
  * `docs/03_smart_matching_engine.md` yaratildi: Ikki tomonlama (Forward va Reverse) matching algoritmi, ball hisoblash formulasi ($S_{total}$ vaznli koeffitsientlar), anti-spam va SMS yetkazish mexanizmi yozildi.
  * `docs/04_telegram_mini_app_ui_ux.md` yaratildi: Telegram WebApp UI/UX oqimi, katalog rejimi, rieltor va xaridor formalari, Telegram SDK imkoniyatlari bayon etildi.
  * `docs/05_cloud_deploy_security.md` yaratildi: Docker Compose, Nginx SSL, HMAC-SHA256 Telegram autentifikatsiyasi, telefon raqamlarini niqoblash (Phone Masking) va server hisob-kitoblari keltirildi.
  * `tasks/task_list.md` va `info.md` yaratildi.
  * Loyiha papkasida Git initsializatsiya qilindi.

---

## 5. Joriy Holat va Keyingi AI Qadami (Next Steps)

* **Hozirgi holat:** Faza 1 to'liq yakunlandi.
* **Keyingi qadam (Immediate Next Step):**
  * `backend/` papkasida loyiha initsializatsiyasini boshlash (`package.json`, TypeScript, Prisma o'rnatish va `schema.prisma` ni yaratish).
  * `frontend/` papkasi skeletini hozirlash.
  * `.gitignore` faylini yaratib, Faza 1 natijalarini Git ga birinchi commit bilan saqlash.

Har qanday yangi AI modeli ushbu nuqtadan to'g'ridan-to'g'ri `Task 2.1` va `Task 2.2` ni bajarishga kirishishi lozim.
