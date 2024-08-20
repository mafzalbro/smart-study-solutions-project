// utils/pdfUtils.js
const pdf = require('pdf-parse');
// const { createWorker } = require('tesseract.js');
// const fetch = require('node-fetch');
// const { writeFileSync, unlinkSync } = require('fs');
// const { join } = require('path');
const pdfLib = require('pdf-lib');

// Create a Tesseract.js worker instance
// const worker = createWorker();

const extractTextFromPdf = async (pdfUrl) => {
  try {
    const response = await fetch(pdfUrl);
    const buffer = await response.arrayBuffer();

    // Attempt to extract text directly from PDF
    const data = await pdf(buffer);
    let text = data.text.trim();
    if (text) {
      return text; // Return directly if text is available
    }

    // If no text found, use OCR
    // const pdfDoc = await pdfLib.PDFDocument.load(buffer);
    // const pages = pdfDoc.getPages();

    // text = '';
    
    // // Iterate over all pages and perform OCR on images
    // for (const page of pages) {
    //   const { width, height } = page.getSize();
    //   const { base64 } = await page.render({ width, height });
    //   const imageBuffer = Buffer.from(base64, 'base64');

    //   // Save the image to a temporary file
    //   const tempImagePath = join(__dirname, 'temp-image.png');
    //   writeFileSync(tempImagePath, imageBuffer);

    //   // Perform OCR on the image
    //   await worker.load();
    //   await worker.loadLanguage('eng');
    //   await worker.initialize('eng');
    //   const { data: { text: ocrText } } = await worker.recognize(tempImagePath);
    //   text += ocrText;

    //   // Clean up temporary image file
    //   unlinkSync(tempImagePath);
    // }

    // await worker.terminate();

    return text.trim() || ''; // Return empty string if no text is extracted
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return ''; // Return empty string in case of error
  }
};

module.exports = { extractTextFromPdf };
