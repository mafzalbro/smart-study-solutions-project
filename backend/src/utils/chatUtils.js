const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAICacheManager, GoogleAIFileManager } = require('@google/generative-ai/server');
const path = require('path');
require('dotenv').config();

const mediaPath = path.join(__dirname, 'media');

const generateChatResponse = async function* (message, context, apiKey, pdfText) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });

    // Ensure context is an array
    const history = Array.isArray(context) ? context.map(convo => ([
      { role: 'user', parts: [{ text: convo.user_query }] },
      { role: 'model', parts: [{ text: convo.model_response }] }
    ])).flat() : [];

    // Add the latest message to the history
    history.push({ role: 'user', parts: [{ text: message }] });

    if (pdfText) {
      const cacheManager = new GoogleAICacheManager(apiKey);
      const fileManager = new GoogleAIFileManager(apiKey);

      // Save PDF text to a file
      const pdfTextPath = `${mediaPath}/pdfText.txt`;
      require('fs').writeFileSync(pdfTextPath, pdfText);

      // Upload the PDF text
      const uploadResult = await fileManager.uploadFile(pdfTextPath, {
        mimeType: 'text/plain',
      });

      // Create cache with the PDF content
      const cacheResult = await cacheManager.create({
        model: 'models/gemini-1.5-flash-001',
        contents: [
          {
            role: 'user',
            parts: [
              {
                fileData: {
                  fileUri: uploadResult.file.uri,
                  mimeType: uploadResult.file.mimeType,
                },
              },
            ],
          },
        ],
      });

      // Add the cached content to the history
      history.push({
        role: 'user',
        parts: [
          {
            fileData: {
              fileUri: uploadResult.file.uri,
              mimeType: uploadResult.file.mimeType,
            },
          },
        ],
      });

      // Clean up the cache after use (commented out for testing purposes)
      // await cacheManager.delete(cacheResult.name);
    }

    // Initialize the chat session with the complete history
    const chat = model.startChat({ history });

    // Send the message using streaming
    const result = await chat.sendMessageStream(message);

    // Yield each chunk of text from the response stream
    for await (const chunk of result.stream) {
      yield chunk.text;
    }
  } catch (error) {
    return error;
  }
};

module.exports = { generateChatResponse };
