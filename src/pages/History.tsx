import {
  IonAlert,
  IonBadge,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonText,
  useIonToast,
} from '@ionic/react';
import { documentTextOutline, refreshOutline, trashOutline } from 'ionicons/icons';
import type { RefresherEventDetail } from '@ionic/react';
import { useCallback, useEffect, useState } from 'react';
import { useHistory as useRouterHistory } from 'react-router-dom';
import PageWithMenu from '../components/PageWithMenu';
import type { HistoryItem } from '../services/historyApi';
import { deleteHistoryItem, getHistory } from '../services/historyApi';

const LANG_LABEL: Record<string, string> = {
  en: 'English',
  hi: 'हिंदी',
  ta: 'தமிழ்',
  mr: 'मराठी',
  te: 'తెలుగు',
  ml: 'മലയാളം',
  kn: 'ಕನ್ನಡ',
  gu: 'ગુજરાતી',
  bn: 'বাংলা',
};

function formatTime(ms: number | null): string {
  if (!ms) return '';
  try {
    const d = new Date(ms);
    const today = new Date();
    const sameDay = d.toDateString() === today.toDateString();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();
    const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    if (sameDay) return `Today · ${time}`;
    if (isYesterday) return `Yesterday · ${time}`;
    return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

const HistoryPage: React.FC = () => {
  const [items, setItems] = useState<HistoryItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<HistoryItem | null>(null);
  const [presentToast] = useIonToast();
  const router = useRouterHistory();

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await getHistory(30);
      setItems(data);
    } catch (e: any) {
      setError(String(e?.message ?? 'history_failed'));
      setItems([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onRefresh = useCallback(
    async (e: CustomEvent<RefresherEventDetail>) => {
      await load();
      e.detail.complete();
    },
    [load]
  );

  const onOpen = useCallback(
    (item: HistoryItem) => {
      router.push(`/explain/${encodeURIComponent(item.id)}`);
    },
    [router]
  );

  const onConfirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setPendingDelete(null);
    try {
      await deleteHistoryItem(id);
      setItems((curr) => (curr ? curr.filter((it) => it.id !== id) : curr));
      void presentToast({ message: 'Deleted.', duration: 1400, color: 'success' });
    } catch (e: any) {
      void presentToast({ message: String(e?.message ?? 'delete_failed'), duration: 2400, color: 'danger' });
    }
  }, [pendingDelete, presentToast]);

  return (
    <PageWithMenu title="History">
      <IonRefresher slot="fixed" onIonRefresh={onRefresh}>
        <IonRefresherContent />
      </IonRefresher>
      <div className="ion-padding animate-fin-fade">
        <div className="fin-surface ion-padding">
          <h2 className="ion-no-margin">Past explanations</h2>
          <IonText color="medium">
            <p className="ion-margin-top">All messages you have explained, saved safely. Tap any item to open it again.</p>
          </IonText>
        </div>
      </div>

      {items === null ? (
        <div className="ion-padding ion-text-center">
          <IonSpinner name="crescent" />
        </div>
      ) : items.length === 0 ? (
        <div className="ion-padding ion-text-center fin-history-empty">
          <IonIcon icon={documentTextOutline} className="fin-history-empty-icon" color="medium" />
          <h3>No history yet</h3>
          <IonText color="medium">
            <p>When you explain a message, it appears here so you can read it later.</p>
          </IonText>
          <IonButton routerLink="/explain" routerDirection="none" color="primary" className="ion-margin-top">
            Explain a message
          </IonButton>
        </div>
      ) : (
        <IonList inset className="ion-padding-horizontal">
          {items.map((item) => (
            <IonItem key={item.id} button lines="none" detail={false} className="fin-list-item" onClick={() => onOpen(item)}>
              <IonLabel className="ion-text-wrap">
                <h2>{item.result?.simpleTitle || 'Explanation'}</h2>
                <p>{item.result?.summary || (item.inputText ? item.inputText.slice(0, 120) : '')}</p>
                <div className="fin-history-meta">
                  <IonNote>{formatTime(item.createdAt)}</IonNote>
                  <IonBadge color="medium">{LANG_LABEL[item.language] || item.language}</IonBadge>
                </div>
              </IonLabel>
              <IonButton
                slot="end"
                fill="clear"
                color="medium"
                aria-label="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  setPendingDelete(item);
                }}
              >
                <IonIcon slot="icon-only" icon={trashOutline} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      )}

      {error ? (
        <div className="ion-padding ion-text-center">
          <IonText color="danger">
            <p>Couldn't load history. Please try again.</p>
          </IonText>
          <IonButton fill="outline" color="medium" onClick={() => void load()}>
            <IonIcon slot="start" icon={refreshOutline} />
            Retry
          </IonButton>
        </div>
      ) : null}

      <IonAlert
        isOpen={pendingDelete !== null}
        onDidDismiss={() => setPendingDelete(null)}
        header="Delete this explanation?"
        message="It will be removed from your history."
        buttons={[
          { text: 'Cancel', role: 'cancel' },
          { text: 'Delete', role: 'destructive', handler: () => void onConfirmDelete() },
        ]}
      />
    </PageWithMenu>
  );
};

export default HistoryPage;
