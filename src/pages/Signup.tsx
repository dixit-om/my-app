import { IonButton, IonInput, IonItem, IonLabel, IonList, IonNote, IonText, useIonLoading, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PageWithMenu from '../components/PageWithMenu';
import { login, signup } from '../services/authApi';
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
      void presentToast({ message: String(e?.message ?? 'Signup failed'), duration: 2400, color: 'danger' });
    } finally {
      await dismissLoading();
      setLoading(false);
    }
  };

  return (
    <PageWithMenu title="Create account" authMode contentClassName="ion-padding-bottom">
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ion-primary/12 to-transparent" />
        <div className="relative z-10 animate-fin-fade">
      <div className="ion-padding">
        <IonText color="medium">
          <p className="ion-no-margin text-center max-w-sm mx-auto">Create an account so your explanations are saved in your private history.</p>
        </IonText>
      </div>

      <div className="max-w-md mx-auto px-4 pb-2">
        <div className="rounded-2xl border border-black/10 ion-dark:border-white/10 bg-white/50 ion-dark:bg-black/25 p-1 shadow-soft-lg backdrop-blur-[6px]">
      <IonList className="fin-auth-list" lines="none">
        <IonItem lines="none">
          <IonLabel position="stacked">Name (optional)</IonLabel>
          <IonInput value={displayName} placeholder="Your name" onIonInput={(e) => setDisplayName(e.detail.value ?? '')} />
        </IonItem>
        <IonItem lines="none">
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput value={email} type="email" inputMode="email" placeholder="you@example.com" onIonInput={(e) => setEmail(e.detail.value ?? '')} />
        </IonItem>
        <IonItem lines="none">
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput value={password} type="password" placeholder="Create a password" onIonInput={(e) => setPassword(e.detail.value ?? '')} />
        </IonItem>
      </IonList>
        </div>
      </div>

      <div className="ion-padding">
        <IonButton expand="block" color="primary" onClick={onSignup} disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </IonButton>
        <div className="ion-text-center ion-margin-top">
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

