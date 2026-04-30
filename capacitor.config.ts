import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'finNotify',
  webDir: 'dist',
  server: {
    // Allow plain HTTP requests (e.g. http://localhost:3001 in dev).
    // The AndroidManifest already has android:usesCleartextTraffic="true",
    // this just makes Capacitor honour it explicitly.
    cleartext: true,
  },
  android: {
    // The Capacitor WebView is served from https://localhost/ on Android.
    // Without this, fetching http://localhost:3001/* is blocked as mixed
    // content. Allowing mixed content is fine for dev; in production we'd
    // serve the backend over HTTPS instead.
    allowMixedContent: true,
  },
};

export default config;
