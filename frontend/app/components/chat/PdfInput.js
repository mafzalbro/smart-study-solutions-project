'use client';

export default function PdfInput({ pdfUrl, setPdfUrl }) {
  return (
    <input
      type="text"
      value={pdfUrl}
      onChange={(e) => setPdfUrl(e.target.value)}
      placeholder="PDF URL"
      className="flex-grow p-2 bg-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-orange-600 h-12"
    />
  );
}
