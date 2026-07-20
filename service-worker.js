---
layout: null
---
/* OneSignal: keep this import so push can share the custom worker. */
importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');

const VERSION = '{{ site.time | date: "%Y%m%d%H%M%S" }}';
const SHELL_CACHE = 'huzun-shell-' + VERSION;
const RUNTIME_CACHE = 'huzun-runtime-' + VERSION;
const OFFLINE_URL = '/offline.html';

const PRECACHE_URLS = [
  '/',
  OFFLINE_URL,
  '/manifest.json',
  '/css/main.css',
  '/css/style.css',
  '/css/nehan5.css',
  '/css/nehan.book.css',
  '/css/progressJS.css',
  '/js/custom.js',
  '/js/script.js',
  '/js/nehan5.min.js',
  '/js/nehan.book.js',
  '/js/nehan.style.js',
  '/js/mousetrap.min.js',
  '/js/toucher.min.js',
  '/js/progressJS.min.js',
  '/assets/icon/favicon.ico',
  '/assets/icon/apple-touch-icon-180x180.png',
  '/assets/icon/apple-touch-icon-192x192.png',
  '/assets/icon/apple-touch-icon-512x512.png'
];

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' ||
    (request.method === 'GET' && (request.headers.get('accept') || '').includes('text/html'));
}

function isStaticAsset(url) {
  return /\.(?:css|js|mjs|png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|otf)(?:\?.*)?$/i.test(url.pathname);
}

function shouldBypass(url) {
  const host = url.hostname;
  return (
    host.includes('onesignal.com') ||
    host.includes('google-analytics.com') ||
    host.includes('googletagmanager.com') ||
    host.includes('google.com') ||
    host.includes('gstatic.com') ||
    host.includes('googleapis.com') ||
    host.includes('umami.dylanwu.space') ||
    host.includes('comment.dylanwu.space') ||
    host.includes('moe.counter') ||
    host.includes('jsdelivr.net') ||
    host.includes('bootcss.com') ||
    host.includes('bootcdn.net') ||
    host.includes('travellings.cn') ||
    host.includes('foreverblog.cn')
  );
}

function offlineImageResponse() {
  return new Response(
    '<svg role="img" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title>offline</title><path d="M0 0h400v300H0z" fill="#eee"/><text x="200" y="150" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="40" fill="#999">offline</text></svg>',
    {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-store'
      }
    }
  );
}

async function precacheShell() {
  const cache = await caches.open(SHELL_CACHE);
  await Promise.all(
    PRECACHE_URLS.map(async (url) => {
      try {
        await cache.add(url);
      } catch (err) {
        console.warn('[sw] precache failed:', url, err);
      }
    })
  );
}

async function clearOldCaches() {
  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter((key) => key !== SHELL_CACHE && key !== RUNTIME_CACHE)
      .map((key) => caches.delete(key))
  );
}

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request) || await caches.match(request);
    if (cached) return cached;
    if (isNavigationRequest(request)) {
      return caches.match(OFFLINE_URL);
    }
    if (/\.(?:png|jpe?g|gif|webp|bmp|svg)(?:\?.*)?$/i.test(new URL(request.url).pathname)) {
      return offlineImageResponse();
    }
    throw err;
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    // Refresh in background when possible.
    fetch(request).then((response) => {
      if (response && response.ok) {
        caches.open(SHELL_CACHE).then((cache) => cache.put(request, response));
      }
    }).catch(() => {});
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(SHELL_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    if (/\.(?:png|jpe?g|gif|webp|bmp|svg)(?:\?.*)?$/i.test(new URL(request.url).pathname)) {
      return offlineImageResponse();
    }
    throw err;
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(precacheShell());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    clearOldCaches().then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch (err) {
    return;
  }

  // Let the browser / OneSignal handle cross-origin and analytics traffic.
  if (!isSameOrigin(url) || shouldBypass(url)) return;

  if (isNavigationRequest(request) || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(networkFirst(request));
});
