import type { ExplainLanguage, PlainExplanation } from '../types/explain';

const SAMPLE_IN =
  'Dear Valued Customer, this is a system-generated communication regarding your facility with us. ' +
  'In view of regulatory guidelines, you are required to visit your nearest branch with original KYC documents to complete re-KYC. ' +
  'Failure to comply by 15-MAY-2026 may result in restricted access to certain banking services as per our policy.';

const BASE_EN: PlainExplanation = {
  simpleTitle: 'Re-KYC visit before a deadline',
  summary:
    'The bank is asking you to go to a branch in person to update your KYC (identity) details. ' +
    'It says this is required by rules, and you should carry your original KYC documents.',
  whatToDo: 'Go to the nearest bank branch with original Aadhaar / PAN and ID the bank already lists for you, before the date below.',
  dueOrDate: '15 May 2026',
  watchOut:
    'If you do not finish this in time, the bank may limit some services on your account until re-KYC is done.',
};

const HINDI: PlainExplanation = {
  simpleTitle: 'KYC dobara, samay-se pehle branch visit',
  summary:
    'Bank kehta hai: aapko niyam ke karan apni pehchan (KYC) taza karani hai. Iske liye najdeeki branch jao, ' +
    'KYC dastavez asli (original) le kar.',
  whatToDo:
    'Apni branch jao, saath mein original Aadhaar / PAN aur jo ID pehle diya hai, uski poori jankari, date se pehle.',
  dueOrDate: '15 May 2026',
  watchOut: 'Samay par nahi hua to kuch banking services band ho sakti hain jab tak re-KYC poora nahi hota.',
};

const EMPTY: PlainExplanation = {
  simpleTitle: '',
  summary: '',
  whatToDo: null,
  dueOrDate: null,
  watchOut: null,
};

function normalize(text: string) {
  return text.trim();
}

/**
 * Returns static demo content (no real AI). Replace with API call that returns PlainExplanation.
 */
export function getPlainExplanationMock(
  _text: string,
  language: ExplainLanguage
): Promise<PlainExplanation> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      if (!normalize(_text)) {
        resolve(EMPTY);
        return;
      }

      if (language === 'hi') {
        resolve({ ...HINDI });
        return;
      }
      if (language === 'en') {
        resolve({ ...BASE_EN });
        return;
      }

      resolve({
        ...BASE_EN,
        summary: BASE_EN.summary + ' (For this preview, full translation for every language is added when the backend is connected.)',
        simpleTitle: BASE_EN.simpleTitle,
      });
    }, 600);
  });
}

export { SAMPLE_IN };
