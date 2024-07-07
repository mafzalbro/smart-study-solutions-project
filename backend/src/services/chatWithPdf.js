const { extractTextFromPdf } = require('../utils/pdfUtils');
const { generateChatResponse } = require('../utils/chatUtils');

const generatePdf = async (message, pdfUrl, pdfContext) => {
  try {
    let pdfText = '';
    if (pdfUrl) {
      pdfText = await extractTextFromPdf(pdfUrl);
    }

    // Parse pdfContext if it's a string
    const context = typeof pdfContext === 'string' ? JSON.parse(pdfContext) : pdfContext || [];

    let response;
    // If pdfText exists, include it directly in the context
    if (pdfText !== '') {
      context.push({ user_query: `${message} PDF Document Text: ${pdfText}`, model_response: '' });
      response = await generateChatResponse(context);
    } else{
      response = await generateChatResponse(message, context);
    }
    
    // Generate the chat response with the combined context

    return response;
  } catch (error) {
    console.error('Error generating PDF or chat response:', error);
    throw error; // or handle the error as appropriate
  }
};

module.exports = { generatePdf };
