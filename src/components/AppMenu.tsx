import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {
  documentTextOutline,
  homeOutline,
  settingsOutline,
  timeOutline,
} from 'ionicons/icons';
import { useAuth } from '../auth/AuthContext';

const MAIN_CONTENT_ID = 'main';

const AppMenu: React.FC = () => {
  const { user } = useAuth();

  return (
    <IonMenu contentId={MAIN_CONTENT_ID} side="start" type="overlay">
      <IonHeader>
        <IonToolbar className="fin-menu-header">
          <IonTitle>finNotify</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="fin-menu-content">
        {user ? (
          <div className="fin-menu-user">
            <div className="fin-menu-user-avatar" aria-hidden="true">
              {(user.name || user.email || 'U').slice(0, 1).toUpperCase()}
            </div>
            <div className="fin-menu-user-meta">
              <div className="fin-menu-user-name">{user.name || 'Welcome'}</div>
              {user.email ? <IonNote className="fin-menu-user-email">{user.email}</IonNote> : null}
            </div>
          </div>
        ) : null}
        <IonList className="fin-menu-list">
          <IonListHeader>
            <IonLabel>Menu</IonLabel>
          </IonListHeader>
          <IonMenuToggle autoHide>
            <IonItem routerLink="/home" routerDirection="none" detail={false} lines="full">
              <IonIcon slot="start" icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle autoHide>
            <IonItem routerLink="/explain" routerDirection="none" detail={false} lines="full">
              <IonIcon slot="start" icon={documentTextOutline} />
              <IonLabel>Understand a message</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle autoHide>
            <IonItem routerLink="/history" routerDirection="none" detail={false} lines="full">
              <IonIcon slot="start" icon={timeOutline} />
              <IonLabel>History</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle autoHide>
            <IonItem routerLink="/settings" routerDirection="none" detail={false} lines="none">
              <IonIcon slot="start" icon={settingsOutline} />
              <IonLabel>Settings</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export { AppMenu, MAIN_CONTENT_ID };
