# RealEstate CRM & ERP System — Texnik Topshiriq (TZ) va Tizim Arxitekturasi

> **Hujjat versiyasi:** 1.0.0  
> **Status:** Tasdiqlangan / Ishlab chiqish bosqichida  
> **Muallif / Arxitektor:** 30 yillik tajribaga ega Bosh Tizim Arxitektori (Chief System Architect)  
> **Loyiha maqsadi:** Ko'chmas mulk agentliklari (Rieltorlar) uchun ixtisoslashgan, Telegram Mini App bilan integratsiyalashgan, avtomatlashtirilgan Smart Matching va SMS/Telegram xabarnomalariga ega Multi-tenant CRM/ERP platformasi.

---

## 1. Loyiha Missiyasi va Muammo Bayoni

### 1.1. Mavjud Muammo
Bugungi kunda ko'chmas mulk bozorida faoliyat yurituvchi rieltorlarning 85%+ qismi:
* Mijozlar va mulklar bazasini oddiy daftarlarda, Excel yoki umumiy Telegram guruhlarida yuritadi.
* Oluvchi (xaridor/ijarachi) talablari va Beruvchi (mulk egasi) takliflari o'rtasidagi aloqa inson xotirasiga bog'liq.
* Agar xaridor kelgan paytda unga mos uy bo'lmasa, mijoz ketadi va 3-5 kundan keyin mos uy paydo bo'lganda rieltor bu mijozni esdan chiqaradi yoki topa olmaydi.
* Rieltorlarda mijozga tezda chiroyli ko'rinishda ko'rsatish uchun shaxsiy katalog (Mini App) mavjud emas.

### 1.2. Yechim
Yagona, xavfsiz, bulutda (Cloud) ishlovchi Multi-tenant CRM + ERP ekotizimi:
1. **Telegram Mini App (Web App):** Rieltorlar va mijozlar uchun qulay, tezkor, o'rnatish talab qilmaydigan mobil interfeys.
2. **Katalog & Portfel boshqaruvi:** Har bir rieltor yoki agentlik o'zining shaxsiy brendi ostida mini-katalogga ega bo'ladi.
3. **Smart Matching Engine (Aqlli moslashtirish dvigateli):** Mulk bazaga kiritilgan zahoti avval talab qoldirgan barcha mos xaridorlarni soniyalar ichida aniqlaydi.
4. **Avtomatlashtirilgan xabarnomalar (SMS & Telegram Bot):** Mos uy topilganda xaridorga inson omilisiz zudlik bilan avtomatik SMS/Telegram xabari yetkaziladi.
5. **Agentlik ERP & Filiallar tizimi:** Filiallar, rieltorlar o'rtasida rollar (Admin, Agent, Rieltor), tahliliy dashbordlar, komissiyalar va audit jurnali.

---

## 2. Foydalanuvchi Rollari va Ruxsatlar Tizimi (RBAC)

Tizim ko'p pog'onali rollarga ega:

| Rol | Qamrov | Ruxsatlar |
| :--- | :--- | :--- |
| **Super Admin** | Butun tizim | Barcha agentliklarni boshqarish, obuna (SaaS/Billing), global audit, server monitoring. |
| **Agency Owner / Director** | Bitta Agentlik (Tenant) | Filiallar ochish, rieltorlarni ishga olish/bo'shatish, barcha bitimlar va tushumlarni ko'rish, API kalitlar (SMS, Telegram bot). |
| **Branch Manager** | Muayyan Filial | Filial rieltorlari faoliyati, filiali mulklari va mijozlar nazorati, statistikalar. |
| **Realtor (Agent)** | Shaxsiy portfel | O'ziga biriktirilgan mijozlar, kiritgan mulklari, shaxsiy Telegram Mini App katalogi, shaxsiy bildirishnomalar. |
| **Client: Buyer (Oluvchi)** | Mijoz profili | Telegram Mini App orqali katalog ko'rish, o'z talablarini (filtrlar) qoldirish, mos uylar bo'yicha takliflar olish. |
| **Client: Seller (Beruvchi)** | Mijoz profili | O'z mulkini rieltorga topshirish, holatini (sotildi/ijaraga berildi) ko'rish. |

---

## 3. Asosiy Funksional Modullar

### 3.1. Mulklar Boshqaruvi Moduli (Property Management)
* **Kategoriya:** Kvartira, Hovli/Uchastka, Tijorat mulki, Yer uchastkasi, Yangi bino (Novostroyka).
* **Bitim turi:** Sotuv (Sale) yoki Ijara (Rent - uzoq muddatli / sutkalik).
* **Atributlar:**
  * Narx va valyuta (UZS / USD), savdolashish (torg) imkoniyati.
  * Xonalar soni, qavat, umumiy qavatlar, maydoni ($m^2$), qurilgan yili.
  * Manzil: Viloyat, tuman, mahalla, ko'cha, uy raqami, aniq Geolocation (kenglik, uzunlik), yaqin metro/mo'ljal.
  * Holati: Ta'mir darajasi (Yevro, O'rtacha, Qora suvoq, Ta'mirtalab), jihozlanganlik (mebel, texnika, konditsioner).
  * Media: Sifatli rasmlar (CDN orqali), video-obzor linki, kadastr hujjatlari holati.
* **Mulk statuslari:** Qoralama (Draft) -> Faol (Active) -> Bron qilingan (Reserved) -> Bitim amalga oshdi (Closed) -> Arxiv (Archived).

### 3.2. Mijozlar Boshqaruvi Moduli (Clients & Leads)
* **Oluvchi (Buyer/Tenant):**
  * Shaxsiy ma'lumotlar: Ism, telefon, Telegram ID, manba (qayerdan keldi).
  * Talab profili (Preference Criteria): Bitim turi, shahar/tuman, xonalar soni (masalan: 2-3 xona), byudjet oralig'i (masalan: $40,000 - $55,000), ta'mir talabi, to'lov turi (naqd, ipoteka, bo'lib to'lash).
  * Lead statusi: Yangi (New) -> Aloqada (Contacted) -> Ko'rishga chiqdi (Showing) -> Muzokara (Negotiation) -> Muvaffaqiyatli (Won) / Rad etildi (Lost).
* **Beruvchi (Seller/Landlord):**
  * Mulk egasining aloqa ma'lumotlari, egalik huquqi tasdiqlanganligi, komissiya shartnomasi foizi yoki summasi.

### 3.3. Smart Matching Engine (Aqlli Moslashtirish)
* Ikki tomonlama (Bidirectional) matching:
  1. **Yangi xaridor kiritilganda:** Bazadagi mavjud faol mulklar orasidan talablarga mos keladiganlarini bir zumda chiqarib berish (Score: 100%, 90%, 80%).
  2. **Yangi mulk kiritilganda yoki narxi pasayganda (Reverse Matching):** O'tmishda talab qoldirgan, lekin hali uy olmagan barcha mos mijozlarni filtrlab topish.
* **Avtomatik Alert Triggers:** Moslik foizi chegaradan oshganda (masalan, Score >= 85%), tizim darhol fon rejimida navbatga (Queue) vazifa qo'yadi.

### 3.4. Xabarnomalar va Integratsiya Moduli (Notification Gateway)
* **Telegram Bot & Webhook:** Rieltorga va mijozga yangi taklif havolasini yuborish.
* **SMS Gateway:** O'zbekiston provayderlari (Eskiz.uz, PlayMobile) uchun integratsiya adapteri.
* **Katalog WebApp Link:** Xabarnomada to'g'ridan-to'g'ri Telegram Mini App dagi mulk kartasiga olib boruvchi havola (`t.me/realtor_bot?startapp=prop_12345`).

### 3.5. Filiallar va ERP Dashbord (Analytics & Audit)
* **Audit Log (Tizim kuzatuvi):** Kim, qachon, qaysi mulkni yoki mijozni tahrirladi, telefon raqamini ko'rdi yoki o'chirdi. Hech bir ma'lumot izsiz yo'qolmaydi.
* **KPI & Analitika:** Rieltorlar bo'yicha ko'rsatilgan uylar soni, amalga oshirilgan bitimlar, o'rtacha chek, agentlik tushumi.
* **Eksport & Hisobot:** Excel/PDF formatida hisobotlar olish.

---

## 4. Texnologiyalar Steki (Tech Stack)

Audiodagi talab: **Front bilan Backend bir-biriga aralashib ketmasligi, alohida va toza arxitekturada bo'lishi lozim.**

```
                                  +----------------------------+
                                  |     Clients & Realtors     |
                                  | (Telegram Mini App / Web)  |
                                  +--------------+-------------+
                                                 | HTTPS / WSS
                                                 v
                                  +----------------------------+
                                  |     Nginx Reverse Proxy    |
                                  |   (SSL, Rate Limit, WAF)   |
                                  +--------------+-------------+
                                                 |
                       +-------------------------+-------------------------+
                       |                                                   |
                       v                                                   v
         +----------------------------+                      +----------------------------+
         |     Frontend Service       |                      |      Backend API Core      |
         |  React + Vite + Tailwind   |                      |  Node.js (NestJS/Express)  |
         | Telegram WebApp SDK + UI   |                      | REST API + Swagger + Auth  |
         +----------------------------+                      +--------------+-------------+
                                                                            |
                                               +----------------------------+----------------------------+
                                               |                            |                            |
                                               v                            v                            v
                                  +-------------------------+  +-------------------------+  +-------------------------+
                                  |   PostgreSQL Database   |  |      Redis Cluster      |  |   Background Worker     |
                                  | (Relational + PostGIS)  |  |  (Cache, Queue, Lock)   |  |   (Matching Engine)     |
                                  +-------------------------+  +-------------------------+  +-------------------------+
                                                                                                         |
                                                                            +----------------------------+
                                                                            |
                                                                            v
                                                              +----------------------------+
                                                              |  SMS (Eskiz) & TG Gateway  |
                                                              +----------------------------+
```

### 4.1. Backend
* **Asosiy Platforma:** Node.js (TypeScript) + Express / NestJS arxitekturasi.
* **Ma'lumotlar bazasi:** PostgreSQL 16+ (Geolokatsiya qidiruvlari uchun PostGIS kengaytmasi bilan).
* **ORM:** Prisma ORM (Type-safe, migratsiyalar, tezkor so'rovlar).
* **Kesh va Navbatlar:** Redis + BullMQ (Smart Matching va SMS yuborish asinxron navbatlari uchun).
* **Autentifikatsiya:** JWT (JSON Web Tokens) + Telegram `initData` kriptografik tekshiruvi (HMAC-SHA256).

### 4.2. Frontend & Telegram Mini App
* **Freymvork:** React.js 18+ (Vite, TypeScript).
* **UI/UX Dizayn:** Tailwind CSS + Shadcn UI (Mobile-first dizayn, Telegram WebApp dizayn yo'riqnomasiga 100% mos).
* **Telegram SDK:** `@twa-dev/sdk` (Haptic feedback, MainButton, BackButton, themeParams qo'llab-quvvatlashi).
* **State Management:** TanStack React Query (server kesh va tezkor yuklanish) + Zustand.

### 4.3. DevOps, Bulut & Xavfsizlik
* **Konteynerlashtirish:** Docker & Docker Compose (Ishlab chiqish va ishlab chiqarish uchun yagona muhit).
* **Veb-server:** Nginx (Reverse Proxy, SSL Let's Encrypt, Gzip/Brotli, HTTP/2).
* **Monitoring:** Winston logger + Healthcheck endpoints.

---

## 5. Nofunksional Talablar (Non-Functional Requirements)

1. **Xavfsizlik (Security):**
   * Barcha mijoz telefon raqamlari ruxsatsiz agentlardan yashiriladi (faqat biriktirilgan rieltor yoki admin to'liq ko'radi).
   * Har bir API endpointida Rate Limiting mavjud (Brute-force va DDoS dan himoya).
   * CORS va Helmet siyosati qat'iy sozlangan.
2. **Tezlik va Hosildorlik (Performance):**
   * Telegram Mini App birinchi yuklanishi < 1.5 soniya.
   * Smart Matching 10,000 ta ob'ekt ichidan < 200 ms da eng moslarini topishi kerak.
3. **Masshtablanuvchanlik (Scalability):**
   * Multi-tenancy: Bitta serverda bir nechta alohida agentliklar (tenantlar) o'zaro ma'lumotlari aralashmagan holda ishlaydi.
   * $500 lik bitta VPS serverda 50+ agentlik va 1,000+ rieltorni bemalol ko'tarish imkoniyati.
