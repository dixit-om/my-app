import type { ExplainLanguage } from '../types/explain';
import { fetchJson } from './apiBase';

export type TextSize = 'normal' | 'large' | 'xlarge';

export type UserPreferences = {
  defaultLanguage: ExplainLanguage;
  textSize: TextSize;
};

export async function getPreferences(): Promise<UserPreferences> {
  const data = await fetchJson<UserPreferences>('/api/me/preferences');
  return {
    defaultLanguage: (data?.defaultLanguage as ExplainLanguage) || 'en',
    textSize: (data?.textSize as TextSize) || 'normal',
  };
}

export async function savePreferences(prefs: Partial<UserPreferences>): Promise<void> {
  await fetchJson<{ ok: true }>('/api/me/preferences', {
    method: 'PUT',
    body: JSON.stringify(prefs),
  });
}
