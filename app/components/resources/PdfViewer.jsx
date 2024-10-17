import React from 'react';

import { version } from 'pdfjs-dist';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin, DefaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css'; // Import toolbar styles
import { IoClose } from 'react-icons/io5';
import { RxEnterFullScreen, RxExitFullScreen } from 'react-icons/rx';
import './PdfViewer.css'; // Import custom CSS for transitions

const PdfViewer = ({ fileUrl, onClose, onFullscreen, isFullscreen }) => {
  // Create instances of the plugins
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const toolbarPluginInstance = toolbarPlugin();

  // Extract the functions needed to customize the toolbar
  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

  // Transform the toolbar to remove specific items
  const transform = (slot) => ({
    ...slot,
    Download: () => <></>,
    DownloadMenuItem: () => <></>,
    EnterFullScreen: () => <></>,
    EnterFullScreenMenuItem: () => <></>,
    Print: () => <></>,
    PrintMenuItem: () => <></>,
    Upload: () => <></>, // Assuming there's an upload slot
    UploadMenuItem: () => <></>, // Assuming there's an upload menu item
    SwitchTheme: () => <></>,
    SwitchThemeMenuItem: () => <></>,
  });

  return (
    <div
      className={`mx-auto fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 pdf-viewer-transition ${
        isFullscreen ? 'w-full h-screen' : 'w-full max-w-4xl h-[60vh]'
      }`}
    >
      <div className="pt-10 md:p-10 relative w-full h-full dark:bg-neutral-800 rounded-lg shadow-lg overflow-auto">
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

        <div className="p-2 md:p-4 h-full overflow-auto">
          <Worker workerUrl={`http://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`}>
            <Viewer
              fileUrl={fileUrl}
              plugins={[
                defaultLayoutPluginInstance,
                toolbarPluginInstance,
              ]}
              renderToolbar={() => <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>}
            />
          </Worker>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
