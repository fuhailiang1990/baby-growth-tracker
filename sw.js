const CACHE_NAME = 'baby-v5';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './vendor/firebase-app-compat.js',
  './vendor/firebase-auth-compat.js',
  './vendor/firebase-database-compat.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// 页面导航请求：网络优先，拿到新版本就更新缓存（保证发版后能尽快看到新页面）
function networkFirst(request) {
  return fetch(request).then(networkResponse => {
    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
      const clone = networkResponse.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
    }
    return networkResponse;
  }).catch(() => {
    return caches.match(request).then(cached => cached || caches.match('./index.html'));
  });
}

// 静态资源：缓存优先，离线可用
function cacheFirst(request) {
  return caches.match(request).then(response => {
    if (response) return response;
    return fetch(request).then(networkResponse => {
      if (!networkResponse || networkResponse.status !== 200) return networkResponse;
      if (networkResponse.type === 'basic') {
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
      }
      return networkResponse;
    }).catch(() => {
      if (request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    });
  });
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // 只处理同源请求；Firebase CDN 等跨域请求直接走网络
  if (url.origin !== self.location.origin) return;
  const isNavigation = event.request.mode === 'navigate' || url.pathname.endsWith('index.html') || url.pathname.endsWith('/');
  event.respondWith(isNavigation ? networkFirst(event.request) : cacheFirst(event.request));
});
