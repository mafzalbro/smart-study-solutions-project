const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAICacheManager, GoogleAIFileManager } = require('@google/generative-ai/server');
const path = require('path');
const fs = require('fs');
const googleCacheMetaData = require('../models/googleCacheMetaData');
require('dotenv').config();

const mediaPath = path.join(__dirname, 'media');
const MIN_TOTAL_TOKENS = 32768; // Minimum token count threshold

// Helper function to estimate token count
const estimateTokenCount = (text) => {
  const averageWordsPer100Tokens = 70; // Adjust this as needed
  const wordCount = text.split(/\s+/).length;
  const tokenCount = (wordCount / averageWordsPer100Tokens) * 100;
  return Math.round(tokenCount);
};

const generateChatResponse = async function* (message, context, apiKey, pdfText, cacheKey) {
  try {

    console.log({cacheKey})
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });

    const history = Array.isArray(context) ? context.map(convo => ([
      { role: 'user', parts: [{ text: convo.user_query }] },
      { role: 'model', parts: [{ text: convo.model_response }] }
    ])).flat() : [];

    history.push({ role: 'user', parts: [{ text: message }] });

    if (pdfText) {
      const cacheManager = new GoogleAICacheManager(apiKey);
      const fileManager = new GoogleAIFileManager(apiKey);

      if (!fs.existsSync(mediaPath)) {
        fs.mkdirSync(mediaPath, { recursive: true });
      }

      const pdfTextPath = path.join(mediaPath, 'pdfText.txt');

      try {
        fs.writeFileSync(pdfTextPath, pdfText);
        console.log(`File written successfully to ${pdfTextPath}`);
      } catch (writeError) {
        console.error(`Failed to write file: ${writeError}`);
        throw writeError;
      }

      const tokenCount = estimateTokenCount(pdfText);
      if (tokenCount < MIN_TOTAL_TOKENS) {
        console.log(`PDF text token count (${tokenCount}) is below the minimum threshold.`);
        return;
      }

      // const cacheKey = generateCacheKey(pdfText);

      let existingCache;
      try {
        existingCache = await googleCacheMetaData.findOne({ key: cacheKey });
      } catch (cacheError) {
        console.error(`Failed to check cache in DB: ${cacheError}`);
        throw cacheError;
      }

      if (existingCache) {
        console.log('Cache hit');
        history.push({
          role: 'user',
          parts: [
            {
              fileData: {
                fileUri: existingCache.fileUri,
                mimeType: existingCache.mimeType,
              },
            },
          ],
        });
      } else {
        console.log('Cache miss');
        let uploadResult;
        try {
          uploadResult = await fileManager.uploadFile(pdfTextPath, {
            mimeType: 'text/plain',
          });
          console.log('File uploaded successfully:', uploadResult);
        } catch (uploadError) {
          console.error(`Failed to upload file: ${uploadError}`);
          throw uploadError;
        }

        let cacheResult;
        try {
          cacheResult = await cacheManager.create({
            // key: cacheKey,
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
            // ttl: 86400 // Time to live in seconds (e.g., 24 hours)
          });
          console.log('Cache created successfully:', cacheResult);
        } catch (cacheError) {
          console.error(`Failed to create cache: ${cacheError}`);
          throw cacheError;
        }

        try {
          await CacheMetadata.create({
            fileUri: uploadResult.file.uri,
            mimeType: uploadResult.file.mimeType,
            cacheResult: cacheResult, // Save cacheResult here
          });
          console.log('Metadata saved to DB');
        } catch (dbError) {
          console.error(`Failed to save metadata to DB: ${dbError}`);
          throw dbError;
        }

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

        try {
          fs.unlinkSync(pdfTextPath);
          console.log(`File deleted successfully from ${pdfTextPath}`);
        } catch (deleteError) {
          console.error(`Failed to delete file: ${deleteError}`);
        }
      }
    }

    const chat = model.startChat({ history });

    const result = await chat.sendMessageStream(message);

    for await (const chunk of result.stream) {
      console.log({ func: chunk.text() });
      console.log({ text: chunk.text });
      yield chunk.text();
    }
  } catch (error) {
    console.error('Error occurred:', error);
    return error;
  }
};

module.exports = { generateChatResponse };
