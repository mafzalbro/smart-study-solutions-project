"use client";

const CACHE_EXPIRATION = 60000; // 1 minute (in milliseconds)
const CACHE_NAME = 'api-cache'; // Name of the cache

export const fetcher = async (url, method = 'GET', body = null, headers = {}) => {
  await clearExpiredCache(); // Check and remove all expired items

  const token = localStorage.getItem('token'); // Get token from local storage
  const path = window.location.pathname;

  // Check if method is GET, then use caching
  const cacheKey = `${url}-${JSON.stringify(body)}-${method}`;
  if (method === 'GET') {
    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
      // console.log('Serving from cache');
      return cachedData.data; // Return cached data if available
    }
  }

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}), // Include token in headers
    },
    credentials: 'include',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (response.status === 401 && !path.includes('/resources') && path !== new URL(process.env.NEXT_PUBLIC_FRONTEND_ORIGIN).pathname) {
    localStorage.removeItem('token'); // Remove token on unauthorized access
    window.location.replace(`${process.env.NEXT_PUBLIC_FRONTEND_ORIGIN}/login`);
  } else if (response.status === 200 && (path.includes('/login') || path.includes('/login/google') || path.includes('/register') || path.includes('/register/google'))) {
    window.location.replace('/');
  }

  const data = await response.json();

  // console.log({ data, status: response.status });

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  // Store new token if available in the response body
  if (data.token) {
    localStorage.setItem('token', data.token); // Store token
  }

  // If it's a GET request, cache the response data
  if (method === 'GET') {
    await setCachedData(cacheKey, data); // Cache the new data
  }

   // Store new token if available in the response body
  //  if (data.token) {
  //   localStorage.setItem('token', data.token); // Store token
  // }

  return data;
};

// Get cached data and check expiration
const getCachedData = async (key) => {
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
const setCachedData = async (key, data) => {
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
const clearExpiredCache = async () => {
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
