'use strict';
const CACHE='divine-game-shell-v039',PREFIX='divine-game-shell-',ROOT=new URL('./',self.location.href).href;
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'].map(p=>new URL(p,ROOT).href);
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
const req=e.request,u=new URL(req.url);
if(req.method!=='GET'||!u.href.startsWith(ROOT))return;
if(req.mode==='navigate'){e.respondWith((async()=>{try{const response=await fetch(req);if(response.ok){if(u.pathname===new URL(ROOT).pathname||u.pathname===new URL('index.html',ROOT).pathname){try{const c=await caches.open(CACHE);await c.put(ROOT,response.clone());}catch{}}return response;}if(response.status<500)return response;throw new Error('Server unavailable');}catch{const cached=await caches.match(ROOT);return cached||Response.error();}})());return;}
if(SHELL.includes(u.href)){e.respondWith((async()=>{try{const res=await fetch(req);if(res.ok){try{const c=await caches.open(CACHE);await c.put(req,res.clone());}catch{}}return res;}catch{return await caches.match(req)||Response.error();}})());}
});
