import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonText,
  useIonToast,
} from '@ionic/react';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PageWithMenu from '../components/PageWithMenu';
import { login } from '../services/authApi';
import { useAuth } from '../auth/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [presentToast] = useIonToast();
  const history = useHistory();
  const { signInWithToken } = useAuth();

  const onLogin = async () => {
    if (!email.trim() || !password) {
      void presentToast({ message: 'Email and password are required.', duration: 2000, color: 'warning' });
      return;
    }
    setLoading(true);
    try {
      const data = await login({ email: email.trim(), password });
      signInWithToken(data.idToken);
      void presentToast({ message: 'Signed in.', duration: 1400, color: 'success' });
      history.replace('/home');
    } catch (e: any) {
      void presentToast({ message: String(e?.message ?? 'Login failed'), duration: 2400, color: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWithMenu title="Sign in" contentClassName="ion-padding-bottom">
      <div className="ion-padding">
        <IonText color="medium">
          <p className="ion-no-margin">Sign in to save your explanations and view your history.</p>
        </IonText>
      </div>

      <IonList inset>
        <IonItem>
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput
            value={email}
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            onIonInput={(e) => setEmail(e.detail.value ?? '')}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput value={password} type="password" placeholder="••••••••" onIonInput={(e) => setPassword(e.detail.value ?? '')} />
        </IonItem>
      </IonList>

      <div className="ion-padding">
        <IonButton expand="block" color="primary" onClick={onLogin} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </IonButton>
        <div className="ion-text-center ion-margin-top">
          <IonNote>
            New here? <Link to="/signup">Create account</Link>
          </IonNote>
          <div className="ion-margin-top">
            <IonNote>
              Forgot password? <Link to="/forgot-password">Reset</Link>
            </IonNote>
          </div>
        </div>
      </div>
    </PageWithMenu>
  );
};

export default Login;

