const Resource = require('../models/resource');
const { recommendResources } = require('../services/resourceRecommendation');
const { getNextSequenceValue } = require("../utils/autoIncrement");
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

// Get a resource by ID
const getResourceById = async (req, res) => {
  const { id } = req.params;
  try {
    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json(resource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching resource by ID' });
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

// Update a resource by ID
const updateResource = async (req, res) => {
  const { id } = req.params;
  const { title, author, genre, description, status, slug, type, ai_approval, tags } = req.body;
  try {
    const existingResource = await Resource.findOne({ title, _id: { $ne: id } });
    if (existingResource) {
      return res.status(400).json({ message: 'Resource with the updated title already exists' });
    }

    const updatedResource = await Resource.findByIdAndUpdate(id, { title, author, description, genre, status, slug, type, ai_approval, tags }, { new: true });
    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(200).json(updatedResource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating resource' });
  }
};

// Delete a resource by ID
const deleteResource = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedResource = await Resource.findByIdAndDelete(id);
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

  try {
    if (sortBy) {
      queryOptions.sort = sortBy;
    }

    if (filterBy) {
      const filter = JSON.parse(filterBy);
      Object.assign(queryOptions, filter);
    }

    if (query) {
      queryOptions.$or = [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { genre: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    const results = await paginateResults(Resource.find(queryOptions), parseInt(page), parseInt(limit));
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching resources' });
  }
};

module.exports = {
  recommendResource,
  getResourceById,
  addResource,
  updateResource,
  deleteResource,
  getAllResources,
};
