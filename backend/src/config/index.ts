import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/realestate_crm?schema=public',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwt: {
    secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production-min-32-chars',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    botUsername: process.env.TELEGRAM_BOT_USERNAME || 'realtor_crm_bot',
    miniAppUrl: process.env.TELEGRAM_MINI_APP_URL || '',
  },
  eskiz: {
    email: process.env.ESKIZ_EMAIL || '',
    password: process.env.ESKIZ_PASSWORD || '',
    from: process.env.ESKIZ_FROM || '4546',
  },
};
