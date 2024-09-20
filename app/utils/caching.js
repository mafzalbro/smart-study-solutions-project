
const CACHE_EXPIRATION = 60000; // 1 minute (in milliseconds)
const CACHE_NAME = 'api-cache'; // Name of the cache

// Get cached data and check expiration
export const getCachedData = async (key) => {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(key);
  if (!cachedResponse) return null;

  const cachedItem = await cachedResponse.json();
  const now = Date.now();

  // Check if the cache has expired
  if (now - cachedItem.timestamp > CACHE_EXPIRATION) {
    await cache.delete(key); // Clear expired cache
    return null;
  }

  return cachedItem;
};

// Set data in cache with a timestamp
export const setCachedData = async (key, data) => {
  const now = Date.now();
  const cacheItem = {
    data,
    timestamp: now,
  };

  const cache = await caches.open(CACHE_NAME);
  const response = new Response(JSON.stringify(cacheItem), {
    headers: { 'Content-Type': 'application/json' },
  });

  await cache.put(key, response); // Store cache item
};

// Clear all expired items from cache
export const clearExpiredCache = async () => {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  const now = Date.now();

  for (const request of keys) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      try {
        const cachedItem = await cachedResponse.json();
        if (cachedItem.timestamp && now - cachedItem.timestamp > CACHE_EXPIRATION) {
          await cache.delete(request); // Remove expired cache item
        }
      } catch (e) {
        // If parsing fails, skip and continue
        console.error(`Error parsing cache item for key: ${request.url}`, e);
      }
    }
  }
};

// Clear all expired items from cache
export const removeOlderCache = async (url) => {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  
  try {
    keys.forEach(async (request) => {
      if (request.url.includes(url)) {
    await cache.delete(request); // Remove matching cached request
  }

 })
}
 catch (e) {
        // If parsing fails, skip and continue
        console.error(`Error parsing cache item for key: ${request.url}`, e);
      }
    }
 