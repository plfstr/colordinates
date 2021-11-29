var CACHE_NAME = 'dependencies-cache',
	REQUIRED_FILES = [
	  'index.html',
	  'app.min.js?20210330',
	  'styles.css?20211129'
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