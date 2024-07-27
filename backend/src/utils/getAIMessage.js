const { GoogleGenerativeAI } = require("@google/generative-ai");


async function getAIMessage(apiKey, prompt) {
  try{

    // Access your API key as an environment variable (see "Set up your API key" above)
    const genAI = new GoogleGenerativeAI(apiKey);
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    return response
  } catch (error){
    return "try test again or add correct api key"
  }
}

module.exports = { getAIMessage }