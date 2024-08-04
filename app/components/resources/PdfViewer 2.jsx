"use client";

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useWindowSize } from '@/app/customHooks/useWindowSize';
import { RxEnterFullScreen, RxExitFullScreen } from 'react-icons/rx';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Set up PDF.js worker globally
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

const PdfViewer = ({ fileUrl, onClose, onFullscreen, isFullscreen }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);
  const { width } = useWindowSize();

  const handleLoadSuccess = ({ numPages }) => {
    console.log('PDF loaded successfully with', numPages, 'pages.');
    setNumPages(numPages);
    setError(null); // Reset error on successful load
  };

  const handleLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setError(error.message); // Set error message on failure
    toast.error(`Error loading PDF: ${error.message}`); // Show toast notification
  };

  const handlePreviousPage = () => {
    setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  };

  const handleNextPage = () => {
    setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-all duration-300 ${
        isFullscreen ? 'w-full h-screen' : 'w-[70vw] h-[70vh]'
      }`}
    >
      <div className="relative w-full h-full text-white dark:bg-neutral-800 rounded-lg shadow-lg overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl bg-accent-600 hover:bg-accent-700 rounded-full p-2"
        >
          <IoClose />
        </button>
        <button
          onClick={onFullscreen}
          className="absolute top-2 right-12 text-white text-xl bg-accent-600 hover:bg-accent-700 rounded-full p-2"
        >
          {isFullscreen ? <RxExitFullScreen /> : <RxEnterFullScreen />}
        </button>
        <div className="p-4 h-full flex flex-col items-center">
          {error ? (
            <div className="text-red-500 mb-4">
              <p>Error loading PDF: {error}</p>
            </div>
          ) : (
            <Document
              file={fileUrl}
              onLoadSuccess={handleLoadSuccess}
              onLoadError={handleLoadError}
              className="w-full"
            >
              <Page pageNumber={pageNumber} width={width * 0.8} />
            </Document>
          )}
          <div className="flex justify-between w-full mt-4">
            <button
              onClick={handlePreviousPage}
              className="bg-accent-600 text-white p-2 rounded-lg hover:bg-accent-700 disabled:opacity-50"
              disabled={pageNumber <= 1}
            >
              Previous
            </button>
            <span className="text-white">
              Page {pageNumber} of {numPages || 0}
            </span>
            <button
              onClick={handleNextPage}
              className="bg-accent-600 text-white p-2 rounded-lg hover:bg-accent-700 disabled:opacity-50"
              disabled={pageNumber >= (numPages || 0)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
