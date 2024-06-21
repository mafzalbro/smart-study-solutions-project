require('dotenv').config();
const API_KEY = process.env.GEMINI_API_KEY; // API key
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const FormData = require('form-data');

const genAI = new GoogleGenerativeAI(API_KEY);

// Converts a remote PDF file to a GoogleGenerativeAI.Part object.
async function urlToGenerativePart(url) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const pdfBuffer = Buffer.from(response.data, 'binary');
    return {
      inlineData: {
        data: pdfBuffer.toString('base64'),
        mimeType: 'application/pdf',
      },
    };
  } catch (error) {
    console.error('Error fetching or converting PDF:', error.message);
    throw error;
  }
}

// Function to request AI approval for a PDF resource
async function requestAIApproval(urls) {
  const results = [];
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      const pdfPart = await urlToGenerativePart(url);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = 'Please review the content and provide your approval.';
      const result = await model.generateContent([prompt, pdfPart]);
      const response = await result.response;
      const text = await response.text();

      // Extract AI approval, reason, and categories using regular expressions
      const ai_approved = /approved/i.test(text);
      const reasonMatch = /reason:\s*(.*)/i.exec(text);
      const reason = reasonMatch ? reasonMatch[1] : '';
      const categoriesMatch = /categories:\s*(.*)/i.exec(text);
      const categories = categoriesMatch ? categoriesMatch[1] : '';

      results.push({ ai_approved, reason, categories });
    } catch (error) {
      console.error(`Error processing PDF at ${url}:`, error.message);
      results.push({ error: `Failed to process PDF at ${url}` });
    }
  }
  return results;
}

module.exports = { requestAIApproval };
