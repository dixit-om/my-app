import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRow,
  IonText,
} from '@ionic/react';
import { alertCircleOutline, documentTextOutline, notificationsOutline } from 'ionicons/icons';
import PageWithMenu from '../components/PageWithMenu';
import './Home.css';

const Home: React.FC = () => {
  return (
    <PageWithMenu title="finNotify" contentClassName="home-content">
      <div className="fin-notify-hero">
        <h1 className="fin-notify-title">Make messages simple</h1>
        <IonText color="medium">
          <p className="fin-notify-tagline">
            Paste a bank / insurance / policy message and get a clear, short explanation in the language you choose.
            This is a demo UI now—API will be connected next.
          </p>
        </IonText>
      </div>
      <IonCard className="ion-margin-horizontal home-primary-card">
        <IonCardContent>
          <div className="home-primary-head">
            <IonIcon icon={documentTextOutline} className="home-primary-icon" color="primary" />
            <div>
              <div className="home-primary-title">Understand a message</div>
              <IonText color="medium">
                <p className="home-primary-subtitle">Paste text → choose language → get the plain meaning.</p>
              </IonText>
            </div>
          </div>
          <IonButton expand="block" color="primary" routerLink="/explain" routerDirection="none">
            Paste &amp; explain (demo)
          </IonButton>
        </IonCardContent>
      </IonCard>
      <IonGrid className="ion-no-padding home-stats">
        <IonRow>
          <IonCol size="4">
            <IonCard className="home-stat-card">
              <IonCardContent>
                <IonIcon icon={documentTextOutline} className="home-stat-icon" color="primary" />
                <div className="home-stat-value">1</div>
                <div className="home-stat-label">Explained</div>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol size="4">
            <IonCard className="home-stat-card">
              <IonCardContent>
                <IonIcon icon={notificationsOutline} className="home-stat-icon" color="warning" />
                <div className="home-stat-value">2</div>
                <div className="home-stat-label">Unread</div>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol size="4">
            <IonCard className="home-stat-card">
              <IonCardContent>
                <IonIcon icon={alertCircleOutline} className="home-stat-icon" color="success" />
                <div className="home-stat-value">1</div>
                <div className="home-stat-label">Due soon</div>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonListHeader className="ion-padding-horizontal">
        <IonLabel>Quick actions</IonLabel>
      </IonListHeader>
      <div className="ion-padding-horizontal ion-padding-bottom">
        <IonButton expand="block" color="primary" routerLink="/notifications" routerDirection="none">
          Open notification feed
        </IonButton>
        <IonButton expand="block" fill="outline" color="primary" className="ion-margin-top" routerLink="/settings" routerDirection="none">
          Settings
        </IonButton>
      </div>
      <IonListHeader className="ion-padding-horizontal">
        <IonLabel>Recent activity</IonLabel>
      </IonListHeader>
      <IonList inset>
        <IonItem lines="none" detail>
          <IonLabel>
            <h3>Card payment scheduled</h3>
            <p>₹2,400 — due in 3 days</p>
          </IonLabel>
        </IonItem>
        <IonItem lines="none" detail>
          <IonLabel>
            <h3>SIP debit</h3>
            <p>Equity fund — runs tomorrow</p>
          </IonLabel>
        </IonItem>
        <IonItem lines="none" detail>
          <IonLabel>
            <h3>Weekly review</h3>
            <p>Spending vs last week</p>
          </IonLabel>
        </IonItem>
      </IonList>
    </PageWithMenu>
  );
};

export default Home;
