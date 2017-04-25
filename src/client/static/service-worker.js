var CACHE_NAME = 'phungible-v3';
var urlsToCache = [
	'/',
	'/index.html',
	'/js/app.js',
];

self.addEventListener('install', function(event) {
	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then(function(cache) {
			console.log('Opened cache');
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request)
		.then(function (cacheResponse) {
			if (cacheResponse) {
				return cacheResponse;
			}

			const fetchRequest = event.request.clone();
			return fetch(fetchRequest);
		})
	);
});
