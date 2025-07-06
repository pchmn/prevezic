export const appConfig = {
  buildDate: new Date(__BUILD_DATE__),
  version: import.meta.env.VITE_APP_VERSION,
  env: import.meta.env.VITE_APP_ENV,
  serverUrl: import.meta.env.VITE_SERVER_URL,
  convexUrl: import.meta.env.VITE_CONVEX_URL,
  convexSiteUrl: import.meta.env.VITE_CONVEX_SITE_URL,
};
