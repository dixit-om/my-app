import {
  IonAlert,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  useIonToast,
} from '@ionic/react';
import type { RefresherEventDetail } from '@ionic/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useHistory as useRouterHistory } from 'react-router-dom';
import StitchBottomNav from '../components/StitchBottomNav';
import StitchPage from '../components/StitchPage';
import StitchHeader from '../components/StitchHeader';
import type { HistoryItem } from '../services/historyApi';
import { deleteHistoryItem, getHistory } from '../services/historyApi';

const LANG_LABEL: Record<string, string> = {
  en: 'English',
  hi: 'हिंदी',
  ta: 'தமிழ்',
  mr: 'मराठी',
  te: 'తెలుగు',
  ml: 'മലയാളം',
  kn: 'ಕನ್ನಡ',
  gu: 'ગુજરાતી',
  bn: 'বাংলা',
};

function formatTime(ms: number | null): string {
  if (!ms) return '';
  try {
    const d = new Date(ms);
    const today = new Date();
    const sameDay = d.toDateString() === today.toDateString();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();
    const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    if (sameDay) return `Today · ${time}`;
    if (isYesterday) return `Yesterday · ${time}`;
    return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

type Accent = 'teal' | 'amber' | 'sky' | 'red';

type IconMatch = { icon: string; accent: Accent };

/** Pick a contextual icon + colour from a free-text title/summary. */
function pickIconAndAccent(item: HistoryItem): IconMatch {
  const haystack = [item.result?.simpleTitle, item.result?.summary, item.inputText]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (/alert|suspici|warning|fraud|scam|unauthori[sz]ed/.test(haystack)) {
    return { icon: 'warning', accent: 'red' };
  }
  if (/otp|password|pin\b|verify|verification/.test(haystack)) {
    return { icon: 'security', accent: 'amber' };
  }
  if (/credit card|debit card|\bcard\b/.test(haystack)) {
    return { icon: 'credit_card', accent: 'teal' };
  }
  if (/salary|credited|deposit|received/.test(haystack)) {
    return { icon: 'account_balance_wallet', accent: 'teal' };
  }
  if (/electricity|power|utility|water bill|gas bill/.test(haystack)) {
    return { icon: 'electric_bolt', accent: 'amber' };
  }
  if (/loan|emi|installment/.test(haystack)) {
    return { icon: 'payments', accent: 'amber' };
  }
  if (/insurance|premium|policy|lic|maturity/.test(haystack)) {
    return { icon: 'receipt_long', accent: 'teal' };
  }
  if (/kyc|aadhaar|pan card|government/.test(haystack)) {
    return { icon: 'verified_user', accent: 'sky' };
  }
  if (/statement|account/.test(haystack)) {
    return { icon: 'account_balance', accent: 'teal' };
  }
  return { icon: 'description', accent: 'teal' };
}

const ACCENT_STYLES: Record<Accent, { border: string; bg: string; fg: string }> = {
  teal: { border: 'border-teal-600', bg: 'bg-teal-100', fg: 'text-teal-700' },
  sky: { border: 'border-sky-600', bg: 'bg-sky-100', fg: 'text-sky-700' },
  amber: { border: 'border-amber-500', bg: 'bg-amber-100', fg: 'text-amber-700' },
  red: { border: 'border-red-600', bg: 'bg-red-100', fg: 'text-red-700' },
};

const HistoryPage: React.FC = () => {
  const [items, setItems] = useState<HistoryItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<HistoryItem | null>(null);
  const [search, setSearch] = useState('');
  const [presentToast] = useIonToast();
  const router = useRouterHistory();

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await getHistory(30);
      setItems(data);
    } catch (e: any) {
      setError(String(e?.message ?? 'history_failed'));
      setItems([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onRefresh = useCallback(
    async (e: CustomEvent<RefresherEventDetail>) => {
      await load();
      e.detail.complete();
    },
    [load]
  );

  const onOpen = useCallback(
    (item: HistoryItem) => {
      router.push(`/explain/${encodeURIComponent(item.id)}`);
    },
    [router]
  );

  const onConfirmDelete = useCallback(async () => {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setPendingDelete(null);
    try {
      await deleteHistoryItem(id);
      setItems((curr) => (curr ? curr.filter((it) => it.id !== id) : curr));
      void presentToast({ message: 'Deleted.', duration: 1400, color: 'success' });
    } catch (e: any) {
      void presentToast({ message: String(e?.message ?? 'delete_failed'), duration: 2400, color: 'danger' });
    }
  }, [pendingDelete, presentToast]);

  const filtered = useMemo(() => {
    if (!items) return null;
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const hay = [it.result?.simpleTitle, it.result?.summary, it.inputText]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [items, search]);

  return (
    <StitchPage
      bottomNav={<StitchBottomNav active="history" />}
      fixedSlot={
        <IonRefresher slot="fixed" onIonRefresh={onRefresh}>
          <IonRefresherContent />
        </IonRefresher>
      }
    >
      <StitchHeader variant="main" />

      <main className="max-w-4xl mx-auto px-4 md:px-6 pt-6 pb-32">
            <section className="mb-6">
              <div className="bg-stone-100 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-l-4 border-teal-700">
                <div className="w-full md:w-1/3 aspect-video rounded-lg overflow-hidden bg-stone-200">
                  <img
                    alt="A senior person calmly reading a smartphone"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSZMa_9_kRbRkeBAZInw2G-ybjInToc8STlAgmSrResSrj6rMAAOlDwj0Lp8tn6tX5qQr_Bi6Z1z5P44Jvog-vWkwNjh76Lzy-II8tOx3Yre_D7R8JXd9Kq_kvzx2d4Z6LrT1WXASC7J9gEHe230642s_nIlDes0XYtB4NvtDfpU5xnpCgagJ9W_hfv3QarmX9wJqHHSvLi4RdCLzoN9bA4FA_aAr0UFLk73_IsRNiEJ5b8OridBEEfjpzaNhYcYosDyYcSpfp0c0"
                    onError={(e) => {
                      (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-[24px] leading-[36px] font-semibold mb-1 text-stone-900">History</h2>
                  <p className="text-[16px] leading-[24px] text-stone-600">
                    Review every message we've explained for you. Tap any item to open it again.
                  </p>
                </div>
              </div>
            </section>

            <div className="mb-6">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                  search
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search past explanations…"
                  className="w-full bg-white border-2 border-stone-200 rounded-full py-3 pl-12 pr-6 text-[16px] focus:border-teal-700 outline-none transition-all placeholder:text-stone-400"
                />
              </div>
            </div>

            {items === null ? (
              <div className="py-16 flex justify-center">
                <IonSpinner name="crescent" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-600 rounded-xl p-6 text-center">
                <p className="text-red-900 font-semibold mb-3">Couldn't load your history.</p>
                <button
                  type="button"
                  onClick={() => void load()}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 border-red-600 text-red-700 font-bold hover:bg-red-100 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined">refresh</span>
                  Try again
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="bg-stone-100 rounded-3xl p-12 flex flex-col items-center text-center gap-4 border-2 border-dashed border-stone-300/60">
                <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-teal-700 text-4xl">history_edu</span>
                </div>
                <div className="max-w-xs">
                  <h3 className="text-[20px] font-semibold text-stone-900 mb-2">No history yet</h3>
                  <p className="text-[16px] text-stone-600">
                    When you explain a message, it appears here so you can read it later.
                  </p>
                </div>
                <Link
                  to="/explain"
                  className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-teal-700 text-white font-bold hover:bg-teal-800 active:scale-95 transition-all"
                >
                  Explain a message
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            ) : filtered && filtered.length === 0 ? (
              <div className="bg-stone-100 rounded-2xl p-8 text-center border border-stone-200/60">
                <p className="text-stone-600">
                  No matches for <strong>"{search}"</strong>.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {(filtered ?? []).map((item) => {
                    const { icon, accent } = pickIconAndAccent(item);
                    const styles = ACCENT_STYLES[accent];
                    return (
                      <div
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => onOpen(item)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') onOpen(item);
                        }}
                        className={`bg-white p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex items-center justify-between border-l-4 ${styles.border} hover:bg-stone-50 transition-colors cursor-pointer min-h-[72px] active:scale-[0.99]`}
                      >
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div
                            className={`w-12 h-12 rounded-full ${styles.bg} flex items-center justify-center ${styles.fg} shrink-0`}
                          >
                            <span className="material-symbols-outlined text-2xl">{icon}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-[18px] leading-[26px] font-semibold text-stone-900 truncate">
                              {item.result?.simpleTitle || 'Explanation'}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded text-[12px] font-bold uppercase tracking-wider">
                                {LANG_LABEL[item.language] || item.language}
                              </span>
                              <span className="text-[14px] text-stone-500">{formatTime(item.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            aria-label="Delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPendingDelete(item);
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-full text-stone-400 hover:bg-red-50 hover:text-red-600 active:scale-95 transition-colors"
                          >
                            <span className="material-symbols-outlined">delete_outline</span>
                          </button>
                          <span className="material-symbols-outlined text-stone-400">chevron_right</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filtered && filtered.length > 0 && !search ? (
                  <div className="text-center py-6 text-stone-400">
                    <p className="text-[14px]">You've reached the end of your history.</p>
                  </div>
                ) : null}
              </>
            )}
      </main>

      <IonAlert
        isOpen={pendingDelete !== null}
        onDidDismiss={() => setPendingDelete(null)}
        header="Delete this explanation?"
        message="It will be removed from your history."
        buttons={[
          { text: 'Cancel', role: 'cancel' },
          { text: 'Delete', role: 'destructive', handler: () => void onConfirmDelete() },
        ]}
      />
    </StitchPage>
  );
};

export default HistoryPage;
