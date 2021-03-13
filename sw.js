var CACHE_NAME = 'dependencies-cache',
	REQUIRED_FILES = [
	  'index.html?20210313',
	  'app.min.js',
	  'styles.css'
	];

self.addEventListener('install', function(event) {
	event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(REQUIRED_FILES);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
	      if (response) {
	      return response;
    	}
    	return fetch(event.request);
      }
    )
  );
});
	
self.addEventListener('activate', function(event) {
	event.waitUntil(self.clients.claim());
});