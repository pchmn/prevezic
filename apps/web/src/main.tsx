import { UiProvider } from '@prevezic/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'src/app/App';
import './index.css';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UiProvider>
      <App />
    </UiProvider>
  </React.StrictMode>
);
