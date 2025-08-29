import type { StateStorage } from 'zustand/middleware';

// Keys
const CONSENT_KEY = 'cookie-consent';

// Determine consent
const hasCookieConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(CONSENT_KEY) === 'granted';
  } catch {
    return false;
  }
};

// Cookie helpers
const setCookie = (key: string, value: string, days = 180) => {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? '; Secure'
      : '';
  document.cookie = `${key}=${encodeURIComponent(
    value
  )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secure}`;
};

const getCookie = (key: string): string | null => {
  if (typeof document === 'undefined') return null;
  const name = `${key}=`;
  const parts = document.cookie.split(';');
  for (const part of parts) {
    const cookie = part.trim();
    if (cookie.startsWith(name)) {
      const raw = cookie.substring(name.length);
      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    }
  }
  return null;
};

const removeCookie = (key: string) => {
  if (typeof document === 'undefined') return;
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? '; Secure'
      : '';
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax${secure}`;
};

// LocalStorage helpers (fallback before consent)
const getLS = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};
const setLS = (key: string, value: string) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore quota errors
  }
};
const removeLS = (key: string) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch { /* ignore */ }
};

// Unified storage that persists pre-consent to localStorage and post-consent to cookies
export const cookieStorage: StateStorage = {
  getItem: (key: string) => {
    if (hasCookieConsent()) {
      return getCookie(key);
    }
    return getLS(key);
  },

  setItem: (key: string, value: string) => {
    if (hasCookieConsent()) {
      setCookie(key, value);
      // Ensure any LS shadow is removed to avoid divergence
      removeLS(key);
    } else {
      setLS(key, value);
    }
  },

  removeItem: (key: string) => {
    removeCookie(key);
    removeLS(key);
  },
};

// Optional migration on consent change
if (typeof window !== 'undefined') {
  try {
    window.addEventListener('cookie-consent-changed', (ev: Event) => {
      const e = ev as CustomEvent<'granted' | 'denied'>;
      if (e?.detail === 'granted') {
        // Move any existing LS values to cookies
        const STORE_KEY = 'marketplace-store-v1';
        const v = getLS(STORE_KEY);
        if (v != null) {
          setCookie(STORE_KEY, v);
          removeLS(STORE_KEY);
        }
      } else if (e?.detail === 'denied') {
        // Clean cookies
        const STORE_KEY = 'marketplace-store-v1';
        removeCookie(STORE_KEY);
      }
    });
  } catch {
    // no-op
  }
}