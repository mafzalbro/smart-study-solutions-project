import { useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import Modal from "../Modal";
import { FaTimes } from "react-icons/fa";
import { AiOutlineClear, AiOutlineLoading } from "react-icons/ai";
import { AiOutlineFileText } from "react-icons/ai"; // For page-wise button
import PdfUploadComponent from "./PDFUploadComponent";
import PageRangeModal from "./PageRangeModal"; // New Modal for page range
import { useAuth } from "@/app/customHooks/AuthContext";

// Set up the worker for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function UploadPdfModal({
  isOpen,
  onClose,
  pdfUrl,
  setPdfUrl,
  pdfText,
  setPdfText,
}) {
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [wordCountError, setWordCountError] = useState(false);
  const [showPageRangeModal, setShowPageRangeModal] = useState(false);
  const [pdfPages, setPdfPages] = useState(0); // Keep track of PDF page count
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  // Function to extract text from the entire PDF
  const extractTextFromPdf = async (file) => {
    setIsLoading(true);
    setErrorMessage("");
    setWordCountError(false);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let fullText = "";
      let wordCount = 0;
      setPdfPages(pdf.numPages); // Set the number of pages for the PDF

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + " ";
        wordCount += pageText.split(" ").length;
      }

      fullText = fullText.trim();

      if (wordCount > 5000) {
        setWordCountError(true);
        setPdfText("");
      } else if (!fullText) {
        setErrorMessage("This PDF contains no text or may be image-based.");
      } else {
        setPdfText(fullText);
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

  // Function to extract text from specific pages (page range)
  const extractTextFromPages = async (file, startPage, endPage) => {
    setIsLoading(true);
    setErrorMessage("");
    setWordCountError(false);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let fullText = "";
      let wordCount = 0;

      // Ensure page range is within bounds
      startPage = Math.max(1, startPage);
      endPage = Math.min(endPage, pdf.numPages);

      for (let i = startPage; i <= endPage; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + " ";
        wordCount += pageText.split(" ").length;
      }

      fullText = fullText.trim();

      if (!fullText) {
        setErrorMessage("This PDF contains no text or may be image-based.");
      } else {
        setPdfText(fullText);
      }

      if (wordCount > 5000) {
        setWordCountError(true);
      }
    } catch (error) {
      console.error("Error extracting text from specific pages:", error);
      setErrorMessage("Failed to extract text from the PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const openPageRangeModal = () => {
    setShowPageRangeModal(true);
  };

  const handlePageRangeSubmit = (startPage, endPage) => {
    setShowPageRangeModal(false);
    // Handle page extraction based on the range
    extractTextFromPages(pdfFile, startPage, endPage);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 flex flex-col gap-6 bg-white rounded-lg shadow-md dark:bg-neutral-800 min-w-xl w-xl max-w-2xl mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-center text-neutral-800 dark:text-neutral-200">
            Upload PDF
          </h2>
          <FaTimes
            className="text-neutral-600 dark:text-neutral-400 cursor-pointer"
            onClick={onClose}
          />
        </div>

        {/* PDF word count and status */}
        {pdfText && (
          <div className="text-center text-sm text-neutral-700 dark:text-neutral-300">
            PDF contains{" "}
            <span className="text-primary dark:text-secondary mx-1 font-semibold">
              {pdfText.split(" ").length} words
            </span>
          </div>
        )}

        {pdfText && !wordCountError && (
          <div className="text-lg text-green-600 dark:text-green-400 text-center">
            PDF uploaded successfully! Start asking your questions...
          </div>
        )}

        {wordCountError && (
          <div className="text-center text-red-600 dark:text-red-400">
            {!user?.isMember ? (
              <div className="bg-yellow-100 p-4 rounded-lg text-center text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                <div className="font-semibold text-lg">
                  Dear Partner, we apologize for the inconvenience!
                </div>
                <div className="mt-2 text-md">
                  It seems that this PDF exceeds 5000 words. While this may be a
                  bit of a hassle, you can still extract the text page by page
                  for a more tailored experience.
                </div>
                <div className="mt-4">
                  <button
                    onClick={openPageRangeModal}
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 px-6"
                  >
                    Extract Text Page-Wise
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-red-100 p-4 rounded-lg text-center text-red-800 dark:bg-red-900 dark:text-red-200">
                <div className="font-semibold text-lg">
                  Oops! This PDF exceeds 5000 words.
                </div>
                <div className="mt-2 text-md">
                  Don’t worry, you can still extract the text page by page.
                  Simply choose the page range and we’ll extract the content for
                  you.
                </div>
                <div className="mt-4">
                  <button
                    onClick={openPageRangeModal}
                    className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 px-6"
                  >
                    Extract Text Page-Wise
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {errorMessage && (
          <div className="text-center text-red-600 dark:text-red-400">
            {errorMessage}
          </div>
        )}

        {/* PDF Upload Section */}
        <PdfUploadComponent
          disabled={!!pdfText}
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

        {pdfText && !wordCountError && (
          <>
            <button
              onClick={() => setPdfText("")}
              className="px-4 py-2 rounded-lg text-secondary flex justify-center items-center bg-gray-600 hover:bg-gray-500"
            >
              <AiOutlineClear className="mr-2" /> Clear
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-secondary flex justify-center items-center bg-red-600 hover:bg-red-500"
            >
              <FaTimes className="mr-2" /> Close
            </button>
          </>
        )}

        {/* Upload Button (Only visible if PDF is not uploaded yet) */}
        {!pdfText && !wordCountError && (
          <div className="flex justify-between mt-6">
            <button
              onClick={handleUpload}
              disabled={(!pdfFile && !pdfUrl) || isLoading || wordCountError}
              className={`px-6 py-2 rounded-lg text-white focus:outline-none ${
                pdfFile || pdfUrl
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
        )}
      </div>

      {/* Page Range Modal */}
      {showPageRangeModal && (
        <PageRangeModal
          pdfPages={pdfPages}
          onSubmit={handlePageRangeSubmit}
          onClose={() => setShowPageRangeModal(false)}
        />
      )}
    </Modal>
  );
}
