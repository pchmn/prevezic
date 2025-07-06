import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({ autoCodeSplitting: true }),
    viteReact(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Prevezic',
        short_name: 'Prevezic',
        description: 'Prevezic - PWA Application',
        theme_color: '#171216',
        background_color: '#171216',
        display: 'standalone',
        // We use a query param to redirect to the home page if the app is running as a PWA
        // It will be intercepted by the loader and redirect to the home page
        start_url: '/?pwa=true',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
