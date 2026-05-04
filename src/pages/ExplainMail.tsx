import { IonSpinner, useIonToast } from '@ionic/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import StitchBottomNav from '../components/StitchBottomNav';
import StitchPage from '../components/StitchPage';
import StitchHeader from '../components/StitchHeader';
import { usePreferences } from '../auth/PreferencesContext';
import { useShareReceiver } from '../auth/ShareContext';
import { getHistoryItem } from '../services/historyApi';
import { getPlainExplanation, SAMPLE_IN } from '../services/explainApi';
import type { ExplainResponse } from '../services/explainApi';
import type { ExplainLanguage, PlainExplanation } from '../types/explain';

type LangMeta = { code: ExplainLanguage; native: string; english: string };

const LANGS: LangMeta[] = [
  { code: 'en', native: 'English', english: 'Default' },
  { code: 'hi', native: 'हिन्दी', english: 'Hindi' },
  { code: 'ta', native: 'தமிழ்', english: 'Tamil' },
  { code: 'mr', native: 'मराठी', english: 'Marathi' },
  { code: 'te', native: 'తెలుగు', english: 'Telugu' },
  { code: 'ml', native: 'മലയാളം', english: 'Malayalam' },
  { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada' },
  { code: 'gu', native: 'ગુજરાતી', english: 'Gujarati' },
  { code: 'bn', native: 'বাংলা', english: 'Bengali' },
];

const TTS_LOCALE: Record<ExplainLanguage, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  mr: 'mr-IN',
  te: 'te-IN',
  ml: 'ml-IN',
  kn: 'kn-IN',
  gu: 'gu-IN',
  bn: 'bn-IN',
};

function buildSpeakText(exp: PlainExplanation): string {
  const parts: string[] = [];
  if (exp.simpleTitle) parts.push(exp.simpleTitle);
  if (exp.summary) parts.push(exp.summary);
  if (exp.whatToDo) parts.push(exp.whatToDo);
  if (exp.dueOrDate) parts.push(exp.dueOrDate);
  if (exp.watchOut) parts.push(exp.watchOut);
  return parts.join('. ');
}

function isSpeechAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

const ExplainMail: React.FC = () => {
  const { id: routeId } = useParams<{ id?: string }>();
  const { prefs, loaded: prefsLoaded } = usePreferences();
  const { pending: pendingShare, consume: consumeShare } = useShareReceiver();

  const [text, setText] = useState('');
  const [lang, setLang] = useState<ExplainLanguage>(prefs.defaultLanguage);
  const [loading, setLoading] = useState(false);
  const [reopening, setReopening] = useState(false);
  const [explanation, setExplanation] = useState<ExplainResponse | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [fromShare, setFromShare] = useState(false);
  const [presentToast] = useIonToast();
  const resultRef = useRef<HTMLDivElement | null>(null);

  // Adopt the saved default language once preferences finish loading (only if user hasn't typed yet).
  useEffect(() => {
    if (prefsLoaded && !text && !explanation) {
      setLang(prefs.defaultLanguage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefsLoaded, prefs.defaultLanguage]);

  // Load a saved explanation when opened from history.
  useEffect(() => {
    let active = true;
    if (!routeId) return undefined;
    setReopening(true);
    (async () => {
      try {
        const item = await getHistoryItem(routeId);
        if (!active) return;
        setText(item.inputText || '');
        setLang((item.language as ExplainLanguage) || 'en');
        if (item.result) {
          setExplanation({ id: item.id, ...item.result });
        }
      } catch {
        void presentToast({ message: "Couldn't open this saved explanation.", duration: 2200, color: 'danger' });
      } finally {
        if (active) setReopening(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [routeId, presentToast]);

  // Stop any speech when leaving the page.
  useEffect(() => {
    return () => {
      if (isSpeechAvailable()) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // If the app was launched (or resumed) by an Android share, prefill the textarea
  // with the shared text. We skip this when reopening a saved explanation by id.
  useEffect(() => {
    if (routeId) return;
    if (!pendingShare) return;
    const taken = consumeShare();
    if (taken?.text) {
      setText(taken.text);
      setExplanation(null);
      setFromShare(true);
      void presentToast({
        message: 'Imported text from Share. Pick a language and tap Explain.',
        duration: 2400,
        color: 'success',
      });
    }
  }, [pendingShare, routeId, consumeShare, presentToast]);

  // Smoothly scroll the result into view when it appears.
  useEffect(() => {
    if (explanation && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [explanation]);

  const onExplain = useCallback(async () => {
    if (!text.trim()) {
      void presentToast({ message: 'Please paste a message, or use "Load a sample" first.', duration: 2200, color: 'warning' });
      return;
    }
    setLoading(true);
    setExplanation(null);
    if (isSpeechAvailable()) window.speechSynthesis.cancel();
    setSpeaking(false);
    try {
      const result = await getPlainExplanation(text, lang);
      if (!result.simpleTitle && !result.summary) {
        void presentToast({ message: 'Nothing to explain. Paste some text and try again.', duration: 2200 });
        return;
      }
      setExplanation(result);
    } catch (e: any) {
      const raw = String(e?.message ?? 'Failed to explain message');
      const message =
        raw === 'missing_token' || raw === 'invalid_token'
          ? 'Please sign in again to use the AI assistant.'
          : raw === 'missing_gemini_key'
            ? 'Gemini key is missing on the server. Please set GEMINI_API_KEY in backend/.env.local and restart the server.'
            : raw === 'auth_unavailable'
              ? 'Server is not connected to Firebase yet. Please configure FIREBASE_SERVICE_ACCOUNT_PATH and FIREBASE_WEB_API_KEY.'
              : raw === 'empty_ai_response'
                ? 'AI returned an empty answer. Please try again.'
                : raw;
      void presentToast({ message, duration: 2800, color: 'danger' });
    } finally {
      setLoading(false);
    }
  }, [text, lang, presentToast]);

  const onSpeak = useCallback(() => {
    if (!explanation) return;
    if (!isSpeechAvailable()) {
      void presentToast({
        message: 'Your device cannot read aloud. Try the latest Chrome / Edge browser.',
        duration: 2400,
        color: 'warning',
      });
      return;
    }

    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }

    const utter = new SpeechSynthesisUtterance(buildSpeakText(explanation));
    utter.lang = TTS_LOCALE[lang] || 'en-IN';
    utter.rate = 0.95;
    utter.pitch = 1;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(utter);
  }, [explanation, lang, presentToast]);

  const onCopy = useCallback(async () => {
    if (!explanation) return;
    const txt = buildSpeakText(explanation);
    try {
      await navigator.clipboard.writeText(txt);
      void presentToast({ message: 'Copied to clipboard.', duration: 1400, color: 'success' });
    } catch {
      void presentToast({ message: 'Could not copy. Long-press the text to copy.', duration: 2200 });
    }
  }, [explanation, presentToast]);

  const onShare = useCallback(async () => {
    if (!explanation) return;
    const t = buildSpeakText(explanation);
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share({ title: explanation.simpleTitle || 'finNotify explanation', text: t });
      } catch {
        // user cancelled
      }
      return;
    }
    void onCopy();
  }, [explanation, onCopy]);

  const charCount = useMemo(() => text.trim().length, [text]);

  return (
    <StitchPage
      bottomNav={<StitchBottomNav active="understand" items={['home', 'understand', 'history']} />}
    >
      <StitchHeader variant="main" />

      <main className="max-w-2xl mx-auto px-6 pt-8 pb-32 space-y-6">
            <section className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-[32px] leading-[44px] font-bold tracking-tight text-teal-800">
                  Understand a message
                </h2>
                {fromShare ? (
                  <span className="inline-flex items-center gap-1.5 bg-teal-100 text-teal-800 text-[12px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                      mark_email_unread
                    </span>
                    Imported from Share
                  </span>
                ) : null}
              </div>
              <p className="text-[18px] leading-[28px] text-stone-700">
                Paste a bank, insurance, policy, or government message. We'll simplify it for you in your language.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message_input"
                  className="text-[14px] leading-[20px] font-bold text-stone-600 uppercase tracking-wider"
                >
                  Paste message below
                </label>
                <textarea
                  id="message_input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={reopening}
                  placeholder="e.g. paste a bank email or SMS here…"
                  className="w-full h-64 p-6 bg-white border-2 border-stone-200 rounded-xl text-[18px] leading-[28px] focus:border-teal-700 focus:ring-0 focus:outline-none transition-all resize-none shadow-sm placeholder:text-stone-400 disabled:opacity-60"
                />
                {charCount ? (
                  <p className="text-[14px] text-stone-500">{charCount} characters</p>
                ) : (
                  <p className="text-[14px] text-stone-500">
                    Tip: try "Load a sample" if you don't have a real message right now.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setText(SAMPLE_IN)}
                  className="px-6 py-3 bg-stone-100 text-stone-700 font-bold rounded-lg border border-stone-200 flex items-center gap-2 hover:bg-stone-200 transition-colors active:scale-95 min-h-[48px]"
                >
                  <span className="material-symbols-outlined">auto_awesome</span>
                  <span>Load a sample</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setText('');
                    setExplanation(null);
                    setFromShare(false);
                  }}
                  className="px-6 py-3 text-stone-500 font-bold flex items-center gap-2 hover:bg-stone-100 rounded-lg transition-colors active:scale-95 min-h-[48px]"
                >
                  <span className="material-symbols-outlined">delete_sweep</span>
                  <span>Clear</span>
                </button>
              </div>
            </section>

            <section className="bg-stone-100 p-4 rounded-2xl flex flex-col gap-4 border border-stone-200/60">
              <div className="flex items-center gap-4 px-2">
                <span className="material-symbols-outlined text-teal-700">language</span>
                <div className="flex-grow">
                  <p className="text-[14px] leading-[20px] font-bold text-stone-600 uppercase tracking-wider">
                    Explanation language
                  </p>
                  <p className="text-[14px] text-stone-500">Choose your preferred regional script</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {LANGS.map((l) => {
                  const isActive = lang === l.code;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLang(l.code)}
                      aria-pressed={isActive}
                      className={
                        isActive
                          ? 'flex items-center justify-between p-3 bg-white border-2 border-teal-700 rounded-xl text-left'
                          : 'flex items-center justify-between p-3 bg-white border border-stone-200 rounded-xl text-left hover:border-teal-300 transition-colors'
                      }
                    >
                      <div className="min-w-0">
                        <span className="block font-bold text-stone-900 truncate">{l.native}</span>
                        <span className="text-[14px] text-stone-400 truncate block">{l.english}</span>
                      </div>
                      <span
                        className={
                          isActive
                            ? 'material-symbols-outlined text-teal-700 shrink-0'
                            : 'material-symbols-outlined text-stone-300 shrink-0'
                        }
                        style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        {isActive ? 'check_circle' : 'circle'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="pt-2">
              <button
                type="button"
                onClick={onExplain}
                disabled={loading || reopening}
                className="w-full bg-teal-700 text-white py-5 rounded-2xl font-bold text-[20px] shadow-lg shadow-teal-700/20 hover:bg-teal-800 transition-all active:scale-95 flex items-center justify-center gap-3 min-h-[64px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <IonSpinner name="crescent" color="light" />
                    <span>Explaining…</span>
                  </>
                ) : (
                  <>
                    <span>Explain in simple words</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </button>

              <div className="mt-6 p-4 flex items-start gap-4 bg-stone-100 rounded-xl border-l-4 border-teal-600">
                <span className="material-symbols-outlined text-teal-700 mt-1">security</span>
                <p className="text-[16px] leading-[24px] text-stone-700">
                  <strong>Privacy note:</strong> we only process the text to explain it. We don't share your messages
                  with third parties.
                </p>
              </div>
            </section>

            {explanation ? (
              <section ref={resultRef} className="pt-4">
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-stone-200 overflow-hidden">
                  <div className="flex justify-end gap-2 p-4 bg-stone-50 border-b border-stone-200">
                    <button
                      type="button"
                      onClick={onSpeak}
                      aria-label={speaking ? 'Stop reading' : 'Listen'}
                      className={
                        speaking
                          ? 'flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-800 font-bold text-[14px] uppercase tracking-wider transition-all active:scale-95'
                          : 'flex items-center gap-2 px-4 py-2 rounded-full hover:bg-stone-200 transition-all text-teal-700 font-bold text-[14px] uppercase tracking-wider active:scale-95'
                      }
                    >
                      <span className="material-symbols-outlined">
                        {speaking ? 'stop_circle' : 'volume_up'}
                      </span>
                      <span>{speaking ? 'Stop' : 'Listen'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={onCopy}
                      aria-label="Copy"
                      className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-stone-200 transition-all text-stone-600 font-bold text-[14px] uppercase tracking-wider active:scale-95"
                    >
                      <span className="material-symbols-outlined">content_copy</span>
                      <span>Copy</span>
                    </button>
                    <button
                      type="button"
                      onClick={onShare}
                      aria-label="Share"
                      className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-stone-200 transition-all text-stone-600 font-bold text-[14px] uppercase tracking-wider active:scale-95"
                    >
                      <span className="material-symbols-outlined">share</span>
                      <span>Share</span>
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-teal-800">description</span>
                        </div>
                        <h3 className="text-[24px] leading-[32px] font-semibold text-stone-900">
                          {explanation.simpleTitle || 'Explanation'}
                        </h3>
                      </div>
                      {explanation.summary ? (
                        <p className="text-[20px] leading-[30px] text-stone-800">{explanation.summary}</p>
                      ) : null}
                    </div>

                    <div className="space-y-4">
                      {explanation.whatToDo ? (
                        <div className="flex gap-4 p-5 rounded-xl bg-teal-50 border-l-4 border-teal-600">
                          <span className="material-symbols-outlined text-teal-700 mt-1 shrink-0">
                            assignment_turned_in
                          </span>
                          <div className="min-w-0">
                            <p className="text-[14px] leading-[20px] font-bold text-teal-800 uppercase tracking-wider mb-1">
                              What you should do
                            </p>
                            <p className="text-[18px] leading-[28px] text-teal-900 break-words">
                              {explanation.whatToDo}
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {explanation.dueOrDate ? (
                        <div className="flex gap-4 p-5 rounded-xl bg-sky-50 border-l-4 border-sky-600">
                          <span className="material-symbols-outlined text-sky-700 mt-1 shrink-0">
                            calendar_today
                          </span>
                          <div className="min-w-0">
                            <p className="text-[14px] leading-[20px] font-bold text-sky-800 uppercase tracking-wider mb-1">
                              Date / deadline
                            </p>
                            <p className="text-[18px] leading-[28px] text-sky-900 break-words">
                              {explanation.dueOrDate}
                            </p>
                          </div>
                        </div>
                      ) : null}

                      {explanation.watchOut ? (
                        <div className="flex gap-4 p-5 rounded-xl bg-amber-50 border-l-4 border-amber-500">
                          <span className="material-symbols-outlined text-amber-700 mt-1 shrink-0">
                            warning
                          </span>
                          <div className="min-w-0">
                            <p className="text-[14px] leading-[20px] font-bold text-amber-800 uppercase tracking-wider mb-1">
                              Be careful about
                            </p>
                            <p className="text-[18px] leading-[28px] text-amber-900 break-words">
                              {explanation.watchOut}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <p className="text-[14px] text-stone-500 italic">
                      Generated by Gemini. Please verify important financial details before acting.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onSpeak}
                  className="w-full mt-6 h-14 bg-teal-700 hover:bg-teal-800 text-white rounded-full flex items-center justify-center gap-3 shadow-lg shadow-teal-700/20 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined">
                    {speaking ? 'stop_circle' : 'volume_up'}
                  </span>
                  <span className="text-[18px] font-bold">
                    {speaking ? 'Stop reading' : 'Listen out loud'}
                  </span>
                </button>
              </section>
            ) : null}
      </main>
    </StitchPage>
  );
};

export default ExplainMail;
