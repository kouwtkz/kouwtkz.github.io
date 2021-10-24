const CACHE_VERSION = "v1.2";
const CACHE_NAME = `${registration.scope}!${CACHE_VERSION}`;

// キャッシュするファイルをセットする
const urlsToCache = ["."];
((e) => {
    if (e !== null)
        e.innerHTML =
            "<p>" + CACHE_VERSION + "</p>" + "<p>" + CACHE_NAME + "</p>";
})(document.getElementById("output"));

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return cacheNames.filter((cacheName) => {
                    // このスコープに所属していて且つCACHE_NAMEではないキャッシュを探す
                    return (
                        cacheName.startsWith(`${registration.scope}!`) &&
                        cacheName !== CACHE_NAME
                    );
                });
            })
            .then((cachesToDelete) => {
                return Promise.all(
                    cachesToDelete.map((cacheName) => {
                        // いらないキャッシュを削除する
                        return caches.delete(cacheName);
                    })
                );
            })
    );
});
