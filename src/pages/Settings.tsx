import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonText,
  useIonLoading,
  useIonToast,
} from '@ionic/react';
import { logOutOutline, personCircleOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory as useRouterHistory } from 'react-router-dom';
import PageWithMenu from '../components/PageWithMenu';
import { useAuth } from '../auth/AuthContext';
import { usePreferences } from '../auth/PreferencesContext';
import type { ExplainLanguage } from '../types/explain';
import type { TextSize } from '../services/prefsApi';

const LANG_OPTIONS: Array<{ value: ExplainLanguage; label: string }> = [
  { value: 'en', label: 'English (simple words)' },
  { value: 'hi', label: 'हिंदी (Hindi)' },
  { value: 'ta', label: 'தமிழ் (Tamil)' },
  { value: 'mr', label: 'मराठी (Marathi)' },
  { value: 'te', label: 'తెలుగు (Telugu)' },
  { value: 'ml', label: 'മലയാളം (Malayalam)' },
  { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { value: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { value: 'bn', label: 'বাংলা (Bengali)' },
];

const Settings: React.FC = () => {
  const { user, signOut } = useAuth();
  const { prefs, updatePreferences } = usePreferences();
  const [presentToast] = useIonToast();
  const [presentLoading, dismissLoading] = useIonLoading();
  const router = useRouterHistory();
  const [savingLang, setSavingLang] = useState(false);
  const [savingSize, setSavingSize] = useState(false);

  const onChangeLanguage = async (next: ExplainLanguage) => {
    if (next === prefs.defaultLanguage) return;
    setSavingLang(true);
    try {
      await updatePreferences({ defaultLanguage: next });
      void presentToast({ message: 'Default language updated.', duration: 1400, color: 'success' });
    } catch (e: any) {
      void presentToast({ message: String(e?.message ?? 'Could not save'), duration: 2200, color: 'danger' });
    } finally {
      setSavingLang(false);
    }
  };

  const onChangeTextSize = async (next: TextSize) => {
    if (next === prefs.textSize) return;
    setSavingSize(true);
    try {
      await updatePreferences({ textSize: next });
    } catch (e: any) {
      void presentToast({ message: String(e?.message ?? 'Could not save'), duration: 2200, color: 'danger' });
    } finally {
      setSavingSize(false);
    }
  };

  const handleSignOut = async () => {
    await presentLoading({ message: 'Signing out…', spinner: 'crescent', backdropDismiss: false });
    try {
      signOut();
    } finally {
      await dismissLoading();
      router.replace('/welcome');
    }
  };

  return (
    <PageWithMenu title="Settings">
      <div className="ion-padding animate-fin-fade">
        <div className="fin-surface ion-padding">
          <h2 className="ion-no-margin">Preferences</h2>
          <IonText color="medium">
            <p className="ion-margin-top">Pick your default language and a comfortable text size.</p>
          </IonText>
        </div>
      </div>

      {user ? (
        <IonList inset className="ion-padding-horizontal">
          <IonListHeader>
            <IonLabel>Account</IonLabel>
          </IonListHeader>
          <IonItem lines="none" className="fin-list-item">
            <IonIcon slot="start" icon={personCircleOutline} color="medium" />
            <IonLabel>
              <h3>{user.name || 'Signed in'}</h3>
              {user.email ? <IonNote>{user.email}</IonNote> : null}
            </IonLabel>
          </IonItem>
        </IonList>
      ) : null}

      <IonList inset className="ion-padding-horizontal">
        <IonListHeader>
          <IonLabel>Language</IonLabel>
        </IonListHeader>
        <IonItem lines="none" className="fin-list-item">
          <IonLabel>
            <h3>Default explanation language</h3>
            <IonNote>Used every time you open "Understand a message".</IonNote>
          </IonLabel>
          <IonSelect
            slot="end"
            interface="action-sheet"
            value={prefs.defaultLanguage}
            disabled={savingLang}
            onIonChange={(e) => {
              const v = e.detail.value as ExplainLanguage | undefined;
              if (v) void onChangeLanguage(v);
            }}
          >
            {LANG_OPTIONS.map((opt) => (
              <IonSelectOption value={opt.value} key={opt.value}>
                {opt.label}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
      </IonList>

      <IonList inset className="ion-padding-horizontal">
        <IonListHeader>
          <IonLabel>Text size</IonLabel>
        </IonListHeader>
        <IonItem lines="none" className="fin-list-item">
          <IonLabel className="ion-text-wrap">
            <h3>Comfortable reading size</h3>
            <IonNote>Affects all pages in the app.</IonNote>
          </IonLabel>
        </IonItem>
        <div className="ion-padding-horizontal ion-padding-bottom">
          <IonSegment
            value={prefs.textSize}
            disabled={savingSize}
            onIonChange={(e) => {
              const v = e.detail.value;
              if (v === 'normal' || v === 'large' || v === 'xlarge') {
                void onChangeTextSize(v);
              }
            }}
          >
            <IonSegmentButton value="normal">
              <IonLabel>Normal</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="large">
              <IonLabel>Large</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="xlarge">
              <IonLabel>Extra Large</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>
      </IonList>

      <div className="ion-padding">
        <IonButton expand="block" color="medium" fill="outline" onClick={() => void handleSignOut()}>
          <IonIcon slot="start" icon={logOutOutline} />
          Sign out
        </IonButton>
      </div>
    </PageWithMenu>
  );
};

export default Settings;
