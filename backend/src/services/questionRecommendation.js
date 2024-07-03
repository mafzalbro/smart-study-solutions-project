const Question = require('../models/qna');
const Category = require('../models/category');
const { calculateCosineSimilarity, convertToVector } = require('../utils/similarity');

const questionRecommendation = async (user) => {
  try {
    const likedQuestions = await Question.find({ _id: { $in: user.likedQuestions } }).populate('category');

    // If the user has liked questions, use them for similarity-based recommendations
    if (likedQuestions.length > 0) {
      console.log("likedQuestions One");
      const allQuestions = await Question.find().populate('category');
      const allCategories = [...new Set(allQuestions.map(question => question.category._id.toString()))];
      const allTags = [...new Set(allQuestions.flatMap(question => question.tags))];
      
      const likedVectors = likedQuestions.map(question => convertToVector(question, allCategories, allTags));
      
      const questionScores = {};
      
      allQuestions.forEach(question => {
        if (!user.likedQuestions.includes(question._id.toString())) {
          const questionVector = convertToVector(question, allCategories, allTags);
          
          const similarityScore = likedVectors.reduce((acc, vec) => acc + calculateCosineSimilarity(vec, questionVector), 0) / likedVectors.length;
          
          questionScores[question._id] = similarityScore;
        }
      });
      
      const sortedQuestionIds = Object.keys(questionScores).sort((a, b) => questionScores[b] - questionScores[a]);
      
      const recommendedQuestions = await Question.find({ _id: { $in: sortedQuestionIds.slice(0, 3) } }).select('question slug').populate('category');
      
      if (recommendedQuestions.length > 0) {
        return recommendedQuestions;
      }
    }
    
    // If no liked questions or no recommendations found based on them, try using the favorite category
    if (user.favoriteGenre) {
      console.log("favoriteGenre One");
      const category = await Category.findOne({ name: user.favoriteGenre });
      const recommendedQuestions = await Question.find({
        $or: [
          { category: category ? category._id : null },
          { question: { $regex: user.favoriteGenre, $options: 'i' } }
        ]
      }).select('question slug').populate('category');
      
      if (recommendedQuestions.length > 0) {
        return recommendedQuestions;
      }
    }

    // If no recommendations found based on liked questions or favorite genre, fall back to random recommendations
    console.log("Not Any");
    const randomQuestions = await Question.aggregate([{ $sample: { size: 3 } }]).project({ question: 1, slug: 1 });
    return randomQuestions;
  } catch (error) {
    console.error('Error recommending questions:', error);
    throw error;
  }
};

module.exports = { questionRecommendation };
