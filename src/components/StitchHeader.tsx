import type { ReactNode } from 'react';
import { menuController } from '@ionic/core/components';
import { useHistory as useRouterHistory } from 'react-router-dom';

type Variant = 'main' | 'back' | 'settings';

type StitchHeaderProps = {
  /**
   * Layout variant:
   *  - `main`     — hamburger + finNotify brand + account icon (Home / Understand / History)
   *  - `back`     — back-arrow + finNotify brand + account icon   (Login / auth flows)
   *  - `settings` — settings glyph + title text + finNotify brand (Settings)
   * @default 'main'
   */
  variant?: Variant;
  /** Title shown in the 'settings' variant. Ignored for other variants. */
  title?: string;
  /**
   * Custom back handler for the 'back' variant. Defaults to replacing the
   * route with /welcome (matches the original Login behavior).
   */
  onBack?: () => void;
  /**
   * Custom menu handler for the 'main' variant. Defaults to opening the
   * side drawer via `menuController.open()`.
   */
  onMenu?: () => void;
  /**
   * Custom account handler for 'main' / 'back' variants. Defaults to routing
   * to /settings (matches the original Home behavior).
   */
  onAccount?: () => void;
  /**
   * Optional extra content rendered at the trailing edge of the header,
   * replacing the default right-side slot. Rarely needed.
   */
  rightSlot?: ReactNode;
};

const HEADER_CLASS =
  'bg-stone-50 border-b border-stone-200 flex justify-between items-center w-full px-6 py-4 sticky top-0 z-40';

const ICON_BTN_CLASS =
  'p-2 rounded-full hover:bg-stone-100 transition-transform active:scale-95 duration-150 flex items-center justify-center';

/**
 * Global Stitch top header. Used on Home, Understand, History, Settings, Login.
 * Owns its own navigation side effects (menu drawer, back button, account →
 * settings) so individual pages don't repeat that boilerplate.
 */
const StitchHeader: React.FC<StitchHeaderProps> = ({
  variant = 'main',
  title,
  onBack,
  onMenu,
  onAccount,
  rightSlot,
}) => {
  const router = useRouterHistory();

  const handleMenu = () => {
    if (onMenu) return onMenu();
    void menuController.open();
  };

  const handleBack = () => {
    if (onBack) return onBack();
    router.replace('/welcome');
  };

  const handleAccount = () => {
    if (onAccount) return onAccount();
    router.push('/settings');
  };

  // Settings variant swaps layout: left = icon+title, right = brand text
  if (variant === 'settings') {
    return (
      <header className={HEADER_CLASS}>
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-teal-700"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            settings
          </span>
          <h1 className="font-bold text-xl text-stone-900">{title || 'Settings'}</h1>
        </div>
        <div className="text-2xl font-extrabold text-teal-700 tracking-tight">finNotify</div>
      </header>
    );
  }

  // 'main' and 'back' share the left brand + right account pattern.
  return (
    <header className={HEADER_CLASS}>
      <div className="flex items-center gap-4">
        {variant === 'back' ? (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back"
            className={`${ICON_BTN_CLASS} w-12 h-12`}
          >
            <span className="material-symbols-outlined text-teal-700">arrow_back</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleMenu}
            aria-label="Open menu"
            className={ICON_BTN_CLASS}
          >
            <span className="material-symbols-outlined text-teal-700">menu</span>
          </button>
        )}
        <h1 className="font-bold text-xl text-teal-700 tracking-tight">finNotify</h1>
      </div>

      {rightSlot ?? (
        <button
          type="button"
          onClick={handleAccount}
          aria-label="Account"
          className={`${ICON_BTN_CLASS} gap-2`}
        >
          <span className="material-symbols-outlined text-teal-700">account_circle</span>
        </button>
      )}
    </header>
  );
};

export default StitchHeader;
