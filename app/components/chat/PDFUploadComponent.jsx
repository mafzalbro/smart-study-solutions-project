import React, { useState } from "react";
import { MdOutlineCloudUpload, MdDelete } from "react-icons/md";

const PdfUploadComponent = ({
  pdfFile,
  setPdfFile,
  disabled,
  fileInputRef,
  handlePdfUpload,
  handleRemovePdf,
  isUploading,
}) => {
  // Handle PDF file upload with loading state
  const handleFileChange = async (e) => {
    // Call the provided handlePdfUpload method
    await handlePdfUpload(e);
  };

  return (
    <div>
      <input
        type="file"
        disabled={disabled || isUploading}
        accept="application/*"
        onChange={handleFileChange}
        className="hidden disabled:cursor-not-allowed"
        id="pdfInput"
        ref={fileInputRef} // Attach the ref here
      />
      <label
        htmlFor="pdfInput"
        className={`flex items-center gap-4 w-full mt-1 py-4 px-4 border border-neutral-600 rounded-lg cursor-pointer disabled:cursor-not-allowed focus:ring-2 focus:ring-accent-600 outline-none bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 ${
          disabled || isUploading
            ? "opacity-50 cursor-not-allowed"
            : "opacity-100 cursor-pointer"
        }`}
      >
        {isUploading ? (
          <div className="spinner-border text-accent-600" role="status">
            <span className="sr-only">Uploading...</span>
          </div>
        ) : (
          <MdOutlineCloudUpload className="text-accent-600" />
        )}
        <span>{isUploading ? "Uploading..." : "Upload PDF"}</span>
      </label>

      {pdfFile && !isUploading && (
        <div className="relative mt-4">
          <div>
            <p className="font-light text-sm">{pdfFile.name}</p>
          </div>
          <button
            type="button"
            onClick={handleRemovePdf}
            className="absolute top-2 right-2 p-2 -mt-2 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <MdDelete />
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfUploadComponent;
