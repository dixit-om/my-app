import type { ExplainLanguage, PlainExplanation } from '../types/explain';
import { apiUrl } from './apiBase';

const DEFAULT_MODEL = 'gemini-flash-latest';

const SAMPLE_IN =
  'Dear Valued Customer, this is a system-generated communication regarding your facility with us. ' +
  'In view of regulatory guidelines, you are required to visit your nearest branch with original KYC documents to complete re-KYC. ' +
  'Failure to comply by 15-MAY-2026 may result in restricted access to certain banking services as per our policy.';

const LANG_LABEL: Record<ExplainLanguage, string> = {
  en: 'English',
  hi: 'Hindi',
  ta: 'Tamil',
  mr: 'Marathi',
  te: 'Telugu',
  ml: 'Malayalam',
  kn: 'Kannada',
  gu: 'Gujarati',
  bn: 'Bengali',
};

type GeminiTextPart = { text?: string };
type GeminiContent = { parts?: GeminiTextPart[] };
type GeminiResponse = {
  candidates?: Array<{ content?: GeminiContent; finishReason?: string }>;
  promptFeedback?: { blockReason?: string };
};

function getApiKey() {
  const key = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;
  return (key ?? '').trim();
}

function getModel() {
  const model = (import.meta as any).env?.VITE_GEMINI_MODEL as string | undefined;
  return (model ?? DEFAULT_MODEL).trim();
}

function extractJsonBlock(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = (fenced?.[1] ?? trimmed).trim();

  if (candidate.startsWith('{') && candidate.endsWith('}')) return candidate;

  // Balanced brace extraction (handles braces inside strings)
  const firstBrace = candidate.indexOf('{');
  if (firstBrace < 0) throw new Error('invalid_ai_format');

  let inString = false;
  let escape = false;
  let depth = 0;
  let quoteChar = '"';

  for (let i = firstBrace; i < candidate.length; i += 1) {
    const ch = candidate[i]!;

    if (inString) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === '\\') {
        escape = true;
        continue;
      }
      if (ch === quoteChar) inString = false;
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = true;
      quoteChar = ch;
      continue;
    }

    if (ch === '{') depth += 1;
    if (ch === '}') depth -= 1;
    if (depth === 0) return candidate.slice(firstBrace, i + 1);
  }

  throw new Error('invalid_ai_format');
}

function firstLine(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .find(Boolean) ?? '';
}

function fallbackFromText(raw: string): PlainExplanation {
  // If we can extract expected fields from JSON-ish text, prefer that.
  const simpleTitle = extractJsonStringField(raw, 'simpleTitle');
  const summaryField = extractJsonStringField(raw, 'summary');
  if (simpleTitle || summaryField) {
    return {
      simpleTitle: simpleTitle || 'Simple explanation',
      summary: summaryField || '',
      whatToDo: null,
      dueOrDate: null,
      watchOut: null,
    };
  }

  const cleaned = raw.replace(/[*#`>-]/g, ' ').replace(/\s+/g, ' ').trim();
  const summary = cleaned.slice(0, 600);
  return {
    simpleTitle: firstLine(raw).slice(0, 80) || 'Simple explanation',
    summary,
    whatToDo: null,
    dueOrDate: null,
    watchOut: null,
  };
}

function parseGeminiOutput(raw: string): PlainExplanation {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error('empty_ai_response');
  }

  try {
    if (trimmed.startsWith('{')) {
      try {
        return toPlainExplanation(JSON.parse(trimmed));
      } catch {
        // fallthrough
      }
    }
    return toPlainExplanation(JSON.parse(extractJsonBlock(trimmed)));
  } catch {
    return fallbackFromText(trimmed);
  }
}

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asOptional(value: unknown) {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') return null;
  const text = value.trim();
  if (!text || text.toLowerCase() === 'null') return null;
  return text;
}

function toPlainExplanation(raw: unknown): PlainExplanation {
  const obj = (raw ?? {}) as Record<string, unknown>;
  return {
    simpleTitle: asString(obj.simpleTitle),
    summary: asString(obj.summary),
    whatToDo: asOptional(obj.whatToDo),
    dueOrDate: asOptional(obj.dueOrDate),
    watchOut: asOptional(obj.watchOut),
  };
}

function extractJsonStringField(raw: string, field: string): string | null {
  const input = raw.trim();
  if (!input) return null;

  // Handles variants like:
  // 1) "simpleTitle": "..."
  // 2) 'simpleTitle': '...'
  // 3) simpleTitle: "..."
  // 4) 'simpleTitle': "...", with extra spacing
  // 5) field names wrapped in unicode quotes

  // Key optionally wrapped in quotes; value optionally wrapped in quotes.
  let re = new RegExp(
    `(?:["'“”]?${field}["'“”]?|${field})\\s*[:=]\\s*["“']((?:\\\\.|[^"“'\\\\])*)["”']`,
    'm'
  );
  let match = input.match(re);
  if (match?.[1]) {
    const captured = match[1]!;
    try {
      return JSON.parse(`"${captured}"`);
    } catch {
      return captured;
    }
  }

  // Single-quoted value variant
  re = new RegExp(`(?:["'“”]?${field}["'“”]?|${field})\\s*[:=]\\s*'((?:\\\\.|[^'\\\\])*)'`, 'm');
  match = input.match(re);
  if (match?.[1]) return match[1]!;

  // Unquoted value fallback until comma/brace/newline
  re = new RegExp(`(?:["'“”]?${field}["'“”]?|${field})\\s*[:=]\\s*([^,}\\n\\r]+)`, 'm');
  match = input.match(re);
  if (!match?.[1]) return null;

  const captured = match[1]!.trim();
  return captured.replace(/^["'`“”]/, '').replace(/["'`“”],?$/, '') || null;
}

export async function getPlainExplanation(text: string, language: ExplainLanguage): Promise<PlainExplanation> {
  const key = getApiKey();

  // Prefer direct Gemini calls when key is provided in my-app env.
  if (key) {
    const model = getModel();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
    const prompt = [
      'You are an assistant for Indian users.',
      `Convert the input financial message into very simple ${LANG_LABEL[language]} language.`,
      'Return the title and summary in that same selected language only.',
      'The summary must not be empty. Write 1-3 short sentences (plain, practical, non-legal).',
      'Return STRICT JSON only with this shape:',
      '{"simpleTitle":"string","summary":"string","whatToDo":"string|null","dueOrDate":"string|null","watchOut":"string|null"}',
      'Use double quotes for keys and string values. Do NOT use single quotes.',
      'Rules:',
      '- Keep it short and practical.',
      '- If any field is unavailable, set it to null.',
      '- Never return markdown, code fences, or extra keys.',
      '',
      'Input message:',
      text,
    ].join('\n');

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 500,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              simpleTitle: { type: 'STRING' },
              summary: { type: 'STRING' },
              whatToDo: { type: 'STRING', nullable: true },
              dueOrDate: { type: 'STRING', nullable: true },
              watchOut: { type: 'STRING', nullable: true },
            },
            required: ['simpleTitle', 'summary', 'whatToDo', 'dueOrDate', 'watchOut'],
          },
        },
      }),
    });

    const data = (await res.json().catch(() => ({}))) as GeminiResponse & { error?: { message?: string } };
    if (!res.ok) {
      throw new Error(data?.error?.message ?? 'gemini_request_failed');
    }

    if (!data?.candidates?.length) {
      if (data?.promptFeedback?.blockReason) {
        throw new Error(`Response blocked: ${data.promptFeedback.blockReason}`);
      }
      throw new Error('No response returned from Gemini');
    }

    const answer = data.candidates
      .flatMap((candidate) => candidate.content?.parts ?? [])
      .map((part) => part.text ?? '')
      .join('\n')
      .trim();

    const normalized = parseGeminiOutput(answer);
    if (!normalized.simpleTitle && !normalized.summary) {
      throw new Error('empty_ai_response');
    }
    if (!normalized.summary) {
      return { ...normalized, summary: String(text).trim().slice(0, 240) };
    }
    return normalized;
  }

  // Fallback to backend if key is not provided (older setup).
  const res = await fetch(apiUrl('/api/explain'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text, language }),
  });

  const data = (await res.json().catch(() => ({}))) as Partial<PlainExplanation> & { error?: string };
  if (!res.ok) {
    throw new Error(data?.error ?? 'explain_failed');
  }

  const out: PlainExplanation = {
    simpleTitle: typeof data.simpleTitle === 'string' ? data.simpleTitle : '',
    summary: typeof data.summary === 'string' ? data.summary : '',
    whatToDo: typeof (data as any).whatToDo === 'string' ? (data as any).whatToDo : null,
    dueOrDate: typeof (data as any).dueOrDate === 'string' ? (data as any).dueOrDate : null,
    watchOut: typeof (data as any).watchOut === 'string' ? (data as any).watchOut : null,
  };

  if (!out.simpleTitle && !out.summary) {
    throw new Error('empty_ai_response');
  }

  return out;
}

export { SAMPLE_IN };
