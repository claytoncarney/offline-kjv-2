let appCaches = [{
  name: 'kjv-2-core-20190603.001',
  urls: [
    './',
    './index.html',
    './manifest.json',
    './sw.js',
    './bundle.js',
    './css/kjv.css',
    './js/sw-register.js'
  ]
},
{
  name: 'kjv-2-svg-20181004.001',
  urls: [
    './svg/bookmarks.svg',
    './svg/cancel.svg',
    './svg/columns-1.svg',
    './svg/columns-2.svg',
    './svg/columns-3.svg',
    './svg/copy.svg',
    './svg/delete.svg',
    './svg/down.svg',
    './svg/edit.svg',
    './svg/filter.svg',
    './svg/filters.svg',
    './svg/folders.svg',
    './svg/folders-add.svg',
    './svg/help.svg',
    './svg/history.svg',
    './svg/menu.svg',
    './svg/move.svg',
    './svg/move-copy.svg',
    './svg/next.svg',
    './svg/prev.svg',
    './svg/search.svg',
    './svg/search-go.svg',
    './svg/settings.svg',
    './svg/sort-ascend.svg',
    './svg/sort-descend.svg',
    './svg/tomes.svg',
    './svg/topics.svg',
    './svg/up.svg'
  ]
},
{
  name: 'kjv-2-font-20181004.001',
  urls: [
    './css/font.css',
    './font/lato-v14-latin-regular.woff2',
    './font/merriweather-v19-latin-regular.woff2',
    './font/open-sans-v15-latin-regular.woff2',
    './font/roboto-slab-v7-latin-regular.woff2',
    './font/roboto-v18-latin-regular.woff2',
    './font/slabo-27px-v4-latin-regular.woff2'
  ]
},
{
  name: 'kjv-2-icon-20181004.001',
  urls: [
    './icon/icon-32.png',
    './icon/icon-192.png',
    './icon/icon-512.png'
  ]
}];

let cacheNames = appCaches.map((cache) => cache.name);

self.addEventListener('install', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(appCaches.map(function (appCache) {
      if (keys.indexOf(appCache.name) === -1) {
        caches.open(appCache.name).then(function (cache) {
          console.log(`Caching: ${appCache.name}`);
          return cache.addAll(appCache.urls);
        });
      } else {
        console.log(`Found: ${appCache.name}`);
        return Promise.resolve(true);
      }
    }));
  }));
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (cacheNames.indexOf(key) === -1) {
          console.log(`Deleting: ${key}`);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response ||
        fetch(event.request).then(function (response) {
          return response;
        });
    }).catch(function (error) {
      console.log('Fetch failed:', error);
    })
  );
});
