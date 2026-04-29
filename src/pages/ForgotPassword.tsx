import { IonButton, IonInput, IonItem, IonLabel, IonList, IonNote, IonText, useIonLoading, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageWithMenu from '../components/PageWithMenu';
import { forgotPassword } from '../services/authApi';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [presentToast] = useIonToast();
  const [presentLoading, dismissLoading] = useIonLoading();

  const onReset = async () => {
    if (!email.trim()) {
      void presentToast({ message: 'Email is required.', duration: 2000, color: 'warning' });
      return;
    }
    setLoading(true);
    await presentLoading({ message: 'Sending reset link…', spinner: 'crescent', backdropDismiss: false });
    try {
      await forgotPassword({ email: email.trim() });
      void presentToast({ message: 'Check your email for the reset link.', duration: 2800, color: 'success' });
    } catch (e: any) {
      void presentToast({ message: String(e?.message ?? 'Reset failed'), duration: 2400, color: 'danger' });
    } finally {
      await dismissLoading();
      setLoading(false);
    }
  };

  return (
    <PageWithMenu title="Reset password" authMode contentClassName="ion-padding-bottom">
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ion-primary/12 to-transparent" />
        <div className="relative z-10 animate-fin-fade">
      <div className="ion-padding">
        <IonText color="medium">
          <p className="ion-no-margin text-center max-w-sm mx-auto">Enter your email. We will send a reset link.</p>
        </IonText>
      </div>

      <div className="max-w-md mx-auto px-4 pb-2">
        <div className="rounded-2xl border border-black/10 ion-dark:border-white/10 bg-white/50 ion-dark:bg-black/25 p-1 shadow-soft-lg backdrop-blur-[6px]">
      <IonList className="fin-auth-list" lines="none">
        <IonItem lines="none">
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput value={email} type="email" inputMode="email" placeholder="you@example.com" onIonInput={(e) => setEmail(e.detail.value ?? '')} />
        </IonItem>
      </IonList>
        </div>
      </div>

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
        </div>
      </div>
    </PageWithMenu>
  );
};

export default ForgotPassword;

