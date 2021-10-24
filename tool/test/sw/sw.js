const CACHE_VERSION = "v1.4";
const CACHE_NAME = `${registration.scope}!${CACHE_VERSION}`;

// キャッシュするファイルをセットする
const urlsToCache = ["."];

self.addEventListener("message", (e) => {
    e.source.postMessage({
        cashe_version: CACHE_VERSION,
        cashe_name: CACHE_NAME,
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
