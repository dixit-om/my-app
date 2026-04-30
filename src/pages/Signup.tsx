import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonText,
  useIonLoading,
  useIonToast,
} from '@ionic/react';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PageWithMenu from '../components/PageWithMenu';
import { login, signup } from '../services/authApi';
import { friendlyAuthError } from '../services/authErrors';
import { useAuth } from '../auth/AuthContext';

const Signup: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [presentToast] = useIonToast();
  const [presentLoading, dismissLoading] = useIonLoading();
  const history = useHistory();
  const { signInWithToken } = useAuth();

  const onSignup = async () => {
    if (!email.trim() || !password) {
      void presentToast({ message: 'Email and password are required.', duration: 2000, color: 'warning' });
      return;
    }
    setLoading(true);
    const trimmedEmail = email.trim();
    await presentLoading({ message: 'Creating your account…', spinner: 'crescent', backdropDismiss: false });
    try {
      await signup({ email: trimmedEmail, password, displayName: displayName.trim() || undefined });
      await dismissLoading();
      await presentLoading({ message: 'Signing you in…', spinner: 'crescent', backdropDismiss: false });
      try {
        const data = await login({ email: trimmedEmail, password });
        signInWithToken(data.idToken);
        void presentToast({ message: 'You are signed in.', duration: 1600, color: 'success' });
        history.replace('/home');
      } catch {
        void presentToast({ message: 'Account created. Please sign in with your password.', duration: 2600, color: 'warning' });
        history.replace('/login');
      }
    } catch (e: any) {
      void presentToast({ message: friendlyAuthError(e), duration: 3200, color: 'danger' });
    } finally {
      await dismissLoading();
      setLoading(false);
    }
  };

  return (
    <PageWithMenu title="Create account" authMode contentClassName="ion-padding-bottom">
      <div className="relative animate-fin-fade">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ion-primary/12 to-transparent" />
        <div className="relative z-10">
          <div className="ion-padding-top ion-padding-horizontal fin-auth-wrap">
            <IonText color="medium">
              <p className="fin-auth-intro">Create an account so your explanations are saved in your private history.</p>
            </IonText>
            <IonList className="fin-auth-list" lines="none">
              <IonItem lines="none">
                <IonLabel position="stacked">Name (optional)</IonLabel>
                <IonInput
                  value={displayName}
                  placeholder="Your name"
                  onIonInput={(e) => setDisplayName(e.detail.value ?? '')}
                />
              </IonItem>
              <IonItem lines="none">
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  value={email}
                  type="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  onIonInput={(e) => setEmail(e.detail.value ?? '')}
                />
              </IonItem>
              <IonItem lines="none">
                <IonLabel position="stacked">Password</IonLabel>
                <IonInput
                  value={password}
                  type="password"
                  placeholder="Create a password"
                  onIonInput={(e) => setPassword(e.detail.value ?? '')}
                />
              </IonItem>
            </IonList>

            <IonButton
              expand="block"
              color="primary"
              onClick={onSignup}
              disabled={loading}
              className="fin-auth-cta"
            >
              {loading ? 'Creating…' : 'Create account'}
            </IonButton>

            <div className="fin-auth-foot">
              <IonNote>
                Already have an account? <Link to="/login">Sign in</Link>
              </IonNote>
            </div>
          </div>
        </div>
      </div>
    </PageWithMenu>
  );
};

export default Signup;
