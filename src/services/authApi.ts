import { apiUrl } from './apiBase';

export type LoginResponse = {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  uid: string;
  email: string;
};

export async function signup(payload: { email: string; password: string; displayName?: string }) {
  const r = await fetch(apiUrl('/auth/signup'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.error ?? 'signup_failed');
  return data as { uid: string; email: string };
}

export async function login(payload: { email: string; password: string }) {
  const r = await fetch(apiUrl('/auth/login'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.error ?? 'login_failed');
  return data as LoginResponse;
}

export async function forgotPassword(payload: { email: string }) {
  const r = await fetch(apiUrl('/auth/forgot-password'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.error ?? 'forgot_password_failed');
  return data as { email: string };
}

