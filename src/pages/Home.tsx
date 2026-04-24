import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { MAIN_CONTENT_ID } from '../components/AppMenu';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage id={MAIN_CONTENT_ID}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>finNotify</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="home-content">
        <div className="fin-notify-hero">
          <h1 className="fin-notify-title">finNotify</h1>
          <IonText color="medium">
            <p className="fin-notify-tagline">Stay on top of alerts, reminders, and what matters to you.</p>
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
