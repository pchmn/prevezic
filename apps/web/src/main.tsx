import '@/core/firebase';
import '@/core/i18n';
import './index.css';

import { UiProvider } from '@prevezic/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import routes from '@/App';

const queryClient = new QueryClient();

const router = createBrowserRouter([routes]);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <UiProvider>
      <RouterProvider router={router} />
    </UiProvider>
  </QueryClientProvider>
);
