import { Capacitor } from '@capacitor/core';

const DEFAULT_BASE = '';

export function getApiBase(): string {
  const fromEnv = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
  let base = (fromEnv ?? DEFAULT_BASE).trim();

  // Auto-fix common dev mismatch:
  // - Android emulator uses 10.0.2.2 to reach the host machine.
  // - Web browser should use localhost directly.
  // If someone set emulator URL globally, fix it for web builds.
  if (typeof window !== 'undefined') {
    const isNative = Capacitor.isNativePlatform();
    const isWeb = !isNative;

    if (isWeb && base.includes('10.0.2.2')) {
      base = base.replace('10.0.2.2', 'localhost');
    }

    // If someone set localhost globally, fix it for Android emulator builds.
    if (isNative && base.includes('localhost')) {
      base = base.replace('localhost', '10.0.2.2');
    }
  }

  return base.replace(/\/+$/, '');
}

export function apiUrl(path: string): string {
  const base = getApiBase();
  if (!base) return path;
  if (!path.startsWith('/')) return `${base}/${path}`;
  return `${base}${path}`;
}

