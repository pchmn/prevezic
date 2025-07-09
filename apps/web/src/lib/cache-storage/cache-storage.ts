const CACHE_NAME = 'shared-cache';
const CACHE_TTL = 86400000; // 24 hours
const CACHE_KEY = 'invitation-token';

export const cacheToken = async (token: string) => {
  if ('caches' in window) {
    await caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.put(
          CACHE_KEY,
          new Response(
            JSON.stringify({ token, expires: Date.now() + CACHE_TTL }),
          ),
        ),
      )
      .catch((error) => {
        console.error('Error caching token:', error);
      });
  } else {
    console.warn('Cache storage not supported');
  }
};

export const isPwa = () => {
  return window.matchMedia('(display-mode: standalone)').matches;
};

export const getToken = async () => {
  if ('caches' in window) {
    const cache = await caches.open(CACHE_NAME);
    const cachedToken = await cache.match(CACHE_KEY);
    if (cachedToken) {
      const { token, expires } = (await cachedToken.json()) as {
        token: string;
        expires: number;
      };
      if (Date.now() < expires) {
        return token;
      }
    }
    return null;
  }
  console.warn('Cache storage not supported');
  return null;
};

export const clearToken = async () => {
  if ('caches' in window) {
    await caches.delete(CACHE_NAME);
  } else {
    console.warn('Cache storage not supported');
  }
};
