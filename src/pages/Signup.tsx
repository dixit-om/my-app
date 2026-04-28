import { IonButton, IonInput, IonItem, IonLabel, IonList, IonNote, IonText, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import PageWithMenu from '../components/PageWithMenu';
import { signup } from '../services/authApi';

const Signup: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [presentToast] = useIonToast();
  const history = useHistory();

  const onSignup = async () => {
    if (!email.trim() || !password) {
      void presentToast({ message: 'Email and password are required.', duration: 2000, color: 'warning' });
      return;
    }
    setLoading(true);
    try {
      await signup({ email: email.trim(), password, displayName: displayName.trim() || undefined });
      void presentToast({ message: 'Account created. Please sign in.', duration: 1800, color: 'success' });
      history.replace('/login');
    } catch (e: any) {
      void presentToast({ message: String(e?.message ?? 'Signup failed'), duration: 2400, color: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWithMenu title="Create account" contentClassName="ion-padding-bottom">
      <div className="ion-padding">
        <IonText color="medium">
          <p className="ion-no-margin">Create an account so your explanations are saved in your private history.</p>
        </IonText>
      </div>

      <IonList inset>
        <IonItem>
          <IonLabel position="stacked">Name (optional)</IonLabel>
          <IonInput value={displayName} placeholder="Your name" onIonInput={(e) => setDisplayName(e.detail.value ?? '')} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput value={email} type="email" inputMode="email" placeholder="you@example.com" onIonInput={(e) => setEmail(e.detail.value ?? '')} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput value={password} type="password" placeholder="Create a password" onIonInput={(e) => setPassword(e.detail.value ?? '')} />
        </IonItem>
      </IonList>

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
    </PageWithMenu>
  );
};

export default Signup;

