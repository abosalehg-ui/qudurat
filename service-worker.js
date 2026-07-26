// نسخة الكاش تتغيّر مع كل إصدار يغيّر الأصول — activate يحذف ما سواها
const CACHE_NAME = 'qudurat-v3';

const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './fonts.css',
  './app-core.js',
  './questions.js',
  './app.js',
  './manifest.json',
  './icon.svg',
  './icon-180.png',
  './icon-512.png',
  './icon-maskable-512.png',
  // الخطوط جزء من الأصول: بدونها يسقط نص الاستيعاب المقروء إلى خط النظام
  './fonts/tajawal-300-arabic.woff2',
  './fonts/tajawal-300-latin.woff2',
  './fonts/tajawal-400-arabic.woff2',
  './fonts/tajawal-400-latin.woff2',
  './fonts/tajawal-500-arabic.woff2',
  './fonts/tajawal-500-latin.woff2',
  './fonts/tajawal-700-arabic.woff2',
  './fonts/tajawal-700-latin.woff2',
  './fonts/tajawal-800-arabic.woff2',
  './fonts/tajawal-800-latin.woff2',
  './fonts/amiri-400-arabic.woff2',
  './fonts/amiri-400-latin.woff2',
  './fonts/amiri-700-arabic.woff2',
  './fonts/amiri-700-latin.woff2'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // لم يعد التطبيق يطلب أي شيء من نطاق آخر (الخطوط صارت محلية)،
  // فما جاء من خارج المصدر يُترك للشبكة بلا تدخّل ولا تخزين.
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request).then((response) => {
        // لا نخزّن إلا الاستجابات الأساسية السليمة
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || networkFetch;
    })
  );
});
