import { fetchJson } from './apiBase';

export type GmailStatus = {
  connected: boolean;
  email: string | null;
};

export type GmailListItem = {
  id: string;
  sender: string;
  timeLabel: string;
  subject: string;
  snippet: string;
  badge?: { label: string; className: string };
  borderClass: string;
  avatarIcon: string;
  avatarBg: string;
  avatarIconClass: string;
  footerIcon: string;
  footerText: string;
  footerTextClass: string;
};

export type GmailListResponse = {
  items: GmailListItem[];
  nextPageToken: string | null;
};

export type GmailMessageDetail = {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  bodyText: string;
};

export async function getGmailStatus(): Promise<GmailStatus> {
  return fetchJson<GmailStatus>('/api/gmail/status');
}

export async function startGoogleOAuth(): Promise<{ url: string }> {
  return fetchJson<{ url: string }>('/api/google/oauth/start');
}

export async function listGmailMessages(q?: string, pageToken?: string): Promise<GmailListResponse> {
  const params = new URLSearchParams();
  if (q?.trim()) params.set('q', q.trim());
  if (pageToken) params.set('pageToken', pageToken);
  const qs = params.toString();
  return fetchJson<GmailListResponse>(`/api/gmail/messages${qs ? `?${qs}` : ''}`);
}

export async function getGmailMessage(id: string): Promise<GmailMessageDetail> {
  return fetchJson<GmailMessageDetail>(`/api/gmail/messages/${encodeURIComponent(id)}`);
}

export async function disconnectGmail(): Promise<{ ok: boolean }> {
  return fetchJson<{ ok: boolean }>('/api/gmail/connect', { method: 'DELETE' });
}
