import { useEffect, useState } from 'react';
import { useHistory as useRouterHistory, useLocation } from 'react-router-dom';
import { useIonToast } from '@ionic/react';
import StitchBottomNav from '../components/StitchBottomNav';
import StitchPage from '../components/StitchPage';
import StitchHeader from '../components/StitchHeader';
import { getGmailStatus, startGoogleOAuth, disconnectGmail } from '../services/gmailApi';

const MAILBOX_ILLU =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuChyEPpb4vwUfzmUHrSqOsNACviuhz_FYGWgquuEigfJlfbca_35sL59gBqOGROyxJjx1kf7tb9-JzzfeMgz_LUzCcgh0qvA1ZIkkFcYZcCNfSUj_A4IZrgUGZpn9xe6qqJbPeWe6ST2QtpMQaPuCcc4MpL7GtccWv2r-5jT95ekAhmRcLDguGmCuv-aUlbfinXKXFzgVgSwl50OVDm62v8pFl_5BujYuE-Tya3cK5ueMx4I6hg-bHPv6_Umzmojc6U4SmpYCJ_bYA';

const GOOGLE_G =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAonUexjUR5iZ4HOm9gfBlY4J3xhhMwtAMLjXGbOehS2DVWlx5B9OdSBbDHZarMOEH-p1Cdm56nF9zC-YEvVTUaiPhE6XFxmeNHJUzmd1ltFbpCS_LxqpvOYLMdaa6E8KkYz-jHpB8-cRRwnwerA4wdHetW9HTSsvexaye67Ut2Z_wBvdQZdPvO_hvStYrX4CAR3rhgzuEIqm8FydXbnNh3F5hpr6iF5UKhERBvQmtCswp9-n6aQWxRDXvlRVZFQo8nbLh-VLk5Zvo';

const ConnectGmail: React.FC = () => {
  const router = useRouterHistory();
  const location = useLocation();
  const [presentToast] = useIonToast();
  const [status, setStatus] = useState<{ connected: boolean; email: string | null } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const err = params.get('gmail_error');
    if (err) {
      void presentToast({
        message: err.replace(/\+/g, ' '),
        duration: 4500,
        color: 'danger',
      });
      router.replace('/connect-gmail');
    }
  }, [location.search, presentToast, router]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const s = await getGmailStatus();
        if (!cancelled) setStatus(s);
      } catch {
        if (!cancelled) setStatus({ connected: false, email: null });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [location.key]);

  const onConnect = async () => {
    setBusy(true);
    try {
      const { url } = await startGoogleOAuth();
      window.location.assign(url);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not start Google sign-in';
      void presentToast({ message: msg, duration: 3200, color: 'danger' });
      setBusy(false);
    }
  };

  const onDisconnect = async () => {
    setBusy(true);
    try {
      await disconnectGmail();
      setStatus({ connected: false, email: null });
      void presentToast({ message: 'Gmail disconnected.', duration: 2000, color: 'success' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not disconnect';
      void presentToast({ message: msg, duration: 3200, color: 'danger' });
    } finally {
      setBusy(false);
    }
  };

  const connected = status?.connected === true;

  return (
    <StitchPage bottomNav={<StitchBottomNav active="gmail" items={['home', 'gmail', 'history']} />}>
      <StitchHeader variant="main" />

      <main className="flex flex-col items-center px-6 pt-8 pb-32 max-w-lg mx-auto w-full">
        <div className="w-full flex justify-center mb-8">
          <div className="relative w-48 h-48 bg-surface-container-low rounded-full flex items-center justify-center">
            <div className="absolute inset-0 bg-secondary-container opacity-20 rounded-full blur-2xl" />
            <img
              alt=""
              className="w-32 h-32 relative z-10 object-contain"
              src={MAILBOX_ILLU}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        <h1 className="font-manrope text-display-lg text-center text-on-surface mb-8">Connect your Gmail</h1>

        {connected ? (
          <div className="w-full mb-8 p-6 rounded-xl bg-teal-50 border border-teal-200 text-center">
            <p className="text-body-md text-on-surface font-semibold mb-1">Gmail is connected</p>
            {status?.email ? (
              <p className="text-body-sm text-on-surface-variant">{status.email}</p>
            ) : null}
            <div className="flex flex-col gap-3 mt-4">
              <button
                type="button"
                onClick={() => router.push('/gmail')}
                className="w-full h-12 bg-primary text-on-primary font-bold rounded-xl active:scale-95 transition-all"
              >
                Open your emails
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void onDisconnect()}
                className="w-full h-12 border-2 border-stone-300 text-stone-700 font-semibold rounded-xl active:scale-95 transition-all disabled:opacity-60"
              >
                Disconnect Gmail
              </button>
            </div>
          </div>
        ) : null}

        <div className="w-full grid grid-cols-1 gap-4 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex items-center gap-6 border-l-4 border-primary">
            <div className="bg-primary-container/10 p-3 rounded-full shrink-0">
              <span className="material-symbols-outlined text-primary text-[28px]">account_balance</span>
            </div>
            <div>
              <p className="text-body-md text-on-surface leading-tight">See your important emails in one place</p>
              <p className="text-body-sm text-outline mt-1">After you connect Gmail</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex items-center gap-6 border-l-4 border-secondary">
            <div className="bg-secondary-container/10 p-3 rounded-full shrink-0">
              <span className="material-symbols-outlined text-secondary text-[28px]">content_copy</span>
            </div>
            <div>
              <p className="text-body-md text-on-surface leading-tight">No need to copy and paste</p>
              <p className="text-body-sm text-outline mt-1">Pick a message and tap explain</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex items-center gap-6 border-l-4 border-tertiary">
            <div className="bg-tertiary-fixed-dim/10 p-3 rounded-full shrink-0">
              <span className="material-symbols-outlined text-tertiary text-[28px]">verified_user</span>
            </div>
            <div>
              <p className="text-body-md text-on-surface leading-tight">Safe and private</p>
              <p className="text-body-sm text-outline mt-1">Industry-standard sign-in with Google</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-container p-6 rounded-2xl mb-12 flex gap-4 items-start w-full">
          <span className="material-symbols-outlined text-primary shrink-0">info</span>
          <p className="text-body-sm text-on-surface-variant">
            We only use your email when you choose a message to explain. We never share your data.
          </p>
        </div>

        {!connected ? (
          <div className="w-full flex flex-col gap-4">
            <button
              type="button"
              disabled={busy}
              onClick={() => void onConnect()}
              className="w-full h-14 bg-primary-container text-white text-body-lg font-bold rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
            >
              <img
                alt=""
                className="w-6 h-6"
                src={GOOGLE_G}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              Connect my Gmail account
            </button>
            <button
              type="button"
              onClick={() => router.push('/home')}
              className="w-full h-14 bg-transparent text-primary text-body-md font-semibold rounded-xl hover:bg-stone-100 active:scale-95 transition-all"
            >
              Maybe later
            </button>
          </div>
        ) : null}
      </main>
    </StitchPage>
  );
};

export default ConnectGmail;
