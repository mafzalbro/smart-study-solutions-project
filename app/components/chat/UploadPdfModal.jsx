import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import Modal from "../Modal";

// Set up the worker for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function UploadPdfModal({ isOpen, onClose, onUpload }) {
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfText, setPdfText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Function to extract text from the PDF
  const extractTextFromPdf = async (file) => {
    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let fullText = "";

      // Loop through each page and extract text
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + " ";
      }

      setPdfText(fullText.trim());
      onUpload(fullText.trim());
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleUpload = () => {
    if (pdfFile) {
      extractTextFromPdf(pdfFile);
    } else if (pdfUrl) {
      onUpload(pdfUrl);
      onClose();
    }
  };

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
    setPdfUrl(""); // Clear URL if a file is selected
  };

  const handleUrlChange = (e) => {
    setPdfUrl(e.target.value);
    setPdfFile(null); // Clear file if a URL is entered
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-neutral-800">
        <h2 className="text-lg font-bold mb-4 text-center">Upload PDF</h2>

        {/* PDF URL Input */}
        <input
          type="text"
          placeholder="Enter PDF URL"
          value={pdfUrl}
          onChange={handleUrlChange}
          className="w-full p-2 border border-gray-300 rounded-lg dark:bg-neutral-700 dark:text-white mb-4"
        />

        <p className="text-center mb-2 text-sm text-gray-500 dark:text-gray-400">
          or
        </p>

        {/* PDF File Upload */}
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-lg dark:bg-neutral-700 dark:text-white mb-4"
        />

        {/* Loading Indicator */}
        {isLoading && (
          <p className="text-center text-blue-600">Extracting text...</p>
        )}

        {/* Upload and Cancel Buttons */}
        <div className="flex justify-center space-x-2">
          <button
            onClick={handleUpload}
            disabled={(!pdfUrl && !pdfFile) || isLoading}
            className={`px-4 py-2 rounded-lg text-white focus:outline-none ${
              pdfUrl || pdfFile
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Processing..." : "Upload"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 dark:bg-neutral-600 dark:hover:bg-neutral-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
