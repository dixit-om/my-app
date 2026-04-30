import {
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonPopover,
  IonTitle,
  IonToolbar,
  useIonLoading,
} from '@ionic/react';
import type { FC, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { arrowBackOutline, logOutOutline, settingsOutline } from 'ionicons/icons';
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
  const initial = useMemo(() => {
    const source = user?.name || user?.email || 'U';
    return source.trim().slice(0, 1).toUpperCase();
  }, [user]);
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

  const goToSettings = () => {
    setProfileOpen(false);
    history.push('/settings');
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
                className="fin-profile-btn"
                onClick={() => {
                  setProfileOpen(true);
                }}
              >
                <span className="fin-profile-btn-avatar" aria-hidden="true">{initial}</span>
              </IonButton>
              <IonPopover
                className="fin-profile-popover"
                isOpen={profileOpen}
                onDidDismiss={() => setProfileOpen(false)}
                showBackdrop={false}
                alignment="end"
                side="bottom"
              >
                <div className="fin-profile-card">
                  <div className="fin-profile-head">
                    <div className="fin-profile-avatar" aria-hidden="true">{initial}</div>
                    <div className="fin-profile-meta">
                      <div className="fin-profile-name">{profileLabel}</div>
                      {user?.email && user.email !== profileLabel ? (
                        <div className="fin-profile-email">{user.email}</div>
                      ) : null}
                    </div>
                  </div>
                  <button type="button" className="fin-profile-action" onClick={goToSettings}>
                    <IonIcon icon={settingsOutline} />
                    <span>Settings</span>
                  </button>
                  <button type="button" className="fin-profile-action fin-profile-action-danger" onClick={handleSignOut}>
                    <IonIcon icon={logOutOutline} />
                    <span>Sign out</span>
                  </button>
                </div>
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
