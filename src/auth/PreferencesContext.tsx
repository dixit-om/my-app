import type { FC, ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { TextSize, UserPreferences } from '../services/prefsApi';
import { getPreferences, savePreferences } from '../services/prefsApi';
import { useAuth } from './AuthContext';

type PreferencesContextValue = {
  prefs: UserPreferences;
  loaded: boolean;
  updatePreferences: (next: Partial<UserPreferences>) => Promise<void>;
};

const STORAGE_KEY = 'finNotify.preferences';
const DEFAULT_PREFS: UserPreferences = { defaultLanguage: 'en', textSize: 'normal' };

const TEXT_SIZE_CLASS: Record<TextSize, string> = {
  normal: 'fin-text-normal',
  large: 'fin-text-large',
  xlarge: 'fin-text-xlarge',
};

function readStored(): UserPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<UserPreferences>;
    return {
      defaultLanguage: (parsed.defaultLanguage as UserPreferences['defaultLanguage']) || 'en',
      textSize: (parsed.textSize as TextSize) || 'normal',
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

function writeStored(prefs: UserPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

function applyTextSizeClass(size: TextSize) {
  if (typeof document === 'undefined') return;
  const body = document.body;
  Object.values(TEXT_SIZE_CLASS).forEach((c) => body.classList.remove(c));
  body.classList.add(TEXT_SIZE_CLASS[size]);
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export const PreferencesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthed } = useAuth();
  const [prefs, setPrefs] = useState<UserPreferences>(() => readStored());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    applyTextSizeClass(prefs.textSize);
  }, [prefs.textSize]);

  useEffect(() => {
    let active = true;
    if (!isAuthed) {
      setLoaded(true);
      return () => {
        active = false;
      };
    }
    (async () => {
      try {
        const remote = await getPreferences();
        if (!active) return;
        setPrefs(remote);
        writeStored(remote);
      } catch {
        // keep local prefs
      } finally {
        if (active) setLoaded(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [isAuthed]);

  const updatePreferences = useCallback(async (next: Partial<UserPreferences>) => {
    setPrefs((current) => {
      const merged: UserPreferences = { ...current, ...next };
      writeStored(merged);
      return merged;
    });
    if (isAuthed) {
      try {
        await savePreferences(next);
      } catch {
        // network issue is OK; we keep local change
      }
    }
  }, [isAuthed]);

  const value = useMemo(() => ({ prefs, loaded, updatePreferences }), [prefs, loaded, updatePreferences]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
};

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}
