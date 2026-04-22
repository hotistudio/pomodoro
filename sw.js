// Service Worker — 전통 뽀모도로 PWA
// 캐시 버전을 올리면 기존 캐시가 갱신됩니다
const CACHE_NAME = 'pomodoro-v1';

// 오프라인에서도 작동해야 하는 필수 파일들
const ASSETS = [
  './',
  './index.html',
  './bg-light.png',
  './bg-dark.png',
  './KoPubWorld_Batang_Bold.ttf',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon.png'
];

// 설치 단계: 파일들을 미리 캐시에 저장
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 활성화 단계: 오래된 캐시 삭제
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 요청 가로채기: 캐시 우선, 없으면 네트워크
self.addEventListener('fetch', (event) => {
  // GET 요청만 처리
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      // 캐시에 없으면 네트워크에서 가져와서 캐시에 저장
      return fetch(event.request).then((response) => {
        // 유효한 응답만 캐싱 (외부 리소스는 제외)
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(() => {
        // 네트워크 실패 시 index.html 반환 (SPA 탐색용)
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
