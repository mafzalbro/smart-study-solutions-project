const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

const generateChatResponse = async function* (message, context) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Ensure context is an array
    const history = Array.isArray(context) ? context.map(convo => ([
      { role: 'user', parts: [{ text: convo.user_query }] },
      { role: 'model', parts: [{ text: convo.model_response }] }
    ])).flat() : [];

    // Add the latest message to the history
    history.push({ role: 'user', parts: [{ text: message }] });

    // console.log(history);

    // Initialize the chat session with the complete history
    const chat = model.startChat({ history });

    // Send the message using streaming
    const result = await chat.sendMessageStream(message);

    // Yield each chunk of text from the response stream
    for await (const chunk of result.stream) {
      yield chunk.text();
    }
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw new Error('An error occurred while processing your request.');
  }
};

module.exports = { generateChatResponse };
