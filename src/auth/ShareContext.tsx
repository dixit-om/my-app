import type { FC, ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import ShareReceiver from '../services/shareReceiver';
import type { SharedPayload } from '../services/shareReceiver';

type ShareContextValue = {
  /** Most recent shared payload waiting to be consumed (text + optional subject). */
  pending: SharedPayload | null;
  /** True if there's a pending share waiting to be consumed. */
  hasPending: boolean;
  /** Read-and-clear: returns the payload and clears it. Call this from ExplainMail on mount. */
  consume: () => SharedPayload | null;
};

const ShareContext = createContext<ShareContextValue | null>(null);

function combineTextAndSubject(payload: SharedPayload): SharedPayload {
  // Many email clients pass the body in EXTRA_TEXT and the subject in EXTRA_SUBJECT.
  // Combining them gives the AI more context.
  const text = (payload.text ?? '').trim();
  const subject = (payload.subject ?? '').trim();
  if (!text && !subject) return payload;
  if (subject && text && !text.startsWith(subject)) {
    return { text: `${subject}\n\n${text}`, subject };
  }
  return { text: text || subject, subject };
}

export const ShareReceiverProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [pending, setPending] = useState<SharedPayload | null>(null);

  useEffect(() => {
    let removeListener: (() => Promise<void>) | null = null;
    let active = true;

    // 1) Cold-start: the app was launched by an ACTION_SEND, so ask the native
    //    side for any payload waiting for us.
    (async () => {
      try {
        const payload = await ShareReceiver.getPendingShare();
        if (!active) return;
        if (payload && (payload.text || payload.subject)) {
          setPending(combineTextAndSubject(payload));
        }
      } catch {
        // No-op on web or when the plugin isn't registered (older APK builds).
      }
    })();

    // 2) Warm-start: register a listener so a share that arrives while the app
    //    is running also pre-fills the textarea.
    (async () => {
      try {
        const sub = await ShareReceiver.addListener('shareReceived', (payload) => {
          if (!active) return;
          if (payload && (payload.text || payload.subject)) {
            setPending(combineTextAndSubject(payload));
          }
        });
        removeListener = sub.remove;
      } catch {
        // Ignore on web.
      }
    })();

    return () => {
      active = false;
      if (removeListener) {
        void removeListener();
      }
    };
  }, []);

  const consume = useCallback((): SharedPayload | null => {
    if (!pending) return null;
    setPending(null);
    return pending;
  }, [pending]);

  const value = useMemo<ShareContextValue>(
    () => ({ pending, hasPending: pending !== null, consume }),
    [pending, consume]
  );

  return <ShareContext.Provider value={value}>{children}</ShareContext.Provider>;
};

export function useShareReceiver() {
  const ctx = useContext(ShareContext);
  if (!ctx) throw new Error('useShareReceiver must be used within ShareReceiverProvider');
  return ctx;
}
