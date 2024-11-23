import * as pdfjsLib from "pdfjs-dist/build/pdf";
import mammoth from "mammoth";

// Set up the worker for pdfjs (for PDF extraction)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Function to extract text from PDF
const extractTextFromPdf = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(" ");
    fullText += pageText + " ";
  }

  return fullText.trim();
};

// Function to extract text from DOCX using Mammoth.js
const extractTextFromDocx = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const { value: text } = await mammoth.extractRawText({ arrayBuffer });
  return text.trim();
};

// Function to handle text extraction for any file type
export const extractTextFromFile = async (file) => {
  const fileType = file.type;

  if (fileType === "application/pdf") {
    return await extractTextFromPdf(file);
  } else if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return await extractTextFromDocx(file);
  } else if (fileType === "text/plain") {
    // For TXT files, we can directly read the content
    const text = await file.text();
    return text.trim();
  } else {
    throw new Error("Unsupported file type");
  }
};
