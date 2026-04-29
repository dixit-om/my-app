import { IonItem, IonLabel, IonList, IonListHeader, IonSelect, IonSelectOption, IonToggle } from '@ionic/react';
import { useState } from 'react';
import PageWithMenu from '../components/PageWithMenu';

const Settings: React.FC = () => {
  const [push, setPush] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [categoryAlerts, setCategoryAlerts] = useState(true);
  const [reminderHrs, setReminderHrs] = useState('24h');

  return (
    <PageWithMenu title="Settings">
      <div className="ion-padding animate-fin-fade">
        <div className="fin-surface ion-padding">
          <h2 className="ion-no-margin">Preferences</h2>
          <p className="ion-text-color-medium ion-margin-top">Manage reminders and notification behavior.</p>
        </div>
      </div>
      <IonList inset className="ion-padding-horizontal">
        <IonListHeader>
          <IonLabel>Alerts &amp; reminders</IonLabel>
        </IonListHeader>
        <IonItem lines="none" className="fin-list-item">
          <IonLabel>Push notifications</IonLabel>
          <IonToggle slot="end" checked={push} onIonChange={(e) => setPush(e.detail.checked)} />
        </IonItem>
        <IonItem lines="none" className="fin-list-item">
          <IonLabel>Email digest</IonLabel>
          <IonToggle slot="end" checked={emailDigest} onIonChange={(e) => setEmailDigest(e.detail.checked)} />
        </IonItem>
        <IonItem lines="none" className="fin-list-item">
          <IonLabel>Weekly spending summary</IonLabel>
          <IonToggle
            slot="end"
            checked={weeklySummary}
            onIonChange={(e) => setWeeklySummary(e.detail.checked)}
          />
        </IonItem>
        <IonItem lines="none" className="fin-list-item">
          <IonLabel>Over-budget category warnings</IonLabel>
          <IonToggle
            slot="end"
            checked={categoryAlerts}
            onIonChange={(e) => setCategoryAlerts(e.detail.checked)}
          />
        </IonItem>
        <IonItem lines="none" className="fin-list-item">
          <IonLabel>Default bill reminder</IonLabel>
          <IonSelect
            value={reminderHrs}
            interface="action-sheet"
            placeholder="Choose"
            onIonChange={(e) => {
              if (e.detail.value != null) {
                setReminderHrs(String(e.detail.value));
              }
            }}
            slot="end"
          >
            <IonSelectOption value="6h">6 hours before</IonSelectOption>
            <IonSelectOption value="24h">1 day before</IonSelectOption>
            <IonSelectOption value="72h">3 days before</IonSelectOption>
          </IonSelect>
        </IonItem>
      </IonList>
    </PageWithMenu>
  );
};

export default Settings;
