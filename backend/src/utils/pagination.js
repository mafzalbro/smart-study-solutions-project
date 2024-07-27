const paginateResults = async (query, page, limit) => {
  const totalResults = await query.clone().countDocuments(); // Use clone to count without affecting the main query
  const results = await query.skip((page - 1) * limit).limit(limit);
  return {
    totalResults,
    data: results
  };
};


const paginateResultsForArray = (array, page, limit) => {
  const totalResults = array.length;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = array.slice(startIndex, endIndex);
  return {
    totalResults,
    data: results
  };
};



module.exports = { paginateResults, paginateResultsForArray }