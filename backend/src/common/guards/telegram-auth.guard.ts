import * as crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { config } from '../../config';

export interface TelegramUserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface ParsedInitData {
  query_id?: string;
  user?: TelegramUserData;
  auth_date: number;
  hash: string;
  start_param?: string;
}

/**
 * Validates the cryptographically signed `initData` string from Telegram Mini App.
 * Returns the parsed user object if authentic, or null if invalid/expired.
 */
export function verifyTelegramInitData(
  initData: string,
  botToken: string = config.telegram.botToken,
  maxAgeSeconds: number = 86400 // 24 hours
): ParsedInitData | null {
  if (!initData || !botToken) {
    return null;
  }

  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    if (!hash) return null;

    urlParams.delete('hash');

    // Sort all remaining parameters alphabetically
    const entries = Array.from(urlParams.entries());
    entries.sort(([a], [b]) => a.localeCompare(b));

    const dataCheckString = entries.map(([key, value]) => `${key}=${value}`).join('\n');

    // secretKey = HMAC_SHA256("WebAppData", botToken)
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // calculatedHash = HMAC_SHA256(secretKey, dataCheckString)
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) {
      return null;
    }

    const authDateStr = urlParams.get('auth_date');
    const authDate = authDateStr ? parseInt(authDateStr, 10) : 0;
    const now = Math.floor(Date.now() / 1000);

    // Check expiration
    if (now - authDate > maxAgeSeconds) {
      return null;
    }

    const userStr = urlParams.get('user');
    const user = userStr ? JSON.parse(userStr) : undefined;

    return {
      query_id: urlParams.get('query_id') || undefined,
      user,
      auth_date: authDate,
      hash,
      start_param: urlParams.get('start_param') || undefined,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Express Middleware to require and verify Telegram Mini App initData
 */
export function telegramAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const initData = req.headers['x-telegram-init-data'] as string;

  if (!initData) {
    res.status(401).json({ success: false, message: 'Telegram initData required' });
    return;
  }

  const verified = verifyTelegramInitData(initData);
  if (!verified || !verified.user) {
    res.status(401).json({ success: false, message: 'Invalid or expired Telegram signature' });
    return;
  }

  (req as any).telegramUser = verified.user;
  (req as any).telegramStartParam = verified.start_param;
  next();
}
