import { IonButton, IonContent, IonPage, IonText } from '@ionic/react';
import { Link } from 'react-router-dom';
import './Welcome.css';

const Welcome: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen className="welcome-content">
        <div className="relative min-h-full bg-ion-base">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ion-primary/15 via-ion-base to-ion-base" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35] bg-[radial-gradient(ellipse_80%_45%_at_50%_0%,var(--ion-color-primary),transparent_70%)]"
            aria-hidden="true"
          />
          <div className="welcome-wrap ion-padding relative z-10 animate-fin-fade">
            <div className="welcome-logo shadow-soft-lg" aria-hidden="true">
              fn
            </div>
            <h1 className="welcome-title">finNotify</h1>
            <IonText color="medium">
              <p className="welcome-subtitle">
                Turn formal bank, insurance, and policy messages into simple explanations—in your language.
              </p>
            </IonText>
            <div className="welcome-actions">
              <Link to="/login" className="welcome-link">
                <IonButton expand="block" color="primary">
                  Sign in
                </IonButton>
              </Link>
              <Link to="/signup" className="welcome-link">
                <IonButton expand="block" fill="outline" color="primary" className="ion-margin-top">
                  Create account
                </IonButton>
              </Link>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Welcome;

