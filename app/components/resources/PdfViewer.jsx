// components/PdfViewer.js
import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { IoClose } from 'react-icons/io5';
import { RxEnterFullScreen, RxExitFullScreen } from 'react-icons/rx';

const PdfViewer = ({ fileUrl, onClose, onFullscreen, isFullscreen, version = '3.11.174' }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-all duration-300 ${
        isFullscreen ? 'w-screen h-screen' : 'w-full max-w-4xl h-[46vh]'
      }`}
    >
      <div className="p-10 relative w-full h-full dark:bg-neutral-800 rounded-lg shadow-lg overflow-auto">
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


        <div className="p-4 h-full overflow-auto">
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`}>
            {/* <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} /> */}
            <Viewer fileUrl={fileUrl} />
          </Worker>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
