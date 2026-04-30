import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonSpinner,
  IonText,
} from '@ionic/react';
import {
  arrowForward,
  documentTextOutline,
  shieldCheckmarkOutline,
  sparklesOutline,
  timeOutline,
  volumeMediumOutline,
} from 'ionicons/icons';
import { useCallback, useEffect, useState } from 'react';
import { useHistory as useRouterHistory } from 'react-router-dom';
import PageWithMenu from '../components/PageWithMenu';
import { useAuth } from '../auth/AuthContext';
import type { HistoryItem } from '../services/historyApi';
import { getHistory } from '../services/historyApi';
import './Home.css';

const LANG_LABEL: Record<string, string> = {
  en: 'English',
  hi: 'हिंदी',
  ta: 'தமிழ்',
  mr: 'मराठी',
  te: 'తెలుగు',
  ml: 'മലയാളം',
  kn: 'ಕನ್ನಡ',
  gu: 'ગુજરાતી',
  bn: 'বাংলা',
};

function formatTime(ms: number | null): string {
  if (!ms) return '';
  try {
    const d = new Date(ms);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return `Today · ${d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    }
    return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
  } catch {
    return '';
  }
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const router = useRouterHistory();
  const [recent, setRecent] = useState<HistoryItem[] | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await getHistory(3);
      setRecent(data);
    } catch {
      setRecent([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const greeting = user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome back';

  return (
    <PageWithMenu title="finNotify" contentClassName="home-content">
      <div className="home-bg">
        <div className="home-hero animate-fin-fade">
          <IonText className="home-greeting" color="medium">
            <p>{greeting}</p>
          </IonText>
          <h1 className="home-title">Make formal messages simple</h1>
          <IonText color="medium">
            <p className="home-tagline">
              Paste a bank, insurance, or policy message. We'll explain what it really means in your chosen language —
              short and clear.
            </p>
          </IonText>
        </div>

        <IonCard className="ion-margin-horizontal home-primary-card animate-fin-fade fin-surface">
          <IonCardContent>
            <div className="home-primary-head">
              <div className="home-primary-icon-wrap" aria-hidden="true">
                <IonIcon icon={documentTextOutline} className="home-primary-icon" />
              </div>
              <div className="home-primary-text">
                <div className="home-primary-title">Understand a message</div>
                <IonText color="medium">
                  <p className="home-primary-subtitle">Paste it in any language. Get a plain explanation.</p>
                </IonText>
              </div>
            </div>
            <IonButton expand="block" color="primary" routerLink="/explain" routerDirection="none" className="home-primary-cta">
              Paste &amp; explain
              <IonIcon slot="end" icon={arrowForward} />
            </IonButton>
          </IonCardContent>
        </IonCard>

        <div className="home-features">
          <div className="home-feature">
            <IonIcon icon={sparklesOutline} className="home-feature-icon" />
            <div>
              <div className="home-feature-title">AI-powered</div>
              <IonNote>Smart, simple summaries</IonNote>
            </div>
          </div>
          <div className="home-feature">
            <IonIcon icon={volumeMediumOutline} className="home-feature-icon" />
            <div>
              <div className="home-feature-title">Listen aloud</div>
              <IonNote>Hear in your language</IonNote>
            </div>
          </div>
          <div className="home-feature">
            <IonIcon icon={shieldCheckmarkOutline} className="home-feature-icon" />
            <div>
              <div className="home-feature-title">Saved privately</div>
              <IonNote>Only you see history</IonNote>
            </div>
          </div>
        </div>

        <IonListHeader className="ion-padding-horizontal home-section-head">
          <IonLabel>
            <h2>Recent explanations</h2>
          </IonLabel>
          <IonButton
            fill="clear"
            size="small"
            routerLink="/history"
            routerDirection="none"
          >
            View all
          </IonButton>
        </IonListHeader>

        {recent === null ? (
          <div className="ion-padding ion-text-center">
            <IonSpinner name="crescent" />
          </div>
        ) : recent.length === 0 ? (
          <div className="home-empty ion-padding-horizontal ion-padding-bottom">
            <IonIcon icon={timeOutline} className="home-empty-icon" />
            <IonText color="medium">
              <p>Nothing here yet. Explain your first message — it will be saved here.</p>
            </IonText>
            <IonButton expand="block" fill="outline" color="primary" routerLink="/explain" routerDirection="none">
              Try it now
            </IonButton>
          </div>
        ) : (
          <IonList inset className="ion-padding-horizontal">
            {recent.map((item) => (
              <IonItem
                key={item.id}
                button
                detail
                lines="none"
                className="fin-list-item"
                routerLink={`/explain/${encodeURIComponent(item.id)}`}
                routerDirection="none"
              >
                <IonLabel className="ion-text-wrap">
                  <h3>{item.result?.simpleTitle || 'Explanation'}</h3>
                  <p>{item.result?.summary || (item.inputText ? item.inputText.slice(0, 100) : '')}</p>
                  <div className="home-recent-meta">
                    <IonNote>{formatTime(item.createdAt)}</IonNote>
                    <IonBadge color="medium">{LANG_LABEL[item.language] || item.language}</IonBadge>
                  </div>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </div>
    </PageWithMenu>
  );
};

export default Home;
