// Ce service worker ne sert plus qu'à nettoyer l'ancien cache
// qui bloquait les mises à jour, puis à se désactiver lui-même.
self.addEventListener('install', function(event){
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(key){ return caches.delete(key); }));
    }).then(function(){
      return self.registration.unregister();
    }).then(function(){
      return self.clients.matchAll({ type: 'window' });
    }).then(function(clientsList){
      clientsList.forEach(function(client){ client.navigate(client.url); });
    })
  );
});
