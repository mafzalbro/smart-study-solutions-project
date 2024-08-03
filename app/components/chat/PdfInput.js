'use client';

import TextInputField from '@/app/components/TextInputField';

export default function PdfInput({ pdfUrl, setPdfUrl }) {
  return (
    <TextInputField
      type="text"
      value={pdfUrl}
      onChange={(e) => setPdfUrl(e.target.value)}
      placeholder="PDF URL"
      className="dark:bg-neutral-700 dark:text-primary dark:focus:ring-accent-600"
      noMargin
      padding='p-3'
    />
  );
}
