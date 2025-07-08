import { ThemeProvider } from '@prevezic/ui/theme-provider';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { ConvexProviderWithAuth, ConvexReactClient } from 'convex/react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

// Import the generated route tree
import { routeTree } from './routeTree.gen.ts';

import { ConvexQueryClient } from '@convex-dev/react-query';
import '@prevezic/ui/style.css';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { del, get, set } from 'idb-keyval';
import 'react-advanced-cropper/dist/style.css';
import { appConfig } from './config/config.ts';
import { useAuth } from './hooks/useAuth.ts';
import { authClient } from './lib/auth.client.ts';
import reportWebVitals from './reportWebVitals.ts';
import './styles.css';

const convex = new ConvexReactClient(appConfig.convexUrl);
const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
      gcTime: Number.POSITIVE_INFINITY,
      networkMode: 'offlineFirst',
    },
  },
});
convexQueryClient.connect(queryClient);

const asyncStoragePersister = createAsyncStoragePersister({
  storage: {
    getItem: (key) => get(key),
    setItem: (key, value) => set(key, value),
    removeItem: (key) => del(key),
  },
});

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    authClient,
    queryClient,
    convex,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  Wrap: ({ children }) => (
    <ConvexProviderWithAuth
      client={convexQueryClient.convexClient}
      useAuth={useAuth}
    >
      {children}
    </ConvexProviderWithAuth>
  ),
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister }}
        >
          <RouterProvider router={router} />
        </PersistQueryClientProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
