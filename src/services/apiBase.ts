import { Capacitor } from '@capacitor/core';
import { getIdToken } from './authStore';

const DEFAULT_BASE = '';

let logged = false;

/**
 * Resolves the API base URL based on the current runtime context.
 *
 * The recommended dev workflow is:
 *   1) Run the backend on http://localhost:3001
 *   2) Run `adb reverse tcp:3001 tcp:3001` once, so the Android emulator's
 *      `localhost:3001` is tunneled to your laptop's `localhost:3001`.
 *      (If you also use livereload, also run `adb reverse tcp:8100 tcp:8100`.)
 *
 * After that, every platform — web browser, Chrome on emulator, Capacitor APK —
 * can simply call `http://localhost:3001` and it will reach your backend.
 *
 * The few small auto-corrections below cover edge cases where the env URL and
 * the actual runtime host don't match (e.g. real LAN device viewing dev server).
 *
 * If you'd rather not use `adb reverse`, set VITE_API_BASE_URL explicitly to
 * `http://10.0.2.2:3001` (Android emulator NAT — needs Windows Firewall to allow
 * inbound on port 3001) or to your LAN IP for real devices.
 */
export function getApiBase(): string {
  const fromEnv = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
  let base = (fromEnv ?? DEFAULT_BASE).trim();

  if (typeof window !== 'undefined') {
    const isNative = Capacitor.isNativePlatform();
    const pageHost = window.location.hostname || '';

    // Phone/tablet on LAN viewing dev server at the host's LAN IP →
    // align API host with page host so it doesn't try localhost on the device.
    const isLanIp =
      /^(\d{1,3}\.){3}\d{1,3}$/.test(pageHost) &&
      pageHost !== '127.0.0.1' &&
      pageHost !== '10.0.2.2';
    if (!isNative && isLanIp && base.includes('localhost')) {
      base = base.replace('localhost', pageHost);
    }

    // Chrome inside Android emulator viewing dev server at 10.0.2.2 →
    // align API host with page host.
    if (!isNative && pageHost === '10.0.2.2' && base.includes('localhost')) {
      base = base.replace('localhost', '10.0.2.2');
    }

    // Web on host machine but env was set to emulator URL → fix back to localhost.
    if (!isNative && (pageHost === 'localhost' || pageHost === '127.0.0.1') && base.includes('10.0.2.2')) {
      base = base.replace('10.0.2.2', 'localhost');
    }
  }

  base = base.replace(/\/+$/, '');

  if (!logged && typeof window !== 'undefined') {
    logged = true;
    // eslint-disable-next-line no-console
    console.info('[finNotify] API base:', base || '(none)');
  }

  return base;
}

export function apiUrl(path: string): string {
  const base = getApiBase();
  if (!base) return path;
  if (!path.startsWith('/')) return `${base}/${path}`;
  return `${base}${path}`;
}

export function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const token = getIdToken();
  const headers: Record<string, string> = { ...(extra ?? {}) };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

type FetchInit = Omit<RequestInit, 'headers'> & { headers?: Record<string, string> };

export async function fetchJson<T = unknown>(path: string, init: FetchInit = {}): Promise<T> {
  const headers = authHeaders({
    'content-type': 'application/json',
    ...(init.headers ?? {}),
  });

  let res: Response;
  try {
    res = await fetch(apiUrl(path), { ...init, headers });
  } catch (e: any) {
    // Most common cause is the API base pointing to a host the device can't reach.
    const reachedUrl = apiUrl(path);
    // eslint-disable-next-line no-console
    console.error('[finNotify] Network error reaching', reachedUrl, e);
    throw new Error(`Cannot reach server at ${reachedUrl}. Make sure the backend is running and reachable from this device.`);
  }

  const data = (await res.json().catch(() => ({}))) as { error?: string } & Record<string, unknown>;
  if (!res.ok) {
    const message = typeof data?.error === 'string' && data.error ? data.error : `request_failed_${res.status}`;
    throw new Error(message);
  }
  return data as T;
}
