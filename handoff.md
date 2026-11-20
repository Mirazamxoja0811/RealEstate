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

### Sessiya 1 & 2 (2026-11-21):
* **Faza 1 (Arxitektura, TZ & Skelet) 100% muvaffaqiyatli yakunlandi:**
  * 5 ta batafsil arxitektura va texnik topshiriq hujjati yaratildi (`docs/`).
  * `tasks/task_list.md` va `info.md` tayyorlandi.
  * Git repo initsializatsiya qilindi.
* **Faza 2 (Backend Core & Prisma) 100% yakunlandi:**
  * `backend/` da Node.js + TypeScript + Express arxitekturasi o'rnatildi.
  * `backend/prisma/schema.prisma` ga barcha relyatsion modellar va indekslar kiritildi, Prisma Client (`@prisma/client`) generatsiya qilindi.
  * Telegram `initData` kriptografik tekshiruvi (HMAC-SHA256) va JWT Auth middleware'lari joriy etildi.
  * Multi-tenant middleware va RBAC (SuperAdmin, AgencyAdmin, BranchManager, Realtor) himoyasi o'rnatildi.
  * Audit logging tizimi yaratildi (`recordAuditLog`).
* **Faza 3 (Properties & Clients CRUD) 100% yakunlandi:**
  * Mulklar (Property) CRUD va murakkab filtrlash (narx oralig'i, xonalar soni, tuman, bitim turi).
  * Telefon raqamlarini ruxsatsiz shaxslardan maxfiylashtirish (Phone Masking) funksiyasi.
  * Mijozlar (Oluvchi, Beruvchi, Ijarachi) va xaridor talablari (ClientPreferences) kiritish logikasi.
* **Faza 4 (Smart Matching Engine & SMS Gateway) 100% yakunlandi:**
  * Scoring algoritmi ($S_{total}$ vaznli formula) ishlab chiqildi.
  * Asinxron Reverse Matching (yangi mulk kiritilganda o'tmishdagi barcha mos xaridorlarni topish) va Forward Matching (yangi xaridor kiritilganda mos uylarni ko'rsatish) ulandi.
  * Eskiz.uz SMS integratsiyasi, anti-spam va tungi jimlik (Quiet Hours) qoidalari joriy etildi.
* **Faza 5 (Telegram Mini App Frontend) 100% yakunlandi:**
  * `frontend/` da Vite + React 18 + TypeScript + Tailwind CSS o'rnatildi.
  * Telegram WebApp SDK (`@twa-dev/sdk`), Haptic Feedback, Telegram mavzusi ulandi.
  * Rieltor Katalogi (PropertyCard, filtrlar, xonalar bo'yicha saralash), Mulk kartasi modali (PropertyDetailModal) yaratildi.
  * Yangi mulk kiritish (AddPropertyModal) va yangi xaridor qo'shish (AddClientModal) formalari yaratildi.
  * Smart Matching ekrani (MatchingView) orqali xaridorga 1 bosishda mos uylarni ko'rsatish va SMS yuborish interfeysi ishga tushirildi.
  * Frontend to'liq build bo'ldi (`frontend/dist/` yaratildi).
* **Faza 6 (DevOps & Deploy) 100% yakunlandi:**
  * `docker-compose.yml`, `backend/Dockerfile`, `backend/Dockerfile.worker`, `nginx/conf.d/default.conf` va `scripts/init-db.sql` tayyorlandi.
* **GitHub Push & Localhost Live:**
  * GitHub masofaviy repozitoriyasi ulandi: `https://github.com/Mirazamxoja0811/RealEstate.git`
  * Asosiy branch `main` ga o'zgartirildi va barcha kodlar muvaffaqiyatli push qilindi.
  * Localhostda xizmatlar ishga tushirildi:
    - Backend API: `http://localhost:4000`
    - Frontend Mini App: `http://localhost:3000`

---

## 5. Loyihani Ishga Tushirish Qo'llanmasi (How to Run)

### Backendni ishga tushirish (Local):
```bash
cd backend
npm run dev
# Server: http://localhost:4000
# Health check: http://localhost:4000/api/health
```

### Frontend / Telegram Mini App ni ishga tushirish (Local):
```bash
cd frontend
npm run dev
# Mini App: http://localhost:3000
```

### Docker Compose orqali to'liq tizimni ko'tarish (Production):
```bash
docker compose up -d --build
```

---

## 6. Joriy Holat va Keyingi AI Qadami (Next Steps)

* **Hozirgi holat:** CRM/ERP platformasining barcha backend, frontend, matching va deploy modullari muvaffaqiyatli qurildi va build qilindi.
* **Keyingi qadamlar (Opsional):**
  * Haqiqiy Telegram Bot tokeni va Eskiz.uz hisobini `.env` ga biriktirib, jonli serverda yoki ngrok orqali Telegramda sinovdan o'tkazish.
  * Haqiqiy PostgreSQL bazasiga `npx prisma migrate dev` ni amalga oshirish.

