import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { initSentry } from '@/lib/sentry';
import App from './App.tsx';
import './index.css';

// Initialize Sentry before rendering the app
initSentry();

// Register the service worker
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);