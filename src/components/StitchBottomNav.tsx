import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export type StitchNavKey = 'home' | 'understand' | 'history' | 'settings';

type StitchBottomNavProps = {
  /** Optional override of the active key. Defaults to a match against the current route. */
  active?: StitchNavKey;
  /** Which items to show, in display order. Defaults to home / history / settings. */
  items?: StitchNavKey[];
};

type Item = {
  key: StitchNavKey;
  /** Kept for aria-label / screen-reader support even though the label isn't rendered. */
  label: string;
  icon: string;
  to: string;
  match: (path: string) => boolean;
};

const ALL_ITEMS: Record<StitchNavKey, Item> = {
  home: {
    key: 'home',
    label: 'Home',
    icon: 'home',
    to: '/home',
    match: (p) => p === '/home' || p === '/',
  },
  understand: {
    key: 'understand',
    label: 'Understand',
    icon: 'chat_bubble',
    to: '/explain',
    match: (p) => p.startsWith('/explain'),
  },
  history: {
    key: 'history',
    label: 'History',
    icon: 'history',
    to: '/history',
    match: (p) => p.startsWith('/history'),
  },
  settings: {
    key: 'settings',
    label: 'Settings',
    icon: 'settings',
    to: '/settings',
    match: (p) => p.startsWith('/settings'),
  },
};

const DEFAULT_ITEMS: StitchNavKey[] = ['home', 'history', 'settings'];

/**
 * Soft-keyboard detection:
 *  1) Primary trigger — `focusin` / `focusout` on any text input or textarea.
 *     This fires *immediately* when the user taps a field (before the keyboard
 *     is even fully open), which makes the nav hide in the same frame as the
 *     keyboard animation.
 *  2) Fallback — `window.visualViewport` resize. Covers edge cases where the
 *     keyboard is triggered without a focus event (e.g. assistive input) and
 *     catches the `blur`-without-focus edge case.
 */
const KEYBOARD_THRESHOLD_PX = 150;

const TEXT_INPUT_TYPES = new Set([
  '',
  'text',
  'email',
  'password',
  'search',
  'tel',
  'url',
  'number',
  'date',
  'datetime-local',
  'month',
  'time',
  'week',
]);

function isTextEditable(target: EventTarget | null): boolean {
  if (!target || !(target as HTMLElement).tagName) return false;
  const el = target as HTMLElement;
  if (el.isContentEditable) return true;
  const tag = el.tagName.toUpperCase();
  if (tag === 'TEXTAREA') return true;
  if (tag === 'INPUT') {
    const t = (el as HTMLInputElement).type?.toLowerCase() ?? '';
    return TEXT_INPUT_TYPES.has(t);
  }
  return false;
}

const StitchBottomNav: React.FC<StitchBottomNavProps> = ({ active, items }) => {
  const location = useLocation();
  const path = location.pathname;
  const order = items && items.length > 0 ? items : DEFAULT_ITEMS;
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  // Hide the bottom nav whenever a text field has focus or the visual viewport
  // shrinks — so the nav stays pinned to the physical bottom of the screen
  // (behind the keyboard) instead of riding up with the shrinking viewport.
  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      if (isTextEditable(e.target)) setKeyboardOpen(true);
    };
    const onFocusOut = (e: FocusEvent) => {
      if (isTextEditable(e.target)) setKeyboardOpen(false);
    };
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);

    const vv = window.visualViewport;
    let removeVvListener: (() => void) | null = null;
    if (vv) {
      let baseline = vv.height;
      const onResize = () => {
        if (vv.height > baseline) baseline = vv.height;
        // If the viewport has shrunk significantly, a keyboard or on-screen
        // input panel is probably up. Keep nav hidden in that case regardless
        // of focus state.
        if (baseline - vv.height > KEYBOARD_THRESHOLD_PX) setKeyboardOpen(true);
      };
      vv.addEventListener('resize', onResize);
      removeVvListener = () => vv.removeEventListener('resize', onResize);
    }

    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
      if (removeVvListener) removeVvListener();
    };
  }, []);

  // Nuclear option: fully unmount the nav while the keyboard is up. Some
  // Android WebViews ignore CSS transforms on `position:fixed` elements once
  // the IME resizes the viewport, which is why the earlier translate-y-full
  // approach sometimes left the nav visible above the keyboard.
  if (keyboardOpen) return null;

  const navClass = [
    'fin-stitch-bottom-nav',
    'fixed bottom-0 left-0 w-full z-40',
    'flex justify-around items-center',
    'px-4 pt-3',
    'bg-stone-50 border-t border-stone-200 rounded-t-2xl',
    'shadow-[0_-4px_20px_rgba(0,0,0,0.05)]',
  ].join(' ');

  return (
    <nav className={navClass} aria-label="Primary">
      {order.map((key) => {
        const item = ALL_ITEMS[key];
        const isActive = active ? active === item.key : item.match(path);
        return (
          <Link
            key={item.key}
            to={item.to}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            className={
              isActive
                ? 'flex items-center justify-center bg-teal-100 text-teal-900 rounded-xl px-5 py-3 transition-all duration-200 no-underline'
                : 'flex items-center justify-center text-stone-500 px-5 py-3 hover:text-teal-600 transition-colors no-underline'
            }
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 28,
                ...(isActive ? { fontVariationSettings: "'FILL' 1" } : undefined),
              }}
            >
              {item.icon}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default StitchBottomNav;
