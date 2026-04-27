import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

const MAIN_CONTENT_ID = 'main';

const AppMenu: React.FC = () => {
  return (
    <IonMenu contentId={MAIN_CONTENT_ID} side="start" type="overlay">
      <IonHeader>
        <IonToolbar>
          <IonTitle>finNotify</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonListHeader>
            <IonLabel>Menu</IonLabel>
          </IonListHeader>
          <IonMenuToggle autoHide>
            <IonItem routerLink="/home" routerDirection="none" detail={false} lines="full">
              <IonLabel>Home</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle autoHide>
            <IonItem routerLink="/explain" routerDirection="none" detail={false} lines="full">
              <IonLabel>Understand a message</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle autoHide>
            <IonItem routerLink="/notifications" routerDirection="none" detail={false} lines="full">
              <IonLabel>Notifications</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle autoHide>
            <IonItem routerLink="/settings" routerDirection="none" detail={false} lines="none">
              <IonLabel>Settings</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export { AppMenu, MAIN_CONTENT_ID };
