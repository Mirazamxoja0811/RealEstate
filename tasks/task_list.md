# Bajariladigan Vazifalar Ro'yxati (Task List)

> **Hujjat:** tasks/task_list.md  
> **Status:** Tasdiqlangan / Bosqichma-bosqich bajarish uchun  
> **Metodologiya:** Docs -> Task -> Info -> Handoff

---

## 📌 Metodologiya Qoidasi
1. Har bir task `docs/` dagi tegishli mezonlarga qat'iy asoslanadi.
2. Ish boshlanayotganda `info.md` da joriy task statusi yangilanadi.
3. Task yakunlangach, barcha qilingan o'zgarishlar va keyingi qadamlar `handoff.md` ga batafsil qayd etiladi.
4. Har bir asosiy bosqichdan so'ng kod Git repozitoriyasiga push qilinadi.

---

## 🚀 Bosqichlar (Phases)

### ✅ FAZA 1: Arxitektura, TZ va Loyiha Pervichka Sozlamalari
- [x] **Task 1.1:** Loyihaning 20x kengaytirilgan Texnik Topshirig'i (TZ) va Tizim Arxitekturasini ishlab chiqish (`docs/01_system_architecture_tz.md`).
- [x] **Task 1.2:** PostgreSQL va Prisma ORM ma'lumotlar bazasi sxemasini loyihalash (`docs/02_database_schema.md`).
- [x] **Task 1.3:** Smart Matching algoritmi va xabarnomalar mexanizmini hujjatlashtirish (`docs/03_smart_matching_engine.md`).
- [x] **Task 1.4:** Telegram Mini App UI/UX oqimi va ekranlarini loyihalash (`docs/04_telegram_mini_app_ui_ux.md`).
- [x] **Task 1.5:** Cloud Deploy (Docker, Nginx) va xavfsizlik arxitekturasini loyihalash (`docs/05_cloud_deploy_security.md`).
- [x] **Task 1.6:** Loyiha papkalar strukturasini tashkil etish (`backend/`, `frontend/`, `docs/`, `tasks/`).
- [x] **Task 1.7:** Git repozitoriyasini ishga tushirish, `.gitignore` va boshlang'ich commitni amalga oshirish.

---

### ⚙️ FAZA 2: Backend Core & Multi-Tenant Baza Infratuzilmasi
- [ ] **Task 2.1:** Backend loyihasini initsializatsiya qilish (Node.js, TypeScript, Express/NestJS skeleti).
- [ ] **Task 2.2:** Prisma ORM ni o'rnatish va `schema.prisma` ni amaliy joriy etish.
- [ ] **Task 2.3:** Autentifikatsiya moduli: JWT Auth + Telegram `initData` tekshiruvi (HMAC-SHA256).
- [ ] **Task 2.4:** RBAC (Role-Based Access Control) va Multi-tenant middleware (har bir agentlik o'z ma'lumotlar doirasida ishlashi).
- [ ] **Task 2.5:** Audit Log middleware (telefon raqam ko'rilganda, mulk tahrirlanganda avtomatik qayd etish).

---

### 🏢 FAZA 3: Mulklar (Properties) va Mijozlar (Clients) Moduli
- [ ] **Task 3.1:** Mulklar (Property) CRUD API (kategoriya, bitim turi, geolokatsiya, narx, xonalar soni).
- [ ] **Task 3.2:** Rasmlar va media yuklash servisi (Mulklarga bir nechta rasm biriktirish).
- [ ] **Task 3.3:** Mijozlar (Client) CRUD API:
  - Beruvchi (Mulk egalari)
  - Oluvchi (Xaridorlar / Ijarachilar)
- [ ] **Task 3.4:** Oluvchilar uchun qidiruv talablari (ClientPreferences) kiritish va saqlash API.
- [ ] **Task 3.5:** Telefon raqamini maxfiylashtirish (Phone Masking) logikasi.

---

### 🧠 FAZA 4: Smart Matching Engine & Xabarnomalar (SMS + Telegram)
- [ ] **Task 4.1:** Smart Matching scoring algoritmini kodda realizatsiya qilish (Vaznli formula bo'yicha moslik foizi).
- [ ] **Task 4.2:** Redis va BullMQ navbat tizimini integratsiya qilish:
  - Yangi mulk kiritilganda barcha xaridorlarni skaner qilish (Reverse Matching).
  - Yangi xaridor kiritilganda bazadagi uylarni tekshirish (Forward Matching).
- [ ] **Task 4.3:** Xabarnomalar moduli:
  - Eskiz.uz SMS provayderi integratsiyasi.
  - Telegram Bot integratsiyasi (Telegraf / Grammy).
- [ ] **Task 4.4:** Anti-spam va Tungi jimlik (Quiet Hours) mexanizmini ishga tushirish.

---

### 📱 FAZA 5: Telegram Mini App & Rieltor Web Interfeysi (Frontend)
- [ ] **Task 5.1:** Frontend loyihasini initsializatsiya qilish (Vite + React + TypeScript + Tailwind CSS).
- [ ] **Task 5.2:** Telegram WebApp SDK integratsiyasi (MainButton, BackButton, HapticFeedback, ThemeParams).
- [ ] **Task 5.3:** Rieltor Katalogi sahifasi (Uylarni filtrlar bilan ko'rish, qidirish).
- [ ] **Task 5.4:** Mulk kartasi sahifasi (Mijozga taqdim etiladigan rasmli, xaritali chiroyli interfeys).
- [ ] **Task 5.5:** Rieltor uchun "Yangi Mulk qo'shish" va "Yangi Xaridor kiritish" soddalashtirilgan wizard formalari.
- [ ] **Task 5.6:** Smart Matching natijalari ekrani (Xaridorga 1 bosishda mos uylarni ko'rsatish).

---

### 🛡️ FAZA 6: Cloud Deploy, Xavfsizlik Sinovlari va Yakuniy Audit
- [ ] **Task 6.1:** Dockerfile (Frontend & Backend) va `docker-compose.yml` ni sozlash.
- [ ] **Task 6.2:** Nginx SSL konfiguratsiyasi va Reverse Proxy.
- [ ] **Task 6.3:** Xavfsizlik auditi: Rate Limiting, CORS, SQL Injection / XSS himoyasi testlari.
- [ ] **Task 6.4:** End-to-End integratsiya testlari (Mulk qo'shish -> Matching ishlashi -> SMS navbatga tushishi).
