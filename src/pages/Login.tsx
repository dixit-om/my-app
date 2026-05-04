import { useIonLoading, useIonToast } from '@ionic/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import StitchPage from '../components/StitchPage';
import StitchHeader from '../components/StitchHeader';
import { login } from '../services/authApi';
import { friendlyAuthError } from '../services/authErrors';
import { useAuth } from '../auth/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [presentToast] = useIonToast();
  const [presentLoading, dismissLoading] = useIonLoading();
  const history = useHistory();
  const location = useLocation<{ from?: string }>();
  const { signInWithToken } = useAuth();

  const onLogin = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter your email and password to continue.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    await presentLoading({ message: 'Signing you in…', spinner: 'crescent', backdropDismiss: false });
    try {
      const data = await login({ email: email.trim(), password });
      signInWithToken(data.idToken);
      void presentToast({ message: 'Welcome back.', duration: 1400, color: 'success' });
      const next = location.state?.from ?? '/home';
      history.replace(next);
    } catch (err: any) {
      setErrorMsg(friendlyAuthError(err));
    } finally {
      await dismissLoading();
      setLoading(false);
    }
  };

  const goBack = () => {
    history.replace('/welcome');
  };

  return (
    <StitchPage menuHost={false}>
      <StitchHeader
        variant="back"
        onBack={goBack}
        rightSlot={
          <div className="flex items-center">
            <span className="material-symbols-outlined text-stone-600 text-2xl">account_circle</span>
          </div>
        }
      />

      <main className="max-w-md mx-auto px-6 py-10 flex flex-col gap-6">
            <header className="flex flex-col gap-2">
              <h2 className="text-[32px] leading-[44px] font-bold tracking-tight text-teal-900">Welcome back</h2>
              <p className="text-[18px] leading-[28px] text-stone-700">
                Sign in to securely access your financial alerts and explanations.
              </p>
            </header>

            {errorMsg ? (
              <div className="bg-red-100 p-5 rounded-xl border-l-4 border-red-700 flex gap-4 items-start shadow-sm">
                <span
                  className="material-symbols-outlined text-red-700 mt-1"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  error
                </span>
                <div className="flex flex-col">
                  <p className="text-[16px] leading-[24px] text-red-900">{errorMsg}</p>
                </div>
              </div>
            ) : null}

            <form onSubmit={onLogin} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-[14px] leading-[20px] font-bold uppercase tracking-wider text-stone-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., name@example.com"
                  className="w-full h-14 px-4 rounded-xl border-2 border-stone-300 bg-white focus:border-teal-700 focus:ring-0 focus:outline-none transition-colors text-[18px] leading-[28px] placeholder:text-stone-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="password"
                    className="text-[14px] leading-[20px] font-bold uppercase tracking-wider text-stone-700"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-14 px-4 pr-12 rounded-xl border-2 border-stone-300 bg-white focus:border-teal-700 focus:ring-0 focus:outline-none transition-colors text-[18px] leading-[28px] placeholder:text-stone-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-[14px] leading-[20px] font-bold uppercase tracking-wider text-teal-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-teal-800 text-white font-bold text-lg rounded-full shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in…' : 'Log in'}
                {!loading ? <span className="material-symbols-outlined text-xl">login</span> : null}
              </button>
            </form>

            <div className="mt-8 rounded-2xl overflow-hidden bg-stone-200 h-48 relative shadow-inner">
              <img
                alt="A serene and secure financial environment"
                className="w-full h-full object-cover opacity-60 grayscale"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkNKu5oMHSHtQy-R1vhkGyVBv_H1MQhkTIPbrbvpwd3RcYH5liUsUX-tyRlg35u8vij8zL8McdIMPTR5aJdzePr8cQ8u8Dru2cBrHP8vLihFiKCx5FWTlsvVrpj-676bHC1B2265ZeawQKQT01GGH80YPFYqu5l_PVruqRaNuNEiQGUjvTqIktlGF6DIMn_t7ssEq-b1yVfJHLD7jFG79GL0MqJxQI8PxJmZZLZRypdCfQX3UKz_073vnR48HnzGI_dHvhaXKCp5I"
                onError={(e) => {
                  (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[16px] leading-[24px] text-teal-900 font-semibold italic">
                  "Your financial security is our priority."
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 mt-4">
              <p className="text-[16px] leading-[24px] text-stone-700">Don't have an account yet?</p>
              <Link
                to="/signup"
                className="px-8 py-3 rounded-full border-2 border-teal-800 text-teal-800 font-bold hover:bg-teal-50 transition-colors active:scale-95"
              >
                Create new account
              </Link>
            </div>
      </main>
    </StitchPage>
  );
};

export default Login;
