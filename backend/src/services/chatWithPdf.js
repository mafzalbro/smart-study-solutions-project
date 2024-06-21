const { extractTextFromPdf } = require('../utils/pdfUtils');
const { generateChatResponse } = require('../utils/chatUtils');

const generatePdf = async (message, pdfUrl, pdfContext) => {
  let pdfText = '';
  if (pdfUrl) {
    pdfText = await extractTextFromPdf(pdfUrl);
  }

  // Ensure pdfContext is parsed as an array if it's a JSON string
  const context = typeof pdfContext === 'string' ? JSON.parse(pdfContext) : pdfContext;

  let response;
  if (pdfText !== '') {
    response = await generateChatResponse(message, [...context, { user_query: `PDF Document Text: ${pdfText}`, model_response: '' }]);
  } else {
    response = await generateChatResponse(message, context);
  }
  
  return response;
};

module.exports = { generatePdf };
