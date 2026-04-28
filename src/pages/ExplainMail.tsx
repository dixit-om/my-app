import {
  IonButton,
  IonCard,
  IonCardContent,
  IonChip,
  IonCol,
  IonGrid,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTextarea,
  IonText,
  IonRow,
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
        <h1 className="ion-no-margin explain-title">Paste a message</h1>
        <IonText color="medium">
          <p className="explain-note">
            Copy bank / insurance / policy text (email or SMS) and paste it here. Pick a language for the plain version, then tap
            explain.
          </p>
        </IonText>
        <IonChip color="medium" className="explain-chip">
          DEMO (no AI yet)
        </IonChip>
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
        <IonItem lines="none">
          <IonNote className="explain-subnote">
            {text.trim().length ? `${text.trim().length} characters` : 'Tip: try “Load sample” if you don’t have a message now.'}
          </IonNote>
        </IonItem>
      </IonList>

      <div className="ion-padding">
        <div className="explain-try-row ion-padding-bottom">
          <span className="explain-try-label">Test without real mail</span>
          <div className="explain-actions">
            <IonButton
              size="small"
              fill="outline"
              onClick={() => {
                setText(SAMPLE_IN);
              }}
            >
              Load sample
            </IonButton>
            <IonButton
              size="small"
              fill="clear"
              onClick={() => {
                setText('');
                setExplanation(null);
              }}
            >
              Clear
            </IonButton>
          </div>
        </div>
        <IonButton expand="block" color="primary" disabled={loading} onClick={onExplain}>
          {loading ? <IonSpinner slot="start" name="crescent" color="light" /> : null}
          {loading ? 'Explaining…' : 'Explain in simple words'}
        </IonButton>
      </div>

      {explanation ? (
        <IonCard className="ion-margin-horizontal explain-result" style={{ marginTop: '0.5rem' }}>
          <IonCardContent>
            <div className="explain-block">
              <h2 className="explain-section-title">{explanation.simpleTitle}</h2>
              <p>{explanation.summary}</p>
            </div>
            <IonGrid className="ion-no-padding explain-grid">
              <IonRow>
                {explanation.whatToDo ? (
                  <IonCol size="12">
                    <div className="explain-block">
                      <h2 className="explain-section-title">What you need to do</h2>
                      <p>{explanation.whatToDo}</p>
                    </div>
                  </IonCol>
                ) : null}
                {explanation.dueOrDate ? (
                  <IonCol size="12">
                    <div className="explain-block">
                      <h2 className="explain-section-title">Date / deadline</h2>
                      <p>{explanation.dueOrDate}</p>
                    </div>
                  </IonCol>
                ) : null}
                {explanation.watchOut ? (
                  <IonCol size="12">
                    <div className="explain-block">
                      <h2 className="explain-section-title">Be careful / double-check</h2>
                      <p>{explanation.watchOut}</p>
                    </div>
                  </IonCol>
                ) : null}
              </IonRow>
            </IonGrid>
            <IonNote>Demo: this is static text. Later we’ll replace it with the real API but keep the same screen.</IonNote>
          </IonCardContent>
        </IonCard>
      ) : null}
    </PageWithMenu>
  );
};

export default ExplainMail;
