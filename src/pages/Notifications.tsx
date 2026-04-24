import {
  IonBadge,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { useMemo, useState } from 'react';
import PageWithMenu from '../components/PageWithMenu';

type FeedItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
};

const FEED: FeedItem[] = [
  { id: '1', title: 'Upcoming card payment', detail: '₹2,400 due in 3 days', time: 'Today · 9:12', unread: true },
  { id: '2', title: 'SIP reminder', detail: 'Monthly auto-debit tomorrow', time: 'Today · 8:00', unread: true },
  { id: '3', title: 'Spending cap', detail: 'Dining 80% of your weekly limit', time: 'Yesterday', unread: false },
  { id: '4', title: 'Statement ready', detail: 'March credit card summary', time: '2 Apr', unread: false },
];

const Notifications: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const rows = useMemo(() => {
    if (filter === 'unread') {
      return FEED.filter((r) => r.unread);
    }
    return FEED;
  }, [filter]);

  return (
    <PageWithMenu title="Notifications">
      <div className="ion-padding">
        <h2 className="ion-no-margin">Your feed</h2>
        <p className="ion-text-color-medium">Finances and alerts in one list</p>
        <IonSegment
          className="ion-margin-top"
          value={filter}
          onIonChange={(e) => {
            const v = e.detail.value;
            if (v === 'all' || v === 'unread') {
              setFilter(v);
            }
          }}
        >
          <IonSegmentButton value="all">
            <IonLabel>All</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="unread">
            <IonLabel>Unread</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </div>
      <IonList inset>
        {rows.map((row) => (
          <IonItem key={row.id} button detail>
            <IonLabel>
              <h2>
                {row.title}
                {row.unread ? <IonBadge color="primary" className="ion-margin-start">New</IonBadge> : null}
              </h2>
              <p>{row.detail}</p>
            </IonLabel>
            <IonNote slot="end" className="ion-text-wrap" style={{ maxWidth: '6.5rem' }}>
              {row.time}
            </IonNote>
          </IonItem>
        ))}
      </IonList>
    </PageWithMenu>
  );
};

export default Notifications;
