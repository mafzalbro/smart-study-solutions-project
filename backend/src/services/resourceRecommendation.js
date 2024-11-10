const Resource = require("../models/resource");

const recommendResources = async (user) => {
  try {
    let recommendations;

    // Step 1: If user is not provided, recommend 3 random resources
    if (!user) {
      recommendations = await Resource.aggregate([
        { $match: { status: true } }, // Only active resources
        { $sample: { size: 3 } }, // Randomly sample 3 resources
        {
          $project: {
            title: 1,
            degree: 1,
            profileImage: 1,
            slug: 1,
            type: 1,
            semester: 1,
            description: 1,
          },
        },
      ]);
    } else {
      // Step 2: Check if the user has interacted with resources
      const userLikedResources = await Resource.find({ likedBy: user.id });

      if (userLikedResources.length > 0) {
        // Step 3: Use full-text search to find similar resources based on the user's previous likes
        const similarResources = await Resource.aggregate([
          {
            $match: {
              // Match based on shared degree, type, or semester of the liked resources
              degree: { $in: userLikedResources.map((r) => r.degree) },
              type: { $in: userLikedResources.map((r) => r.type) },
              semester: { $in: userLikedResources.map((r) => r.semester) },
              _id: { $nin: userLikedResources.map((r) => r._id) }, // Exclude already liked resources
              status: true, // Ensure the resource is active
            },
          },
          { $limit: 5 }, // Limit the number of recommendations
          {
            $project: {
              title: 1,
              degree: 1,
              type: 1,
              slug: 1,
              profileImage: 1,
              semester: 1,
              description: 1,
            },
          },
        ]);

        recommendations = similarResources;
      } else {
        // Step 4: If no interactions, recommend random or popular resources
        recommendations = await Resource.aggregate([
          { $match: { status: true } }, // Only active resources
          { $sample: { size: 5 } }, // Randomly sample 5 resources
          {
            $project: {
              title: 1,
              degree: 1,
              type: 1,
              profileImage: 1,
              slug: 1,
              semester: 1,
              description: 1,
            },
          },
        ]);
      }
    }

    // Step 5: If no results found, provide default resources or random resources
    if (recommendations.length === 0) {
      recommendations = await Resource.aggregate([
        { $match: { status: true } },
        { $sample: { size: 5 } },
      ]);
    }

    return recommendations;
  } catch (error) {
    console.error("Error in recommendation process:", error);
    return [];
  }
};

module.exports = { recommendResources };
