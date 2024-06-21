// utils/pdfUtils.js
const pdf = require('pdf-parse');

const extractTextFromPdf = async (pdfUrl) => {
  const response = await fetch(pdfUrl);
  const buffer = await response.arrayBuffer();
  const data = await pdf(buffer);
  return data.text;
};

module.exports = { extractTextFromPdf };
