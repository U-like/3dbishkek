import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { cookieStorage } from '@/lib/cookieStorage';

const CONSENT_KEY = 'cookie-consent';
const STORE_COOKIE_KEY = 'marketplace-store-v1';

const getDecision = (): 'granted' | 'denied' | null => {
  if (typeof window === 'undefined') return null;
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    if (v === 'granted' || v === 'denied') return v;
    return null;
  } catch (err) {
    console.warn('Failed to read consent from localStorage:', err);
    return null;
  }
};

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const decision = getDecision();
    if (!decision) {
      setVisible(true);
    }
  }, []);

  const accept = useCallback(() => {
    try {
      localStorage.setItem(CONSENT_KEY, 'granted');
    } catch (err) {
      console.warn('Failed to write consent to localStorage:', err);
    }
    setVisible(false);
    // Force a persist write after granting consent
    try {
      // Trigger a no-op state update to make persist write current state
      useAppStore.setState((s) => ({ ...s }));
    } catch (err) {
      console.warn('Failed to trigger persist after consent:', err);
    }
    // Optionally, dispatch a custom event for other parts of app
    try {
      window.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: 'granted' }));
    } catch (err) {
      console.warn('Failed to dispatch consent event:', err);
    }
  }, []);

  const decline = useCallback(() => {
    try {
      localStorage.setItem(CONSENT_KEY, 'denied');
    } catch (err) {
      console.warn('Failed to write decline to localStorage:', err);
    }
    setVisible(false);
    // Ensure nothing remains in storage
    try {
      // Remove persisted cookie data if any
      cookieStorage.removeItem(STORE_COOKIE_KEY);
    } catch (err) {
      console.warn('Failed to remove persisted cookie:', err);
    }
    try {
      window.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: 'denied' }));
    } catch (err) {
      console.warn('Failed to dispatch consent event:', err);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-[100]">
      <div className="max-w-lg ml-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border rounded-lg shadow-lg p-4 space-y-3">
        <div className="space-y-1">
          <h4 className="font-semibold">Мы используем cookie</h4>
          <p className="text-sm text-muted-foreground">
            Мы используем cookie только для сохранения корзины и избранного. Нажимая «Принять», вы соглашаетесь на хранение этих данных в cookie браузера.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={decline}>
            Отклонить
          </Button>
          <Button onClick={accept}>
            Принять
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsentBanner;