// GeneralExportButton.js

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { LuFileJson } from "react-icons/lu";

export default function GeneralExportButton({ resource, count, requestData }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    setIsLoading(true);
    toast.info(`Preparing to export for ${count} ${resource} items...`);

    try {
      const data = await requestData(resource, count);
      const blob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resource}_data.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`${resource} data exported successfully!`);
    } catch (error) {
      toast.error(`Failed to export ${resource} data. Please try again.`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleExport}
        className="flex items-center space-x-2 bg-blue-500 rounded-full text-white px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        disabled={isLoading}
      >
        {isLoading ? (
          <ClipLoader size={20} color="#fff" />
        ) : (
          <LuFileJson className="h-5 w-5" />
        )}
        <span>{isLoading ? "Exporting..." : `Export`}</span>
      </button>
      <ToastContainer />
    </div>
  );
}
