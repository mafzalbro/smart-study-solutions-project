// cacheMiddleware.js
const NodeCache = require('node-cache');
const cache = new NodeCache();

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl || req.url;
  const cachedData = cache.get(key);
  
  if (cachedData) {
    return res.send(cachedData);
  }

  res.sendResponse = res.send;
  res.send = (body) => {
    cache.set(key, body, 10); // Cache for 10 seconds
    res.sendResponse(body);
  };

  next();
};

module.exports = cacheMiddleware;
