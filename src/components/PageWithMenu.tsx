import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import type { FC, ReactNode } from 'react';
import { MAIN_CONTENT_ID } from './AppMenu';

type PageWithMenuProps = {
  title: string;
  children: ReactNode;
  contentClassName?: string;
};

const PageWithMenu: FC<PageWithMenuProps> = ({ title, children, contentClassName }) => {
  return (
    <IonPage id={MAIN_CONTENT_ID}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className={contentClassName}>{children}</IonContent>
    </IonPage>
  );
};

export default PageWithMenu;
