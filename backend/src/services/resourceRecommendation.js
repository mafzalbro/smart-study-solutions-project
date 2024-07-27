const Resource = require('../models/resource');
const { calculateCosineSimilarity, convertToVector } = require('../utils/similarity');

const recommendResources = async (user) => {
  try {
    const likedResources = user?.likedResources ? await Resource.find({ _id: { $in: user.likedResources } }) : [];

    // If the user has liked resources, use them for similarity-based recommendations
    if (likedResources.length > 0) {
      const allResources = await Resource.find();
      const allGenres = [...new Set(allResources.map(resource => resource.genre))];
      const allTags = [...new Set(allResources.flatMap(resource => resource.tags))];

      const likedVectors = likedResources.map(resource => convertToVector(resource, allGenres, allTags));

      const resourceScores = {};

      allResources.forEach(resource => {
        if (!user.likedResources.includes(resource._id.toString())) {
          const resourceVector = convertToVector(resource, allGenres, allTags);

          const similarityScore = likedVectors.reduce((acc, vec) => acc + calculateCosineSimilarity(vec, resourceVector), 0) / likedVectors.length;

          resourceScores[resource._id] = similarityScore;
        }
      });

      const sortedResourceIds = Object.keys(resourceScores).sort((a, b) => resourceScores[b] - resourceScores[a]);

      const recommendedResources = await Resource.find({ _id: { $in: sortedResourceIds.slice(0, 3) } });

      if (recommendedResources.length > 0) {
        return recommendedResources;
      }
    }

    // If no liked resources or no recommendations found based on them, try using the favorite genre
    if (user?.favoriteGenre) {
      const recommendedResources = await Resource.find({
        $or: [
          { genre: user?.favoriteGenre },
          { title: { $regex: user?.favoriteGenre, $options: 'i' } }
        ]
      });

      if (recommendedResources.length > 0) {
        return recommendedResources;
      }
    }

    // If no recommendations found based on liked resources or favorite genre, fall back to random recommendations
    return await Resource.aggregate([{ $sample: { size: 3 } }]);
  } catch (error) {
    console.error('Error recommending resources:', error);
    throw error;
  }
};

module.exports = { recommendResources };
