const youtube = require("youtube-search-api");
const nlp = require("compromise");

function extractKeywords(input) {
  // Use NLP to extract nouns and topics as keywords
  const doc = nlp(input);
  const nouns = doc.nouns().out("array"); // Extract nouns
  const terms = doc.topics().out("array"); // Extract topic-like terms
  const keywords = [...new Set([...nouns, ...terms])]; // Remove duplicates

  return keywords.slice(0, 5); // Limit to top 5 keywords for focus
}

async function fetchVideosFromPrompt(prompt) {
  const keywords = extractKeywords(prompt);
  const keywordString = keywords.join(" "); // Combine keywords for search query

  try {
    // Fetch videos from YouTube using extracted keywords
    const result = await youtube.GetListByKeyword(keywordString, false, 10);
    console.log("Videos:", result.items);
    return result.items;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

module.exports = fetchVideosFromPrompt