import { fetchJson } from './apiBase';

export type LoginResponse = {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  uid: string;
  email: string;
};

export async function signup(payload: { email: string; password: string; displayName?: string }) {
  return fetchJson<{ uid: string; email: string }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function login(payload: { email: string; password: string }) {
  return fetchJson<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function forgotPassword(payload: { email: string }) {
  return fetchJson<{ email: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
