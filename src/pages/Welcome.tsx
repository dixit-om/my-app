import { IonButton, IonContent, IonPage, IonText } from '@ionic/react';
import { Link } from 'react-router-dom';
import './Welcome.css';

const Welcome: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen className="welcome-content">
        <div className="welcome-wrap ion-padding">
          <div className="welcome-logo" aria-hidden="true">
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
      </IonContent>
    </IonPage>
  );
};

export default Welcome;

