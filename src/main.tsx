import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './auth/AuthContext';
import { PreferencesProvider } from './auth/PreferencesContext';
import { ShareReceiverProvider } from './auth/ShareContext';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <PreferencesProvider>
        <ShareReceiverProvider>
          <App />
        </ShareReceiverProvider>
      </PreferencesProvider>
    </AuthProvider>
  </React.StrictMode>
);
