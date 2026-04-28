import { IonButton, IonInput, IonItem, IonLabel, IonList, IonNote, IonText, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageWithMenu from '../components/PageWithMenu';
import { forgotPassword } from '../services/authApi';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [presentToast] = useIonToast();

  const onReset = async () => {
    if (!email.trim()) {
      void presentToast({ message: 'Email is required.', duration: 2000, color: 'warning' });
      return;
    }
    setLoading(true);
    try {
      await forgotPassword({ email: email.trim() });
      void presentToast({ message: 'Password reset email sent (if the account exists).', duration: 2600, color: 'success' });
    } catch (e: any) {
      void presentToast({ message: String(e?.message ?? 'Reset failed'), duration: 2400, color: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWithMenu title="Reset password" contentClassName="ion-padding-bottom">
      <div className="ion-padding">
        <IonText color="medium">
          <p className="ion-no-margin">Enter your email. We will send a reset link.</p>
        </IonText>
      </div>

      <IonList inset>
        <IonItem>
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput value={email} type="email" inputMode="email" placeholder="you@example.com" onIonInput={(e) => setEmail(e.detail.value ?? '')} />
        </IonItem>
      </IonList>

      <div className="ion-padding">
        <IonButton expand="block" color="primary" onClick={onReset} disabled={loading}>
          {loading ? 'Sending…' : 'Send reset email'}
        </IonButton>
        <div className="ion-text-center ion-margin-top">
          <IonNote>
            Back to <Link to="/login">sign in</Link>
          </IonNote>
        </div>
      </div>
    </PageWithMenu>
  );
};

export default ForgotPassword;

