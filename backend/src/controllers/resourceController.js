const Resource = require('../models/resource');
const { recommendResources } = require('../services/resourceRecommendation');
const { getNextSequenceValue } = require('../utils/autoIncrement');
const { paginateResults } = require('../utils/pagination');

// Recommend a resource for the authenticated user
const recommendResource = async (req, res) => {
  try {
    const user = req.user;
    const recommendedResources = await recommendResources(user);
    res.status(200).json(recommendedResources);
  } catch (error) {
    console.error('Error recommending resources:', error);
    res.status(500).json({ message: 'Error recommending resources' });
  }
};

// Get a resource by slug
const getResourceBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const resource = await Resource.findOne({ slug });
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json(resource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching resource by slug' });
  }
};

// Add a new resource
const addResource = async (req, res) => {
  const { title, author, genre, description, status, slug, type, ai_approval, tags } = req.body;
  try {
    const existingResource = await Resource.findOne({ slug });
    if (existingResource) {
      return res.status(400).json({ message: 'Resource with the same slug already exists' });
    }

    const serialNumber = await getNextSequenceValue('resourceSerial', 'Resource');
    const newResource = new Resource({ serialNumber, title, author, description, genre, status, slug, type, ai_approval, tags });
    await newResource.save();
    res.status(201).json({ message: 'Resource added successfully', resource: newResource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding resource' });
  }
};

// Update a resource by slug
const updateResourceBySlug = async (req, res) => {
  const { slug } = req.params;
  const { title, author, genre, description, status, type, ai_approval, tags, rating, ratingCount, likes, dislikes } = req.body;
  try {
    const existingResource = await Resource.findOne({ slug });
    if (!existingResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const updatedResource = await Resource.findOneAndUpdate({ slug }, { title, author, description, genre, status, type, ai_approval, tags, rating, ratingCount, likes, dislikes }, { new: true });
    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json(updatedResource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating resource' });
  }
};

// Delete a resource by slug
const deleteResourceBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const deletedResource = await Resource.findOneAndDelete({ slug });
    if (!deletedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting resource' });
  }
};

// Get all resources with optional sorting, filtering, and searching
const getAllResources = async (req, res) => {
  const { page = 1, limit = 5, sortBy, filterBy, query } = req.query;

  let queryOptions = {};
  let sortOptions = {};

  try {
    // Parse sorting options
    if (sortBy) {
      const [field, direction] = sortBy.split(':');
      sortOptions[field] = direction === 'desc' ? -1 : 1;
    }

    // Parse filtering options
    if (filterBy) {
      try {
        const filter = JSON.parse(filterBy);
        Object.assign(queryOptions, filter);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid filterBy parameter' });
      }
    }

    // Parse search query
    if (query) {
      queryOptions.$or = [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { genre: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    // Fetch results with pagination and sorting
    const results = await paginateResults(
      Resource.find(queryOptions).sort(sortOptions),
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json({ results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching resources' });
  }
};

// Like a resource by slug
const likeResource = async (req, res) => {
  const { slug } = req.params;
  const userId = req.user.id; // Assuming user ID is available in the request
  try {
    const resource = await Resource.findOne({ slug });
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if the user has already liked the resource
    if (resource.likedBy.includes(userId)) {
      return res.status(400).json({ message: 'You have already liked this resource', likes: resource.likes, dislikes: resource.dislikes });
    }

    // If the user has disliked the resource, remove the dislike
    if (resource.dislikedBy.includes(userId)) {
      resource.dislikes -= 1;
      resource.dislikedBy.pull(userId);
    }

    // Add the like
    resource.likes += 1;
    resource.likedBy.push(userId);
    await resource.save();

    res.status(200).json({ message: 'Resource liked successfully', likes: resource.likes, dislikes: resource.dislikes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error liking resource' });
  }
};

// Dislike a resource by slug
const dislikeResource = async (req, res) => {
  const { slug } = req.params;
  const userId = req.user.id; // Assuming user ID is available in the request
  try {
    const resource = await Resource.findOne({ slug });
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if the user has already disliked the resource
    if (resource.dislikedBy.includes(userId)) {
      return res.status(400).json({ message: 'You have already disliked this resource', likes: resource.likes, dislikes: resource.dislikes });
    }

    // If the user has liked the resource, remove the like
    if (resource.likedBy.includes(userId)) {
      resource.likes -= 1;
      resource.likedBy.pull(userId);
    }

    // Add the dislike
    resource.dislikes += 1;
    resource.dislikedBy.push(userId);
    await resource.save();

    res.status(200).json({ message: 'Resource disliked successfully', likes: resource.likes, dislikes: resource.dislikes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error disliking resource' });
  }
};

const rateResource = async (req, res) => {
  const { slug } = req.params;
  const { rating } = req.body;
  const userId = req.user.id; // Assuming user ID is available in the request
  try {
    if (!rating) {
      return res.status(400).json({ message: 'Rating key in request body is required' });
    }

    if (!slug) {
      return res.status(400).json({ message: 'Please provide slug of the resource' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'User id not found' });
    }

    const resource = await Resource.findOne({ slug });
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Find if the user has already rated the resource
    const existingRating = resource.ratings.find(r => r.userId.toString() === userId.toString());

    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this resource' });
    }

    // Add the new rating
    resource.ratings.push({ userId, rating });
    resource.rating = ((resource.rating * resource.ratingCount) + rating) / (resource.ratingCount + 1);
    resource.ratingCount += 1;

    await resource.save();
    res.status(200).json({ message: 'Resource rated successfully', resource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error rating resource' });
  }
};

module.exports = {
  recommendResource,
  getResourceBySlug,
  addResource,
  updateResourceBySlug,
  deleteResourceBySlug,
  getAllResources,
  likeResource,
  dislikeResource,
  rateResource,
};
