import {
  IonButton,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTextarea,
  useIonToast,
} from '@ionic/react';
import { useCallback, useState } from 'react';
import PageWithMenu from '../components/PageWithMenu';
import { getPlainExplanationMock, SAMPLE_IN } from '../mocks/plainExplanationMock';
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

const ExplainMail: React.FC = () => {
  const [text, setText] = useState('');
  const [lang, setLang] = useState<ExplainLanguage>('en');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<PlainExplanation | null>(null);
  const [presentToast] = useIonToast();

  const onExplain = useCallback(async () => {
    if (!text.trim()) {
      void presentToast({ message: 'Please paste a message, or use “Load sample” first.', duration: 2200, color: 'warning' });
      return;
    }
    setLoading(true);
    setExplanation(null);
    try {
      const result = await getPlainExplanationMock(text, lang);
      if (!result.simpleTitle && !result.summary) {
        void presentToast({ message: 'Nothing to explain. Paste some text and try again.', duration: 2200 });
        return;
      }
      setExplanation(result);
    } finally {
      setLoading(false);
    }
  }, [text, lang, presentToast]);

  return (
    <PageWithMenu title="Understand a message" contentClassName="ion-padding-bottom">
      <div className="ion-padding">
        <h1 className="ion-no-margin" style={{ fontSize: '1.1rem' }}>
          Paste bank, insurance, or policy text
        </h1>
        <p className="ion-text-color-medium explain-note">
          Copy the email or SMS, paste here, pick a language for the simple version, then tap the button. This
          screen uses <strong>demo</strong> text (no real AI) until the backend is connected.
        </p>
      </div>

      <IonList inset>
        <IonItem>
          <IonTextarea
            value={text}
            placeholder="e.g. paste a bank email or SMS in English…"
            rows={8}
            autoGrow
            onIonInput={(e) => {
              setText(e.detail.value ?? '');
            }}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Explain in this language (simple / daily words)</IonLabel>
          <IonSelect
            value={lang}
            interface="action-sheet"
            onIonChange={(e) => {
              const v = e.detail.value;
              if (v) {
                setLang(String(v) as ExplainLanguage);
              }
            }}
          >
            {(Object.keys(LANG_LABEL) as ExplainLanguage[]).map((code) => (
              <IonSelectOption value={code} key={code}>
                {LANG_LABEL[code]}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
      </IonList>

      <div className="ion-padding">
        <div className="explain-try-row ion-padding-bottom">
          <span className="explain-try-label">Test without real mail</span>
          <IonButton
            size="small"
            fill="outline"
            onClick={() => {
              setText(SAMPLE_IN);
            }}
          >
            Load sample
          </IonButton>
        </div>
        <IonButton expand="block" color="primary" disabled={loading} onClick={onExplain}>
          {loading ? <IonSpinner slot="start" name="crescent" color="light" /> : null}
          {loading ? 'Explaining (demo)…' : 'Get plain explanation (demo)'}
        </IonButton>
      </div>

      {explanation ? (
        <IonCard className="ion-margin-horizontal" style={{ marginTop: '0.5rem' }}>
          <IonCardContent>
            <div className="explain-block">
              <h2>{explanation.simpleTitle}</h2>
              <p>{explanation.summary}</p>
            </div>
            {explanation.whatToDo ? (
              <div className="explain-block">
                <h2>What you need to do</h2>
                <p>{explanation.whatToDo}</p>
              </div>
            ) : null}
            {explanation.dueOrDate ? (
              <div className="explain-block">
                <h2>Date / deadline</h2>
                <p>{explanation.dueOrDate}</p>
              </div>
            ) : null}
            {explanation.watchOut ? (
              <div className="explain-block">
                <h2>Be careful / double-check</h2>
                <p>{explanation.watchOut}</p>
              </div>
            ) : null}
            <IonNote>
              {lang === 'en' || lang === 'hi'
                ? 'Demo: Hindi/English have sample wording. Other choices show English for now, plus a note, until the API is added.'
                : 'Demo: you picked ' + (LANG_LABEL[lang] ?? lang) + '. Full line-by-line translation will use the same screen after the API is live.'}
            </IonNote>
          </IonCardContent>
        </IonCard>
      ) : null}
    </PageWithMenu>
  );
};

export default ExplainMail;
