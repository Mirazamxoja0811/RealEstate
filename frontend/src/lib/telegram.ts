declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

export const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined;

export function initTelegram() {
  if (tg) {
    tg.ready();
    tg.expand();
  }
}

export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'light') {
  if (tg?.HapticFeedback) {
    if (type === 'success' || type === 'warning') {
      tg.HapticFeedback.notificationOccurred(type);
    } else {
      tg.HapticFeedback.impactOccurred(type);
    }
  }
}

export function setMainButton(text: string, onClick: () => void, isVisible = true) {
  if (!tg?.MainButton) return;
  if (isVisible) {
    tg.MainButton.setText(text);
    tg.MainButton.onClick(onClick);
    tg.MainButton.show();
  } else {
    tg.MainButton.hide();
  }
}

export function hideMainButton() {
  if (tg?.MainButton) {
    tg.MainButton.hide();
  }
}
