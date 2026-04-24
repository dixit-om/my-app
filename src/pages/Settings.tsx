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
      <IonList inset>
        <IonListHeader>
          <IonLabel>Alerts &amp; reminders</IonLabel>
        </IonListHeader>
        <IonItem>
          <IonLabel>Push notifications</IonLabel>
          <IonToggle slot="end" checked={push} onIonChange={(e) => setPush(e.detail.checked)} />
        </IonItem>
        <IonItem>
          <IonLabel>Email digest</IonLabel>
          <IonToggle slot="end" checked={emailDigest} onIonChange={(e) => setEmailDigest(e.detail.checked)} />
        </IonItem>
        <IonItem>
          <IonLabel>Weekly spending summary</IonLabel>
          <IonToggle
            slot="end"
            checked={weeklySummary}
            onIonChange={(e) => setWeeklySummary(e.detail.checked)}
          />
        </IonItem>
        <IonItem>
          <IonLabel>Over-budget category warnings</IonLabel>
          <IonToggle
            slot="end"
            checked={categoryAlerts}
            onIonChange={(e) => setCategoryAlerts(e.detail.checked)}
          />
        </IonItem>
        <IonItem>
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
