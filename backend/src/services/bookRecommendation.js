// services/bookRecommendation.js
const Book = require('../models/book');
const { calculateCosineSimilarity, convertBookToVector } = require('../utils/similarity');

const recommendBooks = async (user) => {
  try {
    const likedBooks = await Book.find({ _id: { $in: user.likedBooks } });

    if (likedBooks.length === 0) {
      return await Book.aggregate([{ $sample: { size: 3 } }]);
    }

    const allBooks = await Book.find();
    const allGenres = [...new Set(allBooks.map(book => book.genre))];
    const allTags = [...new Set(allBooks.flatMap(book => book.tags))];

    const likedVectors = likedBooks.map(book => convertBookToVector(book, allGenres, allTags));

    const bookScores = {};

    allBooks.forEach(book => {
      if (!user.likedBooks.includes(book._id.toString())) {
        const bookVector = convertBookToVector(book, allGenres, allTags);

        const similarityScore = likedVectors.reduce((acc, vec) => acc + calculateCosineSimilarity(vec, bookVector), 0) / likedVectors.length;

        bookScores[book._id] = similarityScore;
      }
    });

    const sortedBookIds = Object.keys(bookScores).sort((a, b) => bookScores[b] - bookScores[a]);

    const recommendedBooks = await Book.find({ _id: { $in: sortedBookIds.slice(0, 3) } });

    return recommendedBooks;
  } catch (error) {
    console.error('Error recommending books:', error);
    throw error;
  }
};

module.exports = { recommendBooks };
