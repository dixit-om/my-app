import type { ReactNode } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { MAIN_CONTENT_ID } from './AppMenu';

type StitchPageProps = {
  /** Main page content — rendered inside the Manrope + bg-stone-50 wrapper. */
  children: ReactNode;
  /** Optional bottom-nav node (e.g. <StitchBottomNav active="home" />). Rendered inside IonContent so it overlays page body. */
  bottomNav?: ReactNode;
  /**
   * Nodes that must be *direct* children of IonContent rather than the inner
   * wrapper — notably `<IonRefresher slot="fixed">` and `<IonAlert>` /
   * `<IonModal>` which Ionic expects to live at the content level.
   */
  fixedSlot?: ReactNode;
  /**
   * Whether this page is the host for the side drawer. Pages that should open the
   * `AppMenu` when the user taps the menu icon need to own MAIN_CONTENT_ID.
   * Pages outside the auth-gated shell (Login/Welcome/Signup) should pass false.
   * @default true
   */
  menuHost?: boolean;
  /** Extra classes to apply to the inner `<div class="font-manrope …">` wrapper. */
  className?: string;
};

/**
 * Global Stitch page shell.
 * Centralizes the IonPage + IonContent.fin-stitch-bg + font-manrope wrapper that
 * every Stitch-redesigned page was repeating verbatim.
 */
const StitchPage: React.FC<StitchPageProps> = ({
  children,
  bottomNav,
  fixedSlot,
  menuHost = true,
  className,
}) => {
  const ionPageProps = menuHost ? { id: MAIN_CONTENT_ID } : {};
  const wrapperClass = `font-manrope text-stone-900 min-h-full bg-stone-50${className ? ` ${className}` : ''}`;

  return (
    <IonPage {...ionPageProps}>
      <IonContent fullscreen className="fin-stitch-bg">
        {fixedSlot}
        <div className={wrapperClass}>{children}</div>
        {bottomNav}
      </IonContent>
    </IonPage>
  );
};

export default StitchPage;
