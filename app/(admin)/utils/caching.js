let CACHE_EXPIRATION = 60000; // 1 minute (in milliseconds)
const CACHE_NAME = "api-cache"; // Name of the cache

const changeExpirationTime = (
  key,
  time = 60000,
  slugs = ["/api/admin/check-auth"]
) => {
  if (slugs.some((slug) => key.includes(slug))) {
    CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hrs
  } else {
    CACHE_EXPIRATION = time;
  }
};

// Get cached data and check expiration
export const getCachedData = async (key) => {
  changeExpirationTime(key);
  
  // console.log({CACHE_EXPIRATION, key})

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
    headers: { "Content-Type": "application/json" },
  });

  await cache.put(key, response); // Store cache item
};

// Clear all expired items from cache
export const clearExpiredCache = async () => {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  const now = Date.now();

  for (const request of keys) {
    changeExpirationTime(request.url);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      try {
        const cachedItem = await cachedResponse.json();
        if (
          cachedItem.timestamp &&
          now - cachedItem.timestamp > CACHE_EXPIRATION
        ) {
          await cache.delete(request); // Remove expired cache item
        }
      } catch (e) {
        // If parsing fails, skip and continue
        console.error(`Error clearing expired caches`, e);
      }
    }
  }
};

// Clear all user cache history
export const removeUserCacheHistory = async () => {

  // const token = localStorage.getItem('token')

    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    try {
      keys.forEach(async (request) => {
        await cache.delete(request); // Remove matching cached request
      });
    } catch (e) {
      // If parsing fails, skip and continue
      console.error(`Error clearing history`, e);
    }
};
