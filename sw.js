// 내용을 고친 뒤에는 아래 숫자를 하나 올려 주세요 (v1 → v2). 그래야 이미 설치한 폰도 새 파일을 받아요.
const CACHE = 'obang-v8';
const FILES = ["./", "index.html", "love.html", "manifest.webmanifest", "data.js", "firebase-config.js", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "cards/00.jpg", "cards/01.jpg", "cards/02.jpg", "cards/03.jpg", "cards/04.jpg", "cards/05.jpg", "cards/06.jpg", "cards/07.jpg", "cards/08.jpg", "cards/09.jpg", "cards/10.jpg", "cards/11.jpg", "cards/12.jpg", "cards/13.jpg", "cards/14.jpg", "cards/15.jpg", "cards/16.jpg", "cards/17.jpg", "cards/18.jpg", "cards/19.jpg", "cards/20.jpg", "cards/21.jpg", "cards/22.jpg", "cards/23.jpg", "cards/24.jpg", "cards/25.jpg", "cards/26.jpg", "cards/27.jpg", "cards/28.jpg", "cards/29.jpg", "cards/30.jpg", "cards/31.jpg", "cards/32.jpg", "cards/33.jpg", "cards/34.jpg", "cards/35.jpg", "cards/36.jpg", "cards/37.jpg", "cards/38.jpg", "cards/39.jpg", "cards/40.jpg", "cards/41.jpg", "cards/42.jpg", "cards/43.jpg", "cards/44.jpg", "cards/45.jpg", "cards/46.jpg", "cards/47.jpg", "cards/48.jpg", "cards/49.jpg", "cards/50.jpg", "cards/51.jpg", "cards/52.jpg", "cards/53.jpg", "cards/54.jpg", "cards/55.jpg", "cards/56.jpg", "cards/57.jpg", "cards/58.jpg", "cards/59.jpg", "cards/60.jpg", "cards/61.jpg", "cards/62.jpg", "cards/63.jpg", "cards/64.jpg", "cards/65.jpg", "cards/66.jpg", "cards/67.jpg", "cards/68.jpg", "cards/69.jpg", "cards/70.jpg", "cards/71.jpg", "cards/72.jpg", "cards/73.jpg", "cards/74.jpg", "cards/75.jpg", "cards/76.jpg", "cards/77.jpg", "cards/back.jpg"];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // 관리자 서버(Firebase) 통신은 저장하지 않고 그대로 보냄
  const keep = url.origin === self.location.origin || ['fonts.googleapis.com', 'fonts.gstatic.com', 'www.gstatic.com'].indexOf(url.hostname) >= 0;
  if (!keep) return;
  // 화면(HTML)과 문구 파일(data.js)은 인터넷에서 먼저 받아 최신 내용을 보여 주고, 연결이 없으면 저장본을 씀
  if (req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('.js') || url.pathname.endsWith('/')) {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((r) => r || caches.match('index.html')))
    );
    return;
  }
  // 카드 그림·아이콘·글꼴은 저장본을 먼저 써서 빠르게
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }))
  );
});
