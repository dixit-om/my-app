import { IonButton, IonContent, IonIcon, IonPage, IonText } from '@ionic/react';
import { documentTextOutline, languageOutline, volumeMediumOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import './Welcome.css';

const Welcome: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen className="welcome-content">
        <div className="welcome-shell">
          <div className="welcome-bg-blob welcome-bg-blob-1" aria-hidden="true" />
          <div className="welcome-bg-blob welcome-bg-blob-2" aria-hidden="true" />
          <div className="welcome-wrap ion-padding animate-fin-fade">
            <div className="welcome-logo" aria-hidden="true">
              <span>fn</span>
            </div>
            <h1 className="welcome-title">finNotify</h1>
            <IonText color="medium">
              <p className="welcome-subtitle">
                Turn formal bank, insurance and policy messages into simple, clear explanations — in the language you understand.
              </p>
            </IonText>

            <div className="welcome-features">
              <div className="welcome-feature">
                <div className="welcome-feature-icon" aria-hidden="true">
                  <IonIcon icon={documentTextOutline} />
                </div>
                <div className="welcome-feature-text">
                  <strong>Paste any message</strong>
                  <span>Bank, insurance, policy, SMS or email.</span>
                </div>
              </div>
              <div className="welcome-feature">
                <div className="welcome-feature-icon" aria-hidden="true">
                  <IonIcon icon={languageOutline} />
                </div>
                <div className="welcome-feature-text">
                  <strong>9 Indian languages</strong>
                  <span>Hindi, Marathi, Tamil, Bengali and more.</span>
                </div>
              </div>
              <div className="welcome-feature">
                <div className="welcome-feature-icon" aria-hidden="true">
                  <IonIcon icon={volumeMediumOutline} />
                </div>
                <div className="welcome-feature-text">
                  <strong>Listen aloud</strong>
                  <span>Hear the simple version in your language.</span>
                </div>
              </div>
            </div>

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
