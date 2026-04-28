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
} from '@ionic/react';
import type { FC, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { personCircleOutline } from 'ionicons/icons';
import { MAIN_CONTENT_ID } from './AppMenu';
import { useAuth } from '../auth/AuthContext';

type PageWithMenuProps = {
  title: string;
  children: ReactNode;
  contentClassName?: string;
};

const PageWithMenu: FC<PageWithMenuProps> = ({ title, children, contentClassName }) => {
  const { isAuthed, user, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileLabel = useMemo(() => user?.name || user?.email || 'Profile', [user]);

  return (
    <IonPage id={MAIN_CONTENT_ID}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{title}</IonTitle>
          {isAuthed ? (
            <IonButtons slot="end">
              <IonButton
                aria-label="Profile"
                onClick={() => {
                  setProfileOpen(true);
                }}
              >
                <IonIcon icon={personCircleOutline} />
              </IonButton>
              <IonPopover isOpen={profileOpen} onDidDismiss={() => setProfileOpen(false)}>
                <IonList lines="full">
                  <IonItem>
                    <IonLabel>
                      <h3>{profileLabel}</h3>
                      {user?.email ? <IonNote>{user.email}</IonNote> : null}
                    </IonLabel>
                  </IonItem>
                  <IonItem
                    button
                    detail={false}
                    onClick={() => {
                      signOut();
                      setProfileOpen(false);
                    }}
                  >
                    <IonLabel>Sign out</IonLabel>
                  </IonItem>
                </IonList>
              </IonPopover>
            </IonButtons>
          ) : null}
        </IonToolbar>
      </IonHeader>
      <IonContent className={contentClassName}>{children}</IonContent>
    </IonPage>
  );
};

export default PageWithMenu;
