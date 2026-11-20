# Joriy Holat va Faol Vazifalar Ma'lumotnomasi (info.md)

> **Loyiha:** RealEstate CRM & ERP (Telegram Mini App + Smart Matching)  
> **Oxirgi yangilanish:** 2026-11-21  
> **Joriy Status:** Faza 1 (Arxitektura & Skelet) yakunlanmoqda, Faza 2 ga tayyorgarlik

---

## 📌 Hozirda qilinayotgan ish (Active Task)
* **Joriy Faol Vazifa:** `Faza 2: Backend Core & Multi-Tenant Baza Infratuzilmasi` (Task 2.1 va 2.2).
* **Maqsad:** `backend/` papkasida TypeScript + Express/NestJS loyihasini o'rnatish, Prisma ORM ni sozlash va `schema.prisma` ni joylashtirish.

---

## 🔍 Hujjatlar Xaritasi
* **Arxitektura va TZ:** `docs/01_system_architecture_tz.md`
* **Ma'lumotlar bazasi (Prisma):** `docs/02_database_schema.md`
* **Smart Matching algoritmi:** `docs/03_smart_matching_engine.md`
* **Telegram Mini App UI/UX:** `docs/04_telegram_mini_app_ui_ux.md`
* **Deploy va Xavfsizlik:** `docs/05_cloud_deploy_security.md`
* **Bajariladigan ishlar ro'yxati:** `tasks/task_list.md`
* **Uzluksiz xotira (Handoff):** `handoff.md`

---

## ⚡ Qisqa muddatli keyingi qadamlar
1. `backend/` papkasida `package.json`, `tsconfig.json` va asosiy bog'liqliklarni (Prisma, Express, TypeScript, ts-node-dev) sozlash.
2. `prisma/schema.prisma` ni yaratish va bazaga ulanish tayyorgarligi.
3. Backend xizmatining start scriptlarini sinash.
