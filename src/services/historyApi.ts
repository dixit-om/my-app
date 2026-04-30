import type { ExplainLanguage, PlainExplanation } from '../types/explain';
import { fetchJson } from './apiBase';

export type HistoryItem = {
  id: string;
  inputText: string;
  language: ExplainLanguage;
  result: PlainExplanation | null;
  createdAt: number | null;
};

export async function getHistory(limit = 20): Promise<HistoryItem[]> {
  const data = await fetchJson<{ items: HistoryItem[] }>(`/api/history?limit=${encodeURIComponent(String(limit))}`);
  return Array.isArray(data?.items) ? data.items : [];
}

export async function getHistoryItem(id: string): Promise<HistoryItem> {
  return fetchJson<HistoryItem>(`/api/history/${encodeURIComponent(id)}`);
}

export async function deleteHistoryItem(id: string): Promise<void> {
  await fetchJson<{ ok: true }>(`/api/history/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
