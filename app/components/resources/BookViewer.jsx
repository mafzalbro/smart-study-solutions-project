// components/BookViewer.js
import { useEffect, useState, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import { GrClose, GrNext, GrPrevious } from 'react-icons/gr';

const BookViewer = ({ pdfUrl, onClose }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const flipBook = useRef(null);

  useEffect(() => {
    const fetchAndRenderPages = async () => {
      try {
        const response = await fetch(pdfUrl);
        const arrayBuffer = await response.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const totalPages = pdf.numPages;

        const newPages = [];
        for (let i = 1; i <= totalPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 }); // Adjust scale for higher resolution
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport }).promise;
          newPages.push(canvas.toDataURL('image/png'));
        }

        setPages(newPages);
      } catch (error) {
        console.error('Error loading PDF:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndRenderPages();
  }, [pdfUrl]);

  const goToPreviousPage = () => {
    if (flipBook.current) {
      flipBook.current.pageFlip().flipPrev();
      setCurrentPage(flipBook.current.pageFlip().getCurrentPageIndex());
    }
  };

  const goToNextPage = () => {
    if (flipBook.current) {
      flipBook.current.pageFlip().flipNext();
      setCurrentPage(flipBook.current.pageFlip().getCurrentPageIndex());
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4 md:w-[50vw] min-h-screen overflow-hidden">
      <button onClick={onClose} className='z-10 absolute right-10 top-10 text-secondary hover:text-accent-200'><GrClose /></button>
      {loading && <p>Loading...</p>}
      {!loading && pages.length > 0 && (
        <>
          <HTMLFlipBook
            ref={flipBook}
            width={800} // Set the width of the flip book
            height={700} // Set the height of the flip book
            className="shadow-xl"
            style={{ position: 'relative', height: 'auto', width: '100%', top: 'auto', left: 'auto', right: 0 }}
            onFlip={(e) => setCurrentPage(e.data)}
          > 
            {pages.map((page, index) => (
              <div key={index} className="flex items-center justify-center w-full h-full">
                <img
                  src={page}
                  alt={`Page ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </HTMLFlipBook>
          <div className="flex space-x-4 mt-4 fixed bottom-20">
            <button
              onClick={goToPreviousPage}
              className={`px-4 py-2 text-secondary hover:text-accent-200 rounded-full shadow ${currentPage === 0 && 'hidden'}`}
              disabled={currentPage === 0}
            >
              <GrPrevious />
            </button>
            <button
              onClick={goToNextPage}
              className={`px-4 py-2 text-secondary hover:text-accent-200 rounded-full shadow ${currentPage === pages.length - 1 && 'hidden'}`}
              disabled={currentPage === pages.length - 1}
            >
              <GrNext />
            </button>
          </div>
          <div className="mt-4 fixed bottom-10 text-secondary">
            <p className="text-center">
              Page {currentPage + 1} of {pages.length}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default BookViewer;
