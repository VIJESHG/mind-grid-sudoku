import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

import App from './App.tsx';
import './index.css';

registerSW({
  onOfflineReady() {
    console.log('MindGrid is ready to work offline.');
  },

  onRegisteredSW(_swUrl, registration) {
    console.log('MindGrid service worker registered.');

    if (registration) {
      console.log('MindGrid PWA is active.');
    }
  },

  onRegisterError(error) {
    console.error('MindGrid service worker registration failed:', error);
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);