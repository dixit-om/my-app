import {
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonTitle,
  IonToolbar,
  useIonLoading,
} from '@ionic/react';
import type { FC, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { arrowBackOutline, personCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { MAIN_CONTENT_ID } from './AppMenu';
import { useAuth } from '../auth/AuthContext';

type PageWithMenuProps = {
  title: string;
  children: ReactNode;
  contentClassName?: string;
  /** Login/signup/forgot: show Back to Welcome instead of menu (no floating menu without drawer). */
  authMode?: boolean;
};

const PageWithMenu: FC<PageWithMenuProps> = ({ title, children, contentClassName, authMode }) => {
  const { isAuthed, user, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileLabel = useMemo(() => user?.name || user?.email || 'Profile', [user]);
  const history = useHistory();
  const [presentLoading, dismissLoading] = useIonLoading();

  const handleSignOut = () => {
    void (async () => {
      setProfileOpen(false);
      await presentLoading({ message: 'Signing out…', spinner: 'crescent', backdropDismiss: false });
      try {
        signOut();
      } finally {
        await dismissLoading();
        history.replace('/welcome');
      }
    })();
  };

  return (
    <IonPage id={MAIN_CONTENT_ID}>
      <IonHeader>
        <IonToolbar className="fin-toolbar">
          <IonButtons slot="start">
            {authMode ? (
              <IonButton routerLink="/welcome" routerDirection="back" aria-label="Back to welcome">
                <IonIcon slot="icon-only" icon={arrowBackOutline} />
              </IonButton>
            ) : (
              <IonMenuButton />
            )}
          </IonButtons>
          <IonTitle>{title}</IonTitle>
          {isAuthed && !authMode ? (
            <IonButtons slot="end">
              <IonButton
                aria-label="Profile"
                onClick={() => {
                  setProfileOpen(true);
                }}
              >
                <IonIcon icon={personCircleOutline} />
              </IonButton>
              <IonPopover className="fin-profile-popover" isOpen={profileOpen} onDidDismiss={() => setProfileOpen(false)}>
                <IonList lines="full">
                  <IonItem>
                    <IonLabel>
                      <h3>{profileLabel}</h3>
                      {user?.email ? <IonNote>{user.email}</IonNote> : null}
                    </IonLabel>
                  </IonItem>
                  <IonItem button detail={false} onClick={handleSignOut}>
                    <IonLabel>Sign out</IonLabel>
                  </IonItem>
                </IonList>
              </IonPopover>
            </IonButtons>
          ) : null}
        </IonToolbar>
      </IonHeader>
      <IonContent className={['fin-content', contentClassName].filter(Boolean).join(' ')}>{children}</IonContent>
    </IonPage>
  );
};

export default PageWithMenu;
