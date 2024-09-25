const NodeCache = require('node-cache');

// Initialize cache with a 1-minute expiration (60 seconds)
const cache = new NodeCache({ stdTTL: 15, checkperiod: 30 });

// Cache middleware
const cacheMiddleware = (req, res, next) => {

  const key = req.originalUrl || req.url; // Use URL as the key
  // const slugs = ["/api/auth/check-auth", "/api/user/get/one", "/api/auth", "/api/user"]

  // Only cache GET requests
  if (req.method !== 'GET'){
    //  || slugs.some((slug) => key.includes(slug))) {
    return next();
  }


  // Check if data is in cache
  const cachedData = cache.get(key);
  if (cachedData) {
    console.log('Serving from cache:', key);
    return res.json(cachedData); // Send cached response
  }

  // Override res.json to cache the response data
  res.sendResponse = res.json;
  res.json = (body) => {
    cache.set(key, body); // Store response in cache
    res.sendResponse(body); // Send response to client
  };

  next(); // Move to the next middleware/route handler
};

// Function to manually clear expired cache entries
const clearExpiredCache = () => {
  cache.flushAll(); // Clears the entire cache
};

module.exports = { cacheMiddleware, clearExpiredCache };
