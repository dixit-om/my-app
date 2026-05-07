import { IonRefresher, IonRefresherContent, IonSpinner, useIonToast } from '@ionic/react';
import type { RefresherEventDetail } from '@ionic/react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory as useRouterHistory, useLocation } from 'react-router-dom';
import StitchBottomNav from '../components/StitchBottomNav';
import StitchPage from '../components/StitchPage';
import StitchHeader from '../components/StitchHeader';
import type { GmailListItem, GmailMessageDetail } from '../services/gmailApi';
import { getGmailMessage, getGmailStatus, listGmailMessages } from '../services/gmailApi';

function buildExplainPrefill(d: GmailMessageDetail): string {
  return `From: ${d.from}\nSubject: ${d.subject}\n\n${d.bodyText || d.snippet}`;
}

const GmailBox: React.FC = () => {
  const router = useRouterHistory();
  const location = useLocation();
  const [presentToast] = useIonToast();
  const [connected, setConnected] = useState<boolean | null>(null);
  const [items, setItems] = useState<GmailListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [retryTick, setRetryTick] = useState(0);
  const [explainBusyId, setExplainBusyId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('gmail_connected') === '1') {
      void presentToast({ message: 'Gmail connected successfully.', duration: 2200, color: 'success' });
      router.replace('/gmail');
    }
  }, [location.search, presentToast, router]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setListError(null);
      try {
        const st = await getGmailStatus();
        if (cancelled) return;
        setConnected(st.connected);
        if (!st.connected) {
          setItems([]);
          return;
        }
        const res = await listGmailMessages(search.trim() || undefined);
        if (cancelled) return;
        setItems(res.items);
      } catch (e: unknown) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : 'Could not load Gmail';
        if (msg.includes('gmail_not_connected')) {
          setConnected(false);
          setItems([]);
        } else {
          setListError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const delay = search.trim() ? 400 : 0;
    const t = window.setTimeout(() => void run(), delay);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [search, retryTick]);

  const onRefresh = useCallback(
    async (e: CustomEvent<RefresherEventDetail>) => {
      setLoading(true);
      setListError(null);
      try {
        const st = await getGmailStatus();
        setConnected(st.connected);
        if (st.connected) {
          const res = await listGmailMessages(search.trim() || undefined);
          setItems(res.items);
        } else {
          setItems([]);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Could not refresh';
        setListError(msg);
      } finally {
        setLoading(false);
        e.detail.complete();
      }
    },
    [search]
  );

  const onExplain = async (row: GmailListItem) => {
    setExplainBusyId(row.id);
    try {
      const detail = await getGmailMessage(row.id);
      router.push({
        pathname: '/explain',
        state: { prefillText: buildExplainPrefill(detail) },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not open message';
      void presentToast({ message: msg, duration: 3200, color: 'danger' });
    } finally {
      setExplainBusyId(null);
    }
  };

  return (
    <StitchPage
      bottomNav={<StitchBottomNav active="gmail" items={['home', 'gmail', 'history']} />}
      fixedSlot={
        <IonRefresher slot="fixed" onIonRefresh={onRefresh}>
          <IonRefresherContent />
        </IonRefresher>
      }
    >
      <StitchHeader variant="main" centerTitle="Your Bank Emails" />

      <main className="pt-2 pb-32 px-container_padding max-w-2xl mx-auto min-h-0">
        {connected === false ? (
          <div className="mb-6 p-5 rounded-xl bg-amber-50 border border-amber-200 text-body-sm text-amber-950">
            <p className="font-semibold mb-2">Gmail isn&apos;t connected yet</p>
            <p className="mb-4">Connect your Google account to load messages here.</p>
            <Link
              to="/connect-gmail"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-on-primary font-bold text-label-caps"
            >
              Connect Gmail
            </Link>
          </div>
        ) : null}

        <div className="relative mb-stack_gap_lg">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline">search</span>
          </div>
          <input
            type="search"
            value={search}
            onChange={(ev) => setSearch(ev.target.value)}
            placeholder="Search your emails…"
            disabled={connected !== true}
            className="w-full h-14 pl-12 pr-4 bg-surface-container-low border-2 border-transparent focus:border-primary-container focus:ring-0 rounded-xl text-body-md text-on-surface transition-all disabled:opacity-50"
          />
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <IonSpinner name="crescent" />
          </div>
        ) : listError ? (
          <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-center">
            <p className="text-body-md text-red-900 mb-3">{listError}</p>
            <button
              type="button"
              onClick={() => {
                setListError(null);
                setRetryTick((t) => t + 1);
              }}
              className="px-5 py-2 rounded-full border-2 border-red-700 text-red-800 font-bold"
            >
              Try again
            </button>
          </div>
        ) : connected === true && items.length === 0 ? (
          <div className="p-10 rounded-2xl bg-surface-container-low text-center border border-dashed border-outline-variant">
            <p className="text-body-md text-on-surface font-semibold mb-2">No messages found</p>
            <p className="text-body-sm text-on-surface-variant">Try a different search or adjust filters in Gmail.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((row) => (
              <div
                key={row.id}
                className={`bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] overflow-hidden ${row.borderClass} p-5 flex flex-col gap-4 transition-all`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-full shrink-0 ${row.avatarBg} flex items-center justify-center`}
                    >
                      <span className={`material-symbols-outlined ${row.avatarIconClass}`}>{row.avatarIcon}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-body-md font-semibold text-on-surface truncate">{row.sender}</p>
                      <p className="text-body-sm text-on-surface-variant">{row.timeLabel}</p>
                    </div>
                  </div>
                  {row.badge ? (
                    <span className={`shrink-0 text-[12px] px-3 py-1 rounded-full font-bold ${row.badge.className}`}>
                      {row.badge.label}
                    </span>
                  ) : null}
                </div>
                <div>
                  <h3 className="text-body-lg text-on-surface font-semibold mb-1">{row.subject}</h3>
                  <p className="text-body-sm text-on-surface-variant line-clamp-2">{row.snippet}</p>
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-stone-100 pt-4 flex-wrap">
                  <span className={`text-body-sm flex items-center gap-1 ${row.footerTextClass}`}>
                    <span className="material-symbols-outlined text-[20px]">{row.footerIcon}</span>
                    {row.footerText}
                  </span>
                  <button
                    type="button"
                    disabled={explainBusyId === row.id}
                    onClick={() => void onExplain(row)}
                    className="bg-primary text-on-primary px-6 py-2 rounded-lg text-label-caps h-touch_target_min flex items-center justify-center gap-2 shrink-0 active:scale-95 transition-transform disabled:opacity-60"
                  >
                    {explainBusyId === row.id ? (
                      <IonSpinner name="crescent" className="w-5 h-5" />
                    ) : (
                      <>
                        Tap to explain
                        <span className="material-symbols-outlined">chevron_right</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-stack_gap_lg flex flex-col items-center justify-center text-center p-6 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant">
          <span className="material-symbols-outlined text-primary text-[32px] mb-2">shield_person</span>
          <p className="text-body-md text-on-surface font-semibold">Your emails are processed securely.</p>
          <p className="text-body-sm text-on-surface-variant max-w-[280px]">
            finNotify reads messages only after you connect Gmail and choose what to explain. Refresh tokens stay on
            our server — not on this device.
          </p>
        </div>
      </main>
    </StitchPage>
  );
};

export default GmailBox;
