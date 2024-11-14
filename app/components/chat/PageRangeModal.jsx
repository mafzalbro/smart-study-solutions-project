import { useState } from "react";
import Slider from "rc-slider"; // Range slider for page selection
import "rc-slider/assets/index.css";
import { AiOutlineArrowRight } from "react-icons/ai";
import Modal from "../Modal";

export default function PageRangeModal({ pdfPages, onSubmit, onClose }) {
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(pdfPages);
  const [rangeValue, setRangeValue] = useState([startPage, endPage]);

  const handleRangeChange = (value) => {
    setStartPage(value[0]);
    setEndPage(value[1]);
    setRangeValue(value);
  };

  const handleInputChange = (e, type) => {
    if (type === "start") {
      setStartPage(Math.min(e.target.value, endPage));
    } else if (type === "end") {
      setEndPage(Math.max(e.target.value, startPage));
    }
  };

  const handleSubmit = () => {
    onSubmit(startPage, endPage);
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="p-6 flex flex-col gap-6 bg-white rounded-lg shadow-md dark:bg-neutral-800 max-w-xl mx-auto">
        <h2 className="text-xl font-semibold text-center text-neutral-800 dark:text-neutral-200">
          Extract Text Page-Wise
        </h2>
        <p className="text-center text-sm text-neutral-700 dark:text-neutral-300 mb-4">
          Select a range of pages to extract text
        </p>

        {/* Page Range Slider */}
        <div className="flex flex-col items-center">
          <Slider
            range
            min={1}
            max={pdfPages}
            value={rangeValue}
            onChange={handleRangeChange}
            step={1}
            marks={{ 1: "1", [pdfPages]: `${pdfPages}` }}
          />
          <div className="flex justify-between mt-4 w-full px-4">
            <input
              type="number"
              value={startPage}
              min={1}
              max={pdfPages}
              onChange={(e) => handleInputChange(e, "start")}
              className="w-1/3 p-2 border rounded-md dark:bg-neutral-700 dark:text-neutral-100"
            />
            <span className="text-xl mx-4 mt-2 text-neutral-600 dark:text-neutral-400">
              to
            </span>
            <input
              type="number"
              value={endPage}
              min={startPage}
              max={pdfPages}
              onChange={(e) => handleInputChange(e, "end")}
              className="w-1/3 p-2 border rounded-md dark:bg-neutral-700 dark:text-neutral-100"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-neutral-600 dark:text-neutral-300 dark:hover:text-neutral-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
          >
            <AiOutlineArrowRight className="mr-2" />
            Extract
          </button>
        </div>
      </div>
    </Modal>
  );
}
