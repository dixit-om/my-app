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
import { Link, useHistory, useLocation } from 'react-router-dom';
import PageWithMenu from '../components/PageWithMenu';
import { login } from '../services/authApi';
import { friendlyAuthError } from '../services/authErrors';
import { useAuth } from '../auth/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [presentToast] = useIonToast();
  const [presentLoading, dismissLoading] = useIonLoading();
  const history = useHistory();
  const location = useLocation<{ from?: string }>();
  const { signInWithToken } = useAuth();

  const onLogin = async () => {
    if (!email.trim() || !password) {
      void presentToast({ message: 'Email and password are required.', duration: 2000, color: 'warning' });
      return;
    }
    setLoading(true);
    await presentLoading({ message: 'Signing you in…', spinner: 'crescent', backdropDismiss: false });
    try {
      const data = await login({ email: email.trim(), password });
      signInWithToken(data.idToken);
      void presentToast({ message: 'Welcome back.', duration: 1400, color: 'success' });
      const next = location.state?.from ?? '/home';
      history.replace(next);
    } catch (e: any) {
      void presentToast({ message: friendlyAuthError(e), duration: 3200, color: 'danger' });
    } finally {
      await dismissLoading();
      setLoading(false);
    }
  };

  return (
    <PageWithMenu title="Sign in" authMode contentClassName="ion-padding-bottom">
      <div className="relative animate-fin-fade">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ion-primary/12 to-transparent" />
        <div className="relative z-10">
          <div className="ion-padding-top ion-padding-horizontal fin-auth-wrap">
            <IonText color="medium">
              <p className="fin-auth-intro">Sign in to save your explanations and view your history.</p>
            </IonText>
            <IonList className="fin-auth-list" lines="none">
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
                  placeholder="••••••••"
                  onIonInput={(e) => setPassword(e.detail.value ?? '')}
                />
              </IonItem>
            </IonList>

            <IonButton
              expand="block"
              color="primary"
              onClick={onLogin}
              disabled={loading}
              className="fin-auth-cta"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </IonButton>

            <div className="fin-auth-foot">
              <IonNote>
                New here? <Link to="/signup">Create account</Link>
              </IonNote>
              <div className="fin-auth-foot-row">
                <IonNote>
                  Forgot password? <Link to="/forgot-password">Reset</Link>
                </IonNote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWithMenu>
  );
};

export default Login;
