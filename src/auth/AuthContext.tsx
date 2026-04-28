import type { FC, ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';
import { clearIdToken, getIdToken, setIdToken } from '../services/authStore';

type AuthUser = {
  email?: string;
  name?: string;
};

type AuthContextValue = {
  idToken: string | null;
  isAuthed: boolean;
  user: AuthUser | null;
  signInWithToken: (token: string) => void;
  signOut: () => void;
};

function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function decodeJwtPayload(token: string): any | null {
  const parts = token.split('.');
  if (parts.length < 2) return null;
  const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  try {
    const json = atob(padded);
    return safeJsonParse<any>(json);
  } catch {
    return null;
  }
}

function userFromToken(token: string): AuthUser | null {
  const payload = decodeJwtPayload(token);
  if (!payload) return null;
  const email = typeof payload.email === 'string' ? payload.email : undefined;
  const name =
    typeof payload.name === 'string'
      ? payload.name
      : typeof payload.displayName === 'string'
        ? payload.displayName
        : undefined;
  return email || name ? { email, name } : null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [idTokenState, setIdTokenState] = useState<string | null>(() => getIdToken());

  const value = useMemo<AuthContextValue>(() => {
    const idToken = idTokenState;
    return {
      idToken,
      isAuthed: Boolean(idToken),
      user: idToken ? userFromToken(idToken) : null,
      signInWithToken: (token: string) => {
        setIdToken(token);
        setIdTokenState(token);
      },
      signOut: () => {
        clearIdToken();
        setIdTokenState(null);
      },
    };
  }, [idTokenState]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

