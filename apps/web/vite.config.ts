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
        name: 'ACC 40 ans',
        short_name: 'ACC 40 ans',
        description: 'ACC 40 ans - PWA Application',
        theme_color: '#e8bce7',
        background_color: '#e8bce7',
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
  define: {
    __BUILD_DATE__: JSON.stringify(
      process.env.BUILD_DATE || new Date().toISOString(),
    ),
  },
});
