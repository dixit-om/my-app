import type { ExplainLanguage, PlainExplanation } from '../types/explain';
import { fetchJson } from './apiBase';

const SAMPLE_IN =
  'Dear Valued Customer, this is a system-generated communication regarding your facility with us. ' +
  'In view of regulatory guidelines, you are required to visit your nearest branch with original KYC documents to complete re-KYC. ' +
  'Failure to comply by 15-MAY-2026 may result in restricted access to certain banking services as per our policy.';

export type ExplainResponse = PlainExplanation & { id?: string };

export async function getPlainExplanation(text: string, language: ExplainLanguage): Promise<ExplainResponse> {
  const data = await fetchJson<ExplainResponse>('/api/explain', {
    method: 'POST',
    body: JSON.stringify({ text, language }),
  });

  const out: ExplainResponse = {
    id: typeof data.id === 'string' ? data.id : undefined,
    simpleTitle: typeof data.simpleTitle === 'string' ? data.simpleTitle : '',
    summary: typeof data.summary === 'string' ? data.summary : '',
    whatToDo: typeof data.whatToDo === 'string' ? data.whatToDo : null,
    dueOrDate: typeof data.dueOrDate === 'string' ? data.dueOrDate : null,
    watchOut: typeof data.watchOut === 'string' ? data.watchOut : null,
  };

  if (!out.simpleTitle && !out.summary) {
    throw new Error('empty_ai_response');
  }
  return out;
}

export { SAMPLE_IN };
