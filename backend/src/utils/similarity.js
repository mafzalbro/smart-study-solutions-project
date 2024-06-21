const calculateCosineSimilarity = (vec1, vec2) => {
    const dotProduct = vec1.reduce((acc, val, idx) => acc + val * vec2[idx], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));
  
    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }
  
    return dotProduct / (magnitude1 * magnitude2);
  };
  
  const convertToVector = (book, allGenres, allTags) => {
    const genreVector = allGenres.map(genre => (book.genre === genre ? 1 : 0));
    const tagVector = allTags.map(tag => (book.tags.includes(tag) ? 1 : 0));
    return [...genreVector, ...tagVector];
  };
  
  module.exports = { calculateCosineSimilarity, convertToVector };
  