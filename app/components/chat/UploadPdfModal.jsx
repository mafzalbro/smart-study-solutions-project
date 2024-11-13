import { useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import Modal from "../Modal";
import TextInputField from "./TextInputField";
import PdfUploadComponent from "./PDFUploadComponent";
import { FaTimes } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";

// Set up the worker for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function UploadPdfModal({
  isOpen,
  onClose,
  onUpload,
  pdfUrl,
  setPdfUrl,
  pdfText,
  setPdfText,
}) {
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  // Function to extract text from the PDF
  const extractTextFromPdf = async (file) => {
    setIsLoading(true);
    setErrorMessage("");
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

      fullText = fullText.trim();

      if (!fullText) {
        setErrorMessage("This PDF contains no text or may be image-based.");
      } else {
        setPdfText(fullText);
        // onUpload(fullText);
      }
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      setErrorMessage("Failed to extract text from the PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = () => {
    if (pdfFile) {
      extractTextFromPdf(pdfFile);
    } else if (pdfUrl) {
      // onUpload(pdfUrl);
    }
  };

  const handleFileChange = (e) => {
    setIsUploading(true);
    setPdfFile(e.target.files[0]);
    setPdfUrl(""); // Clear URL if a file is selected
    setPdfText("");
    setErrorMessage("");
    setIsUploading(false);
  };

  const handleUrlChange = (e) => {
    setPdfUrl(e.target.value);
    setPdfFile(null); // Clear file if a URL is entered
    setPdfText("");
    setErrorMessage("");
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
    setPdfText("");
    setErrorMessage("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 flex flex-col gap-4 bg-white rounded-lg shadow-md dark:bg-neutral-800">
        <h2 className="text-lg font-bold text-center">Upload PDF</h2>
        {pdfText && (
          <div className="text-sm text-neutral-700 dark:text-neutral-300 text-center">
            PDF has{" "}
            <span className="text-primary dark:text-secondary mx-1 font-semibold">
              {pdfText.split(" ").length}{" "}
            </span>{" "}
            words
          </div>
        )}
        {pdfText && (
          <div className="text-2xl text-green-600 dark:text-green-400">
            PDF added successfully! Close and start asking your questions...
          </div>
        )}
        {/* Error message for empty or image-only PDFs */}
        {errorMessage && (
          <div className="text-center text-red-600 dark:text-red-400">
            {errorMessage}
          </div>
        )}
        {/* PDF URL Input */}
        <TextInputField
          type="text"
          disabled={!!pdfText || pdfFile}
          placeholder="Enter PDF URL"
          value={pdfUrl}
          onChange={handleUrlChange}
          className="w-full p-2"
        />
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          or
        </p>
        {/* PDF File Upload */}
        <PdfUploadComponent
          disabled={!!pdfUrl}
          pdfFile={pdfFile}
          setPdfFile={setPdfFile}
          fileInputRef={fileInputRef}
          handlePdfUpload={handleFileChange}
          handleRemovePdf={handleRemovePdf}
          isUploading={isUploading}
        />
        {/* Loading Indicator */}
        {isLoading && (
          <p className="text-center text-blue-600">Extracting text...</p>
        )}
        {/* Upload and Cancel Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-6 rounded-lg ring-1 ring-neutral-200 focus:ring-accent-300 dark:ring-neutral-700 dark:focus:ring-accent-800 flex items-center text-sm"
          >
            <FaTimes className="mr-2" /> Close
          </button>
          <button
            onClick={handleUpload}
            disabled={(!pdfUrl && !pdfFile) || isLoading}
            className={`px-6 py-2 rounded-lg text-white focus:outline-none ${
              pdfUrl || pdfFile
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-blue-300 dark:bg-blue-900 opacity-50 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <AiOutlineLoading className="animate-spin-fast" />
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
