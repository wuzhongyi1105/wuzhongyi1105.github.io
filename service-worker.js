---
layout: null
---

importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');

`use strict`;

const
    version = '{{site.time}}',
    CACHE = "dylanwu's blog " + version,
    offlineURL = '/offline.html',
    // installFilesEssential = [],
    installFilesEssential = [
        '/',
        '/index.html',
        '/offline.html',
        '/css/iDisqus.min.css',
		'/css/iDisqus.min.css.map',
		'/css/main.css',
		'/css/nehan.book.css',
		'/css/nehan5.css',
		'/css/style.css',
        '/css/progressJS.css',
		'/js/custom.js',
		'/js/iDisqus.min.js',
		'/js/iDisqus.min.js.map',
		'/js/progressJS.min.js',
		'/js/jquery.touch.min.js',
		'/js/mousetrap.min.js',
		'/js/nehan.book.js',
		'/js/nehan.style.js',
		'/js/nehan5.min.js',
		'/js/toucher.js',
		'/js/script.js',
        'https://cdn.jsdelivr.net/npm/jquery/jquery@2.1.1/dist/jquery.min.js',
        'https://cdn.jsdelivr.net/npm/underscore@1.6.0/underscore-min.js',
        'https://cdn.jsdelivr.net/npm/backbone@1.1.2/backbone-min.js',
        'https://cdn.jsdelivr.net/npm/clipboard@1.5.10/dist/clipboard.min.js',
        'https://cdn.jsdelivr.net/npm/chart.xkcd@1.1/dist/chart.xkcd.min.js',
		'/assets/manifest.json',
		'/feed.xml',
		'/index.html',
		'/assets/paymnet/Alipay.jpg',
		'/assets/paymnet/Wechat.jpg',
		'/assets/icon/15194.svg',
		'/assets/icon/apple-touch-icon-114x114.png',
		'/assets/icon/apple-touch-icon-120x120.png',
		'/assets/icon/apple-touch-icon-144x144.png',
		'/assets/icon/apple-touch-icon-152x152.png',
		'/assets/icon/apple-touch-icon-180x180.png',
		'/assets/icon/apple-touch-icon-57x57.png',
		'/assets/icon/apple-touch-icon-72x72.png',
		'/assets/icon/apple-touch-icon-76x76.png',
		'/assets/icon/apple-touch-icon.png',
		'/assets/icon/favicon.ico',
    ].concat(offlineURL),
    installFilesDesirable = [];

// install static assets
function installStaticFiles() {
    return caches.open(CACHE)
        .then(cache => {
            // cache desirable files
            cache.addAll(installFilesDesirable);
            // cache essential files
            installFilesEssential.forEach(value => {
                try {
                    cache.add(value);
                } catch (e) {
                    console.log("cache error " + value);
                }
            });
            // return cache.addAll(installFilesEssential);
        });
}

// clear old caches
function clearOldCaches() {
    return caches.keys()
        .then(keylist => {
            return Promise.all(
                keylist
                    .filter(key => key !== CACHE)
                    .map(key => caches.delete(key))
            );
        });
}

// application installation
self.addEventListener('install', event => {
    console.log('service worker: install');
    // cache core files
    event.waitUntil(
        installStaticFiles()
            .then(() => self.skipWaiting())
    );
});

// application activated
self.addEventListener('activate', event => {
    console.log('service worker: activate');
    // delete old caches
    event.waitUntil(
        clearOldCaches()
            .then(() => self.clients.claim())
    );
});

// is image URL?
let iExt = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'].map(f => '.' + f);

function isImage(url) {
    return iExt.reduce((ret, ext) => ret || url.endsWith(ext), false);
}

// return offline asset
function offlineAsset(url) {
    if (isImage(url)) {
        // return image
        return new Response(
            '<svg role="img" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title>offline</title><path d="M0 0h400v300H0z" fill="#eee" /><text x="200" y="150" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="50" fill="#ccc">offline</text></svg>',
            {
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'no-store'
                }
            }
        );
    } else {
        // return page
        return caches.match(offlineURL);
    }

}

// application fetch network data
self.addEventListener('fetch', event => {
    // abandon non-GET requests
    if (event.request.method !== 'GET') return;
    let url = event.request.url;
    event.respondWith(
        caches.open(CACHE)
            .then(cache => {
                return cache.match(event.request)
                    .then(response => {
                        if (response) {
                            // return cached file
                            console.log('cache fetch: ' + url);
                            return response;
                        }
                        // make network request
                        return fetch(event.request)
                            .then(newreq => {
                                console.log('network fetch: ' + url);
                                if (newreq.ok) cache.put(event.request, newreq.clone());
                                return newreq;
                            })
                            // app is offline
                            .catch(() => offlineAsset(url));
                    });
            })
    );
});