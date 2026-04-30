/**
 * Maps Firebase Identity Toolkit error codes (and our backend network errors)
 * into short, human-readable messages safe to show in a toast.
 */

const FRIENDLY: Array<[RegExp, string]> = [
  [/^EMAIL_EXISTS/i, 'An account with this email already exists. Please sign in instead.'],
  [/^EMAIL_NOT_FOUND/i, 'We couldn\'t find an account for this email.'],
  [/^INVALID_EMAIL/i, 'That email address looks invalid.'],
  [/^INVALID_PASSWORD/i, 'Incorrect password. Please try again.'],
  [/^INVALID_LOGIN_CREDENTIALS/i, 'Email or password is wrong.'],
  [/^MISSING_PASSWORD/i, 'Please enter a password.'],
  [/^MISSING_EMAIL/i, 'Please enter an email address.'],
  [/^WEAK_PASSWORD/i, 'Password is too weak. Use at least 6 characters.'],
  [/^USER_DISABLED/i, 'This account has been disabled. Please contact support.'],
  [/^TOO_MANY_ATTEMPTS_TRY_LATER/i, 'Too many tries. Please wait a few minutes and try again.'],
  [/^OPERATION_NOT_ALLOWED/i, 'Email & password sign-in is turned off for this project. Enable it in Firebase Console → Authentication → Sign-in providers.'],
  [/^CONFIGURATION_NOT_FOUND/i, 'Firebase Authentication isn\'t set up yet. Open Firebase Console → Authentication → Get started → enable Email/Password.'],
  [/^email_and_password_required$/i, 'Please enter both email and password.'],
  [/^email_required$/i, 'Please enter your email.'],
  [/^missing_token$/i, 'Please sign in again.'],
  [/^invalid_token$/i, 'Your session has expired. Please sign in again.'],
  [/^auth_unavailable$/i, 'Server is not connected to Firebase yet. Please contact the developer.'],
  [/^firestore_unavailable$/i, 'Database is unavailable right now. Please try again shortly.'],
  [/^missing_gemini_key$/i, 'AI is not configured on the server. Please set GEMINI_API_KEY in backend/.env.local.'],
  [/^empty_ai_response$/i, 'AI returned an empty answer. Please try again.'],
  [/^Cannot reach server at /i, ''], // already friendly, keep as is
];

export function friendlyAuthError(raw: unknown): string {
  const text = String((raw as any)?.message ?? raw ?? '').trim();
  if (!text) return 'Something went wrong. Please try again.';
  for (const [re, friendly] of FRIENDLY) {
    if (re.test(text)) {
      return friendly || text;
    }
  }
  return text;
}
