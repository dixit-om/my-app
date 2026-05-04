import { IonAlert, useIonLoading, useIonToast } from '@ionic/react';
import { useState } from 'react';
import { useHistory as useRouterHistory } from 'react-router-dom';
import StitchBottomNav from '../components/StitchBottomNav';
import StitchPage from '../components/StitchPage';
import StitchHeader from '../components/StitchHeader';
import { useAuth } from '../auth/AuthContext';
import { usePreferences } from '../auth/PreferencesContext';
import type { ExplainLanguage } from '../types/explain';
import type { TextSize } from '../services/prefsApi';

const LANG_OPTIONS: Array<{ value: ExplainLanguage; label: string }> = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी (Hindi)' },
  { value: 'ta', label: 'தமிழ் (Tamil)' },
  { value: 'mr', label: 'मराठी (Marathi)' },
  { value: 'te', label: 'తెలుగు (Telugu)' },
  { value: 'ml', label: 'മലയാളം (Malayalam)' },
  { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { value: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { value: 'bn', label: 'বাংলা (Bengali)' },
];

const TEXT_SIZES: Array<{ value: TextSize; label: string; preview: string }> = [
  { value: 'normal', label: 'Normal', preview: 'text-[24px]' },
  { value: 'large', label: 'Large', preview: 'text-[32px]' },
  { value: 'xlarge', label: 'X-Large', preview: 'text-[40px]' },
];

const Settings: React.FC = () => {
  const { user, signOut } = useAuth();
  const { prefs, updatePreferences } = usePreferences();
  const [presentToast] = useIonToast();
  const [presentLoading, dismissLoading] = useIonLoading();
  const router = useRouterHistory();
  const [savingLang, setSavingLang] = useState(false);
  const [savingSize, setSavingSize] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const onChangeLanguage = async (next: ExplainLanguage) => {
    if (next === prefs.defaultLanguage) return;
    setSavingLang(true);
    try {
      await updatePreferences({ defaultLanguage: next });
      void presentToast({ message: 'Default language updated.', duration: 1400, color: 'success' });
    } catch (e: any) {
      void presentToast({ message: String(e?.message ?? 'Could not save'), duration: 2200, color: 'danger' });
    } finally {
      setSavingLang(false);
    }
  };

  const onChangeTextSize = async (next: TextSize) => {
    if (next === prefs.textSize) return;
    setSavingSize(true);
    try {
      await updatePreferences({ textSize: next });
    } catch (e: any) {
      void presentToast({ message: String(e?.message ?? 'Could not save'), duration: 2200, color: 'danger' });
    } finally {
      setSavingSize(false);
    }
  };

  const handleSignOut = async () => {
    await presentLoading({ message: 'Signing out…', spinner: 'crescent', backdropDismiss: false });
    try {
      signOut();
    } finally {
      await dismissLoading();
      router.replace('/welcome');
    }
  };

  const currentSizePreview =
    TEXT_SIZES.find((s) => s.value === prefs.textSize)?.preview ?? 'text-[24px]';

  return (
    <StitchPage bottomNav={<StitchBottomNav active="settings" />}>
      <StitchHeader variant="settings" title="Settings" />

      <main className="max-w-2xl mx-auto px-6 pt-8 pb-32 space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="material-symbols-outlined text-teal-700"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  person
                </span>
                <h2 className="text-[24px] leading-[36px] font-semibold text-stone-900">My account</h2>
              </div>
              <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-l-4 border-teal-700 p-6 space-y-6">
                <div>
                  <p className="text-[14px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Name
                  </p>
                  <p className="text-[20px] font-medium text-stone-900 break-words">
                    {user?.name || 'Not set'}
                  </p>
                </div>
                <div className="border-t border-stone-100 pt-6">
                  <p className="text-[14px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Email
                  </p>
                  <p className="text-[20px] font-medium text-stone-900 break-words">
                    {user?.email || '—'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="w-full h-14 flex items-center justify-center gap-2 border-2 border-red-600 text-red-700 font-bold rounded-xl hover:bg-red-50 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined">logout</span>
                  <span>Sign out</span>
                </button>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="material-symbols-outlined text-teal-700"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  visibility
                </span>
                <h2 className="text-[24px] leading-[36px] font-semibold text-stone-900">
                  Reading preferences
                </h2>
              </div>
              <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-l-4 border-teal-500 p-6 space-y-8">
                <div className="space-y-3">
                  <label
                    htmlFor="default_language"
                    className="text-[14px] font-bold uppercase tracking-wider text-stone-600 block"
                  >
                    Default language
                  </label>
                  <div className="relative">
                    <select
                      id="default_language"
                      value={prefs.defaultLanguage}
                      disabled={savingLang}
                      onChange={(e) => void onChangeLanguage(e.target.value as ExplainLanguage)}
                      className="w-full h-14 appearance-none bg-stone-100 border-2 border-stone-300 rounded-xl px-4 pr-12 text-[18px] font-medium focus:border-teal-700 focus:ring-0 focus:outline-none disabled:opacity-60"
                    >
                      {LANG_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-stone-600">arrow_drop_down</span>
                    </div>
                  </div>
                  <p className="text-[14px] text-stone-500">
                    Used every time you open "Understand a message".
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="text-[14px] font-bold uppercase tracking-wider text-stone-600 block">
                    Text size
                  </label>
                  <div className="grid grid-cols-3 gap-2 bg-stone-100 p-2 rounded-2xl border-2 border-stone-200">
                    {TEXT_SIZES.map((size) => {
                      const isActive = prefs.textSize === size.value;
                      return (
                        <button
                          key={size.value}
                          type="button"
                          disabled={savingSize}
                          onClick={() => void onChangeTextSize(size.value)}
                          aria-pressed={isActive}
                          className={
                            isActive
                              ? 'h-14 flex items-center justify-center rounded-xl bg-white shadow-sm border border-stone-200 font-bold text-teal-800 transition-all active:scale-95'
                              : 'h-14 flex items-center justify-center rounded-xl hover:bg-stone-200/60 font-medium text-stone-600 transition-colors active:scale-95 disabled:opacity-60'
                          }
                        >
                          {size.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-end px-2">
                    <span className="text-[16px] text-stone-400">Aa</span>
                    <span className={`${currentSizePreview} font-bold text-stone-900`}>Aa</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="material-symbols-outlined text-teal-700"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  info
                </span>
                <h2 className="text-[24px] leading-[36px] font-semibold text-stone-900">
                  About finNotify
                </h2>
              </div>
              <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-l-4 border-stone-300 p-6 space-y-2">
                <button
                  type="button"
                  onClick={() => setHelpOpen(true)}
                  className="w-full flex items-center justify-between h-[72px] hover:bg-stone-50 rounded-lg px-2 transition-colors active:scale-[0.99]"
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-stone-500">help</span>
                    <span className="text-[20px] font-medium text-stone-900">Get help &amp; support</span>
                  </div>
                  <span className="material-symbols-outlined text-stone-400">chevron_right</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrivacyOpen(true)}
                  className="w-full flex items-center justify-between h-[72px] hover:bg-stone-50 rounded-lg px-2 transition-colors active:scale-[0.99]"
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-stone-500">policy</span>
                    <span className="text-[20px] font-medium text-stone-900">Privacy policy</span>
                  </div>
                  <span className="material-symbols-outlined text-stone-400">chevron_right</span>
                </button>
                <div className="pt-4 mt-4 border-t border-stone-100 text-center">
                  <p className="text-[14px] text-stone-400">Version 0.1.0 (Beta)</p>
                  <p className="text-[14px] text-stone-400 mt-1">
                    Protecting your financial peace of mind.
                  </p>
                </div>
              </div>
            </section>

            <div className="py-4 flex justify-center">
              <div className="w-24 h-1 bg-stone-200 rounded-full" />
            </div>
      </main>

      <IonAlert
        isOpen={helpOpen}
        onDidDismiss={() => setHelpOpen(false)}
        header="Get help &amp; support"
        message="If you need help, please email us at hello@finnotify.app and we'll get back to you within a day."
        buttons={[{ text: 'OK', role: 'cancel' }]}
      />
      <IonAlert
        isOpen={privacyOpen}
        onDidDismiss={() => setPrivacyOpen(false)}
        header="Privacy"
        message="The text you paste is sent securely to our server and to Google's Gemini AI to generate an explanation. We do not sell your data and we do not share your messages with third parties. Your saved history is private to your account."
        buttons={[{ text: 'OK', role: 'cancel' }]}
      />
    </StitchPage>
  );
};

export default Settings;
