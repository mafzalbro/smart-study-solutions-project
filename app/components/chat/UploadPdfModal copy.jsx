import { useRef, useState } from "react";
import Modal from "../Modal";
import { FaTimes } from "react-icons/fa";
import { AiOutlineClear, AiOutlineLoading } from "react-icons/ai";
import { useAuth } from "@/app/customHooks/AuthContext";
import PdfUploadComponent from "./PDFUploadComponent";
import PageRangeModal from "./PageRangeModal";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import PptxGenJS from "pptxgenjs";
import { read, utils } from "xlsx";
import jsPDF from "jspdf";

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
  const [pdfPages, setPdfPages] = useState(0);
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  // Convert DOCX to PDF
  const convertDocxToPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const { value: text } = await mammoth.extractRawText({ arrayBuffer });
    const pdf = new jsPDF();
    const lines = pdf.splitTextToSize(text, 180);
    lines.forEach((line, index) => {
      if (index > 0 && index % 50 === 0) pdf.addPage(); // Add pages as needed
      pdf.text(10, 10 + (index % 50) * 5, line);
    });
    return pdf;
  };

  // Convert PPTX to PDF
  const convertPptxToPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pptx = new PptxGenJS();
    pptx.load(arrayBuffer);
    const pdf = new jsPDF();
    pptx.slides.forEach((slide, index) => {
      if (index > 0) pdf.addPage();
      slide.objects.forEach((obj) => {
        if (obj.text) pdf.text(10, 10, obj.text);
      });
    });
    return pdf;
  };

  // Convert XLSX to PDF
  const convertXlsxToPdf = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = read(arrayBuffer, { type: "array" });
    const pdf = new jsPDF();
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = utils.sheet_to_json(sheet, { header: 1 });
      jsonData.forEach((row, rowIndex) => {
        if (rowIndex > 0 && rowIndex % 50 === 0) pdf.addPage();
        pdf.text(10, 10 + (rowIndex % 50) * 5, row.join(" "));
      });
    });
    return pdf;
  };

  // Extract text from PDF
  const extractTextFromPdf = async (file, startPage = 1, endPage) => {
    setIsLoading(true);
    setErrorMessage("");
    setWordCountError(false);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let fullText = "";
      let wordCount = 0;
      const totalPages = pdf.numPages;

      endPage = endPage ? Math.min(endPage, totalPages) : totalPages;

      for (let i = startPage; i <= endPage; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + " ";
        wordCount += pageText.split(" ").length;
      }

      if (wordCount > (user?.isMember ? 7000 : 5000)) {
        setWordCountError(true);
        setPdfText("");
      } else if (!fullText) {
        setErrorMessage("This PDF contains no text or may be image-based.");
      } else {
        setPdfText(fullText.trim());
        setPdfPages(totalPages);
      }
    } catch (error) {
      console.error("Error extracting text from PDF:", error);
      setErrorMessage("Failed to extract text from the PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Unified handler for extracting text
  const extractTextFromFile = async (file, startPage, endPage) => {
    let pdfBlob;

    if (file.type === "application/pdf") {
      extractTextFromPdf(file, startPage, endPage);
      return;
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const pdf = await convertDocxToPdf(file);
      pdfBlob = pdf.output("blob");
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      const pdf = await convertPptxToPdf(file);
      pdfBlob = pdf.output("blob");
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const pdf = await convertXlsxToPdf(file);
      pdfBlob = pdf.output("blob");
    } else {
      setErrorMessage("Unsupported file type");
      return;
    }

    const pdfFile = new File([pdfBlob], "converted.pdf", {
      type: "application/pdf",
    });
    extractTextFromPdf(pdfFile, startPage, endPage);
  };

  const handleUpload = () => {
    if (pdfFile) {
      extractTextFromFile(pdfFile);
    } else if (pdfUrl) {
      setErrorMessage("URL upload not supported for conversion.");
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
    setWordCountError(false);
  };

  // Function to handle page range modal
  const openPageRangeModal = () => {
    setShowPageRangeModal(true);
  };

  const handlePageRangeSubmit = (startPage, endPage) => {
    setShowPageRangeModal(false);
    extractTextFromPages(pdfFile, startPage, endPage); // Handle page range extraction
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
            {user?.isMember ? (
              <div className="bg-yellow-100 p-4 rounded-lg text-center text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                <div className="font-semibold text-lg">
                  Dear Partner, we apologize for the inconvenience!
                </div>
                <div className="mt-2 text-md">
                  It seems that this PDF or document exceeds 7000 words. While
                  this may be a bit of a hassle, you can still extract the text
                  page by page for a more tailored experience.
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
