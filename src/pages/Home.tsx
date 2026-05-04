import { IonSpinner } from '@ionic/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory as useRouterHistory, Link } from 'react-router-dom';
import StitchBottomNav from '../components/StitchBottomNav';
import StitchPage from '../components/StitchPage';
import StitchHeader from '../components/StitchHeader';
import { useAuth } from '../auth/AuthContext';
import type { HistoryItem } from '../services/historyApi';
import { getHistory } from '../services/historyApi';

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
    if (d.toDateString() === today.toDateString()) {
      return `Today · ${d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    }
    return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
  } catch {
    return '';
  }
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const router = useRouterHistory();
  const [recent, setRecent] = useState<HistoryItem[] | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await getHistory(3);
      setRecent(data);
    } catch {
      setRecent([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const firstName = useMemo(() => {
    const source = user?.name || user?.email || '';
    const fromName = source.split(' ')[0]?.trim();
    if (fromName) return fromName.split('@')[0];
    return 'friend';
  }, [user]);

  const goToExplain = () => router.push('/explain');

  return (
    <StitchPage bottomNav={<StitchBottomNav active="home" />}>
      <StitchHeader variant="main" />

      <main className="max-w-2xl mx-auto px-6 pt-6 pb-32">
            <section className="mb-6">
              <h2 className="text-[32px] leading-[44px] font-bold tracking-tight text-teal-800">
                Namaste, {firstName}
              </h2>
              <p className="text-[18px] leading-[28px] mt-1 italic text-stone-500">आपका स्वागत है</p>
            </section>

            <section className="mb-6">
              <button
                type="button"
                onClick={goToExplain}
                className="w-full text-left group relative overflow-hidden bg-teal-700 text-teal-50 rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all hover:shadow-xl active:scale-[0.98]"
              >
                <div className="flex flex-col gap-6 relative z-10">
                  <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center">
                    <span
                      className="material-symbols-outlined text-4xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      content_paste
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[24px] leading-[36px] font-semibold mb-2">
                      Paste a message and explain it
                    </h3>
                    <p className="text-[16px] leading-[24px] opacity-80">
                      Copy any SMS from your bank and let us simplify it for you in plain language.
                    </p>
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                  <span className="material-symbols-outlined text-[180px]">security</span>
                </div>
              </button>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[14px] leading-[20px] font-bold text-stone-600 uppercase tracking-widest">
                  Recent explanations
                </h4>
                {recent && recent.length > 0 ? (
                  <Link
                    to="/history"
                    className="text-[14px] leading-[20px] font-bold uppercase tracking-wider text-teal-700 hover:underline"
                  >
                    View all
                  </Link>
                ) : null}
              </div>

              {recent === null ? (
                <div className="bg-stone-100 rounded-3xl p-12 flex justify-center">
                  <IonSpinner name="crescent" />
                </div>
              ) : recent.length === 0 ? (
                <div className="bg-stone-100 rounded-3xl p-12 flex flex-col items-center text-center gap-6 border-2 border-dashed border-stone-300/60">
                  <div className="w-48 h-48 bg-white/50 rounded-full flex items-center justify-center relative shadow-inner overflow-hidden">
                    <img
                      alt="A friendly illustration of a digital assistant"
                      className="w-full h-full object-cover opacity-60"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCol-GsuNYWOBDHAoQJgSFXCu6KHgZYTtvTyGgd28J3B5anY0wfK-RtCbIoBaOsctMoIJFlN_6CNsIG6xa2QeePolPM51ZOozh2nYN8Q6eCkeS8wTRNea1p2XaBNW2afnwtPBhMWu-57rr4HHGoKaPBIHMD0YZc4xAFpXjvkW6BxISzT29bE0ZjWE45egdPMzrR8ppiFLSzyuH7vKQzhfqEcIYwLlNFkO9U1rsH4LrsQk8YguoV8wD7Pu1b6sJ_uGL7I7cOzdF5n-o"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="material-symbols-outlined absolute text-teal-700/40 text-6xl">
                      history_edu
                    </span>
                  </div>
                  <div className="max-w-xs">
                    <p className="text-[18px] leading-[28px] font-semibold mb-2 text-stone-900">
                      You haven't explained any messages yet.
                    </p>
                    <p className="text-[16px] leading-[24px] text-stone-600">
                      Paste your first one above! We'll show your history right here for easy access.
                    </p>
                  </div>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {recent.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={`/explain/${encodeURIComponent(item.id)}`}
                        className="block bg-white rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-md active:scale-[0.99] transition-all"
                      >
                        <h3 className="text-[18px] leading-[28px] font-semibold text-stone-900 mb-1">
                          {item.result?.simpleTitle || 'Explanation'}
                        </h3>
                        <p className="text-[16px] leading-[24px] text-stone-600 line-clamp-2">
                          {item.result?.summary ||
                            (item.inputText ? item.inputText.slice(0, 120) : '')}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[14px] text-stone-500">
                            {formatTime(item.createdAt)}
                          </span>
                          <span className="text-[12px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                            {LANG_LABEL[item.language] || item.language}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
      </main>
    </StitchPage>
  );
};

export default Home;
