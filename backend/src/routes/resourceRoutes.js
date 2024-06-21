// routes/resources.js

const express = require('express');
const router = express.Router();
const {
  recommendResource,
  getResourceById,
  addResource,
  updateResource,
  deleteResource,
  getAllResources,
} = require('../controllers/resourceController');

// Define routes
router.get('/recommend', recommendResource);
router.get('/:id', getResourceById);
router.post('/', addResource);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);
router.get('/', getAllResources); // GET /?page=1&limit=5&sortBy=title&filterBy={"status":"active"}&query=keyword

module.exports = router;
