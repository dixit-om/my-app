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
import { alertCircleOutline, notificationsOutline, speedometerOutline } from 'ionicons/icons';
import PageWithMenu from '../components/PageWithMenu';
import './Home.css';

const Home: React.FC = () => {
  return (
    <PageWithMenu title="finNotify" contentClassName="home-content">
      <div className="fin-notify-hero">
        <h1 className="fin-notify-title">Welcome back</h1>
        <IonText color="medium">
          <p className="fin-notify-tagline">Here is a quick snapshot. Everything below is sample data to show the flow of the app.</p>
        </IonText>
      </div>
      <IonGrid className="ion-no-padding home-stats">
        <IonRow>
          <IonCol size="4">
            <IonCard className="home-stat-card">
              <IonCardContent>
                <IonIcon icon={notificationsOutline} className="home-stat-icon" color="primary" />
                <div className="home-stat-value">2</div>
                <div className="home-stat-label">Unread</div>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol size="4">
            <IonCard className="home-stat-card">
              <IonCardContent>
                <IonIcon icon={alertCircleOutline} className="home-stat-icon" color="warning" />
                <div className="home-stat-value">1</div>
                <div className="home-stat-label">Due soon</div>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol size="4">
            <IonCard className="home-stat-card">
              <IonCardContent>
                <IonIcon icon={speedometerOutline} className="home-stat-icon" color="success" />
                <div className="home-stat-value">78%</div>
                <div className="home-stat-label">Budget</div>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
      <div className="ion-padding-horizontal ion-padding-bottom">
        <IonButton expand="block" color="primary" routerLink="/notifications" routerDirection="none">
          Open notification feed
        </IonButton>
        <IonButton
          expand="block"
          fill="outline"
          color="primary"
          className="ion-margin-top"
          routerLink="/settings"
          routerDirection="none"
        >
          Notification preferences
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
