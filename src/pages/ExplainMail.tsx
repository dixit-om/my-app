import {
  IonButton,
  IonCard,
  IonCardContent,
  IonChip,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTextarea,
  useIonToast,
} from '@ionic/react';
import {
  alertCircleOutline,
  calendarOutline,
  checkmarkCircleOutline,
  copyOutline,
  mailUnreadOutline,
  shareSocialOutline,
  sparklesOutline,
  stopCircleOutline,
  volumeHighOutline,
} from 'ionicons/icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageWithMenu from '../components/PageWithMenu';
import { usePreferences } from '../auth/PreferencesContext';
import { useShareReceiver } from '../auth/ShareContext';
import { getHistoryItem } from '../services/historyApi';
import { getPlainExplanation, SAMPLE_IN } from '../services/explainApi';
import type { ExplainResponse } from '../services/explainApi';
import type { ExplainLanguage, PlainExplanation } from '../types/explain';
import './ExplainMail.css';

const LANG_LABEL: Record<ExplainLanguage, string> = {
  en: 'English (simple words)',
  hi: 'हिंदी (Hindi)',
  ta: 'தமிழ் (Tamil)',
  mr: 'मराठी (Marathi)',
  te: 'తెలుగు (Telugu)',
  ml: 'മലയാളം (Malayalam)',
  kn: 'ಕನ್ನಡ (Kannada)',
  gu: 'ગુજરાતી (Gujarati)',
  bn: 'বাংলা (Bengali)',
};

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
      } catch (e: any) {
        void presentToast({ message: 'Couldn\'t open this saved explanation.', duration: 2200, color: 'danger' });
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

  const onExplain = useCallback(async () => {
    if (!text.trim()) {
      void presentToast({ message: 'Please paste a message, or use "Load sample" first.', duration: 2200, color: 'warning' });
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
    const text = buildSpeakText(explanation);
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share({ title: explanation.simpleTitle || 'finNotify explanation', text });
      } catch {
        // user cancelled
      }
      return;
    }
    void onCopy();
  }, [explanation, onCopy]);

  const charCount = useMemo(() => text.trim().length, [text]);

  return (
    <PageWithMenu title="Understand a message" contentClassName="ion-padding-bottom">
      <div className="explain-bg">
        <div className="ion-padding explain-intro">
          <h1 className="ion-no-margin explain-title">Paste a message</h1>
          <IonText color="medium">
            <p className="explain-note">
              Copy a bank / insurance / policy text (email or SMS) and paste it here. Pick a language for the plain
              version, then tap explain.
            </p>
          </IonText>
          <IonChip color="primary" className="explain-chip">
            <IonIcon icon={sparklesOutline} />
            <IonLabel>Powered by Gemini AI</IonLabel>
          </IonChip>
          {fromShare ? (
            <IonChip color="success" className="explain-chip">
              <IonIcon icon={mailUnreadOutline} />
              <IonLabel>Imported from Share</IonLabel>
            </IonChip>
          ) : null}
        </div>

        <IonList inset className="ion-padding-horizontal">
          <IonItem className="explain-paste-field" lines="none">
            <IonTextarea
              value={text}
              placeholder="e.g. paste a bank email or SMS here…"
              rows={8}
              autoGrow
              onIonInput={(e) => setText(e.detail.value ?? '')}
              disabled={reopening}
            />
          </IonItem>
          <IonItem className="explain-lang-field" lines="none">
            <IonLabel position="stacked">Explain in this language</IonLabel>
            <IonSelect
              value={lang}
              interface="action-sheet"
              onIonChange={(e) => {
                const v = e.detail.value;
                if (v) setLang(String(v) as ExplainLanguage);
              }}
            >
              {(Object.keys(LANG_LABEL) as ExplainLanguage[]).map((code) => (
                <IonSelectOption value={code} key={code}>
                  {LANG_LABEL[code]}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonItem lines="none">
            <IonNote className="explain-subnote">
              {charCount ? `${charCount} characters` : 'Tip: try "Load sample" if you don\'t have a real message right now.'}
            </IonNote>
          </IonItem>
        </IonList>

        <div className="ion-padding">
          <div className="explain-try-row ion-padding-bottom">
            <span className="explain-try-label">Test without a real message</span>
            <div className="explain-actions">
              <IonButton size="small" fill="outline" onClick={() => setText(SAMPLE_IN)}>
                Load sample
              </IonButton>
              <IonButton
                size="small"
                fill="clear"
                onClick={() => {
                  setText('');
                  setExplanation(null);
                  setFromShare(false);
                }}
              >
                Clear
              </IonButton>
            </div>
          </div>
          <IonButton expand="block" color="primary" disabled={loading || reopening} onClick={onExplain} className="explain-cta">
            {loading ? <IonSpinner slot="start" name="crescent" color="light" /> : null}
            {loading ? 'Explaining…' : 'Explain in simple words'}
          </IonButton>
        </div>

        {explanation ? (
          <IonCard className="ion-margin-horizontal explain-result animate-fin-fade fin-surface">
            <IonCardContent>
              <div className="explain-result-head">
                <div>
                  <h2 className="explain-section-title explain-main-title">{explanation.simpleTitle}</h2>
                  <p className="explain-summary">{explanation.summary}</p>
                </div>
                <div className="explain-result-actions">
                  <IonButton
                    size="small"
                    fill={speaking ? 'solid' : 'outline'}
                    color={speaking ? 'primary' : 'medium'}
                    onClick={onSpeak}
                    aria-label={speaking ? 'Stop reading' : 'Listen'}
                  >
                    <IonIcon slot="start" icon={speaking ? stopCircleOutline : volumeHighOutline} />
                    {speaking ? 'Stop' : 'Listen'}
                  </IonButton>
                </div>
              </div>

              <IonGrid className="ion-no-padding explain-grid">
                <IonRow>
                  {explanation.whatToDo ? (
                    <IonCol size="12">
                      <div className="explain-block explain-block-action">
                        <div className="explain-block-icon explain-icon-action">
                          <IonIcon icon={checkmarkCircleOutline} />
                        </div>
                        <div className="explain-block-body">
                          <h3 className="explain-block-title">What you need to do</h3>
                          <p>{explanation.whatToDo}</p>
                        </div>
                      </div>
                    </IonCol>
                  ) : null}
                  {explanation.dueOrDate ? (
                    <IonCol size="12">
                      <div className="explain-block explain-block-date">
                        <div className="explain-block-icon explain-icon-date">
                          <IonIcon icon={calendarOutline} />
                        </div>
                        <div className="explain-block-body">
                          <h3 className="explain-block-title">Date / deadline</h3>
                          <p>{explanation.dueOrDate}</p>
                        </div>
                      </div>
                    </IonCol>
                  ) : null}
                  {explanation.watchOut ? (
                    <IonCol size="12">
                      <div className="explain-block explain-block-warn">
                        <div className="explain-block-icon explain-icon-warn">
                          <IonIcon icon={alertCircleOutline} />
                        </div>
                        <div className="explain-block-body">
                          <h3 className="explain-block-title">Be careful / double-check</h3>
                          <p>{explanation.watchOut}</p>
                        </div>
                      </div>
                    </IonCol>
                  ) : null}
                </IonRow>
              </IonGrid>

              <div className="explain-result-foot">
                <IonButton size="small" fill="clear" onClick={onCopy}>
                  <IonIcon slot="start" icon={copyOutline} />
                  Copy
                </IonButton>
                <IonButton size="small" fill="clear" onClick={onShare}>
                  <IonIcon slot="start" icon={shareSocialOutline} />
                  Share
                </IonButton>
              </div>

              <IonNote className="explain-disclaimer">
                Generated by Gemini. Please verify important financial details before acting.
              </IonNote>
            </IonCardContent>
          </IonCard>
        ) : null}
      </div>
    </PageWithMenu>
  );
};

export default ExplainMail;
