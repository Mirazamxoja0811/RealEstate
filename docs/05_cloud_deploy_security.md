# Cloud Deployment, Xavfsizlik va Masshtablanish Arxitekturasi

> **Hujjat:** docs/05_cloud_deploy_security.md  
> **Infratuzilma:** Docker Compose / Production Kubernetes Ready / Nginx SSL

---

## 1. Bulut Infratuzilmasi va Server Hisob-kitobi

Audiodagi biznes hisob-kitob:
> *"10 kishiga $200 dan sotsangiz $2000 bo'ladi. $500 lik bitta server olasizda, bitta deploy qilib qo'ysangiz, 500 dollarlik server hammasini ko'taradi."*

### Server Konfiguratsiyasi (Tavsiya etilgan: Hetzner / DigitalOcean / AWS):
* **CPU:** 16 vCPU
* **RAM:** 32 GB – 64 GB
* **Storage:** 500 GB NVMe SSD (Tezkor o'qish/yozish)
* **Tarmoq:** 1 Gbit/s cheksiz trafik
* **Narxi:** Oylik taxminan $150 – $350 (juda baquvvat resurs, 50+ agentlik va 2,000+ faol rieltorni bemalol ko'taradi).

---

## 2. Docker Compose Arxitekturasi (Production Stack)

Tizim konteynerlar orqali to'liq izolyatsiya qilingan holda ishlaydi:

```yaml
version: '3.8'

services:
  # 1. Reverse Proxy & SSL Terminating
  nginx:
    image: nginx:alpine
    container_name: realestate_nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/ssl:/etc/nginx/ssl
      - ./frontend/dist:/var/www/frontend:ro
      - ./uploads:/var/www/uploads:ro
    depends_on:
      - backend

  # 2. Asosiy Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: realestate_api
    restart: always
    environment:
      - NODE_ENV=production
      - PORT=4000
      - DATABASE_URL=postgresql://crm_user:${DB_PASSWORD}@postgres:5432/realestate_crm?schema=public
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - ESKIZ_EMAIL=${ESKIZ_EMAIL}
      - ESKIZ_PASSWORD=${ESKIZ_PASSWORD}
    volumes:
      - ./uploads:/app/uploads
    depends_on:
      - postgres
      - redis

  # 3. Matching va SMS Navbatlarini Bajaruvchi Worker
  worker:
    build:
      context: ./backend
      dockerfile: Dockerfile.worker
    container_name: realestate_worker
    restart: always
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://crm_user:${DB_PASSWORD}@postgres:5432/realestate_crm?schema=public
      - REDIS_URL=redis://redis:6379
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - ESKIZ_EMAIL=${ESKIZ_EMAIL}
      - ESKIZ_PASSWORD=${ESKIZ_PASSWORD}
    depends_on:
      - postgres
      - redis

  # 4. PostgreSQL Ma'lumotlar Bazasi
  postgres:
    image: postgis/postgis:16-3.4-alpine
    container_name: realestate_db
    restart: always
    environment:
      POSTGRES_USER: crm_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: realestate_crm
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "127.0.0.1:5432:5432"

  # 5. Redis (Kesh & BullMQ Navbatlari)
  redis:
    image: redis:7-alpine
    container_name: realestate_redis
    restart: always
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

---

## 3. Xavfsizlik Arxitekturasi (Security Specifications)

### 3.1. Telegram `initData` Autentifikatsiyasi (HMAC-SHA256)
Telegram Mini App dan kelgan har bir so'rov bot tokenining maxfiy kaliti orqali tekshiriladi:

```typescript
// backend/src/common/guards/telegram-auth.guard.ts
import * as crypto from 'crypto';

export function verifyTelegramWebAppData(initData: string, botToken: string): boolean {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  urlParams.delete('hash');

  const dataCheckString = Array.from(urlParams.entries())
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join('\n');

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  return calculatedHash === hash;
}
```

### 3.2. Rieltorlar o'rtasida Ma'lumotlar Maxfiyligi (Phone Masking)
* **Muammo:** Boshqa rieltorlar mijozning telefonini ko'rib, o'zlari to'g'ridan-to'g'ri bog'lanib, bitimni olib ketmasligi kerak.
* **Yechim:** 
  * Agar rieltor o'sha mulk/mijoz egasi yoki Agentlik Rahbari bo'lmasa, telefon raqami niqoblanadi: `+998 90 *** ** 12`.
  * Agar rieltor "Telefonni ko'rish" tugmasini bossa: Bu harakat darhol `audit_logs` jadvaliga `VIEW_PHONE` amali bilan yoziladi va Agentlik rahbarining monitoringida ko'rinadi.

### 3.3. API Rate Limiting & DDoS Himoyasi
* Har bir IP manzil uchun umumiy so'rovlar chegarasi: 1 daqiqada maksimum 120 ta so'rov.
* SMS yuborish endpointi uchun chegara: 1 daqiqada maksimum 5 ta so'rov.
* Helmet HTTP xavfsizlik sarlavhalari (Content Security Policy, X-Frame-Options).

---

## 4. CI/CD Avtomatlashtirish (GitHub Actions)

Kodni GitHub repozitoriyasiga push qilganda avtomatik tekshiruvlar:
1. `Lint & TypeCheck`: TypeScript va ESLint tekshiruvi.
2. `Unit & Integration Tests`: Smart Matching algoritmi testlari.
3. `Docker Build`: Docker imagelari yaratiladi.
4. `Auto-Deploy`: Serverga SSH orqali ulanib, `git pull && docker compose up -d --build` bajariladi.
