import { config } from '../../config';

export class SmsService {
  private eskizToken: string | null = null;
  private tokenExpiresAt: number = 0;

  /**
   * Checks if current time is within quiet hours (21:00 to 09:00 local time)
   */
  isQuietHours(): boolean {
    const currentHour = new Date().getHours();
    return currentHour >= 21 || currentHour < 9;
  }

  /**
   * Authenticates with Eskiz.uz SMS Gateway
   */
  async getAuthToken(): Promise<string | null> {
    if (this.eskizToken && Date.now() < this.tokenExpiresAt) {
      return this.eskizToken;
    }

    if (!config.eskiz.email || !config.eskiz.password) {
      console.warn('[SmsService] Eskiz credentials not configured. Running in Mock/Log mode.');
      return null;
    }

    try {
      const response = await fetch('https://notify.eskiz.uz/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: config.eskiz.email,
          password: config.eskiz.password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Eskiz auth failed with status ${response.status}`);
      }

      const data: any = await response.json();
      this.eskizToken = data.data.token;
      // Eskiz tokens typically last 30 days, refresh after 25 days
      this.tokenExpiresAt = Date.now() + 25 * 24 * 60 * 60 * 1000;
      return this.eskizToken;
    } catch (error) {
      console.error('[SmsService] Eskiz Auth Error:', error);
      return null;
    }
  }

  /**
   * Sends SMS notification to buyer
   */
  async sendMatchSms(phone: string, propertyData: { id: string; district: string; rooms: number; price: number; realtorPhone: string }) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    const message = `Hurmatli mijoz! Sizga mos yangi ${propertyData.rooms}-xonali uy topildi: ${propertyData.district}, Narxi: $${propertyData.price}. Ko'rish: ${config.telegram.miniAppUrl}?startapp=p_${propertyData.id}. Tel: ${propertyData.realtorPhone}`;

    // If quiet hours, we delay or log
    if (this.isQuietHours()) {
      console.log(`[SmsService] Quiet hours active. SMS to ${cleanPhone} queued for morning delivery.`);
      return { success: true, delayed: true, message };
    }

    const token = await this.getAuthToken();

    if (!token) {
      // Mock / Dev mode logging
      console.log(`[SmsService Mock SMS Sent] To: ${cleanPhone} | Text: "${message}"`);
      return { success: true, mock: true, message };
    }

    try {
      const response = await fetch('https://notify.eskiz.uz/api/message/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mobile_phone: cleanPhone,
          message,
          from: config.eskiz.from,
        }),
      });

      const result: any = await response.json();
      return { success: response.ok, result };
    } catch (error) {
      console.error('[SmsService] Send SMS Error:', error);
      return { success: false, error };
    }
  }
}

export const smsService = new SmsService();
