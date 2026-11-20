# Telegram Mini App (Web App) UI/UX va Interfeys Dizayni

> **Hujjat:** docs/04_telegram_mini_app_ui_ux.md  
> **Texnologiya:** React + Vite + Tailwind CSS + Telegram WebApp SDK (`@twa-dev/sdk`)

---

## 1. Telegram Mini App Maqsadi va Rollari

Audioda ta'kidlangan talab:
> *"Har bitta rieltorga o'zining deyarli vebsayt mini-appini qilib berishingiz kerak. Rieltor yoniga mijoz kelganda: 'Mana, mana bu yerda menyuni ko'r, katalogni ko'r' deb ko'rsata olishi kerak."*

Mini App 2 xil rejimda (View Mode) ishlaydi:
1. **Realtor Pro Mode (Rieltor Ishchi Rejimi):** Telegram orqali ro'yxatdan o'tgan yoki tizimga kirgan agent uchun — yangi uy kiritish, yangi xaridor qo'shish, o'z katalogini boshqarish, matching natijalarini ko'rish.
2. **Client Catalog Mode (Mijoz Rejimi):** Mijoz botga kirganda yoki SMS dagi havola orqali ochganda — fotosuratlar, interaktiv xarita, filtrlash va bevosita rieltor bilan bog'lanish tugmasi.

---

## 2. Foydalanuvchi Oqimlari (User Flows)

### 2.1. Oqim 1: Rieltor Yangi Mulk Kiritishi (Mulk egasi kelganda)
1. Rieltor Mini App ni ochadi -> `+ Yangi Mulk` tugmasini bosadi.
2. **1-qadam (Asosiy parametrlar):** Bitim turi (Sotuv / Ijara), Mulk turi (Kvartira, Hovli va h.k.), Xonalar soni, Narxi (USD/UZS).
3. **2-qadam (Manzil va Xarita):** Shahar, tuman, uy raqami, xaritada joylashuvni belgilash (Geotag) yoki "Hozirgi joylashuvimni olish" tugmasi.
4. **3-qadam (Media va Tavsif):** Telefoni galereyasidan 5-15 ta rasm tanlash, audio yoki matnli qisqa izoh, mulk egasining telefon raqami (ichki maxfiy).
5. **Saqlash:** Saqlash tugmasi bosilishi bilan mulk bazaga tushadi va fonda Smart Matching boshlanadi.

### 2.2. Oqim 2: Rieltor Yangi Xaridor Kiritishi (Oluvchi kelganda)
1. Rieltor `+ Yangi Xaridor` tugmasini bosadi.
2. Xaridor ismi va telefon raqamini kiritadi.
3. Xaridor talablari tanlanadi:
   * Masalan: *Toshkent sh., Chilonzor tumani, 2 yoki 3 xonali, byudjet $45,000 - $55,000*.
4. `Mos uylarni qidirish` tugmasi bosiladi.
5. **Natija:** Tizim zudlik bilan shu talabga 85%+ mos keladigan 4 ta faol uyni chiqaradi. Rieltor shu zahoti xaridorga telefon ekranida uylarni ko'rsatadi.
6. Agar hozircha mos uy bo'lmasa, talab saqlanadi va: *"Mijoz talabi saqlandi. Yangi mos uy paydo bo'lganda avtomatik SMS yuboriladi"* xabari chiqadi.

### 2.3. Oqim 3: Mijoz Katalog Havolasini Ochishi (`startapp=p_{id}`)
1. Mijozga SMS keladi: *"Sizga mos yangi 3 xonali uy topildi: https://t.me/realtor_bot?startapp=p_987"*.
2. Mijoz havolani bosadi -> Telegram avtomatik tarzda silliq animatsiya bilan Mini App oynasini ochadi.
3. **Ekran:**
   * Mulk rasmlari (Swiper/Carousel slayd).
   * Narxi, xonalar soni, qavat, maydoni.
   * Xarita va atrofidagi infratuzilma (metro, maktab, bog'cha).
   * Telegram pastki panelida katta asosiy tugma (**MainButton**): `Rieltorga qo'ng'iroq qilish` yoki `Telegramda yozish`.

---

## 3. Dizayn Tizimi va UI Komponentlari

Telegram ekotizimida begona tuyulmasligi uchun quyidagi dizayn qoidalariga amal qilinadi:

* **Mavzu (Theme Integration):**
  * Telegram dasturining yorug' (Light) yoki qorong'i (Dark) mavzusiga avtomatik moslashadi (`window.Telegram.WebApp.themeParams`).
* **Haptik Teskari Aloqa (Haptic Feedback):**
  * Har bir muhim harakatda (saqlash, tugmani bosish, xabar yuborishda) telefon titraydi (`impactOccurred('medium')` yoki `notificationOccurred('success')`).
* **Navigatsiya:**
  * Telegram `BackButton` faol boshqariladi (ichki sahifalardan orqaga qaytish oson).
  * `MainButton` eng muhim harakatlar (Masalan: "Mulkni saqlash", "Qidiruvni boshlash") uchun doim ekranning pastki qismida turadi.

---

## 4. Mini App Sahifalar Xaritasi (Sitemap)

```text
Mini App Root
│
├── /catalog (Umumiy Mulklar Ro'yxati / Katalog)
│   ├── ?filter=sale|rent&rooms=2,3&price_max=50000
│   └── /property/:id (Mulkning to'liq kartasi)
│
├── /realtor (Rieltor Shaxsiy Kabineti)
│   ├── /properties/new (Yangi uy qo'shish formasi)
│   ├── /clients/new (Yangi xaridor qo'shish va Matching)
│   ├── /clients/:id (Xaridor kartasi va unga mos chiqqan uylar)
│   └── /analytics (Mening ko'rsatkichlarim: faol uylar, bitimlar)
│
└── /settings (Profil va Bildirishnomalar sozlamalari)
```
