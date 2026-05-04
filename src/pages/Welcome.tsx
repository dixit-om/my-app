import { IonContent, IonPage } from '@ionic/react';
import { Link } from 'react-router-dom';

const Welcome: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen className="fin-stitch-bg">
        <div className="font-manrope text-stone-900 min-h-full bg-stone-50 flex flex-col">
          <main className="flex-grow flex flex-col items-center justify-center pt-12 pb-12 px-6 max-w-4xl mx-auto w-full">
            <div className="w-full mb-6 flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-[3rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] bg-stone-100 border border-stone-200/60 p-8 flex items-center justify-center">
                <img
                  alt="A senior person using a smartphone with a gentle smile"
                  className="w-full h-full object-cover rounded-[2rem]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS1PLmHdiS7iHsKZ0S9eEV2Piwhhp_dPX65mCLzdtj_XnVzwDsjFcJdFG0uDo9Oo-sSrX-IRrFeJV_SnFXfZ1U5gBFXluabqZJqWOoJkPjkRoY_RgYM4rORRUyDscgJjZcTCOzDyrxRU0vCprKunwhG66HhMFBHHb8vntwS3lHoY1nmlwuGcsF20b_ueqM9gdaHonl2YctH3TsIsO6xu7MqLOStEIZw3MOMzhK99j983oVEv_Tz26KxEGiVsma2p-8wC-nZ4-fdSI"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute -bottom-4 -right-4 bg-teal-100 p-4 rounded-2xl shadow-lg border border-teal-300">
                  <span className="material-symbols-outlined text-teal-800 text-4xl">
                    chat_bubble
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center space-y-3 max-w-lg mb-6">
              <h2 className="text-[32px] leading-[44px] font-bold tracking-tight text-stone-900">
                Understand your bank &amp; government messages in simple words.
              </h2>
              <div className="flex flex-col gap-2">
                <p className="text-[18px] leading-[28px] text-stone-700">
                  Digital banking made easy for you and your family.
                </p>
                <p className="text-[16px] leading-[24px] text-stone-500">
                  डिजिटल बैंकिंग अब आसान, आपके और आपके परिवार के लिए।
                </p>
              </div>
            </div>

            <div className="w-full max-w-sm flex flex-col gap-4">
              <Link to="/signup" className="block">
                <button
                  type="button"
                  className="h-14 w-full bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 duration-150"
                >
                  Get started
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </Link>

              <p className="text-center text-[14px] leading-[20px] font-bold text-stone-600 uppercase tracking-widest">
                Built with care for parents and seniors
              </p>

              <Link to="/login" className="block">
                <button
                  type="button"
                  className="w-full py-4 text-teal-700 font-semibold text-[18px] hover:underline transition-all"
                >
                  I already have an account
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full mt-12">
              <div className="bg-stone-100 p-6 rounded-2xl border-l-4 border-teal-600 flex items-start gap-4">
                <div className="bg-teal-100 p-2 rounded-lg shrink-0">
                  <span className="material-symbols-outlined text-teal-800">security</span>
                </div>
                <div>
                  <h3 className="font-bold text-stone-900">Private &amp; secure</h3>
                  <p className="text-[14px] text-stone-700">Only you see your history.</p>
                </div>
              </div>
              <div className="bg-stone-100 p-6 rounded-2xl border-l-4 border-amber-700 flex items-start gap-4">
                <div className="bg-amber-100 p-2 rounded-lg shrink-0">
                  <span className="material-symbols-outlined text-amber-800">translate</span>
                </div>
                <div>
                  <h3 className="font-bold text-stone-900">9 Indian languages</h3>
                  <p className="text-[14px] text-stone-700">
                    Hindi, Marathi, Tamil, Bengali and more.
                  </p>
                </div>
              </div>
            </div>
          </main>

          <footer className="mt-auto pb-12 px-6 border-t border-stone-200 bg-stone-50/60">
            <div className="max-w-4xl mx-auto pt-8 flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 opacity-60">
                <span className="material-symbols-outlined">verified_user</span>
                <span className="text-sm font-semibold">Privacy first</span>
              </div>
              <div className="flex items-center gap-2 opacity-60">
                <span className="material-symbols-outlined">auto_awesome</span>
                <span className="text-sm font-semibold">AI Explainer</span>
              </div>
            </div>
          </footer>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Welcome;
