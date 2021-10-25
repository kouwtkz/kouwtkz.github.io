const CACHE_VERSION = "v1.5_2020-10-25";
const CACHE_VERSION_BEFORE = "v1.4";
const CACHE_NAME = `${registration.scope}!${CACHE_VERSION}`;

// キャッシュするファイルをセットする
const urlsToCache = ["."];

self.addEventListener("message", (e) => {
    e.source.postMessage({
        cache_version: CACHE_VERSION,
        cache_name: CACHE_NAME,
        before_cache_version: CACHE_VERSION_BEFORE,
        data: e.data
    });
});
addEventListener("fetch", (event) => {
    event.waitUntil(
        (async function () {
            if (!event.clientId) return;
            const client = await clients.get(event.clientId);
            if (!client) return;
            client.postMessage({
                msg: "call fetch",
                url: event.request.url,
            });
        })()
    );
});
