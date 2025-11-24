import axios from 'axios'

const CACHE_NAME = 'pokedex-cache-v1'
const APP_SHELL = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon.svg',
  'https://pokeapi.co/api/v2/pokemon?limit=1010'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key)
          }
        })
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return caches.open(CACHE_NAME).then((cache) =>
        fetch(request)
          .then((response) => {
            if (response && response.status === 200 && response.type === 'basic') {
              cache.put(request, response.clone())
            }
            return response
          })
          .catch(() => caches.match('/'))
      )
    })
  )
})

let db=window.indexedDB.open('database');

const deleteOffline=(key)=>{
    
    db.onsuccess=event=>{
        let result=event.target.result;
        let transaccion=result.transaction('table', 'readwrite');
        let obj=transaccion.objectStore('table');
        const resultado=obj.delete(key);
        resultado.onsuccess=event2=>{
            const options=event2.target.result.key;
            tarea(key-1);
        }

    }
}

const fetch=(key)=>{
    
    db.onsuccess=event=>{
        let result=event.target.result;
        let transaccion=result.transaction('table', 'readwrite');
        let obj=transaccion.objectStore('table');
        const resultado=obj.get(key);
        resultado.onsuccess=async event2=>{
            if(event2.target.result.key!==null){
                const options=event2.target.result;
                const response=await axios.request(options);
                deleteOffline(key);
            } 
        }
    }
    console.log(event2.target.result.key);
}

self.addEventListener('sync',event=>{
    db.onsuccess=event=>{
        let result=event.target.result;
        let transaccion=result.transaction('table', 'readwrite');
        let obj=transaccion.objectStore('table');
        const resultado=obj.openCursor(null, 'prev');
        resultado.onsuccess=event2=>{
            console.log(event2.target.result.key);
            fetch(event2.target.result.key);
        }
    }

});